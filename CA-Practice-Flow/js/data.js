/* Demo data for CA Practice Automation Platform */
window.CAData = {
  firm: {
    name: 'Sharma & Associates',
    tagline: 'CA Practice Automation Platform',
    clients: 412,
    staff: 6,
    targetClients: '600–800',
    targetStaff: '3–4'
  },

  clients: [
    { id: 'CL-00421', name: 'Aarav Traders Pvt Ltd', pan: 'AABCA1234D', gstin: '07AABCA1234D1Z5', services: ['GST', 'Bookkeeping', 'TDS'], status: 'Active', fy: '2025-26', contact: 'Ravi Mehta', phone: '+91 98765 43210' },
    { id: 'CL-00388', name: 'NovaTech Solutions', pan: 'AABCN9988F', gstin: '27AABCN9988F1Z2', services: ['GST', 'ITR', 'Audit'], status: 'Active', fy: '2025-26', contact: 'Priya Shah', phone: '+91 98111 22334' },
    { id: 'CL-00201', name: 'GreenLeaf Agro', pan: 'AABCG5566H', gstin: '09AABCG5566H1Z8', services: ['GST', 'TDS'], status: 'Active', fy: '2025-26', contact: 'Suresh Yadav', phone: '+91 99001 11223' },
    { id: 'CL-00512', name: 'Metro Retail LLP', pan: 'AABCM7788K', gstin: '07AABCM7788K1Z1', services: ['GST', 'Bookkeeping', 'ITR'], status: 'Active', fy: '2025-26', contact: 'Anita Kapoor', phone: '+91 98222 33445' },
    { id: 'CL-00156', name: 'Skyline Constructions', pan: 'AABCS3344P', gstin: '06AABCS3344P1Z9', services: ['GST', 'TDS', 'Audit', 'MCA'], status: 'Active', fy: '2025-26', contact: 'Vikram Singh', phone: '+91 98770 55667' },
    { id: 'CL-00490', name: 'Dr. Mehta Clinic', pan: 'AABCD1122Q', gstin: '—', services: ['ITR', 'TDS'], status: 'Active', fy: '2025-26', contact: 'Dr. Anil Mehta', phone: '+91 98100 77889' }
  ],

  exceptions: [
    { id: 'EX-8841', level: 'red', client: 'Aarav Traders Pvt Ltd', clientId: 'CL-00421', service: 'GSTR-3B', title: 'ITC mismatch ₹1.24L — GSTR-2B vs Books', desc: 'Purchase invoices in Tally exceed GSTR-2B by ₹1,24,380. Auto-reconcile failed for 7 invoices.', due: 'Today', assignee: 'CA Review', sla: 'Overdue 6h', workflow: 'GST Returns' },
    { id: 'EX-8837', level: 'red', client: 'Skyline Constructions', clientId: 'CL-00156', service: 'TDS', title: '26Q challan shortfall — Q2', desc: 'Form 26Q liability ₹4.8L; challan paid ₹4.2L. Difference ₹60,000 needs CA confirmation.', due: 'Tomorrow', assignee: 'CA Review', sla: '8h left', workflow: 'TDS Returns' },
    { id: 'EX-8829', level: 'amber', client: 'NovaTech Solutions', clientId: 'CL-00388', service: 'GST', title: 'E-invoice PDF unclear — OCR confidence 62%', desc: 'AI extracted invoice #INV-2409 but GSTIN digit ambiguous. Staff verification required.', due: '2 days', assignee: 'Staff: Neha', sla: 'On track', workflow: 'GST Returns' },
    { id: 'EX-8821', level: 'amber', client: 'Metro Retail LLP', clientId: 'CL-00512', service: 'Bookkeeping', title: 'Bank statement missing — Sep 2025', desc: 'HDFC xx4521 statement not uploaded. Auto-reminder sent 2× via WhatsApp.', due: '3 days', assignee: 'Staff: Rahul', sla: 'On track', workflow: 'Bookkeeping' },
    { id: 'EX-8815', level: 'amber', client: 'GreenLeaf Agro', clientId: 'CL-00201', service: 'GSTR-1', title: 'B2B invoice count variance', desc: 'Portal shows 142 B2B invoices; Tally export has 139. Diff of 3 needs mapping.', due: 'Today', assignee: 'Staff: Neha', sla: '4h left', workflow: 'GST Returns' },
    { id: 'EX-8802', level: 'green', client: 'Dr. Mehta Clinic', clientId: 'CL-00490', service: 'ITR', title: 'Form 16 extracted — auto validated', desc: 'OCR + PAN match OK. TDS credit ₹1.8L reconciled with Form 26AS. Ready for review pack.', due: '—', assignee: 'Auto', sla: 'Done', workflow: 'ITR' },
    { id: 'EX-8798', level: 'green', client: 'Metro Retail LLP', clientId: 'CL-00512', service: 'GSTR-3B', title: 'Return drafted — awaiting approval', desc: 'Liability ₹2.14L computed from Tally + portal. No exceptions. CA can approve filing.', due: '2 days', assignee: 'CA Approve', sla: 'On track', workflow: 'GST Returns' }
  ],

  tasks: [
    { id: 'TK-1201', title: 'Verify OCR invoice INV-2409', client: 'NovaTech Solutions', priority: 'High', due: 'Today 5 PM', type: 'Exception', status: 'Open' },
    { id: 'TK-1202', title: 'Follow up bank statement Sep', client: 'Metro Retail LLP', priority: 'Medium', due: 'Tomorrow', type: 'Document', status: 'Open' },
    { id: 'TK-1203', title: 'Map 3 missing B2B invoices', client: 'GreenLeaf Agro', priority: 'High', due: 'Today 2 PM', type: 'Reconciliation', status: 'In Progress' },
    { id: 'TK-1204', title: 'Prepare ITR computation pack', client: 'Dr. Mehta Clinic', priority: 'Medium', due: 'Fri', type: 'Preparation', status: 'Open' },
    { id: 'TK-1205', title: 'DSC renewal — upload token receipt', client: 'Aarav Traders Pvt Ltd', priority: 'Low', due: 'Next week', type: 'DSC', status: 'Waiting Client' },
    { id: 'TK-1198', title: 'Post Tally vouchers — week 38', client: 'Metro Retail LLP', priority: 'Medium', due: 'Today', type: 'Bookkeeping', status: 'In Progress' }
  ],

  deadlines: [
    { date: '28 Sep', item: 'GSTR-3B — Sep (monthly clients)', count: 86, risk: 'amber' },
    { date: '30 Sep', item: 'TDS Q2 challan deadline', count: 42, risk: 'red' },
    { date: '10 Oct', item: 'GSTR-1 — Sep', count: 94, risk: 'green' },
    { date: '31 Oct', item: 'ITR filing (non-audit)', count: 118, risk: 'amber' },
    { date: '15 Nov', item: 'DSC renewals due', count: 7, risk: 'green' }
  ],

  invoices: [
    { id: 'INV-2025-0841', client: 'Aarav Traders Pvt Ltd', amount: '₹18,500', status: 'Paid', due: '—', service: 'GST+Books Sep' },
    { id: 'INV-2025-0842', client: 'NovaTech Solutions', amount: '₹32,000', status: 'Pending', due: '28 Sep', service: 'GST+ITR retainer' },
    { id: 'INV-2025-0843', client: 'GreenLeaf Agro', amount: '₹12,000', status: 'Overdue', due: '15 Sep', service: 'GST Sep' },
    { id: 'INV-2025-0844', client: 'Metro Retail LLP', amount: '₹22,500', status: 'Sent', due: '30 Sep', service: 'Books+GST Sep' },
    { id: 'INV-2025-0845', client: 'Skyline Constructions', amount: '₹85,000', status: 'Pending', due: '05 Oct', service: 'Audit advance' }
  ],

  documents: [
    { name: 'GSTR-2B_Sep2025.pdf', type: 'PDF', client: 'Aarav Traders', status: 'Classified', ai: 'GST Portal' },
    { name: 'Purchase_Invoices_Batch.zip', type: 'ZIP', client: 'NovaTech', status: 'OCR Running', ai: '7/12 done' },
    { name: 'HDFC_Statement_Aug.pdf', type: 'PDF', client: 'Metro Retail', status: 'Verified', ai: 'Bank' },
    { name: 'Form16_FY25.pdf', type: 'PDF', client: 'Dr. Mehta', status: 'Extracted', ai: 'ITR ready' },
    { name: 'Notice_u_s_1432.pdf', type: 'PDF', client: 'Skyline', status: 'Analyzed', ai: 'Notice' }
  ],

  staff: [
    { name: 'Neha Gupta', role: 'Senior Associate', queue: 14, done: 38, load: 72 },
    { name: 'Rahul Verma', role: 'Associate', queue: 11, done: 29, load: 65 },
    { name: 'Pooja Nair', role: 'Associate', queue: 9, done: 41, load: 58 },
    { name: 'Amit Joshi', role: 'Junior', queue: 7, done: 22, load: 48 },
    { name: 'Sneha Rao', role: 'Junior', queue: 6, done: 19, load: 44 },
    { name: 'CA R. Sharma', role: 'Partner', queue: 5, done: 12, load: 35 }
  ],

  workflows: [
    {
      id: 'gst-reg',
      name: 'GST Registration',
      trigger: 'New client / service activation',
      docs: ['PAN', 'Aadhaar', 'Address proof', 'Bank proof', 'Photo', 'Authorization'],
      auto: ['Checklist creation', 'Doc request WhatsApp', 'OCR validation of PAN/Aadhaar', 'Draft FORM GST REG-01 fields', 'Status tracking'],
      exceptions: ['Name mismatch OCR', 'Address incomplete', 'Aadhaar-PAN link fail'],
      caRole: 'Final review before submission; digital signature approval'
    },
    {
      id: 'gst-returns',
      name: 'GST Returns & Reconciliation',
      trigger: 'Calendar (monthly/quarterly) + Tally sync',
      docs: ['Purchase invoices', 'Sales register', 'GSTR-2B', 'E-invoices', 'Credit notes'],
      auto: ['Pull Tally data', 'Fetch GSTR-2B', '3-way reconcile', 'Draft GSTR-1/3B', 'Remind missing docs', 'Flag ITC mismatches'],
      exceptions: ['ITC mismatch > threshold', 'Missing invoices', 'HSN anomalies', 'Nil return confirmation'],
      caRole: 'Approve Amber→Red escalations; final filing approval for material clients'
    },
    {
      id: 'books',
      name: 'Bookkeeping',
      trigger: 'Recurring weekly/monthly cycle',
      docs: ['Bank statements', 'Invoices', 'Expense bills', 'Payroll sheet'],
      auto: ['Doc collection reminders', 'OCR → draft vouchers', 'Bank reconciliation suggestions', 'Exception queue for unmatched'],
      exceptions: ['Unmatched bank lines', 'Duplicate invoices', 'Missing GSTIN on B2B'],
      caRole: 'Month-end review for material clients; policy exceptions'
    },
    {
      id: 'tds',
      name: 'TDS Returns',
      trigger: 'Quarterly calendar + payroll/events',
      docs: ['Salary register', 'Vendor payments', 'Challans', 'PAN list'],
      auto: ['Compute liability', 'Match challans', 'Draft 24Q/26Q', 'Remind challan payment', 'Validate PANs'],
      exceptions: ['Challan shortfall', 'Invalid PAN', 'Section mismatch'],
      caRole: 'Approve returns; decide on late fee / interest treatment'
    },
    {
      id: 'itr',
      name: 'Income Tax Returns',
      trigger: 'FY close + client service calendar',
      docs: ['Form 16/16A', '26AS/AIS', 'Books summary', 'Investments', 'Capital gains'],
      auto: ['OCR Form 16', 'Pull AIS mismatch list', 'Draft computation', 'Checklist chase', 'Refund status notify'],
      exceptions: ['AIS mismatch', 'Capital gains docs missing', 'High refund risk'],
      caRole: 'Computation sign-off; ITR filing approval; advisory notes'
    },
    {
      id: 'audit',
      name: 'Tax / Statutory Audit',
      trigger: 'Engagement letter + FY milestones',
      docs: ['Trial balance', 'Ledgers', 'Confirmations', 'Fixed assets', 'Minutes'],
      auto: ['PBC checklist', 'Sample selection flags', 'Deadline tracker', 'Query log', 'Draft FS packing'],
      exceptions: ['Material variance', 'Missing confirmations', 'Related party gaps'],
      caRole: 'Audit opinion; CARO/key matters; partner sign-off'
    },
    {
      id: 'dsc',
      name: 'DSC Renewal',
      trigger: 'Expiry −60 / −30 / −7 days',
      docs: ['Existing DSC details', 'KYC', 'Photo', 'Authorization'],
      auto: ['Expiry alerts', 'Vendor form prep', 'Payment link', 'Token shipping track'],
      exceptions: ['KYC reject', 'Name change', 'Payment fail'],
      caRole: 'Authorize renewals for firm-held tokens'
    },
    {
      id: 'mca',
      name: 'MCA / Other Registrations',
      trigger: 'Client request / statutory event',
      docs: ['MOA/AOA', 'DIR forms KYC', 'Board resolutions', 'Address proofs'],
      auto: ['Form checklist', 'Deadline (AOC-4, MGT-7)', 'Doc chase', 'Ack archive'],
      exceptions: ['DSC of director expired', 'SRN payment fail', 'Resubmission'],
      caRole: 'Form review; certification where required'
    },
    {
      id: 'notices',
      name: 'Notices / Compliance',
      trigger: 'Email/portal ingest or client upload',
      docs: ['Notice PDF', 'Prior filings', 'Supportledgers'],
      auto: ['Classify notice type', 'Extract due date', 'Draft reply outline', 'Assign owner', 'Escalate to CA'],
      exceptions: ['High-risk demand', 'Short deadline <7 days', 'Prosecution notice'],
      caRole: 'All notice strategy & final response approval (mandatory)'
    },
    {
      id: 'billing',
      name: 'Billing & Collections',
      trigger: 'Workflow completion / retainer schedule',
      docs: ['Engagement terms', 'Timesheet (optional)', 'Payment proof'],
      auto: ['Generate invoice', 'Payment link', 'Reminders D+3/7/15', 'Receipt', 'Next cycle'],
      exceptions: ['Payment bounce', 'Dispute', 'Write-off request'],
      caRole: 'Approve discounts, write-offs, special fee arrangements'
    }
  ],

  modules: [
    { id: 'client', name: 'Client Master', brief: 'Single source of truth for every client', points: ['Unique Client ID', 'PAN / GSTIN / TAN / CIN', 'Contacts & authorized persons', 'Services subscribed', 'Compliance calendar', 'Billing profile', 'Document vault link', 'Full history & notes'] },
    { id: 'service', name: 'Service Master', brief: 'Configurable productized compliance services', points: ['GST, TDS, ITR, Books, Audit, DSC, MCA', 'SLA & fee templates', 'Doc checklists per service', 'Frequency & due-date rules', 'CA approval gates'] },
    { id: 'workflow', name: 'Workflow Engine', brief: 'Event-driven task factory', points: ['Auto task creation', 'Dependencies & gates', 'SLA clocks', 'Escalation ladders', 'Status machine', 'Next-cycle spawn'] },
    { id: 'dms', name: 'Document Management', brief: 'FY / service structured storage', points: ['Client → FY → Service folders', 'AI classification', 'Versioning', 'Access ACL', 'Audit trail on view/download'] },
    { id: 'tally', name: 'Tally Integration', brief: 'Two-way accounting sync', points: ['Ledger/voucher import', 'Export of approved entries', 'GST data pull', 'Recon helpers', 'API / ODBC / XML bridge'] },
    { id: 'exception', name: 'Exception Engine', brief: 'Green / Amber / Red triage', points: ['Rule + AI thresholds', 'Auto-clear Green', 'Staff Amber queue', 'CA Red queue', 'Reason codes'] },
    { id: 'portal', name: 'Client Portal', brief: 'Self-service for clients', points: ['Upload docs', 'Status tracker', 'Approvals', 'Reports & filings', 'Invoices & pay'] },
    { id: 'comms', name: 'WhatsApp / Email', brief: 'Automated client communication', points: ['Doc requests', 'Reminders', 'Approvals', 'Filing alerts', 'Payment nudges'] },
    { id: 'dash-ca', name: 'CA Dashboard', brief: 'Attention-only view for partners', points: ['Red exceptions', 'Approvals pending', 'Risk & deadlines', 'Escalations', 'Firm health KPIs'] },
    { id: 'dash-staff', name: 'Staff Dashboard', brief: 'Personal work queue', points: ['My tasks', 'Amber exceptions', 'Deadlines', 'Workload', 'Client context'] },
    { id: 'billing', name: 'Billing', brief: 'Revenue automation', points: ['Auto invoices', 'Payment links', 'Reminders', 'Receipts', 'Outstanding ageing'] },
    { id: 'ai', name: 'AI Layer', brief: 'Assist — never auto-file', points: ['OCR & extraction', 'Classification', 'Anomaly flags', 'Notice analysis', 'Draft replies (CA approve)'] },
    { id: 'audit', name: 'Audit Trail', brief: 'Who did what, when', points: ['Every action logged', 'Approvals immutable', 'Doc access log', 'Config change history'] }
  ],

  pilotMetrics: [
    { metric: 'Human minutes / client / month', before: '180–240 min', after: '45–70 min', target: '−70%' },
    { metric: 'Manual data entries', before: 'High (Excel+Tally)', after: 'Exception-only', target: '−80%' },
    { metric: 'Follow-ups per return', before: '6–10 msgs', after: '1–2 (auto)', target: '−75%' },
    { metric: 'Automation rate', before: '~10%', after: '55–70%', target: '≥60%' },
    { metric: 'Exception rate', before: 'N/A (all manual)', after: '20–30%', target: 'Tracked' },
    { metric: 'Errors / rework', before: 'Baseline', after: '−40%', target: '−40%' },
    { metric: 'Turnaround (GSTR-3B)', before: '4–6 days', after: '1–2 days', target: '≤2 days' },
    { metric: 'CA intervention', before: 'Most files', after: 'Red + approvals only', target: '−60%' }
  ],

  schema: [
    { table: 'clients', cols: 'id, pan, gstin, tan, cin, status, billing_profile_id, created_at' },
    { table: 'contacts', cols: 'id, client_id, name, role, phone, email, whatsapp, is_primary' },
    { table: 'services', cols: 'id, code, name, frequency, checklist_json, sla_hours, ca_gate' },
    { table: 'client_services', cols: 'id, client_id, service_id, fee, start_date, status' },
    { table: 'workflows', cols: 'id, client_service_id, period, state, due_at, cycle_key' },
    { table: 'tasks', cols: 'id, workflow_id, type, assignee_id, due_at, status, priority' },
    { table: 'documents', cols: 'id, client_id, fy, service_id, path, class, ocr_json, hash' },
    { table: 'exceptions', cols: 'id, workflow_id, level, rule_code, payload, status, escalated_to' },
    { table: 'approvals', cols: 'id, object_type, object_id, requested_by, decided_by, decision, at' },
    { table: 'filings', cols: 'id, workflow_id, portal, ack_no, filed_at, ack_doc_id' },
    { table: 'invoices', cols: 'id, client_id, amount, status, due_date, payment_link, workflow_id' },
    { table: 'payments', cols: 'id, invoice_id, amount, mode, txn_ref, received_at' },
    { table: 'messages', cols: 'id, client_id, channel, template, payload, status, sent_at' },
    { table: 'audit_logs', cols: 'id, actor_id, action, entity, entity_id, before, after, ip, at' },
    { table: 'tally_sync', cols: 'id, client_id, direction, entity, last_sync, cursor, status' }
  ],

  /* Product catalog — each becomes its own screen */
  serviceCatalog: [
    { id: 'gstReturns', code: 'GST-RET', name: 'GST Returns & Recon', short: 'GST', ico: 'GST', desc: 'GSTR-1 / 3B / 2B reconcile', open: 86, amber: 12, red: 3, due: '28 Sep' },
    { id: 'gstReg', code: 'GST-REG', name: 'GST Registration', short: 'REG', ico: 'REG', desc: 'New registrations & amendments', open: 4, amber: 1, red: 0, due: 'Rolling' },
    { id: 'books', code: 'BOOKS', name: 'Bookkeeping', short: 'BK', ico: 'BK', desc: 'Vouchers, bank recon, MIS', open: 54, amber: 8, red: 0, due: '10th' },
    { id: 'tds', code: 'TDS', name: 'TDS Returns', short: 'TDS', ico: 'TDS', desc: '24Q / 26Q / challans', open: 42, amber: 5, red: 2, due: '30 Sep' },
    { id: 'itr', code: 'ITR', name: 'Income Tax Returns', short: 'ITR', ico: 'ITR', desc: 'Computation → e-file', open: 118, amber: 22, red: 1, due: '31 Oct' },
    { id: 'audit', code: 'AUDIT', name: 'Tax / Statutory Audit', short: 'AUD', ico: 'AUD', desc: 'PBC, queries, sign-off', open: 9, amber: 4, red: 1, due: 'Engagement' },
    { id: 'dsc', code: 'DSC', name: 'DSC Renewal', short: 'DSC', ico: 'DSC', desc: 'Expiry alerts & renewals', open: 7, amber: 2, red: 0, due: 'T−30' },
    { id: 'mca', code: 'MCA', name: 'MCA / Registrations', short: 'MCA', ico: 'MCA', desc: 'AOC-4, MGT-7, DIR forms', open: 11, amber: 3, red: 0, due: 'Statutory' },
    { id: 'notices', code: 'NOTICE', name: 'Notices / Compliance', short: 'NTC', ico: 'NTC', desc: 'Ingest → strategy → reply', open: 3, amber: 0, red: 3, due: 'ASAP' },
    { id: 'billing', code: 'BILL', name: 'Billing & Collections', short: '₹', ico: 'BIL', desc: 'Invoice, pay link, ageing', open: 28, amber: 6, red: 3, due: 'Cycle' }
  ],

  /* Active cases per service — power the product screens */
  cases: {
    gstReturns: [
      {
        id: 'WF-GST-8841', client: 'Aarav Traders Pvt Ltd', clientId: 'CL-00421', period: 'Sep 2025',
        type: 'GSTR-3B', stage: 'Exception', step: 4, status: 'red', due: 'Today', assignee: 'CA R. Sharma',
        liability: '₹3,84,220', itc: '₹2,11,040', cash: '₹1,73,180',
        steps: ['Trigger', 'Documents', 'Tally Sync', '2B Recon', 'Exceptions', 'Review', 'CA Approve', 'File', 'Ack', 'Bill'],
        docs: [
          { name: 'Sales_Register_Sep.xlsx', status: 'Verified', by: 'Auto' },
          { name: 'Purchase_Invoices.zip', status: 'Partial', by: 'Client' },
          { name: 'GSTR-2B_Sep.pdf', status: 'Verified', by: 'Portal' },
          { name: 'E-invoice_JSON.zip', status: 'Verified', by: 'Auto' }
        ],
        tasks: [
          { t: 'Resolve 7 unmatched purchase invoices', s: 'Open', p: 'High' },
          { t: 'Confirm credit note CN-220 mapping', s: 'Open', p: 'High' },
          { t: 'Request transporter invoices via WhatsApp', s: 'Done', p: 'Med' }
        ],
        recon: [
          { inv: 'INV-8891', tally: '₹42,000', gstr: '—', diff: '₹42,000', flag: 'red' },
          { inv: 'INV-8902', tally: '₹38,500', gstr: '₹38,500', diff: '₹0', flag: 'green' },
          { inv: 'INV-8910', tally: '₹28,880', gstr: '₹15,000', diff: '₹13,880', flag: 'red' },
          { inv: 'INV-8922', tally: '₹18,200', gstr: '—', diff: '₹18,200', flag: 'amber' },
          { inv: 'CN-220', tally: '−₹12,000', gstr: '—', diff: '₹12,000', flag: 'amber' }
        ],
        timeline: [
          { e: 'Cycle auto-created for Sep 2025', t: '05 Sep 06:00', who: 'System' },
          { e: 'Doc request sent (WhatsApp)', t: '05 Sep 06:02', who: 'Comms' },
          { e: 'Tally sync OK — 214 vouchers', t: '20 Sep 07:10', who: 'Tally' },
          { e: 'GSTR-2B fetched', t: '21 Sep 08:00', who: 'GST API' },
          { e: 'Recon created Red exception EX-8841', t: '21 Sep 08:14', who: 'Rules' }
        ]
      },
      {
        id: 'WF-GST-8798', client: 'Metro Retail LLP', clientId: 'CL-00512', period: 'Sep 2025',
        type: 'GSTR-3B', stage: 'CA Approve', step: 6, status: 'green', due: '2 days', assignee: 'CA R. Sharma',
        liability: '₹2,14,000', itc: '₹1,02,500', cash: '₹1,11,500',
        steps: ['Trigger', 'Documents', 'Tally Sync', '2B Recon', 'Exceptions', 'Review', 'CA Approve', 'File', 'Ack', 'Bill'],
        docs: [
          { name: 'Sales_Register.xlsx', status: 'Verified', by: 'Auto' },
          { name: 'Purchases.zip', status: 'Verified', by: 'Client' },
          { name: 'GSTR-2B.pdf', status: 'Verified', by: 'Portal' }
        ],
        tasks: [
          { t: 'CA approval for filing', s: 'Open', p: 'High' }
        ],
        recon: [
          { inv: 'All matched', tally: '412 inv', gstr: '412 inv', diff: '₹0', flag: 'green' }
        ],
        timeline: [
          { e: 'Cycle created', t: '05 Sep', who: 'System' },
          { e: 'Auto-reconcile 100% match', t: '22 Sep', who: 'Rules' },
          { e: 'Draft 3B ready — Green path', t: '22 Sep', who: 'System' }
        ]
      },
      {
        id: 'WF-GST-8815', client: 'GreenLeaf Agro', clientId: 'CL-00201', period: 'Sep 2025',
        type: 'GSTR-1', stage: 'Validation', step: 3, status: 'amber', due: 'Today', assignee: 'Neha Gupta',
        liability: '—', itc: '—', cash: '—',
        steps: ['Trigger', 'Documents', 'Tally Sync', 'Validate', 'Exceptions', 'Review', 'Approve', 'File', 'Ack', 'Bill'],
        docs: [
          { name: 'B2B_export.xlsx', status: 'Mismatch', by: 'Tally' },
          { name: 'Portal_GSTR1_preview.pdf', status: 'Fetched', by: 'Portal' }
        ],
        tasks: [
          { t: 'Map 3 missing B2B invoices', s: 'In Progress', p: 'High' }
        ],
        recon: [
          { inv: 'Portal B2B count', tally: '139', gstr: '142', diff: '3', flag: 'amber' }
        ],
        timeline: [
          { e: 'GSTR-1 cycle started', t: '18 Sep', who: 'System' },
          { e: 'Count variance flagged', t: '24 Sep', who: 'Rules' }
        ]
      }
    ],
    gstReg: [
      {
        id: 'WF-REG-102', client: 'Bright Foods LLP', clientId: 'CL-00601', period: 'New',
        type: 'GST REG-01', stage: 'Documents', step: 1, status: 'amber', due: '5 days', assignee: 'Rahul Verma',
        liability: '—', itc: '—', cash: '—',
        steps: ['Trigger', 'KYC Docs', 'OCR Validate', 'Draft Form', 'CA Review', 'Submit', 'ARN', 'RC', 'Bill'],
        docs: [
          { name: 'PAN.pdf', status: 'Verified', by: 'OCR' },
          { name: 'Aadhaar.pdf', status: 'Name mismatch', by: 'OCR' },
          { name: 'Rent_Agreement.pdf', status: 'Pending', by: '—' },
          { name: 'Bank_Proof.pdf', status: 'Verified', by: 'OCR' },
          { name: 'Photo.jpg', status: 'Verified', by: 'Client' },
          { name: 'Authorization.pdf', status: 'Pending', by: '—' }
        ],
        tasks: [
          { t: 'Resolve Aadhaar vs PAN name mismatch', s: 'Open', p: 'High' },
          { t: 'Chase rent agreement', s: 'Open', p: 'Med' }
        ],
        recon: [],
        timeline: [
          { e: 'Service activated', t: '20 Sep', who: 'Admin' },
          { e: 'Checklist WhatsApp sent', t: '20 Sep', who: 'Comms' },
          { e: 'OCR name mismatch exception', t: '22 Sep', who: 'AI' }
        ]
      }
    ],
    books: [
      {
        id: 'WF-BK-512', client: 'Metro Retail LLP', clientId: 'CL-00512', period: 'Sep 2025',
        type: 'Monthly Books', stage: 'Bank Recon', step: 3, status: 'amber', due: '3 days', assignee: 'Rahul Verma',
        liability: '—', itc: '—', cash: '—',
        steps: ['Trigger', 'Collect Docs', 'OCR Vouchers', 'Bank Recon', 'Exceptions', 'Review', 'MIS', 'Archive', 'Bill'],
        docs: [
          { name: 'HDFC_xx4521_Aug.pdf', status: 'Verified', by: 'Client' },
          { name: 'HDFC_xx4521_Sep.pdf', status: 'Missing', by: '—' },
          { name: 'Expense_bills.zip', status: 'OCR 18/22', by: 'AI' },
          { name: 'Sales_invoices.zip', status: 'Posted', by: 'AI→Tally' }
        ],
        tasks: [
          { t: 'Follow up Sep bank statement', s: 'Open', p: 'High' },
          { t: 'Clear 4 unmatched bank lines', s: 'Open', p: 'Med' },
          { t: 'Post remaining expense vouchers', s: 'In Progress', p: 'Med' }
        ],
        recon: [
          { inv: 'UPI 88421', tally: '—', gstr: '₹12,400 Cr', diff: 'Unmatched', flag: 'amber' },
          { inv: 'NEFT Vendor X', tally: '₹45,000', gstr: '₹45,000', diff: '₹0', flag: 'green' },
          { inv: 'Cash dep 12 Sep', tally: '—', gstr: '₹8,000 Cr', diff: 'Unmatched', flag: 'amber' }
        ],
        timeline: [
          { e: 'Monthly cycle created', t: '01 Sep', who: 'System' },
          { e: 'Auto reminder #2 for bank stmt', t: '22 Sep', who: 'WhatsApp' }
        ]
      }
    ],
    tds: [
      {
        id: 'WF-TDS-337', client: 'Skyline Constructions', clientId: 'CL-00156', period: 'Q2 FY26',
        type: 'Form 26Q', stage: 'Exception', step: 4, status: 'red', due: 'Tomorrow', assignee: 'CA R. Sharma',
        liability: '₹4,80,000', itc: '—', cash: 'Challan ₹4,20,000',
        steps: ['Trigger', 'Salary/Vendor data', 'Compute', 'Challan match', 'Exceptions', 'Draft 26Q', 'CA Approve', 'File', 'Ack', 'Bill'],
        docs: [
          { name: 'Vendor_payments_Q2.xlsx', status: 'Verified', by: 'Tally' },
          { name: 'Challan_281.pdf', status: 'Shortfall', by: 'Client' },
          { name: 'PAN_list.csv', status: '2 invalid', by: 'Validate' }
        ],
        tasks: [
          { t: 'CA decide challan shortfall ₹60k', s: 'Open', p: 'High' },
          { t: 'Correct 2 invalid PANs', s: 'Open', p: 'Med' }
        ],
        recon: [
          { inv: 'Liability computed', tally: '₹4,80,000', gstr: '—', diff: '—', flag: 'green' },
          { inv: 'Challan paid', tally: '₹4,20,000', gstr: '—', diff: '₹60,000 short', flag: 'red' }
        ],
        timeline: [
          { e: 'Q2 cycle created', t: '01 Jul', who: 'System' },
          { e: 'Challan shortfall Red exception', t: '23 Sep', who: 'Rules' }
        ]
      }
    ],
    itr: [
      {
        id: 'WF-ITR-901', client: 'Dr. Mehta Clinic', clientId: 'CL-00490', period: 'AY 2025-26',
        type: 'ITR-3', stage: 'Review Pack', step: 5, status: 'green', due: 'Fri', assignee: 'Neha Gupta',
        liability: 'Tax ₹2.4L', itc: 'TDS ₹1.8L', cash: 'Payable ₹0.6L',
        steps: ['Trigger', 'Collect', 'OCR Form16', 'AIS match', 'Computation', 'CA Review', 'Client confirm', 'E-file', 'Ack', 'Bill'],
        docs: [
          { name: 'Form16_FY25.pdf', status: 'Extracted', by: 'OCR' },
          { name: '26AS_AIS.pdf', status: 'Matched', by: 'Auto' },
          { name: 'Books_summary.pdf', status: 'Verified', by: 'Staff' },
          { name: 'Investment_proofs.zip', status: 'Verified', by: 'Client' }
        ],
        tasks: [
          { t: 'Prepare computation pack for CA', s: 'Open', p: 'Med' },
          { t: 'Client confirm capital gains schedule', s: 'Waiting', p: 'Med' }
        ],
        recon: [
          { inv: 'Form16 TDS', tally: '₹1,80,000', gstr: '26AS ₹1,80,000', diff: '₹0', flag: 'green' },
          { inv: 'AIS interest', tally: '₹12,400', gstr: '₹12,400', diff: '₹0', flag: 'green' }
        ],
        timeline: [
          { e: 'ITR engagement started', t: '01 Aug', who: 'System' },
          { e: 'Form16 OCR validated', t: '18 Sep', who: 'AI' }
        ]
      }
    ],
    audit: [
      {
        id: 'WF-AUD-44', client: 'NovaTech Solutions', clientId: 'CL-00388', period: 'FY 2024-25',
        type: 'Tax Audit u/s 44AB', stage: 'PBC / Queries', step: 3, status: 'amber', due: '12 days', assignee: 'CA R. Sharma',
        liability: '—', itc: '—', cash: '—',
        steps: ['Engagement', 'PBC Checklist', 'Fieldwork', 'Queries', 'Draft FS', 'Partner Review', 'Sign-off', 'Upload', 'Bill'],
        docs: [
          { name: 'Trial_Balance.xlsx', status: 'Received', by: 'Client' },
          { name: 'Fixed_Assets_register.xlsx', status: 'Received', by: 'Client' },
          { name: 'Bank_confirmations.pdf', status: '2 pending', by: '—' },
          { name: 'Related_party_list.xlsx', status: 'Gap', by: 'Staff' }
        ],
        tasks: [
          { t: 'Chase 2 bank confirmations', s: 'Open', p: 'High' },
          { t: 'Related party disclosure query', s: 'Open', p: 'High' },
          { t: 'Sample sales vouchers (25)', s: 'In Progress', p: 'Med' }
        ],
        recon: [],
        timeline: [
          { e: 'Engagement letter signed', t: '15 Jun', who: 'CA' },
          { e: 'PBC list sent to client', t: '01 Jul', who: 'Staff' }
        ]
      }
    ],
    dsc: [
      {
        id: 'WF-DSC-77', client: 'Aarav Traders Pvt Ltd', clientId: 'CL-00421', period: 'Token renew',
        type: 'Class 3 DSC', stage: 'KYC', step: 2, status: 'amber', due: 'Next week', assignee: 'Sneha Rao',
        liability: 'Fee ₹2,499', itc: '—', cash: 'Unpaid',
        steps: ['Expiry alert', 'KYC collect', 'Vendor form', 'Payment', 'Token ship', 'Activate', 'Bill'],
        docs: [
          { name: 'Existing_DSC_details.pdf', status: 'On file', by: 'Vault' },
          { name: 'Photo.jpg', status: 'Pending', by: '—' },
          { name: 'Auth_letter.pdf', status: 'Pending', by: '—' }
        ],
        tasks: [
          { t: 'Upload token receipt after payment', s: 'Waiting Client', p: 'Low' },
          { t: 'Collect photo + auth', s: 'Open', p: 'Med' }
        ],
        recon: [],
        timeline: [
          { e: 'T−60 expiry alert sent', t: '01 Aug', who: 'System' },
          { e: 'T−30 reminder', t: '01 Sep', who: 'WhatsApp' }
        ]
      }
    ],
    mca: [
      {
        id: 'WF-MCA-19', client: 'Skyline Constructions', clientId: 'CL-00156', period: 'FY 2024-25',
        type: 'AOC-4 + MGT-7', stage: 'Draft Forms', step: 3, status: 'amber', due: '18 days', assignee: 'Pooja Nair',
        liability: '—', itc: '—', cash: '—',
        steps: ['Trigger', 'Docs', 'Draft forms', 'Director DSC', 'CA certify', 'Upload MCA', 'SRN/Ack', 'Bill'],
        docs: [
          { name: 'Audited_FS.pdf', status: 'Received', by: 'Audit' },
          { name: 'Board_resolution.pdf', status: 'Received', by: 'Client' },
          { name: 'DIR-3 KYC', status: '1 director pending', by: '—' }
        ],
        tasks: [
          { t: 'Director DSC validity check', s: 'Open', p: 'High' },
          { t: 'Complete DIR-3 KYC pending', s: 'Open', p: 'Med' }
        ],
        recon: [],
        timeline: [
          { e: 'Statutory calendar created filing', t: '10 Sep', who: 'System' }
        ]
      }
    ],
    notices: [
      {
        id: 'WF-NTC-08', client: 'Skyline Constructions', clientId: 'CL-00156', period: 'AY 2024-25',
        type: '143(2) Scrutiny', stage: 'CA Strategy', step: 2, status: 'red', due: '12 days', assignee: 'CA R. Sharma',
        liability: 'Potential demand TBD', itc: '—', cash: '—',
        steps: ['Ingest', 'Classify', 'Extract due date', 'Gather facts', 'Draft reply', 'CA approve', 'Submit', 'Track', 'Archive'],
        docs: [
          { name: 'Notice_u_s_1432.pdf', status: 'Analyzed', by: 'AI' },
          { name: 'Prior_ITR.pdf', status: 'Linked', by: 'Vault' },
          { name: 'Support_ledgers.zip', status: 'Partial', by: 'Staff' }
        ],
        tasks: [
          { t: 'CA finalize reply strategy', s: 'Open', p: 'Critical' },
          { t: 'Pull sales vs return reconciliation', s: 'In Progress', p: 'High' }
        ],
        recon: [],
        timeline: [
          { e: 'Email notice ingested', t: '18 Sep', who: 'Email parser' },
          { e: 'AI classified: Scrutiny 143(2)', t: '18 Sep', who: 'AI' },
          { e: 'Forced Red — CA mandatory', t: '18 Sep', who: 'Policy' }
        ]
      }
    ],
    billing: [
      {
        id: 'WF-BILL-843', client: 'GreenLeaf Agro', clientId: 'CL-00201', period: 'Sep 2025',
        type: 'GST monthly fee', stage: 'Collections', step: 3, status: 'red', due: 'Overdue', assignee: 'Sneha Rao',
        liability: '₹12,000', itc: '—', cash: 'Unpaid',
        steps: ['Cycle close', 'Generate invoice', 'Send link', 'Reminders', 'Receipt', 'Reconcile', 'Next cycle'],
        docs: [
          { name: 'INV-2025-0843.pdf', status: 'Sent', by: 'System' }
        ],
        tasks: [
          { t: 'Overdue reminder D+15', s: 'Open', p: 'High' },
          { t: 'Call client if no pay by Fri', s: 'Open', p: 'Med' }
        ],
        recon: [
          { inv: 'Invoice', tally: '₹12,000', gstr: 'Paid ₹0', diff: 'Outstanding', flag: 'red' }
        ],
        timeline: [
          { e: 'Invoice auto-generated', t: '12 Sep', who: 'Billing' },
          { e: 'Reminder D+3 / D+7 sent', t: '19 Sep', who: 'WhatsApp' }
        ]
      }
    ]
  }
};
