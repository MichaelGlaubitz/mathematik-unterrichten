/**
 * Stichwörter aus `src/content/themen/algebra.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Algebra.
 *
 * **Abdeckung:** Viele Stichworte sind didaktische Wegmarken ohne passenden `alg_*`-Generator
 * (z. B. Begriffe, Substitution, algebraische Brüche). Diese erscheinen
 * in der Oberfläche, haben aber **keinen** Eintrag in `ALG_WB_STICHWORT_TO_IDS` — sie erzeugen
 * beim Üben **keine** stillen Fallback-Aufgaben (siehe `readAlgebraTypenFromStorage` in
 * `MassenuebungGeo.astro`).
 *
 * Aktuell gemappt (Auswahl `alg_*`):
 * - `alg_terme_zusammen` / `alg_terme_zusammen_mv` / `alg_terme_zusammen_idx`: gleichartige Terme (eine / zwei Variablen / Indizes)
 * - `alg_terme_mult`: Monome multiplizieren (ohne Potenzgesetze)
 * - `alg_klammer_mal`, `alg_klammer_neg_int`, `alg_klammer_summe`: Klammern ausmultiplizieren (positiver / negativer ganzzahliger Vorfaktor / Summe einfacher Klammern)
 * - `alg_minus_klammer_plus`: Minus vor Klammer in längerem Term
 * - `alg_expand_einfach_zahl` / `alg_expand_einfach_var`, `alg_expand_binom_*`, `alg_expand_triple_*`: gestuftes Ausmultiplizieren (einfache Klammer mit Zahl bzw. algebraischem Vorfaktor $kx$, Binome, Faktor davor, drei Klammern)
 * - `alg_ausklammern`, `alg_ausklammern_alg`, `alg_ausklammern_klammer`, `alg_ausklammern_gruppe`: Faktorisieren (gemeinsamer Zahlfaktor; algebraischer Faktor; gemeinsamer Klammerausdruck; Zusammenfassen und vollständig ausklammern)
 * - `alg_qe_monisch_b_gerade` / `alg_qe_monisch_b_ungerade` / `alg_qe_nicht_monisch_a_pos` / `alg_qe_nicht_monisch_a_neg`: quadratische Ergänzung (monisch $b$ gerade/ungerade; nicht-monisch $a>0$ / $a<0$)
 * - `alg_gb_term` … `alg_gb_konvention`: Grundbegriffe am Term (Summanden, Gleichung vs. Term, Koeffizient, Variable im Sachsatz, Konstante, Schreibkonvention)
 *
 * Zusätzlich (Mini-Whiteboard / Distributiv mit Zahlen):
 * - `alg_distributiv_zahl` ← „Distributivgesetz mit ganzen Zahlen“ (nicht in den JSON-Punkten; optional über Session-IDs)
 *
 * Arbeitsblatt „Überprüfen“: bei `alg_ausklammern` und den verwandten Faktorisierungs-Generatoren werden die Zahl-Lücken geprüft.
 */
export const ALG_WB_STOR_KEY = 'mu_algebra_wb_keywords';

/** Alias gemäß Projektbenennung „Algebra …“. */
export const ALGEBRA_WB_STOR_KEY = ALG_WB_STOR_KEY;

/** Stichwörter pro Unterthemen-Block, Reihenfolge wie in `algebra.json`. */
export const ALG_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  [
    'Was ist ein Ausdruck?',
    'Was ist eine Gleichung?',
    'Was ist eine Formel?',
    'Was ist eine Identität?',
    'Ausdruck, Gleichung, Formel oder Identität? — kombinierte Zuordnung',
  ],
  [
    'Was ist ein Term?',
    'Was ist ein Koeffizient?',
    'Was ist eine Variable?',
    'Was ist eine Konstante?',
    'Konventionen der algebraischen Schreibweise',
  ],
  [
    'Ausdrücke aus dem Sachwort schreiben (eine Operation)',
    'Ausdrücke aus dem Sachwort schreiben (mehrere Operationen)',
    'Ausdrücke mit Indizes schreiben',
    'Positive ganze Zahlen in Ausdrücke einsetzen (eine Variable, ohne Potenzen)',
    'Positive ganze Zahlen in Ausdrücke einsetzen (eine Variable, mit Potenzen)',
    'Positive ganze Zahlen in Ausdrücke einsetzen (mehrere Variablen)',
    'Negative Zahlen in Ausdrücke einsetzen (ohne Potenzen)',
    'Negative Zahlen in Ausdrücke einsetzen (mit Potenzen)',
    'Dezimalzahlen in Ausdrücke einsetzen (ohne Potenzen)',
    'Dezimalzahlen in Ausdrücke einsetzen (mit Potenzen)',
    'Brüche in Ausdrücke einsetzen (ohne Potenzen)',
    'Brüche in Ausdrücke einsetzen (mit Potenzen)',
  ],
  [
    'Gleichartige Terme erkennen',
    'Gleichartige Terme zusammenfassen (gleiche Variable)',
    'Gleichartige Terme zusammenfassen (mehrere Variablen)',
    'Gleichartige Terme zusammenfassen (mit Indizes)',
    'Algebraische Terme multiplizieren (ohne Potenzgesetze)',
    'Algebraische Terme multiplizieren (mit Potenzgesetzen)',
    'Algebraische Terme dividieren (ohne Potenzgesetze)',
    'Algebraische Terme dividieren (mit Potenzgesetzen)',
    'Einen algebraischen Term potenzieren',
    'Algebraische Ausdrücke mit mehreren Potenzgesetzen vereinfachen',
    'Äquivalente Ausdrücke erkennen',
  ],
  [
    'Algebraische Brüche',
    'Algebraische Brüche vereinfachen (ohne Faktorisieren)',
    'Algebraische Brüche vereinfachen (lineare Faktorisierung)',
    'Algebraische Brüche vereinfachen (monische quadratische Faktorisierung)',
    'Algebraische Brüche vereinfachen (nicht-monische quadratische Faktorisierung)',
    'Algebraische Brüche multiplizieren (ohne vorgehendes Faktorisieren)',
    'Algebraische Brüche multiplizieren (mit linearer Faktorisierung)',
    'Algebraische Brüche multiplizieren (mit monischer quadratischer Faktorisierung)',
    'Algebraische Brüche multiplizieren (mit nicht-monischer quadratischer Faktorisierung)',
    'Algebraische Brüche dividieren (ohne vorgehendes Faktorisieren)',
    'Algebraische Brüche dividieren (mit linearer Faktorisierung)',
    'Algebraische Brüche dividieren (mit monischer quadratischer Faktorisierung)',
    'Algebraische Brüche dividieren (mit nicht-monischer quadratischer Faktorisierung)',
    'Algebraische Brüche addieren (ganzzahlige Nenner)',
    'Algebraische Brüche addieren (algebraische einfache Nenner)',
    'Algebraische Brüche addieren (lineare algebraische Nenner)',
    'Algebraische Brüche addieren (mit vorgehendem Faktorisieren)',
    'Algebraische Brüche subtrahieren (ganzzahlige Nenner)',
    'Algebraische Brüche subtrahieren (algebraische einfache Nenner)',
    'Algebraische Brüche subtrahieren (lineare algebraische Nenner)',
    'Algebraische Brüche subtrahieren (mit vorgehendem Faktorisieren)',
    'Die vier Grundrechenarten mit algebraischen Brüchen',
  ],
  [
    'Einfache Klammer ausmultiplizieren (positiver ganzzahliger Vorfaktor)',
    'Einfache Klammer ausmultiplizieren (negativer ganzzahliger Vorfaktor)',
    'Einfache Klammer ausmultiplizieren (algebraischer Vorfaktor)',
    'Mehrere einfache Klammern ausmultiplizieren und vereinfachen',
    'Einfache Klammern — Diagnose-Capstone',
    'Doppelklammer ausmultiplizieren (überall positiv)',
    'Doppelklammer ausmultiplizieren (mit negativen Summanden)',
    'Doppelklammer ausmultiplizieren (Quadrieren einer Klammer)',
    'Doppelklammer ausmultiplizieren (nicht-monisch)',
    'Doppelklammer ausmultiplizieren (nicht-monisch mit negativen Summanden)',
    'Mehrere Doppelklammer-Ausdrücke ausmultiplizieren und vereinfachen',
    'Dreifache Klammer ausmultiplizieren (monisch)',
    'Dreifache Klammer ausmultiplizieren (nicht-monisch)',
    'Dreifache Klammer ausmultiplizieren (Quadrat × linear)',
    'Eine Klammer dritt potenzieren',
    'Klammern ausmultiplizieren — Progressions-Capstone',
    'Einfache Klammer: Zahl davor',
    'Einfache Klammer: Variable davor',
    'Doppelklammer: beide Leitkoeffizienten 1',
    'Doppelklammer: genau ein Leitkoeffizient ungleich 1',
    'Doppelklammer: beide Leitkoeffizienten ungleich 1',
    'Faktor vor Doppelklammer: Konstante davor',
    'Faktor vor Doppelklammer: Variable davor',
    'Dreifache Klammern',
  ],
  [
    'Faktorisieren mit gemeinsamem Zahlfaktor',
    'Faktorisieren mit gemeinsamem algebraischen Faktor',
    'Faktorpaare finden, die zu c multiplizieren und zu b addieren',
    'Monische quadratische Ausdrücke faktorisieren (alle Koeffizienten positiv)',
    'Monische quadratische Ausdrücke faktorisieren (mit negativen Summanden)',
    'Monische perfekte quadratische Trinome faktorisieren',
    'Nicht-monische quadratische Ausdrücke faktorisieren (alle Koeffizienten positiv)',
    'Nicht-monische quadratische Ausdrücke faktorisieren (mit negativen Summanden)',
    'Nicht-monische perfekte quadratische Trinome faktorisieren',
    'Differenz von Quadraten (einfach)',
    'Differenz von Quadraten (nicht-monisch / mehrere Variablen)',
    'Faktorisieren mit vorgehendem Ausklammern',
    'Faktorisieren mit negativem Leitkoeffizienten',
    'Faktorisieren mit gemeinsamem Klammerfaktor',
    'Faktorisieren durch Gruppieren (vier Summanden)',
    'Quadratische Ausdrücke in zwei Variablen faktorisieren',
    'Faktorisieren mit wiederholter Differenz von Quadraten (bis Quartik)',
    'Differenz quadrierter Binome faktorisieren',
    'Faktorisieren — Diagnose-Capstone',
  ],
  [
    'Quadratische Ergänzung (monisch, b gerade)',
    'Quadratische Ergänzung (monisch, b ungerade)',
    'Quadratische Ergänzung (nicht-monisch, a positiv)',
    'Quadratische Ergänzung (nicht-monisch, a negativ)',
    'Quadratische Ergänzung — Diagnose-Capstone',
  ],
];

export const ALG_WB_CLUSTER_TITEL: readonly string[] = [
  'Ausdruck, Gleichung, Formel, Identität',
  'Grundbegriffe',
  'Terme aus Sprache; Substitution',
  'Gleichartige Terme',
  'Algebraische Brüche',
  'Klammern ausmultiplizieren',
  'Faktorisieren',
  'Quadratische Ergänzung',
];

export function algWbAlleStichworteFlach(): string[] {
  return ALG_WB_UNTERTHEMA_STICHWORTE.flat();
}

export function algStichwortClusterIndex(stichwort: string): number {
  for (let i = 0; i < ALG_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (ALG_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

/** Sortiert nach Unterthemen-Reihenfolge, innerhalb eines Blocks alphabetisch (de). */
export function sortAlgAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = algStichwortClusterIndex(a);
    const ib = algStichwortClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

/** WB-Algebra Themenseite: Stichwort-Pills nach Unterthemen-Cluster (wie `algebra.json`). */
export type AlgWbStichwortPill = { name: string; hatUebung: boolean };
export type AlgWbStichwortClusterPills = { titel: string; stichworte: readonly AlgWbStichwortPill[] };

/**
 * Liefert alle Cluster und deren Stichworte — für die Pill-Liste auf `/themen#thema-algebra`.
 * Markiert Stichwörter, für die bereits ein Übungs-Generator existiert, mit hatUebung = true.
 */
export function algWbStichwortPillsNachCluster(): AlgWbStichwortClusterPills[] {
  const mitUebung = new Set(Object.keys(ALG_WB_STICHWORT_TO_IDS));
  const out: AlgWbStichwortClusterPills[] = [];
  for (let i = 0; i < ALG_WB_CLUSTER_TITEL.length; i++) {
    const kws = ALG_WB_UNTERTHEMA_STICHWORTE[i].map((k) => ({
      name: k,
      hatUebung: mitUebung.has(k),
    }));
    out.push({ titel: ALG_WB_CLUSTER_TITEL[i], stichworte: kws });
  }
  return out;
}

/**
 * Nur Stichworte mit echten `alg_*`-Aufgaben. Mehrere Stichworte dürfen dieselbe ID teilen
 * (gleicher Übungstyp, andere didaktische Einordnung).
 */
export const ALG_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Gleichartige Terme zusammenfassen (gleiche Variable)': ['alg_terme_zusammen'],
  'Gleichartige Terme zusammenfassen (mehrere Variablen)': ['alg_terme_zusammen_mv'],
  'Gleichartige Terme zusammenfassen (mit Indizes)': ['alg_terme_zusammen_idx'],
  'Algebraische Terme multiplizieren (ohne Potenzgesetze)': ['alg_terme_mult'],
  'Einfache Klammer ausmultiplizieren (positiver ganzzahliger Vorfaktor)': ['alg_klammer_mal'],
  'Einfache Klammer ausmultiplizieren (algebraischer Vorfaktor)': ['alg_expand_einfach_var'],
  'Einfache Klammer: Zahl davor': ['alg_expand_einfach_zahl'],
  'Einfache Klammer: Variable davor': ['alg_expand_einfach_var'],
  'Doppelklammer: beide Leitkoeffizienten 1': ['alg_expand_binom_both1'],
  'Doppelklammer: genau ein Leitkoeffizient ungleich 1': ['alg_expand_binom_one_non1'],
  'Doppelklammer: beide Leitkoeffizienten ungleich 1': ['alg_expand_binom_both_non1'],
  'Faktor vor Doppelklammer: Konstante davor': ['alg_expand_triple_konstant'],
  'Faktor vor Doppelklammer: Variable davor': ['alg_expand_triple_var'],
  'Dreifache Klammern': ['alg_expand_triple_klammern'],
  'Einfache Klammer ausmultiplizieren (negativer ganzzahliger Vorfaktor)': ['alg_klammer_neg_int'],
  'Mehrere einfache Klammern ausmultiplizieren und vereinfachen': ['alg_klammer_summe'],
  'Faktorisieren mit gemeinsamem Zahlfaktor': ['alg_ausklammern'],
  'Faktorisieren mit gemeinsamem algebraischen Faktor': ['alg_ausklammern_alg'],
  'Faktorisieren mit vorgehendem Ausklammern': ['alg_ausklammern_gruppe'],
  'Faktorisieren mit gemeinsamem Klammerfaktor': ['alg_ausklammern_klammer'],
  'Faktorpaare finden, die zu c multiplizieren und zu b addieren': ['alg_factor_pairs'],
  'Monische quadratische Ausdrücke faktorisieren (alle Koeffizienten positiv)': ['alg_factor_monic_pos'],
  'Monische quadratische Ausdrücke faktorisieren (mit negativen Summanden)': ['alg_factor_monic_neg'],
  'Monische perfekte quadratische Trinome faktorisieren': ['alg_factor_monic_perfect'],
  'Nicht-monische quadratische Ausdrücke faktorisieren (alle Koeffizienten positiv)': ['alg_factor_non_monic_pos'],
  'Nicht-monische quadratische Ausdrücke faktorisieren (mit negativen Summanden)': ['alg_factor_non_monic_neg'],
  'Nicht-monische perfekte quadratische Trinome faktorisieren': ['alg_factor_non_monic_perfect'],
  'Differenz von Quadraten (einfach)': ['alg_factor_diff_basic'],
  'Differenz von Quadraten (nicht-monisch / mehrere Variablen)': ['alg_factor_diff_advanced'],
  'Faktorisieren mit negativem Leitkoeffizienten': ['alg_factor_neg_leading'],
  'Faktorisieren durch Gruppieren (vier Summanden)': ['alg_factor_grouping'],
  'Quadratische Ausdrücke in zwei Variablen faktorisieren': ['alg_factor_two_variables'],
  'Faktorisieren mit wiederholter Differenz von Quadraten (bis Quartik)': ['alg_factor_repeated_squares'],
  'Differenz quadrierter Binome faktorisieren': ['alg_factor_diff_binoms'],
  'Faktorisieren — Diagnose-Capstone': ['alg_factor_capstone'],
  'Was ist ein Ausdruck?': ['alg_concept_type'],
  'Was ist eine Gleichung?': ['alg_concept_type'],
  'Was ist eine Formel?': ['alg_concept_type'],
  'Was ist eine Identität?': ['alg_concept_type'],
  'Ausdruck, Gleichung, Formel oder Identität? — kombinierte Zuordnung': ['alg_concept_type'],
  'Ausdrücke aus dem Sachwort schreiben (eine Operation)': ['alg_lang_one_op'],
  'Ausdrücke aus dem Sachwort schreiben (mehrere Operationen)': ['alg_lang_multi_op'],
  'Ausdrücke mit Indizes schreiben': ['alg_lang_indices'],
  'Positive ganze Zahlen in Ausdrücke einsetzen (eine Variable, ohne Potenzen)': ['alg_subst_pos_simple'],
  'Positive ganze Zahlen in Ausdrücke einsetzen (eine Variable, mit Potenzen)': ['alg_subst_pos_pow'],
  'Positive ganze Zahlen in Ausdrücke einsetzen (mehrere Variablen)': ['alg_subst_pos_mv'],
  'Negative Zahlen in Ausdrücke einsetzen (ohne Potenzen)': ['alg_subst_neg_simple'],
  'Negative Zahlen in Ausdrücke einsetzen (mit Potenzen)': ['alg_subst_neg_pow'],
  'Dezimalzahlen in Ausdrücke einsetzen (ohne Potenzen)': ['alg_subst_decimal_simple'],
  'Dezimalzahlen in Ausdrücke einsetzen (mit Potenzen)': ['alg_subst_decimal_pow'],
  'Brüche in Ausdrücke einsetzen (ohne Potenzen)': ['alg_subst_fraction_simple'],
  'Brüche in Ausdrücke einsetzen (mit Potenzen)': ['alg_subst_fraction_pow'],
  'Gleichartige Terme erkennen': ['alg_terms_like_recognize'],
  'Algebraische Terme multiplizieren (mit Potenzgesetzen)': ['alg_terms_mult_pow'],
  'Algebraische Terme dividieren (ohne Potenzgesetze)': ['alg_terms_div_simple'],
  'Algebraische Terme dividieren (mit Potenzgesetzen)': ['alg_terms_div_pow'],
  'Einen algebraischen Term potenzieren': ['alg_terms_raise_pow'],
  'Algebraische Ausdrücke mit mehreren Potenzgesetzen vereinfachen': ['alg_terms_simplify_multi'],
  'Äquivalente Ausdrücke erkennen': ['alg_terms_equiv_recognize'],
  'Algebraische Brüche': ['alg_frac_def_domain'],
  'Algebraische Brüche vereinfachen (ohne Faktorisieren)': ['alg_frac_simplify_none'],
  'Algebraische Brüche vereinfachen (lineare Faktorisierung)': ['alg_frac_simplify_linear'],
  'Algebraische Brüche vereinfachen (monische quadratische Faktorisierung)': ['alg_frac_simplify_monic'],
  'Algebraische Brüche vereinfachen (nicht-monische quadratische Faktorisierung)': ['alg_frac_simplify_non_monic'],
  'Algebraische Brüche multiplizieren (ohne vorgehendes Faktorisieren)': ['alg_frac_mul_none'],
  'Algebraische Brüche multiplizieren (mit linearer Faktorisierung)': ['alg_frac_mul_linear'],
  'Algebraische Brüche multiplizieren (mit monischer quadratischer Faktorisierung)': ['alg_frac_mul_monic'],
  'Algebraische Brüche multiplizieren (mit nicht-monischer quadratischer Faktorisierung)': ['alg_frac_mul_non_monic'],
  'Algebraische Brüche dividieren (ohne vorgehendes Faktorisieren)': ['alg_frac_div_none'],
  'Algebraische Brüche dividieren (mit linearer Faktorisierung)': ['alg_frac_div_linear'],
  'Algebraische Brüche dividieren (mit monischer quadratischer Faktorisierung)': ['alg_frac_div_monic'],
  'Algebraische Brüche dividieren (mit nicht-monischer quadratischer Faktorisierung)': ['alg_frac_div_non_monic'],
  'Algebraische Brüche addieren (ganzzahlige Nenner)': ['alg_frac_add_int'],
  'Algebraische Brüche addieren (algebraische einfache Nenner)': ['alg_frac_add_simple'],
  'Algebraische Brüche addieren (lineare algebraische Nenner)': ['alg_frac_add_linear'],
  'Algebraische Brüche addieren (mit vorgehendem Faktorisieren)': ['alg_frac_add_fact'],
  'Algebraische Brüche subtrahieren (ganzzahlige Nenner)': ['alg_frac_sub_int'],
  'Algebraische Brüche subtrahieren (algebraische einfache Nenner)': ['alg_frac_sub_simple'],
  'Algebraische Brüche subtrahieren (lineare algebraische Nenner)': ['alg_frac_sub_linear'],
  'Algebraische Brüche subtrahieren (mit vorgehendem Faktorisieren)': ['alg_frac_sub_fact'],
  'Die vier Grundrechenarten mit algebraischen Brüchen': ['alg_frac_four_ops_mix'],
  'Einfache Klammern — Diagnose-Capstone': ['alg_expand_einfach_capstone'],
  'Doppelklammer ausmultiplizieren (überall positiv)': ['alg_expand_binom_double_pos'],
  'Doppelklammer ausmultiplizieren (mit negativen Summanden)': ['alg_expand_binom_double_neg'],
  'Doppelklammer ausmultiplizieren (Quadrieren einer Klammer)': ['alg_expand_binom_perfect'],
  'Doppelklammer ausmultiplizieren (nicht-monisch)': ['alg_expand_binom_non_monic'],
  'Doppelklammer ausmultiplizieren (nicht-monisch mit negativen Summanden)': ['alg_expand_binom_non_monic_neg'],
  'Mehrere Doppelklammer-Ausdrücke ausmultiplizieren und vereinfachen': ['alg_expand_binom_mix_simplify'],
  'Dreifache Klammer ausmultiplizieren (monisch)': ['alg_expand_triple_monic'],
  'Dreifache Klammer ausmultiplizieren (nicht-monisch)': ['alg_expand_triple_non_monic'],
  'Dreifache Klammer ausmultiplizieren (Quadrat × linear)': ['alg_expand_triple_quad_linear'],
  'Eine Klammer dritt potenzieren': ['alg_expand_cube'],
  'Klammern ausmultiplizieren — Progressions-Capstone': ['alg_expand_capstone'],
  'Was ist ein Term?': ['alg_gb_term'],
  'Was ist ein Koeffizient?': ['alg_gb_koeff'],
  'Was ist eine Variable?': ['alg_gb_variable'],
  'Was ist eine Konstante?': ['alg_gb_konstante'],
  'Konventionen der algebraischen Schreibweise': ['alg_gb_konvention'],
  'Quadratische Ergänzung (monisch, b gerade)': ['alg_qe_monisch_b_gerade'],
  'Quadratische Ergänzung (monisch, b ungerade)': ['alg_qe_monisch_b_ungerade'],
  'Quadratische Ergänzung (nicht-monisch, a positiv)': ['alg_qe_nicht_monisch_a_pos'],
  'Quadratische Ergänzung (nicht-monisch, a negativ)': ['alg_qe_nicht_monisch_a_neg'],
  'Quadratische Ergänzung — Diagnose-Capstone': [
    'alg_qe_monisch_b_gerade',
    'alg_qe_monisch_b_ungerade',
    'alg_qe_nicht_monisch_a_pos',
    'alg_qe_nicht_monisch_a_neg',
  ],
};

export function expandAlgWbStichworte(keywords: readonly string[]): string[] {
  const out = new Set<string>();
  for (const k of keywords) {
    const ids = ALG_WB_STICHWORT_TO_IDS[k];
    if (ids) for (const id of ids) out.add(id);
  }
  return [...out];
}

export function stichworteFuerAlgIds(ids: readonly string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    for (const [kw, idList] of Object.entries(ALG_WB_STICHWORT_TO_IDS)) {
      if ((idList as readonly string[]).includes(id)) out.add(kw);
    }
  }
  return [...out];
}

export function clusterTitelZeileFuerAlgGeneratorIds(ids: readonly string[]): string {
  const idx = new Set<number>();
  for (const id of ids) {
    for (const kw of stichworteFuerAlgIds([id])) {
      const c = algStichwortClusterIndex(kw);
      if (c >= 0 && c < ALG_WB_CLUSTER_TITEL.length) idx.add(c);
    }
  }
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => ALG_WB_CLUSTER_TITEL[i])
    .filter(Boolean)
    .join(' · ');
}

export function stichwortLabelsFromAlgSessionRaw(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string' && raw[0].startsWith('alg_')) {
    const ids = raw.filter((x): x is string => typeof x === 'string');
    return sortAlgAbStichworte([...new Set(stichworteFuerAlgIds(ids))]);
  }
  const kw = raw.filter((x): x is string => typeof x === 'string');
  return sortAlgAbStichworte([...new Set(kw)]);
}

/**
 * Generator-IDs mit horizontaler Slot-/Schreibzeile im PDF, die einspaltig `multicols` brauchen
 * (siehe `PracticeAufgabe.pdfArbeitsblattEinzelspalte` in `uebungPracticeGenerators.ts`).
 */
export const ALG_GENERATOR_IDS_PDF_EINSPALTIG: ReadonlySet<string> = new Set([
  'alg_terme_zusammen',
  'alg_terme_zusammen_mv',
  'alg_terme_zusammen_idx',
  'alg_terme_mult',
  'alg_klammer_mal',
  'alg_minus_klammer_plus',
  'alg_klammer_neg_int',
  'alg_klammer_summe',
  'alg_klammer_weg',
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
  'alg_ausklammern_alg',
  'alg_ausklammern_klammer',
  'alg_ausklammern_gruppe',
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

/**
 * True, wenn die aktuelle Algebra-Session (Stichworte von der Themenseite und/oder gewählte
 * `alg_*`-Typen auf der Übungsseite) mindestens einen Typ aus {@link ALG_GENERATOR_IDS_PDF_EINSPALTIG}
 * enthält — dann soll das PDF (Arbeitsblatt und Lösungs-PDF) einspaltig sein.
 *
 * Hinweis: Die PDF-Pipeline setzt für `meta.thema === 'Algebra'` ohnehin immer `multicols{1}`.
 * Diese Funktion bleibt für UI-Logik, Tests und künftige Erweiterungen nützlich.
 */
export function algebraPdfEinspaltigAusSession(opts: {
  stichwortLabels: readonly string[];
  aktiveGeneratorIds: readonly string[];
}): boolean {
  for (const id of opts.aktiveGeneratorIds) {
    if (ALG_GENERATOR_IDS_PDF_EINSPALTIG.has(id)) return true;
  }
  for (const label of opts.stichwortLabels) {
    const ids = ALG_WB_STICHWORT_TO_IDS[label];
    if (ids?.some((id) => ALG_GENERATOR_IDS_PDF_EINSPALTIG.has(id))) return true;
  }
  return false;
}
