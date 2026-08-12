#!/usr/bin/env node
/** Add theme-specific visual enhancements to each theme's CSS */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'schools');

const THEME_ENHANCEMENTS = {
  kadu: `
/* Kadu - Online Education Platform */
.hero{min-height:90vh}
.hero::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
.course-card{border-left:4px solid var(--accent)}
.stats-grid .stat{background:linear-gradient(135deg,rgba(108,92,231,.1),rgba(162,155,254,.1));padding:32px;border-radius:16px}`,
  bornomala: `
/* Bornomala - Kindergarten */
body{background:#fff5f8}
.hero{border-radius:0 0 60px 60px;overflow:hidden}
.course-card{border-radius:30px;background:linear-gradient(135deg,#fff,#fff5f8)}
.course-icon{background:linear-gradient(135deg,#fd79a8,#e84393);width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem}
.teacher-card{border-radius:30px;border:3px dashed #fd79a8}
.btn-primary{border-radius:30px;background:linear-gradient(135deg,#fd79a8,#e84393)}`,
  eduvision: `
/* EduVision - Professional */
.top-bar{background:#0a3d62}
.hero h1{text-transform:uppercase;letter-spacing:2px}
.course-card{border-top:3px solid var(--primary)}
.stat span{color:var(--accent)}
.site-footer{background:linear-gradient(135deg,#0a3d62,#1a5276)}`,
  ischool: `
/* iSchool - University */
.hero{min-height:95vh}
.hero-content{backdrop-filter:blur(2px)}
.section-tag{background:var(--accent);color:#fff}
.mission-card{border-left:4px solid var(--accent)}
.btn-primary{background:var(--accent)}`,
  edusion: `
/* Edusion - Bold Modern */
.hero h1{font-size:clamp(2.5rem,6vw,4rem);font-weight:900}
.stats-grid .stat{background:#fff;padding:40px 20px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.08)}
.course-card:hover{border-color:var(--primary)}
.cta h2{font-size:2.5rem;font-weight:900}`,
  eduall: `
/* EduAll - LMS */
.course-card{position:relative;overflow:hidden}
.course-card::after{content:'Enroll →';position:absolute;bottom:16px;right:16px;background:var(--accent);color:#fff;padding:6px 14px;border-radius:20px;font-size:.8rem;opacity:0;transition:.3s}
.course-card:hover::after{opacity:1}
.teacher-card img{border-radius:50%}`,
  kidso: `
/* Kidso - Childcare */
body{background:#fffef5}
.hero{border-radius:0 0 80px 0}
.course-card{border-radius:24px;transform:rotate(-1deg)}
.course-card:nth-child(even){transform:rotate(1deg)}
.teacher-card{border-radius:50px 50px 24px 24px}`,
  eginary: `
/* Eginary - Corporate */
.hero h1{font-weight:300}
.hero h1 span{font-weight:800}
.course-card{text-align:center;border-bottom:3px solid transparent}
.course-card:hover{border-bottom-color:var(--accent)}`,
  wellearn: `
/* WellLearn - Education Hub */
.hero{background-attachment:fixed!important}
.courses-grid{gap:32px}
.course-card{box-shadow:0 10px 40px rgba(0,0,0,.1)}`,
  edrio: `
/* Edrio - Kindergarten Classic */
body{background:#fff8f0}
.hero{border-radius:0 0 100px 0}
.course-card{background:linear-gradient(180deg,#fff,#fff8f0);border:2px solid #ffe0d0}
.btn-primary{background:linear-gradient(135deg,#ff7675,#fd79a8);border-radius:30px}`,
  'los-ninos': `
/* Los Niños - Playful */
.hero{clip-path:polygon(0 0,100% 0,100% 85%,0 100%)}
.course-card{border-radius:50% 50% 24px 24px;background:linear-gradient(135deg,#fff,#e8fff8)}
.stat span{color:#00b894}`,
  kidscholl: `
/* Kidscholl - Preschool */
.hero::after{content:'🎈';position:absolute;right:10%;top:20%;font-size:4rem;animation:float 3s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
.course-card{border:2px solid #74b9ff;border-radius:20px}`,
  ascen: `
/* Ascen - Elementary */
.stats-grid .stat{border:2px solid var(--primary);border-radius:16px;padding:24px}
.event-card{border-left:4px solid var(--accent)}`,
  cutie: `
/* Cutie - Creative */
body{background:linear-gradient(180deg,#fffef0,#fff)}
.course-card{background:linear-gradient(135deg,#fff9e6,#fff);border:2px solid #ffeaa7;border-radius:20px}
.hero h1{background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent}`,
  kiddoz: `
/* Kiddoz - School */
.hero{position:relative}
.hero-content h1{font-weight:800}
.teacher-card{border:1px solid #eee}
.cta{background:linear-gradient(135deg,#00cec9,#81ecec)!important}`
};

for (const school of ['keshav', 'sunrise']) {
  for (const [themeId, css] of Object.entries(THEME_ENHANCEMENTS)) {
    const cssPath = path.join(ROOT, school, themeId, 'css', 'style.css');
    if (fs.existsSync(cssPath)) {
      fs.appendFileSync(cssPath, '\n' + css);
    }
  }
}
console.log('Theme enhancements applied to all 30 theme folders');
