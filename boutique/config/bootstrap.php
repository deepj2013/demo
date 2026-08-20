<?php
/**
 * BoutiqueOS / Savoka — Application Bootstrap (multi-tenant aware)
 */
declare(strict_types=1);

define('ROOT_PATH', dirname(__DIR__));
define('BASE_URL', rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? ''), '/\\'));

require_once ROOT_PATH . '/config/platform.php';

$__tenantSlug = resolve_tenant_slug();
session_name('savoka_' . preg_replace('/[^a-z0-9_]/', '', $__tenantSlug ?: 'platform'));
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// Detect app root URL (works from /admin, /shop, /api, /enroll, /platform)
function app_base_url(): string {
    static $base = null;
    if ($base !== null) return $base;
    $script = $_SERVER['SCRIPT_NAME'] ?? '';
    $dir = str_replace('\\', '/', dirname($script));
    $dir = preg_replace('#/(admin|shop|api|modules|install|public|enroll|platform)(/.*)?$#', '', $dir) ?? $dir;
    if ($dir === '/' || $dir === '\\' || $dir === '.') $dir = '';
    $base = $dir;
    return $base;
}

function url(string $path = ''): string {
    $base = app_base_url();
    $path = ltrim($path, '/');
    return ($base === '' ? '' : $base) . '/' . $path;
}

function asset(string $path): string {
    return url('assets/' . ltrim($path, '/'));
}

function settings_path(): string {
    $t = current_tenant();
    if ($t) {
        $p = ROOT_PATH . '/clients/tenants/' . $t['slug'] . '.settings.json';
        if (is_file($p)) return $p;
    }
    return ROOT_PATH . '/settings.json';
}

function settings(): array {
    static $cfg = null;
    if ($cfg !== null) return $cfg;

    $t = current_tenant();
    if ($t) {
        $file = ROOT_PATH . '/clients/tenants/' . $t['slug'] . '.settings.json';
        if (is_file($file)) {
            $cfg = json_decode((string) file_get_contents($file), true) ?: [];
        } else {
            $cfg = $t['settings'] ?? [];
        }
        if (!$cfg) {
            throw new RuntimeException('Tenant settings missing for ' . $t['slug']);
        }
        return $cfg;
    }

    $file = ROOT_PATH . '/settings.json';
    if (!is_file($file)) {
        throw new RuntimeException('settings.json missing — copy clients/_template.settings.json to settings.json');
    }
    $cfg = json_decode((string) file_get_contents($file), true) ?: [];
    return $cfg;
}

/** Persist client config (and sync tenant registry when on subdomain). */
function save_settings(array $cfg): bool {
    $cfg['setup_complete'] = true;
    $json = json_encode($cfg, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) return false;
    $path = settings_path();
    $dir = dirname($path);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $tmp = $path . '.tmp';
    if (file_put_contents($tmp, $json . "\n") === false) return false;
    if (!rename($tmp, $path)) {
        if (file_put_contents($path, $json . "\n") === false) return false;
    }
    $t = current_tenant();
    if ($t) {
        try {
            platform_db()->prepare('UPDATE tenants SET business_name=?, app_name=?, admin_email=?, contact_email=?, contact_phone=?, settings_json=? WHERE id=?')
                ->execute([
                    $cfg['business_name'] ?? $t['business_name'],
                    $cfg['app_name'] ?? $t['app_name'],
                    $cfg['admin']['default_email'] ?? $t['admin_email'],
                    $cfg['contact']['email'] ?? null,
                    $cfg['contact']['phone'] ?? null,
                    json_encode($cfg, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    $t['id'],
                ]);
        } catch (Throwable $e) {}
    }
    return true;
}

function brand_logo_url(): ?string {
    $logo = settings()['branding']['logo'] ?? '';
    if ($logo === '') return null;
    return asset(ltrim((string) $logo, '/'));
}

function apply_timezone(): void {
    try {
        $tz = settings()['timezone'] ?? 'Asia/Kolkata';
        date_default_timezone_set($tz);
    } catch (Throwable $e) {}
}

function settings_reload(): array {
    return json_decode((string) file_get_contents(settings_path()), true) ?: [];
}

function module_enabled(string $key): bool {
    return !empty(settings()['modules'][$key]);
}

function require_module(string $key): void {
    if (!module_enabled($key)) {
        http_response_code(403);
        exit('Module disabled for this boutique.');
    }
}

function money(float|int|string $amount): string {
    $s = settings();
    $sym = $s['currency_symbol'] ?? '₹';
    $n = (float) $amount;
    if (class_exists('NumberFormatter')) {
        $fmt = new NumberFormatter($s['locale'] ?? 'en_IN', NumberFormatter::DECIMAL);
        $fmt->setAttribute(NumberFormatter::FRACTION_DIGITS, 2);
        $fmt->setAttribute(NumberFormatter::MIN_FRACTION_DIGITS, 2);
        return $sym . $fmt->format($n);
    }
    $neg = $n < 0 ? '-' : '';
    $n = abs($n);
    $int = (int) floor($n);
    $dec = sprintf('%02d', (int) round(($n - $int) * 100));
    $sInt = (string) $int;
    if (strlen($sInt) <= 3) {
        return $neg . $sym . $sInt . '.' . $dec;
    }
    $last3 = substr($sInt, -3);
    $rest = substr($sInt, 0, -3);
    $rest = preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', $rest);
    return $neg . $sym . $rest . ',' . $last3 . '.' . $dec;
}

function ui_theme(): string {
    $allowed = ['light', 'dark', 'warm'];
    $fromCookie = $_COOKIE['boutique_theme'] ?? '';
    if (in_array($fromCookie, $allowed, true)) return $fromCookie;
    $def = settings()['appearance'] ?? 'light';
    return in_array($def, $allowed, true) ? $def : 'light';
}

function e(?string $str): string {
    return htmlspecialchars((string) $str, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function slugify(string $text): string {
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return trim($text, '-') ?: 'item';
}

function flash(string $type, string $message): void {
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function get_flash(): ?array {
    if (empty($_SESSION['flash'])) return null;
    $f = $_SESSION['flash'];
    unset($_SESSION['flash']);
    return $f;
}

function redirect(string $path): never {
    header('Location: ' . url($path));
    exit;
}

function json_response(array $data, int $code = 200): never {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function csrf_token(): string {
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function verify_csrf(?string $token): bool {
    return is_string($token) && isset($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $token);
}

$script = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
$onPlatformSurface = str_contains($script, '/install/')
    || str_contains($script, '/enroll/')
    || str_contains($script, '/platform/');

// Unknown subdomain
if ($__tenantSlug && !current_tenant() && !$onPlatformSurface) {
    http_response_code(404);
    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Boutique not found</title>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&display=swap" rel="stylesheet">
    <style>body{font-family:DM Sans,system-ui;display:grid;place-items:center;min-height:100vh;background:#F4F6FB;color:#0F172A;margin:0}
    .c{max-width:420px;padding:2rem;background:#fff;border-radius:16px;box-shadow:0 8px 30px rgba(15,23,42,.08);text-align:center}
    a{color:#2563EB;font-weight:600}</style></head><body><div class="c">
    <h1>Boutique not found</h1>
    <p>No active client for <strong>' . htmlspecialchars($__tenantSlug) . '</strong>.</p>
    <p><a href="http://' . htmlspecialchars(platform_base_domain()) . ':' . (int)(platform_config()['local_port'] ?? 8080) . '/enroll/">Enroll a new boutique</a></p>
    </div></body></html>';
    exit;
}

// Apex platform pages do not require client settings
if (!$onPlatformSurface && !$__tenantSlug) {
    // apex index / other — allow without tenant
} elseif (!$onPlatformSurface) {
    try {
        apply_timezone();
        if (empty(settings()['setup_complete'])) {
            header('Location: ' . url('install/'));
            exit;
        }
    } catch (Throwable $e) {
        header('Location: ' . url('enroll/'));
        exit;
    }
} else {
    try { apply_timezone(); } catch (Throwable $e) {}
}

require_once ROOT_PATH . '/config/database.php';
require_once ROOT_PATH . '/includes/auth.php';
require_once ROOT_PATH . '/includes/helpers.php';
