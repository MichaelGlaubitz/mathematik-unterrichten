import { describe, it, expect } from 'vitest';
import {
  LG_WB_STICHWORT_TO_IDS,
  expandLgWbStichworte,
  lgStichwortClusterIndex,
  clusterTitelZeileFuerLgGeneratorIds,
  sortLgAbStichworte,
  stichwortLabelsFromLgSessionRaw,
  stichworteFuerLgIds,
} from './lineareGleichungenWbKeywordMap';

describe('lineareGleichungenWbKeywordMap', () => {
  it('deckt alle Stichwörter ab', () => {
    const keys = Object.keys(LG_WB_STICHWORT_TO_IDS);
    expect(keys).toContain('Einschrittige Gleichungen (Addition und Subtraktion)');
    expect(keys).toContain('Zweischrittige Gleichungen');
    expect(keys.length).toBe(7);
  });

  it('expandLgWbStichworte und stichworteFuerLgIds sind kompatibel', () => {
    const kw = ['Einschrittige Gleichungen (Addition und Subtraktion)', 'Zweischrittige Gleichungen'];
    const ids = expandLgWbStichworte(kw);
    expect(ids).toContain('lg_one_step_add_sub');
    expect(ids).toContain('lg_two_step');
    const zurück = stichworteFuerLgIds(ids);
    expect(zurück).toEqual(expect.arrayContaining(kw));
  });

  it('jedes Stichwort ist genau einem Unterthemen-Cluster zugeordnet', () => {
    for (const k of Object.keys(LG_WB_STICHWORT_TO_IDS)) {
      expect(lgStichwortClusterIndex(k)).toBeGreaterThanOrEqual(0);
    }
  });

  it('sortLgAbStichworte gruppiert nach Cluster, dann Alphabet', () => {
    const unsorted = [
      'Zweischrittige Gleichungen',
      'Einschrittige Gleichungen (Multiplikation und Division)',
      'Einschrittige Gleichungen (Addition und Subtraktion)'
    ];
    expect(sortLgAbStichworte(unsorted)).toEqual([
      'Einschrittige Gleichungen (Addition und Subtraktion)',
      'Einschrittige Gleichungen (Multiplikation und Division)',
      'Zweischrittige Gleichungen'
    ]);
  });

  it('clusterTitelZeileFuerLgGeneratorIds sammelt Cluster-Titel', () => {
    const title = clusterTitelZeileFuerLgGeneratorIds(['lg_one_step_add_sub', 'lg_two_step']);
    expect(title).toContain('Einschrittige Gleichungen');
    expect(title).toContain('Mehrschrittige Gleichungen');
  });

  it('stichwortLabelsFromLgSessionRaw liest Stichwort- oder ID-Listen', () => {
    expect(stichwortLabelsFromLgSessionRaw(['lg_one_step_add_sub'])).toContain('Einschrittige Gleichungen (Addition und Subtraktion)');
    expect(stichwortLabelsFromLgSessionRaw(['Zweischrittige Gleichungen'])).toEqual(['Zweischrittige Gleichungen']);
  });
});
