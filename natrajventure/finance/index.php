<?php
require_once dirname(__DIR__) . '/shared/config.php';
require_once dirname(__DIR__) . '/shared/widgets.php';
global $NV_COMPANY;
$partners = ['Star Health', 'Niva Bupa', 'Care Health', 'HDFC ERGO', 'ICICI Lombard', 'Aditya Birla Health', 'TATA AIG', 'SBI General'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#071833">
  <title>Natraj Finance | Insurance & Loans</title>
  <meta name="description" content="All major health insurance plans in one place. Free consultation for insurance & loans — Natraj Ventures, Sector 29 Gurugram.">
  <link rel="icon" href="<?= nv_e($NV_COMPANY['logo']) ?>">
  <link rel="stylesheet" href="<?= nv_e(NV_ASSETS) ?>/css/shared.css">
  <link rel="stylesheet" href="<?= nv_e(NV_ASSETS) ?>/css/finance.css">
</head>
<body class="finance">
<?php nv_loader(); ?>

<header class="fin-nav">
  <div class="container inner">
    <a class="fin-brand" href="<?= nv_e(NV_URL) ?>/finance/">
      <img src="<?= nv_e($NV_COMPANY['logo']) ?>" alt="Natraj">
      <div>
        <strong>NATRAJ FINANCE</strong>
        <span>Your health · Our priority</span>
      </div>
    </a>
    <button class="nav-toggle" type="button" data-nav-toggle="#fin-menu" aria-label="Menu" style="display:none;background:#fff;border:0;border-radius:8px;padding:.4rem .6rem;">☰</button>
    <nav id="fin-menu">
      <a href="<?= nv_e(NV_URL) ?>/">Venture</a>
      <a href="#services">Services</a>
      <a href="#partners">Partners</a>
      <a href="#loans">Loans</a>
      <a class="cta" href="#quote">Free consultation</a>
    </nav>
  </div>
</header>

<section class="fin-hero full-bleed-hero">
  <div class="bg" aria-hidden="true"></div>
  <div class="container hero-copy">
    <div class="glass-panel dark reveal">
      <div class="badge">Best plans · Best care</div>
      <h1>Life more relaxed with smart insurance</h1>
      <p>सभी प्रमुख Health Insurance Plans एक जगह — cashless hospitalization, tax benefits u/s 80D, family & senior citizen covers, plus personal and business loan guidance.</p>
      <div class="actions">
        <a class="btn-fin anim-pulse" href="#quote">Get free quote</a>
        <a class="btn-fin-outline" href="<?= nv_e(nv_whatsapp_link('Hello Natraj Finance, I need insurance / loan advice.')) ?>" target="_blank" rel="noopener">WhatsApp expert</a>
      </div>
    </div>
  </div>
</section>

<div class="container">
  <div class="fin-features">
    <div class="card reveal"><div class="icon">🏥</div><h3>Cashless care</h3><p>Network hospitals across leading insurers.</p></div>
    <div class="card reveal"><div class="icon">₹</div><h3>Tax benefits</h3><p>Claim deductions under Section 80D.</p></div>
    <div class="card reveal"><div class="icon">👨‍👩‍👧‍👦</div><h3>Family cover</h3><p>Individual, family floater & senior plans.</p></div>
    <div class="card reveal"><div class="icon">⚡</div><h3>Quick process</h3><p>Compare, choose & onboard with guidance.</p></div>
  </div>
</div>

<section class="fin-section" id="services">
  <div class="container">
    <div class="head reveal">
      <h2>We’re covering insurance & lending</h2>
      <p>Natraj-branded guidance for families and founders — compare, consult, and cover with confidence.</p>
    </div>
    <div class="services-grid">
      <article class="service-card reveal">
        <div class="top" style="background-image:url('<?= nv_e(NV_ASSETS) ?>/img/finance/nv-family-cover.jpg')"></div>
        <div class="body">
          <h3>Health Insurance</h3>
          <ul>
            <li>Best premium options</li>
            <li>Wide range of plans</li>
            <li>Expert guidance</li>
          </ul>
        </div>
      </article>
      <article class="service-card reveal">
        <div class="top" style="background-image:url('<?= nv_e(NV_ASSETS) ?>/img/finance/nv-family-banner.jpg')"></div>
        <div class="body">
          <h3>Family & Senior Plans</h3>
          <ul>
            <li>Low premium, high coverage</li>
            <li>Cashless hospitalization</li>
            <li>Policy advice free</li>
          </ul>
        </div>
      </article>
      <article class="service-card reveal" id="loans">
        <div class="top" style="background-image:url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80')"></div>
        <div class="body">
          <h3>Loans</h3>
          <ul>
            <li>Personal loan guidance</li>
            <li>Business / working capital</li>
            <li>Documentation support</li>
          </ul>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="fin-section" id="partners">
  <div class="container">
    <div class="partners reveal">
      <h3>Leading health insurance partners</h3>
      <div class="partner-logos">
        <?php foreach ($partners as $p): ?>
          <span><?= nv_e($p) ?></span>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</section>

<section class="fin-section" id="contact-poster">
  <div class="container">
    <div class="head reveal">
      <h2>Visit &amp; connect</h2>
      <p>Natraj Ventures finance desk — Sector 29, Gurugram.</p>
    </div>
    <div class="nv-poster-frame reveal">
      <img src="<?= nv_e(NV_ASSETS) ?>/img/finance/nv-contact-poster.jpg" alt="Natraj Ventures insurance contact poster" loading="lazy">
      <div class="nv-poster-meta">
        <strong>Natraj Ventures</strong>
        <p><?= nv_e($NV_COMPANY['address']) ?></p>
        <p><a href="tel:<?= nv_e($NV_COMPANY['phone_raw']) ?>"><?= nv_e($NV_COMPANY['phone']) ?></a> · <a href="mailto:<?= nv_e($NV_COMPANY['email']) ?>"><?= nv_e($NV_COMPANY['email']) ?></a></p>
        <a class="btn-fin" href="<?= nv_e(nv_whatsapp_link('Hello Natraj Finance, I saw your contact poster.')) ?>" target="_blank" rel="noopener">WhatsApp from poster</a>
      </div>
    </div>
  </div>
</section>

<section class="fin-section" id="quote">
  <div class="container">
    <div class="head reveal">
      <h2>आज ही consultation बुक करें</h2>
      <p>Share your details — our advisor will call you. Leads sync to the Natraj admin panel instantly.</p>
    </div>
    <div class="quote-wrap">
      <div class="quote-visual reveal" style="background-image:url('<?= nv_e(NV_ASSETS) ?>/img/finance/nv-contact-poster.jpg')"></div>
      <form class="quote-form reveal" id="finance-form">
        <h3>Free consultation & policy advice</h3>
        <div class="row two">
          <label>Full name<input name="name" required></label>
          <label>Phone<input name="phone" required></label>
        </div>
        <div class="row two">
          <label>Email<input type="email" name="email"></label>
          <label>Interest
            <select name="type" required>
              <option value="health_insurance">Health insurance</option>
              <option value="family_plan">Family / senior plan</option>
              <option value="personal_loan">Personal loan</option>
              <option value="business_loan">Business loan</option>
            </select>
          </label>
        </div>
        <div class="row">
          <label>City / Sector<input name="city" placeholder="Gurugram Sector 29"></label>
        </div>
        <div class="row">
          <label>Message<textarea name="message" rows="3" placeholder="Coverage needed, sum insured, loan amount..."></textarea></label>
        </div>
        <button class="btn-fin" type="submit" style="width:100%;">Submit request</button>
        <p class="form-msg" id="fin-msg"></p>
      </form>
    </div>
  </div>
</section>

<?php nv_site_footer(); ?>
<?php nv_float_actions('Hello Natraj Finance, I want a free consultation.'); ?>
<script>
document.getElementById('finance-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const msg = document.getElementById('fin-msg');
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  msg.className = 'form-msg show';
  msg.textContent = 'Sending…';
  try {
    const res = await fetch(<?= json_encode(NV_URL . '/finance/api/lead.php') ?>, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || 'Failed');
    msg.classList.add('ok');
    msg.textContent = 'Thank you! Reference ' + data.id + '. We will call you soon.';
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
  .fin-nav .nav-toggle{display:inline-flex!important;}
  .fin-nav .inner{flex-wrap:wrap;}
  #fin-menu{display:none;width:100%;flex-direction:column;align-items:flex-start;}
  #fin-menu.open{display:flex;}
}
</style>
</body>
</html>
