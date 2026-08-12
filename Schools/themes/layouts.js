/** Shared HTML partials and page generators per layout type */
const PAGES = ['index', 'about', 'courses', 'teachers', 'events', 'gallery', 'blog', 'contact'];
const PAGE_LABELS = { index: 'Home', about: 'About', courses: 'Courses', teachers: 'Teachers', events: 'Events', gallery: 'Gallery', blog: 'Blog', contact: 'Contact' };

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80',
  students: 'https://images.unsplash.com/photo-1503676260728-1c00da1a2fc4?w=800&q=80',
  classroom: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  lab: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
  library: 'https://images.unsplash.com/photo-1524995997942-1c7eacadef95?w=800&q=80',
  event: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  kids: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80'
};

const COURSES = [
  { t: 'Mathematics', c: 'Academic', l: 48, d: 'Full Year' },
  { t: 'Science & Technology', c: 'Academic', l: 42, d: 'Full Year' },
  { t: 'English Language', c: 'Language', l: 36, d: 'Full Year' },
  { t: 'Hindi & Sanskrit', c: 'Language', l: 30, d: 'Full Year' },
  { t: 'Computer Science', c: 'Technology', l: 24, d: 'Semester' },
  { t: 'Physical Education', c: 'Sports', l: 20, d: 'Full Year' }
];

const TEACHERS = [
  { n: 'Mrs. Sunita Devi', r: 'Senior Mathematics Teacher', s: 'Mathematics', e: '15 years' },
  { n: 'Mr. Amit Singh', r: 'Science Department Head', s: 'Physics & Chemistry', e: '12 years' },
  { n: 'Mrs. Kavita Sharma', r: 'English Language Expert', s: 'English', e: '10 years' },
  { n: 'Mr. Ravi Kumar', r: 'Computer Science Instructor', s: 'IT & Coding', e: '8 years' }
];

const EVENTS = [
  { d: '15 Aug 2026', t: 'Independence Day Celebration', l: 'School Ground', time: '8:00 AM' },
  { d: '05 Sep 2026', t: "Teachers' Day Program", l: 'Auditorium', time: '10:00 AM' },
  { d: '14 Nov 2026', t: "Children's Day Fest", l: 'School Campus', time: '9:00 AM' },
  { d: '26 Jan 2027', t: 'Republic Day Parade', l: 'School Ground', time: '8:30 AM' }
];

const BLOG = [
  { t: 'Annual Day 2026 — A Grand Success', d: '10 Mar 2026', c: 'Events', img: IMAGES.event },
  { t: 'CBSE Board Exam Preparation Tips', d: '01 Feb 2026', c: 'Academics', img: IMAGES.classroom },
  { t: 'Science Exhibition Highlights', d: '20 Jan 2026', c: 'Science', img: IMAGES.lab }
];

function nav(page) {
  return PAGES.map(p => `<a href="${p}.html" class="nav-link${p === page ? ' active' : ''}">${PAGE_LABELS[p]}</a>`).join('');
}

function head(s, theme, page) {
  const title = page === 'index' ? s.name : `${PAGE_LABELS[page]} — ${s.name}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=${theme.fontUrl}&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body class="theme-${theme.layout}" data-theme="${theme.name.toLowerCase()}">`;
}

function footer(s) {
  return `<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <div class="footer-logo">🏫</div>
      <h3>${s.name}</h3>
      <p class="hindi">${s.hindi}</p>
      <p class="footer-tag">${s.type} · Nursery to Class XII · CBSE</p>
    </div>
    <div class="footer-links">
      <h4>Quick Links</h4>
      <a href="about.html">About Us</a>
      <a href="courses.html">Courses</a>
      <a href="teachers.html">Teachers</a>
      <a href="events.html">Events</a>
      <a href="contact.html">Contact</a>
    </div>
    <div class="footer-contact">
      <h4>Contact Info</h4>
      <p>📍 ${s.address}</p>
      <p>📞 ${s.phone}</p>
      <p>✉ ${s.email}</p>
      <p>🕐 Mon–Sat: 8:00 AM – 2:00 PM</p>
    </div>
    <div class="footer-newsletter">
      <h4>Stay Updated</h4>
      <p>Subscribe for admission alerts & news</p>
      <form class="newsletter-form" onsubmit="event.preventDefault();alert('Subscribed! (demo)')">
        <input type="email" placeholder="Your email" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </div>
  <div class="footer-bottom container">
    <span>© 2026 ${s.name}. All Rights Reserved.</span>
    <span>Developed by <a href="https://savoka.in" target="_blank" rel="noopener">savoka.in</a></span>
  </div>
</footer>
<script src="../../../shared/js/school-data.js"></script>
<script src="../../../shared/js/theme-utils.js"></script>
<script src="js/main.js"></script>
</body></html>`;
}

/* ─── Header variants ─── */
function headerLmsLight(s, theme, page) {
  return `<header class="site-header">
  <div class="topbar"><div class="container topbar-inner">
    <div class="topbar-left"><span>📞 ${s.phone}</span><span>✉ ${s.email}</span></div>
    <div class="topbar-right"><span>🕐 Mon–Sat 8AM–2PM</span></div>
  </div></div>
  <div class="navbar"><div class="container nav-inner">
    <a href="index.html" class="brand"><span class="brand-icon">🎓</span><div><strong>${s.name.split(' ').slice(0, 2).join(' ')}</strong><small class="hindi">${s.hindi}</small></div></a>
    <button class="menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
    <nav class="nav-menu">${nav(page)}</nav>
    <a href="contact.html" class="nav-cta">Get Started</a>
  </div></div>
</header>`;
}

function headerLmsDark(s, theme, page) {
  return `<header class="site-header dark-header">
  <div class="container nav-inner">
    <a href="index.html" class="brand"><span class="brand-icon">📘</span><div><strong>${s.name.split(' ').slice(0, 2).join(' ')}</strong><small class="hindi">${s.hindi}</small></div></a>
    <button class="menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
    <nav class="nav-menu">${nav(page)}</nav>
    <a href="contact.html" class="nav-cta">Enroll Now</a>
  </div>
</header>`;
}

function headerKinder(s, theme, page) {
  return `<header class="site-header kinder-header">
  <div class="container nav-inner">
    <a href="index.html" class="brand"><span class="brand-bubble">🌈</span><div><strong>${s.name.split(' ').slice(0, 2).join(' ')}</strong><small class="hindi">${s.hindi}</small></div></a>
    <button class="menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
    <nav class="nav-menu">${nav(page)}</nav>
  </div>
</header>`;
}

function headerPreschool(s, theme, page) {
  return `<header class="site-header preschool-header">
  <div class="header-wave"></div>
  <div class="container nav-inner">
    <a href="index.html" class="brand"><div class="brand-shape"></div><div><span class="brand-kicker">${theme.tagline}</span><strong>${s.name.split(' ').slice(0, 2).join(' ')}</strong><small class="hindi">${s.hindi}</small></div></a>
    <button class="menu-toggle" aria-label="Menu"><span class="menu-bars"></span></button>
    <nav class="nav-menu">${nav(page)}<a href="contact.html" class="nav-link nav-cta">Enroll</a></nav>
  </div>
</header>`;
}

function getHeader(layout, s, theme, page) {
  const lmsLight = ['kadu', 'eginary', 'wellearn'];
  const lmsDark = ['edusion'];
  const edurock = ['eduall'];
  const kinder = ['bornomala', 'edrio', 'kidso', 'los-ninos'];
  const preschool = ['kidscholl', 'ascen', 'cutie', 'kiddoz'];
  const academic = ['eduvision'];
  const university = ['ischool'];

  if (lmsLight.includes(layout) || academic.includes(layout) || university.includes(layout)) return headerLmsLight(s, theme, page);
  if (lmsDark.includes(layout) || edurock.includes(layout)) return headerLmsDark(s, theme, page);
  if (kinder.includes(layout)) return headerKinder(s, theme, page);
  if (preschool.includes(layout)) return headerPreschool(s, theme, page);
  return headerLmsLight(s, theme, page);
}

function getIndex(layout, s, theme) {
  const map = {
    kadu: indexLmsLight,
    eginary: indexLmsLight,
    wellearn: indexLmsLight,
    bornomala: indexKinderPlayful,
    edrio: indexKinderPlayful,
    kidso: indexKinderPlayful,
    'los-ninos': indexKinderPlayful,
    eduvision: indexAcademicSplit,
    ischool: indexUniversity,
    edusion: indexLmsDark,
    eduall: indexEdurock,
    kidscholl: indexPreschool,
    ascen: indexPreschool,
    cutie: indexPreschool,
    kiddoz: indexPreschool
  };
  const fn = map[layout] || indexLmsLight;
  return fn(s, theme);
}

function pageHero(title, subtitle, theme) {
  return `<section class="page-banner"><div class="container"><h1>${title}</h1><p>${subtitle}</p><div class="breadcrumb"><a href="index.html">Home</a> / ${title}</div></div></section>`;
}

/* ─── Index layouts ─── */
function indexLmsLight(s, theme) {
  const cats = ['Mathematics', 'Science', 'Languages', 'Technology', 'Sports', 'Arts'];
  const catIcons = ['📐', '🔬', '📖', '💻', '⚽', '🎨'];
  return `<main>
<section class="hero-lms">
  <div class="hero-slider">
    <div class="hero-slide active" style="background-image:url('${IMAGES.hero}')">
      <div class="container hero-content">
        <span class="hero-kicker">${theme.tagline}</span>
        <h1>Online Platform For <span>Education</span></h1>
        <p class="hindi">${s.hindi}</p>
        <p>${s.tagline} — CBSE curriculum from Nursery to Class XII in East Delhi</p>
        <div class="hero-btns"><a href="courses.html" class="btn btn-primary">View Courses</a><a href="about.html" class="btn btn-outline">Find Out More</a></div>
      </div>
    </div>
  </div>
  <div class="hero-dots"><span class="active"></span><span></span><span></span></div>
</section>

<section class="section categories-section">
  <div class="container">
    <div class="section-head"><span class="section-label">Online Classes</span><h2>Popular Categories</h2><p>Explore subject areas designed for every learner</p></div>
    <div class="category-grid">${cats.map((c, i) => `<a href="courses.html" class="category-card fade-in"><span class="cat-icon">${catIcons[i]}</span><h3>${c}</h3><span class="cat-link">View Subject →</span></a>`).join('')}</div>
  </div>
</section>

<section class="section about-band">
  <div class="container about-split">
    <div class="about-img fade-in"><img src="${IMAGES.students}" alt="Students"><div class="experience-badge"><strong>${s.years}+</strong><span>Years Experience</span></div></div>
    <div class="about-text fade-in">
      <span class="section-label">About Us</span>
      <h2>Welcome to the Online Learning Center</h2>
      <p>${s.name} delivers quality CBSE education with modern teaching methods. Our motto: <em>${s.motto}</em></p>
      <ul class="check-list"><li>✓ Experienced & certified teachers</li><li>✓ Smart classrooms & digital learning</li><li>✓ Holistic development programs</li><li>✓ Hindi + English medium support</li></ul>
      <a href="about.html" class="btn btn-primary">Explore More</a>
    </div>
  </div>
</section>

<section class="section stats-band">
  <div class="container stats-row">
    <div class="stat-box fade-in"><span data-count="${s.students}" data-suffix="+">0</span><p>Total Students</p></div>
    <div class="stat-box fade-in"><span data-count="${s.teachers}">0</span><p>Expert Teachers</p></div>
    <div class="stat-box fade-in"><span data-count="${s.years}">0</span><p>Years Experience</p></div>
    <div class="stat-box fade-in"><span data-count="12">0</span><p>Grade Levels</p></div>
  </div>
</section>

<section class="section courses-section">
  <div class="container">
    <div class="section-head"><span class="section-label">Course List</span><h2>Perfect Online Courses For Your Career</h2></div>
    <div class="course-tabs"><button class="tab active">All</button><button class="tab">Academic</button><button class="tab">Language</button><button class="tab">Technology</button></div>
    <div class="course-grid">${COURSES.map(c => `<article class="course-card fade-in"><div class="course-thumb"><img src="${IMAGES.classroom}" alt="${c.t}"><span class="course-cat">${c.c}</span></div><div class="course-body"><h3>${c.t}</h3><div class="course-meta"><span>📚 ${c.l} Lessons</span><span>⏱ ${c.d}</span></div><div class="course-footer"><div class="instructor"><span>👩‍🏫</span> ${TEACHERS[0].n}</div><a href="contact.html" class="btn btn-sm">Enroll →</a></div></div></article>`).join('')}</div>
  </div>
</section>

<section class="section testimonials-section">
  <div class="container">
    <div class="section-head"><span class="section-label">Testimonials</span><h2>What They Say About Us</h2></div>
    <div class="testimonial-grid">
      <blockquote class="testimonial fade-in"><p>"My child improved confidence with friendly teacher support and structured learning."</p><footer><strong>Asha Sharma</strong><span>Parent</span></footer></blockquote>
      <blockquote class="testimonial fade-in"><p>"Great co-curricular activities and regular progress updates from the school."</p><footer><strong>Rakesh Verma</strong><span>Parent</span></footer></blockquote>
      <blockquote class="testimonial fade-in"><p>"CBSE preparation is strong and learning stays practical and engaging."</p><footer><strong>Neha Gupta</strong><span>Parent</span></footer></blockquote>
    </div>
  </div>
</section>

<section class="section blog-preview">
  <div class="container">
    <div class="section-head"><span class="section-label">News & Blogs</span><h2>Latest News & Blog</h2></div>
    <div class="blog-grid">${BLOG.map(b => `<article class="blog-card fade-in"><div class="blog-img"><img src="${b.img}" alt="${b.t}"><span class="blog-date">${b.d.split(' ')[0]} ${b.d.split(' ')[1]}</span></div><div class="blog-body"><span class="blog-cat">${b.c}</span><h3>${b.t}</h3><a href="blog.html">Read More →</a></div></article>`).join('')}</div>
  </div>
</section>

<section class="cta-band"><div class="container cta-inner fade-in"><h2>Still Need Our Support?</h2><p>Admissions open for 2026-27 — Get in touch today</p><a href="contact.html" class="btn btn-white">Contact Us</a></div></section>
</main>`;
}

function indexEdurock(s, theme) {
  return `<main>
<section class="hero-edurock">
  <div class="hero-bg" style="background-image:url('${IMAGES.hero}')"></div>
  <div class="hero-overlay"></div>
  <div class="container hero-content">
    <span class="hero-tag">Education Solution</span>
    <h1>Cloud-based LMS Trusted by <span>1000+</span></h1>
    <p class="hindi">${s.hindi}</p>
    <p>${s.tagline} — Comprehensive CBSE education from Nursery to Class XII</p>
    <div class="hero-btns"><a href="courses.html" class="btn btn-primary">View Courses</a><a href="about.html" class="btn btn-ghost">Find out more</a></div>
  </div>
</section>

<section class="section about-edurock">
  <div class="container about-grid-edu">
    <div class="about-img-wrap fade-in"><img src="${IMAGES.students}" alt="About"><div class="exp-float"><span>${s.years}+</span><small>YEARS EXPERIENCE</small></div></div>
    <div class="fade-in">
      <span class="section-tag">About Us</span>
      <h2>Welcome to the Online Learning Center</h2>
      <p>${s.name} provides structured CBSE learning with experienced faculty and modern facilities.</p>
      <ul class="feature-dots"><li>Explore a variety of fresh educational teaching methods</li><li>Regular assessments and parent communication</li><li>Co-curricular and sports programs</li></ul>
    </div>
  </div>
</section>

<section class="stats-edurock"><div class="container stats-edu-row">
  <div class="stat-edu fade-in"><span data-count="27" data-suffix="+">0</span><p>Total Achievement</p></div>
  <div class="stat-edu fade-in"><span data-count="${s.students}" data-suffix="+">0</span><p>Total Students</p></div>
  <div class="stat-edu fade-in"><span data-count="${s.teachers}">0</span><p>Total Instructors</p></div>
  <div class="stat-edu fade-in"><span data-count="${s.years}">0</span><p>Years of Excellence</p></div>
</div></section>

<section class="section subjects-section">
  <div class="container">
    <div class="section-head center"><span class="section-tag">Popular Subject</span><h2>Provide IT & Technology Subject For You</h2></div>
    <div class="subject-grid">
      ${['Business Studies', 'Mathematics', 'Science & Tech', 'Arts & Design'].map(sub => `<div class="subject-card fade-in"><div class="subject-icon">📚</div><h3>${sub}</h3><p>Structured CBSE curriculum with expert guidance</p><a href="courses.html">View Subject →</a></div>`).join('')}
    </div>
  </div>
</section>

<section class="section courses-edurock">
  <div class="container">
    <div class="section-head center"><span class="section-tag">Course List</span><h2>Perfect Online Course For Your Career</h2></div>
    <div class="course-grid-edu">${COURSES.slice(0, 4).map(c => `<article class="course-edu fade-in"><span class="course-label">${c.c}</span><h3>${c.t}</h3><div class="course-info"><span>📚 ${c.l} Lessons</span><span>⏱ ${c.d}</span></div><div class="course-price"><span class="price">CBSE</span><span class="instructor-name">${TEACHERS[0].n}</span></div></article>`).join('')}</div>
  </div>
</section>

<section class="section pricing-section">
  <div class="container">
    <div class="section-head center"><span class="section-tag">Pricing Plan</span><h2>Choose The Best Package For Your Learning</h2></div>
    <div class="pricing-grid">
      <div class="price-card fade-in"><span class="plan-name">NURSERY</span><div class="plan-price">Free<span>/ inquiry</span></div><ul><li>Play-based learning</li><li>Safe environment</li><li>Activity programs</li></ul><a href="contact.html" class="btn btn-primary">Get Started</a></div>
      <div class="price-card featured fade-in"><span class="plan-name">PRIMARY</span><div class="plan-price">₹29<span>/ month*</span></div><ul><li>CBSE curriculum</li><li>Smart classrooms</li><li>Sports & arts</li></ul><a href="contact.html" class="btn btn-primary">Get Started</a></div>
      <div class="price-card fade-in"><span class="plan-name">SECONDARY</span><div class="plan-price">₹59<span>/ month*</span></div><ul><li>Board exam prep</li><li>Science labs</li><li>Career guidance</li></ul><a href="contact.html" class="btn btn-primary">Get Started</a></div>
    </div>
  </div>
</section>

<section class="section register-section">
  <div class="container register-split">
    <div class="fade-in"><span class="section-tag">Course List</span><h2>Register Your Account — Get Free Access</h2><p>Learn something new & build your career from anywhere</p></div>
    <form class="register-form fade-in" onsubmit="event.preventDefault();alert('Registered! (demo)')"><h4>Fill Your Registration</h4><input type="text" placeholder="Full Name" required><input type="email" placeholder="Email" required><textarea placeholder="Message"></textarea><button type="submit" class="btn btn-primary">Sign Up</button></form>
  </div>
</section>

<section class="section testimonials-edurock"><div class="container">
  <div class="section-head center"><span class="section-tag">Course List</span><h2>What They Say About Us</h2></div>
  <div class="testimonial-edu-grid">${['Asha Sharma', 'Rakesh Verma'].map(n => `<blockquote class="testimonial-edu fade-in"><p>"Excellent school with dedicated teachers and strong CBSE foundation for our children."</p><footer><strong>${n}</strong><span>Parent</span></footer></blockquote>`).join('')}</div>
</div></section>
</main>`;
}

function indexKinderPlayful(s, theme) {
  const activities = [
    { icon: '🧠', label: 'Mind Games' }, { icon: '📖', label: 'Story Time' },
    { icon: '🧩', label: 'Puzzle Play' }, { icon: '🎨', label: 'Art Studio' },
    { icon: '🎵', label: 'Music & Dance' }, { icon: '🏃', label: 'Outdoor Fun' }
  ];
  return `<main>
<section class="hero-kinder">
  <div class="container hero-kinder-grid">
    <div class="hero-bubble fade-in">
      <span class="pill-tag">Nursery · Primary · CBSE</span>
      <h1>Playful Learning That Makes Kids <span>Smile</span></h1>
      <p class="hindi">${s.hindi}</p>
      <p>${s.tagline} — Safe routines, activity-based learning in Hindi + English</p>
      <div class="hero-btns"><a href="courses.html" class="btn btn-primary">Our Activities</a><a href="contact.html" class="btn btn-soft">Talk to Admissions</a></div>
      <div class="activity-grid">${activities.map(a => `<div class="activity-card"><span>${a.icon}</span><b>${a.label}</b></div>`).join('')}</div>
    </div>
    <div class="hero-photo fade-in"><img src="${IMAGES.kids}" alt="Happy kids"><div class="photo-badge">🌟 Fun Learning</div></div>
  </div>
  <div class="hero-shapes"><span class="shape s1"></span><span class="shape s2"></span><span class="shape s3"></span></div>
</section>

<section class="section programs-section">
  <div class="container">
    <div class="section-head center"><span class="section-label">Our Programs</span><h2>Learning Activities For Every Child</h2></div>
    <div class="program-grid">${COURSES.slice(0, 4).map(c => `<div class="program-card fade-in"><div class="program-icon">📚</div><h3>${c.t}</h3><p>${c.l} sessions · ${c.c}</p><a href="courses.html">Learn More →</a></div>`).join('')}</div>
  </div>
</section>

<section class="section stats-kinder"><div class="container stats-bubbles">
  <div class="stat-bubble fade-in"><span data-count="${s.students}" data-suffix="+">0</span><p>Happy Students</p></div>
  <div class="stat-bubble fade-in"><span data-count="${s.teachers}">0</span><p>Caring Teachers</p></div>
  <div class="stat-bubble fade-in"><span data-count="${s.years}">0</span><p>Years of Joy</p></div>
</div></section>

<section class="section team-kinder"><div class="container">
  <div class="section-head center"><span class="section-label">Our Teachers</span><h2>Meet Our Friendly Faculty</h2></div>
  <div class="team-grid">${TEACHERS.map(t => `<div class="team-card fade-in"><div class="team-avatar">👩‍🏫</div><h3>${t.n}</h3><p>${t.r}</p><span>${t.s}</span></div>`).join('')}</div>
</div></section>

<section class="section parents-section"><div class="container">
  <div class="section-head center"><span class="section-label">Testimonials</span><h2>What Parents Say</h2></div>
  <div class="parent-cards"><blockquote class="parent-quote fade-in"><p>"Our child loves going to school every day!"</p><footer>Asha Sharma — Parent</footer></blockquote><blockquote class="parent-quote fade-in"><p>"Wonderful teachers and a nurturing environment."</p><footer>Vikram Singh — Parent</footer></blockquote></div>
</div></section>

<section class="cta-kinder"><div class="container fade-in"><h2>🎈 Admissions Open 2026-27!</h2><p>Give your child the best start at ${s.name}</p><a href="contact.html" class="btn btn-white">Apply Now</a></div></section>
</main>`;
}

function indexPreschool(s, theme) {
  return `<main id="main">
<section class="hero-preschool">
  <div class="container hero-preschool-inner">
    <div class="hero-copy fade-in">
      <span class="hero-label">${theme.tagline}</span>
      <h1>Nurturing Young Minds at <span>${s.name.split(' ').slice(0, 2).join(' ')}</span></h1>
      <p class="hindi">${s.hindi}</p>
      <p id="schoolTagline">${s.tagline}</p>
      <div class="hero-actions"><a href="courses.html" class="btn btn-primary">View Programs</a><a href="contact.html" class="btn btn-outline">Enroll Now</a></div>
    </div>
    <div class="hero-visual fade-in">
      <div class="hero-slider-mini">
        <img src="${IMAGES.kids}" alt="Students" class="active">
        <img src="${IMAGES.classroom}" alt="Classroom">
        <img src="${IMAGES.students}" alt="Learning">
      </div>
      <div class="hero-float-card"><strong>${s.years}+</strong><span>Years of Excellence</span></div>
    </div>
  </div>
</section>

<section class="section stats-preschool"><div class="container stats-preschool-row">
  <div class="stat-pill fade-in"><span data-count="${s.students}" data-suffix="+">0</span><p>Students</p></div>
  <div class="stat-pill fade-in"><span data-count="${s.teachers}">0</span><p>Teachers</p></div>
  <div class="stat-pill fade-in"><span data-count="${s.years}">0</span><p>Years</p></div>
  <div class="stat-pill fade-in"><span data-count="12">0</span><p>Grades</p></div>
</div></section>

<section class="section about-preschool"><div class="container about-preschool-grid">
  <div class="about-image fade-in"><img src="${IMAGES.students}" alt="About us"></div>
  <div class="fade-in"><span class="section-label">About Us</span><h2>Where Learning Meets Joy</h2><p>${s.name} offers CBSE-aligned education with a focus on creativity, discipline, and holistic growth.</p><ul class="feature-chips"><li>Smart Classrooms</li><li>Sports & Arts</li><li>Safe Campus</li><li>Experienced Faculty</li></ul><a href="about.html" class="btn btn-primary">Learn More</a></div>
</div></section>

<section class="section courses-preschool"><div class="container">
  <div class="section-head center"><span class="section-label">Programs</span><h2>Our Academic Programs</h2></div>
  <div id="course-grid" class="course-grid-preschool">${COURSES.slice(0, 4).map(c => `<article class="course-card-p fade-in"><span class="badge">${c.c}</span><h3>${c.t}</h3><p>${c.l} lessons · ${c.d}</p></article>`).join('')}</div>
</div></section>

<section class="section teachers-preschool"><div class="container">
  <div class="section-head center"><span class="section-label">Faculty</span><h2>Expert Teachers</h2></div>
  <div id="teacher-grid" class="teacher-grid-preschool">${TEACHERS.map(t => `<div class="teacher-p fade-in"><div class="teacher-av">👩‍🏫</div><h3>${t.n}</h3><p>${t.r}</p></div>`).join('')}</div>
</div></section>

<section class="cta-preschool"><div class="container fade-in"><h2>Admissions Open 2026-27</h2><p>Join ${s.name} today</p><a href="contact.html" class="btn btn-white">Contact Us</a></div></section>
</main>`;
}

function indexAcademicSplit(s, theme) {
  return `<main>
<section class="hero-academic">
  <div class="container hero-academic-grid">
    <div class="hero-text fade-in">
      <span class="section-label">${theme.tagline}</span>
      <h1>Excellence in <span>Education</span> For Every Student</h1>
      <p class="hindi">${s.hindi}</p>
      <p>${s.tagline} — ${s.name} delivers quality CBSE education in East Delhi</p>
      <div class="hero-btns"><a href="courses.html" class="btn btn-primary">Explore Courses</a><a href="contact.html" class="btn btn-outline">Contact Us</a></div>
      <div class="hero-features"><div><strong>${s.students}+</strong><span>Students</span></div><div><strong>${s.teachers}+</strong><span>Teachers</span></div><div><strong>${s.years}+</strong><span>Years</span></div></div>
    </div>
    <div class="hero-media fade-in"><img src="${IMAGES.hero}" alt="School"><div class="media-card"><span>CBSE</span><p>Nursery to Class XII</p></div></div>
  </div>
</section>

<section class="section features-section"><div class="container feature-row">
  ${[{ i: '🎯', t: 'Quality Education', d: 'CBSE aligned curriculum' }, { i: '👩‍🏫', t: 'Expert Faculty', d: 'Experienced teachers' }, { i: '🏫', t: 'Modern Campus', d: 'Labs, library & sports' }, { i: '📈', t: 'Track Progress', d: 'Regular assessments' }].map(f => `<div class="feature-box fade-in"><span>${f.i}</span><h3>${f.t}</h3><p>${f.d}</p></div>`).join('')}
</div></section>

<section class="section courses-section"><div class="container">
  <div class="section-head"><span class="section-label">Academics</span><h2>Our Programs & Courses</h2></div>
  <div class="course-grid">${COURSES.map(c => `<article class="course-card fade-in"><span class="course-cat">${c.c}</span><h3>${c.t}</h3><p>${c.l} lessons · ${c.d}</p><a href="contact.html">Enquire →</a></article>`).join('')}</div>
</div></section>

<section class="section about-band"><div class="container about-split">
  <div class="about-img fade-in"><img src="${IMAGES.students}" alt="Students"></div>
  <div class="fade-in"><span class="section-label">About</span><h2>Building Future Leaders</h2><p>Our motto: <em>${s.motto}</em></p><a href="about.html" class="btn btn-primary">Read More</a></div>
</div></section>

<section class="section testimonials-section"><div class="container"><div class="section-head center"><h2>Parent Testimonials</h2></div>
  <div class="testimonial-grid"><blockquote class="testimonial fade-in"><p>"Excellent academic standards and caring environment."</p><footer><strong>Asha Sharma</strong></footer></blockquote><blockquote class="testimonial fade-in"><p>"My children thrive here with great teachers."</p><footer><strong>Rakesh Verma</strong></footer></blockquote></div>
</div></section>
</main>`;
}

function indexUniversity(s, theme) {
  return `<main>
<section class="hero-university">
  <div class="container hero-uni-grid">
    <div class="fade-in">
      <span class="hero-badge">${s.type}</span>
      <h1>World-Class <span>Education</span> Starts Here</h1>
      <p class="hindi">${s.hindi}</p>
      <p>${s.tagline}</p>
      <div class="hero-btns"><a href="courses.html" class="btn btn-primary">Browse Courses</a><a href="about.html" class="btn btn-outline">About School</a></div>
    </div>
    <div class="hero-video-card fade-in">
      <img src="${IMAGES.classroom}" alt="Campus">
      <div class="play-btn">▶</div>
      <div class="video-caption">Campus Tour</div>
    </div>
  </div>
</section>

<section class="stats-uni"><div class="container"><div class="stats-row">
  <div class="stat-box fade-in"><span data-count="${s.students}" data-suffix="+">0</span><p>Enrolled Students</p></div>
  <div class="stat-box fade-in"><span data-count="${s.teachers}">0</span><p>Faculty Members</p></div>
  <div class="stat-box fade-in"><span data-count="${s.years}">0</span><p>Years Established</p></div>
</div></div></section>

<section class="section pricing-uni"><div class="container">
  <div class="section-head center"><span class="section-label">Programs</span><h2>Education Plans</h2></div>
  <div class="pricing-grid">
    <div class="price-card fade-in"><h3>Primary</h3><div class="price">Nursery–V</div><ul><li>Foundation learning</li><li>Activity-based</li><li>Hindi + English</li></ul><a href="contact.html" class="btn btn-primary">Enquire</a></div>
    <div class="price-card featured fade-in"><h3>Middle School</h3><div class="price">VI–VIII</div><ul><li>CBSE curriculum</li><li>Science labs</li><li>Sports programs</li></ul><a href="contact.html" class="btn btn-primary">Enquire</a></div>
    <div class="price-card fade-in"><h3>Senior</h3><div class="price">IX–XII</div><ul><li>Board exam prep</li><li>Career counseling</li><li>Advanced labs</li></ul><a href="contact.html" class="btn btn-primary">Enquire</a></div>
  </div>
</div></section>

<section class="section courses-section"><div class="container"><div class="section-head"><h2>Featured Courses</h2></div>
  <div class="course-grid">${COURSES.slice(0, 4).map(c => `<article class="course-card fade-in"><h3>${c.t}</h3><p>${c.c} · ${c.l} lessons</p></article>`).join('')}</div>
</div></section>

<section class="section team-section"><div class="container"><div class="section-head center"><h2>Our Faculty</h2></div>
  <div class="team-grid">${TEACHERS.map(t => `<div class="team-card fade-in"><div class="team-av">👩‍🏫</div><h3>${t.n}</h3><p>${t.s}</p></div>`).join('')}</div>
</div></section>
</main>`;
}

function indexLmsDark(s, theme) {
  return indexEdurock(s, theme).replace(/hero-edurock/g, 'hero-dark-lms').replace(/about-edurock/g, 'about-dark-lms');
}

/* Inner pages */
function pageAbout(s, theme) {
  return `<main>${pageHero('About Us', `Know more about ${s.name}`, theme)}
<section class="section"><div class="container about-split">
  <div class="about-img fade-in"><img src="${IMAGES.students}" alt="About"></div>
  <div class="fade-in"><h2>${s.name}</h2><p class="hindi">${s.hindi}</p>
  <p>${s.name} is a premier CBSE-affiliated school in Mandawali, East Delhi, dedicated to holistic education from Nursery to Class XII.</p>
  <ul class="check-list"><li>✓ CBSE Affiliated · Nursery to Class XII</li><li>✓ Experienced & Qualified Faculty</li><li>✓ Modern Labs, Library & Sports</li><li>✓ Smart Classrooms</li><li>✓ Holistic Development</li></ul></div>
</div></section>
<section class="section alt-bg"><div class="container"><div class="section-head center"><h2>Mission & Vision</h2></div>
<div class="mission-grid"><div class="mission-card fade-in"><h3>🎯 Mission</h3><p>To provide quality education empowering students to excel academically and grow as responsible citizens.</p></div>
<div class="mission-card fade-in"><h3>👁 Vision</h3><p>To be the most trusted school in East Delhi, recognized for academic excellence and character building.</p></div></div></div></section></main>`;
}

function pageCourses(s, theme) {
  return `<main>${pageHero('Academic Programs', 'CBSE Curriculum · Nursery to Class XII', theme)}
<section class="section"><div class="container"><div class="course-grid full">${COURSES.map(c => `<article class="course-card fade-in"><div class="course-thumb"><img src="${IMAGES.classroom}" alt="${c.t}"></div><div class="course-body"><span class="badge">${c.c}</span><h3>${c.t}</h3><p>${c.l} lessons · ${c.d}</p><a href="contact.html" class="btn btn-sm">Enquire Now</a></div></article>`).join('')}</div></div></section></main>`;
}

function pageTeachers(s, theme) {
  return `<main>${pageHero('Our Teachers', 'Experienced educators dedicated to your child\'s success', theme)}
<section class="section"><div class="container"><div class="team-grid full">${TEACHERS.concat(TEACHERS.slice(0, 2)).map(t => `<div class="team-card fade-in"><div class="team-avatar">👩‍🏫</div><h3>${t.n}</h3><p>${t.r}</p><span>${t.s} · ${t.e}</span></div>`).join('')}</div></div></section></main>`;
}

function pageEvents(s, theme) {
  return `<main>${pageHero('Events & Activities', 'School calendar and upcoming events', theme)}
<section class="section"><div class="container"><div class="events-list">${EVENTS.map(e => `<div class="event-card fade-in"><div class="event-date">${e.d}</div><div><h3>${e.t}</h3><p>📍 ${e.l} · 🕐 ${e.time}</p></div></div>`).join('')}</div></div></section></main>`;
}

function pageGallery(s, theme) {
  const imgs = Object.values(IMAGES);
  return `<main>${pageHero('Photo Gallery', `Glimpses of life at ${s.name}`, theme)}
<section class="section"><div class="container"><div class="gallery-grid">${imgs.concat(imgs).map((img, i) => `<div class="gallery-item fade-in"><img src="${img}" alt="Gallery ${i + 1}"><div class="gallery-overlay">View</div></div>`).join('')}</div></div></section></main>`;
}

function pageBlog(s, theme) {
  return `<main>${pageHero('Blog & News', 'Latest updates from our school', theme)}
<section class="section"><div class="container"><div class="blog-grid">${BLOG.map(b => `<article class="blog-card fade-in"><div class="blog-img"><img src="${b.img}" alt="${b.t}"></div><div class="blog-body"><span class="blog-cat">${b.c}</span><h3>${b.t}</h3><p>${b.d}</p><a href="#">Read More →</a></div></article>`).join('')}</div></div></section></main>`;
}

function pageContact(s, theme) {
  return `<main>${pageHero('Contact Us', `Get in touch with ${s.name}`, theme)}
<section class="section"><div class="container contact-split">
  <div class="contact-info fade-in"><h2>Reach Us</h2>
    <div class="info-line">📍 <div><strong>Address</strong><p>${s.address}</p></div></div>
    <div class="info-line">📞 <div><strong>Phone</strong><p>${s.phone}</p></div></div>
    <div class="info-line">✉ <div><strong>Email</strong><p>${s.email}</p></div></div>
    <div class="info-line">🕐 <div><strong>Hours</strong><p>Monday – Saturday: 8:00 AM – 2:00 PM</p></div></div>
  </div>
  <form class="contact-form fade-in" onsubmit="event.preventDefault();alert('Thank you! We will contact you soon.');">
    <h2>Send a Message</h2>
    <input type="text" placeholder="Your Name" required>
    <input type="email" placeholder="Email Address" required>
    <input type="tel" placeholder="Phone Number">
    <select><option>Admission Enquiry</option><option>General Query</option><option>Feedback</option></select>
    <textarea placeholder="Your Message" rows="4" required></textarea>
    <button type="submit" class="btn btn-primary">Send Message</button>
  </form>
</div></section></main>`;
}

function generatePage(page, s, theme) {
  const layout = theme.layout;
  const header = getHeader(layout, s, theme, page);
  let body;
  switch (page) {
    case 'index': body = getIndex(layout, s, theme); break;
    case 'about': body = pageAbout(s, theme); break;
    case 'courses': body = pageCourses(s, theme); break;
    case 'teachers': body = pageTeachers(s, theme); break;
    case 'events': body = pageEvents(s, theme); break;
    case 'gallery': body = pageGallery(s, theme); break;
    case 'blog': body = pageBlog(s, theme); break;
    case 'contact': body = pageContact(s, theme); break;
    default: body = getIndex(layout, s, theme);
  }
  return head(s, theme, page) + header + body + footer(s);
}

module.exports = { generatePage, PAGES, IMAGES, COURSES, TEACHERS };
