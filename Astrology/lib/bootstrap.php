<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');

$TENANT = require __DIR__ . '/../config/tenant.php';

function tenant(): array
{
    global $TENANT;
    return $TENANT;
}

function json_response(array $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function read_json_body(): array
{
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        $cached = $_POST ?: [];
        return $cached;
    }
    $decoded = json_decode($raw, true);
    $cached = is_array($decoded) ? $decoded : [];
    return $cached;
}

function require_lib(string $name): void
{
    require_once __DIR__ . '/' . $name . '.php';
}

function request_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? $_SERVER['Authorization']
        ?? '';
    if ($header === '' && function_exists('getallheaders')) {
        $headers = getallheaders();
        foreach ($headers ?: [] as $key => $value) {
            if (strcasecmp($key, 'Authorization') === 0) {
                $header = $value;
                break;
            }
        }
    }
    if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
        return $m[1];
    }
    $body = read_json_body();
    if (!empty($body['token'])) {
        return (string) $body['token'];
    }
    if (!empty($_GET['token'])) {
        return (string) $_GET['token'];
    }
    return null;
}
