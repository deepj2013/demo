/* Kiddoz theme script: branding + dynamic lists + stats + team leaders + newsletter/contact */

function setText(el, value) {
  if (!el) return;
  el.textContent = value ?? '';
}

function setHref(el, href) {
  if (!el) return;
  el.setAttribute('href', href);
}

function setBranding() {
  const school = getSchoolData();

  document.documentElement.style.setProperty('--theme-primary', school.colors.primary);
  document.documentElement.style.setProperty('--theme-secondary', school.colors.secondary);
  document.documentElement.style.setProperty('--theme-accent', school.colors.accent ?? '#fdcb6e');

  setText(document.getElementById('schoolName'), school.name);
  setText(document.getElementById('schoolNameHindi'), school.nameHindi);
  setText(document.getElementById('titleSchoolName'), school.name);

  const hParts = school.nameHindi.split(' ').filter(Boolean);
  setText(document.getElementById('schoolShortHindi'), (hParts[0] || '') + (hParts[1] ? ` ${hParts[1]}` : ''));
  setText(document.getElementById('schoolTagline'), school.tagline);

  setText(document.getElementById('footerSchoolName'), school.name);
  setText(document.getElementById('footerAddress'), school.address);
  setText(document.getElementById('footerCopyName'), school.name);
  setText(document.getElementById('year'), String(new Date().getFullYear()));

  setText(document.getElementById('footerPhone'), school.phone);
  setHref(document.getElementById('footerPhone'), `tel:${school.phone.replace(/\s+/g, '')}`);

  setText(document.getElementById('footerEmail'), school.email);
  setHref(document.getElementById('footerEmail'), `mailto:${school.email}`);

  setText(document.getElementById('contactAddress'), school.address);
  setText(document.getElementById('contactPhone'), school.phone);
  setHref(document.getElementById('contactPhone'), `tel:${school.phone.replace(/\s+/g, '')}`);
  setText(document.getElementById('contactEmail'), school.email);
  setHref(document.getElementById('contactEmail'), `mailto:${school.email}`);

  // Stats counters (if present)
  const stats = document.querySelectorAll('.stats-row .stat-number[data-count]');
  if (stats && stats.length >= 4 && school.stats) {
    stats[0].dataset.count = String(school.stats.students);
    stats[1].dataset.count = String(school.stats.teachers);
    stats[2].dataset.count = String(school.stats.years);
    stats[3].dataset.count = String(school.stats.classrooms);
  }
}

function ensureCardLiteStyle() {
  if (document.getElementById('theme-card-lite-style')) return;
  const style = document.createElement('style');
  style.id = 'theme-card-lite-style';
  style.textContent = `
    .card-lite{background:rgba(255,255,255,.78);border:1px solid rgba(0,0,0,.06);border-radius:22px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.04)}
    .card-lite img{height:170px;object-fit:cover;width:100%}
    .card-lite-body{padding:14px}
    .card-lite h3{font-size:1.05rem}
    .card-lite p{margin-top:8px;color:rgba(0,0,0,.65);font-size:.95rem}
    .card-tag{display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(129,236,236,.14);border:1px solid rgba(129,236,236,.22);font-weight:1000;font-size:.78rem;margin-bottom:10px}
  `;
  document.head.appendChild(style);
}

function makeCard({ title, desc, image, tag }) {
  ensureCardLiteStyle();
  const wrap = document.createElement('article');
  wrap.className = 'card-lite fade-in';

  if (image) {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = title || 'Image';
    img.src = image;
    wrap.appendChild(img);
  }

  const body = document.createElement('div');
  body.className = 'card-lite-body';

  if (tag) {
    const t = document.createElement('div');
    t.className = 'card-tag';
    t.textContent = tag;
    body.appendChild(t);
  }

  const h = document.createElement('h3');
  h.textContent = title || '';
  body.appendChild(h);

  if (desc) {
    const p = document.createElement('p');
    p.textContent = desc;
    body.appendChild(p);
  }

  wrap.appendChild(body);
  return wrap;
}

function renderCourses() {
  const container = document.getElementById('coursesContainer');
  if (!container) return;
  const school = getSchoolData();
  container.innerHTML = '';

  COURSES.forEach((c) => {
    container.appendChild(
      makeCard({
        title: c.title,
        desc: `${c.category} • ${c.duration}`,
        image: c.category === 'Sports' ? school.images.sports : school.images.classroom,
        tag: c.level
      })
    );
  });
}

function renderTeachers() {
  const container = document.getElementById('teachersContainer');
  if (!container) return;
  const school = getSchoolData();
  container.innerHTML = '';

  TEACHERS.forEach((t, idx) => {
    container.appendChild(
      makeCard({
        title: t.name,
        desc: `${t.subject} • ${t.experience}`,
        image: idx % 2 === 0 ? school.images.classroom : school.images.students,
        tag: t.role
      })
    );
  });
}

function renderEvents() {
  const container = document.getElementById('eventsContainer');
  if (!container) return;
  const school = getSchoolData();
  container.innerHTML = '';

  EVENTS.forEach((e) => {
    container.appendChild(
      makeCard({
        title: e.title,
        desc: `${e.date} • ${e.time} • ${e.location}`,
        image: school.images.event,
        tag: 'Event'
      })
    );
  });
}

function renderGallery() {
  const container = document.getElementById('galleryContainer');
  if (!container) return;
  const school = getSchoolData();
  const images = [
    { src: school.images.students, label: 'Learning Moments' },
    { src: school.images.classroom, label: 'Playful Classrooms' },
    { src: school.images.sports, label: 'Movement & Games' },
    { src: school.images.lab, label: 'Activity Corners' },
    { src: school.images.library, label: 'Story & Reading' },
    { src: school.images.event, label: 'Events & Fun' }
  ];

  container.innerHTML = '';
  images.forEach((img) => {
    const tile = document.createElement('figure');
    tile.className = 'gallery-tile fade-in';
    tile.innerHTML = `<img src="${img.src}" alt="${img.label}" loading="lazy" /><figcaption>${img.label}</figcaption>`;
    container.appendChild(tile);
  });
}

function renderBlog() {
  const container = document.getElementById('blogContainer');
  if (!container) return;
  container.innerHTML = '';
  const school = getSchoolData();

  BLOG_POSTS.forEach((p, idx) => {
    container.appendChild(
      makeCard({
        title: p.title,
        desc: `${p.category} • ${p.date} — ${p.excerpt}`,
        image: idx % 2 === 0 ? school.images.library : school.images.about,
        tag: 'Blog'
      })
    );
  });
}

function renderTeamLeaders() {
  const container = document.getElementById('teamLeadersContainer');
  if (!container) return;
  const school = getSchoolData();
  container.innerHTML = '';

  // Prefer roles that read like leaders; fall back to first few teachers.
  const picks = [...TEACHERS].slice(0, 3);

  picks.forEach((t, idx) => {
    const card = document.createElement('article');
    card.className = 'team-card fade-in';
    const icon = idx === 0 ? '👩‍🏫' : idx === 1 ? '🧑‍🏫' : '📚';
    card.innerHTML = `
      <div class="team-photo" aria-hidden="true">${icon}</div>
      <h3>${t.name}</h3>
      <p>${t.role}</p>
      <div class="team-meta">
        <span class="team-pill">${t.subject}</span>
        <span class="team-pill">${t.experience}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = document.querySelector('.newsletter .form-note');
    if (note) note.textContent = 'Subscribed! Demo-only (no backend connected).';
    form.reset();
  });
}

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = document.querySelector('.form-note');
    if (note) note.textContent = 'Thanks! This demo request was captured locally (no backend connected).';
    form.reset();
  });
}

function boot() {
  setBranding();
  renderCourses();
  renderTeachers();
  renderEvents();
  renderGallery();
  renderBlog();
  renderTeamLeaders();
  initNewsletter();
  initContactForm();
}

boot();

document.addEventListener('DOMContentLoaded',()=>{
  const obs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('visible')}),{threshold:.1});
  document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
  const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav-menu');
  if(toggle&&nav)toggle.addEventListener('click',()=>{nav.classList.toggle('active');toggle.classList.toggle('active')});
  document.querySelectorAll('[data-count]').forEach(el=>{
    const t=+el.dataset.count,suffix=el.dataset.suffix||'';
    const o=new IntersectionObserver(e=>{if(e[0].isIntersecting){let c=0;const i=setInterval(()=>{c+=t/50;if(c>=t){c=t;clearInterval(i)}el.textContent=Math.floor(c).toLocaleString('en-IN')+suffix},30);o.disconnect()}});
    o.observe(el);
  });
});