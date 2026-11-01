<?php
declare(strict_types=1);

require_once __DIR__ . '/store.php';

function nv_admin_credentials(): array
{
    $cfg = nv_read_json('admin.json', []);
    if (!$cfg) {
        $cfg = [
            'username' => 'admin',
            // password: Natraj@2026
            'password_hash' => password_hash('Natraj@2026', PASSWORD_DEFAULT),
        ];
        nv_write_json('admin.json', [
            'username' => 'admin',
            'password_hash' => $cfg['password_hash'],
            'note' => 'Default password Natraj@2026 — change after first login',
        ]);
    }
    return $cfg;
}

function nv_admin_logged_in(): bool
{
    return !empty($_SESSION['nv_admin']);
}

function nv_require_admin(): void
{
    if (!nv_admin_logged_in()) {
        header('Location: ' . NV_URL . '/admin/login.php');
        exit;
    }
}

function nv_admin_login(string $user, string $pass): bool
{
    $cfg = nv_admin_credentials();
    if (hash_equals((string) $cfg['username'], $user) && password_verify($pass, (string) $cfg['password_hash'])) {
        $_SESSION['nv_admin'] = [
            'user' => $user,
            'login_at' => date('c'),
        ];
        return true;
    }
    return false;
}

function nv_admin_logout(): void
{
    unset($_SESSION['nv_admin']);
}
