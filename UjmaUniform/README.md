# Ujma Uniform — Ecommerce demo

A complete uniform ecommerce for **Ujma Uniform** (Knya-style): **web store**, **iPhone shopping app**, and **admin ops** (items, inventory, orders, delivery). HTML / CSS / JS. Shared catalog lives in the browser (`localStorage`) so an item you create in Admin appears in the shop immediately.

## Open the demo

```bash
cd UjmaUniform
python3 -m http.server 8765
```

Every URL opens as an **iPhone app** (phone frame on desktop, full-screen on a real phone).

| Surface | URL |
|--------|-----|
| Shop app | [http://127.0.0.1:8765](http://127.0.0.1:8765) |
| Store app | [http://127.0.0.1:8765/shop/](http://127.0.0.1:8765/shop/) |
| Ops admin app | [http://127.0.0.1:8765/admin/](http://127.0.0.1:8765/admin/) |

**Admin login:** `admin` / `ujma123`

## How to demonstrate ops

1. **Admin → Items / products** — Create a style (name, SKU, colours, sizes, photo upload or URL, sell price). Tick *Publish on web store*. Save.
2. Open **Web store** — the new item is in the catalog.
3. **Admin → Inventory upload**
   - Receive stock (GRN): pick item, colour, size, qty in.
   - Or paste CSV: `SKU,Name,Color,Size,Qty`
   - Low-stock SKUs (under 8) are highlighted. `+` / `−` / `+10` adjust on hand.
4. Buy on the **store or app** (checkout).
5. **Admin → Orders** — new order is `pending`. Confirm → pack.
6. **Admin → Delivery** — assign Delhivery / BlueDart / Dunzo / Ujma Rider + AWB → In transit → Out for delivery → Delivered. Cancel restocks inventory.
7. B2B quote form on the store lands in **Admin → B2B quotes**.

## Surfaces

- **Shop app** — customer shopping (home, catalog, bag, account).
- **Store app** — same catalog in a store tab bar (Home / Shop / Bag / B2B).
- **Ops admin app** — items, stock, orders, delivery (Home / Items / Stock / Orders / More).

Demo coupon on the app: `UJMA10`. App OTP: `1234`.

Reset catalog from **Admin → Settings → Reset demo data**.
