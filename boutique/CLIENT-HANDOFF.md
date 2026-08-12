# Hand off BoutiqueOS to another client

Same codebase. **Only change config** — do not fork the PHP for each boutique.

## Fast path (5 minutes)

1. **Copy** the project folder (or zip) to the new hosting / subdomain.
2. Open **`/install/`** in the browser.
3. Either:
   - **Load a preset** from the dropdown (`preset-full` or `preset-inventory-shop`), then edit names/colours, **or**
   - Fill brand + modules + database fields from scratch.
4. In phpMyAdmin: create DB (name you set in setup) → import **`database/schema.sql`**  
   (edit the `CREATE DATABASE` / `USE` lines at the top of the SQL if the DB name differs).
5. Login → change password → upload logo under **Website & client brand**.

Done. Shop and admin show the new brand automatically.

## What to change per client

| Change | Where |
|--------|--------|
| Business name, tagline, colours, logo | `/install/` or `settings.json` or Admin → Website |
| Which features (inventory only, +shop, full) | `modules` in setup / `settings.json` |
| DB host/name/user/pass | `settings.json` → `database` (or install wizard) |
| Currency / timezone / tax / shipping | `settings.json` |
| Contact, WhatsApp, Instagram | `settings.json` → `contact` |
| PWA app name / colours | Auto from settings via `manifest.php` |

You almost never need to edit PHP files.

## Presets included

| File | Use when |
|------|----------|
| `clients/_template.settings.json` | Blank new client |
| `clients/preset-full.json` | Full atelier (BOM, vendors, CRM, shop) |
| `clients/preset-inventory-shop.json` | Only inventory + racks + ecommerce + website |

To make your own preset: copy a working `settings.json` into `clients/my-client.json` (remove secrets if sharing).

## Manual (no wizard)

```bash
cp clients/_template.settings.json settings.json
# edit settings.json — business_name, database.name, modules, theme
```

Import SQL → open `/admin/login.php`.

## One folder, many clients?

Recommended: **one copy of the app per client** (separate folder or subdomain), each with its own `settings.json` + database. That keeps data and branding isolated and is the simplest to support.

## After handoff checklist

- [ ] `setup_complete: true` in settings  
- [ ] Demo hint OFF (`admin.show_demo_hint: false`)  
- [ ] Admin password changed  
- [ ] Logo uploaded  
- [ ] Modules match what they paid for  
- [ ] Shop link works if ecommerce is ON  

## Re-open setup later

Visit **`/install/`** anytime (also linked from login and Website admin) to switch brand/modules for that install.
