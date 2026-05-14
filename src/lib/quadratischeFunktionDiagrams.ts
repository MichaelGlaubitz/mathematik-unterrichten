/**
 * SVG-Skizzen für quadratische Funktionen (Scheitel, Öffnung).
 * Koordinaten: mathematisch x nach rechts, y nach oben (y-Achse im Plot nach oben wachsend).
 */

const STROKE_MAIN = 'var(--mu-geo-stroke)';
const STROKE_ACCENT = 'var(--mu-geo-accent)';
const STROKE_SECOND = 'var(--mu-geo-second)';
const TEXT_MAIN = 'var(--mu-geo-text)';
const TEXT_SOFT = 'var(--mu-geo-text-soft)';
const HELPER = 'var(--mu-geo-helper)';
const FILL_SOFT = 'var(--mu-geo-fill-soft)';

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
  const sx = plotW / (xs[xs.length - 1]! - xs[0]!);
  const sy = plotH / (ymax - ymin);

  const X = (x: number) => padL + (x - xs[0]!) * sx;
  const Ymath = (y: number) => padT + (ymax - y) * sy;

  const d = xs
    .map((x, i) => `${i === 0 ? 'M' : 'L'} ${X(x).toFixed(1)} ${Ymath(ys[i]!).toFixed(1)}`)
    .join(' ');

  const xAxisY = Ymath(0);
  const yAxisX = X(0);
  const drawXAxis = ymin <= 0 && ymax >= 0;
  const drawYAxis = xs[0]! <= 0 && xs[xs.length - 1]! >= 0;
  const xi0 = Math.ceil(xs[0]!);
  const xi1 = Math.floor(xs[xs.length - 1]!);
  const yi0 = Math.ceil(ymin);
  const yi1 = Math.floor(ymax);
  const markerId = `qf-axis-${Math.abs(Math.round(1000 * a + 37 * p + 53 * q))}`;

  let grid = '';
  for (let xi = xi0; xi <= xi1; xi++) {
    if (xi === 0) continue;
    grid += `<line x1="${X(xi)}" y1="${padT}" x2="${X(xi)}" y2="${H - padB}" stroke="${HELPER}" stroke-width="0.7" opacity="0.2" vector-effect="non-scaling-stroke" />`;
  }
  for (let yi = yi0; yi <= yi1; yi++) {
    if (yi === 0) continue;
    grid += `<line x1="${padL}" y1="${Ymath(yi)}" x2="${W - padR}" y2="${Ymath(yi)}" stroke="${HELPER}" stroke-width="0.7" opacity="0.2" vector-effect="non-scaling-stroke" />`;
  }

  let axisTicks = '';
  let axisValues = '';
  for (let xi = xi0; xi <= xi1; xi++) {
    if (Math.abs(xi) > 12 || !drawXAxis) continue;
    const xx = X(xi);
    axisTicks += `<line x1="${xx}" y1="${xAxisY - 4}" x2="${xx}" y2="${xAxisY + 4}" stroke="${HELPER}" stroke-width="1.1" opacity="0.85" vector-effect="non-scaling-stroke" />`;
    if (xi !== 0) {
      axisValues += `<text x="${xx}" y="${xAxisY + 15}" font-size="10" fill="${TEXT_SOFT}" text-anchor="middle">${xi}</text>`;
    }
  }
  for (let yi = yi0; yi <= yi1; yi++) {
    if (Math.abs(yi) > 12 || !drawYAxis) continue;
    const yy = Ymath(yi);
    axisTicks += `<line x1="${yAxisX - 4}" y1="${yy}" x2="${yAxisX + 4}" y2="${yy}" stroke="${HELPER}" stroke-width="1.1" opacity="0.85" vector-effect="non-scaling-stroke" />`;
    if (yi !== 0) {
      axisValues += `<text x="${yAxisX - 8}" y="${yy + 3}" font-size="10" fill="${TEXT_SOFT}" text-anchor="end">${yi}</text>`;
    }
  }

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

  return `<figure class="mu-geo-diagram" role="img" aria-label="Skizze Parabel">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <defs>
    <marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${HELPER}" />
    </marker>
  </defs>
  <rect x="0" y="0" width="${W}" height="${H}" fill="transparent" />
  ${grid}
  ${drawXAxis ? `<line x1="${padL + 1}" y1="${xAxisY}" x2="${W - padR - 1}" y2="${xAxisY}" stroke="${HELPER}" stroke-width="2.4" marker-end="url(#${markerId})" vector-effect="non-scaling-stroke" />` : ''}
  ${drawYAxis ? `<line x1="${yAxisX}" y1="${H - padB - 1}" x2="${yAxisX}" y2="${padT + 1}" stroke="${HELPER}" stroke-width="2.4" marker-end="url(#${markerId})" vector-effect="non-scaling-stroke" />` : ''}
  ${axisTicks}
  ${axisValues}
  ${drawXAxis ? `<text x="${W - padR - 14}" y="${Math.max(padT + 14, xAxisY - 8)}" font-size="13" fill="${TEXT_MAIN}" font-style="italic">x</text>` : ''}
  ${drawYAxis ? `<text x="${yAxisX + 8}" y="${padT + 13}" font-size="13" fill="${TEXT_MAIN}" font-style="italic">y</text>` : ''}
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
