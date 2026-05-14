/**
 * SVG-Veranschaulichungen für Bruchrechnung (Streifen-, Kreis-, Flächen-, Erweitern-Kachelraster).
 *
 * `modus === 'aufgabe'`: keine markante Schattierung der Anteile (kein „Auslesen“ der Lösung).
 * `modus === 'loesung'`: übliche Darstellung mit erkennbar markierten Teilflächen.
 */

export type BruchdiagrammModus = 'aufgabe' | 'loesung';

/** Zwei Streifen gleicher Länge (gleicher Nenner), für Addition/Subtraktion. */
export function svgBruchZweiStreifen(
  a: number,
  d: number,
  b: number,
  modus: BruchdiagrammModus = 'loesung'
): string {
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
      const fill = modus === 'loesung' && filled ? 'currentColor' : 'none';
      const fillOp = modus === 'loesung' && filled ? 0.32 : 0;
      s += `<rect x='${x + 0.4}' y='${y}' width='${seg - 0.8}' height='${hr - 2}' rx='0.8' fill='${fill}' fill-opacity='${fillOp}' stroke='currentColor' stroke-width='1.1'/>`;
    }
    return s;
  };
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${pad + bw + 6} 72' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'><text x='2' y='22' font-size='13' fill='currentColor' font-family='system-ui,sans-serif'>①</text>${mkrow(
    a,
    6
  )}<text x='2' y='58' font-size='13' fill='currentColor' font-family='system-ui,sans-serif'>②</text>${mkrow(b, 42)}</svg>`;
}

/**
 * Erweitern: Kachelraster d×k — d Spalten (Grundnenner), k Zeilen (Erweiterungsfaktor).
 * Insgesamt D=d·k Felder, n·k Felder markiert (erste n Spalten vollständig).
 * Modus `aufgabe`: je **Spalte** eine durchgehende Fläche (keine waagerechten Teilungen);
 * die ersten **n** Spalten dunkel (Anteil **n/d** sichtbar), der Rest hell; Rahmen und senkrechte Linien.
 * Beschriftung `zeile` nur **ohne** Ergebnis der Erweiterung (Aufrufer: z. B. nur `n/d`, nicht `n/d → N/D`).
 * Modus `loesung`: Zellen mit Schattierung und vollständigem Gitter (waagerecht/senkrecht).
 */
export function svgBruchErweiternKacheln(
  n: number,
  d: number,
  k: number,
  zeile: string,
  modus: BruchdiagrammModus = 'loesung'
): string {
  if (d < 2 || k < 2 || n < 1 || n >= d || d > 16 || k > 8) return '';
  const cols = d;
  const rows = k;
  const pad = 3;
  const labelH = 14;
  const cellW = Math.min(28, Math.floor(268 / cols));
  const cellH = Math.min(26, Math.floor(112 / rows));
  const gw = cols * cellW;
  const gh = rows * cellH;
  const vbW = gw + pad * 2;
  const vbH = gh + pad * 2 + labelH;

  const ink = 'currentColor';

  let body = '';
  if (modus === 'aufgabe') {
    let colsRects = '';
    for (let col = 0; col < cols; col++) {
      const x = pad + col * cellW;
      const fillOp = col < n ? 0.34 : 0.07;
      colsRects += `<rect x='${x}' y='${pad}' width='${cellW}' height='${gh}' fill='${ink}' fill-opacity='${fillOp}'/>`;
    }
    body += colsRects;
    let lines = '';
    for (let j = 0; j <= cols; j++) {
      const x = pad + j * cellW;
      const sw = j === 0 || j === cols ? 1.35 : 1.15;
      lines += `<line x1='${x}' y1='${pad}' x2='${x}' y2='${pad + gh}' stroke='${ink}' stroke-width='${sw}'/>`;
    }
    lines += `<line x1='${pad}' y1='${pad}' x2='${pad + gw}' y2='${pad}' stroke='${ink}' stroke-width='1.35'/>`;
    lines += `<line x1='${pad}' y1='${pad + gh}' x2='${pad + gw}' y2='${pad + gh}' stroke='${ink}' stroke-width='1.35'/>`;
    body += `<g fill='none' stroke-linecap='square'>${lines}</g>`;
  } else {
    let rects = '';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = pad + col * cellW;
        const y = pad + row * cellH;
        const shaded = col < n;
        const fillOp = shaded ? 0.34 : 0.07;
        rects += `<rect x='${x}' y='${y}' width='${cellW}' height='${cellH}' fill='${ink}' fill-opacity='${fillOp}'/>`;
      }
    }
    let grid = '';
    for (let j = 0; j <= cols; j++) {
      const x = pad + j * cellW;
      const sw = j === 0 || j === cols ? 1.35 : 1.15;
      grid += `<line x1='${x}' y1='${pad}' x2='${x}' y2='${pad + gh}' stroke='${ink}' stroke-width='${sw}'/>`;
    }
    for (let r = 0; r <= rows; r++) {
      const y = pad + r * cellH;
      const sw = r === 0 || r === rows ? 1.35 : 1;
      grid += `<line x1='${pad}' y1='${y}' x2='${pad + gw}' y2='${y}' stroke='${ink}' stroke-width='${sw}'/>`;
    }
    body = `${rects}<g fill='none' stroke-linecap='square'>${grid}</g>`;
  }

  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${vbW} ${vbH}' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'>${body}<text x='${
    vbW / 2
  }' y='${pad + gh + labelH - 1}' font-size='10' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' opacity='0.88'>${zeile}</text></svg>`;
}

/**
 * Ein Streifen n/d (v. a. für Kürzen).
 *
 * Optional `kuerzungsZahl` (gemeinsamer Faktor / ggT): Der Zählerstreifen wird in
 * Blöcke zu je `g` benachbarten Feldern gegliedert; jeder vollständige Zähler-Block
 * erhält **eine** dicke Außenlinie (n/g Umrandungen). Einzelfelder behalten dünne
 * Gitterkanten.
 */
export function svgBruchStreifen(
  n: number,
  d: number,
  zeile: string,
  modus: BruchdiagrammModus = 'loesung',
  kuerzungsZahl?: number
): string {
  if (d < 2 || d > 24) return '';
  const w = Math.min(280, 12 * d);
  const seg = w / d;
  const h = 32;
  const strokeDuenn = 1.1;
  const strokeFett = 2.75;
  const g =
    kuerzungsZahl != null && kuerzungsZahl > 0
      ? Math.min(Math.floor(kuerzungsZahl), n)
      : null;
  const blockRahmen =
    g != null && g >= 2 && n % g === 0 ? g : null;

  let rects = '';
  for (let i = 0; i < d; i++) {
    const x = i * seg;
    const filled = i < n;
    const fill = modus === 'loesung' && filled ? 'currentColor' : 'none';
    const fillOp = modus === 'loesung' && filled ? 0.32 : 0;
    rects += `<rect x='${x + 0.5}' y='4' width='${seg - 1}' height='${h - 8}' rx='0.8' fill='${fill}' fill-opacity='${fillOp}' stroke='currentColor' stroke-width='${strokeDuenn}'/>`;
  }

  let blockOutlines = '';
  if (blockRahmen != null) {
    const innerH = h - 8;
    const numBlocks = n / blockRahmen;
    for (let b = 0; b < numBlocks; b++) {
      const x = b * blockRahmen * seg + 0.5;
      const bw = blockRahmen * seg - 1;
      blockOutlines += `<rect x='${x}' y='4' width='${bw}' height='${innerH}' rx='0.8' fill='none' stroke='currentColor' stroke-width='${strokeFett}'/>`;
    }
  }

  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h + 14}' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'>${rects}${blockOutlines}<text x='${
    w / 2
  }' y='${h + 10}' font-size='10' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' opacity='0.85'>${zeile}</text></svg>`;
}

/** Kreisteilungen (Grundvorstellung Bruchteil eines Ganzen). */
export function svgBruchKreis(n: number, d: number, modus: BruchdiagrammModus = 'loesung'): string {
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
    const fillOp =
      modus === 'loesung' ? (filled ? 0.34 : 0.06) : 0.09;
    const fill = 'currentColor';
    paths += `<path d='M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z' fill='${fill}' fill-opacity='${fillOp}' stroke='currentColor' stroke-width='1.1'/>`;
  }
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' class='h-24 w-auto text-ink-800 dark:text-ink-200' aria-hidden='true'>${paths}</svg>`;
}

/** Flächenmodell: n1/d1 · n2/d2 — im Raster d1×d2 sind n1·n2 Felder markiert. */
export function svgBruchMalRaster(
  n1: number,
  d1: number,
  n2: number,
  d2: number,
  modus: BruchdiagrammModus = 'loesung'
): string {
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
      const fillOp =
        modus === 'loesung' ? (shaded ? 0.34 : 0.07) : 0.08;
      rects += `<rect x='${x + 1}' y='${y + 1}' width='${cell - 2}' height='${cell - 2}' fill='currentColor' fill-opacity='${fillOp}' stroke='currentColor' stroke-width='1'/>`;
    }
  }
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' class='mx-auto max-h-44 w-auto text-ink-800 dark:text-ink-200' aria-hidden='true'>${rects}</svg>`;
}

/**
 * Vergleich — **Aufgabe**: je Bruch mit **eigenem** Nenner (z. B. Drittel und Fünftel), gleiche Balkenlänge.
 * Nicht den Hauptnenner vorwegnehmen; dazu `svgBruchVergleichZweiRiegel` in der Lösung.
 */
export function svgBruchVergleichAusgangsstreifen(
  a: number,
  d1: number,
  b: number,
  d2: number,
  modus: BruchdiagrammModus = 'loesung'
): string {
  if (d1 < 2 || d2 < 2 || a < 1 || b < 1 || a >= d1 || b >= d2 || d1 > 16 || d2 > 16) return '';
  const pad = 14;
  const bw = 246;
  const hr = 26;
  const mkrow = (n: number, d: number, y: number, mark: string) => {
    const seg = bw / d;
    let s = '';
    for (let i = 0; i < d; i++) {
      const x = pad + i * seg;
      const filled = i < n;
      const fill = modus === 'loesung' && filled ? 'currentColor' : 'none';
      const fillOp = modus === 'loesung' && filled ? 0.32 : 0;
      s += `<rect x='${x + 0.35}' y='${y}' width='${seg - 0.7}' height='${hr - 2}' rx='0.5' fill='${fill}' fill-opacity='${fillOp}' stroke='currentColor' stroke-width='1'/>`;
    }
    return `<text x='2' y='${y + 18}' font-size='12' fill='currentColor' font-family='system-ui,sans-serif'>${mark}</text>${s}`;
  };
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${pad + bw + 8} 68' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'>${mkrow(
    a,
    d1,
    6,
    'A'
  )}${mkrow(b, d2, 38, 'B')}</svg>`;
}

/** Vergleich zweier Brüche auf gemeinsamen Nenner L gebracht (Streifen A und B). */
export function svgBruchVergleichZweiRiegel(
  nA: number,
  nB: number,
  L: number,
  modus: BruchdiagrammModus = 'loesung'
): string {
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
      const fill = modus === 'loesung' && filled ? 'currentColor' : 'none';
      const fillOp = modus === 'loesung' && filled ? 0.32 : 0;
      s += `<rect x='${x + 0.35}' y='${y}' width='${seg - 0.7}' height='${hr - 2}' rx='0.5' fill='${fill}' fill-opacity='${fillOp}' stroke='currentColor' stroke-width='1'/>`;
    }
    return `<text x='2' y='${y + 18}' font-size='12' fill='currentColor' font-family='system-ui,sans-serif'>${mark}</text>${s}`;
  };
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${pad + bw + 8} 68' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'>${oneRow(
    nA,
    6,
    'A'
  )}${oneRow(nB, 38, 'B')}</svg>`;
}
