/**
 * SVG-Veranschaulichungen für Bruchrechnung (Streifen-, Kreis-, Flächenmodell).
 */

/** Zwei Streifen gleicher Länge (gleicher Nenner), für Addition/Subtraktion. */
export function svgBruchZweiStreifen(a: number, d: number, b: number): string {
   if (d < 2 || d > 16) return '';
  const pad = 20;
  const bw = 232;
  const seg = bw / d;
  const hr = 26;
  const mkrow = (n: number, y: number) => {
    let s = '';
    for (let i = 0; i < d; i++) {
      const x = pad + i * seg;
      const filled = i < n;
      s += `<rect x='${x + 0.4}' y='${y}' width='${seg - 0.8}' height='${hr - 2}' rx='0.8' fill='${
        filled ? 'currentColor' : 'none'
      }' fill-opacity='${filled ? 0.32 : 0}' stroke='currentColor' stroke-width='1.1'/>`;
    }
    return s;
  };
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${pad + bw + 6} 72' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'><text x='2' y='22' font-size='13' fill='currentColor' font-family='system-ui,sans-serif'>①</text>${mkrow(
    a,
    6
  )}<text x='2' y='58' font-size='13' fill='currentColor' font-family='system-ui,sans-serif'>②</text>${mkrow(b, 42)}</svg>`;
}

/** Ein Streifen n/d (für Kürzen, Erweitern, Vergleich). */
export function svgBruchStreifen(n: number, d: number, zeile: string): string {
  if (d < 2 || d > 24) return '';
  const w = Math.min(280, 12 * d);
  const seg = w / d;
  const h = 32;
  let rects = '';
  for (let i = 0; i < d; i++) {
    const x = i * seg;
    const filled = i < n;
    rects += `<rect x='${x + 0.5}' y='4' width='${seg - 1}' height='${h - 8}' rx='0.8' fill='${
      filled ? 'currentColor' : 'none'
    }' fill-opacity='${filled ? 0.32 : 0}' stroke='currentColor' stroke-width='1.1'/>`;
  }
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h + 14}' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'>${rects}<text x='${
    w / 2
  }' y='${h + 10}' font-size='10' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' opacity='0.85'>${zeile}</text></svg>`;
}

/** Kreisteilungen (Grundvorstellung Bruchteil eines Ganzen). */
export function svgBruchKreis(n: number, d: number): string {
  if (d < 2 || d > 14 || n < 0 || n > d) return '';
  const cx = 48;
  const cy = 48;
  const r = 42;
  let paths = '';
  for (let i = 0; i < d; i++) {
    const a0 = -Math.PI / 2 + (2 * Math.PI * i) / d;
    const a1 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / d;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI + 0.01 ? 1 : 0;
    const filled = i < n;
    paths += `<path d='M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z' fill='${
      filled ? 'currentColor' : 'none'
    }' fill-opacity='${filled ? 0.34 : 0.06}' stroke='currentColor' stroke-width='1.1'/>`;
  }
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' class='h-24 w-auto text-ink-800 dark:text-ink-200' aria-hidden='true'>${paths}</svg>`;
}

/** Flächenmodell: n1/d1 · n2/d2 — im Raster d1×d2 sind n1·n2 Felder markiert. */
export function svgBruchMalRaster(n1: number, d1: number, n2: number, d2: number): string {
  if (d1 < 2 || d2 < 2 || d1 > 8 || d2 > 8) return '';
  const cell = 20;
  const w = cell * d1;
  const h = cell * d2;
  let rects = '';
  for (let row = 0; row < d2; row++) {
    for (let col = 0; col < d1; col++) {
      const x = col * cell;
      const y = row * cell;
      const shaded = col < n1 && row < n2;
      rects += `<rect x='${x + 1}' y='${y + 1}' width='${cell - 2}' height='${cell - 2}' fill='${
        shaded ? 'currentColor' : 'none'
      }' fill-opacity='${shaded ? 0.34 : 0.07}' stroke='currentColor' stroke-width='1'/>`;
    }
  }
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' class='mx-auto max-h-44 w-auto text-ink-800 dark:text-ink-200' aria-hidden='true'>${rects}</svg>`;
}

/** Vergleich zweier Brüche auf gemeinsamen Nenner L gebracht (Streifen A und B). */
export function svgBruchVergleichZweiRiegel(nA: number, nB: number, L: number): string {
  if (L < 2 || L > 20) return '';
  const pad = 14;
  const bw = 246;
  const seg = bw / L;
  const hr = 26;
  const oneRow = (n: number, y: number, mark: string) => {
    let s = '';
    for (let i = 0; i < L; i++) {
      const x = pad + i * seg;
      const filled = i < n;
      s += `<rect x='${x + 0.35}' y='${y}' width='${seg - 0.7}' height='${hr - 2}' rx='0.5' fill='${
        filled ? 'currentColor' : 'none'
      }' fill-opacity='${filled ? 0.32 : 0}' stroke='currentColor' stroke-width='1'/>`;
    }
    return `<text x='2' y='${y + 18}' font-size='12' fill='currentColor' font-family='system-ui,sans-serif'>${mark}</text>${s}`;
  };
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${pad + bw + 8} 68' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'>${oneRow(
    nA,
    6,
    'A'
  )}${oneRow(nB, 38, 'B')}</svg>`;
}
