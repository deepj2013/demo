/* YLK Infra — Strategic MLM / Partner Income Plan (interactive) */
const YLKPlan = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const inr = (n) =>
    "₹" +
    Number(n || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0
    });

  const inrDec = (n) =>
    "₹" +
    Number(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

  /* Package constants from company brief */
  const PKG = {
    join: {
      amount: 999,
      directPct: 0.1,
      matchPct: 0.1
    },
    invest: {
      amount: 50000,
      roiMonthlyPct: 0.06,
      months: 30,
      directPct: 0.025,
      matchPct: 0.01
    },
    property: {
      unit: 100000,
      directPct: 0.025,
      matchPct: 0.01
    }
  };

  function hero() {
    const img = YLKStore.img("land-invest.png");
    return `
      <section class="plan-hero">
        <div class="plan-hero-bg" style="background-image:url('${img}')"></div>
        <div class="plan-hero-overlay"></div>
        <div class="plan-hero-copy">
          <p class="eyebrow">YLK Infra · Strategic Income Plan</p>
          <h1>Partner growth plan with <em>clear numbers</em></h1>
          <p class="lead">
            Three packages — Joining, Investment and Property — with Direct Referral,
            Matching Bonus and ROI explained by example. Use the calculators before you enrol anyone.
          </p>
          <div class="hero-actions">
            <a class="btn btn-gold" href="#packages">See packages</a>
            <a class="btn btn-ghost" href="#calculator">Open calculator</a>
            <button class="btn btn-ghost" type="button" data-open-book>Enquire on WhatsApp</button>
          </div>
          <div class="plan-chip-row">
            <span class="plan-chip">Join ₹999</span>
            <span class="plan-chip">Invest ₹50,000</span>
            <span class="plan-chip">Property × ₹1 Lakh</span>
            <span class="plan-chip">Binary matching</span>
          </div>
        </div>
      </section>`;
  }

  function toc() {
    return `
      <section class="plan-wrap plan-sec" id="overview">
        <h2>How this plan works</h2>
        <p class="lead">
          Income comes from real enrolments and real property / investment volume — not from empty promises.
          Matching bonus pays only when <b>Left</b> and <b>Right</b> legs both produce volume (a pair).
        </p>
        <nav class="plan-toc" aria-label="Plan sections">
          <a href="#pkg-join"><strong>A. Joining</strong><span>₹999 · 10% / 10%</span></a>
          <a href="#pkg-invest"><strong>B. Investment</strong><span>₹50,000 · ROI 6% × 30</span></a>
          <a href="#pkg-property"><strong>C. Property</strong><span>× ₹1 Lakh · 2.5% / 1%</span></a>
        </nav>

        <div class="example-box" style="margin-top:1.5rem">
          <h4>Matching bonus in one line</h4>
          <p>
            Suppose your Left leg has 3 joining packages and Right has 2. You form
            <b>2 pairs</b> (the smaller side). Extra Left volume waits for the next match.
          </p>
          <div class="tree-visual">
            <div class="tree-node you">YOU</div>
            <div class="tree-row">
              <div class="tree-node">LEFT · 3 joins<small>Waiting + matched</small></div>
              <div class="tree-node">RIGHT · 2 joins<small>Fully matched</small></div>
            </div>
          </div>
          <div class="math-line">Pairs = min(Left, Right) = min(3, 2) = 2 pairs → Matching paid on 2 × base</div>
        </div>
      </section>`;
  }

  function packages() {
    return `
      <section class="plan-wrap plan-sec" id="packages">
        <h2>A · B · C packages at a glance</h2>
        <p class="lead">Exact slabs as defined for YLK Infra strategic partner income.</p>
        <div class="pkg-grid">
          <article class="pkg-card" id="pkg-join">
            <div class="pkg-card-head">
              <div class="tag">Package A</div>
              <h3>Joining Package</h3>
              <div class="price">₹999</div>
            </div>
            <div class="pkg-card-body">
              <ul class="pkg-list">
                <li>
                  <span class="num">1</span>
                  <span><b>Direct Referral</b><small>On every person you personally enrol on Join</small></span>
                  <span class="pct">10%</span>
                </li>
                <li>
                  <span class="num">2</span>
                  <span><b>Matching Bonus</b><small>On each matched Left–Right pair of Join volume</small></span>
                  <span class="pct">10%</span>
                </li>
              </ul>
              <div class="example-box">
                <h4>Quick math</h4>
                <div class="math-line">Direct = 999 × 10% = ₹99.90 ≈ ₹100 / join</div>
                <div class="math-line">Match pair = 999 × 10% = ₹99.90 ≈ ₹100 / pair</div>
              </div>
            </div>
          </article>

          <article class="pkg-card" id="pkg-invest">
            <div class="pkg-card-head">
              <div class="tag">Package B</div>
              <h3>Investment Package</h3>
              <div class="price">₹50,000</div>
            </div>
            <div class="pkg-card-body">
              <ul class="pkg-list">
                <li>
                  <span class="num">1</span>
                  <span><b>ROI 6% for 30 months</b><small>Monthly payout on package = ₹3,000 × 30</small></span>
                  <span class="pct">6%/mo</span>
                </li>
                <li>
                  <span class="num">2</span>
                  <span><b>Direct Referral Bonus</b><small>One-time when someone you enrol takes Invest</small></span>
                  <span class="pct">2.5%</span>
                </li>
                <li>
                  <span class="num">3</span>
                  <span><b>Matching Bonus</b><small>On each matched Invest pair</small></span>
                  <span class="pct">1.0%</span>
                </li>
              </ul>
              <div class="example-box">
                <h4>Quick math</h4>
                <div class="math-line">Monthly ROI = 50,000 × 6% = ₹3,000</div>
                <div class="math-line">30 months = 3,000 × 30 = ₹90,000 total ROI</div>
                <div class="math-line">Direct = 50,000 × 2.5% = ₹1,250</div>
                <div class="math-line">Match pair = 50,000 × 1% = ₹500</div>
              </div>
            </div>
          </article>

          <article class="pkg-card" id="pkg-property">
            <div class="pkg-card-head">
              <div class="tag">Package C</div>
              <h3>Property Package</h3>
              <div class="price">₹1 Lakh × N</div>
            </div>
            <div class="pkg-card-body">
              <ul class="pkg-list">
                <li>
                  <span class="num">1</span>
                  <span><b>Direct Referral</b><small>One-time on property booking value (multiples of ₹1,00,000)</small></span>
                  <span class="pct">2.5%</span>
                </li>
                <li>
                  <span class="num">2</span>
                  <span><b>Matching Bonus</b><small>On matched property volume pairs</small></span>
                  <span class="pct">1.0%</span>
                </li>
              </ul>
              <div class="example-box">
                <h4>Quick math (₹5 Lakh booking)</h4>
                <div class="math-line">Units = 5,00,000 / 1,00,000 = 5</div>
                <div class="math-line">Direct = 5,00,000 × 2.5% = ₹12,500 (one time)</div>
                <div class="math-line">Match on ₹1L pair = 1,00,000 × 1% = ₹1,000 / matched unit</div>
              </div>
            </div>
          </article>
        </div>
      </section>`;
  }

  function workedExamples() {
    return `
      <section class="plan-wrap plan-sec" id="examples">
        <h2>Worked examples (full profit path)</h2>
        <p class="lead">Same numbers, three scenarios — so a partner can see money flow before pitching.</p>

        <div class="example-box">
          <h4>Example 1 — Joining only (month 1)</h4>
          <p>You personally enrol <b>4 people</b> on Joining (₹999). Binary: Left 2 · Right 2.</p>
          <ol>
            <li>Direct Referral = 4 × (999 × 10%) = 4 × 99.9 = <b>₹399.60</b></li>
            <li>Pairs = min(2,2) = 2 → Matching = 2 × (999 × 10%) = <b>₹199.80</b></li>
            <li><b>Month-1 total ≈ ₹599</b> from Join alone</li>
          </ol>
          <div class="math-line">4 × ₹999 turnover = ₹3,996 company Joining intake · your share ≈ 15% blended</div>
        </div>

        <div class="example-box">
          <h4>Example 2 — Investment package (you + team)</h4>
          <p>You take 1 Invest (₹50,000). You also refer <b>2 directs</b> who take Invest. Matching forms <b>1 pair</b>.</p>
          <ol>
            <li>Your monthly ROI = 50,000 × 6% = <b>₹3,000 / month</b> for 30 months</li>
            <li>30-month ROI total = 3,000 × 30 = <b>₹90,000</b></li>
            <li>Direct bonus = 2 × (50,000 × 2.5%) = 2 × 1,250 = <b>₹2,500</b> (one time)</li>
            <li>Matching = 1 × (50,000 × 1%) = <b>₹500</b> (one time on that pair)</li>
            <li><b>First-month cash</b> ≈ 3,000 + 2,500 + 500 = <b>₹6,000</b></li>
            <li><b>30-month ROI only</b> = ₹90,000 (plus any future team bonuses)</li>
          </ol>
        </div>

        <div class="example-box">
          <h4>Example 3 — Property booking ₹10 Lakh</h4>
          <p>Your direct books a plot / flat equivalent to <b>₹10,00,000</b> (10 units of ₹1 Lakh).</p>
          <ol>
            <li>Direct Referral (one time) = 10,00,000 × 2.5% = <b>₹25,000</b></li>
            <li>If same volume matches on the other leg for 10 units → Matching = 10 × (1,00,000 × 1%) = <b>₹10,000</b></li>
            <li><b>Possible partner income on this booking = ₹35,000</b> (when fully matched)</li>
          </ol>
          <div class="math-line">Unmatched units carry forward until the opposite leg catches up</div>
        </div>

        <div class="example-box">
          <h4>Example 4 — Mixed month (strategic “full profit”)</h4>
          <p>Best months combine all three engines.</p>
          <table class="earn-table">
            <thead>
              <tr><th>Source</th><th>Assumed volume</th><th>Your income</th></tr>
            </thead>
            <tbody>
              <tr><td>Join directs</td><td>6 joins (3L · 3R)</td><td class="good">Direct ₹599 + Match ₹300 ≈ ₹899</td></tr>
              <tr><td>Invest directs</td><td>2 × ₹50,000 + 1 pair</td><td class="good">₹2,500 + ₹500 = ₹3,000</td></tr>
              <tr><td>Your Invest ROI</td><td>1 package</td><td class="good">₹3,000 / month</td></tr>
              <tr><td>Property direct</td><td>₹5,00,000 booking</td><td class="good">₹12,500 (one time)</td></tr>
              <tr><td><b>Illustrative month</b></td><td>—</td><td class="good"><b>≈ ₹19,900</b></td></tr>
            </tbody>
          </table>
          <p style="margin-top:.7rem">This is an illustration — actual payout needs real matched volume and company payout rules.</p>
        </div>
      </section>`;
  }

  function calculator() {
    return `
      <section class="plan-wrap plan-sec" id="calculator">
        <h2>Interactive calculator</h2>
        <p class="lead">Change the numbers. See Direct, Matching, ROI and totals instantly.</p>

        <div class="calc-panel">
          <h4>A · Joining calculator</h4>
          <p class="hint">Package fixed at ₹999 · Direct 10% · Matching 10% per pair</p>
          <div class="calc-grid">
            <label>Your direct joins
              <input type="number" id="jDirects" min="0" value="4" />
            </label>
            <label>Left joins (team)
              <input type="number" id="jLeft" min="0" value="2" />
            </label>
            <label>Right joins (team)
              <input type="number" id="jRight" min="0" value="2" />
            </label>
          </div>
          <div class="calc-results" id="jOut"></div>
        </div>

        <div class="calc-panel" style="margin-top:1rem">
          <h4>B · Investment calculator</h4>
          <p class="hint">₹50,000 · ROI 6%/month × 30 · Direct 2.5% · Matching 1% per pair</p>
          <div class="calc-grid">
            <label>Your own packages
              <input type="number" id="iOwn" min="0" value="1" />
            </label>
            <label>Direct Invest referrals
              <input type="number" id="iDirects" min="0" value="2" />
            </label>
            <label>Left Invest packages
              <input type="number" id="iLeft" min="0" value="1" />
            </label>
            <label>Right Invest packages
              <input type="number" id="iRight" min="0" value="1" />
            </label>
          </div>
          <div class="calc-results" id="iOut"></div>
        </div>

        <div class="calc-panel" style="margin-top:1rem">
          <h4>C · Property calculator</h4>
          <p class="hint">Value must be multiple of ₹1,00,000 · Direct 2.5% one-time · Matching 1%</p>
          <div class="calc-grid">
            <label>Property value (₹)
              <input type="number" id="pValue" min="100000" step="100000" value="500000" />
            </label>
            <label>Is this your direct booking?
              <select id="pIsDirect">
                <option value="1">Yes — pay Direct 2.5%</option>
                <option value="0">No — downline / matching only</option>
              </select>
            </label>
            <label>Matched units (pairs of ₹1 Lakh)
              <input type="number" id="pPairs" min="0" value="5" />
            </label>
          </div>
          <div class="calc-results" id="pOut"></div>
        </div>
      </section>`;
  }

  function strategy() {
    return `
      <section class="plan-wrap plan-sec" id="strategy">
        <h2>Strategic path for full profit</h2>
        <p class="lead">Attractive plans fail without balance. Use this order.</p>
        <div class="timeline">
          <article>
            <div class="step">01</div>
            <div>
              <h3>Start with Joining (₹999)</h3>
              <p>Low ticket builds width. Aim 2:2 or 3:3 on Left/Right in the first 30 days so matching starts early.</p>
            </div>
          </article>
          <article>
            <div class="step">02</div>
            <div>
              <h3>Upgrade serious buyers to Investment</h3>
              <p>Only after trust. ROI story + Direct 2.5% creates cash for leaders; never hide the 30-month timeline.</p>
            </div>
          </article>
          <article>
            <div class="step">03</div>
            <div>
              <h3>Convert to Property (real asset)</h3>
              <p>YLK’s core strength. Push plots / flats / villas in multiples of ₹1 Lakh. Direct 2.5% one-time is the big cheque.</p>
            </div>
          </article>
          <article>
            <div class="step">04</div>
            <div>
              <h3>Keep legs equal every week</h3>
              <p>Matching dies when one side runs ahead. Always grow the weaker leg before adding more on the strong side.</p>
            </div>
          </article>
          <article>
            <div class="step">05</div>
            <div>
              <h3>Duplicate, don’t only sell</h3>
              <p>Train 2–3 leaders who can explain this same calculator. Depth + balance beats random width.</p>
            </div>
          </article>
        </div>

        <div class="strategy-grid" style="margin-top:1.2rem">
          <article class="strategy-card">
            <h3>Width first</h3>
            <p>Joining packages create pairs fast. Target personal 8–10 joins, then help them each get 2.</p>
          </article>
          <article class="strategy-card">
            <h3>Balance always</h3>
            <p>If Left = 12 and Right = 4, you only match 4. Fix Right before chasing more Left.</p>
          </article>
          <article class="strategy-card">
            <h3>Property = brand</h3>
            <p>Long-term profit and company reputation come from real inventory — not only cash packages.</p>
          </article>
        </div>
      </section>`;
  }

  function dosDonts() {
    return `
      <section class="plan-wrap plan-sec" id="rules">
        <h2>Do’s and Don’ts</h2>
        <p class="lead">Protect profit, partners and the YLK Infra brand.</p>
        <div class="dos-grid">
          <article class="dos-card do">
            <h3>Do’s — for full & lasting profit</h3>
            <ul>
              <li>Show this plan page / calculator before taking money.</li>
              <li>Explain Matching = min(Left, Right) with a paper sketch.</li>
              <li>Push real property bookings (Package C) as the main story.</li>
              <li>Keep KYC, bank trail and invoices for every package.</li>
              <li>Balance weak leg weekly; celebrate pairs, not only directs.</li>
              <li>Use partner codes so Direct credits go to the right person.</li>
              <li>Quote ROI as “₹3,000/month for 30 months on ₹50,000” — clear, not vague.</li>
              <li>Follow RERA / company legal counsel for property claims.</li>
              <li>Train leaders with the same numbers — one language, no rumours.</li>
              <li>Reinvest a share of Direct into Property for asset wealth.</li>
            </ul>
          </article>
          <article class="dos-card dont">
            <h3>Don’ts — these kill profit & trust</h3>
            <ul>
              <li>Don’t promise “double money in 30 days” or fake guaranteed bank-like deposits.</li>
              <li>Don’t enrol only one leg (power leg) and ignore matching.</li>
              <li>Don’t hide that ROI on Invest stops after 30 months.</li>
              <li>Don’t sell Package B as a substitute for regulated mutual funds / deposits without licences.</li>
              <li>Don’t fake property photos or sold-out units as available.</li>
              <li>Don’t take cash without receipt / WhatsApp confirmation to +91 94125 02030 desk.</li>
              <li>Don’t change % slabs verbally — only company-published plan.</li>
              <li>Don’t recruit minors or use pressure / “last slot” lies.</li>
              <li>Don’t pay personal “advance commission” from your pocket to close a deal.</li>
              <li>Don’t ignore compliance: illegal money-circulation schemes destroy the whole chain.</li>
            </ul>
          </article>
        </div>

        <div class="disclaimer-box" style="margin-top:1.2rem">
          <strong>Important compliance note</strong>
          This page is an internal / partner education tool for YLK Infra’s published slabs.
          ROI and bonus illustrations are not a bank deposit, mutual fund or SEBI-registered product.
          Property sales must follow RERA and title norms. Run Package B only under proper corporate and legal clearance.
        </div>
      </section>`;
  }

  function summaryTable() {
    return `
      <section class="plan-wrap plan-sec" id="summary">
        <h2>One-page summary</h2>
        <div style="overflow-x:auto">
          <table class="earn-table">
            <thead>
              <tr>
                <th>Package</th>
                <th>Amount</th>
                <th>Direct</th>
                <th>Matching</th>
                <th>Other</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>A. Joining</b></td>
                <td>₹999</td>
                <td class="good">10% ≈ ₹100</td>
                <td class="good">10% ≈ ₹100 / pair</td>
                <td>—</td>
              </tr>
              <tr>
                <td><b>B. Investment</b></td>
                <td>₹50,000</td>
                <td class="good">2.5% = ₹1,250</td>
                <td class="good">1% = ₹500 / pair</td>
                <td class="good">ROI 6%/mo × 30 = ₹90,000</td>
              </tr>
              <tr>
                <td><b>C. Property</b></td>
                <td>₹1,00,000 × N</td>
                <td class="good">2.5% one time</td>
                <td class="good">1.0% on matched units</td>
                <td>Real asset booking</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>`;
  }

  function cta() {
    const c = YLKStore.company();
    return `
      <section class="plan-wrap">
        <div class="plan-cta">
          <div>
            <h2>Ready to join the plan?</h2>
            <p>WhatsApp the desk with your name, city and which package you want explained on a call.</p>
          </div>
          <div class="actions">
            <button class="btn btn-gold" type="button" data-open-book>Book / Enquire</button>
            <a class="btn btn-ghost" href="tel:${c.phoneTel}">${c.phone}</a>
            <a class="btn btn-ghost" href="partners.html">Partner page</a>
          </div>
        </div>
      </section>`;
  }

  function renderJoin() {
    const directs = Math.max(0, Number($("#jDirects")?.value || 0));
    const left = Math.max(0, Number($("#jLeft")?.value || 0));
    const right = Math.max(0, Number($("#jRight")?.value || 0));
    const pairs = Math.min(left, right);
    const carry = Math.abs(left - right);
    const directPay = directs * PKG.join.amount * PKG.join.directPct;
    const matchPay = pairs * PKG.join.amount * PKG.join.matchPct;
    const total = directPay + matchPay;
    $("#jOut").innerHTML = `
      <article><span class="label">Direct Referral (${directs} × 10%)</span><span class="val">${inrDec(directPay)}</span></article>
      <article><span class="label">Matching pairs (${pairs})</span><span class="val">${inrDec(matchPay)}</span></article>
      <article><span class="label">Carry-forward (unmatched)</span><span class="val">${carry} join(s)</span></article>
      <article class="total"><span class="label">Joining income now</span><span class="val">${inrDec(total)}</span></article>`;
  }

  function renderInvest() {
    const own = Math.max(0, Number($("#iOwn")?.value || 0));
    const directs = Math.max(0, Number($("#iDirects")?.value || 0));
    const left = Math.max(0, Number($("#iLeft")?.value || 0));
    const right = Math.max(0, Number($("#iRight")?.value || 0));
    const pairs = Math.min(left, right);
    const monthlyRoi = own * PKG.invest.amount * PKG.invest.roiMonthlyPct;
    const totalRoi = monthlyRoi * PKG.invest.months;
    const directPay = directs * PKG.invest.amount * PKG.invest.directPct;
    const matchPay = pairs * PKG.invest.amount * PKG.invest.matchPct;
    const firstMonth = monthlyRoi + directPay + matchPay;
    $("#iOut").innerHTML = `
      <article><span class="label">Monthly ROI (your packages)</span><span class="val">${inr(monthlyRoi)}</span></article>
      <article><span class="label">30-month ROI total</span><span class="val">${inr(totalRoi)}</span></article>
      <article><span class="label">Direct Referral 2.5%</span><span class="val">${inr(directPay)}</span></article>
      <article><span class="label">Matching 1% (${pairs} pairs)</span><span class="val">${inr(matchPay)}</span></article>
      <article class="total"><span class="label">First-month cash (ROI + bonuses)</span><span class="val">${inr(firstMonth)}</span></article>`;
  }

  function renderProperty() {
    let value = Math.max(0, Number($("#pValue")?.value || 0));
    const units = Math.floor(value / PKG.property.unit);
    value = units * PKG.property.unit;
    const isDirect = $("#pIsDirect")?.value === "1";
    let pairs = Math.max(0, Number($("#pPairs")?.value || 0));
    pairs = Math.min(pairs, units || pairs);
    const directPay = isDirect ? value * PKG.property.directPct : 0;
    const matchPay = pairs * PKG.property.unit * PKG.property.matchPct;
    const total = directPay + matchPay;
    const warn =
      Number($("#pValue")?.value || 0) % PKG.property.unit !== 0
        ? `<article><span class="label">Note</span><span class="val" style="font-size:1rem;color:#e0c36a">Rounded to ${units} × ₹1 Lakh = ${inr(value)}</span></article>`
        : "";
    $("#pOut").innerHTML =
      warn +
      `
      <article><span class="label">Bookable units</span><span class="val">${units}</span></article>
      <article><span class="label">Direct 2.5% (one time)</span><span class="val">${inr(directPay)}</span></article>
      <article><span class="label">Matching 1% (${pairs} units)</span><span class="val">${inr(matchPay)}</span></article>
      <article class="total"><span class="label">Property income</span><span class="val">${inr(total)}</span></article>`;
  }

  function bindCalcs() {
    ["jDirects", "jLeft", "jRight"].forEach((id) => $("#" + id)?.addEventListener("input", renderJoin));
    ["iOwn", "iDirects", "iLeft", "iRight"].forEach((id) => $("#" + id)?.addEventListener("input", renderInvest));
    ["pValue", "pIsDirect", "pPairs"].forEach((id) => {
      const el = $("#" + id);
      if (!el) return;
      el.addEventListener("input", renderProperty);
      el.addEventListener("change", renderProperty);
    });
    renderJoin();
    renderInvest();
    renderProperty();
  }

  function page() {
    return (
      hero() +
      toc() +
      packages() +
      workedExamples() +
      calculator() +
      strategy() +
      dosDonts() +
      summaryTable() +
      cta()
    );
  }

  async function boot() {
    const root = $("#page-root");
    if (!root || document.body.dataset.page !== "plan") return;
    root.innerHTML = `<p class="boot-msg">${YLKStore.t("load")}</p>`;
    try {
      await YLKStore.init();
      YLKUI.mount();
      root.innerHTML = page();
      root.classList.add("plan-page");
      bindCalcs();
      document.title = "Strategic MLM / Partner Income Plan | YLK Infra";
    } catch (err) {
      console.error(err);
      root.innerHTML = `<p class="boot-msg">Could not open the plan. Serve over http and refresh.</p>`;
    }
  }

  return { boot, page };
})();

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "plan") YLKPlan.boot();
});
