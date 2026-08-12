<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('vendors');
$pageTitle = 'Purchase Orders';
$activeNav = 'purchases';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    $action = $_POST['action'] ?? '';
    try {
        if ($action === 'create') {
            $vendorId = (int)$_POST['vendor_id'];
            $itemIds = $_POST['item_id'] ?? [];
            $qtys = $_POST['qty'] ?? [];
            $costs = $_POST['unit_cost'] ?? [];
            $po = next_number('PO', 'purchase_orders', 'po_number');
            $sub = 0;
            $lines = [];
            foreach ($itemIds as $i => $itemId) {
                $itemId = (int)$itemId;
                $qty = (float)($qtys[$i] ?? 0);
                $cost = (float)($costs[$i] ?? 0);
                if ($itemId <= 0 || $qty <= 0) continue;
                $lines[] = [$itemId, $qty, $cost];
                $sub += $qty * $cost;
            }
            if (!$lines) throw new RuntimeException('Add at least one line.');
            $tax = $sub * 0.05;
            $pdo->prepare('INSERT INTO purchase_orders (po_number,vendor_id,status,order_date,expected_date,subtotal,tax,total,notes,created_by) VALUES (?,?,?,?,?,?,?,?,?,?)')
                ->execute([$po, $vendorId, 'ordered', $_POST['order_date'] ?? date('Y-m-d'), $_POST['expected_date'] ?: null, $sub, $tax, $sub+$tax, trim($_POST['notes']??''), current_user()['id']??null]);
            $poId = (int)$pdo->lastInsertId();
            $ins = $pdo->prepare('INSERT INTO purchase_order_items (po_id,item_id,qty,unit_cost) VALUES (?,?,?,?)');
            foreach ($lines as $ln) $ins->execute([$poId, $ln[0], $ln[1], $ln[2]]);
            flash('success', "PO $po created.");
        } elseif ($action === 'receive') {
            $poId = (int)$_POST['po_id'];
            $rackId = $_POST['rack_id'] !== '' ? (int)$_POST['rack_id'] : null;
            $st = $pdo->prepare('SELECT * FROM purchase_order_items WHERE po_id=?');
            $st->execute([$poId]);
            foreach ($st->fetchAll() as $ln) {
                $remain = (float)$ln['qty'] - (float)$ln['received_qty'];
                if ($remain <= 0) continue;
                adjust_stock((int)$ln['item_id'], $rackId, $remain, 'in', (float)$ln['unit_cost'], 'purchase', $poId, 'PO receive');
                $pdo->prepare('UPDATE purchase_order_items SET received_qty=qty WHERE id=?')->execute([$ln['id']]);
                $pdo->prepare('UPDATE items SET cost_price=? WHERE id=?')->execute([(float)$ln['unit_cost'], $ln['item_id']]);
            }
            $pdo->prepare("UPDATE purchase_orders SET status='received' WHERE id=?")->execute([$poId]);
            flash('success', 'Purchase received into inventory.');
        }
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
    }
    redirect('admin/purchases.php');
}

$orders = $pdo->query("
  SELECT p.*, v.name AS vendor_name
  FROM purchase_orders p
  JOIN vendors v ON v.id=p.vendor_id
  ORDER BY p.created_at DESC
  LIMIT 50
")->fetchAll();
$vendors = $pdo->query('SELECT id, name FROM vendors WHERE is_active=1 ORDER BY name')->fetchAll();
$items = $pdo->query("SELECT id, sku, name, cost_price FROM items WHERE is_active=1 AND item_type!='finished' ORDER BY name")->fetchAll();
$racks = $pdo->query('SELECT id, code, name FROM racks WHERE is_active=1 ORDER BY code')->fetchAll();
$itemSearchApi = url('api/items_search.php');
$cats = $pdo->query('SELECT id, name FROM categories WHERE is_active=1 ORDER BY name')->fetchAll();

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="toolbar">
  <div class="spacer"></div>
  <button class="btn btn-primary" type="button" onclick="openModal('poModal')">+ New purchase order</button>
</div>

<div class="panel">
  <div class="table-wrap">
    <table class="data">
      <thead><tr><th>PO #</th><th>Vendor</th><th>Date</th><th>Status</th><th>Total</th><th></th></tr></thead>
      <tbody>
      <?php foreach ($orders as $o): ?>
        <tr>
          <td><strong><?= e($o['po_number']) ?></strong></td>
          <td><?= e($o['vendor_name']) ?></td>
          <td><?= e($o['order_date']) ?></td>
          <td><span class="badge badge-<?= $o['status']==='received'?'ok':($o['status']==='cancelled'?'danger':'info') ?>"><?= e($o['status']) ?></span></td>
          <td><?= e(money($o['total'])) ?></td>
          <td>
            <?php if (in_array($o['status'], ['ordered','partial','draft'], true)): ?>
              <form method="post" style="display:inline-flex;gap:.35rem;align-items:center" onsubmit="return confirm('Receive all lines into stock?')">
                <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
                <input type="hidden" name="action" value="receive">
                <input type="hidden" name="po_id" value="<?= (int)$o['id'] ?>">
                <select name="rack_id" style="border:1px solid var(--line);border-radius:8px;padding:.3rem">
                  <option value="">Rack…</option>
                  <?php foreach ($racks as $rk): ?><option value="<?= (int)$rk['id'] ?>"><?= e($rk['code']) ?></option><?php endforeach; ?>
                </select>
                <button class="btn btn-accent btn-sm" type="submit">Receive</button>
              </form>
            <?php endif; ?>
          </td>
        </tr>
      <?php endforeach; ?>
      <?php if (!$orders): ?><tr><td colspan="6"><div class="empty">No purchase orders yet.</div></td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<div class="modal-backdrop" id="poModal">
  <div class="modal" style="width:min(720px,100%)">
    <div class="modal-head"><h2>New PO</h2><button type="button" class="icon-btn" data-close-modal="poModal">✕</button></div>
    <div class="modal-body">
      <form method="post" id="poForm">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="create">
        <div class="form-grid">
          <div class="field"><label>Vendor</label>
            <select name="vendor_id" required><?php foreach ($vendors as $v): ?><option value="<?= (int)$v['id'] ?>"><?= e($v['name']) ?></option><?php endforeach; ?></select>
          </div>
          <div class="field"><label>Order date</label><input type="date" name="order_date" value="<?= e(date('Y-m-d')) ?>"></div>
          <div class="field"><label>Expected</label><input type="date" name="expected_date"></div>
          <div class="field full"><label>Notes</label><textarea name="notes"></textarea></div>
        </div>
        <h3 style="margin:1rem 0 .5rem;font-size:1rem">Lines</h3>
        <div id="poLines"></div>
        <button type="button" class="btn btn-outline btn-sm" style="margin:.75rem 0" onclick="addPoLine()">+ Line</button>
        <div class="form-actions">
          <button type="button" class="btn btn-outline" data-close-modal="poModal">Cancel</button>
          <button class="btn btn-primary" type="submit">Create PO</button>
        </div>
      </form>
    </div>
  </div>
</div>
<script>
const PO_API = <?= json_encode($itemSearchApi, JSON_HEX_TAG|JSON_HEX_APOS) ?>;
const PO_CATS = <?= json_encode($cats, JSON_HEX_TAG|JSON_HEX_APOS) ?>;
let poLineN = 0;
function addPoLine(){
  const wrap=document.getElementById('poLines');
  const row=document.createElement('div');
  row.className='form-grid';
  row.style.marginBottom='.75rem';
  const pid='po_pick_'+ (++poLineN);
  const catOpts = PO_CATS.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  row.innerHTML=`
  <div class="field full">
    <div class="item-picker" id="${pid}" data-api="${PO_API}" data-types="raw,accessory,consumable" data-on-select="onPoItemPicked">
      <label class="item-picker-label">Item</label>
      <div class="item-picker-filters">
        <select class="item-picker-cat" aria-label="Category"><option value="">All categories</option>${catOpts}</select>
        <div class="item-picker-search-wrap"><input type="search" class="item-picker-q" placeholder="Search name or SKU…" autocomplete="off"></div>
      </div>
      <input type="hidden" class="item-picker-value" name="item_id[]" value="" data-required="1">
      <div class="item-picker-selected"><span class="item-picker-hint">Search item for this PO line</span></div>
      <div class="item-picker-results" hidden role="listbox"></div>
    </div>
  </div>
  <div class="field"><label>Qty</label><input type="number" step="0.01" name="qty[]" value="1" required></div>
  <div class="field"><label>Unit cost</label><input type="number" step="0.01" name="unit_cost[]" class="po-unit-cost" value="0"></div>`;
  wrap.appendChild(row);
  if (window.initItemPickers) initItemPickers(row);
}
window.onPoItemPicked = function(item, el){
  const cost = el.closest('.form-grid')?.querySelector('.po-unit-cost');
  if (cost && item) cost.value = item.cost_price || 0;
};
addPoLine();
</script>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
