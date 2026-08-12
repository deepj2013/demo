<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('inventory');
$pageTitle = 'Inventory';
$activeNav = 'inventory';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    try {
        $itemId = (int)($_POST['item_id'] ?? 0);
        $rackId = $_POST['rack_id'] !== '' ? (int)$_POST['rack_id'] : null;
        $qty = (float)($_POST['qty'] ?? 0);
        $type = $_POST['movement_type'] ?? 'in';
        $unitCost = (float)($_POST['unit_cost'] ?? 0);
        $notes = trim($_POST['notes'] ?? '');
        if ($itemId <= 0 || $qty == 0) throw new RuntimeException('Item and quantity required.');
        adjust_stock($itemId, $rackId, $qty, $type, $unitCost, 'manual', null, $notes);
        if ($type === 'in' && $unitCost > 0) {
            $pdo->prepare('UPDATE items SET cost_price=? WHERE id=?')->execute([$unitCost, $itemId]);
        }
        flash('success', 'Stock movement recorded.');
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
    }
    redirect('admin/inventory.php');
}

$filter = $_GET['filter'] ?? 'all';
$sql = "
  SELECT i.id, i.sku, i.name, i.unit, i.min_stock, i.image, i.item_type,
         inv.id AS inv_id, inv.qty, inv.rack_id, r.code AS rack_code, r.name AS rack_name, r.zone
  FROM items i
  LEFT JOIN inventory inv ON inv.item_id = i.id
  LEFT JOIN racks r ON r.id = inv.rack_id
  WHERE i.is_active = 1
";
if ($filter === 'low') {
    $sql = "
      SELECT i.id, i.sku, i.name, i.unit, i.min_stock, i.image, i.item_type,
             NULL AS inv_id, COALESCE(SUM(inv.qty),0) AS qty, NULL AS rack_id, NULL AS rack_code, NULL AS rack_name, NULL AS zone
      FROM items i
      LEFT JOIN inventory inv ON inv.item_id = i.id
      WHERE i.is_active = 1
      GROUP BY i.id, i.sku, i.name, i.unit, i.min_stock, i.image, i.item_type
      HAVING COALESCE(SUM(inv.qty),0) < i.min_stock
    ";
}
$sql .= $filter === 'low' ? ' ORDER BY qty ASC' : ' ORDER BY i.name, r.code';
$rows = $pdo->query($sql)->fetchAll();
$racks = $pdo->query('SELECT id, code, name FROM racks WHERE is_active=1 ORDER BY code')->fetchAll();
require_once ROOT_PATH . '/includes/item_picker.php';

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="toolbar">
  <a class="btn btn-sm <?= $filter==='all'?'btn-primary':'btn-outline' ?>" href="?filter=all">All locations</a>
  <a class="btn btn-sm <?= $filter==='low'?'btn-primary':'btn-outline' ?>" href="?filter=low">Low stock</a>
  <input type="search" id="tableSearch" placeholder="Search stock…" style="border:1px solid var(--line);border-radius:999px;padding:.55rem 1rem;min-width:200px;background:#fff">
  <div class="spacer"></div>
  <button class="btn btn-accent" type="button" onclick="openModal('moveModal')">Stock in / out</button>
</div>

<div class="panel">
  <div class="table-wrap">
    <table class="data">
      <thead><tr><th></th><th>SKU</th><th>Item</th><th>Rack</th><th>Zone</th><th>Qty</th><th>Min</th></tr></thead>
      <tbody>
      <?php foreach ($rows as $r): ?>
        <tr>
          <td>
            <?php if (!empty($r['image'])): ?>
              <img class="thumb" src="<?= e(asset($r['image'])) ?>" alt="">
            <?php else: ?><div class="thumb-ph">IMG</div><?php endif; ?>
          </td>
          <td><?= e($r['sku']) ?></td>
          <td><strong><?= e($r['name']) ?></strong><div style="font-size:.72rem;color:var(--muted)"><?= e($r['item_type']) ?></div></td>
          <td><?= e($r['rack_code'] ?: '—') ?><?php if ($r['rack_name']): ?> <small style="color:var(--muted)"><?= e($r['rack_name']) ?></small><?php endif; ?></td>
          <td><?= e($r['zone'] ?: '—') ?></td>
          <td>
            <?php $low = (float)$r['qty'] < (float)$r['min_stock']; ?>
            <span class="badge <?= $low?'badge-warn':'badge-ok' ?>"><?= e(number_format((float)$r['qty'],2)) ?> <?= e($r['unit']) ?></span>
          </td>
          <td><?= e(number_format((float)$r['min_stock'],1)) ?></td>
        </tr>
      <?php endforeach; ?>
      <?php if (!$rows): ?><tr><td colspan="7"><div class="empty">No inventory rows.</div></td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<div class="modal-backdrop" id="moveModal">
  <div class="modal">
    <div class="modal-head"><h2>Stock movement</h2><button type="button" class="icon-btn" data-close-modal="moveModal">✕</button></div>
    <div class="modal-body">
      <form method="post" class="form-grid" id="stockMoveForm">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <div class="field full">
          <?php item_picker_field([
            'name' => 'item_id',
            'id' => 'stock_item_picker',
            'required' => true,
            'label' => 'Item',
            'placeholder' => 'Search name or item code (SKU)…',
            'on_select' => 'onStockItemPicked',
          ]); ?>
        </div>
        <div class="field">
          <label>Rack / location</label>
          <select name="rack_id">
            <option value="">Unassigned</option>
            <?php foreach ($racks as $rk): ?><option value="<?= (int)$rk['id'] ?>"><?= e($rk['code'].' — '.$rk['name']) ?></option><?php endforeach; ?>
          </select>
        </div>
        <div class="field">
          <label>Type</label>
          <select name="movement_type">
            <option value="in">Stock IN</option>
            <option value="out">Stock OUT</option>
            <option value="return">Return IN</option>
            <option value="adjust">Adjust (+/- qty)</option>
          </select>
        </div>
        <div class="field"><label>Quantity</label><input type="number" step="0.01" name="qty" required></div>
        <div class="field"><label>Unit cost (for IN)</label><input type="number" step="0.01" name="unit_cost" id="move_unit_cost" value="0"></div>
        <div class="field full"><label>Notes</label><textarea name="notes" placeholder="Purchase bill / cutting / sale…"></textarea></div>
        <div class="form-actions full">
          <button type="button" class="btn btn-outline" data-close-modal="moveModal">Cancel</button>
          <button class="btn btn-primary" type="submit">Record</button>
        </div>
      </form>
    </div>
  </div>
</div>
<script>
function onStockItemPicked(item){
  const cost=document.getElementById('move_unit_cost');
  if(cost && item && item.cost_price!=null) cost.value=item.cost_price;
}
document.getElementById('stockMoveForm')?.addEventListener('submit',function(e){
  const v=this.querySelector('.item-picker-value');
  if(!v || !v.value){ e.preventDefault(); alert('Please search and select an item first.'); }
});
</script>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
