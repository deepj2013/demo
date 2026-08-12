# Jyoti Mandir — Astrology Software

Professional Jyotish workspace: phone login, personal dashboards, MySQL/SQLite auto-schema, multi-ayanamsa charts, SVG North/South/Western styles, deep Vimshottari, matching doshas, and enriched Panchang.

## Run

```bash
cd "/Volumes/Data/New Client /JyotiMandir-Astrology"
php -S localhost:8080
```

- App: http://localhost:8080/app/
- Login: any 10-digit Indian mobile + password `543210`

## Database (auto-created)

Configured in `config/database.php`.

1. **MySQL** (preferred for phpMyAdmin) — if MySQL is running, the app creates database `jyotimandir` and all tables automatically.
2. **SQLite fallback** — `data/jyotimandir.sqlite` if MySQL is unreachable.

Env overrides: `JM_DB_HOST`, `JM_DB_USER`, `JM_DB_PASS`, `JM_DB_NAME`, `JM_DB_DRIVER` (`auto`|`mysql`|`sqlite`).

## Ephemeris

- Uses **Swiss Ephemeris CLI (`swetest`)** when installed (`JM_SWETEST` or `bin/swetest`).
- Otherwise **PHP model v2** (improved offline engine).
- Check: `api/index.php?action=engine_status`

## Phase 1 features

| Area | Status |
|------|--------|
| Login + personal dashboard | Working |
| Ayanamsa (Lahiri, Raman, KP, Fagan, Tropical) | Working |
| House systems (Whole Sign, Equal, Sripati, Placidus*, Koch*) | Working |
| Chart styles SVG (South / North / Western) | Working |
| D1 + D9 Navamsa | Working |
| Vimshottari Maha + Antar + Pratyantar | Working |
| Manglik / Kaal Sarpa / Pitri / Nadi dosha | Working |
| Panchang + sunrise/set, Rahu/Yamaganda/Gulika/Abhijit | Working |
| Dark / light theme | Working |
| Desktop full-screen + mobile app shell | Working |

\*Placidus/Koch currently use equal-cusp approximation until Swiss house cusps are available via `swetest`.

## Next phases (not yet)

- Google Places + TimeZoneDB geocoding
- Vargas D2–D60, Ashtakavarga, Shadbala
- Ashtottari / Yogini / Chara dasha
- Split-screen transit workspace + PDF reports
- Full 7-language UI packs

## Stack

PHP · MySQL/SQLite · HTML · CSS · JS
