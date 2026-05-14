/**
 * Koordinatensystem: Schnitt zweier Geraden y = m₁x + n₁ und y = m₂x + n₂
 * (deutet die Lösung der zugehörigen linearen Gleichung an).
 */

export type GeradeMN = { m: number; n: number };

const STROKE_MAIN = 'var(--mu-geo-stroke)';
const STROKE_SECOND = 'var(--mu-geo-second)';
const STROKE_ACCENT = 'var(--mu-geo-accent)';
const TEXT_MAIN = 'var(--mu-geo-text)';
const TEXT_SOFT = 'var(--mu-geo-text-soft)';
const HELPER = 'var(--mu-geo-helper)';
const FILL_SOFT = 'var(--mu-geo-fill-soft)';

export function svgLineareGleichungSchnittpunkt(g1: GeradeMN, g2: GeradeMN, xS: number): string {
  const yS1 = g1.m * xS + g1.n;
  const yS2 = g2.m * xS + g2.n;
  if (Math.abs(yS1 - yS2) > 0.001) return '';

  let xmin = Math.min(-1, xS - 2.5, 0);
  let xmax = Math.max(1, xS + 2.5, 0);
  let ymin = Math.min(-1, yS1 - 2.5, 0);
  let ymax = Math.max(1, yS1 + 2.5, 0);

  const xSamples = [xmin, xmax, xS - 1, xS + 1, 0, (xmin + xmax) / 2];
  for (const x of xSamples) {
    ymin = Math.min(ymin, g1.m * x + g1.n, g2.m * x + g2.n);
    ymax = Math.max(ymax, g1.m * x + g1.n, g2.m * x + g2.n);
  }

  if (ymax - ymin < 2) {
    ymin -= 1.2;
    ymax += 1.2;
  }
  if (xmax - xmin < 2) {
    xmin -= 1.2;
    xmax += 1.2;
  }

  const W = 340;
  const H = 280;
  const margin = 36;
  const pw = W - 2 * margin;
  const ph = H - 2 * margin;

  const sx = (x: number) => margin + ((x - xmin) / (xmax - xmin)) * pw;
  const sy = (y: number) => margin + ((ymax - y) / (ymax - ymin)) * ph;

  const linePath = (g: GeradeMN) => {
    const yLo = g.m * xmin + g.n;
    const yHi = g.m * xmax + g.n;
    return `M ${sx(xmin)} ${sy(yLo)} L ${sx(xmax)} ${sy(yHi)}`;
  };

  const clipId = `lgc-${Math.abs(Math.round(1000 * xS + 13 * g1.m + 17 * g1.n + 19 * g2.m + 23 * g2.n))}`;
  const axisArrowId = `${clipId}-axis-arrow`;
  const xAxisY = sy(0);
  const yAxisX = sx(0);
  const drawXAxis = ymin <= 0 && ymax >= 0;
  const drawYAxis = xmin <= 0 && xmax >= 0;

  let grid = '';
  const xi0 = Math.ceil(xmin);
  const xi1 = Math.floor(xmax);
  for (let xi = xi0; xi <= xi1; xi++) {
    if (xi === 0) continue;
    grid += `<line x1='${sx(xi)}' y1='${margin}' x2='${sx(xi)}' y2='${H - margin}' stroke='${HELPER}' stroke-width='0.7' opacity='0.2' vector-effect='non-scaling-stroke'/>`;
  }
  const yi0 = Math.ceil(ymin);
  const yi1 = Math.floor(ymax);
  for (let yi = yi0; yi <= yi1; yi++) {
    if (yi === 0) continue;
    grid += `<line x1='${margin}' y1='${sy(yi)}' x2='${W - margin}' y2='${sy(yi)}' stroke='${HELPER}' stroke-width='0.7' opacity='0.2' vector-effect='non-scaling-stroke'/>`;
  }

  let axisTicks = '';
  let axisValues = '';
  for (let xi = xi0; xi <= xi1; xi++) {
    if (Math.abs(xi) > 12) continue;
    const x = sx(xi);
    if (drawXAxis) {
      axisTicks += `<line x1='${x}' y1='${xAxisY - 4}' x2='${x}' y2='${xAxisY + 4}' stroke='${HELPER}' stroke-width='1.1' opacity='0.85' vector-effect='non-scaling-stroke'/>`;
      if (xi !== 0) {
        axisValues += `<text x='${x}' y='${xAxisY + 15}' font-size='9.5' fill='${TEXT_SOFT}' text-anchor='middle' font-family='system-ui,sans-serif'>${xi}</text>`;
      }
    }
  }
  for (let yi = yi0; yi <= yi1; yi++) {
    if (Math.abs(yi) > 12) continue;
    const y = sy(yi);
    if (drawYAxis) {
      axisTicks += `<line x1='${yAxisX - 4}' y1='${y}' x2='${yAxisX + 4}' y2='${y}' stroke='${HELPER}' stroke-width='1.1' opacity='0.85' vector-effect='non-scaling-stroke'/>`;
      if (yi !== 0) {
        axisValues += `<text x='${yAxisX - 8}' y='${y + 3}' font-size='9.5' fill='${TEXT_SOFT}' text-anchor='end' font-family='system-ui,sans-serif'>${yi}</text>`;
      }
    }
  }

  return `<figure class="mu-geo-diagram" role="img" aria-label="Koordinatensystem mit zwei Geraden und Schnittpunkt">
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' class='mx-auto max-w-full' focusable='false'>
  <defs>
    <clipPath id='${clipId}'><rect x='${margin}' y='${margin}' width='${pw}' height='${ph}' rx='2'/></clipPath>
    <marker id='${axisArrowId}' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='7' markerHeight='7' orient='auto'>
      <path d='M 0 0 L 10 5 L 0 10 z' fill='${HELPER}' />
    </marker>
  </defs>
  <rect x='${margin}' y='${margin}' width='${pw}' height='${ph}' fill='${FILL_SOFT}' stroke='${HELPER}' stroke-width='1' opacity='0.3' rx='2' vector-effect='non-scaling-stroke'/>
  <g clip-path='url(#${clipId})'>${grid}
    <path d='${linePath(g1)}' fill='none' stroke='${STROKE_MAIN}' stroke-width='2.6' stroke-opacity='0.92' vector-effect='non-scaling-stroke'/>
    <path d='${linePath(g2)}' fill='none' stroke='${STROKE_SECOND}' stroke-width='2.6' stroke-opacity='0.85' stroke-dasharray='7 5' vector-effect='non-scaling-stroke'/>
    <circle cx='${sx(xS)}' cy='${sy(yS1)}' r='5' fill='${STROKE_ACCENT}' fill-opacity='0.52' stroke='${STROKE_ACCENT}' stroke-width='1.2' vector-effect='non-scaling-stroke'/>
  </g>
  ${drawXAxis ? `<line x1='${margin + 1}' y1='${xAxisY}' x2='${W - margin - 1}' y2='${xAxisY}' stroke='${HELPER}' stroke-width='2.4' marker-end='url(#${axisArrowId})' vector-effect='non-scaling-stroke'/>` : ''}
  ${drawYAxis ? `<line x1='${yAxisX}' y1='${H - margin - 1}' x2='${yAxisX}' y2='${margin + 1}' stroke='${HELPER}' stroke-width='2.4' marker-end='url(#${axisArrowId})' vector-effect='non-scaling-stroke'/>` : ''}
  ${axisTicks}
  ${axisValues}
  ${drawXAxis ? `<text x='${W - margin - 14}' y='${Math.max(margin + 14, xAxisY - 8)}' font-size='13' fill='${TEXT_MAIN}' font-style='italic'>x</text>` : ''}
  ${drawYAxis ? `<text x='${yAxisX + 8}' y='${margin + 13}' font-size='13' fill='${TEXT_MAIN}' font-style='italic'>y</text>` : ''}
</svg></figure>`;
}
