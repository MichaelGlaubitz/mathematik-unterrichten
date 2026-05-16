import { describe, it, expect } from 'vitest';
import {
  BRUCH_WB_STICHWORT_TO_IDS,
  bruchStichwortClusterIndex,
  expandBruchWbStichworte,
  sortBruchAbStichworte,
  stichworteFuerBruchIds,
} from './bruchrechnungWbKeywordMap';

describe('bruchrechnungWbKeywordMap', () => {
  it('deckt alle Stichwörter aus bruchrechnung.json ab', () => {
    const keys = Object.keys(BRUCH_WB_STICHWORT_TO_IDS);
    expect(keys).toContain('Addition gleichnamiger Brüche');
    expect(keys).toContain('Größenvergleich zweier Brüche');
    expect(keys.length).toBeGreaterThanOrEqual(19);
  });

  it('expandBruchWbStichworte und stichworteFuerBruchIds sind kompatibel', () => {
    const kw = ['Addition gleichnamiger Brüche', 'Brüche multiplizieren'];
    const ids = expandBruchWbStichworte(kw);
    expect(ids).toContain('br_add_like');
    expect(ids).toContain('br_mul_frac');
    const zurück = stichworteFuerBruchIds(ids);
    expect(zurück).toEqual(expect.arrayContaining(kw));
  });

  it('jedes Stichwort ist genau einem Unterthemen-Cluster zugeordnet', () => {
    for (const k of Object.keys(BRUCH_WB_STICHWORT_TO_IDS)) {
      expect(bruchStichwortClusterIndex(k)).toBeGreaterThanOrEqual(0);
    }
  });

  it('sortBruchAbStichworte gruppiert nach Cluster, dann Alphabet', () => {
    const unsorted = ['Brüche multiplizieren', 'Ganze Zahl mal Bruch', 'Kürzen / vollständig kürzen'];
    expect(sortBruchAbStichworte(unsorted)).toEqual([
      'Ganze Zahl mal Bruch',
      'Kürzen / vollständig kürzen',
      'Brüche multiplizieren',
    ]);
  });
});
