const API = '../api/index.php';
const TOKEN_KEY = 'jm_token';
const USER_KEY = 'jm_user';

const i18n = {
  en: { dash: 'Dashboard', kundli: 'Kundli', match: 'Matching', panchang: 'Panchang', more: 'More', pdf: 'Download PDF', pdf_ok: 'Opening PDF report…', save_ok: 'Profile & charges saved' },
  hi: { dash: 'डैशबोर्ड', kundli: 'कुंडली', match: 'मिलान', panchang: 'पंचांग', more: 'अधिक', pdf: 'PDF डाउनलोड', pdf_ok: 'PDF रिपोर्ट खुल रही है…', save_ok: 'प्रोफ़ाइल व शुल्क सहेजे गए' },
  ta: { dash: 'டாஷ்போர்டு', kundli: 'ஜாதகம்', match: 'பொருத்தம்', panchang: 'பஞ்சாங்கம்', more: 'மேலும்', pdf: 'PDF பதிவிறக்கம்', pdf_ok: 'PDF திறக்கிறது…', save_ok: 'சுயவிவரம் சேமிக்கப்பட்டது' },
  te: { dash: 'డాష్‌బోర్డ్', kundli: 'జాతకం', match: 'మేళనం', panchang: 'పంచాంగం', more: 'మరిన్ని', pdf: 'PDF డౌన్‌లోడ్', pdf_ok: 'PDF తెరవబడుతోంది…', save_ok: 'ప్రొఫైల్ సేవ్ అయింది' },
  mr: { dash: 'डॅशबोर्ड', kundli: 'कुंडली', match: 'जुळणी', panchang: 'पंचांग', more: 'अधिक', pdf: 'PDF डाउनलोड', pdf_ok: 'PDF उघडत आहे…', save_ok: 'प्रोफाइल जतन झाले' },
  bn: { dash: 'ড্যাশবোর্ড', kundli: 'কুণ্ডলী', match: 'মিলন', panchang: 'পঞ্জিকা', more: 'আরও', pdf: 'PDF ডাউনলোড', pdf_ok: 'PDF খুলছে…', save_ok: 'প্রোফাইল সংরক্ষিত' },
  gu: { dash: 'ડેશબોર્ડ', kundli: 'કુંડળી', match: 'મેળ', panchang: 'પંચાંગ', more: 'વધુ', pdf: 'PDF ડાઉનલોડ', pdf_ok: 'PDF ખુલે છે…', save_ok: 'પ્રોફાઇલ સાચવ્યું' },
};

let lang = localStorage.getItem('jm_lang') || 'en';
let cities = [
  { name: 'Indore', lat: 22.7196, lon: 75.8577 },
  { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { name: 'Varanasi', lat: 25.3176, lon: 82.9739 },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
];
let token = localStorage.getItem(TOKEN_KEY) || '';
let currentUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
let clients = [];
let matches = [];
let lastKundliData = null;
let lastPanchangData = null;
let lastMatchData = null;

const YOGA_HI = {
  Vishkambha: 'विष्कम्भ', Priti: 'प्रीति', Ayushman: 'आयुष्मान', Saubhagya: 'सौभाग्य',
  Shobhana: 'शोभन', Atiganda: 'अतिगण्ड', Sukarma: 'सुकर्म', Dhriti: 'धृति',
  Shula: 'शूल', Ganda: 'गण्ड', Vriddhi: 'वृद्धि', Dhruva: 'ध्रुव',
  Vyaghata: 'व्याघात', Harshana: 'हर्षण', Vajra: 'वज्र', Siddhi: 'सिद्धि',
  Vyatipata: 'व्यतीपात', Variyan: 'वरीयान', Parigha: 'परिघ', Shiva: 'शिव',
  Siddha: 'सिद्ध', Sadhya: 'साध्य', Shubha: 'शुभ', Shukla: 'शुक्ल',
  Brahma: 'ब्रह्म', Indra: 'इन्द्र', Vaidhriti: 'वैधृति',
};
const KARANA_HI = {
  Bava: 'बव', Balava: 'बालव', Kaulava: 'कौलव', Taitila: 'तैतिल', Gara: 'गर',
  Vanija: 'वणिज', Vishti: 'विष्टि', Shakuni: 'शकुनि', Chatushpada: 'चतुष्पाद',
  Naga: 'नाग', Kimstughna: 'किंस्तुघ्न',
};
const GUNA_HI = {
  Varna: 'वर्ण', Vashya: 'वश्य', Tara: 'तारा', Yoni: 'योनि',
  'Graha Maitri': 'ग्रह मैत्री', Gana: 'गण', Bhakoot: 'भकूट', Nadi: 'नाड़ी',
};
const PLANET_HI = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध', Jupiter: 'गुरु',
  Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु', Asc: 'लग्न',
};

function t(en, hi) {
  return lang === 'hi' ? (hi || en) : en;
}

function yogaName(name) {
  if (!name) return '—';
  return lang === 'hi' ? (YOGA_HI[name] || name) : name;
}

function karanaName(name) {
  if (!name) return '—';
  return lang === 'hi' ? (KARANA_HI[name] || name) : name;
}

function planetName(name) {
  if (!name) return '';
  return lang === 'hi' ? (PLANET_HI[name] || name) : name;
}

async function api(action, payload = {}, method = 'POST') {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  const usedToken = token;
  if (usedToken) {
    opts.headers.Authorization = `Bearer ${usedToken}`;
  }
  let url = `${API}?action=${encodeURIComponent(action)}`;
  if (method === 'GET') {
    // Also pass token in query — Apache often strips Authorization headers
    const q = new URLSearchParams({ ...payload, ...(usedToken ? { token: usedToken } : {}) }).toString();
    if (q) url += `&${q}`;
  } else {
    // Include token in body as fallback for shared hosting
    opts.body = JSON.stringify(usedToken ? { ...payload, token: usedToken } : payload);
  }
  const res = await fetch(url, opts);
  let data;
  try {
    data = await res.json();
  } catch (_) {
    throw new Error('Server returned an invalid response');
  }
  if (data.auth_required) {
    // Only kick to login if THIS request used the current session token.
    // Ignores stale 401s from pre-login calls that finish after a successful login.
    if (usedToken && usedToken === token) {
      clearSession();
      showLogin();
    }
    throw new Error(data.error || 'Please log in');
  }
  if (!data.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

function setLang(next, { refresh = true } = {}) {
  lang = next in i18n ? next : 'en';
  localStorage.setItem('jm_lang', lang);
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  document.body.classList.toggle('lang-hi', lang === 'hi');

  document.querySelectorAll('[data-en]').forEach((el) => {
    const attr = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en');
    if (attr == null) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (el.hasAttribute('placeholder')) el.placeholder = attr;
      return;
    }
    if (el.tagName === 'OPTION') {
      el.textContent = attr;
      return;
    }
    el.textContent = attr;
  });

  document.querySelectorAll('.lang-toggle button').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  const sel = document.getElementById('lang-select');
  if (sel) sel.value = lang;
  const tabs = i18n[lang] || i18n.en;
  document.querySelectorAll('.app-tabbar button').forEach((btn) => {
    const key = btn.dataset.i18n;
    if (key && tabs[key]) {
      const label = btn.querySelector('.label');
      if (label) label.textContent = tabs[key];
    }
  });
  applyUserLabels();
  if (refresh && token) {
    refreshLangDynamic();
  }
}

function refreshLangDynamic() {
  try {
    renderRashiGrid();
    renderClients();
    renderMatches();
    renderDashRecent(clients);
    if (lastKundliData) renderKundli(lastKundliData);
    if (lastPanchangData) renderPanchang(lastPanchangData);
    if (lastMatchData) renderMatch(lastMatchData);
  } catch (_) { /* keep UI stable */ }
  if (token) loadTodayPanchang();
}

function showView(id) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById(`view-${id}`)?.classList.add('active');
  document.querySelectorAll('.app-tabbar button').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === id);
  });
  if (['rashi', 'muhurat', 'remedies', 'clients', 'matches', 'profile'].includes(id)) {
    document.querySelectorAll('.app-tabbar button').forEach((b) => {
      b.classList.toggle('active', b.dataset.view === 'more');
    });
  }
  if (id === 'clients') renderClients();
  if (id === 'matches') renderMatches();
  if (id === 'profile') fillProfileForm();
  if (id === 'dashboard') loadDashboard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fillCitySelects() {
  document.querySelectorAll('select[data-cities]').forEach((sel) => {
    const current = sel.value;
    sel.innerHTML = cities.map((c) =>
      `<option value="${c.name}" data-lat="${c.lat}" data-lon="${c.lon}">${c.name}</option>`
    ).join('');
    if (current) sel.value = current;
  });
}

function cityCoords(selectEl) {
  if (!selectEl) {
    return { place: 'Indore', lat: 22.7196, lon: 75.8577 };
  }
  const opt = selectEl.selectedOptions && selectEl.selectedOptions[0];
  const lat = opt ? parseFloat(opt.dataset.lat) : NaN;
  const lon = opt ? parseFloat(opt.dataset.lon) : NaN;
  if (!opt || Number.isNaN(lat) || Number.isNaN(lon)) {
    const fallback = cities[0] || { name: 'Indore', lat: 22.7196, lon: 75.8577 };
    return { place: selectEl.value || fallback.name, lat: fallback.lat, lon: fallback.lon };
  }
  return {
    place: selectEl.value || opt.value,
    lat,
    lon,
  };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[m]));
}

function clearSession() {
  token = '';
  currentUser = null;
  clients = [];
  matches = [];
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function saveSession(data) {
  token = data.token;
  currentUser = data.user;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
}

function showLogin() {
  document.getElementById('login-screen')?.classList.remove('hidden');
  document.getElementById('app-main')?.classList.add('hidden');
}

function showApp() {
  document.getElementById('login-screen')?.classList.add('hidden');
  document.getElementById('app-main')?.classList.remove('hidden');
  applyUserLabels();
}

function applyUserLabels() {
  if (!currentUser) return;
  const name = currentUser.name || currentUser.phone || '';
  const greet = document.getElementById('dash-greeting');
  if (greet) {
    greet.textContent = lang === 'hi' ? `नमस्ते, ${name}` : `Namaste, ${name}`;
  }
  const phoneLabel = document.getElementById('user-phone-label');
  if (phoneLabel && currentUser.phone) phoneLabel.textContent = `+91 ${currentUser.phone}`;
  const statPhone = document.getElementById('stat-phone');
  if (statPhone && currentUser.phone) statPhone.textContent = String(currentUser.phone).slice(-4);
}

function fillProfileForm() {
  if (!currentUser) return;
  const phone = document.getElementById('profile-phone');
  const name = document.getElementById('profile-name');
  const city = document.getElementById('profile-city');
  if (phone) phone.value = `+91 ${currentUser.phone}`;
  if (name) name.value = currentUser.name || '';
  if (city) city.value = currentUser.city || 'Indore';
  const langEl = document.getElementById('profile-lang');
  if (langEl) langEl.value = currentUser.preferred_lang || lang || 'en';
  const c = currentUser.charges || {};
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set('charge-region', c.region || currentUser.city || 'Madhya Pradesh');
  set('charge-kundli', c.kundli ?? '501');
  set('charge-matching', c.matching ?? '1100');
  set('charge-consult', c.consultation ?? '2100');
  set('charge-show-pdf', c.show_on_pdf === false ? '0' : '1');
}

async function downloadKundliPdf(chart) {
  const data = chart || lastKundliData;
  if (!data) {
    toast(lang === 'hi' ? 'पहले कुंडली बनाएँ' : 'Generate a Kundli first');
    return;
  }
  try {
    toast((i18n[lang] || i18n.en).pdf_ok);
    const res = await api('kundli_pdf', {
      chart: data,
      lang,
      include_charges: true,
    });
    const w = window.open('', '_blank');
    if (!w) {
      toast('Please allow pop-ups to download PDF');
      return;
    }
    w.document.open();
    w.document.write(res.data.html);
    w.document.close();
  } catch (err) {
    toast(err.message);
  }
}

async function loadDashboard() {
  if (!token) return;
  try {
    const res = await api('dashboard', {}, 'GET');
    currentUser = res.data.user;
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    applyUserLabels();
    document.getElementById('stat-kundlis').textContent = res.data.stats.kundlis;
    document.getElementById('stat-matches').textContent = res.data.stats.matches;
    clients = res.data.recent_kundlis || [];
    matches = res.data.recent_matches || [];
    renderDashRecent(clients);
  } catch (err) {
    toast(err.message);
  }
}

function renderDashRecent(list) {
  const box = document.getElementById('dash-recent-list');
  if (!box) return;
  if (!list.length) {
    box.innerHTML = `<p class="muted">${lang === 'hi' ? 'अभी कोई सहेजी कुंडली नहीं। कुंडली बनाएँ।' : 'No saved charts yet. Generate a Kundli.'}</p>`;
    return;
  }
  box.innerHTML = list.slice(0, 5).map((c) => `
    <div class="client-item">
      <div>
        <strong>${escapeHtml(c.name)}</strong>
        <span>${escapeHtml(c.place)} · ${escapeHtml(c.lagna || '—')} ${t('Lagna', 'लग्न')}</span>
      </div>
      <span>${escapeHtml(c.birth_date)}</span>
    </div>
  `).join('');
}

function renderClients() {
  const box = document.getElementById('client-list');
  if (!box) return;
  if (!clients.length) {
    box.innerHTML = `<p class="muted">${lang === 'hi' ? 'अभी कोई सहेजी कुंडली नहीं।' : 'No saved charts yet.'}</p>`;
    return;
  }
  box.innerHTML = clients.map((c) => `
    <div class="client-item">
      <div>
        <strong>${escapeHtml(c.name)}</strong>
        <span>${escapeHtml(c.place)} · ${escapeHtml(c.lagna || '—')} ${t('Lagna', 'लग्न')} · ${escapeHtml(c.moon_rashi || '—')} ${t('Moon', 'चंद्र')}</span>
      </div>
      <div class="item-actions">
        <button type="button" class="link-btn" data-open-kundli="${c.id}">${lang === 'hi' ? 'खोलें' : 'Open'}</button>
        <button type="button" class="link-btn danger" data-del-kundli="${c.id}">${lang === 'hi' ? 'हटाएँ' : 'Delete'}</button>
      </div>
    </div>
  `).join('');

  box.querySelectorAll('[data-open-kundli]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        const res = await api('client_get', { id: parseInt(btn.dataset.openKundli, 10) });
        showView('kundli');
        renderKundli(res.data.result);
        toast(lang === 'hi' ? 'कुंडली खोली गई' : 'Chart opened');
      } catch (err) {
        toast(err.message);
      }
    });
  });
  box.querySelectorAll('[data-del-kundli]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await api('client_delete', { id: parseInt(btn.dataset.delKundli, 10) });
        await refreshLists();
        toast(lang === 'hi' ? 'हटाया गया' : 'Deleted');
      } catch (err) {
        toast(err.message);
      }
    });
  });
}

function renderMatches() {
  const box = document.getElementById('match-list');
  if (!box) return;
  if (!matches.length) {
    box.innerHTML = `<p class="muted">${lang === 'hi' ? 'अभी कोई सहेजा मिलान नहीं।' : 'No saved matches yet.'}</p>`;
    return;
  }
  box.innerHTML = matches.map((m) => `
    <div class="client-item">
      <div>
        <strong>${escapeHtml(m.boy_name)} × ${escapeHtml(m.girl_name)}</strong>
        <span>${m.total}/${m.max} · ${m.percent}% · ${escapeHtml((m.verdict && (m.verdict[lang] || m.verdict.en)) || '')}</span>
      </div>
      <div class="item-actions">
        <button type="button" class="link-btn" data-open-match="${m.id}">${lang === 'hi' ? 'खोलें' : 'Open'}</button>
        <button type="button" class="link-btn danger" data-del-match="${m.id}">${lang === 'hi' ? 'हटाएँ' : 'Delete'}</button>
      </div>
    </div>
  `).join('');

  box.querySelectorAll('[data-open-match]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        const res = await api('match_get', { id: parseInt(btn.dataset.openMatch, 10) });
        showView('match');
        renderMatch(res.data.result);
        toast(lang === 'hi' ? 'मिलान खोला गया' : 'Match opened');
      } catch (err) {
        toast(err.message);
      }
    });
  });
  box.querySelectorAll('[data-del-match]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await api('match_delete', { id: parseInt(btn.dataset.delMatch, 10) });
        await refreshLists();
        toast(lang === 'hi' ? 'हटाया गया' : 'Deleted');
      } catch (err) {
        toast(err.message);
      }
    });
  });
}

async function refreshLists() {
  const [cRes, mRes] = await Promise.all([
    api('clients', {}, 'GET'),
    api('matches', {}, 'GET'),
  ]);
  clients = cRes.data || [];
  matches = mRes.data || [];
  renderClients();
  renderMatches();
  renderDashRecent(clients);
  document.getElementById('stat-kundlis').textContent = String(clients.length);
  document.getElementById('stat-matches').textContent = String(matches.length);
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value);
  return [];
}

function renderHouseChart(houses, lagna, planets, style) {
  const mode = style || 'south';
  if (window.JMCharts) {
    if (mode === 'north') return JMCharts.north(asList(houses), lagna || {}, lang);
    if (mode === 'western') return JMCharts.western(asList(planets), lagna || {}, lang);
    return JMCharts.south(asList(houses), lagna || {}, lang);
  }
  return '<p class="muted">Chart renderer unavailable</p>';
}

function renderKundli(data) {
  const box = document.getElementById('kundli-result');
  if (!box || !data) {
    toast(lang === 'hi' ? 'कुंडली डेटा नहीं मिला' : 'Kundli data missing');
    return;
  }
  lastKundliData = data;
  box.classList.remove('hidden');

  try {
    const meta = data.meta || {};
    const lagna = data.lagna || {};
    const moon = (data.rashi && data.rashi.moon) || {};
    const sun = (data.rashi && data.rashi.sun) || {};
    const pan = data.panchang_at_birth || {};
    const summary = (data.summary && (data.summary[lang] || data.summary.en)) || '';
    const planets = asList(data.planets);
    const houses = asList(data.houses);
    const dasha = data.dasha || {};
    const manglik = data.manglik || {};
    const kalsarpa = data.kalsarpa || {};
    const pitri = data.pitri || {};
    const yogas = asList(data.yogas);
    const d9 = (data.vargas && data.vargas.D9) || null;
    const style = meta.chart_style || 'south';
    const currentLabel = (dasha.current && (dasha.current.label || (dasha.current.lord)))
      || (dasha.current && dasha.current.mahadasha && dasha.current.mahadasha.lord)
      || '—';
    const currentMd = dasha.current && dasha.current.mahadasha ? dasha.current.mahadasha : dasha.current;

    const planetRows = planets.map((p) => `
      <tr>
        <td><strong>${escapeHtml(planetName(p.name) || p.name)}</strong></td>
        <td>${lang === 'hi' ? p.rashi_hi : p.rashi}</td>
        <td>${lang === 'hi' ? p.nakshatra_hi : p.nakshatra}<br><span class="muted">${t('Pada', 'पाद')} ${p.pada} · ${escapeHtml(planetName(p.nakshatra_lord) || p.nakshatra_lord || '')}</span></td>
        <td>${p.dms}<br><span class="muted">${Number(p.longitude).toFixed(2)}°</span></td>
      </tr>
    `).join('');

    const houseChips = houses.map((h) =>
      `<div class="slot"><div><strong>H${h.house}</strong> · ${lang === 'hi' ? h.rashi_hi : h.rashi}<br><span class="muted">${(h.planets || []).join(', ') || '—'}</span></div><span class="muted">${lang === 'hi' ? (h.meaning && h.meaning.hi) : (h.meaning && h.meaning.en)}</span></div>`
    ).join('');

    const curLord = currentMd && currentMd.lord;
    const dashaRows = asList(dasha.mahadashas).map((d) => {
      const antars = asList(d.antardashas).slice(0, 3).map((a) => `${a.lord}`).join(', ');
      const active = curLord && d.lord === curLord;
      return `<div class="slot ${active ? 'current-dasha' : ''}">
        <div><strong>${escapeHtml(d.lord)}</strong><div class="muted">${d.start} → ${d.end}${antars ? ` · AD: ${antars}…` : ''}</div></div>
        <span>${d.years}y</span>
      </div>`;
    }).join('');

    const yogaRows = yogas.map((y) => `
      <div class="slot">
        <div><strong>${lang === 'hi' ? y.name_hi : y.name}</strong>
        <div class="muted">${escapeHtml((y.note && (y.note[lang] || y.note.en)) || '')}</div></div>
      </div>
    `).join('');

    const birthTithi = pan.tithi
      ? (lang === 'hi' ? `${pan.tithi.paksha_hi} ${pan.tithi.name_hi}` : `${pan.tithi.paksha} ${pan.tithi.name}`)
      : '—';
    const birthVara = pan.vara ? (lang === 'hi' ? pan.vara.hi : pan.vara.en) : '—';
    const birthNak = pan.nakshatra
      ? (lang === 'hi' ? pan.nakshatra.name_hi : pan.nakshatra.name)
      : '—';

    box.innerHTML = `
      <div class="result-actions">
        <button type="button" class="btn" id="btn-kundli-pdf">${(i18n[lang] || i18n.en).pdf}</button>
      </div>
      <div class="kundli-layout">
        <div class="kundli-main">
          ${renderHouseChart(houses, lagna, planets, style)}
          <p class="kundli-summary">${escapeHtml(summary)}</p>
          <div class="stat-row">
            <div class="stat"><b>${lang === 'hi' ? (lagna.rashi_hi || '') : (lagna.rashi || '')}</b><span>${t('Lagna', 'लग्न')}<br>${lang === 'hi' ? (lagna.nakshatra_hi || '') : (lagna.nakshatra || '')} P${lagna.pada || ''}<br>${lagna.dms || ''}</span></div>
            <div class="stat"><b>${lang === 'hi' ? (moon.rashi_hi || '') : (moon.rashi || '')}</b><span>${t('Moon', 'चंद्र')}<br>${lang === 'hi' ? (moon.nakshatra_hi || '') : (moon.nakshatra || '')} P${moon.pada || ''}<br>${escapeHtml(planetName(moon.nakshatra_lord) || moon.nakshatra_lord || '')}</span></div>
            <div class="stat"><b>${lang === 'hi' ? (sun.rashi_hi || '') : (sun.rashi || '')}</b><span>${t('Sun', 'सूर्य')}<br>${lang === 'hi' ? (sun.nakshatra_hi || '') : (sun.nakshatra || '')} P${sun.pada || ''}<br>${sun.dms || ''}</span></div>
          </div>
        </div>
        <div class="kundli-side">
          <h3>${t('Birth Details', 'जन्म विवरण')}</h3>
          <div class="panchang-cards compact">
            <article><div class="k">${t('Name', 'नाम')}</div><div class="v">${escapeHtml(meta.name || '')}</div></article>
            <article><div class="k">${t('Date / Time', 'तिथि / समय')}</div><div class="v">${escapeHtml(meta.date || '')}<br><span class="muted">${escapeHtml(meta.time || '')}</span></div></article>
            <article><div class="k">${t('Place', 'स्थान')}</div><div class="v">${escapeHtml(meta.place || '')}</div></article>
            <article><div class="k">${t('Ayanamsa', 'अयनांश')}</div><div class="v">${escapeHtml(meta.ayanamsa_label || meta.ayanamsa || 'Lahiri')}<br><span class="muted">${meta.ayanamsa_value ?? ''}° · ${escapeHtml(meta.house_system || '')}</span></div></article>
          </div>
          <h3>${t('Dosha Check', 'दोष जाँच')}</h3>
          <p>${escapeHtml((manglik.note && (manglik.note[lang] || manglik.note.en)) || '—')}
            ${manglik.is_manglik ? ` <span class="badge avoid">${t('Manglik', 'मंगलिक')}</span>` : ` <span class="badge shubh">${t('Clear', 'शुद्ध')}</span>`}</p>
          <p>${escapeHtml((kalsarpa.note && (kalsarpa.note[lang] || kalsarpa.note.en)) || '')}
            ${kalsarpa.present ? ` <span class="badge avoid">${t('Kaal Sarpa', 'कालसर्प')}</span>` : ''}</p>
          <p>${escapeHtml((pitri.note && (pitri.note[lang] || pitri.note.en)) || '')}
            ${pitri.present ? ` <span class="badge avoid">${t('Pitri', 'पितृ')}</span>` : ''}</p>
          <h3>${t('Current Dasha', 'वर्तमान दशा')}</h3>
          <p><strong>${escapeHtml(currentLabel)}</strong>
            <span class="muted"> ${currentMd ? `${currentMd.start || ''} → ${currentMd.end || ''}` : ''}</span></p>
          <p class="muted" style="font-size:0.78rem">${t('Engine', 'इंजन')}: ${escapeHtml(meta.engine || '')}</p>
        </div>
      </div>

      ${d9 ? `<h3>${t('Navamsa (D9)', 'नवमांश (D9)')}</h3>
        ${renderHouseChart(d9.houses, d9.lagna, d9.planets, style === 'western' ? 'south' : style)}
        <p class="muted">${t('D9 Lagna', 'D9 लग्न')}: <strong>${lang === 'hi' ? d9.lagna.rashi_hi : d9.lagna.rashi}</strong></p>` : ''}

      <h3>${t('Birth Panchang', 'जन्म पंचांग')}</h3>
      <div class="panchang-cards">
        <article><div class="k">${t('Vara', 'वार')}</div><div class="v">${birthVara}${pan.vara && pan.vara.lord ? `<br><span class="muted">${escapeHtml(planetName(pan.vara.lord) || pan.vara.lord)}</span>` : ''}</div></article>
        <article><div class="k">${t('Tithi', 'तिथि')}</div><div class="v">${birthTithi}${pan.tithi && pan.tithi.percent != null ? `<br><span class="muted">${pan.tithi.percent}%</span>` : ''}</div></article>
        <article><div class="k">${t('Nakshatra', 'नक्षत्र')}</div><div class="v">${birthNak}${pan.nakshatra ? `<br><span class="muted">${t('Pada', 'पाद')} ${pan.nakshatra.pada} · ${escapeHtml(planetName(pan.nakshatra.lord) || pan.nakshatra.lord || '')}</span>` : ''}</div></article>
        <article><div class="k">${t('Yoga', 'योग')}</div><div class="v">${escapeHtml(yogaName(pan.yoga && pan.yoga.name))}</div></article>
        <article><div class="k">${t('Karana', 'करण')}</div><div class="v">${escapeHtml(karanaName(pan.karana && pan.karana.name))}</div></article>
        <article><div class="k">${t('Gender', 'लिंग')}</div><div class="v">${escapeHtml(meta.gender || '')}</div></article>
      </div>

      <h3 style="margin-top:1rem">${lang === 'hi' ? 'ग्रह स्थिति' : 'Planetary Positions'}</h3>
      <div class="table-wrap">
        <table class="planet-table">
          <thead><tr>
            <th>${lang === 'hi' ? 'ग्रह' : 'Graha'}</th>
            <th>${lang === 'hi' ? 'राशि' : 'Rashi'}</th>
            <th>${lang === 'hi' ? 'नक्षत्र / स्वामी' : 'Nakshatra / Lord'}</th>
            <th>${lang === 'hi' ? 'अंश' : 'Degree'}</th>
          </tr></thead>
          <tbody>${planetRows || '<tr><td colspan="4">—</td></tr>'}</tbody>
        </table>
      </div>

      <div class="kundli-two-col">
        <div>
          <h3>${lang === 'hi' ? 'विंशोत्तरी (महा + अन्तर)' : 'Vimshottari (Maha + Antar)'}</h3>
          ${dashaRows || '<p class="muted">—</p>'}
        </div>
        <div>
          <h3>${lang === 'hi' ? 'योग संकेत' : 'Yoga Indicators'}</h3>
          ${yogaRows || '<p class="muted">—</p>'}
        </div>
      </div>

      <h3 style="margin-top:1rem">${lang === 'hi' ? 'भाव (१२ घर)' : 'Houses (12 Bhavas)'}</h3>
      ${houseChips || '<p class="muted">—</p>'}
    `;
    document.getElementById('btn-kundli-pdf')?.addEventListener('click', () => downloadKundliPdf(data));
  } catch (err) {
    console.error(err);
    box.innerHTML = `<p class="muted">${lang === 'hi' ? 'कुंडली दिखाने में त्रुटि' : 'Error rendering kundli'}: ${escapeHtml(err.message)}</p>`;
    toast(err.message);
  }
}

function renderMatch(data) {
  lastMatchData = data;
  const box = document.getElementById('match-result');
  box.classList.remove('hidden');
  const bars = data.gunas.map((g) => {
    const pct = Math.round((g.score / g.max) * 100);
    const label = lang === 'hi'
      ? (g.label_hi || GUNA_HI[g.label] || g.label)
      : g.label;
    return `<div class="guna-bar"><div class="name">${escapeHtml(label)}</div><div class="track"><div class="fill" style="width:${pct}%"></div></div><div class="pts">${g.score}/${g.max}</div></div>`;
  }).join('');
  const remedies = (data.remedies[lang] || data.remedies.en).map((r) => `<li>${escapeHtml(r)}</li>`).join('');
  const doshas = data.doshas || {};
  const nadi = doshas.nadi || {};
  const report = (data.report && (data.report[lang] || data.report.en)) || '';
  box.innerHTML = `
    <div class="stat-row">
      <div class="stat"><b>${data.total}</b><span>${t('Gunas', 'गुण')} / ${data.max}</span></div>
      <div class="stat"><b>${data.percent}%</b><span>${t('Score', 'अंक')}</span></div>
      <div class="stat"><b>${data.verdict[lang] || data.verdict.en}</b><span>${t('Verdict', 'परिणाम')}</span></div>
    </div>
    <p><strong>${escapeHtml(data.boy.name)}</strong> (${lang === 'hi' ? data.boy.rashi_hi : data.boy.rashi})
      × <strong>${escapeHtml(data.girl.name)}</strong> (${lang === 'hi' ? data.girl.rashi_hi : data.girl.rashi})</p>
    ${bars}
    <p class="muted" style="margin-top:0.75rem">${escapeHtml(data.manglik.boy.note[lang] || data.manglik.boy.note.en)}</p>
    <p class="muted">${escapeHtml(data.manglik.girl.note[lang] || data.manglik.girl.note.en)}</p>
    <h3 style="margin-top:0.75rem">${t('Dosha analysis', 'दोष जाँच')}</h3>
    <p>${escapeHtml((nadi.note && (nadi.note[lang] || nadi.note.en)) || '')}
      ${nadi.present ? ` <span class="badge avoid">${t('Nadi', 'नाड़ी')}</span>` : ` <span class="badge shubh">${t('OK', 'ठीक')}</span>`}</p>
    <p class="muted">${escapeHtml(report)}</p>
    <h3 style="margin-top:0.75rem">${t('Remedies', 'उपाय')}</h3>
    <ul>${remedies}</ul>
  `;
}

function renderPanchang(data) {
  lastPanchangData = data;
  const box = document.getElementById('panchang-result');
  box.classList.remove('hidden');
  const tithi = lang === 'hi'
    ? `${data.tithi.paksha_hi} ${data.tithi.name_hi}`
    : `${data.tithi.paksha} ${data.tithi.name}`;
  const vara = lang === 'hi' ? data.vara.hi : data.vara.en;
  const nak = lang === 'hi' ? data.nakshatra.name_hi : data.nakshatra.name;
  const sun = data.sun_rashi || {};
  const moon = data.moon_rashi || {};
  const sunLabel = lang === 'hi' ? (sun.rashi_hi || sun.rashi || '—') : (sun.rashi || '—');
  const moonLabel = lang === 'hi' ? (moon.rashi_hi || moon.rashi || '—') : (moon.rashi || '—');
  const sunNak = lang === 'hi' ? (sun.nakshatra_hi || sun.nakshatra || '') : (sun.nakshatra || '');
  const moonNak = lang === 'hi' ? (moon.nakshatra_hi || moon.nakshatra || '') : (moon.nakshatra || '');
  const padaLabel = t('Pada', 'पाद');
  const lordLabel = t('Lord', 'स्वामी');

  box.innerHTML = `
    <div class="panchang-cards">
      <article><div class="k">${t('Vara', 'वार')}</div><div class="v">${vara}<br><span class="muted">${lordLabel}: ${escapeHtml(planetName(data.vara.lord) || data.vara.lord || '')}</span></div></article>
      <article><div class="k">${t('Tithi', 'तिथि')}</div><div class="v">${tithi}<br><span class="muted">#${data.tithi.number} · ${data.tithi.percent}%${data.tithi.start ? ` · ${data.tithi.start}–${data.tithi.end}` : ''}</span></div></article>
      <article><div class="k">${t('Nakshatra', 'नक्षत्र')}</div><div class="v">${nak}<br><span class="muted">${padaLabel} ${data.nakshatra.pada} · ${escapeHtml(planetName(data.nakshatra.lord) || data.nakshatra.lord || '')}${data.nakshatra.start ? ` · ${data.nakshatra.start}–${data.nakshatra.end}` : ''}</span></div></article>
      <article><div class="k">${t('Yoga', 'योग')}</div><div class="v">${escapeHtml(yogaName(data.yoga.name))}<br><span class="muted">#${data.yoga.index}${data.yoga.start ? ` · ${data.yoga.start}–${data.yoga.end}` : ''}</span></div></article>
      <article><div class="k">${t('Karana', 'करण')}</div><div class="v">${escapeHtml(karanaName(data.karana.name))}<br><span class="muted">#${data.karana.index}</span></div></article>
      <article><div class="k">${t('Rahu Kaal', 'राहुकाल')}</div><div class="v">${data.rahukaal.start}–${data.rahukaal.end}</div></article>
      <article><div class="k">${t('Yamaganda', 'यमगण्ड')}</div><div class="v">${(data.yamaganda && data.yamaganda.start) || '—'}–${(data.yamaganda && data.yamaganda.end) || ''}</div></article>
      <article><div class="k">${t('Gulika', 'गुलिक')}</div><div class="v">${(data.gulika && data.gulika.start) || '—'}–${(data.gulika && data.gulika.end) || ''}</div></article>
      <article><div class="k">${t('Sunrise', 'सूर्योदय')}</div><div class="v">${escapeHtml(data.sunrise || data.sunrise_approx || '—')}</div></article>
      <article><div class="k">${t('Sunset', 'सूर्यास्त')}</div><div class="v">${escapeHtml(data.sunset || data.sunset_approx || '—')}</div></article>
      <article><div class="k">${t('Abhijit', 'अभिजित्')}</div><div class="v">${data.abhijit?.start || '—'}–${data.abhijit?.end || ''}</div></article>
      <article><div class="k">${t('Sun Rashi', 'सूर्य राशि')}</div><div class="v">${sunLabel}<br><span class="muted">${sunNak}${sun.pada ? ` · ${t('Pada', 'पाद')} ${sun.pada}` : ''}</span></div></article>
      <article><div class="k">${t('Moon Rashi', 'चंद्र राशि')}</div><div class="v">${moonLabel}<br><span class="muted">${moonNak}${moon.pada ? ` · ${t('Pada', 'पाद')} ${moon.pada}` : ''}</span></div></article>
      <article><div class="k">${t('Date', 'दिनांक')}</div><div class="v">${escapeHtml(data.date || '')}</div></article>
    </div>
    <p class="muted" style="margin-top:0.75rem">${escapeHtml(data.notes[lang] || data.notes.en)}</p>
  `;
}

function renderMuhurat(data) {
  const box = document.getElementById('muhurat-result');
  box.classList.remove('hidden');
  const slots = data.slots.map((s) => `
    <div class="slot">
      <div>
        <strong>${s.start} – ${s.end}</strong>
        <div class="muted">${s.nakshatra} · ${s.tithi}</div>
      </div>
      <div>
        <span class="badge ${s.rating === 'Shubh' ? 'shubh' : s.rating === 'Chal' ? 'chal' : 'avoid'}">${lang === 'hi' ? s.rating_hi : s.rating}</span>
        <div class="muted" style="text-align:right">${s.score}</div>
      </div>
    </div>
  `).join('');
  box.innerHTML = `
    <p><strong>${lang === 'hi' ? 'सर्वोत्तम' : 'Best'}:</strong> ${data.best.start}–${data.best.end}
      <span class="badge shubh">${lang === 'hi' ? data.best.rating_hi : data.best.rating}</span></p>
    <p class="muted">${lang === 'hi' ? data.purpose_label.hi : data.purpose_label.en} · ${data.date}</p>
    <div style="margin-top:0.5rem">${slots}</div>
  `;
}

function renderRashiGrid() {
  const grid = document.getElementById('rashi-grid');
  if (!grid) return;
  const names = [
    ['Aries', 'मेष'], ['Taurus', 'वृषभ'], ['Gemini', 'मिथुन'], ['Cancer', 'कर्क'],
    ['Leo', 'सिंह'], ['Virgo', 'कन्या'], ['Libra', 'तुला'], ['Scorpio', 'वृश्चिक'],
    ['Sagittarius', 'धनु'], ['Capricorn', 'मकर'], ['Aquarius', 'कुम्भ'], ['Pisces', 'मीन'],
  ];
  grid.innerHTML = names.map((n, i) => `
    <button type="button" class="rashi-btn" data-index="${i}">
      <strong>${lang === 'hi' ? n[1] : n[0]}</strong>
      <span>${lang === 'hi' ? n[0] : n[1]}</span>
    </button>
  `).join('');
  grid.querySelectorAll('.rashi-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      grid.querySelectorAll('.rashi-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const index = parseInt(btn.dataset.index, 10);
      const res = await api('rashi', { index });
      const p = res.data.profile;
      const r = res.data.remedies;
      const box = document.getElementById('rashi-result');
      box.classList.remove('hidden');
      box.innerHTML = `
        <h3>${lang === 'hi' ? p.rashi_hi : p.rashi} · ${p.element}</h3>
        <p><strong>${lang === 'hi' ? 'स्वामी' : 'Lord'}:</strong> ${p.lord}</p>
        <p>${p.traits.join(' · ')}</p>
        <p><strong>${lang === 'hi' ? 'कैरियर' : 'Career'}:</strong> ${p.career}</p>
        <p><strong>${lang === 'hi' ? 'शुभ रंग / अंक' : 'Lucky color / number'}:</strong> ${p.lucky_color} / ${p.lucky_number}</p>
        <p><strong>${lang === 'hi' ? 'उपाय' : 'Remedy'}:</strong> ${r.remedy.gem}, ${r.remedy.mantra}, ${r.remedy.day}</p>
      `;
    });
  });
}

async function loadTodayPanchang() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const res = await api('panchang', { date: today });
    const el = document.getElementById('today-panchang');
    if (el) {
      const t = lang === 'hi'
        ? `${res.data.tithi.paksha_hi} ${res.data.tithi.name_hi}`
        : `${res.data.tithi.paksha} ${res.data.tithi.name}`;
      const n = lang === 'hi' ? res.data.nakshatra.name_hi : res.data.nakshatra.name;
      const v = lang === 'hi' ? res.data.vara.hi : res.data.vara.en;
      el.innerHTML = `<strong>${v}</strong> · ${t} · ${n}`;
    }
  } catch (_) { /* ignore */ }
}

async function enterApp() {
  // Show shell immediately so login never feels stuck after Welcome
  showApp();
  showView('dashboard');
  setLang(lang, { refresh: false });
  applyUserLabels();

  try {
    const cityRes = await api('cities', {}, 'GET');
    if (cityRes.cities && cityRes.cities.length) {
      cities = cityRes.cities;
    }
    fillCitySelects();
  } catch (e) {
    fillCitySelects();
  }

  const today = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('#app-main input[type="date"]').forEach((inp) => {
    if (!inp.value) {
      inp.value = inp.name?.includes('boy') ? '1990-05-12'
        : inp.name?.includes('girl') ? '1992-08-21'
        : today;
    }
  });

  try { renderRashiGrid(); } catch (_) { /* ignore */ }

  await loadDashboard().catch(() => {});
  await refreshLists().catch(() => {});
  await loadTodayPanchang();
  showView('dashboard');
}

async function init() {
  setLang(lang, { refresh: false });

  document.querySelectorAll('.lang-toggle button').forEach((b) => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  document.getElementById('lang-select')?.addEventListener('change', (e) => {
    setLang(e.target.value);
  });

  fillCitySelects();

  document.querySelectorAll('[data-view]').forEach((el) => {
    el.addEventListener('click', () => showView(el.dataset.view));
  });

  document.getElementById('form-login')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn.disabled) return;
    btn.disabled = true;
    try {
      const res = await api('login', {
        phone: fd.get('phone'),
        password: fd.get('password'),
        name: fd.get('name') || undefined,
      });
      saveSession(res.data);
      // Open dashboard first, then greet — avoids "Welcome but still on login"
      await enterApp();
      toast(lang === 'hi' ? 'स्वागत है' : 'Welcome');
    } catch (err) {
      toast(err.message);
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    try { await api('logout'); } catch (_) { /* ignore */ }
    clearSession();
    showLogin();
    toast(lang === 'hi' ? 'लॉग आउट' : 'Logged out');
  });

  document.getElementById('btn-theme')?.addEventListener('click', () => {
    const dark = document.body.classList.toggle('theme-dark');
    localStorage.setItem('jm_theme', dark ? 'dark' : 'light');
  });
  if (localStorage.getItem('jm_theme') === 'dark') {
    document.body.classList.add('theme-dark');
  }

  document.getElementById('form-profile')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const res = await api('update_profile', {
        name: fd.get('name'),
        city: fd.get('city'),
        preferred_lang: fd.get('preferred_lang'),
        charges: {
          region: fd.get('charge_region'),
          currency: 'INR',
          kundli: fd.get('charge_kundli'),
          matching: fd.get('charge_matching'),
          consultation: fd.get('charge_consult'),
          show_on_pdf: String(fd.get('charge_show_pdf')) === '1',
        },
      });
      currentUser = res.data.user;
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      if (currentUser.preferred_lang) setLang(currentUser.preferred_lang);
      applyUserLabels();
      toast((i18n[lang] || i18n.en).save_ok);
    } catch (err) {
      toast(err.message);
    }
  });

  document.getElementById('form-kundli')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const placeEl = form.elements.namedItem('place') || form.querySelector('[name="place"]');
    const city = cityCoords(placeEl);
    const btn = form.querySelector('button[type="submit"]');
    const name = String(fd.get('name') || '').trim();
    if (!name) {
      toast(lang === 'hi' ? 'नाम लिखें' : 'Please enter a name');
      return;
    }
    btn.disabled = true;
    const oldLabel = btn.textContent;
    btn.innerHTML = '<span class="loading"></span>';
    try {
      const res = await api('kundli', {
        name,
        date: fd.get('date'),
        time: fd.get('time'),
        gender: fd.get('gender'),
        place: city.place,
        lat: city.lat,
        lon: city.lon,
        ayanamsa: fd.get('ayanamsa') || 'lahiri',
        house_system: fd.get('house_system') || 'whole_sign',
        chart_style: fd.get('chart_style') || 'south',
      });
      if (!res.data) throw new Error('Empty kundli response');
      renderKundli(res.data);
      toast(lang === 'hi' ? 'कुंडली सहेजी गई' : 'Kundli created & saved');
      refreshLists().catch(() => {});
    } catch (err) {
      console.error(err);
      toast(err.message || (lang === 'hi' ? 'कुंडली नहीं बनी' : 'Could not create kundli'));
    } finally {
      btn.disabled = false;
      btn.textContent = oldLabel || (lang === 'hi' ? 'कुंडली बनाएँ' : 'Generate Kundli');
    }
  });

  document.getElementById('form-match')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const boyCity = cityCoords(e.target.boy_place);
    const girlCity = cityCoords(e.target.girl_place);
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      const res = await api('match', {
        boy_name: fd.get('boy_name'),
        boy_date: fd.get('boy_date'),
        boy_time: fd.get('boy_time'),
        boy_place: boyCity.place,
        boy_lat: boyCity.lat,
        boy_lon: boyCity.lon,
        girl_name: fd.get('girl_name'),
        girl_date: fd.get('girl_date'),
        girl_time: fd.get('girl_time'),
        girl_place: girlCity.place,
        girl_lat: girlCity.lat,
        girl_lon: girlCity.lon,
      });
      renderMatch(res.data);
      await refreshLists();
      toast(lang === 'hi' ? 'मिलान सहेजा गया' : 'Match saved to your account');
    } catch (err) {
      toast(err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = lang === 'hi' ? 'गुण मिलान करें' : 'Match Gunas';
    }
  });

  document.getElementById('form-panchang')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const city = cityCoords(e.target.place);
    try {
      const res = await api('panchang', { date: fd.get('date'), ...city });
      renderPanchang(res.data);
    } catch (err) {
      toast(err.message);
    }
  });

  document.getElementById('form-muhurat')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const res = await api('muhurat', { date: fd.get('date'), purpose: fd.get('purpose') });
      renderMuhurat(res.data);
    } catch (err) {
      toast(err.message);
    }
  });

  document.getElementById('form-dob-rashi')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const res = await api('rashi', { date: fd.get('date'), time: fd.get('time') || '12:00' });
      const box = document.getElementById('rashi-result');
      box.classList.remove('hidden');
      const moon = res.data.moon;
      const p = res.data.profile;
      box.innerHTML = `
        <h3>${lang === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}: ${lang === 'hi' ? moon.rashi_hi : moon.rashi}</h3>
        <p>${lang === 'hi' ? moon.nakshatra_hi : moon.nakshatra} · Pada ${moon.pada}</p>
        <p>${p.traits.join(' · ')}</p>
        <p>${p.career}</p>
      `;
      document.querySelectorAll('#rashi-grid .rashi-btn').forEach((b) => {
        b.classList.toggle('active', parseInt(b.dataset.index, 10) === moon.rashi_index);
      });
    } catch (err) {
      toast(err.message);
    }
  });

  // Restore session if token exists
  if (token) {
    try {
      const me = await api('me', {}, 'GET');
      currentUser = me.data.user;
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      await enterApp();
      return;
    } catch (_) {
      clearSession();
    }
  }
  showLogin();
}

document.addEventListener('DOMContentLoaded', init);
