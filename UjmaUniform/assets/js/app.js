/* Ujma Uniform — interactive iPhone ecommerce demo */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const colorOf = (id) => COLORS.find((c) => c.id === id);
const catalog = () => (window.UjmaDB ? UjmaDB.publishedProducts() : PRODUCTS);
const product = (id) => catalog().find((p) => p.id === id);

const ICO = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1z"/></svg>',
  shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.2"/><path d="M5 19c1.2-3.2 3.6-5 7-5s5.8 1.8 7 5"/></svg>',
  back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 5 8 12l7 7"/></svg>',
  heart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.4-9-9.2C1.8 7.6 4 5 7 5c1.8 0 3.2 1 4 2.4C11.8 6 13.2 5 15 5c3 0 5.2 2.6 4 5.8C19 15.6 12 20 12 20z"/></svg>'
};

const state = {
  screen: "home",
  stack: [],
  tab: "home",
  cart: JSON.parse(localStorage.getItem("ujma_cart") || "[]"),
  wish: JSON.parse(localStorage.getItem("ujma_wish") || "[]"),
  user: JSON.parse(localStorage.getItem("ujma_user") || "null"),
  orders: JSON.parse(localStorage.getItem("ujma_orders") || "[]"),
  filter: { cat: "all", color: null, sort: "popular" },
  productId: (window.UjmaDB ? UjmaDB.publishedProducts()[0] : PRODUCTS[0]).id,
  color: (window.UjmaDB ? UjmaDB.publishedProducts()[0] : PRODUCTS[0]).colors[0],
  size: "M",
  search: "",
  coupon: null,
  useCredits: false,
  pay: "upi",
  address: {
    name: "Dr. Ananya Mehta",
    phone: "9876544001",
    line: "12, Park Street, Bandra West",
    city: "Mumbai",
    pin: "400050"
  }
};

function persist() {
  localStorage.setItem("ujma_cart", JSON.stringify(state.cart));
  localStorage.setItem("ujma_wish", JSON.stringify(state.wish));
  localStorage.setItem("ujma_user", JSON.stringify(state.user));
  localStorage.setItem("ujma_orders", JSON.stringify(state.orders));
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1800);
}

function cartCount() {
  return state.cart.reduce((n, i) => n + i.qty, 0);
}
function cartSubtotal() {
  return state.cart.reduce((n, i) => n + i.price * i.qty, 0);
}

function setStatus(light) {
  $("#statusBar").classList.toggle("light", !!light);
}

function wished(id) {
  return state.wish.includes(id);
}
function toggleWish(id) {
  if (wished(id)) state.wish = state.wish.filter((x) => x !== id);
  else state.wish.push(id);
  persist();
  toast(wished(id) ? "Saved to wishlist" : "Removed from wishlist");
  render();
}

function addToCart(p, color, size, qty = 1) {
  const key = `${p.id}-${color}-${size}`;
  const hit = state.cart.find((i) => i.key === key);
  if (hit) hit.qty += qty;
  else state.cart.push({ key, id: p.id, name: p.name, price: p.price, color, size, qty, img: p.img });
  persist();
  toast("Added to bag");
  renderTabbar();
}

/* ---------------- screens ---------------- */

function go(screen, opts = {}) {
  if (screen === "checkout" && !state.cart.length) screen = "cart";
  if (opts.push !== false && state.screen !== screen) state.stack.push(state.screen);
  state.screen = screen;
  if (opts.tab) state.tab = opts.tab;
  if (opts.productId) {
    state.productId = opts.productId;
    const p = product(opts.productId);
    state.color = p.colors[0];
    state.size = p.sizes.includes("M") ? "M" : p.sizes[0];
  }
  if (opts.cat) state.filter.cat = opts.cat;
  if (opts.color) state.filter.color = opts.color;
  const h = "#" + screen;
  if (location.hash !== h) history.replaceState(null, "", h);
  render();
}

function back() {
  const prev = state.stack.pop() || "home";
  state.screen = prev;
  render();
}

function filteredProducts() {
  let list = catalog().slice();
  const { cat, color, sort } = state.filter;
  if (cat && cat !== "all") list = list.filter((p) => p.cat === cat || p.gender === cat);
  if (color) list = list.filter((p) => p.colors.includes(color));
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter((p) =>
      (p.name + p.line + p.fabric + p.colors.join(" ")).toLowerCase().includes(q)
    );
  }
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "new") list.sort((a, b) => (b.badge === "New") - (a.badge === "New"));
  else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
  return list;
}

function cardHTML(p, wide = false) {
  const c0 = colorOf(p.colors[0]);
  return `
    <article class="p-card" data-open="${p.id}">
      <div class="ph" style="background-image:url('${p.img}');${wide ? "height:160px" : ""}">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <button class="heart ${wished(p.id) ? "on" : ""}" data-wish="${p.id}">${ICO.heart}</button>
      </div>
      <div class="p-meta">
        <div class="line">${p.line}</div>
        <h4>${p.name}</h4>
        <div class="stars">★ ${p.rating} <span class="muted">(${p.reviews})</span></div>
        <div class="price">${inr(p.price)} <s>${inr(p.mrp)}</s></div>
        <div class="dots">${p.colors.slice(0, 5).map((c) => `<span class="dot" style="background:${colorOf(c).hex}"></span>`).join("")}${p.colors.length > 5 ? `<span class="tiny muted">+${p.colors.length - 5}</span>` : ""}</div>
      </div>
    </article>`;
}

function nav(title, extra = "") {
  return `<div class="nav-row pad">
    <button class="icon-btn" data-back>${ICO.back}</button>
    <div class="title">${title}</div>
    ${extra || '<span style="width:36px"></span>'}
  </div>`;
}

function screenHome() {
  setStatus(false);
  const best = catalog().filter((p) => p.badge === "Bestseller" || p.line === "Classic").slice(0, 6);
  const stretch = catalog().filter((p) => p.line === "StretchFlex");
  return `
    <div class="large-title">Ujma</div>
    <button class="search-pill" data-go="search">${ICO.search}<span>Search scrubs, lab coats, colours</span></button>
    <div class="promo">
      <div class="tag">New season · StretchFlex</div>
      <h2>Uniforms built for a 14-hour shift.</h2>
      <p>4-way stretch, lab-tested fabric. Free delivery over ₹999.</p>
      <button class="cta" data-go="shop" data-cat="women">Shop StretchFlex</button>
    </div>
    <div class="trust-strip">
      ${TRUST.map((t) => `<div class="trust"><b>${t.label}</b><span>${t.sub}</span></div>`).join("")}
    </div>
    <div class="sec-head"><h3>Shop by category</h3><button data-go="shop">See all</button></div>
    <div class="cat-scroll">
      ${CATEGORIES.map((c) => `
        <button class="cat-card ${c.dark ? "light" : ""}" style="background:${c.tone}" data-go="shop" data-cat="${c.id}">
          <b>${c.name}</b><span>${c.sub}</span>
        </button>`).join("")}
    </div>
    <div class="sec-head"><h3>Shop by colour</h3></div>
    <div class="h-scroll">
      ${COLORS.map((c) => `
        <button class="color-chip" data-go="shop" data-color="${c.id}">
          <div class="swatch" style="background:${c.hex}"></div>
          <span>${c.name}</span>
        </button>`).join("")}
    </div>
    <div class="sec-head"><h3>Classic scrubs</h3><button data-go="shop" data-cat="women">Shop</button></div>
    <div class="h-scroll">${best.map((p) => cardHTML(p)).join("")}</div>
    <div class="sec-head"><h3>StretchFlex</h3><span class="tiny muted">Engineered 4-way stretch</span></div>
    <div class="h-scroll">${stretch.map((p) => cardHTML(p)).join("")}</div>
    <div class="sec-head"><h3>Seen in Ujma</h3></div>
    <div class="h-scroll">
      ${REVIEWS.map((r) => `<div class="review-card"><div class="stars">${"★".repeat(r.stars)}</div><p>“${r.text}”</p><b>${r.name}</b><br><span>${r.role}</span></div>`).join("")}
    </div>
    <div class="pad" style="padding-bottom:8px">
      <div class="ios-list" style="margin:0">
        <button class="ios-row" data-go="bulk"><span class="ico-sq" style="background:#1B365D">B</span> Bulk &amp; institutions <span class="chev">›</span></button>
        <button class="ios-row" data-go="stores"><span class="ico-sq" style="background:#0E7A72">S</span> Store locator <span class="chev">›</span></button>
        <button class="ios-row" data-go="help"><span class="ico-sq" style="background:#7A2436">?</span> Help &amp; FAQs <span class="chev">›</span></button>
      </div>
    </div>`;
}

function screenShop() {
  setStatus(false);
  const list = filteredProducts();
  return `
    <div class="large-title">Shop</div>
    <button class="search-pill" data-go="search">${ICO.search}<span>${state.search || "Search the catalog"}</span></button>
    <div class="filter-row">
      <button class="chip ${state.filter.cat === "all" ? "on" : ""}" data-filter-cat="all">All</button>
      ${CATEGORIES.map((c) => `<button class="chip ${state.filter.cat === c.id ? "on" : ""}" data-filter-cat="${c.id}">${c.name}</button>`).join("")}
      <button class="chip" data-sheet="sort">Sort</button>
      <button class="chip ${state.filter.color ? "on" : ""}" data-sheet="color">Colour</button>
    </div>
    <p class="tiny muted pad" style="margin-bottom:8px">${list.length} styles · Free delivery over ₹999</p>
    <div class="grid-2">${list.map((p) => cardHTML(p)).join("") || '<p class="empty">No matches. Clear filters.</p>'}</div>`;
}

function screenSearch() {
  setStatus(false);
  const list = state.search ? filteredProducts() : [];
  return `
    ${nav("Search")}
    <div class="search-pill">
      ${ICO.search}
      <input id="searchInput" placeholder="Scrubs, lab coat, navy, chef…" value="${state.search}" autofocus />
    </div>
    ${!state.search ? `
      <div class="sec-head"><h3>Trending</h3></div>
      <div class="filter-row">${TRENDING.map((t) => `<button class="chip" data-q="${t}">${t}</button>`).join("")}</div>
      <div class="sec-head"><h3>Jump to</h3></div>
      <div class="ios-list">
        ${CATEGORIES.map((c) => `<button class="ios-row" data-go="shop" data-cat="${c.id}">${c.name}<span class="chev">›</span></button>`).join("")}
      </div>` : `
      <div class="grid-2">${list.map((p) => cardHTML(p)).join("") || '<div class="empty"><h3>No results</h3><p>Try navy, StretchFlex, lab coat</p></div>'}</div>`}`;
}

function screenPDP() {
  const p = product(state.productId);
  const col = colorOf(state.color) || colorOf(p.colors[0]);
  setStatus(true);
  return `
    <div class="pdp-hero" style="background-image:linear-gradient(180deg,rgba(0,0,0,.25),transparent 30%),url('${p.img}')">
      <div class="nav-float">
        <button class="icon-btn" data-back>${ICO.back}</button>
        <button class="icon-btn heart ${wished(p.id) ? "on" : ""}" data-wish="${p.id}">${ICO.heart}</button>
      </div>
    </div>
    <div class="pdp-body">
      <div class="line" style="color:var(--teal);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase">${p.line} · ${p.gender}</div>
      <h2 style="font-family:var(--display);font-size:1.45rem;margin:4px 0 6px">${p.name}</h2>
      <div class="stars">★ ${p.rating} · ${p.reviews.toLocaleString("en-IN")} reviews ${p.badge ? `· <span class="badge">${p.badge}</span>` : ""}</div>
      <div class="price" style="margin:10px 0 4px;font-size:1.2rem">${inr(p.price)} <s>${inr(p.mrp)}</s></div>
      <p class="tiny muted">Inclusive of GST · EMI from ₹${Math.round(p.price / 6)}/mo</p>
      <p style="font-size:.85rem;margin:10px 0;color:#444">${p.fabric}</p>
      <div class="feat-pills">${p.features.map((f) => `<span>${f}</span>`).join("")}</div>
      <p style="font-size:.78rem;font-weight:700;margin:8px 0 6px">Colour · ${col.name}</p>
      <div class="row">${p.colors.map((c) => `<button class="swatch-btn ${state.color === c ? "on" : ""}" style="background:${colorOf(c).hex}" data-color-pick="${c}" title="${colorOf(c).name}"></button>`).join("")}</div>
      <div class="between" style="margin:14px 0 6px"><p style="font-size:.78rem;font-weight:700">Size · ${state.size}</p><button class="tiny" style="background:none;border:0;color:var(--teal);font-weight:700" data-sheet="size">Size chart</button></div>
      <div class="row" style="flex-wrap:wrap">${p.sizes.map((s) => `<button class="size-btn ${state.size === s ? "on" : ""}" data-size="${s}">${s}</button>`).join("")}</div>
      <div class="sticky-buy">
        <button class="btn btn-white" data-wish="${p.id}">Wishlist</button>
        <button class="btn btn-navy" id="addBag">Add to bag</button>
      </div>
      <div class="ios-list" style="margin:16px 0 0">
        <button class="ios-row" data-sheet="size">Size &amp; fit <span class="chev">›</span></button>
        <button class="ios-row" data-go="help">Shipping &amp; returns <span class="chev">›</span></button>
      </div>
      <h3 style="margin:16px 0 8px;font-size:1rem">Reviews</h3>
      ${REVIEWS.slice(0, 3).map((r) => `<div class="review-card" style="min-width:0;margin-bottom:8px"><div class="stars">${"★".repeat(r.stars)}</div><p>“${r.text}”</p><b>${r.name}</b> · <span>${r.role}</span></div>`).join("")}
    </div>`;
}

function screenCart() {
  setStatus(false);
  if (!state.cart.length) {
    return `${nav("Bag")}<div class="empty"><h3>Your bag is empty</h3><p>Scrubs, lab coats and uniforms are waiting.</p><button class="btn btn-navy" data-go="shop" style="margin-top:12px">Continue shopping</button></div>`;
  }
  const sub = cartSubtotal();
  const ship = sub >= 999 ? 0 : 79;
  const disc = state.coupon === "UJMA10" ? Math.round(sub * 0.1) : 0;
  const cred = state.useCredits && state.user ? Math.min(BRAND.credits, sub - disc) : 0;
  const total = Math.max(0, sub + ship - disc - cred);
  return `
    ${nav("Bag")}
    ${state.cart.map((i) => `
      <div class="cart-item">
        <div class="thumb" style="background-image:url('${i.img}')"></div>
        <div>
          <b style="font-size:.82rem">${i.name}</b>
          <p class="tiny muted">${colorOf(i.color)?.name || i.color} · ${i.size}</p>
          <div class="qty">
            <button data-qty="${i.key}|-1">−</button>
            <span>${i.qty}</span>
            <button data-qty="${i.key}|1">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <b>${inr(i.price * i.qty)}</b>
          <button class="tiny" style="display:block;margin-top:8px;background:none;border:0;color:var(--danger)" data-remove="${i.key}">Remove</button>
        </div>
      </div>`).join("")}
    <div class="ios-list">
      <button class="ios-row" data-sheet="coupon">Apply coupon ${state.coupon ? `<span class="badge teal">${state.coupon}</span>` : ""}<span class="chev">›</span></button>
      <button class="ios-row" data-toggle-credits>${state.useCredits ? "Using" : "Use"} store credits (₹${BRAND.credits})<span class="chev">›</span></button>
    </div>
    <div class="ios-list">
      <div class="ios-row">Subtotal <span style="margin-left:auto">${inr(sub)}</span></div>
      <div class="ios-row">Delivery <span style="margin-left:auto">${ship ? inr(ship) : "Free"}</span></div>
      ${disc ? `<div class="ios-row">Coupon <span style="margin-left:auto;color:var(--ok)">−${inr(disc)}</span></div>` : ""}
      ${cred ? `<div class="ios-row">Credits <span style="margin-left:auto;color:var(--ok)">−${inr(cred)}</span></div>` : ""}
      <div class="ios-row"><b>Total</b><b style="margin-left:auto">${inr(total)}</b></div>
    </div>
    <div class="pad"><button class="btn btn-navy block" data-go="checkout">Checkout · ${inr(total)}</button></div>`;
}

function screenCheckout() {
  setStatus(false);
  const sub = cartSubtotal();
  const ship = sub >= 999 ? 0 : 79;
  const disc = state.coupon === "UJMA10" ? Math.round(sub * 0.1) : 0;
  const total = Math.max(0, sub + ship - disc);
  const a = state.address;
  return `
    ${nav("Checkout")}
    <div class="sec-head"><h3>Deliver to</h3><button data-go="address">Change</button></div>
    <div class="map-card">
      <b>${a.name}</b>
      <p class="tiny muted">${a.line}, ${a.city} ${a.pin}<br>${a.phone}</p>
    </div>
    <div class="sec-head"><h3>Pay with</h3></div>
    <div class="pad">
      ${[["upi", "UPI · GPay / PhonePe"], ["cod", "Cash on delivery"], ["card", "Credit / debit card"], ["emi", "EMI · from ₹199/mo"]].map(([id, label]) =>
        `<button class="pay-opt ${state.pay === id ? "on" : ""}" data-pay="${id}"><b>${label}</b></button>`).join("")}
    </div>
    <div class="ios-list">
      <div class="ios-row"><b>Payable</b><b style="margin-left:auto">${inr(total)}</b></div>
    </div>
    <div class="pad"><button class="btn btn-teal block" id="placeOrder">Place order</button>
    <p class="tiny muted" style="text-align:center;margin-top:8px">By placing, you agree to Ujma terms. Demo only — no real charge.</p></div>`;
}

function screenSuccess() {
  setStatus(false);
  const last = state.orders[0];
  return `
    <div class="empty" style="padding-top:72px">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--teal);color:#fff;display:grid;place-items:center;margin:0 auto;font-size:1.6rem">✓</div>
      <h3>Order placed</h3>
      <p>Thank you${state.user ? ", " + state.user.name.split(" ")[0] : ""}. We’ll pack your uniforms today.</p>
      <p style="margin:12px 0"><b>${last?.id || "UJ-1001"}</b><br><span class="tiny">Paid via ${(last?.pay || "upi").toUpperCase()}</span></p>
      <button class="btn btn-navy" data-go="track" style="margin:6px">Track order</button>
      <button class="btn btn-white" data-go="home" style="margin:6px">Back home</button>
    </div>`;
}

function screenTrack() {
  setStatus(false);
  const last = state.orders[0];
  const steps = [
    { t: "Order placed", d: "We’ve received your order", on: true },
    { t: "Packed", d: "Quality check + folded", on: !!last },
    { t: "Shipped", d: "Handed to courier", on: false },
    { t: "Out for delivery", d: "Arriving 5–7 pm", on: false },
    { t: "Delivered", d: "Try on & enjoy the shift", on: false }
  ];
  return `
    ${nav("Track order")}
    <div class="map-card">
      <div class="tiny muted">Order ID</div>
      <b>${last?.id || "Place an order to track"}</b>
      <p class="tiny muted" style="margin-top:6px">${last ? last.items.length + " item(s) · " + inr(last.total) : "Demo tracking after checkout"}</p>
    </div>
    <div class="timeline"><div class="tl">
      ${steps.map((s) => `<div class="dot-tl ${s.on ? "on" : ""}"></div><div><h4>${s.t}</h4><p>${s.d}</p></div>`).join("")}
    </div></div>
    <div class="pad"><button class="btn btn-white block" data-go="orders">Order history</button></div>`;
}

function screenWishlist() {
  setStatus(false);
  const list = catalog().filter((p) => wished(p.id));
  return `
    ${nav("Wishlist")}
    ${list.length ? `<div class="grid-2">${list.map((p) => cardHTML(p)).join("")}</div>` :
      `<div class="empty"><h3>No saves yet</h3><p>Tap the heart on any product.</p><button class="btn btn-navy" data-go="shop">Browse</button></div>`}`;
}

function screenAccount() {
  setStatus(false);
  if (!state.user) {
    return `
      <div class="login-hero">
        <div class="tiny" style="opacity:.7">Ujma Club</div>
        <h2>Hi Medico</h2>
        <p class="tiny" style="opacity:.8">Log in to manage orders, rewards, address and bulk quotes.</p>
      </div>
      <div class="pad">
        <div class="field"><label>Mobile</label><input id="phoneIn" type="tel" placeholder="10-digit mobile" value="9876544001" /></div>
        <button class="btn btn-navy block" id="sendOtp">Send OTP</button>
        <p class="tiny muted" style="margin-top:10px;text-align:center">Demo OTP is <b>1234</b></p>
      </div>
      <div class="ios-list">
        <button class="ios-row" data-go="orders">Orders <span class="chev">›</span></button>
        <button class="ios-row" data-go="stores">Store locator <span class="chev">›</span></button>
        <button class="ios-row" data-go="help">Help <span class="chev">›</span></button>
      </div>`;
  }
  return `
    <div class="account-head">
      <div class="tiny" style="opacity:.7">Signed in</div>
      <h2 style="font-family:var(--display);font-size:1.7rem">${state.user.name}</h2>
      <p class="tiny" style="opacity:.75">${state.user.phone}</p>
      <div class="credits">
        <div><div class="tiny">Store credits</div><b>₹${BRAND.credits}</b></div>
        <button class="btn btn-sand" data-go="rewards" style="padding:8px 12px;font-size:.75rem">Ujma Club</button>
      </div>
    </div>
    <div class="ios-list">
      <button class="ios-row" data-go="orders"><span class="ico-sq" style="background:#1B365D">1</span> Orders <span class="chev">›</span></button>
      <button class="ios-row" data-go="wishlist"><span class="ico-sq" style="background:#7A2436">♥</span> Wishlist <span class="chev">›</span></button>
      <button class="ios-row" data-go="address"><span class="ico-sq" style="background:#0E7A72">⌂</span> Addresses <span class="chev">›</span></button>
      <button class="ios-row" data-go="track"><span class="ico-sq" style="background:#C9A227">↗</span> Track order <span class="chev">›</span></button>
      <button class="ios-row" data-go="bulk"><span class="ico-sq" style="background:#3D2A1F">B</span> Bulk / institutions <span class="chev">›</span></button>
      <button class="ios-row" data-go="help"><span class="ico-sq" style="background:#555">?</span> Help &amp; returns <span class="chev">›</span></button>
    </div>
    <div class="pad"><button class="btn btn-white block" id="logout">Log out</button></div>`;
}

function screenLoginOtp() {
  setStatus(false);
  return `
    ${nav("Verify")}
    <div class="pad">
      <h2 style="font-family:var(--display);margin-bottom:6px">Enter OTP</h2>
      <p class="tiny muted">Sent to ${state._phone || "your mobile"}. Use 1234 in this demo.</p>
      <div class="otp">
        <input maxlength="1" class="otp-d" />
        <input maxlength="1" class="otp-d" />
        <input maxlength="1" class="otp-d" />
        <input maxlength="1" class="otp-d" />
      </div>
      <button class="btn btn-navy block" id="verifyOtp">Verify &amp; continue</button>
    </div>`;
}

function screenOrders() {
  setStatus(false);
  if (!state.orders.length) {
    return `${nav("Orders")}<div class="empty"><h3>No orders yet</h3><p>Checkout a scrub set to see history here.</p><button class="btn btn-navy" data-go="shop">Shop</button></div>`;
  }
  return `
    ${nav("Orders")}
    ${state.orders.map((o) => `
      <button class="ios-row" data-go="track" style="margin:0 16px 8px;border-radius:14px;border:1px solid var(--line)">
        <div>
          <b>${o.id}</b>
          <div class="tiny muted">${o.items.length} items · ${o.pay.toUpperCase()} · ${o.status}</div>
        </div>
        <span style="margin-left:auto">${inr(o.total)}</span>
      </button>`).join("")}`;
}

function screenAddress() {
  setStatus(false);
  const a = state.address;
  return `
    ${nav("Address")}
    <div class="pad">
      <div class="field"><label>Name</label><input id="adName" value="${a.name}" /></div>
      <div class="field"><label>Phone</label><input id="adPhone" value="${a.phone}" /></div>
      <div class="field"><label>Address</label><input id="adLine" value="${a.line}" /></div>
      <div class="field"><label>City</label><input id="adCity" value="${a.city}" /></div>
      <div class="field"><label>PIN</label><input id="adPin" value="${a.pin}" /></div>
      <button class="btn btn-navy block" id="saveAddr">Save address</button>
    </div>`;
}

function screenRewards() {
  setStatus(false);
  return `
    ${nav("Ujma Club")}
    <div class="promo">
      <div class="tag">Refer &amp; earn</div>
      <h2>Give 10%, get ₹200 credits.</h2>
      <p>Share your code with the ward, hostel or hospital store.</p>
      <button class="cta" id="copyCode">Copy UJMA-ANANYA</button>
    </div>
    <div class="ios-list">
      <div class="ios-row">Available credits <b style="margin-left:auto">₹${BRAND.credits}</b></div>
      <div class="ios-row">Pending referrals <span style="margin-left:auto">2</span></div>
      <div class="ios-row">Club tier <span style="margin-left:auto">Gold</span></div>
    </div>
    <p class="tiny muted pad">Credits apply at checkout. Demo values only.</p>`;
}

function screenBulk() {
  setStatus(false);
  return `
    ${nav("Bulk & institutions")}
    <div class="promo">
      <div class="tag">Hospitals · Schools · Hotels</div>
      <h2>Uniform the whole team.</h2>
      <p>Embroidery, custom colours, size sets and a sample before you commit.</p>
    </div>
    <div class="pad">
      <div class="field"><label>Institution</label><input id="bOrg" placeholder="City Hospital / DPS / Taj" /></div>
      <div class="field"><label>Contact</label><input id="bName" placeholder="Your name" /></div>
      <div class="field"><label>Phone</label><input id="bPhone" placeholder="Mobile" /></div>
      <div class="field"><label>Requirement</label>
        <select id="bNeed">
          <option>Medical scrubs (50+)</option>
          <option>Lab coats</option>
          <option>School uniforms</option>
          <option>Hotel / chef</option>
          <option>Security / industrial</option>
        </select>
      </div>
      <div class="field"><label>Notes</label><textarea id="bNotes" rows="2" placeholder="Colours, embroidery, delivery city"></textarea></div>
      <button class="btn btn-navy block" id="bulkSend">Request quote</button>
    </div>`;
}

function screenHelp() {
  setStatus(false);
  return `
    ${nav("Help")}
    <div class="pad">
      ${FAQS.map((f, i) => `<div class="faq" data-faq="${i}"><button type="button">${f.q}</button><p>${f.a}</p></div>`).join("")}
    </div>
    <div class="ios-list">
      <div class="ios-row">WhatsApp <span style="margin-left:auto" class="tiny">${BRAND.phone}</span></div>
      <div class="ios-row">Email <span style="margin-left:auto" class="tiny">${BRAND.email}</span></div>
    </div>`;
}

function screenStores() {
  setStatus(false);
  return `
    ${nav("Stores")}
    ${STORES.map((s) => `
      <div class="map-card">
        <b>${s.place}</b>
        <p class="tiny muted">${s.city} · ${s.hours}</p>
        <p style="font-size:.82rem;margin-top:4px">${s.addr}</p>
      </div>`).join("")}`;
}

const SCREENS = {
  home: screenHome,
  shop: screenShop,
  search: screenSearch,
  pdp: screenPDP,
  cart: screenCart,
  checkout: screenCheckout,
  success: screenSuccess,
  track: screenTrack,
  wishlist: screenWishlist,
  account: screenAccount,
  otp: screenLoginOtp,
  orders: screenOrders,
  address: screenAddress,
  rewards: screenRewards,
  bulk: screenBulk,
  help: screenHelp,
  stores: screenStores
};

const TAB_SCREENS = new Set(["home", "shop", "search", "cart", "account"]);

function renderTabbar() {
  const tabs = [
    ["home", "Home", ICO.home],
    ["shop", "Shop", ICO.shop],
    ["search", "Search", ICO.search],
    ["cart", "Bag", ICO.bag],
    ["account", "Account", ICO.user]
  ];
  const hide = !TAB_SCREENS.has(state.screen) && state.screen !== "pdp";
  $("#tabbar").style.display = hide && !["wishlist"].includes(state.screen) ? "grid" : "grid";
  if (["pdp", "checkout", "success", "otp", "address"].includes(state.screen)) {
    $("#tabbar").style.display = "none";
  } else {
    $("#tabbar").style.display = "grid";
  }
  $("#tabbar").innerHTML = tabs.map(([id, label, ico]) => `
    <button class="${state.tab === id || state.screen === id ? "active" : ""}" data-tab="${id}">
      <span class="tab-ico">${ico}${id === "cart" && cartCount() ? `<span class="tab-badge">${cartCount()}</span>` : ""}</span>
      ${label}
    </button>`).join("");
}

function render() {
  const html = (SCREENS[state.screen] || screenHome)();
  const noTab = ["pdp", "checkout", "success", "otp"].includes(state.screen);
  $("#screens").innerHTML = `<section class="screen active ${noTab ? "no-tab" : ""}">${html}</section>`;
  renderTabbar();
  bind();
  if (state.screen === "search") {
    const inp = $("#searchInput");
    if (inp) {
      inp.focus();
      inp.setSelectionRange(inp.value.length, inp.value.length);
    }
  }
}

function openSheet(kind) {
  const el = $("#sheet");
  const bg = $("#sheetBg");
  let inner = `<div class="grab"></div>`;
  if (kind === "sort") {
    inner += `<h3 style="margin-bottom:10px">Sort</h3>` +
      [["popular", "Popular"], ["new", "New arrivals"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["rating", "Top rated"]]
        .map(([id, l]) => `<button class="ios-row" data-sort="${id}">${l}${state.filter.sort === id ? " ✓" : ""}</button>`).join("");
  } else if (kind === "color") {
    inner += `<h3 style="margin-bottom:10px">Colour</h3><div class="row" style="flex-wrap:wrap;gap:10px">` +
      `<button class="chip ${!state.filter.color ? "on" : ""}" data-filter-color="">All</button>` +
      COLORS.map((c) => `<button class="chip ${state.filter.color === c.id ? "on" : ""}" data-filter-color="${c.id}">${c.name}</button>`).join("") +
      `</div>`;
  } else if (kind === "size") {
    inner += `<h3 style="margin-bottom:10px">Size chart (inches)</h3>
      <div class="table-wrap"><table class="chart"><thead><tr>${SIZE_CHART.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${SIZE_CHART.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <p class="tiny muted" style="margin-top:10px">Classic fits true to size. StretchFlex is slightly relaxed. Plus sizes to 3XL.</p>`;
  } else if (kind === "coupon") {
    inner += `<h3 style="margin-bottom:10px">Coupon</h3>
      <div class="field"><input id="couponIn" placeholder="UJMA10" value="${state.coupon || ""}" /></div>
      <button class="btn btn-navy block" id="applyCoupon">Apply</button>
      <p class="tiny muted" style="margin-top:8px">Try UJMA10 for 10% off this demo.</p>`;
  }
  el.innerHTML = inner;
  bg.classList.add("show");
  el.classList.add("show");
}

function closeSheet() {
  $("#sheet").classList.remove("show");
  $("#sheetBg").classList.remove("show");
}

function bind() {
  $$("[data-go]").forEach((b) => b.addEventListener("click", () => {
    go(b.dataset.go, { cat: b.dataset.cat, color: b.dataset.color, tab: TAB_SCREENS.has(b.dataset.go) ? b.dataset.go : state.tab });
  }));
  $$("[data-back]").forEach((b) => b.addEventListener("click", back));
  $$("[data-open]").forEach((b) => b.addEventListener("click", (e) => {
    if (e.target.closest("[data-wish]")) return;
    go("pdp", { productId: b.dataset.open, push: true });
  }));
  $$("[data-wish]").forEach((b) => b.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleWish(b.dataset.wish);
  }));
  $$("[data-filter-cat]").forEach((b) => b.addEventListener("click", () => {
    state.filter.cat = b.dataset.filterCat;
    render();
  }));
  $$("[data-sheet]").forEach((b) => b.addEventListener("click", () => openSheet(b.dataset.sheet)));
  $$("[data-color-pick]").forEach((b) => b.addEventListener("click", () => { state.color = b.dataset.colorPick; render(); }));
  $$("[data-size]").forEach((b) => b.addEventListener("click", () => { state.size = b.dataset.size; render(); }));
  $$("[data-qty]").forEach((b) => b.addEventListener("click", () => {
    const [key, d] = b.dataset.qty.split("|");
    const item = state.cart.find((i) => i.key === key);
    if (!item) return;
    item.qty += Number(d);
    if (item.qty <= 0) state.cart = state.cart.filter((i) => i.key !== key);
    persist();
    render();
  }));
  $$("[data-remove]").forEach((b) => b.addEventListener("click", () => {
    state.cart = state.cart.filter((i) => i.key !== b.dataset.remove);
    persist();
    render();
  }));
  $$("[data-pay]").forEach((b) => b.addEventListener("click", () => { state.pay = b.dataset.pay; render(); }));
  $$("[data-q]").forEach((b) => b.addEventListener("click", () => {
    state.search = b.dataset.q;
    state.filter.cat = "all";
    render();
  }));
  $$("[data-faq]").forEach((el) => el.querySelector("button").addEventListener("click", () => el.classList.toggle("open")));
  $$("[data-toggle-credits]").forEach((b) => b.addEventListener("click", () => {
    if (!state.user) { toast("Log in to use credits"); go("account", { tab: "account" }); return; }
    state.useCredits = !state.useCredits;
    render();
  }));

  const add = $("#addBag");
  if (add) add.addEventListener("click", () => addToCart(product(state.productId), state.color, state.size));

  const inp = $("#searchInput");
  if (inp) {
    inp.addEventListener("input", () => {
      state.search = inp.value.trim();
      state.screen = "search";
      const html = screenSearch();
      $("#screens").innerHTML = `<section class="screen active">${html}</section>`;
      bind();
      const n = $("#searchInput");
      if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); }
    });
  }

  const send = $("#sendOtp");
  if (send) send.addEventListener("click", () => {
    state._phone = $("#phoneIn").value || "9876544001";
    go("otp");
    toast("OTP sent · 1234");
  });
  const ver = $("#verifyOtp");
  if (ver) ver.addEventListener("click", () => {
    const code = $$(".otp-d").map((i) => i.value).join("");
    if (code && code !== "1234") { toast("Use 1234 in this demo"); return; }
    state.user = { name: "Dr. Ananya Mehta", phone: state._phone };
    persist();
    go("account", { tab: "account", push: false });
    toast("Welcome to Ujma Club");
  });
  $$(".otp-d").forEach((inp, i, arr) => {
    inp.addEventListener("input", () => { if (inp.value && arr[i + 1]) arr[i + 1].focus(); });
  });
  const lo = $("#logout");
  if (lo) lo.addEventListener("click", () => { state.user = null; persist(); render(); toast("Logged out"); });

  const save = $("#saveAddr");
  if (save) save.addEventListener("click", () => {
    state.address = {
      name: $("#adName").value, phone: $("#adPhone").value, line: $("#adLine").value,
      city: $("#adCity").value, pin: $("#adPin").value
    };
    toast("Address saved");
    back();
  });

  const place = $("#placeOrder");
  if (place) place.addEventListener("click", () => {
    if (!state.cart.length) return;
    const sub = cartSubtotal();
    const ship = sub >= 999 ? 0 : 79;
    const disc = state.coupon === "UJMA10" ? Math.round(sub * 0.1) : 0;
    const total = Math.max(0, sub + ship - disc);
    let id = "UJ-" + (1000 + state.orders.length + Math.floor(Math.random() * 80));
    if (window.UjmaDB) {
      const o = UjmaDB.createOrder({
        pay: state.pay,
        customer: { name: state.address.name, phone: state.address.phone, city: state.address.city },
        address: state.address,
        items: state.cart,
        discount: disc
      });
      id = o.id;
    }
    state.orders.unshift({
      id, items: state.cart.slice(), total, pay: state.pay, status: "pending",
      at: new Date().toISOString()
    });
    state.cart = [];
    persist();
    go("success", { push: false });
  });

  const bulk = $("#bulkSend");
  if (bulk) bulk.addEventListener("click", () => {
    if (window.UjmaDB) {
      UjmaDB.saveQuote({
        org: $("#bOrg")?.value || "Institution",
        name: $("#bName")?.value || "Contact",
        phone: $("#bPhone")?.value || "",
        need: $("#bNeed")?.value,
        notes: $("#bNotes")?.value,
        status: "new"
      });
    }
    toast("Quote request sent · we’ll call you");
    go("account", { tab: "account" });
  });

  const copy = $("#copyCode");
  if (copy) copy.addEventListener("click", () => {
    navigator.clipboard?.writeText("UJMA-ANANYA");
    toast("Code copied");
  });
}

$("#sheetBg").addEventListener("click", closeSheet);
$("#sheet").addEventListener("click", (e) => {
  const sort = e.target.closest("[data-sort]");
  const col = e.target.closest("[data-filter-color]");
  if (sort) { state.filter.sort = sort.dataset.sort; closeSheet(); render(); }
  if (col) { state.filter.color = col.dataset.filterColor || null; closeSheet(); render(); }
  if (e.target.id === "applyCoupon") {
    const v = ($("#couponIn")?.value || "").toUpperCase().trim();
    state.coupon = v === "UJMA10" ? "UJMA10" : v || null;
    closeSheet();
    toast(state.coupon === "UJMA10" ? "10% off applied" : "Coupon saved");
    render();
  }
});

$("#tabbar").addEventListener("click", (e) => {
  const t = e.target.closest("[data-tab]");
  if (!t) return;
  state.stack = [];
  go(t.dataset.tab, { tab: t.dataset.tab, push: false });
});

function renderFeatures() {
  $("#featureList").innerHTML = FEATURES.map((f) => `
    <article class="feat-block" data-feat="${f.screen}" ${f.href ? `data-href="${f.href}"` : ""}>
      <header>
        <h3>${f.title}</h3>
        <span class="go">View in app →</span>
      </header>
      <ul>${f.items.map((i) => `<li>${i}</li>`).join("")}</ul>
    </article>`).join("");
  $$("[data-feat]").forEach((el) => el.addEventListener("click", () => {
    $$(".feat-block").forEach((x) => x.classList.remove("on"));
    el.classList.add("on");
    if (el.dataset.href) { location.href = el.dataset.href; return; }
    go(el.dataset.feat, { tab: TAB_SCREENS.has(el.dataset.feat) ? el.dataset.feat : "home" });
    $(".iphone")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }));
}

$$("[data-jump]").forEach((b) => b.addEventListener("click", () => {
  go(b.dataset.jump, { tab: TAB_SCREENS.has(b.dataset.jump) ? b.dataset.jump : "home" });
  $(".iphone")?.scrollIntoView({ behavior: "smooth", block: "center" });
}));

function tickClock() {
  const d = new Date();
  $("#clock").textContent = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

tickClock();
setInterval(tickClock, 30000);
renderFeatures();
const initial = location.hash.slice(1);
if (SCREENS[initial]) {
  state.screen = initial;
  if (TAB_SCREENS.has(initial)) state.tab = initial;
}
render();
