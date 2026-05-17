import { describe, it, expect } from 'vitest';
import {
  NZ_WB_STICHWORT_TO_IDS,
  expandNzWbStichworte,
  nzStichwortClusterIndex,
  clusterTitelZeileFuerNzGeneratorIds,
  sortNzAbStichworte,
  stichwortLabelsFromNzSessionRaw,
  stichworteFuerNzIds,
} from './negativeZahlenWbKeywordMap';

describe('negativeZahlenWbKeywordMap', () => {
  it('deckt alle Stichwörter aus negative-zahlen.json ab', () => {
    const keys = Object.keys(NZ_WB_STICHWORT_TO_IDS);
    expect(keys).toContain('Summe ganzer Zahlen');
    expect(keys).toContain('Minus vor der Klammer; Punkt vor Strich');
    expect(keys.length).toBe(6);
  });

  it('expandNzWbStichworte und stichworteFuerNzIds sind kompatibel', () => {
    const kw = ['Summe ganzer Zahlen', 'Produkt ganzer Zahlen'];
    const ids = expandNzWbStichworte(kw);
    expect(ids).toContain('nz_add');
    expect(ids).toContain('nz_mul');
    const zurück = stichworteFuerNzIds(ids);
    expect(zurück).toEqual(expect.arrayContaining(kw));
  });

  it('jedes Stichwort ist genau einem Unterthemen-Cluster zugeordnet', () => {
    for (const k of Object.keys(NZ_WB_STICHWORT_TO_IDS)) {
      expect(nzStichwortClusterIndex(k)).toBeGreaterThanOrEqual(0);
    }
  });

  it('sortNzAbStichworte gruppiert nach Cluster, dann Alphabet', () => {
    const unsorted = ['Quotient ganzer Zahlen', 'Summe ganzer Zahlen', 'Größenvergleich ganzer Zahlen'];
    expect(sortNzAbStichworte(unsorted)).toEqual([
      'Größenvergleich ganzer Zahlen',
      'Summe ganzer Zahlen',
      'Quotient ganzer Zahlen',
    ]);
  });

  it('clusterTitelZeileFuerNzGeneratorIds sammelt Cluster-Titel', () => {
    expect(clusterTitelZeileFuerNzGeneratorIds(['nz_add', 'nz_mul'])).toContain('Zahlenstrahl');
    expect(clusterTitelZeileFuerNzGeneratorIds(['nz_add', 'nz_mul'])).toContain('Mal');
  });

  it('stichwortLabelsFromNzSessionRaw liest Stichwort- oder ID-Listen', () => {
    expect(stichwortLabelsFromNzSessionRaw(['nz_add'])).toContain('Summe ganzer Zahlen');
    expect(stichwortLabelsFromNzSessionRaw(['Summe ganzer Zahlen'])).toEqual(['Summe ganzer Zahlen']);
  });
});
