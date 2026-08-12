<?php
/**
 * Item search API — supports 1000+ items via q / category / type filters
 * GET: q, category_id, item_type, types (comma), limit
 */
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();

$q = trim((string) ($_GET['q'] ?? ''));
$categoryId = (int) ($_GET['category_id'] ?? 0);
$itemType = trim((string) ($_GET['item_type'] ?? ''));
$types = trim((string) ($_GET['types'] ?? ''));
$limit = min(80, max(5, (int) ($_GET['limit'] ?? 40)));

$sql = "SELECT i.id, i.sku, i.name, i.unit, i.item_type, i.cost_price, i.sell_price, i.color, i.size,
               c.name AS category_name, c.id AS category_id,
               COALESCE((SELECT SUM(qty) FROM inventory WHERE item_id=i.id),0) AS stock_qty
        FROM items i
        LEFT JOIN categories c ON c.id = i.category_id
        WHERE i.is_active = 1";
$params = [];

if ($q !== '') {
    $sql .= " AND (i.name LIKE ? OR i.sku LIKE ? OR i.color LIKE ? OR i.material LIKE ?)";
    $like = '%' . $q . '%';
    $params = array_merge($params, [$like, $like, $like, $like]);
}
if ($categoryId > 0) {
    $sql .= " AND i.category_id = ?";
    $params[] = $categoryId;
}
if ($itemType !== '') {
    $sql .= " AND i.item_type = ?";
    $params[] = $itemType;
}
if ($types !== '') {
    $list = array_values(array_filter(array_map('trim', explode(',', $types))));
    $allowed = ['raw', 'finished', 'accessory', 'consumable'];
    $list = array_values(array_intersect($list, $allowed));
    if ($list) {
        $place = implode(',', array_fill(0, count($list), '?'));
        $sql .= " AND i.item_type IN ($place)";
        $params = array_merge($params, $list);
    }
}

$sql .= " ORDER BY i.name ASC LIMIT " . (int) $limit;

$stmt = db()->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

json_response(['ok' => true, 'count' => count($rows), 'items' => $rows]);
