/**
 * Stichwörter aus `src/content/themen/graphen.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Graphen.
 */
export const GRAPHEN_WB_STOR_KEY = 'mu_graphen_wb_keywords';

/** Stichwörter pro Unterthemen-Block, Reihenfolge wie in `graphen.json`. */
export const GRAPHEN_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  [
    'Linear: y = x + c (Wertetabelle)',
    'Linear: y = mx + c (Wertetabelle)',
    'Linear: y = c - mx (Wertetabelle)',
    'Linear (implicit): ax + by = c (Wertetabelle)',
    'Quadratic: y = x^2 + bx + c (Wertetabelle)',
    'Quadratic: y = ax^2 + bx + c (Wertetabelle)',
    'Quadratic: y = -ax^2 + bx + c (Wertetabelle)',
    'Cubic: y = x^3 + bx + c (Wertetabelle)',
    'Cubic: y = -x^3 + bx + c (Wertetabelle)'
  ],
  [
    'Linear: y = x + c (Zeichnen)',
    'Linear: y = mx + c (Zeichnen)',
    'Linear: y = c - mx (Zeichnen)',
    'Linear (implicit): ax + by = c (Zeichnen)',
    'Quadratic: y = x^2 + bx + c (Zeichnen)',
    'Quadratic: y = ax^2 + bx + c (Zeichnen)',
    'Quadratic: y = -ax^2 + bx + c (Zeichnen)',
    'Cubic: y = x^3 + bx + c (Zeichnen)',
    'Cubic: y = -x^3 + bx + c (Zeichnen)'
  ]
];

export const GRAPHEN_WB_CLUSTER_TITEL: readonly string[] = [
  'Wertetabellen',
  'Funktionsgraphen zeichnen'
];

export function graphenLabelClusterIndex(stichwort: string): number {
  for (let i = 0; i < GRAPHEN_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (GRAPHEN_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

/** Sortiert nach Unterthemen-Reihenfolge, innerhalb eines Blocks alphabetisch (de). */
export function sortGraphenAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = graphenLabelClusterIndex(a);
    const ib = graphenLabelClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

export const GRAPHEN_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Linear: y = x + c (Wertetabelle)': ['pg_table_lin_x_c'],
  'Linear: y = mx + c (Wertetabelle)': ['pg_table_lin_mx_c'],
  'Linear: y = c - mx (Wertetabelle)': ['pg_table_lin_c_mx'],
  'Linear (implicit): ax + by = c (Wertetabelle)': ['pg_table_lin_implicit'],
  'Quadratic: y = x^2 + bx + c (Wertetabelle)': ['pg_table_quad_x2'],
  'Quadratic: y = ax^2 + bx + c (Wertetabelle)': ['pg_table_quad_ax2'],
  'Quadratic: y = -ax^2 + bx + c (Wertetabelle)': ['pg_table_quad_neg_ax2'],
  'Cubic: y = x^3 + bx + c (Wertetabelle)': ['pg_table_cubic_x3'],
  'Cubic: y = -x^3 + bx + c (Wertetabelle)': ['pg_table_cubic_neg_x3'],

  'Linear: y = x + c (Zeichnen)': ['pg_draw_lin_x_c'],
  'Linear: y = mx + c (Zeichnen)': ['pg_draw_lin_mx_c'],
  'Linear: y = c - mx (Zeichnen)': ['pg_draw_lin_c_mx'],
  'Linear (implicit): ax + by = c (Zeichnen)': ['pg_draw_lin_implicit'],
  'Quadratic: y = x^2 + bx + c (Zeichnen)': ['pg_draw_quad_x2'],
  'Quadratic: y = ax^2 + bx + c (Zeichnen)': ['pg_draw_quad_ax2'],
  'Quadratic: y = -ax^2 + bx + c (Zeichnen)': ['pg_draw_quad_neg_ax2'],
  'Cubic: y = x^3 + bx + c (Zeichnen)': ['pg_draw_cubic_x3'],
  'Cubic: y = -x^3 + bx + c (Zeichnen)': ['pg_draw_cubic_neg_x3']
};

export function expandGraphenWbStichworte(keywords: readonly string[]): string[] {
  const out = new Set<string>();
  for (const k of keywords) {
    const ids = GRAPHEN_WB_STICHWORT_TO_IDS[k];
    if (ids) for (const id of ids) out.add(id);
  }
  return [...out];
}

export function stichworteFuerGraphenIds(ids: readonly string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    for (const [kw, idList] of Object.entries(GRAPHEN_WB_STICHWORT_TO_IDS)) {
      if ((idList as readonly string[]).includes(id)) out.add(kw);
    }
  }
  return [...out];
}

export function clusterTitelZeileFuerGraphenGeneratorIds(ids: readonly string[]): string {
  const idx = new Set<number>();
  for (const id of ids) {
    for (const kw of stichworteFuerGraphenIds([id])) {
      const c = graphenLabelClusterIndex(kw);
      if (c >= 0 && c < GRAPHEN_WB_CLUSTER_TITEL.length) idx.add(c);
    }
  }
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => GRAPHEN_WB_CLUSTER_TITEL[i])
    .filter(Boolean)
    .join(' · ');
}

export function stichwortLabelsFromGraphenSessionRaw(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string' && raw[0].startsWith('pg_')) {
    const ids = raw.filter((x): x is string => typeof x === 'string');
    return sortGraphenAbStichworte([...new Set(stichworteFuerGraphenIds(ids))]);
  }
  const kw = raw.filter((x): x is string => typeof x === 'string');
  return sortGraphenAbStichworte([...new Set(kw)]);
}
