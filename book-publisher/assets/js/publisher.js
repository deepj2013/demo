/* Publisher Dashboard JS */
const PublisherDash = {
  view: 'overview',
  orderFilter: 'all',

  init() {
    this.bindNav();
    this.renderAll();
    if (location.hash === '#integrations') this.navigate('integrations');
    if (location.hash === '#presence') this.navigate('presence');
    if (location.hash === '#registrations') this.navigate('registrations');
    if (location.hash === '#whatsapp') this.navigate('whatsapp');
    if (location.hash === '#automations') this.navigate('automations');
    if (location.hash === '#social') this.navigate('social');
    if (location.hash === '#operations') this.navigate('operations');
  },

  bindNav() {
    document.querySelectorAll('.dash-nav-item').forEach(item => {
      item.onclick = () => this.navigate(item.dataset.view);
    });
    document.querySelector('.sidebar-toggle')?.addEventListener('click', () => {
      document.querySelector('.dash-sidebar')?.classList.toggle('open');
    });
  },

  navigate(view) {
    this.view = view;
    document.querySelectorAll('.dash-nav-item').forEach(i => i.classList.toggle('active', i.dataset.view === view));
    document.querySelectorAll('.dash-view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
    const titles = {
      overview: 'Dashboard Overview', authors: 'Authors', manuscripts: 'Manuscript Pipeline',
      isbn: 'ISBN Registration', orders: 'Unified Orders', integrations: 'Integrations',
      registrations: 'Offer Registrations',
      whatsapp: 'WhatsApp Marketing', social: 'Social Media', presence: 'Digital Presence',
      operations: 'Business Operations (SOPs)',
      automations: 'Automations', royalties: 'Royalties & Payouts', reports: 'Reports', settings: 'Settings'
    };
    const h = document.getElementById('pageTitle');
    if (h) h.textContent = titles[view] || view;
    if (view === 'reports') this.renderChart('salesChartReports');
    if (view === 'overview') this.renderChart('salesChartOverview');
  },

  renderAll() {
    this.renderOverview();
    this.renderAuthors();
    this.renderRegistrations();
    this.renderManuscripts();
    this.renderISBN();
    this.renderOrders();
    this.renderIntegrations();
    this.renderWhatsApp();
    this.renderSocial();
    this.renderPresence();
    this.renderOperations();
    this.renderAutomations();
    this.renderRoyalties();
    this.renderChart('salesChartOverview');
  },

  renderOverview() {
    const s = INKBRIDGE.publisherStats;
    const revCh = IB.pctChange(s.revenueMonth, s.revenuePrev);
    const ordCh = IB.pctChange(s.ordersMonth, s.ordersPrev);
    const el = document.getElementById('overviewStats');
    if (!el) return;
    el.innerHTML = `
      <div class="stat-card"><div class="label">Revenue (Nov)</div><div class="value">${IB.fmt(s.revenueMonth)}</div><div class="change ${revCh.up ? 'up' : 'down'}">${revCh.up ? '↑' : '↓'} ${revCh.val}% vs last month</div></div>
      <div class="stat-card"><div class="label">Orders (Nov)</div><div class="value">${IB.fmtNum(s.ordersMonth)}</div><div class="change ${ordCh.up ? 'up' : 'down'}">${ordCh.up ? '↑' : '↓'} ${ordCh.val}% vs last month</div></div>
      <div class="stat-card"><div class="label">WhatsApp Sent (Nov)</div><div class="value">${IB.fmtNum(s.whatsappSent)}</div><div class="change up">${s.whatsappConversions} conversions</div></div>
      <div class="stat-card"><div class="label">Automations Run</div><div class="value">${s.automationsRun}</div><div class="change up">Today · 90%+ tasks automated</div></div>`;

    const recent = document.getElementById('recentOrders');
    if (recent) {
      recent.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th>Order</th><th>Date</th><th>Channel</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>
        ${INKBRIDGE.orders.slice(0, 5).map(o => `<tr style="cursor:pointer" onclick="PublisherDash.showOrder('${o.id}')">
          <td><strong>${o.id}</strong></td><td>${IB.date(o.date)}</td>
          <td><span class="channel channel-${o.channel}">${IB.channelIcon(o.channel)} ${IB.channelLabel(o.channel)}</span></td>
          <td>${o.customer}</td><td>${IB.fmt(o.total)}</td><td>${IB.statusBadge(o.status)}</td>
        </tr>`).join('')}
      </tbody></table></div>`;
    }
  },

  renderRegistrations() {
    const regs = INKBRIDGE.publishRegistrations || [];
    const o = INKBRIDGE.publishingOffer;
    const stats = document.getElementById('regStats');
    if (stats) {
      const paid = regs.filter(r => r.paid).length;
      const live = regs.filter(r => r.stage === 'live').length;
      const revenue = regs.filter(r => r.paid).reduce((s, r) => s + r.amount, 0);
      stats.innerHTML = `
        <div class="stat-card"><div class="label">Slots Left</div><div class="value">${o.slotsLeft}<span style="font-size:1rem;color:var(--muted)">/${o.slotsTotal}</span></div></div>
        <div class="stat-card"><div class="label">Paid Registrations</div><div class="value">${paid}</div></div>
        <div class="stat-card"><div class="label">Books Live</div><div class="value">${live}</div></div>
        <div class="stat-card"><div class="label">Offer Revenue</div><div class="value" style="font-size:1.4rem">${IB.fmtINR(revenue)}</div></div>`;
    }

    const tabs = document.getElementById('regTabs');
    if (tabs && !tabs.dataset.bound) {
      tabs.dataset.bound = '1';
      const stages = ['all', 'registration', 'manuscript', 'formatting', 'cover', 'listing', 'live'];
      tabs.innerHTML = stages.map(s => `<button class="tab ${s === 'all' ? 'active' : ''}" data-stage="${s}">${s === 'all' ? 'All' : s}</button>`).join('');
      tabs.querySelectorAll('.tab').forEach(t => t.onclick = () => {
        tabs.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        this.regFilter = t.dataset.stage;
        this.renderRegTable();
      });
    }
    this.regFilter = this.regFilter || 'all';
    this.renderRegTable();
  },

  renderRegTable() {
    const el = document.getElementById('regTable');
    if (!el) return;
    let regs = INKBRIDGE.publishRegistrations || [];
    if (this.regFilter && this.regFilter !== 'all') regs = regs.filter(r => r.stage === this.regFilter);
    const pkgName = id => (INKBRIDGE.publishingOffer.packages.find(p => p.id === id) || {}).name || id;
    el.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr>
      <th>Reg ID</th><th>Author</th><th>Book / Genre</th><th>Pages</th><th>Package</th><th>Paid</th><th>Stage</th><th>Actions</th>
    </tr></thead><tbody>
      ${regs.map(r => `<tr>
        <td><strong>${r.id}</strong></td>
        <td>${r.author}<br><span class="text-xs text-muted">${r.email}</span></td>
        <td>${r.bookTitle || '—'}<br><span class="text-xs text-muted">${r.genre}</span></td>
        <td>${r.pages}</td>
        <td>${pkgName(r.packageId)}<br><span class="text-xs">${IB.fmtINR(r.amount)}</span></td>
        <td>${r.paid ? IB.statusBadge('completed') : IB.statusBadge('pending')}</td>
        <td>${IB.statusBadge(r.stage === 'live' ? 'published' : r.stage === 'formatting' || r.stage === 'cover' ? 'processing' : r.stage === 'listing' ? 'review' : 'pending')}</td>
        <td class="action-btns">
          <button class="btn btn-ghost btn-sm" onclick="PublisherDash.viewReg('${r.id}')">View</button>
          ${r.stage !== 'live' && r.paid ? `<button class="btn btn-primary btn-sm" onclick="PublisherDash.advanceReg('${r.id}')">Advance</button>` : ''}
        </td>
      </tr>`).join('')}
    </tbody></table></div>`;
  },

  viewReg(id) {
    const r = INKBRIDGE.publishRegistrations.find(x => x.id === id);
    if (!r) return;
    const steps = INKBRIDGE.publishingOffer.pipelineSteps;
    const stageIdx = { registration: 1, manuscript: 2, formatting: 3, cover: 5, listing: 8, live: 9 }[r.stage] || 1;
    IB.modal(r.id + ' — ' + (r.bookTitle || r.author), `
      <dl class="book-detail-meta">
        <dt>Author</dt><dd>${r.author}</dd>
        <dt>Contact</dt><dd>${r.email} · ${r.phone}</dd>
        <dt>Pages / Genre</dt><dd>${r.pages} · ${r.genre}</dd>
        <dt>Payment</dt><dd>${r.paid ? IB.fmtINR(r.amount) + ' on ' + (r.paidAt ? IB.date(r.paidAt) : '—') : 'Unpaid'}</dd>
        <dt>Stage</dt><dd>${r.stage}</dd>
        <dt>Submitted</dt><dd>${r.submittedAt ? IB.date(r.submittedAt) : 'Awaiting manuscript'}</dd>
        <dt>Listed</dt><dd>${r.listedAt ? IB.date(r.listedAt) : '—'}</dd>
      </dl>
      <p class="text-sm text-muted" style="margin-top:0.75rem">Pipeline step ~${stageIdx}/${steps.length}</p>`,
      `<button class="btn btn-ghost" onclick="IB.closeModal()">Close</button>
       ${r.paid && r.stage !== 'live' ? `<button class="btn btn-primary" onclick="PublisherDash.advanceReg('${r.id}');IB.closeModal()">Advance Stage</button>` : ''}
       ${r.stage === 'live' ? `<a class="btn btn-gold" href="../author/index.html#salesdash">Author Sales Dashboard</a>` : ''}`
    );
  },

  advanceReg(id) {
    const r = INKBRIDGE.publishRegistrations.find(x => x.id === id);
    if (!r) return;
    const order = ['registration', 'manuscript', 'formatting', 'cover', 'listing', 'live'];
    const i = order.indexOf(r.stage);
    if (i < order.length - 1) {
      r.stage = order[i + 1];
      if (r.stage === 'manuscript' && !r.submittedAt) r.submittedAt = new Date().toISOString().slice(0, 10);
      if (r.stage === 'live') r.listedAt = new Date().toISOString().slice(0, 10);
      this.renderRegistrations();
      IB.toast(r.id + ' → ' + r.stage, 'ok');
    }
  },

  renderAuthors() {
    const el = document.getElementById('authorsTable');
    if (!el) return;
    el.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th>Author</th><th>City</th><th>Books</th><th>Total Sales</th><th>Royalty %</th><th>Pending Payout</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      ${INKBRIDGE.authors.map(a => `<tr>
        <td><div class="flex gap-1" style="align-items:center"><div class="avatar avatar-sm">${a.avatar}</div><div><strong>${a.name}</strong><br><span class="text-xs text-muted">${a.email}</span></div></div></td>
        <td>${a.city}</td><td>${a.books}</td><td>${IB.fmtNum(a.totalSales)}</td><td>${a.royalty}%</td><td>${IB.fmt(a.pendingPayout)}</td>
        <td>${IB.statusBadge(a.status)}</td>
        <td class="action-btns">
          <button class="btn btn-ghost btn-sm" onclick="PublisherDash.viewAuthor(${a.id})">View</button>
          ${a.status === 'pending' ? '<button class="btn btn-primary btn-sm" onclick="PublisherDash.approveAuthor(' + a.id + ')">Approve</button>' : ''}
          ${a.status === 'review' ? '<button class="btn btn-gold btn-sm" onclick="PublisherDash.approveAuthor(' + a.id + ')">Approve</button>' : ''}
        </td>
      </tr>`).join('')}
    </tbody></table></div>`;
  },

  viewAuthor(id) {
    const a = IB.getAuthor(id);
    if (!a) return;
    const books = INKBRIDGE.books.filter(b => b.authorId === id);
    IB.modal(a.name, `
      <div class="flex gap-2" style="align-items:center;margin-bottom:1rem">
        <div class="avatar avatar-lg">${a.avatar}</div>
        <div><strong>${a.name}</strong><br><span class="text-muted">${a.city} · Joined ${IB.date(a.joined)}</span></div>
      </div>
      <p>${a.bio}</p>
      <dl class="book-detail-meta" style="margin-top:1rem">
        <dt>Email</dt><dd>${a.email}</dd><dt>Phone</dt><dd>${a.phone}</dd>
        <dt>Royalty Rate</dt><dd>${a.royalty}%</dd><dt>Total Sales</dt><dd>${IB.fmtNum(a.totalSales)} units</dd>
        <dt>Pending Payout</dt><dd>${IB.fmt(a.pendingPayout)}</dd>
      </dl>
      ${books.length ? '<h4 style="margin-top:1rem">Published Books</h4><ul>' + books.map(b => '<li>' + b.title + ' — ' + IB.fmt(b.price) + '</li>').join('') + '</ul>' : ''}`,
      '<button class="btn btn-ghost" onclick="IB.closeModal()">Close</button><button class="btn btn-primary" onclick="IB.toast(\'Message sent to ' + a.name + '\',\'ok\');IB.closeModal()"><i class="fa-solid fa-envelope"></i> Message Author</button>'
    );
  },

  approveAuthor(id) {
    IB.confirm('Approve Author', 'Approve this author and send portal login credentials?', () => {
      const a = INKBRIDGE.authors.find(x => x.id === id);
      if (a) { a.status = 'active'; this.renderAuthors(); IB.toast(a.name + ' approved! Login credentials sent.', 'ok'); }
    });
  },

  renderManuscripts() {
    const stages = {
      submitted: { label: 'Submitted', items: [] },
      review: { label: 'Editorial Review', items: [] },
      editing: { label: 'Copy Editing', items: [] },
      design: { label: 'Cover Design', items: [] },
      isbn: { label: 'ISBN Registration', items: [] }
    };
    INKBRIDGE.manuscripts.forEach(m => { if (stages[m.status]) stages[m.status].items.push(m); });
    const el = document.getElementById('pipelineBoard');
    if (!el) return;
    el.innerHTML = Object.entries(stages).map(([key, stage]) => `
      <div class="pipeline-col">
        <h4>${stage.label} <span class="count">${stage.items.length}</span></h4>
        ${stage.items.map(m => `<div class="pipeline-card" onclick="PublisherDash.viewManuscript(${m.id})">
          <h5>${m.title}</h5><p>${m.author} · ${m.genre}</p><p>${m.pages} pages · ${IB.date(m.submitted)}</p>
        </div>`).join('') || '<p class="text-xs text-muted">No manuscripts</p>'}
      </div>`).join('');
  },

  viewManuscript(id) {
    const m = INKBRIDGE.manuscripts.find(x => x.id === id);
    if (!m) return;
    const stages = ['submitted', 'review', 'editing', 'design', 'isbn'];
    const idx = stages.indexOf(m.status);
    IB.modal(m.title, `
      <p><strong>Author:</strong> ${m.author} · <strong>Genre:</strong> ${m.genre}</p>
      <p style="margin-top:0.5rem"><strong>Stage:</strong> ${m.stage} · ${m.pages} pages · Format: ${m.format.toUpperCase()}</p>
      <div class="stage-track" style="margin:1.5rem 0">
        ${stages.map((s, i) => `<div class="stage-step ${i < idx ? 'done' : i === idx ? 'current' : ''}"><div class="stage-dot">${i + 1}</div><h5>${s}</h5></div>`).join('')}
      </div>`,
      `<button class="btn btn-ghost" onclick="IB.closeModal()">Close</button>
       ${idx < stages.length - 1 ? '<button class="btn btn-primary" onclick="PublisherDash.advanceManuscript(' + id + ')">Advance to Next Stage</button>' : ''}
       <button class="btn btn-gold" onclick="IB.toast(\'Download started\',\'ok\');IB.closeModal()"><i class="fa-solid fa-download"></i> Download</button>`
    );
  },

  advanceManuscript(id) {
    const m = INKBRIDGE.manuscripts.find(x => x.id === id);
    const stages = ['submitted', 'review', 'editing', 'design', 'isbn'];
    const idx = stages.indexOf(m.status);
    if (idx < stages.length - 1) {
      m.status = stages[idx + 1];
      m.stage = { review: 'Editorial Review', editing: 'Copy Editing', design: 'Cover Design', isbn: 'ISBN Registration' }[m.status] || m.stage;
      IB.closeModal();
      this.renderManuscripts();
      IB.toast('"' + m.title + '" moved to ' + m.stage, 'ok');
    }
  },

  renderISBN() {
    const el = document.getElementById('isbnTable');
    if (!el) return;
    el.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th>Request ID</th><th>Book</th><th>Author</th><th>Submitted</th><th>Agency</th><th>Expected</th><th>ISBN</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      ${INKBRIDGE.isbnRequests.map(r => `<tr>
        <td><strong>${r.id}</strong></td><td>${r.bookTitle}</td><td>${r.author}</td><td>${IB.date(r.submitted)}</td>
        <td class="text-sm">${r.agency}</td><td>${r.expectedDate ? IB.date(r.expectedDate) : '—'}</td>
        <td>${r.isbn || '—'}</td><td>${IB.statusBadge(r.status)}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="PublisherDash.newISBN()">Track</button></td>
      </tr>`).join('')}
    </tbody></table></div>
      <div style="margin-top:1rem"><button class="btn btn-primary" onclick="PublisherDash.newISBN()"><i class="fa-solid fa-plus"></i> New ISBN Request</button></div>`;
  },

  newISBN() {
    IB.modal('New ISBN Request', `
      <div class="form-group"><label>Book Title</label><input id="isbn-title" placeholder="Enter book title"></div>
      <div class="form-group"><label>Author</label><select id="isbn-author">${INKBRIDGE.authors.filter(a => a.status === 'active').map(a => '<option>' + a.name + '</option>').join('')}</select></div>
      <div class="form-group"><label>Format</label><select><option>Paperback</option><option>Hardcover</option><option>eBook</option></select></div>
      <div class="form-group"><label>Agency</label><input value="Raja Rammohun Roy National Agency" readonly></div>`,
      '<button class="btn btn-ghost" onclick="IB.closeModal()">Cancel</button><button class="btn btn-primary" onclick="IB.toast(\'ISBN request submitted to RRRLF\',\'ok\');IB.closeModal()">Submit Request</button>'
    );
  },

  renderOrders() {
    const tabs = document.getElementById('orderTabs');
    if (tabs && !tabs.dataset.bound) {
      tabs.dataset.bound = '1';
      tabs.innerHTML = ['all', 'website', 'amazon', 'flipkart', 'kindle'].map(ch =>
        `<button class="tab ${ch === 'all' ? 'active' : ''}" data-ch="${ch}">${ch === 'all' ? 'All Channels' : IB.channelLabel(ch)}</button>`
      ).join('');
      tabs.querySelectorAll('.tab').forEach(t => t.onclick = () => {
        tabs.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        this.orderFilter = t.dataset.ch;
        this.renderOrdersTable();
      });
    }
    this.renderOrdersTable();
  },

  renderOrdersTable() {
    const el = document.getElementById('ordersTable');
    if (!el) return;
    const orders = this.orderFilter === 'all' ? INKBRIDGE.orders : INKBRIDGE.orders.filter(o => o.channel === this.orderFilter);
    el.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th>Order ID</th><th>Date</th><th>Channel</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      ${orders.map(o => `<tr>
        <td><strong>${o.id}</strong></td><td>${IB.date(o.date)}</td>
        <td><span class="channel channel-${o.channel}">${IB.channelIcon(o.channel)} ${IB.channelLabel(o.channel)}</span></td>
        <td>${o.customer}</td><td>${o.items.length} item${o.items.length > 1 ? 's' : ''}</td>
        <td><strong>${IB.fmt(o.total)}</strong></td><td>${IB.statusBadge(o.status)}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="PublisherDash.showOrder('${o.id}')">View</button></td>
      </tr>`).join('')}
    </tbody></table></div>`;
  },

  showOrder(id) {
    const o = INKBRIDGE.orders.find(x => x.id === id);
    if (!o) return;
    IB.modal('Order ' + o.id, `
      <dl class="book-detail-meta">
        <dt>Date</dt><dd>${IB.date(o.date)}</dd>
        <dt>Channel</dt><dd>${IB.channelIcon(o.channel)} ${IB.channelLabel(o.channel)}</dd>
        <dt>Customer</dt><dd>${o.customer} (${o.email})</dd>
        <dt>Status</dt><dd>${IB.statusBadge(o.status)}</dd>
        <dt>Tracking</dt><dd>${o.tracking || 'Not yet assigned'}</dd>
      </dl>
      <h4 style="margin:1rem 0 0.5rem">Items</h4>
      <ul>${o.items.map(i => '<li>' + i.title + ' × ' + i.qty + ' — ' + IB.fmt(i.price * i.qty) + '</li>').join('')}</ul>
      <p style="margin-top:1rem;font-weight:700">Total: ${IB.fmt(o.total)}</p>
      <p class="text-sm text-muted" style="margin-top:0.5rem">Visible to authors: ${o.authorIds.map(id => IB.getAuthor(id)?.name).filter(Boolean).join(', ')}</p>`,
      `<button class="btn btn-ghost" onclick="IB.closeModal()">Close</button>
       ${o.status === 'pending' ? '<button class="btn btn-primary" onclick="IB.toast(\'Order marked as processing\',\'ok\');IB.closeModal()">Process Order</button>' : ''}
       ${o.status === 'processing' ? '<button class="btn btn-gold" onclick="IB.toast(\'Shipment created via Shiprocket\',\'ok\');IB.closeModal()">Ship Order</button>' : ''}`
    );
  },

  renderIntegrations() {
    const el = document.getElementById('integGrid');
    if (!el) return;
    el.innerHTML = INKBRIDGE.integrations.map(i => `
      <div class="integ-card">
        <div class="integ-card-header">
          <span class="icon">${i.icon}</span>
          <h3>${i.name}</h3>
          ${IB.statusBadge(i.status)}
        </div>
        ${i.status === 'connected' ? `
          <div class="integ-stat"><span>Last Sync</span><span>${i.lastSync}</span></div>
          <div class="integ-stat"><span>Orders Today</span><span>${i.ordersToday}</span></div>
          <div class="integ-stat"><span>Revenue Today</span><span>${IB.fmt(i.revenue)}</span></div>
          <div class="integ-stat"><span>API Key</span><span>${i.apiKey}</span></div>
          <div style="margin-top:1rem;display:flex;gap:0.5rem">
            <button class="btn btn-ghost btn-sm" onclick="PublisherDash.syncInteg('${i.id}')"><i class="fa-solid fa-rotate"></i> Sync Now</button>
            <button class="btn btn-ghost btn-sm" onclick="IB.toast('Settings opened','ok')">Settings</button>
          </div>` : `
          <p class="text-sm text-muted" style="margin-bottom:1rem">Connect to sync orders automatically</p>
          <button class="btn btn-primary btn-sm" onclick="PublisherDash.connectInteg('${i.id}')"><i class="fa-solid fa-plug"></i> Connect</button>`}
      </div>`).join('');
  },

  syncInteg(id) {
    const i = INKBRIDGE.integrations.find(x => x.id === id);
    if (i) { i.lastSync = 'Just now'; IB.toast(i.name + ' synced — ' + i.ordersToday + ' orders imported', 'ok'); this.renderIntegrations(); }
  },

  connectInteg(id) {
    IB.modal('Connect ' + INKBRIDGE.integrations.find(x => x.id === id)?.name, `
      <div class="form-group"><label>API Key / Seller ID</label><input placeholder="Enter your API credentials"></div>
      <div class="form-group"><label>Secret Key</label><input type="password" placeholder="Enter secret key"></div>
      <p class="text-sm text-muted">Orders will sync automatically every 15 minutes.</p>`,
      '<button class="btn btn-ghost" onclick="IB.closeModal()">Cancel</button><button class="btn btn-primary" onclick="PublisherDash.doConnect(\'' + id + '\')">Connect</button>'
    );
  },

  doConnect(id) {
    const i = INKBRIDGE.integrations.find(x => x.id === id);
    if (i) { i.status = 'connected'; i.lastSync = 'Just now'; i.apiKey = '****-' + id.toUpperCase().slice(0, 3) + '-NEW'; IB.closeModal(); IB.toast(i.name + ' connected successfully!', 'ok'); this.renderIntegrations(); }
  },

  renderRoyalties() {
    const el = document.getElementById('royaltyTable');
    if (!el) return;
    el.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th>Author</th><th>Books</th><th>Total Sales</th><th>Royalty %</th><th>Pending Payout</th><th>Actions</th></tr></thead><tbody>
      ${INKBRIDGE.authors.filter(a => a.status === 'active').map(a => `<tr>
        <td><div class="flex gap-1" style="align-items:center"><div class="avatar avatar-sm">${a.avatar}</div>${a.name}</div></td>
        <td>${a.books}</td><td>${IB.fmtNum(a.totalSales)}</td><td>${a.royalty}%</td><td><strong>${IB.fmt(a.pendingPayout)}</strong></td>
        <td><button class="btn btn-gold btn-sm" onclick="PublisherDash.payRoyalty(${a.id})"><i class="fa-solid fa-indian-rupee-sign"></i> Pay Now</button></td>
      </tr>`).join('')}
    </tbody></table></div>`;
  },

  payRoyalty(id) {
    const a = IB.getAuthor(id);
    if (!a) return;
    IB.confirm('Process Payout', 'Pay ' + IB.fmt(a.pendingPayout) + ' to ' + a.name + '?', () => {
      IB.toast('Payout of ' + IB.fmt(a.pendingPayout) + ' initiated to ' + a.name, 'ok');
      a.pendingPayout = 0;
      this.renderRoyalties();
    });
  },

  renderChart(targetId) {
    const el = document.getElementById(targetId || 'salesChartOverview');
    if (!el) return;
    const max = Math.max(...INKBRIDGE.monthlySales.map(m => m.website + m.amazon + m.flipkart + m.kindle));
    el.innerHTML = `
      <div class="chart-bars">${INKBRIDGE.monthlySales.map(m => {
        const total = m.website + m.amazon + m.flipkart + m.kindle;
        const h = (total / max) * 180;
        return `<div class="chart-bar-group">
          <div class="chart-bar-stack" style="height:${h}px">
            <div class="bar-kindle" style="height:${(m.kindle / total) * 100}%"></div>
            <div class="bar-fk" style="height:${(m.flipkart / total) * 100}%"></div>
            <div class="bar-amz" style="height:${(m.amazon / total) * 100}%"></div>
            <div class="bar-web" style="height:${(m.website / total) * 100}%"></div>
          </div>
          <div class="chart-label">${m.month}</div>
        </div>`;
      }).join('')}</div>
      <div class="chart-legend">
        <span><i style="background:var(--burgundy)"></i> Website</span>
        <span><i style="background:#FF9900"></i> Amazon</span>
        <span><i style="background:#2874F0"></i> Flipkart</span>
        <span><i style="background:#232F3E"></i> Kindle</span>
      </div>`;
  },

  renderPresence() {
    const dp = INKBRIDGE.digitalPresence;
    if (!dp) return;
    const g = dp.googleBusiness;
    const stats = document.getElementById('presenceStats');
    if (stats) {
      stats.innerHTML = `
        <div class="stat-card"><div class="label">Google Map Views</div><div class="value">${IB.fmtNum(g.viewsMonth)}</div><div class="change up">This month</div></div>
        <div class="stat-card"><div class="label">Google Rating</div><div class="value">${g.rating}★</div><div class="change up">${g.reviews} reviews</div></div>
        <div class="stat-card"><div class="label">SEO Score</div><div class="value">${dp.seo.score}</div><div class="change up">Local + organic</div></div>
        <div class="stat-card"><div class="label">Direction Requests</div><div class="value">${IB.fmtNum(g.directionRequests)}</div><div class="change up">Footfall intent</div></div>`;
    }
    const gbp = document.getElementById('presenceGbp');
    if (gbp) {
      gbp.innerHTML = `
        <h3 style="margin-bottom:0.75rem"><i class="fa-solid fa-map-location-dot" style="color:var(--gold)"></i> Google Business Profile</h3>
        <p class="text-sm text-muted mb-2">${g.address}</p>
        <p class="text-sm">${g.hours}</p>
        <dl class="book-detail-meta" style="margin-top:1rem">
          <dt>Status</dt><dd>${IB.statusBadge('connected')} Verified</dd>
          <dt>Categories</dt><dd>${g.categories.join(', ')}</dd>
          <dt>Calls / mo</dt><dd>${g.callsMonth}</dd>
          <dt>Website clicks</dt><dd>${IB.fmtNum(g.websiteClicks)}</dd>
        </dl>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem">
          <a class="btn btn-primary btn-sm" href="${g.mapUrl}" target="_blank" rel="noopener">Open Maps</a>
          <button class="btn btn-ghost btn-sm" onclick="IB.toast('Google review reply posted','ok')">Reply to Reviews</button>
          <button class="btn btn-ghost btn-sm" onclick="IB.toast('Store photos uploaded to GBP','ok')">Upload Photos</button>
        </div>`;
    }
    const seo = document.getElementById('presenceSeo');
    if (seo) {
      seo.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th>Keyword</th><th>Rank</th><th>Est. Traffic</th></tr></thead><tbody>
        ${dp.seo.keywords.map(k => `<tr><td>${k.term}</td><td><strong>#${k.rank}</strong></td><td>${IB.fmtNum(k.traffic)}/mo</td></tr>`).join('')}
      </tbody></table></div>`;
    }
    const grid = document.getElementById('presenceChannelGrid');
    if (grid) {
      grid.innerHTML = dp.channels.map(c => `
        <div class="integ-card">
          <div class="integ-card-header"><span class="icon">${c.icon}</span><h3>${c.name}</h3>${IB.statusBadge(c.status === 'live' || c.status === 'active' ? 'connected' : 'pending')}</div>
          <div class="integ-stat"><span>Metric</span><span>${c.metric}</span></div>
          <button class="btn btn-ghost btn-sm mt-1" onclick="IB.toast('${c.name} settings opened','ok')">Manage</button>
        </div>`).join('');
    }
    const ck = document.getElementById('presenceCheckDash');
    if (ck) {
      ck.innerHTML = `<ul style="list-style:none">${dp.checklist.map(i => `
        <li style="display:flex;gap:0.65rem;padding:0.55rem 0;border-bottom:1px solid var(--line);font-size:0.88rem">
          <span style="color:${i.done ? 'var(--ok)' : 'var(--warn)'}">${i.done ? '✓ Done' : '○ Pending'}</span>
          <span>${i.item}</span>
        </li>`).join('')}</ul>`;
    }
  },

  renderWhatsApp() {
    const el = document.getElementById('whatsappCampaigns');
    if (!el) return;
    el.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th>Campaign</th><th>Type</th><th>Audience</th><th>Sent</th><th>Read</th><th>Clicks</th><th>Orders</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      ${INKBRIDGE.whatsappCampaigns.map(c => `<tr>
        <td><strong>${c.name}</strong><br><span class="text-xs text-muted">${IB.date(c.date)}</span></td>
        <td><span class="badge badge-info">${c.type.replace('_', ' ')}</span></td>
        <td>${c.audience}<br><span class="text-xs text-muted">${IB.fmtNum(c.contacts)} contacts</span></td>
        <td>${c.sent ? IB.fmtNum(c.sent) : '—'}</td>
        <td>${c.read ? IB.fmtNum(c.read) : '—'}</td>
        <td>${c.clicks ? IB.fmtNum(c.clicks) : '—'}</td>
        <td><strong>${c.orders || c.signups || '—'}</strong></td>
        <td>${IB.statusBadge(c.status)}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="PublisherDash.viewCampaign('${c.id}')">View</button></td>
      </tr>`).join('')}
    </tbody></table></div>`;

    const lists = document.getElementById('whatsappLists');
    if (lists) {
      lists.innerHTML = INKBRIDGE.whatsappLists.map(l => `
        <div class="integ-card">
          <h4 style="font-size:0.95rem;margin-bottom:0.25rem">${l.name}</h4>
          <p class="text-sm text-muted">${l.desc}</p>
          <p style="margin-top:0.5rem;font-family:var(--font-display);font-size:1.4rem;font-weight:700">${IB.fmtNum(l.count)}</p>
          <button class="btn btn-ghost btn-sm mt-1" onclick="IB.toast('List exported','ok')">Export</button>
        </div>`).join('');
    }
  },

  viewCampaign(id) {
    const c = INKBRIDGE.whatsappCampaigns.find(x => x.id === id);
    if (!c) return;
    const rate = c.sent ? Math.round((c.read / c.sent) * 100) : 0;
    IB.modal(c.name, `
      <dl class="book-detail-meta">
        <dt>Type</dt><dd>${c.type.replace('_', ' ')}</dd>
        <dt>Audience</dt><dd>${c.audience} (${IB.fmtNum(c.contacts)} contacts)</dd>
        <dt>Delivered</dt><dd>${c.delivered ? IB.fmtNum(c.delivered) : 'Pending'}</dd>
        <dt>Read Rate</dt><dd>${rate}%</dd>
        <dt>Click-through</dt><dd>${c.clicks ? IB.fmtNum(c.clicks) : '—'}</dd>
        <dt>Conversions</dt><dd>${c.orders ? c.orders + ' orders' : c.signups ? c.signups + ' signups' : '—'}</dd>
      </dl>`,
      `<button class="btn btn-ghost" onclick="IB.closeModal()">Close</button>
       ${c.status === 'draft' || c.status === 'scheduled' ? '<button class="btn btn-primary" onclick="PublisherDash.sendCampaign(\'' + id + '\')"><i class="fa-brands fa-whatsapp"></i> Send Now</button>' : ''}`
    );
  },

  sendCampaign(id) {
    IB.confirm('Send WhatsApp Campaign', 'Send bulk WhatsApp to all contacts in this campaign?', () => {
      const c = INKBRIDGE.whatsappCampaigns.find(x => x.id === id);
      if (c) { c.status = 'completed'; c.sent = c.contacts; IB.closeModal(); this.renderWhatsApp(); IB.toast('Campaign sent to ' + IB.fmtNum(c.contacts) + ' contacts!', 'ok'); }
    });
  },

  newWhatsAppCampaign() {
    IB.modal('New WhatsApp Campaign', `
      <div class="form-group"><label>Campaign Name</label><input placeholder="e.g. Christmas Book Sale"></div>
      <div class="form-group"><label>Type</label><select><option value="promotion">Book Promotion</option><option value="book_launch">Book Launch</option><option value="author_acquisition">Attract Authors</option><option value="engagement">Reader Engagement</option></select></div>
      <div class="form-group"><label>Audience List</label><select>${INKBRIDGE.whatsappLists.map(l => '<option>' + l.name + ' (' + IB.fmtNum(l.count) + ')</option>').join('')}</select></div>
      <div class="form-group"><label>Template</label><select>${INKBRIDGE.whatsappTemplates.map(t => '<option>' + t.name + '</option>').join('')}</select></div>
      <div class="form-group"><label>Message Preview</label><textarea rows="3" readonly>Hi {{name}}! 📚 New release alert: "{{book_title}}" is now available at 20% off → {{link}}</textarea></div>
      <div class="form-group"><label>Schedule</label><input type="datetime-local"></div>`,
      '<button class="btn btn-ghost" onclick="IB.closeModal()">Cancel</button><button class="btn btn-primary" onclick="IB.toast(\'Campaign scheduled!\',\'ok\');IB.closeModal()"><i class="fa-brands fa-whatsapp"></i> Schedule Campaign</button>'
    );
  },

  renderSocial() {
    const el = document.getElementById('socialCalendar');
    if (!el) return;
    const platforms = { instagram: '📸', facebook: '👤', linkedin: '💼', twitter: '🐦' };
    el.innerHTML = INKBRIDGE.socialPosts.map(p => `
      <div class="pipeline-card" style="margin-bottom:0.5rem">
        <div class="flex-between"><span>${platforms[p.platform] || '📱'} <strong style="text-transform:capitalize">${p.platform}</strong> · ${p.type}</span>${IB.statusBadge(p.status)}</div>
        <p style="margin:0.35rem 0;font-size:0.85rem">${p.caption.substring(0, 80)}${p.caption.length > 80 ? '…' : ''}</p>
        <p class="text-xs text-muted">${p.book ? '📚 ' + p.book + ' · ' : ''}${p.scheduled}${p.reach ? ' · Reach: ' + IB.fmtNum(p.reach) : ''}</p>
      </div>`).join('');

    const stats = document.getElementById('socialStats');
    if (stats) {
      stats.innerHTML = Object.entries(INKBRIDGE.socialStats).map(([plat, s]) => `
        <div class="stat-card">
          <div class="label" style="text-transform:capitalize">${plat}</div>
          <div class="value" style="font-size:1.4rem">${IB.fmtNum(s.followers)}</div>
          <div class="change up">${s.engagement}% engagement · ${s.postsMonth} posts/mo</div>
        </div>`).join('');
    }
  },

  newSocialPost() {
    IB.modal('Schedule Social Post', `
      <div class="form-group"><label>Platform</label><select><option>Instagram</option><option>Facebook</option><option>LinkedIn</option><option>Twitter/X</option></select></div>
      <div class="form-group"><label>Post Type</label><select><option>Carousel</option><option>Reel / Video</option><option>Article</option><option>Thread</option><option>Story</option></select></div>
      <div class="form-group"><label>Book (optional)</label><select><option value="">— General brand post —</option>${INKBRIDGE.books.map(b => '<option>' + b.title + '</option>').join('')}</select></div>
      <div class="form-group"><label>Caption</label><textarea rows="3" placeholder="Write your post caption…"></textarea></div>
      <div class="form-group"><label>Schedule</label><input type="datetime-local"></div>
      <p class="text-sm text-muted">Auto-publishes via Meta Business Suite integration when scheduled time is reached.</p>`,
      '<button class="btn btn-ghost" onclick="IB.closeModal()">Cancel</button><button class="btn btn-primary" onclick="IB.toast(\'Post scheduled — will auto-publish\',\'ok\');IB.closeModal()">Schedule Post</button>'
    );
  },

  renderOperations() {
    const el = document.getElementById('sopList');
    if (!el) return;
    el.innerHTML = INKBRIDGE.businessSOPs.map(sop => {
      const autoCount = sop.steps.filter(s => s.auto).length;
      const autoPct = Math.round((autoCount / sop.steps.length) * 100);
      return `<div class="card mb-2" style="cursor:pointer" onclick="PublisherDash.viewSOP('${sop.id}')">
        <div class="flex-between mb-1">
          <h3 style="font-size:1.05rem">${sop.title}</h3>
          <span class="badge badge-gold">${autoPct}% automated</span>
        </div>
        <p class="text-sm text-muted">Owner: ${sop.owner} · SLA: ${sop.sla} · ${sop.steps.length} steps (${autoCount} auto)</p>
        <div class="progress mt-1"><div class="progress-bar" style="width:${autoPct}%"></div></div>
      </div>`;
    }).join('');
  },

  viewSOP(id) {
    const sop = INKBRIDGE.businessSOPs.find(x => x.id === id);
    if (!sop) return;
    IB.modal(sop.title + ' — Standard Process', `
      <p class="text-sm text-muted mb-2">Owner: <strong>${sop.owner}</strong> · SLA: <strong>${sop.sla}</strong></p>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>#</th><th>Task</th><th>Role</th><th>Mode</th></tr></thead><tbody>
        ${sop.steps.map(s => `<tr>
          <td>${s.step}</td><td>${s.task}</td><td>${s.role}</td>
          <td>${s.auto ? '<span class="badge badge-ok">⚡ Automated</span>' : '<span class="badge badge-muted">Manual</span>'}</td>
        </tr>`).join('')}
      </tbody></table></div>`,
      '<button class="btn btn-ghost" onclick="IB.closeModal()">Close</button><button class="btn btn-primary" onclick="IB.toast(\'SOP checklist exported\',\'ok\');IB.closeModal()"><i class="fa-solid fa-download"></i> Export Checklist</button>'
    );
  },

  renderAutomations() {
    const el = document.getElementById('automationList');
    if (!el) return;
    el.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th>Automation</th><th>Trigger</th><th>Action</th><th>Runs Today</th><th>Last Run</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      ${INKBRIDGE.automations.map(a => `<tr>
        <td><strong>${a.name}</strong></td>
        <td class="text-sm">${a.trigger}</td>
        <td class="text-sm">${a.action.substring(0, 50)}…</td>
        <td>${a.runsToday}</td>
        <td class="text-sm">${a.lastRun}</td>
        <td>${IB.statusBadge(a.status)}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="PublisherDash.toggleAutomation('${a.id}')">${a.status === 'active' ? 'Pause' : 'Enable'}</button></td>
      </tr>`).join('')}
    </tbody></table></div>`;
  },

  toggleAutomation(id) {
    const a = INKBRIDGE.automations.find(x => x.id === id);
    if (a) {
      a.status = a.status === 'active' ? 'paused' : 'active';
      this.renderAutomations();
      IB.toast(a.name + ' ' + (a.status === 'active' ? 'enabled' : 'paused'), a.status === 'active' ? 'ok' : 'warn');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => PublisherDash.init());
