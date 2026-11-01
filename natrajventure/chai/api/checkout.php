<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/shared/store.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    nv_json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
    nv_json_response(['ok' => false, 'error' => 'Invalid JSON'], 400);
}

$customer = $data['customer'] ?? [];
$items = $data['items'] ?? [];
$name = trim((string) ($customer['name'] ?? ''));
$phone = trim((string) ($customer['phone'] ?? ''));
$email = trim((string) ($customer['email'] ?? ''));
$address = trim((string) ($customer['address'] ?? ''));

if ($name === '' || $phone === '' || $email === '' || $address === '' || !is_array($items) || !$items) {
    nv_json_response(['ok' => false, 'error' => 'Please fill all required fields and cart items.'], 422);
}

$catalog = [];
foreach (nv_products() as $p) {
    if (($p['service'] ?? '') === 'chai') {
        $catalog[$p['id']] = $p;
    }
}

$normalized = [];
$total = 0;
foreach ($items as $item) {
    $id = (string) ($item['id'] ?? '');
    $qty = max(1, (int) ($item['qty'] ?? 1));
    if (!isset($catalog[$id])) {
        continue;
    }
    $price = (int) $catalog[$id]['price'];
    $normalized[] = [
        'id' => $id,
        'name' => $catalog[$id]['name'],
        'price' => $price,
        'qty' => $qty,
        'line_total' => $price * $qty,
    ];
    $total += $price * $qty;
}

if (!$normalized) {
    nv_json_response(['ok' => false, 'error' => 'No valid products in cart.'], 422);
}

$order = [
    'id' => nv_uid('CHAI'),
    'service' => 'chai',
    'created_at' => date('c'),
    'status' => 'new',
    'payment_method' => (string) ($data['payment_method'] ?? 'cod'),
    'payment_status' => 'pending',
    'total' => $total,
    'currency' => 'INR',
    'customer' => [
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'address' => $address,
        'notes' => trim((string) ($customer['notes'] ?? '')),
    ],
    'items' => $normalized,
];

if (!nv_save_order($order)) {
    nv_json_response(['ok' => false, 'error' => 'Could not save order'], 500);
}

nv_json_response(['ok' => true, 'id' => $order['id'], 'total' => $total]);
