/**
 * SVG-Skizzen für quadratische Funktionen (Scheitel, Öffnung).
 * Koordinaten: mathematisch x nach rechts, y nach oben (y-Achse im Plot nach oben wachsend).
 */

import {
  clamp,
  FUN_GRAPH_AXIS_RANGE_MAX,
  renderFunctionGraphArrowMarker,
  renderFunctionGraphAxisLabel,
  renderFunctionGraphGridLine,
  renderFunctionGraphTickLabel,
  renderFunctionGraphXAxis,
  renderFunctionGraphYAxis,
} from './functionGraphStyle';

const STROKE_MAIN = 'var(--mu-geo-stroke)';
const STROKE_ACCENT = 'var(--mu-geo-accent)';
const TEXT_MAIN = 'var(--mu-geo-text)';

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

  let xmin = p - 3.2;
  let xmax = p + 3.2;
  if (xmin > 0) xmin = -0.45;
  if (xmax < 0) xmax = 0.45;

  const xs: number[] = [];
  for (let i = 0; i <= 64; i++) xs.push(xmin + ((xmax - xmin) * i) / 64);

  let ymin = Math.min(q, 0);
  let ymax = Math.max(q, 0);
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
  if (ymin > 0) ymin = -0.45;
  if (ymax < 0) ymax = 0.45;

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const sx = plotW / (xmax - xmin);
  const sy = plotH / (ymax - ymin);

  const X = (x: number) => padL + (x - xmin) * sx;
  const Ymath = (y: number) => padT + (ymax - y) * sy;

  const d = xs
    .map((x, i) => `${i === 0 ? 'M' : 'L'} ${X(x).toFixed(1)} ${Ymath(ys[i]!).toFixed(1)}`)
    .join(' ');

  const xAxisY = Ymath(0);
  const yAxisX = X(0);
  const markerId = `qf-${Math.abs(
    Math.round(1000 * a + 101 * p + 17 * q + 13 * (roots?.[0] ?? 0) + 19 * (roots?.[1] ?? 0))
  )}-axis-arrow`;
  const xAxisEnd = W - padR - 8;
  const yAxisTop = padT + 8;
  const xAxisLabelY = clamp(xAxisY - 8, padT + 14, H - padB - 8);
  const yAxisLabelX = clamp(yAxisX + 12, padL + 14, W - padR - 14);
  const yAxisLabelY = padT + 18;

  let grid = '';
  const xi0 = Math.ceil(xmin);
  const xi1 = Math.floor(xmax);
  for (let xi = xi0; xi <= xi1; xi++) {
    grid += renderFunctionGraphGridLine(X(xi), padT, X(xi), H - padB);
  }
  const yi0 = Math.ceil(ymin);
  const yi1 = Math.floor(ymax);
  for (let yi = yi0; yi <= yi1; yi++) {
    grid += renderFunctionGraphGridLine(padL, Ymath(yi), W - padR, Ymath(yi));
  }

  const axes = `${renderFunctionGraphXAxis(padL, xAxisEnd, xAxisY, markerId)}
    ${renderFunctionGraphYAxis(yAxisX, H - padB, yAxisTop, markerId)}
    ${renderFunctionGraphAxisLabel('x', xAxisEnd - 13, xAxisLabelY)}
    ${renderFunctionGraphAxisLabel('y', yAxisLabelX, yAxisLabelY)}`;

  let ticks = '';
  for (let xi = xi0; xi <= xi1; xi++) {
    if (Math.abs(xi) > FUN_GRAPH_AXIS_RANGE_MAX || xi === 0) continue;
    ticks += renderFunctionGraphTickLabel(xi, X(xi), clamp(xAxisY + 15, padT + 14, H - padB - 4));
  }
  for (let yi = yi0; yi <= yi1; yi++) {
    if (Math.abs(yi) > FUN_GRAPH_AXIS_RANGE_MAX || yi === 0) continue;
    const labelLeftOfAxis = yAxisX > W - padR - 28;
    ticks += renderFunctionGraphTickLabel(
      yi,
      labelLeftOfAxis ? yAxisX - 7 : yAxisX + 7,
      Ymath(yi) + 3,
      labelLeftOfAxis ? 'end' : 'start'
    );
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
  <defs>${renderFunctionGraphArrowMarker(markerId)}</defs>
  <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-width="1" opacity="0.18" rx="2" />
  ${grid}
  <path d="${d}" fill="none" stroke="${STROKE_MAIN}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
  ${axes}
  ${ticks}
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
