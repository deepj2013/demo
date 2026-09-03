/* Shared ecommerce database — shop, admin, and app all read/write this. */

const UjmaDB = (() => {
  const KEY = "ujma_os_v1";
  const FLOW = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"];
  const PARTNERS = ["Delhivery", "BlueDart", "Shadowfax", "Dunzo", "Ujma Rider"];

  const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
  const uid = (p) => p + "-" + Math.random().toString(36).slice(2, 8);
  const now = () => new Date().toISOString();
  const invKey = (id, color, size) => `${id}|${color}|${size}`;

  function seed() {
    const products = (typeof PRODUCTS !== "undefined" ? PRODUCTS : []).map((p) => ({
      ...p,
      sku: p.id.toUpperCase(),
      cost: Math.round(p.price * 0.45),
      minStock: 8,
      active: true,
      sellable: true,
      createdAt: now()
    }));

    const inventory = [];
    products.forEach((p, pi) => {
      (p.colors || ["navy"]).forEach((c, ci) => {
        (p.sizes || ["M"]).forEach((s, si) => {
          let qty = 18 + ((pi + ci + si) * 7) % 40;
          if (s === "3XL" || s === "XS") qty = 4 + (pi % 5);
          if (p.id === "chef-coat" && s === "L") qty = 3;
          inventory.push({ key: invKey(p.id, c, s), productId: p.id, color: c, size: s, qty, reserved: 0 });
        });
      });
    });

    const customers = [
      { id: "c1", name: "Dr. Ananya Mehta", phone: "9876544001", email: "ananya@hospital.in", city: "Mumbai", orders: 3, spend: 7697 },
      { id: "c2", name: "Nurse Hema Rawat", phone: "9822011455", email: "hema@clinic.in", city: "Pune", orders: 2, spend: 2198 },
      { id: "c3", name: "City Hospital Stores", phone: "0224001122", email: "stores@cityhospital.in", city: "Mumbai", orders: 1, spend: 54980, type: "b2b" },
      { id: "c4", name: "Chef Imran Khan", phone: "9810012345", email: "imran@taj.in", city: "Delhi", orders: 1, spend: 1599 }
    ];

    const imgOf = (id) => products.find((x) => x.id === id)?.img || "";

    const orders = [
      orderSeed("UJ-2401", "pending", "upi", customers[0], [{ id: "cw-navy", name: "Classic Women's V-Neck Scrub", color: "navy", size: "M", qty: 2, price: 1099, img: imgOf("cw-navy") }], 0),
      orderSeed("UJ-2400", "confirmed", "cod", customers[1], [{ id: "nurse-tunic", name: "Nurse Tunic Set", color: "sky", size: "S", qty: 1, price: 999, img: imgOf("nurse-tunic") }], 79),
      orderSeed("UJ-2398", "packed", "card", customers[0], [{ id: "sw-navy", name: "StretchFlex Women's Scrub", color: "wine", size: "M", qty: 1, price: 2499, img: imgOf("sw-navy") }], 0),
      orderSeed("UJ-2392", "shipped", "upi", customers[3], [{ id: "chef-coat", name: "Executive Chef Coat", color: "white", size: "L", qty: 1, price: 1599, img: imgOf("chef-coat") }], 0, { partner: "Delhivery", awb: "DLV8392011", eta: "Tomorrow, 6 pm" }),
      orderSeed("UJ-2388", "out_for_delivery", "cod", customers[1], [{ id: "cap-plain", name: "Scrub Cap — Classic", color: "navy", size: "One size", qty: 2, price: 349, img: imgOf("cap-plain") }], 79, { partner: "Dunzo", awb: "DNZ44102", eta: "Today, 7 pm" }),
      orderSeed("UJ-2370", "delivered", "emi", customers[0], [{ id: "lab-chief-w", name: "Chief Lab Coat — Women", color: "white", size: "M", qty: 1, price: 1899, img: imgOf("lab-chief-w") }], 0, { partner: "BlueDart", awb: "BD99210", eta: "Delivered" })
    ];

    return {
      products,
      inventory,
      orders,
      customers,
      coupons: [
        { code: "UJMA10", type: "percent", value: 10, active: true, note: "10% off sitewide" },
        { code: "WELCOME200", type: "flat", value: 200, active: true, note: "₹200 off first order" },
        { code: "HOSPITAL15", type: "percent", value: 15, active: true, note: "B2B medical" }
      ],
      quotes: [
        { id: "Q-118", org: "City Hospital", name: "Rakesh Nair", phone: "0224001122", need: "Medical scrubs (50+)", status: "new", notes: "Navy + wine, embroidery on pocket", at: now() },
        { id: "Q-110", org: "DPS Lucknow", name: "Priya Singh", phone: "9415011122", need: "School uniforms", status: "quoted", notes: "400 sets, navy + white", at: now() }
      ],
      settings: {
        brand: "Ujma Uniform",
        freeShip: 999,
        shipFee: 79,
        gst: 12,
        warehouse: "Bhiwandi DC · Mumbai",
        phone: "+91 98765 44001",
        email: "ops@ujmauniform.com"
      }
    };
  }

  function orderSeed(id, status, pay, customer, items, ship, delivery = null) {
    const sub = items.reduce((n, i) => n + i.price * i.qty, 0);
    return {
      id, status, pay, paymentStatus: pay === "cod" ? "cod" : "paid",
      customer, address: { line: "12, Park Street", city: customer.city, pin: "400050", phone: customer.phone },
      items, subtotal: sub, shipping: ship, discount: 0, total: sub + ship,
      createdAt: now(), timeline: stamp(status), delivery
    };
  }

  function stamp(status) {
    const i = FLOW.indexOf(status);
    return FLOW.slice(0, Math.max(1, i + 1)).map((s) => ({ status: s, at: now() }));
  }

  function get() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        const s = seed();
        localStorage.setItem(KEY, JSON.stringify(s));
        return s;
      }
      return JSON.parse(raw);
    } catch {
      return seed();
    }
  }

  function set(db) {
    localStorage.setItem(KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent("ujma-db"));
  }

  function publishedProducts() {
    return get().products.filter((p) => p.active !== false && p.sellable !== false);
  }

  function product(id) {
    return get().products.find((p) => p.id === id);
  }

  function stockOf(id, color, size) {
    const row = get().inventory.find((r) => r.key === invKey(id, color, size));
    return row ? row.qty - (row.reserved || 0) : 0;
  }

  function saveProduct(p) {
    const db = get();
    const i = db.products.findIndex((x) => x.id === p.id);
    const prev = i >= 0 ? db.products[i] : null;
    if (i >= 0) db.products[i] = { ...prev, ...p };
    else db.products.unshift({ ...p, createdAt: now(), active: true, sellable: p.sellable !== false });
    syncInventoryRows(db, p, prev);
    set(db);
    return p;
  }

  function syncInventoryRows(db, p, prev) {
    const colors = p.colors || [];
    const sizes = p.sizes || [];
    colors.forEach((c) => sizes.forEach((s) => {
      const k = invKey(p.id, c, s);
      if (!db.inventory.some((r) => r.key === k)) {
        db.inventory.push({ key: k, productId: p.id, color: c, size: s, qty: 0, reserved: 0 });
      }
    }));
  }

  function archiveProduct(id) {
    const db = get();
    const p = db.products.find((x) => x.id === id);
    if (p) p.active = false;
    set(db);
  }

  function adjustStock(key, delta, reason = "adjust") {
    const db = get();
    const row = db.inventory.find((r) => r.key === key);
    if (!row) return;
    row.qty = Math.max(0, (row.qty || 0) + Number(delta));
    db.movements = db.movements || [];
    db.movements.unshift({ key, delta: Number(delta), reason, at: now() });
    set(db);
  }

  function receiveStock(lines) {
    lines.forEach((l) => adjustStock(invKey(l.productId, l.color, l.size), l.qty, "receive"));
  }

  function importCSV(text) {
    const lines = text.trim().split(/\r?\n/).slice(1);
    let n = 0;
    lines.forEach((line) => {
      const [sku, , color, size, qty] = line.split(",").map((x) => (x || "").trim());
      if (!sku || !qty) return;
      const db = get();
      const p = db.products.find((x) => x.sku === sku || x.id === sku.toLowerCase() || x.id === sku);
      if (!p) return;
      adjustStock(invKey(p.id, color, size), Number(qty), "csv");
      n++;
    });
    return n;
  }

  function createOrder(payload) {
    const db = get();
    const items = payload.items || [];
    items.forEach((it) => {
      const row = db.inventory.find((r) => r.key === invKey(it.id, it.color, it.size));
      if (row) row.qty = Math.max(0, row.qty - it.qty);
    });
    const sub = items.reduce((n, i) => n + i.price * i.qty, 0);
    const settings = db.settings;
    const ship = sub >= settings.freeShip ? 0 : settings.shipFee;
    const order = {
      id: "UJ-" + (2300 + db.orders.length + Math.floor(Math.random() * 50)),
      status: "pending",
      pay: payload.pay || "upi",
      paymentStatus: payload.pay === "cod" ? "cod" : "paid",
      customer: payload.customer,
      address: payload.address,
      items, subtotal: sub, shipping: ship, discount: payload.discount || 0,
      total: Math.max(0, sub + ship - (payload.discount || 0)),
      createdAt: now(), timeline: stamp("pending"), delivery: null
    };
    db.orders.unshift(order);
    upsertCustomer(db, payload.customer, order.total);
    set(db);
    return order;
  }

  function upsertCustomer(db, c, spend) {
    if (!c || !c.phone) return;
    let hit = db.customers.find((x) => x.phone === c.phone);
    if (!hit) {
      hit = { id: uid("c"), name: c.name, phone: c.phone, email: c.email || "", city: (c.city || (c.address && c.address.city) || ""), orders: 0, spend: 0 };
      db.customers.unshift(hit);
    }
    hit.orders += 1;
    hit.spend += spend;
  }

  function updateOrder(id, patch) {
    const db = get();
    const o = db.orders.find((x) => x.id === id);
    if (!o) return;
    if (patch.status && patch.status !== o.status) {
      o.status = patch.status;
      o.timeline = o.timeline || [];
      o.timeline.push({ status: patch.status, at: now() });
      if (patch.status === "cancelled") {
        o.items.forEach((it) => {
          const row = db.inventory.find((r) => r.key === invKey(it.id, it.color, it.size));
          if (row) row.qty += it.qty;
        });
      }
    }
    if (patch.delivery) o.delivery = { ...(o.delivery || {}), ...patch.delivery };
    if (patch.paymentStatus) o.paymentStatus = patch.paymentStatus;
    if (patch.notes) o.notes = patch.notes;
    set(db);
    return o;
  }

  function assignDelivery(id, partner, awb, eta) {
    return updateOrder(id, {
      status: "shipped",
      delivery: { partner, awb: awb || ("AWB" + Math.floor(100000 + Math.random() * 899999)), eta: eta || "2–4 days" }
    });
  }

  function saveCoupon(c) {
    const db = get();
    const i = db.coupons.findIndex((x) => x.code === c.code);
    if (i >= 0) db.coupons[i] = c;
    else db.coupons.push(c);
    set(db);
  }

  function saveQuote(q) {
    const db = get();
    if (!q.id) q.id = "Q-" + (100 + db.quotes.length);
    q.at = q.at || now();
    const i = db.quotes.findIndex((x) => x.id === q.id);
    if (i >= 0) db.quotes[i] = { ...db.quotes[i], ...q };
    else db.quotes.unshift(q);
    set(db);
    return q;
  }

  function kpis() {
    const db = get();
    const paid = db.orders.filter((o) => o.status !== "cancelled");
    const revenue = paid.reduce((n, o) => n + o.total, 0);
    const pending = db.orders.filter((o) => ["pending", "confirmed"].includes(o.status)).length;
    const ship = db.orders.filter((o) => ["packed", "shipped", "out_for_delivery"].includes(o.status)).length;
    const low = db.inventory.filter((r) => r.qty < 8).length;
    return {
      orders: paid.length,
      revenue,
      customers: db.customers.length,
      pending,
      ship,
      low,
      products: db.products.filter((p) => p.active !== false).length
    };
  }

  function reset() {
    localStorage.removeItem(KEY);
    return get();
  }

  return {
    KEY, FLOW, PARTNERS, inr, invKey, get, set, reset, seed,
    publishedProducts, product, stockOf, saveProduct, archiveProduct,
    adjustStock, receiveStock, importCSV, createOrder, updateOrder,
    assignDelivery, saveCoupon, saveQuote, kpis
  };
})();
