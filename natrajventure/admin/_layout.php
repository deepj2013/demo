<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/shared/auth.php';
require_once dirname(__DIR__) . '/shared/widgets.php';
nv_require_admin();
global $NV_COMPANY;

function admin_header(string $title, string $active = 'dashboard'): void
{
    global $NV_COMPANY;
    $links = [
        'dashboard' => ['Dashboard', NV_URL . '/admin/'],
        'orders' => ['Orders', NV_URL . '/admin/orders.php'],
        'leads' => ['Leads', NV_URL . '/admin/leads.php'],
        'products' => ['Products', NV_URL . '/admin/products.php'],
    ];
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title><?= nv_e($title) ?> · Natraj Admin</title>
  <link rel="icon" href="<?= nv_e($NV_COMPANY['logo']) ?>">
  <link rel="stylesheet" href="<?= nv_e(NV_ASSETS) ?>/css/admin.css">
</head>
<body class="admin">
<div class="admin-shell">
  <aside class="admin-side">
    <div class="brand">
      <img src="<?= nv_e($NV_COMPANY['logo']) ?>" alt="">
      <div>
        <strong>Natraj Admin</strong><br>
        <small style="opacity:.7;">All verticals</small>
      </div>
    </div>
    <nav>
      <?php foreach ($links as $key => [$label, $href]): ?>
        <a class="<?= $active === $key ? 'active' : '' ?>" href="<?= nv_e($href) ?>"><?= nv_e($label) ?></a>
      <?php endforeach; ?>
      <a href="<?= nv_e(NV_URL) ?>/" target="_blank">View website</a>
    </nav>
    <a class="logout" href="<?= nv_e(NV_URL) ?>/admin/logout.php">Logout</a>
  </aside>
  <main class="admin-main">
    <div class="admin-top">
      <h1><?= nv_e($title) ?></h1>
      <div style="color:#6b7a90;font-size:.9rem;">Signed in as admin</div>
    </div>
    <?php
}

function admin_footer(): void
{
    ?>
  </main>
</div>
</body>
</html>
    <?php
}
