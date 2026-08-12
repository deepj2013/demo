<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('ecommerce');
$pageTitle = 'Orders';
$activeNav = 'orders';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    $action = $_POST['action'] ?? '';
    try {
        if ($action === 'status') {
            $oid = (int)$_POST['id'];
            $newStatus = $_POST['status'] ?? 'pending';
            $payStatus = $_POST['payment_status'] ?? 'unpaid';
            $pdo->prepare('UPDATE orders SET status=?, payment_status=? WHERE id=?')->execute([$newStatus, $payStatus, $oid]);

            if ($newStatus === 'confirmed' && ($_POST['deduct'] ?? '') === '1') {
                $lines = $pdo->prepare('SELECT * FROM order_items WHERE order_id=?');
                $lines->execute([$oid]);
                foreach ($lines->fetchAll() as $ln) {
                    adjust_stock((int)$ln['item_id'], null, (float)$ln['qty'], 'out', (float)$ln['unit_price'], 'order', $oid, 'Order fulfilment');
                }
            }
            log_activity((int)(current_user()['id'] ?? 0), 'order_update', 'orders', $oid, "Status=$newStatus payment=$payStatus");
            flash('success', 'Order updated.');
            redirect('admin/orders.php?id=' . $oid);
        }

        if ($action === 'create_counter') {
            $name = trim($_POST['customer_name'] ?? 'Walk-in');
            $phone = trim($_POST['phone'] ?? '');
            $itemId = (int)($_POST['item_id'] ?? 0);
            $qty = max(1, (float)($_POST['qty'] ?? 1));
            if ($itemId <= 0) throw new RuntimeException('Select an item.');

            $item = $pdo->prepare('SELECT id, name, sell_price FROM items WHERE id=? AND is_active=1');
            $item->execute([$itemId]);
            $it = $item->fetch();
            if (!$it) throw new RuntimeException('Item not found.');

            $custId = null;
            if ($phone !== '') {
                $st = $pdo->prepare('SELECT id FROM customers WHERE phone=? LIMIT 1');
                $st->execute([$phone]);
                $custId = $st->fetchColumn() ?: null;
            }
            if (!$custId) {
                $pdo->prepare('INSERT INTO customers (name,phone,tags) VALUES (?,?,?)')->execute([$name, $phone ?: null, 'walk-in']);
                $custId = (int)$pdo->lastInsertId();
            }

            $sub = $qty * (float)$it['sell_price'];
            $taxPct = (float)(settings()['ecommerce']['tax_percent'] ?? 5);
            $tax = $sub * ($taxPct / 100);
            $total = $sub + $tax;
            $on = next_number('ON', 'orders', 'order_number');

            $pdo->prepare('INSERT INTO orders (order_number,customer_id,source,status,payment_status,payment_method,subtotal,tax,shipping,total,shipping_address,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
                ->execute([$on, $custId, 'counter', $_POST['status'] ?? 'confirmed', $_POST['payment_status'] ?? 'paid', $_POST['payment_method'] ?? 'cash', $sub, $tax, 0, $total, 'Store counter', trim($_POST['notes'] ?? '')]);
            $oid = (int)$pdo->lastInsertId();
            $pdo->prepare('INSERT INTO order_items (order_id,item_id,qty,unit_price,line_total) VALUES (?,?,?,?,?)')
                ->execute([$oid, $itemId, $qty, $it['sell_price'], $sub]);
            $pdo->prepare('UPDATE customers SET total_orders=total_orders+1, total_spent=total_spent+?, last_order_at=NOW() WHERE id=?')
                ->execute([$total, $custId]);

            if (isset($_POST['deduct_now'])) {
                adjust_stock($itemId, null, $qty, 'out', (float)$it['sell_price'], 'order', $oid, 'Counter sale');
            }

            log_activity((int)(current_user()['id'] ?? 0), 'order_create', 'orders', $oid, "Counter order $on");
            flash('success', "Counter order $on created — visible in Orders list.");
            redirect('admin/orders.php?id=' . $oid);
        }
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
        redirect('admin/orders.php');
    }
}

$filter = $_GET['filter'] ?? 'all';
$where = '1=1';
if ($filter === 'pending') $where = "o.status='pending'";
elseif ($filter === 'online') $where = "o.source='online'";
elseif ($filter === 'counter') $where = "o.source='counter'";
elseif ($filter === 'unpaid') $where = "o.payment_status IN ('unpaid','partial')";

$orders = $pdo->query("
  SELECT o.*, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email,
         (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id=o.id) AS line_count
  FROM orders o
  LEFT JOIN customers c ON c.id=o.customer_id
  WHERE $where
  ORDER BY FIELD(o.status,'pending','confirmed','processing','shipped','delivered','cancelled'), o.created_at DESC
  LIMIT 200
")->fetchAll();

$pendingCount = (int)$pdo->query("SELECT COUNT(*) FROM orders WHERE status='pending'")->fetchColumn();
$todayCount = (int)$pdo->query("SELECT COUNT(*) FROM orders WHERE DATE(created_at)=CURDATE()")->fetchColumn();
$todayTotal = (float)$pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE DATE(created_at)=CURDATE()")->fetchColumn();

$viewId = (int)($_GET['id'] ?? 0);
$view = null;
$lines = [];
if ($viewId) {
    $st = $pdo->prepare("SELECT o.*, c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone, c.address AS customer_address FROM orders o LEFT JOIN customers c ON c.id=o.customer_id WHERE o.id=?");
    $st->execute([$viewId]);
    $view = $st->fetch();
    $ls = $pdo->prepare('SELECT oi.*, i.name, i.sku, i.image FROM order_items oi JOIN items i ON i.id=oi.item_id WHERE oi.order_id=?');
    $ls->execute([$viewId]);
    $lines = $ls->fetchAll();
}

$sellable = $pdo->query("SELECT id, sku, name, sell_price FROM items WHERE is_active=1 AND is_sellable=1 ORDER BY name")->fetchAll();
require_once ROOT_PATH . '/includes/item_picker.php';

require ROOT_PATH . '/includes/admin_header.php';
?>
<?php if ($pendingCount > 0): ?>
  <div class="flash flash-info" style="margin:0 0 1rem">
    <strong><?= (int)$pendingCount ?> pending order<?= $pendingCount > 1 ? 's' : '' ?></strong> waiting —
    <a href="?filter=pending" style="text-decoration:underline">view pending</a>
  </div>
<?php endif; ?>

<div class="grid grid-3" style="margin-bottom:1.25rem">
  <div class="stat-card"><div class="label">Pending</div><div class="value" style="color:#B54708"><?= (int)$pendingCount ?></div><div class="hint">Need action</div></div>
  <div class="stat-card"><div class="label">Today</div><div class="value"><?= (int)$todayCount ?></div><div class="hint">Orders placed today</div></div>
  <div class="stat-card"><div class="label">Today value</div><div class="value"><?= e(money($todayTotal)) ?></div><div class="hint">All sources</div></div>
</div>

<div class="toolbar">
  <a class="btn btn-sm <?= $filter==='all'?'btn-primary':'btn-outline' ?>" href="?filter=all">All</a>
  <a class="btn btn-sm <?= $filter==='pending'?'btn-primary':'btn-outline' ?>" href="?filter=pending">Pending<?= $pendingCount ? ' ('.$pendingCount.')' : '' ?></a>
  <a class="btn btn-sm <?= $filter==='online'?'btn-primary':'btn-outline' ?>" href="?filter=online">Online / shop</a>
  <a class="btn btn-sm <?= $filter==='counter'?'btn-primary':'btn-outline' ?>" href="?filter=counter">Counter</a>
  <a class="btn btn-sm <?= $filter==='unpaid'?'btn-primary':'btn-outline' ?>" href="?filter=unpaid">Unpaid</a>
  <div class="spacer"></div>
  <button class="btn btn-accent btn-sm" type="button" onclick="openModal('counterModal')">+ Counter sale</button>
  <a class="btn btn-outline btn-sm" href="<?= e(url('shop/')) ?>" target="_blank">Open shop</a>
</div>

<div class="grid grid-2">
  <div class="panel">
    <div class="panel-head">
      <h2>Orders<?= $filter !== 'all' ? ' · '.e($filter) : '' ?></h2>
      <span class="badge badge-muted"><?= count($orders) ?> shown</span>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Order</th><th>Customer</th><th>Source</th><th>Status</th><th>Total</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($orders as $o): ?>
          <tr style="<?= $o['status']==='pending' ? 'background:rgba(254,244,230,.65)' : '' ?><?= $viewId===(int)$o['id'] ? ';outline:2px solid rgba(196,165,116,.5)' : '' ?>">
            <td>
              <strong><?= e($o['order_number']) ?></strong>
              <div style="font-size:.72rem;color:var(--muted)"><?= e(date('d M Y H:i', strtotime($o['created_at']))) ?> · <?= (int)$o['line_count'] ?> item(s)</div>
            </td>
            <td>
              <?= e($o['customer_name'] ?: 'Guest') ?>
              <?php if ($o['customer_phone']): ?><div style="font-size:.75rem;color:var(--muted)"><?= e($o['customer_phone']) ?></div><?php endif; ?>
            </td>
            <td><span class="badge badge-muted"><?= e($o['source']) ?></span></td>
            <td>
              <span class="badge badge-<?= $o['status']==='pending'?'warn':($o['status']==='cancelled'?'danger':($o['status']==='delivered'?'ok':'info')) ?>"><?= e($o['status']) ?></span>
              <div style="margin-top:.2rem"><span class="badge badge-muted"><?= e($o['payment_status']) ?></span></div>
            </td>
            <td><?= e(money($o['total'])) ?></td>
            <td><a class="btn btn-outline btn-sm" href="?filter=<?= e(urlencode($filter)) ?>&id=<?= (int)$o['id'] ?>">Open</a></td>
          </tr>
        <?php endforeach; ?>
        <?php if (!$orders): ?>
          <tr><td colspan="6"><div class="empty"><h3>No orders here</h3><p>When a customer places an order on the shop, it appears instantly in this list (usually as <strong>pending</strong>).</p></div></td></tr>
        <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>

  <div class="panel">
    <?php if (!$view): ?>
      <div class="empty">
        <h3>Order detail</h3>
        <p>Select an order to confirm, update payment, or deduct stock.</p>
        <p style="margin-top:.75rem;font-size:.85rem">Shop checkouts land here automatically under <strong>Orders → Pending / Online</strong>.</p>
      </div>
    <?php else: ?>
      <div class="panel-head"><h2><?= e($view['order_number']) ?></h2>
        <span class="badge badge-info"><?= e($view['source']) ?></span>
      </div>
      <div class="panel-body">
        <p style="margin-bottom:1rem;font-size:.9rem;color:var(--muted)">
          <strong style="color:var(--ink)"><?= e($view['customer_name'] ?: 'Guest') ?></strong><br>
          <?= e($view['customer_phone'] ?: '') ?> <?= $view['customer_email'] ? '· '.e($view['customer_email']) : '' ?><br>
          <?= e(date('d M Y H:i', strtotime($view['created_at']))) ?><br>
          <?= e($view['shipping_address'] ?: '') ?>
        </p>
        <table class="data" style="margin-bottom:1rem">
          <thead><tr><th></th><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>
          <?php foreach ($lines as $ln): ?>
            <tr>
              <td><?php if (!empty($ln['image'])): ?><img class="thumb" src="<?= e(asset($ln['image'])) ?>" alt=""><?php else: ?><div class="thumb-ph">IMG</div><?php endif; ?></td>
              <td><?= e($ln['name']) ?><div style="font-size:.72rem;color:var(--muted)"><?= e($ln['sku']) ?></div></td>
              <td><?= e(number_format((float)$ln['qty'],2)) ?></td>
              <td><?= e(money($ln['unit_price'])) ?></td>
              <td><?= e(money($ln['line_total'])) ?></td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
        <div style="text-align:right;margin-bottom:1rem">
          <div>Subtotal <?= e(money($view['subtotal'])) ?></div>
          <div>Tax <?= e(money($view['tax'])) ?> · Ship <?= e(money($view['shipping'])) ?></div>
          <strong style="font-family:Fraunces,serif;font-size:1.25rem">Total <?= e(money($view['total'])) ?></strong>
        </div>
        <?php if ($view['notes']): ?><p style="font-size:.85rem;color:var(--muted);margin-bottom:1rem">Notes: <?= e($view['notes']) ?></p><?php endif; ?>
        <form method="post" class="form-grid">
          <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
          <input type="hidden" name="action" value="status">
          <input type="hidden" name="id" value="<?= (int)$view['id'] ?>">
          <div class="field"><label>Status</label>
            <select name="status">
              <?php foreach (['pending','confirmed','processing','shipped','delivered','cancelled'] as $s): ?>
                <option <?= $view['status']===$s?'selected':'' ?>><?= $s ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="field"><label>Payment</label>
            <select name="payment_status">
              <?php foreach (['unpaid','partial','paid','refunded'] as $s): ?>
                <option <?= $view['payment_status']===$s?'selected':'' ?>><?= $s ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="field full"><label><input type="checkbox" name="deduct" value="1"> Deduct stock when saving as confirmed</label></div>
          <div class="form-actions full"><button class="btn btn-primary" type="submit">Update order</button></div>
        </form>
      </div>
    <?php endif; ?>
  </div>
</div>

<div class="modal-backdrop" id="counterModal">
  <div class="modal">
    <div class="modal-head"><h2>Counter sale</h2><button type="button" class="icon-btn" data-close-modal="counterModal">✕</button></div>
    <div class="modal-body">
      <form method="post" class="form-grid">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="create_counter">
        <div class="field"><label>Customer name</label><input name="customer_name" value="Walk-in"></div>
        <div class="field"><label>Phone</label><input name="phone"></div>
        <div class="field full">
          <?php item_picker_field(['name'=>'item_id','required'=>true,'label'=>'Item','types'=>'finished','placeholder'=>'Search sellable garment…']); ?>
        </div>
        <div class="field"><label>Qty</label><input type="number" step="1" name="qty" value="1" required></div>
        <div class="field"><label>Payment method</label>
          <select name="payment_method"><option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option></select>
        </div>
        <div class="field"><label>Status</label>
          <select name="status"><option value="confirmed">confirmed</option><option value="pending">pending</option><option value="delivered">delivered</option></select>
        </div>
        <div class="field"><label>Payment status</label>
          <select name="payment_status"><option value="paid">paid</option><option value="unpaid">unpaid</option></select>
        </div>
        <div class="field full"><label><input type="checkbox" name="deduct_now" value="1" checked> Deduct stock now</label></div>
        <div class="field full"><label>Notes</label><textarea name="notes"></textarea></div>
        <div class="form-actions full">
          <button type="button" class="btn btn-outline" data-close-modal="counterModal">Cancel</button>
          <button class="btn btn-primary" type="submit">Create order</button>
        </div>
      </form>
    </div>
  </div>
</div>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
