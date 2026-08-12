<?php
declare(strict_types=1);

/**
 * Printable / PDF-ready Kundli HTML report (Unicode-safe for Indian languages).
 */
final class KundliReport
{
    public static function labels(string $lang): array
    {
        $packs = [
            'en' => [
                'title' => 'Birth Kundli Report', 'name' => 'Name', 'phone' => 'Mobile',
                'dob' => 'Date of Birth', 'tob' => 'Time of Birth', 'place' => 'Place',
                'gender' => 'Gender', 'lagna' => 'Lagna', 'moon' => 'Moon', 'sun' => 'Sun',
                'planets' => 'Planetary Positions', 'houses' => 'Houses', 'dasha' => 'Vimshottari Dasha',
                'dosha' => 'Dosha Analysis', 'panchang' => 'Birth Panchang', 'charges' => 'Regional Jyotish Charges',
                'prepared' => 'Prepared by', 'page' => 'Confidential Jyotish Report',
                'graha' => 'Graha', 'rashi' => 'Rashi', 'nak' => 'Nakshatra', 'deg' => 'Degree',
                'current' => 'Current Dasha', 'navamsa' => 'Navamsa (D9)', 'summary' => 'Summary',
                'download' => 'Download PDF', 'print' => 'Print', 'fee_kundli' => 'Kundli fee',
                'fee_match' => 'Matching fee', 'fee_consult' => 'Consultation fee', 'region' => 'Region',
            ],
            'hi' => [
                'title' => 'जन्म कुंडली रिपोर्ट', 'name' => 'नाम', 'phone' => 'मोबाइल',
                'dob' => 'जन्म तिथि', 'tob' => 'जन्म समय', 'place' => 'स्थान',
                'gender' => 'लिंग', 'lagna' => 'लग्न', 'moon' => 'चंद्र', 'sun' => 'सूर्य',
                'planets' => 'ग्रह स्थिति', 'houses' => 'भाव', 'dasha' => 'विंशोत्तरी दशा',
                'dosha' => 'दोष विश्लेषण', 'panchang' => 'जन्म पंचांग', 'charges' => 'क्षेत्रीय ज्योतिष शुल्क',
                'prepared' => 'द्वारा तैयार', 'page' => 'गोपनीय ज्योतिष रिपोर्ट',
                'graha' => 'ग्रह', 'rashi' => 'राशि', 'nak' => 'नक्षत्र', 'deg' => 'अंश',
                'current' => 'वर्तमान दशा', 'navamsa' => 'नवमांश (D9)', 'summary' => 'सारांश',
                'download' => 'PDF डाउनलोड', 'print' => 'प्रिंट', 'fee_kundli' => 'कुंडली शुल्क',
                'fee_match' => 'मिलान शुल्क', 'fee_consult' => 'परामर्श शुल्क', 'region' => 'क्षेत्र',
            ],
            'ta' => [
                'title' => 'ஜாதக அறிக்கை', 'name' => 'பெயர்', 'phone' => 'கைபேசி',
                'dob' => 'பிறந்த தேதி', 'tob' => 'பிறந்த நேரம்', 'place' => 'இடம்',
                'gender' => 'பாலினம்', 'lagna' => 'லக்னம்', 'moon' => 'சந்திரன்', 'sun' => 'சூரியன்',
                'planets' => 'கிரக நிலைகள்', 'houses' => 'பாவங்கள்', 'dasha' => 'விம்சோத்தரி தசை',
                'dosha' => 'தோஷ பகுப்பாய்வு', 'panchang' => 'பிறப்பு பஞ்சாங்கம்', 'charges' => 'பிராந்திய ஜோதிட கட்டணம்',
                'prepared' => 'தயாரித்தவர்', 'page' => 'ரகசிய ஜோதிட அறிக்கை',
                'graha' => 'கிரகம்', 'rashi' => 'ராசி', 'nak' => 'நட்சத்திரம்', 'deg' => 'டிகிரி',
                'current' => 'தற்போதைய தசை', 'navamsa' => 'நவாம்சம் (D9)', 'summary' => 'சுருக்கம்',
                'download' => 'PDF பதிவிறக்கம்', 'print' => 'அச்சிடு', 'fee_kundli' => 'ஜாதக கட்டணம்',
                'fee_match' => 'பொருத்த கட்டணம்', 'fee_consult' => 'ஆலோசனை கட்டணம்', 'region' => 'பிரதேசம்',
            ],
            'te' => [
                'title' => 'జాతక నివేదిక', 'name' => 'పేరు', 'phone' => 'మొబైల్',
                'dob' => 'జన్మ తేదీ', 'tob' => 'జన్మ సమయం', 'place' => 'స్థలం',
                'gender' => 'లింగం', 'lagna' => 'లగ్నం', 'moon' => 'చంద్రుడు', 'sun' => 'సూర్యుడు',
                'planets' => 'గ్రహ స్థితులు', 'houses' => 'భావాలు', 'dasha' => 'వింశోత్తరి దశ',
                'dosha' => 'దోష విశ్లేషణ', 'panchang' => 'జన్మ పంచాంగం', 'charges' => 'ప్రాంతీయ జ్యోతిష రుసుము',
                'prepared' => 'తయారుచేసినవారు', 'page' => 'గోప్య జ్యోతిష నివేదిక',
                'graha' => 'గ్రహం', 'rashi' => 'రాశి', 'nak' => 'నక్షత్రం', 'deg' => 'డిగ్రీ',
                'current' => 'ప్రస్తుత దశ', 'navamsa' => 'నవాంశ (D9)', 'summary' => 'సారాంశం',
                'download' => 'PDF డౌన్‌లోడ్', 'print' => 'ప్రింట్', 'fee_kundli' => 'జాతక రుసుము',
                'fee_match' => 'మేళన రుసుము', 'fee_consult' => 'సలహా రుసుము', 'region' => 'ప్రాంతం',
            ],
            'mr' => [
                'title' => 'जन्म कुंडली अहवाल', 'name' => 'नाव', 'phone' => 'मोबाइल',
                'dob' => 'जन्म तारीख', 'tob' => 'जन्म वेळ', 'place' => 'स्थान',
                'gender' => 'लिंग', 'lagna' => 'लग्न', 'moon' => 'चंद्र', 'sun' => 'सूर्य',
                'planets' => 'ग्रह स्थिती', 'houses' => 'भाव', 'dasha' => 'विंशोत्तरी दशा',
                'dosha' => 'दोष विश्लेषण', 'panchang' => 'जन्म पंचांग', 'charges' => 'प्रादेशिक ज्योतिष शुल्क',
                'prepared' => 'तयार करणारे', 'page' => 'गोपनीय ज्योतिष अहवाल',
                'graha' => 'ग्रह', 'rashi' => 'राशी', 'nak' => 'नक्षत्र', 'deg' => 'अंश',
                'current' => 'सध्याची दशा', 'navamsa' => 'नवमांश (D9)', 'summary' => 'सारांश',
                'download' => 'PDF डाउनलोड', 'print' => 'प्रिंट', 'fee_kundli' => 'कुंडली शुल्क',
                'fee_match' => 'जुळणी शुल्क', 'fee_consult' => 'सल्ला शुल्क', 'region' => 'प्रदेश',
            ],
            'bn' => [
                'title' => 'জন্ম কুণ্ডলী রিপোর্ট', 'name' => 'নাম', 'phone' => 'মোবাইল',
                'dob' => 'জন্ম তারিখ', 'tob' => 'জন্ম সময়', 'place' => 'স্থান',
                'gender' => 'লিঙ্গ', 'lagna' => 'লগ্ন', 'moon' => 'চন্দ্র', 'sun' => 'সূর্য',
                'planets' => 'গ্রহ অবস্থান', 'houses' => 'ভাব', 'dasha' => 'বিংশোত্তরী দশা',
                'dosha' => 'দোষ বিশ্লেষণ', 'panchang' => 'জন্ম পঞ্জিকা', 'charges' => 'আঞ্চলিক জ্যোতিষ ফি',
                'prepared' => 'প্রস্তুতকারক', 'page' => 'গোপনীয় জ্যোতিষ রিপোর্ট',
                'graha' => 'গ্রহ', 'rashi' => 'রাশি', 'nak' => 'নক্ষত্র', 'deg' => 'ডিগ্রি',
                'current' => 'বর্তমান দশা', 'navamsa' => 'নবাংশ (D9)', 'summary' => 'সারাংশ',
                'download' => 'PDF ডাউনলোড', 'print' => 'প্রিন্ট', 'fee_kundli' => 'কুণ্ডলী ফি',
                'fee_match' => 'মিলন ফি', 'fee_consult' => 'পরামর্শ ফি', 'region' => 'অঞ্চল',
            ],
            'gu' => [
                'title' => 'જન્મ કુંડળી રિપોર્ટ', 'name' => 'નામ', 'phone' => 'મોબાઇલ',
                'dob' => 'જન્મ તારીખ', 'tob' => 'જન્મ સમય', 'place' => 'સ્થળ',
                'gender' => 'લિંગ', 'lagna' => 'લગ્ન', 'moon' => 'ચંદ્ર', 'sun' => 'સૂર્ય',
                'planets' => 'ગ્રહ સ્થિતિ', 'houses' => 'ભાવ', 'dasha' => 'વિંશોત્તરી દશા',
                'dosha' => 'દોષ વિશ્લેષણ', 'panchang' => 'જન્મ પંચાંગ', 'charges' => 'પ્રાદેશિક જ્યોતિષ ફી',
                'prepared' => 'તૈયાર કરનાર', 'page' => 'ગોપનીય જ્યોતિષ રિપોર્ટ',
                'graha' => 'ગ્રહ', 'rashi' => 'રાશિ', 'nak' => 'નક્ષત્ર', 'deg' => 'અંશ',
                'current' => 'વર્તમાન દશા', 'navamsa' => 'નવમાંશ (D9)', 'summary' => 'સારાંશ',
                'download' => 'PDF ડાઉનલોડ', 'print' => 'પ્રિન્ટ', 'fee_kundli' => 'કુંડળી ફી',
                'fee_match' => 'મેળ ફી', 'fee_consult' => 'સલાહ ફી', 'region' => 'પ્રદેશ',
            ],
        ];
        return $packs[$lang] ?? $packs['en'];
    }

    public static function render(array $chart, array $opts = []): string
    {
        $lang = (string) ($opts['lang'] ?? 'en');
        $L = self::labels($lang);
        $tenant = $opts['tenant'] ?? [];
        $user = $opts['user'] ?? [];
        $charges = $opts['charges'] ?? [];
        $meta = $chart['meta'] ?? [];
        $lagna = $chart['lagna'] ?? [];
        $moon = $chart['rashi']['moon'] ?? [];
        $sun = $chart['rashi']['sun'] ?? [];
        $planets = array_values($chart['planets'] ?? []);
        $houses = array_values($chart['houses'] ?? []);
        $dasha = $chart['dasha'] ?? [];
        $pan = $chart['panchang_at_birth'] ?? [];
        $d9 = $chart['vargas']['D9'] ?? null;
        $useHi = in_array($lang, ['hi', 'mr'], true);

        $rashi = static function (array $p) use ($useHi): string {
            return $useHi ? (string) ($p['rashi_hi'] ?? $p['rashi'] ?? '') : (string) ($p['rashi'] ?? '');
        };
        $nak = static function (array $p) use ($useHi): string {
            return $useHi ? (string) ($p['nakshatra_hi'] ?? $p['nakshatra'] ?? '') : (string) ($p['nakshatra'] ?? '');
        };

        $summary = $chart['summary'][$lang] ?? $chart['summary']['en'] ?? $chart['summary']['hi'] ?? '';
        $phone = (string) ($user['phone'] ?? '');
        $userName = (string) ($user['name'] ?? '');
        $native = (string) ($meta['name'] ?? '');
        $brand = (string) ($tenant['brand'] ?? 'Jyoti Mandir');
        $astro = (string) ($tenant['astrologer'] ?? '');
        $currency = (string) ($charges['currency'] ?? 'INR');
        $region = (string) ($charges['region'] ?? ($user['city'] ?? ($tenant['city'] ?? '')));

        $planetRows = '';
        foreach ($planets as $p) {
            $planetRows .= '<tr><td>' . self::e($p['name'] ?? '') . '</td><td>' . self::e($rashi($p))
                . '</td><td>' . self::e($nak($p)) . ' P' . self::e((string) ($p['pada'] ?? ''))
                . '<br><small>' . self::e((string) ($p['nakshatra_lord'] ?? '')) . '</small></td><td>'
                . self::e((string) ($p['dms'] ?? '')) . '</td></tr>';
        }

        $houseRows = '';
        foreach ($houses as $h) {
            $houseRows .= '<tr><td>H' . (int) ($h['house'] ?? 0) . '</td><td>'
                . self::e($useHi ? (string) ($h['rashi_hi'] ?? '') : (string) ($h['rashi'] ?? ''))
                . '</td><td>' . self::e(implode(', ', $h['planets'] ?? []))
                . '</td><td>' . self::e($useHi ? (string) ($h['meaning']['hi'] ?? '') : (string) ($h['meaning']['en'] ?? ''))
                . '</td></tr>';
        }

        $dashaRows = '';
        foreach (array_slice($dasha['mahadashas'] ?? [], 0, 9) as $d) {
            $dashaRows .= '<tr><td>' . self::e($d['lord'] ?? '') . '</td><td>'
                . self::e(($d['start'] ?? '') . ' → ' . ($d['end'] ?? '')) . '</td><td>'
                . self::e((string) ($d['years'] ?? '')) . 'y</td></tr>';
        }

        $current = $dasha['current']['label']
            ?? (($dasha['current']['mahadasha']['lord'] ?? '') . ' / ' . ($dasha['current']['antardasha']['lord'] ?? ''));

        $tithi = '';
        if (!empty($pan['tithi'])) {
            $tithi = $useHi
                ? (($pan['tithi']['paksha_hi'] ?? '') . ' ' . ($pan['tithi']['name_hi'] ?? ''))
                : (($pan['tithi']['paksha'] ?? '') . ' ' . ($pan['tithi']['name'] ?? ''));
        }

        $chargeBlock = '';
        if (!empty($charges['show_on_pdf']) || !empty($opts['include_charges'])) {
            $chargeBlock = '<section class="block"><h2>' . self::e($L['charges']) . '</h2>
              <table><tr><th>' . self::e($L['region']) . '</th><td>' . self::e($region) . '</td></tr>
              <tr><th>' . self::e($L['fee_kundli']) . '</th><td>' . self::e($currency . ' ' . ($charges['kundli'] ?? '501')) . '</td></tr>
              <tr><th>' . self::e($L['fee_match']) . '</th><td>' . self::e($currency . ' ' . ($charges['matching'] ?? '1100')) . '</td></tr>
              <tr><th>' . self::e($L['fee_consult']) . '</th><td>' . self::e($currency . ' ' . ($charges['consultation'] ?? '2100')) . '</td></tr>
              </table></section>';
        }

        $d9Block = '';
        if ($d9) {
            $d9Block = '<section class="block"><h2>' . self::e($L['navamsa']) . '</h2>
              <p><strong>' . self::e($L['lagna']) . ':</strong> '
                . self::e($useHi ? (string) ($d9['lagna']['rashi_hi'] ?? '') : (string) ($d9['lagna']['rashi'] ?? ''))
                . '</p></section>';
        }

        $manglik = $chart['manglik']['note'][$lang] ?? $chart['manglik']['note']['en'] ?? '';
        $kalsarpa = $chart['kalsarpa']['note'][$lang] ?? $chart['kalsarpa']['note']['en'] ?? '';
        $filename = preg_replace('/[^a-zA-Z0-9_-]+/', '-', 'kundli-' . $native . '-' . ($meta['date'] ?? '')) ?: 'kundli-report';

        return '<!DOCTYPE html><html lang="' . self::e($lang) . '"><head><meta charset="UTF-8"/>
<title>' . self::e($L['title'] . ' — ' . $native) . '</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&family=Noto+Sans+Tamil:wght@400;700&family=Noto+Sans+Telugu:wght@400;700&family=Noto+Sans+Bengali:wght@400;700&family=Noto+Sans+Gujarati:wght@400;700&display=swap" rel="stylesheet"/>
<style>
  :root { --ink:#1c1410; --muted:#6b5b4f; --line:#e6d7c3; --primary:#7a1f1f; --accent:#c8962e; --paper:#fffdf8; }
  * { box-sizing:border-box; }
  body { margin:0; font-family:"Noto Sans","Noto Sans Devanagari","Noto Sans Tamil","Noto Sans Telugu","Noto Sans Bengali","Noto Sans Gujarati",sans-serif; color:var(--ink); background:#ece4d7; }
  .toolbar { position:sticky; top:0; z-index:5; display:flex; gap:.6rem; justify-content:flex-end; padding:.75rem 1rem; background:#4e1212; }
  .toolbar button { border:0; border-radius:999px; padding:.55rem 1rem; font-weight:700; cursor:pointer; }
  .toolbar .dl { background:var(--accent); color:#1c1410; }
  .toolbar .pr { background:#fff8ef; color:#4e1212; }
  .sheet { width:min(900px,100%); margin:1rem auto 2rem; background:var(--paper); padding:1.5rem; box-shadow:0 20px 50px rgba(0,0,0,.12); }
  .head { border-bottom:2px solid var(--primary); padding-bottom:1rem; margin-bottom:1rem; display:flex; justify-content:space-between; gap:1rem; }
  .head h1 { margin:0; color:var(--primary); font-size:1.6rem; }
  .meta { color:var(--muted); font-size:.9rem; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
  .card { border:1px solid var(--line); border-radius:12px; padding:.75rem; background:#fff; }
  .card b { display:block; color:var(--primary); font-size:1.05rem; }
  .card span { color:var(--muted); font-size:.78rem; }
  table { width:100%; border-collapse:collapse; font-size:.88rem; margin-top:.4rem; }
  th, td { border-bottom:1px solid var(--line); text-align:left; padding:.45rem .3rem; vertical-align:top; }
  th { color:var(--muted); font-size:.72rem; text-transform:uppercase; letter-spacing:.04em; }
  .block { margin-top:1.15rem; }
  .block h2 { margin:0 0 .5rem; font-size:1.15rem; color:var(--primary); }
  .foot { margin-top:1.5rem; padding-top:.85rem; border-top:1px dashed var(--line); font-size:.82rem; color:var(--muted); display:flex; justify-content:space-between; gap:1rem; }
  @media print {
    body { background:#fff; }
    .toolbar { display:none !important; }
    .sheet { box-shadow:none; margin:0; width:100%; }
  }
  @media (max-width:700px){ .grid{grid-template-columns:1fr;} }
</style></head><body>
<div class="toolbar">
  <button class="pr" type="button" onclick="window.print()">' . self::e($L['print']) . '</button>
  <button class="dl" type="button" id="btn-pdf">' . self::e($L['download']) . '</button>
</div>
<div class="sheet" id="report">
  <div class="head">
    <div>
      <h1>' . self::e($brand) . '</h1>
      <div class="meta">' . self::e($L['title']) . ' · ' . self::e($L['page']) . '</div>
    </div>
    <div class="meta" style="text-align:right">
      <div>' . self::e($L['prepared']) . ': ' . self::e($astro) . '</div>
      <div>' . self::e(date('d M Y H:i')) . '</div>
    </div>
  </div>

  <section class="block">
    <div class="grid">
      <div class="card"><span>' . self::e($L['name']) . '</span><b>' . self::e($native) . '</b></div>
      <div class="card"><span>' . self::e($L['phone']) . '</span><b>+91 ' . self::e($phone) . '</b></div>
      <div class="card"><span>' . self::e($L['dob']) . ' / ' . self::e($L['tob']) . '</span><b>'
        . self::e(($meta['date'] ?? '') . ' · ' . ($meta['time'] ?? '')) . '</b></div>
      <div class="card"><span>' . self::e($L['place']) . '</span><b>' . self::e((string) ($meta['place'] ?? '')) . '</b></div>
      <div class="card"><span>' . self::e($L['gender']) . '</span><b>' . self::e((string) ($meta['gender'] ?? '')) . '</b></div>
      <div class="card"><span>Ayanamsa / Houses</span><b>'
        . self::e(($meta['ayanamsa_label'] ?? $meta['ayanamsa'] ?? '') . ' · ' . ($meta['house_system'] ?? '')) . '</b></div>
    </div>
  </section>

  <section class="block"><h2>' . self::e($L['summary']) . '</h2><p>' . self::e((string) $summary) . '</p>
    <div class="grid">
      <div class="card"><span>' . self::e($L['lagna']) . '</span><b>' . self::e($rashi($lagna)) . '</b><div class="meta">' . self::e($nak($lagna)) . ' P' . self::e((string) ($lagna['pada'] ?? '')) . '</div></div>
      <div class="card"><span>' . self::e($L['moon']) . '</span><b>' . self::e($rashi($moon)) . '</b><div class="meta">' . self::e($nak($moon)) . ' P' . self::e((string) ($moon['pada'] ?? '')) . '</div></div>
      <div class="card"><span>' . self::e($L['sun']) . '</span><b>' . self::e($rashi($sun)) . '</b><div class="meta">' . self::e($nak($sun)) . '</div></div>
      <div class="card"><span>' . self::e($L['current']) . '</span><b>' . self::e((string) $current) . '</b></div>
    </div>
  </section>

  <section class="block"><h2>' . self::e($L['panchang']) . '</h2>
    <table><tr><th>Vara</th><td>' . self::e($useHi ? (string) ($pan['vara']['hi'] ?? '') : (string) ($pan['vara']['en'] ?? '')) . '</td>
    <th>Tithi</th><td>' . self::e($tithi) . '</td></tr>
    <tr><th>Nakshatra</th><td>' . self::e($useHi ? (string) ($pan['nakshatra']['name_hi'] ?? '') : (string) ($pan['nakshatra']['name'] ?? '')) . '</td>
    <th>Yoga / Karana</th><td>' . self::e(($pan['yoga']['name'] ?? '') . ' / ' . ($pan['karana']['name'] ?? '')) . '</td></tr></table>
  </section>

  <section class="block"><h2>' . self::e($L['planets']) . '</h2>
    <table><thead><tr><th>' . self::e($L['graha']) . '</th><th>' . self::e($L['rashi']) . '</th><th>' . self::e($L['nak']) . '</th><th>' . self::e($L['deg']) . '</th></tr></thead>
    <tbody>' . $planetRows . '</tbody></table>
  </section>

  <section class="block"><h2>' . self::e($L['houses']) . '</h2>
    <table><thead><tr><th>#</th><th>' . self::e($L['rashi']) . '</th><th>Planets</th><th>Meaning</th></tr></thead>
    <tbody>' . $houseRows . '</tbody></table>
  </section>

  ' . $d9Block . '

  <section class="block"><h2>' . self::e($L['dasha']) . '</h2>
    <table><thead><tr><th>Lord</th><th>Period</th><th>Years</th></tr></thead><tbody>' . $dashaRows . '</tbody></table>
  </section>

  <section class="block"><h2>' . self::e($L['dosha']) . '</h2>
    <p>' . self::e((string) $manglik) . '</p>
    <p>' . self::e((string) $kalsarpa) . '</p>
  </section>

  ' . $chargeBlock . '

  <div class="foot">
    <div>' . self::e($brand) . ' · +91 ' . self::e((string) ($tenant['phone'] ?? '')) . '<br>' . self::e((string) ($tenant['email'] ?? '')) . '</div>
    <div style="text-align:right">Account: ' . self::e($userName) . '<br>+91 ' . self::e($phone) . '</div>
  </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script>
document.getElementById("btn-pdf").addEventListener("click", function(){
  var el = document.getElementById("report");
  var opt = { margin:10, filename:' . json_encode($filename . '.pdf') . ', image:{type:"jpeg",quality:0.98},
    html2canvas:{scale:2, useCORS:true}, jsPDF:{unit:"mm", format:"a4", orientation:"portrait"} };
  html2pdf().set(opt).from(el).save();
});
</script>
</body></html>';
    }

    private static function e(string $s): string
    {
        return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
