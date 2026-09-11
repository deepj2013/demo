/* Shared encrypted catalog + admin overlays. Nothing is served as readable JSON. */
const YLKStore = (() => {
  const LS_INV = "ylk_inv_overlay_v1";
  const LS_BOOK = "ylk_bookings_v1";
  const LS_SESSION = "ylk_admin_session_v1";
  const LS_LANG = "ylk_lang";
  const LS_WISH = "ylk_wish";

  let catalog = null;
  let ready = null;

  const types = [
    { id: "plot", label: "Plots", labelHi: "प्लॉट" },
    { id: "flat", label: "Flats", labelHi: "फ्लैट" },
    { id: "villa", label: "Villas", labelHi: "विला" },
    { id: "house", label: "Houses", labelHi: "मकान" },
    { id: "office", label: "Office", labelHi: "ऑफिस" },
    { id: "land", label: "Land", labelHi: "ज़मीन" },
    { id: "affordable", label: "Affordable", labelHi: "अफोर्डेबल" }
  ];

  function img(name) {
    const base = document.body.dataset.assetBase || "assets/img/";
    return base + name;
  }

  function lang() {
    return localStorage.getItem(LS_LANG) || "en";
  }
  function setLang(code) {
    localStorage.setItem(LS_LANG, code);
  }
  function t(path) {
    const pack = YLKi18n[lang()] || YLKi18n.en;
    return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : null), pack) ?? path;
  }

  function loadJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || "") || fallback;
    } catch {
      return fallback;
    }
  }

  function overlay() {
    return loadJson(LS_INV, { upserts: [], deletes: [] });
  }

  async function init() {
    if (ready) return ready;
    ready = (async () => {
      catalog = await YLKCrypto.openPublic();
      return catalog;
    })();
    return ready;
  }

  function company() {
    return catalog.company;
  }

  function inventory() {
    const ov = overlay();
    const deleted = new Set(ov.deletes || []);
    const map = new Map();
    (catalog.inventory || []).forEach((p) => {
      if (!deleted.has(p.id)) map.set(p.id, { ...p });
    });
    (ov.upserts || []).forEach((p) => {
      if (!deleted.has(p.id)) map.set(p.id, { ...map.get(p.id), ...p });
    });
    return [...map.values()].sort((a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title));
  }

  function item(id) {
    return inventory().find((p) => p.id === id || p.slug === id);
  }

  function byType(type) {
    return inventory().filter((p) => p.type === type);
  }

  function cities() {
    return catalog.cities || [];
  }
  function faqs() {
    return catalog.faqs || [];
  }
  function testimonials() {
    return catalog.testimonials || [];
  }

  function saveOverlay(next) {
    localStorage.setItem(LS_INV, JSON.stringify(next));
  }

  function upsertItem(partial) {
    const ov = overlay();
    const id = partial.id || "ylk-" + Math.random().toString(36).slice(2, 8);
    const prev = item(id) || {};
    const rec = {
      ...prev,
      ...partial,
      id,
      slug: partial.slug || prev.slug || id,
      images: partial.images && partial.images.length ? partial.images : prev.images || ["hero-estate.png"],
      documents: partial.documents || prev.documents || [{ name: "Brochure", kind: "brochure" }],
      highlights: partial.highlights || prev.highlights || [],
      amenities: partial.amenities || prev.amenities || [],
      status: partial.status || prev.status || "available"
    };
    ov.upserts = (ov.upserts || []).filter((x) => x.id !== id).concat([rec]);
    ov.deletes = (ov.deletes || []).filter((d) => d !== id);
    saveOverlay(ov);
    return rec;
  }

  function removeItem(id) {
    const ov = overlay();
    ov.upserts = (ov.upserts || []).filter((x) => x.id !== id);
    if (!(catalog.inventory || []).some((p) => p.id === id)) {
      ov.deletes = ov.deletes || [];
    } else {
      ov.deletes = Array.from(new Set([...(ov.deletes || []), id]));
    }
    saveOverlay(ov);
  }

  function bookings() {
    return loadJson(LS_BOOK, []);
  }

  function addBooking(row) {
    const list = bookings();
    const rec = {
      id: "BK-" + Date.now().toString(36).toUpperCase(),
      at: new Date().toISOString(),
      status: "new",
      ...row
    };
    list.unshift(rec);
    localStorage.setItem(LS_BOOK, JSON.stringify(list.slice(0, 400)));
    return rec;
  }

  function updateBooking(id, patch) {
    const list = bookings().map((b) => (b.id === id ? { ...b, ...patch } : b));
    localStorage.setItem(LS_BOOK, JSON.stringify(list));
  }

  async function login(user, pass) {
    const hash = await YLKCrypto.sha256hex(pass);
    if (user.trim() !== catalog.auth.user || hash !== catalog.auth.passHash) return false;
    sessionStorage.setItem(LS_SESSION, JSON.stringify({ user, at: Date.now() }));
    return true;
  }

  function session() {
    try {
      const s = JSON.parse(sessionStorage.getItem(LS_SESSION) || "null");
      if (!s || Date.now() - s.at > 1000 * 60 * 60 * 8) return null;
      return s;
    } catch {
      return null;
    }
  }

  function logout() {
    sessionStorage.removeItem(LS_SESSION);
  }

  function wish() {
    return loadJson(LS_WISH, []);
  }
  function toggleWish(id) {
    const w = wish();
    const next = w.includes(id) ? w.filter((x) => x !== id) : w.concat(id);
    localStorage.setItem(LS_WISH, JSON.stringify(next));
    return next;
  }

  function waUrl(text) {
    const n = company().whatsapp;
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(text);
  }

  function inr(n) {
    if (n == null || n === "") return "—";
    return "₹" + Number(n).toLocaleString("en-IN");
  }

  function statusLabel(st) {
    if (st === "sold") return t("sold");
    if (st === "booked") return t("booked");
    return t("available");
  }

  function typeLabel(id) {
    const row = types.find((x) => x.id === id);
    if (!row) return id;
    return lang() === "hi" ? row.labelHi : row.label;
  }

  function titleOf(p) {
    return lang() === "hi" && p.titleHi ? p.titleHi : p.title;
  }
  function descOf(p) {
    return lang() === "hi" && p.descriptionHi ? p.descriptionHi : p.description;
  }

  function counts() {
    const all = inventory();
    return {
      all: all.length,
      available: all.filter((p) => p.status === "available").length,
      booked: all.filter((p) => p.status === "booked").length,
      sold: all.filter((p) => p.status === "sold").length,
      leads: bookings().length
    };
  }

  function assetBase() {
    return document.body.dataset.assetBase || "assets/img/";
  }

  return {
    init,
    img,
    lang,
    setLang,
    t,
    company,
    inventory,
    item,
    byType,
    cities,
    faqs,
    testimonials,
    types,
    upsertItem,
    removeItem,
    bookings,
    addBooking,
    updateBooking,
    login,
    session,
    logout,
    wish,
    toggleWish,
    waUrl,
    inr,
    statusLabel,
    typeLabel,
    titleOf,
    descOf,
    counts,
    assetBase,
    catalog: () => catalog
  };
})();
