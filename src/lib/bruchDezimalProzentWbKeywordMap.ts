/**
 * Stichwörter aus `src/content/themen/bruch-dezimal-prozent.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Bruch · Dezimal · Prozent.
 */
export const BDP_WB_STOR_KEY = 'mu_bdp_wb_keywords';

/** Die sechs Umwandlungsrichtungen (eine Karte je Block in der JSON). */
export const BDP_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  ['Bruch → Dezimal'],
  ['Dezimal → Bruch'],
  ['Bruch → Prozent'],
  ['Prozent → Bruch'],
  ['Dezimal → Prozent'],
  ['Prozent → Dezimal'],
];

export const BDP_WB_CLUSTER_TITEL: readonly string[] = [
  'Bruch → Dezimal',
  'Dezimal → Bruch',
  'Bruch → Prozent',
  'Prozent → Bruch',
  'Dezimal → Prozent',
  'Prozent → Dezimal',
];

export function bdpStichwortClusterIndex(stichwort: string): number {
  for (let i = 0; i < BDP_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (BDP_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

export function sortBdpAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = bdpStichwortClusterIndex(a);
    const ib = bdpStichwortClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

export const BDP_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Bruch → Dezimal': ['bdp_bruch_dezimal'],
  'Dezimal → Bruch': ['bdp_dezimal_bruch'],
  'Bruch → Prozent': ['bdp_bruch_prozent'],
  'Prozent → Bruch': ['bdp_prozent_bruch'],
  'Dezimal → Prozent': ['bdp_dezimal_prozent'],
  'Prozent → Dezimal': ['bdp_prozent_dezimal'],
};

export function expandBdpWbStichworte(keywords: readonly string[]): string[] {
  const out = new Set<string>();
  for (const k of keywords) {
    const ids = BDP_WB_STICHWORT_TO_IDS[k];
    if (ids) for (const id of ids) out.add(id);
  }
  return [...out];
}

export function stichworteFuerBdpIds(ids: readonly string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    for (const [kw, idList] of Object.entries(BDP_WB_STICHWORT_TO_IDS)) {
      if ((idList as readonly string[]).includes(id)) out.add(kw);
    }
  }
  return [...out];
}

export function clusterTitelZeileFuerBdpGeneratorIds(ids: readonly string[]): string {
  const idx = new Set<number>();
  for (const id of ids) {
    for (const kw of stichworteFuerBdpIds([id])) {
      const c = bdpStichwortClusterIndex(kw);
      if (c >= 0 && c < BDP_WB_CLUSTER_TITEL.length) idx.add(c);
    }
  }
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => BDP_WB_CLUSTER_TITEL[i])
    .filter(Boolean)
    .join(' · ');
}

export function stichwortLabelsFromBdpSessionRaw(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string' && raw[0].startsWith('bdp_')) {
    const ids = raw.filter((x): x is string => typeof x === 'string');
    return sortBdpAbStichworte([...new Set(stichworteFuerBdpIds(ids))]);
  }
  const kw = raw.filter((x): x is string => typeof x === 'string');
  return sortBdpAbStichworte([...new Set(kw)]);
}
