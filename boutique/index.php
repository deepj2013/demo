<?php
require_once __DIR__ . '/config/bootstrap.php';
$cfg = settings();
if (is_logged_in()) {
    redirect('admin/index.php');
}
if (module_enabled('ecommerce') || module_enabled('website')) {
    redirect(module_enabled('ecommerce') ? 'shop/' : 'public/');
}
redirect('admin/login.php');
