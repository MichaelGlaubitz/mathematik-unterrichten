import { describe, it, expect } from 'vitest';
import { svgParabolaScheitelform } from './quadratischeFunktionDiagrams';
import { svgLineareGleichungSchnittpunkt } from './lineareGleichungDiagrams';

/**
 * Die Funktionsgraph-Skizzen sollen vier Anforderungen erfüllen:
 *   1. Achsen achsennah beschriftet (Labels x / y nahe der Achse, nicht am Rand)
 *   2. Pfeile in aufsteigender Richtung (Marker am positiven Achsenende)
 *   3. Fette Achsen (sichtbar stärkere Stroke-Width als ein Gitterstrich)
 *   4. Dünnes, durchgezogenes, blasses, aber gut erkennbares Koordinatengitter
 */

describe('Funktionsgraph-Achsen: Parabel (svgParabolaScheitelform)', () => {
  const svg = svgParabolaScheitelform({ a: 1, p: 0, q: -1, roots: [-1, 1] });

  it('liefert ein gültiges SVG', () => {
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('hat Pfeil-Marker für beide Achsen (Pfeilspitzen)', () => {
    expect(svg).toMatch(/<marker[^>]*id="mu-parab-arrow-x-/);
    expect(svg).toMatch(/<marker[^>]*id="mu-parab-arrow-y-/);
    expect(svg).toMatch(/marker-end="url\(#mu-parab-arrow-x-/);
    expect(svg).toMatch(/marker-end="url\(#mu-parab-arrow-y-/);
  });

  it('beschriftet beide Achsen mit "x" und "y"', () => {
    expect(svg).toMatch(/>x<\/text>/);
    expect(svg).toMatch(/>y<\/text>/);
  });

  it('hat ein Koordinatengitter aus durchgezogenen, blassen Linien', () => {
    const gridMatches = svg.match(/stroke-width="0\.6"[^>]*opacity="0\.22"/g);
    expect(gridMatches).not.toBeNull();
    expect((gridMatches ?? []).length).toBeGreaterThan(3);
    expect(svg).not.toMatch(/stroke-dasharray=/);
  });

  it('hat fette Achsen (stroke-width >= 2)', () => {
    const axisMatches = svg.match(/<line[^>]*stroke-width="2\.2"[^>]*marker-end=/g);
    expect(axisMatches).not.toBeNull();
    expect((axisMatches ?? []).length).toBe(2);
  });
});

describe('Funktionsgraph-Achsen: Geraden (svgLineareGleichungSchnittpunkt)', () => {
  const svg = svgLineareGleichungSchnittpunkt({ m: 1, n: 0 }, { m: -1, n: 2 }, 1);

  it('liefert ein gültiges SVG', () => {
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('hat Pfeil-Marker auf beiden Achsen', () => {
    expect(svg).toMatch(/<marker[^>]*id='lgc-arrow-x-/);
    expect(svg).toMatch(/<marker[^>]*id='lgc-arrow-y-/);
    expect(svg).toMatch(/marker-end='url\(#lgc-arrow-x-/);
    expect(svg).toMatch(/marker-end='url\(#lgc-arrow-y-/);
  });

  it('beschriftet beide Achsen mit "x" und "y"', () => {
    expect(svg).toMatch(/>x<\/text>/);
    expect(svg).toMatch(/>y<\/text>/);
  });

  it('hat fette Achsen (stroke-width >= 2)', () => {
    const axes = svg.match(/<line[^>]*stroke-width='2\.1'[^>]*marker-end=/g);
    expect(axes).not.toBeNull();
    expect((axes ?? []).length).toBe(2);
  });

  it('hat ein durchgezogenes Gitter mit moderater Deckkraft', () => {
    const grid = svg.match(/stroke-width='0\.6'[^>]*opacity='0\.18'/g);
    expect(grid).not.toBeNull();
    expect((grid ?? []).length).toBeGreaterThan(3);
    expect(svg).not.toMatch(/<line[^>]*stroke-dasharray=/);
  });

  it('zeichnet die Achsen über die volle Plot-Breite/-Höhe', () => {
    expect(svg).toMatch(/<line x1='36'[^>]*y2='\d+(?:\.\d+)?'[^>]*marker-end='url\(#lgc-arrow-x-/);
  });
});
