<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('costing');
$pageTitle = 'Wages';
$activeNav = 'wages';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    try {
        $hours = (float)($_POST['hours'] ?? 0);
        $rate = (float)($_POST['rate'] ?? 0);
        $pdo->prepare('INSERT INTO wage_entries (worker_name,work_type,finished_item_id,bom_id,hours,rate,amount,work_date,notes,created_by) VALUES (?,?,?,?,?,?,?,?,?,?)')
            ->execute([
                trim($_POST['worker_name'] ?? ''),
                trim($_POST['work_type'] ?? 'stitching'),
                $_POST['finished_item_id'] !== '' ? (int)$_POST['finished_item_id'] : null,
                $_POST['bom_id'] !== '' ? (int)$_POST['bom_id'] : null,
                $hours,
                $rate,
                $hours * $rate,
                $_POST['work_date'] ?? date('Y-m-d'),
                trim($_POST['notes'] ?? ''),
                current_user()['id'] ?? null,
            ]);
        flash('success', 'Wage entry saved.');
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
    }
    redirect('admin/wages.php');
}

$monthTotal = (float)$pdo->query("SELECT COALESCE(SUM(amount),0) FROM wage_entries WHERE MONTH(work_date)=MONTH(CURDATE()) AND YEAR(work_date)=YEAR(CURDATE())")->fetchColumn();
$entries = $pdo->query("
  SELECT w.*, i.name AS garment
  FROM wage_entries w
  LEFT JOIN items i ON i.id=w.finished_item_id
  ORDER BY w.work_date DESC, w.id DESC
  LIMIT 100
")->fetchAll();
$finished = $pdo->query("SELECT id, name FROM items WHERE item_type='finished' AND is_active=1 ORDER BY name")->fetchAll();
$boms = $pdo->query("SELECT id, name FROM bom_headers WHERE is_active=1 ORDER BY name")->fetchAll();

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="grid grid-3" style="margin-bottom:1.25rem">
  <div class="stat-card">
    <div class="label">This month wages</div>
    <div class="value"><?= e(money($monthTotal)) ?></div>
    <div class="hint">Human labour cost</div>
  </div>
</div>

<div class="grid grid-2">
  <div class="panel">
    <div class="panel-head"><h2>Log wage</h2></div>
    <div class="panel-body">
      <form method="post" class="form-grid">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <div class="field"><label>Worker name</label><input name="worker_name" required></div>
        <div class="field"><label>Work type</label>
          <select name="work_type">
            <option>stitching</option><option>cutting</option><option>finishing</option><option>embroidery</option><option>design</option>
          </select>
        </div>
        <div class="field"><label>Garment (optional)</label>
          <select name="finished_item_id"><option value="">—</option>
            <?php foreach ($finished as $f): ?><option value="<?= (int)$f['id'] ?>"><?= e($f['name']) ?></option><?php endforeach; ?>
          </select>
        </div>
        <div class="field"><label>BOM (optional)</label>
          <select name="bom_id"><option value="">—</option>
            <?php foreach ($boms as $b): ?><option value="<?= (int)$b['id'] ?>"><?= e($b['name']) ?></option><?php endforeach; ?>
          </select>
        </div>
        <div class="field"><label>Hours</label><input type="number" step="0.25" name="hours" required></div>
        <div class="field"><label>Rate / hour</label><input type="number" step="0.01" name="rate" value="150" required></div>
        <div class="field"><label>Date</label><input type="date" name="work_date" value="<?= e(date('Y-m-d')) ?>"></div>
        <div class="field full"><label>Notes</label><textarea name="notes"></textarea></div>
        <div class="form-actions full"><button class="btn btn-primary" type="submit">Save entry</button></div>
      </form>
    </div>
  </div>
  <div class="panel">
    <div class="panel-head"><h2>Recent entries</h2></div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Date</th><th>Worker</th><th>Type</th><th>Hrs</th><th>Amount</th></tr></thead>
        <tbody>
        <?php foreach ($entries as $w): ?>
          <tr>
            <td><?= e($w['work_date']) ?></td>
            <td><?= e($w['worker_name']) ?><?php if ($w['garment']): ?><div style="font-size:.72rem;color:var(--muted)"><?= e($w['garment']) ?></div><?php endif; ?></td>
            <td><?= e($w['work_type']) ?></td>
            <td><?= e($w['hours']) ?></td>
            <td><?= e(money($w['amount'])) ?></td>
          </tr>
        <?php endforeach; ?>
        <?php if (!$entries): ?><tr><td colspan="5"><div class="empty">No wage entries yet.</div></td></tr><?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</div>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
