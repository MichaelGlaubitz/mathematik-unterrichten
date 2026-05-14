import { describe, expect, it } from 'vitest';
import { svgLineareGleichungSchnittpunkt } from './lineareGleichungDiagrams';
import { svgParabolaScheitelform } from './quadratischeFunktionDiagrams';

describe('Funktionsgraphen-Diagramme', () => {
  it('lineares Koordinatensystem: Achsen sind fett, mit Pfeilen und achsennahen Labels', () => {
    const svg = svgLineareGleichungSchnittpunkt({ m: 1, n: 0 }, { m: -1, n: 2 }, 1);
    expect(svg).toContain("stroke-width='2.4'");
    expect(svg).toContain("marker-end='url(#");
    expect(svg).toContain(">x</text>");
    expect(svg).toContain(">y</text>");
  });

  it('lineares Koordinatensystem: Gitter ist dünn und blass', () => {
    const svg = svgLineareGleichungSchnittpunkt({ m: 2, n: -3 }, { m: -1, n: 6 }, 3);
    expect(svg).toContain("stroke-width='0.7'");
    expect(svg).toContain("opacity='0.2'");
  });

  it('Parabel-Skizze: Achsen sind fett, mit Pfeilen, Labels und Gitter', () => {
    const svg = svgParabolaScheitelform({ a: 1, p: 0, q: -2, roots: [-1, 1] });
    expect(svg).toContain('stroke-width="2.4"');
    expect(svg).toContain('marker-end="url(#');
    expect(svg).toContain('>x</text>');
    expect(svg).toContain('>y</text>');
    expect(svg).toContain('stroke-width="0.7"');
    expect(svg).toContain('opacity="0.2"');
  });
});
