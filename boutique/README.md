# BoutiqueOS

Complete boutique ecosystem: Item Master, Inventory + Racks, BOM Costing, Vendors, CRM, Reports, Ecommerce, and Public website.

**White-label:** same code for every client — configure via `settings.json` or `/install/` wizard. See **CLIENT-HANDOFF.md**.

## Requirements

- PHP 8.0+ (PDO MySQL, fileinfo, json)
- MySQL 5.7+ / MariaDB (phpMyAdmin OK)

## Quick setup (first client)

1. Import `database/schema.sql` in phpMyAdmin
2. Open `/install/` — set brand, modules, DB credentials — Save
3. Login: `admin@boutique.local` / `admin123` (turn off demo hint for real clients)

| URL | Purpose |
|-----|---------|
| `/install/` | Client / brand setup wizard |
| `/admin/login.php` | Admin panel |
| `/shop/` | Public ecommerce |
| `/public/` | Marketing site (if ecommerce off) |

## Give to another boutique

1. Copy folder to new host
2. Open `/install/` — load preset or edit names / colours / modules / DB
3. Import SQL into that client’s database
4. Done

Details: **CLIENT-HANDOFF.md** · Presets in **clients/**

## Plug & play modules

```json
"modules": {
  "inventory": true,
  "items": true,
  "racks": true,
  "costing": false,
  "vendors": false,
  "crm": false,
  "reports": true,
  "ecommerce": true,
  "website": true
}
```

Disabled modules hide from nav and block direct access.

## Folder map

```
settings.json        ← client config (brand, DB, modules)
clients/             ← templates & presets
install/             ← visual setup wizard
CLIENT-HANDOFF.md    ← handoff checklist
admin/ shop/ public/ assets/ config/ database/
```

## Security for production

- Change admin password immediately
- Set `admin.show_demo_hint` to `false`
- Optional env vars: `BOUTIQUE_DB_HOST`, `BOUTIQUE_DB_NAME`, `BOUTIQUE_DB_USER`, `BOUTIQUE_DB_PASS`
- Use HTTPS
