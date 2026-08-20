/* Bookspot — Shared Utilities */
const IB = {
  fmtINR(n) {
    return '₹' + Number(n).toLocaleString('en-IN');
  },

  currency() {
    const b = (window.BOOKSPOT || window.BOOKSPO || window.INKBRIDGE || {}).brand || {};
    return b.currency || 'LE';
  },

  fmt(n) {
    const c = IB.currency();
    if (c === 'LE') return 'LE ' + Number(n).toLocaleString('en-EG');
    if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
    if (n >= 1000) return '₹' + n.toLocaleString('en-IN');
    return '₹' + n;
  },

  fmtNum(n) {
    return n.toLocaleString('en-IN');
  },

  pctChange(cur, prev) {
    if (!prev) return { val: 0, up: true };
    const v = Math.round(((cur - prev) / prev) * 100);
    return { val: Math.abs(v), up: v >= 0 };
  },

  date(str) {
    const d = new Date(str);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  toast(msg, type = '') {
    let c = document.querySelector('.toast-container');
    if (!c) {
      c = document.createElement('div');
      c.className = 'toast-container';
      document.body.appendChild(c);
    }
    const t = document.createElement('div');
    t.className = 'toast' + (type ? ' ' + type : '');
    t.innerHTML = (type === 'ok' ? '✓ ' : type === 'warn' ? '⚠ ' : 'ℹ ') + msg;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3200);
  },

  modal(title, body, footer) {
    let ov = document.getElementById('ib-modal');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'ib-modal';
      ov.className = 'modal-overlay';
      ov.innerHTML = '<div class="modal"><div class="modal-header"><h3></h3><button class="modal-close" aria-label="Close">&times;</button></div><div class="modal-body"></div><div class="modal-footer"></div></div>';
      document.body.appendChild(ov);
      ov.querySelector('.modal-close').onclick = () => IB.closeModal();
      ov.onclick = (e) => { if (e.target === ov) IB.closeModal(); };
    }
    ov.querySelector('.modal-header h3').textContent = title;
    ov.querySelector('.modal-body').innerHTML = body;
    const ft = ov.querySelector('.modal-footer');
    ft.innerHTML = footer || '<button class="btn btn-ghost" onclick="IB.closeModal()">Close</button>';
    ov.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    const ov = document.getElementById('ib-modal');
    if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
  },

  confirm(title, msg, onOk) {
    IB.modal(title, '<p>' + msg + '</p>',
      '<button class="btn btn-ghost" onclick="IB.closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" id="ib-confirm-ok">Confirm</button>'
    );
    document.getElementById('ib-confirm-ok').onclick = () => { IB.closeModal(); onOk && onOk(); };
  },

  statusBadge(status) {
    const map = {
      published: 'badge-ok', active: 'badge-ok', delivered: 'badge-ok', completed: 'badge-ok', connected: 'badge-ok', approved: 'badge-ok',
      pending: 'badge-warn', processing: 'badge-warn', review: 'badge-warn', submitted: 'badge-info', shipped: 'badge-info', editing: 'badge-info', design: 'badge-info', isbn: 'badge-gold',
      cancelled: 'badge-bad', rejected: 'badge-bad', available: 'badge-muted', paused: 'badge-warn', draft: 'badge-muted', scheduled: 'badge-info'
    };
    return '<span class="badge ' + (map[status] || 'badge-muted') + '">' + status + '</span>';
  },

  channelIcon(ch) {
    const icons = { website: '🌐', amazon: '🛒', flipkart: '🛍️', kindle: '📱' };
    return icons[ch] || '📦';
  },

  channelLabel(ch) {
    const labels = { website: 'Website', amazon: 'Amazon', flipkart: 'Flipkart', kindle: 'Kindle' };
    return labels[ch] || ch;
  },

  stars(rating) {
    let s = '';
    for (let i = 1; i <= 5; i++) s += i <= Math.floor(rating) ? '★' : (i - 0.5 <= rating ? '⯨' : '☆');
    return s;
  },

  getBook(id) {
    return (window.BOOKSPOT || window.BOOKSPO || window.INKBRIDGE).books.find(b => b.id === id);
  },

  getAuthor(id) {
    return (window.BOOKSPOT || window.BOOKSPO || window.INKBRIDGE).authors.find(a => a.id === id);
  },

  cart: {
    key: 'ib_cart',
    get() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; } },
    set(items) { localStorage.setItem(this.key, JSON.stringify(items)); IB.updateCartBadge(); },
    add(bookId, qty = 1) {
      const items = this.get();
      const ex = items.find(i => i.bookId === bookId);
      if (ex) ex.qty += qty; else items.push({ bookId, qty });
      this.set(items);
    },
    remove(bookId) { this.set(this.get().filter(i => i.bookId !== bookId)); },
    clear() { this.set([]); },
    count() { return this.get().reduce((s, i) => s + i.qty, 0); },
    total() {
      return this.get().reduce((s, i) => {
        const b = IB.getBook(i.bookId);
        return s + (b ? b.price * i.qty : 0);
      }, 0);
    }
  },

  updateCartBadge() {
    document.querySelectorAll('.cart-count').forEach(el => {
      const n = IB.cart.count();
      el.textContent = n;
      el.style.display = n ? 'inline-flex' : 'none';
    });
  },

  initMobileMenu(toggleSel, navSel) {
    const btn = document.querySelector(toggleSel);
    const nav = document.querySelector(navSel);
    if (btn && nav) {
      btn.onclick = () => nav.classList.toggle('open');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => IB.updateCartBadge());
