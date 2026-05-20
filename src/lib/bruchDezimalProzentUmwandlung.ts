import type { PracticeAufgabe, RandomFn } from './uebungPracticeGenerators';

export { BDP_WB_STOR_KEY } from './bruchDezimalProzentWbKeywordMap';

/** Kurzlabels für PDF-Pill-Leiste und UI (Massenübung). */
export const BDP_GEN_ID_LABEL: Readonly<Record<string, string>> = {
  bdp_bruch_dezimal: 'Bruch → Dezimal',
  bdp_dezimal_bruch: 'Dezimal → Bruch',
  bdp_bruch_prozent: 'Bruch → Prozent',
  bdp_prozent_bruch: 'Prozent → Bruch',
  bdp_dezimal_prozent: 'Dezimal → Prozent',
  bdp_prozent_dezimal: 'Prozent → Dezimal',
};

function gcdPos(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/** LaTeX mit Dezimalkomma `{,}`; entfernt unnötige Nachnullen nach dem Komma. */
function dzTex(n: number, dp: number): string {
  const neg = n < 0;
  const v = Math.abs(n);
  const s0 = v.toFixed(dp);
  let s = s0.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
  if (!s.includes('.')) return (neg ? '-' : '') + s;
  const [ip, fp] = s.split('.');
  return (neg ? '-' : '') + `${ip}{,}${fp}`;
}

function makePick(rand: RandomFn) {
  return function pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(rand() * arr.length)]!;
  };
}

function makeRandInt(rand: RandomFn) {
  return function randInt(a: number, b: number): number {
    return Math.floor(rand() * (b - a + 1)) + a;
  };
}

/** Nenner, die zu endlichen Dezimaldarstellungen führen (Zehnerpotenz-Nenner). */
const BDP_TERMINATING_DENOMS = [2, 4, 5, 8, 10, 20, 25, 40, 50, 100] as const;

function fracTex(n: number, d: number): string {
  return `\\tfrac{${n}}{${d}}`;
}

function reduceFrac(n: number, d: number): { n: number; d: number } {
  const g = gcdPos(n, d);
  let nn = n / g;
  let dd = d / g;
  if (dd < 0) {
    nn = -nn;
    dd = -dd;
  }
  return { n: nn, d: dd };
}

/**
 * Erzeugt die sechs Aufgaben-Builder für `createPracticeGenerators`.
 * Reine Umwandlungslogik (deterministisch über den injizierten PRNG).
 */
export function createBruchDezimalProzentGenerators(random: RandomFn): Record<
  | 'bdp_bruch_dezimal'
  | 'bdp_dezimal_bruch'
  | 'bdp_bruch_prozent'
  | 'bdp_prozent_bruch'
  | 'bdp_dezimal_prozent'
  | 'bdp_prozent_dezimal',
  () => PracticeAufgabe
> {
  const pick = makePick(random);
  const randInt = makeRandInt(random);

  return {
    bdp_bruch_dezimal() {
      const d = pick(BDP_TERMINATING_DENOMS);
      const n = randInt(1, d - 1);
      const { n: rn, d: rd } = reduceFrac(n, d);
      const dec = rn / rd;
      const dp = rd <= 10 ? 1 : 2;
      return {
        frage: `Schreibe ${fracTex(rn, rd)} als Dezimalzahl.`,
        loesung: `$${dzTex(dec, dp)}$`,
        loesungInlineNachFrage: true,
      };
    },

    bdp_dezimal_bruch() {
      const d = pick([2, 4, 5, 8, 10, 20, 25] as const);
      const n = randInt(1, d - 1);
      const { n: rn, d: rd } = reduceFrac(n, d);
      const dec = rn / rd;
      const dp = rd <= 10 ? 1 : 2;
      return {
        frage: `Schreibe $${dzTex(dec, dp)}$ als gekürzten Bruch.`,
        loesung: `$${dzTex(dec, dp)}=${fracTex(rn, rd)}$`,
        loesungInlineNachFrage: true,
        frageArbeitsblatt: `Schreibe $${dzTex(dec, dp)}$ als gekürzten Bruch: <span class="mu-katex-skip inline-flex items-center gap-1.5 text-lg leading-none">[[MU_AB:0]]</span>`,
        abSlots: [{ kind: 'frac', expectNum: rn, expectDen: rd, requireFullyReduced: true }],
      };
    },

    bdp_bruch_prozent() {
      const d = pick([2, 4, 5, 10, 20, 25, 50, 100] as const);
      const n = randInt(1, d - 1);
      const { n: rn, d: rd } = reduceFrac(n, d);
      const p = Math.round((100 * rn) / rd);
      return {
        frage: `Schreibe ${fracTex(rn, rd)} als Prozentangabe.`,
        loesung: `$${fracTex(rn, rd)}=${p}\\,\\%$`,
        loesungInlineNachFrage: true,
        frageArbeitsblatt: `Schreibe ${fracTex(rn, rd)} als Prozentangabe: <span class="mu-katex-skip inline-flex items-center gap-1.5 text-lg leading-none">[[MU_AB:0]]</span> <span class="mu-katex-skip text-base">\\%</span>`,
        abSlots: [{ kind: 'int', expect: p }],
      };
    },

    bdp_prozent_bruch() {
      const pairs: readonly { p: number; n: number; d: number }[] = [
        { p: 25, n: 1, d: 4 },
        { p: 50, n: 1, d: 2 },
        { p: 75, n: 3, d: 4 },
        { p: 20, n: 1, d: 5 },
        { p: 40, n: 2, d: 5 },
        { p: 60, n: 3, d: 5 },
        { p: 80, n: 4, d: 5 },
        { p: 10, n: 1, d: 10 },
        { p: 30, n: 3, d: 10 },
        { p: 70, n: 7, d: 10 },
        { p: 90, n: 9, d: 10 },
        { p: 12, n: 3, d: 25 },
        { p: 24, n: 6, d: 25 },
        { p: 36, n: 9, d: 25 },
        { p: 48, n: 12, d: 25 },
      ];
      const { p, n, d } = pick(pairs);
      const g = gcdPos(n, d);
      return {
        frage: `Schreibe $${p}\\,\\%$ als gekürzten Bruch.`,
        loesung: `$${p}\\,\\%=${fracTex(n, d)}$`,
        loesungInlineNachFrage: true,
        frageArbeitsblatt: `Schreibe $${p}\\,\\%$ als gekürzten Bruch: <span class="mu-katex-skip inline-flex items-center gap-1.5 text-lg leading-none">[[MU_AB:0]]</span>`,
        abSlots: [{ kind: 'frac', expectNum: n / g, expectDen: d / g, requireFullyReduced: true }],
      };
    },

    bdp_dezimal_prozent() {
      const d = pick([2, 4, 5, 10, 20, 25, 50] as const);
      const n = randInt(1, d - 1);
      const { n: rn, d: rd } = reduceFrac(n, d);
      const dec = rn / rd;
      const dp = rd <= 10 ? 1 : 2;
      const p = Math.round(100 * dec);
      return {
        frage: `Schreibe $${dzTex(dec, dp)}$ als Prozentangabe.`,
        loesung: `$${dzTex(dec, dp)}=${p}\\,\\%$`,
        loesungInlineNachFrage: true,
        frageArbeitsblatt: `Schreibe $${dzTex(dec, dp)}$ als Prozentangabe: <span class="mu-katex-skip inline-flex items-center gap-1.5 text-lg leading-none">[[MU_AB:0]]</span> <span class="mu-katex-skip text-base">\\%</span>`,
        abSlots: [{ kind: 'int', expect: p }],
      };
    },

    bdp_prozent_dezimal() {
      const d = pick([2, 4, 5, 10, 20, 25, 50] as const);
      const n = randInt(1, d - 1);
      const { n: rn, d: rd } = reduceFrac(n, d);
      const dec = rn / rd;
      const dp = rd <= 10 ? 1 : 2;
      const p = Math.round(100 * dec);
      return {
        frage: `Schreibe $${p}\\,\\%$ als Dezimalzahl.`,
        loesung: `$${p}\\,\\%=${dzTex(dec, dp)}$`,
        loesungInlineNachFrage: true,
      };
    },
  };
}
