/**
 * SVG-Skizzen für Strahlensatz-Aufgaben.
 *
 * Wichtig: Die Strecken sind *maßstäblich* dargestellt, sodass das Verhältnis
 * |ZA|/|ZA'| = |AB|/|A'B'| visuell stimmt. Beschriftungen sitzen außerhalb der
 * Linien, Strahlen und Parallelen sind farblich unterschieden.
 */

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const STROKE_MAIN = 'var(--mu-geo-stroke)';
const STROKE_SECOND = 'var(--mu-geo-second)';
const STROKE_ACCENT = 'var(--mu-geo-accent)';
const TEXT_MAIN = 'var(--mu-geo-text)';
const TEXT_SOFT = 'var(--mu-geo-text-soft)';
const HELPER = 'var(--mu-geo-helper)';
const BG = 'var(--mu-geo-bg)';

function point(x: number, y: number, opts?: { ring?: boolean; r?: number }): string {
  const r = opts?.r ?? 5;
  if (opts?.ring === false) {
    return `<circle cx="${x}" cy="${y}" r="${r * 0.6}" fill="${STROKE_ACCENT}" />`;
  }
  return `<circle cx="${x}" cy="${y}" r="${r + 1.5}" fill="${BG}" stroke="${STROKE_ACCENT}" stroke-width="1.6" /><circle cx="${x}" cy="${y}" r="${r * 0.6}" fill="${STROKE_ACCENT}" />`;
}

/**
 * V-Figur (zwei Strahlen treffen sich in Z).
 * Auf dem ersten Strahl liegen $A$ (näher an $Z$) und $A'$ (weiter).
 * Analog auf dem zweiten Strahl $B$ und $B'$.
 * Die Strecken $AB$ und $A'B'$ verbinden die Strahlen und sind parallel.
 *
 * Wir platzieren $A'$ und $B'$ am Ende der gezeichneten Strahlen, $A$ und $B$
 * bei `zA/zAp` davon entfernt — so stimmt das Streckenverhältnis im Bild.
 */
export function svgStrahlensatzV(opts: {
  zA: number;
  zAp: number;
  /** Beschriftung der inneren Parallele $|AB|$. */
  labelAB?: string;
  /** Beschriftung der äußeren Parallele $|A'B'|$. */
  labelApBp?: string;
}): string {
  const { zA, zAp, labelAB, labelApBp } = opts;
  const W = 340;
  const H = 260;
  const Zx = W / 2;
  const Zy = H - 30;
  const upY = 32;
  const Lx = 52;
  const Rx = W - 52;
  const tA = zA / zAp;

  const Apx = Lx;
  const Apy = upY;
  const Bpx = Rx;
  const Bpy = upY;
  const Ax = Zx + (Apx - Zx) * tA;
  const Ay = Zy + (Apy - Zy) * tA;
  const Bx = Zx + (Bpx - Zx) * tA;
  const By = Zy + (Bpy - Zy) * tA;

  const drawLabelAB = labelAB !== undefined && labelAB.length > 0;
  const drawLabelApBp = labelApBp !== undefined && labelApBp.length > 0;

  // Strahlen (über A' / B' hinaus leicht verlängert)
  const Lext = {
    x: Zx + (Apx - Zx) * 1.06,
    y: Zy + (Apy - Zy) * 1.06,
  };
  const Rext = {
    x: Zx + (Bpx - Zx) * 1.06,
    y: Zy + (Bpy - Zy) * 1.06,
  };

  const labAB = drawLabelAB
    ? `<text x="${(Ax + Bx) / 2}" y="${(Ay + By) / 2 - 10}" font-size="17" fill="${STROKE_SECOND}" text-anchor="middle">${escXml(labelAB!)}</text>`
    : '';
  const labApBp = drawLabelApBp
    ? `<text x="${(Apx + Bpx) / 2}" y="${(Apy + Bpy) / 2 - 12}" font-size="17" fill="${STROKE_SECOND}" text-anchor="middle">${escXml(labelApBp!)}</text>`
    : '';

  // Parallel-Marker (Pfeilstrich) auf den Parallelen, zeigt Parallelität.
  function parallelMarker(p1: { x: number; y: number }, p2: { x: number; y: number }, count: number): string {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const tx = dx / len;
    const ty = dy / len;
    const nx = -ty;
    const ny = tx;
    const size = 5;
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      const off = (i - (count - 1) / 2) * 6;
      const cx = mx + tx * off;
      const cy = my + ty * off;
      out.push(
        `<path d="M ${cx + nx * size - tx * size} ${cy + ny * size - ty * size} L ${cx} ${cy} L ${cx - nx * size - tx * size} ${cy - ny * size - ty * size}" fill="none" stroke="${STROKE_SECOND}" stroke-width="1.4" vector-effect="non-scaling-stroke" />`
      );
    }
    return out.join('');
  }
  const tickInner = parallelMarker({ x: Ax, y: Ay }, { x: Bx, y: By }, 2);
  const tickOuter = parallelMarker({ x: Apx, y: Apy }, { x: Bpx, y: Bpy }, 2);

  return `<figure class="mu-geo-diagram" role="img" aria-label="Strahlensatz V-Figur">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <line x1="${Zx}" y1="${Zy}" x2="${Lext.x}" y2="${Lext.y}" stroke="${STROKE_MAIN}" stroke-width="2.6" vector-effect="non-scaling-stroke" />
  <line x1="${Zx}" y1="${Zy}" x2="${Rext.x}" y2="${Rext.y}" stroke="${STROKE_MAIN}" stroke-width="2.6" vector-effect="non-scaling-stroke" />
  <line x1="${Ax}" y1="${Ay}" x2="${Bx}" y2="${By}" stroke="${STROKE_SECOND}" stroke-width="2.8" vector-effect="non-scaling-stroke" />
  <line x1="${Apx}" y1="${Apy}" x2="${Bpx}" y2="${Bpy}" stroke="${STROKE_SECOND}" stroke-width="2.8" vector-effect="non-scaling-stroke" />
  ${tickInner}
  ${tickOuter}
  ${point(Zx, Zy, { r: 5 })}
  ${point(Ax, Ay, { r: 4 })}
  ${point(Bx, By, { r: 4 })}
  ${point(Apx, Apy, { r: 4 })}
  ${point(Bpx, Bpy, { r: 4 })}
  <text x="${Zx}" y="${Zy + 22}" font-size="17" fill="${TEXT_MAIN}" text-anchor="middle" font-style="italic">Z</text>
  <text x="${Ax - 8}" y="${Ay - 4}" font-size="15" fill="${TEXT_SOFT}" text-anchor="end" font-style="italic">A</text>
  <text x="${Bx + 8}" y="${By - 4}" font-size="15" fill="${TEXT_SOFT}" text-anchor="start" font-style="italic">B</text>
  <text x="${Apx - 8}" y="${Apy - 6}" font-size="15" fill="${TEXT_SOFT}" text-anchor="end" font-style="italic">A&#39;</text>
  <text x="${Bpx + 8}" y="${Bpy - 6}" font-size="15" fill="${TEXT_SOFT}" text-anchor="start" font-style="italic">B&#39;</text>
  ${labAB}
  ${labApBp}
</svg></figure>`;
}

/**
 * X-Figur: zwei Geraden schneiden sich in $Z$.
 * Auf der einen Geraden liegen $S_1$ (über $Z$) und $S_2$ (unter $Z$);
 * Parallelen durch $S_1$ und $S_2$ schneiden die zweite Gerade in den
 * Endpunkten der parallelen Strecken $s_1$ bzw. $s_2$.
 */
export function svgStrahlensatzX(opts: {
  zS1: number;
  zS2: number;
  labelS1?: string;
  labelS2?: string;
}): string {
  const { zS1, zS2, labelS1, labelS2 } = opts;
  const W = 340;
  const H = 280;
  const padTop = 32;
  const padBottom = 32;
  const usableH = H - padTop - padBottom;
  // Winkel der ersten Geraden relativ zur Senkrechten
  const tilt = 0.42;
  const yFactor = Math.cos(tilt); // cos(tilt) = vertikaler Anteil
  const xFactor = Math.sin(tilt); // sin(tilt) = horizontaler Anteil

  // Zy so wählen, dass S1 bei padTop und S2 bei H - padBottom landen.
  const ratio = zS1 / (zS1 + zS2);
  const Zy = padTop + ratio * usableH;
  const s = usableH / ((zS1 + zS2) * yFactor);
  const Zx = W / 2;

  // Erste Gerade: S1 oben-rechts, S2 unten-links
  const r1 = zS1 * s;
  const r2 = zS2 * s;
  const S1x = Zx + r1 * xFactor;
  const S1y = Zy - r1 * yFactor;
  const S2x = Zx - r2 * xFactor;
  const S2y = Zy + r2 * yFactor;
  // Zweite Gerade (am Z gespiegelt): T1 oben-links, T2 unten-rechts
  const T1x = Zx - r1 * xFactor;
  const T1y = Zy - r1 * yFactor;
  const T2x = Zx + r2 * xFactor;
  const T2y = Zy + r2 * yFactor;

  const ext = 1.1;
  const e1 = { x: Zx + r1 * ext * xFactor, y: Zy - r1 * ext * yFactor };
  const e2 = { x: Zx - r2 * ext * xFactor, y: Zy + r2 * ext * yFactor };
  const f1 = { x: Zx - r1 * ext * xFactor, y: Zy - r1 * ext * yFactor };
  const f2 = { x: Zx + r2 * ext * xFactor, y: Zy + r2 * ext * yFactor };

  const labS1 =
    labelS1 !== undefined
      ? `<text x="${(S1x + T1x) / 2}" y="${S1y - 10}" font-size="17" fill="${STROKE_SECOND}" text-anchor="middle">${escXml(labelS1)}</text>`
      : '';
  const labS2 =
    labelS2 !== undefined
      ? `<text x="${(S2x + T2x) / 2}" y="${S2y + 22}" font-size="17" fill="${STROKE_SECOND}" text-anchor="middle">${escXml(labelS2)}</text>`
      : '';

  return `<figure class="mu-geo-diagram" role="img" aria-label="Strahlensatz X-Figur">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <line x1="${e1.x}" y1="${e1.y}" x2="${e2.x}" y2="${e2.y}" stroke="${STROKE_MAIN}" stroke-width="2.6" vector-effect="non-scaling-stroke" />
  <line x1="${f1.x}" y1="${f1.y}" x2="${f2.x}" y2="${f2.y}" stroke="${STROKE_MAIN}" stroke-width="2.6" vector-effect="non-scaling-stroke" />
  <line x1="${S1x}" y1="${S1y}" x2="${T1x}" y2="${T1y}" stroke="${STROKE_SECOND}" stroke-width="2.8" vector-effect="non-scaling-stroke" />
  <line x1="${S2x}" y1="${S2y}" x2="${T2x}" y2="${T2y}" stroke="${STROKE_SECOND}" stroke-width="2.8" vector-effect="non-scaling-stroke" />
  ${point(Zx, Zy, { r: 5 })}
  ${point(S1x, S1y, { r: 4 })}
  ${point(T1x, T1y, { r: 4 })}
  ${point(S2x, S2y, { r: 4 })}
  ${point(T2x, T2y, { r: 4 })}
  <text x="${Zx + 14}" y="${Zy + 5}" font-size="17" fill="${TEXT_MAIN}" font-style="italic">Z</text>
  <text x="${S1x + 8}" y="${S1y + 4}" font-size="15" fill="${TEXT_SOFT}" text-anchor="start" font-style="italic">S₁</text>
  <text x="${T1x - 8}" y="${T1y + 4}" font-size="15" fill="${TEXT_SOFT}" text-anchor="end" font-style="italic">T₁</text>
  <text x="${S2x - 8}" y="${S2y + 4}" font-size="15" fill="${TEXT_SOFT}" text-anchor="end" font-style="italic">S₂</text>
  <text x="${T2x + 8}" y="${T2y + 4}" font-size="15" fill="${TEXT_SOFT}" text-anchor="start" font-style="italic">T₂</text>
  ${labS1}
  ${labS2}
</svg></figure>`;
}

/**
 * Schattenfigur: Stab und Turm mit Sonnenstrahl, der beide Spitzen verbindet.
 * Zwei rechtwinklige Dreiecke (ähnlich) auf dem gleichen Boden.
 */
export function svgStrahlensatzSchatten(opts: {
  hStab: number;
  sStab: number;
  hTurm: number;
  sTurm: number;
}): string {
  const { hStab, sStab, hTurm, sTurm } = opts;
  const W = 360;
  const H = 240;
  const padX = 36;
  const padTop = 28;
  const groundY = H - 40;
  // Boden- und Höhen-Achse getrennt skalieren, sonst werden Bodenlängen unleserlich.
  const totalW = sTurm + sStab + 2;
  const maxH = Math.max(hTurm, hStab);
  const sx = (W - 2 * padX) / totalW;
  const sy = (groundY - padTop) / maxH;

  const turmBase = { x: padX, y: groundY };
  const turmTip = { x: turmBase.x, y: groundY - hTurm * sy };
  const turmShadow = { x: turmBase.x + sTurm * sx, y: groundY };
  const stabBase = { x: turmShadow.x + sx * 2, y: groundY };
  const stabTip = { x: stabBase.x, y: groundY - hStab * sy };
  const stabShadow = { x: stabBase.x + sStab * sx, y: groundY };

  return `<figure class="mu-geo-diagram" role="img" aria-label="Schatten: Turm und Stab mit Sonnenstrahl">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <line x1="${padX - 10}" y1="${groundY}" x2="${W - padX + 10}" y2="${groundY}" stroke="${HELPER}" stroke-width="1.6" vector-effect="non-scaling-stroke" />
  <line x1="${turmBase.x}" y1="${turmBase.y}" x2="${turmTip.x}" y2="${turmTip.y}" stroke="${STROKE_MAIN}" stroke-width="3.4" vector-effect="non-scaling-stroke" />
  <line x1="${turmBase.x}" y1="${groundY + 3}" x2="${turmShadow.x}" y2="${groundY + 3}" stroke="${STROKE_ACCENT}" stroke-width="3.5" stroke-linecap="round" vector-effect="non-scaling-stroke" />
  <line x1="${turmShadow.x}" y1="${groundY}" x2="${turmTip.x}" y2="${turmTip.y}" stroke="${STROKE_SECOND}" stroke-width="1.8" stroke-dasharray="6 4" vector-effect="non-scaling-stroke" />
  <line x1="${stabBase.x}" y1="${stabBase.y}" x2="${stabTip.x}" y2="${stabTip.y}" stroke="${STROKE_MAIN}" stroke-width="3" vector-effect="non-scaling-stroke" />
  <line x1="${stabBase.x}" y1="${groundY + 3}" x2="${stabShadow.x}" y2="${groundY + 3}" stroke="${STROKE_ACCENT}" stroke-width="3.5" stroke-linecap="round" vector-effect="non-scaling-stroke" />
  <line x1="${stabShadow.x}" y1="${groundY}" x2="${stabTip.x}" y2="${stabTip.y}" stroke="${STROKE_SECOND}" stroke-width="1.8" stroke-dasharray="6 4" vector-effect="non-scaling-stroke" />
  <text x="${turmBase.x - 10}" y="${(turmBase.y + turmTip.y) / 2 + 6}" font-size="17" fill="${TEXT_MAIN}" text-anchor="end">?</text>
  <text x="${(turmBase.x + turmShadow.x) / 2}" y="${groundY + 24}" font-size="17" fill="${STROKE_ACCENT}" text-anchor="middle">${escXml(String(sTurm))}</text>
  <text x="${stabBase.x + 10}" y="${(stabBase.y + stabTip.y) / 2 + 6}" font-size="17" fill="${TEXT_MAIN}" text-anchor="start">${escXml(String(hStab))}</text>
  <text x="${(stabBase.x + stabShadow.x) / 2}" y="${groundY + 24}" font-size="17" fill="${STROKE_ACCENT}" text-anchor="middle">${escXml(String(sStab))}</text>
  <text x="${turmBase.x}" y="${padTop - 8}" font-size="13" fill="${TEXT_SOFT}" text-anchor="start" font-style="italic">Turm</text>
  <text x="${stabBase.x}" y="${groundY - hStab * sy - 8}" font-size="13" fill="${TEXT_SOFT}" text-anchor="start" font-style="italic">Stab</text>
</svg></figure>`;
}

/**
 * Spiegel-Mast-Figur: Beobachter, Spiegel auf dem Boden, Mast.
 * Zwei ähnliche Dreiecke mit dem Spiegelpunkt als gemeinsamer Ecke.
 */
export function svgStrahlensatzSpiegel(opts: {
  a: number; // Spiegel ↔ Mast (Boden)
  b: number; // Beobachter ↔ Spiegel (Boden)
  hAuge: number; // in dm
  hMast: number; // in dm
}): string {
  const { a, b, hAuge, hMast } = opts;
  const W = 360;
  const H = 250;
  const padX = 40;
  const padTop = 28;
  const groundY = H - 42;
  const totalW = a + b;
  // Getrennte Skalen für Boden und Höhe (Höhen sind in dm und meist viel größer)
  const sx = (W - 2 * padX) / totalW;
  const sy = (groundY - padTop) / Math.max(hMast, hAuge * 4);

  const mastBase = { x: padX, y: groundY };
  const mastTip = { x: mastBase.x, y: groundY - hMast * sy };
  const mirror = { x: mastBase.x + a * sx, y: groundY };
  const eyeBase = { x: mirror.x + b * sx, y: groundY };
  const eye = { x: eyeBase.x, y: groundY - hAuge * sy };

  return `<figure class="mu-geo-diagram" role="img" aria-label="Spiegel-Mast-Skizze">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
  <line x1="${padX - 10}" y1="${groundY}" x2="${W - padX + 10}" y2="${groundY}" stroke="${HELPER}" stroke-width="1.6" vector-effect="non-scaling-stroke" />
  <line x1="${mastBase.x}" y1="${mastBase.y}" x2="${mastTip.x}" y2="${mastTip.y}" stroke="${STROKE_MAIN}" stroke-width="3.4" vector-effect="non-scaling-stroke" />
  <line x1="${eyeBase.x}" y1="${eyeBase.y}" x2="${eye.x}" y2="${eye.y}" stroke="${STROKE_MAIN}" stroke-width="3" vector-effect="non-scaling-stroke" />
  <circle cx="${eye.x}" cy="${eye.y - 8}" r="7" fill="none" stroke="${STROKE_MAIN}" stroke-width="2" vector-effect="non-scaling-stroke" />
  <rect x="${mirror.x - 14}" y="${groundY - 5}" width="28" height="5" fill="${STROKE_ACCENT}" rx="1.5" />
  <line x1="${eye.x}" y1="${eye.y}" x2="${mirror.x}" y2="${mirror.y - 3}" stroke="${STROKE_SECOND}" stroke-width="2" stroke-dasharray="6 4" vector-effect="non-scaling-stroke" />
  <line x1="${mirror.x}" y1="${mirror.y - 3}" x2="${mastTip.x}" y2="${mastTip.y}" stroke="${STROKE_SECOND}" stroke-width="2" stroke-dasharray="6 4" vector-effect="non-scaling-stroke" />
  <text x="${mastBase.x - 10}" y="${(mastBase.y + mastTip.y) / 2 + 6}" font-size="17" fill="${TEXT_MAIN}" text-anchor="end">?</text>
  <text x="${(mastBase.x + mirror.x) / 2}" y="${groundY + 24}" font-size="17" fill="${STROKE_ACCENT}" text-anchor="middle">${escXml(String(a))}</text>
  <text x="${(mirror.x + eyeBase.x) / 2}" y="${groundY + 24}" font-size="17" fill="${STROKE_ACCENT}" text-anchor="middle">${escXml(String(b))}</text>
  <text x="${eye.x + 14}" y="${(eyeBase.y + eye.y) / 2 + 6}" font-size="17" fill="${TEXT_MAIN}" text-anchor="start">${escXml(String(hAuge))}</text>
  <text x="${mastBase.x + 6}" y="${padTop + 4}" font-size="13" fill="${TEXT_SOFT}" text-anchor="start" font-style="italic">Mast</text>
  <text x="${eye.x - 10}" y="${eye.y - 18}" font-size="13" fill="${TEXT_SOFT}" text-anchor="end" font-style="italic">Auge</text>
  <text x="${mirror.x}" y="${groundY - 14}" font-size="12" fill="${STROKE_ACCENT}" text-anchor="middle" font-style="italic">Spiegel</text>
</svg></figure>`;
}
