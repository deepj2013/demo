<?php
$problems = json_decode(@file_get_contents(__DIR__ . '/data/problems.json'), true) ?: [];
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="A bilingual resident-led portal to document local issues, gather opinions and approach authorities together.">
  <title>Saath — Our Area, Our Voice</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <header class="nav">
    <a class="brand" href="#top"><span class="brandmark">स</span><span>SAATH<small data-i18n="brandSub">Resident Initiative</small></span></a>
    <nav>
      <a href="#issues" data-i18n="navIssues">Issues</a><a href="#approach" data-i18n="navGov">Government approach</a><a href="#committee" data-i18n="navCommittee">Committee</a>
    </nav>
    <div class="nav-actions"><button id="langBtn" class="lang">हिंदी</button><a class="button small" href="#survey" data-i18n="shareOpinion">Share opinion</a></div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow" data-i18n="eyebrow">RESIDENT-LED • TRANSPARENT • NON-PARTISAN</span>
        <h1 data-i18n="heroTitle">One neighbourhood.<br><em>One stronger voice.</em></h1>
        <p data-i18n="heroText">Document real problems, understand practical solutions and approach the right authority together. We are not asking for money today—we are asking what you think.</p>
        <div class="hero-actions"><a class="button" href="#survey" data-i18n="takeSurvey">Take the 3-minute survey</a><a class="text-link" href="#issues" data-i18n="exploreIssues">Explore local issues →</a></div>
        <div class="trust-row"><span data-i18n="noOtp">No OTP</span><span data-i18n="noPayment">No payment</span><span data-i18n="privacy">Minimal personal data</span></div>
      </div>
      <aside class="pulse-card">
        <div class="pulse-top"><span data-i18n="areaPulse">AREA PULSE</span><span class="live" data-i18n="live">● LIVE</span></div>
        <div class="big-number" id="responseCount">0</div><p data-i18n="voicesRecorded">resident voices recorded</p>
        <div class="stat-grid"><div><strong><?= count($problems) ?></strong><span data-i18n="issuesMapped">issues mapped</span></div><div><strong id="volunteerCount">0</strong><span data-i18n="volunteers">volunteers</span></div></div>
        <div class="meter"><label><span data-i18n="committeeSupport">Support a committee</span><b id="supportPercent">—</b></label><i><u id="supportBar"></u></i></div>
      </aside>
    </section>

    <section class="promise-strip"><b data-i18n="todayGoal">Today’s goal</b><span data-i18n="todayText">Listen first. Build evidence. Organise residents. Then act together.</span></section>

    <section class="section" id="issues">
      <div class="section-head"><div><span class="eyebrow" data-i18n="evidenceFirst">EVIDENCE FIRST</span><h2 data-i18n="knownIssues">Known issues in our area</h2></div><p data-i18n="issuesIntro">Each issue includes the public impact, likely responsibility and a realistic route forward. Select a card for full details.</p></div>
      <div class="filter-row" id="filters"><button class="active" data-filter="all" data-i18n="all">All</button><button data-filter="Civic" data-i18n="civic">Civic</button><button data-filter="Safety" data-i18n="safety">Safety</button><button data-filter="Education" data-i18n="education">Education</button><button data-filter="Environment" data-i18n="environment">Environment</button></div>
      <div class="problem-grid" id="problemGrid">
      <?php foreach ($problems as $p): ?>
        <article class="problem-card" data-category="<?= htmlspecialchars($p['category']) ?>" data-id="<?= htmlspecialchars($p['id']) ?>">
          <div class="problem-visual <?= strtolower($p['category']) ?>"><?php if (!empty($p['image'])): ?><img src="<?= htmlspecialchars($p['image']) ?>" alt=""><?php endif; ?><span><?= htmlspecialchars($p['icon']) ?></span><b><?= htmlspecialchars($p['priority']) ?></b></div>
          <div class="problem-body"><small><?= htmlspecialchars($p['category']) ?> · <?= htmlspecialchars($p['area']) ?></small><h3 data-en="<?= htmlspecialchars($p['title_en']) ?>" data-hi="<?= htmlspecialchars($p['title_hi']) ?>"><?= htmlspecialchars($p['title_en']) ?></h3><p data-en="<?= htmlspecialchars($p['summary_en']) ?>" data-hi="<?= htmlspecialchars($p['summary_hi']) ?>"><?= htmlspecialchars($p['summary_en']) ?></p><button class="text-link details" data-i18n="viewPlan">View problem & action plan →</button></div>
        </article>
      <?php endforeach; ?>
      </div>
    </section>

    <section class="map-section"><div class="map-copy"><span class="eyebrow" data-i18n="placeMatters">PLACE MATTERS</span><h2 data-i18n="mapTitle">The neighbourhood problem map</h2><p data-i18n="mapText">A shared map turns scattered complaints into clear evidence: where the issue is, who it affects and which department should respond.</p><ul><li data-i18n="mapOne">Click a marker to understand the issue</li><li data-i18n="mapTwo">Admin can add exact locations and photographs</li><li data-i18n="mapThree">Use the evidence in collective representations</li></ul></div><div id="map"></div></section>

    <section class="section approach" id="approach"><div class="section-head"><div><span class="eyebrow" data-i18n="collectiveAction">COLLECTIVE ACTION</span><h2 data-i18n="govTitle">How we approach government—together</h2></div><p data-i18n="govIntro">A complaint becomes harder to ignore when it is specific, evidenced, correctly addressed and followed up by many affected households.</p></div><div class="steps">
      <div><b>01</b><h3 data-i18n="step1t">Document</h3><p data-i18n="step1p">Photos, dates, map location, affected streets and a factual description.</p></div><div><b>02</b><h3 data-i18n="step2t">Verify responsibility</h3><p data-i18n="step2p">Identify the municipal body, police, excise, education or development authority.</p></div><div><b>03</b><h3 data-i18n="step3t">Build support</h3><p data-i18n="step3p">Collect survey responses, signatures and accounts from affected residents.</p></div><div><b>04</b><h3 data-i18n="step4t">Submit & track</h3><p data-i18n="step4p">File through the official channel, save the reference and follow timelines.</p></div><div><b>05</b><h3 data-i18n="step5t">Escalate calmly</h3><p data-i18n="step5p">Send reminders, seek meetings, use RTI/grievance escalation where appropriate.</p></div>
    </div><div class="boundary"><strong data-i18n="importantBoundary">Important boundary</strong><p data-i18n="boundaryText">Residents should not take illegal action, confront individuals, obstruct a business or alter public land. Verify facts, protect children’s privacy, use lawful channels and obtain professional advice where needed.</p></div></section>

    <section class="committee-section" id="committee"><div><span class="eyebrow light" data-i18n="whyOrganise">WHY ORGANISE?</span><h2 data-i18n="committeeTitle">A committee turns concern into continuity.</h2><p data-i18n="committeeText">It distributes responsibility, records decisions and represents the area beyond one individual.</p><a class="button cream" href="#volunteer" data-i18n="wantHelp">I want to help</a></div><div class="benefits"><article><b data-i18n="direct">Direct benefits</b><p data-i18n="directText">Coordinated cleanliness, documented complaints, security planning, emergency coordination and transparent follow-up.</p></article><article><b data-i18n="indirect">Indirect benefits</b><p data-i18n="indirectText">Stronger neighbour relationships, greater civic awareness, a safer public environment and a more desirable locality.</p></article><article><b data-i18n="principle">Operating principle</b><p data-i18n="principleText">No one person controls everything. Roles, records, approvals and public reporting create trust.</p></article></div></section>

    <section class="form-section" id="survey"><div class="form-intro"><span class="eyebrow" data-i18n="yourVoice">YOUR VOICE</span><h2 data-i18n="surveyTitle">What does our area need first?</h2><p data-i18n="surveyText">This short survey helps establish priorities. Phone number is used only for initiative updates and duplicate review; it will never appear publicly.</p><div class="privacy-note"><b data-i18n="dataPromise">Our data promise</b><span data-i18n="dataText">No Aadhaar or PAN. No sale of data. Public results are aggregated.</span></div></div>
      <form id="surveyForm" class="public-form">
        <input type="hidden" name="action" value="survey">
        <label><span data-i18n="name">Full name *</span><input name="name" required maxlength="80"></label><label><span data-i18n="phone">Mobile number *</span><input name="phone" required pattern="[0-9 +()-]{10,15}" inputmode="tel"></label>
        <label><span data-i18n="street">House / street / block *</span><input name="street" required maxlength="120"></label><label><span data-i18n="residentType">You are a *</span><select name="resident_type" required><option value="">Select</option><option>Owner</option><option>Tenant</option><option>Shopkeeper</option><option>Other</option></select></label>
        <fieldset class="full"><legend data-i18n="topThree">Select your top 3 concerns *</legend><div class="checks" id="priorityChecks"><?php foreach ($problems as $p): ?><label><input type="checkbox" name="priorities[]" value="<?= htmlspecialchars($p['id']) ?>"><span data-en="<?= htmlspecialchars($p['title_en']) ?>" data-hi="<?= htmlspecialchars($p['title_hi']) ?>"><?= htmlspecialchars($p['title_en']) ?></span></label><?php endforeach; ?></div></fieldset>
        <label class="full"><span data-i18n="solutionIdea">Your experience or suggested solution</span><textarea name="suggestion" rows="4" maxlength="1500"></textarea></label>
        <label><span data-i18n="supportCommittee">Support a resident committee?</span><select name="committee_support"><option>Yes</option><option>Maybe</option><option>No</option></select></label><label><span data-i18n="contribution">If collectively approved?</span><select name="contribution"><option>Depends on project</option><option>₹100/month</option><option>₹200/month</option><option>₹300/month</option><option>₹500+/month</option><option>Not now</option></select></label>
        <label class="consent full"><input type="checkbox" name="consent" value="yes" required><span data-i18n="consent">I consent to being contacted about this resident initiative. *</span></label>
        <button class="button full" type="submit" data-i18n="submitOpinion">Submit my opinion</button><p class="form-status full" aria-live="polite"></p>
      </form>
    </section>

    <section class="form-section alt" id="volunteer"><div class="form-intro"><span class="eyebrow" data-i18n="giveTime">GIVE TIME, SHARE SKILLS</span><h2 data-i18n="volTitle">Help shape the initiative</h2><p data-i18n="volText">Expressing interest does not automatically make anyone a committee member. It helps identify volunteers and potential representatives for an open selection later.</p></div><form id="volunteerForm" class="public-form"><input type="hidden" name="action" value="volunteer"><label><span data-i18n="name">Full name *</span><input name="name" required></label><label><span data-i18n="phone">Mobile number *</span><input name="phone" required></label><label><span data-i18n="street">House / street / block *</span><input name="street" required></label><label><span data-i18n="interest">Area of interest *</span><select name="interest" required><option>Infrastructure</option><option>Cleanliness & Environment</option><option>Government Coordination</option><option>Finance & Transparency</option><option>Legal & Compliance</option><option>Women, Children & Seniors</option><option>Technology & Communication</option><option>Street Representative</option><option>General Volunteer</option></select></label><label><span data-i18n="time">Time available monthly</span><input name="hours" placeholder="e.g. 4 hours"></label><label><span data-i18n="profession">Profession / useful skills</span><input name="skills"></label><label class="full"><span data-i18n="whyJoin">Why would you like to help?</span><textarea name="reason" rows="4"></textarea></label><label class="consent full"><input type="checkbox" name="consent" value="yes" required><span data-i18n="consent">I consent to being contacted about this resident initiative. *</span></label><button class="button full" type="submit" data-i18n="submitInterest">Submit interest</button><p class="form-status full"></p></form></section>
  </main>

  <footer><div class="brand"><span class="brandmark">स</span><span>SAATH<small data-i18n="brandSub">Resident Initiative</small></span></div><p data-i18n="footerText">A resident-led platform for evidence, participation and lawful collective action.</p><a href="admin.php" data-i18n="adminLogin">Admin login</a></footer>

  <dialog id="problemDialog"><button class="close" aria-label="Close">×</button><div id="dialogContent"></div></dialog>
  <script>window.PROBLEMS = <?= json_encode($problems, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES) ?>;</script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script src="assets/app.js"></script>
</body></html>
