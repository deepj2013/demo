<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_once ROOT_PATH . '/includes/shop_helpers.php';
require_module('ecommerce');
$cfg = settings();
$pdo = db();
ensure_shop_demo_images();

$slug = trim((string) ($_GET['slug'] ?? ''));
$id = (int) ($_GET['id'] ?? 0);
if ($slug !== '') {
    $st = $pdo->prepare("SELECT i.*, COALESCE((SELECT SUM(qty) FROM inventory WHERE item_id=i.id),0) AS stock FROM items i WHERE i.slug=? AND i.is_active=1 AND i.is_sellable=1 LIMIT 1");
    $st->execute([$slug]);
} else {
    $st = $pdo->prepare("SELECT i.*, COALESCE((SELECT SUM(qty) FROM inventory WHERE item_id=i.id),0) AS stock FROM items i WHERE i.id=? AND i.is_active=1 AND i.is_sellable=1 LIMIT 1");
    $st->execute([$id]);
}
$p = $st->fetch();
if (!$p) {
    http_response_code(404);
    exit('Product not found');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($p['name']) ?> · <?= e($cfg['business_name']) ?></title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(asset('css/app.css')) ?>">
  <style>:root{--primary:<?= e($cfg['theme']['primary']) ?>;--accent:<?= e($cfg['theme']['accent']) ?>;--surface:<?= e($cfg['theme']['surface']) ?>;--ink:<?= e($cfg['theme']['ink']) ?>;--muted:<?= e($cfg['theme']['muted']) ?>}</style>
</head>
<body class="store-body">
  <nav class="store-nav">
    <a class="logo" href="<?= e(url('shop/')) ?>"><?= e($cfg['business_name']) ?></a>
    <div class="links">
      <a href="<?= e(url('shop/#collection')) ?>">Collection</a>
      <a href="<?= e(url('shop/#cart')) ?>" class="btn btn-primary btn-sm">Bag <span id="cartCount" hidden>0</span></a>
    </div>
  </nav>

  <div class="pdp">
    <div class="pdp-gallery">
      <?php if ($p['image']): ?>
        <img src="<?= e(asset($p['image'])) ?>" alt="<?= e($p['name']) ?>">
      <?php else: ?>
        <div style="height:100%;display:grid;place-items:center;color:#fff;opacity:.6">No photo</div>
      <?php endif; ?>
    </div>
    <div class="pdp-info">
      <div class="eyebrow" style="color:var(--accent);font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase"><?= e($p['sku']) ?></div>
      <h1><?= e($p['name']) ?></h1>
      <div class="pdp-meta">
        <?php if ($p['color']): ?><span class="badge badge-muted"><?= e($p['color']) ?></span><?php endif; ?>
        <?php if ($p['size']): ?><span class="badge badge-muted">Size <?= e($p['size']) ?></span><?php endif; ?>
        <?php if ($p['material']): ?><span class="badge badge-muted"><?= e($p['material']) ?></span><?php endif; ?>
        <span class="badge <?= (float)$p['stock'] > 0 ? 'badge-ok' : 'badge-warn' ?>"><?= (float)$p['stock'] > 0 ? 'In stock' : 'Sold out' ?></span>
      </div>
      <div class="price"><?= e(money($p['sell_price'])) ?></div>
      <p class="pdp-desc"><?= e($p['description'] ?: 'A finished atelier piece from our collection.') ?></p>
      <?php if ((float)$p['stock'] > 0): ?>
        <button type="button" class="btn btn-primary"
          onclick='addToCart(<?= json_encode(["id"=>(int)$p["id"],"name"=>$p["name"],"price"=>(float)$p["sell_price"],"qty"=>1], JSON_HEX_TAG|JSON_HEX_APOS) ?>)'>Add to bag</button>
      <?php endif; ?>
      <div style="margin-top:1.25rem">
        <a class="btn btn-outline btn-sm" href="<?= e(url('shop/#collection')) ?>">← Back to collection</a>
      </div>
    </div>
  </div>
  <script src="<?= e(asset('js/app.js')) ?>"></script>
</body>
</html>
