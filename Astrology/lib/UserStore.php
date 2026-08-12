<?php
declare(strict_types=1);

final class UserStore
{
    public static function saveKundli(int $userId, array $input, array $result): array
    {
        $pdo = Database::pdo();
        $now = gmdate('c');
        $lagna = $result['lagna']['rashi'] ?? null;
        $moon = $result['rashi']['moon']['rashi'] ?? null;
        $stmt = $pdo->prepare(
            'INSERT INTO kundlis
            (user_id, name, gender, birth_date, birth_time, place, lat, lon, lagna, moon_rashi, result_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $userId,
            (string) ($input['name'] ?? $result['name'] ?? 'Native'),
            (string) ($input['gender'] ?? 'other'),
            (string) ($input['date'] ?? ''),
            (string) ($input['time'] ?? ''),
            (string) ($input['place'] ?? ''),
            (float) ($input['lat'] ?? 0),
            (float) ($input['lon'] ?? 0),
            $lagna,
            $moon,
            json_encode($result, JSON_UNESCAPED_UNICODE),
            $now,
        ]);
        $id = (int) $pdo->lastInsertId();
        return self::kundliRow($id, $userId);
    }

    public static function listKundlis(int $userId, int $limit = 50): array
    {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare(
            'SELECT id, name, gender, birth_date, birth_time, place, lagna, moon_rashi, created_at
             FROM kundlis WHERE user_id = ? ORDER BY datetime(created_at) DESC LIMIT ?'
        );
        $stmt->bindValue(1, $userId, PDO::PARAM_INT);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return array_map(static function (array $row): array {
            return [
                'id' => (int) $row['id'],
                'name' => $row['name'],
                'gender' => $row['gender'],
                'birth_date' => $row['birth_date'],
                'birth_time' => $row['birth_time'],
                'place' => $row['place'],
                'lagna' => $row['lagna'],
                'moon_rashi' => $row['moon_rashi'],
                'created_at' => $row['created_at'],
            ];
        }, $stmt->fetchAll());
    }

    public static function getKundli(int $userId, int $id): ?array
    {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare('SELECT * FROM kundlis WHERE id = ? AND user_id = ? LIMIT 1');
        $stmt->execute([$id, $userId]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        return [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'gender' => $row['gender'],
            'birth_date' => $row['birth_date'],
            'birth_time' => $row['birth_time'],
            'place' => $row['place'],
            'lat' => (float) $row['lat'],
            'lon' => (float) $row['lon'],
            'lagna' => $row['lagna'],
            'moon_rashi' => $row['moon_rashi'],
            'created_at' => $row['created_at'],
            'result' => json_decode((string) $row['result_json'], true),
        ];
    }

    public static function deleteKundli(int $userId, int $id): bool
    {
        $stmt = Database::pdo()->prepare('DELETE FROM kundlis WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }

    public static function saveMatch(int $userId, array $result): array
    {
        $pdo = Database::pdo();
        $now = gmdate('c');
        $verdict = $result['verdict'] ?? [];
        $stmt = $pdo->prepare(
            'INSERT INTO matches
            (user_id, boy_name, girl_name, total, max_score, percent, verdict_en, verdict_hi, result_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $userId,
            (string) ($result['boy']['name'] ?? 'Boy'),
            (string) ($result['girl']['name'] ?? 'Girl'),
            (int) ($result['total'] ?? 0),
            (int) ($result['max'] ?? 36),
            (float) ($result['percent'] ?? 0),
            (string) ($verdict['en'] ?? ''),
            (string) ($verdict['hi'] ?? ''),
            json_encode($result, JSON_UNESCAPED_UNICODE),
            $now,
        ]);
        return self::matchSummary((int) $pdo->lastInsertId(), $userId);
    }

    public static function listMatches(int $userId, int $limit = 50): array
    {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare(
            'SELECT id, boy_name, girl_name, total, max_score, percent, verdict_en, verdict_hi, created_at
             FROM matches WHERE user_id = ? ORDER BY datetime(created_at) DESC LIMIT ?'
        );
        $stmt->bindValue(1, $userId, PDO::PARAM_INT);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return array_map(static function (array $row): array {
            return [
                'id' => (int) $row['id'],
                'boy_name' => $row['boy_name'],
                'girl_name' => $row['girl_name'],
                'total' => (int) $row['total'],
                'max' => (int) $row['max_score'],
                'percent' => (float) $row['percent'],
                'verdict' => ['en' => $row['verdict_en'], 'hi' => $row['verdict_hi']],
                'created_at' => $row['created_at'],
            ];
        }, $stmt->fetchAll());
    }

    public static function getMatch(int $userId, int $id): ?array
    {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare('SELECT * FROM matches WHERE id = ? AND user_id = ? LIMIT 1');
        $stmt->execute([$id, $userId]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        return [
            'id' => (int) $row['id'],
            'boy_name' => $row['boy_name'],
            'girl_name' => $row['girl_name'],
            'total' => (int) $row['total'],
            'max' => (int) $row['max_score'],
            'percent' => (float) $row['percent'],
            'verdict' => ['en' => $row['verdict_en'], 'hi' => $row['verdict_hi']],
            'created_at' => $row['created_at'],
            'result' => json_decode((string) $row['result_json'], true),
        ];
    }

    public static function deleteMatch(int $userId, int $id): bool
    {
        $stmt = Database::pdo()->prepare('DELETE FROM matches WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }

    public static function dashboard(int $userId): array
    {
        $pdo = Database::pdo();
        $kundliCount = (int) $pdo->query(
            'SELECT COUNT(*) FROM kundlis WHERE user_id = ' . (int) $userId
        )->fetchColumn();
        $matchCount = (int) $pdo->query(
            'SELECT COUNT(*) FROM matches WHERE user_id = ' . (int) $userId
        )->fetchColumn();

        $recentKundlis = self::listKundlis($userId, 5);
        $recentMatches = self::listMatches($userId, 5);

        return [
            'stats' => [
                'kundlis' => $kundliCount,
                'matches' => $matchCount,
            ],
            'recent_kundlis' => $recentKundlis,
            'recent_matches' => $recentMatches,
        ];
    }

    private static function kundliRow(int $id, int $userId): array
    {
        $row = self::getKundli($userId, $id);
        if (!$row) {
            return ['id' => $id];
        }
        unset($row['result']);
        return $row;
    }

    private static function matchSummary(int $id, int $userId): array
    {
        $row = self::getMatch($userId, $id);
        if (!$row) {
            return ['id' => $id];
        }
        unset($row['result']);
        return $row;
    }
}
