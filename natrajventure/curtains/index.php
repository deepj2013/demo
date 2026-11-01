<?php
require_once dirname(__DIR__) . '/shared/config.php';
require_once dirname(__DIR__) . '/shared/widgets.php';
global $NV_COMPANY;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#10232b">
  <title>Natraj Curtains | Motorized Curtain Sale & Installation</title>
  <meta name="description" content="मोटर से कर्टन चलाओ — silent remote-controlled curtains for bedroom, living, office & hotels. Natraj Ventures Gurugram.">
  <link rel="icon" href="<?= nv_e($NV_COMPANY['logo']) ?>">
  <link rel="stylesheet" href="<?= nv_e(NV_ASSETS) ?>/css/shared.css">
  <link rel="stylesheet" href="<?= nv_e(NV_ASSETS) ?>/css/curtains.css">
</head>
<body class="curtains">
<?php nv_loader(); ?>

<header class="cur-nav">
  <div class="container inner">
    <a class="cur-brand" href="<?= nv_e(NV_URL) ?>/curtains/">
      <img src="<?= nv_e($NV_COMPANY['logo']) ?>" alt="Natraj">
      <strong>Natraj Curtains</strong>
    </a>
    <button class="nav-toggle" type="button" data-nav-toggle="#cur-menu" aria-label="Menu" style="display:none;border:1px solid #ccc;background:#fff;border-radius:8px;padding:.4rem .65rem;">☰</button>
    <nav id="cur-menu">
      <a href="<?= nv_e(NV_URL) ?>/">Venture</a>
      <a href="#features">Features</a>
      <a href="#rooms">Spaces</a>
      <a href="#process">Process</a>
      <a class="phone" href="tel:<?= nv_e($NV_COMPANY['phone_raw']) ?>">Call <?= nv_e($NV_COMPANY['phone']) ?></a>
    </nav>
  </div>
</header>

<section class="cur-hero full-bleed-hero">
  <div class="bg" aria-hidden="true"></div>
  <div class="container hero-copy">
    <div class="glass-panel dark reveal">
      <div class="trust">Trusted smart homes · Gurugram install team</div>
      <h1>Fresh, effortless curtains for a better home</h1>
      <p>मोटर से कर्टन चलाओ — सुविधा भी, स्टाइल भी. One-button remote, silent motors, timer function, premium fabrics & on-site installation.</p>
      <div class="actions">
        <a class="btn-cur anim-pulse" href="#quote">Get instant quote</a>
        <a class="btn-cur-ghost" href="<?= nv_e(nv_whatsapp_link('Hello Natraj Curtains, I want motorized curtain installation.')) ?>" target="_blank" rel="noopener">WhatsApp us</a>
      </div>
    </div>
  </div>
</section>

<section class="cur-section" id="features">
  <div class="container">
    <div class="head reveal">
      <h2>Expert motorized curtain solutions</h2>
      <p>हर जगह फिट, हर घर के लिए परफेक्ट — bedrooms to hotels.</p>
    </div>
    <div class="feat-grid">
      <div class="feat reveal"><div class="ico">🎛️</div><h3>Remote control</h3><p>रिमोट कंट्रोल से ऑपरेशन — open and close with one press.</p></div>
      <div class="feat reveal"><div class="ico">🤫</div><h3>Silent motor</h3><p>बिलकुल शांत ऑपरेशन for bedrooms and offices.</p></div>
      <div class="feat reveal"><div class="ico">⏱️</div><h3>Timer function</h3><p>Schedule morning light and evening privacy.</p></div>
      <div class="feat reveal"><div class="ico">✨</div><h3>Smart & elegant</h3><p>Premium quality, grand design, long life.</p></div>
    </div>
  </div>
</section>

<section class="cur-section" id="rooms">
  <div class="container">
    <div class="head reveal">
      <h2>Spaces we dress</h2>
      <p>From our installation posters — tailored tracks for every room type.</p>
    </div>
    <div class="rooms">
      <div class="room reveal"><div class="bg" style="background-image:url('https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80')"></div><span>Bedroom</span></div>
      <div class="room reveal"><div class="bg" style="background-image:url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80')"></div><span>Living room</span></div>
      <div class="room reveal"><div class="bg" style="background-image:url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80')"></div><span>Office</span></div>
      <div class="room reveal"><div class="bg" style="background-image:url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80')"></div><span>Hotel / Resort</span></div>
    </div>
  </div>
</section>

<section class="cur-section" id="process">
  <div class="container">
    <div class="head reveal">
      <h2>Easy install steps</h2>
      <p>Measure → motorize → enjoy silent smart drapes.</p>
    </div>
    <div class="steps">
      <div class="step reveal"><div class="n">01</div><h3>Site visit & quote</h3><p>Share room sizes or book a Gurugram measurement visit.</p></div>
      <div class="step reveal"><div class="n">02</div><h3>Fabric & motor pick</h3><p>Choose silent motors, remotes and premium curtain styles.</p></div>
      <div class="step reveal"><div class="n">03</div><h3>Install & train</h3><p>Professional fitting plus demo of remote & timer.</p></div>
    </div>
  </div>
</section>

<section class="cur-section" id="contact-poster">
  <div class="container">
    <div class="head reveal">
      <h2>Visit &amp; connect</h2>
      <p>Natraj Curtains showroom desk — Sector 29, Gurugram.</p>
    </div>
    <div class="nv-poster-frame reveal">
      <img src="<?= nv_e(NV_ASSETS) ?>/img/curtains/nv-contact-poster.jpg" alt="Natraj Ventures curtains contact poster" loading="lazy">
      <div class="nv-poster-meta">
        <strong>Natraj Curtains</strong>
        <p><?= nv_e($NV_COMPANY['address']) ?></p>
        <p><a href="tel:<?= nv_e($NV_COMPANY['phone_raw']) ?>"><?= nv_e($NV_COMPANY['phone']) ?></a> · <a href="mailto:<?= nv_e($NV_COMPANY['email']) ?>"><?= nv_e($NV_COMPANY['email']) ?></a></p>
        <a class="btn-cur" href="<?= nv_e(nv_whatsapp_link('Hello Natraj Curtains, I saw your contact poster.')) ?>" target="_blank" rel="noopener">WhatsApp from poster</a>
      </div>
    </div>
  </div>
</section>

<section class="cur-section" id="quote">
  <div class="container">
    <div class="quote-panel reveal">
      <div class="visual" style="background-image:url('<?= nv_e(NV_ASSETS) ?>/img/curtains/nv-contact-poster.jpg')"></div>
      <div class="form">
        <h3>Fast quote for motorized curtains</h3>
        <form id="curtain-form">
          <div class="row two">
            <label>Name<input name="name" required></label>
            <label>Phone<input name="phone" required></label>
          </div>
          <div class="row two">
            <label>Email<input type="email" name="email"></label>
            <label>Space
              <select name="type">
                <option value="bedroom">Bedroom</option>
                <option value="living">Living room</option>
                <option value="office">Office</option>
                <option value="hotel">Hotel / Resort</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
          <div class="row">
            <label>Approximate windows / width<input name="windows" placeholder="e.g. 3 windows, 12 ft total"></label>
          </div>
          <div class="row">
            <label>Message<textarea name="message" rows="3" placeholder="Fabric preference, motor brand, timeline..."></textarea></label>
          </div>
          <button class="btn-cur" type="submit">Request quote</button>
          <p class="form-msg" id="cur-msg"></p>
        </form>
      </div>
    </div>
  </div>
</section>

<?php nv_site_footer(); ?>
<?php nv_float_actions('Hello Natraj Curtains, I need motorized curtains.'); ?>
<script>
document.getElementById('curtain-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const msg = document.getElementById('cur-msg');
  const payload = Object.fromEntries(new FormData(e.target).entries());
  msg.className = 'form-msg show';
  msg.textContent = 'Sending…';
  try {
    const res = await fetch(<?= json_encode(NV_URL . '/curtains/api/inquiry.php') ?>, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || 'Failed');
    msg.classList.add('ok');
    msg.textContent = 'Quote request saved — ' + data.id + '. Our team will call you.';
    e.target.reset();
  } catch (err) {
    msg.classList.add('err');
    msg.textContent = err.message || 'Could not submit';
  }
});
</script>
<script src="<?= nv_e(NV_ASSETS) ?>/js/shared.js"></script>
<style>
@media (max-width:900px){
  .cur-nav .nav-toggle{display:inline-flex!important;}
  .cur-nav .inner{flex-wrap:wrap;}
  #cur-menu{display:none;width:100%;flex-direction:column;align-items:flex-start;}
  #cur-menu.open{display:flex;}
}
</style>
</body>
</html>
