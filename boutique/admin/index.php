<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
$pageTitle = 'Dashboard';
$activeNav = 'dashboard';
$stats = dashboard_stats();
$pdo = db();

$lowStock = $pdo->query("
  SELECT i.id, i.sku, i.name, i.min_stock, i.unit,
         COALESCE(SUM(inv.qty),0) AS qty
  FROM items i
  LEFT JOIN inventory inv ON inv.item_id = i.id
  WHERE i.is_active = 1
  GROUP BY i.id, i.sku, i.name, i.min_stock, i.unit
  HAVING COALESCE(SUM(inv.qty),0) < i.min_stock
  ORDER BY qty ASC
  LIMIT 8
")->fetchAll();

$recentMoves = $pdo->query("
  SELECT m.*, i.name AS item_name, i.sku, r.code AS rack_code
  FROM stock_movements m
  JOIN items i ON i.id = m.item_id
  LEFT JOIN racks r ON r.id = m.rack_id
  ORDER BY m.created_at DESC
  LIMIT 8
")->fetchAll();

$recentOrders = module_enabled('ecommerce')
  ? $pdo->query("SELECT o.*, c.name AS customer_name FROM orders o LEFT JOIN customers c ON c.id = o.customer_id ORDER BY o.created_at DESC LIMIT 8")->fetchAll()
  : [];
$pendingOrders = module_enabled('ecommerce') ? (int)($stats['pending_orders'] ?? 0) : 0;

require ROOT_PATH . '/includes/admin_header.php';
?>
<?php if ($pendingOrders > 0): ?>
  <div class="flash flash-info" style="margin:0 0 1rem">
    <strong><?= $pendingOrders ?> new/pending shop order<?= $pendingOrders > 1 ? 's' : '' ?></strong> —
    <a href="<?= e(url('admin/orders.php?filter=pending')) ?>" style="text-decoration:underline">Open Orders</a>
  </div>
<?php endif; ?>
<div class="grid grid-4" style="margin-bottom:1.25rem">
  <div class="stat-card">
    <div class="label">Active Items</div>
    <div class="value"><?= (int)$stats['items'] ?></div>
    <div class="hint">In item master</div>
  </div>
  <div class="stat-card">
    <div class="label">Low Stock</div>
    <div class="value" style="color:#B54708"><?= (int)$stats['low_stock'] ?></div>
    <div class="hint">Below minimum</div>
  </div>
  <?php if (module_enabled('crm')): ?>
  <div class="stat-card">
    <div class="label">Customers</div>
    <div class="value"><?= (int)$stats['customers'] ?></div>
    <div class="hint">CRM records</div>
  </div>
  <?php endif; ?>
  <?php if (module_enabled('ecommerce')): ?>
  <div class="stat-card">
    <div class="label">Month Revenue</div>
    <div class="value"><?= e(money($stats['revenue_month'])) ?></div>
    <div class="hint"><?= (int)$stats['orders_month'] ?> orders</div>
  </div>
  <?php else: ?>
  <div class="stat-card">
    <div class="label">Vendors</div>
    <div class="value"><?= (int)$stats['vendors'] ?></div>
    <div class="hint"><?= (int)$stats['pending_pos'] ?> open POs</div>
  </div>
  <?php endif; ?>
</div>

<div class="grid grid-2">
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
    <div class="panel-head"><h2>Recent stock movements</h2></div>
    <div class="table-wrap">
      <?php if (!$recentMoves): ?>
        <div class="empty"><p>No movements yet.</p></div>
      <?php else: ?>
        <table class="data">
          <thead><tr><th>When</th><th>Item</th><th>Type</th><th>Qty</th></tr></thead>
          <tbody>
          <?php foreach ($recentMoves as $m): ?>
            <tr>
              <td><?= e(date('d M H:i', strtotime($m['created_at']))) ?></td>
              <td><?= e($m['item_name']) ?><?php if ($m['rack_code']): ?> <small style="color:var(--muted)">· <?= e($m['rack_code']) ?></small><?php endif; ?></td>
              <td><span class="badge badge-<?= $m['movement_type']==='in'?'ok':($m['movement_type']==='out'?'danger':'info') ?>"><?= e($m['movement_type']) ?></span></td>
              <td><?= e(number_format((float)$m['qty'], 2)) ?></td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>
    </div>
  </div>
</div>

<?php if (module_enabled('ecommerce')): ?>
<div class="panel" style="margin-top:1.25rem">
  <div class="panel-head">
    <h2>Latest orders</h2>
    <a class="btn btn-outline btn-sm" href="<?= e(url('admin/orders.php')) ?>">All orders</a>
  </div>
  <div class="table-wrap">
    <?php if (!$recentOrders): ?>
      <div class="empty"><p>No orders yet. They appear here as soon as a customer places an order on the shop.</p></div>
    <?php else: ?>
    <table class="data">
      <thead><tr><th>Order</th><th>Customer</th><th>Source</th><th>Status</th><th>Total</th><th></th></tr></thead>
      <tbody>
      <?php foreach ($recentOrders as $o): ?>
        <tr style="<?= $o['status']==='pending'?'background:rgba(254,244,230,.65)':'' ?>">
          <td><?= e($o['order_number']) ?></td>
          <td><?= e($o['customer_name'] ?: 'Guest') ?></td>
          <td><?= e($o['source']) ?></td>
          <td><span class="badge badge-<?= $o['status']==='pending'?'warn':'info' ?>"><?= e($o['status']) ?></span></td>
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
