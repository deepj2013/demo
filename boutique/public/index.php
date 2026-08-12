<?php
// Public marketing site — redirects to shop when ecommerce is on
require_once dirname(__DIR__) . '/config/bootstrap.php';
if (module_enabled('ecommerce')) {
    redirect('shop/');
}
if (!module_enabled('website')) {
    http_response_code(403);
    exit('Website module disabled.');
}
$cfg = settings();
$pdo = db();
$sections = [];
foreach ($pdo->query('SELECT * FROM site_content')->fetchAll() as $row) {
    $sections[$row['section_key']] = $row;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($cfg['business_name']) ?></title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(asset('css/app.css')) ?>">
</head>
<body class="store-body">
  <nav class="store-nav">
    <span class="logo"><?= e($cfg['business_name']) ?></span>
    <div class="links"><a href="<?= e(url('admin/login.php')) ?>" class="btn btn-outline btn-sm">Staff login</a></div>
  </nav>
  <header class="hero">
    <div class="hero-inner">
      <div class="brand-hero"><?= e($sections['hero']['title'] ?? $cfg['business_name']) ?></div>
      <p><?= e($sections['hero']['body'] ?? '') ?></p>
    </div>
  </header>
  <section class="section">
    <h2><?= e($sections['about']['title'] ?? 'About') ?></h2>
    <p class="lead"><?= e($sections['about']['body'] ?? '') ?></p>
  </section>
  <footer class="section" style="border-top:1px solid var(--line)">
    <h2 style="font-size:1.2rem"><?= e($sections['footer']['title'] ?? 'Visit') ?></h2>
    <p class="lead"><?= e($sections['footer']['body'] ?? '') ?></p>
  </footer>
</body>
</html>
