/**
 * Flächenmodell für das Distributivgesetz k(m+n) = km + kn (positive ganze Zahlen).
 */

export function svgDistributivFlaeche(k: number, m: number, n: number): string {
  if (k < 2 || k > 8 || m < 2 || m > 8 || n < 2 || n > 8) return '';
  const cellW = 16;
  const cellH = 14;
  const w1 = m * cellW;
  const w2 = n * cellW;
  const h = k * cellH;
  const pad = 8;
  const W = w1 + w2 + pad * 3 + 24;
  const H = h + pad * 2 + 28;
  const vK = `${k}`;
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' class='mx-auto max-w-full text-ink-800 dark:text-ink-200' aria-hidden='true'>
  <rect x='${pad}' y='${pad}' width='${w1}' height='${h}' fill='currentColor' fill-opacity='0.14' stroke='currentColor' stroke-width='1.2' rx='1'/>
  <rect x='${pad + w1}' y='${pad}' width='${w2}' height='${h}' fill='currentColor' fill-opacity='0.26' stroke='currentColor' stroke-width='1.2' rx='1'/>
  <text x='${pad + w1 / 2}' y='${pad + h / 2 + 4}' font-size='12' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' font-weight='600'>${k}·${m}</text>
  <text x='${pad + w1 + w2 / 2}' y='${pad + h / 2 + 4}' font-size='12' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' font-weight='600'>${k}·${n}</text>
  <text x='${pad + (w1 + w2) / 2}' y='${H - 6}' font-size='11' fill='currentColor' text-anchor='middle' font-family='system-ui,sans-serif' opacity='0.85'>Höhe je ${vK}</text>
</svg>`;
}
