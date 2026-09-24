/* PraxisFlow — product-style multi-screen demo */
(function () {
  'use strict';
  var D = window.CAData;
  var state = {
    role: 'ca',
    view: 'home',
    caseId: null,
    caseSvc: null,
    caseTab: 'overview',
    clientId: null
  };

  var LIFE = ['Trigger', 'Documents', 'Tasks', 'Validation', 'Exceptions', 'Review', 'Approval', 'Filing', 'Ack', 'Archive', 'Billing', 'Next'];

  var roles = {
    ca: {
      name: 'CA R. Sharma', role: 'Partner · Sharma & Associates', avatar: 'RS',
      nav: [
        { label: 'Overview' },
        { id: 'home', label: 'CA Home', ico: '◆', count: 2 },
        { id: 'approvals', label: 'Approvals Queue', ico: '✓', count: 4 },
        { id: 'exceptions', label: 'Red Exceptions', ico: '!', count: 2 },
        { id: 'deadlines', label: 'Deadlines & Risk', ico: '◷' },
        { label: 'Services' },
        { id: 'svc-gstReturns', label: 'GST Returns', ico: 'G' },
        { id: 'svc-gstReg', label: 'GST Registration', ico: 'R' },
        { id: 'svc-books', label: 'Bookkeeping', ico: 'B' },
        { id: 'svc-tds', label: 'TDS Returns', ico: 'T' },
        { id: 'svc-itr', label: 'Income Tax', ico: 'I' },
        { id: 'svc-audit', label: 'Audit', ico: 'A' },
        { id: 'svc-dsc', label: 'DSC Renewal', ico: 'D' },
        { id: 'svc-mca', label: 'MCA Forms', ico: 'M' },
        { id: 'svc-notices', label: 'Notices', ico: 'N', count: 1 },
        { id: 'svc-billing', label: 'Billing', ico: '₹' },
        { label: 'Firm' },
        { id: 'clients', label: 'Client Master', ico: '◎' },
        { id: 'filings', label: 'Filings Vault', ico: '▤' },
        { id: 'workload', label: 'Staff Workload', ico: '☰' }
      ]
    },
    staff: {
      name: 'Neha Gupta', role: 'Senior Associate', avatar: 'NG',
      nav: [
        { label: 'My Work' },
        { id: 'home', label: 'My Queue', ico: '◆', count: 14 },
        { id: 'exceptions', label: 'Amber Exceptions', ico: '!', count: 3 },
        { id: 'tasks', label: 'All Tasks', ico: '☑' },
        { label: 'Services' },
        { id: 'svc-gstReturns', label: 'GST Returns', ico: 'G' },
        { id: 'svc-gstReg', label: 'GST Registration', ico: 'R' },
        { id: 'svc-books', label: 'Bookkeeping', ico: 'B' },
        { id: 'svc-tds', label: 'TDS Returns', ico: 'T' },
        { id: 'svc-itr', label: 'Income Tax', ico: 'I' },
        { id: 'svc-audit', label: 'Audit', ico: 'A' },
        { id: 'svc-dsc', label: 'DSC Renewal', ico: 'D' },
        { id: 'svc-mca', label: 'MCA Forms', ico: 'M' },
        { id: 'svc-notices', label: 'Notices', ico: 'N' },
        { id: 'svc-billing', label: 'Billing', ico: '₹' },
        { label: 'Workspace' },
        { id: 'documents', label: 'Document Vault', ico: '▤' },
        { id: 'comms', label: 'WhatsApp / Email', ico: '✉' },
        { id: 'clients', label: 'My Clients', ico: '◎' },
        { id: 'recon-hub', label: 'Recon Hub', ico: '⇄' }
      ]
    },
    client: {
      name: 'Ravi Mehta', role: 'Aarav Traders Pvt Ltd', avatar: 'RM',
      nav: [
        { label: 'Portal' },
        { id: 'home', label: 'Home', ico: '◆' },
        { id: 'pending', label: 'Pending from Me', ico: '!', count: 2 },
        { id: 'upload', label: 'Upload Centre', ico: '↑' },
        { label: 'My Services' },
        { id: 'c-gst', label: 'GST Returns', ico: 'G' },
        { id: 'c-books', label: 'Bookkeeping', ico: 'B' },
        { id: 'c-tds', label: 'TDS', ico: 'T' },
        { id: 'c-dsc', label: 'DSC', ico: 'D' },
        { id: 'c-status', label: 'All Status', ico: '◷' },
        { label: 'Account' },
        { id: 'approvals', label: 'Approvals', ico: '✓' },
        { id: 'filings', label: 'Filings & Reports', ico: '▤' },
        { id: 'invoices', label: 'Invoices & Pay', ico: '₹' },
        { id: 'messages', label: 'Messages', ico: '✉' }
      ]
    },
    admin: {
      name: 'Admin User', role: 'Practice Administrator', avatar: 'AD',
      nav: [
        { label: 'Control' },
        { id: 'home', label: 'Admin Home', ico: '◆' },
        { id: 'users', label: 'Users & Roles', ico: '◎' },
        { id: 'services', label: 'Service Master', ico: '⚙' },
        { id: 'workflows', label: 'Workflow Designer', ico: '⇉' },
        { id: 'rules', label: 'Exception Rules', ico: '!' },
        { label: 'Integrations' },
        { id: 'tally', label: 'Tally Sync', ico: '⇄' },
        { id: 'templates', label: 'Comms Templates', ico: '✉' },
        { id: 'payments', label: 'Payment Gateway', ico: '₹' },
        { id: 'ai', label: 'AI / OCR Settings', ico: '✦' },
        { label: 'Security' },
        { id: 'security', label: 'Security & MFA', ico: '🔒' },
        { id: 'auditlog', label: 'Audit Log', ico: '▤' },
        { id: 'backups', label: 'Backups', ico: '⬚' }
      ]
    }
  };

  function qs(sel, el) { return (el || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function catalog(id) {
    return D.serviceCatalog.find(function (s) { return s.id === id; });
  }
  function findCase(svc, id) {
    var list = (D.cases && D.cases[svc]) || [];
    return list.find(function (c) { return c.id === id; });
  }
  function statusBadge(s) {
    var m = { red: 'red', amber: 'amber', green: 'green', blue: 'blue', Open: 'slate', 'In Progress': 'blue', Done: 'green', Waiting: 'amber', 'Waiting Client': 'amber', Critical: 'red', High: 'amber', Med: 'slate', Low: 'slate', Verified: 'green', Paid: 'green', Overdue: 'red', Sent: 'amber', Pending: 'amber', Active: 'green' };
    var b = m[s] || 'slate';
    return '<span class="badge badge-' + b + '">' + esc(s) + '</span>';
  }
  function header(title, sub, actions) {
    return '<div class="page-header"><div><h1>' + esc(title) + '</h1><p class="sub">' + esc(sub) + '</p></div>' +
      '<div class="page-actions">' + (actions || '<span class="badge badge-slate">Live product demo</span>') + '</div></div>';
  }
  function kpi(label, value, delta, alert, dir) {
    return '<div class="kpi ' + (alert || '') + '"><div class="label">' + esc(label) + '</div><div class="value">' + esc(value) + '</div><div class="delta ' + (dir || 'neutral') + '">' + esc(delta || '') + '</div></div>';
  }
  function table(headers, rows) {
    return '<table class="data-table"><thead><tr>' + headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') +
      '</tr></thead><tbody>' + rows.map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
  }
  function lifeSteps(activeIdx) {
    return '<div class="wf-steps">' + LIFE.map(function (s, i) {
      var cls = i < activeIdx ? 'done' : i === activeIdx ? 'active' : '';
      return '<div class="wf-step ' + cls + '"><div class="circle">' + (i < activeIdx ? '✓' : (i + 1)) + '</div><div class="label">' + s + '</div></div>';
    }).join('') + '</div>';
  }
  function caseSteps(c) {
    var steps = c.steps || LIFE;
    return '<div class="wf-steps">' + steps.map(function (s, i) {
      var cls = i < c.step ? 'done' : i === c.step ? 'active' : '';
      return '<div class="wf-step ' + cls + '"><div class="circle">' + (i < c.step ? '✓' : (i + 1)) + '</div><div class="label">' + esc(s) + '</div></div>';
    }).join('') + '</div>';
  }

  /* ===== NAV / ROLE ===== */
  function setRole(role) {
    state.role = role;
    state.view = 'home';
    state.caseId = null;
    state.caseSvc = null;
    state.clientId = null;
    var r = roles[role];
    qs('#userName').textContent = r.name;
    qs('#userRole').textContent = r.role;
    qs('#userAvatar').textContent = r.avatar;
    document.querySelectorAll('#roleSwitch button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-role') === role);
    });
    renderNav();
    render();
  }

  function renderNav() {
    var html = '';
    roles[state.role].nav.forEach(function (n) {
      if (!n.id) {
        html += '<div class="nav-label">' + esc(n.label) + '</div>';
        return;
      }
      var active = state.view === n.id || (state.view === 'case' && state.caseSvc && n.id === 'svc-' + state.caseSvc);
      var count = n.count ? '<span class="count' + (n.id === 'exceptions' && state.role === 'staff' ? ' amber' : '') + '">' + n.count + '</span>' : '';
      html += '<button type="button" class="nav-item' + (active ? ' active' : '') + '" data-view="' + n.id + '"><span class="nav-ico">' + n.ico + '</span>' + esc(n.label) + count + '</button>';
    });
    qs('#sideNav').innerHTML = html;
  }

  function go(view, opts) {
    opts = opts || {};
    state.view = view;
    if (opts.caseId) { state.caseId = opts.caseId; state.caseSvc = opts.caseSvc; state.caseTab = opts.tab || 'overview'; state.view = 'case'; }
    if (opts.clientId) { state.clientId = opts.clientId; state.view = 'client'; }
    if (opts.clearCase) { state.caseId = null; state.caseSvc = null; }
    renderNav();
    render();
    var sb = qs('#sidebar');
    if (sb) sb.classList.remove('mobile-open');
    window.scrollTo(0, 0);
  }

  /* ===== DRAWERS ===== */
  function openException(id) {
    var ex = D.exceptions.find(function (e) { return e.id === id; });
    if (!ex) return;
    qs('#drawerTitle').textContent = ex.title;
    qs('#drawerSub').textContent = ex.id + ' · ' + ex.client;
    qs('#drawerBody').innerHTML =
      '<div class="mb-8">' + statusBadge(ex.level) + '</div>' +
      '<div class="detail-block"><h3>What happened</h3><p class="text-sm">' + esc(ex.desc) + '</p></div>' +
      '<div class="detail-grid">' +
      '<div class="detail-item"><label>Service</label><strong>' + esc(ex.service) + '</strong></div>' +
      '<div class="detail-item"><label>Workflow</label><strong>' + esc(ex.workflow) + '</strong></div>' +
      '<div class="detail-item"><label>Due</label><strong>' + esc(ex.due) + '</strong></div>' +
      '<div class="detail-item"><label>SLA</label><strong>' + esc(ex.sla) + '</strong></div></div>' +
      '<div class="detail-block mt-16"><h3>Audit</h3><div class="timeline">' +
      '<div class="tl-item"><strong>Created by rules engine</strong><span>Today · System</span></div>' +
      '<div class="tl-item"><strong>Assigned to ' + esc(ex.assignee) + '</strong><span>Open</span></div></div></div>';
    qs('#drawerFoot').innerHTML =
      (state.role === 'ca' ? '<button class="btn btn-primary btn-sm" id="dAct">Approve &amp; clear</button>' :
        state.role === 'staff' ? '<button class="btn btn-outline btn-sm" id="dEsc">Escalate</button><button class="btn btn-primary btn-sm" id="dAct">Resolve</button>' :
          '<button class="btn btn-primary btn-sm" data-close-drawer>Close</button>');
    qs('#overlay').classList.add('open');
    var a = qs('#dAct'); if (a) a.onclick = function () { closeDrawer(); showToast('Action logged · ' + ex.id); };
    var e = qs('#dEsc'); if (e) e.onclick = function () { closeDrawer(); showToast('Escalated to CA'); };
  }

  /* ===== RENDER ROUTER ===== */
  function render() {
    var html;
    if (state.view === 'case') html = renderCase();
    else if (state.view === 'client') html = renderClientDetail();
    else if (state.view.indexOf('svc-') === 0) html = renderServiceList(state.view.slice(4));
    else if (state.role === 'ca') html = renderCA();
    else if (state.role === 'staff') html = renderStaff();
    else if (state.role === 'client') html = renderClient();
    else html = renderAdmin();
    qs('#main').innerHTML = html;
    bindMain();
  }

  function bindMain() {
    document.querySelectorAll('[data-ex]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.stopPropagation(); openException(el.getAttribute('data-ex')); });
    });
    document.querySelectorAll('[data-open-case]').forEach(function (el) {
      el.addEventListener('click', function () {
        go('case', { caseId: el.getAttribute('data-open-case'), caseSvc: el.getAttribute('data-svc'), tab: 'overview' });
      });
    });
    document.querySelectorAll('[data-case-tab]').forEach(function (el) {
      el.addEventListener('click', function () {
        state.caseTab = el.getAttribute('data-case-tab');
        render();
      });
    });
    document.querySelectorAll('[data-back-svc]').forEach(function (el) {
      el.addEventListener('click', function () { go('svc-' + el.getAttribute('data-back-svc')); });
    });
    document.querySelectorAll('[data-go]').forEach(function (el) {
      el.addEventListener('click', function () { go(el.getAttribute('data-go')); });
    });
    document.querySelectorAll('[data-open-client]').forEach(function (el) {
      el.addEventListener('click', function () { go('client', { clientId: el.getAttribute('data-open-client') }); });
    });
    document.querySelectorAll('[data-action]').forEach(function (el) {
      el.addEventListener('click', function () {
        var a = el.getAttribute('data-action');
        var msgs = {
          'approve-filing': 'Filing approved · queued for portal · ack will auto-archive',
          'request-doc': 'WhatsApp + Email document request sent',
          'upload': 'Upload started · AI classification queued',
          'pay': 'Payment link opened (demo)',
          'save': 'Saved · audit log written',
          'sync': 'Tally sync started',
          'remind': 'Reminder sent via WhatsApp template',
          'escalate': 'Escalated to CA Red queue',
          'file': 'Filing pack locked · submitting…',
          'generate-inv': 'Invoice generated · payment link created'
        };
        showToast(msgs[a] || 'Action recorded');
      });
    });
    var up = qs('#uploadZone');
    if (up) up.addEventListener('click', function () { showToast('File picker (demo) · AI will classify on upload'); });
  }

  /* ===== SERVICE LIST SCREEN ===== */
  function renderServiceList(svcId) {
    var meta = catalog(svcId);
    var cases = (D.cases && D.cases[svcId]) || [];
    if (!meta) return header('Service', 'Unknown') + '<p>Not found</p>';

    return header(meta.name, meta.code + ' · ' + meta.desc + ' · Due pressure: ' + meta.due,
      '<button class="btn btn-outline btn-sm" data-action="request-doc">Bulk doc request</button>' +
      '<button class="btn btn-primary btn-sm" data-action="save">New cycle</button>') +
      '<div class="screen-note">Separate product screen for <strong>' + esc(meta.name) + '</strong> — open any case for the full workflow workspace (docs, tasks, recon, exceptions, filing, billing).</div>' +
      '<div class="stat-strip">' +
      kpi('Open cycles', String(meta.open), 'This period', 'alert-teal') +
      kpi('Amber', String(meta.amber), 'Staff queue', 'alert-amber') +
      kpi('Red', String(meta.red), 'CA queue', 'alert-red') +
      kpi('Automation', svcId === 'gstReturns' ? '62%' : '55%', 'Green path', 'alert-green', 'up') +
      kpi('Next due', meta.due, 'Calendar', 'alert-teal') +
      '</div>' +
      lifeSteps(svcId === 'gstReturns' ? 4 : 2) +
      '<div class="panel"><div class="panel-head"><h2>Active cases — ' + esc(meta.name) + '</h2>' +
      '<div class="filters" style="margin:0"><button class="filter-chip active" type="button">All</button><button class="filter-chip" type="button">Red</button><button class="filter-chip" type="button">Amber</button><button class="filter-chip" type="button">Due today</button></div></div>' +
      (cases.length ? cases.map(function (c) {
        return '<div class="case-row" data-open-case="' + c.id + '" data-svc="' + svcId + '">' +
          '<div><h4>' + esc(c.client) + ' · ' + esc(c.type) + '</h4>' +
          '<p>' + esc(c.id) + ' · ' + esc(c.period) + ' · Stage: ' + esc(c.stage) + ' · Assignee: ' + esc(c.assignee) + '</p>' +
          '<div class="mini-steps">' + (c.steps || []).map(function (s, i) {
            var cls = i < c.step ? 'ok' : i === c.step ? 'on' : '';
            if (i === c.step && c.status === 'red') cls = 'bad';
            return '<span class="' + cls + '">' + esc(s) + '</span>';
          }).join('') + '</div></div>' +
          '<div style="text-align:right">' + statusBadge(c.status) + '<div class="text-sm text-muted mt-8">Due ' + esc(c.due) + '</div>' +
          '<button class="btn btn-sm btn-primary mt-8" type="button">Open workspace</button></div></div>';
      }).join('') : '<div class="panel-body pad text-muted">No active cases in demo data for this service.</div>') +
      '</div>';
  }

  /* ===== CASE WORKSPACE ===== */
  function renderCase() {
    var c = findCase(state.caseSvc, state.caseId);
    var meta = catalog(state.caseSvc);
    if (!c) return header('Case', 'Not found') + '<button class="back-link" data-go="home">← Back</button>';

    var tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'documents', label: 'Documents', n: c.docs.filter(function (d) { return d.status.indexOf('Pending') >= 0 || d.status.indexOf('Missing') >= 0 || d.status.indexOf('mismatch') >= 0 || d.status.indexOf('Partial') >= 0; }).length },
      { id: 'tasks', label: 'Tasks', n: c.tasks.filter(function (t) { return t.s !== 'Done'; }).length },
      { id: 'validation', label: 'Validation / Recon' },
      { id: 'exceptions', label: 'Exceptions', n: c.status === 'red' || c.status === 'amber' ? 1 : 0 },
      { id: 'review', label: 'Review & Approval' },
      { id: 'filing', label: 'Filing & Ack' },
      { id: 'billing', label: 'Billing' },
      { id: 'timeline', label: 'Audit Trail' }
    ];

    var body = '';
    switch (state.caseTab) {
      case 'documents': body = tabDocs(c); break;
      case 'tasks': body = tabTasks(c); break;
      case 'validation': body = tabValidation(c); break;
      case 'exceptions': body = tabExceptions(c); break;
      case 'review': body = tabReview(c); break;
      case 'filing': body = tabFiling(c); break;
      case 'billing': body = tabBilling(c); break;
      case 'timeline': body = tabTimeline(c); break;
      default: body = tabOverview(c, meta);
    }

    return '<button class="back-link" type="button" data-back-svc="' + state.caseSvc + '">← Back to ' + esc(meta ? meta.name : 'service') + '</button>' +
      '<div class="case-bar">' +
      '<div><div class="crumb"><button type="button" data-back-svc="' + state.caseSvc + '">' + esc(meta ? meta.name : '') + '</button> / ' + esc(c.id) + '</div>' +
      '<h1>' + esc(c.client) + ' — ' + esc(c.type) + '</h1>' +
      '<p class="text-sm text-muted">' + esc(c.period) + ' · Stage: <strong>' + esc(c.stage) + '</strong> · ' + esc(c.assignee) + '</p>' +
      '<div class="case-meta">' + statusBadge(c.status) + '<span class="badge badge-slate">Due ' + esc(c.due) + '</span>' +
      '<span class="badge badge-teal">' + esc(c.clientId) + '</span></div></div>' +
      '<div class="page-actions">' +
      '<button class="btn btn-outline btn-sm" data-action="request-doc">Request docs</button>' +
      '<button class="btn btn-outline btn-sm" data-action="remind">Remind client</button>' +
      (c.status === 'green' || c.stage.indexOf('Approve') >= 0 ?
        '<button class="btn btn-primary btn-sm" data-action="approve-filing">CA Approve</button>' :
        c.status === 'red' ? '<button class="btn btn-danger btn-sm" data-action="escalate">Needs CA</button>' :
          '<button class="btn btn-primary btn-sm" data-action="save">Save progress</button>') +
      '</div></div>' +
      caseSteps(c) +
      '<div class="subtabs">' + tabs.map(function (t) {
        return '<button type="button" class="subtab' + (state.caseTab === t.id ? ' active' : '') + '" data-case-tab="' + t.id + '">' + t.label +
          (t.n ? '<span class="pill' + (t.id === 'exceptions' && c.status === 'amber' ? ' amber' : '') + '">' + t.n + '</span>' : '') + '</button>';
      }).join('') + '</div>' +
      '<div class="workspace">' + body + '</div>';
  }

  function tabOverview(c, meta) {
    return '<div class="split-work">' +
      '<div>' +
      '<h3 class="mb-8" style="font-size:1rem">Case summary</h3>' +
      '<div class="detail-grid mb-16">' +
      '<div class="detail-item"><label>Service</label><strong>' + esc(meta ? meta.name : '') + '</strong></div>' +
      '<div class="detail-item"><label>Type</label><strong>' + esc(c.type) + '</strong></div>' +
      '<div class="detail-item"><label>Period</label><strong>' + esc(c.period) + '</strong></div>' +
      '<div class="detail-item"><label>Assignee</label><strong>' + esc(c.assignee) + '</strong></div>' +
      (c.liability !== '—' ? '<div class="detail-item"><label>Liability / Tax</label><strong>' + esc(c.liability) + '</strong></div>' : '') +
      (c.itc && c.itc !== '—' ? '<div class="detail-item"><label>ITC / Credit</label><strong>' + esc(c.itc) + '</strong></div>' : '') +
      (c.cash && c.cash !== '—' ? '<div class="detail-item"><label>Cash / Challan</label><strong>' + esc(c.cash) + '</strong></div>' : '') +
      '<div class="detail-item"><label>Client</label><strong><button type="button" data-open-client="' + c.clientId + '" style="color:var(--teal);font-weight:700">' + esc(c.client) + '</button></strong></div>' +
      '</div>' +
      '<div class="hint-box">Lifecycle: every service follows Trigger → Documents → Tasks → Validation → Exceptions → Review → Approval → Filing → Ack → Archive → Billing → Next Cycle. This case is at <strong>' + esc(c.stage) + '</strong>.</div>' +
      '<h3 class="mb-8" style="font-size:1rem">Open tasks</h3>' +
      table(['Task', 'Priority', 'Status'], c.tasks.map(function (t) {
        return [esc(t.t), statusBadge(t.p), statusBadge(t.s)];
      })) +
      '</div>' +
      '<div class="action-rail">' +
      '<h3>Quick actions</h3>' +
      '<button class="btn btn-outline btn-sm" data-case-tab="documents">Review documents</button>' +
      '<button class="btn btn-outline btn-sm" data-case-tab="validation">Open recon</button>' +
      '<button class="btn btn-outline btn-sm" data-case-tab="exceptions">View exceptions</button>' +
      '<button class="btn btn-outline btn-sm" data-action="remind">WhatsApp client</button>' +
      '<button class="btn btn-primary btn-sm" data-case-tab="review">Go to approval</button>' +
      '<h3 class="mt-16">Automation so far</h3>' +
      '<p class="text-sm text-muted">Tasks auto-created · reminders scheduled · OCR/classification run · exceptions scored Green/Amber/Red.</p>' +
      '</div></div>';
  }

  function tabDocs(c) {
    return '<div class="split-work"><div>' +
      '<div class="check-list mb-16">' + c.docs.map(function (d) {
        var bad = /Pending|Missing|mismatch|Partial|Shortfall|invalid|Gap|pending/i.test(d.status);
        return '<div class="check-item ' + (bad ? 'missing' : 'done') + '"><div class="ck">' + (bad ? '!' : '✓') + '</div>' +
          '<div class="ck-info"><strong>' + esc(d.name) + '</strong><span>' + esc(d.status) + ' · ' + esc(d.by) + '</span></div>' +
          (bad ? '<button class="btn btn-sm btn-outline" data-action="request-doc">Chase</button>' : '<button class="btn btn-sm btn-outline" data-action="upload">View</button>') + '</div>';
      }).join('') + '</div>' +
      '<div class="upload-zone" id="uploadZone"><strong>Drop supporting files</strong><span>AI classifies into this case vault automatically</span></div>' +
      '</div><div class="action-rail"><h3>Checklist policy</h3><p class="text-sm text-muted">Missing items block Green path. System sends D−7 / D−3 / D−1 reminders until complete or staff overrides.</p>' +
      '<button class="btn btn-primary btn-sm" data-action="request-doc">Send full checklist</button></div></div>';
  }

  function tabTasks(c) {
    return table(['Task', 'Priority', 'Status', 'Action'], c.tasks.map(function (t) {
      return [esc(t.t), statusBadge(t.p), statusBadge(t.s),
        '<button class="btn btn-sm btn-outline" data-action="save">Update</button>'];
    })) + '<button class="btn btn-primary btn-sm mt-16" data-action="save">Add manual task</button>';
  }

  function tabValidation(c) {
    if (!c.recon || !c.recon.length) {
      return '<div class="hint-box">No line-level recon for this service type. Validation is checklist + OCR field checks (see Documents).</div>' +
        '<div class="detail-grid">' +
        '<div class="detail-item"><label>PAN / ID OCR</label><strong>Pass</strong></div>' +
        '<div class="detail-item"><label>Mandatory fields</label><strong>2 gaps</strong></div>' +
        '<div class="detail-item"><label>AI confidence</label><strong>78%</strong></div>' +
        '<div class="detail-item"><label>Rule engine</label><strong>2 flags</strong></div></div>';
    }
    return '<p class="text-sm text-muted mb-16">Tally ↔ Portal / Bank reconciliation — only mismatches need humans.</p>' +
      table(['Ref', 'Books / Tally', 'Portal / Bank', 'Diff', 'Flag'], c.recon.map(function (r) {
        return [esc(r.inv), esc(r.tally), esc(r.gstr), esc(r.diff), statusBadge(r.flag)];
      })) +
      '<div class="page-actions mt-16">' +
      '<button class="btn btn-outline btn-sm" data-action="request-doc">Ask client for missing</button>' +
      '<button class="btn btn-primary btn-sm" data-action="save">Mark lines resolved</button></div>';
  }

  function tabExceptions(c) {
    var level = c.status;
    return '<div class="exc-card" style="cursor:default"><div class="bar ' + level + '"></div><div>' +
      '<h4>' + esc(c.stage) + ' exception on ' + esc(c.type) + '</h4>' +
      '<p>Auto-scored <strong>' + esc(level).toUpperCase() + '</strong>. ' +
      (level === 'red' ? 'Routed to CA — professional judgment required.' :
        level === 'amber' ? 'Routed to staff queue — verify or escalate.' :
          'Green path — optional sample review only.') + '</p>' +
      '<div class="meta-row mt-8">' + statusBadge(level) + '<span class="badge badge-slate">' + esc(c.id) + '</span></div></div></div>' +
      '<div class="grid-2 mt-16">' +
      '<div class="card"><h3>Suggested next step</h3><p class="text-sm text-muted mt-8">' +
      (level === 'red' ? 'Open Review tab, record decision, clear or send back to staff.' :
        'Fix data / docs on Validation & Documents tabs, then mark resolved.') + '</p></div>' +
      '<div class="card"><h3>Escalation</h3><p class="text-sm text-muted mt-8">SLA clock running · Due ' + esc(c.due) + '. Breach auto-escalates Staff → Senior → CA.</p>' +
      '<button class="btn btn-sm btn-amber mt-8" data-action="escalate">Escalate now</button></div></div>';
  }

  function tabReview(c) {
    return '<div class="split-work"><div>' +
      '<div class="hint-box">Policy: AI may draft. Filing / notice reply / material exception / write-off require CA approval token.</div>' +
      '<div class="card mb-16"><h3>Review pack</h3>' +
      '<div class="detail-grid mt-16">' +
      '<div class="detail-item"><label>Computed liability</label><strong>' + esc(c.liability) + '</strong></div>' +
      '<div class="detail-item"><label>Credits</label><strong>' + esc(c.itc) + '</strong></div>' +
      '<div class="detail-item"><label>Payable / challan</label><strong>' + esc(c.cash) + '</strong></div>' +
      '<div class="detail-item"><label>Exception level</label><strong>' + statusBadge(c.status) + '</strong></div></div></div>' +
      '<div class="field"><label>CA / Staff notes</label><textarea placeholder="Decision rationale (stored in audit trail)…"></textarea></div>' +
      '</div><div class="action-rail"><h3>Decision</h3>' +
      '<button class="btn btn-primary btn-sm" data-action="approve-filing">Approve</button>' +
      '<button class="btn btn-outline btn-sm" data-action="save">Send back to staff</button>' +
      '<button class="btn btn-outline btn-sm" data-action="escalate">Hold — need more info</button>' +
      '<p class="text-sm text-muted mt-8">Decision is immutable in audit log.</p></div></div>';
  }

  function tabFiling(c) {
    return '<div class="detail-grid mb-16">' +
      '<div class="detail-item"><label>Portal</label><strong>' + (state.caseSvc.indexOf('gst') === 0 ? 'GST Portal' : state.caseSvc === 'tds' ? 'TRACES / Income Tax' : state.caseSvc === 'mca' ? 'MCA21' : state.caseSvc === 'itr' ? 'e-Filing' : 'Respective portal') + '</strong></div>' +
      '<div class="detail-item"><label>Pack status</label><strong>' + (c.status === 'green' ? 'Ready' : 'Blocked by exception') + '</strong></div>' +
      '<div class="detail-item"><label>Ack No.</label><strong>—</strong></div>' +
      '<div class="detail-item"><label>Filed at</label><strong>—</strong></div></div>' +
      '<button class="btn btn-primary btn-sm" data-action="file"' + (c.status === 'red' ? ' disabled style="opacity:.5"' : '') + '>Submit filing pack</button>' +
      '<button class="btn btn-outline btn-sm" data-action="save">Upload ack PDF</button>' +
      '<p class="text-sm text-muted mt-16">After ack: auto-archive to DMS → spawn billing → create next cycle.</p>';
  }

  function tabBilling(c) {
    return '<div class="card mb-16"><div class="amount-xl">' + (c.liability !== '—' && state.caseSvc === 'billing' ? esc(c.liability) : '₹ fee from Service Master') + '</div>' +
      '<p class="text-muted text-sm">Auto-invoice on archive / cycle close</p></div>' +
      '<div class="page-actions">' +
      '<button class="btn btn-primary btn-sm" data-action="generate-inv">Generate invoice</button>' +
      '<button class="btn btn-outline btn-sm" data-action="remind">Send payment link</button></div>';
  }

  function tabTimeline(c) {
    return '<div class="timeline">' + c.timeline.map(function (t) {
      return '<div class="tl-item"><strong>' + esc(t.e) + '</strong><span>' + esc(t.t) + ' · ' + esc(t.who) + '</span></div>';
    }).join('') + '<div class="tl-item muted"><strong>Awaiting next action</strong><span>Open</span></div></div>';
  }

  /* ===== CLIENT MASTER DETAIL ===== */
  function renderClientDetail() {
    var c = D.clients.find(function (x) { return x.id === state.clientId; }) || D.clients[0];
    return '<button class="back-link" type="button" data-go="clients">← Client Master</button>' +
      header(c.name, c.id + ' · PAN ' + c.pan + ' · GSTIN ' + c.gstin) +
      '<div class="grid-3 mb-16">' +
      '<div class="card"><h3>Primary contact</h3><p class="mt-8">' + esc(c.contact) + '<br>' + esc(c.phone) + '</p></div>' +
      '<div class="card"><h3>FY</h3><p class="mt-8">' + esc(c.fy) + '<br>Status: ' + statusBadge(c.status) + '</p></div>' +
      '<div class="card"><h3>Services</h3><div class="tag-row mt-8">' + c.services.map(function (s) { return '<span class="badge badge-teal">' + s + '</span>'; }).join('') + '</div></div>' +
      '</div>' +
      '<div class="panel"><div class="panel-head"><h2>Linked active workflows</h2></div>' +
      table(['Case', 'Service', 'Period', 'Status'], flattenCases().filter(function (x) { return x.clientId === c.id; }).map(function (x) {
        return ['<button type="button" style="color:var(--teal);font-weight:600" data-open-case="' + x.id + '" data-svc="' + x._svc + '">' + x.id + '</button>',
          esc(x.type), esc(x.period), statusBadge(x.status)];
      })) + '</div>';
  }

  function flattenCases() {
    var out = [];
    Object.keys(D.cases || {}).forEach(function (svc) {
      (D.cases[svc] || []).forEach(function (c) { out.push(Object.assign({ _svc: svc }, c)); });
    });
    return out;
  }

  /* ===== CA SCREENS ===== */
  function renderCA() {
    switch (state.view) {
      case 'home': return caHome();
      case 'approvals': return caApprovals();
      case 'exceptions': return exceptionsScreen('red');
      case 'deadlines': return caDeadlines();
      case 'clients': return clientsScreen();
      case 'filings': return filingsScreen();
      case 'workload': return workloadScreen();
      default: return caHome();
    }
  }

  function caHome() {
    return header('CA Home', 'Attention-only — services are separated screens on the left') +
      '<div class="kpi-row">' +
      kpi('Red now', '2', 'Needs judgment', 'alert-red', 'down') +
      kpi('Approvals', '4', 'Gates waiting', 'alert-amber') +
      kpi('Notices', '1', 'Mandatory CA', 'alert-red') +
      kpi('Auto-cleared', '47', 'Today Green', 'alert-green', 'up') +
      '</div>' +
      '<h3 class="mb-16" style="font-size:1.05rem">Jump into a service</h3>' +
      '<div class="svc-card-grid">' + D.serviceCatalog.map(function (s) {
        return '<button type="button" class="svc-tile" data-go="svc-' + s.id + '"><div class="svc-ico">' + s.ico + '</div><h3>' + esc(s.name) + '</h3><p>' + esc(s.desc) + '</p>' +
          '<div class="svc-stats"><span class="badge badge-slate">' + s.open + ' open</span>' +
          (s.red ? '<span class="badge badge-red">' + s.red + ' red</span>' : '') +
          (s.amber ? '<span class="badge badge-amber">' + s.amber + ' amber</span>' : '') +
          '</div></button>';
      }).join('') + '</div>' +
      '<div class="grid-2">' +
      '<div class="panel"><div class="panel-head"><h2>Red exceptions</h2></div><div class="exc-list">' +
      D.exceptions.filter(function (e) { return e.level === 'red'; }).map(exCard).join('') + '</div></div>' +
      '<div class="panel"><div class="panel-head"><h2>Ready for approval</h2></div><div class="exc-list">' +
      D.exceptions.filter(function (e) { return e.level === 'green'; }).map(exCard).join('') + '</div></div></div>';
  }

  function caApprovals() {
    return header('Approvals Queue', 'High-risk actions across all services') +
      '<div class="panel">' + table(['Item', 'Service', 'Client', 'Risk', ''], [
        ['GSTR-3B Sep draft ₹2.14L', 'GST Returns', 'Metro Retail', statusBadge('green'), '<button class="btn btn-sm btn-primary" data-open-case="WF-GST-8798" data-svc="gstReturns">Open</button>'],
        ['ITC mismatch treatment ₹1.24L', 'GST Returns', 'Aarav Traders', statusBadge('red'), '<button class="btn btn-sm btn-amber" data-open-case="WF-GST-8841" data-svc="gstReturns">Open</button>'],
        ['26Q challan shortfall ₹60k', 'TDS', 'Skyline', statusBadge('red'), '<button class="btn btn-sm btn-amber" data-open-case="WF-TDS-337" data-svc="tds">Open</button>'],
        ['143(2) reply draft', 'Notices', 'Skyline', statusBadge('red'), '<button class="btn btn-sm btn-danger" data-open-case="WF-NTC-08" data-svc="notices">Open</button>'],
        ['Fee write-off ₹4,000', 'Billing', 'GreenLeaf', statusBadge('amber'), '<button class="btn btn-sm btn-outline" data-action="save">Decide</button>']
      ]) + '</div>';
  }

  function caDeadlines() {
    return header('Deadlines & Risk', 'Firm-wide pressure across services') +
      '<div class="panel">' + table(['Date', 'Obligation', 'Clients', 'Risk', 'Service screen'],
        D.deadlines.map(function (d) {
          return [d.date, esc(d.item), String(d.count), statusBadge(d.risk),
            '<button class="btn btn-sm btn-outline" data-go="svc-gstReturns">Open</button>'];
        })) + '</div>';
  }

  function workloadScreen() {
    return header('Staff Workload', 'Capacity for assignment & escalation') +
      '<div class="panel">' + table(['Staff', 'Role', 'Queue', 'Done 30d', 'Load'], D.staff.map(function (s) {
        return [esc(s.name), esc(s.role), String(s.queue), String(s.done), s.load + '%'];
      })) + '</div>';
  }

  /* ===== STAFF ===== */
  function renderStaff() {
    switch (state.view) {
      case 'home': return staffHome();
      case 'exceptions': return exceptionsScreen('amber');
      case 'tasks': return staffTasks();
      case 'documents': return staffDocs();
      case 'comms': return staffComms();
      case 'clients': return clientsScreen();
      case 'recon-hub': return reconHub();
      default: return staffHome();
    }
  }

  function staffHome() {
    return header('My Queue', 'Work exceptions by service — open a service screen for full flow') +
      '<div class="kpi-row">' +
      kpi('Open', '14', 'Assigned to me', 'alert-teal') +
      kpi('Due today', '5', '2 high', 'alert-amber') +
      kpi('Waiting client', '6', 'Auto-remind on', 'alert-green', 'up') +
      kpi('Escalated', '1', 'To CA', 'alert-red') +
      '</div>' +
      '<div class="svc-card-grid">' + D.serviceCatalog.slice(0, 6).map(function (s) {
        return '<button type="button" class="svc-tile" data-go="svc-' + s.id + '"><div class="svc-ico">' + s.ico + '</div><h3>' + esc(s.name) + '</h3><p>Open service workspace</p>' +
          '<div class="svc-stats"><span class="badge badge-amber">' + s.amber + ' amber</span></div></button>';
      }).join('') + '</div>' +
      '<div class="panel"><div class="panel-head"><h2>Priority tasks today</h2></div>' +
      table(['Task', 'Client', 'Type', 'Due', ''], D.tasks.map(function (t) {
        return [esc(t.title), esc(t.client), esc(t.type), esc(t.due), statusBadge(t.status)];
      })) + '</div>';
  }

  function staffTasks() {
    return header('All Tasks', 'System-created across services') +
      '<div class="filters"><input class="search-box" placeholder="Search…" /><button class="filter-chip active" type="button">Open</button><button class="filter-chip" type="button">In Progress</button></div>' +
      '<div class="panel">' + table(['ID', 'Task', 'Client', 'Type', 'Due', 'Status'], D.tasks.map(function (t) {
        return [t.id, esc(t.title), esc(t.client), esc(t.type), esc(t.due), statusBadge(t.status)];
      })) + '</div>';
  }

  function staffDocs() {
    return header('Document Vault', 'Client → FY → Service structure') +
      '<div class="panel">' + table(['Document', 'Client', 'Status', 'AI'], D.documents.map(function (d) {
        return [esc(d.name), esc(d.client), statusBadge(d.status === 'Verified' ? 'green' : 'amber'), esc(d.ai)];
      })) + '</div>';
  }

  function staffComms() {
    return header('WhatsApp / Email', 'Template sends — every message logged') +
      '<div class="grid-2"><div class="panel"><div class="panel-head"><h2>Aarav Traders thread</h2></div><div class="panel-body pad">' +
      '<div class="msg-thread">' +
      '<div class="msg out">GSTR-3B Sep needs 7 purchase invoices. Upload to portal please.<span class="time">08:15</span></div>' +
      '<div class="msg in">Sending 5 today, 2 tomorrow.<span class="time">09:02</span></div>' +
      '<div class="msg out">Marked 2 Waiting Client. Auto-reminder tomorrow 10 AM.<span class="time">09:05</span></div>' +
      '</div><button class="btn btn-primary btn-sm mt-16" data-action="remind">Send template</button></div></div>' +
      '<div class="card"><h3>Automation ladder</h3><ul style="list-style:disc;margin-left:18px;font-size:.9rem;color:var(--slate);margin-top:10px">' +
      '<li>D−7 soft reminder</li><li>D−3 checklist</li><li>D−1 urgent</li><li>Overdue → staff task</li><li>D+5 → CA risk</li></ul></div></div>';
  }

  function reconHub() {
    return header('Recon Hub', 'Cross-service mismatches — drill into case') +
      '<div class="panel">' + table(['Case', 'Service', 'Issue', 'Flag', ''], [
        ['WF-GST-8841', 'GST', 'ITC mismatch ₹1.24L', statusBadge('red'), '<button class="btn btn-sm btn-primary" data-open-case="WF-GST-8841" data-svc="gstReturns">Open</button>'],
        ['WF-GST-8815', 'GST', 'B2B count variance 3', statusBadge('amber'), '<button class="btn btn-sm btn-outline" data-open-case="WF-GST-8815" data-svc="gstReturns">Open</button>'],
        ['WF-TDS-337', 'TDS', 'Challan shortfall ₹60k', statusBadge('red'), '<button class="btn btn-sm btn-primary" data-open-case="WF-TDS-337" data-svc="tds">Open</button>'],
        ['WF-BK-512', 'Books', 'Unmatched bank lines', statusBadge('amber'), '<button class="btn btn-sm btn-outline" data-open-case="WF-BK-512" data-svc="books">Open</button>']
      ]) + '</div>';
  }

  /* ===== CLIENT PORTAL ===== */
  function renderClient() {
    switch (state.view) {
      case 'home': return clientHome();
      case 'pending': return clientPending();
      case 'upload': return clientUpload();
      case 'c-gst': return clientService('GST Returns', 'Sep 2025', 'Docs pending', 'WF-GST-8841', 'gstReturns');
      case 'c-books': return clientService('Bookkeeping', 'Sep 2025', 'In review', 'WF-BK-512', 'books');
      case 'c-tds': return clientService('TDS', 'Q2', 'Challan paid', null, null);
      case 'c-dsc': return clientService('DSC Renewal', 'Token', 'KYC pending', 'WF-DSC-77', 'dsc');
      case 'c-status': return clientStatus();
      case 'approvals': return clientApprovals();
      case 'filings': return clientFilings();
      case 'invoices': return clientInvoices();
      case 'messages': return staffComms();
      default: return clientHome();
    }
  }

  function clientHome() {
    return '<div class="portal-hero"><div><h1>Welcome, Ravi</h1><p>Aarav Traders · CL-00421 · FY 2025-26</p></div>' +
      '<button class="btn btn-primary" data-go="upload">Upload documents</button></div>' +
      '<div class="status-cards">' +
      '<button class="status-card" type="button" data-go="c-gst" style="text-align:left;cursor:pointer"><h3>GST Returns</h3><div class="progress-bar"><div class="fill" style="width:70%"></div></div><p class="text-sm text-muted">Sep · 2 docs pending — tap for detail</p></button>' +
      '<button class="status-card" type="button" data-go="c-books" style="text-align:left;cursor:pointer"><h3>Bookkeeping</h3><div class="progress-bar"><div class="fill" style="width:90%"></div></div><p class="text-sm text-muted">Sep · almost done</p></button>' +
      '<button class="status-card" type="button" data-go="invoices" style="text-align:left;cursor:pointer"><h3>Billing</h3><p class="mt-8"><strong>₹0</strong> outstanding</p></button>' +
      '</div>' +
      '<div class="panel"><div class="panel-head"><h2>Pending from you</h2><button class="btn btn-sm btn-outline" data-go="pending">View all</button></div><div class="panel-body pad">' +
      clientPendingList() + '</div></div>';
  }

  function clientPendingList() {
    return '<div class="check-list">' +
      '<div class="check-item missing"><div class="ck">!</div><div class="ck-info"><strong>7 purchase invoices (GST ITC)</strong><span>Requested today</span></div><button class="btn btn-sm btn-primary" data-go="upload">Upload</button></div>' +
      '<div class="check-item missing"><div class="ck">!</div><div class="ck-info"><strong>Confirm nil ISD Sep</strong><span>Approval</span></div><button class="btn btn-sm btn-outline" data-action="approve-filing">Confirm</button></div>' +
      '<div class="check-item done"><div class="ck">✓</div><div class="ck-info"><strong>Bank statement Aug</strong><span>Verified</span></div></div></div>';
  }

  function clientPending() {
    return header('Pending from Me', 'Everything blocking your compliance') +
      '<div class="panel"><div class="panel-body pad">' + clientPendingList() + '</div></div>';
  }

  function clientUpload() {
    return header('Upload Centre', 'Files go to the correct service vault') +
      '<div class="field mb-16" style="max-width:320px"><label>Link to service</label><select><option>GST Returns — Sep 2025</option><option>Bookkeeping — Sep</option><option>DSC Renewal</option><option>General</option></select></div>' +
      '<div class="upload-zone" id="uploadZone"><strong>Drop files or click</strong><span>PDF, images, ZIP</span></div>';
  }

  function clientService(name, period, status, caseId, svc) {
    return header(name, period + ' · ' + status) +
      '<div class="card mb-16"><p class="text-sm text-muted">Your view of this service. Firm staff see the full workspace behind the scenes.</p>' +
      '<div class="progress-bar mt-16"><div class="fill" style="width:70%"></div></div>' +
      '<p class="text-sm mt-8">Status: <strong>' + esc(status) + '</strong></p>' +
      (caseId ? '<button class="btn btn-outline btn-sm mt-16" data-go="pending">What you need to do</button>' : '') +
      '</div>' + clientPendingList();
  }

  function clientStatus() {
    return header('All Compliance Status', 'Every service this FY') +
      '<div class="panel">' + table(['Service', 'Period', 'Status', ''], [
        ['GST Returns', 'Sep 2025', statusBadge('amber'), '<button class="btn btn-sm btn-outline" data-go="c-gst">Open</button>'],
        ['Bookkeeping', 'Sep 2025', statusBadge('blue'), '<button class="btn btn-sm btn-outline" data-go="c-books">Open</button>'],
        ['TDS', 'Q2', statusBadge('green'), '<button class="btn btn-sm btn-outline" data-go="c-tds">Open</button>'],
        ['DSC', 'Token', statusBadge('amber'), '<button class="btn btn-sm btn-outline" data-go="c-dsc">Open</button>']
      ]) + '</div>';
  }

  function clientApprovals() {
    return header('Approvals', 'Confirmations requested by your CA firm') +
      '<div class="panel"><div class="panel-body pad"><div class="exc-card" style="cursor:default"><div class="bar amber"></div><div><h4>Confirm nil ISD — Sep 2025</h4><p>No ISD invoices this month?</p></div>' +
      '<div class="exc-actions"><button class="btn btn-primary btn-sm" data-action="approve-filing">Confirm</button></div></div></div></div>';
  }

  function clientFilings() {
    return header('Filings & Reports', 'Download acknowledgements') +
      '<div class="panel">' + table(['Document', 'Period', 'Filed', ''], [
        ['GSTR-3B Ack', 'Aug 2025', '12 Sep', '<button class="btn btn-sm btn-outline" data-action="pay">PDF</button>'],
        ['GSTR-1 Ack', 'Aug 2025', '10 Sep', '<button class="btn btn-sm btn-outline" data-action="pay">PDF</button>']
      ]) + '</div>';
  }

  function clientInvoices() {
    return header('Invoices & Pay', 'Pay online · receipts auto-saved') +
      '<div class="panel">' + table(['Invoice', 'Service', 'Amount', 'Status'], [
        ['INV-2025-0841', 'GST+Books Sep', '₹18,500', statusBadge('green')],
        ['INV-2025-0790', 'GST Aug', '₹12,000', statusBadge('green')]
      ]) + '</div>';
  }

  /* ===== ADMIN ===== */
  function renderAdmin() {
    switch (state.view) {
      case 'home': return adminHome();
      case 'users': return adminUsers();
      case 'services': return adminServices();
      case 'workflows': return adminWorkflows();
      case 'rules': return adminRules();
      case 'tally': return adminTally();
      case 'templates': return adminTemplates();
      case 'payments': return adminPayments();
      case 'ai': return adminAI();
      case 'security': return adminSecurity();
      case 'auditlog': return adminAudit();
      case 'backups': return adminBackups();
      default: return adminHome();
    }
  }

  function adminHome() {
    return header('Admin Home', 'Configure services, rules, integrations, security') +
      '<div class="kpi-row">' +
      kpi('Clients', '412', 'Pilot 42', 'alert-teal', 'up') +
      kpi('Services live', '10', 'All configured', 'alert-teal') +
      kpi('MFA', '6/6', 'Staff', 'alert-green', 'up') +
      kpi('Sync errors', '1', 'Tally', 'alert-amber') +
      '</div>' +
      '<div class="svc-card-grid">' +
      [['users', 'Users & Roles', 'RBAC'], ['services', 'Service Master', 'Fees & SLA'], ['workflows', 'Workflow Designer', 'Lifecycle'], ['rules', 'Exception Rules', 'G/A/R'], ['tally', 'Tally Sync', 'Integration'], ['security', 'Security', 'MFA & audit']].map(function (x) {
        return '<button type="button" class="svc-tile" data-go="' + x[0] + '"><div class="svc-ico">' + x[1].slice(0, 2).toUpperCase() + '</div><h3>' + x[1] + '</h3><p>' + x[2] + '</p></button>';
      }).join('') + '</div>';
  }

  function adminUsers() {
    return header('Users & Roles', 'RBAC + client assignments') +
      '<div class="panel">' + table(['User', 'Role', 'Clients', 'MFA', 'Status'], [
        ['CA R. Sharma', 'Partner', 'All', 'On', statusBadge('green')],
        ['Neha Gupta', 'Senior Associate', '48', 'On', statusBadge('green')],
        ['Rahul Verma', 'Associate', '36', 'On', statusBadge('green')],
        ['Client portal', 'Client', '1 each', 'OTP', '<span class="badge badge-blue">412</span>']
      ]) + '</div>';
  }

  function adminServices() {
    return header('Service Master', 'One row per productized service') +
      '<div class="panel">' + table(['Code', 'Service', 'Frequency', 'CA gate', 'SLA', ''], D.serviceCatalog.map(function (s) {
        return [s.code, esc(s.name), 'Configured', 'Yes', s.due,
          '<button class="btn btn-sm btn-outline" data-go="svc-' + s.id + '">Preview UI</button>'];
      })) + '</div>';
  }

  function adminWorkflows() {
    return header('Workflow Designer', 'Shared lifecycle — configured per service') +
      lifeSteps(4) +
      '<div class="card mt-16"><h3>Per-service overrides</h3><p class="text-sm text-muted mt-8">Doc checklist, SLA hours, escalation ladder, CA gate flags, next-cycle cron.</p>' +
      '<button class="btn btn-primary btn-sm mt-16" data-action="save">Save workflow</button></div>';
  }

  function adminRules() {
    return header('Exception Rules', 'Green / Amber / Red thresholds') +
      '<div class="panel">' + table(['Rule', 'Service', 'Condition', 'Level'], [
        ['ITC_MISMATCH', 'GST', 'Diff > ₹50,000 or > 2%', statusBadge('red')],
        ['OCR_LOW', 'All', 'Confidence < 75%', statusBadge('amber')],
        ['CHALLAN_SHORT', 'TDS', 'Paid < Liability', statusBadge('red')],
        ['DOC_MISSING', 'All', 'Checklist incomplete at D−3', statusBadge('amber')],
        ['NOTICE_ANY', 'Notices', 'Any inbound notice', statusBadge('red')],
        ['PERFECT_MATCH', 'GST', '100% recon match', statusBadge('green')]
      ]) + '</div>';
  }

  function adminTally() {
    return header('Tally Integration', 'Connector agent + sync jobs') +
      '<div class="grid-2"><div class="card"><h3>Status</h3><div class="detail-grid mt-16">' +
      '<div class="detail-item"><label>Last sync</label><strong>Today 06:00</strong></div>' +
      '<div class="detail-item"><label>Linked</label><strong>38 / 42 pilot</strong></div>' +
      '<div class="detail-item"><label>Errors</label><strong>1 offline</strong></div>' +
      '<div class="detail-item"><label>Mode</label><strong>Import + Export</strong></div></div>' +
      '<button class="btn btn-primary btn-sm mt-16" data-action="sync">Run sync</button></div>' +
      '<div class="card"><h3>Entities</h3><ul style="list-style:disc;margin-left:18px;font-size:.9rem;color:var(--slate);margin-top:10px">' +
      '<li>Ledgers & groups</li><li>Vouchers</li><li>GST fields</li><li>Approved drafts → Tally</li></ul></div></div>';
  }

  function adminTemplates() {
    return header('Comms Templates', 'WhatsApp Business + Email') +
      '<div class="panel">' + table(['Template', 'Channel', 'Trigger', 'Status'], [
        ['doc_request_v3', 'WhatsApp', 'Missing checklist', statusBadge('green')],
        ['reminder_d3', 'WhatsApp', 'D−3', statusBadge('green')],
        ['filing_done', 'Email+WA', 'Ack stored', statusBadge('green')],
        ['payment_remind', 'WhatsApp', 'Invoice ageing', statusBadge('green')],
        ['approval_request', 'WhatsApp', 'Client confirm', statusBadge('amber')]
      ]) + '</div>';
  }

  function adminPayments() {
    return header('Payment Gateway', 'Links on invoices · webhooks → receipts') +
      '<div class="card"><p class="text-sm text-muted">Razorpay / PayU style integration. On payment: receipt PDF → DMS, invoice Paid, WhatsApp thanks, outstanding cleared.</p>' +
      '<button class="btn btn-primary btn-sm mt-16" data-action="save">Save gateway keys</button></div>';
  }

  function adminAI() {
    return header('AI / OCR Settings', 'Assist only — never auto-file') +
      '<div class="grid-2"><div class="card"><h3>Thresholds</h3><div class="form-grid mt-16">' +
      '<div class="field"><label>OCR auto-accept confidence</label><input value="85%" /></div>' +
      '<div class="field"><label>Amber band</label><input value="70–84%" /></div>' +
      '<div class="field"><label>Notice auto-classify</label><select><option>On</option></select></div>' +
      '<div class="field"><label>Auto-filing</label><select><option>Blocked (mandatory)</option></select></div></div>' +
      '<button class="btn btn-primary btn-sm mt-16" data-action="save">Save</button></div>' +
      '<div class="card"><h3>Capabilities</h3><ul style="list-style:disc;margin-left:18px;font-size:.9rem;color:var(--slate);margin-top:10px">' +
      '<li>Document classification</li><li>Field extraction</li><li>Anomaly flags</li><li>Notice analysis</li><li>Draft replies (CA approve)</li></ul></div></div>';
  }

  function adminSecurity() {
    return header('Security & MFA', 'BRD §7 controls') +
      '<div class="grid-2"><div class="card"><h3>Controls</h3><ul style="list-style:disc;margin-left:18px;font-size:.9rem;color:var(--slate);margin-top:10px">' +
      '<li>RBAC Partner / Staff / Client / Admin</li><li>Client-level isolation</li><li>MFA internal users</li>' +
      '<li>TLS + encryption at rest</li><li>CA gates on high-risk</li><li>AI filing blocked</li></ul></div>' +
      '<div class="card"><h3>Session policy</h3><p class="text-sm text-muted mt-8">Idle timeout 30 min · MFA every 12h for Partner · IP allowlist optional.</p></div></div>';
  }

  function adminAudit() {
    return header('Audit Log', 'Immutable who / what / when') +
      '<div class="panel">' + table(['When', 'Actor', 'Action', 'Entity'], [
        ['Today 11:02', 'CA R. Sharma', 'Approved filing draft', 'WF-GST-8798'],
        ['Today 10:44', 'Neha Gupta', 'Viewed document', 'NovaTech batch'],
        ['Today 08:15', 'System', 'WhatsApp doc_request', 'CL-00421'],
        ['Yesterday', 'Admin', 'Updated SLA', 'GST-RET']
      ]) + '</div>';
  }

  function adminBackups() {
    return header('Backups', 'Automated encrypted snapshots') +
      '<div class="card"><div class="detail-grid">' +
      '<div class="detail-item"><label>Last backup</label><strong>Today 02:00</strong></div>' +
      '<div class="detail-item"><label>Retention</label><strong>30 daily / 12 monthly</strong></div>' +
      '<div class="detail-item"><label>Last restore drill</label><strong>01 Sep — OK</strong></div>' +
      '<div class="detail-item"><label>Encryption</label><strong>AES-256</strong></div></div>' +
      '<button class="btn btn-outline btn-sm mt-16" data-action="save">Run backup now</button></div>';
  }

  /* ===== SHARED LIST HELPERS ===== */
  function exceptionsScreen(level) {
    var list = D.exceptions.filter(function (e) { return e.level === level; });
    return header(level === 'red' ? 'Red Exceptions' : 'Amber Exceptions', 'Across all services — open linked case for full flow') +
      '<div class="panel"><div class="exc-list">' + list.map(exCard).join('') + '</div></div>' +
      '<p class="text-sm text-muted mt-16">Tip: use Services in the sidebar for separated GST / TDS / ITR / … screens.</p>';
  }

  function exCard(ex) {
    var svcMap = { 'GST Returns': 'gstReturns', 'GSTR-3B': 'gstReturns', 'GSTR-1': 'gstReturns', GST: 'gstReturns', TDS: 'tds', Bookkeeping: 'books', ITR: 'itr' };
    var svc = svcMap[ex.workflow] || svcMap[ex.service] || 'gstReturns';
    var caseId = (D.cases[svc] || []).filter(function (c) { return c.clientId === ex.clientId; })[0];
    return '<div class="exc-card"><div class="bar ' + ex.level + '"></div><div data-ex="' + ex.id + '" style="cursor:pointer">' +
      '<h4>' + esc(ex.title) + '</h4><p>' + esc(ex.client) + ' · ' + esc(ex.service) + ' · ' + esc(ex.due) + '</p>' +
      '<div class="meta-row">' + statusBadge(ex.level) + '<span class="badge badge-slate">' + esc(ex.sla) + '</span></div></div>' +
      '<div class="exc-actions">' +
      (caseId ? '<button class="btn btn-sm btn-primary" data-open-case="' + caseId.id + '" data-svc="' + svc + '">Case</button>' : '') +
      '<button class="btn btn-sm btn-outline" data-ex="' + ex.id + '">Detail</button></div></div>';
  }

  function clientsScreen() {
    return header('Client Master', 'Single source of truth — open a client for full profile') +
      '<div class="filters"><input class="search-box" placeholder="Name, PAN, GSTIN…" /><button class="filter-chip active" type="button">Active</button></div>' +
      '<div class="panel">' + table(['Client', 'IDs', 'Services', ''], D.clients.map(function (c) {
        return ['<div class="client-cell">' + esc(c.name) + '<small>' + c.id + ' · ' + esc(c.contact) + '</small></div>',
          '<small>' + c.pan + '<br>' + c.gstin + '</small>',
          c.services.map(function (s) { return '<span class="badge badge-teal">' + s + '</span> '; }).join(''),
          '<button class="btn btn-sm btn-outline" data-open-client="' + c.id + '">Open</button>'];
      })) + '</div>';
  }

  function filingsScreen() {
    return header('Filings Vault', 'Acknowledgements stored per client / FY / service') +
      '<div class="panel">' + table(['Filing', 'Client', 'Period', 'Status', 'Ack'], [
        ['GSTR-3B', 'Dr. Mehta Clinic', 'Aug 2025', statusBadge('green'), 'AB123…901'],
        ['GSTR-1', 'GreenLeaf Agro', 'Aug 2025', statusBadge('green'), 'AB123…902'],
        ['GSTR-3B', 'Metro Retail', 'Sep 2025', statusBadge('amber'), '—'],
        ['26Q', 'Skyline', 'Q2', statusBadge('red'), '—']
      ]) + '</div>';
  }

  /* ===== INIT ===== */
  qs('#roleSwitch').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-role]');
    if (btn) setRole(btn.getAttribute('data-role'));
  });
  qs('#sideNav').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-view]');
    if (!btn) return;
    state.caseId = null;
    state.caseSvc = null;
    go(btn.getAttribute('data-view'));
  });

  var params = new URLSearchParams(location.search);
  var role = params.get('role');
  if (role && roles[role]) state.role = role;
  var view = params.get('view');
  setRole(state.role);
  if (view) go(view);
})();
