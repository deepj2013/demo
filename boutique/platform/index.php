<?php
/**
 * Platform console — list / open enrolled boutiques
 */
declare(strict_types=1);

define('ROOT_PATH', dirname(__DIR__));
require_once ROOT_PATH . '/config/platform.php';

session_name('savoka_platform');
if (session_status() !== PHP_SESSION_ACTIVE) session_start();

function e_p(?string $s): string {
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$error = '';
$ok = '';

// Ensure platform DB + default tenant
try {
    platform_db();
    $hash = password_hash('platform123', PASSWORD_DEFAULT);
    platform_db()->prepare('UPDATE platform_admins SET password=? WHERE email=?')->execute([$hash, 'platform@savoka.local']);
    ensure_default_tenant_from_settings();
} catch (Throwable $e) {
    $error = $e->getMessage();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'login') {
    $email = trim((string) ($_POST['email'] ?? ''));
    $pass = (string) ($_POST['password'] ?? '');
    $st = platform_db()->prepare('SELECT * FROM platform_admins WHERE email=? LIMIT 1');
    $st->execute([$email]);
    $admin = $st->fetch();
    if ($admin && password_verify($pass, $admin['password'])) {
        $_SESSION['platform_admin'] = ['id' => $admin['id'], 'name' => $admin['name'], 'email' => $admin['email']];
        header('Location: /platform/');
        exit;
    }
    $error = 'Invalid platform login.';
}

if (isset($_GET['logout'])) {
    unset($_SESSION['platform_admin']);
    header('Location: /platform/');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'status' && !empty($_SESSION['platform_admin'])) {
    $id = (int) ($_POST['id'] ?? 0);
    $status = $_POST['status'] ?? 'active';
    if (in_array($status, ['active','suspended'], true) && $id > 0) {
        platform_db()->prepare('UPDATE tenants SET status=? WHERE id=?')->execute([$status, $id]);
        $ok = 'Tenant status updated.';
    }
}

$loggedIn = !empty($_SESSION['platform_admin']);
$tenants = $loggedIn ? list_tenants() : [];
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Platform · Savoka Host</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/app.css">
</head>
<body class="app-body">
  <div style="max-width:1000px;margin:0 auto;padding:1.5rem">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.25rem">
      <div>
        <div class="auth-brand" style="color:var(--accent)">SAVOKA HOST</div>
        <h1 style="font-size:1.75rem;margin-top:.25rem">Platform console</h1>
      </div>
      <div style="display:flex;gap:.5rem">
        <a class="btn btn-outline btn-sm" href="/">Home</a>
        <a class="btn btn-primary btn-sm" href="/enroll/">Enroll client</a>
        <?php if ($loggedIn): ?><a class="btn btn-ghost btn-sm" style="color:var(--ink)" href="?logout=1">Logout</a><?php endif; ?>
      </div>
    </div>

    <?php if ($error): ?><div class="flash flash-error" style="margin-bottom:1rem"><?= e_p($error) ?></div><?php endif; ?>
    <?php if ($ok): ?><div class="flash flash-success" style="margin-bottom:1rem"><?= e_p($ok) ?></div><?php endif; ?>

    <?php if (!$loggedIn): ?>
      <div class="panel" style="max-width:420px">
        <div class="panel-head"><h2>Platform login</h2></div>
        <div class="panel-body">
          <form method="post" class="form-grid" style="grid-template-columns:1fr">
            <input type="hidden" name="action" value="login">
            <div class="field"><label>Email</label><input type="email" name="email" value="platform@savoka.local" required></div>
            <div class="field"><label>Password</label><input type="password" name="password" value="platform123" required></div>
            <div class="form-actions"><button class="btn btn-primary" type="submit">Sign in</button></div>
          </form>
          <p style="margin-top:1rem;font-size:.8rem;color:var(--muted)">Default: platform@savoka.local / platform123</p>
        </div>
      </div>
    <?php else: ?>
      <div class="stat-card" style="margin-bottom:1rem">
        <div class="label">Enrolled boutiques</div>
        <div class="value"><?= count($tenants) ?></div>
        <div class="hint">Each client has an isolated MySQL database + subdomain</div>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Tenants</h2></div>
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Business</th><th>Subdomain</th><th>DB</th><th>Admin</th><th>Status</th><th>Open</th></tr></thead>
            <tbody>
            <?php if (!$tenants): ?>
              <tr><td colspan="6" style="color:var(--muted)">No tenants yet. <a href="/enroll/">Enroll the first boutique</a>.</td></tr>
            <?php endif; ?>
            <?php foreach ($tenants as $t): ?>
              <tr>
                <td><strong><?= e_p($t['business_name']) ?></strong><div style="font-size:.75rem;color:var(--muted)"><?= e_p($t['app_name']) ?></div></td>
                <td><code><?= e_p($t['slug']) ?>.<?= e_p(platform_base_domain()) ?></code></td>
                <td><code><?= e_p($t['db_name']) ?></code></td>
                <td><?= e_p($t['admin_email']) ?></td>
                <td>
                  <form method="post" style="display:inline">
                    <input type="hidden" name="action" value="status">
                    <input type="hidden" name="id" value="<?= (int)$t['id'] ?>">
                    <select name="status" onchange="this.form.submit()" class="filter-input" style="padding:.35rem .5rem">
                      <option value="active" <?= $t['status']==='active'?'selected':'' ?>>active</option>
                      <option value="suspended" <?= $t['status']==='suspended'?'selected':'' ?>>suspended</option>
                    </select>
                  </form>
                </td>
                <td style="white-space:nowrap">
                  <a class="btn btn-outline btn-sm" href="<?= e_p(tenant_public_url($t['slug'], 'admin/login.php')) ?>" target="_blank">Admin</a>
                  <a class="btn btn-outline btn-sm" href="<?= e_p(tenant_public_url($t['slug'], 'shop/')) ?>" target="_blank">Shop</a>
                </td>
              </tr>
            <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>
    <?php endif; ?>
  </div>
</body>
</html>
