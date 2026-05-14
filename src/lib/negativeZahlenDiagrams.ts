/**
 * SVG-Zahlenstrahl für Vorzeichen & ganze Zahlen (Sprünge, Vergleich).
 */

function clampRange(values: number[], pad: number): [number, number] {
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  lo = Math.min(lo, 0);
  hi = Math.max(hi, 0);
  return [Math.floor(lo) - pad, Math.ceil(hi) + pad];
}

function xAt(v: number, min: number, max: number, padL: number, lineW: number): number {
  if (max <= min) return padL + lineW / 2;
  return padL + ((v - min) / (max - min)) * lineW;
}

const svgCls = "mx-auto max-w-full text-ink-800 dark:text-ink-200";

/** Zwei verschiedene ganze Zahlen als Marken auf einem Strahl (Ordnung). */
export function svgZahlenstrahlZweiWerte(a: number, b: number): string {
  if (a === b) return '';
  const span = Math.abs(a - b);
  const pad = span <= 4 ? 1 : 2;
  const [min, max] = clampRange([a, b], pad);
  const padL = 20;
  const padR = 20;
  const lineW = 300;
  const w = padL + lineW + padR;
  const lineY = 36;
  const h = 58;
  let ticks = '';
  for (let t = min; t <= max; t++) {
    const x = xAt(t, min, max, padL, lineW);
    ticks += `<line x1='${x}' y1='${lineY}' x2='${x}' y2='${lineY + 5}' stroke='currentColor' stroke-width='1' opacity='0.45'/>`;
    ticks += `<text x='${x}' y='${lineY + 20}' font-size='11' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' opacity='0.9'>${t}</text>`;
  }
  const xa = xAt(a, min, max, padL, lineW);
  const xb = xAt(b, min, max, padL, lineW);
  const dot = (x: number, opacity: string) =>
    `<circle cx='${x}' cy='${lineY - 10}' r='5' fill='currentColor' fill-opacity='${opacity}' stroke='currentColor' stroke-width='1.2'/>`;
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' class='${svgCls}' aria-hidden='true'>
  <line x1='${padL}' y1='${lineY}' x2='${padL + lineW}' y2='${lineY}' stroke='currentColor' stroke-width='1.6'/>
  ${ticks}
  ${dot(xa, '0.35')}
  ${dot(xb, '0.65')}
  <text x='${xa}' y='${lineY - 18}' font-size='10' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' font-weight='600'>A</text>
  <text x='${xb}' y='${lineY - 18}' font-size='10' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' font-weight='600'>B</text>
</svg>`;
}

/** Sprung von start um delta (Addition – delta kann negativ sein). */
export function svgZahlenstrahlSprung(start: number, delta: number): string {
  const end = start + delta;
  const pad = Math.max(1, Math.min(3, 1 + Math.floor(Math.abs(delta) / 6)));
  const [min, max] = clampRange([start, end], pad);
  const padL = 20;
  const padR = 22;
  const lineW = 300;
  const w = padL + lineW + padR;
  const lineY = 40;
  const yA = 22;
  const h = 62;
  let ticks = '';
  for (let t = min; t <= max; t++) {
    const x = xAt(t, min, max, padL, lineW);
    ticks += `<line x1='${x}' y1='${lineY}' x2='${x}' y2='${lineY + 5}' stroke='currentColor' stroke-width='1' opacity='0.45'/>`;
    ticks += `<text x='${x}' y='${lineY + 20}' font-size='11' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' opacity='0.9'>${t}</text>`;
  }
  const x0 = xAt(start, min, max, padL, lineW);
  const x1 = xAt(end, min, max, padL, lineW);
  if (Math.abs(x1 - x0) < 2) {
    return svgZahlenstrahlZweiWerte(start, end) || '';
  }
  const dir = x1 >= x0 ? 1 : -1;
  const tipX = x1;
  const stemEnd = tipX - dir * 9;
  const stemStart = x0 + dir * Math.min(6, Math.abs(stemEnd - x0) * 0.2);
  const s0 = dir > 0 ? Math.max(stemStart, x0) : Math.min(stemStart, x0);
  const arrowHead = `<polygon points='${tipX},${yA} ${stemEnd},${yA - 4.5} ${stemEnd},${yA + 4.5}' fill='currentColor'/>`;
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' class='${svgCls}' aria-hidden='true'>
  <line x1='${padL}' y1='${lineY}' x2='${padL + lineW}' y2='${lineY}' stroke='currentColor' stroke-width='1.6'/>
  ${ticks}
  <circle cx='${x0}' cy='${yA}' r='4' fill='none' stroke='currentColor' stroke-width='1.6'/>
  <text x='${x0}' y='${yA - 10}' font-size='10' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' opacity='0.85'>Start</text>
  <line x1='${s0}' y1='${yA}' x2='${stemEnd}' y2='${yA}' stroke='currentColor' stroke-width='2' stroke-linecap='round'/>${arrowHead}
  <text x='${x1}' y='${yA - 10}' font-size='10' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' font-weight='600'>Ziel</text>
  <circle cx='${x1}' cy='${yA}' r='4' fill='currentColor' fill-opacity='0.5' stroke='currentColor' stroke-width='1.2'/>
</svg>`;
}
