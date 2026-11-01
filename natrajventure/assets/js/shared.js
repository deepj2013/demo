(function () {
  const loader = document.getElementById('nv-loader');
  function hideLoader() {
    if (loader) loader.classList.add('hide');
  }
  window.addEventListener('load', function () {
    setTimeout(hideLoader, 350);
  });
  // Don't block forever if remote images hang
  setTimeout(hideLoader, 2200);

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Mobile nav toggles
  document.querySelectorAll('[data-nav-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = document.querySelector(btn.getAttribute('data-nav-toggle'));
      if (target) target.classList.toggle('open');
      btn.classList.toggle('active');
    });
  });
})();
