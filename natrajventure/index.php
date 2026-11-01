<?php
require_once __DIR__ . '/shared/config.php';
require_once __DIR__ . '/shared/widgets.php';
global $NV_COMPANY, $NV_VERTICALS;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0b1f3a">
  <title>Natraj Ventures | Ideas to Impact</title>
  <meta name="description" content="Natraj Ventures — premium masala chai, insurance & loans, and motorized curtain solutions from Gurugram.">
  <link rel="icon" href="<?= nv_e($NV_COMPANY['logo']) ?>">
  <link rel="manifest" href="<?= nv_e(NV_ASSETS) ?>/manifest-hub.json">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="stylesheet" href="<?= nv_e(NV_ASSETS) ?>/css/shared.css">
  <link rel="stylesheet" href="<?= nv_e(NV_ASSETS) ?>/css/hub.css">
</head>
<body class="hub">
<?php nv_loader(); ?>

<header class="hub-nav">
  <div class="container inner">
    <a class="brand" href="<?= nv_e(NV_URL) ?>/">
      <img src="<?= nv_e($NV_COMPANY['logo']) ?>" alt="Natraj Ventures logo">
      <div>
        <strong>NATRAJ</strong>
        <span>Ventures</span>
      </div>
    </a>
    <button class="nav-toggle" type="button" data-nav-toggle="#hub-menu" aria-label="Menu">☰</button>
    <nav id="hub-menu">
      <a href="#verticals">Businesses</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
      <a class="btn btn-navy" href="<?= nv_e(NV_URL) ?>/admin/">Admin</a>
    </nav>
  </div>
</header>

<section class="hub-hero full-bleed-hero">
  <div class="hub-hero-bg" aria-hidden="true"></div>
  <div class="container hero-copy">
    <div class="glass-panel light reveal">
      <span class="eyebrow">Gurugram · Ideas to Impact</span>
      <h1>Natraj <em>Ventures</em></h1>
      <p>One venture. Three craft-led businesses — signature masala chai, trusted insurance & loans, and smart motorized curtains for modern homes.</p>
      <div class="hero-cta">
        <a class="btn btn-gold anim-pulse" href="#verticals">Explore verticals</a>
        <a class="btn btn-navy" href="<?= nv_e(nv_whatsapp_link('Hello Natraj Ventures, I want to connect.')) ?>" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  </div>
</section>

<section class="verticals" id="verticals">
  <div class="container">
    <div class="section-head reveal">
      <h2>Our businesses</h2>
      <p>Each vertical has its own experience — open the shop that fits your need.</p>
    </div>
    <div class="v-grid">
      <a class="v-card reveal delay-1" href="<?= nv_e($NV_VERTICALS['chai']['url']) ?>">
        <div class="bg" style="background-image:url('<?= nv_e(NV_ASSETS) ?>/img/chai/chai-classic-masala.jpg')"></div>
        <div class="content">
          <span class="tag">Tea & packaging</span>
          <h3>Natraj Chai</h3>
          <p>Masala chai blends in gift-ready packs — cart, checkout, doorstep delight.</p>
          <span class="btn btn-gold">Shop chai →</span>
        </div>
      </a>
      <a class="v-card reveal delay-2" href="<?= nv_e($NV_VERTICALS['finance']['url']) ?>">
        <div class="bg" style="background-image:url('https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=1200&q=80')"></div>
        <div class="content">
          <span class="tag">Insurance & loans</span>
          <h3>Natraj Finance</h3>
          <p>Health cover across leading insurers, plus personal & business loan guidance.</p>
          <span class="btn btn-gold">Get cover →</span>
        </div>
      </a>
      <a class="v-card reveal delay-3" href="<?= nv_e($NV_VERTICALS['curtains']['url']) ?>">
        <div class="bg" style="background-image:url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80')"></div>
        <div class="content">
          <span class="tag">Smart interiors</span>
          <h3>Natraj Curtains</h3>
          <p>Silent motorized curtains — sale, style matching & professional installation.</p>
          <span class="btn btn-gold">Book install →</span>
        </div>
      </a>
    </div>

    <div class="about-strip reveal" id="about">
      <div class="copy">
        <h2>Built for trust in Sector 29</h2>
        <p>Natraj Ventures brings everyday essentials and protection under one brand — from the warmth of a perfect cup of chai to family health cover and effortless smart curtains. Visit us at Leisure Valley HUDA Market, Gurugram.</p>
        <p style="margin-top:1rem;"><a class="btn btn-navy" href="mailto:<?= nv_e($NV_COMPANY['email']) ?>">Email <?= nv_e($NV_COMPANY['email']) ?></a></p>
      </div>
      <div class="photo" role="img" aria-label="Modern office"></div>
    </div>

    <div class="contact-bar reveal" id="contact">
      <div class="item">
        <strong>Call</strong>
        <a href="tel:<?= nv_e($NV_COMPANY['phone_raw']) ?>"><?= nv_e($NV_COMPANY['phone']) ?></a>
      </div>
      <div class="item">
        <strong>WhatsApp</strong>
        <a href="<?= nv_e(nv_whatsapp_link()) ?>" target="_blank" rel="noopener">Message us now</a>
      </div>
      <div class="item">
        <strong>Office</strong>
        <?= nv_e($NV_COMPANY['address']) ?>
      </div>
    </div>
  </div>
</section>

<?php nv_site_footer('<div><strong>Verticals</strong><p style="margin:.4rem 0 0;"><a href="' . nv_e($NV_VERTICALS['chai']['url']) . '">Chai</a> · <a href="' . nv_e($NV_VERTICALS['finance']['url']) . '">Finance</a> · <a href="' . nv_e($NV_VERTICALS['curtains']['url']) . '">Curtains</a></p></div>'); ?>
<?php nv_float_actions('Hello Natraj Ventures!'); ?>
<script src="<?= nv_e(NV_ASSETS) ?>/js/shared.js"></script>
</body>
</html>
