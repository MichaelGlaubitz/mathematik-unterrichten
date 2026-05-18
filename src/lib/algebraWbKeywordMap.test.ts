import { describe, it, expect } from 'vitest';
import {
  ALG_WB_STICHWORT_TO_IDS,
  ALG_WB_UNTERTHEMA_STICHWORTE,
  algebraPdfEinspaltigAusSession,
  algStichwortClusterIndex,
  algWbAlleStichworteFlach,
  clusterTitelZeileFuerAlgGeneratorIds,
  expandAlgWbStichworte,
  sortAlgAbStichworte,
  stichwortLabelsFromAlgSessionRaw,
  stichworteFuerAlgIds,
} from './algebraWbKeywordMap';

describe('algebraWbKeywordMap', () => {
  it('algebraPdfEinspaltigAusSession: Stichwort oder Generator-ID', () => {
    expect(
      algebraPdfEinspaltigAusSession({
        stichwortLabels: ['Gleichartige Terme zusammenfassen (gleiche Variable)'],
        aktiveGeneratorIds: [],
      })
    ).toBe(true);
    expect(
      algebraPdfEinspaltigAusSession({
        stichwortLabels: [],
        aktiveGeneratorIds: ['alg_klammer_weg'],
      })
    ).toBe(true);
    expect(
      algebraPdfEinspaltigAusSession({
        stichwortLabels: ['Faktorisieren mit gemeinsamem Zahlfaktor'],
        aktiveGeneratorIds: [],
      })
    ).toBe(false);
    expect(
      algebraPdfEinspaltigAusSession({
        stichwortLabels: [],
        aktiveGeneratorIds: ['alg_gb_term'],
      })
    ).toBe(false);
  });

  it('jedes Stichwort aus algebra.json liegt in genau einem Cluster', () => {
    const flat = algWbAlleStichworteFlach();
    expect(flat.length).toBe(ALG_WB_UNTERTHEMA_STICHWORTE.flat().length);
    for (const p of flat) {
      expect(algStichwortClusterIndex(p)).toBeGreaterThanOrEqual(0);
    }
  });

  it('jeder Map-Key ist ein gültiges Stichwort aus den Blöcken', () => {
    const flat = new Set(algWbAlleStichworteFlach());
    for (const k of Object.keys(ALG_WB_STICHWORT_TO_IDS)) {
      expect(flat.has(k)).toBe(true);
    }
  });

  it('expandAlgWbStichworte und stichworteFuerAlgIds sind kompatibel', () => {
    const kw = [
      'Gleichartige Terme zusammenfassen (gleiche Variable)',
      'Einfache Klammer ausmultiplizieren (positiver ganzzahliger Vorfaktor)',
    ];
    const ids = expandAlgWbStichworte(kw);
    expect(ids).toContain('alg_terme_zusammen');
    expect(ids).toContain('alg_klammer_mal');
    const zurück = stichworteFuerAlgIds(ids);
    expect(zurück).toEqual(expect.arrayContaining(kw));
  });

  it('jedes gemappte Stichwort hat einen Cluster', () => {
    for (const k of Object.keys(ALG_WB_STICHWORT_TO_IDS)) {
      expect(algStichwortClusterIndex(k)).toBeGreaterThanOrEqual(0);
    }
  });

  it('sortAlgAbStichworte gruppiert nach Cluster, dann Alphabet', () => {
    const unsorted = [
      'Faktorisieren mit gemeinsamem Zahlfaktor',
      'Gleichartige Terme zusammenfassen (gleiche Variable)',
      'Einfache Klammer ausmultiplizieren (positiver ganzzahliger Vorfaktor)',
    ];
    expect(sortAlgAbStichworte(unsorted)).toEqual([
      'Gleichartige Terme zusammenfassen (gleiche Variable)',
      'Einfache Klammer ausmultiplizieren (positiver ganzzahliger Vorfaktor)',
      'Faktorisieren mit gemeinsamem Zahlfaktor',
    ]);
  });

  it('clusterTitelZeileFuerAlgGeneratorIds sammelt Cluster-Titel', () => {
    const line = clusterTitelZeileFuerAlgGeneratorIds(['alg_terme_zusammen', 'alg_klammer_mal']);
    expect(line).toContain('Gleichartige');
    expect(line).toContain('Klammern');
  });

  it('stichwortLabelsFromAlgSessionRaw liest Stichwort- oder ID-Listen', () => {
    expect(stichwortLabelsFromAlgSessionRaw(['alg_terme_zusammen'])).toContain(
      'Gleichartige Terme zusammenfassen (gleiche Variable)'
    );
    expect(stichwortLabelsFromAlgSessionRaw(['Gleichartige Terme zusammenfassen (gleiche Variable)'])).toEqual([
      'Gleichartige Terme zusammenfassen (gleiche Variable)',
    ]);
  });

  it('mappt nur auf die WB-Algebra-Generator-IDs', () => {
    const allowed = new Set([
      'alg_klammer_mal',
      'alg_minus_klammer_plus',
      'alg_ausklammern',
      'alg_klammer_weg',
      'alg_terme_zusammen',
      'alg_distributiv_zahl',
      'alg_expand_einfach_zahl',
      'alg_expand_einfach_var',
      'alg_expand_binom_both1',
      'alg_expand_binom_one_non1',
      'alg_expand_binom_both_non1',
      'alg_expand_triple_konstant',
      'alg_expand_triple_var',
      'alg_expand_triple_klammern',
      'alg_gb_term',
      'alg_gb_koeff',
      'alg_gb_variable',
      'alg_gb_konstante',
      'alg_gb_konvention',
    ]);
    for (const ids of Object.values(ALG_WB_STICHWORT_TO_IDS)) {
      for (const id of ids) {
        expect(allowed.has(id)).toBe(true);
      }
    }
  });

  it('nicht jedes UI-Stichwort hat einen Generator (bewusste Lücke)', () => {
    const flat = algWbAlleStichworteFlach();
    const mapped = new Set(Object.keys(ALG_WB_STICHWORT_TO_IDS));
    expect(mapped.size).toBeLessThan(flat.length);
  });
});
