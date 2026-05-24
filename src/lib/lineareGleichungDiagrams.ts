/**
 * Koordinatensystem: Schnitt zweier Geraden y = m₁x + n₁ und y = m₂x + n₂
 * (deutet die Lösung der zugehörigen linearen Gleichung an).
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

export type GeradeMN = { m: number; n: number };

export function svgLineareGleichungSchnittpunkt(g1: GeradeMN, g2: GeradeMN, xS: number): string {
  const yS1 = g1.m * xS + g1.n;
  const yS2 = g2.m * xS + g2.n;
  if (Math.abs(yS1 - yS2) > 0.001) return '';

  let xmin = Math.min(-1, xS - 2.5, 0);
  let xmax = Math.max(2, xS + 2.5, 0);
  let ymin = Math.min(-1, yS1 - 2.5, 0);
  let ymax = Math.max(2, yS1 + 2.5, 0);

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
  const markerId = `${clipId}-axis-arrow`;

  const xAxisY = sy(0);
  const yAxisX = sx(0);
  const xAxisEnd = W - margin - 8;
  const yAxisTop = margin + 8;
  const xAxisLabelY = clamp(xAxisY - 8, margin + 14, H - margin - 8);
  const yAxisLabelX = clamp(yAxisX + 12, margin + 14, W - margin - 14);
  const yAxisLabelY = margin + 18;

  let grid = '';
  const xi0 = Math.ceil(xmin);
  const xi1 = Math.floor(xmax);
  for (let xi = xi0; xi <= xi1; xi++) {
    grid += renderFunctionGraphGridLine(sx(xi), margin, sx(xi), H - margin);
  }
  const yi0 = Math.ceil(ymin);
  const yi1 = Math.floor(ymax);
  for (let yi = yi0; yi <= yi1; yi++) {
    grid += renderFunctionGraphGridLine(margin, sy(yi), W - margin, sy(yi));
  }

  const axes = `${renderFunctionGraphXAxis(margin, xAxisEnd, xAxisY, markerId)}
    ${renderFunctionGraphYAxis(yAxisX, H - margin, yAxisTop, markerId)}
    ${renderFunctionGraphAxisLabel('x', xAxisEnd - 13, xAxisLabelY)}
    ${renderFunctionGraphAxisLabel('y', yAxisLabelX, yAxisLabelY)}`;

  let ticks = '';
  for (let xi = xi0; xi <= xi1; xi++) {
    if (Math.abs(xi) > FUN_GRAPH_AXIS_RANGE_MAX) continue;
    if (xi !== 0) ticks += renderFunctionGraphTickLabel(xi, sx(xi), clamp(xAxisY + 15, margin + 14, H - margin - 4));
  }
  for (let yi = yi0; yi <= yi1; yi++) {
    if (Math.abs(yi) > FUN_GRAPH_AXIS_RANGE_MAX || yi === 0) continue;
    const labelLeftOfAxis = yAxisX > W - margin - 28;
    ticks += renderFunctionGraphTickLabel(
      yi,
      labelLeftOfAxis ? yAxisX - 7 : yAxisX + 7,
      sy(yi) + 3,
      labelLeftOfAxis ? 'end' : 'start'
    );
  }

  return `<figure class="mu-geo-diagram" role="img" aria-label="Koordinatensystem mit zwei Geraden">
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'>
  <defs>
    <clipPath id='${clipId}'><rect x='${margin}' y='${margin}' width='${pw}' height='${ph}' rx='2'/></clipPath>
    ${renderFunctionGraphArrowMarker(markerId)}
  </defs>
  <rect x='${margin}' y='${margin}' width='${pw}' height='${ph}' fill='currentColor' fill-opacity='0.03' stroke='currentColor' stroke-width='1' opacity='0.18' rx='2'/>
  <g clip-path='url(#${clipId})'>${grid}
    <path d='${linePath(g1)}' fill='none' stroke='currentColor' stroke-width='2.25' stroke-opacity='0.88'/>
    <path d='${linePath(g2)}' fill='none' stroke='currentColor' stroke-width='2.25' stroke-opacity='0.42' stroke-dasharray='7 5'/>
    <circle cx='${sx(xS)}' cy='${sy(yS1)}' r='5' fill='currentColor' fill-opacity='0.5' stroke='currentColor' stroke-width='1.2'/>
  </g>
  ${axes}
  ${ticks}
</svg></figure>`;
}
