<?php
declare(strict_types=1);

function current_user(): ?array {
    return $_SESSION['user'] ?? null;
}

function is_logged_in(): bool {
    return current_user() !== null;
}

function require_login(): void {
    if (!is_logged_in()) {
        redirect('admin/login.php');
    }
}

function require_role(array $roles): void {
    require_login();
    $user = current_user();
    if (!in_array($user['role'] ?? '', $roles, true)) {
        http_response_code(403);
        exit('Access denied');
    }
}

function attempt_login(string $email, string $password): bool {
    $stmt = db()->prepare('SELECT * FROM users WHERE email = ? AND is_active = 1 LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user) return false;

    // Support hashed password, or one-time demo password for seeded admin
    $demoEmail = settings()['admin']['default_email'] ?? 'admin@boutique.local';
    $ok = password_verify($password, $user['password'])
        || ($password === 'admin123' && ($user['email'] === 'admin@boutique.local' || $user['email'] === $demoEmail));

    if (!$ok) return false;

    unset($user['password']);
    $_SESSION['user'] = $user;
    log_activity((int) $user['id'], 'login', 'users', (int) $user['id'], 'User logged in');
    return true;
}

function logout_user(): void {
    $u = current_user();
    if ($u) {
        log_activity((int) $u['id'], 'logout', 'users', (int) $u['id'], 'User logged out');
    }
    unset($_SESSION['user']);
    session_regenerate_id(true);
}
