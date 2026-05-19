/**
 * Aufgabenlogik: Umwandlung zwischen Brüchen, Dezimalzahlen und Prozentangaben.
 * Nur endliche Dezimaldarstellungen (Nenner n = 2^a·5^b), damit keine optisch-numerischen Widersprüche entstehen.
 */

export type BdpRng = () => number;

export type BdpDirectionId = 'br_dez' | 'dez_br' | 'br_pr' | 'pr_br' | 'dez_pr' | 'pr_dez';

export type BdpSlotKind = 'decimal' | 'int_percent' | 'fraction';

export interface BdpTask {
  direction: BdpDirectionId;
  /** Linker Term als KaTeX-Inline ($…$ wird beim Rendern angefügt) */
  leftTex: string;
  /** Nach dem Eingabefeld zusätzlich „%“ anzeigen (nur int_percent) */
  showPercentAfter: boolean;
  slot: BdpSlotKind;
  /** Dezimalantwort (Bruch→Dez, Prozent→Dez) */
  expectDec?: number;
  /** Ganzzahlige Prozentangabe rechts (Dez→Prozent, Bruch→Prozent) */
  expectInt?: number;
  /** Erwarteter gekürzter Bruch (Prozent→Bruch, Dez→Bruch) */
  expectNum?: number;
  expectDen?: number;
  /** Kurzlösung für Lehrer:innen / Eye-Toggle */
  loesungKurz: string;
}

export const BDP_DIRECTION_IDS: readonly BdpDirectionId[] = [
  'br_dez',
  'dez_br',
  'br_pr',
  'pr_br',
  'dez_pr',
  'pr_dez',
] as const;

export const BDP_CARD_GROUPS: readonly {
  title: string;
  directions: readonly { id: BdpDirectionId; label: string }[];
}[] = [
  {
    title: 'Brüche ↔ Dezimalzahlen',
    directions: [
      { id: 'br_dez', label: 'Bruch → Dezimalzahl' },
      { id: 'dez_br', label: 'Dezimalzahl → Bruch' },
    ],
  },
  {
    title: 'Brüche ↔ Prozentangaben',
    directions: [
      { id: 'br_pr', label: 'Bruch → Prozent' },
      { id: 'pr_br', label: 'Prozent → Bruch' },
    ],
  },
  {
    title: 'Dezimalzahlen ↔ Prozentangaben',
    directions: [
      { id: 'dez_pr', label: 'Dezimalzahl → Prozent' },
      { id: 'pr_dez', label: 'Prozent → Dezimalzahl' },
    ],
  },
] as const;

/** Nenner mit endlicher Dezimalentwicklung (n ≤ 100). */
const NICE_DENOMINATORS: readonly number[] = [2, 4, 5, 8, 10, 16, 20, 25, 32, 40, 50, 64, 80, 100] as const;

/** Nenner n | 100: garantiert ganzzahligen Prozentsatz (100·z/n ∈ ℤ) für gekürzte z/n. */
const DENOM_TEILT_100: readonly number[] = [2, 4, 5, 10, 20, 25, 50, 100] as const;

function gcdPos(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

function pick<T>(rng: BdpRng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function randInt(rng: BdpRng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Zufälliger echter gekürzter Stammbruch z/n, 1 ≤ z < n. */
function randomReducedProperFraction(rng: BdpRng, denPool: readonly number[] = NICE_DENOMINATORS): {
  num: number;
  den: number;
} {
  for (let k = 0; k < 60; k++) {
    const den = pick(rng, denPool);
    const num = randInt(rng, 1, den - 1);
    if (gcdPos(num, den) === 1) return { num, den };
  }
  return { num: 1, den: 2 };
}

function formatDezimalAnzeige(v: number): string {
  const s = v.toFixed(6).replace(/\.?0+$/, '');
  if (s === '-0') return '0';
  return s;
}

/** TeX für eine Dezimalzahl mit Punkt (wie in den Screenshots). */
function texDezimal(v: number): string {
  return formatDezimalAnzeige(v);
}

function texBruch(num: number, den: number): string {
  return `\\tfrac{${num}}{${den}}`;
}

function texProzent(p: number): string {
  return `${p}\\%`;
}

function reduce(n: number, d: number): { num: number; den: number } {
  const g = gcdPos(n, d);
  let num = n / g;
  let den = d / g;
  if (den < 0) {
    num = -num;
    den = -den;
  }
  return { num, den };
}

export function bdpParseDecimal(raw: string): number | null {
  const s = raw
    .trim()
    .replace(/\u2212/g, '-')
    .replace(/\s+/g, '')
    .replace(',', '.');
  if (s === '' || s === '-' || s === '+' || s === '.' || s === '-.') return null;
  if (!/^[-+]?\d*(?:\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function bdpDezimalAntwortOk(eingabe: string, expect: number, eps = 1e-9): boolean {
  const v = bdpParseDecimal(eingabe);
  if (v === null) return false;
  return Math.abs(v - expect) < eps;
}

export function erzeugeBdpAufgabe(id: BdpDirectionId, rng: BdpRng): BdpTask {
  switch (id) {
    case 'br_dez': {
      const { num, den } = randomReducedProperFraction(rng);
      const v = num / den;
      return {
        direction: id,
        leftTex: texBruch(num, den),
        showPercentAfter: false,
        slot: 'decimal',
        expectDec: v,
        loesungKurz: `$${texDezimal(v)}$`,
      };
    }
    case 'dez_br': {
      const { num, den } = randomReducedProperFraction(rng);
      const v = num / den;
      return {
        direction: id,
        leftTex: texDezimal(v),
        showPercentAfter: false,
        slot: 'fraction',
        expectNum: num,
        expectDen: den,
        loesungKurz: `$${texBruch(num, den)}$`,
      };
    }
    case 'br_pr': {
      const { num, den } = randomReducedProperFraction(rng, DENOM_TEILT_100);
      const p = (100 * num) / den;
      return {
        direction: id,
        leftTex: texBruch(num, den),
        showPercentAfter: true,
        slot: 'int_percent',
        expectInt: p,
        loesungKurz: `$${p}\\%$`,
      };
    }
    case 'pr_br': {
      const p = randInt(rng, 1, 99);
      const { num, den } = reduce(p, 100);
      return {
        direction: id,
        leftTex: texProzent(p),
        showPercentAfter: false,
        slot: 'fraction',
        expectNum: num,
        expectDen: den,
        loesungKurz: `$${texBruch(num, den)}$`,
      };
    }
    case 'dez_pr': {
      const { num, den } = randomReducedProperFraction(rng, DENOM_TEILT_100);
      const v = num / den;
      const p = (100 * num) / den;
      return {
        direction: id,
        leftTex: texDezimal(v),
        showPercentAfter: true,
        slot: 'int_percent',
        expectInt: p,
        loesungKurz: `$${p}\\%$`,
      };
    }
    case 'pr_dez': {
      const p = randInt(rng, 1, 99);
      const v = p / 100;
      return {
        direction: id,
        leftTex: texProzent(p),
        showPercentAfter: false,
        slot: 'decimal',
        expectDec: v,
        loesungKurz: `$${texDezimal(v)}$`,
      };
    }
    default: {
      const _x: never = id;
      return _x;
    }
  }
}
