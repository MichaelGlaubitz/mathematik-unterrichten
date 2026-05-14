import { describe, expect, it } from 'vitest';
import { svgLineareGleichungSchnittpunkt } from './lineareGleichungDiagrams';
import { svgParabolaScheitelform } from './quadratischeFunktionDiagrams';

function expectFunctionGraphCoordinateStyle(svg: string): void {
  expect(svg).toContain('class="mu-function-grid-line"');
  expect(svg).toContain('class="mu-function-axis"');
  expect(svg).toContain('class="mu-function-axis-label"');
  expect(svg).toContain('>x</text>');
  expect(svg).toContain('>y</text>');
  expect(svg).toContain('stroke-width="2.4"');
  expect(svg.match(/marker-end="url\(#.+?-axis-arrow\)"/g)?.length).toBeGreaterThanOrEqual(2);
  expect(svg).not.toMatch(/mu-function-grid-line[^>]+stroke-dasharray/);
}

describe('Funktionsgraph-Diagramme', () => {
  it('zeichnet lineare Funktionsgraphen mit achsennahen Pfeilachsen und sichtbarem Gitter', () => {
    const svg = svgLineareGleichungSchnittpunkt({ m: 1, n: 2 }, { m: 0, n: 4 }, 2);

    expectFunctionGraphCoordinateStyle(svg);
    expect(svg).not.toContain('Schnittpunkt: x = 2');
    expect(svg).not.toContain('Koordinatensystem · Schnittpunkt');
  });

  it('zeichnet Parabeln mit achsennahen Pfeilachsen und sichtbarem Gitter', () => {
    const svg = svgParabolaScheitelform({ a: 1, p: 4, q: -1, roots: [3, 5] });

    expectFunctionGraphCoordinateStyle(svg);
    expect(svg).toContain('Skizze Parabel');
    expect(svg).not.toContain('x="${W - padR + 4}"');
  });
});
