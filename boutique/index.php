<?php
/**
 * Apex home — Savoka Host landing (multi-tenant)
 */
declare(strict_types=1);

define('ROOT_PATH', __DIR__);
require_once ROOT_PATH . '/config/platform.php';

session_name('savoka_platform');
if (session_status() !== PHP_SESSION_ACTIVE) session_start();

$slug = resolve_tenant_slug();
if ($slug) {
    // On subdomain, use full app bootstrap + normal routing
    require_once ROOT_PATH . '/config/bootstrap.php';
    $cfg = settings();
    if (is_logged_in()) {
        redirect('admin/index.php');
    }
    if (module_enabled('ecommerce') || module_enabled('website')) {
        redirect(module_enabled('ecommerce') ? 'shop/' : 'public/');
    }
    redirect('admin/login.php');
}

// Apex: ensure platform ready + migrate existing settings as default tenant
try {
    platform_db();
    ensure_default_tenant_from_settings();
} catch (Throwable $e) {}

$tenants = [];
try { $tenants = list_tenants(); } catch (Throwable $e) {}
$base = platform_base_domain();
$port = (int) (platform_config()['local_port'] ?? 8080);
$portPart = ($port === 80 || $port === 443) ? '' : ':' . $port;
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Savoka Host · Boutique platform</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/app.css">
  <style>
    .land{max-width:980px;margin:0 auto;padding:2.5rem 1.25rem 4rem}
    .land h1{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(2.4rem,6vw,4rem);line-height:1;margin:.5rem 0 1rem}
    .land .lead{color:var(--muted);font-size:1.05rem;max-width:40ch;margin-bottom:1.5rem}
    .cta{display:flex;gap:.65rem;flex-wrap:wrap;margin-bottom:2.5rem}
    .tenant-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem}
    .tenant-card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:1.15rem;box-shadow:var(--shadow)}
    .tenant-card strong{display:block;font-size:1.05rem;margin-bottom:.25rem}
    .tenant-card code{font-size:.78rem;color:var(--muted)}
    .tenant-card .actions{display:flex;gap:.4rem;margin-top:.9rem}
  </style>
</head>
<body class="app-body">
  <div class="land">
    <div class="auth-brand" style="color:var(--accent)">SAVOKA HOST</div>
    <h1>Host every boutique on its own subdomain</h1>
    <p class="lead">Enroll a client, capture their brand data, spin up an isolated database, and open their Savoka admin + shop on <strong>slug.<?= htmlspecialchars($base) ?></strong>.</p>
    <div class="cta">
      <a class="btn btn-primary" href="/enroll/">Enroll new client</a>
      <a class="btn btn-outline" href="/platform/">Platform console</a>
    </div>

    <h2 style="font-size:1.2rem;margin-bottom:1rem">Live boutiques</h2>
    <?php if (!$tenants): ?>
      <div class="panel"><div class="panel-body empty"><p>No clients yet. Enroll the first boutique to create subdomain + database.</p></div></div>
    <?php else: ?>
      <div class="tenant-grid">
        <?php foreach ($tenants as $t): if ($t['status'] !== 'active') continue; ?>
          <div class="tenant-card">
            <strong><?= htmlspecialchars($t['business_name']) ?></strong>
            <code><?= htmlspecialchars($t['slug']) ?>.<?= htmlspecialchars($base) ?><?= htmlspecialchars($portPart) ?></code>
            <div class="actions">
              <a class="btn btn-primary btn-sm" href="<?= htmlspecialchars(tenant_public_url($t['slug'], 'admin/login.php')) ?>">Admin</a>
              <a class="btn btn-outline btn-sm" href="<?= htmlspecialchars(tenant_public_url($t['slug'], 'shop/')) ?>">Shop</a>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <p style="margin-top:2.5rem;font-size:.82rem;color:var(--muted)">Local tip: browsers resolve <code>*.localhost</code> to 127.0.0.1 automatically — no /etc/hosts edit needed.</p>
  </div>
</body>
</html>
