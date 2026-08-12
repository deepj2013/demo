/* BoutiqueOS front-end behaviours */
(function () {
  'use strict';

  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('menuToggle');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (window.innerWidth > 860) return;
      if (!sidebar.classList.contains('open')) return;
      if (sidebar.contains(e.target) || toggle.contains(e.target)) return;
      sidebar.classList.remove('open');
    });
  }

  // Modal helpers
  window.openModal = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  };
  window.closeModal = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  };
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close-modal')));
  });
  document.querySelectorAll('.modal-backdrop').forEach((bd) => {
    bd.addEventListener('click', (e) => {
      if (e.target === bd) bd.classList.remove('open');
    });
  });

  // Confirm deletes
  document.querySelectorAll('[data-confirm]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (!confirm(el.getAttribute('data-confirm') || 'Are you sure?')) e.preventDefault();
    });
  });

  // Auto-dismiss flash
  const flash = document.querySelector('.flash');
  if (flash) {
    setTimeout(() => {
      flash.style.transition = 'opacity .4s';
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 400);
    }, 3500);
  }

  // Live search filter for tables
  const search = document.getElementById('tableSearch');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase().trim();
      document.querySelectorAll('table.data tbody tr').forEach((tr) => {
        tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  // Cart (shop) — localStorage
  const CART_KEY = 'boutique_cart';
  window.getCart = function () {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
  };
  window.saveCart = function (items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartBadge();
  };
  window.addToCart = function (item) {
    const cart = getCart();
    const found = cart.find((c) => c.id === item.id);
    if (found) found.qty += item.qty || 1;
    else cart.push({ ...item, qty: item.qty || 1 });
    saveCart(cart);
    toast('Added to bag');
  };
  window.updateCartBadge = function () {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const n = getCart().reduce((s, i) => s + i.qty, 0);
    badge.textContent = String(n);
    badge.hidden = n === 0;
  };
  function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.style.cssText = 'position:fixed;left:50%;bottom:5rem;transform:translateX(-50%);background:#0B1220;color:#fff;padding:.7rem 1.1rem;border-radius:999px;font-size:.85rem;z-index:200;opacity:0;transition:.25s';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    setTimeout(() => { t.style.opacity = '0'; }, 1800);
  }
  updateCartBadge();

  // —— Searchable item picker (name / SKU / category) ——
  function initItemPickers(root) {
    (root || document).querySelectorAll('.item-picker').forEach((el) => {
      if (el.dataset.ready) return;
      el.dataset.ready = '1';
      const api = el.dataset.api;
      const types = el.dataset.types || '';
      const onSelectName = el.dataset.onSelect || '';
      const qInput = el.querySelector('.item-picker-q');
      const cat = el.querySelector('.item-picker-cat');
      const hidden = el.querySelector('.item-picker-value');
      const selectedBox = el.querySelector('.item-picker-selected');
      const results = el.querySelector('.item-picker-results');
      let timer = null;
      let activeIdx = -1;
      let current = [];

      function setSelected(item) {
        if (!item) {
          hidden.value = '';
          selectedBox.classList.remove('has-value');
          selectedBox.innerHTML = '<span class="item-picker-hint">Type to search — works with 1000+ items</span>';
          return;
        }
        hidden.value = String(item.id);
        selectedBox.classList.add('has-value');
        selectedBox.innerHTML = `<span class="item-picker-chip">${escapeHtml(item.sku)} — ${escapeHtml(item.name)} <button type="button" class="item-picker-clear" aria-label="Clear">✕</button></span>`;
        selectedBox.querySelector('.item-picker-clear')?.addEventListener('click', (e) => {
          e.preventDefault();
          setSelected(null);
          qInput.focus();
        });
        results.hidden = true;
        qInput.value = '';
        if (onSelectName && typeof window[onSelectName] === 'function') {
          window[onSelectName](item, el);
        }
        el.dispatchEvent(new CustomEvent('item-selected', { detail: item, bubbles: true }));
      }

      selectedBox.querySelector('.item-picker-clear')?.addEventListener('click', (e) => {
        e.preventDefault();
        setSelected(null);
      });

      function escapeHtml(s) {
        return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      }

      function renderList(items) {
        current = items;
        activeIdx = items.length ? 0 : -1;
        if (!items.length) {
          results.innerHTML = '<div class="item-picker-empty">No items match. Try another name, SKU, or category.</div>';
          results.hidden = false;
          return;
        }
        results.innerHTML = items.map((it, i) => `
          <button type="button" class="item-picker-option${i === 0 ? ' active' : ''}" data-idx="${i}" role="option">
            <span>
              <strong>${escapeHtml(it.name)}</strong>
              <small>${escapeHtml(it.sku)}${it.category_name ? ' · ' + escapeHtml(it.category_name) : ''}${it.color ? ' · ' + escapeHtml(it.color) : ''}</small>
            </span>
            <span class="item-picker-meta">${escapeHtml(it.item_type)}<br>${Number(it.stock_qty || 0).toFixed(1)} ${escapeHtml(it.unit || '')}</span>
          </button>
        `).join('');
        results.hidden = false;
        results.querySelectorAll('.item-picker-option').forEach((btn) => {
          btn.addEventListener('click', () => setSelected(current[Number(btn.dataset.idx)]));
        });
      }

      async function search() {
        const q = qInput.value.trim();
        const category_id = cat.value;
        // Allow browse-by-category with empty query
        if (q.length < 1 && !category_id) {
          results.hidden = true;
          results.innerHTML = '';
          return;
        }
        results.hidden = false;
        results.innerHTML = '<div class="item-picker-loading">Searching…</div>';
        const url = new URL(api, window.location.origin);
        // api may be relative path
        const base = api.includes('://') ? api : (api.startsWith('/') ? api : '/' + api.replace(/^\.\//, ''));
        const u = new URL(base, window.location.href);
        if (q) u.searchParams.set('q', q);
        if (category_id) u.searchParams.set('category_id', category_id);
        if (types) u.searchParams.set('types', types);
        u.searchParams.set('limit', '50');
        try {
          const res = await fetch(u.toString(), { credentials: 'same-origin' });
          const data = await res.json();
          renderList(data.items || []);
        } catch (err) {
          results.innerHTML = '<div class="item-picker-empty">Search failed. Check login/session.</div>';
        }
      }

      function schedule() {
        clearTimeout(timer);
        timer = setTimeout(search, 220);
      }

      qInput.addEventListener('input', schedule);
      cat.addEventListener('change', () => {
        if (!qInput.value.trim() && cat.value) qInput.placeholder = 'Optional: refine by name or SKU…';
        search();
      });
      qInput.addEventListener('focus', () => {
        if (qInput.value.trim() || cat.value) search();
      });
      qInput.addEventListener('keydown', (e) => {
        if (results.hidden || !current.length) return;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIdx = Math.min(current.length - 1, activeIdx + 1);
          highlight();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIdx = Math.max(0, activeIdx - 1);
          highlight();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (activeIdx >= 0) setSelected(current[activeIdx]);
        } else if (e.key === 'Escape') {
          results.hidden = true;
        }
      });

      function highlight() {
        results.querySelectorAll('.item-picker-option').forEach((btn, i) => {
          btn.classList.toggle('active', i === activeIdx);
          if (i === activeIdx) btn.scrollIntoView({ block: 'nearest' });
        });
      }

      document.addEventListener('click', (e) => {
        if (!el.contains(e.target)) results.hidden = true;
      });

      const form = el.closest('form');
      if (form && !form.dataset.itemPickerValidate) {
        form.dataset.itemPickerValidate = '1';
        form.addEventListener('submit', (e) => {
          const missing = [...form.querySelectorAll('.item-picker-value[data-required="1"]')].find((inp) => !inp.value);
          if (missing) {
            e.preventDefault();
            const box = missing.closest('.item-picker');
            box?.querySelector('.item-picker-q')?.focus();
            alert('Please search and select an item first.');
          }
        });
      }
    });
  }
  window.initItemPickers = initItemPickers;
  initItemPickers();

  // Re-init when modals open
  const _openModal = window.openModal;
  window.openModal = function (id) {
    _openModal(id);
    const modal = document.getElementById(id);
    if (modal) initItemPickers(modal);
  };

  // PWA service worker
  if ('serviceWorker' in navigator) {
    const swUrl = (document.querySelector('link[rel=manifest]')?.href || '').replace(/manifest\.(json|php).*$/, 'sw.js');
    if (swUrl) navigator.serviceWorker.register(swUrl).catch(() => {});
  }
})();
