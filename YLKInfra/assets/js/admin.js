const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const AdminApp = (() => {
  let view = "dash";
  let editing = null;

  function toast(m) {
    const el = $("#toast");
    el.textContent = m;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 1800);
  }

  function badge(st) {
    return `<span class="badge b-${st}">${st}</span>`;
  }

  function openDrawer(html) {
    $("#drawer").innerHTML = html;
    $("#drawer").classList.add("on");
    $("#drawerBg").classList.add("on");
  }
  function closeDrawer() {
    $("#drawer").classList.remove("on");
    $("#drawerBg").classList.remove("on");
  }

  function dash() {
    const c = YLKStore.counts();
    const leads = YLKStore.bookings().slice(0, 6);
    return `
      <div class="kpis">
        <article><strong>${c.available}</strong><span class="muted">Available</span></article>
        <article><strong>${c.booked}</strong><span class="muted">Booked</span></article>
        <article><strong>${c.sold}</strong><span class="muted">Sold out</span></article>
        <article><strong>${c.leads}</strong><span class="muted">Bookings</span></article>
      </div>
      <div class="panel">
        <h3>Latest WhatsApp bookings</h3>
        ${leads.length ? leads.map((b) => `<div class="row"><div><b>${b.name}</b><div class="muted">${b.phone} · ${b.propertyTitle || b.interest || "General"}</div></div><span class="muted">${new Date(b.at).toLocaleString("en-IN")}</span></div>`).join("") : `<p class="muted">No bookings yet. Public enquiries land here and on +91 94125 02030.</p>`}
      </div>`;
  }

  function inventory() {
    const rows = YLKStore.inventory();
    return `
      <div class="panel" style="display:flex;justify-content:space-between;align-items:center;gap:.6rem;flex-wrap:wrap">
        <h3>Inventory (${rows.length})</h3>
        <button class="btn-sm" type="button" id="addInv">+ Create listing</button>
      </div>
      ${rows
        .map((p) => {
          const img = YLKStore.img((p.images && p.images[0]) || "hero-estate.png");
          return `<div class="panel">
            <div class="row" style="border:0;align-items:flex-start">
              <img class="thumb" src="${img}" alt="" />
              <div style="flex:1">
                <b>${p.title}</b> ${badge(p.status)}
                <div class="muted">${p.city} · ${p.type} · ${p.priceLabel || YLKStore.inr(p.price)}</div>
              </div>
            </div>
            <div class="list-actions">
              <button class="btn-sm" data-edit="${p.id}">Edit</button>
              <button class="btn-sm" data-st="${p.id}|available">Available</button>
              <button class="btn-sm" data-st="${p.id}|booked">Booked</button>
              <button class="btn-sm" data-st="${p.id}|sold">Sold out</button>
              <button class="btn-ghost btn-sm" data-del="${p.id}">Remove</button>
            </div>
          </div>`;
        })
        .join("")}`;
  }

  function form(p = {}) {
    const imgs = (p.images || []).join(", ");
    const highs = (p.highlights || []).join(", ");
    const amens = (p.amenities || []).join(", ");
    return `
      <h2>${p.id ? "Edit listing" : "New listing"}</h2>
      <form id="invForm">
        <input type="hidden" name="id" value="${p.id || ""}" />
        <label>Title<input name="title" required value="${p.title || ""}" /></label>
        <label>Title (Hindi)<input name="titleHi" value="${p.titleHi || ""}" /></label>
        <label>Type
          <select name="type">${YLKStore.types.map((t) => `<option ${p.type === t.id ? "selected" : ""} value="${t.id}">${t.label}</option>`).join("")}</select>
        </label>
        <label>Status
          <select name="status">
            ${["available", "booked", "sold"].map((s) => `<option ${p.status === s ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </label>
        <label>City<input name="city" required value="${p.city || "Bareilly"}" /></label>
        <label>Location<input name="location" value="${p.location || ""}" /></label>
        <label>Price (INR)<input name="price" type="number" value="${p.price || ""}" /></label>
        <label>Price label<input name="priceLabel" value="${p.priceLabel || ""}" placeholder="₹24.9 Lakh*" /></label>
        <label>Area<input name="area" value="${p.area || ""}" /></label>
        <label>Beds / Baths
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem">
            <input name="beds" type="number" placeholder="BHK" value="${p.beds || ""}" />
            <input name="baths" type="number" placeholder="Baths" value="${p.baths || ""}" />
          </div>
        </label>
        <label>RERA / note<input name="rera" value="${p.rera || ""}" /></label>
        <label>Lat / Lng
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem">
            <input name="lat" value="${p.lat || 28.367}" />
            <input name="lng" value="${p.lng || 79.43}" />
          </div>
        </label>
        <label>Images (comma filenames)<input name="images" value="${imgs}" placeholder="hero-plots.png, plot-gated.png" /></label>
        <label>Map image<input name="mapImage" value="${p.mapImage || "map-masterplan.png"}" /></label>
        <label>Highlights (comma)<input name="highlights" value="${highs}" /></label>
        <label>Amenities (comma)<input name="amenities" value="${amens}" /></label>
        <label>Description<textarea name="description" rows="4">${p.description || ""}</textarea></label>
        <label>Description Hindi<textarea name="descriptionHi" rows="3">${p.descriptionHi || ""}</textarea></label>
        <label>Featured
          <select name="featured"><option value="true" ${p.featured ? "selected" : ""}>Yes</option><option value="false" ${!p.featured ? "selected" : ""}>No</option></select>
        </label>
        <button class="btn btn-gold" type="submit">Save to public website</button>
        <button class="btn-ghost btn-sm" type="button" id="cancelDraw" style="margin-top:.6rem;width:100%">Cancel</button>
      </form>`;
  }

  function bookings() {
    const rows = YLKStore.bookings();
    if (!rows.length) return `<div class="panel"><p class="muted">No bookings yet.</p></div>`;
    return rows
      .map(
        (b) => `
      <div class="panel">
        <div class="row" style="border:0">
          <div>
            <b>${b.name}</b> ${badge(b.status || "new")}
            <div class="muted">${b.phone} · ${b.email}</div>
            <div class="muted">${b.propertyTitle || b.interest || "General"} · ${new Date(b.at).toLocaleString("en-IN")}</div>
            ${b.message ? `<p>${b.message}</p>` : ""}
          </div>
        </div>
        <div class="list-actions">
          <a class="btn-sm" href="https://wa.me/91${String(b.phone).replace(/\D/g, "")}" target="_blank" rel="noopener">Chat lead</a>
          <button class="btn-sm" data-bk="${b.id}|contacted">Mark contacted</button>
          <button class="btn-sm" data-bk="${b.id}|closed">Closed</button>
        </div>
      </div>`
      )
      .join("");
  }

  function more() {
    const c = YLKStore.company();
    return `
      <div class="panel">
        <h3>Public website</h3>
        <p class="muted">Inventory you save here appears immediately on the public site (this browser). Bookings are stored locally and also sent to WhatsApp ${c.phone}.</p>
        <p style="margin-top:.8rem"><a class="btn-sm" href="../index.html">Open public site</a>
        <button class="btn-ghost btn-sm" type="button" id="logout">Log out</button></p>
      </div>
      <div class="panel">
        <h3>Security note</h3>
        <p class="muted">Catalog is AES-GCM encoded in vault.enc.js — not readable JSON. Admin overlay lives encrypted-at-rest in this browser's storage. For multi-staff production, connect a server later.</p>
      </div>`;
  }

  function render() {
    const titles = { dash: "Dashboard", inventory: "Inventory", bookings: "Bookings", more: "More" };
    $("#pageTitle").textContent = titles[view] || "Admin";
    $("#view").innerHTML = { dash: dash, inventory, bookings, more }[view]();
    $$(".side button, .admin-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.view === view));
  }

  function parseList(s) {
    return String(s || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  function bind() {
    document.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-view]");
      if (tab) {
        view = tab.dataset.view;
        render();
        return;
      }
      if (e.target.id === "addInv") {
        editing = {};
        openDrawer(form({}));
        return;
      }
      const ed = e.target.closest("[data-edit]");
      if (ed) {
        editing = YLKStore.item(ed.dataset.edit);
        openDrawer(form(editing));
        return;
      }
      const st = e.target.closest("[data-st]");
      if (st) {
        const [id, status] = st.dataset.st.split("|");
        const cur = YLKStore.item(id);
        YLKStore.upsertItem({ ...cur, status });
        toast("Status → " + status);
        render();
        return;
      }
      const del = e.target.closest("[data-del]");
      if (del && confirm("Remove this listing from the public site?")) {
        YLKStore.removeItem(del.dataset.del);
        toast("Removed");
        render();
        return;
      }
      const bk = e.target.closest("[data-bk]");
      if (bk) {
        const [id, status] = bk.dataset.bk.split("|");
        YLKStore.updateBooking(id, { status });
        toast("Lead " + status);
        render();
        return;
      }
      if (e.target.id === "cancelDraw" || e.target.id === "drawerBg") closeDrawer();
      if (e.target.id === "logout") {
        YLKStore.logout();
        location.reload();
      }
    });

    document.addEventListener("submit", (e) => {
      if (e.target.id !== "invForm") return;
      e.preventDefault();
      const fd = new FormData(e.target);
      const rec = {
        id: fd.get("id") || undefined,
        title: fd.get("title"),
        titleHi: fd.get("titleHi"),
        type: fd.get("type"),
        status: fd.get("status"),
        city: fd.get("city"),
        location: fd.get("location"),
        price: Number(fd.get("price") || 0),
        priceLabel: fd.get("priceLabel"),
        area: fd.get("area"),
        beds: fd.get("beds") ? Number(fd.get("beds")) : null,
        baths: fd.get("baths") ? Number(fd.get("baths")) : null,
        rera: fd.get("rera"),
        lat: Number(fd.get("lat")),
        lng: Number(fd.get("lng")),
        images: parseList(fd.get("images")),
        mapImage: fd.get("mapImage"),
        highlights: parseList(fd.get("highlights")),
        amenities: parseList(fd.get("amenities")),
        description: fd.get("description"),
        descriptionHi: fd.get("descriptionHi"),
        featured: fd.get("featured") === "true",
        documents: [
          { name: "Project brochure", kind: "brochure" },
          { name: "Layout / map", kind: "map" },
          { name: "Buyer note", kind: "doc" }
        ],
        kicker: fd.get("city") + " · " + fd.get("type")
      };
      YLKStore.upsertItem(rec);
      closeDrawer();
      toast("Published on public site");
      view = "inventory";
      render();
    });
  }

  async function start() {
    await YLKStore.init();
    if (YLKStore.session()) {
      $("#loginGate").hidden = true;
      $("#app").hidden = false;
      render();
      return;
    }
    $("#loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = await YLKStore.login($("#user").value, $("#pass").value);
      if (!ok) {
        $("#loginErr").hidden = false;
        return;
      }
      $("#loginGate").hidden = true;
      $("#app").hidden = false;
      render();
    });
  }

  bind();
  return { start };
})();

document.addEventListener("DOMContentLoaded", () => AdminApp.start());
