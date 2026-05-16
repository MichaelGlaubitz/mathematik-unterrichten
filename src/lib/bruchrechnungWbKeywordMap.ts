/**
 * Stichwörter aus `src/content/themen/bruchrechnung.json` (Felder `punkte`)
 * → Generator-IDs für die Massenübung WB Bruchrechnung.
 */
export const BRUCH_WB_STOR_KEY = 'mu_bruch_wb_keywords';

/**
 * Stichwörter pro Unterthemen-Block, Reihenfolge wie `unterthemenBloecke`
 * in `src/content/themen/bruchrechnung.json`.
 */
export const BRUCH_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  ['Ganze Zahl mal Bruch', 'Bruch durch ganze Zahl', 'Ganze Zahl durch Bruch'],
  [
    'Kürzen / vollständig kürzen',
    'Erweitern auf vorgegebenen Nenner',
    'Gleichwertige (äquivalente) Brüche',
    'Ergänzen auf 1 (Komplemente)',
    'Unechter Bruch → gemischte Zahl',
    'Gemischte Zahl → uneigentlicher Bruch',
    'Größenvergleich zweier Brüche',
  ],
  ['Stammbruchteil einer Größe', 'Anteil mit beliebigem Bruch', 'Umkehraufgabe (Größe aus dem Anteil)'],
  [
    'Addition gleichnamiger Brüche',
    'Subtraktion gleichnamiger Brüche',
    'Addition ungleichnamiger Brüche',
    'Subtraktion ungleichnamiger Brüche',
    'Brüche multiplizieren',
    'Brüche dividieren (Kehrwert)',
  ],
];

/** Parallele Cluster-Titel wie in `src/content/themen/bruchrechnung.json` (`unterthemenBloecke[].titel`). */
export const BRUCH_WB_CLUSTER_TITEL: readonly string[] = [
  'Brüche und ganze Zahlen',
  'Umgang mit Brüchen',
  'Bruchteile von Größen',
  'Grundrechenarten mit Brüchen',
];

export function bruchStichwortClusterIndex(stichwort: string): number {
  for (let i = 0; i < BRUCH_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (BRUCH_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

/** Sortiert nach Unterthemen-Reihenfolge, innerhalb eines Blocks alphabetisch (de). */
export function sortBruchAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = bruchStichwortClusterIndex(a);
    const ib = bruchStichwortClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

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

/** Cluster-Titel zu den gewählten Generator-IDs (für PDF-Kopfzeile „Unterthema“). */
export function clusterTitelZeileFuerBruchGeneratorIds(ids: readonly string[]): string {
  const idx = new Set<number>();
  for (const id of ids) {
    for (const kw of stichworteFuerBruchIds([id])) {
      const c = bruchStichwortClusterIndex(kw);
      if (c >= 0 && c < BRUCH_WB_CLUSTER_TITEL.length) idx.add(c);
    }
  }
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => BRUCH_WB_CLUSTER_TITEL[i])
    .filter(Boolean)
    .join(' · ');
}

/**
 * Stichwort-Labels wie in der Arbeitsblatt-Kompaktansicht (`readBruchAbStichwortLabels` in MassenuebungGeo).
 * `raw` ist das geparste `sessionStorage`-JSON (`BRUCH_WB_STOR_KEY`).
 */
export function stichwortLabelsFromBruchSessionRaw(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string' && raw[0].startsWith('br_')) {
    const ids = raw.filter((x): x is string => typeof x === 'string');
    return sortBruchAbStichworte([...new Set(stichworteFuerBruchIds(ids))]);
  }
  const kw = raw.filter((x): x is string => typeof x === 'string');
  return sortBruchAbStichworte([...new Set(kw)]);
}
