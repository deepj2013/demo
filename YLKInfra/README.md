# YLK Infra Private Limited

Marketing website + inventory admin for **YLK Infra Private Limited**, Bareilly. Builder, constructor and seller of plots, flats, villas, houses, office space, new construction, renovation, affordable housing and Delhi NCR land search.

Inspired by Landor / Treetopia / luxury farmhouse landing pages. On a phone it installs and behaves like an app (PWA). Inventory is **AES-GCM encoded** in `assets/js/vault.enc.js` — not a readable JSON file in the browser.

## Open locally

Serve the folder over HTTP (Web Crypto will not run from `file://`):

```bash
cd YLKInfra
python3 -m http.server 8787
```

Then:

- Public site: http://127.0.0.1:8787/
- Admin: http://127.0.0.1:8787/admin/

## Admin

- Username: `admin`
- Password: `YlkInfra@2030`

Change both before handing to the client (`tools/catalog.mjs` → `auth`, then `npm`/`node tools/encrypt-vault.mjs`).

Admin can create/edit listings, mark **Available / Booked / Sold out**, and see WhatsApp bookings (name, number, email). Public pages read the same catalog plus this browser’s overlay.

## WhatsApp bookings

Every enquire form opens WhatsApp to **+91 94125 02030** with the lead text, and stores the lead for admin.

## Rebuild encrypted vault

```bash
node tools/encrypt-vault.mjs
node tools/generate-pages.mjs
```

`tools/` and the catalog source are build-only. Do not link them from HTML.

## Languages

English / हिन्दी toggle in the header. More locales can be added in `assets/js/i18n.js`.

## Deploy

Upload the `YLKInfra` folder to any static host. Prefer HTTPS. Add the site to the phone home screen for the app shell.
