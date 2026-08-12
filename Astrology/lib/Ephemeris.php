<?php
declare(strict_types=1);

/**
 * Ephemeris layer: Swiss Ephemeris CLI (swetest) when installed,
 * otherwise improved pure-PHP planetary model.
 */
final class Ephemeris
{
    public const AYANAMSAS = [
        'lahiri' => ['label' => 'Lahiri (Chitra Paksha)', 'swe' => 1, 'offset' => 0.0],
        'raman' => ['label' => 'Raman', 'swe' => 3, 'offset' => -1.45],
        'kp' => ['label' => 'Krishnamurti (KP)', 'swe' => 5, 'offset' => 0.07],
        'fagan' => ['label' => 'Fagan-Bradley', 'swe' => 0, 'offset' => -0.98],
        'tropical' => ['label' => 'Tropical (Western)', 'swe' => -1, 'offset' => null],
    ];

    public static function ayanamsaValue(float $jd, string $mode = 'lahiri'): float
    {
        $mode = strtolower($mode);
        if ($mode === 'tropical') {
            return 0.0;
        }
        $base = self::lahiriApprox($jd);
        $meta = self::AYANAMSAS[$mode] ?? self::AYANAMSAS['lahiri'];
        return AstrologyEngine::normalize($base + (float) ($meta['offset'] ?? 0));
    }

    public static function lahiriApprox(float $jd): float
    {
        $t = ($jd - 2451545.0) / 365.25;
        return AstrologyEngine::normalize(23.85 + 0.01397 * $t);
    }

    /** @return array{source:string,planets:array<string,float>,ayanamsa:float,ayanamsa_mode:string} */
    public static function tropicalLongitudes(float $jd): array
    {
        $cli = self::trySwissEph($jd);
        if ($cli !== null) {
            return $cli;
        }
        return [
            'source' => 'php-model-v2',
            'planets' => AstrologyEngine::tropicalPlanets($jd),
            'ayanamsa' => 0.0,
            'ayanamsa_mode' => 'tropical',
        ];
    }

    /** Sidereal (or tropical if mode=tropical) planet decode arrays. */
    public static function chartPlanets(float $jd, string $ayanamsa = 'lahiri'): array
    {
        $trop = self::tropicalLongitudes($jd);
        $ayan = self::ayanamsaValue($jd, $ayanamsa);
        $out = [];
        foreach ($trop['planets'] as $name => $lon) {
            $use = $ayanamsa === 'tropical' ? (float) $lon : AstrologyEngine::normalize((float) $lon - $ayan);
            $out[$name] = AstrologyEngine::decodeLongitude($use, $name);
        }
        return [
            'source' => $trop['source'],
            'ayanamsa_mode' => $ayanamsa,
            'ayanamsa_value' => round($ayan, 4),
            'planets' => $out,
        ];
    }

    public static function status(): array
    {
        $bin = self::findSwetest();
        return [
            'swiss_ephemeris' => $bin !== null,
            'swetest_path' => $bin,
            'fallback' => 'php-model-v2',
            'ayanamsas' => array_keys(self::AYANAMSAS),
            'house_systems' => ['whole_sign', 'equal', 'sripati', 'placidus', 'koch'],
        ];
    }

    private static function findSwetest(): ?string
    {
        $candidates = [
            getenv('JM_SWETEST') ?: '',
            dirname(__DIR__) . '/bin/swetest',
            '/usr/local/bin/swetest',
            '/opt/homebrew/bin/swetest',
            'swetest',
        ];
        foreach ($candidates as $c) {
            if ($c === '') {
                continue;
            }
            if ($c === 'swetest') {
                $which = trim((string) shell_exec('command -v swetest 2>/dev/null'));
                if ($which !== '' && is_executable($which)) {
                    return $which;
                }
                continue;
            }
            if (is_executable($c)) {
                return $c;
            }
        }
        return null;
    }

    private static function trySwissEph(float $jd): ?array
    {
        $bin = self::findSwetest();
        if ($bin === null) {
            return null;
        }
        // swetest -bj <jd> -p0123456mt -fPl -head
        $cmd = escapeshellarg($bin)
            . ' -bj' . escapeshellarg(sprintf('%.6f', $jd))
            . ' -p0123456mt -fPl -head -eswe 2>/dev/null';
        $out = shell_exec($cmd);
        if (!$out) {
            return null;
        }
        $map = [
            'Sun' => null, 'Moon' => null, 'Mercury' => null, 'Venus' => null,
            'Mars' => null, 'Jupiter' => null, 'Saturn' => null,
            'mean Node' => null, 'true Node' => null,
        ];
        foreach (preg_split('/\R/', $out) as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }
            if (preg_match('/^([A-Za-z ]+?)\s+([0-9]+\.[0-9]+)/', $line, $m)) {
                $name = trim($m[1]);
                $lon = (float) $m[2];
                if (isset($map[$name]) || array_key_exists($name, $map)) {
                    $map[$name] = $lon;
                }
            }
        }
        $planets = [];
        foreach (['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'] as $p) {
            if ($map[$p] === null) {
                return null;
            }
            $planets[$p] = AstrologyEngine::normalize((float) $map[$p]);
        }
        $rahu = $map['true Node'] ?? $map['mean Node'];
        if ($rahu === null) {
            return null;
        }
        $planets['Rahu'] = AstrologyEngine::normalize((float) $rahu);
        $planets['Ketu'] = AstrologyEngine::normalize((float) $rahu + 180.0);
        return [
            'source' => 'swiss-ephemeris',
            'planets' => $planets,
            'ayanamsa' => 0.0,
            'ayanamsa_mode' => 'tropical',
        ];
    }
}
