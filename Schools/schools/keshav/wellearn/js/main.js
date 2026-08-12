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