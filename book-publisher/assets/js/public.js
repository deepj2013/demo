/* Public Bookstore JS */
const PublicSite = {
  filter: 'all',
  search: '',

  init() {
    this.serviceFilter = 'all';
    this.renderHeroBooks();
    this.renderBooks();
    this.renderAuthors();
    this.renderServices();
    this.renderPresence();
    this.renderTestimonials();
    this.bindEvents();
    IB.updateCartBadge();
  },

  bindEvents() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filter = btn.dataset.filter;
        this.renderBooks();
      };
    });
    document.getElementById('bookSearch')?.addEventListener('input', (e) => {
      this.search = e.target.value.toLowerCase();
      this.renderBooks();
    });
    document.getElementById('cartToggle')?.addEventListener('click', () => this.toggleCart(true));
    document.getElementById('cartClose')?.addEventListener('click', () => this.toggleCart(false));
    document.getElementById('cartOverlay')?.addEventListener('click', () => this.toggleCart(false));
    document.getElementById('checkoutBtn')?.addEventListener('click', () => this.checkout());
    document.getElementById('authorForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.submitAuthorForm(); });
    document.getElementById('mobileCartBtn')?.addEventListener('click', () => this.toggleCart(true));

    const nav = document.querySelector('.site-nav');
    const overlay = document.getElementById('navOverlay');
    const closeNav = () => {
      nav?.classList.remove('open');
      overlay?.classList.remove('open');
      IB.mobile.lockScroll(false);
    };
    const openNav = () => {
      nav?.classList.add('open');
      overlay?.classList.add('open');
      IB.mobile.lockScroll(true);
    };
    document.querySelector('.menu-btn')?.addEventListener('click', () => {
      nav?.classList.contains('open') ? closeNav() : openNav();
    });
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      nav?.classList.contains('open') ? closeNav() : openNav();
    });
    overlay?.addEventListener('click', closeNav);
    nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

    IB.mobile.setupBottomNav('.mobile-tabbar');
    IB.mobile.setupScrollSpy([
      { id: 'publish-offer', tab: 'offer' },
      { id: 'shop', tab: 'shop' },
      { id: 'presence', tab: 'presence' }
    ], '.mobile-tabbar');

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        if (id && document.getElementById(id)) {
          e.preventDefault();
          document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  },

  renderHeroBooks() {
    const el = document.getElementById('heroBooks');
    if (!el) return;
    el.innerHTML = INKBRIDGE.books.slice(0, 3).map(b => `
      <div class="hero-book" onclick="PublicSite.showBook(${b.id})">
        <div class="cover">${b.cover}</div>
        <h4>${b.title}</h4>
        <span>${b.author}</span>
      </div>`).join('');
  },

  getFilteredBooks() {
    return INKBRIDGE.books.filter(b => {
      const matchFilter = this.filter === 'all' || b.genre.toLowerCase().includes(this.filter);
      const matchSearch = !this.search || b.title.toLowerCase().includes(this.search) || b.author.toLowerCase().includes(this.search) || b.genre.toLowerCase().includes(this.search);
      return matchFilter && matchSearch && b.status === 'published';
    });
  },

  renderBooks() {
    const el = document.getElementById('bookGrid');
    if (!el) return;
    const books = this.getFilteredBooks();
    if (!books.length) {
      el.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="icon">📭</div><h3>No books found</h3><p>Try a different search or filter</p></div>';
      return;
    }
    el.innerHTML = books.map(b => `
      <div class="book-card" onclick="PublicSite.showBook(${b.id})">
        <div class="book-cover">${b.cover}</div>
        <div class="book-info">
          <div class="genre">${b.genre}</div>
          <h3>${b.title}</h3>
          <div class="author">by ${b.author}</div>
          <div class="book-meta">
            <div class="book-price">${IB.fmt(b.price)} ${b.mrp > b.price ? '<del>' + IB.fmt(b.mrp) + '</del>' : ''}</div>
            <div class="book-rating">${IB.stars(b.rating)} ${b.rating}</div>
          </div>
          <div class="book-actions" onclick="event.stopPropagation()">
            <button class="btn btn-ghost btn-sm" onclick="PublicSite.showBook(${b.id})">Details</button>
            <button class="btn btn-primary btn-sm" onclick="PublicSite.addToCart(${b.id})" ${b.stock === 0 ? 'disabled style="opacity:.5"' : ''}>
              ${b.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>`).join('');
  },

  renderAuthors() {
    const el = document.getElementById('authorsGrid');
    if (!el) return;
    el.innerHTML = INKBRIDGE.authors.filter(a => a.status === 'active').slice(0, 6).map(a => `
      <div class="author-card">
        <div class="avatar avatar-lg">${a.avatar}</div>
        <div>
          <h3>${a.name}</h3>
          <div class="city"><i class="fa-solid fa-location-dot"></i> ${a.city}</div>
          <p>${a.bio}</p>
          <div class="books-count">${a.books} published book${a.books !== 1 ? 's' : ''}</div>
        </div>
      </div>`).join('');
  },

  renderServices() {
    const el = document.getElementById('servicesGrid');
    if (!el) return;
    const tags = { presence: 'Digital Presence', growth: 'Growth', publish: 'Publishing', ops: 'Operations' };
    const list = INKBRIDGE.services.filter(s => this.serviceFilter === 'all' || s.category === this.serviceFilter);
    el.innerHTML = list.map(s => `
      <div class="service-card">
        <span class="svc-tag">${tags[s.category] || 'Service'}</span>
        <div class="icon">${s.icon}</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>`).join('');
  },

  filterServices(cat) {
    this.serviceFilter = cat;
    document.querySelectorAll('.svc-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat));
    this.renderServices();
  },

  renderPresence() {
    const dp = INKBRIDGE.digitalPresence;
    if (!dp) return;
    const g = dp.googleBusiness;
    const gbp = document.getElementById('gbpCard');
    if (gbp) {
      gbp.innerHTML = `
        <div class="gbp-map">
          <div class="pin">📍</div>
          <div>
            <div style="font-size:0.72rem;opacity:0.8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.25rem">Google Maps · Verified</div>
            <strong style="font-size:1.15rem">${g.name}</strong>
            <div style="font-size:0.8rem;opacity:0.85;margin-top:0.2rem">★ ${g.rating} · ${g.reviews} reviews</div>
          </div>
        </div>
        <div class="gbp-body">
          <h3>${g.name}</h3>
          <p class="gbp-meta"><i class="fa-solid fa-location-dot"></i> ${g.address}<br><i class="fa-regular fa-clock"></i> ${g.hours}</p>
          <div class="gbp-stats">
            <div class="gbp-stat"><strong>${IB.fmtNum(g.viewsMonth)}</strong><span>Map views / mo</span></div>
            <div class="gbp-stat"><strong>${IB.fmtNum(g.searchesMonth)}</strong><span>Searches / mo</span></div>
            <div class="gbp-stat"><strong>${IB.fmtNum(g.directionRequests)}</strong><span>Directions</span></div>
            <div class="gbp-stat"><strong>${g.callsMonth}</strong><span>Calls</span></div>
            <div class="gbp-stat"><strong>${IB.fmtNum(g.websiteClicks)}</strong><span>Website clicks</span></div>
            <div class="gbp-stat"><strong>${g.photos}</strong><span>Photos live</span></div>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <a class="btn btn-primary btn-sm" href="${g.mapUrl}" target="_blank" rel="noopener"><i class="fa-solid fa-map-location-dot"></i> Open in Google Maps</a>
            <button class="btn btn-ghost btn-sm" onclick="IB.toast('Review request QR generated','ok')"><i class="fa-solid fa-qrcode"></i> Review QR</button>
          </div>
        </div>`;
    }
    const ch = document.getElementById('presenceChannels');
    if (ch) {
      ch.innerHTML = dp.channels.map(c => `
        <div class="channel-tile">
          <span class="ch-ico">${c.icon}</span>
          <div>
            <strong>${c.name}</strong>
            <span>${IB.statusBadge(c.status === 'live' || c.status === 'active' ? 'connected' : c.status)} · ${c.metric}</span>
          </div>
        </div>`).join('');
    }
    const ck = document.getElementById('presenceChecklist');
    if (ck) {
      ck.innerHTML = dp.checklist.map(i => `
        <li style="display:flex;gap:0.6rem;padding:0.45rem 0;border-bottom:1px solid var(--line);font-size:0.88rem;align-items:flex-start">
          <span style="color:${i.done ? 'var(--ok)' : 'var(--muted)'}">${i.done ? '✓' : '○'}</span>
          <span style="${i.done ? '' : 'color:var(--muted)'}">${i.item}</span>
        </li>`).join('');
    }
  },

  renderTestimonials() {
    const el = document.getElementById('testimonialGrid');
    if (!el) return;
    el.innerHTML = INKBRIDGE.testimonials.map(t => `
      <div class="testimonial">
        <p>${t.text}</p>
        <div class="testimonial-author">
          <div class="avatar avatar-sm">${t.avatar}</div>
          <div><strong>${t.name}</strong><br><span>${t.role}</span></div>
        </div>
      </div>`).join('');
  },

  showBook(id) {
    const b = IB.getBook(id);
    if (!b) return;
    const totalSales = Object.values(b.sales).reduce((s, v) => s + v, 0);
    IB.modal(b.title, `
      <div class="book-detail-cover">${b.cover}</div>
      <p style="text-align:center;color:var(--muted);margin-bottom:1rem">by <strong>${b.author}</strong></p>
      <p style="margin-bottom:1rem">${b.synopsis}</p>
      <dl class="book-detail-meta">
        <dt>Genre</dt><dd>${b.genre}</dd>
        <dt>ISBN</dt><dd>${b.isbn}</dd>
        <dt>Pages</dt><dd>${b.pages}</dd>
        <dt>Language</dt><dd>${b.language}</dd>
        <dt>Format</dt><dd>${b.format.join(', ')}</dd>
        <dt>Published</dt><dd>${IB.date(b.published)}</dd>
        <dt>Rating</dt><dd>${IB.stars(b.rating)} ${b.rating} (${b.reviews} reviews)</dd>
        <dt>Stock</dt><dd>${b.stock > 0 ? b.stock + ' available' : 'Out of stock'}</dd>
      </dl>
      <div style="text-align:center;margin-top:1rem">
        <span style="font-family:var(--font-display);font-size:1.8rem;font-weight:700">${IB.fmt(b.price)}</span>
        ${b.mrp > b.price ? '<del style="color:var(--muted);margin-left:.5rem">' + IB.fmt(b.mrp) + '</del>' : ''}
      </div>
      <p class="text-sm text-muted" style="text-align:center;margin-top:0.75rem">Catalog data from bookspotonline.com</p>`,
      `<button class="btn btn-ghost" onclick="IB.closeModal()">Close</button>
       <a class="btn btn-ghost" href="${b.sourceUrl || 'https://www.bookspotonline.com/middle.php?file=home'}" target="_blank" rel="noopener"><i class="fa-solid fa-external-link"></i> View on Live Shop</a>
       <button class="btn btn-primary" onclick="PublicSite.addToCart(${b.id});IB.closeModal()">${b.stock === 0 ? 'Notify Me' : 'Add to Cart — ' + IB.fmt(b.price)}</button>`
    );
  },

  addToCart(id) {
    const b = IB.getBook(id);
    if (!b) return;
    if (b.stock === 0) { IB.toast('We\'ll notify you when back in stock!', 'warn'); return; }
    IB.cart.add(id);
    IB.toast('"' + b.title + '" added to cart', 'ok');
    this.renderCart();
  },

  toggleCart(open) {
    document.getElementById('cartSidebar')?.classList.toggle('open', open);
    document.getElementById('cartOverlay')?.classList.toggle('open', open);
    IB.mobile.lockScroll(!!open);
    if (open) this.renderCart();
  },

  renderCart() {
    const items = IB.cart.get();
    const el = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!el) return;
    if (!items.length) {
      el.innerHTML = '<div class="empty-state"><div class="icon">🛒</div><h3>Cart is empty</h3><p>Browse our catalog and add books</p></div>';
      if (totalEl) totalEl.textContent = IB.fmt(0);
      return;
    }
    el.innerHTML = items.map(i => {
      const b = IB.getBook(i.bookId);
      if (!b) return '';
      return `<div class="cart-item">
        <div class="cover">${b.cover}</div>
        <div><h4>${b.title}</h4><div class="price">${IB.fmt(b.price)} × ${i.qty}</div></div>
        <div class="qty-ctrl">
          <button onclick="PublicSite.changeQty(${b.id},-1)">−</button>
          <span>${i.qty}</span>
          <button onclick="PublicSite.changeQty(${b.id},1)">+</button>
        </div>
      </div>`;
    }).join('');
    if (totalEl) totalEl.textContent = IB.fmt(IB.cart.total());
  },

  changeQty(bookId, delta) {
    const items = IB.cart.get();
    const item = items.find(i => i.bookId === bookId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) IB.cart.remove(bookId);
    else IB.cart.set(items);
    this.renderCart();
  },

  checkout() {
    const items = IB.cart.get();
    if (!items.length) { IB.toast('Cart is empty', 'warn'); return; }
    IB.modal('Checkout', `
      <p style="margin-bottom:1rem">Order total: <strong>${IB.fmt(IB.cart.total())}</strong></p>
      <div class="form-group"><label>Full Name</label><input id="co-name" value="Demo Customer"></div>
      <div class="form-group"><label>Email</label><input id="co-email" type="email" value="demo@email.com"></div>
      <div class="form-group"><label>Phone</label><input id="co-phone" value="+91 98765 43210"></div>
      <div class="form-group"><label>Address</label><textarea id="co-addr" rows="2">42 Reader Lane, New Delhi 110001</textarea></div>
      <div class="form-group"><label>Payment</label>
        <select id="co-pay"><option>Instamojo UPI</option><option>Razorpay Card</option><option>Cash on Delivery</option></select>
      </div>`,
      `<button class="btn btn-ghost" onclick="IB.closeModal()">Cancel</button>
       <button class="btn btn-gold" onclick="PublicSite.placeOrder()"><i class="fa-solid fa-lock"></i> Pay ${IB.fmt(IB.cart.total())}</button>`
    );
  },

  placeOrder() {
    const total = IB.cart.total();
    const orderId = 'ORD-' + Math.floor(Math.random() * 9000 + 1000);
    IB.cart.clear();
    IB.closeModal();
    this.toggleCart(false);
    IB.toast('Order ' + orderId + ' placed successfully!', 'ok');
    IB.modal('Order Confirmed! 🎉', `
      <p>Thank you for your purchase from <strong>Bookspot Publishers</strong>.</p>
      <dl class="book-detail-meta" style="margin-top:1rem">
        <dt>Order ID</dt><dd>${orderId}</dd>
        <dt>Amount Paid</dt><dd>${IB.fmt(total)}</dd>
        <dt>Status</dt><dd>Processing</dd>
        <dt>Delivery</dt><dd>3–5 business days</dd>
      </dl>
      <p style="margin-top:1rem;font-size:0.85rem;color:var(--muted)">This order will appear in the Publisher Dashboard and Author Portal (for relevant authors).</p>`,
      '<button class="btn btn-primary" onclick="IB.closeModal()">Continue Shopping</button>'
    );
  },

  submitAuthorForm() {
    const name = document.getElementById('af-name')?.value;
    IB.toast('Application submitted! We\'ll review within 48 hours.', 'ok');
    IB.modal('Application Received', `
      <p>Thank you, <strong>${name || 'Author'}</strong>! Your author application has been submitted.</p>
      <p style="margin-top:0.75rem;font-size:0.88rem;color:var(--muted)">Our editorial team will review your profile within 48 hours. Once approved, you'll receive login credentials for the Author Portal where you can upload manuscripts, request ISBN, and track sales.</p>
      <p style="margin-top:0.75rem"><a href="../author/index.html" class="btn btn-burgundy btn-sm">Preview Author Portal →</a></p>`,
      '<button class="btn btn-primary" onclick="IB.closeModal()">Got it</button>'
    );
    document.getElementById('authorForm')?.reset();
  }
};

document.addEventListener('DOMContentLoaded', () => PublicSite.init());
