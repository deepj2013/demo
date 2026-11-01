<?php
require_once __DIR__ . '/_layout.php';

$products = nv_products();
$flash = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'save';
    if ($action === 'delete') {
        $id = (string) ($_POST['id'] ?? '');
        $products = array_values(array_filter($products, fn($p) => ($p['id'] ?? '') !== $id));
        nv_save_products($products);
        $flash = 'Product deleted.';
    } else {
        $id = trim((string) ($_POST['id'] ?? ''));
        if ($id === '') {
            $id = 'chai-' . preg_replace('/[^a-z0-9]+/', '-', strtolower(trim((string) $_POST['name'])));
        }
        $item = [
            'id' => $id,
            'service' => 'chai',
            'name' => trim((string) ($_POST['name'] ?? '')),
            'subtitle' => trim((string) ($_POST['subtitle'] ?? '')),
            'price' => (int) ($_POST['price'] ?? 0),
            'mrp' => (int) ($_POST['mrp'] ?? 0),
            'weight' => trim((string) ($_POST['weight'] ?? '250g')),
            'stock' => (int) ($_POST['stock'] ?? 0),
            'active' => isset($_POST['active']),
            'image' => trim((string) ($_POST['image'] ?? 'chai-classic-masala.jpg')),
            'tags' => array_values(array_filter(array_map('trim', explode(',', (string) ($_POST['tags'] ?? ''))))),
            'description' => trim((string) ($_POST['description'] ?? '')),
        ];
        $found = false;
        foreach ($products as &$p) {
            if (($p['id'] ?? '') === $id) {
                $p = $item;
                $found = true;
                break;
            }
        }
        unset($p);
        if (!$found) {
            $products[] = $item;
        }
        nv_save_products($products);
        $flash = 'Product saved.';
    }
    $products = nv_products();
}

$edit = null;
if (isset($_GET['edit'])) {
    foreach ($products as $p) {
        if (($p['id'] ?? '') === $_GET['edit']) {
            $edit = $p;
            break;
        }
    }
}

admin_header('Chai products', 'products');
?>
<?php if ($flash): ?><p style="color:#0a7a3e;"><?= nv_e($flash) ?></p><?php endif; ?>

<div class="panel" style="margin-bottom:1rem;">
  <h3 style="margin:0 0 .8rem;"><?= $edit ? 'Edit product' : 'Add product' ?></h3>
  <form method="post" class="form-inline">
    <input type="hidden" name="id" value="<?= nv_e($edit['id'] ?? '') ?>">
    <div class="row">
      <label>Name<input name="name" required value="<?= nv_e($edit['name'] ?? '') ?>"></label>
      <label>Subtitle<input name="subtitle" value="<?= nv_e($edit['subtitle'] ?? '') ?>"></label>
    </div>
    <div class="row">
      <label>Price (₹)<input type="number" name="price" required value="<?= (int)($edit['price'] ?? 0) ?>"></label>
      <label>MRP (₹)<input type="number" name="mrp" value="<?= (int)($edit['mrp'] ?? 0) ?>"></label>
    </div>
    <div class="row">
      <label>Weight<input name="weight" value="<?= nv_e($edit['weight'] ?? '250g') ?>"></label>
      <label>Stock<input type="number" name="stock" value="<?= (int)($edit['stock'] ?? 0) ?>"></label>
    </div>
    <div class="row">
      <label>Image file (in assets/img/chai/)<input name="image" value="<?= nv_e($edit['image'] ?? 'chai-classic-masala.jpg') ?>"></label>
      <label>Tags (comma)<input name="tags" value="<?= nv_e(implode(', ', $edit['tags'] ?? [])) ?>"></label>
    </div>
    <label>Description<textarea name="description" rows="3"><?= nv_e($edit['description'] ?? '') ?></textarea></label>
    <label style="display:flex;align-items:center;gap:.4rem;"><input type="checkbox" name="active" <?= ($edit['active'] ?? true) ? 'checked' : '' ?>> Active on shop</label>
    <div style="display:flex;gap:.5rem;">
      <button class="btn-ad" type="submit">Save product</button>
      <?php if ($edit): ?><a class="btn-ad btn-soft" href="<?= nv_e(NV_URL) ?>/admin/products.php">Cancel edit</a><?php endif; ?>
    </div>
  </form>
</div>

<div class="panel">
  <table>
    <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Active</th><th></th></tr></thead>
    <tbody>
    <?php foreach ($products as $p): if (($p['service'] ?? '') !== 'chai') continue; ?>
      <tr>
        <td>
          <strong><?= nv_e($p['name']) ?></strong><br>
          <small><?= nv_e($p['id']) ?> · <?= nv_e($p['image'] ?? '') ?></small>
        </td>
        <td>₹<?= (int)($p['price'] ?? 0) ?> <s style="color:#999;">₹<?= (int)($p['mrp'] ?? 0) ?></s></td>
        <td><?= (int)($p['stock'] ?? 0) ?></td>
        <td><?= !empty($p['active']) ? 'Yes' : 'No' ?></td>
        <td style="white-space:nowrap;">
          <a href="?edit=<?= urlencode((string)$p['id']) ?>">Edit</a>
          ·
          <form method="post" style="display:inline;" onsubmit="return confirm('Delete this product?');">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= nv_e($p['id']) ?>">
            <button type="submit" style="border:0;background:none;color:#c0392b;cursor:pointer;padding:0;">Delete</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</div>
<?php admin_footer(); ?>
