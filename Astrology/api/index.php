<?php
require_once __DIR__ . '/../lib/bootstrap.php';
require_lib('Database');
require_lib('Auth');
require_lib('UserStore');
require_lib('AstrologyEngine');

$action = $_GET['action'] ?? '';
$body = read_json_body();
if (!$body) {
    $body = $_GET;
}
$token = request_token();

try {
    switch ($action) {
        case 'tenant':
            json_response(['ok' => true, 'tenant' => tenant()]);

        case 'cities':
            json_response(['ok' => true, 'cities' => AstrologyEngine::cityPresets()]);

        case 'engine_status':
            require_lib('Ephemeris');
            json_response([
                'ok' => true,
                'data' => array_merge(Ephemeris::status(), [
                    'db_driver' => Database::driver(),
                ]),
            ]);

        case 'login':
            $result = Auth::login(
                (string) ($body['phone'] ?? ''),
                (string) ($body['password'] ?? ''),
                isset($body['name']) ? (string) $body['name'] : null
            );
            json_response(['ok' => true, 'data' => $result]);

        case 'logout':
            Auth::logout($token);
            json_response(['ok' => true]);

        case 'me':
            $user = Auth::requireUser($token);
            json_response(['ok' => true, 'data' => ['user' => Auth::publicUser($user)]]);

        case 'update_profile':
            $user = Auth::requireUser($token);
            $updated = Auth::updateProfile((int) $user['id'], $body);
            json_response(['ok' => true, 'data' => ['user' => $updated]]);

        case 'kundli_pdf':
            $user = Auth::requireUser($token);
            require_lib('KundliReport');
            $lang = (string) ($body['lang'] ?? $_GET['lang'] ?? 'en');
            $chart = null;
            if (!empty($body['chart']) && is_array($body['chart'])) {
                $chart = $body['chart'];
            } elseif (!empty($body['id']) || !empty($_GET['id'])) {
                $id = (int) ($body['id'] ?? $_GET['id']);
                $row = UserStore::getKundli((int) $user['id'], $id);
                if (!$row || empty($row['result'])) {
                    json_response(['ok' => false, 'error' => 'Chart not found.'], 404);
                }
                $chart = $row['result'];
            }
            if (!$chart) {
                json_response(['ok' => false, 'error' => 'Provide chart data or saved chart id.'], 400);
            }
            $pub = Auth::publicUser($user);
            $tenant = tenant();
            $charges = $pub['charges'] ?? ($tenant['charges'] ?? []);
            if (array_key_exists('include_charges', $body)) {
                $charges['show_on_pdf'] = !empty($body['include_charges']);
            }
            $html = KundliReport::render($chart, [
                'lang' => $lang,
                'tenant' => $tenant,
                'user' => $pub,
                'charges' => $charges,
                'include_charges' => !empty($charges['show_on_pdf']),
            ]);
            if (!empty($body['as_html']) || (($_GET['format'] ?? '') === 'html')) {
                header('Content-Type: text/html; charset=utf-8');
                echo $html;
                exit;
            }
            json_response([
                'ok' => true,
                'data' => [
                    'html' => $html,
                    'filename' => 'kundli-' . preg_replace('/\W+/', '-', (string) ($chart['meta']['name'] ?? 'report')) . '.pdf',
                ],
            ]);

        case 'dashboard':
            $user = Auth::requireUser($token);
            json_response([
                'ok' => true,
                'data' => array_merge(
                    ['user' => Auth::publicUser($user)],
                    UserStore::dashboard((int) $user['id'])
                ),
            ]);

        case 'kundli':
            $user = Auth::requireUser($token);
            $input = [
                'name' => $body['name'] ?? 'Native',
                'date' => $body['date'] ?? date('Y-m-d'),
                'time' => $body['time'] ?? '12:00',
                'lat' => (float) ($body['lat'] ?? 22.7196),
                'lon' => (float) ($body['lon'] ?? 75.8577),
                'place' => $body['place'] ?? 'Indore',
                'gender' => $body['gender'] ?? 'other',
                'tz' => (float) ($body['tz'] ?? 5.5),
                'ayanamsa' => $body['ayanamsa'] ?? 'lahiri',
                'house_system' => $body['house_system'] ?? 'whole_sign',
                'chart_style' => $body['chart_style'] ?? 'south',
            ];
            $result = AstrologyEngine::buildKundli($input);
            $saved = UserStore::saveKundli((int) $user['id'], $input, $result);
            json_response(['ok' => true, 'data' => $result, 'saved' => $saved]);

        case 'match':
            $user = Auth::requireUser($token);
            $boy = [
                'name' => $body['boy_name'] ?? 'Boy',
                'date' => $body['boy_date'] ?? '1990-01-15',
                'time' => $body['boy_time'] ?? '10:30',
                'lat' => (float) ($body['boy_lat'] ?? 22.7196),
                'lon' => (float) ($body['boy_lon'] ?? 75.8577),
                'place' => $body['boy_place'] ?? 'Indore',
                'gender' => 'male',
            ];
            $girl = [
                'name' => $body['girl_name'] ?? 'Girl',
                'date' => $body['girl_date'] ?? '1992-05-20',
                'time' => $body['girl_time'] ?? '14:15',
                'lat' => (float) ($body['girl_lat'] ?? 28.6139),
                'lon' => (float) ($body['girl_lon'] ?? 77.2090),
                'place' => $body['girl_place'] ?? 'Delhi',
                'gender' => 'female',
            ];
            $result = AstrologyEngine::matchKundli($boy, $girl);
            $saved = UserStore::saveMatch((int) $user['id'], $result);
            json_response(['ok' => true, 'data' => $result, 'saved' => $saved]);

        case 'panchang':
            Auth::requireUser($token);
            $date = $body['date'] ?? date('Y-m-d');
            $lat = (float) ($body['lat'] ?? 22.7196);
            $lon = (float) ($body['lon'] ?? 75.8577);
            $tz = (float) ($body['tz'] ?? 5.5);
            $ayan = (string) ($body['ayanamsa'] ?? 'lahiri');
            json_response(['ok' => true, 'data' => AstrologyEngine::getPanchang($date, $lat, $lon, $tz, $ayan)]);

        case 'muhurat':
            Auth::requireUser($token);
            $date = $body['date'] ?? date('Y-m-d');
            $purpose = $body['purpose'] ?? 'general';
            json_response(['ok' => true, 'data' => AstrologyEngine::findMuhurat($date, $purpose)]);

        case 'rashi':
            Auth::requireUser($token);
            if (!empty($body['date'])) {
                $data = AstrologyEngine::moonRashiFromDob(
                    (string) $body['date'],
                    (string) ($body['time'] ?? '12:00')
                );
                json_response(['ok' => true, 'data' => $data]);
            }
            $index = isset($body['index']) ? (int) $body['index'] : 0;
            json_response(['ok' => true, 'data' => [
                'profile' => AstrologyEngine::rashiProfile($index),
                'remedies' => AstrologyEngine::remediesForRashi($index),
            ]]);

        case 'remedies':
            Auth::requireUser($token);
            $index = (int) ($body['index'] ?? 0);
            json_response(['ok' => true, 'data' => AstrologyEngine::remediesForRashi($index)]);

        case 'rashis':
            Auth::requireUser($token);
            $list = [];
            foreach (AstrologyEngine::RASHIS as $i => $r) {
                $list[] = array_merge(['index' => $i], $r);
            }
            json_response(['ok' => true, 'data' => $list]);

        case 'clients':
            $user = Auth::requireUser($token);
            json_response(['ok' => true, 'data' => UserStore::listKundlis((int) $user['id'])]);

        case 'client_get':
            $user = Auth::requireUser($token);
            $id = (int) ($body['id'] ?? $_GET['id'] ?? 0);
            $row = UserStore::getKundli((int) $user['id'], $id);
            if (!$row) {
                json_response(['ok' => false, 'error' => 'Chart not found.'], 404);
            }
            json_response(['ok' => true, 'data' => $row]);

        case 'client_delete':
            $user = Auth::requireUser($token);
            $id = (int) ($body['id'] ?? 0);
            if (!UserStore::deleteKundli((int) $user['id'], $id)) {
                json_response(['ok' => false, 'error' => 'Chart not found.'], 404);
            }
            json_response(['ok' => true]);

        case 'matches':
            $user = Auth::requireUser($token);
            json_response(['ok' => true, 'data' => UserStore::listMatches((int) $user['id'])]);

        case 'match_get':
            $user = Auth::requireUser($token);
            $id = (int) ($body['id'] ?? $_GET['id'] ?? 0);
            $row = UserStore::getMatch((int) $user['id'], $id);
            if (!$row) {
                json_response(['ok' => false, 'error' => 'Match not found.'], 404);
            }
            json_response(['ok' => true, 'data' => $row]);

        case 'match_delete':
            $user = Auth::requireUser($token);
            $id = (int) ($body['id'] ?? 0);
            if (!UserStore::deleteMatch((int) $user['id'], $id)) {
                json_response(['ok' => false, 'error' => 'Match not found.'], 404);
            }
            json_response(['ok' => true]);

        default:
            json_response([
                'ok' => true,
                'product' => tenant()['brand'],
                'endpoints' => [
                    'login', 'logout', 'me', 'update_profile', 'dashboard', 'kundli_pdf',
                    'tenant', 'cities', 'kundli', 'match', 'panchang',
                    'muhurat', 'rashi', 'remedies', 'rashis',
                    'clients', 'client_get', 'client_delete',
                    'matches', 'match_get', 'match_delete',
                    'engine_status',
                ],
            ]);
    }
} catch (InvalidArgumentException $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 400);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 500);
}
