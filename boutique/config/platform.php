<?php
/**
 * Multi-tenant platform — subdomain → client DB + settings
 */
declare(strict_types=1);

function platform_config(): array {
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    $file = ROOT_PATH . '/platform.json';
    $cfg = is_file($file) ? (json_decode((string) file_get_contents($file), true) ?: []) : [];
    return $cfg;
}

function platform_db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $c = platform_config()['database'] ?? [];
    $host = $c['host'] ?? '127.0.0.1';
    $name = $c['name'] ?? 'boutique_platform';
    $user = $c['user'] ?? 'root';
    $pass = (string) ($c['pass'] ?? '');
    try {
        $pdo = new PDO(
            "mysql:host={$host};dbname={$name};charset=utf8mb4",
            $user,
            $pass,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
    } catch (Throwable $e) {
        // Attempt create + import once
        $server = new PDO("mysql:host={$host};charset=utf8mb4", $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $server->exec("CREATE DATABASE IF NOT EXISTS `{$name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo = new PDO(
            "mysql:host={$host};dbname={$name};charset=utf8mb4",
            $user,
            $pass,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
        $sqlFile = ROOT_PATH . '/database/platform.sql';
        if (is_file($sqlFile)) {
            $sql = (string) file_get_contents($sqlFile);
            $sql = preg_replace('/^\s*CREATE\s+DATABASE\b.*?;\s*/im', '', $sql) ?? $sql;
            $sql = preg_replace('/^\s*USE\s+.*?;\s*/im', '', $sql) ?? $sql;
            foreach (array_filter(array_map('trim', preg_split('/;\s*\n/', $sql) ?: [])) as $stmt) {
                if ($stmt === '' || str_starts_with($stmt, '--')) continue;
                try { $pdo->exec($stmt); } catch (Throwable $ex) {}
            }
        }
        $hash = password_hash('platform123', PASSWORD_DEFAULT);
        $pdo->prepare('UPDATE platform_admins SET password=? WHERE email=?')->execute([$hash, 'platform@savoka.local']);
    }
    return $pdo;
}

function platform_host(): string {
    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? 'localhost'));
    $host = preg_replace('/:\d+$/', '', $host) ?? $host;
    return $host;
}

function platform_base_domain(): string {
    $cfg = platform_config();
    return strtolower((string) ($cfg['base_domain'] ?? 'localhost'));
}

/** Extract tenant slug from subdomain, ?tenant=, or path /t/{slug}/ */
function resolve_tenant_slug(): ?string {
    if (!empty($_GET['tenant'])) {
        $s = slugify_tenant((string) $_GET['tenant']);
        return $s !== '' ? $s : null;
    }
    $host = platform_host();
    $base = platform_base_domain();
    if ($host === $base || $host === 'www.' . $base || $host === '127.0.0.1') {
        // Path-based fallback: /t/slug/...
        $uri = (string) ($_SERVER['REQUEST_URI'] ?? '');
        if (preg_match('#^/t/([a-z0-9\-]+)/#', $uri, $m)) {
            return $m[1];
        }
        return null;
    }
    if (str_ends_with($host, '.' . $base)) {
        $sub = substr($host, 0, -(strlen($base) + 1));
        $parts = explode('.', $sub);
        $slug = $parts[0] ?? '';
        $reserved = platform_config()['reserved_slugs'] ?? [];
        if ($slug === '' || in_array($slug, $reserved, true)) return null;
        return slugify_tenant($slug);
    }
    // Custom domain future: look up by full host as subdomain field
    return null;
}

function slugify_tenant(string $text): string {
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9\-]+/', '-', $text) ?? '';
    return trim($text, '-') ?: '';
}

function tenant_db_name(string $slug): string {
    $safe = preg_replace('/[^a-z0-9]/', '_', $slug) ?? 'client';
    return 'boutique_' . $safe;
}

function current_tenant(): ?array {
    static $tenant = null;
    static $resolved = false;
    if ($resolved) return $tenant;
    $resolved = true;
    $slug = resolve_tenant_slug();
    if (!$slug) {
        $tenant = null;
        return null;
    }
    try {
        $st = platform_db()->prepare('SELECT * FROM tenants WHERE slug=? AND status="active" LIMIT 1');
        $st->execute([$slug]);
        $row = $st->fetch();
        if (!$row) {
            $tenant = null;
            return null;
        }
        $settings = json_decode((string) $row['settings_json'], true) ?: [];
        $row['settings'] = $settings;
        $tenant = $row;
        return $tenant;
    } catch (Throwable $e) {
        $tenant = null;
        return null;
    }
}

function is_platform_apex(): bool {
    return current_tenant() === null && resolve_tenant_slug() === null;
}

function tenant_public_url(string $slug, string $path = ''): string {
    $base = platform_base_domain();
    $port = (int) (platform_config()['local_port'] ?? 8080);
    $host = $slug . '.' . $base;
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    // Preserve current request port if present
    $reqHost = (string) ($_SERVER['HTTP_HOST'] ?? '');
    if (preg_match('/:(\d+)$/', $reqHost, $m)) {
        $port = (int) $m[1];
    }
    $portPart = ($port === 80 || $port === 443) ? '' : ':' . $port;
    $path = ltrim($path, '/');
    return $scheme . '://' . $host . $portPart . '/' . $path;
}

function list_tenants(): array {
    try {
        return platform_db()->query('SELECT id, slug, business_name, app_name, subdomain, db_name, admin_email, status, created_at FROM tenants ORDER BY created_at DESC')->fetchAll();
    } catch (Throwable $e) {
        return [];
    }
}

function mysql_server_pdo(): PDO {
    $c = platform_config()['database'] ?? [];
    return new PDO(
        'mysql:host=' . ($c['host'] ?? '127.0.0.1') . ';charset=utf8mb4',
        $c['user'] ?? 'root',
        (string) ($c['pass'] ?? ''),
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
}

function run_sql_file_on(PDO $pdo, string $file, string $dbName): void {
    if (!is_file($file)) throw new RuntimeException('SQL missing: ' . basename($file));
    $sql = (string) file_get_contents($file);
    $sql = str_replace('boutique_os', $dbName, $sql);
    $sql = preg_replace('/^\s*CREATE\s+DATABASE\b.*?;\s*/im', '', $sql) ?? $sql;
    $sql = preg_replace('/^\s*USE\s+[`\']?' . preg_quote($dbName, '/') . '[`\']?\s*;\s*/im', '', $sql) ?? $sql;
    $pdo->exec('SET FOREIGN_KEY_CHECKS=0');
    $pdo->exec('SET NAMES utf8mb4');
    foreach (array_filter(array_map('trim', preg_split('/;\s*\n/', $sql) ?: [])) as $stmt) {
        if ($stmt === '' || str_starts_with($stmt, '--')) continue;
        if (preg_match('/^SET\s+FOREIGN_KEY_CHECKS\s*=/i', $stmt)) continue;
        if (preg_match('/^SET\s+NAMES\b/i', $stmt)) continue;
        try {
            $pdo->exec($stmt);
        } catch (Throwable $e) {
            $msg = $e->getMessage();
            if (str_contains($msg, 'Duplicate') || str_contains($msg, '1062')) continue;
            $pdo->exec('SET FOREIGN_KEY_CHECKS=1');
            throw new RuntimeException(basename($file) . ': ' . $msg . ' :: ' . substr(preg_replace('/\s+/', ' ', $stmt), 0, 160));
        }
    }
    $pdo->exec('SET FOREIGN_KEY_CHECKS=1');
}

/**
 * Enroll a new boutique client: create DB, import schema, register tenant, write settings file.
 */
function enroll_tenant(array $input): array {
    $slug = slugify_tenant((string) ($input['slug'] ?? ''));
    if ($slug === '' || strlen($slug) < 2) {
        throw new RuntimeException('Choose a subdomain slug (min 2 characters, letters/numbers).');
    }
    $reserved = platform_config()['reserved_slugs'] ?? [];
    if (in_array($slug, $reserved, true)) {
        throw new RuntimeException('That subdomain is reserved. Pick another.');
    }

    $pdoPlat = platform_db();
    $exists = $pdoPlat->prepare('SELECT id FROM tenants WHERE slug=? OR subdomain=? LIMIT 1');
    $exists->execute([$slug, $slug]);
    if ($exists->fetch()) {
        throw new RuntimeException('Subdomain already taken. Try another slug.');
    }

    $dbName = tenant_db_name($slug);
    $business = trim((string) ($input['business_name'] ?? '')) ?: 'Boutique';
    $appName = trim((string) ($input['app_name'] ?? 'Savoka')) ?: 'Savoka';
    $adminEmail = trim((string) ($input['admin_email'] ?? '')) ?: ('admin@' . $slug . '.local');
    $adminPass = (string) ($input['admin_password'] ?? 'admin123');
    if (strlen($adminPass) < 6) throw new RuntimeException('Admin password must be at least 6 characters.');

    $defaults = platform_config()['defaults'] ?? [];
    $modules = [
        'inventory' => !empty($input['mod_inventory']),
        'items' => !empty($input['mod_items']) || !empty($input['mod_inventory']),
        'racks' => !empty($input['mod_racks']),
        'costing' => !empty($input['mod_costing']),
        'vendors' => !empty($input['mod_vendors']),
        'crm' => !empty($input['mod_crm']),
        'reports' => !empty($input['mod_reports']),
        'ecommerce' => !empty($input['mod_ecommerce']),
        'website' => !empty($input['mod_website']),
    ];
    // If none selected, enable full suite
    if (!in_array(true, $modules, true)) {
        foreach ($modules as $k => $_) $modules[$k] = true;
    }

    $dbHost = platform_config()['database']['host'] ?? '127.0.0.1';
    $dbUser = platform_config()['database']['user'] ?? 'root';
    $dbPass = (string) (platform_config()['database']['pass'] ?? '');

    $settings = [
        'client_id' => $slug,
        'setup_complete' => true,
        'app_name' => $appName,
        'business_name' => $business,
        'tagline' => trim((string) ($input['tagline'] ?? 'Crafted fashion, managed with clarity')),
        'currency' => $defaults['currency'] ?? 'INR',
        'currency_symbol' => $defaults['currency_symbol'] ?? '₹',
        'timezone' => $defaults['timezone'] ?? 'Asia/Kolkata',
        'locale' => $defaults['locale'] ?? 'en_IN',
        'appearance' => $defaults['appearance'] ?? 'light',
        'branding' => [
            'logo' => '',
            'favicon' => 'assets/icons/icon-192.png',
            'login_hint' => !empty($input['import_demo']),
        ],
        'theme' => [
            'primary' => trim((string) ($input['theme_primary'] ?? '#2563EB')) ?: '#2563EB',
            'accent' => trim((string) ($input['theme_accent'] ?? '#2563EB')) ?: '#2563EB',
            'surface' => trim((string) ($input['theme_surface'] ?? '#F4F6FB')) ?: '#F4F6FB',
            'ink' => '#0F172A',
            'muted' => '#64748B',
        ],
        'database' => [
            'host' => $dbHost,
            'name' => $dbName,
            'user' => $dbUser,
            'pass' => $dbPass,
            'charset' => 'utf8mb4',
        ],
        'modules' => $modules,
        'features' => [
            'product_images' => true,
            'rack_management' => true,
            'bom_costing' => !empty($modules['costing']),
            'wage_tracking' => !empty($modules['costing']),
            'low_stock_alerts' => true,
            'pwa' => true,
        ],
        'contact' => [
            'email' => trim((string) ($input['contact_email'] ?? $adminEmail)),
            'phone' => trim((string) ($input['contact_phone'] ?? '')),
            'address' => trim((string) ($input['contact_address'] ?? '')),
            'whatsapp' => trim((string) ($input['whatsapp'] ?? '')),
            'instagram' => trim((string) ($input['instagram'] ?? '')),
            'website_url' => tenant_public_url($slug, 'shop/'),
        ],
        'ecommerce' => [
            'enable_cart' => true,
            'enable_checkout' => true,
            'tax_percent' => (float) ($input['tax_percent'] ?? ($defaults['tax_percent'] ?? 5)),
            'shipping_flat' => (float) ($input['shipping_flat'] ?? ($defaults['shipping_flat'] ?? 50)),
            'currency_note' => 'Prices in INR',
            'sales_target' => (float) ($defaults['sales_target'] ?? 200000),
        ],
        'admin' => [
            'default_email' => $adminEmail,
            'show_demo_hint' => !empty($input['import_demo']),
        ],
        'tenant' => [
            'slug' => $slug,
            'subdomain' => $slug,
            'enrolled_at' => date('c'),
        ],
    ];

    // Create database + schema
    $server = mysql_server_pdo();
    $server->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $clientPdo = new PDO(
        "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4",
        $dbUser,
        $dbPass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    run_sql_file_on($clientPdo, ROOT_PATH . '/database/schema.sql', $dbName);
    if (!empty($input['import_demo']) && is_file(ROOT_PATH . '/database/seed_demo.sql')) {
        run_sql_file_on($clientPdo, ROOT_PATH . '/database/seed_demo.sql', $dbName);
    }

    // Set admin credentials for this tenant
    $hash = password_hash($adminPass, PASSWORD_DEFAULT);
    $adminName = trim((string) ($input['admin_name'] ?? 'Admin')) ?: 'Admin';
    $updated = $clientPdo->prepare('UPDATE users SET name=?, email=?, password=? WHERE email=? OR email="admin@boutique.local"');
    $updated->execute([$adminName, $adminEmail, $hash, $adminEmail]);
    if ($updated->rowCount() === 0) {
        $clientPdo->prepare('UPDATE users SET name=?, email=?, password=? WHERE id=1')->execute([$adminName, $adminEmail, $hash]);
    }
    $cnt = (int) $clientPdo->query("SELECT COUNT(*) FROM users WHERE role='admin'")->fetchColumn();
    if ($cnt === 0) {
        $clientPdo->prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,"admin")')
            ->execute([$adminName, $adminEmail, $hash]);
    }

    // Logo upload (optional)
    if (!empty($input['logo_tmp']) && is_file($input['logo_tmp'])) {
        $dir = ROOT_PATH . '/assets/uploads/brand';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $ext = strtolower((string) ($input['logo_ext'] ?? 'png'));
        if (in_array($ext, ['jpg','jpeg','png','webp','gif'], true)) {
            $name = 'logo-' . $slug . '.' . ($ext === 'jpeg' ? 'jpg' : $ext);
            if (@rename($input['logo_tmp'], $dir . '/' . $name) || @copy($input['logo_tmp'], $dir . '/' . $name)) {
                $settings['branding']['logo'] = 'uploads/brand/' . $name;
            }
        }
    }

    // Persist settings file
    $tenantDir = ROOT_PATH . '/clients/tenants';
    if (!is_dir($tenantDir)) mkdir($tenantDir, 0755, true);
    $settingsPath = $tenantDir . '/' . $slug . '.settings.json';
    file_put_contents(
        $settingsPath,
        json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n"
    );

    $st = $pdoPlat->prepare('INSERT INTO tenants (slug,business_name,app_name,subdomain,db_name,admin_email,contact_email,contact_phone,status,settings_json) VALUES (?,?,?,?,?,?,?,?,?,?)');
    $st->execute([
        $slug,
        $business,
        $appName,
        $slug,
        $dbName,
        $adminEmail,
        $settings['contact']['email'],
        $settings['contact']['phone'],
        'active',
        json_encode($settings, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    ]);

    return [
        'slug' => $slug,
        'business_name' => $business,
        'db_name' => $dbName,
        'admin_email' => $adminEmail,
        'admin_password' => $adminPass,
        'url' => tenant_public_url($slug),
        'admin_url' => tenant_public_url($slug, 'admin/login.php'),
        'shop_url' => tenant_public_url($slug, 'shop/'),
        'settings_file' => 'clients/tenants/' . $slug . '.settings.json',
    ];
}

function ensure_default_tenant_from_settings(): void {
    $file = ROOT_PATH . '/settings.json';
    if (!is_file($file)) return;
    $settings = json_decode((string) file_get_contents($file), true) ?: [];
    if (empty($settings['setup_complete'])) return;
    $slug = slugify_tenant((string) ($settings['client_id'] ?? 'atelier')) ?: 'atelier';
    try {
        $pdo = platform_db();
        $st = $pdo->prepare('SELECT id FROM tenants WHERE slug=? LIMIT 1');
        $st->execute([$slug]);
        if ($st->fetch()) return;

        $dbName = $settings['database']['name'] ?? tenant_db_name($slug);
        $settings['client_id'] = $slug;
        $settings['tenant'] = ['slug' => $slug, 'subdomain' => $slug, 'enrolled_at' => date('c')];
        $tenantDir = ROOT_PATH . '/clients/tenants';
        if (!is_dir($tenantDir)) mkdir($tenantDir, 0755, true);
        file_put_contents($tenantDir . '/' . $slug . '.settings.json', json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");

        $pdo->prepare('INSERT INTO tenants (slug,business_name,app_name,subdomain,db_name,admin_email,contact_email,contact_phone,status,settings_json) VALUES (?,?,?,?,?,?,?,?,?,?)')
            ->execute([
                $slug,
                $settings['business_name'] ?? 'Atelier Boutique',
                $settings['app_name'] ?? 'Savoka',
                $slug,
                $dbName,
                $settings['admin']['default_email'] ?? 'admin@boutique.local',
                $settings['contact']['email'] ?? null,
                $settings['contact']['phone'] ?? null,
                'active',
                json_encode($settings, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ]);
    } catch (Throwable $e) {
        // platform may not be ready yet
    }
}
