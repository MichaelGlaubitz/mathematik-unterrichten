/**
 * SVG-Skizzen für Pythagoras-/Trig-Aufgaben.
 *
 * Stil-Richtlinien:
 *   - Farben über CSS-Variablen (--mu-geo-stroke, --mu-geo-accent, …), die in
 *     `MassenuebungGeo.astro` definiert werden – funktioniert in hell und dunkel.
 *   - Hauptkonturen 2.6–3 px, Hilfslinien 1.2 px, Beschriftungen 17 px.
 *   - Punkte werden mit Kontrast-Ring gezeichnet (Hintergrund-Kreis + Akzent-Kern).
 */

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const STROKE_MAIN = 'var(--mu-geo-stroke)';
const STROKE_ACCENT = 'var(--mu-geo-accent)';
const FILL_TRIANGLE = 'var(--mu-geo-fill-soft)';
const FILL_ANGLE = 'var(--mu-geo-accent-soft)';
const TEXT_MAIN = 'var(--mu-geo-text)';
const TEXT_SOFT = 'var(--mu-geo-text-soft)';
const HELPER = 'var(--mu-geo-helper)';
const BG = 'var(--mu-geo-bg)';

/** Rechtwinkliges Dreieck: rechter Winkel unten links, horizontale Kathete `legH`, vertikale `legV`, Hypotenuse `hyp`. */
export function svgRightTriangleKatheten(
  legH: number,
  legV: number,
  hyp: number,
  labels: { horizontal: string; vertical: string; hypotenuse: string },
  opts?: { markAngleAlphaAtHorizontalTip?: boolean }
): string {
  const W = 320;
  const H = 240;
  const pad = 40;
  const scale = Math.min((W - 2 * pad) / legH, (H - 2 * pad) / legV) * 0.86;
  const lenH = legH * scale;
  const lenV = legV * scale;
  const Ox = pad;
  const Oy = H - pad;
  const Px = pad + lenH;
  const Py = H - pad;
  const Qx = pad;
  const Qy = H - pad - lenV;

  const mxH = (Ox + Px) / 2;
  const myH = Oy + 22;
  const mxV = Ox - 14;
  const myV = (Oy + Qy) / 2 + 6;
  const mxC = (Px + Qx) / 2 + 14;
  const myC = (Py + Qy) / 2 - 6;

  const sq = 14;
  const rightMark = `<path d="M ${Ox} ${Oy - sq} L ${Ox + sq} ${Oy - sq} L ${Ox + sq} ${Oy}" fill="none" stroke="${STROKE_ACCENT}" stroke-width="2" vector-effect="non-scaling-stroke" />`;

  let angleMark = '';
  if (opts?.markAngleAlphaAtHorizontalTip) {
    const r = Math.min(28, lenH * 0.45, lenV * 0.55);
    // Bogen vom Strahl Richtung O bis Strahl Richtung Q, jeweils auf Kreis um P.
    const angToO = Math.atan2(Oy - Py, Ox - Px);
    const angToQ = Math.atan2(Qy - Py, Qx - Px);
    let delta = angToQ - angToO;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    const sweep = delta > 0 ? 1 : 0;
    const absDelta = Math.abs(delta);
    const x0 = Px + r * Math.cos(angToO);
    const y0 = Py + r * Math.sin(angToO);
    const x1 = Px + r * Math.cos(angToQ);
    const y1 = Py + r * Math.sin(angToQ);
    const aMid = angToO + delta / 2;
    angleMark = `<path d="M ${Px} ${Py} L ${x0} ${y0} A ${r} ${r} 0 0 ${sweep} ${x1} ${y1} Z" fill="${FILL_ANGLE}" stroke="${STROKE_ACCENT}" stroke-width="1.8" vector-effect="non-scaling-stroke" />
      <text x="${Px + (r + 8) * Math.cos(aMid)}" y="${Py + (r + 8) * Math.sin(aMid) + 4}" font-size="17" fill="${STROKE_ACCENT}" text-anchor="middle" dominant-baseline="middle" font-style="italic">α</text>`;
    // Verwende absDelta nur als Wert, damit Linter happy ist.
    void absDelta;
  }

  return `<figure class="mu-geo-diagram" role="img" aria-label="Skizze rechtwinkliges Dreieck">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <polygon points="${Ox},${Oy} ${Px},${Py} ${Qx},${Qy}" fill="${FILL_TRIANGLE}" stroke="${STROKE_MAIN}" stroke-width="2.8" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
  ${rightMark}
  ${angleMark}
  <text x="${mxH}" y="${myH}" font-size="17" fill="${TEXT_MAIN}" text-anchor="middle">${escXml(labels.horizontal)}</text>
  <text x="${mxV}" y="${myV}" font-size="17" fill="${TEXT_MAIN}" text-anchor="end">${escXml(labels.vertical)}</text>
  <text x="${mxC}" y="${myC}" font-size="17" fill="${TEXT_MAIN}" text-anchor="start">${escXml(labels.hypotenuse)}</text>
</svg></figure>`;
}

/** Allgemeines Dreieck (SSS): Seite $a$ unten, Seiten $c$ und $b$ zu Ecke $C$ oben. */
export function svgTriangleSSS(
  sideA: number,
  sideB: number,
  sideC: number,
  labels: { base: string; left: string; right: string }
): string {
  const W = 320;
  const H = 240;
  const pad = 36;
  const ax = sideA;
  const bx = (sideC * sideC - sideB * sideB + ax * ax) / (2 * ax);
  const inner = sideC * sideC - bx * bx;
  if (inner < 0) return '';
  const by = Math.sqrt(inner);
  const scale = Math.min((W - 2 * pad) / ax, (H - 2 * pad) / by) * 0.86;
  const A = { x: pad, y: H - pad };
  const B = { x: pad + ax * scale, y: H - pad };
  const C = { x: pad + bx * scale, y: H - pad - by * scale };

  const mid = (p: { x: number; y: number }, q: { x: number; y: number }, ox = 0, oy = 0) => ({
    x: (p.x + q.x) / 2 + ox,
    y: (p.y + q.y) / 2 + oy,
  });

  const labAB = mid(A, B, 0, 22);
  const labAC = mid(A, C, -20, 4);
  const labBC = mid(B, C, 20, -2);

  return `<figure class="mu-geo-diagram" role="img" aria-label="Skizze Dreieck mit drei gegebenen Seiten">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <polygon points="${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}" fill="${FILL_TRIANGLE}" stroke="${STROKE_MAIN}" stroke-width="2.8" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
  <text x="${labAB.x}" y="${labAB.y}" font-size="17" fill="${TEXT_MAIN}" text-anchor="middle">${escXml(labels.base)}</text>
  <text x="${labAC.x}" y="${labAC.y}" font-size="17" fill="${TEXT_MAIN}" text-anchor="end">${escXml(labels.left)}</text>
  <text x="${labBC.x}" y="${labBC.y}" font-size="17" fill="${TEXT_MAIN}" text-anchor="start">${escXml(labels.right)}</text>
</svg></figure>`;
}

/** Drei Seitenlängen (z. B. permutiert) — rechtwinklig mit Hypotenuse = Maximum. */
export function svgRightTriangleFromThreeLengths(u: number, v: number, w: number): string {
  const [s0, s1, hyp] = [u, v, w].sort((a, b) => a - b);
  return svgRightTriangleKatheten(s0, s1, hyp, {
    horizontal: String(s0),
    vertical: String(s1),
    hypotenuse: '?',
  });
}

/** Koordinatensystem mit Strecke AB (Achsen skaliert, Abstand maßstabsgetreu relativ). */
export function svgSegmentAbstand(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const W = 320;
  const H = 260;
  const pad = 40;
  const minX = Math.min(x1, x2, 0) - 0.5;
  let maxX = Math.max(x1, x2, 0) + 0.5;
  const minY = Math.min(y1, y2, 0) - 0.5;
  let maxY = Math.max(y1, y2, 0) + 0.5;
  if (maxX < 2) maxX = 2.0;
  if (maxY < 2) maxY = 2.0;
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const sx = (W - 2 * pad) / spanX;
  const sy = (H - 2 * pad) / spanY;
  const s = Math.min(sx, sy);
  const ox = pad - minX * s + ((W - 2 * pad) - spanX * s) / 2;
  const oy = pad + maxY * s + ((H - 2 * pad) - spanY * s) / 2;

  const X = (x: number) => ox + x * s;
  const Y = (y: number) => oy - y * s;

  const Ax = X(x1);
  const Ay = Y(y1);
  const Bx = X(x2);
  const By = Y(y2);
  const Ox = X(0);
  const Oy = Y(0);

  // Hilfsdreieck (Kathetenparallel zu Achsen)
  const helperPath = `<path d="M ${Ax} ${Ay} L ${Bx} ${Ay} L ${Bx} ${By}" fill="none" stroke="${HELPER}" stroke-width="1.4" stroke-dasharray="4 4" vector-effect="non-scaling-stroke" />`;

  // Achsenpfeile
  const axLeft = X(minX);
  const axRight = X(maxX);
  const ayTop = Y(maxY);
  const ayBot = Y(minY);

  return `<figure class="mu-geo-diagram" role="img" aria-label="Koordinatensystem mit Punkten A und B">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <defs>
    <marker id="muArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 2.5 L 10 5 L 0 7.5 z" fill="${HELPER}" />
    </marker>
  </defs>
  <line x1="${axLeft}" y1="${Oy}" x2="${axRight}" y2="${Oy}" stroke="${HELPER}" stroke-width="1.4" marker-end="url(#muArrow)" vector-effect="non-scaling-stroke" />
  <line x1="${Ox}" y1="${ayBot}" x2="${Ox}" y2="${ayTop}" stroke="${HELPER}" stroke-width="1.4" marker-end="url(#muArrow)" vector-effect="non-scaling-stroke" />
  ${helperPath}
  <line x1="${Ax}" y1="${Ay}" x2="${Bx}" y2="${By}" stroke="${STROKE_MAIN}" stroke-width="3" vector-effect="non-scaling-stroke" />
  <circle cx="${Ax}" cy="${Ay}" r="6" fill="${BG}" stroke="${STROKE_ACCENT}" stroke-width="2" />
  <circle cx="${Ax}" cy="${Ay}" r="3" fill="${STROKE_ACCENT}" />
  <circle cx="${Bx}" cy="${By}" r="6" fill="${BG}" stroke="${STROKE_ACCENT}" stroke-width="2" />
  <circle cx="${Bx}" cy="${By}" r="3" fill="${STROKE_ACCENT}" />
  <text x="${Ax + 10}" y="${Ay - 10}" font-size="15" fill="${TEXT_MAIN}">A(${escXml(String(x1))}|${escXml(String(y1))})</text>
  <text x="${Bx + 10}" y="${By + 18}" font-size="15" fill="${TEXT_MAIN}">B(${escXml(String(x2))}|${escXml(String(y2))})</text>
</svg></figure>`;
}

/** Rechteck mit Diagonale (Bildschirm / Garten von oben). */
export function svgRectangleDiagonal(
  width: number,
  height: number,
  opts?: { diagonalLabel?: string }
): string {
  const W = 320;
  const H = 220;
  const pad = 40;
  const scale = Math.min((W - 2 * pad) / width, (H - 2 * pad) / height) * 0.86;
  const rw = width * scale;
  const rh = height * scale;
  const x0 = pad;
  const y0 = H - pad - rh;

  const diagText =
    opts?.diagonalLabel !== undefined
      ? `<text x="${x0 + rw * 0.5 + 10}" y="${y0 + rh * 0.5 - 4}" font-size="17" fill="${STROKE_ACCENT}" text-anchor="middle" dominant-baseline="middle">${escXml(opts.diagonalLabel)}</text>`
      : '';

  return `<figure class="mu-geo-diagram" role="img" aria-label="Rechteck mit Diagonale">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <rect x="${x0}" y="${y0}" width="${rw}" height="${rh}" fill="${FILL_TRIANGLE}" stroke="${STROKE_MAIN}" stroke-width="2.8" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
  <line x1="${x0}" y1="${y0 + rh}" x2="${x0 + rw}" y2="${y0}" stroke="${STROKE_ACCENT}" stroke-width="2.6" vector-effect="non-scaling-stroke" />
  ${diagText}
  <text x="${x0 + rw / 2}" y="${y0 + rh + 22}" font-size="17" fill="${TEXT_MAIN}" text-anchor="middle">${escXml(String(width))}</text>
  <text x="${x0 - 14}" y="${y0 + rh / 2 + 6}" font-size="17" fill="${TEXT_MAIN}" text-anchor="end">${escXml(String(height))}</text>
</svg></figure>`;
}

/** Leiter an Wand: Boden horizontal, Wand vertikal, Leiter als Hypotenuse. */
export function svgLadderAtWall(
  ground: number,
  height: number,
  ladder: number,
  labels?: Partial<{ horizontal: string; vertical: string; hypotenuse: string }>
): string {
  return svgRightTriangleKatheten(ground, height, ladder, {
    horizontal: labels?.horizontal ?? String(ground),
    vertical: labels?.vertical ?? String(height),
    hypotenuse: labels?.hypotenuse ?? String(ladder),
  });
}

/** sin 30°: Hypotenuse h, Gegenkathete unbekannt (rechter Winkel unten links, α am rechten Ende der Ankathete). */
export function svgTrigSin30Hyp(h: number): string {
  const rad = Math.PI / 6;
  const adj = h * Math.cos(rad);
  const opp = h * Math.sin(rad);
  return svgRightTriangleKatheten(adj, opp, h, {
    horizontal: '?',
    vertical: '?',
    hypotenuse: String(h),
  }, { markAngleAlphaAtHorizontalTip: true });
}

/** cos 60°: Hypotenuse h, Ankathete zu 60° gesucht. */
export function svgTrigCos60Hyp(h: number): string {
  const rad = Math.PI / 3;
  const adj = h * Math.cos(rad);
  const opp = h * Math.sin(rad);
  return svgRightTriangleKatheten(adj, opp, h, {
    horizontal: '?',
    vertical: '?',
    hypotenuse: String(h),
  }, { markAngleAlphaAtHorizontalTip: true });
}

/** tan 45°: gleichschenklig, beide Katheten a. */
export function svgTrigTan45Leg(a: number): string {
  const hyp = a * Math.SQRT2;
  return svgRightTriangleKatheten(a, a, hyp, {
    horizontal: String(a),
    vertical: String(a),
    hypotenuse: '?',
  }, { markAngleAlphaAtHorizontalTip: true });
}

/** Gegenkathete g, Hypotenuse h (30°-Konfiguration wie Generator). */
export function svgTrigGkHyp30(
  g: number,
  h: number,
  opts?: { gesuchtHypotenuse?: boolean }
): string {
  const adj = Math.sqrt(Math.max(0, h * h - g * g));
  if (opts?.gesuchtHypotenuse) {
    return svgRightTriangleKatheten(adj, g, h, {
      horizontal: '',
      vertical: String(g),
      hypotenuse: '?',
    }, { markAngleAlphaAtHorizontalTip: true });
  }
  return svgRightTriangleKatheten(adj, g, h, {
    horizontal: adj % 1 < 1e-9 ? String(Math.round(adj)) : adj.toFixed(1).replace(/\.0$/, ''),
    vertical: String(g),
    hypotenuse: String(h),
  }, { markAngleAlphaAtHorizontalTip: true });
}

// Wegen Tree-Shaking: nicht verwendete Variablen referenzieren, um TS happy zu machen
void TEXT_SOFT;
