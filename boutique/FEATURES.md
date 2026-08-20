# BoutiqueOS — Complete Feature Map

Ecommerce + Inventory system for boutiques (INR). Themes: **Light** · **Dark** · **Warm**.

---

## 1. Feature list (end-to-end)

### A. Admin dashboard (Savoka-style)
| Feature | Purpose |
|---------|---------|
| Overview KPIs | Orders, customers, revenue (₹), returning buyers, low stock |
| Period filter | Today / This week / This month / This quarter / This year |
| Revenue insights chart | Monthly/yearly earnings, sales, refunds |
| Sales vs target gauge | Progress toward monthly target |
| Recent sales table | Search, category, status filters |
| Theme switcher | Light / Dark / Warm (persisted) |
| Global search | Jump to items, orders, customers, vendors |
| Module nav | Only enabled modules appear |

### B. Inventory core
| Master / screen | Fields & actions |
|-----------------|------------------|
| **Item Master** | SKU, name, type (raw / finished / accessory / consumable), category, unit, color, size, material, brand, cost, sell, min stock, image, sellable flag |
| Raw vs finished | Separate tabs/filters; finished can be shop-listed; raw used in BOM |
| **Rack Master** | Code, name, zone, aisle, shelf, capacity, notes, active |
| **Inventory** | Stock by item×rack, adjust in/out/transfer, batch, movements log |
| **Vendor Master** | Name, contact, email, phone, address, city, GSTIN, payment terms |
| Vendor ↔ products | Map vendor SKU, last price, lead time |
| **Purchases (PO)** | Draft → ordered → partial → received; receive into racks |
| Low-stock alerts | Items below `min_stock` |

### C. Production / costing
| Feature | Flow |
|---------|------|
| BOM / Recipe | Finished item ← materials (qty + waste %) + labour + overhead + markup |
| Cost calculate | Material + labour + overhead → suggested sell price (₹) |
| Wages | Worker, work type, hours, rate, link to finished item/BOM |
| Raw → finished | Buy/stock raw → BOM consume logic via costing → sell finished |

### D. CRM & orders
| Feature | Purpose |
|---------|---------|
| Customers | Profile, tags, notes, order history, lifetime spend |
| Orders | Counter / online / phone; status & payment lifecycle |
| Shop products | Mark finished items sellable, prices, images for storefront |

### E. Ecommerce storefront
| Screen | Contents |
|--------|----------|
| Home | Full-bleed hero, featured collection, categories, trust strip |
| Collection | Grid of finished sellable items (₹), filters |
| Product detail | Gallery, variants (color/size), add to bag |
| Cart + checkout | COD / UPI note, tax + shipping from settings, INR totals |
| Order confirmation | Order number visible in Admin → Orders |

### F. Reports (multi-period)
| Report | Periods | Variants |
|--------|---------|----------|
| Sales summary | Daily / Weekly / Monthly / Quarterly / Custom | By source, status, payment |
| Revenue trend | Same | Chart + table export view |
| Inventory valuation | Snapshot | By category, rack, item type |
| Low stock / reorder | Snapshot | By vendor lead time |
| Purchase summary | Period | By vendor, status |
| Wage / labour | Period | By worker, work type |
| Top products | Period | Qty sold, revenue |
| Customer activity | Period | New vs returning, spend |

### G. Website / brand CMS
Hero slides, about, footer, logo, contact, theme colours, module toggles via install/settings.

### H. Platform
Login/roles, CSRF, PWA, white-label `settings.json`, install wizard, INR (`en-IN`) money format.

---

## 2. User flows (happy path)

```
SETUP
  Install wizard → brand + modules + DB → import schema → login

RAW MATERIAL CYCLE
  Vendor Master → link products → Purchase Order → Receive to Rack
  → Item Master (raw) stock increases → Inventory movements

FINISHED PRODUCT CYCLE
  Item Master (finished) → Costing/BOM (attach raw materials)
  → Calculate cost & price → optional Wage entry
  → Stock finished on showroom rack → mark Sellable

SELL (COUNTER / ONLINE)
  Shop or Orders → customer + line items → payment status
  → (optional) stock out on fulfil → Reports update

REPORTING
  Reports → pick period (D/W/M/Q) → pick variant → review KPIs/tables
```

---

## 3. Screen map (admin)

1. Dashboard · 2. Item Master · 3. Inventory · 4. Racks · 5. Costing/BOM · 6. Wages  
7. Vendors · 8. Purchases · 9. Customers · 10. Orders · 11. Shop products  
12. Reports · 13. Website & brand  

Storefront: Home · Product · Cart/Checkout

---

## 4. Theme tokens

| Mode | Feel |
|------|------|
| Light | Savoka — white surfaces, `#2563EB` accent, soft grey `#F4F6FB` |
| Dark | Deep slate surfaces, bright blue accent, high-contrast text |
| Warm | Soft sand surfaces, ink primary, bronze accent (atelier) |

Currency: always **INR** with Indian grouping (`₹1,23,456.78`).
