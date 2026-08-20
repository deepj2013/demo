<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('items');
$pageTitle = 'Category Master';
$activeNav = 'categories';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    $action = $_POST['action'] ?? 'save';
    try {
        if ($action === 'save') {
            $id = (int)($_POST['id'] ?? 0);
            $name = trim($_POST['name'] ?? '');
            if ($name === '') throw new RuntimeException('Category name is required.');
            $slug = slugify($name);
            $type = $_POST['type'] ?? 'raw';
            if (!in_array($type, ['raw','finished','accessory','service'], true)) $type = 'raw';
            $parentId = $_POST['parent_id'] !== '' ? (int)$_POST['parent_id'] : null;
            $description = trim($_POST['description'] ?? '');

            // Avoid self-parent
            if ($parentId && $id > 0 && $parentId === $id) {
                throw new RuntimeException('Category cannot be its own parent.');
            }

            if ($id > 0) {
                // Keep slug unique if renamed
                $chk = $pdo->prepare('SELECT id FROM categories WHERE slug=? AND id<>? LIMIT 1');
                $chk->execute([$slug, $id]);
                if ($chk->fetch()) $slug = $slug . '-' . $id;
                $pdo->prepare('UPDATE categories SET name=?, slug=?, type=?, parent_id=?, description=?, is_active=1 WHERE id=?')
                    ->execute([$name, $slug, $type, $parentId, $description, $id]);
                flash('success', 'Category updated.');
            } else {
                $base = $slug;
                $i = 1;
                while (true) {
                    $chk = $pdo->prepare('SELECT id FROM categories WHERE slug=? LIMIT 1');
                    $chk->execute([$slug]);
                    if (!$chk->fetch()) break;
                    $slug = $base . '-' . (++$i);
                }
                $pdo->prepare('INSERT INTO categories (name, slug, type, parent_id, description, is_active) VALUES (?,?,?,?,?,1)')
                    ->execute([$name, $slug, $type, $parentId, $description]);
                flash('success', 'Category created.');
            }
        } elseif ($action === 'delete') {
            $id = (int)$_POST['id'];
            $st = $pdo->prepare('SELECT COUNT(*) FROM items WHERE category_id=? AND is_active=1');
            $st->execute([$id]);
            $used = (int)$st->fetchColumn();
            $pdo->prepare('UPDATE categories SET is_active=0 WHERE id=?')->execute([$id]);
            if ($used > 0) {
                flash('success', 'Category archived (still linked on ' . $used . ' item(s)).');
            } else {
                flash('success', 'Category archived.');
            }
        }
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
    }
    redirect('admin/categories.php');
}

$cats = $pdo->query("
  SELECT c.*,
    p.name AS parent_name,
    (SELECT COUNT(*) FROM items i WHERE i.category_id=c.id AND i.is_active=1) AS item_count
  FROM categories c
  LEFT JOIN categories p ON p.id = c.parent_id
  WHERE c.is_active=1
  ORDER BY c.type, c.name
")->fetchAll();

$parents = $pdo->query('SELECT id, name, type FROM categories WHERE is_active=1 ORDER BY name')->fetchAll();

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="toolbar">
  <input type="search" id="tableSearch" class="filter-input" placeholder="Search categories…" style="border-radius:999px;min-width:220px">
  <div class="spacer"></div>
  <button class="btn btn-primary" type="button" onclick="openModal('catModal');document.getElementById('catForm').reset();document.getElementById('catId').value='';document.getElementById('modalTitle').textContent='New category'">+ Add category</button>
</div>

<div class="panel">
  <div class="table-wrap">
    <table class="data">
      <thead>
        <tr><th>Name</th><th>Type</th><th>Parent</th><th>Items</th><th>Slug</th><th></th></tr>
      </thead>
      <tbody>
      <?php if (!$cats): ?>
        <tr><td colspan="6" style="color:var(--muted)">No categories yet. Click <strong>+ Add category</strong>.</td></tr>
      <?php endif; ?>
      <?php foreach ($cats as $c): ?>
        <tr>
          <td>
            <strong><?= e($c['name']) ?></strong>
            <?php if ($c['description']): ?><div style="font-size:.75rem;color:var(--muted)"><?= e(mb_strimwidth($c['description'], 0, 80, '…')) ?></div><?php endif; ?>
          </td>
          <td><span class="badge badge-muted"><?= e($c['type']) ?></span></td>
          <td><?= e($c['parent_name'] ?: '—') ?></td>
          <td><?= (int)$c['item_count'] ?></td>
          <td><code style="font-size:.75rem"><?= e($c['slug']) ?></code></td>
          <td style="white-space:nowrap">
            <button type="button" class="btn btn-outline btn-sm" onclick='editCat(<?= json_encode($c, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_AMP) ?>)'>Edit</button>
            <form method="post" style="display:inline" onsubmit="return confirm('Archive this category?')">
              <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
              <input type="hidden" name="action" value="delete">
              <input type="hidden" name="id" value="<?= (int)$c['id'] ?>">
              <button class="btn btn-outline btn-sm" type="submit">Archive</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<div class="modal-backdrop" id="catModal">
  <div class="modal">
    <div class="modal-head">
      <h2 id="modalTitle">New category</h2>
      <button type="button" class="icon-btn" data-close-modal="catModal">✕</button>
    </div>
    <div class="modal-body">
      <form method="post" id="catForm" class="form-grid">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" id="catId" value="">
        <div class="field"><label>Name</label><input name="name" id="c_name" required placeholder="e.g. Fabrics, Ready Garments"></div>
        <div class="field">
          <label>Type</label>
          <select name="type" id="c_type">
            <option value="raw">Raw material</option>
            <option value="accessory">Accessory</option>
            <option value="finished">Finished</option>
            <option value="service">Service</option>
          </select>
        </div>
        <div class="field full">
          <label>Parent category (optional)</label>
          <select name="parent_id" id="c_parent">
            <option value="">— None —</option>
            <?php foreach ($parents as $p): ?>
              <option value="<?= (int)$p['id'] ?>"><?= e($p['name']) ?> (<?= e($p['type']) ?>)</option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="field full"><label>Description</label><textarea name="description" id="c_description" placeholder="Optional notes"></textarea></div>
        <div class="form-actions full">
          <button type="button" class="btn btn-outline" data-close-modal="catModal">Cancel</button>
          <button class="btn btn-primary" type="submit">Save category</button>
        </div>
      </form>
    </div>
  </div>
</div>
<script>
function editCat(c){
  document.getElementById('modalTitle').textContent='Edit category';
  document.getElementById('catId').value=c.id;
  document.getElementById('c_name').value=c.name||'';
  document.getElementById('c_type').value=c.type||'raw';
  document.getElementById('c_parent').value=c.parent_id||'';
  document.getElementById('c_description').value=c.description||'';
  openModal('catModal');
}
</script>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
