import { describe, it, expect } from 'vitest';
import {
  ALG_WB_STICHWORT_TO_IDS,
  ALG_WB_UNTERTHEMA_STICHWORTE,
  algebraPdfEinspaltigAusSession,
  algStichwortClusterIndex,
  algWbAlleStichworteFlach,
  algWbStichwortPillsNachCluster,
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

  it('algWbStichwortPillsNachCluster: alle Map-Stichworte, nach Cluster gruppiert', () => {
    const clusters = algWbStichwortPillsNachCluster();
    expect(clusters.length).toBeGreaterThan(0);
    const alleMitUebung = new Set(
      clusters.flatMap((c) => c.stichworte.filter((s) => s.hatUebung).map((s) => s.name))
    );
    expect(alleMitUebung.size).toBe(Object.keys(ALG_WB_STICHWORT_TO_IDS).length);
    for (const k of Object.keys(ALG_WB_STICHWORT_TO_IDS)) {
      expect(alleMitUebung.has(k)).toBe(true);
    }
    for (const c of clusters) {
      expect(c.titel.length).toBeGreaterThan(2);
      expect(c.stichworte.length).toBeGreaterThan(0);
    }
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
      'alg_klammer_neg_int',
      'alg_klammer_summe',
      'alg_ausklammern',
      'alg_ausklammern_alg',
      'alg_ausklammern_klammer',
      'alg_ausklammern_gruppe',
      'alg_klammer_weg',
      'alg_terme_zusammen',
      'alg_terme_mult',
      'alg_terme_zusammen_mv',
      'alg_terme_zusammen_idx',
      'alg_distributiv_zahl',
      'alg_expand_einfach_zahl',
      'alg_expand_einfach_var',
      'alg_expand_binom_both1',
      'alg_expand_binom_one_non1',
      'alg_expand_binom_both_non1',
      'alg_expand_triple_konstant',
      'alg_expand_triple_var',
      'alg_expand_triple_klammern',
      'alg_qe_monisch_b_gerade',
      'alg_qe_monisch_b_ungerade',
      'alg_qe_nicht_monisch_a_pos',
      'alg_qe_nicht_monisch_a_neg',
      'alg_gb_term',
      'alg_gb_koeff',
      'alg_gb_variable',
      'alg_gb_konstante',
      'alg_gb_konvention',
      'alg_factor_pairs',
      'alg_factor_monic_pos',
      'alg_factor_monic_neg',
      'alg_factor_monic_perfect',
      'alg_factor_non_monic_pos',
      'alg_factor_non_monic_neg',
      'alg_factor_non_monic_perfect',
      'alg_factor_diff_basic',
      'alg_factor_diff_advanced',
      'alg_factor_neg_leading',
      'alg_factor_grouping',
      'alg_factor_two_variables',
      'alg_factor_repeated_squares',
      'alg_factor_diff_binoms',
      'alg_factor_capstone',
      'alg_concept_type',
      'alg_lang_one_op',
      'alg_lang_multi_op',
      'alg_lang_indices',
      'alg_subst_pos_simple',
      'alg_subst_pos_pow',
      'alg_subst_pos_mv',
      'alg_subst_neg_simple',
      'alg_subst_neg_pow',
      'alg_subst_decimal_simple',
      'alg_subst_decimal_pow',
      'alg_subst_fraction_simple',
      'alg_subst_fraction_pow',
      'alg_terms_like_recognize',
      'alg_terms_mult_pow',
      'alg_terms_div_simple',
      'alg_terms_div_pow',
      'alg_terms_raise_pow',
      'alg_terms_simplify_multi',
      'alg_terms_equiv_recognize',
      'alg_frac_def_domain',
      'alg_frac_simplify_none',
      'alg_frac_simplify_linear',
      'alg_frac_simplify_monic',
      'alg_frac_simplify_non_monic',
      'alg_frac_mul_none',
      'alg_frac_mul_linear',
      'alg_frac_mul_monic',
      'alg_frac_mul_non_monic',
      'alg_frac_div_none',
      'alg_frac_div_linear',
      'alg_frac_div_monic',
      'alg_frac_div_non_monic',
      'alg_frac_add_int',
      'alg_frac_add_simple',
      'alg_frac_add_linear',
      'alg_frac_add_fact',
      'alg_frac_sub_int',
      'alg_frac_sub_simple',
      'alg_frac_sub_linear',
      'alg_frac_sub_fact',
      'alg_frac_four_ops_mix',
      'alg_expand_einfach_capstone',
      'alg_expand_binom_double_pos',
      'alg_expand_binom_double_neg',
      'alg_expand_binom_perfect',
      'alg_expand_binom_non_monic',
      'alg_expand_binom_non_monic_neg',
      'alg_expand_binom_mix_simplify',
      'alg_expand_triple_monic',
      'alg_expand_triple_non_monic',
      'alg_expand_triple_quad_linear',
      'alg_expand_cube',
      'alg_expand_capstone',
    ]);
    for (const ids of Object.values(ALG_WB_STICHWORT_TO_IDS)) {
      for (const id of ids) {
        expect(allowed.has(id)).toBe(true);
      }
    }
  });

  it('jedes UI-Stichwort hat einen Generator (vollstaendige Abdeckung)', () => {
    const flat = algWbAlleStichworteFlach();
    const mapped = new Set(Object.keys(ALG_WB_STICHWORT_TO_IDS));
    expect(mapped.size).toBe(flat.length);
  });
});
