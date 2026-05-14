import { describe, expect, it } from 'vitest';
import {
  svgBruchErweiternKacheln,
  svgBruchMalRaster,
  svgBruchStreifen,
  svgBruchVergleichZweiRiegel,
  svgBruchZweiStreifen,
} from './bruchrechnungDiagrams';

describe('bruchrechnungDiagrams', () => {
  it('markiert Teilflächen in der Lösung, nicht in der Aufgabe (Multiplikationsraster)', () => {
    const auf = svgBruchMalRaster(2, 3, 2, 4, 'aufgabe');
    const loe = svgBruchMalRaster(2, 3, 2, 4, 'loesung');
    expect(auf.match(/fill-opacity='0.34'/g)).toBeNull();
    expect(loe.match(/fill-opacity='0.34'/g)?.length).toBeGreaterThan(0);
  });

  it('Streifen: Aufgabe ohne Zähler-Schattierung', () => {
    const auf = svgBruchStreifen(2, 5, '2/5', 'aufgabe');
    expect(auf).not.toMatch(/<rect[^>]*fill='currentColor'/);
    expect(svgBruchStreifen(2, 5, '2/5', 'loesung')).toMatch(/<rect[^>]*fill='currentColor'/);
  });

  it('Erweitern-Kacheln: d×k Raster mit Gitterlinien', () => {
    const svg = svgBruchErweiternKacheln(2, 4, 3, '2/4 → 6/12', 'loesung');
    expect((svg.match(/<rect/g) || []).length).toBe(12);
    const lines = svg.match(/<line/g) || [];
    expect(lines.length).toBe(9);
  });

  it('Zwei Streifen und Vergleich: Aufgabe nur Umrisse', () => {
    expect(svgBruchZweiStreifen(2, 6, 3, 'aufgabe')).not.toMatch(/<rect[^>]*fill='currentColor'/);
    expect(svgBruchZweiStreifen(2, 6, 3, 'loesung')).toMatch(/<rect[^>]*fill='currentColor'/);
    expect(svgBruchVergleichZweiRiegel(4, 5, 12, 'aufgabe')).not.toMatch(/<rect[^>]*fill='currentColor'/);
    expect(svgBruchVergleichZweiRiegel(4, 5, 12, 'loesung')).toMatch(/<rect[^>]*fill='currentColor'/);
  });
});
