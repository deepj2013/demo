<?php
require_once dirname(__DIR__) . '/config/bootstrap.php';
logout_user();
redirect('admin/login.php');
