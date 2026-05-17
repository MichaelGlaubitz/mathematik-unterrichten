/**
 * Stichwörter aus `src/content/themen/negative-zahlen.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Negative Zahlen.
 */
export const NZ_WB_STOR_KEY = 'mu_nz_wb_keywords';

/** Stichwörter pro Unterthemen-Block, Reihenfolge wie in `negative-zahlen.json`. */
export const NZ_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  ['Größenvergleich ganzer Zahlen', 'Summe ganzer Zahlen', 'Differenz ganzer Zahlen'],
  ['Produkt ganzer Zahlen', 'Quotient ganzer Zahlen'],
  ['Minus vor der Klammer; Punkt vor Strich'],
];

export const NZ_WB_CLUSTER_TITEL: readonly string[] = [
  'Vorstellung am Zahlenstrahl',
  'Vorzeichenregeln bei Mal und Geteilt',
  'Klammern und Termordnung',
];

export function nzStichwortClusterIndex(stichwort: string): number {
  for (let i = 0; i < NZ_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (NZ_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

/** Sortiert nach Unterthemen-Reihenfolge, innerhalb eines Blocks alphabetisch (de). */
export function sortNzAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = nzStichwortClusterIndex(a);
    const ib = nzStichwortClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

export const NZ_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Größenvergleich ganzer Zahlen': ['nz_vergleich'],
  'Summe ganzer Zahlen': ['nz_add'],
  'Differenz ganzer Zahlen': ['nz_sub'],
  'Produkt ganzer Zahlen': ['nz_mul'],
  'Quotient ganzer Zahlen': ['nz_div'],
  'Minus vor der Klammer; Punkt vor Strich': ['nz_klammer_punkt_vor_strich'],
};

export function expandNzWbStichworte(keywords: readonly string[]): string[] {
  const out = new Set<string>();
  for (const k of keywords) {
    const ids = NZ_WB_STICHWORT_TO_IDS[k];
    if (ids) for (const id of ids) out.add(id);
  }
  return [...out];
}

export function stichworteFuerNzIds(ids: readonly string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    for (const [kw, idList] of Object.entries(NZ_WB_STICHWORT_TO_IDS)) {
      if ((idList as readonly string[]).includes(id)) out.add(kw);
    }
  }
  return [...out];
}

export function clusterTitelZeileFuerNzGeneratorIds(ids: readonly string[]): string {
  const idx = new Set<number>();
  for (const id of ids) {
    for (const kw of stichworteFuerNzIds([id])) {
      const c = nzStichwortClusterIndex(kw);
      if (c >= 0 && c < NZ_WB_CLUSTER_TITEL.length) idx.add(c);
    }
  }
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => NZ_WB_CLUSTER_TITEL[i])
    .filter(Boolean)
    .join(' · ');
}

export function stichwortLabelsFromNzSessionRaw(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string' && raw[0].startsWith('nz_')) {
    const ids = raw.filter((x): x is string => typeof x === 'string');
    return sortNzAbStichworte([...new Set(stichworteFuerNzIds(ids))]);
  }
  const kw = raw.filter((x): x is string => typeof x === 'string');
  return sortNzAbStichworte([...new Set(kw)]);
}
