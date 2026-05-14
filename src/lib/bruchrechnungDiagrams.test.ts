import { describe, expect, it } from 'vitest';
import {
  svgBruchErweiternKacheln,
  svgBruchMalRaster,
  svgBruchStreifen,
  svgBruchVergleichAusgangsstreifen,
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

  it('Erweitern-Kacheln: Aufgabe n/d-Spalten dunkel, ohne Lösungstext; Lösung volles Gitter mit Ergebniszeile', () => {
    const auf = svgBruchErweiternKacheln(2, 4, 3, '2/4', 'aufgabe');
    expect((auf.match(/<rect/g) || []).length).toBe(4);
    expect(auf).toContain("fill-opacity='0.34'");
    expect(auf).not.toContain('→');
    expect((auf.match(/<line/g) || []).length).toBe(7);
    const loe = svgBruchErweiternKacheln(2, 4, 3, '2/4 → 6/12', 'loesung');
    expect((loe.match(/<rect/g) || []).length).toBe(12);
    expect((loe.match(/<line/g) || []).length).toBe(9);
    expect(loe).toContain('→');
  });

  it('Vergleich: Aufgabe je Originalnenner, Lösung auf Hauptnenner', () => {
    const aus = svgBruchVergleichAusgangsstreifen(1, 3, 2, 5, 'loesung');
    expect((aus.match(/<rect/g) || []).length).toBe(8);
    const haupt = svgBruchVergleichZweiRiegel(5, 6, 15, 'loesung');
    expect((haupt.match(/<rect/g) || []).length).toBe(30);
  });

  it('Zwei Streifen und Vergleich: Aufgabe nur Umrisse', () => {
    expect(svgBruchZweiStreifen(2, 6, 3, 'aufgabe')).not.toMatch(/<rect[^>]*fill='currentColor'/);
    expect(svgBruchZweiStreifen(2, 6, 3, 'loesung')).toMatch(/<rect[^>]*fill='currentColor'/);
    expect(svgBruchVergleichZweiRiegel(4, 5, 12, 'aufgabe')).not.toMatch(/<rect[^>]*fill='currentColor'/);
    expect(svgBruchVergleichZweiRiegel(4, 5, 12, 'loesung')).toMatch(/<rect[^>]*fill='currentColor'/);
  });
});
