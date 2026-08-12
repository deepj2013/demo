#!/usr/bin/env node
/**
 * School Theme Generator - Creates all 15 themes for both schools
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SCHOOLS = {
  keshav: {
    name: 'Keshav Vidya Mandir Model School',
    hindi: 'केशव विद्या मंदिर मॉडल स्कूल',
    type: 'CBSE School',
    address: 'Vinod Nagar W, West Vinod Nagar, I.P.Extension, Mandawali, Delhi, 110092',
    phone: '011 2247 2248',
    email: 'info@keshavvidyamandir.edu.in',
    primary: '#1a5276', secondary: '#f39c12', accent: '#27ae60',
    tagline: 'Excellence in Education Since 1995',
    motto: 'विद्या ददाति विनयम्',
    students: 2500, teachers: 120, years: 30
  },
  sunrise: {
    name: 'Sunrise India Public School',
    hindi: 'सनराइज इंडिया पब्लिक स्कूल',
    type: 'General Education School',
    address: 'F-68, Street Number 3, West Vinod Nagar, F Block, Mandawali, Delhi, 110092',
    phone: '092132 78158',
    email: 'info@sunriseindiaschool.edu.in',
    primary: '#e74c3c', secondary: '#3498db', accent: '#f1c40f',
    tagline: 'Nurturing Tomorrow\'s Leaders Today',
    motto: 'Arise, Awake and Stop Not Till the Goal is Reached',
    students: 1800, teachers: 85, years: 18
  }
};

const THEMES = {
  kadu: { name: 'Kadu', style: 'modern', bg: '#6c5ce7', font: 'Poppins' },
  bornomala: { name: 'Bornomala', style: 'kindergarten', bg: '#fd79a8', font: 'Nunito' },
  eduvision: { name: 'EduVision', style: 'professional', bg: '#0984e3', font: 'Roboto' },
  ischool: { name: 'iSchool', style: 'university', bg: '#00b894', font: 'Inter' },
  edusion: { name: 'Edusion', style: 'bold', bg: '#e17055', font: 'Montserrat' },
  eduall: { name: 'EduAll', style: 'lms', bg: '#6c5ce7', font: 'DM Sans' },
  kidso: { name: 'Kidso', style: 'childcare', bg: '#fdcb6e', font: 'Quicksand' },
  eginary: { name: 'Eginary', style: 'corporate', bg: '#00cec9', font: 'Open Sans' },
  wellearn: { name: 'WellLearn', style: 'hub', bg: '#a29bfe', font: 'Raleway' },
  edrio: { name: 'Edrio', style: 'kindergarten2', bg: '#ff7675', font: 'Fredoka' },
  'los-ninos': { name: 'Los Niños', style: 'playful', bg: '#55efc4', font: 'Baloo 2' },
  kidscholl: { name: 'Kidscholl', style: 'preschool', bg: '#74b9ff', font: 'Nunito' },
  ascen: { name: 'Ascen', style: 'elementary', bg: '#fab1a0', font: 'Poppins' },
  cutie: { name: 'Cutie', style: 'creative', bg: '#ffeaa7', font: 'Comfortaa' },
  kiddoz: { name: 'Kiddoz', style: 'school', bg: '#81ecec', font: 'Outfit' }
};

const PAGES = ['index', 'about', 'courses', 'teachers', 'events', 'gallery', 'blog', 'contact'];
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
  { t: 'Mathematics', c: 'Academic', l: 48 }, { t: 'Science & Technology', c: 'Academic', l: 42 },
  { t: 'English Language', c: 'Language', l: 36 }, { t: 'Hindi & Sanskrit', c: 'Language', l: 30 },
  { t: 'Computer Science', c: 'Technology', l: 24 }, { t: 'Physical Education', c: 'Sports', l: 20 }
];

const TEACHERS = [
  { n: 'Mrs. Sunita Devi', r: 'Senior Mathematics Teacher', s: 'Mathematics' },
  { n: 'Mr. Amit Singh', r: 'Science Department Head', s: 'Physics & Chemistry' },
  { n: 'Mrs. Kavita Sharma', r: 'English Language Expert', s: 'English' },
  { n: 'Mr. Ravi Kumar', r: 'Computer Science Instructor', s: 'IT & Coding' }
];

const PAGE_LABELS = { index: 'Home', about: 'About', courses: 'Courses', teachers: 'Teachers', events: 'Events', gallery: 'Gallery', blog: 'Blog', contact: 'Contact' };
function nav(school, theme, page) {
  return PAGES.map(p => `<a href="${p}.html" class="${p === page ? 'active' : ''}">${PAGE_LABELS[p]}</a>`).join('');
}

function header(s, t, page, theme) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${page === 'index' ? s.name : page.charAt(0).toUpperCase() + page.slice(1)} — ${s.name}</title>
<link href="https://fonts.googleapis.com/css2?family=${theme.font.replace(' ','+')}:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header class="site-header">
  <div class="top-bar"><div class="container">
    <span>📞 ${s.phone}</span><span>✉ ${s.email}</span><span>🕐 Mon–Sat: 8AM–2PM</span>
  </div></div>
  <nav class="main-nav"><div class="container">
    <a href="index.html" class="logo"><span class="logo-icon">🏫</span><div><strong>${s.name.split(' ').slice(0,2).join(' ')}</strong><small class="hindi">${s.hindi}</small></div></a>
    <button class="menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
    <div class="nav-menu">${nav(s, t, page)}</div>
  </div></nav>
</header>
<main>`;
}

function footer(s) {
  return `</main>
<footer class="site-footer"><div class="container">
  <div class="footer-grid">
    <div><h3>${s.name}</h3><p class="hindi">${s.hindi}</p><p>${s.type} · Nursery to Class XII · CBSE</p></div>
    <div><h4>Quick Links</h4><a href="about.html">About Us</a><a href="courses.html">Courses</a><a href="teachers.html">Teachers</a><a href="contact.html">Contact</a></div>
    <div><h4>Contact</h4><p>📍 ${s.address}</p><p>📞 ${s.phone}</p><p>✉ ${s.email}</p></div>
  </div>
  <div class="footer-bottom">© 2026 ${s.name}. All Rights Reserved.</div>
</div></footer>
<script src="../../../shared/js/theme-utils.js"></script>
<script src="js/main.js"></script>
</body></html>`;
}

function pageIndex(s, t) {
  return header(s, t, 'index', THEMES[t]) + `
<section class="hero" style="background:linear-gradient(135deg,${s.primary}dd,${THEMES[t].bg}cc),url('${IMAGES.hero}') center/cover">
  <div class="container hero-content fade-in">
    <span class="hero-tag">${s.type}</span>
    <h1>Welcome to <span>${s.name}</span></h1>
    <p class="hindi hero-hindi">${s.hindi}</p>
    <p>${s.tagline} — Nursery to Class XII CBSE education in East Delhi</p>
    <div class="hero-btns"><a href="about.html" class="btn btn-primary">About Us</a><a href="contact.html" class="btn btn-outline">Contact Us</a></div>
  </div>
</section>
<section class="stats section"><div class="container stats-grid">
  <div class="stat fade-in"><span data-count="${s.students}" data-suffix="+">0</span><p>Students</p></div>
  <div class="stat fade-in"><span data-count="${s.teachers}">0</span><p>Teachers</p></div>
  <div class="stat fade-in"><span data-count="${s.years}">0</span><p>Years</p></div>
  <div class="stat fade-in"><span data-count="12">0</span><p>Grades</p></div>
</div></section>
<section class="about-preview section"><div class="container about-grid">
  <div class="about-img fade-in"><img src="${IMAGES.students}" alt="Students"></div>
  <div class="fade-in"><span class="section-tag">About Us</span><h2>Shaping Future Leaders</h2>
  <p>${s.name} is a premier CBSE-affiliated school in Mandawali, East Delhi, dedicated to holistic education from Nursery to Class XII. Our motto: <em>${s.motto}</em></p>
  <a href="about.html" class="btn btn-primary">Learn More</a></div>
</div></section>
<section class="courses-preview section" style="background:#f8f9fa"><div class="container">
  <div class="section-title fade-in"><span class="section-tag">Academics</span><h2>Our Programs</h2><p>Comprehensive CBSE curriculum for all age groups</p></div>
  <div class="courses-grid">${COURSES.slice(0,4).map(c => `<div class="course-card fade-in"><div class="course-icon">📚</div><h3>${c.t}</h3><p>${c.l} Lessons · ${c.c}</p><a href="courses.html">View Details →</a></div>`).join('')}</div>
</div></section>
<section class="teachers-preview section"><div class="container">
  <div class="section-title fade-in"><span class="section-tag">Faculty</span><h2>Our Expert Teachers</h2></div>
  <div class="teachers-grid">${TEACHERS.map(t => `<div class="teacher-card fade-in"><div class="teacher-avatar">👩‍🏫</div><h3>${t.n}</h3><p>${t.r}</p><span>${t.s}</span></div>`).join('')}</div>
</div></section>
<section class="cta section" style="background:linear-gradient(135deg,${s.primary},${THEMES[t].bg})"><div class="container cta-content fade-in">
  <h2>Admissions Open for 2026-27</h2><p>Join ${s.name} — Where every child discovers their potential</p>
  <a href="contact.html" class="btn btn-white">Apply Now</a>
</div></section>` + footer(s);
}

function pageAbout(s, t) {
  return header(s, t, 'about', THEMES[t]) + `
<section class="page-hero" style="background:linear-gradient(135deg,${s.primary},${THEMES[t].bg})"><div class="container"><h1>About Us</h1><p>Know more about ${s.name}</p></div></section>
<section class="section"><div class="container about-full">
  <div class="about-grid"><div class="fade-in"><img src="${IMAGES.classroom}" alt="Classroom"></div>
  <div class="fade-in"><h2>${s.name}</h2><p class="hindi">${s.hindi}</p>
  <p>Established as a leading educational institution in East Delhi, ${s.name} has been nurturing young minds with quality CBSE education. Located in Mandawali, we serve families across Vinod Nagar and surrounding areas.</p>
  <ul class="feature-list"><li>✓ CBSE Affiliated · Nursery to Class XII</li><li>✓ Experienced & Qualified Faculty</li><li>✓ Modern Labs, Library & Sports Facilities</li><li>✓ Smart Classrooms with Digital Learning</li><li>✓ Holistic Development — Academics, Sports & Arts</li></ul></div></div>
</div></section>
<section class="section" style="background:#f8f9fa"><div class="container"><div class="section-title"><h2>Our Mission & Vision</h2></div>
<div class="mission-grid"><div class="mission-card fade-in"><h3>🎯 Mission</h3><p>To provide quality education that empowers students to excel academically and grow as responsible citizens.</p></div>
<div class="mission-card fade-in"><h3>👁 Vision</h3><p>To be the most trusted school in East Delhi, recognized for academic excellence and character building.</p></div></div></div></section>` + footer(s);
}

function pageCourses(s, t) {
  return header(s, t, 'courses', THEMES[t]) + `
<section class="page-hero" style="background:linear-gradient(135deg,${s.primary},${THEMES[t].bg})"><div class="container"><h1>Academic Programs</h1><p>CBSE Curriculum · Nursery to Class XII</p></div></section>
<section class="section"><div class="container"><div class="courses-grid full">${COURSES.map(c => `<div class="course-card fade-in"><div class="course-img"><img src="${IMAGES.classroom}" alt="${c.t}"></div><div class="course-body"><span class="badge">${c.c}</span><h3>${c.t}</h3><p>${c.l} lessons · Full academic year · All levels</p><a href="contact.html" class="btn btn-sm">Enquire Now</a></div></div>`).join('')}</div></div></section>` + footer(s);
}

function pageTeachers(s, t) {
  return header(s, t, 'teachers', THEMES[t]) + `
<section class="page-hero" style="background:linear-gradient(135deg,${s.primary},${THEMES[t].bg})"><div class="container"><h1>Our Teachers</h1><p>Experienced educators dedicated to your child's success</p></div></section>
<section class="section"><div class="container"><div class="teachers-grid full">${TEACHERS.concat(TEACHERS).map(t => `<div class="teacher-card fade-in"><div class="teacher-img">👩‍🏫</div><h3>${t.n}</h3><p>${t.r}</p><span class="subject">${t.s}</span></div>`).join('')}</div></div></section>` + footer(s);
}

function pageEvents(s, t) {
  const events = [
    { d: '15 Aug 2026', t: 'Independence Day Celebration', l: 'School Ground' },
    { d: '05 Sep 2026', t: 'Teachers\' Day Program', l: 'Auditorium' },
    { d: '14 Nov 2026', t: 'Children\'s Day Fest', l: 'School Campus' },
    { d: '26 Jan 2027', t: 'Republic Day Parade', l: 'School Ground' }
  ];
  return header(s, t, 'events', THEMES[t]) + `
<section class="page-hero" style="background:linear-gradient(135deg,${s.primary},${THEMES[t].bg})"><div class="container"><h1>Events & Activities</h1><p>School calendar and upcoming events</p></div></section>
<section class="section"><div class="container"><div class="events-list">${events.map(e => `<div class="event-card fade-in"><div class="event-date">${e.d}</div><div><h3>${e.t}</h3><p>📍 ${e.l}</p></div></div>`).join('')}</div></div></section>` + footer(s);
}

function pageGallery(s, t) {
  const imgs = Object.values(IMAGES);
  return header(s, t, 'gallery', THEMES[t]) + `
<section class="page-hero" style="background:linear-gradient(135deg,${s.primary},${THEMES[t].bg})"><div class="container"><h1>Photo Gallery</h1><p>Glimpses of life at ${s.name}</p></div></section>
<section class="section"><div class="container"><div class="gallery-grid">${imgs.concat(imgs).map((img,i) => `<div class="gallery-item fade-in"><img src="${img}" alt="Gallery ${i+1}"><div class="gallery-overlay">View</div></div>`).join('')}</div></div></section>` + footer(s);
}

function pageBlog(s, t) {
  const posts = [
    { t: 'Annual Day 2026 — A Grand Success', d: '10 Mar 2026', c: 'Events' },
    { t: 'CBSE Board Exam Preparation Tips', d: '01 Feb 2026', c: 'Academics' },
    { t: 'Science Exhibition Highlights', d: '20 Jan 2026', c: 'Science' }
  ];
  return header(s, t, 'blog', THEMES[t]) + `
<section class="page-hero" style="background:linear-gradient(135deg,${s.primary},${THEMES[t].bg})"><div class="container"><h1>Blog & News</h1><p>Latest updates from our school</p></div></section>
<section class="section"><div class="container"><div class="blog-grid">${posts.map(p => `<article class="blog-card fade-in"><img src="${IMAGES.event}" alt="${p.t}"><div class="blog-body"><span class="badge">${p.c}</span><h3>${p.t}</h3><p>${p.d}</p><a href="#">Read More →</a></div></article>`).join('')}</div></div></section>` + footer(s);
}

function pageContact(s, t) {
  return header(s, t, 'contact', THEMES[t]) + `
<section class="page-hero" style="background:linear-gradient(135deg,${s.primary},${THEMES[t].bg})"><div class="container"><h1>Contact Us</h1><p>Get in touch with ${s.name}</p></div></section>
<section class="section"><div class="container contact-grid">
  <div class="contact-info fade-in">
    <h2>Reach Us</h2>
    <div class="info-item">📍 <div><strong>Address</strong><p>${s.address}</p></div></div>
    <div class="info-item">📞 <div><strong>Phone</strong><p>${s.phone}</p></div></div>
    <div class="info-item">✉ <div><strong>Email</strong><p>${s.email}</p></div></div>
    <div class="info-item">🕐 <div><strong>Hours</strong><p>Monday – Saturday: 8:00 AM – 2:00 PM</p></div></div>
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
</div></section>` + footer(s);
}

function generateCSS(s, themeId, theme) {
  const isKindergarten = ['bornomala','kidso','edrio','los-ninos','kidscholl','cutie','kiddoz'].includes(themeId);
  const radius = isKindergarten ? '24px' : '12px';
  return `/* ${theme.name} Theme - ${s.name} */
:root{--primary:${s.primary};--secondary:${s.secondary};--accent:${theme.bg};--font:'${theme.font}',sans-serif;--radius:${radius}}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--font);line-height:1.6;color:#333}
.container{max-width:1200px;margin:0 auto;padding:0 20px}
.hindi{font-family:'Noto Sans Devanagari',sans-serif}
img{max-width:100%;display:block}
a{text-decoration:none;color:inherit;transition:.3s}
/* Header */
.top-bar{background:var(--primary);color:#fff;padding:8px 0;font-size:.85rem}
.top-bar .container{display:flex;gap:24px;flex-wrap:wrap}
.site-header{position:sticky;top:0;z-index:100;background:#fff;box-shadow:0 2px 20px rgba(0,0,0,.08)}
.main-nav .container{display:flex;align-items:center;justify-content:space-between;padding:16px 20px}
.logo{display:flex;align-items:center;gap:12px}
.logo-icon{font-size:2rem}
.logo strong{display:block;font-size:1rem;color:var(--primary)}
.logo small{font-size:.75rem;color:#666}
.nav-menu{display:flex;gap:8px}
.nav-menu a{padding:8px 16px;border-radius:50px;font-weight:500;font-size:.9rem}
.nav-menu a:hover,.nav-menu a.active{background:var(--primary);color:#fff}
.menu-toggle{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:8px}
.menu-toggle span{width:24px;height:2px;background:#333;transition:.3s}
/* Hero */
.hero{min-height:85vh;display:flex;align-items:center;color:#fff;position:relative}
.hero-content{max-width:700px;padding:60px 0}
.hero-tag{display:inline-block;background:rgba(255,255,255,.2);padding:6px 16px;border-radius:50px;font-size:.85rem;margin-bottom:16px}
.hero h1{font-size:clamp(2rem,5vw,3.2rem);font-weight:800;line-height:1.2;margin-bottom:12px}
.hero h1 span{color:var(--secondary)}
.hero-hindi{font-size:1.2rem;opacity:.9;margin-bottom:12px}
.hero p{font-size:1.1rem;opacity:.85;margin-bottom:24px}
.hero-btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;padding:12px 28px;border-radius:50px;font-weight:600;border:none;cursor:pointer;transition:.3s}
.btn-primary{background:var(--secondary);color:#fff}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.2)}
.btn-outline{border:2px solid #fff;color:#fff;background:transparent}
.btn-outline:hover{background:#fff;color:var(--primary)}
.btn-white{background:#fff;color:var(--primary)}
.btn-sm{padding:8px 20px;font-size:.85rem}
/* Stats */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center}
.stat span{display:block;font-size:2.5rem;font-weight:800;color:var(--primary)}
.stat p{color:#666;font-weight:500}
/* Sections */
.section{padding:80px 0}
.section-tag{display:inline-block;background:rgba(0,0,0,.05);padding:6px 16px;border-radius:50px;font-size:.8rem;font-weight:600;color:var(--primary);margin-bottom:12px}
.section-title{text-align:center;margin-bottom:50px}
.section-title h2{font-size:2rem;font-weight:700;margin-bottom:8px}
.section-title p{color:#666}
.page-hero{padding:80px 0;text-align:center;color:#fff}
.page-hero h1{font-size:2.5rem;font-weight:800}
/* About */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.about-img img{border-radius:var(--radius);box-shadow:0 20px 60px rgba(0,0,0,.15)}
.about-grid h2{font-size:2rem;margin-bottom:16px;color:var(--primary)}
.feature-list{margin:20px 0;list-style:none}
.feature-list li{padding:8px 0;font-weight:500}
.mission-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.mission-card{background:#fff;padding:32px;border-radius:var(--radius);box-shadow:0 4px 24px rgba(0,0,0,.06)}
.mission-card h3{margin-bottom:12px;font-size:1.2rem}
/* Courses */
.courses-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px}
.course-card{background:#fff;border-radius:var(--radius);padding:28px;box-shadow:0 4px 24px rgba(0,0,0,.06);transition:.3s}
.course-card:hover{transform:translateY(-6px);box-shadow:0 12px 40px rgba(0,0,0,.12)}
.course-icon{font-size:2.5rem;margin-bottom:12px}
.course-card h3{margin-bottom:8px;color:var(--primary)}
.course-card.full{overflow:hidden;padding:0}
.course-img{height:180px;overflow:hidden}
.course-img img{width:100%;height:100%;object-fit:cover}
.course-body{padding:20px}
.badge{display:inline-block;background:var(--accent);color:#fff;padding:4px 12px;border-radius:20px;font-size:.75rem;margin-bottom:8px}
/* Teachers */
.teachers-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:24px}
.teacher-card{background:#fff;border-radius:var(--radius);padding:28px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.06);transition:.3s}
.teacher-card:hover{transform:translateY(-4px)}
.teacher-avatar,.teacher-img{font-size:3rem;margin-bottom:12px}
.teacher-card h3{font-size:1rem;margin-bottom:4px}
.teacher-card p{font-size:.85rem;color:#666;margin-bottom:8px}
.teacher-card .subject{display:inline-block;background:rgba(0,0,0,.05);padding:4px 12px;border-radius:20px;font-size:.8rem}
/* Events */
.events-list{display:flex;flex-direction:column;gap:16px}
.event-card{display:flex;gap:24px;background:#fff;padding:24px;border-radius:var(--radius);box-shadow:0 4px 16px rgba(0,0,0,.06);align-items:center}
.event-date{background:var(--primary);color:#fff;padding:16px 20px;border-radius:var(--radius);font-weight:700;text-align:center;min-width:120px}
/* Gallery */
.gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.gallery-item{position:relative;border-radius:var(--radius);overflow:hidden;aspect-ratio:4/3;cursor:pointer}
.gallery-item img{width:100%;height:100%;object-fit:cover;transition:.3s}
.gallery-item:hover img{transform:scale(1.1)}
.gallery-overlay{position:absolute;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;opacity:0;transition:.3s}
.gallery-item:hover .gallery-overlay{opacity:1}
/* Blog */
.blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px}
.blog-card{background:#fff;border-radius:var(--radius);overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)}
.blog-card img{height:200px;width:100%;object-fit:cover}
.blog-body{padding:24px}
.blog-body h3{margin:8px 0;font-size:1.1rem}
/* Contact */
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px}
.info-item{display:flex;gap:16px;margin-bottom:24px;font-size:1.5rem}
.info-item strong{display:block;font-size:1rem;color:var(--primary)}
.info-item p{font-size:.9rem;color:#666}
.contact-form{background:#fff;padding:32px;border-radius:var(--radius);box-shadow:0 4px 24px rgba(0,0,0,.06)}
.contact-form h2{margin-bottom:20px}
.contact-form input,.contact-form select,.contact-form textarea{width:100%;padding:12px 16px;margin-bottom:12px;border:1px solid #ddd;border-radius:8px;font-family:inherit;font-size:.95rem}
/* CTA */
.cta{text-align:center;color:#fff;padding:80px 0}
.cta h2{font-size:2rem;margin-bottom:12px}
.cta p{margin-bottom:24px;opacity:.9}
/* Footer */
.site-footer{background:#1a1a2e;color:#ccc;padding:60px 0 20px}
.footer-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;margin-bottom:40px}
.footer-grid h3,.footer-grid h4{color:#fff;margin-bottom:12px}
.footer-grid a{display:block;padding:4px 0;font-size:.9rem}
.footer-grid a:hover{color:var(--secondary)}
.footer-bottom{text-align:center;padding-top:20px;border-top:1px solid rgba(255,255,255,.1);font-size:.85rem}
/* Animations */
.fade-in{opacity:0;transform:translateY(30px);transition:opacity .6s,transform .6s}
.fade-in.visible{opacity:1;transform:translateY(0)}
/* Responsive */
@media(max-width:768px){
.nav-menu{display:none;position:absolute;top:100%;left:0;right:0;background:#fff;flex-direction:column;padding:20px;box-shadow:0 8px 24px rgba(0,0,0,.1)}
.nav-menu.active{display:flex}
.menu-toggle{display:flex}
.about-grid,.mission-grid,.contact-grid,.stats-grid{grid-template-columns:1fr}
.stats-grid{grid-template-columns:repeat(2,1fr)}
.footer-grid{grid-template-columns:1fr}
.hero h1{font-size:1.8rem}
}`;
}

function generateJS() {
  return `document.addEventListener('DOMContentLoaded',()=>{
  const obs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('visible')}),{threshold:.1});
  document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
  const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav-menu');
  if(toggle&&nav)toggle.addEventListener('click',()=>{nav.classList.toggle('active');toggle.classList.toggle('active')});
  document.querySelectorAll('[data-count]').forEach(el=>{
    const t=+el.dataset.count,suffix=el.dataset.suffix||'';
    const o=new IntersectionObserver(e=>{if(e[0].isIntersecting){let c=0;const i=setInterval(()=>{c+=t/50;if(c>=t){c=t;clearInterval(i)}el.textContent=Math.floor(c).toLocaleString('en-IN')+suffix},30);o.disconnect()}});
    o.observe(el);
  });
});`;
}

const pageGenerators = { index: pageIndex, about: pageAbout, courses: pageCourses, teachers: pageTeachers, events: pageEvents, gallery: pageGallery, blog: pageBlog, contact: pageContact };

let count = 0;
for (const [schoolId, school] of Object.entries(SCHOOLS)) {
  for (const [themeId, theme] of Object.entries(THEMES)) {
    const dir = path.join(ROOT, 'schools', schoolId, themeId);
    fs.mkdirSync(path.join(dir, 'css'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'js'), { recursive: true });
    for (const page of PAGES) {
      fs.writeFileSync(path.join(dir, `${page}.html`), pageGenerators[page](school, themeId));
      count++;
    }
    fs.writeFileSync(path.join(dir, 'css', 'style.css'), generateCSS(school, themeId, theme));
    fs.writeFileSync(path.join(dir, 'js', 'main.js'), generateJS());
    count += 2;
  }
}
console.log(`Generated ${count} files across ${Object.keys(SCHOOLS).length} schools × ${Object.keys(THEMES).length} themes`);
