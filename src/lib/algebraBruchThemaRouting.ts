/**
 * Routing von Stichworten des Blocks „Algebraische Brüche“ (`algebra.json`)
 * zur Massenübung WB Bruchrechnung (`bruchrechnungWbKeywordMap.ts`).
 */
import { ALG_WB_UNTERTHEMA_STICHWORTE, algStichwortClusterIndex } from './algebraWbKeywordMap';
import { BRUCH_WB_STICHWORT_TO_IDS, sortBruchAbStichworte } from './bruchrechnungWbKeywordMap';

/** Index des Blocks „Algebraische Brüche“ in `ALG_WB_UNTERTHEMA_STICHWORTE`. */
export const ALG_WB_ALGEBRA_BRUCH_CLUSTER_INDEX = 4 as const;

const BRUCH_BLOCK = ALG_WB_UNTERTHEMA_STICHWORTE[ALG_WB_ALGEBRA_BRUCH_CLUSTER_INDEX];
const BRUCH_BLOCK_SET = new Set<string>(BRUCH_BLOCK);

/**
 * Algebra-Thema-Stichwort → ein oder mehrere exakte Keys aus `BRUCH_WB_STICHWORT_TO_IDS`.
 * Nur Einträge aus dem Block „Algebraische Brüche“.
 */
export const ALGEBRA_BRUCH_THEMA_TO_BRUCH_STICHWORTE: Readonly<Record<string, readonly string[]>> = {
  'Algebraische Brüche': ['Kürzen / vollständig kürzen', 'Gleichwertige (äquivalente) Brüche'],
  'Algebraische Brüche vereinfachen (ohne Faktorisieren)': ['Kürzen / vollständig kürzen'],
  'Algebraische Brüche vereinfachen (lineare Faktorisierung)': ['Kürzen / vollständig kürzen'],
  'Algebraische Brüche vereinfachen (monische quadratische Faktorisierung)': ['Kürzen / vollständig kürzen'],
  'Algebraische Brüche vereinfachen (nicht-monische quadratische Faktorisierung)': [
    'Kürzen / vollständig kürzen',
  ],
  'Algebraische Brüche multiplizieren (ohne vorgehendes Faktorisieren)': ['Brüche multiplizieren'],
  'Algebraische Brüche multiplizieren (mit linearer Faktorisierung)': ['Brüche multiplizieren'],
  'Algebraische Brüche multiplizieren (mit monischer quadratischer Faktorisierung)': ['Brüche multiplizieren'],
  'Algebraische Brüche multiplizieren (mit nicht-monischer quadratischer Faktorisierung)': [
    'Brüche multiplizieren',
  ],
  'Algebraische Brüche dividieren (ohne vorgehendes Faktorisieren)': ['Brüche dividieren (Kehrwert)'],
  'Algebraische Brüche dividieren (mit linearer Faktorisierung)': ['Brüche dividieren (Kehrwert)'],
  'Algebraische Brüche dividieren (mit monischer quadratischer Faktorisierung)': [
    'Brüche dividieren (Kehrwert)',
  ],
  'Algebraische Brüche dividieren (mit nicht-monischer quadratischer Faktorisierung)': [
    'Brüche dividieren (Kehrwert)',
  ],
  'Algebraische Brüche addieren (ganzzahlige Nenner)': ['Addition ungleichnamiger Brüche'],
  'Algebraische Brüche addieren (algebraische einfache Nenner)': ['Addition ungleichnamiger Brüche'],
  'Algebraische Brüche addieren (lineare algebraische Nenner)': ['Addition ungleichnamiger Brüche'],
  'Algebraische Brüche addieren (mit vorgehendem Faktorisieren)': ['Addition ungleichnamiger Brüche'],
  'Algebraische Brüche subtrahieren (ganzzahlige Nenner)': ['Subtraktion ungleichnamiger Brüche'],
  'Algebraische Brüche subtrahieren (algebraische einfache Nenner)': ['Subtraktion ungleichnamiger Brüche'],
  'Algebraische Brüche subtrahieren (lineare algebraische Nenner)': ['Subtraktion ungleichnamiger Brüche'],
  'Algebraische Brüche subtrahieren (mit vorgehendem Faktorisieren)': ['Subtraktion ungleichnamiger Brüche'],
  'Die vier Grundrechenarten mit algebraischen Brüchen': [
    'Addition ungleichnamiger Brüche',
    'Subtraktion ungleichnamiger Brüche',
    'Brüche multiplizieren',
    'Brüche dividieren (Kehrwert)',
  ],
};

export function algStichwortIstNurAlgebraBruchBlock(selected: readonly string[]): boolean {
  if (selected.length === 0) return false;
  for (const s of selected) {
    if (algStichwortClusterIndex(s) !== ALG_WB_ALGEBRA_BRUCH_CLUSTER_INDEX) return false;
    if (!BRUCH_BLOCK_SET.has(s)) return false;
  }
  return true;
}

/** True, wenn die Auswahl ausschließlich aus „Algebraische Brüche“ besteht und vollständig auf Bruch-WB abbildbar ist. */
export function selectedAlgebraStichworteRoutenZuBruchrechnung(selected: readonly string[]): boolean {
  if (!algStichwortIstNurAlgebraBruchBlock(selected)) return false;
  for (const s of selected) {
    const mapped = ALGEBRA_BRUCH_THEMA_TO_BRUCH_STICHWORTE[s];
    if (!mapped || mapped.length === 0) return false;
  }
  return true;
}

/** Flache, deduplizierte Bruch-Stichworte für `BRUCH_WB_STOR_KEY` (Reihenfolge wie Bruch-Thema). */
export function algebraThemaStichworteToBruchSessionKeywords(selected: readonly string[]): string[] {
  const out = new Set<string>();
  for (const s of selected) {
    const mapped = ALGEBRA_BRUCH_THEMA_TO_BRUCH_STICHWORTE[s];
    if (mapped) for (const b of mapped) out.add(b);
  }
  return sortBruchAbStichworte([...out]);
}

/** Hilfe für Tests: alle Map-Keys ⊆ Block-Stichworte und alle Ziele ⊆ `BRUCH_WB_STICHWORT_TO_IDS`. */
export function assertAlgebraBruchRoutingKonsistent(): void {
  const erlaubt = new Set(Object.keys(BRUCH_WB_STICHWORT_TO_IDS));
  for (const k of Object.keys(ALGEBRA_BRUCH_THEMA_TO_BRUCH_STICHWORTE)) {
    if (!BRUCH_BLOCK_SET.has(k)) {
      throw new Error(`algebraBruchThemaRouting: Key nicht im Algebra-Bruch-Block: ${k}`);
    }
    for (const b of ALGEBRA_BRUCH_THEMA_TO_BRUCH_STICHWORTE[k] ?? []) {
      if (!erlaubt.has(b)) {
        throw new Error(`algebraBruchThemaRouting: Unbekanntes Bruch-Stichwort: ${b}`);
      }
    }
  }
}
