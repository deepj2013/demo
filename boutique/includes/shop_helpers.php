<?php
/**
 * Helpers for shop hero slides stored in site_content.meta (JSON)
 */
declare(strict_types=1);

function default_hero_slides(): array {
    return [
        [
            'image' => 'uploads/hero/slide-1.jpg',
            'title' => 'New season atelier',
            'subtitle' => 'Handcrafted silhouettes. Honest costing. Made to wear.',
            'cta' => 'Shop the collection',
            'cta_link' => '#collection',
        ],
        [
            'image' => 'uploads/hero/slide-2.jpg',
            'title' => 'Fabric to finish',
            'subtitle' => 'From rack to runway — every stitch tracked.',
            'cta' => 'Explore looks',
            'cta_link' => '#collection',
        ],
        [
            'image' => 'uploads/hero/slide-3.jpg',
            'title' => 'Bespoke & ready-to-wear',
            'subtitle' => 'Pieces designed in-house for how you move.',
            'cta' => 'View collection',
            'cta_link' => '#collection',
        ],
    ];
}

function get_hero_slides(): array {
    try {
        $st = db()->prepare("SELECT meta, title, body, image FROM site_content WHERE section_key='hero_slides' LIMIT 1");
        $st->execute();
        $row = $st->fetch();
        if ($row) {
            $meta = json_decode((string) ($row['meta'] ?? '[]'), true);
            if (is_array($meta) && $meta) {
                return array_values(array_filter($meta, fn($s) => is_array($s) && !empty($s['image'])));
            }
        }
    } catch (Throwable $e) {}
    return default_hero_slides();
}

function save_hero_slides(array $slides): void {
    $json = json_encode(array_values($slides), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    db()->prepare("INSERT INTO site_content (section_key, title, body, meta) VALUES ('hero_slides','Hero slider','',?)
      ON DUPLICATE KEY UPDATE meta=VALUES(meta), updated_at=CURRENT_TIMESTAMP")
        ->execute([$json]);
}

function ensure_shop_demo_images(): void {
    // Attach demo product photos if garments have no image
    $map = [
        'GAR-DRS-001' => 'uploads/products/gar-dress.jpg',
        'GAR-SET-001' => 'uploads/products/gar-set.jpg',
        'GAR-KUR-001' => 'uploads/products/gar-kurta.jpg',
        'GAR-BLZ-001' => 'uploads/products/gar-dress.jpg',
    ];
    $upd = db()->prepare('UPDATE items SET image=? WHERE sku=? AND (image IS NULL OR image="")');
    foreach ($map as $sku => $img) {
        if (is_file(ROOT_PATH . '/assets/' . $img)) {
            $upd->execute([$img, $sku]);
        }
    }
}
