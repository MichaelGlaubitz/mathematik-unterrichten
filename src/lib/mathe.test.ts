import { describe, it, expect } from 'vitest';
import katex from 'katex';
import { alsLatex, zelleAlsLatex } from './mathe';

/**
 * Der Bestand ist auf Formelsatz umgestellt; die alte Schreibweise steht
 * nur noch hier, als Prüfsteine für den Wandler. Was heute in den Dateien
 * steht, prüft aufgabenfolgen.test.ts.
 */
const ausdruecke = [
  '(x + 3)²', 'x² + 6x + 9', '5/6 + 7/10', '46/30 = 23/15 = 1 8/15', '(3x)/(5x)',
  '√50 = 5√2', '√((-3)²)', '0,75', '75 %', '1/2 + ___ = 3/4', '½ + ¼',
  '3,2 · 2,5', 'sin(30°) ≈ 0,5', 'x⁴ − 1', 'A(3 \\| 2)', 'a ≠ b', '2 ≤ x ≤ 5',
].map((roh) => ({ datei: 'Prüfstein', roh }));

describe('Schreibweise der Aufgabenfolgen nach LaTeX', () => {
  it('es gibt Prüfsteine', () => {
    expect(ausdruecke.length).toBeGreaterThan(10);
  });

  it('jeder Ausdruck aus dem Bestand geht fehlerfrei durch KaTeX', () => {
    const kaputt: string[] = [];
    for (const { datei, roh } of ausdruecke) {
      try {
        katex.renderToString(alsLatex(roh), { throwOnError: true });
      } catch (e) {
        kaputt.push(`${datei}: „${roh}“ → ${alsLatex(roh)} — ${String(e).slice(0, 80)}`);
      }
    }
    expect(kaputt.slice(0, 8)).toEqual([]);
  });

  it('kein Schrägstrich-Bruch und keine hochgestellte Ziffer überleben', () => {
    const reste: string[] = [];
    for (const { datei, roh } of ausdruecke) {
      const l = alsLatex(roh);
      if (/[²³⁴⁵⁶]/.test(l)) reste.push(`${datei}: ² blieb stehen in „${l}“`);
      if (/\d\/\d/.test(l)) reste.push(`${datei}: Schrägstrich-Bruch blieb stehen in „${l}“`);
      if (/√/.test(l)) reste.push(`${datei}: Wurzelzeichen blieb stehen in „${l}“`);
    }
    expect(reste.slice(0, 8)).toEqual([]);
  });

  it('setzt Brüche, Potenzen und Wurzeln richtig', () => {
    expect(alsLatex('5/6 + 7/10')).toBe('\\frac{5}{6} + \\frac{7}{10}');
    expect(alsLatex('(x + 3)²')).toBe('(x + 3)^{2}');
    expect(alsLatex('(3x)/(5x)')).toBe('\\frac{3x}{5x}');
    expect(alsLatex('√50 = 5√2')).toBe('\\sqrt{50} = 5\\sqrt{2}');
    expect(alsLatex('0,75')).toBe('0{,}75');
    expect(alsLatex('75 %')).toBe('75 \\,\\%');
  });

  it('lässt in Ruhe, was keine Mathematik ist', () => {
    expect(zelleAlsLatex('Rechnerisch drei Lösungen')).toBe('Rechnerisch drei Lösungen');
  });

  it('mischt Text und Formel, wenn beides in einer Zelle steht', () => {
    expect(zelleAlsLatex('zuerst `3/4`, dann weiter')).toBe('zuerst $\\frac{3}{4}$, dann weiter');
  });
});
