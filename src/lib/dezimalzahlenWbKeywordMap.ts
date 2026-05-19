/**
 * Stichwörter aus `src/content/themen/dezimalzahlen.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Dezimalzahlen.
 */
export const DZ_WB_STOR_KEY = 'mu_dz_wb_keywords';

/** Stichwörter pro Unterthemen-Block, Reihenfolge wie in `dezimalzahlen.json`. */
export const DZ_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  [
    'Addition: je eine Nachkommastelle',
    'Addition: je zwei Nachkommastellen',
    'Addition: gemischte Nachkommastellen',
  ],
  [
    'Subtraktion: je eine Nachkommastelle',
    'Subtraktion: je zwei Nachkommastellen',
    'Subtraktion: gemischte Nachkommastellen',
  ],
  ['Dezimalzahl · einstellig', 'Zehntel · Zehntel', 'Dezimalzahl · Dezimalzahl', '· mit 0,1 oder 0,01'],
  [
    'Dezimalzahl : einstellig',
    'Ganzzahl : Zehntel',
    'Dezimalzahl : Zehntel',
    'Dezimalzahl : Dezimalzahl',
    ': durch 0,1 oder 0,01',
  ],
];

export const DZ_WB_CLUSTER_TITEL: readonly string[] = [
  'Addition',
  'Subtraktion',
  'Multiplikation',
  'Division',
];

export function dzStichwortClusterIndex(stichwort: string): number {
  for (let i = 0; i < DZ_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (DZ_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

/** Sortiert nach Unterthemen-Reihenfolge, innerhalb eines Blocks alphabetisch (de). */
export function sortDzAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = dzStichwortClusterIndex(a);
    const ib = dzStichwortClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

export const DZ_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Addition: je eine Nachkommastelle': ['dz_add_1_1'],
  'Addition: je zwei Nachkommastellen': ['dz_add_2_2'],
  'Addition: gemischte Nachkommastellen': ['dz_add_mix'],
  'Subtraktion: je eine Nachkommastelle': ['dz_sub_1_1'],
  'Subtraktion: je zwei Nachkommastellen': ['dz_sub_2_2'],
  'Subtraktion: gemischte Nachkommastellen': ['dz_sub_mix'],
  'Dezimalzahl · einstellig': ['dz_mul_d_int'],
  'Zehntel · Zehntel': ['dz_mul_tt'],
  'Dezimalzahl · Dezimalzahl': ['dz_mul_dd'],
  '· mit 0,1 oder 0,01': ['dz_mul_scale'],
  'Dezimalzahl : einstellig': ['dz_div_d_int'],
  'Ganzzahl : Zehntel': ['dz_div_int_t'],
  'Dezimalzahl : Zehntel': ['dz_div_d_t'],
  'Dezimalzahl : Dezimalzahl': ['dz_div_dd'],
  ': durch 0,1 oder 0,01': ['dz_div_scale'],
};

export function expandDzWbStichworte(keywords: readonly string[]): string[] {
  const out = new Set<string>();
  for (const k of keywords) {
    const ids = DZ_WB_STICHWORT_TO_IDS[k];
    if (ids) for (const id of ids) out.add(id);
  }
  return [...out];
}

export function stichworteFuerDzIds(ids: readonly string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    for (const [kw, idList] of Object.entries(DZ_WB_STICHWORT_TO_IDS)) {
      if ((idList as readonly string[]).includes(id)) out.add(kw);
    }
  }
  return [...out];
}

export function clusterTitelZeileFuerDzGeneratorIds(ids: readonly string[]): string {
  const idx = new Set<number>();
  for (const id of ids) {
    for (const kw of stichworteFuerDzIds([id])) {
      const c = dzStichwortClusterIndex(kw);
      if (c >= 0 && c < DZ_WB_CLUSTER_TITEL.length) idx.add(c);
    }
  }
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => DZ_WB_CLUSTER_TITEL[i])
    .filter(Boolean)
    .join(' · ');
}

export function stichwortLabelsFromDzSessionRaw(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string' && raw[0].startsWith('dz_')) {
    const ids = raw.filter((x): x is string => typeof x === 'string');
    return sortDzAbStichworte([...new Set(stichworteFuerDzIds(ids))]);
  }
  const kw = raw.filter((x): x is string => typeof x === 'string');
  return sortDzAbStichworte([...new Set(kw)]);
}
