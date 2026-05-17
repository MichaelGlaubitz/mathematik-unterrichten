import { describe, it, expect } from 'vitest';
import {
  ALGEBRA_BRUCH_THEMA_TO_BRUCH_STICHWORTE,
  ALG_WB_ALGEBRA_BRUCH_CLUSTER_INDEX,
  algebraThemaStichworteToBruchSessionKeywords,
  assertAlgebraBruchRoutingKonsistent,
  selectedAlgebraStichworteRoutenZuBruchrechnung,
} from './algebraBruchThemaRouting';
import { ALG_WB_UNTERTHEMA_STICHWORTE } from './algebraWbKeywordMap';

describe('algebraBruchThemaRouting', () => {
  it('Map und Ziele sind konsistent mit den Themen-JSONs', () => {
    expect(() => assertAlgebraBruchRoutingKonsistent()).not.toThrow();
  });

  it('deckt alle Stichworte des Blocks „Algebraische Brüche“ ab', () => {
    const block = ALG_WB_UNTERTHEMA_STICHWORTE[ALG_WB_ALGEBRA_BRUCH_CLUSTER_INDEX];
    const keys = new Set(Object.keys(ALGEBRA_BRUCH_THEMA_TO_BRUCH_STICHWORTE));
    for (const p of block) {
      expect(keys.has(p), `Fehlender Routing-Eintrag: ${p}`).toBe(true);
    }
    expect(keys.size).toBe(block.length);
  });

  it('routet nur reinen Bruch-Block zur Bruch-MU', () => {
    expect(
      selectedAlgebraStichworteRoutenZuBruchrechnung([
        'Algebraische Brüche subtrahieren (ganzzahlige Nenner)',
      ])
    ).toBe(true);
    expect(
      selectedAlgebraStichworteRoutenZuBruchrechnung([
        'Algebraische Brüche subtrahieren (ganzzahlige Nenner)',
        'Faktorisieren mit gemeinsamem Zahlfaktor',
      ])
    ).toBe(false);
    expect(selectedAlgebraStichworteRoutenZuBruchrechnung([])).toBe(false);
  });

  it('mappt Subtraktion ganzzahliger Nenner auf Bruch-Subtraktion (WB-Stichwort)', () => {
    const kw = algebraThemaStichworteToBruchSessionKeywords([
      'Algebraische Brüche subtrahieren (ganzzahlige Nenner)',
    ]);
    expect(kw).toEqual(['Subtraktion ungleichnamiger Brüche']);
  });

  it('vereinigt mehrere Bruch-Operationen deterministisch', () => {
    const kw = algebraThemaStichworteToBruchSessionKeywords([
      'Algebraische Brüche addieren (ganzzahlige Nenner)',
      'Algebraische Brüche subtrahieren (ganzzahlige Nenner)',
    ]);
    expect(kw).toEqual(['Addition ungleichnamiger Brüche', 'Subtraktion ungleichnamiger Brüche']);
  });
});
