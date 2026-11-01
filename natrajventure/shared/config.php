<?php
declare(strict_types=1);

/**
 * Natraj Ventures — shared site config
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('NV_ROOT', dirname(__DIR__));
define('NV_DATA', NV_ROOT . '/data');
define('NV_BASE', rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/'));

// Resolve public base path relative to project root for nested sites
function nv_public_base(): string
{
    $script = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
    // Find /natrajventure/ or project folder in path
    if (preg_match('#^(.*?/natrajventure)(/|$)#', $script, $m)) {
        return $m[1];
    }
    // Fallback: climb from current script folder to project root
    $dir = str_replace('\\', '/', dirname($script));
    // If in /chai, /finance, /curtains, /admin, /api — go up
    $parts = explode('/', trim($dir, '/'));
    $last = end($parts);
    if (in_array($last, ['chai', 'finance', 'curtains', 'admin', 'api'], true)) {
        array_pop($parts);
        if (end($parts) === 'api') {
            array_pop($parts);
            if (in_array(end($parts), ['chai', 'finance', 'curtains'], true)) {
                array_pop($parts);
            }
        }
        return '/' . implode('/', $parts);
    }
    return $dir === '/' ? '' : $dir;
}

define('NV_URL', nv_public_base());
define('NV_ASSETS', NV_URL . '/assets');

$NV_COMPANY = [
    'name' => 'Natraj Ventures',
    'tagline' => 'Ideas to Impact',
    'phone' => '+91 89202 72410',
    'phone_raw' => '918920272410',
    'whatsapp' => '918920272410',
    'email' => 'info@natrajventrues.com',
    'address' => 'Shop no 3, Admeasuring Area, Sector 29, Leisure Valley HUDA Market, Gurugram, Haryana',
    'logo' => NV_ASSETS . '/img/logo/natraj-logo.jpg?v=2',
];

$NV_VERTICALS = [
    'chai' => [
        'name' => 'Natraj Chai',
        'slug' => 'chai',
        'url' => NV_URL . '/chai/',
        'blurb' => 'Premium masala chai blends in elegant packaging.',
        'color' => '#3d5a3e',
    ],
    'finance' => [
        'name' => 'Natraj Finance',
        'slug' => 'finance',
        'url' => NV_URL . '/finance/',
        'blurb' => 'Health insurance & loan guidance under one roof.',
        'color' => '#0b1f3a',
    ],
    'curtains' => [
        'name' => 'Natraj Curtains',
        'slug' => 'curtains',
        'url' => NV_URL . '/curtains/',
        'blurb' => 'Motorized curtains — sale, style & installation.',
        'color' => '#0d3b4c',
    ],
];

function nv_whatsapp_link(string $message = ''): string
{
    global $NV_COMPANY;
    $msg = $message !== '' ? $message : 'Hello Natraj Ventures, I would like to know more.';
    return 'https://wa.me/' . $NV_COMPANY['whatsapp'] . '?text=' . rawurlencode($msg);
}

function nv_e(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function nv_json_response(array $payload, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
