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

function period_sql_bounds(string $period): array {
    // Returns [fromDateTime, toDateTime, label]
    $period = strtolower(trim($period));
    $today = date('Y-m-d');
    switch ($period) {
        case 'today':
        case 'daily':
            return [$today . ' 00:00:00', $today . ' 23:59:59', 'Today'];
        case 'week':
        case 'weekly':
            $from = date('Y-m-d', strtotime('monday this week'));
            return [$from . ' 00:00:00', $today . ' 23:59:59', 'This week'];
        case 'quarter':
        case 'quarterly':
            $m = (int) date('n');
            $qStart = (int) (floor(($m - 1) / 3) * 3 + 1);
            $from = date('Y-' . str_pad((string) $qStart, 2, '0', STR_PAD_LEFT) . '-01');
            return [$from . ' 00:00:00', $today . ' 23:59:59', 'This quarter'];
        case 'year':
        case 'yearly':
            $from = date('Y-01-01');
            return [$from . ' 00:00:00', $today . ' 23:59:59', 'This year'];
        case 'month':
        case 'monthly':
        default:
            $from = date('Y-m-01');
            return [$from . ' 00:00:00', $today . ' 23:59:59', 'This month'];
    }
}

function dashboard_stats(?string $period = 'month'): array {
    $pdo = db();
    [$from, $to, $label] = period_sql_bounds($period ?? 'month');
    $stats = [];
    $stats['period_label'] = $label;
    $stats['items'] = (int) $pdo->query('SELECT COUNT(*) FROM items WHERE is_active=1')->fetchColumn();
    $stats['raw_items'] = (int) $pdo->query("SELECT COUNT(*) FROM items WHERE is_active=1 AND item_type IN ('raw','accessory','consumable')")->fetchColumn();
    $stats['finished_items'] = (int) $pdo->query("SELECT COUNT(*) FROM items WHERE is_active=1 AND item_type='finished'")->fetchColumn();
    $stats['low_stock'] = (int) $pdo->query('SELECT COUNT(*) FROM items i WHERE i.is_active=1 AND (SELECT COALESCE(SUM(qty),0) FROM inventory inv WHERE inv.item_id=i.id) < i.min_stock')->fetchColumn();
    $stats['customers'] = (int) $pdo->query('SELECT COUNT(*) FROM customers WHERE is_active=1')->fetchColumn();
    $st = $pdo->prepare("SELECT COUNT(*) FROM orders WHERE created_at BETWEEN ? AND ? AND status!='cancelled'");
    $st->execute([$from, $to]);
    $stats['orders_period'] = (int) $st->fetchColumn();
    $st = $pdo->prepare("SELECT COALESCE(SUM(total),0) FROM orders WHERE payment_status IN ('paid','partial') AND created_at BETWEEN ? AND ? AND status!='cancelled'");
    $st->execute([$from, $to]);
    $stats['revenue_period'] = (float) $st->fetchColumn();
    $stats['orders_month'] = $stats['orders_period'];
    $stats['revenue_month'] = $stats['revenue_period'];
    $st = $pdo->prepare("SELECT COUNT(DISTINCT customer_id) FROM orders WHERE customer_id IS NOT NULL AND created_at BETWEEN ? AND ? AND status!='cancelled'");
    $st->execute([$from, $to]);
    $stats['buyers_period'] = (int) $st->fetchColumn();
    $stats['returning_buyers'] = (int) $pdo->query("SELECT COUNT(*) FROM customers WHERE total_orders > 1 AND is_active=1")->fetchColumn();
    $stats['vendors'] = (int) $pdo->query('SELECT COUNT(*) FROM vendors WHERE is_active=1')->fetchColumn();
    $stats['pending_pos'] = (int) $pdo->query("SELECT COUNT(*) FROM purchase_orders WHERE status IN ('draft','ordered','partial')")->fetchColumn();
    $stats['pending_orders'] = (int) $pdo->query("SELECT COUNT(*) FROM orders WHERE status='pending'")->fetchColumn();
    $target = (float) (settings()['ecommerce']['sales_target'] ?? 200000);
    $stats['sales_target'] = $target;
    $stats['sales_progress'] = $target > 0 ? min(100, ($stats['revenue_period'] / $target) * 100) : 0;
    return $stats;
}

function enabled_nav(): array {
    $nav = [
        ['key' => 'dashboard', 'label' => 'Dashboard', 'icon' => 'grid', 'href' => 'admin/index.php', 'module' => null, 'group' => 'main'],
        ['key' => 'orders', 'label' => 'Orders', 'icon' => 'bag', 'href' => 'admin/orders.php', 'module' => 'ecommerce', 'group' => 'main'],
        ['key' => 'items', 'label' => 'Item Master', 'icon' => 'box', 'href' => 'admin/items.php', 'module' => 'items', 'group' => 'inventory'],
        ['key' => 'categories', 'label' => 'Category Master', 'icon' => 'layers', 'href' => 'admin/categories.php', 'module' => 'items', 'group' => 'inventory'],
        ['key' => 'inventory', 'label' => 'Inventory', 'icon' => 'layers', 'href' => 'admin/inventory.php', 'module' => 'inventory', 'group' => 'inventory'],
        ['key' => 'racks', 'label' => 'Rack Master', 'icon' => 'map', 'href' => 'admin/racks.php', 'module' => 'racks', 'group' => 'inventory'],
        ['key' => 'costing', 'label' => 'Costing / BOM', 'icon' => 'calc', 'href' => 'admin/costing.php', 'module' => 'costing', 'group' => 'inventory'],
        ['key' => 'wages', 'label' => 'Wages', 'icon' => 'users', 'href' => 'admin/wages.php', 'module' => 'costing', 'group' => 'inventory'],
        ['key' => 'vendors', 'label' => 'Vendor Master', 'icon' => 'truck', 'href' => 'admin/vendors.php', 'module' => 'vendors', 'group' => 'purchase'],
        ['key' => 'purchases', 'label' => 'Purchases', 'icon' => 'cart', 'href' => 'admin/purchases.php', 'module' => 'vendors', 'group' => 'purchase'],
        ['key' => 'crm', 'label' => 'Customers', 'icon' => 'heart', 'href' => 'admin/customers.php', 'module' => 'crm', 'group' => 'sales'],
        ['key' => 'shop_products', 'label' => 'Shop products', 'icon' => 'store', 'href' => 'admin/shop_products.php', 'module' => 'ecommerce', 'group' => 'sales'],
        ['key' => 'reports', 'label' => 'Reports', 'icon' => 'chart', 'href' => 'admin/reports.php', 'module' => 'reports', 'group' => 'insights'],
        ['key' => 'website', 'label' => 'Website', 'icon' => 'globe', 'href' => 'admin/website.php', 'module' => 'website', 'group' => 'insights'],
    ];
    return array_values(array_filter($nav, fn($n) => $n['module'] === null || module_enabled($n['module'])));
}

function nav_groups(): array {
    return [
        'main' => 'Overview',
        'inventory' => 'Inventory',
        'purchase' => 'Purchase',
        'sales' => 'Sales & CRM',
        'insights' => 'Insights',
    ];
}

function pct_change(float $current, float $previous): float {
    if ($previous == 0.0) return $current > 0 ? 100.0 : 0.0;
    return (($current - $previous) / $previous) * 100;
}
