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

const STROKE_MAIN = 'var(--mu-geo-stroke, #2563eb)';
const STROKE_ACCENT = 'var(--mu-geo-accent, #dc2626)';
const TEXT_MAIN = 'var(--mu-geo-text, #0f172a)';

export interface PlotFunctionGraphOptions {
  f?: (x: number) => number;
  points?: { x: number; y: number }[];
  xmin?: number;
  xmax?: number;
  ymin?: number;
  ymax?: number;
  idPrefix: string;
}

export function svgPlotFunctionGraph(opts: PlotFunctionGraphOptions): string {
  const W = 340;
  const H = 280;
  const margin = 36;
  const pw = W - 2 * margin;
  const ph = H - 2 * margin;

  const xmin = opts.xmin ?? -6;
  const xmax = opts.xmax ?? 6;
  const ymin = opts.ymin ?? -6;
  const ymax = opts.ymax ?? 6;

  const sx = (x: number) => margin + ((x - xmin) / (xmax - xmin)) * pw;
  const sy = (y: number) => margin + ((ymax - y) / (ymax - ymin)) * ph;

  // Render function path if provided
  let pathD = '';
  if (opts.f) {
    const pointsList: string[] = [];
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const x = xmin + ((xmax - xmin) * i) / steps;
      const y = opts.f(x);
      // Only add to path if y is within a reasonable range to avoid SVG rendering issues
      if (Number.isFinite(y) && y >= ymin - 10 && y <= ymax + 10) {
        pointsList.push(`${pointsList.length === 0 ? 'M' : 'L'} ${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`);
      }
    }
    pathD = pointsList.join(' ');
  }

  const clipId = `pg-${opts.idPrefix}-${Math.abs(Math.round(13 * xmin + 17 * xmax + 19 * ymin + 23 * ymax))}`;
  const markerId = `${clipId}-axis-arrow`;

  const xAxisY = sy(0);
  const yAxisX = sx(0);
  const xAxisEnd = W - margin + 12;
  const yAxisTop = margin - 12;
  const xAxisLabelX = xAxisEnd + 10;
  const xAxisLabelY = clamp(xAxisY + 4, margin + 8, H - margin - 8);
  const yAxisLabelX = clamp(yAxisX, margin + 8, W - margin - 8);
  const yAxisLabelY = yAxisTop - 8;

  // Grid lines
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
    ${renderFunctionGraphAxisLabel('x', xAxisLabelX, xAxisLabelY)}
    ${renderFunctionGraphAxisLabel('y', yAxisLabelX, yAxisLabelY)}`;

  // Ticks and tick labels
  let ticks = '';
  for (let xi = xi0; xi <= xi1; xi++) {
    if (Math.abs(xi) > FUN_GRAPH_AXIS_RANGE_MAX) continue;
    if (xi !== 0) {
      ticks += renderFunctionGraphTickLabel(xi, sx(xi), clamp(xAxisY + 15, margin + 14, H - margin - 4));
    }
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

  // Render marked points (for value tables)
  let pointsMarkup = '';
  if (opts.points) {
    for (const p of opts.points) {
      if (p.x >= xmin && p.x <= xmax && p.y >= ymin && p.y <= ymax) {
        pointsMarkup += `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="4.5" fill="${STROKE_ACCENT}" stroke="${TEXT_MAIN}" stroke-width="1.2" vector-effect="non-scaling-stroke" />`;
      }
    }
  }

  const curvePath = pathD
    ? `<path d="${pathD}" fill="none" stroke="${STROKE_MAIN}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />`
    : '';

  return `<figure class="mu-geo-diagram" role="img" aria-label="Koordinatensystem mit Funktionsgraph">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false" class="mx-auto max-w-full text-ink-800 dark:text-ink-200" aria-hidden="true">
  <defs>
    <clipPath id="${clipId}"><rect x="${margin}" y="${margin}" width="${pw}" height="${ph}" rx="2"/></clipPath>
    ${renderFunctionGraphArrowMarker(markerId)}
  </defs>
  <rect x="${margin}" y="${margin}" width="${pw}" height="${ph}" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-width="1" opacity="0.18" rx="2"/>
  <g clip-path="url(#${clipId})">
    ${grid}
    ${curvePath}
    ${pointsMarkup}
  </g>
  ${axes}
  ${ticks}
</svg></figure>`;
}
