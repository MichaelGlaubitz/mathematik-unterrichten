/**
 * Stichwörter aus `src/content/themen/algebra.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Algebra.
 *
 * **Abdeckung:** Viele Stichworte sind didaktische Wegmarken ohne passenden `alg_*`-Generator
 * (z. B. Begriffe, Substitution, algebraische Brüche, quadratische Ergänzung). Diese erscheinen
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
 * - `alg_gb_term` … `alg_gb_konvention`: Grundbegriffe am Term (Summanden, Gleichung vs. Term, Koeffizient, Variable im Sachsatz, Konstante, Schreibkonvention)
 *
 * Zusätzlich (Mini-Whiteboard / Distributiv mit Zahlen):
 * - `alg_distributiv_zahl` ← „Distributivgesetz mit ganzen Zahlen“ (optional über Session-IDs; im Block „Shedloads“ auch als Stichwort)
 *
 * **Shedloads (Mr Barton-Stil):** Unterthema „Einfache Klammern – Intensivdrill (Shedloads)“ — didaktisch
 * feinere Stichworte mit denselben Generatoren wie „Klammern ausmultiplizieren“ (positiv/negativ/Summe,
 * Minus vor Klammer, Zahl/Variable davor, reine Zahlen, Mix-Capstone).
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
    'Shedloads: $k(ax+b)$ mit $k>0$ (eine einfache Klammer)',
    'Shedloads: $-k(ax+b)$ (negativer ganzzahliger Vorfaktor)',
    'Shedloads: $k_1(\\ldots)+k_2(\\ldots)$ (zwei Klammern addieren/subtrahieren)',
    'Shedloads: Minus vor Klammer im längeren Term und zusammenfassen',
    'Shedloads: Zahl davor – $k(ax+b)$ mit inneren Koeffizienten $\\neq 1$',
    'Shedloads: Variable davor – $kx(ax+b)$',
    'Shedloads: Distributivgesetz nur mit ganzen Zahlen (Flächenbild)',
    'Einfache Klammern – Shedloads-Diagnose-Capstone (Mix)',
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
  'Einfache Klammern – Intensivdrill (Shedloads)',
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
export type AlgWbStichwortClusterPills = { titel: string; stichworte: readonly string[] };

/**
 * Liefert nur Cluster, in denen mindestens ein Stichwort einen Eintrag in {@link ALG_WB_STICHWORT_TO_IDS}
 * hat — für die Pill-Liste auf `/themen#thema-algebra`.
 */
export function algWbStichwortPillsNachCluster(): AlgWbStichwortClusterPills[] {
  const mitUebung = new Set(Object.keys(ALG_WB_STICHWORT_TO_IDS));
  const out: AlgWbStichwortClusterPills[] = [];
  for (let i = 0; i < ALG_WB_CLUSTER_TITEL.length; i++) {
    const kws = ALG_WB_UNTERTHEMA_STICHWORTE[i].filter((k) => mitUebung.has(k));
    if (kws.length === 0) continue;
    out.push({ titel: ALG_WB_CLUSTER_TITEL[i], stichworte: sortAlgAbStichworte([...kws]) });
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
  'Was ist ein Term?': ['alg_gb_term'],
  'Was ist ein Koeffizient?': ['alg_gb_koeff'],
  'Was ist eine Variable?': ['alg_gb_variable'],
  'Was ist eine Konstante?': ['alg_gb_konstante'],
  'Konventionen der algebraischen Schreibweise': ['alg_gb_konvention'],
  'Shedloads: $k(ax+b)$ mit $k>0$ (eine einfache Klammer)': ['alg_klammer_mal'],
  'Shedloads: $-k(ax+b)$ (negativer ganzzahliger Vorfaktor)': ['alg_klammer_neg_int'],
  'Shedloads: $k_1(\\ldots)+k_2(\\ldots)$ (zwei Klammern addieren/subtrahieren)': ['alg_klammer_summe'],
  'Shedloads: Minus vor Klammer im längeren Term und zusammenfassen': ['alg_minus_klammer_plus'],
  'Shedloads: Zahl davor – $k(ax+b)$ mit inneren Koeffizienten $\\neq 1$': ['alg_expand_einfach_zahl'],
  'Shedloads: Variable davor – $kx(ax+b)$': ['alg_expand_einfach_var'],
  'Shedloads: Distributivgesetz nur mit ganzen Zahlen (Flächenbild)': ['alg_distributiv_zahl'],
  'Einfache Klammern – Shedloads-Diagnose-Capstone (Mix)': [
    'alg_klammer_mal',
    'alg_klammer_neg_int',
    'alg_klammer_summe',
    'alg_minus_klammer_plus',
    'alg_expand_einfach_zahl',
    'alg_expand_einfach_var',
    'alg_distributiv_zahl',
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
  'alg_ausklammern_alg',
  'alg_ausklammern_klammer',
  'alg_ausklammern_gruppe',
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
