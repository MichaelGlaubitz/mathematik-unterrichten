import { describe, it, expect } from 'vitest';
import {
  svgRightTriangleKatheten,
  svgRightTriangleFromThreeLengths,
  svgTriangleSSS,
  svgSegmentAbstand,
  svgRectangleDiagonal,
} from './pythagorasDiagrams';

describe('pythagorasDiagrams', () => {
  it('rechtwinkliges Dreieck 3-4-5: SVG enthält Seitenlängen', () => {
    const s = svgRightTriangleKatheten(3, 4, 5, {
      horizontal: '3',
      vertical: '4',
      hypotenuse: '5',
    });
    expect(s).toContain('<svg');
    expect(s).toContain('>3<');
    expect(s).toContain('>4<');
    expect(s).toContain('>5<');
  });

  it('SSS-Dreieck 9-40-41 ist schließbar', () => {
    const s = svgTriangleSSS(9, 40, 41, { base: '9', left: '41', right: '40' });
    expect(s).toContain('<svg');
  });

  it('drei permutierte Längen eines Tripels: Hypotenuse in der Skizze nicht als Zahl (gesucht)', () => {
    const s = svgRightTriangleFromThreeLengths(40, 9, 41);
    expect(s).toContain('<svg');
    expect(s).toContain('>9<');
    expect(s).toContain('>40<');
    expect(s).toContain('>?<');
    expect(s).not.toContain('>41<');
  });

  it('Koordinaten-Skizze enthält Punktkoordinaten', () => {
    const s = svgSegmentAbstand(0, 0, 3, 4);
    expect(s).toContain('A(0|0)');
    expect(s).toContain('B(3|4)');
  });

  it('Rechteck-Diagonale: Seiten beschriftet', () => {
    const s = svgRectangleDiagonal(12, 5);
    expect(s).toContain('<rect');
    expect(s).toContain('>12<');
    expect(s).toContain('>5<');
  });

  it('Rechteck-Diagonale: optionales Fragezeichen auf Diagonale', () => {
    const s = svgRectangleDiagonal(12, 5, { diagonalLabel: '?' });
    expect(s).toContain('>?<');
  });
});
