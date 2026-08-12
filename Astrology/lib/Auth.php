<?php
declare(strict_types=1);

final class Auth
{
    /** Shared app password for all users (as specified). */
    public const APP_PASSWORD = '543210';

    /** Session lifetime in seconds (30 days). */
    public const SESSION_TTL = 60 * 60 * 24 * 30;

    public static function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?? '';
        // Keep last 10 digits for Indian mobiles; allow leading country code
        if (strlen($digits) > 10) {
            $digits = substr($digits, -10);
        }
        return $digits;
    }

    public static function isValidPhone(string $phone): bool
    {
        return (bool) preg_match('/^[6-9]\d{9}$/', $phone);
    }

    public static function login(string $phoneRaw, string $password, ?string $name = null): array
    {
        $phone = self::normalizePhone($phoneRaw);
        if (!self::isValidPhone($phone)) {
            throw new InvalidArgumentException('Enter a valid 10-digit mobile number.');
        }
        if ($password !== self::APP_PASSWORD) {
            throw new InvalidArgumentException('Incorrect password.');
        }

        $pdo = Database::pdo();
        $stmt = $pdo->prepare('SELECT * FROM users WHERE phone = ? LIMIT 1');
        $stmt->execute([$phone]);
        $user = $stmt->fetch();

        $now = gmdate('c');
        if (!$user) {
            $displayName = trim((string) ($name ?? '')) ?: ('User ' . substr($phone, -4));
            $hash = password_hash(self::APP_PASSWORD, PASSWORD_DEFAULT);
            $ins = $pdo->prepare(
                'INSERT INTO users (phone, password_hash, name, created_at, last_login_at) VALUES (?, ?, ?, ?, ?)'
            );
            $ins->execute([$phone, $hash, $displayName, $now, $now]);
            $userId = (int) $pdo->lastInsertId();
            $stmt->execute([$phone]);
            $user = $stmt->fetch();
            if (!$user) {
                $user = [
                    'id' => $userId,
                    'phone' => $phone,
                    'name' => $displayName,
                    'city' => 'Indore',
                    'created_at' => $now,
                    'last_login_at' => $now,
                ];
            }
        } else {
            $pdo->prepare('UPDATE users SET last_login_at = ? WHERE id = ?')
                ->execute([$now, (int) $user['id']]);
            if ($name !== null && trim($name) !== '' && trim((string) $user['name']) === '') {
                $pdo->prepare('UPDATE users SET name = ? WHERE id = ?')
                    ->execute([trim($name), (int) $user['id']]);
                $user['name'] = trim($name);
            }
            $user['last_login_at'] = $now;
        }

        $token = bin2hex(random_bytes(32));
        $expires = gmdate('c', time() + self::SESSION_TTL);
        $pdo->prepare(
            'INSERT INTO sessions (user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?)'
        )->execute([(int) $user['id'], $token, $expires, $now]);

        return [
            'token' => $token,
            'expires_at' => $expires,
            'user' => self::publicUser($user),
        ];
    }

    public static function logout(?string $token): void
    {
        if (!$token) {
            return;
        }
        Database::pdo()->prepare('DELETE FROM sessions WHERE token = ?')->execute([$token]);
    }

    public static function userFromToken(?string $token): ?array
    {
        if (!$token) {
            return null;
        }
        $pdo = Database::pdo();
        $stmt = $pdo->prepare(
            'SELECT u.* FROM sessions s
             INNER JOIN users u ON u.id = s.user_id
             WHERE s.token = ? AND s.expires_at > ? LIMIT 1'
        );
        $stmt->execute([$token, gmdate('c')]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function requireUser(?string $token): array
    {
        $user = self::userFromToken($token);
        if (!$user) {
            json_response(['ok' => false, 'error' => 'Please log in to continue.', 'auth_required' => true], 401);
        }
        return $user;
    }

    public static function updateProfile(int $userId, array $fields): array
    {
        $name = trim((string) ($fields['name'] ?? ''));
        $city = trim((string) ($fields['city'] ?? ''));
        if ($name === '') {
            throw new InvalidArgumentException('Name is required.');
        }
        if ($city === '') {
            $city = 'Indore';
        }

        $pdo = Database::pdo();
        $stmt = $pdo->prepare('SELECT settings_json FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $row = $stmt->fetch();
        $settings = [];
        if ($row && !empty($row['settings_json'])) {
            $decoded = json_decode((string) $row['settings_json'], true);
            if (is_array($decoded)) {
                $settings = $decoded;
            }
        }

        if (isset($fields['settings']) && is_array($fields['settings'])) {
            $settings = array_merge($settings, $fields['settings']);
        }

        // Regional Jyotish charges
        if (isset($fields['charges']) && is_array($fields['charges'])) {
            $c = $fields['charges'];
            $settings['charges'] = [
                'region' => trim((string) ($c['region'] ?? ($settings['charges']['region'] ?? $city))),
                'currency' => trim((string) ($c['currency'] ?? 'INR')) ?: 'INR',
                'kundli' => (string) ($c['kundli'] ?? '501'),
                'matching' => (string) ($c['matching'] ?? '1100'),
                'consultation' => (string) ($c['consultation'] ?? '2100'),
                'show_on_pdf' => !empty($c['show_on_pdf']),
            ];
        }
        if (isset($fields['preferred_lang'])) {
            $settings['preferred_lang'] = (string) $fields['preferred_lang'];
        }

        $pdo->prepare('UPDATE users SET name = ?, city = ?, settings_json = ? WHERE id = ?')
            ->execute([$name, $city, json_encode($settings, JSON_UNESCAPED_UNICODE), $userId]);
        $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        return self::publicUser($user ?: ['id' => $userId, 'phone' => '', 'name' => $name, 'city' => $city]);
    }

    public static function publicUser(array $user): array
    {
        $settings = [];
        if (!empty($user['settings_json'])) {
            $decoded = json_decode((string) $user['settings_json'], true);
            if (is_array($decoded)) {
                $settings = $decoded;
            }
        }
        $charges = $settings['charges'] ?? [
            'region' => (string) ($user['city'] ?? 'Indore'),
            'currency' => 'INR',
            'kundli' => '501',
            'matching' => '1100',
            'consultation' => '2100',
            'show_on_pdf' => true,
        ];
        return [
            'id' => (int) $user['id'],
            'phone' => (string) $user['phone'],
            'name' => (string) ($user['name'] ?? ''),
            'city' => (string) ($user['city'] ?? 'Indore'),
            'created_at' => (string) ($user['created_at'] ?? ''),
            'last_login_at' => (string) ($user['last_login_at'] ?? ''),
            'settings' => $settings,
            'charges' => $charges,
            'preferred_lang' => (string) ($settings['preferred_lang'] ?? 'en'),
        ];
    }

}
