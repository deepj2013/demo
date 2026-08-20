-- BoutiqueOS platform registry (multi-tenant / subdomain hosting)
CREATE DATABASE IF NOT EXISTS boutique_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE boutique_platform;

CREATE TABLE IF NOT EXISTS tenants (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  business_name VARCHAR(160) NOT NULL,
  app_name VARCHAR(120) NOT NULL DEFAULT 'Savoka',
  subdomain VARCHAR(120) NOT NULL UNIQUE,
  db_name VARCHAR(80) NOT NULL UNIQUE,
  admin_email VARCHAR(160) NOT NULL,
  contact_email VARCHAR(160) DEFAULT NULL,
  contact_phone VARCHAR(40) DEFAULT NULL,
  status ENUM('pending','active','suspended') NOT NULL DEFAULT 'active',
  settings_json JSON NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (status),
  INDEX (subdomain)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS platform_admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- password: platform123
INSERT INTO platform_admins (name, email, password)
SELECT 'Platform Admin', 'platform@savoka.local', '$2y$12$6fhYFaBLHNqGkbHNP1vwCedUlgH5PUJ3/hfA0.R3pH4LdFc0WwJDO'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM platform_admins WHERE email='platform@savoka.local');
