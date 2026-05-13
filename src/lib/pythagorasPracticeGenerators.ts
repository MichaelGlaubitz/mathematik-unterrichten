/**
 * Zufallsaufgaben für /uebung/pythagoras, /uebung/trigonometrie, /uebung/strahlensaetze und /uebung/quadratische-funktionen — reine Logik, testbar mit injizierbarem PRNG.
 */

import {
  svgLadderAtWall,
  svgRectangleDiagonal,
  svgRightTriangleFromThreeLengths,
  svgRightTriangleKatheten,
  svgSegmentAbstand,
  svgTrigCos60Hyp,
  svgTrigGkHyp30,
  svgTrigSin30Hyp,
  svgTrigTan45Leg,
  svgTriangleSSS,
} from './pythagorasDiagrams';
import {
  svgStrahlensatzSchatten,
  svgStrahlensatzSpiegel,
  svgStrahlensatzV,
  svgStrahlensatzX,
} from './strahlensatzDiagrams';
import {
  formatSignedInt,
  latexBinomSquare,
  latexLinearFactorXMinus,
  latexStreckScheitel,
  svgParabolaScheitelform,
} from './quadratischeFunktionDiagrams';

export type PracticeAufgabe = { frage: string; loesung: string; diagram?: string };

export type RandomFn = () => number;

export const PYTHAGOREAN_TRIPLES: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
  [9, 40, 41],
  [10, 24, 26],
  [12, 16, 20],
  [20, 21, 29],
  [12, 35, 37],
  [15, 20, 25],
] as const;

/** Nur Pythagoras / Koordinaten / Sachkontext (Thema Geometrie). */
export const PYTHAGORAS_GENERATOR_IDS = [
  'seiten_hyp',
  'hypotenuse',
  'kathete',
  'erkennen',
  'abstand',
  'sachaufgabe',
] as const;

/** Nur rechtwinklige Trigonometrie (Thema Trigonometrie). */
export const TRIGONOMETRY_GENERATOR_IDS = [
  'trig_ratio',
  'trig_sin_seite',
  'trig_cos_seite',
  'trig_tan_seite',
  'trig_hyp_aus_gegen',
  'trig_winkel',
] as const;

/** Strahlensätze (V- und X-Figur, Schatten/Spiegel). */
export const STRAHLENSATZ_GENERATOR_IDS = [
  'strahl_zweiter_strecke',
  'strahl_erster_strahl',
  'strahl_x_strecke',
  'strahl_schatten',
  'strahl_spiegel_mast',
] as const;

/** Quadratische Funktionen (Scheitel, Nullstellen, Symmetrie). */
export const QUADRATIC_FUNCTION_GENERATOR_IDS = [
  'qf_scheitel_form',
  'qf_scheitel_gestreckt',
  'qf_nullstellen',
  'qf_funktionswert',
  'qf_oeffnung',
  'qf_symmetrieachse',
] as const;

export const PRACTICE_GENERATOR_IDS = [
  ...PYTHAGORAS_GENERATOR_IDS,
  ...TRIGONOMETRY_GENERATOR_IDS,
  ...STRAHLENSATZ_GENERATOR_IDS,
  ...QUADRATIC_FUNCTION_GENERATOR_IDS,
] as const;

export type PracticeGeneratorId = (typeof PRACTICE_GENERATOR_IDS)[number];

export type PracticeGeneratorMap = Record<PracticeGeneratorId, () => PracticeAufgabe>;

/** Extrahiert a, b, c aus einer „Ist es rechtwinklig?“-Frage. */
export function parseErkennenSeiten(frage: string): { a: number; b: number; c: number } | null {
  const m = frage.match(/\$a=(\d+)\$, \$b=(\d+)\$, \$c=(\d+)\$/);
  if (!m) return null;
  return { a: Number(m[1]), b: Number(m[2]), c: Number(m[3]) };
}

/** Prüft, ob Text und Geometrie zu „rechtwinklig ja/nein“ passen. */
export function validateErkennenAufgabe(auf: PracticeAufgabe): void {
  const sides = parseErkennenSeiten(auf.frage);
  if (!sides) throw new Error('erkennen: Frage nicht parsebar');
  const { a, b, c } = sides;
  const sum = a * a + b * b;
  const isRight = sum === c * c;
  const t = auf.loesung.trimStart();
  const saysJa = t.startsWith('Ja.');
  const saysNein = t.startsWith('Nein.');
  if (saysJa && saysNein) throw new Error('erkennen: Lösung widersprüchlich');
  if (isRight && saysNein) {
    throw new Error(`erkennen: rechtwinklig (${a},${b},${c}) aber Lösung beginnt mit „Nein.“`);
  }
  if (!isRight && saysJa) {
    throw new Error(`erkennen: nicht rechtwinklig (${a},${b},${c}) aber Lösung beginnt mit „Ja.“`);
  }
  if (isRight && !saysJa) {
    throw new Error(`erkennen: rechtwinklig (${a},${b},${c}) aber Lösung beginnt nicht mit „Ja.“`);
  }
  if (!isRight && !saysNein) {
    throw new Error(`erkennen: nicht rechtwinklig (${a},${b},${c}) aber Lösung beginnt nicht mit „Nein.“`);
  }
}

function makeHelpers(random: RandomFn) {
  function pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(random() * arr.length)]!;
  }
  function randInt(lo: number, hi: number): number {
    return Math.floor(random() * (hi - lo + 1)) + lo;
  }
  function shuffle<T>(arr: readonly T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [a[i], a[j]] = [a[j]!, a[i]!];
    }
    return a;
  }
  return { pick, randInt, shuffle };
}

/**
 * @param random — z. B. `Math.random` (ohne Klammern: Referenz auf Funktion)
 */
export function createPracticeGenerators(random: RandomFn): PracticeGeneratorMap {
  const { pick, randInt, shuffle } = makeHelpers(random);

  const GEN: PracticeGeneratorMap = {
    seiten_hyp() {
      const [a, b, c] = pick(PYTHAGOREAN_TRIPLES);
      const hyp = Math.max(a, b, c);
      const legs = [a, b, c].filter((x) => x !== hyp).sort((x, y) => x - y);
      const [u, v] = shuffle(legs);
      const order = shuffle([a, b, c]);
      const sumSq = u * u + v * v;
      return {
        frage: `In der Skizze ist ein rechtwinkliges Dreieck dargestellt. Zwei Seitenlängen sind $${u}$ und $${v}$; die Hypotenuse ist mit „?“ markiert und ihr Zahlenwert ist gesucht. Wie lang ist die Hypotenuse?`,
        loesung: `$${hyp}$ — die Hypotenuse liegt dem rechten Winkel gegenüber und ist die längste Seite; mit dem Satz des Pythagoras: $${u}^2+${v}^2=${sumSq}=${hyp}^2$.`,
        diagram: svgRightTriangleFromThreeLengths(order[0], order[1], order[2]),
      };
    },
    hypotenuse() {
      const [a, b, c] = pick(PYTHAGOREAN_TRIPLES);
      const x = random() < 0.5 ? a : b;
      const y = x === a ? b : a;
      return {
        frage: `In einem rechtwinkligen Dreieck sind die Katheten $a=${x}$ und $b=${y}$. Berechne die Hypotenuse $c$.`,
        loesung: `$c=\\sqrt{${x}^2+${y}^2}=\\sqrt{${x * x + y * y}}=${c}$`,
        diagram: svgRightTriangleKatheten(x, y, c, {
          horizontal: String(x),
          vertical: String(y),
          hypotenuse: '?',
        }),
      };
    },
    kathete() {
      const [a, b, c] = pick(PYTHAGOREAN_TRIPLES);
      const bek = random() < 0.5 ? a : b;
      const ges = bek === a ? b : a;
      return {
        frage: `Die Hypotenuse eines rechtwinkligen Dreiecks ist $c=${c}$, eine Kathete $a=${bek}$. Berechne die zweite Kathete $b$.`,
        loesung: `$b=\\sqrt{${c}^2-${bek}^2}=\\sqrt{${c * c - bek * bek}}=${ges}$`,
        diagram: svgRightTriangleKatheten(bek, ges, c, {
          horizontal: String(bek),
          vertical: '?',
          hypotenuse: String(c),
        }),
      };
    },
    erkennen() {
      const [a, b, c] = pick(PYTHAGOREAN_TRIPLES);
      const istRechtwinklig = random() < 0.5;
      const m = Math.max(a, b);
      const sum = a * a + b * b;
      let cNeu = c;
      if (!istRechtwinklig) {
        do {
          const delta = (random() < 0.5 ? 1 : -1) * randInt(1, 4);
          cNeu = c + delta;
          if (cNeu <= m) cNeu = m + randInt(2, 6);
        } while (sum === cNeu * cNeu);
      }
      const sq = cNeu * cNeu;
      const diagram = svgTriangleSSS(a, b, cNeu, {
        base: String(a),
        left: String(cNeu),
        right: String(b),
      });
      return {
        frage: `Ein Dreieck hat die Seiten $a=${a}$, $b=${b}$, $c=${cNeu}$. Ist es rechtwinklig?`,
        loesung: istRechtwinklig
          ? `Ja. $${a}^2+${b}^2=${sum}=${sq}=${cNeu}^2$.`
          : `Nein. $${a}^2+${b}^2=${sum}\\neq ${sq}=${cNeu}^2$ (kein Pythagoras mit Hypotenuse $c=${cNeu}$).`,
        ...(diagram ? { diagram } : {}),
      };
    },
    abstand() {
      const [dx, dy, d] = pick(PYTHAGOREAN_TRIPLES);
      const x1 = randInt(-4, 4);
      const y1 = randInt(-4, 4);
      const sx = random() < 0.5 ? 1 : -1;
      const sy = random() < 0.5 ? 1 : -1;
      const x2 = x1 + sx * dx;
      const y2 = y1 + sy * dy;
      return {
        frage: `Berechne den Abstand der Punkte $A(${x1}|${y1})$ und $B(${x2}|${y2})$.`,
        loesung: `$d=\\sqrt{(${x2}-${x1})^2+(${y2}-${y1})^2}=\\sqrt{${dx * dx}+${dy * dy}}=\\sqrt{${dx * dx + dy * dy}}=${d}$`,
        diagram: svgSegmentAbstand(x1, y1, x2, y2),
      };
    },
    sachaufgabe() {
      const [a, b, c] = pick(PYTHAGOREAN_TRIPLES);
      const szenen = [
        () => ({
          frage: `Eine Leiter ist $${c}\\,\\text{m}$ lang und steht $${a}\\,\\text{m}$ von der Wand entfernt. Wie hoch reicht sie an der Wand?`,
          loesung: `$h=\\sqrt{${c}^2-${a}^2}=\\sqrt{${c * c - a * a}}=${b}\\,\\text{m}$`,
          diagram: svgLadderAtWall(a, b, c, {
            horizontal: String(a),
            vertical: '?',
            hypotenuse: String(c),
          }),
        }),
        () => ({
          frage: `Ein Bildschirm ist $${a}\\,\\text{cm}$ breit und $${b}\\,\\text{cm}$ hoch. Wie lang ist die Bildschirmdiagonale?`,
          loesung: `$d=\\sqrt{${a}^2+${b}^2}=\\sqrt{${a * a + b * b}}=${c}\\,\\text{cm}$`,
          diagram: svgRectangleDiagonal(a, b, { diagonalLabel: '?' }),
        }),
        () => ({
          frage: `Ein Mast wird mit einem Seil verankert. Das Seil ist am Mast in $${a}\\,\\text{m}$ Höhe befestigt und am Boden $${b}\\,\\text{m}$ vom Mast entfernt. Wie lang ist das Seil?`,
          loesung: `$\\ell=\\sqrt{${a}^2+${b}^2}=\\sqrt{${a * a + b * b}}=${c}\\,\\text{m}$`,
          diagram: svgLadderAtWall(b, a, c, {
            horizontal: String(b),
            vertical: String(a),
            hypotenuse: '?',
          }),
        }),
        () => ({
          frage: `Ein rechteckiger Garten ist $${a}\\,\\text{m}$ lang und $${b}\\,\\text{m}$ breit. Wie lang ist der Weg quer über die Diagonale?`,
          loesung: `$d=\\sqrt{${a}^2+${b}^2}=\\sqrt{${a * a + b * b}}=${c}\\,\\text{m}$`,
          diagram: svgRectangleDiagonal(a, b, { diagonalLabel: '?' }),
        }),
      ];
      return pick(szenen)();
    },
    trig_ratio() {
      const [a, b, c] = pick(PYTHAGOREAN_TRIPLES);
      const typ = pick(['sin', 'cos', 'tan'] as const);
      const fn = typ === 'sin' ? '\\sin' : typ === 'cos' ? '\\cos' : '\\tan';
      const frage = `In einem rechtwinkligen Dreieck ist die Hypotenuse $c=${c}$ und die Katheten $a=${a}$ und $b=${b}$. Der rechte Winkel liegt zwischen den Katheten. Berechne $${fn}(\\alpha)$, wenn $\\alpha$ die Ecke ist, an der die Kathete $${a}$ und die Hypotenuse zusammentreffen.`;
      const sinVal = `\\frac{${b}}{${c}}`;
      const cosVal = `\\frac{${a}}{${c}}`;
      const tanVal = `\\frac{${b}}{${a}}`;
      let loesung: string;
      if (typ === 'sin') loesung = `$\\sin(\\alpha)=${sinVal}$`;
      else if (typ === 'cos') loesung = `$\\cos(\\alpha)=${cosVal}$`;
      else loesung = `$\\tan(\\alpha)=${tanVal}$`;
      return {
        frage,
        loesung,
        diagram: svgRightTriangleKatheten(
          a,
          b,
          c,
          { horizontal: String(a), vertical: String(b), hypotenuse: String(c) },
          { markAngleAlphaAtHorizontalTip: true }
        ),
      };
    },
    trig_sin_seite() {
      const h = 2 * randInt(4, 12);
      const x = h / 2;
      return {
        frage: `Ein rechtwinkliges Dreieck hat die Hypotenuse $h=${h}$. Ein spitzer Winkel beträgt $30^\\circ$. Wie lang ist die Gegenkathete zu diesem Winkel?`,
        loesung: `$\\sin(30^\\circ)=\\tfrac12$, also $x=h\\cdot\\sin(30^\\circ)=${h}\\cdot\\tfrac12=${x}$`,
        diagram: svgTrigSin30Hyp(h),
      };
    },
    trig_cos_seite() {
      const h = 2 * randInt(4, 12);
      const x = h / 2;
      return {
        frage: `Hypotenuse $h=${h}$, ein spitzer Winkel $60^\\circ$. Gesucht ist die Ankathete zu diesem Winkel.`,
        loesung: `$\\cos(60^\\circ)=\\tfrac12$, also $x=h\\cdot\\cos(60^\\circ)=${h}\\cdot\\tfrac12=${x}$`,
        diagram: svgTrigCos60Hyp(h),
      };
    },
    trig_tan_seite() {
      const a = randInt(3, 12);
      return {
        frage: `Ein spitzer Winkel ist $45^\\circ$, die Ankathete zu diesem Winkel ist $${a}$. Wie lang ist die Gegenkathete?`,
        loesung: `$\\tan(45^\\circ)=1$, also Gegenkathete $=${a}$`,
        diagram: svgTrigTan45Leg(a),
      };
    },
    trig_hyp_aus_gegen() {
      const g = randInt(3, 11);
      const h = 2 * g;
      return {
        frage: `Ein spitzer Winkel beträgt $30^\\circ$, die Gegenkathete ist $${g}$. Berechne die Hypotenuse $h$.`,
        loesung: `$\\sin(30^\\circ)=\\frac{${g}}{h}=\\tfrac12 \\Rightarrow h=\\frac{${g}}{\\frac12}=${h}$`,
        diagram: svgTrigGkHyp30(g, h, { gesuchtHypotenuse: true }),
      };
    },
    trig_winkel() {
      if (random() < 0.55) {
        const k = randInt(2, 10);
        const g = k;
        const h = 2 * k;
        return {
          frage: `Gegenkathete $${g}$, Hypotenuse $${h}$ (bezogen auf denselben spitzen Winkel $\\alpha$). Wie groß ist $\\alpha$?`,
          loesung: `$\\sin(\\alpha)=\\frac{${g}}{${h}}=\\tfrac12$, also $\\alpha=30^\\circ$`,
          diagram: svgTrigGkHyp30(g, h),
        };
      }
      const s = randInt(3, 11);
      return {
        frage: `Gegenkathete und Ankathete zu $\\alpha$ sind beide $${s}$. Wie groß ist der spitze Winkel $\\alpha$?`,
        loesung: `$\\tan(\\alpha)=\\frac{${s}}{${s}}=1$, also $\\alpha=45^\\circ$`,
        diagram: svgTrigTan45Leg(s),
      };
    },
    strahl_zweiter_strecke() {
      const za = pick([2, 3, 4, 5] as const);
      const k = pick([2, 3, 4, 5] as const);
      const zap = za * k;
      const ab = randInt(2, 9);
      const apBp = ab * k;
      return {
        frage: `Zwei Strahlen gehen von einem Punkt $Z$ aus. Auf dem ersten Strahl liegen $A$ und $A'$ mit $|ZA|=${za}$ und $|ZA'|=${zap}$ (in derselben Reihenfolge von $Z$ aus). Die Strecke $\\overline{AB}$ verbindet die beiden Strahlen und ist parallel zu $\\overline{A'B'}$. Es gilt $|AB|=${ab}$. Wie lang ist $|A'B'|$?`,
        loesung: `$\\displaystyle\\frac{|ZA|}{|ZA'|}=\\frac{|AB|}{|A'B'|}\\Rightarrow |A'B'|=|AB|\\cdot\\frac{|ZA'|}{|ZA|}=${ab}\\cdot\\frac{${zap}}{${za}}=${apBp}$ (zweiter Strahlensatz / Strecken an den Parallelen).`,
        diagram: svgStrahlensatzV({
          zA: za,
          zAp: zap,
          labelAB: String(ab),
          labelApBp: '?',
        }),
      };
    },
    strahl_erster_strahl() {
      const za = pick([2, 3, 4] as const);
      const k = pick([3, 4, 5, 6] as const);
      const zap = za * k;
      const zb = randInt(2, 8);
      const zbp = zb * k;
      return {
        frage: `Zwei Strahlen von $Z$ aus: auf dem ersten Strahl $|ZA|=${za}$, $|ZA'|=${zap}$; auf dem zweiten Strahl $|ZB|=${zb}$. Die Verbindungsstrecken $AB$ und $A'B'$ sind parallel. Wie lang ist $|ZB'|$?`,
        loesung: `$\\displaystyle\\frac{|ZA|}{|ZA'|}=\\frac{|ZB|}{|ZB'|}\\Rightarrow |ZB'|=|ZB|\\cdot\\frac{|ZA'|}{|ZA|}=${zb}\\cdot\\frac{${zap}}{${za}}=${zbp}$ (erster Strahlensatz / Strecken auf den Strahlen).`,
        diagram: svgStrahlensatzV({
          zA: za,
          zAp: zap,
        }),
      };
    },
    strahl_x_strecke() {
      const zs1 = pick([2, 3, 4] as const);
      const k = pick([2, 3, 4, 5] as const);
      const zs2 = zs1 * k;
      const p1 = randInt(3, 10);
      const p2 = p1 * k;
      return {
        frage: `Zwei Geraden schneiden sich in $Z$. Eine Parallele schneidet die Geraden in $S_1$ und $T_1$ mit $|ZS_1|=${zs1}$. Eine zweite, dazu parallele Gerade schneidet die Geraden – auf der anderen Seite von $Z$ – in $S_2$ und $T_2$ mit $|ZS_2|=${zs2}$. Die obere Strecke $|S_1T_1|=${p1}\\,\\text{LE}$. Wie lang ist $|S_2T_2|$?`,
        loesung: `In der X-Konfiguration gilt $\\displaystyle\\frac{|ZS_1|}{|ZS_2|}=\\frac{|S_1T_1|}{|S_2T_2|}$, hier $\\frac{${zs1}}{${zs2}}=\\frac{${p1}}{|S_2T_2|}\\Rightarrow |S_2T_2|=${p1}\\cdot ${k}=${p2}\\,\\text{LE}$.`,
        diagram: svgStrahlensatzX({
          zS1: zs1,
          zS2: zs2,
          labelS1: `${p1} LE`,
          labelS2: '?',
        }),
      };
    },
    strahl_schatten() {
      const g = pick([2, 3, 4, 5] as const);
      const sStab = pick([1, 2, 3] as const);
      const sTurm = sStab * g;
      const hStab = randInt(1, 3);
      const hTurm = hStab * g;
      return {
        frage: `Ein vertikaler Stab der Höhe $${hStab}\\,\\text{m}$ wirft einen waagrechten Schatten der Länge $${sStab}\\,\\text{m}$. Ein Turm wirft zur gleichen Zeit einen Schatten von $${sTurm}\\,\\text{m}$ (gleiche Sonnenrichtung). Wie hoch ist der Turm?`,
        loesung: `$\\displaystyle\\frac{h_{\\text{Turm}}}{${sTurm}}=\\frac{${hStab}}{${sStab}}\\Rightarrow h_{\\text{Turm}}=${hStab}\\cdot\\frac{${sTurm}}{${sStab}}=${hTurm}\\,\\text{m}$ (ähnliche Dreiecke / Strahlensatz).`,
        diagram: svgStrahlensatzSchatten({ hStab, sStab, hTurm, sTurm }),
      };
    },
    strahl_spiegel_mast() {
      let a = 2;
      let b = 4;
      let hAuge = 16;
      for (let t = 0; t < 30; t++) {
        a = randInt(2, 5);
        b = randInt(2, 10);
        hAuge = pick([12, 15, 16, 18, 20] as const);
        if ((hAuge * (a + b)) % a === 0) break;
      }
      const hMast = (hAuge * (a + b)) / a;
      return {
        frage: `Du siehst die Spitze eines Mastes im Spiegel, der $${a}\\,\\text{m}$ vor deinen Füßen liegt. Du stehst $${b}\\,\\text{m}$ hinter dem Spiegel (in einer Linie mit Mast und Spiegel). Deine Augenhöhe beträgt etwa $${hAuge}\\,\\text{dm}$. Wie hoch ist der Mast (in dm), wenn Spiegel und Boden waagrecht sind?`,
        loesung: `Einfallswinkel = Ausfallswinkel; es entstehen ähnliche Dreiecke: $\\displaystyle\\frac{h_{\\text{Mast}}}{${a}+${b}}=\\frac{${hAuge}}{${a}}\\Rightarrow h_{\\text{Mast}}=${hMast}\\,\\text{dm}$.`,
        diagram: svgStrahlensatzSpiegel({ a, b, hAuge, hMast }),
      };
    },
    qf_scheitel_form() {
      const p = randInt(-2, 4);
      const q = randInt(-3, 4);
      const inner = latexBinomSquare(p);
      return {
        frage: `Bestimme den Scheitelpunkt der Parabel $f(x)=${inner}${formatSignedInt(q)}$.`,
        loesung: `In der Scheitelpunktform $f(x)=(x-p)^2+q$ ist der Scheitel $S(p|q)$, hier $S(${p}|${q})$.`,
        diagram: svgParabolaScheitelform({ a: 1, p, q }),
      };
    },
    qf_scheitel_gestreckt() {
      const a = pick([-2, -1, 1, 2] as const);
      const p = randInt(-2, 3);
      const q = randInt(-3, 3);
      const expr = latexStreckScheitel(a, p, q);
      const oeffnung = a > 0 ? 'nach oben' : 'nach unten';
      return {
        frage: `Lies Scheitelpunkt und Öffnung der Parabel $f(x)=${expr}$ ab.`,
        loesung: `Scheitel $S(${p}|${q})$, Streckungsfaktor $a=${a}$, Parabel ist ${oeffnung} geöffnet.`,
        diagram: svgParabolaScheitelform({ a, p, q }),
      };
    },
    qf_nullstellen() {
      let u = 0;
      let v = 0;
      for (let t = 0; t < 20; t++) {
        u = randInt(-3, 4);
        v = randInt(-3, 4);
        if (u !== v) break;
      }
      const p = (u + v) / 2;
      const q = -0.25 * (u - v) * (u - v);
      const fac = `${latexLinearFactorXMinus(u)}${latexLinearFactorXMinus(v)}`;
      return {
        frage: `Bestimme alle reellen Nullstellen von $f(x)=${fac}$.`,
        loesung: `Aus $${fac}=0$ folgt $\\mathbb{L}=\\{${Math.min(u, v)};\\,${Math.max(u, v)}\\}$.`,
        diagram: svgParabolaScheitelform({ a: 1, p, q, roots: [u, v] }),
      };
    },
    qf_funktionswert() {
      let u = 0;
      let v = 0;
      for (let t = 0; t < 20; t++) {
        u = randInt(-3, 4);
        v = randInt(-3, 4);
        if (u !== v) break;
      }
      const candidates = [-2, -1, 0, 1, 2, 3, 4, 5].filter((x) => x !== u && x !== v);
      const t = pick(candidates);
      const f = (t - u) * (t - v);
      const p = (u + v) / 2;
      const q = -0.25 * (u - v) * (u - v);
      const fac = `${latexLinearFactorXMinus(u)}${latexLinearFactorXMinus(v)}`;
      return {
        frage: `Es sei $f(x)=${fac}$. Berechne $f(${t})$.`,
        loesung: `$f(${t})=(${t}${formatSignedInt(-u)})(${t}${formatSignedInt(-v)})=${t - u}\\cdot${t - v}=${f}$`,
        diagram: svgParabolaScheitelform({ a: 1, p, q, roots: [u, v] }),
      };
    },
    qf_oeffnung() {
      const a = pick([-3, -2, -1, 1, 2, 3] as const);
      const q0 = randInt(1, 6);
      return {
        frage: `Ist die Parabel $f(x)=${a}x^2+${q0}$ nach oben oder nach unten geöffnet?`,
        loesung: `Der Koeffizient vor $x^2$ ist $a=${a}$. ${a > 0 ? 'Da $a>0$, ist die Parabel nach oben geöffnet.' : 'Da $a<0$, ist die Parabel nach unten geöffnet.'}`,
        diagram: svgParabolaScheitelform({ a, p: 0, q: q0 }),
      };
    },
    qf_symmetrieachse() {
      const symPairs: [number, number][] = [];
      for (let i = -4; i <= 4; i++) {
        for (let j = -4; j <= 4; j++) {
          if (i !== j && (i + j) % 2 === 0) symPairs.push([i, j]);
        }
      }
      const [u, v] = pick(symPairs);
      const b = -(u + v);
      const c = u * v;
      const axis = (u + v) / 2;
      return {
        frage: `Gib die Gleichung der Symmetrieachse der Parabel $f(x)=x^2${formatSignedInt(b)}x${formatSignedInt(c)}$.`,
        loesung: `Für $f(x)=x^2+bx+c$ ist die Symmetrieachse $x=-\\frac{b}{2}$. Hier $b=${b}$, also $x=-\\frac{${b}}{2}=${axis}$.`,
        diagram: svgParabolaScheitelform({ a: 1, p: axis, q: -0.25 * (u - v) * (u - v), roots: [u, v] }),
      };
    },
  };

  return GEN;
}
