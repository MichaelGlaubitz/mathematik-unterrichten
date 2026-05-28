/**
 * Stichwörter aus `src/content/themen/prozentrechnung.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Prozentrechnung.
 */
export const PR_WB_STOR_KEY = 'mu_pr_wb_keywords';

/** Stichwörter pro Unterthemen-Block, Reihenfolge wie in `prozentrechnung.json`. */
export const PR_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  [
    'Prozentwert bestimmen',
    'Prozentsatz bestimmen',
    'Grundwert bestimmen'
  ],
  [
    'Prozentuale Zunahme',
    'Prozentuale Abnahme',
    'Vermehrungsfaktor bestimmen'
  ],
  [
    'Ausgangswert nach Zunahme',
    'Ausgangswert nach Abnahme'
  ]
];

export const PR_WB_CLUSTER_TITEL: readonly string[] = [
  'Grundaufgaben der Prozentrechnung',
  'Prozentuale Veränderung',
  'Umkehrungen bei Veränderung'
];

export function prLabelClusterIndex(stichwort: string): number {
  for (let i = 0; i < PR_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (PR_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

/** Sortiert nach Unterthemen-Reihenfolge, innerhalb eines Blocks alphabetisch (de). */
export function sortPrAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = prLabelClusterIndex(a);
    const ib = prLabelClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

export const PR_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Prozentwert bestimmen': ['pr_prozentwert'],
  'Prozentsatz bestimmen': ['pr_prozentsatz'],
  'Grundwert bestimmen': ['pr_grundwert'],
  'Prozentuale Zunahme': ['pr_erhoehter_wert'],
  'Prozentuale Abnahme': ['pr_reduzierter_preis'],
  'Vermehrungsfaktor bestimmen': ['pr_vermehrungsfaktor'],
  'Ausgangswert nach Zunahme': ['pr_ausgangswert_nach_erhoehung'],
  'Ausgangswert nach Abnahme': ['pr_ausgangswert_nach_senkung']
};

export function expandPrWbStichworte(keywords: readonly string[]): string[] {
  const out = new Set<string>();
  for (const k of keywords) {
    const ids = PR_WB_STICHWORT_TO_IDS[k];
    if (ids) for (const id of ids) out.add(id);
  }
  return [...out];
}

export function stichworteFuerPrIds(ids: readonly string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    for (const [kw, idList] of Object.entries(PR_WB_STICHWORT_TO_IDS)) {
      if ((idList as readonly string[]).includes(id)) out.add(kw);
    }
  }
  return [...out];
}

export function clusterTitelZeileFuerPrGeneratorIds(ids: readonly string[]): string {
  const idx = new Set<number>();
  for (const id of ids) {
    for (const kw of stichworteFuerPrIds([id])) {
      const c = prLabelClusterIndex(kw);
      if (c >= 0 && c < PR_WB_CLUSTER_TITEL.length) idx.add(c);
    }
  }
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => PR_WB_CLUSTER_TITEL[i])
    .filter(Boolean)
    .join(' · ');
}

export function stichwortLabelsFromPrSessionRaw(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string' && raw[0].startsWith('pr_')) {
    const ids = raw.filter((x): x is string => typeof x === 'string');
    return sortPrAbStichworte([...new Set(stichworteFuerPrIds(ids))]);
  }
  const kw = raw.filter((x): x is string => typeof x === 'string');
  return sortPrAbStichworte([...new Set(kw)]);
}
