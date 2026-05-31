/**
 * Stichwörter aus `src/content/themen/stochastik.json` (`unterthemenBloecke[].punkte`)
 * → Generator-IDs für die Massenübung WB Stochastik.
 */
export const STOCHASTIK_WB_STOR_KEY = 'mu_stochastik_wb_keywords';

/** Stichwörter pro Unterthemen-Block, Reihenfolge wie in `stochastik.json`. */
export const STOCHASTIK_WB_UNTERTHEMA_STICHWORTE: readonly (readonly string[])[] = [
  [
    'Arithmetisches Mittel (Mittelwert) berechnen',
    'Median (Zentralwert) bestimmen',
    'Minimum, Maximum und Spannweite bestimmen',
    'Einfluss von Ausreißern analysieren',
    'Modus (Häufigster Wert) bestimmen',
    'Absolute und relative Häufigkeiten bestimmen'
  ],
  [
    'Säulen- und Kreisdiagramme zeichnen und lesen',
    'Quartile bestimmen',
    'Boxplots zeichnen und interpretieren',
    'Statistische Darstellungen kritisch hinterfragen'
  ],
  [
    'Zufallsexperiment, Ergebnis und Ereignis unterscheiden',
    'Gesetz der großen Zahlen und empirische Häufigkeit',
    'Laplace-Experimente identifizieren',
    'Laplace-Wahrscheinlichkeit berechnen',
    'Sichere, mögliche und unmögliche Ereignisse',
    'Gegenereignis und Komplementärregel anwenden'
  ],
  [
    'Mehrstufige Zufallsexperimente darstellen',
    'Baumdiagramme zeichnen und beschriften',
    'Pfadmultiplikationsregel (1. Pfadregel)',
    'Pfadadditionsregel (2. Pfadregel)',
    'Ziehen mit Zurücklegen',
    'Ziehen ohne Zurücklegen'
  ]
];

export const STOCHASTIK_WB_CLUSTER_TITEL: readonly string[] = [
  'Daten auswerten (Beschreibende Statistik)',
  'Daten darstellen und interpretieren',
  'Einstufige Zufallsexperimente',
  'Mehrstufige Zufallsexperimente'
];

export function stochastikLabelClusterIndex(stichwort: string): number {
  for (let i = 0; i < STOCHASTIK_WB_UNTERTHEMA_STICHWORTE.length; i++) {
    if (STOCHASTIK_WB_UNTERTHEMA_STICHWORTE[i].includes(stichwort)) return i;
  }
  return -1;
}

/** Sortiert nach Unterthemen-Reihenfolge, innerhalb eines Blocks alphabetisch (de). */
export function sortStochastikAbStichworte(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = stochastikLabelClusterIndex(a);
    const ib = stochastikLabelClusterIndex(b);
    const na = ia < 0 ? Number.POSITIVE_INFINITY : ia;
    const nb = ib < 0 ? Number.POSITIVE_INFINITY : ib;
    if (na !== nb) return na - nb;
    return a.localeCompare(b, 'de');
  });
}

export const STOCHASTIK_WB_STICHWORT_TO_IDS: Readonly<Record<string, readonly string[]>> = {
  'Arithmetisches Mittel (Mittelwert) berechnen': ['st_mittelwert_median'],
  'Median (Zentralwert) bestimmen': ['st_mittelwert_median'],
  'Minimum, Maximum und Spannweite bestimmen': ['st_mittelwert_median'],
  'Einfluss von Ausreißern analysieren': ['st_ausreisser_effekt'],
  'Modus (Häufigster Wert) bestimmen': ['st_mittelwert_median'],
  'Absolute und relative Häufigkeiten bestimmen': ['st_erwartungswert_muenzwurf'],
  'Säulen- und Kreisdiagramme zeichnen und lesen': ['st_saeulen_kreisdiagramm'],
  'Quartile bestimmen': ['st_quartile_bestimmen'],
  'Boxplots zeichnen und interpretieren': ['st_boxplot_zeichnen'],
  'Statistische Darstellungen kritisch hinterfragen': ['st_manipulierte_darstellung'],
  'Zufallsexperiment, Ergebnis und Ereignis unterscheiden': ['st_unmoeglich_sicher'],
  'Gesetz der großen Zahlen und empirische Häufigkeit': ['st_erwartungswert_muenzwurf'],
  'Laplace-Experimente identifizieren': ['st_unmoeglich_sicher'],
  'Laplace-Wahrscheinlichkeit berechnen': ['st_wuerfelsumme_sieben'],
  'Sichere, mögliche und unmögliche Ereignisse': ['st_unmoeglich_sicher'],
  'Gegenereignis und Komplementärregel anwenden': ['st_mindestens_einmal'],
  'Mehrstufige Zufallsexperimente darstellen': ['st_mindestens_einmal'],
  'Baumdiagramme zeichnen und beschriften': ['st_mindestens_einmal'],
  'Pfadmultiplikationsregel (1. Pfadregel)': ['st_mindestens_einmal'],
  'Pfadadditionsregel (2. Pfadregel)': ['st_mindestens_einmal'],
  'Ziehen mit Zurücklegen': ['st_mindestens_einmal'],
  'Ziehen ohne Zurücklegen': ['st_mindestens_einmal']
};

export function expandStochastikWbStichworte(keywords: readonly string[]): string[] {
  const out = new Set<string>();
  for (const k of keywords) {
    const ids = STOCHASTIK_WB_STICHWORT_TO_IDS[k];
    if (ids) for (const id of ids) out.add(id);
  }
  return [...out];
}

export function stichworteFuerStochastikIds(ids: readonly string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    for (const [kw, idList] of Object.entries(STOCHASTIK_WB_STICHWORT_TO_IDS)) {
      if ((idList as readonly string[]).includes(id)) out.add(kw);
    }
  }
  return [...out];
}

export function clusterTitelZeileFuerStochastikGeneratorIds(ids: readonly string[]): string {
  const idx = new Set<number>();
  for (const id of ids) {
    for (const kw of stichworteFuerStochastikIds([id])) {
      const c = stochastikLabelClusterIndex(kw);
      if (c >= 0 && c < STOCHASTIK_WB_CLUSTER_TITEL.length) idx.add(c);
    }
  }
  return [...idx]
    .sort((a, b) => a - b)
    .map((i) => STOCHASTIK_WB_CLUSTER_TITEL[i])
    .filter(Boolean)
    .join(' · ');
}

export function stichwortLabelsFromStochastikSessionRaw(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string' && raw[0].startsWith('st_')) {
    const ids = raw.filter((x): x is string => typeof x === 'string');
    return sortStochastikAbStichworte([...new Set(stichworteFuerStochastikIds(ids))]);
  }
  const kw = raw.filter((x): x is string => typeof x === 'string');
  return sortStochastikAbStichworte([...new Set(kw)]);
}
