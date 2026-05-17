/**
 * Stichwörter aus `src/content/themen/algebra.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Algebra.
 */
export const ALG_WB_STOR_KEY = 'mu_algebra_wb_keywords';

/** Stichwörter pro Unterthemen-Block, Reihenfolge wie in `algebra.json`. */
export const ALG_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  ['Distributivgesetz mit ganzen Zahlen'],
  ['Zahl vor Klammer ausmultiplizieren'],
  ['Minus vor der Klammer mit Summanden', 'Klammer nach Subtraktionszeichen'],
  ['Gleichartige Terme zusammenfassen', 'Gemeinsamen Faktor ausklammern'],
];

export const ALG_WB_CLUSTER_TITEL: readonly string[] = [
  'Distributivgesetz und Zahlenstruktur',
  'Ausmultiplizieren vor der Klammer',
  'Vorzeichen und Klammern',
  'Terme ordnen und faktorisieren',
];

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

export const ALG_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Distributivgesetz mit ganzen Zahlen': ['alg_distributiv_zahl'],
  'Zahl vor Klammer ausmultiplizieren': ['alg_klammer_mal'],
  'Minus vor der Klammer mit Summanden': ['alg_minus_klammer_plus'],
  'Klammer nach Subtraktionszeichen': ['alg_klammer_weg'],
  'Gleichartige Terme zusammenfassen': ['alg_terme_zusammen'],
  'Gemeinsamen Faktor ausklammern': ['alg_ausklammern'],
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
