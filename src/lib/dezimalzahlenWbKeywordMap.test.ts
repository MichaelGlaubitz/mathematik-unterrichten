import { describe, expect, it } from 'vitest';
import {
  DZ_WB_STICHWORT_TO_IDS,
  DZ_WB_UNTERTHEMA_STICHWORTE,
  expandDzWbStichworte,
  stichwortLabelsFromDzSessionRaw,
} from './dezimalzahlenWbKeywordMap';

describe('dezimalzahlenWbKeywordMap', () => {
  it('deckt alle Stichwörter aus den vier Unterthemen-Clustern ab', () => {
    const fromBloecke = DZ_WB_UNTERTHEMA_STICHWORTE.flat();
    const fromMap = Object.keys(DZ_WB_STICHWORT_TO_IDS);
    expect(fromMap.sort()).toEqual(fromBloecke.sort());
  });

  it('jedes Stichwort ist genau einem Generator-Typ zugeordnet', () => {
    for (const ids of Object.values(DZ_WB_STICHWORT_TO_IDS)) {
      expect(ids.length).toBe(1);
    }
  });

  it('expandDzWbStichworte liefert dz_-IDs', () => {
    const ids = expandDzWbStichworte(['Dezimalzahl · einstellig', 'Zehntel · Zehntel']);
    expect(ids.sort()).toEqual(['dz_mul_d_int', 'dz_mul_tt'].sort());
  });

  it('stichwortLabelsFromDzSessionRaw erkennt Roh-IDs', () => {
    const labels = stichwortLabelsFromDzSessionRaw(['dz_add_1_1', 'dz_mul_tt']);
    expect(labels).toContain('Addition: je eine Nachkommastelle');
    expect(labels).toContain('Zehntel · Zehntel');
  });
});
