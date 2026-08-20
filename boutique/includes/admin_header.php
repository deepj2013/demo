<?php
declare(strict_types=1);
$cfg = settings();
$user = current_user();
$flash = get_flash();
$nav = enabled_nav();
$groups = nav_groups();
$pageTitle = $pageTitle ?? 'Dashboard';
$activeNav = $activeNav ?? 'dashboard';
$uiTheme = ui_theme();
$pendingBadge = 0;
try {
    if (module_enabled('ecommerce')) {
        $pendingBadge = (int) db()->query("SELECT COUNT(*) FROM orders WHERE status='pending'")->fetchColumn();
    }
} catch (Throwable $e) {}
?>
<!DOCTYPE html>
<html lang="en" data-theme="<?= e($uiTheme) ?>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="<?= $uiTheme === 'dark' ? '#0B1220' : ($uiTheme === 'warm' ? '#0B1220' : '#2563EB') ?>">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title><?= e($pageTitle) ?> · <?= e($cfg['app_name']) ?></title>
  <link rel="manifest" href="<?= e(url('manifest.php')) ?>">
  <?php if (!empty($cfg['branding']['favicon'])): ?>
  <link rel="icon" href="<?= e(url($cfg['branding']['favicon'])) ?>">
  <?php endif; ?>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(asset('css/app.css')) ?>">
</head>
<body class="app-body">
  <div class="app-shell">
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <?php if ($logo = brand_logo_url()): ?>
          <img src="<?= e($logo) ?>" alt="" class="brand-logo">
        <?php else: ?>
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2l2.4 7.2H22l-6 4.4 2.3 7.2L12 16.8 5.7 20.8 8 13.6 2 9.2h7.6z"/></svg>
          </span>
        <?php endif; ?>
        <div>
          <strong><?= e($cfg['app_name']) ?></strong>
          <small><?= e($cfg['business_name']) ?></small>
        </div>
      </div>

      <nav class="side-nav">
        <?php
          $lastGroup = null;
          foreach ($nav as $item):
            $g = $item['group'] ?? 'main';
            if ($g !== $lastGroup):
              $lastGroup = $g;
        ?>
          <div class="nav-group-label"><?= e($groups[$g] ?? ucfirst($g)) ?></div>
        <?php endif; ?>
          <a href="<?= e(url($item['href'])) ?>" class="nav-link <?= $activeNav === $item['key'] ? 'active' : '' ?>">
            <span class="nav-ico" data-icon="<?= e($item['icon']) ?>"></span>
            <span class="nav-label"><?= e($item['label']) ?></span>
            <?php if ($item['key'] === 'orders' && $pendingBadge > 0): ?>
              <span class="nav-badge"><?= $pendingBadge > 99 ? '99+' : $pendingBadge ?></span>
            <?php endif; ?>
          </a>
        <?php endforeach; ?>
      </nav>

      <div class="side-promo">
        <strong>Boost with clarity</strong>
        <p>Track raw → BOM → finished → shop in one flow.</p>
        <a class="btn btn-accent btn-sm" href="<?= e(url('admin/reports.php')) ?>">Open reports</a>
      </div>

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
        <form class="top-search" action="<?= e(url('admin/items.php')) ?>" method="get" role="search">
          <span class="top-search-ico" aria-hidden="true">⌕</span>
          <input type="search" name="q" placeholder="Search orders, products, or customers…" value="<?= e($_GET['q'] ?? '') ?>" autocomplete="off">
          <kbd>⌘K</kbd>
        </form>
        <div class="topbar-actions">
          <div class="theme-switch" role="group" aria-label="Colour mode">
            <button type="button" class="theme-btn<?= $uiTheme==='light'?' active':'' ?>" data-theme-set="light" title="Light">Light</button>
            <button type="button" class="theme-btn<?= $uiTheme==='dark'?' active':'' ?>" data-theme-set="dark" title="Dark">Dark</button>
            <button type="button" class="theme-btn<?= $uiTheme==='warm'?' active':'' ?>" data-theme-set="warm" title="Warm">Warm</button>
          </div>
          <?php if (module_enabled('ecommerce') && module_enabled('website')): ?>
            <a class="btn btn-outline btn-sm" href="<?= e(url('shop/')) ?>" target="_blank">View Shop</a>
          <?php elseif (module_enabled('website')): ?>
            <a class="btn btn-outline btn-sm" href="<?= e(url('public/')) ?>" target="_blank">View Site</a>
          <?php endif; ?>
          <span class="avatar-chip" title="<?= e($user['name'] ?? '') ?>"><?= e(mb_substr($user['name'] ?? 'U', 0, 1)) ?></span>
        </div>
      </header>

      <?php if ($flash): ?>
        <div class="flash flash-<?= e($flash['type']) ?>"><?= e($flash['message']) ?></div>
      <?php endif; ?>

      <main class="content">
