<?php
/**
 * BoutiqueOS — Application Bootstrap
 */
declare(strict_types=1);

session_start();

define('ROOT_PATH', dirname(__DIR__));
define('BASE_URL', rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? ''), '/\\'));

// Detect app root URL (works from /admin, /shop, /api)
function app_base_url(): string {
    static $base = null;
    if ($base !== null) return $base;
    $script = $_SERVER['SCRIPT_NAME'] ?? '';
    $dir = str_replace('\\', '/', dirname($script));
    // Climb out of admin/shop/api/modules
    $dir = preg_replace('#/(admin|shop|api|modules|install|public)(/.*)?$#', '', $dir) ?? $dir;
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
    return ROOT_PATH . '/settings.json';
}

function settings(): array {
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    $file = settings_path();
    if (!is_file($file)) {
        throw new RuntimeException('settings.json missing — copy clients/_template.settings.json to settings.json');
    }
    $cfg = json_decode((string) file_get_contents($file), true) ?: [];
    return $cfg;
}

/** Persist client config (white-label). */
function save_settings(array $cfg): bool {
    $cfg['setup_complete'] = true;
    $json = json_encode($cfg, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) return false;
    $tmp = settings_path() . '.tmp';
    if (file_put_contents($tmp, $json . "\n") === false) return false;
    if (!rename($tmp, settings_path())) {
        return file_put_contents(settings_path(), $json . "\n") !== false;
    }
    return true;
}

function brand_logo_url(): ?string {
    $logo = settings()['branding']['logo'] ?? '';
    if ($logo === '') return null;
    return asset(ltrim((string) $logo, '/'));
}

function apply_timezone(): void {
    $tz = settings()['timezone'] ?? 'Asia/Kolkata';
    try { date_default_timezone_set($tz); } catch (Throwable $e) {}
}

/** Fresh read (after save_settings in same request). */
function settings_reload(): array {
    $file = settings_path();
    return json_decode((string) file_get_contents($file), true) ?: [];
}

function module_enabled(string $key): bool {
    $s = settings();
    return !empty($s['modules'][$key]);
}

function require_module(string $key): void {
    if (!module_enabled($key)) {
        http_response_code(403);
        exit('Module disabled. Enable it in settings.json');
    }
}

function money(float|int|string $amount): string {
    $s = settings();
    $sym = $s['currency_symbol'] ?? '₹';
    return $sym . number_format((float) $amount, 2);
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

apply_timezone();

// First-run: send to client setup wizard (except setup pages themselves)
$script = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
$onSetup = str_contains($script, '/install/');
if (!$onSetup && empty(settings()['setup_complete'])) {
    header('Location: ' . url('install/'));
    exit;
}

require_once ROOT_PATH . '/config/database.php';
require_once ROOT_PATH . '/includes/auth.php';
require_once ROOT_PATH . '/includes/helpers.php';
