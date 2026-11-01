<?php
require_once __DIR__ . '/_layout.php';

$orders = nv_orders();
$leads = nv_leads();
$products = array_filter(nv_products(), fn($p) => ($p['service'] ?? '') === 'chai');
$chaiOrders = array_filter($orders, fn($o) => ($o['service'] ?? '') === 'chai');
$finLeads = array_filter($leads, fn($l) => ($l['service'] ?? '') === 'finance');
$curLeads = array_filter($leads, fn($l) => ($l['service'] ?? '') === 'curtains');
$revenue = array_sum(array_map(fn($o) => (float) ($o['total'] ?? 0), $chaiOrders));

admin_header('Dashboard', 'dashboard');
?>
<div class="stats">
  <div class="stat"><div class="label">Chai orders</div><div class="value"><?= count($chaiOrders) ?></div></div>
  <div class="stat"><div class="label">Order value (₹)</div><div class="value"><?= number_format($revenue) ?></div></div>
  <div class="stat"><div class="label">Finance leads</div><div class="value"><?= count($finLeads) ?></div></div>
  <div class="stat"><div class="label">Curtain inquiries</div><div class="value"><?= count($curLeads) ?></div></div>
</div>

<div class="panel" style="margin-bottom:1rem;">
  <h3 style="margin:0 0 .8rem;">Latest orders</h3>
  <table>
    <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>When</th></tr></thead>
    <tbody>
    <?php if (!$orders): ?>
      <tr><td colspan="6">No orders yet.</td></tr>
    <?php else: foreach (array_slice($orders, 0, 8) as $o): ?>
      <tr>
        <td><span class="badge chai"><?= nv_e($o['id']) ?></span></td>
        <td><?= nv_e($o['customer']['name'] ?? '') ?><br><small><?= nv_e($o['customer']['phone'] ?? '') ?></small></td>
        <td>₹<?= number_format((float)($o['total'] ?? 0)) ?></td>
        <td><?= nv_e($o['payment_method'] ?? '') ?></td>
        <td><span class="badge new"><?= nv_e($o['status'] ?? '') ?></span></td>
        <td><?= nv_e(date('d M Y H:i', strtotime((string)($o['created_at'] ?? 'now')))) ?></td>
      </tr>
    <?php endforeach; endif; ?>
    </tbody>
  </table>
</div>

<div class="panel">
  <h3 style="margin:0 0 .8rem;">Latest leads / inquiries</h3>
  <table>
    <thead><tr><th>ID</th><th>Service</th><th>Name</th><th>Phone</th><th>Type</th><th>When</th></tr></thead>
    <tbody>
    <?php if (!$leads): ?>
      <tr><td colspan="6">No leads yet.</td></tr>
    <?php else: foreach (array_slice($leads, 0, 10) as $l): ?>
      <tr>
        <td><?= nv_e($l['id']) ?></td>
        <td><span class="badge <?= nv_e($l['service'] ?? '') ?>"><?= nv_e($l['service'] ?? '') ?></span></td>
        <td><?= nv_e($l['name'] ?? '') ?></td>
        <td><?= nv_e($l['phone'] ?? '') ?></td>
        <td><?= nv_e($l['type'] ?? '') ?></td>
        <td><?= nv_e(date('d M Y H:i', strtotime((string)($l['created_at'] ?? 'now')))) ?></td>
      </tr>
    <?php endforeach; endif; ?>
    </tbody>
  </table>
</div>
<p style="margin-top:1rem;color:#6b7a90;font-size:.9rem;">Products in catalogue: <?= count($products) ?> · Data stored under <code>/data</code> (blocked from public web).</p>
<?php admin_footer(); ?>
