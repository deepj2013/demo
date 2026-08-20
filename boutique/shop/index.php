<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_once ROOT_PATH . '/includes/shop_helpers.php';
if (!module_enabled('ecommerce') && !module_enabled('website')) {
    http_response_code(403);
    exit('Shop / website module disabled in settings.json');
}
$cfg = settings();
$pdo = db();
ensure_shop_demo_images();

$sections = [];
foreach ($pdo->query('SELECT * FROM site_content')->fetchAll() as $row) {
    $sections[$row['section_key']] = $row;
}
$slides = get_hero_slides();

$products = [];
if (module_enabled('ecommerce')) {
    $products = $pdo->query("
      SELECT i.*, COALESCE((SELECT SUM(qty) FROM inventory WHERE item_id=i.id),0) AS stock
      FROM items i
      WHERE i.is_active=1 AND i.is_sellable=1 AND i.item_type='finished'
      ORDER BY i.updated_at DESC
    ")->fetchAll();
}

$checkoutMsg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && module_enabled('ecommerce') && verify_csrf($_POST['csrf'] ?? null)) {
    try {
        $cart = json_decode($_POST['cart_json'] ?? '[]', true);
        if (!is_array($cart) || !$cart) throw new RuntimeException('Bag is empty.');
        $name = trim($_POST['name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $address = trim($_POST['address'] ?? '');
        if ($name === '' || $phone === '') throw new RuntimeException('Name and phone required.');

        $custId = null;
        if ($email || $phone) {
            $st = $pdo->prepare('SELECT id FROM customers WHERE phone=? OR email=? LIMIT 1');
            $st->execute([$phone, $email ?: '___']);
            $custId = $st->fetchColumn() ?: null;
            if (!$custId) {
                $pdo->prepare('INSERT INTO customers (name,email,phone,address,tags) VALUES (?,?,?,?,?)')
                    ->execute([$name, $email, $phone, $address, 'online']);
                $custId = (int)$pdo->lastInsertId();
            }
        }

        $sub = 0;
        $lines = [];
        foreach ($cart as $c) {
            $id = (int)($c['id'] ?? 0);
            $qty = max(1, (float)($c['qty'] ?? 1));
            $st = $pdo->prepare('SELECT id, sell_price, name FROM items WHERE id=? AND is_sellable=1 AND is_active=1');
            $st->execute([$id]);
            $item = $st->fetch();
            if (!$item) continue;
            $line = $qty * (float)$item['sell_price'];
            $sub += $line;
            $lines[] = [(int)$item['id'], $qty, (float)$item['sell_price'], $line];
        }
        if (!$lines) throw new RuntimeException('No valid products.');

        $taxPct = (float)($cfg['ecommerce']['tax_percent'] ?? 5);
        $ship = (float)($cfg['ecommerce']['shipping_flat'] ?? 50);
        $tax = $sub * ($taxPct / 100);
        $total = $sub + $tax + $ship;
        $on = next_number('ON', 'orders', 'order_number');

        $pdo->prepare('INSERT INTO orders (order_number,customer_id,source,status,payment_status,payment_method,subtotal,tax,shipping,total,shipping_address,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
            ->execute([$on, $custId, 'online', 'pending', 'unpaid', $_POST['payment_method'] ?? 'cod', $sub, $tax, $ship, $total, $address, trim($_POST['notes'] ?? '')]);
        $oid = (int)$pdo->lastInsertId();
        $ins = $pdo->prepare('INSERT INTO order_items (order_id,item_id,qty,unit_price,line_total) VALUES (?,?,?,?,?)');
        foreach ($lines as $ln) $ins->execute([$oid, $ln[0], $ln[1], $ln[2], $ln[3]]);

        if ($custId) {
            $pdo->prepare('UPDATE customers SET name=?, total_orders=total_orders+1, total_spent=total_spent+?, last_order_at=NOW(), address=COALESCE(NULLIF(?,""), address) WHERE id=?')
                ->execute([$name, $total, $address, $custId]);
        }

        log_activity(null, 'order_create', 'orders', $oid, "Online shop order $on · $name · $phone");
        $checkoutMsg = 'Order '.$on.' placed! We will confirm on '.$phone.'. Total: '.money($total).' — It is now visible in Admin → Orders.';
    } catch (Throwable $ex) {
        $checkoutMsg = 'Error: '.$ex->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="<?= e($cfg['theme']['primary']) ?>">
  <title><?= e($cfg['business_name']) ?> · Shop</title>
  <link rel="manifest" href="<?= e(url('manifest.php')) ?>">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(asset('css/app.css')) ?>">
</head>
<body class="store-body">
  <nav class="store-nav">
    <a class="logo" href="<?= e(url('shop/')) ?>" style="display:flex;align-items:center;gap:.55rem">
      <?php if ($logo = brand_logo_url()): ?><img src="<?= e($logo) ?>" alt="" style="height:32px;width:32px;object-fit:cover"><?php endif; ?>
      <?= e($cfg['business_name']) ?>
    </a>
    <div class="links">
      <a href="#collection">Shop</a>
      <a href="#categories">Categories</a>
      <a href="#about">About</a>
      <?php if (module_enabled('ecommerce')): ?>
        <a href="#cart" class="btn btn-primary btn-sm">Bag <span id="cartCount" hidden>0</span></a>
      <?php endif; ?>
    </div>
  </nav>

  <header class="hero-slider" id="top">
    <div class="hero-slides">
      <?php foreach ($slides as $i => $slide): ?>
        <div class="hero-slide <?= $i === 0 ? 'active' : '' ?>" data-slide="<?= $i ?>">
          <div class="hero-media" style="background-image:url('<?= e(asset($slide['image'])) ?>')"></div>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="hero-inner">
      <div class="eyebrow"><?= e($cfg['business_name']) ?></div>
      <div class="brand-hero" id="heroTitle"><?= e($slides[0]['title'] ?? ($sections['hero']['title'] ?? $cfg['business_name'])) ?></div>
      <p id="heroSub"><?= e($slides[0]['subtitle'] ?? ($sections['hero']['body'] ?? $cfg['tagline'] ?? '')) ?></p>
      <div class="hero-actions">
        <a class="btn btn-primary" id="heroCta" href="<?= e($slides[0]['cta_link'] ?? '#collection') ?>"><?= e($slides[0]['cta'] ?? 'Shop the collection') ?></a>
        <a class="btn btn-ghost-light" href="#about">Our atelier</a>
      </div>
    </div>
    <?php if (count($slides) > 1): ?>
      <button type="button" class="hero-nav-btn hero-prev" aria-label="Previous">‹</button>
      <button type="button" class="hero-nav-btn hero-next" aria-label="Next">›</button>
      <div class="hero-dots" id="heroDots">
        <?php foreach ($slides as $i => $_): ?>
          <button type="button" class="<?= $i === 0 ? 'active' : '' ?>" data-goto="<?= $i ?>" aria-label="Slide <?= $i + 1 ?>"></button>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </header>

  <div class="trust-strip">
    <div><strong>Free shipping</strong>On orders above ₹2,999</div>
    <div><strong>Easy returns</strong>7-day exchange window</div>
    <div><strong>Handcrafted</strong>Stitched in our atelier</div>
    <div><strong>Secure checkout</strong>COD &amp; UPI on delivery</div>
  </div>

  <?php if ($checkoutMsg): ?>
    <div class="section" style="padding-top:1.5rem;padding-bottom:0">
      <div class="flash <?= str_starts_with($checkoutMsg,'Error')?'flash-error':'flash-success' ?>" style="margin:0"><?= e($checkoutMsg) ?></div>
    </div>
    <script>localStorage.removeItem('boutique_cart');</script>
  <?php endif; ?>

  <?php if (module_enabled('ecommerce')): ?>
  <section class="section" id="categories" style="padding-bottom:0">
    <h2>Shop by mood</h2>
    <p class="lead">Explore finished looks curated for everyday and occasion wear.</p>
    <div class="cat-row">
      <a class="cat-tile" href="#collection"><span>Evening</span></a>
      <a class="cat-tile" href="#collection"><span>Ready-to-wear</span></a>
      <a class="cat-tile" href="#collection"><span>Co-ords</span></a>
      <a class="cat-tile" href="#collection"><span>Kurtas</span></a>
    </div>
  </section>

  <section class="section" id="collection">
    <h2>New arrivals</h2>
    <p class="lead">Finished pieces priced in INR — open any look, then add to bag.</p>
    <div class="product-grid">
      <?php foreach ($products as $p): ?>
        <article class="product-card">
          <a class="card-link" href="<?= e(url('shop/product.php?slug=' . urlencode($p['slug']))) ?>">
            <div class="img">
              <?php if ($p['image']): ?>
                <img src="<?= e(asset($p['image'])) ?>" alt="<?= e($p['name']) ?>" loading="lazy">
              <?php else: ?>
                <?= e($p['color'] ?: 'Look') ?>
              <?php endif; ?>
            </div>
            <div class="meta">
              <h3><?= e($p['name']) ?></h3>
              <div style="font-size:.8rem;color:#8A857C"><?= e($p['color'] ?: '') ?> <?= $p['size'] ? '· '.e($p['size']) : '' ?></div>
              <div class="meta-actions">
                <span class="price"><?= e(money($p['sell_price'])) ?></span>
                <?php if ((float)$p['stock'] <= 0): ?><span class="badge badge-warn">Sold out</span><?php endif; ?>
              </div>
            </div>
          </a>
          <?php if ((float)$p['stock'] > 0): ?>
            <button type="button" class="btn btn-primary btn-sm" style="width:100%"
              onclick='addToCart(<?= json_encode(["id"=>(int)$p["id"],"name"=>$p["name"],"price"=>(float)$p["sell_price"],"qty"=>1], JSON_HEX_TAG|JSON_HEX_APOS) ?>)'>Add to bag</button>
          <?php endif; ?>
        </article>
      <?php endforeach; ?>
      <?php if (!$products): ?>
        <div class="empty" style="grid-column:1/-1">
          <h3>No sale items yet</h3>
          <p>In admin → Shop products, create a finished garment with photo &amp; sellable ON.</p>
        </div>
      <?php endif; ?>
    </div>
  </section>

  <section class="section" id="cart">
    <h2>Your bag</h2>
    <p class="lead">Review and checkout — no account needed.</p>
    <div class="panel">
      <div class="panel-body">
        <div id="cartList" class="table-wrap"></div>
        <form method="post" class="form-grid" style="margin-top:1.25rem" onsubmit="document.getElementById('cart_json').value=JSON.stringify(getCart())">
          <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
          <input type="hidden" name="cart_json" id="cart_json" value="[]">
          <div class="field"><label>Name</label><input name="name" required></div>
          <div class="field"><label>Phone</label><input name="phone" required></div>
          <div class="field"><label>Email</label><input type="email" name="email"></div>
          <div class="field"><label>Payment</label>
            <select name="payment_method"><option value="cod">Cash on delivery</option><option value="upi">UPI on delivery</option></select>
          </div>
          <div class="field full"><label>Shipping address</label><textarea name="address" required></textarea></div>
          <div class="field full"><label>Notes</label><textarea name="notes" placeholder="Size preference, delivery slot…"></textarea></div>
          <div class="form-actions full">
            <button class="btn btn-primary" type="submit">Place order</button>
          </div>
        </form>
      </div>
    </div>
  </section>
  <?php endif; ?>

  <section class="section" id="about">
    <h2><?= e($sections['about']['title'] ?? 'Our Atelier') ?></h2>
    <p class="lead"><?= e($sections['about']['body'] ?? '') ?></p>
  </section>

  <footer class="store-footer">
    <strong><?= e($cfg['business_name']) ?></strong>
    <p><?= e($sections['footer']['body'] ?? ($cfg['tagline'] ?? '')) ?></p>
    <p style="margin-top:1rem;font-size:.85rem"><?= e($cfg['contact']['address'] ?? '') ?><br><?= e($cfg['contact']['phone'] ?? '') ?> · <?= e($cfg['contact']['email'] ?? '') ?></p>
  </footer>

  <script src="<?= e(asset('js/app.js')) ?>"></script>
  <script>
  const SLIDES = <?= json_encode($slides, JSON_HEX_TAG|JSON_HEX_APOS|JSON_UNESCAPED_SLASHES) ?>;
  (function(){
    let i=0, timer=null;
    const slides=document.querySelectorAll('.hero-slide');
    const dots=[...document.querySelectorAll('#heroDots button')];
    function show(n){
      if(!slides.length) return;
      i=(n+slides.length)%slides.length;
      slides.forEach((s,idx)=>s.classList.toggle('active', idx===i));
      dots.forEach((d,idx)=>d.classList.toggle('active', idx===i));
      const s=SLIDES[i]||{};
      const t=document.getElementById('heroTitle');
      const p=document.getElementById('heroSub');
      const c=document.getElementById('heroCta');
      if(t) t.textContent=s.title||'';
      if(p) p.textContent=s.subtitle||'';
      if(c){ c.textContent=s.cta||'Shop the collection'; c.href=s.cta_link||'#collection'; }
    }
    function next(){ show(i+1); }
    function start(){ stop(); timer=setInterval(next, 5500); }
    function stop(){ if(timer) clearInterval(timer); }
    document.querySelector('.hero-next')?.addEventListener('click',()=>{ next(); start(); });
    document.querySelector('.hero-prev')?.addEventListener('click',()=>{ show(i-1); start(); });
    dots.forEach(d=>d.addEventListener('click',()=>{ show(+d.dataset.goto); start(); }));
    start();
  })();

  function renderCart(){
    const list=document.getElementById('cartList');
    if(!list) return;
    const cart=getCart();
    if(!cart.length){list.innerHTML='<div class="empty"><p>Your bag is empty.</p></div>';return;}
    let html='<table class="data"><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th></th></tr></thead><tbody>';
    let sub=0;
    cart.forEach((c,idx)=>{
      sub+=c.price*c.qty;
      html+=`<tr><td>${c.name}</td><td><input type="number" min="1" value="${c.qty}" style="width:64px;padding:.35rem;border:1px solid #ddd" onchange="chgQty(${idx},this.value)"></td><td>${formatINR(c.price*c.qty)}</td><td><button type="button" class="btn btn-outline btn-sm" onclick="rm(${idx})">Remove</button></td></tr>`;
    });
    html+=`</tbody></table><p style="margin-top:.75rem;text-align:right"><strong>Subtotal ${formatINR(sub)}</strong> + tax & shipping at checkout (INR)</p>`;
    list.innerHTML=html;
    updateCartBadge();
  }
  function chgQty(i,v){const c=getCart();c[i].qty=Math.max(1,parseInt(v||1,10));saveCart(c);renderCart();}
  function rm(i){const c=getCart();c.splice(i,1);saveCart(c);renderCart();}
  const _add=window.addToCart;
  window.addToCart=function(item){_add(item);renderCart();};
  renderCart();
  </script>
</body>
</html>
