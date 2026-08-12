<?php
/**
 * Render a searchable item picker (name / SKU / category).
 *
 * @param array{
 *   name?: string,
 *   id?: string,
 *   required?: bool,
 *   label?: string,
 *   types?: string,
 *   placeholder?: string,
 *   selected?: array{id?:int,sku?:string,name?:string}|null,
 *   on_select?: string
 * } $opts
 */
function item_picker_field(array $opts = []): void {
    static $catsCache = null;
    if ($catsCache === null) {
        try {
            $catsCache = db()->query('SELECT id, name FROM categories WHERE is_active=1 ORDER BY name')->fetchAll();
        } catch (Throwable $e) {
            $catsCache = [];
        }
    }

    $name = $opts['name'] ?? 'item_id';
    $id = $opts['id'] ?? ('picker_' . preg_replace('/[^a-z0-9_]/', '_', $name));
    $required = !empty($opts['required']);
    $label = $opts['label'] ?? 'Item';
    $types = $opts['types'] ?? '';
    $placeholder = $opts['placeholder'] ?? 'Search by name or item code…';
    $selected = $opts['selected'] ?? null;
    $onSelect = $opts['on_select'] ?? '';
    $api = url('api/items_search.php');
    $selId = (int) ($selected['id'] ?? 0);
    $selLabel = $selId
        ? trim(($selected['sku'] ?? '') . ' — ' . ($selected['name'] ?? ''))
        : '';
    ?>
    <div class="item-picker" id="<?= e($id) ?>"
         data-api="<?= e($api) ?>"
         data-types="<?= e($types) ?>"
         data-on-select="<?= e($onSelect) ?>">
      <label class="item-picker-label"><?= e($label) ?></label>
      <div class="item-picker-filters">
        <select class="item-picker-cat" aria-label="Category">
          <option value="">All categories</option>
          <?php foreach ($catsCache as $c): ?>
            <option value="<?= (int) $c['id'] ?>"><?= e($c['name']) ?></option>
          <?php endforeach; ?>
        </select>
        <div class="item-picker-search-wrap">
          <input type="search" class="item-picker-q" placeholder="<?= e($placeholder) ?>" autocomplete="off" aria-autocomplete="list">
        </div>
      </div>
      <input type="hidden" class="item-picker-value" name="<?= e($name) ?>" value="<?= $selId ?: '' ?>" <?= $required ? 'data-required="1"' : '' ?>>
      <div class="item-picker-selected<?= $selId ? ' has-value' : '' ?>">
        <?php if ($selId): ?>
          <span class="item-picker-chip"><?= e($selLabel) ?> <button type="button" class="item-picker-clear" aria-label="Clear">✕</button></span>
        <?php else: ?>
          <span class="item-picker-hint">Type to search — works with 1000+ items</span>
        <?php endif; ?>
      </div>
      <div class="item-picker-results" hidden role="listbox"></div>
    </div>
    <?php
}
