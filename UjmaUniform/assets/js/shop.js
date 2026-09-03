const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const inr = UjmaDB.inr;
const colorOf = (id) => COLORS.find((c) => c.id === id) || { name: id, hex: "#ccc" };

const cartKey = "ujma_shop_cart";
let screen = "home";
let cat = "all";
let colorFilter = null;
let productId = null;
let pickColor = null;
let pickSize = "M";
let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");

function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  $("#cartCount").textContent = cart.reduce((n, i) => n + i.qty, 0);
}
function toast(m) {
  const t = $("#toast");
  t.textContent = m;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1700);
}
function catalog() {
  return UjmaDB.publishedProducts();
}
function filtered() {
  let list = catalog();
  if (cat && cat !== "all") list = list.filter((p) => p.cat === cat || p.gender === cat);
  if (colorFilter) list = list.filter((p) => (p.colors || []).includes(colorFilter));
  return list;
}

function card(p) {
  return `<article class="pcard" data-p="${p.id}">
    <div class="ph" style="background-image:url('${p.img}')">${p.badge ? `<span class="badge">${p.badge}</span>` : ""}</div>
    <div class="meta">
      <div class="line">${p.line}</div>
      <h3>${p.name}</h3>
      <div class="stars">★ ${p.rating || 5} · ${p.reviews || 0}</div>
      <div class="price">${inr(p.price)} <s>${inr(p.mrp)}</s></div>
    </div>
  </article>`;
}

function home() {
  const list = catalog();
  const best = list.filter((p) => p.badge === "Bestseller" || p.line === "Classic").slice(0, 8);
  const stretch = list.filter((p) => p.line === "StretchFlex");
  return `
    <section class="hero"><div class="wrap hero-inner">
      <div class="kicker">New season · StretchFlex</div>
      <h1>Uniforms built for a 14-hour shift.</h1>
      <p>Medical scrubs, lab coats, hospitality and school wear. Lab-tested fabric, free delivery over ₹999, COD and EMI.</p>
      <button class="btn btn-light" data-go="shop">Shop the catalog</button>
    </div></section>
    <div class="trust">
      ${TRUST.map((t) => `<div><b>${t.label}</b><span>${t.sub}</span></div>`).join("")}
    </div>
    <section><div class="wrap">
      <div class="sec-h"><h2>Shop by category</h2></div>
      <div class="cats">
        ${CATEGORIES.map((c) => `<button class="cat" style="background:${c.tone};${c.dark ? "color:#0C1F36" : ""}" data-go="shop" data-cat="${c.id}"><b>${c.name}</b><span>${c.sub}</span></button>`).join("")}
      </div>
    </div></section>
    <section style="background:var(--ivory)"><div class="wrap">
      <div class="sec-h"><h2>Shop by colour</h2></div>
      <div class="colors">
        ${COLORS.map((c) => `<button class="color" data-go="shop" data-color="${c.id}"><span class="sw" style="background:${c.hex}"></span>${c.name}</button>`).join("")}
      </div>
    </div></section>
    <section><div class="wrap">
      <div class="sec-h"><h2>Classic scrubs</h2><button data-go="shop" data-cat="women">Shop all</button></div>
      <div class="grid">${best.map(card).join("")}</div>
    </div></section>
    <section style="background:var(--ivory)"><div class="wrap">
      <div class="sec-h"><h2>StretchFlex</h2><span class="muted">4-way stretch · recycled PET</span></div>
      <div class="grid">${stretch.map(card).join("")}</div>
    </div></section>`;
}

function shop() {
  const list = filtered();
  return `<section><div class="wrap">
    <div class="sec-h"><h2>${cat === "all" ? "All uniforms" : (CATEGORIES.find((c) => c.id === cat)?.name || cat)}</h2><span class="muted">${list.length} styles</span></div>
    <div class="filters">
      <button class="chip ${cat === "all" ? "on" : ""}" data-cat="all">All</button>
      ${CATEGORIES.map((c) => `<button class="chip ${cat === c.id ? "on" : ""}" data-cat="${c.id}">${c.name}</button>`).join("")}
    </div>
    <div class="grid">${list.map(card).join("") || "<p>No styles in this filter.</p>"}</div>
  </div></section>`;
}

function pdp() {
  const p = catalog().find((x) => x.id === productId) || catalog()[0];
  pickColor = pickColor || p.colors[0];
  pickSize = p.sizes.includes(pickSize) ? pickSize : p.sizes[0];
  const col = colorOf(pickColor);
  const stock = UjmaDB.stockOf(p.id, pickColor, pickSize);
  return `<section><div class="wrap pdp-grid">
    <div class="pdp-img" style="background-image:url('${p.img}')"></div>
    <div>
      <button class="chip" data-go="shop">← Back to shop</button>
      <div class="line" style="margin-top:1rem">${p.line} · ${p.gender}</div>
      <h1 style="font-family:var(--display);font-size:2rem;margin:.3rem 0">${p.name}</h1>
      <div class="stars">★ ${p.rating} · ${(p.reviews || 0).toLocaleString("en-IN")} reviews</div>
      <div class="price" style="font-size:1.4rem;margin:12px 0">${inr(p.price)} <s>${inr(p.mrp)}</s></div>
      <p style="color:var(--muted);margin-bottom:12px">${p.fabric}</p>
      <p style="font-weight:700;font-size:.85rem;margin-bottom:6px">Colour · ${col.name}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
        ${p.colors.map((c) => `<button class="swatch-btn ${pickColor === c ? "on" : ""}" style="background:${colorOf(c).hex}" data-pc="${c}"></button>`).join("")}
      </div>
      <p style="font-weight:700;font-size:.85rem;margin-bottom:6px">Size · ${pickSize} <span class="muted">· ${stock} in warehouse</span></p>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">
        ${p.sizes.map((s) => `<button class="size-btn ${pickSize === s ? "on" : ""}" data-ps="${s}">${s}</button>`).join("")}
      </div>
      <button class="btn btn-navy" id="addCart" ${stock < 1 ? "disabled" : ""}>${stock < 1 ? "Out of stock" : "Add to bag"}</button>
      <p style="font-size:.8rem;color:var(--muted);margin-top:10px">Orders sync to Admin → Orders. Inventory decrements on checkout.</p>
    </div>
  </div></section>`;
}

function checkout() {
  const sub = cart.reduce((n, i) => n + i.price * i.qty, 0);
  const set = UjmaDB.get().settings;
  const ship = sub >= set.freeShip ? 0 : set.shipFee;
  return `<div class="checkout wrap">
    <h1 style="font-family:var(--display);margin-bottom:1rem">Checkout</h1>
    ${cart.map((i) => `<div class="ci"><div class="t" style="background-image:url('${i.img}')"></div>
      <div><b>${i.name}</b><div class="muted">${colorOf(i.color).name} · ${i.size} · ×${i.qty}</div></div>
      <b>${inr(i.price * i.qty)}</b></div>`).join("")}
    <p style="margin:1rem 0"><b>Total ${inr(sub + ship)}</b> <span class="muted">incl. delivery ${ship ? inr(ship) : "free"}</span></p>
    <form id="coForm">
      <div class="field"><label>Name</label><input name="name" required value="Dr. Ananya Mehta" /></div>
      <div class="field"><label>Phone</label><input name="phone" required value="9876544001" /></div>
      <div class="field"><label>Address</label><input name="line" required value="12, Park Street, Bandra West" /></div>
      <div class="field"><label>City</label><input name="city" required value="Mumbai" /></div>
      <div class="field"><label>PIN</label><input name="pin" required value="400050" /></div>
      <div class="field"><label>Pay</label>
        <select name="pay"><option value="upi">UPI</option><option value="cod">Cash on delivery</option><option value="card">Card</option><option value="emi">EMI</option></select>
      </div>
      <button class="btn btn-teal" type="submit">Place order</button>
    </form>
  </div>`;
}

function success(order) {
  return `<div class="checkout wrap" style="text-align:center;padding:4rem 0">
    <h1 style="font-family:var(--display)">Order ${order.id}</h1>
    <p>Thank you. Ops can pack this from Admin → Orders.</p>
    <p class="muted">Track in the iPhone app or ask admin to assign a courier.</p>
    <button class="btn btn-navy" data-go="home" style="margin-top:1rem">Continue shopping</button>
    <a class="btn btn-ghost" href="../admin/index.html" style="margin-left:.5rem">Open admin</a>
  </div>`;
}

function bulk() {
  return `<section><div class="wrap" style="max-width:640px">
    <h1 style="font-family:var(--display);margin-bottom:.4rem">Bulk &amp; institutions</h1>
    <p class="muted" style="margin-bottom:1.2rem">Hospitals, schools and hotels — embroidery, size sets, sample before bulk. Requests land in Admin → B2B quotes.</p>
    <form id="bulkForm">
      <div class="field"><label>Institution</label><input name="org" required placeholder="City Hospital" /></div>
      <div class="field"><label>Your name</label><input name="name" required /></div>
      <div class="field"><label>Phone</label><input name="phone" required /></div>
      <div class="field"><label>Need</label>
        <select name="need">
          <option>Medical scrubs (50+)</option>
          <option>Lab coats</option>
          <option>School uniforms</option>
          <option>Hotel / chef</option>
        </select>
      </div>
      <div class="field"><label>Notes</label><input name="notes" placeholder="Colours, embroidery, city" /></div>
      <button class="btn btn-navy" type="submit">Request quote</button>
    </form>
  </div></section>`;
}

let lastOrder = null;
function render() {
  const html = screen === "shop" ? shop() : screen === "pdp" ? pdp() : screen === "checkout" ? checkout() : screen === "success" ? success(lastOrder) : screen === "bulk" ? bulk() : home();
  $("#app").innerHTML = html;
  bind();
  saveCart();
}

function go(to, opts = {}) {
  screen = to;
  if (opts.cat) cat = opts.cat;
  if (opts.color) { colorFilter = opts.color; cat = "all"; }
  if (opts.id) { productId = opts.id; pickColor = null; }
  if (to === "shop" && !opts.color && opts.cat === undefined && opts.fromNav) colorFilter = null;
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
}

function bind() {
  $$("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go, { cat: b.dataset.cat, color: b.dataset.color })));
  $$("[data-cat]").forEach((b) => {
    if (b.dataset.go) return;
    b.addEventListener("click", (e) => { e.preventDefault(); cat = b.dataset.cat; colorFilter = null; go("shop"); });
  });
  $$("[data-p]").forEach((b) => b.addEventListener("click", () => go("pdp", { id: b.dataset.p })));
  $$("[data-pc]").forEach((b) => b.addEventListener("click", () => { pickColor = b.dataset.pc; render(); }));
  $$("[data-ps]").forEach((b) => b.addEventListener("click", () => { pickSize = b.dataset.ps; render(); }));
  $("#addCart")?.addEventListener("click", () => {
    const p = catalog().find((x) => x.id === productId);
    const key = `${p.id}|${pickColor}|${pickSize}`;
    const hit = cart.find((i) => i.key === key);
    if (hit) hit.qty += 1;
    else cart.push({ key, id: p.id, name: p.name, price: p.price, color: pickColor, size: pickSize, qty: 1, img: p.img });
    saveCart();
    toast("Added to bag");
    renderCart();
    openCart();
  });
  $("#coForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cart.length) return;
    const fd = new FormData(e.target);
    lastOrder = UjmaDB.createOrder({
      pay: fd.get("pay"),
      customer: { name: fd.get("name"), phone: fd.get("phone"), city: fd.get("city") },
      address: { line: fd.get("line"), city: fd.get("city"), pin: fd.get("pin"), phone: fd.get("phone") },
      items: cart
    });
    cart = [];
    saveCart();
    go("success");
  });
  $("#bulkForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    UjmaDB.saveQuote({ org: fd.get("org"), name: fd.get("name"), phone: fd.get("phone"), need: fd.get("need"), notes: fd.get("notes"), status: "new" });
    toast("Quote sent to Admin → B2B");
    e.target.reset();
  });
}

function renderCart() {
  const sub = cart.reduce((n, i) => n + i.price * i.qty, 0);
  $("#cart").innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <h2>Bag</h2><button class="chip" id="closeCart">Close</button>
    </div>
    ${cart.length ? cart.map((i) => `<div class="ci">
      <div class="t" style="background-image:url('${i.img}')"></div>
      <div><b>${i.name}</b><div class="muted">${colorOf(i.color).name} · ${i.size}</div>
        <button class="chip" data-rm="${i.key}">Remove</button></div>
      <div><b>${inr(i.price * i.qty)}</b><div>×${i.qty}</div></div>
    </div>`).join("") : "<p class='muted'>Your bag is empty.</p>"}
    ${cart.length ? `<p style="margin:1rem 0"><b>${inr(sub)}</b></p><button class="btn btn-navy" style="width:100%" id="toCheckout">Checkout</button>` : ""}`;
  $("#closeCart")?.addEventListener("click", closeCart);
  $("#toCheckout")?.addEventListener("click", () => { closeCart(); go("checkout"); });
  $$("[data-rm]").forEach((b) => b.addEventListener("click", () => { cart = cart.filter((i) => i.key !== b.dataset.rm); saveCart(); renderCart(); }));
}
function openCart() { renderCart(); $("#cart").classList.add("show"); $("#bg").classList.add("show"); }
function closeCart() { $("#cart").classList.remove("show"); $("#bg").classList.remove("show"); }

$("#openCart").addEventListener("click", openCart);
$("#bg").addEventListener("click", closeCart);
$("#menuBtn").addEventListener("click", () => $("#nav").classList.toggle("open"));
$$("#nav a, .footer a").forEach((a) => a.addEventListener("click", (e) => {
  if (a.dataset.cat) { e.preventDefault(); cat = a.dataset.cat; go("shop"); $("#nav").classList.remove("open"); }
  if (a.getAttribute("href") === "#bulk") { e.preventDefault(); go("bulk"); }
}));

saveCart();
render();
window.addEventListener("ujma-db", () => render());
window.addEventListener("hashchange", () => {
  if (location.hash === "#shop") go("shop");
  if (location.hash === "#bulk") go("bulk");
  if (location.hash === "#home") go("home");
});
if (location.hash === "#shop") go("shop");
if (location.hash === "#bulk") go("bulk");
