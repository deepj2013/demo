/* Los Niños theme script: inject branding + render dynamic lists */

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
  document.documentElement.style.setProperty('--theme-accent', school.colors.accent ?? '#27ae60');

  // Common header/branding
  setText(document.getElementById('schoolName'), school.name);
  setText(document.getElementById('schoolNameHindi'), school.nameHindi);
  setText(document.getElementById('titleSchoolName'), school.name);
  const hParts = school.nameHindi.split(' ').filter(Boolean);
  setText(document.getElementById('schoolShortHindi'), (hParts[0] || '') + (hParts[1] ? ` ${hParts[1]}` : ''));
  setText(document.getElementById('schoolTagline'), school.tagline);

  // Footer
  setText(document.getElementById('footerSchoolName'), school.name);
  setText(document.getElementById('footerAddress'), school.address);
  setText(document.getElementById('footerCopyName'), school.name);
  setText(document.getElementById('year'), String(new Date().getFullYear()));

  setText(document.getElementById('footerPhone'), school.phone);
  setHref(document.getElementById('footerPhone'), `tel:${school.phone.replace(/\s+/g, '')}`);

  setText(document.getElementById('footerEmail'), school.email);
  setHref(document.getElementById('footerEmail'), `mailto:${school.email}`);

  // Contact-page block
  setText(document.getElementById('contactAddress'), school.address);
  setText(document.getElementById('contactPhone'), school.phone);
  setHref(document.getElementById('contactPhone'), `tel:${school.phone.replace(/\s+/g, '')}`);
  setText(document.getElementById('contactEmail'), school.email);
  setHref(document.getElementById('contactEmail'), `mailto:${school.email}`);

  // School-specific counters (if present in markup)
  const statNodes = document.querySelectorAll('.stats-row .stat-number[data-count]');
  if (statNodes && statNodes.length >= 3 && school.stats) {
    statNodes[0].dataset.count = String(school.stats.students);
    statNodes[1].dataset.count = String(school.stats.teachers);
    statNodes[2].dataset.count = String(school.stats.classrooms);
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
    .card-tag{display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(243,156,18,.16);border:1px solid rgba(243,156,18,.22);font-weight:800;font-size:.78rem;margin-bottom:10px}
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

function renderActivities() {
  const grid = document.getElementById('activitiesGrid');
  if (!grid) return;

  const activities = [
    { icon: '🎨', title: 'Color & Shape Studio', desc: 'Painting, tracing, and shape play to build focus and fine motor skills.' },
    { icon: '📚', title: 'Story Time Adventures', desc: 'Book-based learning with songs, rhymes, and gentle comprehension.' },
    { icon: '🧩', title: 'Puzzle & Build Lab', desc: 'Blocks, sorting games and sensory activities for early logic.' },
    { icon: '🎵', title: 'Rhymes & Music Moves', desc: 'Rhythm, movement and phonics through music-based learning.' },
    { icon: '🌿', title: 'Nature & Hygiene Habits', desc: 'Small routines that teach caring, cleanliness and curiosity.' },
    { icon: '⚽', title: 'Playful Physical Education', desc: 'Age-safe movement, coordination games, and fun social play.' }
  ];

  grid.innerHTML = '';
  activities.forEach((a) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'activity-card fade-in';
    cardEl.innerHTML = `
      <div class="activity-icon" aria-hidden="true">${a.icon}</div>
      <h3>${a.title}</h3>
      <p>${a.desc}</p>
    `;
    grid.appendChild(cardEl);
  });
}

function renderCourses() {
  const container = document.getElementById('coursesContainer');
  if (!container) return;

  const school = getSchoolData();
  const picks = COURSES.map((c) => ({
    ...c,
    image: c.category === 'Sports' ? school.images.sports : school.images.classroom
  }));

  container.innerHTML = '';
  picks.forEach((c) => {
    container.appendChild(
      makeCard({
        title: c.title,
        desc: `${c.category} • ${c.duration}`,
        image: c.image,
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

  const school = getSchoolData();
  container.innerHTML = '';
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

function boot() {
  setBranding();
  renderActivities();
  renderCourses();
  renderTeachers();
  renderEvents();
  renderGallery();
  renderBlog();

  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = document.querySelector('.form-note');
      if (note) note.textContent = 'Thanks! This demo request was captured locally (no backend connected).';
      form.reset();
    });
  }
}

// Execute immediately (before DOMContentLoaded) so theme-utils counters/observers pick up injected content.
boot();