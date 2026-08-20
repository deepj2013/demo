/* Author Portal JS */
const AuthorPortal = {
  view: 'overview',
  authorId: 1,

  init() {
    this.authorId = INKBRIDGE.authorDashboard.authorId;
    this.bindNav();
    this.renderAll();
    const hash = (location.hash || '').replace('#', '');
    if (hash && document.getElementById('aview-' + hash)) this.navigate(hash);
  },

  bindNav() {
    document.querySelectorAll('.author-nav-item').forEach(item => {
      item.onclick = () => this.navigate(item.dataset.view);
    });
    this.sidebar = IB.mobile.setupSidebar({
      sidebar: '.author-sidebar',
      overlay: '#sidebarOverlay',
      toggle: '.sidebar-toggle',
      navItems: '.author-nav-item'
    });
    IB.mobile.setupBottomNav('.mobile-tabbar', null, (item) => {
      const view = item.dataset.view;
      if (view === 'menu') {
        this.sidebar?.open();
        document.querySelectorAll('.mobile-tabbar .tab-item').forEach(t => {
          t.classList.toggle('active', t.dataset.view === this.view);
        });
        return;
      }
      if (view) this.navigate(view);
    });
  },

  navigate(view) {
    this.view = view;
    document.querySelectorAll('.author-nav-item').forEach(i => i.classList.toggle('active', i.dataset.view === view));
    document.querySelectorAll('.author-view').forEach(v => v.classList.toggle('active', v.id === 'aview-' + view));
    document.querySelectorAll('.mobile-tabbar .tab-item').forEach(t => {
      t.classList.toggle('active', t.dataset.view === view);
    });
    this.sidebar?.close();
    const titles = {
      overview: 'My Dashboard', books: 'My Books', upload: 'Upload Manuscript',
      journey: 'Publishing Journey', royaltycalc: 'Royalty Calculator', salesdash: 'Live Sales Dashboard',
      withdraw: 'Withdraw Royalty', orders: 'My Orders', profile: 'Profile & Settings', notifications: 'Notifications'
    };
    const h = document.getElementById('authorPageTitle');
    if (h) h.textContent = titles[view] || view;
    if (view === 'salesdash') this.renderSalesDash();
    if (view === 'journey') this.renderJourney();
    if (view === 'withdraw') this.renderWithdraw();
  },

  getAuthor() { return IB.getAuthor(this.authorId); },
  getMyBooks() { return INKBRIDGE.books.filter(b => b.authorId === this.authorId); },
  getMyOrders() { return INKBRIDGE.orders.filter(o => o.authorIds.includes(this.authorId)); },
  getDash() { return INKBRIDGE.authorSalesDashboard; },

  renderAll() {
    this.renderOverview();
    this.renderJourney();
    this.renderSalesDash();
    this.renderWithdraw();
    this.renderBooks();
    this.renderOrders();
    this.renderNotifications();
    this.renderProfile();
  },

  renderOverview() {
    const a = this.getAuthor();
    const d = this.getDash();
    const copies = (d.channels.amazon.copies || 0) + (d.channels.flipkart.copies || 0);

    const el = document.getElementById('authorStats');
    if (el) el.innerHTML = `
      <div class="stat-card"><div class="label">Wallet Balance</div><div class="value">${IB.fmtINR(d.walletBalance)}</div><div class="change up">Min withdraw ₹${d.minWithdrawal}</div></div>
      <div class="stat-card"><div class="label">Lifetime Earnings</div><div class="value">${IB.fmtINR(d.lifetimeEarnings)}</div></div>
      <div class="stat-card"><div class="label">Copies Sold</div><div class="value">${copies}</div><div class="change up">Amazon + Flipkart</div></div>
      <div class="stat-card"><div class="label">Next Dashboard Update</div><div class="value" style="font-size:1.2rem">${d.nextDashboardUpdate}</div><div class="change">Every month 20th</div></div>`;

    const title = document.getElementById('liveBookTitle');
    if (title) title.textContent = '"' + d.bookTitle + '" is live';
    const meta = document.getElementById('liveBookMeta');
    if (meta) meta.textContent = 'ISBN ' + d.isbn + ' · Listed ' + IB.date(d.listedOn) + ' · ' + d.updateNote;

    const mini = document.getElementById('journeyMini');
    if (mini) {
      const steps = INKBRIDGE.publishingOffer.pipelineSteps;
      const cur = d.journey.currentStep;
      mini.innerHTML = `<div class="progress mb-2"><div class="progress-bar" style="width:${(cur / steps.length) * 100}%"></div></div>
        <p class="text-sm"><strong>Step ${cur}/${steps.length}:</strong> ${steps[cur - 1]?.title || 'Complete'}</p>
        <p class="text-xs text-muted mt-1">Package: ₹999 Starter · Registration ${d.registrationId}</p>`;
    }

    const notifs = document.getElementById('authorNotifPreview');
    if (notifs) {
      notifs.innerHTML = INKBRIDGE.authorDashboard.notifications.slice(0, 3).map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}">
          <span class="icon">${n.type === 'sale' ? '💰' : n.type === 'royalty' ? '🏦' : n.type === 'marketing' ? '💬' : n.type === 'review' ? '⭐' : '📦'}</span>
          <p>${n.text}</p><time>${n.time}</time>
        </div>`).join('');
    }

    const nameEl = document.getElementById('authorWelcome');
    if (nameEl) nameEl.textContent = 'Welcome back, ' + a.name.split(' ')[0];
  },

  renderJourney() {
    const d = this.getDash();
    const steps = INKBRIDGE.publishingOffer.pipelineSteps;
    const el = document.getElementById('journeyBoard');
    if (!el) return;
    el.innerHTML = `<div style="display:grid;gap:0.65rem">${steps.map(s => {
      const done = d.journey.completed.includes(s.id);
      const current = s.id === d.journey.currentStep;
      return `<div class="card card-flat" style="display:flex;gap:1rem;align-items:flex-start;border-left:4px solid ${done ? 'var(--ok)' : current ? 'var(--gold)' : 'var(--line)'}">
        <div style="width:36px;height:36px;border-radius:50%;background:${done ? 'var(--ok)' : current ? 'var(--gold)' : 'var(--cream-dark)'};color:${done || current ? '#fff' : 'var(--ink)'};display:grid;place-items:center;font-weight:700;flex-shrink:0">${done ? '✓' : s.id}</div>
        <div style="flex:1">
          <div class="flex-between"><strong>${s.title}</strong><span class="text-xs">${s.auto ? '⚡ Auto' : '👤 Manual'} · ${s.sla}</span></div>
          <p class="text-sm text-muted">${s.desc}</p>
        </div>
      </div>`;
    }).join('')}</div>`;

    const actions = document.getElementById('journeyActions');
    if (actions) {
      actions.innerHTML = `
        <h3 style="margin-bottom:0.75rem">Quick actions</h3>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
          <button class="btn btn-ghost btn-sm" onclick="AuthorPortal.navigate('upload')">Upload / re-submit manuscript</button>
          <button class="btn btn-ghost btn-sm" onclick="IB.toast('Formatting approved — moving to cover design','ok')">Approve formatting</button>
          <button class="btn btn-ghost btn-sm" onclick="IB.toast('Cover approved','ok')">Approve cover</button>
          <button class="btn btn-primary btn-sm" onclick="AuthorPortal.navigate('royaltycalc')">Royalty calc + book details</button>
          <button class="btn btn-burgundy btn-sm" onclick="AuthorPortal.navigate('salesdash')">Open sales dashboard</button>
        </div>`;
    }
  },

  runRoyaltyCalc() {
    const pages = +(document.getElementById('ac-pages')?.value || 128);
    const mrp = +(document.getElementById('ac-mrp')?.value || 199);
    const production = Math.round(pages * 0.55 + 35);
    const platform = Math.round(mrp * 0.28);
    const royalty = Math.max(15, mrp - production - platform);
    const el = document.getElementById('ac-result');
    if (el) el.innerHTML = `<div class="card card-flat" style="background:var(--cream)">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.9rem">
        <div>Production (est.)</div><strong>${IB.fmtINR(production)}</strong>
        <div>Platform / distribution</div><strong>${IB.fmtINR(platform)}</strong>
        <div>Your royalty / copy</div><strong style="color:var(--ok);font-size:1.35rem">${IB.fmtINR(royalty)}</strong>
      </div>
      <p class="text-xs text-muted" style="margin-top:0.65rem">Final price/royalty may slightly differ based on production specs — same note as your current process.</p>
    </div>`;
  },

  renderSalesDash() {
    const d = this.getDash();
    const note = document.getElementById('salesUpdateNote');
    if (note) note.textContent = d.updateNote + ' Next update: ' + d.nextDashboardUpdate;

    const stats = document.getElementById('salesDashStats');
    if (stats) {
      const copies = d.channels.amazon.copies + d.channels.flipkart.copies;
      stats.innerHTML = `
        <div class="stat-card"><div class="label">Book</div><div class="value" style="font-size:1.15rem">${d.bookTitle}</div></div>
        <div class="stat-card"><div class="label">Total Copies</div><div class="value">${copies}</div></div>
        <div class="stat-card"><div class="label">Royalty / Copy</div><div class="value">${IB.fmtINR(d.authorRoyaltyPerCopy)}</div></div>
        <div class="stat-card"><div class="label">Wallet</div><div class="value">${IB.fmtINR(d.walletBalance)}</div></div>`;
    }

    const ch = document.getElementById('salesChannels');
    if (ch) {
      ch.innerHTML = `
        <div class="sales-breakdown" style="grid-template-columns:1fr 1fr">
          <div class="sales-ch"><div class="icon">🛒</div><div class="val">${d.channels.amazon.copies}</div><div class="lbl">Amazon · ${IB.fmtINR(d.channels.amazon.amount)}</div></div>
          <div class="sales-ch"><div class="icon">🛍️</div><div class="val">${d.channels.flipkart.copies}</div><div class="lbl">Flipkart · ${IB.fmtINR(d.channels.flipkart.amount)}</div></div>
        </div>
        <p class="text-sm text-muted mt-2">MRP ${IB.fmtINR(d.mrp)} · ISBN ${d.isbn}</p>`;
    }

    const mo = document.getElementById('salesMonthly');
    if (mo) {
      mo.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th>Month</th><th>Amazon</th><th>Flipkart</th><th>Royalty</th><th>Status</th></tr></thead><tbody>
        ${d.monthly.map(m => `<tr>
          <td>${m.month}</td><td>${m.amazon}</td><td>${m.flipkart}</td>
          <td><strong>${IB.fmtINR(m.royalty)}</strong></td>
          <td>${m.status === 'paid' ? IB.statusBadge('completed') : '<span class="badge badge-warn">Updates on 20th</span>'}</td>
        </tr>`).join('')}
      </tbody></table></div>`;
    }

    const w = document.getElementById('salesWallet');
    if (w) {
      w.innerHTML = `<p>Available: <strong style="font-size:1.4rem">${IB.fmtINR(d.walletBalance)}</strong></p>
        <p class="text-sm text-muted">Lifetime: ${IB.fmtINR(d.lifetimeEarnings)} · You can withdraw anytime when balance ≥ ₹${d.minWithdrawal}</p>`;
    }
  },

  renderWithdraw() {
    const d = this.getDash();
    const box = document.getElementById('withdrawBox');
    if (box) {
      const can = d.walletBalance >= d.minWithdrawal;
      box.innerHTML = `
        <div class="stat-card mb-2" style="box-shadow:none"><div class="label">Available Balance</div><div class="value">${IB.fmtINR(d.walletBalance)}</div></div>
        <div class="form-group"><label>Amount (₹)</label><input type="number" id="wd-amt" value="${Math.min(d.walletBalance, d.walletBalance)}" min="${d.minWithdrawal}" max="${d.walletBalance}"></div>
        <div class="form-group"><label>Mode</label><select id="wd-mode"><option>UPI</option><option>Bank Transfer</option></select></div>
        <div class="form-group"><label>UPI / Account</label><input value="ananya@upi"></div>
        <button class="btn btn-burgundy" ${can ? '' : 'disabled style="opacity:.5"'} onclick="AuthorPortal.doWithdraw()">
          ${can ? '<i class="fa-solid fa-wallet"></i> Request Withdrawal' : 'Need ₹' + d.minWithdrawal + ' minimum'}
        </button>`;
    }
    const hist = document.getElementById('withdrawHistory');
    if (hist) {
      hist.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>Date</th><th>Amount</th><th>Mode</th><th>Status</th></tr></thead><tbody>
        ${d.withdrawals.map(w => `<tr><td>${w.id}</td><td>${IB.date(w.date)}</td><td>${IB.fmtINR(w.amount)}</td><td>${w.mode}</td><td>${IB.statusBadge(w.status === 'completed' ? 'delivered' : w.status)}</td></tr>`).join('')}
      </tbody></table></div>`;
    }
  },

  doWithdraw() {
    const d = this.getDash();
    const amt = +(document.getElementById('wd-amt')?.value || 0);
    if (amt < d.minWithdrawal) { IB.toast('Minimum withdrawal is ₹' + d.minWithdrawal, 'warn'); return; }
    if (amt > d.walletBalance) { IB.toast('Amount exceeds wallet balance', 'warn'); return; }
    IB.confirm('Confirm Withdrawal', 'Withdraw ' + IB.fmtINR(amt) + ' to your account?', () => {
      d.walletBalance -= amt;
      d.withdrawals.unshift({ id: 'WD-' + Math.floor(10 + Math.random() * 90), date: new Date().toISOString().slice(0, 10), amount: amt, status: 'completed', mode: document.getElementById('wd-mode')?.value || 'UPI' });
      IB.toast('Withdrawal of ' + IB.fmtINR(amt) + ' initiated', 'ok');
      this.renderWithdraw();
      this.renderSalesDash();
      this.renderOverview();
    });
  },

  renderBooks() {
    const books = this.getMyBooks();
    const el = document.getElementById('myBooksGrid');
    if (!el) return;
    if (!books.length) {
      el.innerHTML = '<div class="empty-state"><div class="icon">📖</div><h3>No published books yet</h3><p>Upload a manuscript to get started</p></div>';
      return;
    }
    el.innerHTML = books.map(b => {
      const total = Object.values(b.sales).reduce((s, v) => s + v, 0);
      return `<div class="card card-hover">
        <div style="font-size:3rem;text-align:center;margin-bottom:0.75rem">${b.cover}</div>
        <h3 style="font-size:1.1rem;margin-bottom:0.25rem">${b.title}</h3>
        <p class="text-sm text-muted">${b.genre} · ${b.isbn}</p>
        <div class="sales-breakdown" style="grid-template-columns:repeat(2,1fr);margin-top:1rem">
          <div class="sales-ch"><div class="val">${IB.fmtNum(total)}</div><div class="lbl">Total Sales</div></div>
          <div class="sales-ch"><div class="val">${IB.stars(b.rating)}</div><div class="lbl">${b.reviews} reviews</div></div>
        </div>
        <div style="margin-top:1rem;display:flex;gap:0.5rem">
          <button class="btn btn-ghost btn-sm" onclick="AuthorPortal.viewBookSales(${b.id})">Sales Breakdown</button>
          ${IB.statusBadge(b.status)}
        </div>
      </div>`;
    }).join('');

    const ms = INKBRIDGE.manuscripts.filter(m => m.authorId === this.authorId);
    const msEl = document.getElementById('myManuscripts');
    if (msEl) {
      msEl.innerHTML = ms.length ? ms.map(m => `<div class="card card-flat" style="margin-bottom:0.75rem">
        <div class="flex-between"><strong>${m.title}</strong>${IB.statusBadge(m.status)}</div>
        <p class="text-sm text-muted">${m.stage} · Submitted ${IB.date(m.submitted)}</p>
        <div class="progress mt-1"><div class="progress-bar" style="width:${({ submitted: 20, review: 40, editing: 60, design: 80, isbn: 95 })[m.status] || 10}%"></div></div>
      </div>`).join('') : '<p class="text-muted text-sm">No manuscripts in pipeline</p>';
    }
  },

  viewBookSales(id) {
    const b = IB.getBook(id);
    if (!b) return;
    IB.modal('Sales: ' + b.title, `
      <div class="sales-breakdown">
        <div class="sales-ch"><div class="icon">🌐</div><div class="val">${IB.fmtNum(b.sales.website)}</div><div class="lbl">Website</div></div>
        <div class="sales-ch"><div class="icon">🛒</div><div class="val">${IB.fmtNum(b.sales.amazon)}</div><div class="lbl">Amazon</div></div>
        <div class="sales-ch"><div class="icon">🛍️</div><div class="val">${IB.fmtNum(b.sales.flipkart)}</div><div class="lbl">Flipkart</div></div>
        <div class="sales-ch"><div class="icon">📱</div><div class="val">${IB.fmtNum(b.sales.kindle)}</div><div class="lbl">Kindle</div></div>
      </div>
      <p style="margin-top:1rem;text-align:center;font-weight:600">Total: ${IB.fmtNum(Object.values(b.sales).reduce((s,v)=>s+v,0))} copies sold</p>`,
      '<button class="btn btn-primary" onclick="IB.closeModal()">Close</button>'
    );
  },

  renderOrders() {
    const orders = this.getMyOrders();
    const el = document.getElementById('authorOrdersTable');
    if (!el) return;
    el.innerHTML = orders.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Order</th><th>Date</th><th>Channel</th><th>My Books in Order</th><th>Qty</th><th>Status</th></tr></thead><tbody>
      ${orders.map(o => {
        const myItems = o.items.filter(i => { const b = IB.getBook(i.bookId); return b && b.authorId === this.authorId; });
        return `<tr onclick="AuthorPortal.viewOrder('${o.id}')" style="cursor:pointer">
          <td><strong>${o.id}</strong></td><td>${IB.date(o.date)}</td>
          <td><span class="channel channel-${o.channel}">${IB.channelIcon(o.channel)} ${IB.channelLabel(o.channel)}</span></td>
          <td>${myItems.map(i => i.title).join(', ')}</td>
          <td>${myItems.reduce((s, i) => s + i.qty, 0)}</td><td>${IB.statusBadge(o.status)}</td>
        </tr>`;
      }).join('')}
    </tbody></table></div>` : '<div class="empty-state"><div class="icon">📦</div><h3>No orders yet</h3><p>Orders containing your books will appear here</p></div>';
  },

  viewOrder(id) {
    const o = INKBRIDGE.orders.find(x => x.id === id);
    if (!o) return;
    const myItems = o.items.filter(i => { const b = IB.getBook(i.bookId); return b && b.authorId === this.authorId; });
    IB.modal('Order ' + o.id, `
      <p class="text-sm text-muted">This order is visible to you because it contains your book(s).</p>
      <dl class="book-detail-meta" style="margin-top:1rem">
        <dt>Date</dt><dd>${IB.date(o.date)}</dd>
        <dt>Channel</dt><dd>${IB.channelIcon(o.channel)} ${IB.channelLabel(o.channel)}</dd>
        <dt>Status</dt><dd>${IB.statusBadge(o.status)}</dd>
      </dl>
      <h4 style="margin:1rem 0 0.5rem">Your Books in This Order</h4>
      <ul>${myItems.map(i => '<li>' + i.title + ' × ' + i.qty + '</li>').join('')}</ul>`,
      '<button class="btn btn-primary" onclick="IB.closeModal()">Close</button>'
    );
  },

  renderSales() {
    const books = this.getMyBooks();
    const el = document.getElementById('salesAnalytics');
    if (!el || !books.length) return;
    const totals = { website: 0, amazon: 0, flipkart: 0, kindle: 0 };
    books.forEach(b => Object.keys(totals).forEach(k => totals[k] += b.sales[k] || 0));
    const grand = Object.values(totals).reduce((s, v) => s + v, 0);
    el.innerHTML = `
      <div class="sales-breakdown">
        <div class="sales-ch"><div class="icon">🌐</div><div class="val">${IB.fmtNum(totals.website)}</div><div class="lbl">Website (${Math.round(totals.website / grand * 100)}%)</div></div>
        <div class="sales-ch"><div class="icon">🛒</div><div class="val">${IB.fmtNum(totals.amazon)}</div><div class="lbl">Amazon (${Math.round(totals.amazon / grand * 100)}%)</div></div>
        <div class="sales-ch"><div class="icon">🛍️</div><div class="val">${IB.fmtNum(totals.flipkart)}</div><div class="lbl">Flipkart (${Math.round(totals.flipkart / grand * 100)}%)</div></div>
        <div class="sales-ch"><div class="icon">📱</div><div class="val">${IB.fmtNum(totals.kindle)}</div><div class="lbl">Kindle (${Math.round(totals.kindle / grand * 100)}%)</div></div>
      </div>
      <div class="card mt-2"><h3 style="margin-bottom:1rem">Book-wise Performance</h3>
        ${books.map(b => {
          const t = Object.values(b.sales).reduce((s, v) => s + v, 0);
          return `<div style="margin-bottom:0.75rem"><div class="flex-between text-sm"><span>${b.title}</span><strong>${IB.fmtNum(t)} copies</strong></div>
            <div class="progress"><div class="progress-bar" style="width:${t / grand * 100}%"></div></div></div>`;
        }).join('')}
      </div>`;
  },

  renderRoyalties() {
    const a = this.getAuthor();
    const el = document.getElementById('royaltyDetails');
    if (!el) return;
    el.innerHTML = `
      <div class="stat-grid mb-2">
        <div class="stat-card"><div class="label">Royalty Rate</div><div class="value">${a.royalty}%</div></div>
        <div class="stat-card"><div class="label">Pending Payout</div><div class="value">${IB.fmt(a.pendingPayout)}</div></div>
        <div class="stat-card"><div class="label">Next Payout Date</div><div class="value" style="font-size:1.3rem">Dec 1, 2025</div></div>
        <div class="stat-card"><div class="label">Lifetime Earnings</div><div class="value">${IB.fmt(a.pendingPayout + 142600)}</div></div>
      </div>
      <div class="card"><h3 style="margin-bottom:1rem">Payout History</h3>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Period</th><th>Amount</th><th>Status</th></tr></thead><tbody>
          <tr><td>Oct 1, 2025</td><td>Sep 2025</td><td>${IB.fmt(32100)}</td><td>${IB.statusBadge('delivered')}</td></tr>
          <tr><td>Sep 1, 2025</td><td>Aug 2025</td><td>${IB.fmt(28700)}</td><td>${IB.statusBadge('delivered')}</td></tr>
          <tr><td>Aug 1, 2025</td><td>Jul 2025</td><td>${IB.fmt(31200)}</td><td>${IB.statusBadge('delivered')}</td></tr>
          <tr><td>Dec 1, 2025</td><td>Nov 2025</td><td>${IB.fmt(a.pendingPayout)}</td><td>${IB.statusBadge('pending')}</td></tr>
        </tbody></table></div>
      </div>`;
  },

  renderNotifications() {
    const el = document.getElementById('notifList');
    if (!el) return;
    el.innerHTML = INKBRIDGE.authorDashboard.notifications.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" onclick="AuthorPortal.markRead(${n.id})">
        <span class="icon">${n.type === 'sale' ? '💰' : n.type === 'royalty' ? '🏦' : n.type === 'marketing' ? '💬' : n.type === 'review' ? '⭐' : '📦'}</span>
        <p>${n.text}</p><time>${n.time}</time>
      </div>`).join('');
  },

  markRead(id) {
    const n = INKBRIDGE.authorDashboard.notifications.find(x => x.id === id);
    if (n) { n.read = true; this.renderNotifications(); this.renderOverview(); }
  },

  renderProfile() {
    const a = this.getAuthor();
    const el = document.getElementById('profileForm');
    if (!el) return;
    el.innerHTML = `
      <div class="card" style="max-width:600px">
        <div class="flex gap-2" style="align-items:center;margin-bottom:1.5rem">
          <div class="avatar avatar-lg">${a.avatar}</div>
          <div><h3>${a.name}</h3><p class="text-muted">${a.email}</p></div>
        </div>
        <div class="form-row"><div class="form-group"><label>Full Name</label><input value="${a.name}"></div>
        <div class="form-group"><label>Phone</label><input value="${a.phone}"></div></div>
        <div class="form-group"><label>Email</label><input value="${a.email}"></div>
        <div class="form-group"><label>City</label><input value="${a.city}"></div>
        <div class="form-group"><label>Bio</label><textarea rows="3">${a.bio}</textarea></div>
        <div class="form-group"><label>Bank Account (for royalties)</label><input value="HDFC ****4521"></div>
        <button class="btn btn-primary" onclick="IB.toast('Profile updated successfully','ok')"><i class="fa-solid fa-save"></i> Save Changes</button>
      </div>`;
  },

  setupUpload() {
    const zone = document.getElementById('uploadZone');
    if (!zone) return;
    zone.onclick = () => document.getElementById('fileInput')?.click();
    zone.ondragover = (e) => { e.preventDefault(); zone.classList.add('dragover'); };
    zone.ondragleave = () => zone.classList.remove('dragover');
    zone.ondrop = (e) => { e.preventDefault(); zone.classList.remove('dragover'); this.handleUpload(e.dataTransfer.files[0]); };
    document.getElementById('fileInput')?.addEventListener('change', (e) => this.handleUpload(e.target.files[0]));
    document.getElementById('uploadForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      IB.toast('Manuscript submitted for review!', 'ok');
      IB.modal('Manuscript Submitted', '<p>Your manuscript has been submitted to Bookspot Publishers for editorial review. You will receive feedback within 14 business days.</p><p class="text-sm text-muted" style="margin-top:0.75rem">Track progress in My Books → Manuscripts in Pipeline.</p>', '<button class="btn btn-primary" onclick="IB.closeModal();AuthorPortal.navigate(\'books\')">View My Books</button>');
    });
  },

  handleUpload(file) {
    if (!file) return;
    const zone = document.getElementById('uploadZone');
    if (zone) zone.innerHTML = `<div class="icon">✅</div><p><strong>${file.name}</strong> (${(file.size / 1024 / 1024).toFixed(1)} MB)</p><p class="text-sm">Click to change file</p>`;
    IB.toast('File uploaded: ' + file.name, 'ok');
  },

  setupISBN() {
    document.getElementById('isbnForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      IB.toast('ISBN request submitted to RRRLF agency', 'ok');
      IB.modal('ISBN Request Submitted', '<p>Your ISBN application has been submitted to the Raja Rammohun Roy National Agency. Expected processing time: 4–6 weeks.</p><p class="text-sm text-muted" style="margin-top:0.75rem">You can track status in the ISBN Request section.</p>', '<button class="btn btn-primary" onclick="IB.closeModal()">Got it</button>');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AuthorPortal.init();
  AuthorPortal.setupUpload();
  AuthorPortal.setupISBN?.();
  document.getElementById('bookDetailsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    IB.toast('Book details submitted for Amazon / Flipkart listing', 'ok');
    IB.modal('Details Received', '<p>Your book details will be used directly for eCommerce listing. Royalty is based on final page count & specs.</p>', '<button class="btn btn-primary" onclick="IB.closeModal();AuthorPortal.navigate(\'journey\')">Back to Journey</button>');
  });
});
