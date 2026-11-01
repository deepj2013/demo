<?php
require_once dirname(__DIR__) . '/shared/auth.php';
nv_admin_logout();
header('Location: ' . NV_URL . '/admin/login.php');
exit;
