<?php
/**
 * Client setup wizard — configure a new boutique with little changes.
 * Does not load full bootstrap DB gate until needed.
 */
declare(strict_types=1);

session_start();
define('ROOT_PATH', dirname(__DIR__));

function install_url(string $path = ''): string {
    $script = $_SERVER['SCRIPT_NAME'] ?? '';
    $dir = str_replace('\\', '/', dirname(dirname($script)));
    if ($dir === '/' || $dir === '\\' || $dir === '.') $dir = '';
    return ($dir === '' ? '' : $dir) . '/' . ltrim($path, '/');
}

function load_settings_raw(): array {
    $file = ROOT_PATH . '/settings.json';
    if (!is_file($file)) {
        $tpl = ROOT_PATH . '/clients/_template.settings.json';
        if (is_file($tpl)) {
            copy($tpl, $file);
        }
    }
    return json_decode((string) @file_get_contents(ROOT_PATH . '/settings.json'), true) ?: [];
}

function list_presets(): array {
    $dir = ROOT_PATH . '/clients';
    $out = [];
    foreach (glob($dir . '/*.json') ?: [] as $f) {
        $base = basename($f);
        if (str_starts_with($base, '_')) continue;
        $data = json_decode((string) file_get_contents($f), true) ?: [];
        $out[] = [
            'file' => $base,
            'path' => $f,
            'client_id' => $data['client_id'] ?? $base,
            'business_name' => $data['business_name'] ?? $base,
            'modules' => $data['modules'] ?? [],
        ];
    }
    return $out;
}

/**
 * Create DB if missing, import schema/seed, set admin password.
 */
function ensure_database(array $db, bool $autoCreate = true, bool $withDemoSeed = true): void {
    $host = $db['host'] ?? '127.0.0.1';
    $name = trim((string) ($db['name'] ?? ''));
    $user = $db['user'] ?? 'root';
    $pass = (string) ($db['pass'] ?? '');
    if ($name === '' || !preg_match('/^[A-Za-z0-9_]+$/', $name)) {
        throw new RuntimeException('Invalid database name. Use letters, numbers, underscore only.');
    }

    try {
        $server = new PDO(
            'mysql:host=' . $host . ';charset=utf8mb4',
            $user,
            $pass,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    } catch (Throwable $e) {
        throw new RuntimeException('Cannot connect to MySQL server: ' . $e->getMessage());
    }

    $exists = $server->query("SHOW DATABASES LIKE " . $server->quote($name))->fetch();
    if (!$exists) {
        if (!$autoCreate) {
            throw new RuntimeException("Database '{$name}' does not exist. Tick “Auto-create database & import schema” or create it in phpMyAdmin.");
        }
        $server->exec("CREATE DATABASE `{$name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    }

    $pdo = new PDO(
        'mysql:host=' . $host . ';dbname=' . $name . ';charset=utf8mb4',
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $hasUsers = false;
    try {
        $hasUsers = (bool) $pdo->query("SHOW TABLES LIKE 'users'")->fetch();
    } catch (Throwable $e) {
        $hasUsers = false;
    }

    if (!$hasUsers) {
        if (!$autoCreate) {
            throw new RuntimeException("Database '{$name}' is empty. Import database/schema.sql or enable auto-import.");
        }
        run_sql_file($pdo, ROOT_PATH . '/database/schema.sql', $name);
        if ($withDemoSeed && is_file(ROOT_PATH . '/database/seed_demo.sql')) {
            run_sql_file($pdo, ROOT_PATH . '/database/seed_demo.sql', $name);
        }
        // Recalculate BOMs if present
        try {
            foreach ($pdo->query('SELECT id FROM bom_headers') as $b) {
                // light touch — costs can be recalculated in admin
            }
        } catch (Throwable $e) {}
    }

    // Ensure demo admin password = admin123
    try {
        $hash = password_hash('admin123', PASSWORD_DEFAULT);
        $pdo->prepare('UPDATE users SET password = ? WHERE email = ?')->execute([$hash, 'admin@boutique.local']);
    } catch (Throwable $e) {}
}

function run_sql_file(PDO $pdo, string $file, string $dbName): void {
    if (!is_file($file)) {
        throw new RuntimeException('SQL file missing: ' . basename($file));
    }
    $sql = (string) file_get_contents($file);
    // Point schema/seed at the client DB name
    $sql = str_replace('boutique_os', $dbName, $sql);
    // Remove CREATE DATABASE / USE — we already selected the DB
    $sql = preg_replace('/^\s*CREATE\s+DATABASE\b.*?;\s*/im', '', $sql) ?? $sql;
    $sql = preg_replace('/^\s*USE\s+[`\']?' . preg_quote($dbName, '/') . '[`\']?\s*;\s*/im', '', $sql) ?? $sql;

    // Split on semicolons outside of simple context
    $statements = array_filter(array_map('trim', preg_split('/;\s*\n/', $sql) ?: []));
    foreach ($statements as $stmt) {
        if ($stmt === '' || str_starts_with($stmt, '--')) continue;
        // skip leftover SET-only noise is fine
        try {
            $pdo->exec($stmt);
        } catch (Throwable $e) {
            // Ignore duplicate seed inserts
            $msg = $e->getMessage();
            if (str_contains($msg, 'Duplicate') || str_contains($msg, '1062')) {
                continue;
            }
            throw new RuntimeException('SQL import error in ' . basename($file) . ': ' . $msg);
        }
    }
}

$cfg = load_settings_raw();
$error = '';
$success = '';
$step = $_GET['step'] ?? 'brand';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'save';
    try {
        if ($action === 'load_preset') {
            $file = basename($_POST['preset'] ?? '');
            $path = ROOT_PATH . '/clients/' . $file;
            if (!is_file($path)) throw new RuntimeException('Preset not found.');
            $preset = json_decode((string) file_get_contents($path), true);
            if (!$preset) throw new RuntimeException('Invalid preset JSON.');
            // Keep existing DB password if preset blank and current has one
            if (($preset['database']['pass'] ?? '') === '' && !empty($cfg['database']['pass'])) {
                $preset['database']['pass'] = $cfg['database']['pass'];
            }
            $preset['setup_complete'] = false;
            file_put_contents(ROOT_PATH . '/settings.json', json_encode($preset, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
            $cfg = $preset;
            $success = 'Preset loaded: ' . ($preset['business_name'] ?? $file) . '. Review and Save & finish.';
            $step = 'brand';
        } elseif ($action === 'save') {
            $cfg['client_id'] = preg_replace('/[^a-z0-9\-]/', '', strtolower(trim($_POST['client_id'] ?? 'client'))) ?: 'client';
            $cfg['app_name'] = trim($_POST['app_name'] ?? 'BoutiqueOS') ?: 'BoutiqueOS';
            $cfg['business_name'] = trim($_POST['business_name'] ?? '') ?: 'Boutique';
            $cfg['tagline'] = trim($_POST['tagline'] ?? '');
            $cfg['currency'] = trim($_POST['currency'] ?? 'INR');
            $cfg['currency_symbol'] = trim($_POST['currency_symbol'] ?? '₹');
            $cfg['timezone'] = trim($_POST['timezone'] ?? 'Asia/Kolkata');

            $cfg['theme']['primary'] = trim($_POST['theme_primary'] ?? '#0B1220');
            $cfg['theme']['accent'] = trim($_POST['theme_accent'] ?? '#C4A574');
            $cfg['theme']['surface'] = trim($_POST['theme_surface'] ?? '#F7F4EF');

            $cfg['contact']['email'] = trim($_POST['email'] ?? '');
            $cfg['contact']['phone'] = trim($_POST['phone'] ?? '');
            $cfg['contact']['address'] = trim($_POST['address'] ?? '');
            $cfg['contact']['whatsapp'] = trim($_POST['whatsapp'] ?? '');
            $cfg['contact']['instagram'] = trim($_POST['instagram'] ?? '');

            $cfg['database']['host'] = trim($_POST['db_host'] ?? '127.0.0.1');
            $cfg['database']['name'] = trim($_POST['db_name'] ?? 'boutique_os');
            $cfg['database']['user'] = trim($_POST['db_user'] ?? 'root');
            if (array_key_exists('db_pass', $_POST)) {
                $cfg['database']['pass'] = (string) $_POST['db_pass'];
            }

            $moduleKeys = ['inventory','items','racks','costing','vendors','crm','reports','ecommerce','website'];
            foreach ($moduleKeys as $m) {
                $cfg['modules'][$m] = isset($_POST['mod_' . $m]);
            }
            // Keep items+inventory sensible
            if (!empty($cfg['modules']['inventory'])) $cfg['modules']['items'] = true;

            $cfg['ecommerce']['tax_percent'] = (float)($_POST['tax_percent'] ?? 5);
            $cfg['ecommerce']['shipping_flat'] = (float)($_POST['shipping_flat'] ?? 50);

            $cfg['admin']['default_email'] = trim($_POST['admin_email'] ?? 'admin@boutique.local');
            $cfg['admin']['show_demo_hint'] = isset($_POST['show_demo_hint']);
            $cfg['branding']['login_hint'] = !empty($cfg['admin']['show_demo_hint']);

            // Logo upload
            if (!empty($_FILES['logo']['name']) && ($_FILES['logo']['error'] ?? 0) === UPLOAD_ERR_OK) {
                $dir = ROOT_PATH . '/assets/uploads/brand';
                if (!is_dir($dir)) mkdir($dir, 0755, true);
                $ext = strtolower(pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION));
                if (in_array($ext, ['jpg','jpeg','png','webp','gif','svg'], true)) {
                    $name = 'logo-' . $cfg['client_id'] . '.' . ($ext === 'jpeg' ? 'jpg' : $ext);
                    if (move_uploaded_file($_FILES['logo']['tmp_name'], $dir . '/' . $name)) {
                        $cfg['branding']['logo'] = 'uploads/brand/' . $name;
                    }
                }
            }

            $cfg['setup_complete'] = true;

            $autoSetup = isset($_POST['auto_create_db']);
            $withDemo = isset($_POST['import_demo_seed']);
            ensure_database($cfg['database'], $autoSetup, $withDemo);

            file_put_contents(ROOT_PATH . '/settings.json', json_encode($cfg, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
            header('Location: ' . install_url('admin/login.php') . '?setup=1');
            exit;
        }
    } catch (Throwable $ex) {
        // Still save settings even if DB fails, with setup_complete false so wizard stays
        if (($action ?? '') === 'save' && isset($cfg)) {
            $cfg['setup_complete'] = false;
            file_put_contents(ROOT_PATH . '/settings.json', json_encode($cfg, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
        }
        $error = $ex->getMessage();
        $cfg = load_settings_raw();
    }
}

$presets = list_presets();
$mods = $cfg['modules'] ?? [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Client setup · BoutiqueOS</title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= htmlspecialchars(install_url('assets/css/app.css')) ?>">
  <style>
    :root{--primary:#0B1220;--accent:#C4A574;--surface:#F7F4EF;--ink:#1A1A1A;--muted:#6B7280}
    .setup-wrap{max-width:860px;margin:0 auto;padding:1.5rem}
    .mod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:.5rem}
    .mod-grid label{display:flex;gap:.5rem;align-items:center;padding:.65rem .75rem;background:#fff;border:1px solid var(--line,rgba(0,0,0,.08));border-radius:12px;font-size:.85rem;font-weight:600;cursor:pointer}
  </style>
</head>
<body class="app-body">
  <div class="setup-wrap">
    <div style="margin-bottom:1.5rem">
      <div class="auth-brand" style="color:var(--accent);margin-bottom:.5rem">BOUTIQUEOS · WHITE LABEL</div>
      <h1 style="font-family:Fraunces,serif;font-size:clamp(1.8rem,4vw,2.4rem)">New client setup</h1>
      <p style="color:var(--muted);max-width:52ch">Change brand, modules, colours & database once — same codebase, ready for another boutique.</p>
    </div>

    <?php if ($error): ?><div class="flash flash-error" style="margin-bottom:1rem"><?= htmlspecialchars($error) ?></div><?php endif; ?>
    <?php if ($success): ?><div class="flash flash-success" style="margin-bottom:1rem"><?= htmlspecialchars($success) ?></div><?php endif; ?>

    <div class="panel" style="margin-bottom:1.25rem">
      <div class="panel-head"><h2>1. Start from a preset (optional)</h2></div>
      <div class="panel-body">
        <form method="post" class="toolbar" style="margin:0">
          <input type="hidden" name="action" value="load_preset">
          <select name="preset" style="border:1px solid var(--line);border-radius:12px;padding:.65rem .85rem;background:#fff;min-width:220px">
            <?php foreach ($presets as $p): ?>
              <option value="<?= htmlspecialchars($p['file']) ?>"><?= htmlspecialchars($p['business_name']) ?> (<?= htmlspecialchars($p['client_id']) ?>)</option>
            <?php endforeach; ?>
          </select>
          <button class="btn btn-outline" type="submit">Load preset</button>
        </form>
        <p style="font-size:.8rem;color:var(--muted);margin-top:.75rem">Or edit <code>clients/_template.settings.json</code> and copy to <code>settings.json</code>.</p>
      </div>
    </div>

    <form method="post" enctype="multipart/form-data" class="panel">
      <input type="hidden" name="action" value="save">
      <div class="panel-head"><h2>2. Client brand & modules</h2></div>
      <div class="panel-body form-grid">
        <div class="field"><label>Client ID (slug)</label><input name="client_id" required value="<?= htmlspecialchars($cfg['client_id'] ?? '') ?>" placeholder="style-house"></div>
        <div class="field"><label>App name (sidebar)</label><input name="app_name" value="<?= htmlspecialchars($cfg['app_name'] ?? 'BoutiqueOS') ?>"></div>
        <div class="field"><label>Business name</label><input name="business_name" required value="<?= htmlspecialchars($cfg['business_name'] ?? '') ?>"></div>
        <div class="field"><label>Tagline</label><input name="tagline" value="<?= htmlspecialchars($cfg['tagline'] ?? '') ?>"></div>
        <div class="field"><label>Currency code</label><input name="currency" value="<?= htmlspecialchars($cfg['currency'] ?? 'INR') ?>"></div>
        <div class="field"><label>Currency symbol</label><input name="currency_symbol" value="<?= htmlspecialchars($cfg['currency_symbol'] ?? '₹') ?>"></div>
        <div class="field"><label>Timezone</label><input name="timezone" value="<?= htmlspecialchars($cfg['timezone'] ?? 'Asia/Kolkata') ?>"></div>
        <div class="field"><label>Logo (optional)</label><input type="file" name="logo" accept="image/*"></div>

        <div class="field"><label>Primary colour</label><input type="color" name="theme_primary" value="<?= htmlspecialchars($cfg['theme']['primary'] ?? '#0B1220') ?>"></div>
        <div class="field"><label>Accent colour</label><input type="color" name="theme_accent" value="<?= htmlspecialchars($cfg['theme']['accent'] ?? '#C4A574') ?>"></div>
        <div class="field"><label>Surface colour</label><input type="color" name="theme_surface" value="<?= htmlspecialchars($cfg['theme']['surface'] ?? '#F7F4EF') ?>"></div>

        <div class="field"><label>Email</label><input name="email" value="<?= htmlspecialchars($cfg['contact']['email'] ?? '') ?>"></div>
        <div class="field"><label>Phone</label><input name="phone" value="<?= htmlspecialchars($cfg['contact']['phone'] ?? '') ?>"></div>
        <div class="field full"><label>Address</label><input name="address" value="<?= htmlspecialchars($cfg['contact']['address'] ?? '') ?>"></div>
        <div class="field"><label>WhatsApp</label><input name="whatsapp" value="<?= htmlspecialchars($cfg['contact']['whatsapp'] ?? '') ?>"></div>
        <div class="field"><label>Instagram</label><input name="instagram" value="<?= htmlspecialchars($cfg['contact']['instagram'] ?? '') ?>"></div>

        <div class="field full"><label>Modules (plug & play)</label>
          <div class="mod-grid">
            <?php foreach (['inventory'=>'Inventory','items'=>'Item Master','racks'=>'Racks','costing'=>'Costing/BOM','vendors'=>'Vendors','crm'=>'CRM','reports'=>'Reports','ecommerce'=>'Ecommerce','website'=>'Website'] as $k=>$label): ?>
              <label><input type="checkbox" name="mod_<?= $k ?>" <?= !empty($mods[$k]) ? 'checked' : '' ?>> <?= $label ?></label>
            <?php endforeach; ?>
          </div>
        </div>

        <div class="field"><label>Tax %</label><input type="number" step="0.01" name="tax_percent" value="<?= htmlspecialchars((string)($cfg['ecommerce']['tax_percent'] ?? 5)) ?>"></div>
        <div class="field"><label>Flat shipping</label><input type="number" step="0.01" name="shipping_flat" value="<?= htmlspecialchars((string)($cfg['ecommerce']['shipping_flat'] ?? 50)) ?>"></div>

        <div class="field full" style="margin-top:.5rem"><strong style="font-family:Fraunces,serif">3. Database (per client)</strong></div>
        <div class="field"><label>DB host</label><input name="db_host" value="<?= htmlspecialchars($cfg['database']['host'] ?? '127.0.0.1') ?>"></div>
        <div class="field"><label>DB name</label><input name="db_name" value="<?= htmlspecialchars($cfg['database']['name'] ?? 'boutique_os') ?>"></div>
        <div class="field"><label>DB user</label><input name="db_user" value="<?= htmlspecialchars($cfg['database']['user'] ?? 'root') ?>"></div>
        <div class="field"><label>DB password</label><input type="password" name="db_pass" value="<?= htmlspecialchars($cfg['database']['pass'] ?? '') ?>" autocomplete="new-password"></div>
        <div class="field full"><label><input type="checkbox" name="auto_create_db" checked> Auto-create database &amp; import schema if missing</label></div>
        <div class="field full"><label><input type="checkbox" name="import_demo_seed" checked> Also import demo seed data (items, orders, BOM)</label></div>

        <div class="field"><label>Admin login email (hint)</label><input name="admin_email" value="<?= htmlspecialchars($cfg['admin']['default_email'] ?? '') ?>"></div>
        <div class="field"><label><input type="checkbox" name="show_demo_hint" <?= !empty($cfg['admin']['show_demo_hint']) ? 'checked' : '' ?>> Show demo password hint on login</label></div>

        <div class="form-actions full">
          <a class="btn btn-outline" href="<?= htmlspecialchars(install_url('admin/login.php')) ?>">Skip to login</a>
          <button class="btn btn-primary" type="submit">Save & finish for this client</button>
        </div>
      </div>
    </form>

    <p style="margin-top:1.5rem;font-size:.8rem;color:var(--muted)">Leave <strong>Auto-create database</strong> checked — the wizard creates <code>boutique_stylehouse</code> (or whatever DB name you set) and imports tables. Login: <code>admin@boutique.local</code> / <code>admin123</code>.</p>
  </div>
</body>
</html>
