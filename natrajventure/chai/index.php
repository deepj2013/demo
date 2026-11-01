<?php
require_once dirname(__DIR__) . '/shared/config.php';
require_once dirname(__DIR__) . '/shared/store.php';
require_once dirname(__DIR__) . '/shared/widgets.php';
global $NV_COMPANY;
$products = array_values(array_filter(nv_products(), fn($p) => ($p['service'] ?? '') === 'chai' && ($p['active'] ?? true)));
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#2f4a32">
  <title>Natraj Chai | Premium Masala Chai</title>
  <meta name="description" content="Shop Natraj Ventures masala chai — Classic, Ginger Fire, Cardamom Gold, Tulsi Calm & Kadak Assam blends.">
  <link rel="icon" href="<?= nv_e($NV_COMPANY['logo']) ?>">
  <link rel="stylesheet" href="<?= nv_e(NV_ASSETS) ?>/css/shared.css">
  <link rel="stylesheet" href="<?= nv_e(NV_ASSETS) ?>/css/chai.css">
</head>
<body class="chai">
<?php nv_loader(); ?>

<header class="chai-nav">
  <div class="container inner">
    <a class="chai-brand" href="<?= nv_e(NV_URL) ?>/chai/">
      <img src="<?= nv_e($NV_COMPANY['logo']) ?>" alt="Natraj">
      <strong>Natraj Chai</strong>
    </a>
    <nav>
      <a href="<?= nv_e(NV_URL) ?>/">Venture</a>
      <a href="#shop">Shop</a>
      <a href="#story">Our blend</a>
      <button class="cart-btn" type="button" id="open-cart">Cart <span class="badge" id="cart-count">0</span></button>
    </nav>
  </div>
</header>

<section class="chai-hero">
  <div class="bg" aria-hidden="true">
    <video class="hero-video" autoplay muted loop playsinline poster="<?= nv_e(NV_ASSETS) ?>/img/chai/chai-classic-masala.jpg">
      <source src="<?= nv_e(NV_ASSETS) ?>/video/chai-hero-loop.mp4" type="video/mp4">
    </video>
    <div class="hero-scrim"></div>
  </div>
  <div class="hero-copy">
    <div class="glass-panel dark reveal">
      <div class="eyebrow">Ideas to Impact · Tea vertical</div>
      <h1>Brew warmth.<br><em>Share spice.</em></h1>
      <p>Five carefully packed masala chai variants — gift-ready pouches for homes, offices and festive hampers across Gurugram.</p>
      <a class="btn btn-gold anim-pulse" href="#shop">Browse blends</a>
    </div>
  </div>
</section>

<section class="chai-section" id="shop">
  <div class="container">
    <div class="head reveal">
      <h2>Our chai collection</h2>
      <p>Seed catalogue ready for your cart — add packs and checkout in minutes.</p>
    </div>
    <div class="product-grid" id="product-grid">
      <?php foreach ($products as $p): ?>
        <article class="product-card reveal" data-id="<?= nv_e($p['id']) ?>">
          <div class="media">
            <img src="<?= nv_e(NV_ASSETS) ?>/img/chai/<?= nv_e($p['image']) ?>" alt="<?= nv_e($p['name']) ?>" loading="lazy">
          </div>
          <div class="body">
            <div class="sub"><?= nv_e($p['subtitle']) ?> · <?= nv_e($p['weight']) ?></div>
            <h3><?= nv_e($p['name']) ?></h3>
            <p class="desc"><?= nv_e($p['description']) ?></p>
            <div class="price-row">
              <div class="price">₹<?= (int)$p['price'] ?><s>₹<?= (int)$p['mrp'] ?></s></div>
              <button class="add" type="button"
                data-add
                data-id="<?= nv_e($p['id']) ?>"
                data-name="<?= nv_e($p['name']) ?>"
                data-price="<?= (int)$p['price'] ?>"
                data-image="<?= nv_e(NV_ASSETS) ?>/img/chai/<?= nv_e($p['image']) ?>">
                Add
              </button>
            </div>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="chai-section" id="story">
  <div class="container">
    <div class="story reveal">
      <div class="photo" role="img" aria-label="Chai brewing"></div>
      <div class="copy">
        <h2>From spice market to your kettle</h2>
        <p>Natraj Chai sources whole spices and Assam leaf for blends that hold milk, sugar and conversation. Packaged for retail and gifting — with the same care we bring to every Natraj Ventures vertical.</p>
        <p style="margin-top:1rem;"><a class="btn btn-navy" href="<?= nv_e(nv_whatsapp_link('Hi, I want bulk / retail chai pricing from Natraj Chai.')) ?>" target="_blank" rel="noopener">Ask for wholesale</a></p>
      </div>
    </div>
  </div>
</section>

<div class="cart-drawer" id="cart-drawer" aria-hidden="true">
  <div class="backdrop" data-close-cart></div>
  <aside class="cart-panel">
    <header style="display:flex;justify-content:space-between;align-items:center;">
      <strong>Your cart</strong>
      <button type="button" data-close-cart style="border:0;background:transparent;font-size:1.4rem;cursor:pointer;">×</button>
    </header>
    <div class="cart-items" id="cart-items"></div>
    <footer>
      <div style="display:flex;justify-content:space-between;margin-bottom:.8rem;">
        <span>Total</span><strong id="cart-total">₹0</strong>
      </div>
      <button class="btn btn-gold" style="width:100%" type="button" id="go-checkout">Checkout</button>
    </footer>
  </aside>
</div>

<div class="checkout-modal" id="checkout-modal">
  <div class="checkout-box">
    <h3>Checkout</h3>
    <form id="checkout-form" class="form-grid">
      <label>Full name<input name="name" required placeholder="Your name"></label>
      <label>Phone<input name="phone" required pattern="[0-9+\-\s]{10,15}" placeholder="+91 ..."></label>
      <label>Email<input name="email" type="email" required placeholder="you@email.com"></label>
      <label>Delivery address<textarea name="address" rows="3" required placeholder="Flat, street, sector, city"></textarea></label>
      <label>Payment method
        <select name="payment_method" required>
          <option value="cod">Cash on delivery</option>
          <option value="upi">UPI (pay after confirmation)</option>
          <option value="bank">Bank transfer</option>
        </select>
      </label>
      <label>Notes (optional)<textarea name="notes" rows="2" placeholder="Gift wrap, preferred time..."></textarea></label>
      <div class="form-actions">
        <button class="btn btn-gold" type="submit">Place order</button>
        <button class="btn btn-outline" type="button" id="cancel-checkout">Cancel</button>
      </div>
      <p id="checkout-msg" style="display:none;margin:0;"></p>
    </form>
  </div>
</div>

<?php nv_site_footer(); ?>
<?php nv_float_actions('Hello Natraj Chai, I have a question about your blends.'); ?>

<script>
window.NV_CHAI = {
  checkoutUrl: <?= json_encode(NV_URL . '/chai/api/checkout.php') ?>,
  assets: <?= json_encode(NV_ASSETS . '/img/chai/') ?>
};
</script>
<script src="<?= nv_e(NV_ASSETS) ?>/js/shared.js"></script>
<script src="<?= nv_e(NV_ASSETS) ?>/js/chai-cart.js"></script>
</body>
</html>
