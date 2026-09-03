/* Ujma Admin — products, inventory, orders, delivery */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const inr = UjmaDB.inr;
const colorName = (id) => (COLORS.find((c) => c.id === id) || { name: id }).name;

const AUTH = "ujma_admin_ok";
let view = "dash";
let productEdit = null;
let orderId = null;

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

function statusClass(s) {
  return "status s-" + (s || "pending");
}

function go(name, extra) {
  view = name;
  if (extra && extra.product) productEdit = extra.product;
  if (name !== "products") productEdit = extra && extra.product ? extra.product : null;
  $$(".nav-link").forEach((a) => a.classList.toggle("on", a.dataset.view === name));
  $$("#adminTabs [data-view]").forEach((a) => {
    const tab = ["dash", "products", "inventory", "orders"].includes(name) ? name : "more";
    a.classList.toggle("on", a.dataset.view === tab);
  });
  const titles = {
    dash: ["Dashboard", "Orders, stock and delivery at a glance"],
    products: ["Items / products", "Create styles, colours, sizes and publish to the shop"],
    inventory: ["Inventory", "Receive stock, adjust qty, import CSV, low-stock alerts"],
    orders: ["Orders", "Confirm, pack, cancel — every shop order lands here"],
    delivery: ["Delivery", "Assign courier, AWB, out-for-delivery, mark delivered"],
    customers: ["Customers", "Retail + hospital / school accounts"],
    quotes: ["B2B quotes", "Bulk embroidery and institution requests"],
    coupons: ["Coupons", "Sitewide and B2B discount codes"],
    settings: ["Settings", "Shipping, warehouse, GST"],
    more: ["More", "Delivery, customers, quotes, coupons"]
  };
  $("#pageTitle").textContent = titles[name][0];
  $("#pageSub").textContent = titles[name][1];
  render();
  location.hash = name;
}

function kpisBar() {
  const k = UjmaDB.kpis();
  const badge = $("#navPending");
  if (badge) badge.textContent = k.pending;
  return `
    <div class="kpis">
      <div class="kpi"><span>Revenue</span><strong>${inr(k.revenue)}</strong><em>${k.orders} orders</em></div>
      <div class="kpi"><span>To pack / ship</span><strong>${k.pending + k.ship}</strong><em>${k.pending} new · ${k.ship} in transit</em></div>
      <div class="kpi"><span>Customers</span><strong>${k.customers}</strong><em>${k.products} live styles</em></div>
      <div class="kpi"><span>Low stock SKUs</span><strong>${k.low}</strong><em>Below 8 units</em></div>
    </div>`;
}

function viewDash() {
  const db = UjmaDB.get();
  const recent = db.orders.slice(0, 6);
  const low = db.inventory.filter((r) => r.qty < 8).slice(0, 6);
  return kpisBar() + `
    <div class="grid-2">
      <div class="card">
        <h2>Recent orders</h2>
        <table><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
        <tbody>${recent.map((o) => `<tr>
          <td><b>${o.id}</b></td><td>${o.customer?.name || "—"}</td>
          <td><span class="${statusClass(o.status)}">${o.status.replaceAll("_", " ")}</span></td>
          <td>${inr(o.total)}</td>
        </tr>`).join("")}</tbody></table>
        <button class="btn btn-ghost btn-sm" data-view="orders" style="margin-top:.7rem">Open orders</button>
      </div>
      <div class="card">
        <h2>Low stock — receive soon</h2>
        <table><thead><tr><th>Item</th><th>Variant</th><th>Qty</th></tr></thead>
        <tbody>${low.map((r) => {
          const p = db.products.find((x) => x.id === r.productId);
          return `<tr><td>${p?.name || r.productId}</td><td>${colorName(r.color)} · ${r.size}</td><td class="low">${r.qty}</td></tr>`;
        }).join("") || "<tr><td colspan='3'>All healthy</td></tr>"}</tbody></table>
        <button class="btn btn-teal btn-sm" data-view="inventory" style="margin-top:.7rem">Upload inventory</button>
      </div>
    </div>`;
}

function viewProducts() {
  const db = UjmaDB.get();
  const list = db.products.filter((p) => p.active !== false);
  if (productEdit === "new" || (productEdit && productEdit !== "new")) {
    const p = productEdit === "new" ? {
      id: "", name: "", sku: "", line: "Classic", gender: "women", cat: "women",
      price: 1099, mrp: 1499, cost: 480, fabric: "", badge: "", img: "",
      colors: ["navy"], sizes: ["S", "M", "L", "XL"], features: [], minStock: 8, sellable: true
    } : db.products.find((x) => x.id === productEdit) || db.products[0];
    return productForm(p, productEdit === "new");
  }
  return `
    <div class="toolbar">
      <input class="grow" id="pSearch" placeholder="Search name, SKU, line…" />
      <button class="btn btn-navy" id="newItem">+ Create item</button>
    </div>
    <div class="card" style="padding:0;overflow:auto">
      <table id="pTable"><thead><tr>
        <th></th><th>Item</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Shop</th><th></th>
      </tr></thead><tbody>
      ${list.map((p) => {
        const qty = db.inventory.filter((r) => r.productId === p.id).reduce((n, r) => n + r.qty, 0);
        return `<tr data-filter="${(p.name + p.sku + p.line).toLowerCase()}">
          <td><img class="thumb" src="${p.img}" alt="" /></td>
          <td><b>${p.name}</b><div class="muted">${p.line} · ${p.gender}</div></td>
          <td>${p.sku || p.id}</td>
          <td>${p.cat}</td>
          <td>${inr(p.price)}</td>
          <td>${qty}</td>
          <td>${p.sellable !== false ? "<span class='badge ok'>Live</span>" : "<span class='badge'>Hidden</span>"}</td>
          <td class="row-actions">
            <button class="btn btn-ghost btn-sm" data-edit="${p.id}">Edit</button>
            <button class="btn btn-danger btn-sm" data-arch="${p.id}">Archive</button>
          </td>
        </tr>`;
      }).join("")}
      </tbody></table>
    </div>`;
}

function productForm(p, isNew) {
  const cks = COLORS.map((c) => `<label style="display:flex;gap:.35rem;align-items:center;font-size:.8rem"><input type="checkbox" name="color" value="${c.id}" ${p.colors?.includes(c.id) ? "checked" : ""}/> ${c.name}</label>`).join("");
  const sizes = (p.sizes || []).join(", ");
  return `
    <button class="btn btn-ghost btn-sm" id="backList">← All items</button>
    <div class="card" style="margin-top:.8rem">
      <h2>${isNew ? "New item" : "Edit item"}</h2>
      <p class="muted" style="margin-bottom:1rem">Published items appear on the web store and iPhone app immediately.</p>
      <form id="itemForm">
        <input type="hidden" name="id" value="${p.id}" />
        <div class="grid-2">
          <div class="field"><label>Name</label><input name="name" required value="${p.name || ""}" /></div>
          <div class="field"><label>SKU</label><input name="sku" value="${p.sku || ""}" placeholder="CW-NAVY" /></div>
        </div>
        <div class="grid-3">
          <div class="field"><label>Line</label><input name="line" value="${p.line || ""}" /></div>
          <div class="field"><label>Category</label>
            <select name="cat">${CATEGORIES.map((c) => `<option value="${c.id}" ${p.cat === c.id ? "selected" : ""}>${c.name}</option>`).join("")}</select>
          </div>
          <div class="field"><label>Gender</label>
            <select name="gender">${["women", "men", "unisex"].map((g) => `<option ${p.gender === g ? "selected" : ""}>${g}</option>`).join("")}</select>
          </div>
        </div>
        <div class="grid-3">
          <div class="field"><label>Sell price ₹</label><input name="price" type="number" value="${p.price || 0}" /></div>
          <div class="field"><label>MRP ₹</label><input name="mrp" type="number" value="${p.mrp || 0}" /></div>
          <div class="field"><label>Cost ₹</label><input name="cost" type="number" value="${p.cost || 0}" /></div>
        </div>
        <div class="field"><label>Fabric / story</label><input name="fabric" value="${p.fabric || ""}" /></div>
        <div class="field"><label>Features (comma separated)</label><input name="features" value="${(p.features || []).join(", ")}" /></div>
        <div class="field"><label>Badge</label><input name="badge" value="${p.badge || ""}" placeholder="Bestseller, New…" /></div>
        <div class="field"><label>Colours</label><div class="chips">${cks}</div></div>
        <div class="field"><label>Sizes (comma)</label><input name="sizes" value="${sizes}" /></div>
        <div class="field"><label>Image URL or upload</label>
          <input name="img" id="imgUrl" value="${p.img || ""}" />
          <input type="file" accept="image/*" id="imgFile" style="margin-top:.4rem" />
          <div class="preview" id="imgPrev" style="background-image:url('${p.img || ""}')"></div>
        </div>
        <label style="display:flex;gap:.5rem;align-items:center;margin:8px 0 14px;font-size:.88rem">
          <input type="checkbox" name="sellable" ${p.sellable !== false ? "checked" : ""} /> Publish on web store &amp; app
        </label>
        <button class="btn btn-navy" type="submit">Save item</button>
      </form>
    </div>`;
}

function viewInventory() {
  const db = UjmaDB.get();
  const rows = db.inventory.map((r) => {
    const p = db.products.find((x) => x.id === r.productId);
    return { ...r, name: p?.name || r.productId, sku: p?.sku || r.productId };
  });
  const low = rows.filter((r) => r.qty < 8).length;
  return `
    ${kpisBar()}
    <div class="card">
      <h2>Receive stock (GRN)</h2>
      <p class="muted" style="margin-bottom:.7rem">Add units to a colour / size. This is how warehouse uploads inventory after a purchase or production.</p>
      <form id="grnForm" class="grid-3">
        <div class="field"><label>Item</label>
          <select name="productId">${db.products.filter((p) => p.active !== false).map((p) => `<option value="${p.id}">${p.name}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Colour</label>
          <select name="color">${COLORS.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Size</label>
          <select name="size">${["XS","S","M","L","XL","XXL","3XL","One size","24","26","28","30","32","34","36"].map((s) => `<option>${s}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Qty in</label><input name="qty" type="number" min="1" value="12" /></div>
        <div class="field" style="align-self:end"><button class="btn btn-teal" type="submit">Receive to warehouse</button></div>
      </form>
    </div>
    <div class="card">
      <h2>Bulk CSV upload</h2>
      <p class="muted">Header required: <code>SKU,Name,Color,Size,Qty</code> — Qty is added to current stock. Colour ids: navy, wine, black…</p>
      <textarea id="csvBox" rows="5" placeholder="SKU,Name,Color,Size,Qty
CW-NAVY,Classic Women's V-Neck Scrub,navy,M,20
CW-NAVY,Classic Women's V-Neck Scrub,wine,L,15"></textarea>
      <button class="btn btn-navy" id="csvBtn" style="margin-top:.6rem">Import CSV</button>
    </div>
    <div class="toolbar">
      <input class="grow" id="invSearch" placeholder="Filter item / colour / size" />
      <span class="muted">${low} SKUs below 8 units</span>
    </div>
    <div class="card" style="padding:0;overflow:auto;max-height:480px">
      <table id="invTable"><thead><tr><th>SKU</th><th>Item</th><th>Variant</th><th>On hand</th><th>Adjust</th></tr></thead>
      <tbody>
      ${rows.slice(0, 180).map((r) => `
        <tr data-filter="${(r.name + r.color + r.size).toLowerCase()}">
          <td>${r.sku}</td>
          <td>${r.name}</td>
          <td>${colorName(r.color)} · ${r.size}</td>
          <td class="${r.qty < 8 ? "low" : ""}">${r.qty}</td>
          <td>
            <button class="btn btn-ghost btn-sm" data-adj="${r.key}|-1">−</button>
            <button class="btn btn-ghost btn-sm" data-adj="${r.key}|1">+</button>
            <button class="btn btn-ghost btn-sm" data-adj="${r.key}|10">+10</button>
          </td>
        </tr>`).join("")}
      </tbody></table>
    </div>`;
}

function viewOrders() {
  const db = UjmaDB.get();
  return `
    <div class="toolbar">
      ${["all", ...UjmaDB.FLOW, "cancelled"].map((s) => `<button class="chip ${s === "all" ? "on" : ""}" data-of="${s}">${s.replaceAll("_", " ")}</button>`).join("")}
    </div>
    <div class="card" style="padding:0;overflow:auto">
      <table id="oTable"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Pay</th><th>Status</th><th>Total</th></tr></thead>
      <tbody>
      ${db.orders.map((o) => `
        <tr data-st="${o.status}" data-open-order="${o.id}" style="cursor:pointer">
          <td><b>${o.id}</b><div class="muted">${new Date(o.createdAt).toLocaleString("en-IN")}</div></td>
          <td>${o.customer?.name}<div class="muted">${o.address?.city || ""}</div></td>
          <td>${o.items.map((i) => i.qty + "× " + i.name.split(" ").slice(0, 3).join(" ")).join("<br>")}</td>
          <td>${(o.pay || "").toUpperCase()}<div class="muted">${o.paymentStatus}</div></td>
          <td><span class="${statusClass(o.status)}">${o.status.replaceAll("_", " ")}</span></td>
          <td><b>${inr(o.total)}</b></td>
        </tr>`).join("")}
      </tbody></table>
    </div>`;
}

function orderDrawer(id) {
  const o = UjmaDB.get().orders.find((x) => x.id === id);
  if (!o) return "";
  const next = UjmaDB.FLOW[UjmaDB.FLOW.indexOf(o.status) + 1];
  return `
    <div class="toolbar"><h2 style="margin:0">${o.id}</h2><button class="btn btn-ghost btn-sm" id="closeDraw">Close</button></div>
    <p><b>${o.customer?.name}</b><br><span class="muted">${o.address?.line}, ${o.address?.city} ${o.address?.pin || ""}<br>${o.address?.phone}</span></p>
    <p style="margin:10px 0"><span class="${statusClass(o.status)}">${o.status.replaceAll("_", " ")}</span> · ${o.pay?.toUpperCase()}</p>
    ${o.items.map((i) => `<div style="display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid var(--line);font-size:.85rem">
      <span>${i.qty}× ${i.name}<br><span class="muted">${colorName(i.color)} · ${i.size}</span></span><b>${inr(i.price * i.qty)}</b>
    </div>`).join("")}
    <p style="margin:12px 0"><b>Total ${inr(o.total)}</b> <span class="muted">(ship ${inr(o.shipping)})</span></p>
    <div class="muted" style="font-size:.78rem;margin-bottom:10px">Timeline</div>
    ${(o.timeline || []).map((t) => `<div class="muted" style="font-size:.78rem">✓ ${t.status.replaceAll("_", " ")} · ${new Date(t.at).toLocaleString("en-IN")}</div>`).join("")}
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:14px">
      ${next ? `<button class="btn btn-teal" data-ost="${o.id}|${next}">Mark ${next.replaceAll("_", " ")}</button>` : ""}
      ${o.status !== "cancelled" && o.status !== "delivered" ? `<button class="btn btn-danger" data-ost="${o.id}|cancelled">Cancel & restock</button>` : ""}
      <button class="btn btn-ghost" data-view="delivery">Assign delivery →</button>
    </div>`;
}

function viewDelivery() {
  const db = UjmaDB.get();
  const cols = {
    packed: db.orders.filter((o) => o.status === "packed"),
    shipped: db.orders.filter((o) => o.status === "shipped"),
    out_for_delivery: db.orders.filter((o) => o.status === "out_for_delivery"),
    delivered: db.orders.filter((o) => o.status === "delivered").slice(0, 8)
  };
  const ready = db.orders.filter((o) => ["confirmed", "packed"].includes(o.status));
  return `
    ${kpisBar()}
    <div class="card">
      <h2>Dispatch — assign courier</h2>
      <form id="shipForm" class="grid-3">
        <div class="field"><label>Order</label>
          <select name="id">${ready.map((o) => `<option value="${o.id}">${o.id} · ${o.customer?.name} · ${o.address?.city}</option>`).join("") || "<option>No orders ready</option>"}</select>
        </div>
        <div class="field"><label>Partner</label>
          <select name="partner">${UjmaDB.PARTNERS.map((p) => `<option>${p}</option>`).join("")}</select>
        </div>
        <div class="field"><label>AWB / tracking</label><input name="awb" placeholder="Auto if empty" /></div>
        <div class="field"><label>ETA</label><input name="eta" placeholder="Tomorrow, 6 pm" /></div>
        <div class="field" style="align-self:end"><button class="btn btn-navy" type="submit">Ship &amp; notify</button></div>
      </form>
    </div>
    <div class="kanban">
      ${[["packed", "Ready to ship"], ["shipped", "In transit"], ["out_for_delivery", "Out for delivery"], ["delivered", "Delivered"]].map(([k, lab]) => `
        <div class="pipe">
          <h3>${lab} · ${cols[k].length}</h3>
          ${cols[k].map((o) => `
            <div class="job" data-open-order="${o.id}">
              <b>${o.id}</b>
              <div>${o.customer?.name} · ${o.address?.city}</div>
              <div class="muted">${o.delivery ? o.delivery.partner + " · " + o.delivery.awb : "No AWB yet"}</div>
              ${k === "shipped" ? `<button class="btn btn-teal btn-sm" style="margin-top:6px" data-ost="${o.id}|out_for_delivery">Out for delivery</button>` : ""}
              ${k === "out_for_delivery" ? `<button class="btn btn-navy btn-sm" style="margin-top:6px" data-ost="${o.id}|delivered">Mark delivered</button>` : ""}
            </div>`).join("") || "<p class='muted'>Empty</p>"}
        </div>`).join("")}
    </div>`;
}

function viewCustomers() {
  const db = UjmaDB.get();
  return `<div class="card" style="padding:0;overflow:auto"><table>
    <thead><tr><th>Name</th><th>Phone</th><th>City</th><th>Orders</th><th>Lifetime</th><th></th></tr></thead>
    <tbody>${db.customers.map((c) => `<tr>
      <td><b>${c.name}</b>${c.type === "b2b" ? " <span class='badge'>B2B</span>" : ""}</td>
      <td>${c.phone}</td><td>${c.city || "—"}</td><td>${c.orders}</td><td>${inr(c.spend)}</td>
      <td class="muted">${c.email || ""}</td>
    </tr>`).join("")}</tbody></table></div>`;
}

function viewQuotes() {
  const db = UjmaDB.get();
  return `
    <div class="card" style="padding:0;overflow:auto"><table>
      <thead><tr><th>ID</th><th>Institution</th><th>Need</th><th>Status</th><th></th></tr></thead>
      <tbody>${db.quotes.map((q) => `<tr>
        <td>${q.id}</td><td><b>${q.org}</b><div class="muted">${q.name} · ${q.phone}</div></td>
        <td>${q.need}<div class="muted">${q.notes || ""}</div></td>
        <td><span class="status s-confirmed">${q.status}</span></td>
        <td>
          <button class="btn btn-ghost btn-sm" data-qs="${q.id}|quoted">Mark quoted</button>
          <button class="btn btn-teal btn-sm" data-qs="${q.id}|won">Won</button>
        </td>
      </tr>`).join("")}</tbody></table></div>`;
}

function viewCoupons() {
  const db = UjmaDB.get();
  return `
    <div class="card">
      <h2>New coupon</h2>
      <form id="cForm" class="grid-3">
        <div class="field"><label>Code</label><input name="code" placeholder="NIGHTSHIFT" required /></div>
        <div class="field"><label>Type</label><select name="type"><option value="percent">Percent</option><option value="flat">Flat ₹</option></select></div>
        <div class="field"><label>Value</label><input name="value" type="number" value="10" /></div>
        <div class="field"><label>Note</label><input name="note" placeholder="Night shift sale" /></div>
        <div class="field" style="align-self:end"><button class="btn btn-navy" type="submit">Save coupon</button></div>
      </form>
    </div>
    <div class="card" style="padding:0"><table>
      <thead><tr><th>Code</th><th>Offer</th><th>Note</th><th>Live</th></tr></thead>
      <tbody>${db.coupons.map((c) => `<tr>
        <td><b>${c.code}</b></td><td>${c.type === "percent" ? c.value + "%" : inr(c.value)}</td>
        <td>${c.note || ""}</td><td>${c.active !== false ? "Yes" : "No"}</td>
      </tr>`).join("")}</tbody></table></div>`;
}

function viewSettings() {
  const s = UjmaDB.get().settings;
  return `<div class="card" style="max-width:560px">
    <form id="setForm">
      <div class="field"><label>Brand</label><input name="brand" value="${s.brand}" /></div>
      <div class="grid-2">
        <div class="field"><label>Free shipping above ₹</label><input name="freeShip" type="number" value="${s.freeShip}" /></div>
        <div class="field"><label>Ship fee ₹</label><input name="shipFee" type="number" value="${s.shipFee}" /></div>
      </div>
      <div class="field"><label>GST %</label><input name="gst" type="number" value="${s.gst}" /></div>
      <div class="field"><label>Warehouse</label><input name="warehouse" value="${s.warehouse}" /></div>
      <div class="field"><label>Ops phone</label><input name="phone" value="${s.phone}" /></div>
      <div class="field"><label>Ops email</label><input name="email" value="${s.email}" /></div>
      <button class="btn btn-navy" type="submit">Save settings</button>
      <button class="btn btn-ghost" type="button" id="resetDb" style="margin-left:8px">Reset demo data</button>
      <button class="btn btn-ghost" type="button" id="logout" style="margin-left:8px">Log out</button>
    </form>
  </div>`;
}

function viewMore() {
  return `
    <div class="card" style="padding:0">
      <button class="ios-row nav-link" data-view="delivery" style="width:100%;display:flex;justify-content:space-between;padding:14px 16px;border:0;border-bottom:1px solid var(--line);background:#fff;text-align:left">Delivery board <span>›</span></button>
      <button class="nav-link" data-view="customers" style="width:100%;display:flex;justify-content:space-between;padding:14px 16px;border:0;border-bottom:1px solid var(--line);background:#fff;text-align:left">Customers <span>›</span></button>
      <button class="nav-link" data-view="quotes" style="width:100%;display:flex;justify-content:space-between;padding:14px 16px;border:0;border-bottom:1px solid var(--line);background:#fff;text-align:left">B2B quotes <span>›</span></button>
      <button class="nav-link" data-view="coupons" style="width:100%;display:flex;justify-content:space-between;padding:14px 16px;border:0;border-bottom:1px solid var(--line);background:#fff;text-align:left">Coupons <span>›</span></button>
      <button class="nav-link" data-view="settings" style="width:100%;display:flex;justify-content:space-between;padding:14px 16px;border:0;background:#fff;text-align:left">Settings <span>›</span></button>
    </div>
    <p class="muted" style="padding:12px 4px;font-size:.8rem">Shop checkout and the iPhone app write into these same orders and stock.</p>`;
}

const VIEWS = { dash: viewDash, products: viewProducts, inventory: viewInventory, orders: viewOrders, delivery: viewDelivery, customers: viewCustomers, quotes: viewQuotes, coupons: viewCoupons, settings: viewSettings, more: viewMore };

function render() {
  $("#view").innerHTML = (VIEWS[view] || viewDash)();
  bindView();
  bindLogout();
}

function openDrawer(html) {
  $("#drawer").innerHTML = html;
  $("#drawer").classList.add("show");
  $("#drawerBg").classList.add("show");
  $("#closeDraw")?.addEventListener("click", closeDrawer);
  bindView();
}
function closeDrawer() {
  $("#drawer").classList.remove("show");
  $("#drawerBg").classList.remove("show");
}

function bindView() {
  $$("#view [data-view], #drawer [data-view]").forEach((b) => b.addEventListener("click", (e) => {
    e.preventDefault();
    go(b.dataset.view);
  }));
  $("#newItem")?.addEventListener("click", () => { productEdit = "new"; render(); bindView(); });
  $("#backList")?.addEventListener("click", () => { productEdit = null; render(); });
  $$("[data-edit]").forEach((b) => b.addEventListener("click", () => { productEdit = b.dataset.edit; render(); }));
  $$("[data-arch]").forEach((b) => b.addEventListener("click", () => { UjmaDB.archiveProduct(b.dataset.arch); toast("Item archived"); render(); }));
  $("#pSearch")?.addEventListener("input", () => filterTable("#pTable", "#pSearch"));
  $("#invSearch")?.addEventListener("input", () => filterTable("#invTable", "#invSearch"));
  $$("[data-of]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-of]").forEach((x) => x.classList.remove("on"));
    b.classList.add("on");
    $$("#oTable tbody tr").forEach((tr) => {
      tr.style.display = b.dataset.of === "all" || tr.dataset.st === b.dataset.of ? "" : "none";
    });
  }));
  $$("[data-open-order]").forEach((b) => b.addEventListener("click", (e) => {
    if (e.target.closest("[data-ost]")) return;
    openDrawer(orderDrawer(b.dataset.openOrder));
  }));
  $$("[data-ost]").forEach((b) => b.addEventListener("click", (e) => {
    e.stopPropagation();
    const [id, st] = b.dataset.ost.split("|");
    UjmaDB.updateOrder(id, { status: st });
    toast("Order " + st.replaceAll("_", " "));
    closeDrawer();
    render();
  }));
  $$("[data-adj]").forEach((b) => b.addEventListener("click", () => {
    const [key, d] = b.dataset.adj.split("|");
    UjmaDB.adjustStock(key, Number(d), "manual");
    render();
  }));
  $$("[data-qs]").forEach((b) => b.addEventListener("click", () => {
    const [id, status] = b.dataset.qs.split("|");
    const q = UjmaDB.get().quotes.find((x) => x.id === id);
    UjmaDB.saveQuote({ ...q, status });
    toast("Quote " + status);
    render();
  }));

  $("#grnForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    UjmaDB.receiveStock([{ productId: fd.get("productId"), color: fd.get("color"), size: fd.get("size"), qty: Number(fd.get("qty")) }]);
    toast("Stock received");
    render();
  });
  $("#csvBtn")?.addEventListener("click", () => {
    const n = UjmaDB.importCSV($("#csvBox").value);
    toast(n ? `Imported ${n} rows` : "No matching SKUs");
    render();
  });
  $("#shipForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    if (!fd.get("id") || fd.get("id") === "No orders ready") return;
    UjmaDB.assignDelivery(fd.get("id"), fd.get("partner"), fd.get("awb"), fd.get("eta"));
    toast("Shipped with AWB");
    render();
  });
  $("#cForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    UjmaDB.saveCoupon({ code: String(fd.get("code")).toUpperCase(), type: fd.get("type"), value: Number(fd.get("value")), note: fd.get("note"), active: true });
    toast("Coupon saved");
    render();
  });
  $("#setForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const db = UjmaDB.get();
    db.settings = {
      brand: fd.get("brand"), freeShip: Number(fd.get("freeShip")), shipFee: Number(fd.get("shipFee")),
      gst: Number(fd.get("gst")), warehouse: fd.get("warehouse"), phone: fd.get("phone"), email: fd.get("email")
    };
    UjmaDB.set(db);
    toast("Settings saved");
  });
  $("#resetDb")?.addEventListener("click", () => {
    if (confirm("Reset all demo catalog, stock and orders?")) { UjmaDB.reset(); toast("Demo reset"); render(); }
  });

  const form = $("#itemForm");
  if (form) {
    $("#imgFile")?.addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => { $("#imgUrl").value = r.result; $("#imgPrev").style.backgroundImage = `url('${r.result}')`; };
      r.readAsDataURL(f);
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const id = (fd.get("id") || slug(fd.get("name"))).toString();
      const colors = $$("[name=color]:checked", form).map((i) => i.value);
      UjmaDB.saveProduct({
        id, sku: fd.get("sku") || id.toUpperCase(), name: fd.get("name"), line: fd.get("line"),
        cat: fd.get("cat"), gender: fd.get("gender"), price: Number(fd.get("price")),
        mrp: Number(fd.get("mrp")), cost: Number(fd.get("cost")), fabric: fd.get("fabric"),
        features: String(fd.get("features") || "").split(",").map((x) => x.trim()).filter(Boolean),
        badge: fd.get("badge"), colors: colors.length ? colors : ["navy"],
        sizes: String(fd.get("sizes") || "S,M,L,XL").split(",").map((x) => x.trim()),
        img: fd.get("img"), sellable: form.sellable.checked, active: true, rating: 5, reviews: 0
      });
      toast("Item saved — live on the store");
      productEdit = null;
      render();
    });
  }
}

function slug(s) {
  return String(s || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24);
}
function filterTable(table, input) {
  const q = $(input).value.toLowerCase();
  $$(table + " tbody tr").forEach((tr) => {
    tr.style.display = (tr.dataset.filter || tr.textContent).toLowerCase().includes(q) ? "" : "none";
  });
}

$("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if ($("#user").value.trim() === "admin" && $("#pass").value === "ujma123") {
    sessionStorage.setItem(AUTH, "1");
    enter();
  } else toast("Use admin / ujma123");
});
$("#drawerBg").addEventListener("click", closeDrawer);
$$("#adminTabs [data-view]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); go(a.dataset.view); }));
$("#quickAdd").addEventListener("click", () => { productEdit = "new"; go("products"); });

function bindLogout() {
  $("#logout")?.addEventListener("click", () => { sessionStorage.removeItem(AUTH); location.reload(); });
}

function enter() {
  $("#loginGate").hidden = true;
  $("#app").hidden = false;
  if ($("#adminTabs")) $("#adminTabs").hidden = false;
  const h = location.hash.slice(1);
  go(VIEWS[h] ? h : "dash");
}
if (sessionStorage.getItem(AUTH)) enter();
