/**
 * Stichwörter aus `src/content/themen/bruchrechnung.json` (Felder `punkte`)
 * → Generator-IDs für die Massenübung WB Bruchrechnung.
 */
export const BRUCH_WB_STOR_KEY = 'mu_bruch_wb_keywords';

export const BRUCH_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Addition gleichnamiger Brüche': ['br_add_like'],
  'Subtraktion gleichnamiger Brüche': ['br_sub_like'],
  'Addition ungleichnamiger Brüche': ['br_add_unlike'],
  'Subtraktion ungleichnamiger Brüche': ['br_sub_unlike'],
  'Brüche multiplizieren': ['br_mul_frac'],
  'Brüche dividieren (Kehrwert)': ['br_div_frac'],
  'Ganze Zahl mal Bruch': ['br_int_mul_frac'],
  'Bruch durch ganze Zahl': ['br_frac_div_int'],
  'Ganze Zahl durch Bruch': ['br_int_div_frac'],
  'Kürzen / vollständig kürzen': ['br_kuerzen'],
  'Erweitern auf vorgegebenen Nenner': ['br_erweitern'],
  'Gleichwertige (äquivalente) Brüche': ['br_gleichwert_zaehler'],
  'Ergänzen auf 1 (Komplemente)': ['br_ergaenze_auf_1'],
  'Unechter Bruch → gemischte Zahl': ['br_improper_gemischt'],
  'Gemischte Zahl → uneigentlicher Bruch': ['br_gemischt_improper'],
  'Größenvergleich zweier Brüche': ['br_vergleich'],
  'Stammbruchteil einer Größe': ['br_ant_stammbruch'],
  'Anteil mit beliebigem Bruch': ['br_ant_bruchteil'],
  'Umkehraufgabe (Größe aus dem Anteil)': ['br_ant_umkehr'],
};

export function expandBruchWbStichworte(keywords: readonly string[]): string[] {
  const out = new Set<string>();
  for (const k of keywords) {
    const ids = BRUCH_WB_STICHWORT_TO_IDS[k];
    if (ids) for (const id of ids) out.add(id);
  }
  return [...out];
}

/** Zuordnung Generator-ID → zugehörige Stichworte (Mehrfach-Treffer möglich). */
export function stichworteFuerBruchIds(ids: readonly string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    for (const [kw, idList] of Object.entries(BRUCH_WB_STICHWORT_TO_IDS)) {
      if ((idList as readonly string[]).includes(id)) out.add(kw);
    }
  }
  return [...out];
}
