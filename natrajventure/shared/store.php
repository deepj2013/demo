<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

function nv_ensure_data_dir(): void
{
    if (!is_dir(NV_DATA)) {
        mkdir(NV_DATA, 0750, true);
    }
}

function nv_read_json(string $file, $default = [])
{
    nv_ensure_data_dir();
    $path = NV_DATA . '/' . ltrim($file, '/');
    if (!is_file($path)) {
        return $default;
    }
    $raw = file_get_contents($path);
    if ($raw === false || $raw === '') {
        return $default;
    }
    $data = json_decode($raw, true);
    return $data === null ? $default : $data;
}

function nv_write_json(string $file, $data): bool
{
    nv_ensure_data_dir();
    $path = NV_DATA . '/' . ltrim($file, '/');
    $tmp = $path . '.tmp';
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        return false;
    }
    if (file_put_contents($tmp, $json . "\n", LOCK_EX) === false) {
        return false;
    }
    return rename($tmp, $path);
}

function nv_append_csv(string $file, array $row, array $headers = []): bool
{
    nv_ensure_data_dir();
    $path = NV_DATA . '/' . ltrim($file, '/');
    $exists = is_file($path);
    $fh = fopen($path, 'ab');
    if ($fh === false) {
        return false;
    }
    if (!$exists && $headers) {
        fputcsv($fh, $headers, ',', '"', '\\');
    }
    fputcsv($fh, $row, ',', '"', '\\');
    fclose($fh);
    return true;
}

function nv_uid(string $prefix = 'NV'): string
{
    return $prefix . '-' . strtoupper(bin2hex(random_bytes(4))) . '-' . date('ymd');
}

function nv_products(): array
{
    return nv_read_json('products.json', []);
}

function nv_save_products(array $products): bool
{
    return nv_write_json('products.json', $products);
}

function nv_orders(): array
{
    return nv_read_json('orders.json', []);
}

function nv_save_order(array $order): bool
{
    $orders = nv_orders();
    array_unshift($orders, $order);
    $ok = nv_write_json('orders.json', $orders);
    if ($ok) {
        nv_append_csv('orders.csv', [
            $order['id'] ?? '',
            $order['created_at'] ?? '',
            $order['service'] ?? '',
            $order['customer']['name'] ?? '',
            $order['customer']['phone'] ?? '',
            $order['customer']['email'] ?? '',
            $order['total'] ?? '',
            $order['payment_method'] ?? '',
            $order['status'] ?? '',
        ], ['id', 'created_at', 'service', 'name', 'phone', 'email', 'total', 'payment_method', 'status']);
    }
    return $ok;
}

function nv_leads(): array
{
    return nv_read_json('leads.json', []);
}

function nv_save_lead(array $lead): bool
{
    $leads = nv_leads();
    array_unshift($leads, $lead);
    $ok = nv_write_json('leads.json', $leads);
    if ($ok) {
        nv_append_csv('leads.csv', [
            $lead['id'] ?? '',
            $lead['created_at'] ?? '',
            $lead['service'] ?? '',
            $lead['type'] ?? '',
            $lead['name'] ?? '',
            $lead['phone'] ?? '',
            $lead['email'] ?? '',
            $lead['message'] ?? '',
            $lead['status'] ?? '',
        ], ['id', 'created_at', 'service', 'type', 'name', 'phone', 'email', 'message', 'status']);
    }
    return $ok;
}
