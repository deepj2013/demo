<?php
declare(strict_types=1);

final class Database
{
    private static ?PDO $pdo = null;
    private static string $driver = 'sqlite';

    public static function driver(): string
    {
        self::pdo();
        return self::$driver;
    }

    public static function pdo(): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }

        $cfg = require dirname(__DIR__) . '/config/database.php';
        $mode = (string) ($cfg['driver'] ?? 'auto');

        if ($mode === 'mysql' || $mode === 'auto') {
            try {
                self::$pdo = self::connectMysql($cfg['mysql']);
                self::$driver = 'mysql';
                self::migrateMysql(self::$pdo);
                return self::$pdo;
            } catch (Throwable $e) {
                if ($mode === 'mysql') {
                    throw $e;
                }
                // auto → fall through to sqlite
            }
        }

        self::$pdo = self::connectSqlite($cfg['sqlite']);
        self::$driver = 'sqlite';
        self::migrateSqlite(self::$pdo);
        return self::$pdo;
    }

    private static function connectMysql(array $m): PDO
    {
        $host = $m['host'];
        $port = (int) $m['port'];
        $name = $m['name'];
        $user = $m['user'];
        $pass = (string) $m['pass'];
        $charset = $m['charset'] ?? 'utf8mb4';

        // Short timeout so auto-mode can fall back to SQLite quickly when MySQL is down
        $opts = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 2,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];

        // Create database if missing
        $server = new PDO(
            "mysql:host={$host};port={$port};charset={$charset}",
            $user,
            $pass,
            $opts
        );
        $server->exec(
            "CREATE DATABASE IF NOT EXISTS `{$name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
        );

        return new PDO(
            "mysql:host={$host};port={$port};dbname={$name};charset={$charset}",
            $user,
            $pass,
            $opts
        );
    }

    private static function connectSqlite(array $s): PDO
    {
        $path = $s['path'];
        $dir = dirname($path);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }
        $pdo = new PDO('sqlite:' . $path, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $pdo->exec('PRAGMA foreign_keys = ON');
        return $pdo;
    }

    private static function migrateMysql(PDO $pdo): void
    {
        $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(120) NOT NULL DEFAULT '',
    city VARCHAR(120) NOT NULL DEFAULT 'Indore',
    settings_json JSON NULL,
    created_at DATETIME NOT NULL,
    last_login_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sessions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_sess_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clients (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    name VARCHAR(160) NOT NULL,
    phone VARCHAR(20) NULL,
    gender VARCHAR(20) NOT NULL DEFAULT 'other',
    birth_date DATE NOT NULL,
    birth_time TIME NOT NULL,
    place VARCHAR(160) NOT NULL,
    lat DOUBLE NOT NULL,
    lon DOUBLE NOT NULL,
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata',
    tags VARCHAR(255) NOT NULL DEFAULT '',
    notes TEXT NULL,
    lagna VARCHAR(40) NULL,
    moon_rashi VARCHAR(40) NULL,
    ayanamsa VARCHAR(40) NOT NULL DEFAULT 'lahiri',
    house_system VARCHAR(40) NOT NULL DEFAULT 'whole_sign',
    result_json LONGTEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    CONSTRAINT fk_client_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_clients_user (user_id, created_at),
    INDEX idx_clients_name (user_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS kundlis (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    client_id INT UNSIGNED NULL,
    name VARCHAR(160) NOT NULL,
    gender VARCHAR(20) NOT NULL DEFAULT 'other',
    birth_date DATE NOT NULL,
    birth_time TIME NOT NULL,
    place VARCHAR(160) NOT NULL,
    lat DOUBLE NOT NULL,
    lon DOUBLE NOT NULL,
    lagna VARCHAR(40) NULL,
    moon_rashi VARCHAR(40) NULL,
    result_json LONGTEXT NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_kundli_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS matches (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    boy_name VARCHAR(160) NOT NULL,
    girl_name VARCHAR(160) NOT NULL,
    total DECIMAL(5,2) NOT NULL DEFAULT 0,
    max_score INT NOT NULL DEFAULT 36,
    percent DECIMAL(6,2) NOT NULL DEFAULT 0,
    verdict_en VARCHAR(80) NULL,
    verdict_hi VARCHAR(80) NULL,
    result_json LONGTEXT NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_match_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS workspace_notes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    client_id INT UNSIGNED NULL,
    title VARCHAR(200) NOT NULL DEFAULT '',
    body TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    CONSTRAINT fk_note_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
SQL);
        self::ensureColumnMysql($pdo, 'users', 'settings_json', 'JSON NULL');
    }

    private static function ensureColumnMysql(PDO $pdo, string $table, string $column, string $definition): void
    {
        $stmt = $pdo->prepare(
            'SELECT COUNT(*) FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?'
        );
        $stmt->execute([$table, $column]);
        if ((int) $stmt->fetchColumn() === 0) {
            $pdo->exec("ALTER TABLE `{$table}` ADD COLUMN `{$column}` {$definition}");
        }
    }

    private static function migrateSqlite(PDO $pdo): void
    {
        $pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT 'Indore',
    settings_json TEXT,
    created_at TEXT NOT NULL,
    last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    gender TEXT NOT NULL DEFAULT 'other',
    birth_date TEXT NOT NULL,
    birth_time TEXT NOT NULL,
    place TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    tags TEXT NOT NULL DEFAULT '',
    notes TEXT,
    lagna TEXT,
    moon_rashi TEXT,
    ayanamsa TEXT NOT NULL DEFAULT 'lahiri',
    house_system TEXT NOT NULL DEFAULT 'whole_sign',
    result_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS kundlis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    client_id INTEGER,
    name TEXT NOT NULL,
    gender TEXT NOT NULL DEFAULT 'other',
    birth_date TEXT NOT NULL,
    birth_time TEXT NOT NULL,
    place TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    lagna TEXT,
    moon_rashi TEXT,
    result_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    boy_name TEXT NOT NULL,
    girl_name TEXT NOT NULL,
    total REAL NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 36,
    percent REAL NOT NULL DEFAULT 0,
    verdict_en TEXT,
    verdict_hi TEXT,
    result_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workspace_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    client_id INTEGER,
    title TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_kundlis_user ON kundlis(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id);
SQL);

        // Soft-upgrade older installs
        self::ensureColumnSqlite($pdo, 'users', 'settings_json', 'TEXT');
        self::ensureColumnSqlite($pdo, 'kundlis', 'client_id', 'INTEGER');
    }

    private static function ensureColumnSqlite(PDO $pdo, string $table, string $column, string $type): void
    {
        $cols = $pdo->query("PRAGMA table_info({$table})")->fetchAll();
        foreach ($cols as $c) {
            if (($c['name'] ?? '') === $column) {
                return;
            }
        }
        $pdo->exec("ALTER TABLE {$table} ADD COLUMN {$column} {$type}");
    }
}
