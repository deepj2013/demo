<?php
require_once __DIR__ . '/_layout.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['order_id'], $_POST['status'])) {
    $orders = nv_orders();
    foreach ($orders as &$o) {
        if (($o['id'] ?? '') === $_POST['order_id']) {
            $o['status'] = preg_replace('/[^a-z_]/', '', strtolower((string) $_POST['status']));
            break;
        }
    }
    unset($o);
    nv_write_json('orders.json', $orders);
    header('Location: ' . NV_URL . '/admin/orders.php');
    exit;
}

$orders = nv_orders();
admin_header('Orders (Chai)', 'orders');
?>
<div class="panel">
  <table>
    <thead>
      <tr>
        <th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th>
      </tr>
    </thead>
    <tbody>
    <?php if (!$orders): ?>
      <tr><td colspan="6">No orders yet. Place a test order from the Chai shop.</td></tr>
    <?php else: foreach ($orders as $o): ?>
      <tr>
        <td>
          <strong><?= nv_e($o['id']) ?></strong><br>
          <small><?= nv_e(date('d M Y H:i', strtotime((string)($o['created_at'] ?? 'now')))) ?></small>
        </td>
        <td>
          <?= nv_e($o['customer']['name'] ?? '') ?><br>
          <?= nv_e($o['customer']['phone'] ?? '') ?><br>
          <?= nv_e($o['customer']['email'] ?? '') ?><br>
          <small><?= nl2br(nv_e($o['customer']['address'] ?? '')) ?></small>
          <?php if (!empty($o['customer']['notes'])): ?>
            <br><em><?= nv_e($o['customer']['notes']) ?></em>
          <?php endif; ?>
        </td>
        <td>
          <?php foreach (($o['items'] ?? []) as $it): ?>
            <?= (int)($it['qty'] ?? 0) ?> × <?= nv_e($it['name'] ?? '') ?><br>
          <?php endforeach; ?>
        </td>
        <td>₹<?= number_format((float)($o['total'] ?? 0)) ?></td>
        <td><?= nv_e($o['payment_method'] ?? '') ?><br><small><?= nv_e($o['payment_status'] ?? '') ?></small></td>
        <td>
          <form method="post" style="display:flex;gap:.35rem;align-items:center;">
            <input type="hidden" name="order_id" value="<?= nv_e($o['id']) ?>">
            <select name="status">
              <?php foreach (['new','confirmed','packed','dispatched','delivered','cancelled'] as $st): ?>
                <option value="<?= $st ?>" <?= ($o['status'] ?? '') === $st ? 'selected' : '' ?>><?= $st ?></option>
              <?php endforeach; ?>
            </select>
            <button class="btn-ad" type="submit">Save</button>
          </form>
        </td>
      </tr>
    <?php endforeach; endif; ?>
    </tbody>
  </table>
</div>
<p style="margin-top:.8rem;color:#6b7a90;font-size:.88rem;">Also mirrored to <code>data/orders.csv</code> for spreadsheet export.</p>
<?php admin_footer(); ?>
