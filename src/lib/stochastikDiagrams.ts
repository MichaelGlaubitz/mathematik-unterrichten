/**
 * SVG-Diagrammgeneratoren für Stochastik.
 */

const svgCls = 'mx-auto max-w-full text-ink-800 dark:text-ink-200';

/**
 * Zeichnet ein einfaches Säulendiagramm (Säulenhöhen entsprechen den Werten).
 */
export function svgSaeulendiagramm(categories: string[], values: number[]): string {
  const W = 320;
  const H = 200;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 40;

  const graphW = W - padL - padR;
  const graphH = H - padT - padB;

  const maxValue = Math.max(...values, 5);
  // Finde eine passende Skalierung (z.B. runden auf gerade Zahl)
  const yMax = Math.ceil(maxValue / 2) * 2;

  // Achsen-Endpunkte
  const xOrigin = padL;
  const yOrigin = H - padB;
  const xEnd = W - padR;
  const yEnd = padT;

  // Gridlines und Y-Achsen-Beschriftungen
  let grid = '';
  const stepCount = yMax <= 10 ? yMax : 5;
  for (let i = 0; i <= stepCount; i++) {
    const val = (yMax / stepCount) * i;
    const y = yOrigin - (val / yMax) * graphH;
    grid += `<line x1='${xOrigin}' y1='${y}' x2='${xEnd}' y2='${y}' stroke='currentColor' stroke-width='0.5' opacity='0.25' stroke-dasharray='2,2'/>`;
    grid += `<text x='${xOrigin - 8}' y='${y + 4}' font-size='10' fill='currentColor' text-anchor='end' font-family='system-ui,sans-serif'>${val}</text>`;
  }

  // Säulen zeichnen
  let bars = '';
  const numBars = categories.length;
  const barGapRatio = 0.4; // Abstandverhältnis
  const barSlotW = graphW / numBars;
  const barW = barSlotW * (1 - barGapRatio);

  for (let i = 0; i < numBars; i++) {
    const val = values[i];
    const barH = (val / yMax) * graphH;
    const x = xOrigin + i * barSlotW + (barSlotW * barGapRatio) / 2;
    const y = yOrigin - barH;

    // Säule
    bars += `<rect x='${x}' y='${y}' width='${barW}' height='${barH}' fill='currentColor' fill-opacity='0.25' stroke='currentColor' stroke-width='1.2' rx='1'/>`;
    // Textwert über der Säule
    bars += `<text x='${x + barW / 2}' y='${y - 4}' font-size='10' font-weight='600' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif'>${val}</text>`;
    // Kategorie auf X-Achse
    bars += `<text x='${x + barW / 2}' y='${yOrigin + 16}' font-size='10' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif'>${categories[i]}</text>`;
  }

  // Achsen zeichnen (Y-Achse mit Pfeil oben, X-Achse mit Pfeil rechts)
  const arrowY = `<polygon points='${xOrigin},${yEnd - 6} ${xOrigin - 4},${yEnd} ${xOrigin + 4},${yEnd}' fill='currentColor'/>`;
  const arrowX = `<polygon points='${xEnd + 6},${yOrigin} ${xEnd},${yOrigin - 4} ${xEnd},${yOrigin + 4}' fill='currentColor'/>`;

  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W + 10} ${H}' class='${svgCls}' aria-hidden='true'>
    ${grid}
    <!-- X-Achse -->
    <line x1='${xOrigin}' y1='${yOrigin}' x2='${xEnd}' y2='${yOrigin}' stroke='currentColor' stroke-width='1.2'/>
    ${arrowX}
    <!-- Y-Achse -->
    <line x1='${xOrigin}' y1='${yOrigin}' x2='${xOrigin}' y2='${yEnd}' stroke='currentColor' stroke-width='1.2'/>
    ${arrowY}
    ${bars}
    <!-- Achsenbeschriftung -->
    <text x='${xOrigin - 10}' y='${yEnd - 8}' font-size='9' font-weight='600' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif'>Anzahl</text>
  </svg>`;
}

/**
 * Zeichnet ein Kreisdiagramm mit Legende auf der rechten Seite.
 */
export function svgKreisdiagramm(categories: string[], percentages: number[]): string {
  const W = 320;
  const H = 200;
  const cx = 95;
  const cy = 100;
  const r = 65;

  let slices = '';
  let accumPercent = 0;

  // Farbschemata via opacity
  const opacities = [0.18, 0.35, 0.55, 0.75, 0.9];

  for (let i = 0; i < categories.length; i++) {
    const p = percentages[i];
    if (p <= 0) continue;

    const opacity = opacities[i % opacities.length];

    if (p >= 99.9) {
      slices += `<circle cx='${cx}' cy='${cy}' r='${r}' fill='currentColor' fill-opacity='${opacity}' stroke='currentColor' stroke-width='1.2'/>`;
      break;
    }

    const angle1 = (accumPercent / 100) * 360 - 90;
    accumPercent += p;
    const angle2 = (accumPercent / 100) * 360 - 90;

    const rad1 = (angle1 * Math.PI) / 180;
    const rad2 = (angle2 * Math.PI) / 180;

    const x1 = cx + r * Math.cos(rad1);
    const y1 = cy + r * Math.sin(rad1);
    const x2 = cx + r * Math.cos(rad2);
    const y2 = cy + r * Math.sin(rad2);

    const largeArc = p > 50 ? 1 : 0;

    slices += `<path d='M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z' fill='currentColor' fill-opacity='${opacity}' stroke='currentColor' stroke-width='1.2'/>`;
  }

  // Legende auf der rechten Seite zeichnen
  let legend = '';
  const startX = 185;
  const startY = 40;
  const rowHeight = 25;

  for (let i = 0; i < categories.length; i++) {
    const opacity = opacities[i % opacities.length];
    const y = startY + i * rowHeight;
    legend += `<rect x='${startX}' y='${y}' width='12' height='12' fill='currentColor' fill-opacity='${opacity}' stroke='currentColor' stroke-width='1' rx='1'/>`;
    legend += `<text x='${startX + 20}' y='${y + 10}' font-size='10' fill='currentColor' font-family='system-ui,sans-serif'>${categories[i]} (${percentages[i]}%)</text>`;
  }

  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' class='${svgCls}' aria-hidden='true'>
    ${slices}
    ${legend}
  </svg>`;
}

/**
 * Zeichnet einen Boxplot mit darunterliegender Zahlenachse.
 */
export function svgBoxplot(minVal: number, q1: number, med: number, q3: number, maxVal: number): string {
  const W = 320;
  const H = 130;
  const padL = 30;
  const padR = 30;

  // Bereich der Achse
  const minAxis = Math.max(0, Math.floor(minVal) - 1);
  const maxAxis = Math.ceil(maxVal) + 1;
  const span = maxAxis - minAxis;

  const graphW = W - padL - padR;

  const getX = (val: number) => {
    return padL + ((val - minAxis) / span) * graphW;
  };

  const boxY = 35;
  const boxH = 40;
  const midY = boxY + boxH / 2;

  const xMin = getX(minVal);
  const xQ1 = getX(q1);
  const xMed = getX(med);
  const xQ3 = getX(q3);
  const xMax = getX(maxVal);

  // Whiskers (Antennen) und Box zeichnen
  let boxplot = '';
  // Linke Antenne
  boxplot += `<line x1='${xMin}' y1='${midY}' x2='${xQ1}' y2='${midY}' stroke='currentColor' stroke-width='1.5'/>`;
  boxplot += `<line x1='${xMin}' y1='${boxY + 10}' x2='${xMin}' y2='${boxY + boxH - 10}' stroke='currentColor' stroke-width='1.5'/>`;

  // Rechte Antenne
  boxplot += `<line x1='${xQ3}' y1='${midY}' x2='${xMax}' y2='${midY}' stroke='currentColor' stroke-width='1.5'/>`;
  boxplot += `<line x1='${xMax}' y1='${boxY + 10}' x2='${xMax}' y2='${boxY + boxH - 10}' stroke='currentColor' stroke-width='1.5'/>`;

  // Box
  boxplot += `<rect x='${xQ1}' y='${boxY}' width='${xQ3 - xQ1}' height='${boxH}' fill='currentColor' fill-opacity='0.16' stroke='currentColor' stroke-width='1.6' rx='1'/>`;

  // Median-Strich
  boxplot += `<line x1='${xMed}' y1='${boxY}' x2='${xMed}' y2='${boxY + boxH}' stroke='currentColor' stroke-width='2.2'/>`;

  // Zahlenachse (Number line)
  const lineY = 100;
  let axisTicks = '';
  // Ticks alle 1er-Schritte, falls die Spanne klein genug ist, sonst alle 2er oder 5er
  const step = span <= 16 ? 1 : span <= 30 ? 2 : 5;

  const roundedMin = Math.ceil(minAxis / step) * step;
  for (let t = roundedMin; t <= maxAxis; t += step) {
    const x = getX(t);
    axisTicks += `<line x1='${x}' y1='${lineY}' x2='${x}' y2='${lineY + 5}' stroke='currentColor' stroke-width='1.2'/>`;
    axisTicks += `<text x='${x}' y='${lineY + 18}' font-size='10' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif'>${t}</text>`;
  }

  // Achsenlinie mit Pfeilspitze in positiver Richtung (rechts)
  const arrowX = `<polygon points='${W - padR + 6},${lineY} ${W - padR},${lineY - 3.5} ${W - padR},${lineY + 3.5}' fill='currentColor'/>`;

  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' class='${svgCls}' aria-hidden='true'>
    ${boxplot}
    <!-- Achse -->
    <line x1='${padL}' y1='${lineY}' x2='${W - padR}' y2='${lineY}' stroke='currentColor' stroke-width='1.2'/>
    ${arrowX}
    ${axisTicks}
  </svg>`;
}
