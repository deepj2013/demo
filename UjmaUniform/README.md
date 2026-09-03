# Ujma Uniform — Ecommerce demo

A complete uniform ecommerce for **Ujma Uniform** (Knya-style): **web store**, **iPhone shopping app**, and **admin ops** (items, inventory, orders, delivery). HTML / CSS / JS. Shared catalog lives in the browser (`localStorage`) so an item you create in Admin appears in the shop immediately.

## Open the demo

```bash
cd UjmaUniform
python3 -m http.server 8765
```

| Surface | URL |
|--------|-----|
| iPhone app + feature pitch | [http://127.0.0.1:8765](http://127.0.0.1:8765) |
| Web store | [http://127.0.0.1:8765/shop/](http://127.0.0.1:8765/shop/) |
| Admin console | [http://127.0.0.1:8765/admin/](http://127.0.0.1:8765/admin/) |

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

- **Web store** — Knya-like site: categories, colours, PDP with live warehouse qty, bag, checkout (UPI / COD / card / EMI), bulk quote.
- **iPhone app** — native-looking shop on desktop (phone frame) and full-screen on a real phone.
- **Admin** — dashboard KPIs, item master, inventory, orders, delivery board, customers, coupons, shipping settings.

Demo coupon on the app: `UJMA10`. App OTP: `1234`.

Reset catalog from **Admin → Settings → Reset demo data**.
