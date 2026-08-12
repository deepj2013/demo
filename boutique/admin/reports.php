<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('reports');
$pageTitle = 'Reports';
$activeNav = 'reports';
$pdo = db();
$cfg = settings();

$inventoryValue = (float)$pdo->query("
  SELECT COALESCE(SUM(inv.qty * i.cost_price),0)
  FROM inventory inv JOIN items i ON i.id=inv.item_id
")->fetchColumn();

$sales30 = module_enabled('ecommerce')
  ? (float)$pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE payment_status='paid' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)")->fetchColumn()
  : 0;

$wages30 = module_enabled('costing')
  ? (float)$pdo->query("SELECT COALESCE(SUM(amount),0) FROM wage_entries WHERE work_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)")->fetchColumn()
  : 0;

$purchases30 = module_enabled('vendors')
  ? (float)$pdo->query("SELECT COALESCE(SUM(total),0) FROM purchase_orders WHERE status!='cancelled' AND order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)")->fetchColumn()
  : 0;

$topItems = $pdo->query("
  SELECT i.sku, i.name, COALESCE(SUM(inv.qty),0) AS qty, i.cost_price,
         COALESCE(SUM(inv.qty),0)*i.cost_price AS value
  FROM items i LEFT JOIN inventory inv ON inv.item_id=i.id
  WHERE i.is_active=1
  GROUP BY i.id, i.sku, i.name, i.cost_price
  ORDER BY value DESC
  LIMIT 10
")->fetchAll();

$salesByDay = [];
if (module_enabled('ecommerce')) {
    $salesByDay = $pdo->query("
      SELECT DATE(created_at) AS d, COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
      GROUP BY DATE(created_at)
      ORDER BY d ASC
    ")->fetchAll();
}

$lowCount = (int)$pdo->query("
  SELECT COUNT(*) FROM items i
  WHERE i.is_active = 1
    AND (
      SELECT COALESCE(SUM(inv.qty), 0)
      FROM inventory inv
      WHERE inv.item_id = i.id
    ) < i.min_stock
")->fetchColumn();

$custCount = module_enabled('crm') ? (int)$pdo->query('SELECT COUNT(*) FROM customers WHERE is_active=1')->fetchColumn() : 0;

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="grid grid-4" style="margin-bottom:1.25rem">
  <div class="stat-card"><div class="label">Inventory value</div><div class="value"><?= e(money($inventoryValue)) ?></div><div class="hint">At cost</div></div>
  <?php if (module_enabled('ecommerce')): ?>
  <div class="stat-card"><div class="label">Sales (30d)</div><div class="value"><?= e(money($sales30)) ?></div><div class="hint">Paid orders</div></div>
  <?php endif; ?>
  <?php if (module_enabled('costing')): ?>
  <div class="stat-card"><div class="label">Wages (30d)</div><div class="value"><?= e(money($wages30)) ?></div><div class="hint">Labour spend</div></div>
  <?php endif; ?>
  <?php if (module_enabled('vendors')): ?>
  <div class="stat-card"><div class="label">Purchases (30d)</div><div class="value"><?= e(money($purchases30)) ?></div><div class="hint">PO totals</div></div>
  <?php endif; ?>
  <div class="stat-card"><div class="label">Low stock SKUs</div><div class="value" style="color:#B54708"><?= $lowCount ?></div><div class="hint">Need reorder</div></div>
  <?php if (module_enabled('crm')): ?>
  <div class="stat-card"><div class="label">Customers</div><div class="value"><?= $custCount ?></div><div class="hint">Active CRM</div></div>
  <?php endif; ?>
</div>

<div class="grid grid-2">
  <div class="panel">
    <div class="panel-head"><h2>Top inventory by value</h2></div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Item</th><th>Qty</th><th>Cost</th><th>Value</th></tr></thead>
        <tbody>
        <?php foreach ($topItems as $t): ?>
          <tr>
            <td><?= e($t['sku']) ?> — <?= e($t['name']) ?></td>
            <td><?= e(number_format((float)$t['qty'],1)) ?></td>
            <td><?= e(money($t['cost_price'])) ?></td>
            <td><?= e(money($t['value'])) ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>

  <?php if ($salesByDay): ?>
  <div class="panel">
    <div class="panel-head"><h2>Sales last 14 days</h2></div>
    <div class="panel-body">
      <?php
        $max = max(1, ...array_map(fn($r)=>(float)$r['revenue'], $salesByDay ?: [['revenue'=>0]]));
        foreach ($salesByDay as $d):
          $pct = ((float)$d['revenue'] / $max) * 100;
      ?>
        <div style="display:grid;grid-template-columns:72px 1fr 80px;gap:.65rem;align-items:center;margin-bottom:.55rem;font-size:.85rem">
          <span style="color:var(--muted)"><?= e(date('d M', strtotime($d['d']))) ?></span>
          <div style="height:10px;background:rgba(11,18,32,.06);border-radius:999px;overflow:hidden">
            <div style="height:100%;width:<?= $pct ?>%;background:linear-gradient(90deg,var(--accent),#8B7355);border-radius:999px"></div>
          </div>
          <strong style="text-align:right"><?= e(money($d['revenue'])) ?></strong>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
  <?php else: ?>
  <div class="panel">
    <div class="panel-head"><h2>Organisation snapshot</h2></div>
    <div class="panel-body">
      <p style="color:var(--muted);margin-bottom:1rem"><?= e($cfg['business_name']) ?> · Modules via <code>settings.json</code></p>
      <ul style="list-style:none;display:grid;gap:.5rem">
        <?php foreach ($cfg['modules'] as $k => $on): ?>
          <li style="display:flex;justify-content:space-between;padding:.55rem .75rem;background:rgba(11,18,32,.03);border-radius:10px">
            <span><?= e(ucfirst($k)) ?></span>
            <span class="badge <?= $on?'badge-ok':'badge-muted' ?>"><?= $on?'ON':'OFF' ?></span>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
  <?php endif; ?>
</div>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
