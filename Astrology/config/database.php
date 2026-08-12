<?php
/**
 * Database config — MySQL preferred (phpMyAdmin), SQLite fallback.
 * Schema is created automatically on first request. No manual SQL needed.
 *
 * To use MySQL: start MySQL/MariaDB, then set host/user/pass/name below
 * (or env vars JM_DB_HOST, JM_DB_USER, JM_DB_PASS, JM_DB_NAME).
 */
return [
    'driver' => getenv('JM_DB_DRIVER') ?: 'auto', // auto | mysql | sqlite
    'mysql' => [
        'host' => getenv('JM_DB_HOST') ?: '127.0.0.1',
        'port' => (int) (getenv('JM_DB_PORT') ?: 3306),
        'name' => getenv('JM_DB_NAME') ?: 'jyotimandir',
        'user' => getenv('JM_DB_USER') ?: 'root',
        'pass' => getenv('JM_DB_PASS') !== false ? getenv('JM_DB_PASS') : '',
        'charset' => 'utf8mb4',
    ],
    'sqlite' => [
        'path' => dirname(__DIR__) . '/data/jyotimandir.sqlite',
    ],
];
