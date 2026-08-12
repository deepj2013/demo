<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_once ROOT_PATH . '/includes/shop_helpers.php';
require_login();
require_module('ecommerce');
$pageTitle = 'Shop products';
$activeNav = 'shop_products';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    $action = $_POST['action'] ?? 'save';
    try {
        if ($action === 'save') {
            $id = (int)($_POST['id'] ?? 0);
            $name = trim($_POST['name'] ?? '');
            $sku = trim($_POST['sku'] ?? '');
            if ($name === '' || $sku === '') throw new RuntimeException('Name and SKU required.');
            $slug = slugify($name);
            $image = null;
            if (!empty($_FILES['image']['name'])) {
                $image = upload_image($_FILES['image'], 'products');
            }
            $fields = [
                $sku, $name, $slug,
                $_POST['category_id'] ?: null,
                'finished',
                $_POST['unit'] ?? 'pcs',
                trim($_POST['description'] ?? ''),
                trim($_POST['color'] ?? ''),
                trim($_POST['size'] ?? ''),
                trim($_POST['material'] ?? ''),
                (float)($_POST['cost_price'] ?? 0),
                (float)($_POST['sell_price'] ?? 0),
                (float)($_POST['min_stock'] ?? 1),
                1, // sellable
                1,
            ];
            if ($id > 0) {
                $sql = 'UPDATE items SET sku=?,name=?,slug=?,category_id=?,item_type=?,unit=?,description=?,color=?,size=?,material=?,cost_price=?,sell_price=?,min_stock=?,is_sellable=?,is_active=?';
                if ($image) { $sql .= ', image=?'; $fields[] = $image; }
                $sql .= ' WHERE id=?';
                $fields[] = $id;
                $pdo->prepare($sql)->execute($fields);
                flash('success', 'Sale item updated.');
            } else {
                $pdo->prepare('INSERT INTO items (sku,name,slug,category_id,item_type,unit,description,color,size,material,cost_price,sell_price,min_stock,is_sellable,is_active,image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
                    ->execute([...$fields, $image]);
                $newId = (int)$pdo->lastInsertId();
                $qty = (float)($_POST['opening_qty'] ?? 0);
                $rackId = $_POST['rack_id'] !== '' ? (int)$_POST['rack_id'] : null;
                if ($qty > 0) {
                    adjust_stock($newId, $rackId, $qty, 'in', (float)($_POST['cost_price'] ?? 0), 'opening', $newId, 'Opening stock for shop item');
                }
                flash('success', 'Sale item created and ready for the shop.');
            }
        } elseif ($action === 'toggle') {
            $id = (int)$_POST['id'];
            $pdo->prepare('UPDATE items SET is_sellable = IF(is_sellable=1,0,1) WHERE id=?')->execute([$id]);
            flash('success', 'Sellable flag updated.');
        }
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
    }
    redirect('admin/shop_products.php');
}

$cats = $pdo->query("SELECT id, name FROM categories WHERE is_active=1 ORDER BY name")->fetchAll();
$racks = $pdo->query('SELECT id, code, name FROM racks WHERE is_active=1 ORDER BY code')->fetchAll();
$products = $pdo->query("
  SELECT i.*, COALESCE((SELECT SUM(qty) FROM inventory WHERE item_id=i.id),0) AS stock
  FROM items i
  WHERE i.is_active=1 AND i.item_type='finished'
  ORDER BY i.updated_at DESC
")->fetchAll();

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="toolbar">
  <a class="btn btn-outline btn-sm" href="<?= e(url('shop/')) ?>" target="_blank">Preview shop</a>
  <div class="spacer"></div>
  <button class="btn btn-primary" type="button" onclick="openModal('saleModal');document.getElementById('saleForm').reset();document.getElementById('saleId').value=''">+ New sale item</button>
</div>

<div class="panel">
  <div class="panel-head"><h2>Finished garments for ecommerce</h2></div>
  <div class="table-wrap">
    <table class="data">
      <thead><tr><th></th><th>SKU</th><th>Name</th><th>Price</th><th>Stock</th><th>Shop</th><th></th></tr></thead>
      <tbody>
      <?php foreach ($products as $p): ?>
        <tr>
          <td><?php if ($p['image']): ?><img class="thumb" src="<?= e(asset($p['image'])) ?>" alt=""><?php else: ?><div class="thumb-ph">IMG</div><?php endif; ?></td>
          <td><?= e($p['sku']) ?></td>
          <td><strong><?= e($p['name']) ?></strong>
            <div style="font-size:.75rem;color:var(--muted)"><?= e($p['color']) ?> <?= $p['size'] ? '· '.e($p['size']) : '' ?></div>
          </td>
          <td><?= e(money($p['sell_price'])) ?></td>
          <td><?= e(number_format((float)$p['stock'],1)) ?></td>
          <td><?= $p['is_sellable'] ? '<span class="badge badge-ok">Live</span>' : '<span class="badge badge-muted">Hidden</span>' ?></td>
          <td style="display:flex;gap:.35rem">
            <button type="button" class="btn btn-outline btn-sm" onclick='editSale(<?= json_encode($p, JSON_HEX_TAG|JSON_HEX_APOS) ?>)'>Edit</button>
            <form method="post" style="display:inline">
              <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
              <input type="hidden" name="action" value="toggle">
              <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
              <button class="btn btn-sm <?= $p['is_sellable']?'btn-outline':'btn-accent' ?>" type="submit"><?= $p['is_sellable']?'Hide':'Publish' ?></button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
      <?php if (!$products): ?><tr><td colspan="7"><div class="empty">Create your first sale item with a photo.</div></td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<div class="modal-backdrop" id="saleModal">
  <div class="modal" style="width:min(720px,100%)">
    <div class="modal-head"><h2>Sale item</h2><button type="button" class="icon-btn" data-close-modal="saleModal">✕</button></div>
    <div class="modal-body">
      <form method="post" enctype="multipart/form-data" id="saleForm" class="form-grid">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" id="saleId">
        <div class="field"><label>SKU</label><input name="sku" id="s_sku" required placeholder="GAR-NEW-001"></div>
        <div class="field"><label>Name</label><input name="name" id="s_name" required placeholder="Ivory midi dress"></div>
        <div class="field"><label>Category</label>
          <select name="category_id" id="s_cat"><option value="">—</option>
            <?php foreach ($cats as $c): ?><option value="<?= (int)$c['id'] ?>"><?= e($c['name']) ?></option><?php endforeach; ?>
          </select>
        </div>
        <div class="field"><label>Unit</label><input name="unit" id="s_unit" value="pcs"></div>
        <div class="field"><label>Color</label><input name="color" id="s_color"></div>
        <div class="field"><label>Size</label><input name="size" id="s_size" placeholder="S / M / L"></div>
        <div class="field"><label>Material</label><input name="material" id="s_material"></div>
        <div class="field"><label>Sell price</label><input type="number" step="0.01" name="sell_price" id="s_sell" required></div>
        <div class="field"><label>Cost price</label><input type="number" step="0.01" name="cost_price" id="s_cost" value="0"></div>
        <div class="field"><label>Min stock</label><input type="number" step="0.01" name="min_stock" id="s_min" value="1"></div>
        <div class="field"><label>Product photo</label><input type="file" name="image" accept="image/*"></div>
        <div class="field"><label>Opening qty (new only)</label><input type="number" step="0.01" name="opening_qty" value="5"></div>
        <div class="field"><label>Rack for opening stock</label>
          <select name="rack_id"><option value="">—</option>
            <?php foreach ($racks as $r): ?><option value="<?= (int)$r['id'] ?>"><?= e($r['code'].' — '.$r['name']) ?></option><?php endforeach; ?>
          </select>
        </div>
        <div class="field full"><label>Description / details</label><textarea name="description" id="s_desc" placeholder="Fabric, fit, occasion, care…"></textarea></div>
        <div class="form-actions full">
          <button type="button" class="btn btn-outline" data-close-modal="saleModal">Cancel</button>
          <button class="btn btn-primary" type="submit">Save to shop</button>
        </div>
      </form>
    </div>
  </div>
</div>
<script>
function editSale(p){
  document.getElementById('saleId').value=p.id;
  document.getElementById('s_sku').value=p.sku||'';
  document.getElementById('s_name').value=p.name||'';
  document.getElementById('s_cat').value=p.category_id||'';
  document.getElementById('s_unit').value=p.unit||'pcs';
  document.getElementById('s_color').value=p.color||'';
  document.getElementById('s_size').value=p.size||'';
  document.getElementById('s_material').value=p.material||'';
  document.getElementById('s_sell').value=p.sell_price||0;
  document.getElementById('s_cost').value=p.cost_price||0;
  document.getElementById('s_min').value=p.min_stock||1;
  document.getElementById('s_desc').value=p.description||'';
  openModal('saleModal');
}
</script>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
