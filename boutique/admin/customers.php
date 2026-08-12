<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
require_login();
require_module('crm');
$pageTitle = 'Customers (CRM)';
$activeNav = 'crm';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf'] ?? null)) {
    $action = $_POST['action'] ?? 'save';
    try {
        if ($action === 'save') {
            $id = (int)($_POST['id'] ?? 0);
            $data = [
                trim($_POST['name'] ?? ''),
                trim($_POST['email'] ?? ''),
                trim($_POST['phone'] ?? ''),
                trim($_POST['address'] ?? ''),
                trim($_POST['city'] ?? ''),
                trim($_POST['tags'] ?? ''),
                trim($_POST['notes'] ?? ''),
            ];
            if ($id > 0) {
                $pdo->prepare('UPDATE customers SET name=?,email=?,phone=?,address=?,city=?,tags=?,notes=? WHERE id=?')->execute([...$data, $id]);
                flash('success', 'Customer updated.');
            } else {
                $pdo->prepare('INSERT INTO customers (name,email,phone,address,city,tags,notes) VALUES (?,?,?,?,?,?,?)')->execute($data);
                flash('success', 'Customer added.');
            }
        } elseif ($action === 'note') {
            $pdo->prepare('INSERT INTO customer_notes (customer_id,note,created_by) VALUES (?,?,?)')
                ->execute([(int)$_POST['customer_id'], trim($_POST['note'] ?? ''), current_user()['id'] ?? null]);
            flash('success', 'Note added.');
            redirect('admin/customers.php?id='.(int)$_POST['customer_id']);
        }
    } catch (Throwable $ex) {
        flash('error', $ex->getMessage());
    }
    redirect('admin/customers.php');
}

$customers = $pdo->query('SELECT * FROM customers WHERE is_active=1 ORDER BY created_at DESC')->fetchAll();
$viewId = (int)($_GET['id'] ?? 0);
$view = null;
$notes = [];
$orders = [];
if ($viewId) {
    $st = $pdo->prepare('SELECT * FROM customers WHERE id=?');
    $st->execute([$viewId]);
    $view = $st->fetch();
    $ns = $pdo->prepare('SELECT n.*, u.name AS user_name FROM customer_notes n LEFT JOIN users u ON u.id=n.created_by WHERE customer_id=? ORDER BY created_at DESC');
    $ns->execute([$viewId]);
    $notes = $ns->fetchAll();
    if (module_enabled('ecommerce')) {
        $os = $pdo->prepare('SELECT * FROM orders WHERE customer_id=? ORDER BY created_at DESC LIMIT 20');
        $os->execute([$viewId]);
        $orders = $os->fetchAll();
    }
}

require ROOT_PATH . '/includes/admin_header.php';
?>
<div class="toolbar">
  <input type="search" id="tableSearch" placeholder="Search customers…" style="border:1px solid var(--line);border-radius:999px;padding:.55rem 1rem;min-width:200px;background:#fff">
  <div class="spacer"></div>
  <button class="btn btn-primary" type="button" onclick="openModal('custModal');document.getElementById('custForm').reset();document.getElementById('custId').value=''">+ Add customer</button>
</div>

<div class="grid grid-2">
  <div class="panel">
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Name</th><th>Contact</th><th>Tags</th><th>Spent</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($customers as $c): ?>
          <tr>
            <td><strong><?= e($c['name']) ?></strong><div style="font-size:.75rem;color:var(--muted)"><?= e($c['city'] ?: '') ?></div></td>
            <td><?= e($c['phone'] ?: '—') ?><div style="font-size:.75rem;color:var(--muted)"><?= e($c['email'] ?: '') ?></div></td>
            <td><?php foreach (array_filter(array_map('trim', explode(',', (string)$c['tags']))) as $t): ?><span class="badge badge-muted" style="margin:.1rem"><?= e($t) ?></span><?php endforeach; ?></td>
            <td><?= e(money($c['total_spent'])) ?></td>
            <td><a class="btn btn-outline btn-sm" href="?id=<?= (int)$c['id'] ?>">Open</a></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>

  <div class="panel">
    <?php if (!$view): ?>
      <div class="empty"><h3>Customer 360°</h3><p>Select a customer for notes, tags & order history.</p></div>
    <?php else: ?>
      <div class="panel-head">
        <div>
          <h2><?= e($view['name']) ?></h2>
          <div style="font-size:.8rem;color:var(--muted)"><?= e($view['email']) ?> · <?= e($view['phone']) ?> · <?= e($view['city']) ?></div>
        </div>
        <button class="btn btn-outline btn-sm" type="button" onclick='editCust(<?= json_encode($view, JSON_HEX_TAG|JSON_HEX_APOS) ?>)'>Edit</button>
      </div>
      <div class="panel-body">
        <div class="grid grid-2" style="margin-bottom:1rem">
          <div class="stat-card" style="padding:.8rem"><div class="label">Orders</div><div class="value" style="font-size:1.3rem"><?= (int)$view['total_orders'] ?></div></div>
          <div class="stat-card" style="padding:.8rem"><div class="label">Lifetime value</div><div class="value" style="font-size:1.3rem"><?= e(money($view['total_spent'])) ?></div></div>
        </div>
        <?php if ($view['notes']): ?><p style="margin-bottom:1rem;color:var(--muted);font-size:.9rem"><?= e($view['notes']) ?></p><?php endif; ?>

        <h3 style="font-size:1rem;margin-bottom:.5rem">Activity notes</h3>
        <?php foreach ($notes as $n): ?>
          <div style="padding:.75rem;border:1px solid var(--line);border-radius:12px;margin-bottom:.5rem">
            <div style="font-size:.85rem"><?= e($n['note']) ?></div>
            <div style="font-size:.72rem;color:var(--muted);margin-top:.35rem"><?= e($n['user_name'] ?: 'Staff') ?> · <?= e(date('d M Y H:i', strtotime($n['created_at']))) ?></div>
          </div>
        <?php endforeach; ?>
        <form method="post" style="margin-top:.75rem">
          <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
          <input type="hidden" name="action" value="note">
          <input type="hidden" name="customer_id" value="<?= (int)$view['id'] ?>">
          <div class="field"><textarea name="note" required placeholder="Call follow-up, preference, measurement…"></textarea></div>
          <button class="btn btn-primary btn-sm" type="submit" style="margin-top:.5rem">Add note</button>
        </form>

        <?php if ($orders): ?>
          <h3 style="font-size:1rem;margin:1.25rem 0 .5rem">Orders</h3>
          <table class="data">
            <thead><tr><th>Order</th><th>Status</th><th>Total</th></tr></thead>
            <tbody>
            <?php foreach ($orders as $o): ?>
              <tr><td><?= e($o['order_number']) ?></td><td><?= e($o['status']) ?></td><td><?= e(money($o['total'])) ?></td></tr>
            <?php endforeach; ?>
            </tbody>
          </table>
        <?php endif; ?>
      </div>
    <?php endif; ?>
  </div>
</div>

<div class="modal-backdrop" id="custModal">
  <div class="modal">
    <div class="modal-head"><h2>Customer</h2><button type="button" class="icon-btn" data-close-modal="custModal">✕</button></div>
    <div class="modal-body">
      <form method="post" id="custForm" class="form-grid">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" id="custId">
        <div class="field"><label>Name</label><input name="name" id="c_name" required></div>
        <div class="field"><label>Phone</label><input name="phone" id="c_phone"></div>
        <div class="field"><label>Email</label><input type="email" name="email" id="c_email"></div>
        <div class="field"><label>City</label><input name="city" id="c_city"></div>
        <div class="field full"><label>Tags (comma)</label><input name="tags" id="c_tags" placeholder="vip, bridal, online"></div>
        <div class="field full"><label>Address</label><textarea name="address" id="c_address"></textarea></div>
        <div class="field full"><label>Notes</label><textarea name="notes" id="c_notes"></textarea></div>
        <div class="form-actions full">
          <button type="button" class="btn btn-outline" data-close-modal="custModal">Cancel</button>
          <button class="btn btn-primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</div>
<script>
function editCust(c){
  document.getElementById('custId').value=c.id;
  document.getElementById('c_name').value=c.name||'';
  document.getElementById('c_phone').value=c.phone||'';
  document.getElementById('c_email').value=c.email||'';
  document.getElementById('c_city').value=c.city||'';
  document.getElementById('c_tags').value=c.tags||'';
  document.getElementById('c_address').value=c.address||'';
  document.getElementById('c_notes').value=c.notes||'';
  openModal('custModal');
}
</script>
<?php require ROOT_PATH . '/includes/admin_footer.php'; ?>
