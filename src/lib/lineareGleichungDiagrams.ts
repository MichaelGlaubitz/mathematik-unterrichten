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

  const idSuffix = Math.abs(
    Math.round(1000 * xS + 13 * g1.m + 17 * g1.n + 19 * g2.m + 23 * g2.n)
  );
  const clipId = `lgc-${idSuffix}`;
  const arrowXId = `lgc-arrow-x-${idSuffix}`;
  const arrowYId = `lgc-arrow-y-${idSuffix}`;

  // Sichtbares, aber blasses Koordinatengitter (dünn, durchgezogen).
  let grid = '';
  const xi0 = Math.ceil(xmin);
  const xi1 = Math.floor(xmax);
  for (let xi = xi0; xi <= xi1; xi++) {
    grid += `<line x1='${sx(xi)}' y1='${margin}' x2='${sx(xi)}' y2='${H - margin}' stroke='currentColor' stroke-width='0.6' opacity='0.18'/>`;
  }
  const yi0 = Math.ceil(ymin);
  const yi1 = Math.floor(ymax);
  for (let yi = yi0; yi <= yi1; yi++) {
    grid += `<line x1='${margin}' y1='${sy(yi)}' x2='${W - margin}' y2='${sy(yi)}' stroke='currentColor' stroke-width='0.6' opacity='0.18'/>`;
  }

  // Achsenpositionen
  const drawXAxis = ymin <= 0 && ymax >= 0;
  const drawYAxis = xmin <= 0 && xmax >= 0;
  const xAxisY = drawXAxis ? sy(0) : H - margin;
  const yAxisX = drawYAxis ? sx(0) : margin;

  // Fette Achsen mit Pfeilen in positiver Richtung.
  let axes = '';
  axes += `<line x1='${margin}' y1='${xAxisY}' x2='${W - margin - 2}' y2='${xAxisY}' stroke='currentColor' stroke-width='2.1' stroke-linecap='round' marker-end='url(#${arrowXId})'/>`;
  axes += `<line x1='${yAxisX}' y1='${H - margin}' x2='${yAxisX}' y2='${margin + 2}' stroke='currentColor' stroke-width='2.1' stroke-linecap='round' marker-end='url(#${arrowYId})'/>`;

  // Achsennahe Beschriftung: direkt an der Pfeilspitze, dicht an der Achse.
  const xLabel = `<text x='${W - margin - 4}' y='${xAxisY - 6}' font-size='12' fill='currentColor' text-anchor='end' font-style='italic' font-family='system-ui,sans-serif'>x</text>`;
  const yLabel = `<text x='${yAxisX + 6}' y='${margin + 10}' font-size='12' fill='currentColor' font-style='italic' font-family='system-ui,sans-serif'>y</text>`;

  // Tick-Labels (Zahlen) achsennah platzieren — unterhalb der x-Achse bzw. links neben der y-Achse.
  // Falls die Achse nicht durch 0 läuft (Rand-Achse), bleiben die Labels gut sichtbar am Rand.
  let ticks = '';
  for (let xi = xi0; xi <= xi1; xi++) {
    if (xi === 0) continue;
    if (Math.abs(xi) > 12) continue;
    ticks += `<text x='${sx(xi)}' y='${xAxisY + 12}' font-size='9' fill='currentColor' opacity='0.7' text-anchor='middle' font-family='system-ui,sans-serif'>${xi}</text>`;
  }
  for (let yi = yi0; yi <= yi1; yi++) {
    if (yi === 0) continue;
    if (Math.abs(yi) > 12) continue;
    ticks += `<text x='${yAxisX - 4}' y='${sy(yi) + 3}' font-size='9' fill='currentColor' opacity='0.7' text-anchor='end' font-family='system-ui,sans-serif'>${yi}</text>`;
  }

  const arrowDefs = `
    <marker id='${arrowXId}' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse' markerUnits='userSpaceOnUse'>
      <path d='M 0 0 L 10 5 L 0 10 z' fill='currentColor'/>
    </marker>
    <marker id='${arrowYId}' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse' markerUnits='userSpaceOnUse'>
      <path d='M 0 0 L 10 5 L 0 10 z' fill='currentColor'/>
    </marker>`;

  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'>
  <defs>
    <clipPath id='${clipId}'><rect x='${margin}' y='${margin}' width='${pw}' height='${ph}' rx='2'/></clipPath>
    ${arrowDefs}
  </defs>
  <rect x='${margin}' y='${margin}' width='${pw}' height='${ph}' fill='currentColor' fill-opacity='0.04' stroke='currentColor' stroke-width='1' opacity='0.22' rx='2'/>
  ${grid}
  <g clip-path='url(#${clipId})'>
    <path d='${linePath(g1)}' fill='none' stroke='currentColor' stroke-width='2.25' stroke-opacity='0.88'/>
    <path d='${linePath(g2)}' fill='none' stroke='currentColor' stroke-width='2.25' stroke-opacity='0.42' stroke-dasharray='7 5'/>
    <circle cx='${sx(xS)}' cy='${sy(yS1)}' r='5' fill='currentColor' fill-opacity='0.5' stroke='currentColor' stroke-width='1.2'/>
  </g>
  ${axes}
  ${xLabel}
  ${yLabel}
  ${ticks}
  <text x='${W / 2}' y='${H - 1}' font-size='10' fill='currentColor' text-anchor='middle' opacity='0.72' font-family='system-ui,sans-serif'>Koordinatensystem · Schnittpunkt (x = ${xS})</text>
</svg>`;
}
