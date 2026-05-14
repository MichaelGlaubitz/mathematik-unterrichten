/**
 * Koordinatensystem: Schnitt zweier Geraden y = m₁x + n₁ und y = m₂x + n₂
 * (deutet die Lösung der zugehörigen linearen Gleichung an).
 */

export type GeradeMN = { m: number; n: number };

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
  const arrowId = `${clipId}-ax`;

  let grid = '';
  const xi0 = Math.ceil(xmin);
  const xi1 = Math.floor(xmax);
  for (let xi = xi0; xi <= xi1; xi++) {
    grid += `<line x1='${sx(xi)}' y1='${margin}' x2='${sx(xi)}' y2='${H - margin}' stroke='currentColor' stroke-width='0.65' stroke-opacity='0.22' vector-effect='non-scaling-stroke'/>`;
  }
  const yi0 = Math.ceil(ymin);
  const yi1 = Math.floor(ymax);
  for (let yi = yi0; yi <= yi1; yi++) {
    grid += `<line x1='${margin}' y1='${sy(yi)}' x2='${W - margin}' y2='${sy(yi)}' stroke='currentColor' stroke-width='0.65' stroke-opacity='0.22' vector-effect='non-scaling-stroke'/>`;
  }

  const axisW = 2.65;
  let yAxisLine = '';
  if (xmin <= 0 && xmax >= 0) {
    yAxisLine = `<line x1='${sx(0)}' y1='${H - margin}' x2='${sx(0)}' y2='${margin}' stroke='currentColor' stroke-width='${axisW}' stroke-opacity='0.92' marker-end='url(#${arrowId})' vector-effect='non-scaling-stroke'/>`;
  }
  let xAxisLine = '';
  if (ymin <= 0 && ymax >= 0) {
    xAxisLine = `<line x1='${margin}' y1='${sy(0)}' x2='${W - margin}' y2='${sy(0)}' stroke='currentColor' stroke-width='${axisW}' stroke-opacity='0.92' marker-end='url(#${arrowId})' vector-effect='non-scaling-stroke'/>`;
  }

  const xAxisY = sy(0);
  const tickYOffset = ymin <= 0 && ymax >= 0 && xAxisY < H - margin - 26 ? 14 : -11;
  let ticks = '';
  for (let xi = xi0; xi <= xi1; xi++) {
    if (Math.abs(xi) > 12) continue;
    if (!(ymin <= 0 && ymax >= 0)) {
      ticks += `<text x='${sx(xi)}' y='${H - margin + 16}' font-size='9' fill='currentColor' opacity='0.55' text-anchor='middle' font-family='system-ui,sans-serif'>${xi}</text>`;
    } else {
      ticks += `<text x='${sx(xi)}' y='${xAxisY + tickYOffset}' font-size='9' fill='currentColor' opacity='0.55' text-anchor='middle' dominant-baseline='middle' font-family='system-ui,sans-serif'>${xi}</text>`;
    }
  }

  const xNameY =
    ymin <= 0 && ymax >= 0 ? (xAxisY < H * 0.52 ? xAxisY + 28 : xAxisY - 12) : H - margin - 6;
  const xNameX = W - margin - 8;
  const axisNameX =
    ymin <= 0 && ymax >= 0
      ? `<text x='${xNameX}' y='${xNameY}' font-size='12' fill='currentColor' opacity='0.72' font-style='italic' text-anchor='end' font-family='system-ui,sans-serif'>x</text>`
      : '';
  const axisNameY =
    xmin <= 0 && xmax >= 0
      ? `<text x='${sx(0) + 10}' y='${margin + 18}' font-size='12' fill='currentColor' opacity='0.72' font-style='italic' text-anchor='start' font-family='system-ui,sans-serif'>y</text>`
      : '';

  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'>
  <defs>
    <clipPath id='${clipId}'><rect x='${margin}' y='${margin}' width='${pw}' height='${ph}' rx='2'/></clipPath>
    <marker id='${arrowId}' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='7' markerHeight='7' orient='auto'>
      <path d='M 0 0 L 10 5 L 0 10 z' fill='currentColor' fill-opacity='0.92'/>
    </marker>
  </defs>
  <rect x='${margin}' y='${margin}' width='${pw}' height='${ph}' fill='currentColor' fill-opacity='0.04' stroke='currentColor' stroke-width='1' opacity='0.22' rx='2'/>
  <g clip-path='url(#${clipId})'>${grid}</g>
  ${yAxisLine}
  ${xAxisLine}
  <g clip-path='url(#${clipId})'>
    <path d='${linePath(g1)}' fill='none' stroke='currentColor' stroke-width='2.25' stroke-opacity='0.88'/>
    <path d='${linePath(g2)}' fill='none' stroke='currentColor' stroke-width='2.25' stroke-opacity='0.42' stroke-dasharray='7 5'/>
    <circle cx='${sx(xS)}' cy='${sy(yS1)}' r='5' fill='currentColor' fill-opacity='0.5' stroke='currentColor' stroke-width='1.2'/>
  </g>
  ${ticks}
  ${axisNameX}
  ${axisNameY}
  <text x='${W / 2}' y='${H - 2}' font-size='10' fill='currentColor' text-anchor='middle' opacity='0.62' font-family='system-ui,sans-serif'>Koordinatensystem · Schnittpunkt (x = ${xS})</text>
</svg>`;
}
