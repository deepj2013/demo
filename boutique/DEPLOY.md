# Savoka — Production deploy guide

Savoka is plain PHP + MySQL. Upload the folder to any PHP 8 host (cPanel, VPS, Cloudways, etc.) and it will run the same as local — including multi-tenant subdomains.

## 1. Server requirements

- PHP **8.0+** with extensions: `pdo_mysql`, `json`, `mbstring`, `fileinfo` (intl recommended)
- MySQL **5.7+** / MariaDB
- Apache with `mod_rewrite` **or** Nginx + PHP-FPM
- HTTPS certificate (Let’s Encrypt)
- Ability to create MySQL databases (or one shared DB user that can `CREATE DATABASE`)

## 2. Upload

1. Zip the project (exclude `.DS_Store`, local logs).
2. Upload to document root, e.g. `public_html/savoka/` or the domain root.
3. Ensure these are **writable** by the web user:
   - `settings.json`
   - `platform.json`
   - `clients/tenants/`
   - `assets/uploads/` (and subfolders `brand`, `products`, `hero`)

```bash
chmod -R 775 clients/tenants assets/uploads
chmod 664 settings.json platform.json
```

## 3. Configure platform (`platform.json`)

Edit on the server:

```json
{
  "platform_name": "Savoka Host",
  "base_domain": "yourdomain.com",
  "local_port": 443,
  "database": {
    "host": "127.0.0.1",
    "name": "boutique_platform",
    "user": "YOUR_DB_USER",
    "pass": "YOUR_DB_PASSWORD",
    "charset": "utf8mb4"
  }
}
```

- `base_domain` = your real domain (e.g. `savoka.app` or `yourbrand.com`)
- Platform DB credentials must be able to create per-client DBs (`boutique_slug`) **or** pre-create DBs manually

## 4. Import platform DB

In phpMyAdmin / CLI:

```bash
mysql -u USER -p < database/platform.sql
```

Then set platform password:

- Login: `platform@savoka.local` (change email in DB if you want)
- Password: set via Platform console after first login, or reset with:

```sql
-- password: platform123 (change immediately)
UPDATE boutique_platform.platform_admins
SET password = '$2y$12$6fhYFaBLHNqGkbHNP1vwCedUlgH5PUJ3/hfA0.R3pH4LdFc0WwJDO'
WHERE email = 'platform@savoka.local';
```

## 5. DNS for subdomains (critical)

Point **wildcard** DNS to your server:

| Type | Host | Value |
|------|------|--------|
| A | `@` | server IP |
| A | `*` | server IP |

Then every enrolled client is:

`https://{slug}.yourdomain.com`

Apache vhost example (one catch-all):

```apache
<VirtualHost *:443>
  ServerName yourdomain.com
  ServerAlias *.yourdomain.com
  DocumentRoot /var/www/savoka
  <Directory /var/www/savoka>
    AllowOverride All
    Require all granted
  </Directory>
  # SSL cert for yourdomain.com + *.yourdomain.com
</VirtualHost>
```

Nginx: use `server_name yourdomain.com *.yourdomain.com;` pointing to the same root.

## 6. Enroll clients on production

1. Open `https://yourdomain.com/enroll/`
2. Fill boutique data → system creates DB + settings + subdomain
3. Open `https://{slug}.yourdomain.com/admin/login.php`

Or use Platform console: `https://yourdomain.com/platform/`

## 7. Security checklist (before go-live)

- [ ] Change platform admin password
- [ ] Change each boutique admin password
- [ ] Set `admin.show_demo_hint` to `false` in tenant settings
- [ ] Use strong MySQL passwords (not empty root)
- [ ] Force HTTPS
- [ ] Don’t expose `/config/`, `/database/`, `/includes/` (`.htaccess` already blocks some)
- [ ] Backup `boutique_platform` + each `boutique_*` DB daily

## 8. Optional: env overrides

You can override a single-tenant DB with env vars:

- `BOUTIQUE_DB_HOST`
- `BOUTIQUE_DB_NAME`
- `BOUTIQUE_DB_USER`
- `BOUTIQUE_DB_PASS`

Multi-tenant mode still uses each tenant’s settings / platform registry.

## 9. What works the same as local

| Feature | Production |
|---------|------------|
| Enroll client → own DB | Yes |
| Subdomain admin + shop | Yes (with wildcard DNS) |
| Item / Category / Rack / Vendor masters | Yes |
| Inventory, BOM, Orders, Reports | Yes |
| Themes Light / Dark / Warm | Yes |
| INR formatting | Yes |
| File uploads (logo, products) | Yes (writable uploads dir) |

## Quick local reminder

```bash
./bin/local-setup.sh
# http://localhost:8080/  ·  http://demo.localhost:8080/admin/login.php
```
