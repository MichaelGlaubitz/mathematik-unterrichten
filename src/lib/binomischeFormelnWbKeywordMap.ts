/**
 * Stichwörter aus `src/content/themen/binomische-formeln.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Binomische Formeln.
 */
export const BF_WB_STOR_KEY = 'mu_bf_wb_keywords';

/** Stichwörter pro Unterthemen-Block, Reihenfolge wie in `binomische-formeln.json`. */
export const BF_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  [
    'Erste binomische Formel anwenden: $(a+b)^2$',
    'Zweite binomische Formel anwenden: $(a-b)^2$',
    'Dritte binomische Formel anwenden: $(a+b)(a-b)$',
    'Binomische Formel mit Vorzahl ausmultiplizieren',
  ],
  [
    'Quadratisches Binom faktorisieren: $(a\\pm b)^2$',
    'Differenz zweier Quadrate faktorisieren: $a^2-b^2$',
  ],
];

export const BF_WB_CLUSTER_TITEL: readonly string[] = [
  'Ausmultiplizieren (Vorwärts)',
  'Faktorisieren (Rückwärts)',
];

export function bfStichwortClusterIndex(stichwort: string): number {
  for (let i = 0; i < BF_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (BF_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

/** Sortiert nach Unterthemen-Reihenfolge, innerhalb eines Blocks alphabetisch (de). */
export function sortBfAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = bfStichwortClusterIndex(a);
    const ib = bfStichwortClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

export const BF_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Erste binomische Formel anwenden: $(a+b)^2$': ['bf_erste_formel'],
  'Zweite binomische Formel anwenden: $(a-b)^2$': ['bf_zweite_formel'],
  'Dritte binomische Formel anwenden: $(a+b)(a-b)$': ['bf_dritte_formel'],
  'Binomische Formel mit Vorzahl ausmultiplizieren': ['bf_ausmultiplizieren_mit_zahl'],
  'Quadratisches Binom faktorisieren: $(a\\pm b)^2$': ['bf_faktorisieren_quadrat'],
  'Differenz zweier Quadrate faktorisieren: $a^2-b^2$': ['bf_faktorisieren_diff'],
};

export function expandBfWbStichworte(keywords: readonly string[]): string[] {
  const out = new Set<string>();
  for (const k of keywords) {
    const ids = BF_WB_STICHWORT_TO_IDS[k];
    if (ids) for (const id of ids) out.add(id);
  }
  return [...out];
}

export function stichworteFuerBfIds(ids: readonly string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    for (const [kw, idList] of Object.entries(BF_WB_STICHWORT_TO_IDS)) {
      if ((idList as readonly string[]).includes(id)) out.add(kw);
    }
  }
  return [...out];
}

export function clusterTitelZeileFuerBfGeneratorIds(ids: readonly string[]): string {
  const idx = new Set<number>();
  for (const id of ids) {
    for (const kw of stichworteFuerBfIds([id])) {
      const c = bfStichwortClusterIndex(kw);
      if (c >= 0 && c < BF_WB_CLUSTER_TITEL.length) idx.add(c);
    }
  }
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => BF_WB_CLUSTER_TITEL[i])
    .filter(Boolean)
    .join(' · ');
}

export function stichwortLabelsFromBfSessionRaw(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string' && raw[0].startsWith('bf_')) {
    const ids = raw.filter((x): x is string => typeof x === 'string');
    return sortBfAbStichworte([...new Set(stichworteFuerBfIds(ids))]);
  }
  const kw = raw.filter((x): x is string => typeof x === 'string');
  return sortBfAbStichworte([...new Set(kw)]);
}
