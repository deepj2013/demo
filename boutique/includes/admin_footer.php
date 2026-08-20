<?php declare(strict_types=1); ?>
      </main>
      <footer class="app-footer">
        <span><?= e(settings()['app_name'] ?? 'Savoka') ?> · Ecommerce + Inventory · INR</span>
      </footer>
    </div>
  </div>
  <nav class="mobile-tabbar" aria-label="Mobile navigation">
    <a href="<?= e(url('admin/index.php')) ?>" class="<?= ($activeNav ?? '') === 'dashboard' ? 'active' : '' ?>">Home</a>
    <?php if (module_enabled('inventory')): ?>
      <a href="<?= e(url('admin/inventory.php')) ?>" class="<?= ($activeNav ?? '') === 'inventory' ? 'active' : '' ?>">Stock</a>
    <?php endif; ?>
    <?php if (module_enabled('items')): ?>
      <a href="<?= e(url('admin/items.php')) ?>" class="<?= ($activeNav ?? '') === 'items' ? 'active' : '' ?>">Items</a>
    <?php endif; ?>
    <?php if (module_enabled('crm')): ?>
      <a href="<?= e(url('admin/customers.php')) ?>" class="<?= ($activeNav ?? '') === 'crm' ? 'active' : '' ?>">CRM</a>
    <?php endif; ?>
    <?php if (module_enabled('reports')): ?>
      <a href="<?= e(url('admin/reports.php')) ?>" class="<?= ($activeNav ?? '') === 'reports' ? 'active' : '' ?>">Reports</a>
    <?php endif; ?>
  </nav>
  <script src="<?= e(asset('js/app.js')) ?>" defer></script>
</body>
</html>
