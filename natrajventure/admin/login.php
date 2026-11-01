<?php
require_once dirname(__DIR__) . '/shared/auth.php';
require_once dirname(__DIR__) . '/shared/widgets.php';
global $NV_COMPANY;

if (nv_admin_logged_in()) {
    header('Location: ' . NV_URL . '/admin/');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = trim((string) ($_POST['username'] ?? ''));
    $pass = (string) ($_POST['password'] ?? '');
    if (nv_admin_login($user, $pass)) {
        header('Location: ' . NV_URL . '/admin/');
        exit;
    }
    $error = 'Invalid username or password.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Login · Natraj Ventures</title>
  <link rel="icon" href="<?= nv_e($NV_COMPANY['logo']) ?>">
  <link rel="stylesheet" href="<?= nv_e(NV_ASSETS) ?>/css/admin.css">
</head>
<body class="admin">
  <div class="login-wrap">
    <form class="login-card" method="post" autocomplete="current-password">
      <img src="<?= nv_e($NV_COMPANY['logo']) ?>" alt="Natraj Ventures">
      <h1>Admin portal</h1>
      <p>Single panel for chai orders, finance leads & curtain inquiries.</p>
      <?php if ($error): ?><div class="err"><?= nv_e($error) ?></div><?php endif; ?>
      <label>User ID<input name="username" required value="admin"></label>
      <label>Password<input type="password" name="password" required></label>
      <button type="submit">Sign in</button>
    </form>
  </div>
</body>
</html>
