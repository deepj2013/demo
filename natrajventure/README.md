# Natraj Ventures — Multi-vertical website

One venture hub + three brand sites + one shared admin panel.

## Structure

```
natrajventure/
  index.php          → Hub (natrajventure.com)
  chai/              → Masala chai shop (cart + checkout)
  finance/           → Insurance & loans (lead forms)
  curtains/          → Motorized curtains (quote forms)
  admin/             → Single admin for all orders & leads
  data/              → JSON/CSV storage (web-blocked)
  assets/            → CSS, JS, images, logo, posters
  shared/            → PHP helpers
```

## Domains (suggested)

| Domain | Point to |
|--------|----------|
| `natrajventure.com` | `/` hub |
| chai subdomain / folder | `/chai/` |
| finance subdomain / folder | `/finance/` |
| curtains subdomain / folder | `/curtains/` |

On shared hosting you can map three domains as document roots into the three folders, and keep the hub on the main domain.

## Local run

```bash
cd natrajventure
php -S localhost:8080 router.php
```

Open:

- Hub: http://localhost:8080/
- Chai: http://localhost:8080/chai/
- Finance: http://localhost:8080/finance/
- Curtains: http://localhost:8080/curtains/
- Admin: http://localhost:8080/admin/

## Admin login

- **User ID:** `admin`
- **Password:** `Natraj@2026`

Change the hash in `data/admin.json` after first login (or replace via PHP `password_hash`).

## Data storage

Orders and leads save to:

- `data/orders.json` + `data/orders.csv`
- `data/leads.json` + `data/leads.csv`
- `data/products.json` (chai catalogue — editable in admin)

`data/.htaccess` denies public HTTP access.

## Contact (configured)

- Phone / WhatsApp: **+91 89202 72410**
- Email: **info@natrajventrues.com**
- Office: Shop no 3, Admeasuring Area, Sector 29, Leisure Valley HUDA Market, Gurugram, Haryana

## Logo

New seal logo (no black, no top half-curve, enclosed badge): `assets/img/logo/natraj-logo.jpg`  
Original reference kept at `assets/img/logo/logo-original.jpeg`.

## Notes

- Chai checkout collects customer + payment preference (COD / UPI / bank). No live payment gateway yet — suitable for MVP.
- Finance & Curtains collect leads into the same admin.
- Poster art from client WhatsApp images is under `assets/img/finance/` and `assets/img/curtains/`.
- Chai packaging shots are generated product photos under `assets/img/chai/`.
