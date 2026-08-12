<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
if (is_logged_in()) redirect('admin/index.php');

$error = '';
$cfg = settings();
$defaultEmail = $cfg['admin']['default_email'] ?? 'admin@boutique.local';
$showHint = !empty($cfg['admin']['show_demo_hint']) || !empty($cfg['branding']['login_hint']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    if (!verify_csrf($_POST['csrf'] ?? null)) {
        $error = 'Invalid session. Refresh and try again.';
    } elseif (attempt_login($email, $password)) {
        redirect('admin/index.php');
    } else {
        $error = 'Invalid email or password.';
    }
}
$setupOk = isset($_GET['setup']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="<?= e($cfg['theme']['primary'] ?? '#0B1220') ?>">
  <title>Sign in · <?= e($cfg['business_name']) ?></title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(asset('css/app.css')) ?>">
  <style>:root{--primary:<?= e($cfg['theme']['primary'] ?? '#0B1220') ?>;--accent:<?= e($cfg['theme']['accent'] ?? '#C4A574') ?>;--surface:<?= e($cfg['theme']['surface'] ?? '#F7F4EF') ?>}</style>
</head>
<body class="auth-page">
  <div class="auth-card">
    <div class="auth-brand">
      <?php if ($logo = brand_logo_url()): ?>
        <img src="<?= e($logo) ?>" alt="" style="width:28px;height:28px;border-radius:8px;object-fit:cover;vertical-align:middle">
      <?php else: ?>
        <span class="brand-mark" style="width:28px;height:28px;display:inline-block;border-radius:8px;background:linear-gradient(135deg,var(--accent),#8B7355);vertical-align:middle"></span>
      <?php endif; ?>
      <?= e($cfg['app_name']) ?>
    </div>
    <h1><?= e($cfg['business_name']) ?></h1>
    <p class="sub">Staff sign-in<?= $cfg['tagline'] ? ' · ' . e($cfg['tagline']) : '' ?></p>
    <?php if ($setupOk): ?><div class="flash flash-success" style="margin:0 0 1rem">Client settings saved. Sign in to continue.</div><?php endif; ?>
    <?php if ($error): ?><div class="flash flash-error" style="margin:0 0 1rem"><?= e($error) ?></div><?php endif; ?>
    <form method="post" class="form-grid" style="grid-template-columns:1fr">
      <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
      <div class="field">
        <label>Email</label>
        <input type="email" name="email" required autocomplete="username" value="<?= e($defaultEmail) ?>">
      </div>
      <div class="field">
        <label>Password</label>
        <input type="password" name="password" required autocomplete="current-password">
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%;margin-top:.5rem">Sign in</button>
    </form>
    <?php if ($showHint): ?>
      <p style="margin-top:1.25rem;font-size:.8rem;color:var(--muted);text-align:center">Demo: admin@boutique.local / admin123</p>
    <?php endif; ?>
    <p style="margin-top:.75rem;font-size:.75rem;color:var(--muted);text-align:center"><a href="<?= e(url('install/')) ?>">Client setup / switch brand</a></p>
  </div>
</body>
</html>
