/* CA Practice Platform — shared UI logic */
(function () {
  'use strict';

  /* Accordion */
  document.querySelectorAll('.acc-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc-item');
      var open = item.classList.contains('open');
      item.parentElement.querySelectorAll('.acc-item').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!open) item.classList.add('open');
    });
  });

  /* Module tabs */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = root.querySelectorAll('.mod-tab');
    var panels = root.querySelectorAll('.mod-panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-tab');
        tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
        panels.forEach(function (p) {
          p.classList.toggle('active', p.getAttribute('data-panel') === id);
        });
      });
    });
  });

  /* Toast */
  window.showToast = function (msg) {
    var t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function () {
      t.classList.remove('show');
    }, 2800);
  };

  /* Overlay / drawer */
  window.openDrawer = function (html) {
    var ov = document.getElementById('overlay');
    if (!ov) return;
    ov.querySelector('.drawer-body').innerHTML = html;
    ov.classList.add('open');
  };
  window.closeDrawer = function () {
    var ov = document.getElementById('overlay');
    if (ov) ov.classList.remove('open');
  };
  document.addEventListener('click', function (e) {
    if (e.target.id === 'overlay') closeDrawer();
    if (e.target.closest('[data-close-drawer]')) closeDrawer();
  });

  /* Mobile sidebar */
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var sb = document.querySelector('.sidebar');
      if (sb) sb.classList.toggle('mobile-open');
    });
  }

  /* Active nav highlight */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.topnav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
