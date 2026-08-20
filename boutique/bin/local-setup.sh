#!/usr/bin/env bash
# Local Savoka Host bootstrap + server
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${PORT:-8080}"

echo "==> Savoka local setup (port $PORT)"
php -r 'exit(extension_loaded("pdo_mysql")?0:1);' || { echo "Need php pdo_mysql"; exit 1; }

echo "==> Platform registry"
mysql -u root < database/platform.sql
php -r '
define("ROOT_PATH", getcwd());
require ROOT_PATH . "/config/platform.php";
$pdo = platform_db();
$hash = password_hash("platform123", PASSWORD_DEFAULT);
$pdo->prepare("UPDATE platform_admins SET password=? WHERE email=?")->execute([$hash, "platform@savoka.local"]);
echo "Platform admin ready\n";
'

echo "==> Default boutique DB"
mysql -u root -e "CREATE DATABASE IF NOT EXISTS boutique_os CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
HAS=$(mysql -u root -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=\"boutique_os\" AND table_name=\"users\"")
if [ "$HAS" = "0" ]; then
  mysql -u root < database/schema.sql
fi
mysql -u root boutique_os < database/seed_demo.sql >/dev/null 2>&1 || true
php -r '
$pdo=new PDO("mysql:host=127.0.0.1;dbname=boutique_os","root","");
$hash=password_hash("admin123", PASSWORD_DEFAULT);
$pdo->prepare("UPDATE users SET password=? WHERE email=\"admin@boutique.local\" OR id=1")->execute([$hash]);
echo "Default admin ready\n";
'

echo "==> Register default tenant"
php -r '
define("ROOT_PATH", getcwd());
require ROOT_PATH . "/config/platform.php";
ensure_default_tenant_from_settings();
foreach (platform_db()->query("SELECT slug, business_name, db_name FROM tenants") as $t) {
  echo " - {$t["slug"]} · {$t["business_name"]} · {$t["db_name"]}\n";
}
'

php -r '
$f="platform.json";
$j=json_decode(file_get_contents($f),true);
$j["local_port"]=(int)(getenv("PORT")?:8080);
file_put_contents($f, json_encode($j, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES)."\n");
'

pkill -f "php -S 0.0.0.0:${PORT}" 2>/dev/null || true
echo ""
echo "Open these URLs:"
echo "  http://localhost:${PORT}/                         Host home + client list"
echo "  http://localhost:${PORT}/enroll/                  Enroll new boutique"
echo "  http://localhost:${PORT}/platform/               Platform console"
echo "  http://atelier.localhost:${PORT}/admin/login.php Default boutique admin"
echo "  http://atelier.localhost:${PORT}/shop/           Default shop"
echo ""
echo "Platform login: platform@savoka.local / platform123"
echo "Atelier login:  admin@boutique.local / admin123"
echo ""
exec php -S "0.0.0.0:${PORT}" router.php
