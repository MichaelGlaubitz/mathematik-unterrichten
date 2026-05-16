import { describe, it, expect } from 'vitest';
import { BRUCH_WB_STICHWORT_TO_IDS, expandBruchWbStichworte, stichworteFuerBruchIds } from './bruchrechnungWbKeywordMap';

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
});
