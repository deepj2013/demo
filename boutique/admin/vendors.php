<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('vendors');
$pageTitle = 'Vendors';
$activeNav = 'vendors';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    $action = $_POST['action'] ?? 'save';
    try {
        if ($action === 'save') {
            $id = (int)($_POST['id'] ?? 0);
            $data = [
                trim($_POST['name'] ?? ''),
                trim($_POST['contact_person'] ?? ''),
                trim($_POST['email'] ?? ''),
                trim($_POST['phone'] ?? ''),
                trim($_POST['address'] ?? ''),
                trim($_POST['city'] ?? ''),
                trim($_POST['gstin'] ?? ''),
                trim($_POST['payment_terms'] ?? ''),
                trim($_POST['notes'] ?? ''),
            ];
            if ($id > 0) {
                $pdo->prepare('UPDATE vendors SET name=?,contact_person=?,email=?,phone=?,address=?,city=?,gstin=?,payment_terms=?,notes=? WHERE id=?')
                    ->execute([...$data, $id]);
                flash('success', 'Vendor updated.');
            } else {
                $pdo->prepare('INSERT INTO vendors (name,contact_person,email,phone,address,city,gstin,payment_terms,notes) VALUES (?,?,?,?,?,?,?,?,?)')
                    ->execute($data);
                flash('success', 'Vendor added.');
            }
        } elseif ($action === 'link_item') {
            $pdo->prepare('INSERT INTO vendor_items (vendor_id,item_id,vendor_sku,last_price,lead_time_days) VALUES (?,?,?,?,?)
                ON DUPLICATE KEY UPDATE vendor_sku=VALUES(vendor_sku), last_price=VALUES(last_price), lead_time_days=VALUES(lead_time_days)')
                ->execute([
                    (int)$_POST['vendor_id'],
                    (int)$_POST['item_id'],
                    trim($_POST['vendor_sku'] ?? ''),
                    (float)($_POST['last_price'] ?? 0),
                    (int)($_POST['lead_time_days'] ?? 7),
                ]);
            flash('success', 'Item linked to vendor.');
        } elseif ($action === 'delete') {
            $pdo->prepare('UPDATE vendors SET is_active=0 WHERE id=?')->execute([(int)$_POST['id']]);
            flash('success', 'Vendor deactivated.');
        }
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
    }
    redirect('admin/vendors.php' . (isset($_POST['vendor_id']) ? '?id='.(int)$_POST['vendor_id'] : ''));
}

$vendors = $pdo->query('SELECT * FROM vendors WHERE is_active=1 ORDER BY name')->fetchAll();
$viewId = (int)($_GET['id'] ?? 0);
$view = null;
$linked = [];
if ($viewId) {
    $st = $pdo->prepare('SELECT * FROM vendors WHERE id=?');
    $st->execute([$viewId]);
    $view = $st->fetch();
    $ls = $pdo->prepare('SELECT vi.*, i.name, i.sku, i.min_stock, COALESCE((SELECT SUM(qty) FROM inventory WHERE item_id=i.id),0) AS stock FROM vendor_items vi JOIN items i ON i.id=vi.item_id WHERE vi.vendor_id=?');
    $ls->execute([$viewId]);
    $linked = $ls->fetchAll();
}
$items = $pdo->query("SELECT id, sku, name FROM items WHERE is_active=1 AND item_type IN ('raw','accessory','consumable') ORDER BY name")->fetchAll();
require_once ROOT_PATH . '/includes/item_picker.php';

// Low stock with preferred vendor
$reorder = $pdo->query("
  SELECT i.id, i.sku, i.name, i.min_stock, i.unit,
         COALESCE(SUM(inv.qty),0) AS qty,
         v.name AS vendor_name, v.phone AS vendor_phone, vi.last_price, vi.lead_time_days
  FROM items i
  LEFT JOIN inventory inv ON inv.item_id=i.id
  LEFT JOIN vendor_items vi ON vi.item_id=i.id
  LEFT JOIN vendors v ON v.id=vi.vendor_id AND v.is_active=1
  WHERE i.is_active=1
  GROUP BY i.id, i.sku, i.name, i.min_stock, i.unit, v.id, v.name, v.phone, vi.id, vi.last_price, vi.lead_time_days
  HAVING COALESCE(SUM(inv.qty),0) < i.min_stock
  ORDER BY qty ASC
  LIMIT 20
")->fetchAll();

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="toolbar">
  <div class="spacer"></div>
  <button class="btn btn-primary" type="button" onclick="openModal('vendorModal');document.getElementById('vendorForm').reset();document.getElementById('vendorId').value=''">+ Add vendor</button>
</div>

<?php if ($reorder): ?>
<div class="panel" style="margin-bottom:1.25rem">
  <div class="panel-head"><h2>Reorder suggestions</h2><a class="btn btn-outline btn-sm" href="<?= e(url('admin/purchases.php')) ?>">Create PO</a></div>
  <div class="table-wrap">
    <table class="data">
      <thead><tr><th>Item</th><th>Stock</th><th>Min</th><th>Vendor</th><th>Last price</th><th>Lead</th></tr></thead>
      <tbody>
      <?php foreach ($reorder as $r): ?>
        <tr>
          <td><?= e($r['sku']) ?> — <?= e($r['name']) ?></td>
          <td><span class="badge badge-warn"><?= e(number_format((float)$r['qty'],1)) ?></span></td>
          <td><?= e(number_format((float)$r['min_stock'],1)) ?></td>
          <td><?= e($r['vendor_name'] ?: '—') ?><?php if ($r['vendor_phone']): ?> <small style="color:var(--muted)"><?= e($r['vendor_phone']) ?></small><?php endif; ?></td>
          <td><?= $r['last_price'] !== null ? e(money((float)$r['last_price'])) : '—' ?></td>
          <td><?= $r['lead_time_days'] ? (int)$r['lead_time_days'].'d' : '—' ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
<?php endif; ?>

<div class="grid grid-2">
  <div class="panel">
    <div class="panel-head"><h2>All vendors</h2></div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Name</th><th>Contact</th><th>City</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($vendors as $v): ?>
          <tr>
            <td><strong><?= e($v['name']) ?></strong></td>
            <td><?= e($v['contact_person'] ?: '—') ?><div style="font-size:.75rem;color:var(--muted)"><?= e($v['phone'] ?: $v['email']) ?></div></td>
            <td><?= e($v['city'] ?: '—') ?></td>
            <td><a class="btn btn-outline btn-sm" href="?id=<?= (int)$v['id'] ?>">Open</a></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>

  <div class="panel">
    <?php if (!$view): ?>
      <div class="empty"><h3>Select a vendor</h3><p>Link items they supply for fast reorder.</p></div>
    <?php else: ?>
      <div class="panel-head">
        <div>
          <h2><?= e($view['name']) ?></h2>
          <div style="font-size:.8rem;color:var(--muted)"><?= e($view['contact_person']) ?> · <?= e($view['phone']) ?> · <?= e($view['payment_terms']) ?></div>
        </div>
        <button class="btn btn-outline btn-sm" type="button" onclick='editVendor(<?= json_encode($view, JSON_HEX_TAG|JSON_HEX_APOS) ?>)'>Edit</button>
      </div>
      <div class="panel-body">
        <h3 style="font-size:1rem;margin-bottom:.65rem">Supplied items</h3>
        <table class="data" style="margin-bottom:1rem">
          <thead><tr><th>Item</th><th>Price</th><th>Lead</th><th>Stock</th></tr></thead>
          <tbody>
          <?php foreach ($linked as $l): ?>
            <tr>
              <td><?= e($l['sku']) ?> — <?= e($l['name']) ?></td>
              <td><?= e(money($l['last_price'])) ?></td>
              <td><?= (int)$l['lead_time_days'] ?>d</td>
              <td><span class="badge <?= (float)$l['stock'] < (float)$l['min_stock'] ? 'badge-warn':'badge-ok' ?>"><?= e(number_format((float)$l['stock'],1)) ?></span></td>
            </tr>
          <?php endforeach; ?>
          <?php if (!$linked): ?><tr><td colspan="4"><div class="empty">No items linked.</div></td></tr><?php endif; ?>
          </tbody>
        </table>
        <form method="post" class="form-grid">
          <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
          <input type="hidden" name="action" value="link_item">
          <input type="hidden" name="vendor_id" value="<?= (int)$view['id'] ?>">
          <div class="field full">
            <?php item_picker_field([
              'name' => 'item_id',
              'id' => 'vendor_item_picker',
              'required' => true,
              'label' => 'Link item',
              'types' => 'raw,accessory,consumable',
              'placeholder' => 'Search material by name or SKU…',
              'on_select' => 'onVendorItemPicked',
            ]); ?>
          </div>
          <div class="field"><label>Vendor SKU</label><input name="vendor_sku"></div>
          <div class="field"><label>Last price</label><input type="number" step="0.01" name="last_price" id="vendor_last_price" value="0"></div>
          <div class="field"><label>Lead days</label><input type="number" name="lead_time_days" value="7"></div>
          <div class="form-actions full"><button class="btn btn-primary btn-sm" type="submit">Link</button></div>
        </form>
      </div>
    <?php endif; ?>
  </div>
</div>
<script>
function onVendorItemPicked(item){
  const p=document.getElementById('vendor_last_price');
  if(p && item) p.value=item.cost_price||0;
}
</script>

<div class="modal-backdrop" id="vendorModal">
  <div class="modal">
    <div class="modal-head"><h2>Vendor</h2><button type="button" class="icon-btn" data-close-modal="vendorModal">✕</button></div>
    <div class="modal-body">
      <form method="post" id="vendorForm" class="form-grid">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" id="vendorId">
        <div class="field"><label>Name</label><input name="name" id="v_name" required></div>
        <div class="field"><label>Contact person</label><input name="contact_person" id="v_contact"></div>
        <div class="field"><label>Email</label><input type="email" name="email" id="v_email"></div>
        <div class="field"><label>Phone</label><input name="phone" id="v_phone"></div>
        <div class="field"><label>City</label><input name="city" id="v_city"></div>
        <div class="field"><label>GSTIN</label><input name="gstin" id="v_gstin"></div>
        <div class="field"><label>Payment terms</label><input name="payment_terms" id="v_terms"></div>
        <div class="field full"><label>Address</label><textarea name="address" id="v_address"></textarea></div>
        <div class="field full"><label>Notes</label><textarea name="notes" id="v_notes"></textarea></div>
        <div class="form-actions full">
          <button type="button" class="btn btn-outline" data-close-modal="vendorModal">Cancel</button>
          <button class="btn btn-primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</div>
<script>
function editVendor(v){
  document.getElementById('vendorId').value=v.id;
  document.getElementById('v_name').value=v.name||'';
  document.getElementById('v_contact').value=v.contact_person||'';
  document.getElementById('v_email').value=v.email||'';
  document.getElementById('v_phone').value=v.phone||'';
  document.getElementById('v_city').value=v.city||'';
  document.getElementById('v_gstin').value=v.gstin||'';
  document.getElementById('v_terms').value=v.payment_terms||'';
  document.getElementById('v_address').value=v.address||'';
  document.getElementById('v_notes').value=v.notes||'';
  openModal('vendorModal');
}
</script>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
