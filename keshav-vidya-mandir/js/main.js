document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-menu');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  // Fade-up
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

  // Counters
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      let c = 0;
      const step = Math.max(1, Math.floor(target / 50));
      const t = setInterval(() => {
        c += step;
        if (c >= target) { c = target; clearInterval(t); }
        el.textContent = c.toLocaleString('en-IN') + suffix;
      }, 30);
      obs.disconnect();
    });
    obs.observe(el);
  });

  // Hero slider
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  const slides = [...slider.querySelectorAll('.slide')];
  const dotsWrap = slider.querySelector('.slider-dots');
  let i = 0;
  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
    if (idx === 0) b.classList.add('active');
    b.addEventListener('click', () => go(idx));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.querySelectorAll('button')];
  function go(n) {
    slides[i].classList.remove('active');
    dots[i].classList.remove('active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('active');
    dots[i].classList.add('active');
  }
  slider.querySelector('.next').addEventListener('click', () => go(i + 1));
  slider.querySelector('.prev').addEventListener('click', () => go(i - 1));
  setInterval(() => go(i + 1), 5500);
});
