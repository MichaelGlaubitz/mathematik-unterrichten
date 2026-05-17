import { describe, it, expect } from 'vitest';
import {
  ALG_WB_STICHWORT_TO_IDS,
  ALG_WB_UNTERTHEMA_STICHWORTE,
  expandAlgWbStichworte,
  algStichwortClusterIndex,
  clusterTitelZeileFuerAlgGeneratorIds,
  sortAlgAbStichworte,
  stichwortLabelsFromAlgSessionRaw,
  stichworteFuerAlgIds,
} from './algebraWbKeywordMap';

describe('algebraWbKeywordMap', () => {
  it('deckt alle Stichwörter aus algebra.json (unterthemenBloecke) ab', () => {
    const flat = ALG_WB_UNTERTHEMA_STICHWORTE.flat();
    const keys = Object.keys(ALG_WB_STICHWORT_TO_IDS);
    expect(keys.length).toBe(flat.length);
    for (const p of flat) {
      expect(keys).toContain(p);
      expect(ALG_WB_STICHWORT_TO_IDS[p]?.length).toBeGreaterThan(0);
    }
  });

  it('expandAlgWbStichworte und stichworteFuerAlgIds sind kompatibel', () => {
    const kw = ['Distributivgesetz mit ganzen Zahlen', 'Zahl vor Klammer ausmultiplizieren'];
    const ids = expandAlgWbStichworte(kw);
    expect(ids).toContain('alg_distributiv_zahl');
    expect(ids).toContain('alg_klammer_mal');
    const zurück = stichworteFuerAlgIds(ids);
    expect(zurück).toEqual(expect.arrayContaining(kw));
  });

  it('jedes Stichwort ist genau einem Unterthemen-Cluster zugeordnet', () => {
    for (const k of Object.keys(ALG_WB_STICHWORT_TO_IDS)) {
      expect(algStichwortClusterIndex(k)).toBeGreaterThanOrEqual(0);
    }
  });

  it('sortAlgAbStichworte gruppiert nach Cluster, dann Alphabet', () => {
    const unsorted = [
      'Gemeinsamen Faktor ausklammern',
      'Distributivgesetz mit ganzen Zahlen',
      'Minus vor der Klammer mit Summanden',
    ];
    expect(sortAlgAbStichworte(unsorted)).toEqual([
      'Distributivgesetz mit ganzen Zahlen',
      'Minus vor der Klammer mit Summanden',
      'Gemeinsamen Faktor ausklammern',
    ]);
  });

  it('clusterTitelZeileFuerAlgGeneratorIds sammelt Cluster-Titel', () => {
    const line = clusterTitelZeileFuerAlgGeneratorIds(['alg_distributiv_zahl', 'alg_klammer_mal']);
    expect(line).toContain('Distributivgesetz');
    expect(line).toContain('Ausmultiplizieren');
  });

  it('stichwortLabelsFromAlgSessionRaw liest Stichwort- oder ID-Listen', () => {
    expect(stichwortLabelsFromAlgSessionRaw(['alg_terme_zusammen'])).toContain('Gleichartige Terme zusammenfassen');
    expect(stichwortLabelsFromAlgSessionRaw(['Gleichartige Terme zusammenfassen'])).toEqual([
      'Gleichartige Terme zusammenfassen',
    ]);
  });

  it('mappt nur auf die sechs Algebra-Generator-IDs aus Phase 1', () => {
    const allowed = new Set([
      'alg_klammer_mal',
      'alg_minus_klammer_plus',
      'alg_ausklammern',
      'alg_klammer_weg',
      'alg_terme_zusammen',
      'alg_distributiv_zahl',
    ]);
    for (const ids of Object.values(ALG_WB_STICHWORT_TO_IDS)) {
      for (const id of ids) {
        expect(allowed.has(id)).toBe(true);
      }
    }
  });
});
