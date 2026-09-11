import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const pages = [
  { file: "index.html", page: "home", title: "YLK Infra Private Limited | Plots, Flats, Villas & Construction in Bareilly & Delhi NCR", desc: "Bareilly builder, constructor and seller. Plots, flats, villas, houses, office space, renovation, new construction, affordable housing and land across Delhi NCR. Book on WhatsApp +91 94125 02030." },
  { file: "inventory.html", page: "inventory", title: "Live Inventory | Available, Booked & Sold Out | YLK Infra", desc: "See YLK Infra live inventory — plots, flats, villas, houses and offices. Available, booked and sold-out stock updated by admin." },
  { file: "property.html", page: "property", title: "Property details | YLK Infra", desc: "Brochure, map, documents and WhatsApp booking for YLK Infra listings in Bareilly and Delhi NCR." },
  { file: "plots.html", page: "plots", title: "NA Plots for Sale in Bareilly, Yamuna Expressway & NCR | YLK Infra", desc: "Gated NA plots in Bareilly, Greater Noida and Jewar corridor. 7/12, layout map and brochure. Book with YLK Infra." },
  { file: "flats.html", page: "flats", title: "Flats & Apartments in Bareilly, Noida & Lucknow | YLK Infra", desc: "2, 3 and 4 BHK flats plus a Bareilly penthouse. Live availability and WhatsApp booking." },
  { file: "villas.html", page: "villas", title: "Villas & Farmhouses | Bareilly & NCR | YLK Infra", desc: "Garden villas on Pilibhit Road and Aravali-fringe farmhouse plots. Builder, constructor and seller." },
  { file: "houses.html", page: "houses", title: "Independent Houses in Bareilly, Lucknow & Ghaziabad | YLK Infra", desc: "Ready and resale independent houses with title checklist, map and renovation option." },
  { file: "office.html", page: "office", title: "Office Space in Delhi NCR & CP | YLK Infra", desc: "Connaught Place suites and Indirapuram office floors. Sale or lease. WhatsApp +91 94125 02030." },
  { file: "construction.html", page: "construction", title: "New Construction Contractor in Bareilly | YLK Infra", desc: "Turnkey new construction for houses, villas and small apartment blocks from Bareilly across UP." },
  { file: "renovation.html", page: "renovation", title: "Home Renovation in Bareilly & NCR | YLK Infra", desc: "Structure-first renovation and interiors for Civil Lines homes and NCR builder floors." },
  { file: "affordable.html", page: "affordable", title: "Affordable Housing in UP Cities | PMAY Assist | YLK Infra", desc: "PMAY-linked and state affordable homes in Bareilly, Lucknow, Ayodhya, Meerut, Agra and Ghaziabad." },
  { file: "ncr.html", page: "ncr", title: "Buy Plots, Offices & Land Anywhere in Delhi NCR | YLK Infra", desc: "YLK Infra helps you buy plots, offices and land in Noida, Greater Noida, Gurugram, Faridabad, Delhi and Jewar." },
  { file: "invest.html", page: "invest", title: "Why Land is a Secure Investment | YLK Infra Bareilly", desc: "Why titled land in North Indian growth corridors remains a durable family asset — and how YLK checks the paper." },
  { file: "about.html", page: "about", title: "About YLK Infra Private Limited | Bareilly", desc: "Privately owned builder, constructor and seller based in Civil Lines, Bareilly with a Delhi NCR desk." },
  { file: "contact.html", page: "contact", title: "Contact YLK Infra | WhatsApp +91 94125 02030 | Bareilly", desc: "Head office Civil Lines, Bareilly. Call or WhatsApp +91 94125 02030. Book a site visit with name, number and email." }
];

function html(p) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#07140F" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="YLK Infra" />
  <meta name="application-name" content="YLK Infra" />
  <title>${p.title}</title>
  <meta name="description" content="${p.desc}" />
  <meta name="keywords" content="YLK Infra, Bareilly plots, Delhi NCR land, flats Bareilly, villas, office space, affordable housing PMAY, renovation, new construction, Shapoorji style plots, Yamuna Expressway, Jewar land" />
  <meta name="robots" content="index,follow" />
  <meta name="geo.region" content="IN-UP" />
  <meta name="geo.placename" content="Bareilly" />
  <link rel="canonical" href="./${p.file}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${p.title}" />
  <meta property="og:description" content="${p.desc}" />
  <meta property="og:image" content="assets/img/hero-estate.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="manifest" href="manifest.json" />
  <link rel="icon" href="assets/img/app-icon.png" />
  <link rel="apple-touch-icon" href="assets/img/app-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Serif+Devanagari:wght@600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/site.css" />
</head>
<body data-page="${p.page}" data-asset-base="assets/img/">
  <a class="skip" href="#page-root">Skip to content</a>
  <div id="app-header"></div>
  <main id="page-root"></main>
  <div id="app-footer"></div>
  <script src="assets/js/vault.enc.js"></script>
  <script src="assets/js/crypto.js"></script>
  <script src="assets/js/i18n.js"></script>
  <script src="assets/js/store.js"></script>
  <script src="assets/js/ui.js"></script>
  <script src="assets/js/site.js"></script>
  <script>
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
  </script>
</body>
</html>
`;
}

for (const p of pages) writeFileSync(join(root, p.file), html(p));
console.log("Wrote", pages.length, "pages");
