<?php
declare(strict_types=1);

function nv_loader(): void
{
    global $NV_COMPANY;
    ?>
    <div id="nv-loader" aria-hidden="true">
      <div class="nv-loader-mark">
        <img src="<?= nv_e($NV_COMPANY['logo']) ?>" alt="">
      </div>
    </div>
    <?php
}

function nv_float_actions(string $waMessage = ''): void
{
    global $NV_COMPANY;
    $wa = nv_whatsapp_link($waMessage);
    $tel = 'tel:' . $NV_COMPANY['phone_raw'];
    ?>
    <div class="nv-float" aria-label="Quick contact">
      <a class="wa" href="<?= nv_e($wa) ?>" target="_blank" rel="noopener" title="WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.05 0C5.5 0 .15 5.35.15 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.3-1.65a11.85 11.85 0 0 0 5.75 1.47h.01c6.55 0 11.9-5.35 11.9-11.9 0-3.18-1.24-6.17-3.46-8.42ZM12.05 21.7h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.74.98 1-3.64-.24-.37a9.8 9.8 0 0 1-1.5-5.22c0-5.42 4.41-9.83 9.84-9.83 2.63 0 5.1 1.02 6.95 2.88a9.77 9.77 0 0 1 2.88 6.95c0 5.43-4.42 9.84-9.82 9.84Zm5.38-7.36c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"/></svg>
      </a>
      <a class="call" href="<?= nv_e($tel) ?>" title="Call">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.5 2.9 3.7 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 3.9c0-.6.4-1 1-1H7c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .7-.2 1l-2.2 2.2Z"/></svg>
      </a>
    </div>
    <?php
}

function nv_site_footer(string $extra = ''): void
{
    global $NV_COMPANY;
    ?>
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <img src="<?= nv_e($NV_COMPANY['logo']) ?>" alt="Natraj Ventures" style="width:64px;height:64px;border-radius:50%;margin-bottom:.75rem;object-fit:cover;">
          <strong><?= nv_e($NV_COMPANY['name']) ?></strong>
          <p style="opacity:.8;margin:.4rem 0 0;"><?= nv_e($NV_COMPANY['tagline']) ?></p>
        </div>
        <div>
          <strong>Visit</strong>
          <p style="opacity:.85;margin:.4rem 0 0;"><?= nv_e($NV_COMPANY['address']) ?></p>
        </div>
        <div>
          <strong>Contact</strong>
          <p style="margin:.4rem 0 0;">
            <a href="tel:<?= nv_e($NV_COMPANY['phone_raw']) ?>"><?= nv_e($NV_COMPANY['phone']) ?></a><br>
            <a href="mailto:<?= nv_e($NV_COMPANY['email']) ?>"><?= nv_e($NV_COMPANY['email']) ?></a><br>
            <a href="<?= nv_e(nv_whatsapp_link()) ?>" target="_blank" rel="noopener">WhatsApp us</a>
          </p>
        </div>
        <?= $extra ?>
      </div>
      <div class="container footer-copy">
        © <?= date('Y') ?> Natraj Ventures. All rights reserved.
      </div>
    </footer>
    <?php
}
