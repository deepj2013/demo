/* Pitch Slider */
const PitchDeck = {
  current: 0,
  total: 0,

  init() {
    this.stage = document.getElementById('pitchStage');
    this.slides = [...document.querySelectorAll('.pitch-slide')];
    this.total = this.slides.length;
    this.dotsEl = document.getElementById('pitchDots');
    this.counterEl = document.getElementById('pitchCounter');
    this.progressEl = document.getElementById('pitchProgressBar');
    this.btnPrev = document.getElementById('pitchPrev');
    this.btnNext = document.getElementById('pitchNext');

    this.renderDots();
    this.bindEvents();
    this.go(0, false);
  },

  bindEvents() {
    this.btnPrev?.addEventListener('click', () => this.prev());
    this.btnNext?.addEventListener('click', () => this.next());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); this.next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
      if (e.key === 'Home') { e.preventDefault(); this.go(0); }
      if (e.key === 'End') { e.preventDefault(); this.go(this.total - 1); }
      if (e.key === 'f' || e.key === 'F') this.toggleFullscreen();
    });

    let touchX = 0;
    this.stage?.parentElement?.addEventListener('touchstart', (e) => {
      touchX = e.changedTouches[0].screenX;
    }, { passive: true });
    this.stage?.parentElement?.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchX;
      if (Math.abs(dx) > 50) dx < 0 ? this.next() : this.prev();
    }, { passive: true });

    document.getElementById('pitchFullscreen')?.addEventListener('click', () => this.toggleFullscreen());
  },

  renderDots() {
    if (!this.dotsEl) return;
    this.dotsEl.innerHTML = this.slides.map((_, i) =>
      `<button class="pitch-dot${i === 0 ? ' active' : ''}" type="button" aria-label="Slide ${i + 1}" data-i="${i}"></button>`
    ).join('');
    this.dotsEl.querySelectorAll('.pitch-dot').forEach(d => {
      d.onclick = () => this.go(+d.dataset.i);
    });
  },

  go(index, animate = true) {
    this.current = Math.max(0, Math.min(index, this.total - 1));
    if (this.stage) {
      this.stage.style.transition = animate ? '' : 'none';
      this.stage.style.transform = `translateX(-${this.current * 100}%)`;
      if (!animate) requestAnimationFrame(() => { this.stage.style.transition = ''; });
    }
    this.dotsEl?.querySelectorAll('.pitch-dot').forEach((d, i) => d.classList.toggle('active', i === this.current));
    if (this.counterEl) this.counterEl.textContent = `${this.current + 1} / ${this.total}`;
    if (this.progressEl) this.progressEl.style.width = `${((this.current + 1) / this.total) * 100}%`;
    if (this.btnPrev) this.btnPrev.disabled = this.current === 0;
    if (this.btnNext) this.btnNext.disabled = this.current === this.total - 1;
    const slide = this.slides[this.current];
    const inner = slide?.querySelector('.pitch-slide-inner');
    if (inner) {
      inner.style.animation = 'none';
      void inner.offsetWidth;
      inner.style.animation = '';
    }
  },

  next() { if (this.current < this.total - 1) this.go(this.current + 1); },
  prev() { if (this.current > 0) this.go(this.current - 1); },

  toggleFullscreen() {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => document.body.classList.add('pitch-fs')).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => document.body.classList.remove('pitch-fs')).catch(() => {});
    }
  }
};

document.addEventListener('DOMContentLoaded', () => PitchDeck.init());
