/* EduAll Theme runtime (HTML is rendered based on page iframe hash). */
(function () {
  const pageContent = document.getElementById('pageContent');
  const hero = document.getElementById('hero');
  const brandText = document.getElementById('brandText');
  const footerSchoolHindi = document.getElementById('footerSchoolHindi');
  const footerMeta = document.getElementById('footerMeta');
  const yearEl = document.getElementById('year');

  const pageId = (window.location.hash || '#home').replace('#', '') || 'home';

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function getThemeIdFromPath() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'eduall';
  }

  function setSchoolThemeVars(school) {
    document.documentElement.style.setProperty('--school-primary', school.colors.primary);
    document.documentElement.style.setProperty('--school-secondary', school.colors.secondary);
    document.documentElement.style.setProperty('--school-accent', school.colors.accent || '#27ae60');
  }

  function heroSlidesHtml(school) {
    const img1 = school.images.hero;
    const img2 = school.images.classroom || school.images.students;
    const img3 = school.images.library;
    return `
      <div class="hero-shell">
        <div class="hero-bg" style="background-image:url('${escapeHtml(img1)}')"></div>
        <div class="hero-overlay"></div>
        <div class="hero-grid">
          <div style="position:relative">
            <div class="hero-title">
              ${escapeHtml(school.name)}<span class="hindi"> — ई-लर्निंग &amp; CBSE</span>
            </div>
            <div class="hero-sub">${escapeHtml(school.tagline)}</div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="./courses.html">Enroll Now →</a>
              <a class="btn btn-ghost" href="./contact.html">Request Prospectus →</a>
              <span class="pill">📚 <strong>${escapeHtml(school.board)}</strong> • ${escapeHtml(school.grades)}</span>
            </div>
          </div>

          <div class="hero-side" style="position:relative">
            <div class="side-card">
              <h4>🎓 Learning Tracks</h4>
              <p>Category-wise courses + Progress-based enrollment.</p>
              <div class="side-row">
                <div class="side-badge">📈</div>
                <div style="font-weight:900;color:#fff">Weekly Assessments</div>
              </div>
            </div>
            <div class="side-card">
              <h4>🏅 Certificates</h4>
              <p>Digital completion certificates for each track.</p>
              <div class="side-row">
                <div class="side-badge">🪪</div>
                <div style="font-weight:900;color:#fff">Verified Issuance</div>
              </div>
            </div>
          </div>
        </div>

        <div aria-hidden="true">
          <div class="hero-slide active" style="background-image:url('${escapeHtml(img1)}')"></div>
          <div class="hero-slide" style="background-image:url('${escapeHtml(img2)}')"></div>
          <div class="hero-slide" style="background-image:url('${escapeHtml(img3)}')"></div>
        </div>
      </div>
    `;
  }

  function renderStats(school) {
    return `
      <div class="stats">
        <div class="card stat"><div class="num" data-count="${school.stats.students}">0</div><div class="label">Students</div></div>
        <div class="card stat"><div class="num" data-count="${school.stats.teachers}">0</div><div class="label">Teachers</div></div>
        <div class="card stat"><div class="num" data-count="${school.stats.years}">0</div><div class="label">Years</div></div>
        <div class="card stat"><div class="num" data-count="${school.stats.classrooms}">0</div><div class="label">Classrooms</div></div>
      </div>
    `;
  }

  function renderCourseCategories(courses) {
    const cats = Array.from(new Set(courses.map((c) => c.category)));
    return cats.map((c) => `<button class="fbtn" data-cat="${escapeHtml(c)}" type="button">${escapeHtml(c)}</button>`).join('');
  }

  function renderCourseCards(courses, activeCategory) {
    const filtered = courses.filter((c) => !activeCategory || c.category === activeCategory);
    return filtered
      .map(
        (c) => `
      <div class="card course-card">
        <div class="course-top">
          <div>
            <div class="course-cat">${escapeHtml(c.category)}</div>
            <div class="course-title">${escapeHtml(c.title)}</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:950;color:#fff">${escapeHtml(c.lessons)} Lessons</div>
            <div style="color:var(--muted);font-size:.86rem">${escapeHtml(c.duration)}</div>
          </div>
        </div>
        <div class="course-meta">Level: <strong style="color:#fff">${escapeHtml(c.level)}</strong></div>
        <div class="course-actions">
          <a class="btn btn-primary" href="./contact.html" data-enroll="${escapeHtml(c.title)}">Enroll →</a>
          <a class="btn btn-ghost" href="./courses.html">View Syllabus →</a>
        </div>
      </div>
    `
      )
      .join('');
  }

  function renderCertificates() {
    return `
      <div class="page-title">
        <h2>🏅 Certificates &amp; Track Completion</h2>
        <p>Enroll, learn, and get digital certificates aligned to CBSE standards.</p>
      </div>
      <div class="certificate">
        <div class="card cert-card" style="--w:74%" data-progress="74">
          <h3>Digital Certificate — Course Completion</h3>
          <p>Completion proof generated after final assessment.</p>
          <div class="progress"><span></span></div>
          <a class="btn btn-primary" href="./contact.html" style="margin-top:12px;width:100%;">Get Sample →</a>
        </div>
        <div class="card cert-card" style="--w:58%" data-progress="58">
          <h3>🏅 Competency Badge — Subject Mastery</h3>
          <p>Badges for sustained performance and skill checks.</p>
          <div class="progress"><span></span></div>
          <a class="btn btn-ghost" href="./courses.html" style="margin-top:12px;width:100%;">Explore Subjects →</a>
        </div>
        <div class="card cert-card" style="--w:66%" data-progress="66">
          <h3>🎖️ Scholarship Acknowledgement</h3>
          <p>Merit-based scholarship achievement recognition.</p>
          <div class="progress"><span></span></div>
          <a class="btn btn-ghost" href="./events.html" style="margin-top:12px;width:100%;">See Announcement →</a>
        </div>
      </div>
    `;
  }

  function renderTeachersCards() {
    const imgs = [
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80'
    ];

    return TEACHERS.map((t, idx) => {
      const img = imgs[idx % imgs.length];
      return `
        <div class="card teacher-card">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(t.name)}">
          <div class="role">${escapeHtml(t.experience)}</div>
          <h3>${escapeHtml(t.name)}</h3>
          <p><strong style="color:#fff">${escapeHtml(t.subject)}</strong></p>
          <p>${escapeHtml(t.role)}</p>
        </div>
      `;
    }).join('');
  }

  function renderEvents() {
    return `
      <div class="section-split">
        <div class="filters card">
          <h3>📅 Upcoming Events</h3>
          <p style="color:var(--muted)">साल भर गतिविधियाँ — PTM, फेस्ट, और CBSE उत्सव.</p>
          <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
            <span class="pill">🗓️ ${EVENTS.length} Events</span>
            <span class="pill">🏫 Nursery–XII</span>
          </div>
        </div>
        <div class="courses-wrap">
          <div class="list-grid">
            ${EVENTS.map((e) => `
              <div class="card row-card">
                <div class="date-pill">
                  <div class="d">${escapeHtml(e.date)}</div>
                  <div class="t">${escapeHtml(e.time)}</div>
                </div>
                <div>
                  <h3>${escapeHtml(e.title)}</h3>
                  <p>${escapeHtml(e.location)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderGallery(school) {
    const imgs = [
      school.images.students,
      school.images.classroom,
      school.images.sports,
      school.images.lab,
      school.images.library,
      school.images.event,
      school.images.about,
      school.images.classroom
    ];
    return `
      <div class="page-title">
        <h2>📸 Gallery — Classroom Moments</h2>
        <p>Students learning through activities, projects and daily practice.</p>
      </div>
      <div class="img-grid">
        ${imgs.slice(0, 8).map((src, i) => `
          <div class="img-tile">
            <img src="${escapeHtml(src)}" alt="Gallery image ${i + 1}">
            <span>${i === 0 ? 'Learning' : 'CBSE'} ${i + 1}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderBlog() {
    return `
      <div class="page-title">
        <h2>📝 Blog — Updates &amp; Guidance</h2>
        <p>Academics, exam prep tips, and event highlights.</p>
      </div>
      <div class="blog-grid">
        ${BLOG_POSTS.map((p) => `
          <div class="card blog-card">
            <div class="tag">${escapeHtml(p.category)}</div>
            <h3>${escapeHtml(p.title)}</h3>
            <p><strong style="color:#fff">${escapeHtml(p.date)}</strong></p>
            <p>${escapeHtml(p.excerpt)}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderContact(school) {
    return `
      <div class="page-title">
        <h2>📞 Contact Us</h2>
        <p>Admission enquiry and course registration — हम जवाब देंगे।</p>
      </div>
      <div class="contact-grid">
        <div class="card contact-form">
          <div class="field">
            <label for="name">Full Name</label>
            <input id="name" type="text" placeholder="Your name" />
          </div>
          <div class="field">
            <label for="mobile">Phone / WhatsApp</label>
            <input id="mobile" type="tel" placeholder="10 digit mobile" />
          </div>
          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" placeholder="Tell us your requirement (Nursery–XII)"></textarea>
          </div>
          <button class="btn btn-primary" type="button" style="width:100%" id="submitBtn">Submit Enquiry →</button>
          <div style="margin-top:10px;color:var(--muted);font-weight:700;font-size:.9rem" id="formNote"></div>
        </div>
        <div class="card help-box">
          <div class="info-line">🏫 ${escapeHtml(school.nameHindi)}</div>
          <div class="mini">📍 ${escapeHtml(school.address)}</div>
          <div class="mini">☎ ${escapeHtml(school.phone)}</div>
          <div class="mini">🕒 ${escapeHtml(school.hours)}</div>
          <div class="mini">🌐 ${escapeHtml(school.board)}</div>
          <div style="margin-top:6px;color:var(--muted);font-weight:750">
            Quick Tip: Call for school visit &amp; counselling.
          </div>
        </div>
      </div>
    `;
  }

  function renderAbout(school) {
    return `
      <div class="section-split">
        <div class="filters card">
          <h3>विद्यालय परिचय</h3>
          <p style="color:var(--muted)">${escapeHtml(school.nameHindi)} — ${escapeHtml(school.grades)}</p>
          <div style="margin-top:16px;display:grid;gap:10px">
            <div class="row-card" style="padding:16px">
              <div class="date-pill">
                <div class="d">${escapeHtml(school.established)}</div>
                <div class="t">Founded</div>
              </div>
              <div>
                <h3>CBSE Curriculum</h3>
                <p>Strong academics with co-curricular growth.</p>
              </div>
            </div>
            <div class="row-card" style="padding:16px">
              <div class="date-pill">
                <div class="d">${escapeHtml(school.principal.split(' ')[0] || 'Principal')}</div>
                <div class="t">Principal</div>
              </div>
              <div>
                <h3>${escapeHtml(school.principal)}</h3>
                <p>Guiding students with values and discipline.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="courses-wrap">
          <div class="page-title" style="text-align:left;margin-bottom:18px">
            <h2>Know More About EduAll LMS</h2>
            <p>${escapeHtml(school.tagline)}</p>
          </div>
          <div class="grid-2">
            <div class="card" style="padding:16px">
              <h3 style="font-size:1rem">📌 Our Motto</h3>
              <p style="color:var(--muted);font-size:.92rem">${escapeHtml(school.motto)}</p>
            </div>
            <div class="card" style="padding:16px">
              <h3 style="font-size:1rem">🏅 Learning Focus</h3>
              <p style="color:var(--muted);font-size:.92rem">Progress tracking, assessments, and skill badges.</p>
            </div>
          </div>
          <div style="margin-top:18px">${renderCertificates()}</div>
        </div>
      </div>
    `;
  }

  function renderCourses(courses) {
    const categoriesHtml = renderCourseCategories(courses);
    return `
      <div class="section-split">
        <aside class="filters card">
          <h3>📚 Course Categories</h3>
          <p style="color:var(--muted)">Select a category to filter course cards.</p>
          <div class="filter-btns" id="categoryButtons">
            <button class="fbtn active" data-cat="all" type="button">All Categories</button>
            ${categoriesHtml}
          </div>
          <div style="margin-top:16px;color:var(--muted);font-weight:750;font-size:.92rem">
            Tip: Enrollment is enquiry-based (demo).
          </div>
        </aside>
        <section class="courses-wrap">
          <div class="page-title" style="text-align:left">
            <h2>Courses — CBSE Learning Paths</h2>
            <p>Interactive enrollment cards with category filters.</p>
          </div>
          <div class="grid-3" id="coursesGrid">${renderCourseCards(courses, null)}</div>
        </section>
      </div>
    `;
  }

  function renderHome(school) {
    return `
      <div class="page-title">
        <h2>EduAll — LMS for Nursery to XII</h2>
        <p>Enroll in tracks, monitor progress, and earn certificates.</p>
      </div>

      ${renderStats(school)}

      <div class="section-split" style="margin-top:22px">
        <div class="filters">
          <h3>⚡ Quick Enroll Categories</h3>
          <p style="color:var(--muted)">Start with popular learning tracks.</p>
          <div class="filter-btns">
            <button class="fbtn active" data-cat="Academic" type="button">Academic</button>
            <button class="fbtn" data-cat="Language" type="button">Language</button>
            <button class="fbtn" data-cat="Technology" type="button">Technology</button>
            <button class="fbtn" data-cat="Sports" type="button">Sports</button>
          </div>
          <div style="margin-top:14px">
            <div class="card" style="padding:16px">
              <div style="display:flex;gap:10px;align-items:flex-start">
                <div class="side-badge">🗂️</div>
                <div>
                  <h3 style="font-size:1rem">Category Filters + Enrollment Cards</h3>
                  <p style="color:var(--muted);font-size:.92rem">Explore and enquire for registration.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="courses-wrap">
          <div class="grid-3" id="homeCoursesGrid">
            ${renderCourseCards(COURSES.slice(0, 6), null)}
          </div>

          <div style="margin-top:20px">
            <div class="page-title" style="text-align:left;margin:0 0 16px">
              <h2 style="font-size:1.55rem">👩‍🏫 Instructor Profiles</h2>
              <p>Subject experts guiding CBSE learning paths.</p>
            </div>
            <div class="grid-3">${renderTeachersCards()}</div>
          </div>
        </div>
      </div>

      <div style="margin-top:24px">${renderCertificates()}</div>
    `;
  }

  function renderPage(id) {
    const school = getSchoolData();
    setSchoolThemeVars(school);

    brandText.textContent = `${school.nameHindi} — EduAll`;
    footerSchoolHindi.textContent = school.nameHindi;
    footerMeta.innerHTML = `📍 ${escapeHtml(school.address)}<br/>☎ ${escapeHtml(school.phone)}`;
    yearEl.textContent = String(new Date().getFullYear());

    hero.innerHTML = heroSlidesHtml(school);

    switch (id) {
      case 'about':
        pageContent.innerHTML = renderAbout(school);
        break;
      case 'courses':
        pageContent.innerHTML = renderCourses(COURSES);
        break;
      case 'teachers':
        pageContent.innerHTML = `
          <div class="page-title">
            <h2>Teachers — Subject Experts</h2>
            <p>Qualified faculty for CBSE (Nursery to XII).</p>
          </div>
          <div class="grid-3">${renderTeachersCards()}</div>
        `;
        break;
      case 'events':
        pageContent.innerHTML = renderEvents();
        break;
      case 'gallery':
        pageContent.innerHTML = renderGallery(school);
        break;
      case 'blog':
        pageContent.innerHTML = renderBlog();
        break;
      case 'contact':
        pageContent.innerHTML = renderContact(school);
        break;
      case 'home':
      default:
        pageContent.innerHTML = renderHome(school);
        break;
    }

    // Home filter
    if (id === 'home') {
      const grid = document.getElementById('homeCoursesGrid');
      const buttons = document.querySelectorAll('.filters .fbtn');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          buttons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.cat;
          const list = COURSES.filter((c) => c.category === cat).slice(0, 6);
          grid.innerHTML = renderCourseCards(list, null);
        });
      });
    }

    // Courses filter
    if (id === 'courses') {
      const buttons = document.querySelectorAll('#categoryButtons .fbtn');
      const grid = document.getElementById('coursesGrid');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          buttons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.cat;
          grid.innerHTML = renderCourseCards(COURSES, cat === 'all' ? null : cat);
        });
      });
    }

    // Contact form demo
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const note = document.getElementById('formNote');
        const name = document.getElementById('name')?.value?.trim();
        const mobile = document.getElementById('mobile')?.value?.trim();
        note.textContent = name && mobile ? `Thanks ${name}! We will contact you shortly.` : 'Please fill name and phone number.';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderPage(pageId);
  });
})();

