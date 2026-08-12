<?php
declare(strict_types=1);

function log_activity(?int $userId, string $action, ?string $entity = null, ?int $entityId = null, ?string $details = null): void {
    try {
        $stmt = db()->prepare('INSERT INTO activity_log (user_id, action, entity, entity_id, details) VALUES (?,?,?,?,?)');
        $stmt->execute([$userId, $action, $entity, $entityId, $details]);
    } catch (Throwable $e) {
        // silent — never break main flow
    }
}

function upload_image(array $file, string $subdir = 'products'): ?string {
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) return null;
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    if (!isset($allowed[$mime])) return null;
    if (($file['size'] ?? 0) > 5 * 1024 * 1024) return null;

    $dir = ROOT_PATH . '/assets/uploads/' . $subdir;
    if (!is_dir($dir)) mkdir($dir, 0755, true);

    $name = bin2hex(random_bytes(8)) . '.' . $allowed[$mime];
    $dest = $dir . '/' . $name;
    if (!move_uploaded_file($file['tmp_name'], $dest)) return null;
    return 'uploads/' . $subdir . '/' . $name;
}

function stock_qty(int $itemId): float {
    $stmt = db()->prepare('SELECT COALESCE(SUM(qty),0) AS q FROM inventory WHERE item_id = ?');
    $stmt->execute([$itemId]);
    return (float) $stmt->fetchColumn();
}

function adjust_stock(int $itemId, ?int $rackId, float $qty, string $type, ?float $unitCost = null, ?string $refType = null, ?int $refId = null, ?string $notes = null): void {
    $pdo = db();
    $pdo->beginTransaction();
    try {
        // Find or create inventory row
        if ($rackId) {
            $stmt = $pdo->prepare('SELECT id, qty FROM inventory WHERE item_id = ? AND rack_id = ? LIMIT 1');
            $stmt->execute([$itemId, $rackId]);
        } else {
            $stmt = $pdo->prepare('SELECT id, qty FROM inventory WHERE item_id = ? AND rack_id IS NULL LIMIT 1');
            $stmt->execute([$itemId]);
        }
        $row = $stmt->fetch();

        $delta = in_array($type, ['in', 'return'], true) ? abs($qty) : -abs($qty);
        if ($type === 'adjust') $delta = $qty; // signed

        if ($row) {
            $newQty = (float) $row['qty'] + $delta;
            if ($newQty < 0) throw new RuntimeException('Insufficient stock');
            $upd = $pdo->prepare('UPDATE inventory SET qty = ? WHERE id = ?');
            $upd->execute([$newQty, $row['id']]);
        } else {
            if ($delta < 0) throw new RuntimeException('Insufficient stock');
            $ins = $pdo->prepare('INSERT INTO inventory (item_id, rack_id, qty) VALUES (?,?,?)');
            $ins->execute([$itemId, $rackId, $delta]);
        }

        $mov = $pdo->prepare('INSERT INTO stock_movements (item_id, rack_id, movement_type, qty, unit_cost, reference_type, reference_id, notes, created_by) VALUES (?,?,?,?,?,?,?,?,?)');
        $mov->execute([
            $itemId,
            $rackId,
            $type === 'adjust' ? 'adjust' : $type,
            abs($qty),
            $unitCost ?? 0,
            $refType,
            $refId,
            $notes,
            current_user()['id'] ?? null,
        ]);

        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}

function recalculate_bom(int $bomId): array {
    $pdo = db();
    $bom = $pdo->prepare('SELECT * FROM bom_headers WHERE id = ?');
    $bom->execute([$bomId]);
    $header = $bom->fetch();
    if (!$header) throw new RuntimeException('BOM not found');

    $lines = $pdo->prepare('SELECT * FROM bom_lines WHERE bom_id = ?');
    $lines->execute([$bomId]);
    $materialCost = 0.0;
    foreach ($lines->fetchAll() as $line) {
        $effectiveQty = (float) $line['qty'] * (1 + ((float) $line['waste_percent'] / 100));
        $lineCost = $effectiveQty * (float) $line['unit_cost'];
        $pdo->prepare('UPDATE bom_lines SET line_cost = ? WHERE id = ?')->execute([$lineCost, $line['id']]);
        $materialCost += $lineCost;
    }

    $labour = (float) $header['labour_hours'] * (float) $header['labour_rate'];
    $sub = $materialCost + $labour;
    $overhead = $sub * ((float) $header['overhead_percent'] / 100);
    $totalCost = $sub + $overhead;
    $suggested = $totalCost * (1 + ((float) $header['markup_percent'] / 100));

    $pdo->prepare('UPDATE bom_headers SET calculated_cost = ?, suggested_price = ? WHERE id = ?')
        ->execute([$totalCost, $suggested, $bomId]);

    // Sync finished item cost & sell price
    $pdo->prepare('UPDATE items SET cost_price = ?, sell_price = CASE WHEN sell_price = 0 THEN ? ELSE sell_price END WHERE id = ?')
        ->execute([$totalCost, $suggested, $header['finished_item_id']]);

    return ['cost' => $totalCost, 'price' => $suggested, 'materials' => $materialCost, 'labour' => $labour, 'overhead' => $overhead];
}

function next_number(string $prefix, string $table, string $column): string {
    // Unique enough for concurrent checkouts
    $n = strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
    return $prefix . date('ymd') . '-' . $n;
}

function dashboard_stats(): array {
    $pdo = db();
    $stats = [];
    $stats['items'] = (int) $pdo->query('SELECT COUNT(*) FROM items WHERE is_active=1')->fetchColumn();
    $stats['low_stock'] = (int) $pdo->query('SELECT COUNT(*) FROM items i WHERE i.is_active=1 AND (SELECT COALESCE(SUM(qty),0) FROM inventory inv WHERE inv.item_id=i.id) < i.min_stock')->fetchColumn();
    $stats['customers'] = (int) $pdo->query('SELECT COUNT(*) FROM customers WHERE is_active=1')->fetchColumn();
    $stats['orders_month'] = (int) $pdo->query("SELECT COUNT(*) FROM orders WHERE MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())")->fetchColumn();
    $stats['revenue_month'] = (float) $pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE payment_status='paid' AND MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())")->fetchColumn();
    $stats['vendors'] = (int) $pdo->query('SELECT COUNT(*) FROM vendors WHERE is_active=1')->fetchColumn();
    $stats['pending_pos'] = (int) $pdo->query("SELECT COUNT(*) FROM purchase_orders WHERE status IN ('draft','ordered','partial')")->fetchColumn();
    $stats['pending_orders'] = (int) $pdo->query("SELECT COUNT(*) FROM orders WHERE status='pending'")->fetchColumn();
    return $stats;
}

function enabled_nav(): array {
    $nav = [
        ['key' => 'dashboard', 'label' => 'Dashboard', 'icon' => 'grid', 'href' => 'admin/index.php', 'module' => null],
        ['key' => 'items', 'label' => 'Item Master', 'icon' => 'box', 'href' => 'admin/items.php', 'module' => 'items'],
        ['key' => 'inventory', 'label' => 'Inventory', 'icon' => 'layers', 'href' => 'admin/inventory.php', 'module' => 'inventory'],
        ['key' => 'racks', 'label' => 'Racks', 'icon' => 'map', 'href' => 'admin/racks.php', 'module' => 'racks'],
        ['key' => 'costing', 'label' => 'Costing / BOM', 'icon' => 'calc', 'href' => 'admin/costing.php', 'module' => 'costing'],
        ['key' => 'wages', 'label' => 'Wages', 'icon' => 'users', 'href' => 'admin/wages.php', 'module' => 'costing'],
        ['key' => 'vendors', 'label' => 'Vendors', 'icon' => 'truck', 'href' => 'admin/vendors.php', 'module' => 'vendors'],
        ['key' => 'purchases', 'label' => 'Purchases', 'icon' => 'cart', 'href' => 'admin/purchases.php', 'module' => 'vendors'],
        ['key' => 'crm', 'label' => 'Customers', 'icon' => 'heart', 'href' => 'admin/customers.php', 'module' => 'crm'],
        ['key' => 'orders', 'label' => 'Orders', 'icon' => 'bag', 'href' => 'admin/orders.php', 'module' => 'ecommerce'],
        ['key' => 'shop_products', 'label' => 'Shop products', 'icon' => 'bag', 'href' => 'admin/shop_products.php', 'module' => 'ecommerce'],
        ['key' => 'reports', 'label' => 'Reports', 'icon' => 'chart', 'href' => 'admin/reports.php', 'module' => 'reports'],
        ['key' => 'website', 'label' => 'Website', 'icon' => 'globe', 'href' => 'admin/website.php', 'module' => 'website'],
    ];
    return array_values(array_filter($nav, fn($n) => $n['module'] === null || module_enabled($n['module'])));
}
