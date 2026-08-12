/** SVG chart renderers: South Indian, North Indian, Western wheel */
window.JMCharts = {
  south(houses, lagna, lang) {
    const by = {};
    (houses || []).forEach((h) => { by[h.house] = h; });
    const order = [12, 1, 2, 3, 11, 4, 10, 5, 9, 8, 7, 6];
    const areas = {
      12: [0, 0], 1: [0, 1], 2: [0, 2], 3: [0, 3],
      11: [1, 0], 4: [1, 3], 10: [2, 0], 5: [2, 3],
      9: [3, 0], 8: [3, 1], 7: [3, 2], 6: [3, 3],
    };
    const size = 320;
    const cell = size / 4;
    let cells = '';
    order.forEach((num) => {
      const [r, c] = areas[num];
      const h = by[num] || { rashi: '—', rashi_hi: '—', planets: [] };
      const x = c * cell;
      const y = r * cell;
      const label = lang === 'hi' ? h.rashi_hi : h.rashi;
      const planets = (h.planets || []).join(', ');
      cells += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" class="c-cell"/>`;
      cells += `<text x="${x + 6}" y="${y + 14}" class="c-hn">H${num}</text>`;
      cells += `<text x="${x + 6}" y="${y + 30}" class="c-hr">${escapeSvg(label)}</text>`;
      cells += `<text x="${x + 6}" y="${y + 46}" class="c-hp">${escapeSvg(planets || '—')}</text>`;
    });
    const lagnaLabel = lang === 'hi' ? (lagna.rashi_hi || '') : (lagna.rashi || '');
    return `<svg viewBox="0 0 ${size} ${size}" class="chart-svg south-chart" role="img">
      <rect width="${size}" height="${size}" class="c-frame"/>
      ${cells}
      <rect x="${cell}" y="${cell}" width="${cell * 2}" height="${cell * 2}" class="c-center"/>
      <text x="${size / 2}" y="${size / 2 - 8}" text-anchor="middle" class="c-center-t">Lagna</text>
      <text x="${size / 2}" y="${size / 2 + 14}" text-anchor="middle" class="c-center-t">${escapeSvg(lagnaLabel)}</text>
    </svg>`;
  },

  north(houses, lagna, lang) {
    const by = {};
    (houses || []).forEach((h) => { by[h.house] = h; });
    // Diamond North Indian: center diamond = house 1, clockwise
    const size = 320;
    const m = size / 2;
    const pts = (n) => {
      // approximate diamond house centers
      const map = {
        1: [m, m], 2: [m * 1.35, m * 0.65], 3: [m * 1.55, m], 4: [m * 1.35, m * 1.35],
        5: [m, m * 1.55], 6: [m * 0.65, m * 1.35], 7: [m * 0.45, m], 8: [m * 0.65, m * 0.65],
        9: [m, m * 0.4], 10: [m * 1.15, m * 0.5], 11: [m * 1.5, m * 0.85], 12: [m * 0.85, m * 0.5],
      };
      return map[n] || [m, m];
    };
    let labels = '';
    for (let n = 1; n <= 12; n++) {
      const [x, y] = pts(n);
      const h = by[n] || { rashi: '—', rashi_hi: '—', planets: [] };
      const label = lang === 'hi' ? h.rashi_hi : h.rashi;
      labels += `<text x="${x}" y="${y}" text-anchor="middle" class="c-hr">${n}. ${escapeSvg(label)}</text>`;
      labels += `<text x="${x}" y="${y + 12}" text-anchor="middle" class="c-hp">${escapeSvg((h.planets || []).join(',') || '')}</text>`;
    }
    return `<svg viewBox="0 0 ${size} ${size}" class="chart-svg north-chart" role="img">
      <rect width="${size}" height="${size}" class="c-frame"/>
      <polygon points="${m},8 ${size - 8},${m} ${m},${size - 8} 8,${m}" class="c-cell" fill="none"/>
      <line x1="8" y1="${m}" x2="${size - 8}" y2="${m}" class="c-cell"/>
      <line x1="${m}" y1="8" x2="${m}" y2="${size - 8}" class="c-cell"/>
      <line x1="8" y1="8" x2="${size - 8}" y2="${size - 8}" class="c-cell"/>
      <line x1="${size - 8}" y1="8" x2="8" y2="${size - 8}" class="c-cell"/>
      ${labels}
    </svg>`;
  },

  western(planets, lagna, lang) {
    const size = 320;
    const cx = size / 2;
    const cy = size / 2;
    const r = 140;
    let ticks = '';
    for (let i = 0; i < 12; i++) {
      const a1 = ((i * 30) - 90) * Math.PI / 180;
      const a2 = (((i + 1) * 30) - 90) * Math.PI / 180;
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      ticks += `<line x1="${cx}" y1="${cy}" x2="${x1}" y2="${y1}" class="c-cell"/>`;
      const am = ((i * 30 + 15) - 90) * Math.PI / 180;
      const lx = cx + (r - 28) * Math.cos(am);
      const ly = cy + (r - 28) * Math.sin(am);
      const names = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
      ticks += `<text x="${lx}" y="${ly}" text-anchor="middle" class="c-hn">${names[i]}</text>`;
    }
    let dots = '';
    (planets || []).forEach((p) => {
      const lon = Number(p.longitude) || 0;
      const a = (lon - 90) * Math.PI / 180;
      const x = cx + (r - 50) * Math.cos(a);
      const y = cy + (r - 50) * Math.sin(a);
      dots += `<circle cx="${x}" cy="${y}" r="3.5" class="c-planet"/>`;
      dots += `<text x="${x}" y="${y - 8}" text-anchor="middle" class="c-hp">${escapeSvg((p.name || '').slice(0, 2))}</text>`;
    });
    const asc = Number(lagna.longitude) || 0;
    const aa = (asc - 90) * Math.PI / 180;
    const ax = cx + r * Math.cos(aa);
    const ay = cy + r * Math.sin(aa);
    return `<svg viewBox="0 0 ${size} ${size}" class="chart-svg western-chart" role="img">
      <circle cx="${cx}" cy="${cy}" r="${r}" class="c-frame" fill="none"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 40}" class="c-cell" fill="none"/>
      ${ticks}${dots}
      <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}" class="c-asc"/>
      <text x="${cx}" y="${cy + 4}" text-anchor="middle" class="c-center-t">ASC</text>
    </svg>`;
  },
};

function escapeSvg(s) {
  return String(s || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[m]));
}
