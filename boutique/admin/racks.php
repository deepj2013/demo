<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('racks');
$pageTitle = 'Rack Master';
$activeNav = 'racks';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    $action = $_POST['action'] ?? 'save';
    try {
        if ($action === 'save') {
            $id = (int)($_POST['id'] ?? 0);
            $data = [
                trim($_POST['code'] ?? ''),
                trim($_POST['name'] ?? ''),
                trim($_POST['zone'] ?? ''),
                trim($_POST['aisle'] ?? ''),
                trim($_POST['shelf'] ?? ''),
                (int)($_POST['capacity'] ?? 0),
                trim($_POST['notes'] ?? ''),
            ];
            if ($id > 0) {
                $pdo->prepare('UPDATE racks SET code=?,name=?,zone=?,aisle=?,shelf=?,capacity=?,notes=? WHERE id=?')
                    ->execute([...$data, $id]);
                flash('success', 'Rack updated.');
            } else {
                $pdo->prepare('INSERT INTO racks (code,name,zone,aisle,shelf,capacity,notes) VALUES (?,?,?,?,?,?,?)')
                    ->execute($data);
                flash('success', 'Rack created.');
            }
        } elseif ($action === 'delete') {
            $pdo->prepare('UPDATE racks SET is_active=0 WHERE id=?')->execute([(int)$_POST['id']]);
            flash('success', 'Rack deactivated.');
        }
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
    }
    redirect('admin/racks.php');
}

$racks = $pdo->query("
  SELECT r.*,
    (SELECT COUNT(DISTINCT inv.item_id) FROM inventory inv WHERE inv.rack_id=r.id AND inv.qty>0) AS item_count,
    (SELECT COALESCE(SUM(inv.qty),0) FROM inventory inv WHERE inv.rack_id=r.id) AS total_qty
  FROM racks r
  WHERE r.is_active=1
  ORDER BY r.zone, r.code
")->fetchAll();

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="toolbar">
  <input type="search" id="tableSearch" placeholder="Search racks…" style="border:1px solid var(--line);border-radius:999px;padding:.55rem 1rem;min-width:200px;background:#fff">
  <div class="spacer"></div>
  <button class="btn btn-primary" type="button" onclick="openModal('rackModal');document.getElementById('rackForm').reset();document.getElementById('rackId').value=''">+ Add rack</button>
</div>

<div class="grid grid-3" style="margin-bottom:1.25rem">
<?php foreach ($racks as $rk): ?>
  <div class="panel" style="padding:0">
    <div class="panel-body">
      <div style="display:flex;justify-content:space-between;align-items:start;gap:.5rem">
        <div>
          <div class="badge badge-info"><?= e($rk['code']) ?></div>
          <h3 style="margin:.4rem 0 .15rem;font-size:1.1rem"><?= e($rk['name']) ?></h3>
          <div style="color:var(--muted);font-size:.85rem">
            <?= e($rk['zone'] ?: 'No zone') ?>
            <?= $rk['aisle'] ? ' · Aisle '.$rk['aisle'] : '' ?>
            <?= $rk['shelf'] ? ' · Shelf '.$rk['shelf'] : '' ?>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" type="button" onclick='editRack(<?= json_encode($rk, JSON_HEX_TAG|JSON_HEX_APOS) ?>)'>Edit</button>
      </div>
      <div style="display:flex;gap:1.25rem;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--line)">
        <div><div style="font-size:.7rem;color:var(--muted);text-transform:uppercase;font-weight:700">Items</div><strong><?= (int)$rk['item_count'] ?></strong></div>
        <div><div style="font-size:.7rem;color:var(--muted);text-transform:uppercase;font-weight:700">Qty</div><strong><?= e(number_format((float)$rk['total_qty'],1)) ?></strong></div>
        <div><div style="font-size:.7rem;color:var(--muted);text-transform:uppercase;font-weight:700">Capacity</div><strong><?= (int)$rk['capacity'] ?: '—' ?></strong></div>
      </div>
    </div>
  </div>
<?php endforeach; ?>
</div>

<div class="modal-backdrop" id="rackModal">
  <div class="modal">
    <div class="modal-head"><h2>Rack</h2><button type="button" class="icon-btn" data-close-modal="rackModal">✕</button></div>
    <div class="modal-body">
      <form method="post" id="rackForm" class="form-grid">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" id="rackId">
        <div class="field"><label>Code</label><input name="code" id="r_code" required placeholder="R-A1"></div>
        <div class="field"><label>Name</label><input name="name" id="r_name" required></div>
        <div class="field"><label>Zone</label><input name="zone" id="r_zone" placeholder="Warehouse / Showroom"></div>
        <div class="field"><label>Aisle</label><input name="aisle" id="r_aisle"></div>
        <div class="field"><label>Shelf</label><input name="shelf" id="r_shelf"></div>
        <div class="field"><label>Capacity</label><input type="number" name="capacity" id="r_capacity" value="0"></div>
        <div class="field full"><label>Notes</label><textarea name="notes" id="r_notes"></textarea></div>
        <div class="form-actions full">
          <button type="button" class="btn btn-outline" data-close-modal="rackModal">Cancel</button>
          <button class="btn btn-primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</div>
<script>
function editRack(r){
  document.getElementById('rackId').value=r.id;
  document.getElementById('r_code').value=r.code||'';
  document.getElementById('r_name').value=r.name||'';
  document.getElementById('r_zone').value=r.zone||'';
  document.getElementById('r_aisle').value=r.aisle||'';
  document.getElementById('r_shelf').value=r.shelf||'';
  document.getElementById('r_capacity').value=r.capacity||0;
  document.getElementById('r_notes').value=r.notes||'';
  openModal('rackModal');
}
</script>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
