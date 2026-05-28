/**
 * Stichwörter aus `src/content/themen/bruch-dezimal-prozent.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Bruch · Dezimal · Prozent.
 */
export const BDP_KW_WB_STOR_KEY = 'mu_bdp_wb_keywords';

/** Stichwörter pro Unterthemen-Block, Reihenfolge wie in `bruch-dezimal-prozent.json`. */
export const BDP_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  [
    'Brüche in Dezimalzahlen umwandeln',
    'Dezimalzahlen in Brüche umwandeln',
    'Brüche in Prozentsätze umwandeln',
    'Prozentsätze in Brüche umwandeln',
    'Dezimalzahlen in Prozentsätze umwandeln',
    'Prozentsätze in Dezimalzahlen umwandeln',
  ],
  [
    'Prozentwert berechnen (ohne Taschenrechner)',
    'Prozentwert berechnen (mit Taschenrechner)',
    'Prozentsatz bestimmen (Anteil eines Werts an einem anderen)',
  ],
  [
    'Prozentuale Zunahme (ohne Taschenrechner)',
    'Prozentuale Abnahme (ohne Taschenrechner)',
    'Prozentuale Zu- und Abnahme kombinieren (ohne Taschenrechner)',
    'Prozentuale Zunahme (mit Taschenrechner / Multiplikatoren)',
    'Prozentuale Abnahme (mit Taschenrechner / Multiplikatoren)',
    'Prozentuale Zu- und Abnahme kombinieren (mit Taschenrechner / Multiplikatoren)',
  ],
  [
    'Grundwert bestimmen aus gegebenem Prozentwert',
    'Grundwert bestimmen nach einer Zunahme',
    'Grundwert bestimmen nach einer Abnahme',
    'Prozentuale Veränderung und Grundwertbestimmung — Methodendiagnose',
  ],
];

export const BDP_WB_CLUSTER_TITEL: readonly string[] = [
  'Darstellungsformen umwandeln',
  'Prozentwerte und Anteile bestimmen',
  'Prozentuale Veränderung',
  'Grundwert bestimmen (Umkehrung)',
];

export function bdpLabelClusterIndex(stichwort: string): number {
  for (let i = 0; i < BDP_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (BDP_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

/** Sortiert nach Unterthemen-Reihenfolge, innerhalb eines Blocks alphabetisch (de). */
export function sortBdpAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = bdpLabelClusterIndex(a);
    const ib = bdpLabelClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

export const BDP_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Brüche in Dezimalzahlen umwandeln': ['bdp_br_dez'],
  'Dezimalzahlen in Brüche umwandeln': ['bdp_dez_br'],
  'Brüche in Prozentsätze umwandeln': ['bdp_br_pr'],
  'Prozentsätze in Brüche umwandeln': ['bdp_pr_br'],
  'Dezimalzahlen in Prozentsätze umwandeln': ['bdp_dez_pr'],
  'Prozentsätze in Dezimalzahlen umwandeln': ['bdp_pr_dez'],
  'Prozentwert berechnen (ohne Taschenrechner)': ['bdp_pw_non_calc'],
  'Prozentwert berechnen (mit Taschenrechner)': ['bdp_pw_calc'],
  'Prozentsatz bestimmen (Anteil eines Werts an einem anderen)': ['bdp_ps_bestimmen'],
  'Prozentuale Zunahme (ohne Taschenrechner)': ['bdp_ch_inc_non_calc'],
  'Prozentuale Abnahme (ohne Taschenrechner)': ['bdp_ch_dec_non_calc'],
  'Prozentuale Zu- und Abnahme kombinieren (ohne Taschenrechner)': ['bdp_ch_inc_dec_non_calc'],
  'Prozentuale Zunahme (mit Taschenrechner / Multiplikatoren)': ['bdp_ch_inc_calc'],
  'Prozentuale Abnahme (mit Taschenrechner / Multiplikatoren)': ['bdp_ch_dec_calc'],
  'Prozentuale Zu- und Abnahme kombinieren (mit Taschenrechner / Multiplikatoren)': ['bdp_ch_inc_dec_calc'],
  'Grundwert bestimmen aus gegebenem Prozentwert': ['bdp_rev_pw'],
  'Grundwert bestimmen nach einer Zunahme': ['bdp_rev_inc'],
  'Grundwert bestimmen nach einer Abnahme': ['bdp_rev_dec'],
  'Prozentuale Veränderung und Grundwertbestimmung — Methodendiagnose': ['bdp_diag_method'],
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
      const c = bdpLabelClusterIndex(kw);
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
