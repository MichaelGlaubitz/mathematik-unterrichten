/**
 * Stichwörter aus `src/content/themen/lineare-gleichungen.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Lineare Gleichungen.
 */
export const LG_WB_STOR_KEY = 'mu_lg_wb_keywords';

/** Stichwörter pro Unterthemen-Block, Reihenfolge wie in `lineare-gleichungen.json`. */
export const LG_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  [
    'Einschrittige Gleichungen (Addition und Subtraktion)',
    'Einschrittige Gleichungen (Multiplikation und Division)',
    'Einschrittige Gleichungen (Diagnose-Abschluss)'
  ],
  [
    'Zweischrittige Gleichungen',
    'Gleichungen mit Variablen auf beiden Seiten (ohne Klammern)',
    'Gleichungen mit Klammern',
    'Gleichungen mit Bruchtermen'
  ]
];

export const LG_WB_CLUSTER_TITEL: readonly string[] = [
  'Einschrittige Gleichungen',
  'Mehrschrittige Gleichungen'
];

export function lgStichwortClusterIndex(stichwort: string): number {
  for (let i = 0; i < LG_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (LG_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

/** Sortiert nach Unterthemen-Reihenfolge, innerhalb eines Blocks alphabetisch (de). */
export function sortLgAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = lgStichwortClusterIndex(a);
    const ib = lgStichwortClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

export const LG_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Einschrittige Gleichungen (Addition und Subtraktion)': ['lg_one_step_add_sub'],
  'Einschrittige Gleichungen (Multiplikation und Division)': ['lg_one_step_mul_div'],
  'Einschrittige Gleichungen (Diagnose-Abschluss)': ['lg_one_step_capstone'],
  'Zweischrittige Gleichungen': ['lg_two_step'],
  'Gleichungen mit Variablen auf beiden Seiten (ohne Klammern)': ['lg_both_sides'],
  'Gleichungen mit Klammern': ['lg_klammer_linear'],
  'Gleichungen mit Bruchtermen': ['lg_bruch_linear']
};

export function expandLgWbStichworte(keywords: readonly string[]): string[] {
  const out = new Set<string>();
  for (const k of keywords) {
    const ids = LG_WB_STICHWORT_TO_IDS[k];
    if (ids) for (const id of ids) out.add(id);
  }
  return [...out];
}

export function stichworteFuerLgIds(ids: readonly string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    for (const [kw, idList] of Object.entries(LG_WB_STICHWORT_TO_IDS)) {
      if ((idList as readonly string[]).includes(id)) out.add(kw);
    }
  }
  return [...out];
}

export function clusterTitelZeileFuerLgGeneratorIds(ids: readonly string[]): string {
  const idx = new Set<number>();
  for (const id of ids) {
    for (const kw of stichworteFuerLgIds([id])) {
      const c = lgStichwortClusterIndex(kw);
      if (c >= 0 && c < LG_WB_CLUSTER_TITEL.length) idx.add(c);
    }
  }
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => LG_WB_CLUSTER_TITEL[i])
    .filter(Boolean)
    .join(' · ');
}

export function stichwortLabelsFromLgSessionRaw(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string' && raw[0].startsWith('lg_')) {
    const ids = raw.filter((x): x is string => typeof x === 'string');
    return sortLgAbStichworte([...new Set(stichworteFuerLgIds(ids))]);
  }
  const kw = raw.filter((x): x is string => typeof x === 'string');
  return sortLgAbStichworte([...new Set(kw)]);
}
