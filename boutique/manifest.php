<?php
/**
 * Dynamic PWA manifest — branded per client from settings.json
 */
require_once __DIR__ . '/config/bootstrap.php';
$cfg = settings();
header('Content-Type: application/manifest+json; charset=utf-8');
header('Cache-Control: public, max-age=3600');
echo json_encode([
    'name' => $cfg['business_name'] ?? ($cfg['app_name'] ?? 'BoutiqueOS'),
    'short_name' => $cfg['app_name'] ?? 'BoutiqueOS',
    'description' => $cfg['tagline'] ?? 'Boutique inventory & shop',
    'start_url' => './admin/',
    'scope' => './',
    'display' => 'standalone',
    'background_color' => $cfg['theme']['surface'] ?? '#F7F4EF',
    'theme_color' => $cfg['theme']['primary'] ?? '#0B1220',
    'orientation' => 'any',
    'icons' => [
        [
            'src' => $cfg['branding']['favicon'] ?? 'assets/icons/icon-192.png',
            'sizes' => '192x192',
            'type' => 'image/png',
            'purpose' => 'any maskable',
        ],
        [
            'src' => 'assets/icons/icon-512.png',
            'sizes' => '512x512',
            'type' => 'image/png',
            'purpose' => 'any maskable',
        ],
    ],
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
