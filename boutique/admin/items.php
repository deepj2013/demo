<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('items');
$pageTitle = 'Item Master';
$activeNav = 'items';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    $action = $_POST['action'] ?? '';
    try {
        if ($action === 'save') {
            $id = (int)($_POST['id'] ?? 0);
            $name = trim($_POST['name'] ?? '');
            $sku = trim($_POST['sku'] ?? '');
            $slug = slugify($name);
            $image = null;
            if (!empty($_FILES['image']['name'])) {
                $image = upload_image($_FILES['image'], 'products');
            }
            if ($id > 0) {
                $sql = 'UPDATE items SET sku=?, name=?, slug=?, category_id=?, item_type=?, unit=?, description=?, color=?, size=?, material=?, cost_price=?, sell_price=?, min_stock=?, is_sellable=?, is_active=?';
                $params = [
                    $sku, $name, $slug,
                    $_POST['category_id'] ?: null,
                    $_POST['item_type'] ?? 'raw',
                    $_POST['unit'] ?? 'pcs',
                    $_POST['description'] ?? '',
                    $_POST['color'] ?? '',
                    $_POST['size'] ?? '',
                    $_POST['material'] ?? '',
                    (float)($_POST['cost_price'] ?? 0),
                    (float)($_POST['sell_price'] ?? 0),
                    (float)($_POST['min_stock'] ?? 0),
                    isset($_POST['is_sellable']) ? 1 : 0,
                    isset($_POST['is_active']) ? 1 : 0,
                ];
                if ($image) { $sql .= ', image=?'; $params[] = $image; }
                $sql .= ' WHERE id=?'; $params[] = $id;
                $pdo->prepare($sql)->execute($params);
                flash('success', 'Item updated.');
            } else {
                $pdo->prepare('INSERT INTO items (sku,name,slug,category_id,item_type,unit,description,color,size,material,cost_price,sell_price,min_stock,image,is_sellable,is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
                    ->execute([
                        $sku, $name, $slug,
                        $_POST['category_id'] ?: null,
                        $_POST['item_type'] ?? 'raw',
                        $_POST['unit'] ?? 'pcs',
                        $_POST['description'] ?? '',
                        $_POST['color'] ?? '',
                        $_POST['size'] ?? '',
                        $_POST['material'] ?? '',
                        (float)($_POST['cost_price'] ?? 0),
                        (float)($_POST['sell_price'] ?? 0),
                        (float)($_POST['min_stock'] ?? 0),
                        $image,
                        isset($_POST['is_sellable']) ? 1 : 0,
                        1,
                    ]);
                flash('success', 'Item created.');
            }
        } elseif ($action === 'delete') {
            $pdo->prepare('UPDATE items SET is_active=0 WHERE id=?')->execute([(int)$_POST['id']]);
            flash('success', 'Item archived.');
        }
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
    }
    redirect('admin/items.php');
}

$typeFilter = $_GET['type'] ?? 'all';
$q = trim($_GET['q'] ?? '');
$cats = $pdo->query('SELECT * FROM categories WHERE is_active=1 ORDER BY name')->fetchAll();

$sql = "
  SELECT i.*, c.name AS category_name,
         COALESCE((SELECT SUM(qty) FROM inventory WHERE item_id=i.id),0) AS stock_qty
  FROM items i
  LEFT JOIN categories c ON c.id=i.category_id
  WHERE i.is_active=1
";
$params = [];
if ($typeFilter === 'raw') {
    $sql .= " AND i.item_type IN ('raw','accessory','consumable')";
} elseif ($typeFilter === 'finished') {
    $sql .= " AND i.item_type='finished'";
} elseif (in_array($typeFilter, ['accessory','consumable'], true)) {
    $sql .= " AND i.item_type=?";
    $params[] = $typeFilter;
}
if ($q !== '') {
    $sql .= " AND (i.name LIKE ? OR i.sku LIKE ? OR i.color LIKE ? OR c.name LIKE ?)";
    $like = '%' . $q . '%';
    array_push($params, $like, $like, $like, $like);
}
$sql .= " ORDER BY i.updated_at DESC";
$st = $pdo->prepare($sql);
$st->execute($params);
$items = $st->fetchAll();

$counts = [
    'all' => (int)$pdo->query("SELECT COUNT(*) FROM items WHERE is_active=1")->fetchColumn(),
    'raw' => (int)$pdo->query("SELECT COUNT(*) FROM items WHERE is_active=1 AND item_type IN ('raw','accessory','consumable')")->fetchColumn(),
    'finished' => (int)$pdo->query("SELECT COUNT(*) FROM items WHERE is_active=1 AND item_type='finished'")->fetchColumn(),
];

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="type-tabs">
  <a href="?type=all" class="<?= $typeFilter==='all'?'active':'' ?>">All (<?= $counts['all'] ?>)</a>
  <a href="?type=raw" class="<?= $typeFilter==='raw'?'active':'' ?>">Raw & materials (<?= $counts['raw'] ?>)</a>
  <a href="?type=finished" class="<?= $typeFilter==='finished'?'active':'' ?>">Finished products (<?= $counts['finished'] ?>)</a>
</div>
<div class="toolbar">
  <form method="get" style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;flex:1">
    <input type="hidden" name="type" value="<?= e($typeFilter) ?>">
    <input type="search" name="q" id="tableSearch" class="filter-input" value="<?= e($q) ?>" placeholder="Search SKU, name, colour…" style="border-radius:999px;min-width:220px">
    <button class="btn btn-outline btn-sm" type="submit">Search</button>
  </form>
  <div class="spacer"></div>
  <button class="btn btn-outline" type="button" onclick="openModal('itemModal');document.getElementById('itemForm').reset();document.getElementById('itemId').value='';document.getElementById('f_item_type').value='raw';document.getElementById('modalTitle').textContent='New raw / material item';document.getElementById('f_is_sellable').checked=false">+ Raw item</button>
  <button class="btn btn-primary" type="button" onclick="openModal('itemModal');document.getElementById('itemForm').reset();document.getElementById('itemId').value='';document.getElementById('f_item_type').value='finished';document.getElementById('modalTitle').textContent='New finished product';document.getElementById('f_is_sellable').checked=true">+ Finished product</button>
</div>

<div class="panel">
  <div class="table-wrap">
    <table class="data">
      <thead>
        <tr><th></th><th>SKU</th><th>Name</th><th>Type</th><th>Category</th><th>Stock</th><th>Cost</th><th>Sell</th><th>Shop</th><th></th></tr>
      </thead>
      <tbody>
      <?php foreach ($items as $it): ?>
        <tr>
          <td>
            <?php if ($it['image']): ?>
              <img class="thumb" src="<?= e(asset($it['image'])) ?>" alt="">
            <?php else: ?>
              <div class="thumb-ph">IMG</div>
            <?php endif; ?>
          </td>
          <td><?= e($it['sku']) ?></td>
          <td>
            <strong><?= e($it['name']) ?></strong>
            <?php if ($it['color']): ?><div style="font-size:.75rem;color:var(--muted)"><?= e($it['color']) ?><?= $it['size'] ? ' · '.e($it['size']) : '' ?></div><?php endif; ?>
          </td>
          <td><span class="badge badge-muted"><?= e($it['item_type']) ?></span></td>
          <td><?= e($it['category_name'] ?: '—') ?></td>
          <td>
            <?php $low = (float)$it['stock_qty'] < (float)$it['min_stock']; ?>
            <span class="badge <?= $low ? 'badge-warn' : 'badge-ok' ?>"><?= e(number_format((float)$it['stock_qty'],1)) ?> <?= e($it['unit']) ?></span>
          </td>
          <td><?= e(money($it['cost_price'])) ?></td>
          <td><?= e(money($it['sell_price'])) ?></td>
          <td><?= $it['is_sellable'] ? '<span class="badge badge-ok">Yes</span>' : '<span class="badge badge-muted">No</span>' ?></td>
          <td>
            <button type="button" class="btn btn-outline btn-sm" onclick='editItem(<?= json_encode($it, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_AMP) ?>)'>Edit</button>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<div class="modal-backdrop" id="itemModal">
  <div class="modal">
    <div class="modal-head">
      <h2 id="modalTitle">New item</h2>
      <button type="button" class="icon-btn" data-close-modal="itemModal">✕</button>
    </div>
    <div class="modal-body">
      <form method="post" enctype="multipart/form-data" id="itemForm" class="form-grid">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" id="itemId" value="">
        <div class="field"><label>SKU</label><input name="sku" id="f_sku" required></div>
        <div class="field"><label>Name</label><input name="name" id="f_name" required></div>
        <div class="field">
          <label>Category</label>
          <select name="category_id" id="f_category_id">
            <option value="">—</option>
            <?php foreach ($cats as $c): ?><option value="<?= (int)$c['id'] ?>"><?= e($c['name']) ?></option><?php endforeach; ?>
          </select>
        </div>
        <div class="field">
          <label>Type</label>
          <select name="item_type" id="f_item_type">
            <option value="raw">Raw material</option>
            <option value="accessory">Accessory</option>
            <option value="consumable">Consumable</option>
            <option value="finished">Finished garment</option>
          </select>
        </div>
        <div class="field"><label>Unit</label><input name="unit" id="f_unit" value="pcs"></div>
        <div class="field"><label>Color</label><input name="color" id="f_color"></div>
        <div class="field"><label>Size</label><input name="size" id="f_size"></div>
        <div class="field"><label>Material</label><input name="material" id="f_material"></div>
        <div class="field"><label>Cost price</label><input type="number" step="0.01" name="cost_price" id="f_cost_price" value="0"></div>
        <div class="field"><label>Sell price</label><input type="number" step="0.01" name="sell_price" id="f_sell_price" value="0"></div>
        <div class="field"><label>Min stock</label><input type="number" step="0.01" name="min_stock" id="f_min_stock" value="0"></div>
        <div class="field"><label>Photo</label><input type="file" name="image" accept="image/*"></div>
        <div class="field full"><label>Description</label><textarea name="description" id="f_description"></textarea></div>
        <div class="field"><label><input type="checkbox" name="is_sellable" id="f_is_sellable"> Sell on ecommerce</label></div>
        <div class="field"><label><input type="checkbox" name="is_active" id="f_is_active" checked> Active</label></div>
        <div class="form-actions full">
          <button type="button" class="btn btn-outline" data-close-modal="itemModal">Cancel</button>
          <button class="btn btn-primary" type="submit">Save item</button>
        </div>
      </form>
    </div>
  </div>
</div>
<script>
function editItem(it){
  document.getElementById('modalTitle').textContent='Edit item';
  document.getElementById('itemId').value=it.id;
  document.getElementById('f_sku').value=it.sku||'';
  document.getElementById('f_name').value=it.name||'';
  document.getElementById('f_category_id').value=it.category_id||'';
  document.getElementById('f_item_type').value=it.item_type||'raw';
  document.getElementById('f_unit').value=it.unit||'pcs';
  document.getElementById('f_color').value=it.color||'';
  document.getElementById('f_size').value=it.size||'';
  document.getElementById('f_material').value=it.material||'';
  document.getElementById('f_cost_price').value=it.cost_price||0;
  document.getElementById('f_sell_price').value=it.sell_price||0;
  document.getElementById('f_min_stock').value=it.min_stock||0;
  document.getElementById('f_description').value=it.description||'';
  document.getElementById('f_is_sellable').checked=!!+it.is_sellable;
  document.getElementById('f_is_active').checked=!!+it.is_active;
  openModal('itemModal');
}
</script>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
