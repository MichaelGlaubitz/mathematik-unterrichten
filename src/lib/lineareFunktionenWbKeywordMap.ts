/**
 * Stichwörter aus `src/content/themen/lineare-funktionen.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Lineare Funktionen.
 */
export const LF_WB_STOR_KEY = 'mu_lf_wb_keywords';

/** Stichwörter pro Unterthemen-Block, Reihenfolge wie in `lineare-funktionen.json`. */
export const LF_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  [
    'Geradengleichung aus Steigung und Achsenabschnitt aufstellen',
    'Steigung $m$ aus zwei Punkten berechnen',
    'Achsenabschnitt aus Punkt und Steigung berechnen',
    'Parallele Gerade bestimmen',
  ],
  [
    'Funktionswert berechnen',
    'Nullstelle berechnen',
  ],
];

export const LF_WB_CLUSTER_TITEL: readonly string[] = [
  'Grundlagen & Aufstellen',
  'Punkte & Nullstellen',
];

export function lfStichwortClusterIndex(stichwort: string): number {
  for (let i = 0; i < LF_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (LF_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

/** Sortiert nach Unterthemen-Reihenfolge, innerhalb eines Blocks alphabetisch (de). */
export function sortLfAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = lfStichwortClusterIndex(a);
    const ib = lfStichwortClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

export const LF_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Geradengleichung aus Steigung und Achsenabschnitt aufstellen': ['lf_gerade_m_b'],
  'Steigung $m$ aus zwei Punkten berechnen': ['lf_steigung_aus_punkten'],
  'Achsenabschnitt aus Punkt und Steigung berechnen': ['lf_achsenabschnitt'],
  'Parallele Gerade bestimmen': ['lf_parallel'],
  'Funktionswert berechnen': ['lf_funktionswert'],
  'Nullstelle berechnen': ['lf_nullstelle'],
};

export function expandLfWbStichworte(keywords: readonly string[]): string[] {
  const out = new Set<string>();
  for (const k of keywords) {
    const ids = LF_WB_STICHWORT_TO_IDS[k];
    if (ids) for (const id of ids) out.add(id);
  }
  return [...out];
}

export function stichworteFuerLfIds(ids: readonly string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    for (const [kw, idList] of Object.entries(LF_WB_STICHWORT_TO_IDS)) {
      if ((idList as readonly string[]).includes(id)) out.add(kw);
    }
  }
  return [...out];
}

export function clusterTitelZeileFuerLfGeneratorIds(ids: readonly string[]): string {
  const idx = new Set<number>();
  for (const id of ids) {
    for (const kw of stichworteFuerLfIds([id])) {
      const c = lfStichwortClusterIndex(kw);
      if (c >= 0 && c < LF_WB_CLUSTER_TITEL.length) idx.add(c);
    }
  }
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => LF_WB_CLUSTER_TITEL[i])
    .filter(Boolean)
    .join(' · ');
}

export function stichwortLabelsFromLfSessionRaw(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string' && raw[0].startsWith('lf_')) {
    const ids = raw.filter((x): x is string => typeof x === 'string');
    return sortLfAbStichworte([...new Set(stichworteFuerLfIds(ids))]);
  }
  const kw = raw.filter((x): x is string => typeof x === 'string');
  return sortLfAbStichworte([...new Set(kw)]);
}
