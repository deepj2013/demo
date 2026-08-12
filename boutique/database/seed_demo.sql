-- Extra demo seed for BoutiqueOS (run AFTER schema.sql)
USE boutique_os;

-- More categories
INSERT IGNORE INTO categories (id, name, slug, type) VALUES
(6, 'Embellishments', 'embellishments', 'accessory'),
(7, 'Packaging', 'packaging', 'consumable');

-- More racks
INSERT IGNORE INTO racks (id, code, name, zone, aisle, shelf, capacity) VALUES
(6, 'R-D1', 'Cutting Table Stock', 'Production', 'D', '1', 80),
(7, 'R-E1', 'Returns Bin', 'Backroom', 'E', '1', 40);

-- More items
INSERT INTO items (sku, name, slug, category_id, item_type, unit, description, color, size, material, cost_price, sell_price, min_stock, is_sellable, is_active)
SELECT 'FAB-LIN-001', 'Linen Blend - Sand', 'linen-blend-sand', 1, 'raw', 'meter', 'Breathable linen for summer sets', 'Sand', NULL, 'Linen', 280.00, 0, 30, 0, 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM items WHERE sku='FAB-LIN-001');

INSERT INTO items (sku, name, slug, category_id, item_type, unit, description, color, size, material, cost_price, sell_price, min_stock, is_sellable, is_active)
SELECT 'FAB-CHI-001', 'Chiffon - Blush', 'chiffon-blush', 1, 'raw', 'meter', 'Soft chiffon for overlays', 'Blush', NULL, 'Polyester', 190.00, 0, 25, 0, 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM items WHERE sku='FAB-CHI-001');

INSERT INTO items (sku, name, slug, category_id, item_type, unit, description, color, cost_price, sell_price, min_stock, is_sellable, is_active)
SELECT 'THR-SIL-001', 'Silk Thread - Ivory', 'silk-thread-ivory', 2, 'raw', 'spool', 'Fine silk thread', 'Ivory', 55.00, 0, 8, 0, 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM items WHERE sku='THR-SIL-001');

INSERT INTO items (sku, name, slug, category_id, item_type, unit, description, color, size, cost_price, sell_price, min_stock, is_sellable, is_active)
SELECT 'GAR-SET-001', 'Sand Linen Co-ord Set', 'sand-linen-coord', 4, 'finished', 'pcs', 'Matching top & pant in sand linen', 'Sand', 'M', 0, 3499.00, 2, 1, 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM items WHERE sku='GAR-SET-001');

INSERT INTO items (sku, name, slug, category_id, item_type, unit, description, color, size, cost_price, sell_price, min_stock, is_sellable, is_active)
SELECT 'GAR-KUR-001', 'Blush Chiffon Kurta', 'blush-chiffon-kurta', 4, 'finished', 'pcs', 'Flowy kurta with chiffon overlay', 'Blush', 'L', 0, 2599.00, 3, 1, 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM items WHERE sku='GAR-KUR-001');

INSERT INTO items (sku, name, slug, category_id, item_type, unit, description, color, cost_price, sell_price, min_stock, is_sellable, is_active)
SELECT 'PKG-BOX-001', 'Gift Box Medium', 'gift-box-medium', 7, 'consumable', 'pcs', 'Branded gift packaging', 'Ivory', 45.00, 0, 20, 0, 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM items WHERE sku='PKG-BOX-001');

-- Stock
INSERT INTO inventory (item_id, rack_id, qty)
SELECT i.id, 2, 60 FROM items i WHERE i.sku='FAB-LIN-001' AND NOT EXISTS (SELECT 1 FROM inventory WHERE item_id=i.id AND rack_id=2);

INSERT INTO inventory (item_id, rack_id, qty)
SELECT i.id, 1, 40 FROM items i WHERE i.sku='FAB-CHI-001' AND NOT EXISTS (SELECT 1 FROM inventory WHERE item_id=i.id AND rack_id=1);

INSERT INTO inventory (item_id, rack_id, qty)
SELECT i.id, 3, 6 FROM items i WHERE i.sku='THR-SIL-001' AND NOT EXISTS (SELECT 1 FROM inventory WHERE item_id=i.id AND rack_id=3);

INSERT INTO inventory (item_id, rack_id, qty)
SELECT i.id, 4, 5 FROM items i WHERE i.sku='GAR-SET-001' AND NOT EXISTS (SELECT 1 FROM inventory WHERE item_id=i.id AND rack_id=4);

INSERT INTO inventory (item_id, rack_id, qty)
SELECT i.id, 5, 7 FROM items i WHERE i.sku='GAR-KUR-001' AND NOT EXISTS (SELECT 1 FROM inventory WHERE item_id=i.id AND rack_id=5);

INSERT INTO inventory (item_id, rack_id, qty)
SELECT i.id, 3, 15 FROM items i WHERE i.sku='PKG-BOX-001' AND NOT EXISTS (SELECT 1 FROM inventory WHERE item_id=i.id AND rack_id=3);

-- Vendor links
INSERT IGNORE INTO vendor_items (vendor_id, item_id, vendor_sku, last_price, lead_time_days)
SELECT 1, i.id, 'SR-LIN-SAND', 280, 5 FROM items i WHERE i.sku='FAB-LIN-001';

INSERT IGNORE INTO vendor_items (vendor_id, item_id, vendor_sku, last_price, lead_time_days)
SELECT 1, i.id, 'SR-CHI-BLUSH', 190, 7 FROM items i WHERE i.sku='FAB-CHI-001';

INSERT IGNORE INTO vendor_items (vendor_id, item_id, vendor_sku, last_price, lead_time_days)
SELECT 3, i.id, 'TW-SILK-IV', 55, 3 FROM items i WHERE i.sku='THR-SIL-001';

-- BOM for Sand Linen Co-ord
INSERT INTO bom_headers (finished_item_id, name, labour_hours, labour_rate, overhead_percent, markup_percent, calculated_cost, suggested_price, is_active)
SELECT i.id, 'Sand Linen Co-ord BOM v1', 6.0, 160.00, 8.00, 45.00, 0, 0, 1
FROM items i WHERE i.sku='GAR-SET-001'
AND NOT EXISTS (SELECT 1 FROM bom_headers b WHERE b.finished_item_id=i.id);

INSERT INTO bom_lines (bom_id, material_item_id, qty, waste_percent, unit_cost, line_cost)
SELECT b.id, m.id, 4.0, 8, m.cost_price, 0
FROM bom_headers b
JOIN items f ON f.id=b.finished_item_id AND f.sku='GAR-SET-001'
JOIN items m ON m.sku='FAB-LIN-001'
WHERE NOT EXISTS (SELECT 1 FROM bom_lines l WHERE l.bom_id=b.id AND l.material_item_id=m.id);

INSERT INTO bom_lines (bom_id, material_item_id, qty, waste_percent, unit_cost, line_cost)
SELECT b.id, m.id, 2, 0, m.cost_price, 0
FROM bom_headers b
JOIN items f ON f.id=b.finished_item_id AND f.sku='GAR-SET-001'
JOIN items m ON m.sku='THR-POL-001'
WHERE NOT EXISTS (SELECT 1 FROM bom_lines l WHERE l.bom_id=b.id AND l.material_item_id=m.id);

INSERT INTO bom_lines (bom_id, material_item_id, qty, waste_percent, unit_cost, line_cost)
SELECT b.id, m.id, 6, 0, m.cost_price, 0
FROM bom_headers b
JOIN items f ON f.id=b.finished_item_id AND f.sku='GAR-SET-001'
JOIN items m ON m.sku='BTN-MTL-001'
WHERE NOT EXISTS (SELECT 1 FROM bom_lines l WHERE l.bom_id=b.id AND l.material_item_id=m.id);

-- Wages
INSERT INTO wage_entries (worker_name, work_type, finished_item_id, hours, rate, amount, work_date, notes)
SELECT 'Sunita Devi', 'stitching', i.id, 6, 160, 960, CURDATE() - INTERVAL 2 DAY, 'Co-ord set batch'
FROM items i WHERE i.sku='GAR-SET-001'
AND NOT EXISTS (SELECT 1 FROM wage_entries WHERE worker_name='Sunita Devi' AND notes='Co-ord set batch');

INSERT INTO wage_entries (worker_name, work_type, finished_item_id, hours, rate, amount, work_date, notes)
SELECT 'Ramesh Tailor', 'cutting', i.id, 2, 140, 280, CURDATE() - INTERVAL 3 DAY, 'Pattern cut'
FROM items i WHERE i.sku='GAR-DRS-001'
AND NOT EXISTS (SELECT 1 FROM wage_entries WHERE worker_name='Ramesh Tailor' AND notes='Pattern cut');

INSERT INTO wage_entries (worker_name, work_type, finished_item_id, hours, rate, amount, work_date, notes)
SELECT 'Fatima Begum', 'embroidery', i.id, 4, 180, 720, CURDATE() - INTERVAL 1 DAY, 'Neckline work'
FROM items i WHERE i.sku='GAR-KUR-001'
AND NOT EXISTS (SELECT 1 FROM wage_entries WHERE worker_name='Fatima Begum' AND notes='Neckline work');

-- Customers
INSERT INTO customers (name, email, phone, city, tags, total_orders, total_spent, last_order_at)
SELECT 'Kavya Iyer', 'kavya@email.com', '9988776622', 'Bengaluru', 'online,repeat', 0, 0, NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email='kavya@email.com');

INSERT INTO customers (name, email, phone, city, tags, notes)
SELECT 'Meera Kapoor', 'meera.k@email.com', '9988776611', 'Delhi', 'vip,bridal', 'Prefers ivory & blush tones'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email='meera.k@email.com');

INSERT INTO customer_notes (customer_id, note, created_by)
SELECT c.id, 'Interested in custom bridal measurements next month.', 1
FROM customers c WHERE c.email='meera.k@email.com'
AND NOT EXISTS (SELECT 1 FROM customer_notes n WHERE n.customer_id=c.id);

-- Orders
INSERT INTO orders (order_number, customer_id, source, status, payment_status, payment_method, subtotal, tax, shipping, total, shipping_address, created_at)
SELECT 'ON260803-0001', c.id, 'online', 'delivered', 'paid', 'cod', 4999, 249.95, 50, 5298.95, '12 Marine Drive, Mumbai', NOW() - INTERVAL 8 DAY
FROM customers c WHERE c.email='priya@email.com'
AND NOT EXISTS (SELECT 1 FROM orders WHERE order_number='ON260803-0001');

INSERT INTO order_items (order_id, item_id, qty, unit_price, line_total)
SELECT o.id, i.id, 1, 4999, 4999
FROM orders o JOIN items i ON i.sku='GAR-DRS-001'
WHERE o.order_number='ON260803-0001'
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id=o.id);

INSERT INTO orders (order_number, customer_id, source, status, payment_status, payment_method, subtotal, tax, shipping, total, shipping_address, created_at)
SELECT 'ON260803-0002', c.id, 'online', 'confirmed', 'paid', 'upi', 3499, 174.95, 50, 3723.95, '45 MG Road, Bengaluru', NOW() - INTERVAL 2 DAY
FROM customers c WHERE c.email='kavya@email.com'
AND NOT EXISTS (SELECT 1 FROM orders WHERE order_number='ON260803-0002');

INSERT INTO order_items (order_id, item_id, qty, unit_price, line_total)
SELECT o.id, i.id, 1, 3499, 3499
FROM orders o JOIN items i ON i.sku='GAR-SET-001'
WHERE o.order_number='ON260803-0002'
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id=o.id);

INSERT INTO orders (order_number, customer_id, source, status, payment_status, payment_method, subtotal, tax, shipping, total, shipping_address, created_at)
SELECT 'ON260803-0003', c.id, 'counter', 'pending', 'unpaid', 'cod', 2599, 129.95, 0, 2728.95, 'Store pickup', NOW() - INTERVAL 1 DAY
FROM customers c WHERE c.email='neha@email.com'
AND NOT EXISTS (SELECT 1 FROM orders WHERE order_number='ON260803-0003');

INSERT INTO order_items (order_id, item_id, qty, unit_price, line_total)
SELECT o.id, i.id, 1, 2599, 2599
FROM orders o JOIN items i ON i.sku='GAR-KUR-001'
WHERE o.order_number='ON260803-0003'
AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id=o.id);

-- Stock movements
INSERT INTO stock_movements (item_id, rack_id, movement_type, qty, unit_cost, notes, created_by, created_at)
SELECT i.id, 1, 'in', 50, 120, 'Opening stock fabric', 1, NOW() - INTERVAL 10 DAY
FROM items i WHERE i.sku='FAB-COT-001'
AND NOT EXISTS (SELECT 1 FROM stock_movements WHERE notes='Opening stock fabric');

INSERT INTO stock_movements (item_id, rack_id, movement_type, qty, unit_cost, notes, created_by, created_at)
SELECT i.id, 4, 'out', 1, 0, 'Sold evening dress', 1, NOW() - INTERVAL 8 DAY
FROM items i WHERE i.sku='GAR-DRS-001'
AND NOT EXISTS (SELECT 1 FROM stock_movements WHERE notes='Sold evening dress');

-- Purchase order
INSERT INTO purchase_orders (po_number, vendor_id, status, order_date, expected_date, subtotal, tax, total, notes, created_by)
SELECT 'PO260803-0001', 1, 'ordered', CURDATE() - INTERVAL 1 DAY, CURDATE() + INTERVAL 5 DAY, 5600, 280, 5880, 'Reorder linen + chiffon', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM purchase_orders WHERE po_number='PO260803-0001');

INSERT INTO purchase_order_items (po_id, item_id, qty, unit_cost)
SELECT p.id, i.id, 20, 280
FROM purchase_orders p JOIN items i ON i.sku='FAB-LIN-001'
WHERE p.po_number='PO260803-0001'
AND NOT EXISTS (SELECT 1 FROM purchase_order_items poi WHERE poi.po_id=p.id AND poi.item_id=i.id);

-- Sync customer stats from orders
UPDATE customers c
JOIN (
  SELECT customer_id, COUNT(*) AS cnt, SUM(total) AS spent, MAX(created_at) AS last_at
  FROM orders WHERE customer_id IS NOT NULL GROUP BY customer_id
) o ON o.customer_id = c.id
SET c.total_orders = o.cnt, c.total_spent = o.spent, c.last_order_at = o.last_at;
