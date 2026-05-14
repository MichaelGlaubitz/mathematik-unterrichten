const AXIS = 'var(--mu-geo-text, #0f172a)';
const GRID = 'var(--mu-geo-grid, rgba(37, 99, 235, 0.22))';
const TEXT_SOFT = 'var(--mu-geo-text-soft, #475569)';

/** Einheitlicher Zahlenrahmen für Achsen-Ticks und (in den Generatoren) Achsenschnitte der Funktionsgraphen. */
export const FUN_GRAPH_AXIS_RANGE_MAX = 8;

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function renderFunctionGraphArrowMarker(id: string): string {
  return `<marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${AXIS}" />
    </marker>`;
}

export function renderFunctionGraphXAxis(x1: number, x2: number, y: number, markerId: string): string {
  return `<line class="mu-function-axis" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${AXIS}" stroke-width="2.4" marker-end="url(#${markerId})" vector-effect="non-scaling-stroke" />`;
}

export function renderFunctionGraphYAxis(x: number, yBottom: number, yTop: number, markerId: string): string {
  return `<line class="mu-function-axis" x1="${x}" y1="${yBottom}" x2="${x}" y2="${yTop}" stroke="${AXIS}" stroke-width="2.4" marker-end="url(#${markerId})" vector-effect="non-scaling-stroke" />`;
}

export function renderFunctionGraphGridLine(x1: number, y1: number, x2: number, y2: number): string {
  return `<line class="mu-function-grid-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${GRID}" stroke-width="0.75" vector-effect="non-scaling-stroke" />`;
}

export function renderFunctionGraphAxisLabel(label: 'x' | 'y', x: number, y: number): string {
  return `<text class="mu-function-axis-label" x="${x}" y="${y}" font-size="14" fill="${AXIS}" text-anchor="middle" font-style="italic" font-family="system-ui,sans-serif">${label}</text>`;
}

export function renderFunctionGraphTickLabel(
  value: number,
  x: number,
  y: number,
  textAnchor: 'start' | 'middle' | 'end' = 'middle'
): string {
  return `<text class="mu-function-tick-label" x="${x}" y="${y}" font-size="9.5" fill="${TEXT_SOFT}" text-anchor="${textAnchor}" font-family="system-ui,sans-serif">${value}</text>`;
}
