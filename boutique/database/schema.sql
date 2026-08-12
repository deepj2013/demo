-- BoutiqueOS Complete Database Schema
-- Import via phpMyAdmin
-- TIP for a new client: change boutique_os below to match settings.json → database.name

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS boutique_os CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE boutique_os;

-- Users / Auth
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','staff') NOT NULL DEFAULT 'staff',
  avatar VARCHAR(255) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Categories
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL UNIQUE,
  type ENUM('raw','finished','accessory','service') NOT NULL DEFAULT 'raw',
  parent_id INT UNSIGNED DEFAULT NULL,
  description TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (parent_id)
) ENGINE=InnoDB;

-- Racks / Locations
DROP TABLE IF EXISTS racks;
CREATE TABLE racks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  zone VARCHAR(80) DEFAULT NULL,
  aisle VARCHAR(40) DEFAULT NULL,
  shelf VARCHAR(40) DEFAULT NULL,
  capacity INT UNSIGNED DEFAULT 0,
  notes TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Item Master
DROP TABLE IF EXISTS items;
CREATE TABLE items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(60) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  category_id INT UNSIGNED DEFAULT NULL,
  item_type ENUM('raw','finished','accessory','consumable') NOT NULL DEFAULT 'raw',
  unit VARCHAR(30) NOT NULL DEFAULT 'pcs',
  description TEXT,
  color VARCHAR(60) DEFAULT NULL,
  size VARCHAR(40) DEFAULT NULL,
  material VARCHAR(120) DEFAULT NULL,
  brand VARCHAR(120) DEFAULT NULL,
  cost_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  sell_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  min_stock DECIMAL(12,2) NOT NULL DEFAULT 0,
  image VARCHAR(255) DEFAULT NULL,
  gallery JSON DEFAULT NULL,
  is_sellable TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (category_id),
  INDEX (item_type),
  INDEX (is_sellable),
  CONSTRAINT fk_items_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Inventory stock by rack
DROP TABLE IF EXISTS inventory;
CREATE TABLE inventory (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_id INT UNSIGNED NOT NULL,
  rack_id INT UNSIGNED DEFAULT NULL,
  qty DECIMAL(12,2) NOT NULL DEFAULT 0,
  reserved_qty DECIMAL(12,2) NOT NULL DEFAULT 0,
  batch_no VARCHAR(60) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_item_rack_batch (item_id, rack_id, batch_no),
  CONSTRAINT fk_inv_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_rack FOREIGN KEY (rack_id) REFERENCES racks(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Stock movements (in/out)
DROP TABLE IF EXISTS stock_movements;
CREATE TABLE stock_movements (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_id INT UNSIGNED NOT NULL,
  rack_id INT UNSIGNED DEFAULT NULL,
  movement_type ENUM('in','out','transfer','adjust','return') NOT NULL,
  qty DECIMAL(12,2) NOT NULL,
  unit_cost DECIMAL(12,2) DEFAULT 0,
  reference_type VARCHAR(40) DEFAULT NULL,
  reference_id INT UNSIGNED DEFAULT NULL,
  notes TEXT,
  created_by INT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (item_id),
  INDEX (movement_type),
  INDEX (created_at),
  CONSTRAINT fk_mov_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  CONSTRAINT fk_mov_rack FOREIGN KEY (rack_id) REFERENCES racks(id) ON DELETE SET NULL,
  CONSTRAINT fk_mov_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Vendors
DROP TABLE IF EXISTS vendors;
CREATE TABLE vendors (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  contact_person VARCHAR(120) DEFAULT NULL,
  email VARCHAR(160) DEFAULT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  address TEXT,
  city VARCHAR(80) DEFAULT NULL,
  gstin VARCHAR(30) DEFAULT NULL,
  payment_terms VARCHAR(120) DEFAULT NULL,
  notes TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Vendor products mapping
DROP TABLE IF EXISTS vendor_items;
CREATE TABLE vendor_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vendor_id INT UNSIGNED NOT NULL,
  item_id INT UNSIGNED NOT NULL,
  vendor_sku VARCHAR(60) DEFAULT NULL,
  last_price DECIMAL(12,2) DEFAULT 0,
  lead_time_days INT UNSIGNED DEFAULT 7,
  UNIQUE KEY uq_vendor_item (vendor_id, item_id),
  CONSTRAINT fk_vi_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  CONSTRAINT fk_vi_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Purchase / Reorder requests
DROP TABLE IF EXISTS purchase_orders;
CREATE TABLE purchase_orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  po_number VARCHAR(40) NOT NULL UNIQUE,
  vendor_id INT UNSIGNED NOT NULL,
  status ENUM('draft','ordered','partial','received','cancelled') NOT NULL DEFAULT 'draft',
  order_date DATE NOT NULL,
  expected_date DATE DEFAULT NULL,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_by INT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_po_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id),
  CONSTRAINT fk_po_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS purchase_order_items;
CREATE TABLE purchase_order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  po_id INT UNSIGNED NOT NULL,
  item_id INT UNSIGNED NOT NULL,
  qty DECIMAL(12,2) NOT NULL,
  received_qty DECIMAL(12,2) NOT NULL DEFAULT 0,
  unit_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_poi_po FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_poi_item FOREIGN KEY (item_id) REFERENCES items(id)
) ENGINE=InnoDB;

-- Customers (CRM)
DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(160) DEFAULT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  address TEXT,
  city VARCHAR(80) DEFAULT NULL,
  tags VARCHAR(255) DEFAULT NULL,
  notes TEXT,
  total_orders INT UNSIGNED NOT NULL DEFAULT 0,
  total_spent DECIMAL(12,2) NOT NULL DEFAULT 0,
  last_order_at DATETIME DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (email),
  INDEX (phone)
) ENGINE=InnoDB;

-- CRM interactions
DROP TABLE IF EXISTS customer_notes;
CREATE TABLE customer_notes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT UNSIGNED NOT NULL,
  note TEXT NOT NULL,
  created_by INT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cn_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  CONSTRAINT fk_cn_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- BOM / Recipe for finished garments (costing)
DROP TABLE IF EXISTS bom_headers;
CREATE TABLE bom_headers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  finished_item_id INT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  version VARCHAR(20) DEFAULT '1.0',
  labour_hours DECIMAL(8,2) NOT NULL DEFAULT 0,
  labour_rate DECIMAL(12,2) NOT NULL DEFAULT 0,
  overhead_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  markup_percent DECIMAL(5,2) NOT NULL DEFAULT 30,
  calculated_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  suggested_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bom_item FOREIGN KEY (finished_item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS bom_lines;
CREATE TABLE bom_lines (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  bom_id INT UNSIGNED NOT NULL,
  material_item_id INT UNSIGNED NOT NULL,
  qty DECIMAL(12,3) NOT NULL DEFAULT 1,
  waste_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  unit_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  line_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_bl_bom FOREIGN KEY (bom_id) REFERENCES bom_headers(id) ON DELETE CASCADE,
  CONSTRAINT fk_bl_item FOREIGN KEY (material_item_id) REFERENCES items(id)
) ENGINE=InnoDB;

-- Wage / labour entries
DROP TABLE IF EXISTS wage_entries;
CREATE TABLE wage_entries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  worker_name VARCHAR(120) NOT NULL,
  work_type VARCHAR(80) DEFAULT 'stitching',
  finished_item_id INT UNSIGNED DEFAULT NULL,
  bom_id INT UNSIGNED DEFAULT NULL,
  hours DECIMAL(8,2) NOT NULL DEFAULT 0,
  rate DECIMAL(12,2) NOT NULL DEFAULT 0,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  work_date DATE NOT NULL,
  notes TEXT,
  created_by INT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_we_item FOREIGN KEY (finished_item_id) REFERENCES items(id) ON DELETE SET NULL,
  CONSTRAINT fk_we_bom FOREIGN KEY (bom_id) REFERENCES bom_headers(id) ON DELETE SET NULL,
  CONSTRAINT fk_we_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Sales orders (ecommerce + counter)
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  customer_id INT UNSIGNED DEFAULT NULL,
  source ENUM('counter','online','phone') NOT NULL DEFAULT 'counter',
  status ENUM('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  payment_status ENUM('unpaid','partial','paid','refunded') NOT NULL DEFAULT 'unpaid',
  payment_method VARCHAR(40) DEFAULT NULL,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax DECIMAL(12,2) NOT NULL DEFAULT 0,
  shipping DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  shipping_address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ord_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  item_id INT UNSIGNED NOT NULL,
  qty DECIMAL(12,2) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  line_total DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_oi_item FOREIGN KEY (item_id) REFERENCES items(id)
) ENGINE=InnoDB;

-- Website CMS pages / settings
DROP TABLE IF EXISTS site_content;
CREATE TABLE site_content (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(80) NOT NULL UNIQUE,
  title VARCHAR(200) DEFAULT NULL,
  body TEXT,
  image VARCHAR(255) DEFAULT NULL,
  meta JSON DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Activity log
DROP TABLE IF EXISTS activity_log;
CREATE TABLE activity_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED DEFAULT NULL,
  action VARCHAR(80) NOT NULL,
  entity VARCHAR(80) DEFAULT NULL,
  entity_id INT UNSIGNED DEFAULT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (created_at)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- Seed admin (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@boutique.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

INSERT INTO categories (name, slug, type) VALUES
('Fabrics', 'fabrics', 'raw'),
('Threads', 'threads', 'raw'),
('Buttons & Zippers', 'buttons-zippers', 'accessory'),
('Ready Garments', 'ready-garments', 'finished'),
('Linings', 'linings', 'raw');

INSERT INTO racks (code, name, zone, aisle, shelf, capacity) VALUES
('R-A1', 'Fabric Rack A1', 'Warehouse', 'A', '1', 200),
('R-A2', 'Fabric Rack A2', 'Warehouse', 'A', '2', 200),
('R-B1', 'Accessory Bin B1', 'Warehouse', 'B', '1', 500),
('R-C1', 'Finished Stock C1', 'Showroom', 'C', '1', 100),
('R-C2', 'Finished Stock C2', 'Showroom', 'C', '2', 100);

INSERT INTO vendors (name, contact_person, email, phone, city, payment_terms) VALUES
('Silk Route Textiles', 'Ravi Kumar', 'ravi@silkroute.local', '9876500001', 'Surat', 'Net 30'),
('Button Hub', 'Meera Shah', 'meera@buttonhub.local', '9876500002', 'Mumbai', 'Net 15'),
('ThreadWorks Co', 'Anil Patel', 'anil@threadworks.local', '9876500003', 'Ahmedabad', 'COD');

INSERT INTO items (sku, name, slug, category_id, item_type, unit, description, color, cost_price, sell_price, min_stock, is_sellable) VALUES
('FAB-COT-001', 'Cotton Cambric - Ivory', 'cotton-cambric-ivory', 1, 'raw', 'meter', 'Soft cotton cambric for dresses', 'Ivory', 120.00, 0, 50, 0),
('FAB-SIL-001', 'Silk Blend - Burgundy', 'silk-blend-burgundy', 1, 'raw', 'meter', 'Premium silk blend', 'Burgundy', 450.00, 0, 20, 0),
('THR-POL-001', 'Polyester Thread - Black', 'poly-thread-black', 2, 'raw', 'spool', 'Strong poly thread', 'Black', 35.00, 0, 10, 0),
('BTN-MTL-001', 'Metal Buttons 18mm', 'metal-buttons-18mm', 3, 'accessory', 'pcs', 'Antique gold metal buttons', 'Gold', 8.00, 0, 100, 0),
('ZIP-NYL-001', 'Nylon Zipper 20cm', 'nylon-zipper-20cm', 3, 'accessory', 'pcs', 'Invisible nylon zipper', 'Black', 15.00, 0, 50, 0),
('GAR-DRS-001', 'Ivory Evening Dress', 'ivory-evening-dress', 4, 'finished', 'pcs', 'Handcrafted evening dress', 'Ivory', 0, 4999.00, 2, 1),
('GAR-BLZ-001', 'Burgundy Blouse', 'burgundy-blouse', 4, 'finished', 'pcs', 'Silk blend tailored blouse', 'Burgundy', 0, 2899.00, 3, 1);

UPDATE inventory SET qty = qty WHERE 1=0;
INSERT INTO inventory (item_id, rack_id, qty) VALUES
(1, 1, 120),
(2, 1, 45),
(3, 3, 40),
(4, 3, 350),
(5, 3, 80),
(6, 4, 8),
(7, 4, 12);

INSERT INTO customers (name, email, phone, city, tags) VALUES
('Priya Sharma', 'priya@email.com', '9988776655', 'Mumbai', 'vip,online'),
('Neha Gupta', 'neha@email.com', '9988776644', 'Pune', 'walk-in'),
('Ananya Reddy', 'ananya@email.com', '9988776633', 'Hyderabad', 'bridal');

INSERT INTO site_content (section_key, title, body) VALUES
('hero', 'Atelier Boutique', 'Bespoke garments designed and stitched with precision. Discover pieces made for you.'),
('about', 'Our Atelier', 'We design, source, and stitch every piece in-house — from fabric selection to the final hem.'),
('footer', 'Visit Us', '12 Fashion Lane, Mumbai · hello@atelierboutique.local');

-- Demo BOM for Ivory Evening Dress
INSERT INTO bom_headers (finished_item_id, name, labour_hours, labour_rate, overhead_percent, markup_percent, calculated_cost, suggested_price) VALUES
(6, 'Ivory Evening Dress BOM v1', 8.00, 150.00, 10.00, 40.00, 0, 0);

INSERT INTO bom_lines (bom_id, material_item_id, qty, waste_percent, unit_cost, line_cost) VALUES
(1, 1, 3.5, 5, 120.00, 441.00),
(1, 3, 2, 0, 35.00, 70.00),
(1, 4, 8, 0, 8.00, 64.00),
(1, 5, 1, 0, 15.00, 15.00);
