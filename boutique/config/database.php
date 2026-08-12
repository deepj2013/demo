<?php
/**
 * Database — credentials come from settings.json → database.*
 * Override with environment vars if present (for hosting): BOUTIQUE_DB_HOST, etc.
 */
declare(strict_types=1);

function db_config(): array {
    $s = settings();
    $db = $s['database'] ?? [];
    return [
        'host' => getenv('BOUTIQUE_DB_HOST') ?: ($db['host'] ?? '127.0.0.1'),
        'name' => getenv('BOUTIQUE_DB_NAME') ?: ($db['name'] ?? 'boutique_os'),
        'user' => getenv('BOUTIQUE_DB_USER') ?: ($db['user'] ?? 'root'),
        'pass' => getenv('BOUTIQUE_DB_PASS') !== false && getenv('BOUTIQUE_DB_PASS') !== ''
            ? (string) getenv('BOUTIQUE_DB_PASS')
            : (string) ($db['pass'] ?? ''),
        'charset' => $db['charset'] ?? 'utf8mb4',
    ];
}

function db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;

    $c = db_config();
    $dsn = 'mysql:host=' . $c['host'] . ';dbname=' . $c['name'] . ';charset=' . $c['charset'];
    $pdo = new PDO($dsn, $c['user'], $c['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
