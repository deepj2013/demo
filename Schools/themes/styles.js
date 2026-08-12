/** Generates completely unique CSS per theme — no shared layout families */

function baseReset(theme) {
  const r = theme.dark ? '12px' : (theme.cardStyle.includes('bubble') || theme.cardStyle.includes('organic') ? '28px' : '16px');
  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'${theme.font}',system-ui,sans-serif;line-height:1.6;color:${theme.text};background:${theme.bg};overflow-x:hidden}
img{max-width:100%;height:auto;display:block}
a{text-decoration:none;color:inherit;transition:.25s}
.hindi{font-family:'Noto Sans Devanagari',sans-serif}
.container{max-width:1200px;margin:0 auto;padding:0 20px}
.fade-in{opacity:0;transform:translateY(28px);transition:opacity .65s,transform .65s}
.fade-in.visible{opacity:1;transform:translateY(0)}
.section{padding:80px 0}
.section-head{margin-bottom:40px}
.section-head.center,.center{text-align:center}
.section-label,.section-tag{display:inline-block;padding:6px 16px;border-radius:999px;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:13px 30px;border-radius:${r};font-weight:700;font-size:.92rem;border:none;cursor:pointer;transition:.25s;font-family:inherit}
.btn-primary{background:${theme.primary};color:#fff}
.btn-primary:hover{transform:translateY(-2px);filter:brightness(1.08)}
.btn-outline{background:transparent;border:2px solid ${theme.primary};color:${theme.primary}}
.btn-outline:hover{background:${theme.primary};color:#fff}
.btn-ghost{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);color:#fff}
.btn-white{background:#fff;color:${theme.primary}}
.btn-soft{background:color-mix(in srgb,${theme.primary} 18%,transparent);color:${theme.primary}}
.btn-sm{padding:8px 20px;font-size:.82rem}
.hero-btns,.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}
.page-banner{padding:70px 0;text-align:center;color:#fff}
.page-banner h1{font-size:2.4rem;font-weight:800}
.breadcrumb{margin-top:10px;font-size:.88rem;opacity:.85}
.breadcrumb a{color:#fff}
.site-footer{padding:60px 0 20px;margin-top:40px;color:#ccc}
.footer-inner{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:36px;margin-bottom:36px}
.footer-brand h3{color:#fff;margin-bottom:8px}
.footer-links h4,.footer-contact h4,.footer-newsletter h4{color:#fff;margin-bottom:14px}
.footer-links a{display:block;padding:5px 0;color:#aaa;font-size:.9rem}
.footer-bottom{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;padding-top:18px;border-top:1px solid rgba(255,255,255,.1);font-size:.84rem;color:#777}
.newsletter-form{display:flex;gap:8px;margin-top:10px}
.newsletter-form input{flex:1;padding:10px 14px;border-radius:8px;border:none}
.newsletter-form button{padding:10px 18px;background:${theme.primary};color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700}
.menu-toggle{display:none;background:none;border:none;cursor:pointer;padding:8px}
.menu-toggle span,.menu-bars{display:block;width:24px;height:2px;background:currentColor;margin:5px 0}
.nav-menu{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.nav-link{padding:9px 16px;border-radius:999px;font-weight:600;font-size:.88rem}
.nav-link.active,.nav-link:hover{background:color-mix(in srgb,${theme.primary} 15%,transparent);color:${theme.primary}}
.nav-cta{padding:10px 22px!important;background:${theme.primary}!important;color:#fff!important;border-radius:999px!important}
.about-split,.about-preschool-grid,.about-grid-edu{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:center}
.check-list{list-style:none;margin:18px 0}
.check-list li{padding:7px 0;font-weight:500}
.course-grid,.program-grid,.category-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:22px}
.team-grid,.teacher-grid-preschool{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:22px}
.testimonial-grid,.parent-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:22px}
.blog-grid,.gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.contact-split{display:grid;grid-template-columns:1fr 1fr;gap:44px}
.contact-form input,.contact-form select,.contact-form textarea,.register-form input,.register-form textarea{width:100%;padding:12px 16px;margin-bottom:12px;border-radius:10px;border:1px solid color-mix(in srgb,${theme.primary} 20%,#ccc);font-family:inherit;background:${theme.dark ? 'rgba(255,255,255,.06)' : '#fff'};color:${theme.text}}
.mission-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}
.events-list{display:flex;flex-direction:column;gap:14px}
.event-card{display:flex;gap:22px;background:${theme.dark ? 'rgba(255,255,255,.06)' : '#fff'};padding:22px;border-radius:16px;align-items:center;box-shadow:0 4px 20px rgba(0,0,0,.06)}
.event-date{background:${theme.primary};color:#fff;padding:14px 18px;border-radius:12px;font-weight:700;min-width:110px;text-align:center}
@media(max-width:768px){
.nav-menu{display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;padding:18px;background:${theme.dark ? '#111' : '#fff'};box-shadow:0 8px 30px rgba(0,0,0,.12);z-index:99}
.nav-menu.active{display:flex}
.menu-toggle{display:block}
.about-split,.contact-split,.mission-grid{grid-template-columns:1fr}
}
`;
}

const THEME_CSS = {
  kadu: (t) => `
/* KADU — Purple LMS (themexriver.com/kadu) */
body{background:#fafafa}
.topbar{background:${t.primary};color:#fff;padding:10px 0;font-size:.84rem}
.topbar-inner{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
.navbar{background:#fff;box-shadow:0 2px 20px rgba(124,58,237,.12);position:sticky;top:0;z-index:100}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;gap:14px}
.brand{display:flex;align-items:center;gap:12px}
.brand-icon{width:46px;height:46px;background:linear-gradient(135deg,${t.primary},${t.secondary});border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem}
.brand strong{display:block;font-size:1.05rem;color:${t.text}}
.brand small{font-size:.76rem;color:${t.muted}}
.hero-lms{min-height:88vh;position:relative;display:flex;align-items:center}
.hero-slide{position:absolute;inset:0;background-size:cover;background-position:center;display:flex;align-items:center}
.hero-slide::before{content:'';position:absolute;inset:0;background:linear-gradient(120deg,rgba(124,58,237,.88),rgba(245,158,11,.45))}
.hero-content{position:relative;color:#fff;max-width:680px;padding:80px 0}
.hero-kicker{background:rgba(255,255,255,.18);padding:8px 18px;border-radius:999px;font-size:.82rem;font-weight:700;display:inline-block;margin-bottom:16px}
.hero-content h1{font-size:clamp(2rem,5vw,3.4rem);font-weight:800;line-height:1.12;margin-bottom:12px}
.hero-content h1 span{color:${t.secondary}}
.category-card{background:#fff;border-radius:16px;padding:28px 20px;text-align:center;box-shadow:0 8px 30px rgba(124,58,237,.1);border-top:4px solid ${t.primary};transition:.3s}
.category-card:hover{transform:translateY(-8px);box-shadow:0 16px 40px rgba(124,58,237,.18)}
.cat-icon{font-size:2.4rem;display:block;margin-bottom:10px}
.stat-box{background:#fff;border-radius:16px;padding:28px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.06)}
.stat-box span{font-size:2.6rem;font-weight:800;color:${t.primary};display:block}
.course-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.course-thumb{height:160px;overflow:hidden;position:relative}
.course-thumb img{width:100%;height:100%;object-fit:cover}
.course-cat{position:absolute;top:12px;left:12px;background:${t.primary};color:#fff;padding:4px 12px;border-radius:999px;font-size:.72rem;font-weight:700}
.course-body{padding:20px}
.testimonial{background:#fff;border-radius:16px;padding:26px;border-left:5px solid ${t.primary};box-shadow:0 4px 20px rgba(0,0,0,.06)}
.cta-band{background:linear-gradient(135deg,${t.primary},${t.secondary});color:#fff;text-align:center;padding:80px 20px}
.site-footer{background:#1e1b4b}
.page-banner{background:linear-gradient(135deg,${t.primary},${t.secondary})}
.section-label{background:rgba(124,58,237,.12);color:${t.primary}}
`,

  bornomala: (t) => `
/* BORNomala — Pink Kindergarten */
body{background:linear-gradient(180deg,#fff0f5 0%,#fff 40%)}
.kinder-header{background:#fff;border-bottom:5px solid ${t.secondary};position:sticky;top:0;z-index:100;box-shadow:0 4px 20px rgba(255,107,157,.15)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:14px 20px}
.brand-bubble{font-size:2.2rem;background:linear-gradient(135deg,${t.primary},${t.secondary});width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.hero-kinder{padding:50px 0 70px;position:relative;overflow:hidden}
.hero-kinder-grid{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center}
.hero-bubble{background:#fff;border-radius:40px;padding:36px;box-shadow:0 20px 60px rgba(255,107,157,.2);border:3px solid rgba(255,107,157,.2)}
.pill-tag{background:${t.primary};color:#fff;padding:8px 18px;border-radius:999px;font-weight:800;font-size:.82rem;display:inline-block;margin-bottom:14px}
.hero-bubble h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;line-height:1.15}
.hero-bubble h1 span{color:${t.primary}}
.activity-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:22px}
.activity-card{background:linear-gradient(145deg,#fff,rgba(255,107,157,.08));border-radius:24px;padding:16px;text-align:center;border:2px solid rgba(255,107,157,.15)}
.activity-card span{font-size:1.8rem;display:block}
.hero-photo{border-radius:40px;overflow:hidden;box-shadow:0 20px 50px rgba(255,107,157,.25)}
.hero-photo img{height:400px;width:100%;object-fit:cover}
.photo-badge{position:absolute;bottom:20px;left:20px;background:${t.secondary};color:#fff;padding:12px 20px;border-radius:999px;font-weight:800}
.program-card{background:#fff;border-radius:32px;padding:28px;text-align:center;box-shadow:0 8px 30px rgba(255,107,157,.12);border:2px dashed rgba(255,107,157,.25)}
.stat-bubble{background:linear-gradient(135deg,${t.primary},${t.secondary});color:#fff;border-radius:50%;width:140px;height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto}
.stat-bubble span{font-size:2rem;font-weight:900}
.stats-bubbles{display:flex;justify-content:center;gap:30px;flex-wrap:wrap}
.parent-quote{background:#fff;border-radius:28px;padding:28px;border-left:6px solid ${t.accent};box-shadow:0 8px 30px rgba(0,0,0,.06)}
.cta-kinder{background:linear-gradient(135deg,${t.primary},${t.secondary});color:#fff;text-align:center;padding:70px 20px;border-radius:40px 40px 0 0;margin-top:40px}
.site-footer{background:#2d3436}
.page-banner{background:linear-gradient(135deg,${t.primary},${t.secondary});border-radius:0 0 40px 40px}
.section-label{background:rgba(255,107,157,.15);color:${t.primary}}
`,

  eduvision: (t) => `
/* EduVision — Blue Academic */
body{background:${t.bg}}
.topbar{background:#003d80;color:#fff;padding:9px 0;font-size:.84rem}
.navbar{background:#fff;border-bottom:3px solid ${t.primary};position:sticky;top:0;z-index:100}
.hero-academic{padding:70px 0;background:linear-gradient(135deg,#eef4fc,#fff)}
.hero-academic-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:44px;align-items:center}
.hero-academic h1{font-size:clamp(2rem,4vw,3rem);font-weight:900;color:#003d80;line-height:1.15}
.hero-academic h1 span{color:${t.secondary}}
.hero-features{display:flex;gap:28px;margin-top:28px}
.hero-features strong{display:block;font-size:1.8rem;color:${t.primary}}
.hero-media img{border-radius:12px;box-shadow:0 20px 60px rgba(0,102,204,.2)}
.media-card{position:absolute;bottom:-16px;left:20px;background:${t.primary};color:#fff;padding:14px 22px;border-radius:8px}
.feature-row{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.feature-box{background:#fff;border-radius:8px;padding:26px;text-align:center;border-top:4px solid ${t.primary};box-shadow:0 4px 20px rgba(0,102,204,.08)}
.course-card{background:#fff;border-radius:8px;padding:24px;border:1px solid rgba(0,102,204,.15);border-left:5px solid ${t.primary}}
.testimonial{background:#fff;border-radius:8px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,.06)}
.site-footer{background:#003d80}
.page-banner{background:${t.primary}}
.section-label{background:rgba(0,102,204,.12);color:${t.primary}}
`,

  ischool: (t) => `
/* iSchool — Green University */
body{background:${t.bg}}
.topbar{background:${t.primary};color:#fff;padding:9px 0;font-size:.84rem}
.navbar{background:#fff;position:sticky;top:0;z-index:100;box-shadow:0 2px 16px rgba(0,168,120,.1)}
.hero-university{padding:70px 0}
.hero-uni-grid{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:center}
.hero-badge{background:${t.primary};color:#fff;padding:6px 16px;border-radius:999px;font-size:.8rem;font-weight:700;display:inline-block;margin-bottom:14px}
.hero-university h1{font-size:clamp(2rem,4vw,3rem);font-weight:800;color:${t.text}}
.hero-university h1 span{color:${t.primary}}
.hero-video-card{position:relative;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,168,120,.2)}
.hero-video-card img{height:360px;width:100%;object-fit:cover}
.play-btn{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;background:${t.primary};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem}
.stats-uni{background:${t.primary};color:#fff;padding:44px 0}
.stats-uni .stat-box{background:rgba(255,255,255,.15);color:#fff;border-radius:12px}
.stats-uni .stat-box span{color:#fff}
.price-card{background:#fff;border-radius:16px;padding:32px;text-align:center;box-shadow:0 4px 24px rgba(0,168,120,.1);border:2px solid transparent}
.price-card.featured{border-color:${t.primary};transform:scale(1.04)}
.team-card{background:#fff;border-radius:16px;padding:24px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.06)}
.site-footer{background:#0a5c40}
.page-banner{background:linear-gradient(135deg,${t.primary},${t.secondary})}
.section-label{background:rgba(0,168,120,.12);color:${t.primary}}
`,

  edusion: (t) => `
/* Edusion — Dark Coral LMS */
body{background:${t.bg};color:${t.text}}
.dark-header{background:rgba(10,15,30,.97);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,107,53,.2);position:sticky;top:0;z-index:100;padding:14px 0}
.dark-header .brand strong,.dark-header .nav-link{color:#eef2ff}
.dark-header .nav-link.active{background:rgba(255,107,53,.2);color:${t.primary}}
.hero-dark-lms,.hero-edurock{min-height:90vh;position:relative;display:flex;align-items:center;color:#fff}
.hero-bg{position:absolute;inset:0;background-size:cover;background-position:center}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,15,30,.95),rgba(255,107,53,.35))}
.hero-content{position:relative;padding:90px 0;max-width:700px}
.hero-tag{background:rgba(255,107,53,.25);border:1px solid rgba(255,107,53,.4);padding:8px 18px;border-radius:999px;font-size:.82rem;font-weight:700;display:inline-block;margin-bottom:16px}
.hero-content h1{font-size:clamp(2rem,5vw,3.2rem);font-weight:800;line-height:1.12}
.hero-content h1 span{color:${t.primary}}
.stat-edu,.stat-box{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:28px;text-align:center}
.stat-edu span,.stat-box span{font-size:2.4rem;font-weight:800;color:${t.primary};display:block}
.subject-card,.course-edu{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:26px;transition:.3s}
.subject-card:hover{border-color:${t.primary}}
.price-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:30px;text-align:center;color:${t.text}}
.site-footer{background:#060a14}
.page-banner{background:linear-gradient(135deg,#0a0f1e,${t.primary})}
.section-tag{background:rgba(255,107,53,.15);color:${t.primary}}
`,

  eduall: (t) => `
/* EduAll / Edurock — Dark Indigo LMS */
body{background:${t.bg};color:${t.text}}
.dark-header{background:rgba(11,11,26,.98);border-bottom:1px solid rgba(99,102,241,.25);position:sticky;top:0;z-index:100;padding:14px 0}
.dark-header .brand strong{color:#fff}
.dark-header .nav-link{color:#94a3b8}
.dark-header .nav-link.active,.dark-header .nav-link:hover{color:#fff;background:rgba(99,102,241,.25)}
.hero-edurock{min-height:92vh;position:relative;display:flex;align-items:center;color:#fff}
.hero-bg{position:absolute;inset:0;background-size:cover;background-position:center}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(11,11,26,.94),rgba(99,102,241,.45))}
.hero-content{position:relative;padding:100px 0;max-width:720px}
.hero-tag{background:rgba(99,102,241,.3);padding:8px 18px;border-radius:999px;font-size:.82rem;font-weight:700;display:inline-block;margin-bottom:16px;border:1px solid rgba(99,102,241,.4)}
.hero-content h1{font-size:clamp(2.2rem,5vw,3.5rem);font-weight:800;line-height:1.1}
.hero-content h1 span{color:${t.secondary}}
.stats-edurock{background:rgba(99,102,241,.08);padding:56px 0;border-top:1px solid rgba(99,102,241,.15);border-bottom:1px solid rgba(99,102,241,.15)}
.stat-edu{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:28px;text-align:center}
.stat-edu span{font-size:2.6rem;font-weight:800;color:${t.secondary};display:block}
.subject-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:28px;text-align:center;transition:.3s}
.subject-card:hover{border-color:${t.primary};transform:translateY(-4px)}
.course-edu{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:24px}
.course-label{background:${t.primary};color:#fff;padding:4px 12px;border-radius:999px;font-size:.72rem;font-weight:700;display:inline-block;margin-bottom:10px}
.price-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:32px;text-align:center;color:${t.text}}
.price-card.featured{background:linear-gradient(180deg,rgba(99,102,241,.2),rgba(99,102,241,.05));border-color:${t.primary}}
.plan-price{font-size:2.8rem;font-weight:900;color:#fff;margin:14px 0}
.register-form{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:32px}
.testimonial-edu{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:28px}
.site-footer{background:#050510}
.page-banner{background:linear-gradient(135deg,#6366f1,#f59e0b)}
.section-tag{background:rgba(99,102,241,.2);color:${t.accent}}
`,

  kidso: (t) => `
/* Kidso — Yellow Childcare */
body{background:linear-gradient(180deg,#fff8e7,#fffbeb)}
.kinder-header{background:#fff;border-bottom:6px solid ${t.primary};position:sticky;top:0;z-index:100}
.hero-kinder{padding:40px 0 60px}
.hero-bubble{background:#fff;border:4px solid ${t.primary};border-radius:20px;padding:32px;box-shadow:8px 8px 0 ${t.secondary}}
.hero-bubble h1{font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;color:${t.text}}
.hero-bubble h1 span{color:${t.primary};text-decoration:underline wavy ${t.secondary}}
.activity-card{background:${t.primary};color:${t.text};border-radius:12px;padding:14px;font-weight:700;border:3px solid ${t.text}}
.program-card{background:#fff;border:4px solid ${t.primary};border-radius:12px;padding:24px;box-shadow:6px 6px 0 ${t.secondary}}
.stat-bubble{background:${t.secondary};color:#fff;border-radius:12px;padding:24px 32px;font-weight:800}
.cta-kinder{background:${t.primary};color:${t.text};padding:60px 20px;text-align:center;border:4px solid ${t.text}}
.site-footer{background:${t.text};color:#fff}
.page-banner{background:${t.primary};color:${t.text}}
.section-label{background:${t.secondary};color:#fff}
`,

  eginary: (t) => `
/* Eginary — Teal Smart Learning */
body{background:linear-gradient(180deg,#ecfeff,#f0fdfa)}
.topbar{background:linear-gradient(90deg,${t.primary},${t.secondary});color:#fff;padding:9px 0;font-size:.84rem}
.navbar{background:#fff;position:sticky;top:0;z-index:100;box-shadow:0 2px 20px rgba(8,145,178,.12)}
.hero-lms{min-height:85vh;display:flex;align-items:center;background:linear-gradient(135deg,rgba(8,145,178,.85),rgba(6,182,212,.6)),url('') center/cover}
.hero-slide::before{background:linear-gradient(135deg,rgba(8,145,178,.88),rgba(34,211,238,.5))!important}
.category-card{background:#fff;border-radius:12px;padding:24px;border-left:6px solid ${t.primary};box-shadow:0 4px 20px rgba(8,145,178,.1)}
.course-card{background:#fff;border-radius:12px;border-left:5px solid ${t.secondary};overflow:hidden;box-shadow:0 4px 20px rgba(8,145,178,.08)}
.stat-box{background:linear-gradient(135deg,rgba(8,145,178,.08),rgba(6,182,212,.08));border-radius:12px;border:1px solid rgba(8,145,178,.15)}
.cta-band{background:linear-gradient(135deg,${t.primary},${t.secondary})}
.site-footer{background:#164e63}
.page-banner{background:linear-gradient(135deg,${t.primary},${t.secondary})}
.section-label{background:rgba(8,145,178,.12);color:${t.primary}}
`,

  wellearn: (t) => `
/* WellLearn — Purple Education Hub */
body{background:linear-gradient(180deg,#fdf4ff,#faf5ff)}
.topbar{background:linear-gradient(90deg,${t.primary},${t.secondary});color:#fff;padding:9px 0;font-size:.84rem}
.navbar{background:rgba(255,255,255,.95);backdrop-filter:blur(10px);position:sticky;top:0;z-index:100;border-bottom:2px solid rgba(124,58,237,.15)}
.hero-lms{min-height:88vh;display:flex;align-items:center}
.hero-slide::before{background:linear-gradient(135deg,rgba(124,58,237,.88),rgba(236,72,153,.55))!important}
.category-card{background:linear-gradient(145deg,#fff,#fdf4ff);border-radius:16px;padding:26px;border:2px solid transparent;background-clip:padding-box;position:relative;box-shadow:0 4px 24px rgba(124,58,237,.1)}
.category-card::before{content:'';position:absolute;inset:0;border-radius:16px;padding:2px;background:linear-gradient(135deg,${t.primary},${t.secondary});-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude}
.course-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(124,58,237,.12)}
.stat-box{background:linear-gradient(135deg,rgba(124,58,237,.1),rgba(236,72,153,.08));border-radius:16px}
.cta-band{background:linear-gradient(135deg,${t.primary},${t.secondary})}
.site-footer{background:#3b0764}
.page-banner{background:linear-gradient(135deg,${t.primary},${t.secondary})}
.section-label{background:rgba(124,58,237,.12);color:${t.primary}}
`,

  edrio: (t) => `
/* Edrio — Red/Yellow Fredoka Kindergarten */
body{background:#fff5eb}
.kinder-header{background:#fff;border-bottom:5px dashed ${t.primary};position:sticky;top:0;z-index:100}
.hero-bubble{border:4px dashed ${t.secondary};border-radius:30px;background:#fff;padding:32px}
.hero-bubble h1{font-family:'Fredoka',sans-serif;font-size:clamp(2rem,4vw,3rem);font-weight:700}
.hero-bubble h1 span{color:${t.primary};-webkit-text-stroke:1px ${t.text}}
.activity-card{border-radius:50% 50% 50% 0;background:${t.accent};padding:16px;border:3px solid ${t.primary}}
.program-card{border-radius:24px;border:3px solid ${t.primary};background:#fff;position:relative}
.program-card::after{content:'⭐';position:absolute;top:-12px;right:-12px;font-size:1.5rem}
.site-footer{background:${t.primary}}
.page-banner{background:linear-gradient(135deg,${t.primary},${t.secondary});border-radius:0 0 30px 30px}
.section-label{background:${t.secondary};color:${t.text}}
`,

  'los-ninos': (t) => `
/* Los Niños — Green Nature Playful */
body{background:linear-gradient(180deg,#edfff3,#f0fff4)}
.kinder-header{background:#fff;border-bottom:4px solid ${t.primary};position:sticky;top:0;z-index:100}
.hero-bubble{border-radius:50px 50px 50px 0;background:#fff;padding:34px;box-shadow:0 16px 50px rgba(39,174,96,.15);border:2px solid rgba(39,174,96,.2)}
.hero-bubble h1{font-family:'Baloo 2',sans-serif;font-weight:800;color:${t.text}}
.hero-bubble h1 span{color:${t.primary}}
.activity-card{border-radius:40px;background:rgba(39,174,96,.1);border:2px solid ${t.primary}}
.program-card{border-radius:40px 40px 40px 0;background:#fff;border:2px solid ${t.secondary}}
.stat-bubble{border-radius:50%;background:${t.primary};color:#fff;width:130px;height:130px}
.site-footer{background:#1a4d2e}
.page-banner{background:linear-gradient(135deg,${t.primary},${t.secondary});border-radius:0 0 50px 0}
.section-label{background:rgba(39,174,96,.15);color:${t.primary}}
`,

  kidscholl: (t) => `
/* Kidscholl — Blue Wave Preschool */
body{background:${t.bg}}
.preschool-header{position:sticky;top:0;z-index:100;background:#fff;box-shadow:0 4px 20px rgba(52,152,219,.15)}
.header-wave{height:8px;background:linear-gradient(90deg,${t.primary},${t.secondary},${t.accent})}
.brand-shape{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,${t.primary},${t.secondary})}
.hero-preschool{padding:50px 0;background:linear-gradient(180deg,${t.bg},#fff)}
.hero-preschool h1{font-size:clamp(1.8rem,4vw,2.6rem);font-weight:900;color:${t.text}}
.hero-preschool h1 span{color:${t.primary}}
.hero-slider-mini{border-radius:24px;overflow:hidden;box-shadow:0 16px 50px rgba(52,152,219,.2)}
.hero-float-card{background:${t.primary};color:#fff;border-radius:16px;padding:16px 22px}
.stat-pill{background:#fff;border-radius:999px;padding:20px 28px;box-shadow:0 4px 20px rgba(52,152,219,.12);border:2px solid rgba(52,152,219,.15);text-align:center}
.stat-pill span{font-size:2.2rem;font-weight:800;color:${t.primary};display:block}
.course-card-p{background:#fff;border-radius:20px;padding:22px;border-top:4px solid ${t.primary};box-shadow:0 4px 20px rgba(0,0,0,.06)}
.cta-preschool{background:linear-gradient(135deg,${t.primary},${t.secondary});color:#fff;text-align:center;padding:70px 20px}
.site-footer{background:#1a3a5c}
.page-banner{background:linear-gradient(135deg,${t.primary},${t.secondary})}
.section-label{background:rgba(52,152,219,.12);color:${t.primary}}
`,

  ascen: (t) => `
/* Ascen — Coral/Teal Childcare */
body{background:#fff5f0}
.preschool-header{background:#fff;position:sticky;top:0;z-index:100;box-shadow:0 4px 24px rgba(225,112,85,.12)}
.header-wave{height:6px;background:linear-gradient(90deg,${t.primary},${t.secondary})}
.brand-shape{border-radius:30% 70% 50% 50%;background:linear-gradient(135deg,${t.primary},${t.secondary})}
.hero-preschool{padding:50px 0}
.hero-preschool h1 span{color:${t.primary}}
.stat-pill{border-radius:999px;background:linear-gradient(135deg,rgba(225,112,85,.1),rgba(0,184,148,.1));border:none}
.course-card-p{border-radius:999px 999px 24px 24px;background:#fff;padding:24px;box-shadow:0 8px 30px rgba(225,112,85,.1)}
.cta-preschool{background:linear-gradient(135deg,${t.primary},${t.secondary})}
.site-footer{background:#4a2010}
.page-banner{background:linear-gradient(135deg,${t.primary},${t.secondary});border-radius:0 0 999px 0}
.section-label{background:rgba(225,112,85,.15);color:${t.primary}}
`,

  cutie: (t) => `
/* Cutie — Pastel Creative */
body{background:linear-gradient(180deg,#fff8f5,#fff9f0)}
.preschool-header{background:rgba(255,255,255,.9);backdrop-filter:blur(8px);position:sticky;top:0;z-index:100}
.header-wave{height:10px;background:linear-gradient(90deg,${t.primary},${t.secondary},${t.accent})}
.brand-shape{border-radius:50%;background:linear-gradient(135deg,${t.primary},${t.secondary});box-shadow:0 4px 20px rgba(255,118,117,.3)}
.hero-preschool{padding:50px 0}
.hero-preschool h1{font-family:'Comfortaa',sans-serif;font-weight:700}
.hero-preschool h1 span{color:${t.secondary}}
.hero-slider-mini{border-radius:50% 50% 20px 20px;overflow:hidden}
.stat-pill{border-radius:24px;background:linear-gradient(135deg,rgba(255,118,117,.1),rgba(116,185,255,.1))}
.course-card-p{border-radius:28px;background:#fff;border:2px solid rgba(255,118,117,.2);box-shadow:0 8px 30px rgba(255,118,117,.08)}
.cta-preschool{background:linear-gradient(135deg,${t.primary},${t.secondary});border-radius:40px;margin:0 20px}
.site-footer{background:#5c2020}
.page-banner{background:linear-gradient(135deg,${t.primary},${t.secondary});border-radius:0 0 50px 50px}
.section-label{background:rgba(255,118,117,.15);color:${t.primary}}
`,

  kiddoz: (t) => `
/* Kiddoz — Cyan Geometric */
body{background:linear-gradient(180deg,#e8fffe,#f0fffe)}
.preschool-header{background:#fff;position:sticky;top:0;z-index:100;border-bottom:3px solid ${t.primary}}
.header-wave{height:6px;background:${t.primary}}
.brand-shape{width:44px;height:44px;background:linear-gradient(135deg,${t.primary},${t.secondary});clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%)}
.hero-preschool{padding:50px 0}
.hero-preschool h1{font-family:'Outfit',sans-serif;font-weight:800}
.hero-preschool h1 span{color:${t.primary}}
.hero-float-card{background:linear-gradient(135deg,${t.primary},${t.secondary});color:#fff;clip-path:polygon(10% 0%,100% 0%,90% 100%,0% 100%)}
.stat-pill{background:linear-gradient(135deg,${t.primary},${t.secondary});color:#fff;border-radius:12px}
.stat-pill span{color:#fff}
.course-card-p{border-radius:12px;border:2px solid ${t.primary};background:#fff;position:relative;overflow:hidden}
.course-card-p::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%;background:linear-gradient(180deg,${t.primary},${t.secondary})}
.cta-preschool{background:linear-gradient(135deg,${t.primary},${t.secondary})}
.site-footer{background:#0a3a38}
.page-banner{background:linear-gradient(135deg,${t.primary},${t.secondary})}
.section-label{background:rgba(0,206,201,.15);color:${t.primary}}
`
};

function generateCSS(theme) {
  const id = theme.layout || theme.id;
  const themeFn = THEME_CSS[id];
  const unique = themeFn ? themeFn(theme) : THEME_CSS.kadu(theme);
  return `/* ${theme.name} Theme — ${theme.demo} */\n` + baseReset(theme) + unique;
}

module.exports = { generateCSS };
