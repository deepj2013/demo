(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const TABS = ["overview", "problem", "priority", "roadmap", "deliver", "sops", "data", "flows", "ai", "begin"];
  const STORE = "clay-ecosystem-workbook-v1";

  const rupee = (n) => {
    const sign = n < 0 ? "−" : "";
    return sign + "₹" + Math.abs(Math.round(n)).toLocaleString("en-IN");
  };
  const num = (id) => {
    const el = document.getElementById(id);
    const v = el ? parseFloat(el.value) : NaN;
    return Number.isFinite(v) ? v : 0;
  };

  function pieceCost(input) {
    const direct = input.clay + input.glaze + (input.hours * input.rate) + input.kiln + input.pack;
    const reject = Math.min(Math.max(input.reject, 0), 99.9) / 100;
    const yieldRate = 1 - reject;
    const madeCost = yieldRate > 0 ? direct / yieldRate : Infinity;
    const full = madeCost + input.transport;
    const netPrice = input.price * (1 - Math.min(Math.max(input.discount, 0), 100) / 100);
    return { direct, madeCost, full, netPrice, kept: netPrice - full };
  }

  function renderMoney() {
    const box = $("#money-out");
    const sentence = $("#money-sentence");
    if (!box || !sentence) return;
    const input = {
      clay: num("m-clay"), glaze: num("m-glaze"), hours: num("m-hours"), rate: num("m-rate"),
      kiln: num("m-kiln"), pack: num("m-pack"), transport: num("m-transport"),
      reject: num("m-reject"), price: num("m-price"), discount: num("m-discount")
    };
    if (input.reject >= 100) {
      sentence.className = "sentence late";
      sentence.textContent = document.body.classList.contains("lang-hi")
        ? "खराबी 100% से कम होनी चाहिए। वरना बेचने के लिए पीस ही नहीं बचता।"
        : "Spoilage has to stay under 100%. Otherwise there is no piece left to sell.";
      return;
    }
    const c = pieceCost(input);
    const rows = [
      ["Clay / कच्चा माल", input.clay],
      ["Surface / सतह", input.glaze],
      ["Hands / हाथ", input.hours * input.rate],
      ["Kiln / ईंधन", input.kiln],
      ["Packing / पैकिंग", input.pack],
      ["Started cost / शुरू करने की लागत", c.direct],
      ["After spoilage / खराबी के बाद", c.madeCost],
      ["Transport / ढुलाई", input.transport],
      ["Full cost / पूरी लागत", c.full],
      ["Dealer pays / डीलर देता है", c.netPrice],
      ["Workshop keeps / वर्कशॉप के पास रहता है", c.kept]
    ];
    box.innerHTML = rows.map((row, i) => {
      const last = i === rows.length - 1;
      const cls = last ? (c.kept >= 0 ? "good" : "bad") : "";
      return "<tr" + (last ? " class='total'" : "") + "><td>" + row[0] + "</td><td class='num " + cls + "'>" + rupee(row[1]) + "</td></tr>";
    }).join("");
    const hi = document.body.classList.contains("lang-hi");
    sentence.className = "sentence " + (c.kept < 0 ? "late" : c.kept < 40 ? "tight" : "ok");
    sentence.textContent = hi
      ? "एक पीस पर डीलर " + rupee(c.netPrice) + " देता है। पूरी लागत " + rupee(c.full) + " है। वर्कशॉप के पास " + rupee(c.kept) + " रहता है। खराबी की लागत पहले ही इसमें जुड़ी है।"
      : "On one piece the dealer pays " + rupee(c.netPrice) + ". Full cost is " + rupee(c.full) + ". The workshop keeps " + rupee(c.kept) + ". Spoilage is already inside that cost.";
  }

  function renderPlan() {
    const math = $("#plan-math");
    const sentence = $("#plan-sentence");
    if (!math || !sentence) return;
    const need = Math.max(0, num("p-need"));
    const finished = Math.max(0, num("p-finished"));
    const wip = Math.max(0, num("p-wip"));
    const spoil = Math.min(Math.max(num("p-spoil"), 0), 99.9);
    const processDays = Math.max(0, num("p-days"));
    const daysLeft = Math.max(0, num("p-left"));
    const clayEach = Math.max(0, num("p-clay"));
    const clayHave = Math.max(0, num("p-have"));
    const capacity = Math.max(1, num("p-capacity"));
    const gap = Math.max(0, need - finished - wip);
    const yieldRate = 1 - spoil / 100;
    const start = yieldRate > 0 ? Math.ceil(gap / yieldRate) : 0;
    const clayBuy = Math.max(0, start * clayEach - clayHave);
    const late = processDays > daysLeft && gap > 0;
    const hi = document.body.classList.contains("lang-hi");
    const labels = hi
      ? ["डीलर को चाहिए", "पैक और खाली", "बन रहा है", "और अच्छे पीस चाहिए", "शुरू करें"]
      : ["Dealer still needs", "Packed and free", "Already in making", "Good pieces still needed", "Start this many"];
    [need, finished, wip, gap, start].forEach((n, i) => {
      /* filled below */
    });
    const vals = [need, finished, wip, gap, start];
    math.innerHTML = labels.map((label, i) => "<tr" + (i === 4 ? " class='total'" : "") + "><td>" + label + "</td><td class='num'>" + vals[i].toLocaleString("en-IN") + "</td></tr>").join("");
    let tone = "ok";
    let text;
    if (gap === 0) {
      text = hi ? "नया शुरू करने की ज़रूरत नहीं। जो पैक है और जो बन रहा है, ऑर्डर के लिए काफी है।" : "Nothing new has to start. Packed pieces and work already on the bench cover this order.";
    } else if (spoil >= 100) {
      tone = "late";
      text = hi ? "खराबी 100% है। संख्या बन नहीं सकती।" : "Spoilage is 100%. A start quantity cannot be planned.";
    } else if (late) {
      tone = "late";
      text = hi
        ? start.toLocaleString("en-IN") + " पीस शुरू करने हैं। मिट्टी खरीदें लगभग " + clayBuy.toFixed(1) + " किलो। प्रक्रिया को " + processDays + " दिन चाहिए और बचे हैं " + daysLeft + "। तारीख मिस होगी। भेजने से पहले डीलर को बताएं।"
        : "Start " + start.toLocaleString("en-IN") + ". Buy about " + clayBuy.toFixed(1) + " kg of material. The process needs " + processDays + " days and " + daysLeft + " are left. The date will be missed. Tell the dealer before you commit.";
    } else {
      tone = start / capacity > 0.85 ? "tight" : "ok";
      text = hi
        ? start.toLocaleString("en-IN") + " पीस शुरू करें। मिट्टी लगभग " + clayBuy.toFixed(1) + " किलो खरीदें। हाथों की क्षमता इस हफ्ते " + capacity.toLocaleString("en-IN") + " है। तारीख अभी अंदर है, अगर इस हफ्ते शुरू हो।"
        : "Start " + start.toLocaleString("en-IN") + ". Buy about " + clayBuy.toFixed(1) + " kg. Makers can form about " + capacity.toLocaleString("en-IN") + " this week. The date still fits if the batch starts now.";
    }
    sentence.className = "sentence " + tone;
    sentence.textContent = text;
  }

  function renderLeak() {
    const sentence = $("#leak-sentence");
    const box = $("#leak-out");
    if (!sentence || !box) return;
    const time = num("l-hours") * num("l-rate") * 4;
    const cash = num("l-overdue") * (num("l-cash") / 100);
    const discount = num("l-billed") * (num("l-disc") / 100);
    const spoil = num("l-pieces") * (num("l-spoil") / 100) * num("l-cost");
    const replace = num("l-replace");
    const total = time + cash + discount + spoil + replace;
    const hi = document.body.classList.contains("lang-hi");
    const rows = hi
      ? [["फोन और याद पर आपका समय", time], ["फँसा हुआ पैसा, आपकी दर से", cash], ["बिना हिसाब छूट", discount], ["जो खराबी लिखी ही नहीं", spoil], ["टूटे पीस आपने बदलें", replace], ["इस नमूना महीने में लीक", total]]
      : [["Your time on calls and memory", time], ["Stuck dealer cash, at your rate", cash], ["Discount given with no record", discount], ["Spoilage never written down", spoil], ["Breakage you replaced", replace], ["Leak in this sample month", total]];
    box.innerHTML = rows.map((row, i) => "<tr" + (i === rows.length - 1 ? " class='total'" : "") + "><td>" + row[0] + "</td><td class='num'>" + rupee(row[1]) + "</td></tr>").join("");
    sentence.className = "sentence late";
    sentence.textContent = hi
      ? "इस नमूने में महीने की लगभग " + rupee(total) + " की लीक नोटबुक में एक साफ नुकसान बनकर नहीं दिखती। समय, फँसा पैसा, छूट, टूटन और खराबी में बँटी रहती है। अपने आँकड़े डालें।"
      : "In this sample, about " + rupee(total) + " a month never appears as one clean loss. It is split across your time, stuck cash, discounts, breakage, and spoilage. Replace the inputs with your own month.";
  }

  function showTab(id) {
    if (!TABS.includes(id)) id = "overview";
    const primary = ["overview", "problem", "roadmap", "deliver"];
    $$("[data-tab]").forEach((btn) => btn.setAttribute("aria-selected", btn.dataset.tab === id ? "true" : "false"));
    const more = $("#more-btn");
    const sheet = $("#more-sheet");
    if (more) {
      more.setAttribute("aria-selected", primary.includes(id) ? "false" : "true");
      more.setAttribute("aria-expanded", "false");
    }
    if (sheet) sheet.hidden = true;
    $$(".panel").forEach((panel) => panel.classList.toggle("is-on", panel.id === "panel-" + id));
    const index = TABS.indexOf(id);
    const count = $("#step-count");
    if (count) {
      count.textContent = document.body.classList.contains("lang-hi")
        ? "भाग " + (index + 1) + " / " + TABS.length
        : "Part " + (index + 1) + " of " + TABS.length;
    }
    if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setLang(lang) {
    document.body.classList.toggle("lang-hi", lang === "hi");
    document.body.classList.toggle("lang-en", lang !== "hi");
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
    $$(".lang button").forEach((btn) => btn.classList.toggle("is-on", btn.dataset.lang === lang));
    localStorage.setItem("clay-lang", lang);
    const hash = (location.hash || "#overview").slice(1);
    showTab(TABS.includes(hash) ? hash : "overview");
    renderMoney();
    renderPlan();
    renderLeak();
    paintProgress();
  }

  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; }
    catch (e) { return {}; }
  }
  function saveStore(data) { localStorage.setItem(STORE, JSON.stringify(data)); }

  function paintProgress() {
    const data = loadStore();
    const checks = $$("[data-check]");
    let done = 0;
    checks.forEach((box) => {
      const on = Boolean(data.checks && data.checks[box.dataset.check]);
      box.checked = on;
      if (on) done += 1;
    });
    $$("[data-field]").forEach((field) => {
      if (data.fields && data.fields[field.dataset.field] != null) field.value = data.fields[field.dataset.field];
    });
    const bar = $("#wb-bar");
    if (bar) bar.style.width = (checks.length ? Math.round((done / checks.length) * 100) : 0) + "%";
    const label = $("#wb-label");
    if (label) {
      label.textContent = document.body.classList.contains("lang-hi")
        ? done + " / " + checks.length + " काम पूरे"
        : done + " of " + checks.length + " ready";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $$("[data-tab]").forEach((btn) => btn.addEventListener("click", () => showTab(btn.dataset.tab)));
    const moreBtn = $("#more-btn");
    if (moreBtn) {
      moreBtn.addEventListener("click", () => {
        const sheet = $("#more-sheet");
        const open = sheet.hidden;
        sheet.hidden = !open;
        moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    $$("[data-jump]").forEach((btn) => btn.addEventListener("click", () => showTab(btn.dataset.jump)));
    $$(".lang button").forEach((btn) => btn.addEventListener("click", () => setLang(btn.dataset.lang)));
    $$("#money-tool input").forEach((el) => el.addEventListener("input", renderMoney));
    $$("#plan-tool input").forEach((el) => el.addEventListener("input", renderPlan));
    $$("#leak-tool input").forEach((el) => el.addEventListener("input", renderLeak));
    $$("[data-preset]").forEach((btn) => btn.addEventListener("click", () => {
      const sets = {
        steady: { "m-clay": 28, "m-glaze": 12, "m-hours": 1.5, "m-rate": 80, "m-kiln": 25, "m-pack": 18, "m-transport": 22, "m-reject": 8, "m-price": 280, "m-discount": 0 },
        hard: { "m-clay": 34, "m-glaze": 14, "m-hours": 1.8, "m-rate": 90, "m-kiln": 40, "m-pack": 22, "m-transport": 30, "m-reject": 18, "m-price": 280, "m-discount": 10 }
      };
      Object.entries(sets[btn.dataset.preset]).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
      });
      renderMoney();
    }));
    $$("[data-check]").forEach((box) => box.addEventListener("change", () => {
      const data = loadStore();
      data.checks = data.checks || {};
      data.checks[box.dataset.check] = box.checked;
      saveStore(data);
      paintProgress();
    }));
    $$("[data-field]").forEach((field) => field.addEventListener("input", () => {
      const data = loadStore();
      data.fields = data.fields || {};
      data.fields[field.dataset.field] = field.value;
      saveStore(data);
    }));
    const reset = $("#wb-reset");
    if (reset) reset.addEventListener("click", () => { localStorage.removeItem(STORE); $$("[data-field]").forEach((f) => { f.value = ""; }); paintProgress(); });
    const saved = localStorage.getItem("clay-lang") === "hi" ? "hi" : "en";
    setLang(saved);
    const hash = (location.hash || "").slice(1);
    if (TABS.includes(hash)) showTab(hash);
    window.addEventListener("hashchange", () => {
      const next = location.hash.slice(1);
      if (TABS.includes(next)) showTab(next);
    });
  });
})();
