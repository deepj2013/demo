<?php
declare(strict_types=1);

/**
 * Extended chart math: house systems, Vargas, deep dasha, doshas, panchang timings.
 */
final class ChartExtras
{
    public static function buildHouses(array $lagna, array $planets, string $system = 'whole_sign'): array
    {
        $system = strtolower($system);
        $cusps = self::houseCusps($lagna, $system);
        $houses = [];
        for ($h = 1; $h <= 12; $h++) {
            $cusp = $cusps[$h];
            $rashiIndex = (int) floor($cusp / 30.0) % 12;
            $inHouse = [];
            foreach ($planets as $p) {
                if (self::planetHouse((float) $p['longitude'], $cusps) === $h) {
                    $inHouse[] = $p['name'];
                }
            }
            $houses[$h] = [
                'house' => $h,
                'cusp' => round($cusp, 4),
                'cusp_dms' => AstrologyEngine::toDms(fmod($cusp, 30.0)),
                'rashi' => AstrologyEngine::RASHIS[$rashiIndex]['en'],
                'rashi_hi' => AstrologyEngine::RASHIS[$rashiIndex]['hi'],
                'rashi_index' => $rashiIndex,
                'planets' => $inHouse,
                'meaning' => AstrologyEngine::HOUSE_MEANINGS[$h],
            ];
        }
        return array_values($houses);
    }

    /** @return array<int,float> house=>cusp longitude */
    public static function houseCusps(array $lagna, string $system): array
    {
        $asc = (float) $lagna['longitude'];
        $cusps = [];
        if ($system === 'equal' || $system === 'placidus' || $system === 'koch') {
            // Equal / simplified Placidus & Koch (equal from ASC) until Swiss house cusps available
            for ($h = 1; $h <= 12; $h++) {
                $cusps[$h] = AstrologyEngine::normalize($asc + ($h - 1) * 30.0);
            }
            return $cusps;
        }
        if ($system === 'sripati') {
            // Sripati: bhava madhya model approx — cusps offset by 15° from whole-sign starts
            $start = floor($asc / 30.0) * 30.0;
            for ($h = 1; $h <= 12; $h++) {
                $cusps[$h] = AstrologyEngine::normalize($start + ($h - 1) * 30.0 - 15.0);
            }
            return $cusps;
        }
        // whole_sign default
        $start = floor($asc / 30.0) * 30.0;
        for ($h = 1; $h <= 12; $h++) {
            $cusps[$h] = AstrologyEngine::normalize($start + ($h - 1) * 30.0);
        }
        return $cusps;
    }

    public static function planetHouse(float $lon, array $cusps): int
    {
        $lon = AstrologyEngine::normalize($lon);
        for ($h = 1; $h <= 12; $h++) {
            $a = $cusps[$h];
            $b = $cusps[$h === 12 ? 1 : $h + 1];
            if ($a <= $b) {
                if ($lon >= $a && $lon < $b) {
                    return $h;
                }
            } else {
                if ($lon >= $a || $lon < $b) {
                    return $h;
                }
            }
        }
        return 1;
    }

    public static function vargaD9(array $planets, array $lagna): array
    {
        $mapPlanet = static function (array $p): array {
            $lon = (float) $p['longitude'];
            $sign = (int) floor($lon / 30.0);
            $deg = fmod($lon, 30.0);
            // Navamsa: odd signs multiply from own; even from 7th — simplified equal 3°20'
            $nav = (int) floor($deg / (30.0 / 9.0));
            if ($sign % 2 === 0) {
                $navSign = ($sign + $nav) % 12;
            } else {
                $navSign = ($sign + 8 + $nav) % 12; // even: from 7th ≈ +6, use classic formula
                // Standard: movable from self, fixed from 9th, dual from 5th
            }
            // Classic navamsa sign:
            $mod = $sign % 3;
            if ($mod === 0) { // movable
                $navSign = ($sign + $nav) % 12;
            } elseif ($mod === 1) { // fixed
                $navSign = ($sign + 8 + $nav) % 12;
            } else { // dual
                $navSign = ($sign + 4 + $nav) % 12;
            }
            $navLon = $navSign * 30.0 + fmod($deg * 9.0, 30.0);
            return AstrologyEngine::decodeLongitude($navLon, $p['name']);
        };

        $d9Planets = [];
        foreach ($planets as $p) {
            $d9Planets[$p['name']] = $mapPlanet($p);
        }
        $d9Lagna = $mapPlanet(array_merge($lagna, ['name' => 'Lagna']));
        $houses = self::buildHouses($d9Lagna, $d9Planets, 'whole_sign');
        return [
            'type' => 'D9',
            'name' => 'Navamsa',
            'lagna' => $d9Lagna,
            'planets' => array_values($d9Planets),
            'houses' => $houses,
        ];
    }

    public static function deepVimshottari(array $moon, string $birthDate, int $antarLevels = 2): array
    {
        $base = AstrologyEngine::vimshottariDasha($moon, $birthDate);
        $yearsMap = [
            'Ketu' => 7, 'Venus' => 20, 'Sun' => 6, 'Moon' => 10, 'Mars' => 7,
            'Rahu' => 18, 'Jupiter' => 16, 'Saturn' => 19, 'Mercury' => 17,
        ];
        $lords = array_keys($yearsMap);
        $total = 120.0;

        $withAntar = [];
        foreach ($base['mahadashas'] as $md) {
            $mdYears = (float) $md['years'];
            $startLord = $md['lord'];
            $startIdx = array_search($startLord, $lords, true);
            if ($startIdx === false) {
                $startIdx = 0;
            }
            try {
                $cursor = new DateTimeImmutable($md['start']);
            } catch (Throwable $e) {
                $cursor = new DateTimeImmutable('now');
            }
            $antars = [];
            for ($i = 0; $i < 9; $i++) {
                $alord = $lords[($startIdx + $i) % 9];
                $ayears = $mdYears * ($yearsMap[$alord] / $total);
                $astart = $cursor->format('Y-m-d');
                $days = (int) max(1, round($ayears * 365.25));
                $cursor = $cursor->modify('+' . $days . ' days');
                $aend = $cursor->format('Y-m-d');
                $entry = [
                    'lord' => $alord,
                    'years' => round($ayears, 3),
                    'start' => $astart,
                    'end' => $aend,
                ];
                if ($antarLevels >= 2) {
                    $entry['pratyantars'] = self::subPeriods($alord, $ayears, $astart, $lords, $yearsMap, $total);
                }
                $antars[] = $entry;
            }
            $md['antardashas'] = $antars;
            $withAntar[] = $md;
        }

        $today = date('Y-m-d');
        $currentMd = $base['current'];
        $currentAd = null;
        $currentPd = null;
        foreach ($withAntar as $md) {
            if ($today >= $md['start'] && $today <= $md['end']) {
                $currentMd = ['lord' => $md['lord'], 'years' => $md['years'], 'start' => $md['start'], 'end' => $md['end']];
                foreach ($md['antardashas'] as $ad) {
                    if ($today >= $ad['start'] && $today <= $ad['end']) {
                        $currentAd = ['lord' => $ad['lord'], 'years' => $ad['years'], 'start' => $ad['start'], 'end' => $ad['end']];
                        foreach ($ad['pratyantars'] ?? [] as $pd) {
                            if ($today >= $pd['start'] && $today <= $pd['end']) {
                                $currentPd = $pd;
                                break;
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }

        return [
            'system' => 'Vimshottari',
            'levels' => ['Maha', 'Antar', 'Pratyantar'],
            'birth_nakshatra_lord' => $base['birth_nakshatra_lord'],
            'balance_years_at_birth' => $base['balance_years_at_birth'],
            'current' => [
                'mahadasha' => $currentMd,
                'antardasha' => $currentAd,
                'pratyantar' => $currentPd,
                'label' => trim(($currentMd['lord'] ?? '') . ($currentAd ? ' / ' . $currentAd['lord'] : '') . ($currentPd ? ' / ' . $currentPd['lord'] : '')),
            ],
            'mahadashas' => $withAntar,
        ];
    }

    private static function subPeriods(string $parentLord, float $parentYears, string $startDate, array $lords, array $yearsMap, float $total): array
    {
        $startIdx = array_search($parentLord, $lords, true);
        if ($startIdx === false) {
            $startIdx = 0;
        }
        try {
            $cursor = new DateTimeImmutable($startDate);
        } catch (Throwable $e) {
            $cursor = new DateTimeImmutable('now');
        }
        $out = [];
        for ($i = 0; $i < 9; $i++) {
            $lord = $lords[($startIdx + $i) % 9];
            $years = $parentYears * ($yearsMap[$lord] / $total);
            $s = $cursor->format('Y-m-d');
            $days = (int) max(1, round($years * 365.25));
            $cursor = $cursor->modify('+' . $days . ' days');
            $out[] = [
                'lord' => $lord,
                'years' => round($years, 4),
                'start' => $s,
                'end' => $cursor->format('Y-m-d'),
            ];
        }
        return $out;
    }

    public static function kalsarpaDosha(array $planets): array
    {
        $by = [];
        foreach ($planets as $p) {
            $by[$p['name']] = $p;
        }
        if (!isset($by['Rahu'], $by['Ketu'])) {
            return ['present' => false, 'type' => null, 'note' => ['en' => 'Nodes missing', 'hi' => 'राहु-केतु अनुपलब्ध']];
        }
        $rahu = (float) $by['Rahu']['longitude'];
        $ketu = (float) $by['Ketu']['longitude'];
        $others = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
        $allOneSide = true;
        $signs = [];
        foreach ($others as $n) {
            if (!isset($by[$n])) {
                continue;
            }
            $lon = (float) $by[$n]['longitude'];
            $between = self::isBetween($lon, $rahu, $ketu);
            $signs[] = $between ? 1 : 0;
        }
        // Classic: all planets on one side of Rahu-Ketu axis
        $sum = array_sum($signs);
        $present = ($sum === 0 || $sum === count($signs));
        return [
            'present' => $present,
            'type' => $present ? ($sum === 0 ? 'forward' : 'reverse') : null,
            'note' => $present
                ? ['en' => 'Kaal Sarpa indication present (all grahas on one side of Rahu–Ketu).', 'hi' => 'कालसर्प योग संकेत (सभी ग्रह राहु–केतु के एक ओर)।']
                : ['en' => 'No Kaal Sarpa yoga in this model.', 'hi' => 'इस मॉडल में कालसर्प योग नहीं।'],
        ];
    }

    private static function isBetween(float $lon, float $a, float $b): bool
    {
        $lon = AstrologyEngine::normalize($lon);
        $a = AstrologyEngine::normalize($a);
        $b = AstrologyEngine::normalize($b);
        if ($a < $b) {
            return $lon > $a && $lon < $b;
        }
        return $lon > $a || $lon < $b;
    }

    public static function pitriDosha(array $houses): array
    {
        $sunHouse = null;
        foreach ($houses as $h) {
            if (in_array('Sun', $h['planets'], true)) {
                $sunHouse = (int) $h['house'];
            }
        }
        $present = in_array($sunHouse, [9, 10], true) === false && $sunHouse !== null
            ? in_array($sunHouse, [1, 6, 8, 12], true)
            : false;
        // Simplified: Sun afflicted in dusthana
        return [
            'present' => $present,
            'sun_house' => $sunHouse,
            'note' => $present
                ? ['en' => 'Pitri dosha indication (Sun in dusthana).', 'hi' => 'पितृ दोष संकेत (सूर्य दु स्थान में)।']
                : ['en' => 'No strong Pitri dosha indication.', 'hi' => 'प्रबल पितृ दोष संकेत नहीं।'],
        ];
    }

    public static function enrichPanchang(array $base, string $date, float $lat, float $lon, float $tz = 5.5): array
    {
        $riseSet = self::approxRiseSet($date, $lat, $lon, $tz);
        $dayLenMin = self::minutesBetween($riseSet['sunrise'], $riseSet['sunset']);
        $segment = (int) round($dayLenMin / 8);

        $base['sunrise'] = $riseSet['sunrise'];
        $base['sunset'] = $riseSet['sunset'];
        $base['sunrise_approx'] = $riseSet['sunrise'];
        $base['sunset_approx'] = $riseSet['sunset'];
        $base['abhijit'] = self::abhijitMuhurat($riseSet['sunrise'], $riseSet['sunset']);
        $base['rahukaal'] = self::daySegment($date, $riseSet['sunrise'], $segment, 'rahu');
        $base['yamaganda'] = self::daySegment($date, $riseSet['sunrise'], $segment, 'yama');
        $base['gulika'] = self::daySegment($date, $riseSet['sunrise'], $segment, 'gulika');

        // Approximate element windows (± hours from noon based on percent remaining)
        $base['tithi']['start'] = self::shiftTime('12:00', -((float) $base['tithi']['percent'] / 100) * 12);
        $base['tithi']['end'] = self::shiftTime('12:00', (1 - (float) $base['tithi']['percent'] / 100) * 12);
        $base['nakshatra']['start'] = self::shiftTime('12:00', -6);
        $base['nakshatra']['end'] = self::shiftTime('12:00', 6);
        $base['yoga']['start'] = self::shiftTime('10:00', 0);
        $base['yoga']['end'] = self::shiftTime('22:00', 0);
        $base['karana']['start'] = $base['tithi']['start'];
        $base['karana']['end'] = self::shiftTime($base['tithi']['start'], 6);

        $base['calendar'] = [
            'amanta_month_hint' => $base['tithi']['paksha'] === 'Krishna' && (int) $base['tithi']['number'] >= 30 ? 'ending' : 'ongoing',
            'purnimanta_month_hint' => $base['tithi']['paksha'] === 'Shukla' && (int) $base['tithi']['number'] >= 15 ? 'ending' : 'ongoing',
        ];
        return $base;
    }

    private static function approxRiseSet(string $date, float $lat, float $lon, float $tz): array
    {
        $ts = strtotime($date . ' 12:00:00');
        $doy = (int) date('z', $ts) + 1;
        $decl = 23.44 * sin(deg2rad((360 / 365) * ($doy - 81)));
        $latR = deg2rad($lat);
        $declR = deg2rad($decl);
        $cosH = -tan($latR) * tan($declR);
        $cosH = max(-1, min(1, $cosH));
        $H = rad2deg(acos($cosH)); // hour angle
        $noon = 12.0 - ($lon - ($tz * 15.0)) / 15.0;
        $rise = $noon - $H / 15.0;
        $set = $noon + $H / 15.0;
        return [
            'sunrise' => self::fmtHour($rise),
            'sunset' => self::fmtHour($set),
        ];
    }

    private static function fmtHour(float $h): string
    {
        while ($h < 0) {
            $h += 24;
        }
        while ($h >= 24) {
            $h -= 24;
        }
        $hh = (int) floor($h);
        $mm = (int) round(($h - $hh) * 60);
        if ($mm === 60) {
            $mm = 0;
            $hh = ($hh + 1) % 24;
        }
        return sprintf('%02d:%02d', $hh, $mm);
    }

    private static function minutesBetween(string $a, string $b): int
    {
        [$ah, $am] = array_map('intval', explode(':', $a));
        [$bh, $bm] = array_map('intval', explode(':', $b));
        return max(1, ($bh * 60 + $bm) - ($ah * 60 + $am));
    }

    private static function abhijitMuhurat(string $sunrise, string $sunset): array
    {
        [$rh, $rm] = array_map('intval', explode(':', $sunrise));
        [$sh, $sm] = array_map('intval', explode(':', $sunset));
        $mid = (($rh * 60 + $rm) + ($sh * 60 + $sm)) / 2.0;
        $start = (int) round($mid - 24);
        $end = (int) round($mid + 24);
        if ($start < 0) {
            $start = 0;
        }
        return [
            'start' => sprintf('%02d:%02d', intdiv($start, 60), $start % 60),
            'end' => sprintf('%02d:%02d', intdiv($end, 60), $end % 60),
        ];
    }

    private static function daySegment(string $date, string $sunrise, int $segMin, string $type): array
    {
        $w = (int) date('w', strtotime($date . ' 12:00:00'));
        // segment index 1..8 from sunrise
        $map = [
            'rahu' => [0 => 8, 1 => 2, 2 => 7, 3 => 5, 4 => 6, 5 => 4, 6 => 3],
            'yama' => [0 => 5, 1 => 4, 2 => 3, 3 => 2, 4 => 1, 5 => 7, 6 => 6],
            'gulika' => [0 => 7, 1 => 6, 2 => 5, 3 => 4, 4 => 3, 5 => 2, 6 => 1],
        ];
        $idx = $map[$type][$w] ?? 4;
        [$rh, $rm] = array_map('intval', explode(':', $sunrise));
        $startMin = $rh * 60 + $rm + ($idx - 1) * $segMin;
        $endMin = $startMin + $segMin;
        return [
            'start' => sprintf('%02d:%02d', intdiv($startMin, 60) % 24, $startMin % 60),
            'end' => sprintf('%02d:%02d', intdiv($endMin, 60) % 24, $endMin % 60),
            'avoid' => true,
        ];
    }

    private static function shiftTime(string $hhmm, float $hours): string
    {
        [$h, $m] = array_map('intval', explode(':', $hhmm));
        $total = $h * 60 + $m + (int) round($hours * 60);
        while ($total < 0) {
            $total += 24 * 60;
        }
        $total %= 24 * 60;
        return sprintf('%02d:%02d', intdiv($total, 60), $total % 60);
    }
}
