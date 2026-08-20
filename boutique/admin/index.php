<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
$pageTitle = 'Overview';
$activeNav = 'dashboard';
$period = $_GET['period'] ?? 'month';
$stats = dashboard_stats($period);
$pdo = db();
$cfg = settings();
$user = current_user();

// Previous period comparison (rough: prior same-length window)
[$from, $to] = period_sql_bounds($period);
$fromTs = strtotime($from);
$toTs = strtotime($to);
$len = max(86400, $toTs - $fromTs);
$prevTo = date('Y-m-d H:i:s', $fromTs - 1);
$prevFrom = date('Y-m-d H:i:s', $fromTs - $len);
$st = $pdo->prepare("SELECT COUNT(*) FROM orders WHERE created_at BETWEEN ? AND ? AND status!='cancelled'");
$st->execute([$prevFrom, $prevTo]);
$prevOrders = (int)$st->fetchColumn();
$st = $pdo->prepare("SELECT COALESCE(SUM(total),0) FROM orders WHERE payment_status IN ('paid','partial') AND created_at BETWEEN ? AND ? AND status!='cancelled'");
$st->execute([$prevFrom, $prevTo]);
$prevRevenue = (float)$st->fetchColumn();

$ordersDelta = pct_change((float)$stats['orders_period'], (float)$prevOrders);
$revenueDelta = pct_change((float)$stats['revenue_period'], (float)$prevRevenue);

$lowStock = $pdo->query("
  SELECT i.id, i.sku, i.name, i.min_stock, i.unit,
         COALESCE(SUM(inv.qty),0) AS qty
  FROM items i
  LEFT JOIN inventory inv ON inv.item_id = i.id
  WHERE i.is_active = 1
  GROUP BY i.id, i.sku, i.name, i.min_stock, i.unit
  HAVING COALESCE(SUM(inv.qty),0) < i.min_stock
  ORDER BY qty ASC
  LIMIT 6
")->fetchAll();

$recentOrders = module_enabled('ecommerce')
  ? $pdo->query("
      SELECT o.*, c.name AS customer_name,
        (SELECT GROUP_CONCAT(DISTINCT i.item_type SEPARATOR '/') FROM order_items oi JOIN items i ON i.id=oi.item_id WHERE oi.order_id=o.id) AS cats,
        (SELECT COALESCE(SUM(oi.qty),0) FROM order_items oi WHERE oi.order_id=o.id) AS item_count
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      ORDER BY o.created_at DESC
      LIMIT 10
    ")->fetchAll()
  : [];

// Monthly revenue chart (calendar year)
$year = (int)date('Y');
$monthly = array_fill(1, 12, 0.0);
if (module_enabled('ecommerce')) {
    $rows = $pdo->query("
      SELECT MONTH(created_at) AS m, COALESCE(SUM(total),0) AS rev
      FROM orders
      WHERE YEAR(created_at)=$year AND status!='cancelled' AND payment_status IN ('paid','partial','unpaid')
      GROUP BY MONTH(created_at)
    ")->fetchAll();
    foreach ($rows as $r) $monthly[(int)$r['m']] = (float)$r['rev'];
}
$maxMonth = max(1, ...array_values($monthly));
$hotMonth = (int)array_search(max($monthly), $monthly, true);
$months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
$progress = (float)$stats['sales_progress'];
$pendingOrders = module_enabled('ecommerce') ? (int)($stats['pending_orders'] ?? 0) : 0;

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="dash-head">
  <div class="greet">
    <h2>Welcome back, <?= e(explode(' ', $user['name'] ?? 'there')[0]) ?>!</h2>
    <p><?= e(date('l, j F Y')) ?> · <?= e($stats['period_label']) ?> overview · All amounts in INR</p>
  </div>
  <div class="period-pills">
    <?php foreach (['today'=>'Daily','week'=>'Weekly','month'=>'Monthly','quarter'=>'Quarterly','year'=>'Yearly'] as $k=>$lab): ?>
      <a href="?period=<?= e($k) ?>" class="<?= $period===$k?'active':'' ?>"><?= e($lab) ?></a>
    <?php endforeach; ?>
    <?php if (module_enabled('reports')): ?>
      <a class="btn btn-outline btn-sm" href="<?= e(url('admin/reports.php')) ?>">Export / Reports</a>
    <?php endif; ?>
  </div>
</div>

<?php if ($pendingOrders > 0): ?>
  <div class="flash flash-info" style="margin:0 0 1rem">
    <strong><?= $pendingOrders ?> pending shop order<?= $pendingOrders > 1 ? 's' : '' ?></strong> —
    <a href="<?= e(url('admin/orders.php?filter=pending')) ?>" style="text-decoration:underline">Open Orders</a>
  </div>
<?php endif; ?>

<div class="grid grid-4" style="margin-bottom:1.25rem">
  <div class="stat-card">
    <div class="stat-top">
      <div class="label">Total Orders</div>
      <span class="stat-ico">OR</span>
    </div>
    <div class="value"><?= number_format((int)$stats['orders_period']) ?></div>
    <div class="hint">
      <span class="delta <?= $ordersDelta>=0?'up':'down' ?>"><?= $ordersDelta>=0?'+':'' ?><?= number_format($ordersDelta,1) ?>%</span>
      vs prior period
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-top">
      <div class="label">Total Customers</div>
      <span class="stat-ico green">CU</span>
    </div>
    <div class="value"><?= number_format((int)$stats['customers']) ?></div>
    <div class="hint"><?= (int)$stats['buyers_period'] ?> buyers this period</div>
  </div>
  <div class="stat-card">
    <div class="stat-top">
      <div class="label">Total Revenue</div>
      <span class="stat-ico green">₹</span>
    </div>
    <div class="value"><?= e(money($stats['revenue_period'])) ?></div>
    <div class="hint">
      <span class="delta <?= $revenueDelta>=0?'up':'down' ?>"><?= $revenueDelta>=0?'+':'' ?><?= number_format($revenueDelta,1) ?>%</span>
      vs prior period
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-top">
      <div class="label">Returning Buyers</div>
      <span class="stat-ico grey">RB</span>
    </div>
    <div class="value"><?= number_format((int)$stats['returning_buyers']) ?></div>
    <div class="hint"><?= (int)$stats['low_stock'] ?> low-stock SKUs · <?= (int)$stats['raw_items'] ?> raw / <?= (int)$stats['finished_items'] ?> finished</div>
  </div>
</div>

<div class="grid grid-dash" style="margin-bottom:1.25rem">
  <div class="panel">
    <div class="panel-head">
      <h2>Revenue insights · <?= e((string)$year) ?></h2>
      <div class="chart-legend">
        <span>Earning</span>
        <span class="sales">Sales</span>
        <span class="refunds">Refunds</span>
      </div>
    </div>
    <div class="panel-body">
      <div class="bar-chart" id="revenueChart">
        <?php for ($m = 1; $m <= 12; $m++):
          $h = ($monthly[$m] / $maxMonth) * 100;
          $isHot = $m === $hotMonth && $monthly[$m] > 0;
        ?>
          <div class="bar-col" title="<?= e($months[$m].': '.money($monthly[$m])) ?>">
            <div class="bar <?= $isHot?'hot':'' ?>" style="height:<?= max(4, $h) ?>%"></div>
            <span class="bar-label"><?= e($months[$m]) ?></span>
          </div>
        <?php endfor; ?>
      </div>
      <?php if ($monthly[$hotMonth] > 0): ?>
        <p style="margin-top:.85rem;font-size:.85rem;color:var(--muted)">Peak month <strong style="color:var(--ink)"><?= e($months[$hotMonth]) ?></strong> — <?= e(money($monthly[$hotMonth])) ?></p>
      <?php else: ?>
        <p style="margin-top:.85rem;font-size:.85rem;color:var(--muted)">No sales recorded for <?= e((string)$year) ?> yet. Place a shop order or create a counter order to populate this chart.</p>
      <?php endif; ?>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head"><h2>Sales overview</h2></div>
    <div class="panel-body">
      <div class="gauge-wrap">
        <div class="gauge">
          <?php
            $pct = max(0, min(100, $progress));
            $r = 80; $cx = 100; $cy = 100;
            $circ = pi() * $r;
            $dash = ($pct / 100) * $circ;
          ?>
          <svg viewBox="0 0 200 110" aria-hidden="true">
            <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--line)" stroke-width="14" stroke-linecap="round"/>
            <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--chart-bar)" stroke-width="14" stroke-linecap="round"
              stroke-dasharray="<?= $dash ?> <?= $circ ?>" />
          </svg>
          <div class="gauge-value">
            <strong><?= number_format($pct, 1) ?>%</strong>
            <small>Sales growth vs target</small>
          </div>
        </div>
        <div class="target-row">
          <div class="t-box">
            <small>Sales (period)</small>
            <strong><?= e(money($stats['revenue_period'])) ?></strong>
            <div class="progress-track"><div class="progress-fill" style="width:<?= $pct ?>%"></div></div>
          </div>
          <div class="t-box">
            <small>Target</small>
            <strong><?= e(money($stats['sales_target'])) ?></strong>
            <div class="progress-track"><div class="progress-fill" style="width:100%;opacity:.25"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="grid grid-2" style="margin-bottom:1.25rem">
  <div class="panel">
    <div class="panel-head">
      <h2>Low stock alerts</h2>
      <?php if (module_enabled('inventory')): ?>
        <a class="btn btn-outline btn-sm" href="<?= e(url('admin/inventory.php')) ?>">Inventory</a>
      <?php endif; ?>
    </div>
    <div class="table-wrap">
      <?php if (!$lowStock): ?>
        <div class="empty"><h3>All good</h3><p>No items below minimum stock.</p></div>
      <?php else: ?>
        <table class="data">
          <thead><tr><th>SKU</th><th>Item</th><th>Qty</th><th>Min</th></tr></thead>
          <tbody>
          <?php foreach ($lowStock as $r): ?>
            <tr>
              <td><?= e($r['sku']) ?></td>
              <td><?= e($r['name']) ?></td>
              <td><span class="badge badge-warn"><?= e(number_format((float)$r['qty'], 1)) ?> <?= e($r['unit']) ?></span></td>
              <td><?= e(number_format((float)$r['min_stock'], 1)) ?></td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head">
      <h2>Quick actions</h2>
    </div>
    <div class="panel-body" style="display:grid;gap:.65rem">
      <?php if (module_enabled('items')): ?>
        <a class="btn btn-outline" href="<?= e(url('admin/items.php?type=raw')) ?>">+ Raw / material item</a>
        <a class="btn btn-outline" href="<?= e(url('admin/items.php?type=finished')) ?>">+ Finished product</a>
      <?php endif; ?>
      <?php if (module_enabled('vendors')): ?>
        <a class="btn btn-outline" href="<?= e(url('admin/purchases.php')) ?>">New purchase order</a>
      <?php endif; ?>
      <?php if (module_enabled('costing')): ?>
        <a class="btn btn-outline" href="<?= e(url('admin/costing.php')) ?>">Build BOM / costing</a>
      <?php endif; ?>
      <?php if (module_enabled('ecommerce')): ?>
        <a class="btn btn-primary" href="<?= e(url('admin/orders.php')) ?>">Create / manage orders</a>
      <?php endif; ?>
    </div>
  </div>
</div>

<?php if (module_enabled('ecommerce')): ?>
<div class="panel">
  <div class="panel-head">
    <h2>Recent sales</h2>
    <div class="toolbar" style="margin:0">
      <input type="search" id="tableSearch" class="filter-input" placeholder="Search orders…" style="min-width:180px;border-radius:999px">
      <a class="btn btn-outline btn-sm" href="<?= e(url('admin/orders.php')) ?>">All orders</a>
    </div>
  </div>
  <div class="table-wrap">
    <?php if (!$recentOrders): ?>
      <div class="empty"><p>No orders yet. They appear here as soon as a customer places an order on the shop.</p></div>
    <?php else: ?>
    <table class="data">
      <thead><tr><th>Order Id</th><th>Date</th><th>Customer</th><th>Category</th><th>Status</th><th>Items</th><th>Total</th><th></th></tr></thead>
      <tbody>
      <?php foreach ($recentOrders as $o):
        $stClass = $o['status']==='pending'?'warn':($o['status']==='delivered'||$o['status']==='confirmed'?'ok':($o['status']==='cancelled'?'danger':'info'));
      ?>
        <tr>
          <td><?= e($o['order_number']) ?></td>
          <td><?= e(date('j M Y', strtotime($o['created_at']))) ?></td>
          <td><?= e($o['customer_name'] ?: 'Guest') ?></td>
          <td><?= e($o['cats'] ?: '—') ?></td>
          <td><span class="badge badge-<?= $stClass ?>"><?= e(ucfirst($o['status'])) ?></span></td>
          <td><?= (int)$o['item_count'] ?> Items</td>
          <td><?= e(money($o['total'])) ?></td>
          <td><a class="btn btn-outline btn-sm" href="<?= e(url('admin/orders.php?id='.(int)$o['id'])) ?>">Open</a></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
    <?php endif; ?>
  </div>
</div>
<?php endif; ?>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
