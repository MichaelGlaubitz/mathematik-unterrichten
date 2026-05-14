/**
 * SVG-Skizzen für Kreisgeometrie-Aufgaben.
 */

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const STROKE_MAIN = 'var(--mu-geo-stroke)';
const STROKE_SECOND = 'var(--mu-geo-second)';
const STROKE_ACCENT = 'var(--mu-geo-accent)';
const TEXT_MAIN = 'var(--mu-geo-text)';
const TEXT_SOFT = 'var(--mu-geo-text-soft)';
const BG = 'var(--mu-geo-bg)';

export function svgKreisRadiusDurchmesser(opts: { radiusLabel?: string; diameterLabel?: string }): string {
  const { radiusLabel = 'r', diameterLabel = 'd' } = opts;
  const W = 340;
  const H = 240;
  const cx = W / 2;
  const cy = H / 2 + 8;
  const r = 78;
  return `<figure class="mu-geo-diagram" role="img" aria-label="Kreis mit Radius und Durchmesser">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${BG}" stroke="${STROKE_MAIN}" stroke-width="2.8" vector-effect="non-scaling-stroke" />
  <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${STROKE_SECOND}" stroke-width="2.5" vector-effect="non-scaling-stroke" />
  <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${STROKE_ACCENT}" stroke-width="3" vector-effect="non-scaling-stroke" />
  <circle cx="${cx}" cy="${cy}" r="4.2" fill="${STROKE_ACCENT}" />
  <text x="${cx}" y="${cy - 12}" font-size="15" fill="${TEXT_SOFT}" text-anchor="middle">M</text>
  <text x="${cx + r / 2}" y="${cy - 8}" font-size="17" fill="${STROKE_ACCENT}" text-anchor="middle">${escXml(radiusLabel)}</text>
  <text x="${cx}" y="${cy + 22}" font-size="17" fill="${STROKE_SECOND}" text-anchor="middle">${escXml(diameterLabel)}</text>
  <text x="${cx - r - 8}" y="${cy + 5}" font-size="13" fill="${TEXT_MAIN}" text-anchor="end">A</text>
  <text x="${cx + r + 8}" y="${cy + 5}" font-size="13" fill="${TEXT_MAIN}" text-anchor="start">B</text>
</svg></figure>`;
}

export function svgKreisSektor(opts: { grad: number; anteilLabel?: string }): string {
  const { grad, anteilLabel = '' } = opts;
  const W = 340;
  const H = 250;
  const cx = W / 2;
  const cy = H / 2 + 8;
  const r = 82;
  const phi = (-Math.PI / 2 + (grad * Math.PI) / 180);
  const x2 = cx + r * Math.cos(phi);
  const y2 = cy + r * Math.sin(phi);
  const largeArc = grad > 180 ? 1 : 0;
  return `<figure class="mu-geo-diagram" role="img" aria-label="Kreis mit Sektor">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${BG}" stroke="${STROKE_MAIN}" stroke-width="2.8" vector-effect="non-scaling-stroke" />
  <path d="M ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${cx} ${cy} Z" fill="color-mix(in srgb, ${STROKE_ACCENT} 20%, transparent)" stroke="none" />
  <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r}" stroke="${STROKE_SECOND}" stroke-width="2.2" vector-effect="non-scaling-stroke" />
  <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${STROKE_SECOND}" stroke-width="2.2" vector-effect="non-scaling-stroke" />
  <circle cx="${cx}" cy="${cy}" r="4" fill="${STROKE_ACCENT}" />
  <text x="${cx + 22}" y="${cy - 20}" font-size="16" fill="${STROKE_ACCENT}">${grad}°</text>
  <text x="${cx}" y="${cy + r + 20}" font-size="16" fill="${TEXT_MAIN}" text-anchor="middle">${escXml(anteilLabel)}</text>
</svg></figure>`;
}

export function svgKreisTangente(opts: { radiusLabel?: string }): string {
  const { radiusLabel = 'r' } = opts;
  const W = 340;
  const H = 240;
  const cx = W / 2 - 20;
  const cy = H / 2 + 10;
  const r = 74;
  const tx = cx + r;
  const ty = cy;
  return `<figure class="mu-geo-diagram" role="img" aria-label="Kreis mit Tangente">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${BG}" stroke="${STROKE_MAIN}" stroke-width="2.8" vector-effect="non-scaling-stroke" />
  <line x1="${cx}" y1="${cy}" x2="${tx}" y2="${ty}" stroke="${STROKE_ACCENT}" stroke-width="3" vector-effect="non-scaling-stroke" />
  <line x1="${tx}" y1="${ty - 92}" x2="${tx}" y2="${ty + 92}" stroke="${STROKE_SECOND}" stroke-width="2.6" vector-effect="non-scaling-stroke" />
  <path d="M ${tx - 14} ${ty} L ${tx - 14} ${ty - 14} L ${tx} ${ty - 14}" fill="none" stroke="${TEXT_SOFT}" stroke-width="1.8" vector-effect="non-scaling-stroke" />
  <circle cx="${cx}" cy="${cy}" r="4" fill="${STROKE_ACCENT}" />
  <text x="${cx + r / 2}" y="${cy - 8}" font-size="16" fill="${STROKE_ACCENT}" text-anchor="middle">${escXml(radiusLabel)}</text>
  <text x="${tx + 8}" y="${ty - 80}" font-size="13" fill="${TEXT_MAIN}" text-anchor="start">Tangente</text>
  <text x="${tx - 20}" y="${ty - 20}" font-size="14" fill="${TEXT_SOFT}" text-anchor="end">90°</text>
</svg></figure>`;
}
