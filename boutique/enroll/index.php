<?php
/**
 * Client enrollment — create boutique + subdomain + isolated database
 */
declare(strict_types=1);

define('ROOT_PATH', dirname(__DIR__));
require_once ROOT_PATH . '/config/platform.php';

session_name('savoka_platform');
if (session_status() !== PHP_SESSION_ACTIVE) session_start();

function e_enroll(?string $s): string {
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$error = '';
$result = null;
$base = platform_base_domain();
$port = (int) (platform_config()['local_port'] ?? 8080);
$portPart = ($port === 80 || $port === 443) ? '' : ':' . $port;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (empty($_SESSION['enroll_csrf']) || !hash_equals($_SESSION['enroll_csrf'], (string) ($_POST['csrf'] ?? ''))) {
            throw new RuntimeException('Invalid session. Refresh and try again.');
        }
        $logoTmp = null;
        $logoExt = null;
        if (!empty($_FILES['logo']['tmp_name']) && is_uploaded_file($_FILES['logo']['tmp_name'])) {
            $logoTmp = $_FILES['logo']['tmp_name'];
            $logoExt = strtolower(pathinfo((string) $_FILES['logo']['name'], PATHINFO_EXTENSION));
        }
        $result = enroll_tenant([
            'slug' => $_POST['slug'] ?? '',
            'business_name' => $_POST['business_name'] ?? '',
            'app_name' => $_POST['app_name'] ?? 'Savoka',
            'tagline' => $_POST['tagline'] ?? '',
            'admin_name' => $_POST['admin_name'] ?? 'Admin',
            'admin_email' => $_POST['admin_email'] ?? '',
            'admin_password' => $_POST['admin_password'] ?? '',
            'contact_email' => $_POST['contact_email'] ?? '',
            'contact_phone' => $_POST['contact_phone'] ?? '',
            'contact_address' => $_POST['contact_address'] ?? '',
            'whatsapp' => $_POST['whatsapp'] ?? '',
            'instagram' => $_POST['instagram'] ?? '',
            'theme_primary' => $_POST['theme_primary'] ?? '#2563EB',
            'theme_accent' => $_POST['theme_accent'] ?? '#2563EB',
            'theme_surface' => $_POST['theme_surface'] ?? '#F4F6FB',
            'tax_percent' => $_POST['tax_percent'] ?? 5,
            'shipping_flat' => $_POST['shipping_flat'] ?? 50,
            'mod_inventory' => isset($_POST['mod_inventory']),
            'mod_items' => isset($_POST['mod_items']),
            'mod_racks' => isset($_POST['mod_racks']),
            'mod_costing' => isset($_POST['mod_costing']),
            'mod_vendors' => isset($_POST['mod_vendors']),
            'mod_crm' => isset($_POST['mod_crm']),
            'mod_reports' => isset($_POST['mod_reports']),
            'mod_ecommerce' => isset($_POST['mod_ecommerce']),
            'mod_website' => isset($_POST['mod_website']),
            'import_demo' => isset($_POST['import_demo']),
            'logo_tmp' => $logoTmp,
            'logo_ext' => $logoExt,
        ]);
    } catch (Throwable $ex) {
        $error = $ex->getMessage();
    }
}

$_SESSION['enroll_csrf'] = bin2hex(random_bytes(16));
$csrf = $_SESSION['enroll_csrf'];
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Enroll boutique · Savoka Host</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/app.css">
  <style>
    .enroll-hero{padding:2.5rem 1.25rem 1rem;max-width:920px;margin:0 auto}
    .enroll-hero h1{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(2rem,4vw,3rem);margin:.35rem 0}
    .enroll-hero p{color:var(--muted);max-width:52ch}
    .slug-row{display:flex;align-items:center;gap:.35rem;flex-wrap:wrap}
    .slug-row input{flex:1;min-width:140px}
    .slug-hint{font-size:.8rem;color:var(--muted)}
    .mod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.5rem}
    .mod-grid label{display:flex;gap:.5rem;align-items:center;padding:.65rem .75rem;background:var(--panel);border:1px solid var(--line);border-radius:12px;font-size:.85rem;font-weight:600;cursor:pointer}
    .success-card{padding:1.5rem;border-radius:16px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.25)}
    .success-card a{color:#059669;font-weight:700}
    .top-links{display:flex;gap:1rem;justify-content:flex-end;padding:1rem 1.25rem;font-size:.88rem;font-weight:600}
  </style>
</head>
<body class="app-body">
  <div class="top-links">
    <a href="/">Home</a>
    <a href="/platform/">Platform console</a>
  </div>
  <div class="enroll-hero">
    <div class="auth-brand" style="color:var(--accent)">SAVOKA HOST</div>
    <h1>Enroll your boutique</h1>
    <p>Enter business details once. We create your private database, import the system, and host it on your subdomain — ready for inventory + ecommerce.</p>
  </div>

  <div class="setup-wrap" style="max-width:920px;margin:0 auto;padding:0 1.25rem 3rem">
    <?php if ($error): ?><div class="flash flash-error" style="margin-bottom:1rem"><?= e_enroll($error) ?></div><?php endif; ?>

    <?php if ($result): ?>
      <div class="panel" style="margin-bottom:1.25rem">
        <div class="panel-body success-card">
          <h2 style="margin-bottom:.5rem">Boutique is live</h2>
          <p><strong><?= e_enroll($result['business_name']) ?></strong> is ready on subdomain <code><?= e_enroll($result['slug']) ?></code>.</p>
          <ul style="margin:1rem 0;padding-left:1.1rem;line-height:1.8">
            <li>Admin: <a href="<?= e_enroll($result['admin_url']) ?>" target="_blank"><?= e_enroll($result['admin_url']) ?></a></li>
            <li>Shop: <a href="<?= e_enroll($result['shop_url']) ?>" target="_blank"><?= e_enroll($result['shop_url']) ?></a></li>
            <li>Login email: <code><?= e_enroll($result['admin_email']) ?></code></li>
            <li>Password: <code><?= e_enroll($result['admin_password']) ?></code></li>
            <li>Database: <code><?= e_enroll($result['db_name']) ?></code></li>
          </ul>
          <p style="font-size:.85rem;color:var(--muted)">On local Mac, <code>*.localhost</code> resolves automatically. Open the Admin link above.</p>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem">
            <a class="btn btn-primary" href="<?= e_enroll($result['admin_url']) ?>">Open admin</a>
            <a class="btn btn-outline" href="<?= e_enroll($result['shop_url']) ?>">Open shop</a>
            <a class="btn btn-outline" href="/enroll/">Enroll another</a>
          </div>
        </div>
      </div>
    <?php else: ?>

    <form method="post" enctype="multipart/form-data" class="panel">
      <input type="hidden" name="csrf" value="<?= e_enroll($csrf) ?>">
      <div class="panel-head"><h2>1. Subdomain & brand</h2></div>
      <div class="panel-body form-grid">
        <div class="field full">
          <label>Subdomain slug</label>
          <div class="slug-row">
            <input name="slug" required pattern="[a-z0-9\-]{2,40}" placeholder="minivibe" value="<?= e_enroll($_POST['slug'] ?? '') ?>">
            <span class="slug-hint">.<?= e_enroll($base) ?><?= e_enroll($portPart) ?></span>
          </div>
          <small class="slug-hint">Letters, numbers, hyphens. Becomes your URL: <strong>slug.<?= e_enroll($base) ?></strong></small>
        </div>
        <div class="field"><label>Business name</label><input name="business_name" required value="<?= e_enroll($_POST['business_name'] ?? '') ?>" placeholder="Mini Vibe Store"></div>
        <div class="field"><label>App name (sidebar)</label><input name="app_name" value="<?= e_enroll($_POST['app_name'] ?? 'Savoka') ?>"></div>
        <div class="field full"><label>Tagline</label><input name="tagline" value="<?= e_enroll($_POST['tagline'] ?? 'Fashion managed with clarity') ?>"></div>
        <div class="field"><label>Logo</label><input type="file" name="logo" accept="image/*"></div>
        <div class="field"><label>Primary</label><input type="color" name="theme_primary" value="#2563EB"></div>
        <div class="field"><label>Accent</label><input type="color" name="theme_accent" value="#2563EB"></div>
        <div class="field"><label>Surface</label><input type="color" name="theme_surface" value="#F4F6FB"></div>
      </div>

      <div class="panel-head"><h2>2. Admin login (this boutique)</h2></div>
      <div class="panel-body form-grid">
        <div class="field"><label>Admin name</label><input name="admin_name" required value="<?= e_enroll($_POST['admin_name'] ?? '') ?>"></div>
        <div class="field"><label>Admin email</label><input type="email" name="admin_email" required value="<?= e_enroll($_POST['admin_email'] ?? '') ?>"></div>
        <div class="field"><label>Admin password</label><input type="password" name="admin_password" required minlength="6" value="<?= e_enroll($_POST['admin_password'] ?? 'admin123') ?>"></div>
        <div class="field"><label>Contact phone</label><input name="contact_phone" value="<?= e_enroll($_POST['contact_phone'] ?? '') ?>"></div>
        <div class="field"><label>Contact email</label><input type="email" name="contact_email" value="<?= e_enroll($_POST['contact_email'] ?? '') ?>"></div>
        <div class="field full"><label>Address</label><input name="contact_address" value="<?= e_enroll($_POST['contact_address'] ?? '') ?>"></div>
        <div class="field"><label>WhatsApp</label><input name="whatsapp" value="<?= e_enroll($_POST['whatsapp'] ?? '') ?>"></div>
        <div class="field"><label>Instagram</label><input name="instagram" value="<?= e_enroll($_POST['instagram'] ?? '') ?>"></div>
        <div class="field"><label>Tax %</label><input type="number" step="0.01" name="tax_percent" value="5"></div>
        <div class="field"><label>Flat shipping (₹)</label><input type="number" step="0.01" name="shipping_flat" value="50"></div>
      </div>

      <div class="panel-head"><h2>3. Modules</h2></div>
      <div class="panel-body">
        <div class="mod-grid">
          <?php
          $mods = [
            'inventory'=>'Inventory','items'=>'Item Master','racks'=>'Rack Master','costing'=>'Costing/BOM',
            'vendors'=>'Vendor Master','crm'=>'Customers','reports'=>'Reports','ecommerce'=>'Ecommerce','website'=>'Website'
          ];
          foreach ($mods as $k=>$lab): ?>
            <label><input type="checkbox" name="mod_<?= $k ?>" checked> <?= e_enroll($lab) ?></label>
          <?php endforeach; ?>
        </div>
        <div class="field" style="margin-top:1rem">
          <label><input type="checkbox" name="import_demo" checked> Import demo inventory, BOM, orders (good for local demo)</label>
        </div>
        <div class="form-actions">
          <a class="btn btn-outline" href="/">Cancel</a>
          <button class="btn btn-primary" type="submit">Create boutique &amp; subdomain</button>
        </div>
      </div>
    </form>
    <?php endif; ?>
  </div>
</body>
</html>
