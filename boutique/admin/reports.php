<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('reports');
$pageTitle = 'Reports';
$activeNav = 'reports';
$pdo = db();
$cfg = settings();

$period = $_GET['period'] ?? 'month';
$report = $_GET['report'] ?? 'sales';
[$from, $to, $periodLabel] = period_sql_bounds($period);
$variant = $_GET['variant'] ?? 'all';

$inventoryValue = (float)$pdo->query("
  SELECT COALESCE(SUM(inv.qty * i.cost_price),0)
  FROM inventory inv JOIN items i ON i.id=inv.item_id
")->fetchColumn();

$st = $pdo->prepare("SELECT COALESCE(SUM(total),0), COUNT(*) FROM orders WHERE status!='cancelled' AND created_at BETWEEN ? AND ?");
$st->execute([$from, $to]);
[$salesPeriod, $orderCount] = $st->fetch(PDO::FETCH_NUM);
$salesPeriod = (float)$salesPeriod;
$orderCount = (int)$orderCount;

$st = $pdo->prepare("SELECT COALESCE(SUM(total),0) FROM orders WHERE payment_status IN ('paid','partial') AND status!='cancelled' AND created_at BETWEEN ? AND ?");
$st->execute([$from, $to]);
$paidPeriod = (float)$st->fetchColumn();

$wagesPeriod = 0.0;
if (module_enabled('costing')) {
    $st = $pdo->prepare("SELECT COALESCE(SUM(amount),0) FROM wage_entries WHERE work_date BETWEEN DATE(?) AND DATE(?)");
    $st->execute([$from, $to]);
    $wagesPeriod = (float)$st->fetchColumn();
}

$purchasesPeriod = 0.0;
if (module_enabled('vendors')) {
    $st = $pdo->prepare("SELECT COALESCE(SUM(total),0) FROM purchase_orders WHERE status!='cancelled' AND order_date BETWEEN DATE(?) AND DATE(?)");
    $st->execute([$from, $to]);
    $purchasesPeriod = (float)$st->fetchColumn();
}

$lowCount = (int)$pdo->query("
  SELECT COUNT(*) FROM items i
  WHERE i.is_active = 1
    AND (SELECT COALESCE(SUM(inv.qty), 0) FROM inventory inv WHERE inv.item_id = i.id) < i.min_stock
")->fetchColumn();

$custCount = module_enabled('crm') ? (int)$pdo->query('SELECT COUNT(*) FROM customers WHERE is_active=1')->fetchColumn() : 0;

// Sales by day/week bucket for chart
$trend = [];
if (module_enabled('ecommerce')) {
    if (in_array($period, ['today','daily'], true)) {
        $trend = $pdo->prepare("
          SELECT DATE_FORMAT(created_at,'%H:00') AS label, COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
          FROM orders WHERE created_at BETWEEN ? AND ? AND status!='cancelled'
          GROUP BY DATE_FORMAT(created_at,'%H:00') ORDER BY label
        ");
    } elseif (in_array($period, ['week','weekly'], true)) {
        $trend = $pdo->prepare("
          SELECT DATE(created_at) AS label, COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
          FROM orders WHERE created_at BETWEEN ? AND ? AND status!='cancelled'
          GROUP BY DATE(created_at) ORDER BY label
        ");
    } elseif (in_array($period, ['quarter','quarterly','year','yearly'], true)) {
        $trend = $pdo->prepare("
          SELECT DATE_FORMAT(created_at,'%Y-%m') AS label, COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
          FROM orders WHERE created_at BETWEEN ? AND ? AND status!='cancelled'
          GROUP BY DATE_FORMAT(created_at,'%Y-%m') ORDER BY label
        ");
    } else {
        $trend = $pdo->prepare("
          SELECT DATE(created_at) AS label, COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
          FROM orders WHERE created_at BETWEEN ? AND ? AND status!='cancelled'
          GROUP BY DATE(created_at) ORDER BY label
        ");
    }
    $trend->execute([$from, $to]);
    $trend = $trend->fetchAll();
}

$salesBySource = [];
if (module_enabled('ecommerce')) {
    $st = $pdo->prepare("
      SELECT source, COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
      FROM orders WHERE created_at BETWEEN ? AND ? AND status!='cancelled'
      GROUP BY source ORDER BY revenue DESC
    ");
    $st->execute([$from, $to]);
    $salesBySource = $st->fetchAll();
}

$topSold = [];
if (module_enabled('ecommerce')) {
    $st = $pdo->prepare("
      SELECT i.sku, i.name, i.item_type, SUM(oi.qty) AS qty, SUM(oi.line_total) AS revenue
      FROM order_items oi
      JOIN orders o ON o.id=oi.order_id
      JOIN items i ON i.id=oi.item_id
      WHERE o.created_at BETWEEN ? AND ? AND o.status!='cancelled'
      GROUP BY i.id, i.sku, i.name, i.item_type
      ORDER BY revenue DESC
      LIMIT 15
    ");
    $st->execute([$from, $to]);
    $topSold = $st->fetchAll();
}

$topInventory = $pdo->query("
  SELECT i.sku, i.name, i.item_type, COALESCE(SUM(inv.qty),0) AS qty, i.cost_price,
         COALESCE(SUM(inv.qty),0)*i.cost_price AS value
  FROM items i LEFT JOIN inventory inv ON inv.item_id=i.id
  WHERE i.is_active=1
  GROUP BY i.id, i.sku, i.name, i.item_type, i.cost_price
  ORDER BY value DESC
  LIMIT 15
")->fetchAll();

$lowStockRows = $pdo->query("
  SELECT i.sku, i.name, i.item_type, i.min_stock, i.unit,
         COALESCE(SUM(inv.qty),0) AS qty,
         (SELECT v.name FROM vendor_items vi JOIN vendors v ON v.id=vi.vendor_id WHERE vi.item_id=i.id LIMIT 1) AS vendor
  FROM items i LEFT JOIN inventory inv ON inv.item_id=i.id
  WHERE i.is_active=1
  GROUP BY i.id, i.sku, i.name, i.item_type, i.min_stock, i.unit
  HAVING COALESCE(SUM(inv.qty),0) < i.min_stock
  ORDER BY qty ASC
  LIMIT 30
")->fetchAll();

$purchaseRows = [];
if (module_enabled('vendors')) {
    $st = $pdo->prepare("
      SELECT po.po_number, po.order_date, po.status, po.total, v.name AS vendor_name
      FROM purchase_orders po JOIN vendors v ON v.id=po.vendor_id
      WHERE po.order_date BETWEEN DATE(?) AND DATE(?)
      ORDER BY po.order_date DESC
      LIMIT 40
    ");
    $st->execute([$from, $to]);
    $purchaseRows = $st->fetchAll();
}

$wageRows = [];
if (module_enabled('costing')) {
    $st = $pdo->prepare("
      SELECT worker_name, work_type, work_date, hours, rate, amount
      FROM wage_entries
      WHERE work_date BETWEEN DATE(?) AND DATE(?)
      ORDER BY work_date DESC
      LIMIT 40
    ");
    $st->execute([$from, $to]);
    $wageRows = $st->fetchAll();
}

$customerRows = [];
if (module_enabled('crm')) {
    $st = $pdo->prepare("
      SELECT c.name, c.phone, c.city, c.total_orders, c.total_spent, c.last_order_at,
        (SELECT COUNT(*) FROM orders o WHERE o.customer_id=c.id AND o.created_at BETWEEN ? AND ?) AS period_orders
      FROM customers c
      WHERE c.is_active=1
      ORDER BY c.total_spent DESC
      LIMIT 25
    ");
    $st->execute([$from, $to]);
    $customerRows = $st->fetchAll();
}

$reports = [
    'sales' => 'Sales summary',
    'trend' => 'Revenue trend',
    'products' => 'Top products',
    'inventory' => 'Inventory value',
    'lowstock' => 'Low stock / reorder',
    'purchases' => 'Purchases',
    'wages' => 'Wages / labour',
    'customers' => 'Customer activity',
];

$maxTrend = max(1, ...array_map(fn($r) => (float)$r['revenue'], $trend ?: [['revenue' => 0]]));

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="dash-head">
  <div class="greet">
    <h2>Reports & analytics</h2>
    <p><?= e($periodLabel) ?> · <?= e(date('j M Y', strtotime($from))) ?> → <?= e(date('j M Y', strtotime($to))) ?> · INR</p>
  </div>
  <div class="period-pills">
    <?php foreach (['today'=>'Daily','week'=>'Weekly','month'=>'Monthly','quarter'=>'Quarterly','year'=>'Yearly'] as $k=>$lab): ?>
      <a href="?report=<?= e($report) ?>&period=<?= e($k) ?>" class="<?= $period===$k?'active':'' ?>"><?= e($lab) ?></a>
    <?php endforeach; ?>
  </div>
</div>

<div class="report-tabs">
  <?php foreach ($reports as $key => $label):
    if ($key === 'purchases' && !module_enabled('vendors')) continue;
    if ($key === 'wages' && !module_enabled('costing')) continue;
    if ($key === 'customers' && !module_enabled('crm')) continue;
    if (in_array($key, ['sales','trend','products'], true) && !module_enabled('ecommerce')) continue;
  ?>
    <a href="?report=<?= e($key) ?>&period=<?= e($period) ?>" class="<?= $report===$key?'active':'' ?>"><?= e($label) ?></a>
  <?php endforeach; ?>
</div>

<div class="grid grid-4" style="margin-bottom:1.25rem">
  <div class="stat-card"><div class="label">Inventory value</div><div class="value"><?= e(money($inventoryValue)) ?></div><div class="hint">At cost</div></div>
  <?php if (module_enabled('ecommerce')): ?>
  <div class="stat-card"><div class="label">Gross sales</div><div class="value"><?= e(money($salesPeriod)) ?></div><div class="hint"><?= $orderCount ?> orders · <?= e($periodLabel) ?></div></div>
  <div class="stat-card"><div class="label">Collected</div><div class="value"><?= e(money($paidPeriod)) ?></div><div class="hint">Paid / partial</div></div>
  <?php endif; ?>
  <?php if (module_enabled('costing')): ?>
  <div class="stat-card"><div class="label">Wages</div><div class="value"><?= e(money($wagesPeriod)) ?></div><div class="hint"><?= e($periodLabel) ?></div></div>
  <?php endif; ?>
  <?php if (module_enabled('vendors')): ?>
  <div class="stat-card"><div class="label">Purchases</div><div class="value"><?= e(money($purchasesPeriod)) ?></div><div class="hint">PO totals</div></div>
  <?php endif; ?>
  <div class="stat-card"><div class="label">Low stock SKUs</div><div class="value" style="color:var(--warn)"><?= $lowCount ?></div><div class="hint">Need reorder</div></div>
  <?php if (module_enabled('crm')): ?>
  <div class="stat-card"><div class="label">Customers</div><div class="value"><?= $custCount ?></div><div class="hint">Active CRM</div></div>
  <?php endif; ?>
</div>

<?php if ($report === 'sales' && module_enabled('ecommerce')): ?>
<div class="grid grid-2">
  <div class="panel">
    <div class="panel-head"><h2>Sales by source</h2></div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Source</th><th>Orders</th><th>Revenue</th></tr></thead>
        <tbody>
        <?php if (!$salesBySource): ?>
          <tr><td colspan="3" style="color:var(--muted)">No sales in this period.</td></tr>
        <?php endif; ?>
        <?php foreach ($salesBySource as $r): ?>
          <tr>
            <td><?= e(ucfirst($r['source'])) ?></td>
            <td><?= (int)$r['orders'] ?></td>
            <td><?= e(money($r['revenue'])) ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>
  <div class="panel">
    <div class="panel-head"><h2>Period snapshot</h2></div>
    <div class="panel-body">
      <ul style="list-style:none;display:grid;gap:.55rem">
        <li style="display:flex;justify-content:space-between;padding:.65rem .85rem;background:var(--surface);border-radius:12px"><span>Gross sales</span><strong><?= e(money($salesPeriod)) ?></strong></li>
        <li style="display:flex;justify-content:space-between;padding:.65rem .85rem;background:var(--surface);border-radius:12px"><span>Collected</span><strong><?= e(money($paidPeriod)) ?></strong></li>
        <li style="display:flex;justify-content:space-between;padding:.65rem .85rem;background:var(--surface);border-radius:12px"><span>Orders</span><strong><?= $orderCount ?></strong></li>
        <li style="display:flex;justify-content:space-between;padding:.65rem .85rem;background:var(--surface);border-radius:12px"><span>Avg order value</span><strong><?= e(money($orderCount ? $salesPeriod / $orderCount : 0)) ?></strong></li>
      </ul>
    </div>
  </div>
</div>

<?php elseif ($report === 'trend' && module_enabled('ecommerce')): ?>
<div class="panel">
  <div class="panel-head"><h2>Revenue trend · <?= e($periodLabel) ?></h2></div>
  <div class="panel-body">
    <?php if (!$trend): ?>
      <div class="empty"><p>No data for this period.</p></div>
    <?php else: ?>
      <?php foreach ($trend as $d):
        $pct = ((float)$d['revenue'] / $maxTrend) * 100;
        $lab = $d['label'];
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $lab)) $lab = date('d M', strtotime($lab));
      ?>
        <div style="display:grid;grid-template-columns:88px 1fr 100px 60px;gap:.65rem;align-items:center;margin-bottom:.55rem;font-size:.85rem">
          <span style="color:var(--muted)"><?= e($lab) ?></span>
          <div style="height:10px;background:var(--line);border-radius:999px;overflow:hidden">
            <div style="height:100%;width:<?= $pct ?>%;background:var(--chart-bar);border-radius:999px"></div>
          </div>
          <strong style="text-align:right"><?= e(money($d['revenue'])) ?></strong>
          <span style="text-align:right;color:var(--muted)"><?= (int)$d['orders'] ?> ord</span>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </div>
</div>

<?php elseif ($report === 'products' && module_enabled('ecommerce')): ?>
<div class="panel">
  <div class="panel-head"><h2>Top products sold · <?= e($periodLabel) ?></h2></div>
  <div class="table-wrap">
    <table class="data">
      <thead><tr><th>SKU</th><th>Product</th><th>Type</th><th>Qty</th><th>Revenue</th></tr></thead>
      <tbody>
      <?php if (!$topSold): ?><tr><td colspan="5" style="color:var(--muted)">No product sales in this period.</td></tr><?php endif; ?>
      <?php foreach ($topSold as $t): ?>
        <tr>
          <td><?= e($t['sku']) ?></td>
          <td><?= e($t['name']) ?></td>
          <td><span class="badge badge-muted"><?= e($t['item_type']) ?></span></td>
          <td><?= e(number_format((float)$t['qty'], 1)) ?></td>
          <td><?= e(money($t['revenue'])) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<?php elseif ($report === 'inventory'): ?>
<div class="panel">
  <div class="panel-head">
    <h2>Inventory valuation</h2>
    <div class="period-pills">
      <a href="?report=inventory&period=<?= e($period) ?>&variant=all" class="<?= $variant==='all'?'active':'' ?>">All</a>
      <a href="?report=inventory&period=<?= e($period) ?>&variant=raw" class="<?= $variant==='raw'?'active':'' ?>">Raw</a>
      <a href="?report=inventory&period=<?= e($period) ?>&variant=finished" class="<?= $variant==='finished'?'active':'' ?>">Finished</a>
    </div>
  </div>
  <div class="table-wrap">
    <table class="data">
      <thead><tr><th>Item</th><th>Type</th><th>Qty</th><th>Cost</th><th>Value</th></tr></thead>
      <tbody>
      <?php foreach ($topInventory as $t):
        if ($variant === 'raw' && !in_array($t['item_type'], ['raw','accessory','consumable'], true)) continue;
        if ($variant === 'finished' && $t['item_type'] !== 'finished') continue;
      ?>
        <tr>
          <td><?= e($t['sku']) ?> — <?= e($t['name']) ?></td>
          <td><span class="badge badge-muted"><?= e($t['item_type']) ?></span></td>
          <td><?= e(number_format((float)$t['qty'],1)) ?></td>
          <td><?= e(money($t['cost_price'])) ?></td>
          <td><?= e(money($t['value'])) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<?php elseif ($report === 'lowstock'): ?>
<div class="panel">
  <div class="panel-head"><h2>Low stock / reorder list</h2></div>
  <div class="table-wrap">
    <table class="data">
      <thead><tr><th>SKU</th><th>Item</th><th>Type</th><th>Qty</th><th>Min</th><th>Suggested vendor</th></tr></thead>
      <tbody>
      <?php if (!$lowStockRows): ?><tr><td colspan="6" style="color:var(--muted)">All items above minimum.</td></tr><?php endif; ?>
      <?php foreach ($lowStockRows as $r): ?>
        <tr>
          <td><?= e($r['sku']) ?></td>
          <td><?= e($r['name']) ?></td>
          <td><?= e($r['item_type']) ?></td>
          <td><span class="badge badge-warn"><?= e(number_format((float)$r['qty'],1)) ?> <?= e($r['unit']) ?></span></td>
          <td><?= e(number_format((float)$r['min_stock'],1)) ?></td>
          <td><?= e($r['vendor'] ?: '—') ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<?php elseif ($report === 'purchases' && module_enabled('vendors')): ?>
<div class="panel">
  <div class="panel-head"><h2>Purchase orders · <?= e($periodLabel) ?></h2></div>
  <div class="table-wrap">
    <table class="data">
      <thead><tr><th>PO</th><th>Date</th><th>Vendor</th><th>Status</th><th>Total</th></tr></thead>
      <tbody>
      <?php if (!$purchaseRows): ?><tr><td colspan="5" style="color:var(--muted)">No POs in this period.</td></tr><?php endif; ?>
      <?php foreach ($purchaseRows as $r): ?>
        <tr>
          <td><?= e($r['po_number']) ?></td>
          <td><?= e(date('j M Y', strtotime($r['order_date']))) ?></td>
          <td><?= e($r['vendor_name']) ?></td>
          <td><span class="badge badge-info"><?= e($r['status']) ?></span></td>
          <td><?= e(money($r['total'])) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<?php elseif ($report === 'wages' && module_enabled('costing')): ?>
<div class="panel">
  <div class="panel-head"><h2>Wage / labour · <?= e($periodLabel) ?></h2></div>
  <div class="table-wrap">
    <table class="data">
      <thead><tr><th>Date</th><th>Worker</th><th>Type</th><th>Hours</th><th>Rate</th><th>Amount</th></tr></thead>
      <tbody>
      <?php if (!$wageRows): ?><tr><td colspan="6" style="color:var(--muted)">No wage entries in this period.</td></tr><?php endif; ?>
      <?php foreach ($wageRows as $r): ?>
        <tr>
          <td><?= e(date('j M Y', strtotime($r['work_date']))) ?></td>
          <td><?= e($r['worker_name']) ?></td>
          <td><?= e($r['work_type']) ?></td>
          <td><?= e(number_format((float)$r['hours'],1)) ?></td>
          <td><?= e(money($r['rate'])) ?></td>
          <td><?= e(money($r['amount'])) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<?php elseif ($report === 'customers' && module_enabled('crm')): ?>
<div class="panel">
  <div class="panel-head"><h2>Customer activity · <?= e($periodLabel) ?></h2></div>
  <div class="table-wrap">
    <table class="data">
      <thead><tr><th>Customer</th><th>Phone</th><th>City</th><th>Lifetime orders</th><th>Lifetime spend</th><th>Orders (period)</th><th>Last order</th></tr></thead>
      <tbody>
      <?php foreach ($customerRows as $r): ?>
        <tr>
          <td><?= e($r['name']) ?></td>
          <td><?= e($r['phone'] ?: '—') ?></td>
          <td><?= e($r['city'] ?: '—') ?></td>
          <td><?= (int)$r['total_orders'] ?></td>
          <td><?= e(money($r['total_spent'])) ?></td>
          <td><?= (int)$r['period_orders'] ?></td>
          <td><?= $r['last_order_at'] ? e(date('j M Y', strtotime($r['last_order_at']))) : '—' ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<?php else: ?>
<div class="panel">
  <div class="panel-body">
    <p style="color:var(--muted)">Select a report tab above. Enable ecommerce / vendors / costing modules in settings for full variants.</p>
  </div>
</div>
<?php endif; ?>

<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
