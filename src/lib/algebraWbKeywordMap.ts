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
 * Aktuell gemappt (bestehende Generatoren `alg_*`):
 * - `alg_terme_zusammen`: gleichartige Terme zusammenfassen (Varianten)
 * - `alg_klammer_mal`: einfache Klammer mit positivem ganzzahligen Vorfaktor / mehrere solcher Schritte (vereinfacht)
 * - `alg_expand_einfach_var`: einfache Klammer mit algebraischem Vorfaktor $kx$ vor der Klammer
 * - `alg_expand_*`: gestuftes Ausmultiplizieren (einfach, Binome, Faktor davor, drei Klammern)
 * - `alg_ausklammern`: Faktorisieren mit gemeinsamem Zahl-, algebraischen oder Klammerfaktor / vorgehendes Ausklammern
 * - `alg_gb_term` … `alg_gb_konvention`: Grundbegriffe am Term (Summanden, Gleichung vs. Term, Koeffizient, Variable im Sachsatz, Konstante, Schreibkonvention)
 *
 * Zusätzlich (Mini-Whiteboard / Distributiv mit Zahlen):
 * - `alg_distributiv_zahl` ← „Distributivgesetz mit ganzen Zahlen“ (nicht in den JSON-Punkten; optional über Session-IDs)
 *
 * Arbeitsblatt „Überprüfen“: bei `alg_ausklammern` wird nur der gemeinsame Faktor geprüft.
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
  'Grundbegriffe am Term',
  'Terme aus Sprache; Substitution',
  'Gleichartige Terme; Potenzen & Äquivalenz',
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

/**
 * Nur Stichworte mit echten `alg_*`-Aufgaben. Mehrere Stichworte dürfen dieselbe ID teilen
 * (gleicher Übungstyp, andere didaktische Einordnung).
 */
export const ALG_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Gleichartige Terme zusammenfassen (gleiche Variable)': ['alg_terme_zusammen'],
  'Gleichartige Terme zusammenfassen (mehrere Variablen)': ['alg_terme_zusammen'],
  'Gleichartige Terme zusammenfassen (mit Indizes)': ['alg_terme_zusammen'],
  'Algebraische Terme multiplizieren (ohne Potenzgesetze)': ['alg_klammer_mal'],
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
  'Einfache Klammer ausmultiplizieren (negativer ganzzahliger Vorfaktor)': ['alg_minus_klammer_plus'],
  'Mehrere einfache Klammern ausmultiplizieren und vereinfachen': ['alg_klammer_mal'],
  'Faktorisieren mit gemeinsamem Zahlfaktor': ['alg_ausklammern'],
  'Faktorisieren mit gemeinsamem algebraischen Faktor': ['alg_ausklammern'],
  'Faktorisieren mit vorgehendem Ausklammern': ['alg_ausklammern'],
  'Faktorisieren mit gemeinsamem Klammerfaktor': ['alg_ausklammern'],
  'Was ist ein Term?': ['alg_gb_term'],
  'Was ist ein Koeffizient?': ['alg_gb_koeff'],
  'Was ist eine Variable?': ['alg_gb_variable'],
  'Was ist eine Konstante?': ['alg_gb_konstante'],
  'Konventionen der algebraischen Schreibweise': ['alg_gb_konvention'],
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
  'alg_klammer_mal',
  'alg_minus_klammer_plus',
  'alg_klammer_weg',
  'alg_expand_einfach_zahl',
  'alg_expand_einfach_var',
  'alg_expand_binom_both1',
  'alg_expand_binom_one_non1',
  'alg_expand_binom_both_non1',
  'alg_expand_triple_konstant',
  'alg_expand_triple_var',
  'alg_expand_triple_klammern',
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
