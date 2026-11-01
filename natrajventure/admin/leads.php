<?php
require_once __DIR__ . '/_layout.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['lead_id'], $_POST['status'])) {
    $leads = nv_leads();
    foreach ($leads as &$l) {
        if (($l['id'] ?? '') === $_POST['lead_id']) {
            $l['status'] = preg_replace('/[^a-z_]/', '', strtolower((string) $_POST['status']));
            break;
        }
    }
    unset($l);
    nv_write_json('leads.json', $leads);
    header('Location: ' . NV_URL . '/admin/leads.php');
    exit;
}

$filter = $_GET['service'] ?? 'all';
$leads = nv_leads();
if (in_array($filter, ['finance', 'curtains'], true)) {
    $leads = array_values(array_filter($leads, fn($l) => ($l['service'] ?? '') === $filter));
}

admin_header('Leads & Inquiries', 'leads');
?>
<div style="margin-bottom:1rem;display:flex;gap:.5rem;flex-wrap:wrap;">
  <a class="btn-ad <?= $filter === 'all' ? '' : 'btn-soft' ?>" href="?service=all">All</a>
  <a class="btn-ad <?= $filter === 'finance' ? '' : 'btn-soft' ?>" href="?service=finance">Finance</a>
  <a class="btn-ad <?= $filter === 'curtains' ? '' : 'btn-soft' ?>" href="?service=curtains">Curtains</a>
</div>
<div class="panel">
  <table>
    <thead>
      <tr><th>Lead</th><th>Contact</th><th>Details</th><th>Status</th></tr>
    </thead>
    <tbody>
    <?php if (!$leads): ?>
      <tr><td colspan="4">No leads yet.</td></tr>
    <?php else: foreach ($leads as $l): ?>
      <tr>
        <td>
          <span class="badge <?= nv_e($l['service'] ?? '') ?>"><?= nv_e($l['service'] ?? '') ?></span><br>
          <strong><?= nv_e($l['id']) ?></strong><br>
          <small><?= nv_e(date('d M Y H:i', strtotime((string)($l['created_at'] ?? 'now')))) ?></small>
        </td>
        <td>
          <?= nv_e($l['name'] ?? '') ?><br>
          <a href="tel:<?= nv_e(preg_replace('/\D+/', '', (string)($l['phone'] ?? ''))) ?>"><?= nv_e($l['phone'] ?? '') ?></a><br>
          <?= nv_e($l['email'] ?? '') ?>
        </td>
        <td>
          <strong>Type:</strong> <?= nv_e($l['type'] ?? '') ?><br>
          <?php if (!empty($l['city'])): ?><strong>City:</strong> <?= nv_e($l['city']) ?><br><?php endif; ?>
          <?php if (!empty($l['windows'])): ?><strong>Windows:</strong> <?= nv_e($l['windows']) ?><br><?php endif; ?>
          <?= nl2br(nv_e($l['message'] ?? '')) ?>
        </td>
        <td>
          <form method="post" style="display:flex;gap:.35rem;flex-wrap:wrap;">
            <input type="hidden" name="lead_id" value="<?= nv_e($l['id']) ?>">
            <select name="status">
              <?php foreach (['new','contacted','qualified','won','lost'] as $st): ?>
                <option value="<?= $st ?>" <?= ($l['status'] ?? '') === $st ? 'selected' : '' ?>><?= $st ?></option>
              <?php endforeach; ?>
            </select>
            <button class="btn-ad" type="submit">Save</button>
          </form>
          <div style="margin-top:.5rem;">
            <a href="<?= nv_e(nv_whatsapp_link('Hello ' . ($l['name'] ?? '') . ', regarding your Natraj Ventures enquiry ' . ($l['id'] ?? '') . '.')) ?>" target="_blank" rel="noopener">WhatsApp</a>
          </div>
        </td>
      </tr>
    <?php endforeach; endif; ?>
    </tbody>
  </table>
</div>
<?php admin_footer(); ?>
