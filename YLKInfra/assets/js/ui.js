/* Chrome: header, footer, booking sheet, cards, mobile tabbar */
const YLKUI = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function icon(name) {
    const p = {
      land: '<path d="M3 18h18M5 18 8 9l4 5 3-4 4 8"/>',
      building: '<path d="M5 20V6l7-3 7 3v14M9 20v-6h6v6"/>',
      villa: '<path d="M4 20V10l8-6 8 6v10M8 20v-6h8v6"/>',
      home: '<path d="M4 11.5 12 5l8 6.5V20H4z"/>',
      office: '<rect x="5" y="4" width="14" height="16" rx="1"/><path d="M9 20v-5h6v5"/>',
      crane: '<path d="M4 20h16M7 20V8h10l4-4M11 8v12"/>',
      renov: '<path d="M5 20h14M8 20V9l4-3 4 3v11M10 13h4"/>',
      afford: '<path d="M4 20h16M6 20V10h12v10M9 14h.01M15 14h.01"/>',
      ncr: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/>',
      chart: '<path d="M4 20h16M7 16V9m5 7V6m5 10v-4"/>',
      wa: '<path d="M19 12a7 7 0 0 1-9.9 6.4L5 19l.7-4A7 7 0 1 1 19 12z"/>',
      pin: '<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/>'
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">${p[name] || p.home}</svg>`;
  }

  function navItems() {
    const n = YLKStore.t("nav");
    return [
      { href: "index.html", key: "home", label: n.home, desk: true },
      { href: "inventory.html", key: "inventory", label: n.inventory, desk: true },
      { href: "plots.html", key: "plots", label: n.plots, desk: true },
      { href: "flats.html", key: "flats", label: n.flats, desk: true },
      { href: "villas.html", key: "villas", label: n.villas, desk: true },
      { href: "houses.html", key: "houses", label: n.houses, desk: true },
      { href: "office.html", key: "office", label: n.office, desk: true },
      { href: "construction.html", key: "construction", label: n.construction },
      { href: "renovation.html", key: "renovation", label: n.renovation },
      { href: "affordable.html", key: "affordable", label: n.affordable, desk: true },
      { href: "ncr.html", key: "ncr", label: n.ncr, desk: true },
      { href: "invest.html", key: "invest", label: n.invest, desk: true },
      { href: "about.html", key: "about", label: n.about },
      { href: "contact.html", key: "contact", label: n.contact, desk: true }
    ];
  }

  function pageKey() {
    return document.body.dataset.page || "home";
  }

  function header() {
    const n = YLKStore.t("nav");
    const c = YLKStore.company();
    const page = pageKey();
    const logo = YLKStore.img("ylk-logo.png");
    const items = navItems();
    const link = (i) => `<a class="${page === i.key ? "on" : ""}" href="${i.href}">${i.label}</a>`;
    const all = items.map(link).join("");
    const desk = items.filter((i) => i.desk).map(link).join("");
    const extra = items.filter((i) => !i.desk).map(link).join("");
    return `
      <header class="site-header" id="siteHeader">
        <div class="header-top">
          <a class="htel" href="tel:${c.phoneTel}">${c.phone}</a>
          <span class="hdash">${YLKStore.t("kicker")}</span>
          <button class="lang-btn" type="button" id="langToggle" aria-label="${YLKStore.t("lang")}">${YLKStore.lang() === "hi" ? "EN" : "हिं"}</button>
        </div>
        <div class="header-main">
          <a class="brand" href="index.html">
            <img src="${logo}" alt="YLK Infra" width="44" height="44" />
            <span>
              <strong>YLK INFRA</strong>
              <em>${YLKStore.t("tagline")}</em>
            </span>
          </a>
          <nav class="desk-nav" aria-label="Primary">${desk}
            <details class="nav-more">
              <summary>More</summary>
              <div class="nav-drop">${extra}</div>
            </details>
          </nav>
          <div class="header-cta">
            <button class="btn btn-gold" type="button" data-open-book>${n.book}</button>
            <button class="menu-btn" type="button" id="menuBtn" aria-label="Menu"><span></span><span></span><span></span></button>
          </div>
        </div>
        <div class="mobile-drawer" id="mobileDrawer">${all}<a href="admin/index.html">${n.admin}</a></div>
      </header>`;
  }

  function footer() {
    const c = YLKStore.company();
    const n = YLKStore.t("nav");
    return `
      <footer class="site-footer">
        <div class="foot-grid">
          <div>
            <div class="brand foot-brand">
              <img src="${YLKStore.img("ylk-logo.png")}" alt="" width="48" height="48" />
              <span><strong>YLK INFRA</strong><em>Private Limited</em></span>
            </div>
            <p>${YLKStore.t("footerNote")}</p>
            <p class="foot-contact"><a href="tel:${c.phoneTel}">${c.phone}</a><br/><a href="mailto:${c.email}">${c.email}</a><br/>${c.address}</p>
          </div>
          <div>
            <h4>${n.inventory}</h4>
            <a href="plots.html">${n.plots}</a>
            <a href="flats.html">${n.flats}</a>
            <a href="villas.html">${n.villas}</a>
            <a href="houses.html">${n.houses}</a>
            <a href="office.html">${n.office}</a>
          </div>
          <div>
            <h4>${YLKStore.t("tagline")}</h4>
            <a href="construction.html">${n.construction}</a>
            <a href="renovation.html">${n.renovation}</a>
            <a href="affordable.html">${n.affordable}</a>
            <a href="ncr.html">${n.ncr}</a>
            <a href="invest.html">${n.invest}</a>
          </div>
          <div>
            <h4>${n.contact}</h4>
            <a href="about.html">${n.about}</a>
            <a href="contact.html">${n.contact}</a>
            <a href="inventory.html">${n.inventory}</a>
            <a href="admin/index.html">${n.admin}</a>
            <button type="button" class="linkish" data-open-book>${n.book}</button>
          </div>
        </div>
        <p class="disclaimer">${YLKStore.t("disclaimer")}</p>
        <p class="rights">${YLKStore.t("rights")}</p>
      </footer>
      <button class="wa-float" type="button" data-open-book aria-label="WhatsApp">${icon("wa")} WhatsApp</button>
      <nav class="app-tabbar" aria-label="App">
        <a href="index.html" class="${pageKey() === "home" ? "on" : ""}">${icon("home")}<span>${YLKStore.t("tabs.home")}</span></a>
        <a href="inventory.html" class="${pageKey() === "inventory" ? "on" : ""}">${icon("building")}<span>${YLKStore.t("tabs.stock")}</span></a>
        <a href="invest.html" class="${pageKey() === "invest" ? "on" : ""}">${icon("chart")}<span>${YLKStore.t("tabs.invest")}</span></a>
        <button type="button" data-open-book>${icon("wa")}<span>${YLKStore.t("tabs.book")}</span></button>
        <a href="contact.html" class="${pageKey() === "contact" ? "on" : ""}">${icon("pin")}<span>${YLKStore.t("tabs.more")}</span></a>
      </nav>`;
  }

  function bookingSheet(prefill = {}) {
    const c = YLKStore.company();
    const types = [{ id: "", label: "—" }].concat(YLKStore.types.map((x) => ({ id: x.id, label: YLKStore.typeLabel(x.id) })));
    const inv = YLKStore.inventory();
    const interest = prefill.interest || "";
    const propertyId = prefill.propertyId || "";
    return `
      <div class="sheet-bg" id="sheetBg"></div>
      <aside class="sheet" id="bookSheet" role="dialog" aria-labelledby="bookTitle">
        <button class="sheet-close" type="button" id="sheetClose">×</button>
        <h2 id="bookTitle">${YLKStore.t("bookTitle")}</h2>
        <p class="muted">${YLKStore.t("bookLead")}</p>
        <form id="bookForm" class="book-form">
          <label>${YLKStore.t("name")} *
            <input name="name" required autocomplete="name" value="${prefill.name || ""}" />
          </label>
          <label>${YLKStore.t("whatsapp")} *
            <input name="phone" required inputmode="numeric" maxlength="10" pattern="[0-9]{10}" placeholder="9412502030" />
          </label>
          <label>${YLKStore.t("email")} *
            <input name="email" type="email" required autocomplete="email" />
          </label>
          <label>${YLKStore.t("interest")}
            <select name="interest">
              ${types.map((t) => `<option value="${t.id}" ${t.id === interest ? "selected" : ""}>${t.label}</option>`).join("")}
            </select>
          </label>
          <label>Property
            <select name="propertyId">
              <option value="">—</option>
              ${inv.map((p) => `<option value="${p.id}" ${p.id === propertyId ? "selected" : ""}>${YLKStore.titleOf(p)} · ${p.city}</option>`).join("")}
            </select>
          </label>
          <label>${YLKStore.t("message")}
            <textarea name="message" rows="3"></textarea>
          </label>
          <p class="form-err" id="bookErr" hidden></p>
          <button class="btn btn-gold btn-block" type="submit">${YLKStore.t("send")}</button>
          <p class="fine">WhatsApp ${c.phone} · ${c.email}</p>
        </form>
      </aside>
      <div class="toast" id="toast"></div>`;
  }

  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2200);
  }

  function openBook(prefill) {
    if (prefill && prefill.propertyId) {
      const sel = $('[name="propertyId"]');
      if (sel) sel.value = prefill.propertyId;
      const p = YLKStore.item(prefill.propertyId);
      if (p) {
        const i = $('[name="interest"]');
        if (i) i.value = p.type;
      }
    }
    $("#bookSheet")?.classList.add("open");
    $("#sheetBg")?.classList.add("open");
    document.body.classList.add("sheet-on");
  }

  function closeBook() {
    $("#bookSheet")?.classList.remove("open");
    $("#sheetBg")?.classList.remove("open");
    document.body.classList.remove("sheet-on");
  }

  function badge(st) {
    return `<span class="badge b-${st}">${YLKStore.statusLabel(st)}</span>`;
  }

  function card(p) {
    const img = YLKStore.img((p.images && p.images[0]) || "hero-estate.png");
    const sold = p.status !== "available";
    return `
      <article class="prop-card ${sold ? "is-sold" : ""}">
        <a class="pc-media" href="property.html?id=${encodeURIComponent(p.id)}">
          <img src="${img}" alt="${YLKStore.titleOf(p)}" loading="lazy" />
          ${badge(p.status)}
          <span class="pc-type">${YLKStore.typeLabel(p.type)}</span>
        </a>
        <div class="pc-body">
          <p class="pc-loc">${p.location}</p>
          <h3><a href="property.html?id=${encodeURIComponent(p.id)}">${YLKStore.titleOf(p)}</a></h3>
          <ul class="pc-meta">
            ${p.area ? `<li>${p.area}</li>` : ""}
            ${p.beds ? `<li>${p.beds} BHK</li>` : ""}
            ${p.city ? `<li>${p.city}</li>` : ""}
          </ul>
          <div class="pc-row">
            <strong>${p.priceLabel || YLKStore.inr(p.price)}</strong>
            <button type="button" class="btn btn-sm" data-open-book data-property="${p.id}">${YLKStore.t("enquire")}</button>
          </div>
        </div>
      </article>`;
  }

  function bindChrome() {
    $("#langToggle")?.addEventListener("click", () => {
      YLKStore.setLang(YLKStore.lang() === "hi" ? "en" : "hi");
      location.reload();
    });
    $("#menuBtn")?.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
    $("#sheetBg")?.addEventListener("click", closeBook);
    $("#sheetClose")?.addEventListener("click", closeBook);
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open-book]");
      if (!btn) return;
      openBook({ propertyId: btn.dataset.property });
    });
    $("#bookForm")?.addEventListener("submit", onBook);
    window.addEventListener("scroll", () => {
      $("#siteHeader")?.classList.toggle("scrolled", window.scrollY > 12);
    });
  }

  function onBook(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").replace(/\D/g, "");
    const email = String(fd.get("email") || "").trim();
    const err = $("#bookErr");
    const show = (m) => {
      err.hidden = false;
      err.textContent = m;
    };
    if (name.length < 2) return show(YLKStore.t("invalidName"));
    if (!/^[6-9]\d{9}$/.test(phone)) return show(YLKStore.t("invalid"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return show(YLKStore.t("invalidEmail"));
    err.hidden = true;
    const propertyId = String(fd.get("propertyId") || "");
    const prop = propertyId ? YLKStore.item(propertyId) : null;
    const rec = YLKStore.addBooking({
      name,
      phone,
      email,
      interest: String(fd.get("interest") || ""),
      propertyId,
      propertyTitle: prop ? prop.title : "",
      message: String(fd.get("message") || ""),
      page: location.pathname
    });
    const c = YLKStore.company();
    const lines = [
      "YLK Infra — Site booking",
      "Ref: " + rec.id,
      "Name: " + name,
      "WhatsApp: +91 " + phone,
      "Email: " + email,
      "Interest: " + (fd.get("interest") || "—"),
      "Property: " + (prop ? prop.title + " (" + prop.city + ")" : "—"),
      "Message: " + (fd.get("message") || "—"),
      "From: " + location.href
    ];
    toast(YLKStore.t("thanks"));
    window.open(YLKStore.waUrl(lines.join("\n")), "_blank");
    closeBook();
    e.target.reset();
  }

  function mount() {
    const main = $("#page-root");
    if (!main) return;
    const head = $("#app-header") || document.createElement("div");
    head.id = "app-header";
    head.innerHTML = header();
    const foot = $("#app-footer") || document.createElement("div");
    foot.id = "app-footer";
    foot.innerHTML = footer() + bookingSheet();
    if (!head.parentNode) main.before(head);
    if (!foot.parentNode) main.after(foot);
    bindChrome();
    document.documentElement.lang = YLKStore.lang() === "hi" ? "hi" : "en";
  }

  return { mount, card, badge, icon, toast, openBook, closeBook, navItems };
})();
