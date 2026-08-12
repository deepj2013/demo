<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('website');
$pageTitle = 'Website & client brand';
$activeNav = 'website';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    try {
        foreach (['hero', 'about', 'footer'] as $key) {
            $title = trim($_POST[$key.'_title'] ?? '');
            $body = trim($_POST[$key.'_body'] ?? '');
            $pdo->prepare('INSERT INTO site_content (section_key, title, body) VALUES (?,?,?)
              ON DUPLICATE KEY UPDATE title=VALUES(title), body=VALUES(body)')->execute([$key, $title, $body]);
        }

        $cfg = settings_reload();
        // Prefer cached+merged: start from current settings()
        $cfg = settings();
        $cfg['business_name'] = trim($_POST['business_name'] ?? $cfg['business_name']);
        $cfg['tagline'] = trim($_POST['tagline'] ?? ($cfg['tagline'] ?? ''));
        $cfg['app_name'] = trim($_POST['app_name'] ?? ($cfg['app_name'] ?? 'BoutiqueOS'));
        $cfg['currency_symbol'] = trim($_POST['currency_symbol'] ?? ($cfg['currency_symbol'] ?? '₹'));
        $cfg['theme']['primary'] = trim($_POST['theme_primary'] ?? $cfg['theme']['primary']);
        $cfg['theme']['accent'] = trim($_POST['theme_accent'] ?? $cfg['theme']['accent']);
        $cfg['theme']['surface'] = trim($_POST['theme_surface'] ?? $cfg['theme']['surface']);
        $cfg['contact']['email'] = trim($_POST['email'] ?? ($cfg['contact']['email'] ?? ''));
        $cfg['contact']['phone'] = trim($_POST['phone'] ?? ($cfg['contact']['phone'] ?? ''));
        $cfg['contact']['address'] = trim($_POST['address'] ?? ($cfg['contact']['address'] ?? ''));
        $cfg['contact']['whatsapp'] = trim($_POST['whatsapp'] ?? ($cfg['contact']['whatsapp'] ?? ''));
        $cfg['contact']['instagram'] = trim($_POST['instagram'] ?? ($cfg['contact']['instagram'] ?? ''));

        foreach (array_keys($cfg['modules'] ?? []) as $m) {
            $cfg['modules'][$m] = isset($_POST['mod_' . $m]);
        }

        if (!empty($_FILES['logo']['name']) && ($_FILES['logo']['error'] ?? 0) === UPLOAD_ERR_OK) {
            $img = upload_image($_FILES['logo'], 'brand');
            if ($img) $cfg['branding']['logo'] = $img;
        }

        if (!save_settings($cfg)) {
            throw new RuntimeException('Could not write settings.json (check file permissions).');
        }
        flash('success', 'Brand & website saved. Refresh to see theme colours.');
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
    }
    redirect('admin/website.php');
}

$sections = [];
foreach ($pdo->query('SELECT * FROM site_content')->fetchAll() as $row) {
    $sections[$row['section_key']] = $row;
}
$cfg = settings();
$mods = $cfg['modules'] ?? [];

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="toolbar">
  <a class="btn btn-outline btn-sm" href="<?= e(url(module_enabled('ecommerce') ? 'shop/' : 'public/')) ?>" target="_blank">Preview site</a>
  <a class="btn btn-outline btn-sm" href="<?= e(url('install/')) ?>">Full client setup wizard</a>
  <div class="spacer"></div>
  <span class="badge badge-muted">Client: <?= e($cfg['client_id'] ?? '—') ?></span>
</div>

<form method="post" enctype="multipart/form-data" class="panel">
  <div class="panel-head"><h2>Brand (white-label)</h2></div>
  <div class="panel-body form-grid">
    <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
    <div class="field"><label>App name</label><input name="app_name" value="<?= e($cfg['app_name']) ?>"></div>
    <div class="field"><label>Business name</label><input name="business_name" value="<?= e($cfg['business_name']) ?>"></div>
    <div class="field full"><label>Tagline</label><input name="tagline" value="<?= e($cfg['tagline'] ?? '') ?>"></div>
    <div class="field"><label>Currency symbol</label><input name="currency_symbol" value="<?= e($cfg['currency_symbol'] ?? '₹') ?>"></div>
    <div class="field"><label>Logo</label><input type="file" name="logo" accept="image/*">
      <?php if (!empty($cfg['branding']['logo'])): ?><small style="color:var(--muted)">Current: <?= e($cfg['branding']['logo']) ?></small><?php endif; ?>
    </div>
    <div class="field"><label>Primary</label><input type="color" name="theme_primary" value="<?= e($cfg['theme']['primary']) ?>"></div>
    <div class="field"><label>Accent</label><input type="color" name="theme_accent" value="<?= e($cfg['theme']['accent']) ?>"></div>
    <div class="field"><label>Surface</label><input type="color" name="theme_surface" value="<?= e($cfg['theme']['surface']) ?>"></div>
    <div class="field"><label>Email</label><input name="email" value="<?= e($cfg['contact']['email'] ?? '') ?>"></div>
    <div class="field"><label>Phone</label><input name="phone" value="<?= e($cfg['contact']['phone'] ?? '') ?>"></div>
    <div class="field full"><label>Address</label><input name="address" value="<?= e($cfg['contact']['address'] ?? '') ?>"></div>
    <div class="field"><label>WhatsApp</label><input name="whatsapp" value="<?= e($cfg['contact']['whatsapp'] ?? '') ?>"></div>
    <div class="field"><label>Instagram</label><input name="instagram" value="<?= e($cfg['contact']['instagram'] ?? '') ?>"></div>

    <div class="field full"><label>Modules on/off</label>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:.45rem">
        <?php foreach ($mods as $k => $on): ?>
          <label style="display:flex;gap:.4rem;align-items:center;padding:.5rem .65rem;background:rgba(11,18,32,.03);border-radius:10px;font-size:.82rem;font-weight:600">
            <input type="checkbox" name="mod_<?= e($k) ?>" <?= $on ? 'checked' : '' ?>> <?= e(ucfirst($k)) ?>
          </label>
        <?php endforeach; ?>
      </div>
    </div>

    <div class="field"><label>Hero title</label><input name="hero_title" value="<?= e($sections['hero']['title'] ?? '') ?>"></div>
    <div class="field full"><label>Hero text</label><textarea name="hero_body"><?= e($sections['hero']['body'] ?? '') ?></textarea></div>
    <div class="field"><label>About title</label><input name="about_title" value="<?= e($sections['about']['title'] ?? '') ?>"></div>
    <div class="field full"><label>About text</label><textarea name="about_body"><?= e($sections['about']['body'] ?? '') ?></textarea></div>
    <div class="field"><label>Footer title</label><input name="footer_title" value="<?= e($sections['footer']['title'] ?? '') ?>"></div>
    <div class="field full"><label>Footer text</label><textarea name="footer_body"><?= e($sections['footer']['body'] ?? '') ?></textarea></div>

    <div class="form-actions full">
      <button class="btn btn-primary" type="submit">Save brand & content</button>
    </div>
  </div>
</form>

<div class="panel" style="margin-top:1.25rem">
  <div class="panel-head"><h2>Hand off to another boutique</h2></div>
  <div class="panel-body" style="font-size:.9rem;color:var(--muted)">
    <ol style="margin-left:1.1rem;display:grid;gap:.45rem">
      <li>Copy this whole folder to the new server / subdomain.</li>
      <li>Open <code>/install/</code> → load a preset or fill brand + DB name.</li>
      <li>Import <code>database/schema.sql</code> into that client’s database.</li>
      <li>Change admin password after first login.</li>
    </ol>
    <p style="margin-top:1rem">Presets live in <code>clients/</code>. Full checklist: <code>CLIENT-HANDOFF.md</code></p>
  </div>
</div>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
