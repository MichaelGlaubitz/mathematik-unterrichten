/** Anteile in Prozent (0–100), Index parallel zu `counts`. */
export function percentagesFromCounts(counts: number[]): number[] {
  const total = counts.reduce((sum, n) => sum + n, 0);
  if (total <= 0) return counts.map(() => 0);

  const raw = counts.map((c) => (100 * c) / total);
  const floors = raw.map((r) => Math.floor(r));
  let remainder = 100 - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - floors[i] }))
    .sort((a, b) => b.frac - a.frac);

  const out = [...floors];
  for (let k = 0; k < remainder; k += 1) {
    out[order[k % order.length].i] += 1;
  }
  return out;
}
