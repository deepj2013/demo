# Savoka Host

Multi-tenant boutique platform by **Savoka**: each client enrolls with their data, gets an **isolated MySQL database**, and runs on **`{slug}.yourdomain.com`**.

**Feature map:** [`FEATURES.md`](FEATURES.md) · **Deploy:** [`DEPLOY.md`](DEPLOY.md) · **Client handoff:** [`CLIENT-HANDOFF.md`](CLIENT-HANDOFF.md)

## Local run (working now)

```bash
./bin/local-setup.sh
# or: PORT=8080 ./bin/local-setup.sh
```

| URL | Purpose |
|-----|---------|
| http://localhost:8080/ | Host landing + live boutiques |
| http://localhost:8080/enroll/ | **Enroll client** (brand, modules, admin, subdomain) |
| http://localhost:8080/platform/ | Platform console (`platform@savoka.local` / `platform123`) |
| http://atelier.localhost:8080/admin/login.php | Default demo admin (`admin@boutique.local` / `admin123`) |
| http://atelier.localhost:8080/shop/ | Default shopfront |
| http://minivibe.localhost:8080/ | Example second enrolled client |

`*.localhost` resolves to 127.0.0.1 on modern macOS/browsers — no `/etc/hosts` needed.

## What enrollment creates

1. Subdomain slug (e.g. `minivibe` → `minivibe.localhost:8080`)
2. Private DB `boutique_{slug}` + schema (+ optional demo seed)
3. Admin user for that boutique
4. Settings file `clients/tenants/{slug}.settings.json`
5. Registry row in `boutique_platform.tenants`

Themes (Light/Dark/Warm) and INR formatting work inside each tenant admin.

## Requirements

- PHP 8.0+ (pdo_mysql, fileinfo, json; intl recommended)
- MySQL 5.7+ / MariaDB running locally (`root` with no password by default — edit `platform.json`)

## Production subdomain tip

Point `*.yourdomain.com` to the same app. Set `platform.json` → `base_domain` to `yourdomain.com` and use HTTPS + a real DB user.

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
