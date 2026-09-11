/* Page renderers — fully dynamic from the decrypted vault */
const YLKSite = (() => {
  const $ = (s, r = document) => r.querySelector(s);

  function hero(opts) {
    const img = YLKStore.img(opts.image || "hero-estate.png");
    return `
      <section class="hero" style="--hero:url('${img}')">
        <div class="hero-overlay"></div>
        <div class="hero-copy">
          <p class="eyebrow">${opts.eyebrow || YLKStore.t("heroEyebrow")}</p>
          <h1>${opts.title}</h1>
          <p class="lead">${opts.lead}</p>
          <div class="hero-actions">
            <button class="btn btn-gold" type="button" data-open-book ${opts.property ? `data-property="${opts.property}"` : ""}>${YLKStore.t("ctaBook")}</button>
            <a class="btn btn-ghost" href="${opts.ctaHref || "inventory.html"}">${opts.cta || YLKStore.t("ctaInventory")}</a>
          </div>
          ${opts.guarantee ? `<p class="guarantee">${opts.guarantee}</p>` : ""}
        </div>
      </section>`;
  }

  function stats() {
    return `
      <section class="stats-row">
        <div><strong>12+</strong><span>${YLKStore.t("stats.years")}</span></div>
        <div><strong>${YLKStore.cities().length}</strong><span>${YLKStore.t("stats.cities")}</span></div>
        <div><strong>${YLKStore.types.length}</strong><span>${YLKStore.t("stats.types")}</span></div>
        <div><strong>24×7</strong><span>${YLKStore.t("stats.whatsapp")}</span></div>
      </section>`;
  }

  function serviceGrid() {
    const items = [
      ["plots", "plots.html", "land"],
      ["flats", "flats.html", "building"],
      ["villas", "villas.html", "villa"],
      ["houses", "houses.html", "home"],
      ["office", "office.html", "office"],
      ["construction", "construction.html", "crane"],
      ["renovation", "renovation.html", "renov"],
      ["affordable", "affordable.html", "afford"],
      ["ncr", "ncr.html", "ncr"],
      ["invest", "invest.html", "chart"]
    ];
    const n = YLKStore.t("nav");
    return `
      <section class="pad">
        <div class="sec-head">
          <p class="eyebrow">${YLKStore.t("trusted")}</p>
          <h2>${YLKStore.t("sectionServices")}</h2>
          <p>${YLKStore.t("sectionServicesLead")}</p>
        </div>
        <div class="svc-grid">
          ${items
            .map(
              ([k, href, ic]) => `
            <a class="svc-card" href="${href}">
              <span class="svc-ico">${YLKUI.icon(ic)}</span>
              <h3>${n[k]}</h3>
              <span>See more →</span>
            </a>`
            )
            .join("")}
        </div>
      </section>`;
  }

  function inventoryGrid(list, empty) {
    if (!list.length) return `<p class="empty">${empty || YLKStore.t("noMatch")}</p>`;
    return `<div class="prop-grid">${list.map(YLKUI.card).join("")}</div>`;
  }

  function faqs() {
    const hi = YLKStore.lang() === "hi";
    return `
      <section class="pad faq-sec">
        <h2>${YLKStore.t("faq")}</h2>
        <div class="faq-list">
          ${YLKStore.faqs()
            .map(
              (f) => `<details><summary>${hi ? f.qHi : f.q}</summary><p>${hi ? f.aHi : f.a}</p></details>`
            )
            .join("")}
        </div>
      </section>`;
  }

  function quotes() {
    const hi = YLKStore.lang() === "hi";
    return `
      <section class="quotes pad">
        <div class="marquee" aria-hidden="true"><span>WE LOVE REAL ESTATE AND CONSTRUCTION · YLK INFRA BAREILLY · </span><span>WE LOVE REAL ESTATE AND CONSTRUCTION · YLK INFRA BAREILLY · </span></div>
        <div class="quote-grid">
          ${YLKStore.testimonials()
            .map(
              (q) => `<blockquote><p>“${hi ? q.quoteHi : q.quote}”</p><footer><strong>${q.name}</strong><span>${q.role}</span></footer></blockquote>`
            )
            .join("")}
        </div>
      </section>`;
  }

  function why() {
    const items =
      YLKStore.lang() === "hi"
        ? [
            ["टाइटल पहले", "7/12, खसरा, एनए, एनकम्ब्रेंस — लिस्टिंग से पहले कागज़।"],
            ["लाइव स्टॉक", "एडमिन उपलब्ध / बुक / सोल्ड दिखाता है। भूतिया यूनिट नहीं।"],
            ["व्हाट्सएप क्लोज", "नाम, नंबर, ईमेल सीधा +91 94125 02030।"],
            ["बरेली + एनसीआर", "घर की कंपनी, एक्सप्रेसवे कॉरिडोर की पहुंच।"]
          ]
        : [
            ["Title first", "7/12, khasra, NA and encumbrance before a listing goes live."],
            ["Live stock", "Admin marks available, booked or sold. No ghost units."],
            ["WhatsApp close", "Name, number and email land on +91 94125 02030."],
            ["Bareilly + NCR", "A hometown company with an expressway-corridor desk."]
          ];
    return `
      <section class="why pad">
        <div class="sec-head">
          <p class="eyebrow">4.9 · families we keep</p>
          <h2>${YLKStore.t("why")}</h2>
          <p>${YLKStore.t("whyLead")}</p>
        </div>
        <div class="why-grid">
          ${items.map((x) => `<article><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join("")}
        </div>
      </section>`;
  }

  function ctaBand() {
    const c = YLKStore.company();
    return `
      <section class="cta-band">
        <div>
          <h2>${YLKStore.t("contactTitle")}</h2>
          <p>${c.address}</p>
        </div>
        <div class="cta-actions">
          <a class="btn btn-gold" href="tel:${c.phoneTel}">${YLKStore.t("ctaCall")}</a>
          <button class="btn btn-ghost" type="button" data-open-book>${YLKStore.t("ctaBook")}</button>
        </div>
      </section>`;
  }

  function home() {
    const feat = YLKStore.inventory().filter((p) => p.featured).slice(0, 6);
    return (
      hero({
        image: "hero-estate.png",
        title: YLKStore.t("heroTitle"),
        lead: YLKStore.t("heroLead"),
        guarantee: YLKStore.lang() === "hi" ? "बरेली मुख्यालय · दिल्ली एनसीआर डेस्क" : "Headquartered in Bareilly · Desk across Delhi NCR"
      }) +
      `<section class="split-intro">
        <div class="si-copy">
          <p class="eyebrow">${YLKStore.t("trusted")}</p>
          <h2>${YLKStore.lang() === "hi" ? "अग्रणी दृष्टि, उद्देश्य के साथ वृद्धि" : "Leading with vision, grow with purpose"}</h2>
          <p>${
            YLKStore.lang() === "hi"
              ? "YLK Infra Private Limited एक निजी बिल्डर, कंस्ट्रक्टर और विक्रेता है। हम प्लॉटेड टाउनशिप, फ्लैट, विला, मकान, ऑफिस स्पेस, नई कंस्ट्रक्शन और रेनोवेशन देते हैं — और दिल्ली एनसीआर में ज़मीन व अफोर्डेबल आवास दिलाने में परिवारों की मदद करते हैं।"
              : "YLK Infra Private Limited is a privately held builder, constructor and seller. We deliver plotted townships, flats, villas, houses, office space, new construction and renovation — and we help families acquire land and affordable homes across Delhi NCR."
          }</p>
          <a class="text-link" href="about.html">${YLKStore.t("nav.about")} →</a>
        </div>
        <div class="si-media"><img src="${YLKStore.img("bareilly-city.png")}" alt="Bareilly" /></div>
      </section>` +
      stats() +
      serviceGrid() +
      `<section class="pad">
        <div class="sec-head row">
          <div>
            <h2>${YLKStore.t("featured")}</h2>
            <p>${YLKStore.t("featuredLead")}</p>
          </div>
          <a class="btn btn-ghost" href="inventory.html">${YLKStore.t("viewAll")}</a>
        </div>
        ${inventoryGrid(feat)}
      </section>` +
      why() +
      `<section class="dual-cta">
        <a class="dual" href="invest.html" style="--bg:url('${YLKStore.img("land-invest.png")}')">
          <h3>${YLKStore.t("investTeaser")}</h3>
          <p>${YLKStore.t("investTeaserLead")}</p>
          <span>${YLKStore.t("readInvest")} →</span>
        </a>
        <a class="dual" href="ncr.html" style="--bg:url('${YLKStore.img("ncr-skyline.png")}')">
          <h3>${YLKStore.t("ncrTeaser")}</h3>
          <p>${YLKStore.t("ncrTeaserLead")}</p>
          <span>${YLKStore.t("nav.ncr")} →</span>
        </a>
      </section>` +
      quotes() +
      faqs() +
      ctaBand()
    );
  }

  function filtersBar(state) {
    const cities = [...new Set(YLKStore.inventory().map((p) => p.city))].sort();
    return `
      <form class="filters" id="invFilters">
        <input name="q" placeholder="${YLKStore.t("search")}" value="${state.q || ""}" />
        <select name="type">
          <option value="">${YLKStore.t("allTypes")}</option>
          ${YLKStore.types.map((t) => `<option value="${t.id}" ${state.type === t.id ? "selected" : ""}>${YLKStore.typeLabel(t.id)}</option>`).join("")}
        </select>
        <select name="city">
          <option value="">${YLKStore.t("allCities")}</option>
          ${cities.map((c) => `<option ${state.city === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
        <select name="status">
          <option value="">${YLKStore.t("allStatus")}</option>
          <option value="available" ${state.status === "available" ? "selected" : ""}>${YLKStore.t("available")}</option>
          <option value="booked" ${state.status === "booked" ? "selected" : ""}>${YLKStore.t("booked")}</option>
          <option value="sold" ${state.status === "sold" ? "selected" : ""}>${YLKStore.t("sold")}</option>
        </select>
      </form>`;
  }

  function applyFilter(list, state) {
    const q = (state.q || "").toLowerCase();
    return list.filter((p) => {
      if (state.type && p.type !== state.type) return false;
      if (state.city && p.city !== state.city) return false;
      if (state.status && p.status !== state.status) return false;
      if (q) {
        const blob = [p.title, p.titleHi, p.location, p.city, p.type, p.rera].join(" ").toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }

  function bindFilters() {
    const form = $("#invFilters");
    if (!form) return;
    const paint = () => {
      const fd = new FormData(form);
      const state = { q: fd.get("q"), type: fd.get("type"), city: fd.get("city"), status: fd.get("status") };
      const list = applyFilter(YLKStore.inventory(), state);
      $("#invGrid").innerHTML = inventoryGrid(list);
    };
    form.addEventListener("input", paint);
    form.addEventListener("change", paint);
  }

  function inventoryPage(preset = {}) {
    const state = { type: preset.type || "", city: "", status: "", q: "" };
    const list = applyFilter(YLKStore.inventory(), state);
    const counts = YLKStore.counts();
    return (
      hero({
        image: preset.image || "plot-gated.png",
        title: preset.title || YLKStore.t("nav.inventory"),
        lead: preset.lead || YLKStore.t("featuredLead"),
        ctaHref: "#stock",
        cta: YLKStore.t("viewAll")
      }) +
      `<section class="pad" id="stock">
        <div class="count-pills">
          <span>${counts.all} listings</span>
          <span class="ok">${counts.available} ${YLKStore.t("available")}</span>
          <span class="warn">${counts.booked} ${YLKStore.t("booked")}</span>
          <span class="bad">${counts.sold} ${YLKStore.t("sold")}</span>
        </div>
        ${filtersBar(state)}
        <div id="invGrid">${inventoryGrid(list)}</div>
      </section>` +
      ctaBand()
    );
  }

  function propertyPage() {
    const id = new URLSearchParams(location.search).get("id");
    const p = YLKStore.item(id);
    if (!p) {
      return `<section class="pad"><h1>Listing not found</h1><p><a href="inventory.html">${YLKStore.t("viewAll")}</a></p></section>`;
    }
    const imgs = (p.images || []).map((n) => YLKStore.img(n));
    const similar = YLKStore.inventory()
      .filter((x) => x.type === p.type && x.id !== p.id)
      .slice(0, 3);
    const osm = `https://www.openstreetmap.org/export/embed.html?bbox=${p.lng - 0.04}%2C${p.lat - 0.03}%2C${p.lng + 0.04}%2C${p.lat + 0.03}&layer=mapnik&marker=${p.lat}%2C${p.lng}`;
    document.title = `${YLKStore.titleOf(p)} | YLK Infra`;
    return `
      <section class="prop-hero">
        <div class="gallery">
          ${imgs.map((src, i) => `<img src="${src}" alt="${YLKStore.titleOf(p)} ${i + 1}" class="${i === 0 ? "g-main" : ""}" />`).join("")}
        </div>
        <aside class="prop-buy">
          ${YLKUI.badge(p.status)}
          <p class="pc-loc">${p.location}</p>
          <h1>${YLKStore.titleOf(p)}</h1>
          <p class="price">${p.priceLabel || YLKStore.inr(p.price)}</p>
          <ul class="spec">
            <li><span>${YLKStore.t("nav.inventory")}</span><b>${YLKStore.typeLabel(p.type)}</b></li>
            <li><span>Area</span><b>${p.area || "—"}</b></li>
            ${p.beds ? `<li><span>BHK</span><b>${p.beds} / ${p.baths || "—"} bath</b></li>` : ""}
            <li><span>${YLKStore.t("rera")}</span><b>${p.rera || "—"}</b></li>
            <li><span>Facing</span><b>${p.facing || "—"}</b></li>
          </ul>
          <button class="btn btn-gold btn-block" type="button" data-open-book data-property="${p.id}" ${p.status === "sold" ? "" : ""}>${p.status === "sold" ? "Join waitlist" : YLKStore.t("ctaBook")}</button>
          <a class="btn btn-ghost btn-block" href="brochure.html?id=${encodeURIComponent(p.id)}">${YLKStore.t("brochure")}</a>
          <a class="btn btn-ghost btn-block" href="${YLKStore.waUrl("Please send brochure & map for " + p.title + " (" + p.city + ")")}" target="_blank" rel="noopener">${YLKStore.t("getDocs")}</a>
        </aside>
      </section>
      <section class="pad split-text">
        <div>
          <h2>${YLKStore.t("details")}</h2>
          <p>${YLKStore.descOf(p)}</p>
          <h3>${YLKStore.t("highlights")}</h3>
          <ul class="ticks">${(YLKStore.lang() === "hi" && p.highlightsHi ? p.highlightsHi : p.highlights || []).map((h) => `<li>${h}</li>`).join("")}</ul>
          <h3>${YLKStore.t("amen")}</h3>
          <ul class="chips">${(p.amenities || []).map((a) => `<li>${a}</li>`).join("")}</ul>
        </div>
        <div>
          <h3>${YLKStore.t("docs")}</h3>
          <ul class="doc-list">
            ${(p.documents || [])
              .map((d) => {
                const href =
                  d.kind === "brochure"
                    ? `brochure.html?id=${encodeURIComponent(p.id)}`
                    : d.kind === "map"
                      ? "#map"
                      : `brochure.html?id=${encodeURIComponent(p.id)}&doc=${encodeURIComponent(d.name)}`;
                return `<li><a href="${href}">${d.name}</a></li>`;
              })
              .join("")}
          </ul>
          <h3 id="map">${YLKStore.t("map")}</h3>
          <img class="map-img" src="${YLKStore.img(p.mapImage || "map-masterplan.png")}" alt="Master plan" />
          <iframe class="osm" title="Map" src="${osm}" loading="lazy"></iframe>
        </div>
      </section>
      <section class="pad">
        <h2>${YLKStore.t("similar")}</h2>
        ${similar.length ? inventoryGrid(similar) : `<p class="empty">${YLKStore.t("noMatch")}</p>`}
      </section>`;
  }

  function typePage(type, image, extra) {
    const n = YLKStore.t("nav");
    const key = { plot: "plots", flat: "flats", villa: "villas", house: "houses", office: "office", affordable: "affordable", land: "invest" }[type] || "inventory";
    return inventoryPage({
      type,
      image,
      title: n[key] || YLKStore.typeLabel(type),
      lead: extra
    });
  }

  function longPage(h) {
    return (
      hero(h.hero) +
      `<section class="pad prose">${h.body}</section>` +
      (h.list ? `<section class="pad">${inventoryGrid(h.list)}</section>` : "") +
      (h.cities
        ? `<section class="pad"><h2>${YLKStore.t("moreCities")}</h2><div class="city-grid">${h.cities
            .map((c) => `<article><h3>${c.name}</h3><p>${c.note}</p></article>`)
            .join("")}</div></section>`
        : "") +
      faqs() +
      ctaBand()
    );
  }

  function construction() {
    const hi = YLKStore.lang() === "hi";
    return longPage({
      hero: {
        image: "construction-new.png",
        title: YLKStore.t("constructionTitle"),
        lead: hi
          ? "प्लॉट से चाबी तक — स्ट्रक्चर, फिनिश, टाइमलाइन और वैधानिक फाइलें एक टीम।"
          : "From plot to keys — structure, finishes, timeline and statutory files under one team."
      },
      body: hi
        ? `<h2>नई कंस्ट्रक्शन, बिल्डर की तरह</h2><p>YLK Infra स्वतंत्र मकान, विला और छोटे अपार्टमेंट ब्लॉक बनाती है। हम ठेके को चरणों में बाँटते हैं — नींव, फ्रेम, ईंट, प्लास्टर, MEP, फिनिश — हर चरण की फोटो व्हाट्सएप पर।</p><ul class="ticks"><li>आर्किटेक्ट + स्ट्रक्चरल ड्राइंग रिव्यू</li><li>मटीरियल स्पेक शीट (सीमेंट, स्टील, टाइल, फिटिंग)</li><li>म्युनिसिपल / विकास प्राधिकरण फाइल मदद</li><li>फिक्स्ड-स्कोप या आइटम-रेट कॉन्ट्रैक्ट</li></ul>`
        : `<h2>New builds, without the chaos</h2><p>YLK Infra constructs independent houses, villas and small apartment blocks. We split the contract into foundation, frame, brick, plaster, MEP and finish — with WhatsApp photo logs at every stage.</p><ul class="ticks"><li>Architect + structural drawing review</li><li>Material spec sheet (cement, steel, tiles, fittings)</li><li>Municipal / development-authority filing support</li><li>Fixed-scope or item-rate contracts</li></ul>`
    });
  }

  function renovation() {
    const hi = YLKStore.lang() === "hi";
    return longPage({
      hero: {
        image: "renovate-living.png",
        title: YLKStore.t("renovationTitle"),
        lead: hi
          ? "पुराने सिविल लाइन्स घर से NCR बिल्डर फ्लोर तक — स्ट्रक्चर सेकेंड, फिनिश फर्स्ट नहीं।"
          : "From Civil Lines heirlooms to NCR builder floors — structure first, finishes that last."
      },
      body: hi
        ? `<h2>रेनोवेशन जो रहने लायक रहे</h2><p>हम वॉटरप्रूफिंग, रीवायरिंग, प्लंबिंग और वास्तु लेआउट को फर्नीचर से पहले ठीक करते हैं। बरेली, लखनऊ और एनसीआर में टर्नकी इंटीरियर पैकेज।</p><ul class="ticks"><li>स्ट्रक्चरल ऑडिट</li><li>किचन + वॉशरूम पैकेज</li><li>हेरिटेज प्लास्टर / नई एल्युमिनियम विंडो</li><li>फर्निश्ड होम स्टेजिंग रीसेल के लिए</li></ul>`
        : `<h2>Renovation that still feels like home</h2><p>We fix waterproofing, rewiring, plumbing and vaastu layout before furniture. Turnkey interior packages in Bareilly, Lucknow and NCR.</p><ul class="ticks"><li>Structural audit</li><li>Kitchen + wet-area packages</li><li>Heritage plaster or new aluminium windows</li><li>Staging for resale</li></ul>`
    });
  }

  function affordable() {
    const hi = YLKStore.lang() === "hi";
    return longPage({
      hero: {
        image: "affordable-homes.png",
        title: YLKStore.t("nav.affordable"),
        lead: YLKStore.t("affordableTeaserLead")
      },
      body: hi
        ? `<h2>कई शहर, एक फाइल मदद</h2><p>हम PMAY (शहरी) क्रेडिट-लिंक्ड सब्सिडी, राज्य EWS/LIG और प्राधिकरण योजनाओं में परिवारों की मदद करते हैं। पात्रता, आय प्रमाण, आधार-बैंक सीडिंग और आवंटन फॉलो-अप।</p>`
        : `<h2>Many cities, one file desk</h2><p>We help families with PMAY (Urban) credit-linked subsidy, state EWS/LIG and development-authority schemes — eligibility, income proofs, Aadhaar-bank seeding and allotment follow-up.</p>`,
      list: YLKStore.byType("affordable"),
      cities: YLKStore.cities()
    });
  }

  function ncr() {
    const hi = YLKStore.lang() === "hi";
    return longPage({
      hero: {
        image: "ncr-skyline.png",
        title: YLKStore.t("nav.ncr"),
        lead: YLKStore.t("ncrTeaserLead")
      },
      body: hi
        ? `<h2>दिल्ली एनसीआर में कहीं भी खरीदने की मदद</h2><p>नोएडा, ग्रेटर नोएडा, गाजियाबाद, फरीदाबाद, गुरुग्राम, दिल्ली और जेवर एयरपोर्ट बेल्ट में प्लॉट, बिल्डर फ्लोर, ऑफिस, गोदाम और लैंड। शॉर्टलिस्ट के बाद पारदर्शी एडवाइजरी फीस। बरेली ऑफिस से साइट विजिट प्लान करते हैं।</p><ul class="ticks"><li>टाइटल + RERA चेक</li><li>किराया तुलना ऑफिस के लिए</li><li>एक्सप्रेसवे / मेट्रो / एयरपोर्ट दूरी नोट</li><li>रजिस्ट्री व बैंक पैनल सहयोग</li></ul>`
        : `<h2>We will help you buy anywhere in Delhi NCR</h2><p>Plots, builder floors, offices, warehouses and land across Noida, Greater Noida, Ghaziabad, Faridabad, Gurugram, Delhi and the Jewar airport belt. Transparent advisory fee after you shortlist. Site visits planned from the Bareilly office.</p><ul class="ticks"><li>Title + RERA check</li><li>Rent comps for offices</li><li>Expressway / Metro / airport note</li><li>Registry and bank-panel support</li></ul>`,
      list: YLKStore.inventory().filter((p) => ["Noida", "Greater Noida", "Ghaziabad", "Faridabad", "New Delhi", "Jewar", "Gurugram"].includes(p.city)),
      cities: YLKStore.cities().filter((c) => c.state === "NCR" || c.id === "delhi" || c.id === "jewar")
    });
  }

  function invest() {
    const hi = YLKStore.lang() === "hi";
    const blocks = hi
      ? [
          ["सीमित आपूर्ति", "अच्छी सड़क वाली NA ज़मीन बनती नहीं — शहर बढ़ते हैं। यही कारण है कि प्लॉट लंबे चक्र में सोना और FD से अलग व्यवहार करते हैं।"],
          ["महंगाई बचाव", "उत्तर भारत के ग्रोथ कॉरिडोर में विकसित प्लॉट ने 7–12 वर्ष में मुद्रास्फीति से अधिक दिया है। भूत नहीं, कागज़ वाला पार्सल।"],
          ["आय या विकास", "फार्म लीज, वेयरहाउस CLU, या अपना घर — इक्विटी की तरह कागज़ी नहीं, इस्तेमाल योग्य संपत्ति।"],
          ["कागज़ ही सुरक्षा है", "बिना साफ टाइटल ज़मीन जुआ है। YLK खसरा, जमाबंदी, एनए, पहुंच और बाढ़/अतिक्रमण चेक के बिना लिस्टिंग नहीं करती।"]
        ]
      : [
          ["Finite supply", "NA plots with a real road are not minted. Cities grow around them. That is why plotted land behaves unlike gold or FDs over long cycles."],
          ["Inflation hedge", "Developed plots in North Indian growth corridors have historically outrun inflation across 7–12 year holds — titled parcels, not rumours."],
          ["Income or build", "Farm lease, warehouse CLU, or your own house — a usable asset, not a paper claim like equity."],
          ["Paper is the safety", "Untitled land is a wager. YLK does not list without khasra, jamabandi, NA status, access and flood/encroachment notes."]
        ];
    return (
      hero({
        image: "land-invest.png",
        title: YLKStore.t("investTeaser"),
        lead: YLKStore.t("investTeaserLead")
      }) +
      `<section class="pad invest-grid">${blocks.map((b) => `<article><h3>${b[0]}</h3><p>${b[1]}</p></article>`).join("")}</section>` +
      `<section class="pad prose">
        <h2>${hi ? "कैसे खरीदें (YLK विधि)" : "How we buy (the YLK method)"}</h2>
        <ol class="steps">
          <li>${hi ? "कॉरिडोर चुनें — बरेली ईस्ट, यमुना एक्सप्रेसवे, जेवर, अयोध्या।" : "Pick a corridor — Bareilly east, Yamuna Expressway, Jewar, Ayodhya."}</li>
          <li>${hi ? "बजट व होल्ड अवधि (खुद के उपयोग / 5 वर्ष / 10 वर्ष)।" : "Fix budget and hold (self-use / 5-year / 10-year)."}</li>
          <li>${hi ? "टाइटल पैक: 7/12 या खसरा, चेन, एनए, नक्शा।" : "Title pack: 7/12 or khasra, chain, NA, layout."}</li>
          <li>${hi ? "साइट — सड़क, नाला, हाईटेंशन, अतिक्रमण।" : "Walk the site — road, drain, HT line, encroachment."}</li>
          <li>${hi ? "रजिस्ट्री + म्यूटेशन; पेमेंट ट्रेल बैंक से।" : "Registry + mutation; keep a bank payment trail."}</li>
        </ol>
        <p>${hi ? "यह वित्तीय सलाह नहीं, शिक्षा है। हर पार्सल अलग है।" : "This is education, not financial advice. Every parcel is different."}</p>
      </section>` +
      `<section class="pad">${inventoryGrid(YLKStore.inventory().filter((p) => p.type === "plot" || p.type === "land"))}</section>` +
      faqs() +
      ctaBand()
    );
  }

  function about() {
    const hi = YLKStore.lang() === "hi";
    return (
      hero({
        image: "bareilly-city.png",
        title: YLKStore.t("aboutTitle"),
        lead: hi
          ? "निजी स्वामित्व वाली कंपनी। बिल्डर, कंस्ट्रक्टर, विक्रेता — बरेली में जड़ें, एनसीआर में डेस्क।"
          : "A privately owned house. Builder, constructor, seller — roots in Bareilly, a desk across NCR."
      }) +
      `<section class="split-intro">
        <div class="si-copy">
          <h2>YLK Infra Private Limited</h2>
          <p>${
            hi
              ? "हम प्लॉटेड एस्टेट विकसित करते हैं, आवासीय स्टैक बेचते हैं, विला और मकान बनाते हैं, रेनोवेट करते हैं, और परिवारों को दिल्ली एनसीआर व यूपी में साफ टाइटल वाली संपत्ति दिलाने में मदद करते हैं। मुख्य कार्यालय सिविल लाइन्स, बरेली।"
              : "We develop plotted estates, sell residential stacks, build villas and houses, renovate, and help families acquire clean-title property across Delhi NCR and Uttar Pradesh. Head office: Civil Lines, Bareilly."
          }</p>
        </div>
        <div class="si-media"><img src="${YLKStore.img("hero-estate.png")}" alt="YLK developments" /></div>
      </section>` +
      stats() +
      why() +
      ctaBand()
    );
  }

  function contact() {
    const c = YLKStore.company();
    const osm = `https://www.openstreetmap.org/export/embed.html?bbox=${c.lng - 0.05}%2C${c.lat - 0.04}%2C${c.lng + 0.05}%2C${c.lat + 0.04}&layer=mapnik&marker=${c.lat}%2C${c.lng}`;
    return (
      hero({
        image: "bareilly-city.png",
        title: YLKStore.t("contactTitle"),
        lead: c.address
      }) +
      `<section class="pad contact-grid">
        <article>
          <h2>${YLKStore.t("office")}</h2>
          <p>${c.address}</p>
          <p><a href="tel:${c.phoneTel}">${c.phone}</a></p>
          <p><a href="mailto:${c.email}">${c.email}</a></p>
          <p>${YLKStore.t("hours")}: ${c.hours}</p>
          <button class="btn btn-gold" type="button" data-open-book>${YLKStore.t("ctaBook")}</button>
        </article>
        <iframe class="osm tall" title="Bareilly office" src="${osm}"></iframe>
      </section>`
    );
  }

  const pages = {
    home,
    inventory: () => inventoryPage(),
    property: propertyPage,
    plots: () => typePage("plot", "hero-plots.png", YLKStore.t("featuredLead")),
    flats: () => typePage("flat", "hero-flats.png", YLKStore.t("featuredLead")),
    villas: () => typePage("villa", "villa-prestige.png", YLKStore.t("featuredLead")),
    houses: () => typePage("house", "house-civil.png", YLKStore.t("featuredLead")),
    office: () => typePage("office", "office-exterior.png", YLKStore.t("featuredLead")),
    construction,
    renovation,
    affordable,
    ncr,
    invest,
    about,
    contact
  };

  async function boot() {
    const root = $("#page-root");
    if (root) root.innerHTML = `<p class="boot-msg">${YLKStore.t("load")}</p>`;
    try {
      await YLKStore.init();
      YLKUI.mount();
      const page = document.body.dataset.page || "home";
      if (root && pages[page]) root.innerHTML = pages[page]();
      bindFilters();
      injectJsonLd();
    } catch (err) {
      console.error(err);
      if (root) root.innerHTML = `<p class="boot-msg">Could not open the secure vault. Serve this folder over http (not file://) or refresh.</p>`;
    }
  }

  function injectJsonLd() {
    const c = YLKStore.company();
    const data = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: c.name,
      telephone: c.phone,
      email: c.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: c.address,
        addressLocality: c.city,
        addressRegion: c.state,
        addressCountry: "IN"
      },
      areaServed: YLKStore.cities().map((x) => x.name),
      url: location.origin + location.pathname.replace(/[^/]+$/, "")
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  return { boot };
})();

document.addEventListener("DOMContentLoaded", () => YLKSite.boot());
