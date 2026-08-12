<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('costing');
$pageTitle = 'Costing / BOM';
$activeNav = 'costing';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    $action = $_POST['action'] ?? '';
    try {
        if ($action === 'create_bom') {
            $pdo->prepare('INSERT INTO bom_headers (finished_item_id,name,labour_hours,labour_rate,overhead_percent,markup_percent,notes) VALUES (?,?,?,?,?,?,?)')
                ->execute([
                    (int)$_POST['finished_item_id'],
                    trim($_POST['name'] ?? 'BOM'),
                    (float)($_POST['labour_hours'] ?? 0),
                    (float)($_POST['labour_rate'] ?? 0),
                    (float)($_POST['overhead_percent'] ?? 0),
                    (float)($_POST['markup_percent'] ?? 30),
                    trim($_POST['notes'] ?? ''),
                ]);
            flash('success', 'BOM created. Add materials next.');
        } elseif ($action === 'add_line') {
            $bomId = (int)$_POST['bom_id'];
            $matId = (int)$_POST['material_item_id'];
            $qty = (float)$_POST['qty'];
            $waste = (float)($_POST['waste_percent'] ?? 0);
            $st = $pdo->prepare('SELECT cost_price FROM items WHERE id=?');
            $st->execute([$matId]);
            $unitCost = (float)$st->fetchColumn();
            $pdo->prepare('INSERT INTO bom_lines (bom_id,material_item_id,qty,waste_percent,unit_cost,line_cost) VALUES (?,?,?,?,?,0)')
                ->execute([$bomId, $matId, $qty, $waste, $unitCost]);
            recalculate_bom($bomId);
            flash('success', 'Material added & cost recalculated.');
        } elseif ($action === 'update_labour') {
            $bomId = (int)$_POST['bom_id'];
            $pdo->prepare('UPDATE bom_headers SET labour_hours=?, labour_rate=?, overhead_percent=?, markup_percent=? WHERE id=?')
                ->execute([
                    (float)$_POST['labour_hours'],
                    (float)$_POST['labour_rate'],
                    (float)$_POST['overhead_percent'],
                    (float)$_POST['markup_percent'],
                    $bomId,
                ]);
            $r = recalculate_bom($bomId);
            flash('success', 'Recalculated. True cost: ' . money($r['cost']) . ' · Suggested: ' . money($r['price']));
        } elseif ($action === 'recalc') {
            $r = recalculate_bom((int)$_POST['bom_id']);
            flash('success', 'Cost: ' . money($r['cost']) . ' · Price: ' . money($r['price']));
        } elseif ($action === 'delete_line') {
            $lineId = (int)$_POST['line_id'];
            $st = $pdo->prepare('SELECT bom_id FROM bom_lines WHERE id=?');
            $st->execute([$lineId]);
            $bomId = (int)$st->fetchColumn();
            $pdo->prepare('DELETE FROM bom_lines WHERE id=?')->execute([$lineId]);
            if ($bomId) recalculate_bom($bomId);
            flash('success', 'Line removed.');
        }
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
    }
    $q = isset($_POST['bom_id']) ? '?id='.(int)$_POST['bom_id'] : '';
    redirect('admin/costing.php'.$q);
}

$boms = $pdo->query("
  SELECT b.*, i.name AS garment, i.sku
  FROM bom_headers b
  JOIN items i ON i.id=b.finished_item_id
  WHERE b.is_active=1
  ORDER BY b.updated_at DESC
")->fetchAll();

$viewId = (int)($_GET['id'] ?? ($boms[0]['id'] ?? 0));
$view = null;
$lines = [];
if ($viewId) {
    $st = $pdo->prepare("SELECT b.*, i.name AS garment, i.sku, i.sell_price FROM bom_headers b JOIN items i ON i.id=b.finished_item_id WHERE b.id=?");
    $st->execute([$viewId]);
    $view = $st->fetch();
    if ($view) {
        $ls = $pdo->prepare("SELECT l.*, i.name AS material, i.sku AS mat_sku, i.unit FROM bom_lines l JOIN items i ON i.id=l.material_item_id WHERE l.bom_id=?");
        $ls->execute([$viewId]);
        $lines = $ls->fetchAll();
    }
}

$finished = $pdo->query("SELECT id, sku, name FROM items WHERE item_type='finished' AND is_active=1 ORDER BY name")->fetchAll();
$materials = $pdo->query("SELECT id, sku, name, unit, cost_price FROM items WHERE item_type IN ('raw','accessory','consumable') AND is_active=1 ORDER BY name")->fetchAll();
require_once ROOT_PATH . '/includes/item_picker.php';

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="toolbar">
  <div class="spacer"></div>
  <button class="btn btn-primary" type="button" onclick="openModal('bomModal')">+ New BOM</button>
</div>

<div class="grid grid-2">
  <div class="panel">
    <div class="panel-head"><h2>Bill of Materials</h2></div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Garment</th><th>True cost</th><th>Suggested</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($boms as $b): ?>
          <tr style="<?= $viewId===(int)$b['id']?'background:rgba(196,165,116,.1)':'' ?>">
            <td><strong><?= e($b['garment']) ?></strong><div style="font-size:.75rem;color:var(--muted)"><?= e($b['name']) ?></div></td>
            <td><?= e(money($b['calculated_cost'])) ?></td>
            <td><?= e(money($b['suggested_price'])) ?></td>
            <td><a class="btn btn-outline btn-sm" href="?id=<?= (int)$b['id'] ?>">Open</a></td>
          </tr>
        <?php endforeach; ?>
        <?php if (!$boms): ?><tr><td colspan="4"><div class="empty">Create a BOM for a finished garment.</div></td></tr><?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>

  <div class="panel">
    <?php if (!$view): ?>
      <div class="empty"><h3>Select a BOM</h3><p>See materials, wages & real cost.</p></div>
    <?php else: ?>
      <div class="panel-head">
        <div>
          <h2><?= e($view['garment']) ?></h2>
          <div style="font-size:.8rem;color:var(--muted)"><?= e($view['sku']) ?> · <?= e($view['name']) ?></div>
        </div>
        <form method="post">
          <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
          <input type="hidden" name="action" value="recalc">
          <input type="hidden" name="bom_id" value="<?= (int)$view['id'] ?>">
          <button class="btn btn-accent btn-sm" type="submit">Recalculate</button>
        </form>
      </div>
      <div class="panel-body">
        <div class="grid grid-3" style="margin-bottom:1rem">
          <div class="stat-card" style="padding:.85rem"><div class="label">True cost</div><div class="value" style="font-size:1.35rem"><?= e(money($view['calculated_cost'])) ?></div></div>
          <div class="stat-card" style="padding:.85rem"><div class="label">Suggested price</div><div class="value" style="font-size:1.35rem"><?= e(money($view['suggested_price'])) ?></div></div>
          <div class="stat-card" style="padding:.85rem"><div class="label">Current sell</div><div class="value" style="font-size:1.35rem"><?= e(money($view['sell_price'])) ?></div></div>
        </div>

        <h3 style="font-size:1rem;margin-bottom:.65rem">Materials</h3>
        <div class="table-wrap" style="margin-bottom:1rem">
          <table class="data">
            <thead><tr><th>Material</th><th>Qty</th><th>Waste%</th><th>Unit</th><th>Line</th><th></th></tr></thead>
            <tbody>
            <?php foreach ($lines as $ln): ?>
              <tr>
                <td><?= e($ln['material']) ?><div style="font-size:.72rem;color:var(--muted)"><?= e($ln['mat_sku']) ?></div></td>
                <td><?= e(number_format((float)$ln['qty'],3)) ?> <?= e($ln['unit']) ?></td>
                <td><?= e($ln['waste_percent']) ?>%</td>
                <td><?= e(money($ln['unit_cost'])) ?></td>
                <td><?= e(money($ln['line_cost'])) ?></td>
                <td>
                  <form method="post" style="display:inline" onsubmit="return confirm('Remove?')">
                    <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
                    <input type="hidden" name="action" value="delete_line">
                    <input type="hidden" name="line_id" value="<?= (int)$ln['id'] ?>">
                    <input type="hidden" name="bom_id" value="<?= (int)$view['id'] ?>">
                    <button class="btn btn-ghost btn-sm" style="color:#B42318;background:transparent" type="submit">✕</button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
            </tbody>
          </table>
        </div>

        <form method="post" class="form-grid" style="margin-bottom:1.25rem;padding:1rem;background:rgba(11,18,32,.02);border-radius:12px">
          <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
          <input type="hidden" name="action" value="add_line">
          <input type="hidden" name="bom_id" value="<?= (int)$view['id'] ?>">
          <div class="field full">
            <?php item_picker_field([
              'name' => 'material_item_id',
              'id' => 'bom_material_picker',
              'required' => true,
              'label' => 'Add material',
              'types' => 'raw,accessory,consumable',
              'placeholder' => 'Search fabric, thread, button by name or SKU…',
            ]); ?>
          </div>
          <div class="field"><label>Qty</label><input type="number" step="0.001" name="qty" value="1" required></div>
          <div class="field"><label>Waste %</label><input type="number" step="0.01" name="waste_percent" value="0"></div>
          <div class="form-actions full"><button class="btn btn-outline btn-sm" type="submit">Add material</button></div>
        </form>

        <h3 style="font-size:1rem;margin-bottom:.65rem">Labour & markup</h3>
        <form method="post" class="form-grid">
          <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
          <input type="hidden" name="action" value="update_labour">
          <input type="hidden" name="bom_id" value="<?= (int)$view['id'] ?>">
          <div class="field"><label>Labour hours</label><input type="number" step="0.01" name="labour_hours" value="<?= e($view['labour_hours']) ?>"></div>
          <div class="field"><label>Rate / hour</label><input type="number" step="0.01" name="labour_rate" value="<?= e($view['labour_rate']) ?>"></div>
          <div class="field"><label>Overhead %</label><input type="number" step="0.01" name="overhead_percent" value="<?= e($view['overhead_percent']) ?>"></div>
          <div class="field"><label>Markup %</label><input type="number" step="0.01" name="markup_percent" value="<?= e($view['markup_percent']) ?>"></div>
          <div class="form-actions full"><button class="btn btn-primary" type="submit">Update & recalculate</button></div>
        </form>

        <?php
          $matTotal = array_sum(array_map(fn($l)=>(float)$l['line_cost'], $lines));
          $labour = (float)$view['labour_hours'] * (float)$view['labour_rate'];
          $overhead = ($matTotal + $labour) * ((float)$view['overhead_percent']/100);
        ?>
        <div style="margin-top:1.25rem;padding:1rem;border-radius:12px;background:var(--primary);color:#fff">
          <div style="display:flex;justify-content:space-between;font-size:.9rem;opacity:.8;margin-bottom:.35rem"><span>Materials</span><span><?= e(money($matTotal)) ?></span></div>
          <div style="display:flex;justify-content:space-between;font-size:.9rem;opacity:.8;margin-bottom:.35rem"><span>Labour wages</span><span><?= e(money($labour)) ?></span></div>
          <div style="display:flex;justify-content:space-between;font-size:.9rem;opacity:.8;margin-bottom:.65rem"><span>Overhead</span><span><?= e(money($overhead)) ?></span></div>
          <div style="display:flex;justify-content:space-between;font-family:Fraunces,serif;font-size:1.25rem;border-top:1px solid rgba(255,255,255,.15);padding-top:.65rem"><span>Real cost</span><span><?= e(money($view['calculated_cost'])) ?></span></div>
        </div>
      </div>
    <?php endif; ?>
  </div>
</div>

<div class="modal-backdrop" id="bomModal">
  <div class="modal">
    <div class="modal-head"><h2>New BOM</h2><button type="button" class="icon-btn" data-close-modal="bomModal">✕</button></div>
    <div class="modal-body">
      <form method="post" class="form-grid">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="create_bom">
        <div class="field full">
          <label>Finished garment</label>
          <select name="finished_item_id" required>
            <?php foreach ($finished as $f): ?><option value="<?= (int)$f['id'] ?>"><?= e($f['sku'].' — '.$f['name']) ?></option><?php endforeach; ?>
          </select>
        </div>
        <div class="field full"><label>BOM name</label><input name="name" required placeholder="Dress BOM v1"></div>
        <div class="field"><label>Labour hours</label><input type="number" step="0.01" name="labour_hours" value="4"></div>
        <div class="field"><label>Rate / hour</label><input type="number" step="0.01" name="labour_rate" value="150"></div>
        <div class="field"><label>Overhead %</label><input type="number" step="0.01" name="overhead_percent" value="10"></div>
        <div class="field"><label>Markup %</label><input type="number" step="0.01" name="markup_percent" value="40"></div>
        <div class="form-actions full">
          <button type="button" class="btn btn-outline" data-close-modal="bomModal">Cancel</button>
          <button class="btn btn-primary" type="submit">Create</button>
        </div>
      </form>
    </div>
  </div>
</div>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
