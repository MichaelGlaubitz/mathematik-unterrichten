/**
 * SVG-Skizzen für quadratische Funktionen (Scheitel, Öffnung).
 * Koordinaten: mathematisch x nach rechts, y nach oben (y-Achse im Plot nach oben wachsend).
 */

const STROKE_MAIN = 'var(--mu-geo-stroke)';
const STROKE_ACCENT = 'var(--mu-geo-accent)';
const TEXT_MAIN = 'var(--mu-geo-text)';
const HELPER = 'var(--mu-geo-helper)';

/**
 * Parabel $y = a(x-p)^2 + q$ mit Scheitel $(p|q)$, optional markierten Nullstellen auf der $x$-Achse.
 */
export function svgParabolaScheitelform(opts: {
  a: number;
  p: number;
  q: number;
  roots?: [number, number];
}): string {
  const { a, p, q, roots } = opts;
  const W = 340;
  const H = 240;
  const padL = 44;
  const padR = 28;
  const padT = 28;
  const padB = 40;

  const xs: number[] = [];
  for (let i = 0; i <= 48; i++) xs.push(p - 3.2 + (6.4 * i) / 48);

  let ymin = q;
  let ymax = q;
  const ys = xs.map((x) => {
    const y = a * (x - p) * (x - p) + q;
    ymin = Math.min(ymin, y);
    ymax = Math.max(ymax, y);
    return y;
  });
  if (roots) {
    ymin = Math.min(ymin, 0);
    ymax = Math.max(ymax, 0);
  }
  ymin -= 0.8;
  ymax += 1.2;
  if (ymax - ymin < 2.5) {
    const mid = (ymax + ymin) / 2;
    ymin = mid - 1.25;
    ymax = mid + 1.25;
  }

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const xMin = xs[0]!;
  const xMax = xs[xs.length - 1]!;
  const sx = plotW / (xMax - xMin);
  const sy = plotH / (ymax - ymin);

  const X = (x: number) => padL + (x - xMin) * sx;
  const Ymath = (y: number) => padT + (ymax - y) * sy;

  const d = xs
    .map((x, i) => `${i === 0 ? 'M' : 'L'} ${X(x).toFixed(1)} ${Ymath(ys[i]!).toFixed(1)}`)
    .join(' ');

  const xAxisY = Ymath(0);
  const yAxisX = X(0);
  const drawXAxis = ymin <= 0 && ymax >= 0;
  const drawYAxis = xMin <= 0 && xMax >= 0;

  let rootDots = '';
  if (roots) {
    const [r1, r2] = roots;
    for (const r of [r1, r2]) {
      rootDots += `<circle cx="${X(r)}" cy="${xAxisY}" r="5" fill="none" stroke="${STROKE_ACCENT}" stroke-width="2.2" vector-effect="non-scaling-stroke" />`;
    }
  }

  const vx = X(p);
  const vy = Ymath(q);
  const vertexDot = `<circle cx="${vx}" cy="${vy}" r="6" fill="${STROKE_ACCENT}" stroke="${TEXT_MAIN}" stroke-width="1.5" vector-effect="non-scaling-stroke" />
    <text x="${vx + 10}" y="${vy - 8}" font-size="14" fill="${TEXT_MAIN}" font-style="italic">S</text>`;

  // Blassfarbiges, dünnes, durchgezogenes Koordinatengitter an ganzzahligen Linien.
  let grid = '';
  const xi0 = Math.ceil(xMin);
  const xi1 = Math.floor(xMax);
  for (let xi = xi0; xi <= xi1; xi++) {
    grid += `<line x1="${X(xi).toFixed(1)}" y1="${padT}" x2="${X(xi).toFixed(1)}" y2="${H - padB}" stroke="${HELPER}" stroke-width="0.6" opacity="0.22" vector-effect="non-scaling-stroke" />`;
  }
  const yi0 = Math.ceil(ymin);
  const yi1 = Math.floor(ymax);
  for (let yi = yi0; yi <= yi1; yi++) {
    grid += `<line x1="${padL}" y1="${Ymath(yi).toFixed(1)}" x2="${W - padR}" y2="${Ymath(yi).toFixed(1)}" stroke="${HELPER}" stroke-width="0.6" opacity="0.22" vector-effect="non-scaling-stroke" />`;
  }

  // Achsenposition für Beschriftungen ("achsennah"): direkt am Achsenende, dicht an der Achse.
  // Wenn 0 nicht im Plotbereich liegt, werden die Beschriftungen am unteren bzw. linken Rand der Plotfläche platziert.
  const xLabelY = drawXAxis ? xAxisY - 6 : H - padB - 6;
  const yLabelX = drawYAxis ? yAxisX + 8 : padL + 8;

  const idSuffix = Math.abs(
    Math.round(1000 * a + 113 * p + 191 * q + (roots ? roots[0] * 7 + roots[1] * 11 : 0))
  );
  const arrowXId = `mu-parab-arrow-x-${idSuffix}`;
  const arrowYId = `mu-parab-arrow-y-${idSuffix}`;

  const axes = `
  ${drawXAxis ? `<line x1="${padL}" y1="${xAxisY}" x2="${W - padR - 2}" y2="${xAxisY}" stroke="${TEXT_MAIN}" stroke-width="2.2" stroke-linecap="round" marker-end="url(#${arrowXId})" vector-effect="non-scaling-stroke" />
    <text x="${W - padR - 4}" y="${xLabelY}" font-size="14" fill="${TEXT_MAIN}" font-style="italic" text-anchor="end">x</text>` : ''}
  ${drawYAxis ? `<line x1="${yAxisX}" y1="${H - padB}" x2="${yAxisX}" y2="${padT + 2}" stroke="${TEXT_MAIN}" stroke-width="2.2" stroke-linecap="round" marker-end="url(#${arrowYId})" vector-effect="non-scaling-stroke" />
    <text x="${yLabelX}" y="${padT + 12}" font-size="14" fill="${TEXT_MAIN}" font-style="italic">y</text>` : ''}`;

  return `<figure class="mu-geo-diagram" role="img" aria-label="Skizze Parabel">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <defs>
    <marker id="${arrowXId}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${TEXT_MAIN}" />
    </marker>
    <marker id="${arrowYId}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${TEXT_MAIN}" />
    </marker>
  </defs>
  <rect x="0" y="0" width="${W}" height="${H}" fill="transparent" />
  ${grid}
  ${axes}
  <path d="${d}" fill="none" stroke="${STROKE_MAIN}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
  ${rootDots}
  ${vertexDot}
</svg></figure>`;
}

export function formatSignedInt(n: number): string {
  if (n === 0) return '';
  return n > 0 ? `+${n}` : `${n}`;
}

export function latexBinomSquare(p: number): string {
  if (p === 0) return 'x^2';
  const inner = p > 0 ? `x-${p}` : `x+${-p}`;
  return `(${inner})^2`;
}

export function latexStreckScheitel(a: number, p: number, q: number): string {
  const inner = p > 0 ? `x-${p}` : p < 0 ? `x+${-p}` : 'x';
  const basis = `(${inner})^2`;
  const coeff = a === 1 ? '' : a === -1 ? '-' : `${a}`;
  const sq = `${coeff}${basis}`;
  const tail = formatSignedInt(q);
  return tail ? `${sq}${tail}` : sq;
}

/** Linearfaktor $(x-r)$ als LaTeX-Inhalt (ohne äußere $), z. B. $(x+2)$ für $r=-2$. */
export function latexLinearFactorXMinus(r: number): string {
  if (r === 0) return 'x';
  if (r > 0) return `(x-${r})`;
  return `(x+${-r})`;
}
