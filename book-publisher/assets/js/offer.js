/* Publishing Offer — Registration, Royalty Calc, Journey */
const PublishOffer = {
  selectedPkg: 'pkg-basic',

  init() {
    this.renderPackages();
    this.renderPipeline();
    this.renderBenefits();
    this.bindForm();
    this.updateSlots();
  },

  updateSlots() {
    const o = INKBRIDGE.publishingOffer;
    document.querySelectorAll('[data-slots-left]').forEach(el => { el.textContent = o.slotsLeft; });
    document.querySelectorAll('[data-slots-total]').forEach(el => { el.textContent = o.slotsTotal; });
    const bar = document.getElementById('slotsBar');
    if (bar) bar.style.width = ((o.slotsTotal - o.slotsLeft) / o.slotsTotal * 100) + '%';
  },

  renderPackages() {
    const el = document.getElementById('offerPackages');
    if (!el) return;
    const o = INKBRIDGE.publishingOffer;
    el.innerHTML = o.packages.map(p => `
      <div class="pkg-card ${p.popular ? 'popular' : ''} ${this.selectedPkg === p.id ? 'selected' : ''}" onclick="PublishOffer.selectPkg('${p.id}')">
        ${p.popular ? '<span class="pkg-badge">Most Popular</span>' : ''}
        <h3>${p.name}</h3>
        <p class="pkg-pages">${p.pages}</p>
        <div class="pkg-price">${IB.fmtINR(p.price)} <small>+ GST</small></div>
        <div class="pkg-total">Total payable: <strong>${IB.fmtINR(p.total)}</strong></div>
        <p class="pkg-desc">${p.desc}</p>
        <button class="btn ${p.popular ? 'btn-gold' : 'btn-primary'} btn-sm" style="width:100%;margin-top:0.75rem" onclick="event.stopPropagation();PublishOffer.selectPkg('${p.id}');document.getElementById('regForm')?.scrollIntoView({behavior:'smooth'})">
          Select & Register
        </button>
      </div>`).join('');
  },

  selectPkg(id) {
    this.selectedPkg = id;
    this.renderPackages();
    const sel = document.getElementById('reg-package');
    if (sel) sel.value = id;
    this.updatePayAmount();
  },

  updatePayAmount() {
    const p = INKBRIDGE.publishingOffer.packages.find(x => x.id === this.selectedPkg);
    const el = document.getElementById('payAmount');
    if (el && p) el.textContent = IB.fmtINR(p.total);
  },

  renderBenefits() {
    const el = document.getElementById('offerBenefits');
    if (!el) return;
    el.innerHTML = INKBRIDGE.publishingOffer.benefits.map(b => `<li><i class="fa-solid fa-check"></i> ${b}</li>`).join('');
  },

  renderPipeline() {
    const el = document.getElementById('offerPipeline');
    if (!el) return;
    el.innerHTML = INKBRIDGE.publishingOffer.pipelineSteps.map(s => `
      <div class="flow-step offer-step">
        <div class="num">${s.id}</div>
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
        <span class="text-xs" style="color:var(--gold);font-weight:600">${s.auto ? '⚡ Auto' : '👤 Team'} · ${s.sla}</span>
      </div>`).join('');
  },

  bindForm() {
    const form = document.getElementById('regForm');
    if (!form) return;
    const pkg = document.getElementById('reg-package');
    if (pkg) {
      pkg.innerHTML = INKBRIDGE.publishingOffer.packages.map(p =>
        `<option value="${p.id}">${p.name} — ${p.pages} (${IB.fmtINR(p.total)})</option>`
      ).join('');
      pkg.value = this.selectedPkg;
      pkg.onchange = () => { this.selectedPkg = pkg.value; this.renderPackages(); this.updatePayAmount(); };
    }
    this.updatePayAmount();
    form.onsubmit = (e) => { e.preventDefault(); this.submitRegistration(); };

    // page count → suggest package
    document.getElementById('reg-pages')?.addEventListener('input', (e) => {
      const n = +e.target.value;
      let id = 'pkg-basic';
      if (n > 300) id = 'pkg-premium';
      else if (n > 150) id = 'pkg-standard';
      this.selectPkg(id);
    });
  },

  submitRegistration() {
    const name = document.getElementById('reg-name')?.value || 'Author';
    const pages = document.getElementById('reg-pages')?.value || '—';
    const genre = document.getElementById('reg-genre')?.value || '—';
    const p = INKBRIDGE.publishingOffer.packages.find(x => x.id === this.selectedPkg);
    const regId = 'REG-' + Math.floor(1000 + Math.random() * 9000);

    IB.modal('Confirm Payment & Registration', `
      <p>Hi <strong>${name}</strong> — you're registering for the <strong>${p.name}</strong> package.</p>
      <dl class="book-detail-meta" style="margin-top:1rem">
        <dt>Pages</dt><dd>${pages}</dd>
        <dt>Genre</dt><dd>${genre}</dd>
        <dt>Package</dt><dd>${p.pages}</dd>
        <dt>Amount</dt><dd><strong>${IB.fmtINR(p.total)}</strong> (incl. GST)</dd>
        <dt>Slots left</dt><dd>${INKBRIDGE.publishingOffer.slotsLeft} / ${INKBRIDGE.publishingOffer.slotsTotal}</dd>
      </dl>
      <p class="text-sm text-muted" style="margin-top:0.75rem">Replaces Google Form + manual payment. Demo payment is instant.</p>`,
      `<button class="btn btn-ghost" onclick="IB.closeModal()">Cancel</button>
       <button class="btn btn-gold" onclick="PublishOffer.completePayment('${regId}','${name.replace(/'/g, '')}')"><i class="fa-solid fa-lock"></i> Pay ${IB.fmtINR(p.total)}</button>`
    );
  },

  completePayment(regId, name) {
    INKBRIDGE.publishingOffer.slotsLeft = Math.max(0, INKBRIDGE.publishingOffer.slotsLeft - 1);
    this.updateSlots();
    IB.closeModal();
    IB.toast('Payment successful! Registration ' + regId + ' confirmed', 'ok');
    IB.modal('Registration Confirmed 🎉', `
      <p>Thank you, <strong>${name}</strong>, for choosing <strong>Bookspot Publishers</strong>.</p>
      <p style="margin-top:0.75rem">Registration ID: <strong>${regId}</strong></p>
      <h4 style="margin:1.25rem 0 0.5rem">What happens next (automated)</h4>
      <ol style="padding-left:1.2rem;font-size:0.9rem;line-height:1.7">
        <li>Login to Author Portal (credentials emailed)</li>
        <li>Upload manuscript (.doc/.docx) — 6 months window</li>
        <li>Track formatting → cover → listing in your journey board</li>
        <li>Fill royalty calculator + book details online</li>
        <li>Go live on Amazon & Flipkart</li>
        <li>Track sales on Live Dashboard (updates every <strong>20th</strong>)</li>
      </ol>
      <p class="text-sm text-muted" style="margin-top:1rem">Overall publishing timeline: 20–30 days after manuscript approval.</p>`,
      `<a class="btn btn-burgundy" href="../author/index.html#journey">Open Author Portal →</a>
       <button class="btn btn-ghost" onclick="IB.closeModal()">Close</button>`
    );
    document.getElementById('regForm')?.reset();
  },

  openRoyaltyCalc() {
    IB.modal('Royalty Calculator', `
      <p class="text-sm text-muted mb-2">Estimate royalty from page count & MRP — replaces external calculator link.</p>
      <div class="form-row">
        <div class="form-group"><label>Final page count (PDF)</label><input type="number" id="rc-pages" value="128" min="40"></div>
        <div class="form-group"><label>Suggested MRP (₹)</label><input type="number" id="rc-mrp" value="199"></div>
      </div>
      <div class="form-group"><label>Print type</label>
        <select id="rc-print"><option>B/W Paperback</option><option>Color Interior</option></select>
      </div>
      <div id="rc-result" class="card card-flat" style="background:var(--cream);margin-top:0.5rem"></div>
      <button class="btn btn-primary btn-sm mt-1" onclick="PublishOffer.calcRoyalty()"><i class="fa-solid fa-calculator"></i> Calculate</button>`,
      `<button class="btn btn-ghost" onclick="IB.closeModal()">Close</button>
       <button class="btn btn-gold" onclick="PublishOffer.calcRoyalty();IB.toast('Estimate saved — fill book details next','ok')">Use This Estimate</button>`
    );
    this.calcRoyalty();
  },

  calcRoyalty() {
    const pages = +(document.getElementById('rc-pages')?.value || 128);
    const mrp = +(document.getElementById('rc-mrp')?.value || 199);
    // Simple demo formula: production ~ pages*0.45 + 25, platform ~ 30% of MRP, royalty = mrp - prod - platform share
    const production = Math.round(pages * 0.55 + 35);
    const platform = Math.round(mrp * 0.28);
    const royalty = Math.max(15, mrp - production - platform);
    const el = document.getElementById('rc-result');
    if (el) el.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.88rem">
        <div>Est. production cost</div><strong>${IB.fmtINR(production)}</strong>
        <div>Platform / distribution</div><strong>${IB.fmtINR(platform)}</strong>
        <div>Author royalty / copy</div><strong style="color:var(--ok);font-size:1.2rem">${IB.fmtINR(royalty)}</strong>
      </div>
      <p class="text-xs text-muted" style="margin-top:0.65rem">Calculator gives accurate estimates; final price/royalty may vary slightly based on production specs — same as your current process.</p>`;
    return royalty;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('offerPackages')) PublishOffer.init();
});
