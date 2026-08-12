<?php
declare(strict_types=1);
$cfg = settings();
$user = current_user();
$flash = get_flash();
$nav = enabled_nav();
$pageTitle = $pageTitle ?? 'Dashboard';
$activeNav = $activeNav ?? 'dashboard';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="<?= e($cfg['theme']['primary'] ?? '#0B1220') ?>">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title><?= e($pageTitle) ?> · <?= e($cfg['app_name']) ?></title>
  <link rel="manifest" href="<?= e(url('manifest.php')) ?>">
  <?php if (!empty($cfg['branding']['favicon'])): ?>
  <link rel="icon" href="<?= e(url($cfg['branding']['favicon'])) ?>">
  <?php endif; ?>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(asset('css/app.css')) ?>">
  <style>
    :root {
      --primary: <?= e($cfg['theme']['primary'] ?? '#0B1220') ?>;
      --accent: <?= e($cfg['theme']['accent'] ?? '#C4A574') ?>;
      --surface: <?= e($cfg['theme']['surface'] ?? '#F7F4EF') ?>;
      --ink: <?= e($cfg['theme']['ink'] ?? '#1A1A1A') ?>;
      --muted: <?= e($cfg['theme']['muted'] ?? '#6B7280') ?>;
    }
  </style>
</head>
<body class="app-body">
  <div class="app-shell">
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <?php if ($logo = brand_logo_url()): ?>
          <img src="<?= e($logo) ?>" alt="" style="width:36px;height:36px;border-radius:10px;object-fit:cover;background:#fff">
        <?php else: ?>
          <span class="brand-mark"></span>
        <?php endif; ?>
        <div>
          <strong><?= e($cfg['app_name']) ?></strong>
          <small><?= e($cfg['business_name']) ?></small>
        </div>
      </div>
      <nav class="side-nav">
        <?php foreach ($nav as $item): ?>
          <a href="<?= e(url($item['href'])) ?>" class="nav-link <?= $activeNav === $item['key'] ? 'active' : '' ?>">
            <span class="nav-ico" data-icon="<?= e($item['icon']) ?>"></span>
            <?= e($item['label']) ?>
          </a>
        <?php endforeach; ?>
      </nav>
      <div class="side-foot">
        <div class="user-chip">
          <span><?= e(mb_substr($user['name'] ?? 'U', 0, 1)) ?></span>
          <div>
            <strong><?= e($user['name'] ?? '') ?></strong>
            <small><?= e($user['role'] ?? '') ?></small>
          </div>
        </div>
        <a class="btn btn-ghost btn-sm" href="<?= e(url('admin/logout.php')) ?>">Logout</a>
      </div>
    </aside>

    <div class="main-wrap">
      <header class="topbar">
        <button type="button" class="icon-btn" id="menuToggle" aria-label="Menu">☰</button>
        <div class="topbar-title">
          <h1><?= e($pageTitle) ?></h1>
        </div>
        <div class="topbar-actions">
          <?php if (module_enabled('ecommerce') && module_enabled('website')): ?>
            <a class="btn btn-outline btn-sm" href="<?= e(url('shop/')) ?>" target="_blank">View Shop</a>
          <?php elseif (module_enabled('website')): ?>
            <a class="btn btn-outline btn-sm" href="<?= e(url('public/')) ?>" target="_blank">View Site</a>
          <?php endif; ?>
        </div>
      </header>

      <?php if ($flash): ?>
        <div class="flash flash-<?= e($flash['type']) ?>"><?= e($flash['message']) ?></div>
      <?php endif; ?>

      <main class="content">
