<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/shared/store.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    nv_json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$data = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($data)) {
    nv_json_response(['ok' => false, 'error' => 'Invalid JSON'], 400);
}

$name = trim((string) ($data['name'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
if ($name === '' || $phone === '') {
    nv_json_response(['ok' => false, 'error' => 'Name and phone are required.'], 422);
}

$lead = [
    'id' => nv_uid('FIN'),
    'service' => 'finance',
    'type' => (string) ($data['type'] ?? 'health_insurance'),
    'created_at' => date('c'),
    'status' => 'new',
    'name' => $name,
    'phone' => $phone,
    'email' => trim((string) ($data['email'] ?? '')),
    'city' => trim((string) ($data['city'] ?? '')),
    'message' => trim((string) ($data['message'] ?? '')),
];

if (!nv_save_lead($lead)) {
    nv_json_response(['ok' => false, 'error' => 'Could not save lead'], 500);
}

nv_json_response(['ok' => true, 'id' => $lead['id']]);
