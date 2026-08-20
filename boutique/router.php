<?php
/**
 * PHP built-in server router for Savoka multi-tenant local hosting.
 * Usage: php -S 0.0.0.0:8080 router.php
 */
declare(strict_types=1);

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
$file = __DIR__ . $uri;

// Serve existing static files as-is
if ($uri !== '/' && is_file($file)) {
    return false;
}

// Directory index
if (is_dir($file)) {
    $index = rtrim($file, '/') . '/index.php';
    if (is_file($index)) {
        require $index;
        return true;
    }
}

// Pretty fallbacks
$fallbacks = [
    '/admin' => '/admin/index.php',
    '/shop' => '/shop/index.php',
    '/enroll' => '/enroll/index.php',
    '/platform' => '/platform/index.php',
    '/install' => '/install/index.php',
    '/public' => '/public/index.php',
];
if (isset($fallbacks[$uri]) && is_file(__DIR__ . $fallbacks[$uri])) {
    require __DIR__ . $fallbacks[$uri];
    return true;
}

// 404
http_response_code(404);
echo 'Not found: ' . htmlspecialchars($uri);
return true;
