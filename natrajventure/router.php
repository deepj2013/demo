<?php
// PHP built-in server router: php -S localhost:8080 router.php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/');
$file = __DIR__ . $uri;

if ($uri !== '/' && is_file($file)) {
    // Block data folder
    if (str_starts_with(ltrim($uri, '/'), 'data/')) {
        http_response_code(403);
        echo 'Forbidden';
        return true;
    }
    return false; // serve static
}

if (is_dir($file) && is_file(rtrim($file, '/') . '/index.php')) {
    require rtrim($file, '/') . '/index.php';
    return true;
}

if ($uri === '/' || $uri === '') {
    require __DIR__ . '/index.php';
    return true;
}

http_response_code(404);
echo 'Not Found';
return true;
