<?php
/**
 * Self-contained Vedic astrology calculation engine (demo-grade, offline).
 * Uses approximate planetary longitudes + Lahiri ayanamsa for sidereal chart.
 * Suitable for product demos — not a substitute for professional ephemeris software.
 */
class AstrologyEngine
{
    public const RASHIS = [
        ['en' => 'Aries', 'hi' => 'मेष', 'lord' => 'Mars', 'element' => 'Fire'],
        ['en' => 'Taurus', 'hi' => 'वृषभ', 'lord' => 'Venus', 'element' => 'Earth'],
        ['en' => 'Gemini', 'hi' => 'मिथुन', 'lord' => 'Mercury', 'element' => 'Air'],
        ['en' => 'Cancer', 'hi' => 'कर्क', 'lord' => 'Moon', 'element' => 'Water'],
        ['en' => 'Leo', 'hi' => 'सिंह', 'lord' => 'Sun', 'element' => 'Fire'],
        ['en' => 'Virgo', 'hi' => 'कन्या', 'lord' => 'Mercury', 'element' => 'Earth'],
        ['en' => 'Libra', 'hi' => 'तुला', 'lord' => 'Venus', 'element' => 'Air'],
        ['en' => 'Scorpio', 'hi' => 'वृश्चिक', 'lord' => 'Mars', 'element' => 'Water'],
        ['en' => 'Sagittarius', 'hi' => 'धनु', 'lord' => 'Jupiter', 'element' => 'Fire'],
        ['en' => 'Capricorn', 'hi' => 'मकर', 'lord' => 'Saturn', 'element' => 'Earth'],
        ['en' => 'Aquarius', 'hi' => 'कुम्भ', 'lord' => 'Saturn', 'element' => 'Air'],
        ['en' => 'Pisces', 'hi' => 'मीन', 'lord' => 'Jupiter', 'element' => 'Water'],
    ];

    public const NAKSHATRAS = [
        ['en' => 'Ashwini', 'hi' => 'अश्विनी', 'lord' => 'Ketu'],
        ['en' => 'Bharani', 'hi' => 'भरणी', 'lord' => 'Venus'],
        ['en' => 'Krittika', 'hi' => 'कृत्तिका', 'lord' => 'Sun'],
        ['en' => 'Rohini', 'hi' => 'रोहिणी', 'lord' => 'Moon'],
        ['en' => 'Mrigashira', 'hi' => 'मृगशिरा', 'lord' => 'Mars'],
        ['en' => 'Ardra', 'hi' => 'आर्द्रा', 'lord' => 'Rahu'],
        ['en' => 'Punarvasu', 'hi' => 'पुनर्वसु', 'lord' => 'Jupiter'],
        ['en' => 'Pushya', 'hi' => 'पुष्य', 'lord' => 'Saturn'],
        ['en' => 'Ashlesha', 'hi' => 'अश्लेषा', 'lord' => 'Mercury'],
        ['en' => 'Magha', 'hi' => 'मघा', 'lord' => 'Ketu'],
        ['en' => 'Purva Phalguni', 'hi' => 'पूर्व फाल्गुनी', 'lord' => 'Venus'],
        ['en' => 'Uttara Phalguni', 'hi' => 'उत्तर फाल्गुनी', 'lord' => 'Sun'],
        ['en' => 'Hasta', 'hi' => 'हस्त', 'lord' => 'Moon'],
        ['en' => 'Chitra', 'hi' => 'चित्रा', 'lord' => 'Mars'],
        ['en' => 'Swati', 'hi' => 'स्वाति', 'lord' => 'Rahu'],
        ['en' => 'Vishakha', 'hi' => 'विशाखा', 'lord' => 'Jupiter'],
        ['en' => 'Anuradha', 'hi' => 'अनुराधा', 'lord' => 'Saturn'],
        ['en' => 'Jyeshtha', 'hi' => 'ज्येष्ठा', 'lord' => 'Mercury'],
        ['en' => 'Mula', 'hi' => 'मूल', 'lord' => 'Ketu'],
        ['en' => 'Purva Ashadha', 'hi' => 'पूर्वाषाढ़ा', 'lord' => 'Venus'],
        ['en' => 'Uttara Ashadha', 'hi' => 'उत्तराषाढ़ा', 'lord' => 'Sun'],
        ['en' => 'Shravana', 'hi' => 'श्रवण', 'lord' => 'Moon'],
        ['en' => 'Dhanishta', 'hi' => 'धनिष्ठा', 'lord' => 'Mars'],
        ['en' => 'Shatabhisha', 'hi' => 'शतभिषा', 'lord' => 'Rahu'],
        ['en' => 'Purva Bhadrapada', 'hi' => 'पूर्व भाद्रपद', 'lord' => 'Jupiter'],
        ['en' => 'Uttara Bhadrapada', 'hi' => 'उत्तर भाद्रपद', 'lord' => 'Saturn'],
        ['en' => 'Revati', 'hi' => 'रेवती', 'lord' => 'Mercury'],
    ];

    public const TITHIS = [
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya',
    ];

    public const TITHIS_HI = [
        'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
        'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
        'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या',
    ];

    public const YOGAS = [
        'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
        'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva',
        'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
        'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla',
        'Brahma', 'Indra', 'Vaidhriti',
    ];

    public const KARANAS = [
        'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
        'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna',
    ];

    public const WEEKDAYS = [
        ['en' => 'Sunday', 'hi' => 'रविवार', 'lord' => 'Sun'],
        ['en' => 'Monday', 'hi' => 'सोमवार', 'lord' => 'Moon'],
        ['en' => 'Tuesday', 'hi' => 'मंगलवार', 'lord' => 'Mars'],
        ['en' => 'Wednesday', 'hi' => 'बुधवार', 'lord' => 'Mercury'],
        ['en' => 'Thursday', 'hi' => 'गुरुवार', 'lord' => 'Jupiter'],
        ['en' => 'Friday', 'hi' => 'शुक्रवार', 'lord' => 'Venus'],
        ['en' => 'Saturday', 'hi' => 'शनिवार', 'lord' => 'Saturn'],
    ];

    public const HOUSE_MEANINGS = [
        1 => ['en' => 'Self, body, personality', 'hi' => 'स्वयं, शरीर, व्यक्तित्व'],
        2 => ['en' => 'Wealth, speech, family', 'hi' => 'धन, वाणी, परिवार'],
        3 => ['en' => 'Courage, siblings, effort', 'hi' => 'साहस, सहोदर, प्रयास'],
        4 => ['en' => 'Home, mother, comfort', 'hi' => 'घर, माता, सुख'],
        5 => ['en' => 'Children, intellect, romance', 'hi' => 'संतति, बुद्धि, प्रेम'],
        6 => ['en' => 'Health, enemies, service', 'hi' => 'स्वास्थ्य, शत्रु, सेवा'],
        7 => ['en' => 'Marriage, partnerships', 'hi' => 'विवाह, साझेदारी'],
        8 => ['en' => 'Longevity, sudden events', 'hi' => 'आयु, अचानक घटनाएँ'],
        9 => ['en' => 'Fortune, dharma, father', 'hi' => 'भाग्य, धर्म, पिता'],
        10 => ['en' => 'Career, status, karma', 'hi' => 'कर्म, प्रतिष्ठा, व्यवसाय'],
        11 => ['en' => 'Gains, friends, aspirations', 'hi' => 'लाभ, मित्र, इच्छाएँ'],
        12 => ['en' => 'Expenses, moksha, foreign', 'hi' => 'व्यय, मोक्ष, विदेश'],
    ];

    /** Ashtakoot max points */
    public const GUNA_MAX = [
        'varna' => 1, 'vashya' => 2, 'tara' => 3, 'yoni' => 4,
        'graha_maitri' => 5, 'gana' => 6, 'bhakoot' => 7, 'nadi' => 8,
    ];

    public static function julianDay(int $y, int $m, int $d, float $hourUtc = 0.0): float
    {
        if ($m <= 2) {
            $y -= 1;
            $m += 12;
        }
        $a = (int) floor($y / 100);
        $b = 2 - $a + (int) floor($a / 4);
        return (int) floor(365.25 * ($y + 4716))
            + (int) floor(30.6001 * ($m + 1))
            + $d + $b - 1524.5
            + ($hourUtc / 24.0);
    }

    public static function normalize(float $deg): float
    {
        $deg = fmod($deg, 360.0);
        return $deg < 0 ? $deg + 360.0 : $deg;
    }

    public static function lahiriAyanamsa(float $jd): float
    {
        // Approx Lahiri: ~23.85° at J2000, ~0.01397°/year
        $t = ($jd - 2451545.0) / 365.25;
        return self::normalize(23.85 + 0.01397 * $t);
    }

    public static function tropicalSun(float $jd): float
    {
        $t = ($jd - 2451545.0) / 36525.0;
        $L0 = self::normalize(280.46646 + 36000.76983 * $t);
        $M = deg2rad(self::normalize(357.52911 + 35999.05029 * $t));
        $C = (1.914602 - 0.004817 * $t) * sin($M)
            + 0.019993 * sin(2 * $M)
            + 0.000289 * sin(3 * $M);
        return self::normalize($L0 + $C);
    }

    public static function tropicalMoon(float $jd): float
    {
        $t = ($jd - 2451545.0) / 36525.0;
        $Lp = self::normalize(218.3164477 + 481267.88123421 * $t);
        $D = deg2rad(self::normalize(297.8501921 + 445267.1114034 * $t));
        $M = deg2rad(self::normalize(357.5291092 + 35999.0502909 * $t));
        $Mp = deg2rad(self::normalize(134.9633964 + 477198.8675055 * $t));
        $F = deg2rad(self::normalize(93.2720950 + 483202.0175233 * $t));
        $lon = $Lp
            + 6.289 * sin($Mp)
            + 1.274 * sin(2 * $D - $Mp)
            + 0.658 * sin(2 * $D)
            + 0.214 * sin(2 * $Mp)
            - 0.186 * sin($M)
            - 0.114 * sin(2 * $F);
        return self::normalize($lon);
    }

    /** Approximate tropical longitudes for classic planets (mean elements). */
    public static function tropicalPlanets(float $jd): array
    {
        $t = ($jd - 2451545.0) / 36525.0;
        $sun = self::tropicalSun($jd);
        $moon = self::tropicalMoon($jd);

        // Simplified mean longitudes + small equations of center
        $planets = [
            'Sun' => $sun,
            'Moon' => $moon,
            'Mercury' => self::normalize(252.2509 + 149472.6746 * $t + 0.3 * sin(deg2rad($sun - 48))),
            'Venus' => self::normalize(181.9798 + 58517.8156 * $t + 0.7 * sin(deg2rad($sun - 76))),
            'Mars' => self::normalize(355.433 + 19140.3023 * $t + 1.8 * sin(deg2rad(19.373 + 19139.48 * $t))),
            'Jupiter' => self::normalize(34.3515 + 3034.9057 * $t + 1.1 * sin(deg2rad(14.0 + 3034.0 * $t))),
            'Saturn' => self::normalize(50.0774 + 1222.1138 * $t + 0.9 * sin(deg2rad(89.0 + 1221.0 * $t))),
        ];

        // Rahu (mean lunar node) / Ketu
        $rahu = self::normalize(125.04452 - 1934.136261 * $t);
        $planets['Rahu'] = $rahu;
        $planets['Ketu'] = self::normalize($rahu + 180.0);

        return $planets;
    }

    public static function siderealPlanets(float $jd): array
    {
        $ayan = self::lahiriAyanamsa($jd);
        $out = [];
        foreach (self::tropicalPlanets($jd) as $name => $lon) {
            $sid = self::normalize($lon - $ayan);
            $out[$name] = self::decodeLongitude($sid, $name);
        }
        return $out;
    }

    public static function decodeLongitude(float $lon, string $name = ''): array
    {
        $lon = self::normalize($lon);
        $rashiIndex = (int) floor($lon / 30.0);
        $degInSign = $lon - ($rashiIndex * 30.0);
        $nakIndex = (int) floor($lon / (360.0 / 27.0));
        if ($nakIndex > 26) {
            $nakIndex = 26;
        }
        $pada = (int) floor(fmod($lon, 360.0 / 27.0) / (360.0 / 108.0)) + 1;
        $rashi = self::RASHIS[$rashiIndex];
        $nak = self::NAKSHATRAS[$nakIndex];
        return [
            'name' => $name,
            'longitude' => round($lon, 4),
            'dms' => self::toDms($degInSign),
            'rashi_index' => $rashiIndex,
            'rashi' => $rashi['en'],
            'rashi_hi' => $rashi['hi'],
            'nakshatra_index' => $nakIndex,
            'nakshatra' => $nak['en'],
            'nakshatra_hi' => $nak['hi'],
            'nakshatra_lord' => $nak['lord'],
            'pada' => $pada,
        ];
    }

    public static function toDms(float $deg): string
    {
        $d = (int) floor($deg);
        $mFloat = ($deg - $d) * 60.0;
        $m = (int) floor($mFloat);
        $s = (int) round(($mFloat - $m) * 60.0);
        if ($s === 60) {
            $s = 0;
            $m++;
        }
        return sprintf('%02d° %02d′ %02d″', $d, $m, $s);
    }

    public static function localSiderealTime(float $jd, float $longitudeEast): float
    {
        $t = ($jd - 2451545.0) / 36525.0;
        $gmst = self::normalize(280.46061837 + 360.98564736629 * ($jd - 2451545.0) + 0.000387933 * $t * $t);
        return self::normalize($gmst + $longitudeEast);
    }

    public static function lagna(float $jd, float $lat, float $lonEast): array
    {
        $lst = self::localSiderealTime($jd, $lonEast);
        $ayan = self::lahiriAyanamsa($jd);
        // RAMC-based approximate ascendant for mid-latitudes
        $obl = 23.4393;
        $ramc = deg2rad($lst);
        $eps = deg2rad($obl);
        $phi = deg2rad($lat);
        $y = -cos($ramc);
        $x = sin($ramc) * cos($eps) + tan($phi) * sin($eps);
        $ascTrop = self::normalize(rad2deg(atan2($y, $x)));
        // atan2 gives ecliptic longitude of asc roughly; refine with simple house cusp model
        $ascTrop = self::normalize($lst + 90.0 + 8.0 * sin(deg2rad($lat)));
        $ascSid = self::normalize($ascTrop - $ayan);
        return self::decodeLongitude($ascSid, 'Lagna');
    }

    public static function parseDateTime(string $date, string $time, float $tzOffset = 5.5): array
    {
        [$y, $m, $d] = array_map('intval', explode('-', $date));
        $parts = explode(':', $time);
        $hh = (int) ($parts[0] ?? 12);
        $mm = (int) ($parts[1] ?? 0);
        $localHours = $hh + $mm / 60.0;
        $utcHours = $localHours - $tzOffset;
        $jd = self::julianDay($y, $m, $d, $utcHours);
        return compact('y', 'm', 'd', 'hh', 'mm', 'jd', 'localHours', 'utcHours');
    }

    public static function buildKundli(array $input): array
    {
        $name = trim((string) ($input['name'] ?? 'Native'));
        $date = (string) ($input['date'] ?? date('Y-m-d'));
        $time = (string) ($input['time'] ?? '12:00');
        $lat = (float) ($input['lat'] ?? 22.7196);
        $lon = (float) ($input['lon'] ?? 75.8577);
        $place = (string) ($input['place'] ?? 'Indore');
        $gender = (string) ($input['gender'] ?? 'other');
        $tz = (float) ($input['tz'] ?? 5.5);
        $ayanamsa = strtolower((string) ($input['ayanamsa'] ?? 'lahiri'));
        $houseSystem = strtolower((string) ($input['house_system'] ?? 'whole_sign'));
        $chartStyle = strtolower((string) ($input['chart_style'] ?? 'south'));

        $dt = self::parseDateTime($date, $time, $tz);
        require_once __DIR__ . '/Ephemeris.php';
        require_once __DIR__ . '/ChartExtras.php';

        $eph = Ephemeris::chartPlanets($dt['jd'], $ayanamsa);
        $planets = $eph['planets'];
        $lagnaTrop = self::lagna($dt['jd'], $lat, $lon);
        // Re-apply selected ayanamsa to lagna
        $ayan = (float) $eph['ayanamsa_value'];
        if ($ayanamsa === 'tropical') {
            $lagnaLon = (float) $lagnaTrop['longitude'] + self::lahiriAyanamsa($dt['jd']); // lagna() already sidereal Lahiri
            // lagna() returns sidereal Lahiri; convert back to tropical then to requested
            $lagnaLon = self::normalize((float) $lagnaTrop['longitude'] + self::lahiriAyanamsa($dt['jd']));
            $lagna = self::decodeLongitude($lagnaLon, 'Lagna');
        } else {
            $tropAsc = self::normalize((float) $lagnaTrop['longitude'] + self::lahiriAyanamsa($dt['jd']));
            $lagna = self::decodeLongitude(self::normalize($tropAsc - $ayan), 'Lagna');
        }

        $moon = $planets['Moon'];
        $sun = $planets['Sun'];
        $houses = ChartExtras::buildHouses($lagna, $planets, $houseSystem);
        $panchang = ChartExtras::enrichPanchang(self::panchangFromJd($dt['jd'], $date), $date, $lat, $lon, $tz);

        $chart = [
            'meta' => [
                'name' => $name,
                'gender' => $gender,
                'date' => $date,
                'time' => $time,
                'place' => $place,
                'lat' => $lat,
                'lon' => $lon,
                'tz' => $tz,
                'ayanamsa' => $ayanamsa,
                'ayanamsa_label' => Ephemeris::AYANAMSAS[$ayanamsa]['label'] ?? 'Lahiri',
                'ayanamsa_value' => $eph['ayanamsa_value'],
                'house_system' => $houseSystem,
                'chart_style' => $chartStyle,
                'engine' => $eph['source'],
            ],
            'lagna' => $lagna,
            'rashi' => [
                'moon' => $moon,
                'sun' => $sun,
            ],
            'planets' => array_values($planets),
            'houses' => $houses,
            'vargas' => [
                'D1' => ['type' => 'D1', 'name' => 'Rasi', 'lagna' => $lagna, 'planets' => array_values($planets), 'houses' => $houses],
                'D9' => ChartExtras::vargaD9(array_values($planets), $lagna),
            ],
            'panchang_at_birth' => $panchang,
            'summary' => self::kundliSummary($name, $lagna, $moon, $sun),
        ];

        $chart['manglik'] = self::manglikHint($chart);
        $chart['kalsarpa'] = ChartExtras::kalsarpaDosha(array_values($planets));
        $chart['pitri'] = ChartExtras::pitriDosha($houses);
        $chart['dasha'] = ChartExtras::deepVimshottari($moon, $date, 2);
        $chart['yogas'] = self::basicYogas($planets, $lagna, $houses);

        return $chart;
    }

    public static function vimshottariDasha(array $moon, string $birthDate): array
    {
        $yearsMap = [
            'Ketu' => 7, 'Venus' => 20, 'Sun' => 6, 'Moon' => 10, 'Mars' => 7,
            'Rahu' => 18, 'Jupiter' => 16, 'Saturn' => 19, 'Mercury' => 17,
        ];
        $lords = array_keys($yearsMap);
        $startLord = (string) ($moon['nakshatra_lord'] ?? 'Ketu');
        $startIdx = array_search($startLord, $lords, true);
        if ($startIdx === false) {
            $startIdx = 0;
            $startLord = $lords[0];
        }

        $nakSize = 360.0 / 27.0;
        $lon = (float) ($moon['longitude'] ?? 0);
        $lonInNak = fmod($lon, $nakSize);
        if ($lonInNak < 0) {
            $lonInNak += $nakSize;
        }
        $fractionLeft = max(0.01, 1.0 - ($lonInNak / $nakSize));

        try {
            $cursor = new DateTimeImmutable($birthDate);
        } catch (Throwable $e) {
            $cursor = new DateTimeImmutable('now');
        }

        $periods = [];
        for ($i = 0; $i < 9; $i++) {
            $lord = $lords[($startIdx + $i) % 9];
            $years = (float) $yearsMap[$lord];
            if ($i === 0) {
                $years *= $fractionLeft;
            }
            $start = $cursor->format('Y-m-d');
            $days = (int) max(1, round($years * 365.25));
            $cursor = $cursor->modify('+' . $days . ' days');
            $end = $cursor->format('Y-m-d');
            $periods[] = [
                'lord' => $lord,
                'years' => round($years, 2),
                'start' => $start,
                'end' => $end,
            ];
        }

        $today = date('Y-m-d');
        $current = $periods[0];
        foreach ($periods as $p) {
            if ($today >= $p['start'] && $today <= $p['end']) {
                $current = $p;
                break;
            }
            if ($today > $p['end']) {
                $current = $p;
            }
        }

        return [
            'system' => 'Vimshottari',
            'birth_nakshatra_lord' => $startLord,
            'balance_years_at_birth' => round($yearsMap[$startLord] * $fractionLeft, 2),
            'current' => $current,
            'mahadashas' => $periods,
        ];
    }

    public static function basicYogas(array $planets, array $lagna, array $houses): array
    {
        $list = [];
        $byName = [];
        foreach ($planets as $p) {
            $byName[$p['name']] = $p;
        }

        // Budhaditya: Mercury + Sun same rashi
        if (isset($byName['Sun'], $byName['Mercury'])
            && $byName['Sun']['rashi_index'] === $byName['Mercury']['rashi_index']) {
            $list[] = [
                'name' => 'Budhaditya Yoga',
                'name_hi' => 'बुधादित्य योग',
                'note' => ['en' => 'Sun and Mercury together — intellect & expression.', 'hi' => 'सूर्य-बुध युति — बुद्धि व वाणी।'],
            ];
        }

        // Gaja Kesari: Jupiter in kendra from Moon
        if (isset($byName['Moon'], $byName['Jupiter'])) {
            $fromMoon = (($byName['Jupiter']['rashi_index'] - $byName['Moon']['rashi_index'] + 12) % 12) + 1;
            if (in_array($fromMoon, [1, 4, 7, 10], true)) {
                $list[] = [
                    'name' => 'Gaja Kesari Yoga',
                    'name_hi' => 'गजकेसरी योग',
                    'note' => ['en' => 'Jupiter in kendra from Moon — wisdom & status.', 'hi' => 'चंद्र से केंद्र में गुरु — ज्ञान व प्रतिष्ठा।'],
                ];
            }
        }

        // Rajya hint: many planets in kendras (1,4,7,10)
        $kendraCount = 0;
        foreach ($houses as $h) {
            if (in_array((int) $h['house'], [1, 4, 7, 10], true)) {
                $kendraCount += count($h['planets']);
            }
        }
        if ($kendraCount >= 4) {
            $list[] = [
                'name' => 'Kendra Strength',
                'name_hi' => 'केंद्र बल',
                'note' => ['en' => 'Several grahas occupy kendra houses — strong chart foundation.', 'hi' => 'कई ग्रह केंद्र भावों में — कुंडली का मजबूत आधार।'],
            ];
        }

        if (!$list) {
            $list[] = [
                'name' => 'Standard chart',
                'name_hi' => 'सामान्य कुंडली',
                'note' => ['en' => 'No major classic yoga flagged in this simplified scan.', 'hi' => 'इस सरलीकृत जाँच में प्रमुख योग नहीं मिला।'],
            ];
        }

        return $list;
    }

    public static function kundliSummary(string $name, array $lagna, array $moon, array $sun): array
    {
        return [
            'en' => sprintf(
                '%s — Lagna in %s, Moon in %s (%s pada %d), Sun in %s. Nakshatra lord: %s.',
                $name,
                $lagna['rashi'],
                $moon['rashi'],
                $moon['nakshatra'],
                $moon['pada'],
                $sun['rashi'],
                $moon['nakshatra_lord']
            ),
            'hi' => sprintf(
                '%s — लग्न %s, चंद्र %s (%s पद %d), सूर्य %s। नक्षत्र स्वामी: %s।',
                $name,
                $lagna['rashi_hi'],
                $moon['rashi_hi'],
                $moon['nakshatra_hi'],
                $moon['pada'],
                $sun['rashi_hi'],
                $moon['nakshatra_lord']
            ),
        ];
    }

    public static function panchangFromJd(float $jd, ?string $date = null): array
    {
        $ayan = self::lahiriAyanamsa($jd);
        $sun = self::normalize(self::tropicalSun($jd) - $ayan);
        $moon = self::normalize(self::tropicalMoon($jd) - $ayan);
        $diff = self::normalize($moon - $sun);
        $tithiNum = (int) floor($diff / 12.0); // 0..29
        $paksha = $tithiNum < 15 ? 'Shukla' : 'Krishna';
        $pakshaHi = $tithiNum < 15 ? 'शुक्ल' : 'कृष्ण';
        $tithiIndex = $tithiNum % 15;
        $tithiName = self::TITHIS[$tithiIndex];
        if ($tithiIndex === 14) {
            $tithiName = $paksha === 'Shukla' ? 'Purnima' : 'Amavasya';
        }
        $tithiHi = self::TITHIS_HI[$tithiIndex];
        if ($tithiIndex === 14) {
            $tithiHi = $paksha === 'Shukla' ? 'पूर्णिमा' : 'अमावस्या';
        }

        $nak = self::decodeLongitude($moon);
        $yogaLon = self::normalize($moon + $sun);
        $yogaIndex = (int) floor($yogaLon / (360.0 / 27.0)) % 27;
        $karanaIndex = (int) floor($diff / 6.0) % 11;
        if ($karanaIndex > 10) {
            $karanaIndex = 10;
        }

        $weekdayIndex = ((int) floor($jd + 1.5)) % 7;
        $vara = self::WEEKDAYS[$weekdayIndex];

        return [
            'date' => $date,
            'vara' => $vara,
            'tithi' => [
                'number' => $tithiNum + 1,
                'name' => $tithiName,
                'name_hi' => $tithiHi,
                'paksha' => $paksha,
                'paksha_hi' => $pakshaHi,
                'percent' => round(fmod($diff, 12.0) / 12.0 * 100, 1),
            ],
            'nakshatra' => [
                'name' => $nak['nakshatra'],
                'name_hi' => $nak['nakshatra_hi'],
                'lord' => $nak['nakshatra_lord'],
                'pada' => $nak['pada'],
            ],
            'yoga' => [
                'name' => self::YOGAS[$yogaIndex],
                'index' => $yogaIndex + 1,
            ],
            'karana' => [
                'name' => self::KARANAS[$karanaIndex],
                'index' => $karanaIndex + 1,
            ],
            'sun_rashi' => self::decodeLongitude($sun),
            'moon_rashi' => $nak,
        ];
    }

    public static function getPanchang(string $date, float $lat = 22.72, float $lon = 75.86, float $tz = 5.5, string $ayanamsa = 'lahiri'): array
    {
        require_once __DIR__ . '/ChartExtras.php';
        $dt = self::parseDateTime($date, '12:00', $tz);
        $base = self::panchangFromJd($dt['jd'], $date);
        $base = ChartExtras::enrichPanchang($base, $date, $lat, $lon, $tz);
        $base['place'] = ['lat' => $lat, 'lon' => $lon];
        $base['ayanamsa'] = $ayanamsa;
        $base['notes'] = [
            'en' => 'Panchang by JyotiMandir engine with rise/set & kaalam timings.',
            'hi' => 'उदय/अस्त व कालम सहित ज्योति मंदिर पंचांग।',
        ];
        return $base;
    }

    public static function rahuKaal(string $date): array
    {
        $ts = strtotime($date . ' 12:00:00');
        $w = (int) date('w', $ts); // 0 Sun
        $slots = [
            0 => ['15:00', '16:30'],
            1 => ['07:30', '09:00'],
            2 => ['15:00', '16:30'],
            3 => ['12:00', '13:30'],
            4 => ['13:30', '15:00'],
            5 => ['10:30', '12:00'],
            6 => ['09:00', '10:30'],
        ];
        return [
            'start' => $slots[$w][0],
            'end' => $slots[$w][1],
            'avoid' => true,
        ];
    }

    public static function rashiProfile(int $index): array
    {
        $index = max(0, min(11, $index));
        $r = self::RASHIS[$index];
        $traits = [
            ['bold', 'pioneering', 'energetic'],
            ['steady', 'sensual', 'loyal'],
            ['curious', 'witty', 'adaptable'],
            ['caring', 'intuitive', 'protective'],
            ['confident', 'creative', 'leadership'],
            ['analytical', 'precise', 'service-minded'],
            ['balanced', 'charming', 'diplomatic'],
            ['intense', 'transformative', 'focused'],
            ['optimistic', 'philosophical', 'adventurous'],
            ['disciplined', 'ambitious', 'practical'],
            ['innovative', 'humanitarian', 'independent'],
            ['compassionate', 'imaginative', 'spiritual'],
        ];
        $career = [
            'Leadership, sports, engineering',
            'Finance, arts, real estate',
            'Media, teaching, trade',
            'Hospitality, nursing, real estate',
            'Government, entertainment, management',
            'Healthcare, analytics, service',
            'Law, design, counseling',
            'Research, surgery, occult sciences',
            'Teaching, travel, advisory',
            'Admin, mining, corporate',
            'Technology, social work, aviation',
            'Healing, spirituality, charity',
        ];
        return [
            'index' => $index,
            'rashi' => $r['en'],
            'rashi_hi' => $r['hi'],
            'lord' => $r['lord'],
            'element' => $r['element'],
            'traits' => $traits[$index],
            'career' => $career[$index],
            'lucky_color' => ['Red', 'White', 'Green', 'Silver', 'Gold', 'Grey', 'Pink', 'Maroon', 'Yellow', 'Black', 'Blue', 'Sea green'][$index],
            'lucky_number' => [9, 6, 5, 2, 1, 5, 6, 9, 3, 8, 4, 3][$index],
            'compatibility' => self::rashiCompat($index),
        ];
    }

    public static function rashiCompat(int $i): array
    {
        $best = [($i + 4) % 12, ($i + 8) % 12, ($i + 3) % 12];
        return array_map(static function ($x) {
            return [
                'rashi' => AstrologyEngine::RASHIS[$x]['en'],
                'rashi_hi' => AstrologyEngine::RASHIS[$x]['hi'],
            ];
        }, $best);
    }

    public static function moonRashiFromDob(string $date, string $time = '12:00', float $tz = 5.5): array
    {
        $dt = self::parseDateTime($date, $time, $tz);
        $planets = self::siderealPlanets($dt['jd']);
        $moon = $planets['Moon'];
        $profile = self::rashiProfile($moon['rashi_index']);
        return [
            'moon' => $moon,
            'sun' => $planets['Sun'],
            'profile' => $profile,
        ];
    }

    /** Ashtakoot / Guna Milan (simplified classic tables). */
    public static function matchKundli(array $boy, array $girl): array
    {
        $b = self::buildKundli($boy);
        $g = self::buildKundli($girl);
        $bMoon = $b['rashi']['moon'];
        $gMoon = $g['rashi']['moon'];
        $bi = $bMoon['rashi_index'];
        $gi = $gMoon['rashi_index'];
        $bn = $bMoon['nakshatra_index'];
        $gn = $gMoon['nakshatra_index'];

        $scores = [];
        $scores['varna'] = self::scoreVarna($bi, $gi);
        $scores['vashya'] = self::scoreVashya($bi, $gi);
        $scores['tara'] = self::scoreTara($bn, $gn);
        $scores['yoni'] = self::scoreYoni($bn, $gn);
        $scores['graha_maitri'] = self::scoreGrahaMaitri($bi, $gi);
        $scores['gana'] = self::scoreGana($bn, $gn);
        $scores['bhakoot'] = self::scoreBhakoot($bi, $gi);
        $scores['nadi'] = self::scoreNadi($bn, $gn);

        $total = 0.0;
        $max = 0.0;
        $details = [];
        foreach (self::GUNA_MAX as $k => $mx) {
            $got = $scores[$k];
            $total += $got;
            $max += $mx;
            $details[] = [
                'koot' => $k,
                'label' => ucwords(str_replace('_', ' ', $k)),
                'score' => $got,
                'max' => $mx,
            ];
        }

        $percent = round(($total / $max) * 100, 1);
        $verdict = $total >= 24
            ? ['en' => 'Excellent match', 'hi' => 'उत्तम मिलान']
            : ($total >= 18
                ? ['en' => 'Good match — suitable with remedies', 'hi' => 'अच्छा मिलान — उपाय सहित उपयुक्त']
                : ($total >= 14
                    ? ['en' => 'Average — consult before proceeding', 'hi' => 'मध्यम — आगे बढ़ने से पहले परामर्श लें']
                    : ['en' => 'Low compatibility — careful review needed', 'hi' => 'कम अनुकूलता — सावधानी आवश्यक']));

        return [
            'boy' => [
                'name' => $b['meta']['name'],
                'rashi' => $bMoon['rashi'],
                'rashi_hi' => $bMoon['rashi_hi'],
                'nakshatra' => $bMoon['nakshatra'],
                'nakshatra_hi' => $bMoon['nakshatra_hi'],
            ],
            'girl' => [
                'name' => $g['meta']['name'],
                'rashi' => $gMoon['rashi'],
                'rashi_hi' => $gMoon['rashi_hi'],
                'nakshatra' => $gMoon['nakshatra'],
                'nakshatra_hi' => $gMoon['nakshatra_hi'],
            ],
            'gunas' => $details,
            'total' => round($total, 2),
            'max' => $max,
            'percent' => $percent,
            'verdict' => $verdict,
            'manglik' => [
                'boy' => self::manglikHint($b),
                'girl' => self::manglikHint($g),
            ],
            'doshas' => [
                'nadi' => [
                    'present' => ($scores['nadi'] ?? 8) < 0.1,
                    'boy_nadi' => ($bn % 3) + 1,
                    'girl_nadi' => ($gn % 3) + 1,
                    'note' => ($scores['nadi'] ?? 8) < 0.1
                        ? ['en' => 'Nadi dosha present (same nadi).', 'hi' => 'नाड़ी दोष (समान नाड़ी)।']
                        : ['en' => 'No Nadi dosha.', 'hi' => 'नाड़ी दोष नहीं।'],
                ],
                'kalsarpa' => [
                    'boy' => $b['kalsarpa'] ?? null,
                    'girl' => $g['kalsarpa'] ?? null,
                ],
                'pitri' => [
                    'boy' => $b['pitri'] ?? null,
                    'girl' => $g['pitri'] ?? null,
                ],
            ],
            'report' => self::matchReport($total, $b, $g, $scores),
            'remedies' => self::matchRemedies($total),
        ];
    }

    private static function matchReport(float $total, array $b, array $g, array $scores): array
    {
        $en = sprintf(
            'Compatibility score %.1f/36 (%.0f%%). Moon signs %s × %s. ',
            $total,
            ($total / 36) * 100,
            $b['rashi']['moon']['rashi'] ?? '',
            $g['rashi']['moon']['rashi'] ?? ''
        );
        if ($total >= 24) {
            $en .= 'Strong overall guna milan. ';
        } elseif ($total >= 18) {
            $en .= 'Acceptable match with remedial support advised. ';
        } else {
            $en .= 'Below traditional threshold — detailed chart review recommended. ';
        }
        if (($scores['nadi'] ?? 8) < 0.1) {
            $en .= 'Nadi dosha flagged. ';
        }
        $hi = sprintf('गुण अंक %.1f/36। चंद्र राशि %s × %s।', $total, $b['rashi']['moon']['rashi_hi'] ?? '', $g['rashi']['moon']['rashi_hi'] ?? '');
        return ['en' => $en, 'hi' => $hi];
    }

    private static function scoreVarna(int $b, int $g): float
    {
        // Brahmin, Kshatriya, Vaishya, Shudra by rashi groups
        $map = [0 => 1, 1 => 2, 2 => 3, 3 => 0, 4 => 1, 5 => 2, 6 => 3, 7 => 0, 8 => 1, 9 => 2, 10 => 3, 11 => 0];
        return $map[$g] <= $map[$b] ? 1.0 : 0.0;
    }

    private static function scoreVashya(int $b, int $g): float
    {
        if ($b === $g) {
            return 2.0;
        }
        $diff = min(abs($b - $g), 12 - abs($b - $g));
        if ($diff === 1 || $diff === 5) {
            return 1.0;
        }
        if ($diff === 4 || $diff === 3) {
            return 1.5;
        }
        return 0.5;
    }

    private static function scoreTara(int $bn, int $gn): float
    {
        $c = (($gn - $bn + 27) % 27) + 1;
        $mod = $c % 9;
        if (in_array($mod, [3, 5, 7, 0], true)) {
            return 1.5;
        }
        if (in_array($mod, [1, 2, 4, 6, 8], true)) {
            return 3.0;
        }
        return 0.0;
    }

    private static function scoreYoni(int $bn, int $gn): float
    {
        $yoni = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13];
        // pad to 27
        while (count($yoni) < 27) {
            $yoni[] = count($yoni) % 14;
        }
        if ($yoni[$bn] === $yoni[$gn]) {
            return 4.0;
        }
        $enemies = [[0, 5], [1, 7], [2, 8], [3, 9]];
        foreach ($enemies as [$a, $b]) {
            if (($yoni[$bn] === $a && $yoni[$gn] === $b) || ($yoni[$bn] === $b && $yoni[$gn] === $a)) {
                return 0.0;
            }
        }
        return 2.0;
    }

    private static function scoreGrahaMaitri(int $b, int $g): float
    {
        $lords = [0,1,2,3,4,2,1,0,5,6,6,5]; // rashi lord idx into friend matrix simplified
        $friend = [
            [1, 0.5, 1, 0.5, 1, 0, 0],
            [1, 1, 0.5, 1, 0.5, 0, 0.5],
            [1, 0.5, 1, 0, 1, 0.5, 0],
            [0.5, 1, 0, 1, 0.5, 0, 0.5],
            [1, 0.5, 1, 0.5, 1, 0, 0],
            [0, 0, 0.5, 0, 0, 1, 1],
            [0, 0.5, 0, 0.5, 0, 1, 1],
        ];
        $lb = $lords[$b];
        $lg = $lords[$g];
        $f = $friend[$lb][$lg] ?? 0.5;
        return round($f * 5, 1);
    }

    private static function scoreGana(int $bn, int $gn): float
    {
        // Deva, Manushya, Rakshasa cycle approx by nakshatra
        $gana = [];
        for ($i = 0; $i < 27; $i++) {
            $gana[$i] = $i % 3; // 0 deva, 1 manushya, 2 rakshasa
        }
        if ($gana[$bn] === $gana[$gn]) {
            return 6.0;
        }
        if (($gana[$bn] === 0 && $gana[$gn] === 1) || ($gana[$bn] === 1 && $gana[$gn] === 0)) {
            return 3.0;
        }
        return 0.0;
    }

    private static function scoreBhakoot(int $b, int $g): float
    {
        $diff = (abs($b - $g)) % 12;
        $bad = [1, 2, 5, 6, 8, 9]; // 2-12, 3-11, 6-8 type pairs simplified
        $d = min($diff, 12 - $diff);
        if (in_array($d, [1, 5, 6], true)) {
            return 0.0;
        }
        return 7.0;
    }

    private static function scoreNadi(int $bn, int $gn): float
    {
        $nadi = $bn % 3;
        $nadi2 = $gn % 3;
        return $nadi === $nadi2 ? 0.0 : 8.0;
    }

    private static function manglikHint(array $kundli): array
    {
        $marsHouse = null;
        foreach ($kundli['houses'] as $h) {
            if (in_array('Mars', $h['planets'], true)) {
                $marsHouse = $h['house'];
                break;
            }
        }
        $manglikHouses = [1, 2, 4, 7, 8, 12];
        $is = $marsHouse !== null && in_array($marsHouse, $manglikHouses, true);
        return [
            'is_manglik' => $is,
            'mars_house' => $marsHouse,
            'note' => $is
                ? ['en' => 'Manglik indication present (Mars in house ' . $marsHouse . ').', 'hi' => 'मांगलिक योग संकेत (मंगल भाव ' . $marsHouse . ' में)।']
                : ['en' => 'No strong Manglik indication in this model.', 'hi' => 'इस मॉडल में प्रबल मांगलिक संकेत नहीं।'],
        ];
    }

    private static function matchRemedies(float $total): array
    {
        if ($total >= 24) {
            return [
                'en' => ['Perform simple Ganesh puja before muhurat.', 'Keep mutual respect rituals on festivals.'],
                'hi' => ['मुहूर्त से पहले गणेश पूजा करें।', 'त्योहारों पर पारस्परिक सम्मान बनाए रखें।'],
            ];
        }
        if ($total >= 18) {
            return [
                'en' => ['Donate to temple on Fridays.', 'Chant Mahamrityunjaya for harmony.', 'Prefer auspicious muhurat for marriage.'],
                'hi' => ['शुक्रवार को मंदिर में दान करें।', 'सामंजस्य हेतु महामृत्युंजय जाप करें।', 'विवाह हेतु शुभ मुहूर्त चुनें।'],
            ];
        }
        return [
            'en' => ['Detailed chart review recommended.', 'Consider Nadi/Bhakoot dosha remedies.', 'Consult before finalizing alliance.'],
            'hi' => ['विस्तृत कुंडली समीक्षा अनुशंसित।', 'नाड़ी/भकूट दोष उपाय विचारें।', 'निर्णय से पहले परामर्श लें।'],
        ];
    }

    public static function findMuhurat(string $date, string $purpose = 'general', float $tz = 5.5): array
    {
        $purposes = [
            'general' => ['en' => 'General auspicious work', 'hi' => 'सामान्य शुभ कार्य'],
            'marriage' => ['en' => 'Marriage / Engagement', 'hi' => 'विवाह / सगाई'],
            'business' => ['en' => 'Business / Opening', 'hi' => 'व्यवसाय / शुभारंभ'],
            'travel' => ['en' => 'Travel', 'hi' => 'यात्रा'],
            'griha' => ['en' => 'Griha Pravesh', 'hi' => 'गृह प्रवेश'],
            'naming' => ['en' => 'Namkaran', 'hi' => 'नामकरण'],
        ];
        $purposeMeta = $purposes[$purpose] ?? $purposes['general'];

        $slots = [];
        $base = strtotime($date . ' 06:00:00');
        for ($i = 0; $i < 8; $i++) {
            $startTs = $base + ($i * 90 * 60);
            $endTs = $startTs + (75 * 60);
            $timeStr = date('H:i', $startTs);
            $dt = self::parseDateTime($date, $timeStr, $tz);
            $p = self::panchangFromJd($dt['jd'], $date);
            $score = self::muhuratScore($p, $purpose, (int) date('w', $startTs));
            $slots[] = [
                'start' => date('H:i', $startTs),
                'end' => date('H:i', $endTs),
                'score' => $score,
                'rating' => $score >= 80 ? 'Shubh' : ($score >= 60 ? 'Chal' : 'Avoid'),
                'rating_hi' => $score >= 80 ? 'शुभ' : ($score >= 60 ? 'चल' : 'वर्ज्य'),
                'tithi' => $p['tithi']['name'],
                'nakshatra' => $p['nakshatra']['name'],
                'yoga' => $p['yoga']['name'],
            ];
        }

        usort($slots, static fn($a, $b) => $b['score'] <=> $a['score']);
        $best = $slots[0];
        $rahukaal = self::rahuKaal($date);

        return [
            'date' => $date,
            'purpose' => $purpose,
            'purpose_label' => $purposeMeta,
            'best' => $best,
            'slots' => $slots,
            'avoid' => [
                'rahukaal' => $rahukaal,
                'note' => ['en' => 'Avoid Rahu Kaal and Vishti karana for critical events.', 'hi' => 'महत्वपूर्ण कार्यों में राहुकाल व विष्टि करण से बचें।'],
            ],
            'panchang' => self::getPanchang($date),
        ];
    }

    private static function muhuratScore(array $p, string $purpose, int $weekday): int
    {
        $score = 55;
        $goodTithi = [1, 2, 3, 5, 7, 10, 11, 13];
        $tithiNum = (int) $p['tithi']['number'];
        if (in_array((($tithiNum - 1) % 15) + 1, $goodTithi, true)) {
            $score += 12;
        }
        $badYoga = ['Vyatipata', 'Vaidhriti', 'Parigha', 'Vyaghata', 'Shula', 'Ganda', 'Atiganda'];
        if (in_array($p['yoga']['name'], $badYoga, true)) {
            $score -= 18;
        } else {
            $score += 10;
        }
        if ($p['karana']['name'] === 'Vishti') {
            $score -= 15;
        } else {
            $score += 8;
        }
        $goodNak = ['Rohini', 'Mrigashira', 'Pushya', 'Hasta', 'Anuradha', 'Shravana', 'Revati', 'Ashwini'];
        if (in_array($p['nakshatra']['name'], $goodNak, true)) {
            $score += 12;
        }
        if ($purpose === 'marriage' && in_array($weekday, [1, 3, 4, 5], true)) {
            $score += 5;
        }
        if ($purpose === 'business' && in_array($weekday, [0, 3, 4], true)) {
            $score += 5;
        }
        return max(10, min(98, $score));
    }

    public static function remediesForRashi(int $index): array
    {
        $index = max(0, min(11, $index));
        $items = [
            ['gem' => 'Red Coral', 'mantra' => 'Om Angarakaya Namah', 'day' => 'Tuesday', 'daan' => 'Red lentils'],
            ['gem' => 'Diamond / White Sapphire', 'mantra' => 'Om Shukraya Namah', 'day' => 'Friday', 'daan' => 'White clothes'],
            ['gem' => 'Emerald', 'mantra' => 'Om Budhaya Namah', 'day' => 'Wednesday', 'daan' => 'Green moong'],
            ['gem' => 'Pearl', 'mantra' => 'Om Chandraya Namah', 'day' => 'Monday', 'daan' => 'Rice / milk'],
            ['gem' => 'Ruby', 'mantra' => 'Om Suryaya Namah', 'day' => 'Sunday', 'daan' => 'Wheat / jaggery'],
            ['gem' => 'Emerald', 'mantra' => 'Om Budhaya Namah', 'day' => 'Wednesday', 'daan' => 'Books / stationery'],
            ['gem' => 'Diamond', 'mantra' => 'Om Shukraya Namah', 'day' => 'Friday', 'daan' => 'Sugar / sweets'],
            ['gem' => 'Red Coral', 'mantra' => 'Om Angarakaya Namah', 'day' => 'Tuesday', 'daan' => 'Masoor dal'],
            ['gem' => 'Yellow Sapphire', 'mantra' => 'Om Gurave Namah', 'day' => 'Thursday', 'daan' => 'Chana dal / turmeric'],
            ['gem' => 'Blue Sapphire', 'mantra' => 'Om Shanaye Namah', 'day' => 'Saturday', 'daan' => 'Black sesame / iron'],
            ['gem' => 'Blue Sapphire', 'mantra' => 'Om Shanaye Namah', 'day' => 'Saturday', 'daan' => 'Mustard oil'],
            ['gem' => 'Yellow Sapphire', 'mantra' => 'Om Gurave Namah', 'day' => 'Thursday', 'daan' => 'Banana / yellow cloth'],
        ];
        $r = self::RASHIS[$index];
        return [
            'rashi' => $r['en'],
            'rashi_hi' => $r['hi'],
            'remedy' => $items[$index],
            'disclaimer' => [
                'en' => 'Remedies are traditional suggestions for demo. Personalize after full chart study.',
                'hi' => 'ये पारंपरिक सुझाव डेमो हेतु हैं। पूर्ण कुंडली अध्ययन के बाद ही व्यक्तिगत करें।',
            ],
        ];
    }

    public static function cityPresets(): array
    {
        return [
            ['name' => 'Indore', 'lat' => 22.7196, 'lon' => 75.8577],
            ['name' => 'Delhi', 'lat' => 28.6139, 'lon' => 77.2090],
            ['name' => 'Mumbai', 'lat' => 19.0760, 'lon' => 72.8777],
            ['name' => 'Varanasi', 'lat' => 25.3176, 'lon' => 82.9739],
            ['name' => 'Jaipur', 'lat' => 26.9124, 'lon' => 75.7873],
            ['name' => 'Bengaluru', 'lat' => 12.9716, 'lon' => 77.5946],
            ['name' => 'Kolkata', 'lat' => 22.5726, 'lon' => 88.3639],
            ['name' => 'Chennai', 'lat' => 13.0827, 'lon' => 80.2707],
            ['name' => 'Khargone', 'lat' => 21.8229, 'lon' => 75.6139],
            ['name' => 'Ujjain', 'lat' => 23.1765, 'lon' => 75.7885],
        ];
    }
}
