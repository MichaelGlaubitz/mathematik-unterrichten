/**
 * Zufallsaufgaben für alle Whiteboard-/Massenübungs-Routen unter `/uebung/*`
 * (siehe `MassenuebungGeo.astro`): Geometrie, Brüche, Algebra, Gleichungen usw.
 * Reine Logik, testbar mit injizierbarem PRNG.
 *
 * Historischer Dateiname: `pythagorasPracticeGenerators.ts` (ursprünglich nur Pythagoras).
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
import { svgKreisRadiusDurchmesser, svgKreisSektor, svgKreisTangente } from './kreisgeometrieDiagrams';
import {
  svgZahlenstrahlSprung,
  svgZahlenstrahlZweiWerte,
} from './negativeZahlenDiagrams';
import {
  svgBruchErweiternKacheln,
  svgBruchMalRaster,
  svgBruchStreifen,
  svgBruchVergleichAusgangsstreifen,
  svgBruchVergleichZweiRiegel,
  svgBruchZweiStreifen,
} from './bruchrechnungDiagrams';
import { svgLineareGleichungSchnittpunkt } from './lineareGleichungDiagrams';
import { svgDistributivFlaeche } from './algebraDiagrams';
import { FUN_GRAPH_AXIS_RANGE_MAX } from './functionGraphStyle';

/** Schnittpunkte mit x- und y-Achse bei automatisch erzeugten Funktionsgraphen: gleicher Rahmen wie Achsen-Ticks (`FUN_GRAPH_AXIS_RANGE_MAX`). */
export const FUN_GRAPH_AXIS_INTERCEPT_MAX = FUN_GRAPH_AXIS_RANGE_MAX;

/** Prüft $y=mx+n$: existierende Achsenschnitte $(0|n)$ und $(-n/m|0)$ liegen in $[-A,A]$ (waagrechte Gerade $m=0$: nur $(0|n)$). */
export function funGraphLinearAxisInterceptsInRange(m: number, n: number): boolean {
  const A = FUN_GRAPH_AXIS_INTERCEPT_MAX;
  if (Math.abs(n) > A) return false;
  if (Math.abs(m) < 1e-12) return true;
  return Math.abs(-n / m) <= A;
}

function funGraphScheitelYInterceptInRange(a: number, p: number, q: number): boolean {
  return Math.abs(a * p * p + q) <= FUN_GRAPH_AXIS_INTERCEPT_MAX;
}

export type PracticeAufgabe = {
  frage: string;
  loesung: string;
  /**
   * Wenn wahr: Lösung ohne farbigen Lösungskasten — direkt an die Frage (Whiteboard) bzw. schlicht im
   * „Lösung zeigen“-Bereich (Arbeitsblatt), z. B. Rechenweg `\\frac{a}{d}+\\frac{b}{d}=…`.
   */
  loesungInlineNachFrage?: boolean;
  /** Skizze zur Aufgabenstellung (bei Malaufgaben ohne markante Produktfläche im Raster). */
  diagram?: string;
  /** Optional: Skizze mit vollständiger Markierung — z. B. in „Lösung zeigen“. */
  diagramLoesung?: string;
  /**
   * Wenn wahr: Skizze zur Aufgabe ist zunächst ausgeblendet, auch wenn „Grafiken anzeigen“ aktiv ist
   * (Bruchmultiplikation: Raster erst nach „Skizze einblenden“; Größenvergleich: keine Streifen zuerst).
   */
  diagramDefaultHidden?: boolean;
  /**
   * Optional: Fragestellung mit Zusatzmarkierung, sobald die Lösung sichtbar ist (z. B. grüner Rahmen
   * beim größeren Bruch bei `br_vergleich`). `frage` bleibt neutral bis dahin.
   */
  frageMitLoesungHighlight?: string;
};

/**
 * Lösung ohne farbigen Lösungskasten: direkt an die Frage (Whiteboard) bzw. ohne Kasten im Detail (Arbeitsblatt).
 * U.a. ganze Zahlen (nz_add/nz_sub) und gleichnamige Brüche (br_add_like/br_sub_like).
 */
export function practiceAufgabeHatLoesungInlineNachFrage(a: PracticeAufgabe): boolean {
  if (a.loesungInlineNachFrage === true) return true;
  const f = a.frage;
  if (f.startsWith('Berechne die Summe ') || f.startsWith('Berechne die Differenz ')) return true;
  /* Gespeicherte Routen ohne Flag: gleichnamige Brüche (Frage „Berechne $\displaystyle\frac…+\frac…$“) */
  if (f.startsWith('Berechne $') && (f.includes('}+\\frac{') || f.includes('}-\\frac{'))) return true;
  return false;
}

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

/** Quadratische Gleichungen (Nullprodukt, Faktorisieren, Lösungsanzahl). */
export const QUADRATIC_EQUATIONS_GENERATOR_IDS = [
  'qg_faktorform',
  'qg_ausklammern',
  'qg_binomisch',
  'qg_differenz_von_quadraten',
  'qg_auf_null_bringen',
  'qg_anzahl_loesungen',
] as const;

/** Bruchrechnung (Grundschule / sek. I Einstieg): Addition, kürzen, erweitern, Malnehmen, Vergleich. */
export const BRUCHRECHNUNG_GENERATOR_IDS = [
  'br_add_like',
  'br_sub_like',
  'br_erweitern',
  'br_kuerzen',
  'br_mul_frac',
  'br_vergleich',
] as const;

/** Ganze Zahlen & Vorzeichen (Klasse 7). */
export const NEGATIVE_ZAHLEN_GENERATOR_IDS = [
  'nz_add',
  'nz_sub',
  'nz_mul',
  'nz_div',
  'nz_vergleich',
  'nz_klammer_punkt_vor_strich',
] as const;

/** Algebra: Klammern, Distributivgesetz, Terme (Klasse 7–8). */
export const ALGEBRA_GENERATOR_IDS = [
  'alg_klammer_mal',
  'alg_minus_klammer_plus',
  'alg_ausklammern',
  'alg_klammer_weg',
  'alg_terme_zusammen',
  'alg_distributiv_zahl',
] as const;

/** Lineare Gleichungen in einer Variablen (Klasse 7–8). */
export const LINEARE_GLEICHUNGEN_GENERATOR_IDS = [
  'lg_x_plus_a_eq_b',
  'lg_ax_eq_b',
  'lg_ax_plus_b_eq_c',
  'lg_ax_plus_b_eq_cx_plus_d',
  'lg_klammer_linear',
  'lg_bruch_linear',
] as const;

/** Prozentrechnung (Grundwert, Prozentwert, Prozentsatz, Faktor, vor-/rueckwaerts). */
export const PROZENTRECHNUNG_GENERATOR_IDS = [
  'pr_prozentwert',
  'pr_prozentsatz',
  'pr_grundwert',
  'pr_vermehrungsfaktor',
  'pr_reduzierter_preis',
  'pr_ausgangswert_nach_erhoehung',
] as const;

/** Stochastik (Lageparameter und einfache Wahrscheinlichkeiten). */
export const STOCHASTIK_GENERATOR_IDS = [
  'st_mittelwert_median',
  'st_ausreisser_effekt',
  'st_wuerfelsumme_sieben',
  'st_mindestens_einmal',
  'st_unmoeglich_sicher',
  'st_erwartungswert_muenzwurf',
] as const;

/** Binomische Formeln (ausmultiplizieren und faktorisieren). */
export const BINOMISCHE_FORMELN_GENERATOR_IDS = [
  'bf_erste_formel',
  'bf_zweite_formel',
  'bf_dritte_formel',
  'bf_faktorisieren_quadrat',
  'bf_faktorisieren_diff',
  'bf_ausmultiplizieren_mit_zahl',
] as const;

/** Lineare Funktionen (Steigung, Achsenabschnitt, Nullstelle, Parallelitaet). */
export const LINEARE_FUNKTIONEN_GENERATOR_IDS = [
  'lf_gerade_m_b',
  'lf_steigung_aus_punkten',
  'lf_nullstelle',
  'lf_parallel',
  'lf_funktionswert',
  'lf_achsenabschnitt',
] as const;

/** Lineare Gleichungssysteme in zwei Variablen. */
export const LINEARE_GLEICHUNGSSYSTEME_GENERATOR_IDS = [
  'lgs_addition',
  'lgs_einsetzen',
  'lgs_gleichsetzen',
  'lgs_keine_loesung',
  'lgs_unendlich_viele',
  'lgs_schnittpunkt',
] as const;

/** Termumformungen bei Bruchtermen. */
export const TERMUMFORMUNGEN_GENERATOR_IDS = [
  'tu_kuerzen_faktor',
  'tu_nicht_kuerzbar_summe',
  'tu_definitionsmenge',
  'tu_addition',
  'tu_multiplikation',
  'tu_hauptnenner',
] as const;

/** Exponentialfunktionen (Wachstum/Zerfall, Parameter und einfache Gleichungen). */
export const EXPONENTIALFUNKTIONEN_GENERATOR_IDS = [
  'exp_wachstum_oder_zerfall',
  'exp_parameter',
  'exp_funktionswert',
  'exp_faktor_aus_prozent',
  'exp_verdopplung_halbierung',
  'exp_einfache_gleichung',
] as const;

/** Logarithmen (Umkehrung, Regeln, Basiswechsel). */
export const LOGARITHMEN_GENERATOR_IDS = [
  'log_basis_zwei',
  'log_zehner_differenz',
  'log_exponentialgleichung',
  'log_eins',
  'log_basiswechsel',
  'log_produktregel',
] as const;

/** Bruchgleichungen (Definitionsmenge, Hauptnenner, Kreuzprodukt). */
export const FRACTION_EQUATION_GENERATOR_IDS = [
  'bg_definitionsmenge',
  'bg_einfach_linear',
  'bg_hauptnenner',
  'bg_kreuzprodukt',
  'bg_ausgeschlossene_loesung',
  'bg_keine_loesung',
] as const;

/** Wurzelrechnung (Vereinfachen, Fehlvorstellungen, einfache Gleichungen). */
export const ROOT_GENERATOR_IDS = [
  'wr_vereinfachen',
  'wr_add_sub',
  'wr_fehlschluss_summe',
  'wr_gleichung_quadrat',
  'wr_betrag',
  'wr_keine_reelle',
] as const;

/** Kreisgeometrie (Radius, Durchmesser, Umfang, Fläche, Sektor, Tangente). */
export const CIRCLE_GEOMETRY_GENERATOR_IDS = [
  'kg_radius_zu_durchmesser',
  'kg_durchmesser_zu_radius',
  'kg_umfang',
  'kg_flaeche',
  'kg_sektor_anteil',
  'kg_tangente_rechtwinklig',
] as const;

export const PRACTICE_GENERATOR_IDS = [
  ...PYTHAGORAS_GENERATOR_IDS,
  ...TRIGONOMETRY_GENERATOR_IDS,
  ...STRAHLENSATZ_GENERATOR_IDS,
  ...QUADRATIC_FUNCTION_GENERATOR_IDS,
  ...QUADRATIC_EQUATIONS_GENERATOR_IDS,
  ...BRUCHRECHNUNG_GENERATOR_IDS,
  ...NEGATIVE_ZAHLEN_GENERATOR_IDS,
  ...ALGEBRA_GENERATOR_IDS,
  ...LINEARE_GLEICHUNGEN_GENERATOR_IDS,
  ...PROZENTRECHNUNG_GENERATOR_IDS,
  ...STOCHASTIK_GENERATOR_IDS,
  ...BINOMISCHE_FORMELN_GENERATOR_IDS,
  ...LINEARE_FUNKTIONEN_GENERATOR_IDS,
  ...LINEARE_GLEICHUNGSSYSTEME_GENERATOR_IDS,
  ...TERMUMFORMUNGEN_GENERATOR_IDS,
  ...EXPONENTIALFUNKTIONEN_GENERATOR_IDS,
  ...LOGARITHMEN_GENERATOR_IDS,
  ...FRACTION_EQUATION_GENERATOR_IDS,
  ...ROOT_GENERATOR_IDS,
  ...CIRCLE_GEOMETRY_GENERATOR_IDS,
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

  function gcd(a: number, b: number): number {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  }

  function texSubtrahend(b: number): string {
    return b >= 0 ? String(b) : `(${b})`;
  }
  function texMulFactor(n: number): string {
    return n < 0 ? `(${n})` : String(n);
  }

  function linTerm(coeff: number, v = 'x'): string {
    if (coeff === 0) return '0';
    if (coeff === 1) return v;
    if (coeff === -1) return `-${v}`;
    return `${coeff}${v}`;
  }

  function linBinom(a: number, b: number, v = 'x'): string {
    const t = linTerm(a, v);
    if (b === 0) return t;
    return `${t}${formatSignedInt(b)}`;
  }

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
      let p = 0;
      let q = 0;
      for (let t = 0; t < 40; t++) {
        p = randInt(-2, 4);
        q = randInt(-3, 4);
        if (funGraphScheitelYInterceptInRange(1, p, q)) break;
      }
      if (!funGraphScheitelYInterceptInRange(1, p, q)) {
        p = 0;
        q = 0;
      }
      const inner = latexBinomSquare(p);
      return {
        frage: `Bestimme den Scheitelpunkt der Parabel $f(x)=${inner}${formatSignedInt(q)}$.`,
        loesung: `In der Scheitelpunktform $f(x)=(x-p)^2+q$ ist der Scheitel $S(p|q)$, hier $S(${p}|${q})$.`,
        diagram: svgParabolaScheitelform({ a: 1, p, q }),
      };
    },
    qf_scheitel_gestreckt() {
      let a = 1;
      let p = 0;
      let q = 0;
      for (let t = 0; t < 40; t++) {
        a = pick([-2, -1, 1, 2] as const);
        p = randInt(-2, 3);
        q = randInt(-3, 3);
        if (funGraphScheitelYInterceptInRange(a, p, q)) break;
      }
      if (!funGraphScheitelYInterceptInRange(a, p, q)) {
        a = 1;
        p = 0;
        q = 0;
      }
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
      for (let t = 0; t < 40; t++) {
        u = randInt(-8, 8);
        v = randInt(-8, 8);
        if (u === v) continue;
        if (Math.abs(u * v) > FUN_GRAPH_AXIS_INTERCEPT_MAX) continue;
        break;
      }
      if (u === v || Math.abs(u * v) > FUN_GRAPH_AXIS_INTERCEPT_MAX) {
        u = 1;
        v = -1;
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
      for (let t = 0; t < 40; t++) {
        u = randInt(-8, 8);
        v = randInt(-8, 8);
        if (u === v) continue;
        if (Math.abs(u * v) > FUN_GRAPH_AXIS_INTERCEPT_MAX) continue;
        break;
      }
      if (u === v || Math.abs(u * v) > FUN_GRAPH_AXIS_INTERCEPT_MAX) {
        u = 1;
        v = -1;
      }
      const candidates = Array.from({ length: 2 * FUN_GRAPH_AXIS_INTERCEPT_MAX + 1 }, (_, i) => i - FUN_GRAPH_AXIS_INTERCEPT_MAX).filter(
        (x) => x !== u && x !== v
      );
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
          if (i !== j && (i + j) % 2 === 0 && Math.abs(i * j) <= FUN_GRAPH_AXIS_INTERCEPT_MAX) symPairs.push([i, j]);
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
    qg_faktorform() {
      let u = 0;
      let v = 0;
      for (let t = 0; t < 20; t++) {
        u = randInt(-6, 6);
        v = randInt(-6, 6);
        if (u !== v) break;
      }
      const fac = `${latexLinearFactorXMinus(u)}${latexLinearFactorXMinus(v)}`;
      return {
        frage: `Löse die Gleichung $${fac}=0$.`,
        loesung: `Nach dem Satz vom Nullprodukt: ${latexLinearFactorXMinus(u)}=0 oder ${latexLinearFactorXMinus(v)}=0, also $x=${u}$ oder $x=${v}$.`,
      };
    },
    qg_ausklammern() {
      const r = randInt(-9, 9) || 5;
      const b = -r;
      return {
        frage: `Löse die Gleichung $x^2${formatSignedInt(b)}x=0$.`,
        loesung: `Ausklammern: $x(x${formatSignedInt(b)})=0$. Damit $x_1=0$ oder $x_2=${r}$.`,
      };
    },
    qg_binomisch() {
      const p = randInt(-8, 8) || 3;
      const b = -2 * p;
      const c = p * p;
      return {
        frage: `Löse die Gleichung $x^2${formatSignedInt(b)}x${formatSignedInt(c)}=0$.`,
        loesung: `Binomische Formel: $(x${formatSignedInt(-p)})^2=0$. Daher doppelte Lösung $x=${p}$.`,
      };
    },
    qg_differenz_von_quadraten() {
      const a = randInt(2, 9);
      return {
        frage: `Löse die Gleichung $x^2-${a * a}=0$.`,
        loesung: `Differenz von Quadraten: $(x-${a})(x+${a})=0$. Also $x_1=${a}$ und $x_2=${-a}$.`,
      };
    },
    qg_auf_null_bringen() {
      const r = randInt(-8, 8) || 4;
      const s = randInt(-8, 8) || -1;
      const b = r + s;
      const c = -r * s;
      return {
        frage: `Löse die Gleichung $x^2${formatSignedInt(b)}x=${-c}$.`,
        loesung: `Auf Null bringen: $x^2${formatSignedInt(b)}x${formatSignedInt(c)}=0=(x${formatSignedInt(-r)})(x${formatSignedInt(-s)})$. Also $x=${r}$ oder $x=${s}$.`,
      };
    },
    qg_anzahl_loesungen() {
      const k = randInt(1, 9);
      return {
        frage: `Wie viele reelle Lösungen hat die Gleichung $x^2+${k}=0$?`,
        loesung: `Keine reelle Lösung, denn $x^2=-${k}$ ist in $\\mathbb{R}$ unmöglich.`,
      };
    },
    bg_definitionsmenge() {
      const a = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6] as const);
      const b = randInt(-5, 8);
      return {
        frage: `Bestimme die Definitionsmenge der Bruchgleichung $\\displaystyle\\frac{x${formatSignedInt(b)}}{x${formatSignedInt(-a)}}=2$.`,
        loesung: `Nenner darf nicht $0$ sein: $x${formatSignedInt(-a)}\\neq 0 \\Rightarrow x\\neq ${a}$. Also $D=\\mathbb{R}\\setminus\\{${a}\\}$.`,
      };
    },
    bg_einfach_linear() {
      const a = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5] as const);
      const d = pick([2, 3, 4, 5, 6] as const);
      const x = a + d;
      return {
        frage: `Löse die Bruchgleichung $\\displaystyle\\frac{1}{x${formatSignedInt(-a)}}=\\frac{1}{${d}}$.`,
        loesung: `Mit $x\\neq ${a}$ gilt nach Multiplikation mit $${d}(x${formatSignedInt(-a)})$: $x${formatSignedInt(-a)}=${d}$, also $x=${x}$.`,
      };
    },
    bg_hauptnenner() {
      const a = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5] as const);
      const d = pick([2, 3, 4, 5] as const);
      const x = a + d;
      return {
        frage: `Löse die Bruchgleichung $\\displaystyle\\frac{1}{x${formatSignedInt(-a)}}+\\frac{1}{x${formatSignedInt(-a)}}=\\frac{2}{${d}}$.`,
        loesung: `Hauptnenner $x${formatSignedInt(-a)}$ (mit $x\\neq ${a}$): $\\frac{2}{x${formatSignedInt(-a)}}=\\frac{2}{${d}}\\Rightarrow x${formatSignedInt(-a)}=${d}\\Rightarrow x=${x}$.`,
      };
    },
    bg_kreuzprodukt() {
      let a = 1;
      let b = 3;
      let x = 0;
      let m = 2;
      let n = 3;
      for (let t = 0; t < 80; t++) {
        a = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5] as const);
        b = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5] as const);
        if (a === b) continue;
        x = randInt(-3, 8);
        if (x === a || x === b) continue;
        m = randInt(1, 4);
        const den = x - a;
        const num = m * (x - b);
        if (num % den !== 0) continue;
        n = num / den;
        if (n === 0 || Math.abs(n) > 9) continue;
        break;
      }
      return {
        frage: `Löse die Bruchgleichung $\\displaystyle\\frac{${m}}{x${formatSignedInt(-a)}}=\\frac{${n}}{x${formatSignedInt(-b)}}$.`,
        loesung: `Einschränkung: $x\\neq ${a},\\,x\\neq ${b}$. Kreuzprodukt: $${m}(x${formatSignedInt(-b)})=${n}(x${formatSignedInt(-a)})$. Daraus folgt $x=${x}$.`,
      };
    },
    bg_ausgeschlossene_loesung() {
      const a = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5] as const);
      return {
        frage: `Löse die Bruchgleichung $\\displaystyle\\frac{x${formatSignedInt(-a)}}{x${formatSignedInt(-a)}}=2$.`,
        loesung: `Definitionsmenge: $x\\neq ${a}$. Der Term links ist für alle erlaubten $x$ gleich $1$ und kann nie $2$ sein. Also keine Lösung ($\\mathbb{L}=\\varnothing$).`,
      };
    },
    bg_keine_loesung() {
      const a = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6] as const);
      return {
        frage: `Löse die Bruchgleichung $\\displaystyle\\frac{1}{x${formatSignedInt(-a)}}=0$.`,
        loesung: `Ein Bruch mit Zähler $1$ kann nie $0$ sein. Mit $x\\neq ${a}$ gibt es daher keine Lösung ($\\mathbb{L}=\\varnothing$).`,
      };
    },
    br_add_like() {
      const d = pick([5, 6, 7, 8, 9, 10] as const);
      const a = randInt(1, d - 2);
      const b = randInt(1, d - a);
      const s = a + b;
      const g = gcd(s, d);
      const voll =
        g === 1
          ? `$\\displaystyle\\frac{${a}}{${d}}+\\frac{${b}}{${d}}=\\frac{${s}}{${d}}$`
          : `$\\displaystyle\\frac{${a}}{${d}}+\\frac{${b}}{${d}}=\\frac{${s}}{${d}}=\\frac{${s / g}}{${d / g}}$`;
      return {
        frage: `$\\displaystyle\\frac{${a}}{${d}}+\\frac{${b}}{${d}}$`,
        frageMitLoesungHighlight: voll,
        loesung: voll,
        loesungInlineNachFrage: true,
        diagram: svgBruchZweiStreifen(a, d, b, 'aufgabe'),
        diagramLoesung: svgBruchZweiStreifen(a, d, b, 'loesung'),
      };
    },
    br_sub_like() {
      const d = pick([6, 7, 8, 9, 10, 12] as const);
      const a = randInt(2, d - 1);
      const b = randInt(1, a - 1);
      const s = a - b;
      const g = gcd(s, d);
      const voll =
        g === 1
          ? `$\\displaystyle\\frac{${a}}{${d}}-\\frac{${b}}{${d}}=\\frac{${s}}{${d}}$`
          : `$\\displaystyle\\frac{${a}}{${d}}-\\frac{${b}}{${d}}=\\frac{${s}}{${d}}=\\frac{${s / g}}{${d / g}}$`;
      return {
        frage: `$\\displaystyle\\frac{${a}}{${d}}-\\frac{${b}}{${d}}$`,
        frageMitLoesungHighlight: voll,
        loesung: voll,
        loesungInlineNachFrage: true,
        diagram: svgBruchZweiStreifen(a, d, b, 'aufgabe'),
        diagramLoesung: svgBruchZweiStreifen(a, d, b, 'loesung'),
      };
    },
    br_erweitern() {
      let n = 1;
      let d = 4;
      let k = 2;
      for (let t = 0; t < 40; t++) {
        n = randInt(1, 7);
        d = randInt(3, 9);
        if (n >= d) continue;
        if (gcd(n, d) !== 1) continue;
        k = pick([2, 3, 4, 5] as const);
        break;
      }
      const N = n * k;
      const D = d * k;
      return {
        frage: `Erweitere den Bruch $\\displaystyle\\frac{${n}}{${d}}$ auf den Nenner $${D}$.`,
        loesung: `$\\displaystyle\\frac{${n}}{${d}}=\\frac{${N}}{${D}}$ (erweitert mit ${k}).`,
        diagram: svgBruchErweiternKacheln(n, d, k, '', 'aufgabe'),
        diagramLoesung: svgBruchErweiternKacheln(n, d, k, '', 'loesung'),
      };
    },
    br_kuerzen() {
      let n = 6;
      let d = 8;
      let g = 2;
      for (let t = 0; t < 40; t++) {
        n = randInt(2, 14);
        d = randInt(3, 16);
        g = gcd(n, d);
        if (g >= 2 && n < d) break;
      }
      return {
        frage: `Kürze den Bruch $\\displaystyle\\frac{${n}}{${d}}$ vollständig.`,
        loesung: `$\\displaystyle\\frac{${n}}{${d}}=\\frac{${n / g}}{${d / g}}$ (gekürzt mit $${g}$).`,
        diagram: svgBruchStreifen(n, d, '', 'aufgabe', g),
        diagramLoesung: svgBruchStreifen(n, d, '', 'loesung', g),
      };
    },
    br_mul_frac() {
      let n1 = 2,
        d1 = 3,
        n2 = 1,
        d2 = 2;
      for (let t = 0; t < 50; t++) {
        n1 = randInt(1, 4);
        d1 = randInt(2, 5);
        n2 = randInt(1, 4);
        d2 = randInt(2, 5);
        if (n1 >= d1 || n2 >= d2) continue;
        break;
      }
      const pn = n1 * n2;
      const pd = d1 * d2;
      const g = gcd(pn, pd);
      const tail = g > 1 ? `=\\frac{${pn / g}}{${pd / g}}` : '';
      return {
        frage: `Berechne $\\displaystyle\\frac{${n1}}{${d1}}\\cdot\\frac{${n2}}{${d2}}$.`,
        loesung: `$\\displaystyle\\frac{${n1}}{${d1}}\\cdot\\frac{${n2}}{${d2}}=\\frac{${pn}}{${pd}}${tail}$.`,
        diagram: svgBruchMalRaster(n1, d1, n2, d2, 'aufgabe'),
        diagramLoesung: svgBruchMalRaster(n1, d1, n2, d2, 'loesung'),
        diagramDefaultHidden: true,
      };
    },
    br_vergleich() {
      let d1 = 3,
        d2 = 4,
        a = 2,
        b = 3;
      for (let t = 0; t < 60; t++) {
        d1 = randInt(3, 10);
        d2 = randInt(3, 10);
        if (d1 === d2) continue;
        const L = (d1 * d2) / gcd(d1, d2);
        if (L > 18) continue;
        a = randInt(1, d1 - 1);
        b = randInt(1, d2 - 1);
        const c1 = a * d2;
        const c2 = b * d1;
        if (c1 === c2) continue;
        break;
      }
      const L = (d1 * d2) / gcd(d1, d2);
      const nA = (a * L) / d1;
      const nB = (b * L) / d2;
      const fracA = `$\\displaystyle\\frac{${a}}{${d1}}$`;
      const fracB = `$\\displaystyle\\frac{${b}}{${d2}}$`;
      const gr = a * d2 > b * d1 ? fracA : fracB;
      const zfVgl = nA > nB ? `${nA} > ${nB}` : `${nA} < ${nB}`;
      const grMitBox = (tex: string) =>
        `<span class="inline-block rounded-md border border-green-600 bg-green-50 px-2 py-0.5 align-middle dark:border-green-400 dark:bg-green-950/55">${tex}</span>`;
      const winnerIsA = a * d2 > b * d1;
      return {
        frage: `Welcher Bruch ist größer: ${fracA} oder ${fracB}?`,
        frageMitLoesungHighlight: `Welcher Bruch ist größer: ${winnerIsA ? grMitBox(fracA) : fracA} oder ${winnerIsA ? fracB : grMitBox(fracB)}?`,
        loesung: `Auf den Hauptnenner $${L}$ erweitern: $\\frac{${a}}{${d1}}=\\frac{${nA}}{${L}}$ und $\\frac{${b}}{${d2}}=\\frac{${nB}}{${L}}$. <br>Wegen $${zfVgl}$ ist ${gr} größer.`,
        diagram: svgBruchVergleichAusgangsstreifen(a, d1, b, d2, 'aufgabe'),
        diagramLoesung: svgBruchVergleichZweiRiegel(nA, nB, L, 'loesung'),
        diagramDefaultHidden: true,
      };
    },
    nz_add() {
      let a = 0;
      let b = 0;
      for (let t = 0; t < 35; t++) {
        a = randInt(-9, 9);
        b = randInt(-9, 9);
        if (b === 0) continue;
        if (a === 0 && random() < 0.65) continue;
        break;
      }
      const s = a + b;
      return {
        frage: `Berechne die Summe $${a}${formatSignedInt(b)}$.`,
        loesung: `$${a}${formatSignedInt(b)}=${s}$.`,
        diagram: svgZahlenstrahlSprung(a, b),
      };
    },
    nz_sub() {
      let a = 0;
      let b = 0;
      for (let t = 0; t < 35; t++) {
        a = randInt(-9, 9);
        b = randInt(-9, 9);
        if (a - b === 0) continue;
        break;
      }
      const s = a - b;
      return {
        frage: `Berechne die Differenz $${a}-${texSubtrahend(b)}$.`,
        loesung: `$${a}-${texSubtrahend(b)}=${s}$ (z.\,B. als $${a}+(${-b})=${s}$).`,
        diagram: svgZahlenstrahlSprung(a, -b),
      };
    },
    nz_mul() {
      const negA = random() < 0.5;
      const negB = random() < 0.5;
      const a = (negA ? -1 : 1) * randInt(2, 9);
      const b = (negB ? -1 : 1) * randInt(2, 9);
      const p = a * b;
      const rule =
        negA && negB
          ? 'Minus mal minus ergibt plus.'
          : negA === negB
            ? 'Gleiche Vorzeichen ergeben plus.'
            : 'Unterschiedliche Vorzeichen ergeben minus.';
      return {
        frage: `Berechne $${texMulFactor(a)}\\cdot${texMulFactor(b)}$.`,
        loesung: `$${texMulFactor(a)}\\cdot${texMulFactor(b)}=${p}$ (${rule})`,
      };
    },
    nz_div() {
      const den = pick([2, 3, 4, 5, 6] as const);
      const q = pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8] as const);
      const num = q * den;
      return {
        frage: `Berechne $\\displaystyle\\frac{${num}}{${den}}$.`,
        loesung: `$\\displaystyle\\frac{${num}}{${den}}=${q}$.`,
      };
    },
    nz_vergleich() {
      let a = 0;
      let b = 0;
      for (let t = 0; t < 45; t++) {
        a = randInt(-9, 9);
        b = randInt(-9, 9);
        if (a === b) continue;
        break;
      }
      const gr = Math.max(a, b);
      const kl = Math.min(a, b);
      const grIstA = gr === a;
      return {
        frage: `Welche Zahl ist größer: $${a}$ oder $${b}$? (Skizze: A gehört zur ersten Zahl, B zur zweiten.)`,
        loesung: `${grIstA ? 'A' : 'B'} ist größer: $${gr} > ${kl}$. Auf dem Zahlenstrahl liegt die größere Zahl weiter rechts.`,
        diagram: svgZahlenstrahlZweiWerte(a, b),
      };
    },
    nz_klammer_punkt_vor_strich() {
      const r = random();
      if (r < 0.34) {
        const n = randInt(2, 9);
        return {
          frage: `Berechne $-(-${n})$.`,
          loesung: `$-(-${n})=${n}$.`,
        };
      }
      if (r < 0.62) {
        let innerA = 5;
        let innerB = 3;
        for (let t = 0; t < 22; t++) {
          innerA = randInt(2, 11);
          innerB = randInt(2, 11);
          if (innerA === innerB) continue;
          break;
        }
        const inner = innerA - innerB;
        const res = -inner;
        return {
          frage: `Berechne $-(${innerA}-${innerB})$.`,
          loesung: `$-(${innerA}-${innerB})=-(${inner})=${res}$.`,
        };
      }
      const a = pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6] as const);
      const b = randInt(2, 5);
      const c = pick([-5, -4, -3, -2, 2, 3, 4, 5] as const);
      const prod = b * c;
      if (random() < 0.5) {
        const res = a - prod;
        return {
          frage: `Berechne $${a}-${b}\\cdot${texMulFactor(c)}$.`,
          loesung: `Punkt vor Strich: $${b}\\cdot${texMulFactor(c)}=${prod}$. Also $${a}-${prod}=${res}$.`,
          diagram: svgZahlenstrahlSprung(a, -prod),
        };
      }
      const res = a + prod;
      return {
        frage: `Berechne $${a}+${b}\\cdot${texMulFactor(c)}$.`,
        loesung: `Punkt vor Strich: $${b}\\cdot${texMulFactor(c)}=${prod}$. Also $${a}+${prod}=${res}$.`,
        diagram: svgZahlenstrahlSprung(a, prod),
      };
    },
    alg_klammer_mal() {
      const k = randInt(2, 6);
      const ca = randInt(2, 5);
      let cb = 0;
      for (let t = 0; t < 25; t++) {
        cb = randInt(-7, 7);
        if (cb === 0) continue;
        break;
      }
      const inner = linBinom(ca, cb);
      return {
        frage: `Multipliziere aus: $${k}(${inner})$.`,
        loesung: `$${k}(${inner})=${linBinom(k * ca, k * cb)}$.`,
      };
    },
    alg_minus_klammer_plus() {
      const ia = randInt(2, 5);
      const innerB = randInt(1, 9);
      let ta = randInt(1, 7);
      for (let t = 0; t < 12 && ta === ia; t++) ta = randInt(1, 7);
      return {
        frage: `Vereinfache $-(${ia}x-${innerB})+${linTerm(ta)}$.`,
        loesung: `$-(${ia}x-${innerB})+${linTerm(ta)}=-${ia}x+${innerB}+${linTerm(ta)}=${linBinom(
          ta - ia,
          innerB
        )}$.`,
      };
    },
    alg_ausklammern() {
      const g = pick([2, 3, 4, 5, 6] as const);
      const ca = randInt(2, 5);
      let cb = 0;
      for (let t = 0; t < 25; t++) {
        cb = randInt(-6, 6);
        if (cb === 0) continue;
        break;
      }
      const expanded = linBinom(g * ca, g * cb);
      return {
        frage: `Klammere so weit wie möglich aus: $${expanded}$.`,
        loesung: `$${expanded}=${g}(${linBinom(ca, cb)})$.`,
      };
    },
    alg_klammer_weg() {
      const fx = randInt(5, 9);
      const gx = randInt(2, fx - 1);
      const h = randInt(-7, 7);
      const inner = linBinom(gx, h);
      return {
        frage: `Vereinfache $${linTerm(fx)}-(${inner})$.`,
        loesung: `$${linTerm(fx)}-(${inner})=${linTerm(fx)}-${linTerm(gx)}${formatSignedInt(-h)}=${linBinom(
          fx - gx,
          -h
        )}$.`,
      };
    },
    alg_terme_zusammen() {
      let a = 0;
      let c = 0;
      for (let t = 0; t < 30; t++) {
        a = randInt(1, 5);
        c = randInt(-4, 4);
        if (c === 0) continue;
        if (a + c === 0) continue;
        break;
      }
      const b = randInt(-8, 8);
      const d = randInt(-8, 8);
      return {
        frage: `Vereinfache $${linTerm(a)}${formatSignedInt(b)}${formatSignedInt(c)}x${formatSignedInt(d)}$.`,
        loesung: `$${linTerm(a)}${formatSignedInt(b)}${formatSignedInt(c)}x${formatSignedInt(d)}=${linBinom(
          a + c,
          b + d
        )}$.`,
      };
    },
    alg_distributiv_zahl() {
      const k = randInt(2, 7);
      const m = randInt(2, 6);
      const n = randInt(2, 6);
      const s = k * (m + n);
      return {
        frage: `Berechne mit dem Distributivgesetz: $${k}(${m}+${n})$.`,
        loesung: `$${k}(${m}+${n})=${k}\\cdot ${m}+${k}\\cdot ${n}=${k * m}+${k * n}=${s}$.`,
        diagram: svgDistributivFlaeche(k, m, n),
      };
    },
    lg_x_plus_a_eq_b() {
      const x0 = pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8] as const);
      const a = pick([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8] as const);
      const b = x0 + a;
      return {
        frage: `Löse die Gleichung $x${formatSignedInt(a)}=${b}$.`,
        loesung: `Addition von $${-a}$ (bzw. Subtraktion von $${a}$) auf beiden Seiten: $x=${x0}$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m: 1, n: a }, { m: 0, n: b }, x0),
      };
    },
    lg_ax_eq_b() {
      let x0 = 1;
      let a = 2;
      let b = 0;
      for (let t = 0; t < 50; t++) {
        x0 = pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8] as const);
        a = randInt(2, 9);
        b = a * x0;
        if (Math.abs(b) <= FUN_GRAPH_AXIS_INTERCEPT_MAX) break;
      }
      return {
        frage: `Löse die Gleichung $${a}x=${b}$.`,
        loesung: `Division durch $${a}$: $x=${x0}$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m: a, n: 0 }, { m: 0, n: b }, x0),
      };
    },
    lg_ax_plus_b_eq_c() {
      let a = 2;
      let x0 = 2;
      let b = 0;
      let c = 0;
      for (let t = 0; t < 80; t++) {
        a = randInt(2, 7);
        x0 = pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8] as const);
        b = randInt(-8, 8);
        c = a * x0 + b;
        if (Math.abs(c) <= FUN_GRAPH_AXIS_INTERCEPT_MAX && funGraphLinearAxisInterceptsInRange(a, b)) break;
      }
      return {
        frage: `Löse die Gleichung $${a}x${formatSignedInt(b)}=${c}$.`,
        loesung: `Zuerst $${formatSignedInt(-b)}$ auf beiden Seiten, dann durch $${a}$: $x=${x0}$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m: a, n: b }, { m: 0, n: c }, x0),
      };
    },
    lg_ax_plus_b_eq_cx_plus_d() {
      let a = 2;
      let c = 2;
      let x0 = 2;
      let b = 0;
      let d = 0;
      for (let t = 0; t < 60; t++) {
        a = randInt(2, 6);
        c = randInt(2, 6);
        if (a === c) continue;
        x0 = pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8] as const);
        b = randInt(-8, 8);
        d = a * x0 + b - c * x0;
        if (
          Math.abs(d) <= FUN_GRAPH_AXIS_INTERCEPT_MAX &&
          funGraphLinearAxisInterceptsInRange(a, b) &&
          funGraphLinearAxisInterceptsInRange(c, d)
        ) {
          break;
        }
      }
      return {
        frage: `Löse die Gleichung $${a}x${formatSignedInt(b)}=${c}x${formatSignedInt(d)}$.`,
        loesung: `$${c}x$ subtrahieren: $${a - c}x${formatSignedInt(b)}=${d}$. Daraus $x=${x0}$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m: a, n: b }, { m: c, n: d }, x0),
      };
    },
    lg_klammer_linear() {
      let k = 2;
      let a = 0;
      let x0 = 2;
      let rhs = 0;
      for (let t = 0; t < 50; t++) {
        k = randInt(2, 6);
        a = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5] as const);
        x0 = pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8] as const);
        rhs = k * (x0 + a);
        if (Math.abs(x0 + a) <= FUN_GRAPH_AXIS_INTERCEPT_MAX) break;
      }
      return {
        frage: `Löse die Gleichung $${k}(x${formatSignedInt(a)})=${rhs}$.`,
        loesung: `Division durch $${k}$: $x${formatSignedInt(a)}=${rhs / k}$. Subtrahiere $${a}$ bzw. addiere $${-a}$: $x=${x0}$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m: 1, n: a }, { m: 0, n: rhs / k }, x0),
      };
    },
    lg_bruch_linear() {
      let b = 2;
      let c = 1;
      let x0 = 2;
      let a = 0;
      for (let t = 0; t < 80; t++) {
        b = randInt(2, 8);
        c = pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7] as const);
        x0 = pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8] as const);
        a = c * b - x0;
        if (Math.abs(a) <= FUN_GRAPH_AXIS_INTERCEPT_MAX) break;
      }
      return {
        frage: `Löse die Gleichung $\\dfrac{x${formatSignedInt(a)}}{${b}}=${c}$.`,
        loesung: `Mit $${b}$ multiplizieren: $x${formatSignedInt(a)}=${c * b}$, also $x=${x0}$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m: 1, n: a }, { m: 0, n: c * b }, x0),
      };
    },
    pr_prozentwert() {
      const grundwert = pick([80, 100, 120, 160, 200, 240, 300, 400, 500] as const);
      const p = pick([5, 10, 20, 25, 40, 50] as const);
      const prozentwert = (grundwert * p) / 100;
      return {
        frage: `Berechne den Prozentwert: $${p}\\,\\%$ von $${grundwert}$.`,
        loesung: `$W=\\frac{${p}}{100}\\cdot ${grundwert}=${prozentwert}$.`,
      };
    },
    pr_prozentsatz() {
      const grundwert = pick([80, 100, 120, 160, 200, 240, 300, 400] as const);
      const p = pick([5, 10, 15, 20, 25, 30, 40, 50] as const);
      const prozentwert = (grundwert * p) / 100;
      return {
        frage: `Wie groß ist der Prozentsatz, wenn $W=${prozentwert}$ und $G=${grundwert}$ gilt?`,
        loesung: `$p=\\frac{W}{G}\\cdot 100\\,\\%=\\frac{${prozentwert}}{${grundwert}}\\cdot 100\\,\\%=${p}\\,\\%$.`,
      };
    },
    pr_grundwert() {
      const p = pick([5, 10, 20, 25, 40, 50] as const);
      const grundwert = pick([80, 100, 120, 160, 200, 240, 300, 400] as const);
      const prozentwert = (grundwert * p) / 100;
      return {
        frage: `Berechne den Grundwert $G$, wenn $${p}\\,\\%$ genau $${prozentwert}$ sind.`,
        loesung: `$G=\\frac{W}{p/100}=\\frac{${prozentwert}}{${p / 100}}=${grundwert}$.`,
      };
    },
    pr_vermehrungsfaktor() {
      const p = pick([4, 5, 8, 10, 12, 15, 20] as const);
      if (random() < 0.5) {
        return {
          frage: `Welcher Vermehrungsfaktor gehört zu einer Erhöhung um $${p}\\,\\%$?`,
          loesung: `Erhöhung um $${p}\\,\\%$: $q=1+\\frac{${p}}{100}=1${formatSignedInt(p / 100)}=1,${String(
            100 + p
          ).slice(1)}$.`,
        };
      }
      return {
        frage: `Welcher Faktor gehört zu einer Reduktion um $${p}\\,\\%$?`,
        loesung: `Reduktion um $${p}\\,\\%$: $q=1-\\frac{${p}}{100}=0,${String(100 - p).padStart(2, '0')}$.`,
      };
    },
    pr_reduzierter_preis() {
      const preis = pick([40, 60, 80, 100, 120, 160, 200] as const);
      const p = pick([5, 10, 20, 25, 30, 40] as const);
      const neu = (preis * (100 - p)) / 100;
      return {
        frage: `Ein Preis von $${preis}\\,€$ wird um $${p}\\,\\%$ reduziert. Wie hoch ist der neue Preis?`,
        loesung: `Mit dem Faktor $q=1-\\frac{${p}}{100}=\\frac{${100 - p}}{100}$: $${preis}\\cdot ${(
          (100 - p) /
          100
        ).toFixed(2).replace('.', ',')}=${neu}\\,€$.`,
      };
    },
    pr_ausgangswert_nach_erhoehung() {
      const alt = pick([25, 40, 50, 80, 100, 120, 200] as const);
      const p = pick([5, 8, 10, 20, 25, 40] as const);
      const neu = (alt * (100 + p)) / 100;
      return {
        frage: `Nach einer Erhöhung um $${p}\\,\\%$ beträgt ein Wert $${neu}$. Wie groß war der Ausgangswert?`,
        loesung: `Rückwärts mit $q=1+\\frac{${p}}{100}=\\frac{${100 + p}}{100}$: $${neu}:${
          ((100 + p) / 100).toFixed(2).replace('.', ',')
        }=${alt}$.`,
      };
    },
    st_mittelwert_median() {
      const a = randInt(1, 5);
      const b = a + randInt(1, 3);
      const c = b + randInt(0, 2);
      const d = c + randInt(1, 3);
      const e = d + randInt(1, 3);
      const daten = [a, b, c, d, e];
      const mittelwert = (a + b + c + d + e) / 5;
      const median = c;
      return {
        frage: `Datensatz: ${daten.join(', ')}. Bestimme Mittelwert und Median.`,
        loesung: `Mittelwert $=\\frac{${a + b + c + d + e}}{5}=${mittelwert}$, Median $=${median}$.`,
      };
    },
    st_ausreisser_effekt() {
      const x = randInt(2, 6);
      const y = x + randInt(1, 4);
      const z = y + randInt(1, 4);
      const ausreisser = pick([40, 50, 60, 80, 100] as const);
      const altMittel = Number(((x + y + z) / 3).toFixed(2));
      const neuMittel = Number(((x + y + z + ausreisser) / 4).toFixed(2));
      return {
        frage: `Die Werte ${x}, ${y}, ${z} haben Mittelwert ${altMittel}. Was passiert mit dem Mittelwert, wenn ${ausreisser} dazukommt?`,
        loesung: `Neuer Mittelwert: $\\frac{${x + y + z + ausreisser}}{4}=${String(neuMittel).replace('.', ',')}$. Der Ausreißer zieht den Mittelwert deutlich nach oben.`,
      };
    },
    st_wuerfelsumme_sieben() {
      return {
        frage: 'Zwei faire Würfel werden geworfen. Wie groß ist die Wahrscheinlichkeit für die Augensumme 7?',
        loesung: `Günstige Paare: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$, also $6$ von $36$. Damit $P=\\frac{6}{36}=\\frac{1}{6}$.`,
      };
    },
    st_mindestens_einmal() {
      if (random() < 0.5) {
        return {
          frage: 'Zwei faire Münzwürfe: Wie groß ist die Wahrscheinlichkeit für „mindestens einmal Zahl“?',
          loesung: `Komplement: „keinmal Zahl“ bedeutet zweimal Kopf mit $\\frac14$. Also $1-\\frac14=\\frac34$.`,
        };
      }
      return {
        frage: 'Ein fairer Würfel wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für „mindestens einmal eine 6“?',
        loesung: `Komplement: „keine 6“ hat Wahrscheinlichkeit $\\left(\\frac56\\right)^2=\\frac{25}{36}$. Also $1-\\frac{25}{36}=\\frac{11}{36}$.`,
      };
    },
    st_unmoeglich_sicher() {
      const typ = pick(['unmoeglich', 'sicher', 'wahrscheinlich'] as const);
      if (typ === 'unmoeglich') {
        return {
          frage: 'Ein fairer Würfel wird einmal geworfen. Wie groß ist die Wahrscheinlichkeit für „Augenzahl 7“?',
          loesung: `Unmögliches Ereignis: $P=0$.`,
        };
      }
      if (typ === 'sicher') {
        return {
          frage: 'Ein fairer Würfel wird einmal geworfen. Wie groß ist die Wahrscheinlichkeit für „Augenzahl höchstens 6“?',
          loesung: `Sicheres Ereignis: $P=1$.`,
        };
      }
      return {
        frage: 'Ein fairer Würfel wird einmal geworfen. Wie groß ist die Wahrscheinlichkeit für „gerade Augenzahl“?',
        loesung: `Günstig: $\\{2,4,6\\}$, also $3$ von $6$. Damit $P=\\frac{3}{6}=\\frac12$.`,
      };
    },
    st_erwartungswert_muenzwurf() {
      const n = pick([10, 20, 30, 40, 50, 80, 100] as const);
      return {
        frage: `Eine faire Münze wird $${n}$-mal geworfen. Wie viele „Zahl“ erwartest du ungefähr?`,
        loesung: `Erwartungswert: $E=n\\cdot \\frac12=${n}\\cdot \\frac12=${n / 2}$.`,
      };
    },
    bf_erste_formel() {
      const a = randInt(2, 9);
      const doppel = 2 * a;
      const quad = a * a;
      return {
        frage: `Multipliziere aus: $(x+${a})^2$.`,
        loesung: `Erste binomische Formel: $(x+${a})^2=x^2+2\\cdot ${a}x+${a}^2=x^2+${doppel}x+${quad}$.`,
      };
    },
    bf_zweite_formel() {
      const a = randInt(2, 9);
      const doppel = 2 * a;
      const quad = a * a;
      return {
        frage: `Multipliziere aus: $(x-${a})^2$.`,
        loesung: `Zweite binomische Formel: $(x-${a})^2=x^2-2\\cdot ${a}x+${a}^2=x^2-${doppel}x+${quad}$.`,
      };
    },
    bf_dritte_formel() {
      const a = randInt(2, 12);
      return {
        frage: `Multipliziere aus: $(x+${a})(x-${a})$.`,
        loesung: `Dritte binomische Formel: $(x+${a})(x-${a})=x^2-${a}^2=x^2-${a * a}$.`,
      };
    },
    bf_faktorisieren_quadrat() {
      const p = pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8] as const);
      const b = -2 * p;
      const c = p * p;
      return {
        frage: `Faktorisiere $x^2${formatSignedInt(b)}x${formatSignedInt(c)}$.`,
        loesung: `Binomische Struktur: $x^2${formatSignedInt(b)}x${formatSignedInt(c)}=(x${formatSignedInt(-p)})^2$.`,
      };
    },
    bf_faktorisieren_diff() {
      const a = randInt(2, 12);
      return {
        frage: `Faktorisiere $x^2-${a * a}$.`,
        loesung: `Differenz von Quadraten: $x^2-${a * a}=(x-${a})(x+${a})$.`,
      };
    },
    bf_ausmultiplizieren_mit_zahl() {
      const k = randInt(2, 5);
      const a = randInt(1, 8);
      const b = randInt(1, 8);
      const sum = a + b;
      const prod = a * b;
      return {
        frage: `Multipliziere aus: $(${k}x+${a})(${k}x+${b})$.`,
        loesung: `Ausmultiplizieren: $(${k}x+${a})(${k}x+${b})=${k * k}x^2+${k * sum}x+${prod}$.`,
      };
    },
    lf_gerade_m_b() {
      const m = pick([-4, -3, -2, -1, 1, 2, 3, 4] as const);
      const b = randInt(-8, 8);
      return {
        frage: `Bestimme die Gleichung der Geraden mit Steigung $m=${m}$ und y-Achsenabschnitt $b=${b}$.`,
        loesung: `$y=${m}x${formatSignedInt(b)}$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m, n: b }, { m: 0, n: b }, 0),
      };
    },
    lf_steigung_aus_punkten() {
      let m = 1;
      let x1 = 0;
      let dx = 2;
      let x2 = 2;
      let b = 0;
      let y1 = 0;
      for (let t = 0; t < 60; t++) {
        m = pick([-4, -3, -2, -1, 1, 2, 3, 4] as const);
        x1 = randInt(-3, 2);
        dx = pick([2, 3, 4] as const);
        x2 = x1 + dx;
        y1 = randInt(-8, 8);
        b = y1 - m * x1;
        if (b >= -6 && b <= 6 && funGraphLinearAxisInterceptsInRange(m, b)) break;
      }
      const y2 = m * x2 + b;
      return {
        frage: `Die Gerade geht durch $A(${x1}|${y1})$ und $B(${x2}|${y2})$. Bestimme ihre Steigung und Gleichung.`,
        loesung: `Steigung: $m=\\frac{${y2}-${y1}}{${x2}-${x1}}=${m}$. Mit $A$: $${y1}=${m}\\cdot ${x1}+b\\Rightarrow b=${b}$. Also $y=${m}x${formatSignedInt(b)}$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m, n: b }, { m: 0, n: y1 }, x1),
      };
    },
    lf_nullstelle() {
      let m = 1;
      let x0 = 2;
      let b = 0;
      for (let t = 0; t < 50; t++) {
        m = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5] as const);
        x0 = pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8] as const);
        b = -m * x0;
        if (Math.abs(b) <= FUN_GRAPH_AXIS_INTERCEPT_MAX) break;
      }
      return {
        frage: `Bestimme die Nullstelle der Funktion $f(x)=${m}x${formatSignedInt(b)}$.`,
        loesung: `Für die Nullstelle gilt $0=${m}x${formatSignedInt(b)}\\Rightarrow x=${x0}$. Schnittpunkt mit der x-Achse: $(${x0}|0)$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m, n: b }, { m: 0, n: 0 }, x0),
      };
    },
    lf_parallel() {
      const m = pick([-4, -3, -2, -1, 1, 2, 3, 4] as const);
      const b = randInt(-8, 8);
      return {
        frage: `Welche Steigung hat jede Gerade, die parallel zu $y=${m}x${formatSignedInt(b)}$ verläuft?`,
        loesung: `Parallele Geraden haben dieselbe Steigung. Also $m=${m}$.`,
      };
    },
    lf_funktionswert() {
      const m = pick([-4, -3, -2, -1, 1, 2, 3, 4] as const);
      const b = randInt(-8, 8);
      const x = randInt(-4, 6);
      const y = m * x + b;
      return {
        frage: `Berechne den Funktionswert von $f(x)=${m}x${formatSignedInt(b)}$ an der Stelle $x=${x}$.`,
        loesung: `$f(${x})=${m}\\cdot ${x}${formatSignedInt(b)}=${y}$.`,
      };
    },
    lf_achsenabschnitt() {
      const m = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5] as const);
      const b = randInt(-8, 8);
      return {
        frage: `Bestimme den y-Achsenabschnitt der Geraden $y=${m}x${formatSignedInt(b)}$.`,
        loesung: `Bei $x=0$ gilt $y=${b}$. Der y-Achsenabschnitt ist also $b=${b}$ (Punkt $(0|${b})$).`,
        diagram: svgLineareGleichungSchnittpunkt({ m, n: b }, { m: 0, n: b }, 0),
      };
    },
    lgs_addition() {
      let x0 = 0;
      let y0 = 0;
      for (let t = 0; t < 50; t++) {
        x0 = randInt(-6, 6);
        y0 = randInt(-6, 6);
        if (Math.abs(x0 + y0) <= FUN_GRAPH_AXIS_INTERCEPT_MAX && Math.abs(x0 - y0) <= FUN_GRAPH_AXIS_INTERCEPT_MAX) {
          break;
        }
      }
      const s1 = x0 + y0;
      const s2 = x0 - y0;
      return {
        frage: `Löse das Gleichungssystem $\\begin{cases}x+y=${s1}\\\\x-y=${s2}\\end{cases}$.`,
        loesung: `Addieren liefert $2x=${s1 + s2}\\Rightarrow x=${x0}$. Danach $y=${s1}-${x0}=${y0}$. Lösung: $(${x0}|${y0})$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m: -1, n: s1 }, { m: 1, n: -s2 }, x0),
      };
    },
    lgs_einsetzen() {
      const x0 = randInt(-6, 6);
      const y0 = randInt(-6, 6);
      const a = pick([-3, -2, -1, 1, 2, 3] as const);
      const b = x0 - a * y0;
      const c = pick([-3, -2, -1, 1, 2, 3] as const);
      const d = pick([-4, -3, -2, 2, 3, 4] as const);
      const e = c * x0 + d * y0;
      return {
        frage: `Löse durch Einsetzen: $\\begin{cases}x=${a}y${formatSignedInt(b)}\\\\${c}x${formatSignedInt(
          d
        )}y=${e}\\end{cases}$.`,
        loesung: `Setze $x=${a}y${formatSignedInt(b)}$ in die zweite Gleichung ein. Danach ergibt sich $y=${y0}$ und damit $x=${x0}$. Lösung: $(${x0}|${y0})$.`,
      };
    },
    lgs_gleichsetzen() {
      let x0 = 0;
      let y0 = 0;
      let m1 = 1;
      let m2 = 2;
      let n1 = 0;
      let n2 = 0;
      for (let t = 0; t < 60; t++) {
        x0 = randInt(-5, 6);
        y0 = randInt(-6, 6);
        for (let s = 0; s < 20; s++) {
          m1 = pick([-4, -3, -2, -1, 1, 2, 3, 4] as const);
          m2 = pick([-4, -3, -2, -1, 1, 2, 3, 4] as const);
          if (m1 !== m2) break;
        }
        n1 = y0 - m1 * x0;
        n2 = y0 - m2 * x0;
        if (
          Math.abs(n1) <= FUN_GRAPH_AXIS_INTERCEPT_MAX &&
          Math.abs(n2) <= FUN_GRAPH_AXIS_INTERCEPT_MAX
        ) {
          break;
        }
      }
      return {
        frage: `Löse durch Gleichsetzen: $\\begin{cases}y=${m1}x${formatSignedInt(
          n1
        )}\\\\y=${m2}x${formatSignedInt(n2)}\\end{cases}$.`,
        loesung: `Gleichsetzen: $${m1}x${formatSignedInt(n1)}=${m2}x${formatSignedInt(
          n2
        )}\\Rightarrow x=${x0}$. Dann $y=${y0}$. Lösung: $(${x0}|${y0})$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m: m1, n: n1 }, { m: m2, n: n2 }, x0),
      };
    },
    lgs_keine_loesung() {
      const m = pick([-4, -3, -2, -1, 1, 2, 3, 4] as const);
      const n1 = randInt(-6, 2);
      const n2 = n1 + randInt(2, 7);
      return {
        frage: `Wie viele Lösungen hat das System $\\begin{cases}y=${m}x${formatSignedInt(
          n1
        )}\\\\y=${m}x${formatSignedInt(n2)}\\end{cases}$?`,
        loesung: `Beide Geraden haben dieselbe Steigung $m=${m}$, aber verschiedene Achsenabschnitte ($${n1}$ und $${n2}$). Sie sind parallel: keine Lösung.`,
      };
    },
    lgs_unendlich_viele() {
      const a = pick([1, 2, 3] as const);
      const b = pick([-4, -3, -2, -1, 1, 2, 3, 4] as const);
      const c = randInt(-8, 8);
      const f = pick([2, 3, 4] as const);
      return {
        frage: `Wie viele Lösungen hat $\\begin{cases}${a}x${formatSignedInt(b)}y=${c}\\\\${a * f}x${formatSignedInt(
          b * f
        )}y=${c * f}\\end{cases}$?`,
        loesung: `Die zweite Gleichung ist ein Vielfaches der ersten. Beide beschreiben dieselbe Gerade: unendlich viele Lösungen.`,
      };
    },
    lgs_schnittpunkt() {
      let x0 = 0;
      let y0 = 0;
      let m1 = 1;
      let m2 = 2;
      let n1 = 0;
      let n2 = 0;
      for (let t = 0; t < 60; t++) {
        x0 = randInt(-5, 5);
        y0 = randInt(-5, 5);
        for (let s = 0; s < 20; s++) {
          m1 = pick([-3, -2, -1, 1, 2, 3] as const);
          m2 = pick([-3, -2, -1, 1, 2, 3] as const);
          if (m1 !== m2) break;
        }
        n1 = y0 - m1 * x0;
        n2 = y0 - m2 * x0;
        if (
          Math.abs(n1) <= FUN_GRAPH_AXIS_INTERCEPT_MAX &&
          Math.abs(n2) <= FUN_GRAPH_AXIS_INTERCEPT_MAX
        ) {
          break;
        }
      }
      return {
        frage: `Bestimme den Schnittpunkt der Geraden $y=${m1}x${formatSignedInt(n1)}$ und $y=${m2}x${formatSignedInt(
          n2
        )}$.`,
        loesung: `Am Schnittpunkt sind die y-Werte gleich: $${m1}x${formatSignedInt(n1)}=${m2}x${formatSignedInt(
          n2
        )}$. Daraus $x=${x0}$ und anschließend $y=${y0}$.`,
        diagram: svgLineareGleichungSchnittpunkt({ m: m1, n: n1 }, { m: m2, n: n2 }, x0),
      };
    },
    tu_kuerzen_faktor() {
      const g = pick([2, 3, 4, 5, 6] as const);
      const a = randInt(1, 7);
      const b = pick([2, 3, 4, 5] as const);
      return {
        frage: `Kürze den Term $\\dfrac{${g}x${formatSignedInt(g * a)}}{${g * b}}$ so weit wie möglich.`,
        loesung: `$\\dfrac{${g}x${formatSignedInt(g * a)}}{${g * b}}=\\dfrac{${g}(x${formatSignedInt(a)})}{${g}\\cdot ${b}}=\\dfrac{x${formatSignedInt(
          a
        )}}{${b}}$.`,
      };
    },
    tu_nicht_kuerzbar_summe() {
      const a = randInt(2, 8);
      const b = randInt(2, 8);
      return {
        frage: `Darf man $\\dfrac{x+${a}}{x+${b}}$ zu $\\dfrac{${a}}{${b}}$ kürzen? Begründe kurz.`,
        loesung: `Nein. Kürzen ist nur bei gemeinsamen Faktoren erlaubt, nicht bei Summanden. $x+${a}$ und $x+${b}$ sind Summen.`,
      };
    },
    tu_definitionsmenge() {
      const a = pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7] as const);
      return {
        frage: `Bestimme die Definitionsmenge von $\\dfrac{1}{x${formatSignedInt(-a)}}$.`,
        loesung: `Nenner $\\neq 0$: $x${formatSignedInt(-a)}\\neq 0\\Rightarrow x\\neq ${a}$. Also $D=\\mathbb{R}\\setminus\\{${a}\\}$.`,
      };
    },
    tu_addition() {
      const a = pick([-4, -3, -2, -1, 1, 2, 3, 4] as const);
      const b = a + pick([1, 2, 3, 4] as const);
      const sum = a + b;
      return {
        frage: `Addiere: $\\dfrac{1}{x${formatSignedInt(-a)}}+\\dfrac{1}{x${formatSignedInt(-b)}}$.`,
        loesung: `Hauptnenner: $(x${formatSignedInt(-a)})(x${formatSignedInt(
          -b
        )})$. Zähler: $(x${formatSignedInt(-b)})+(x${formatSignedInt(-a)})=2x${formatSignedInt(
          -sum
        )}$. Ergebnis: $\\dfrac{2x${formatSignedInt(-sum)}}{(x${formatSignedInt(-a)})(x${formatSignedInt(-b)})}$.`,
      };
    },
    tu_multiplikation() {
      const a = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5] as const);
      const b = pick([2, 3, 4, 5, 6] as const);
      return {
        frage: `Vereinfache $\\dfrac{x${formatSignedInt(-a)}}{${b}}\\cdot\\dfrac{${b}}{x${formatSignedInt(-a)}}$.`,
        loesung: `Kürzen von Faktor $${b}$ und $x${formatSignedInt(-a)}$ (mit $x\\neq ${a}$): Ergebnis $1$.`,
      };
    },
    tu_hauptnenner() {
      const a = pick([2, 3, 4, 5, 6] as const);
      return {
        frage: `Bringe auf einen Hauptnenner: $\\dfrac{1}{x}+\\dfrac{1}{x+${a}}$.`,
        loesung: `Hauptnenner $x(x+${a})$: $\\dfrac{1}{x}=\\dfrac{x+${a}}{x(x+${a})}$ und $\\dfrac{1}{x+${a}}=\\dfrac{x}{x(x+${a})}$. Summe: $\\dfrac{2x+${a}}{x(x+${a})}$.`,
      };
    },
    exp_wachstum_oder_zerfall() {
      const a = pick([50, 80, 100, 120, 200, 300] as const);
      const q = pick([0.8, 0.9, 0.95, 1.05, 1.1, 1.2] as const);
      const qStr = String(q).replace('.', ',');
      return {
        frage: `Gegeben ist $f(t)=${a}\\cdot ${qStr}^t$. Handelt es sich um Wachstum oder Zerfall und um wie viel Prozent pro Schritt?`,
        loesung:
          q > 1
            ? `Da $q=${qStr}>1$, liegt Wachstum vor: ${Math.round((q - 1) * 100)}\\,\\% pro Schritt.`
            : `Da $0<q=${qStr}<1$, liegt Zerfall vor: ${Math.round((1 - q) * 100)}\\,\\% pro Schritt.`,
      };
    },
    exp_parameter() {
      const a = pick([40, 60, 80, 100, 120, 200] as const);
      const q = pick([0.8, 0.9, 0.95, 1.05, 1.1, 1.25] as const);
      const qStr = String(q).replace('.', ',');
      return {
        frage: `Lies bei $f(t)=${a}\\cdot ${qStr}^t$ den Anfangswert und den Faktor ab.`,
        loesung: `Anfangswert $a=${a}$, Faktor $q=${qStr}$.`,
      };
    },
    exp_funktionswert() {
      const a = pick([50, 80, 100, 120, 200] as const);
      const q = pick([0.5, 0.8, 0.9, 1.1, 1.2, 2] as const);
      const t = pick([2, 3, 4] as const);
      const wert = Number((a * q ** t).toFixed(2));
      return {
        frage: `Berechne $f(${t})$ für $f(t)=${a}\\cdot ${String(q).replace('.', ',')}^t$.`,
        loesung: `$f(${t})=${a}\\cdot ${String(q).replace('.', ',')}^{${t}}=${String(wert).replace('.', ',')}$`,
      };
    },
    exp_faktor_aus_prozent() {
      const p = pick([2, 4, 5, 8, 10, 12, 15, 20] as const);
      if (random() < 0.5) {
        return {
          frage: `Welcher Exponentialfaktor $q$ gehört zu einem Wachstum von $${p}\\,\\%$ pro Schritt?`,
          loesung: `$q=1+\\frac{${p}}{100}=1,${String(100 + p).slice(1)}$.`,
        };
      }
      return {
        frage: `Welcher Exponentialfaktor $q$ gehört zu einem Zerfall von $${p}\\,\\%$ pro Schritt?`,
        loesung: `$q=1-\\frac{${p}}{100}=0,${String(100 - p).padStart(2, '0')}$.`,
      };
    },
    exp_verdopplung_halbierung() {
      if (random() < 0.5) {
        const p = pick([5, 8, 10, 12, 15] as const);
        const approx = Math.round(70 / p);
        return {
          frage: `Schätze die Verdopplungszeit bei einem Wachstum von $${p}\\,\\%$ pro Schritt (Faustregel).`,
          loesung: `Faustregel $\\tfrac{70}{p}$: $\\tfrac{70}{${p}}\\approx ${approx}$ Schritte.`,
        };
      }
      const p = pick([5, 8, 10, 12, 15] as const);
      const approx = Math.round(70 / p);
      return {
        frage: `Schätze die Halbwertszeit bei einem Zerfall von $${p}\\,\\%$ pro Schritt (Faustregel).`,
        loesung: `Faustregel $\\tfrac{70}{p}$: $\\tfrac{70}{${p}}\\approx ${approx}$ Schritte.`,
      };
    },
    exp_einfache_gleichung() {
      const basis = pick([2, 3, 5] as const);
      const t = pick([2, 3, 4, 5] as const);
      const ziel = basis ** t;
      return {
        frage: `Löse $${basis}^x=${ziel}$ nach $x$ auf.`,
        loesung: `Da $${ziel}=${basis}^{${t}}$, gilt direkt $x=${t}$.`,
      };
    },
    log_basis_zwei() {
      const erg = pick([3, 4, 5, 6, 7, 8] as const);
      const wert = 2 ** erg;
      return {
        frage: `Berechne $\\log_2(${wert})$.`,
        loesung: `Gesucht ist die Hochzahl zu Basis $2$: $2^{${erg}}=${wert}$, also $\\log_2(${wert})=${erg}$.`,
      };
    },
    log_zehner_differenz() {
      const a = pick([3, 4, 5, 6] as const);
      const b = pick([1, 2] as const);
      return {
        frage: `Berechne $\\log_{10}(10^{${a}})-\\log_{10}(10^{${b}})$.`,
        loesung: `$\\log_{10}(10^{${a}})-\\log_{10}(10^{${b}})=${a}-${b}=${a - b}$.`,
      };
    },
    log_exponentialgleichung() {
      const basis = pick([2, 3, 5, 10] as const);
      const x = pick([2, 3, 4] as const);
      const ziel = basis ** x;
      return {
        frage: `Löse $${basis}^x=${ziel}$ mithilfe eines Logarithmus.`,
        loesung: `$x=\\log_{${basis}}(${ziel})=${x}$.`,
      };
    },
    log_eins() {
      const basis = pick([2, 3, 5, 10] as const);
      return {
        frage: `Bestimme $\\log_{${basis}}(1)$.`,
        loesung: `$\\log_{${basis}}(1)=0$, denn $${basis}^0=1$.`,
      };
    },
    log_basiswechsel() {
      const basis = pick([2, 3, 5, 7] as const);
      const wert = pick([8, 9, 25, 49, 125, 343] as const);
      const approx = Number((Math.log(wert) / Math.log(basis)).toFixed(3));
      return {
        frage: `Schreibe $\\log_{${basis}}(${wert})$ mit dem natürlichen Logarithmus um und gib einen Näherungswert an.`,
        loesung: `$\\log_{${basis}}(${wert})=\\frac{\\ln(${wert})}{\\ln(${basis})}\\approx ${String(approx).replace('.', ',')}$.`,
      };
    },
    log_produktregel() {
      const a = pick([2, 3, 4, 5, 6] as const);
      const b = pick([2, 3, 4, 5, 6] as const);
      return {
        frage: `Vereinfache $\\ln(${a}\\cdot ${b})$ mithilfe einer Logarithmusregel.`,
        loesung: `Produktregel: $\\ln(${a}\\cdot ${b})=\\ln(${a})+\\ln(${b})$.`,
      };
    },
    wr_vereinfachen() {
      const k = pick([2, 3, 5, 6, 7] as const);
      const n = pick([2, 3, 4, 5, 6] as const);
      const rad = n * n * k;
      return {
        frage: `Vereinfache $\\sqrt{${rad}}$.`,
        loesung: `$\\sqrt{${rad}}=\\sqrt{${n * n}\\cdot ${k}}=${n}\\sqrt{${k}}$.`,
      };
    },
    wr_add_sub() {
      const s = pick([2, 3, 5, 6] as const);
      const a = pick([2, 3, 4, 5] as const);
      let b = pick([2, 3, 4, 5] as const);
      for (let t = 0; t < 10 && b === a; t++) b = pick([2, 3, 4, 5] as const);
      const sign = random() < 0.5 ? '+' : '-';
      const res = sign === '+' ? a + b : a - b;
      const radA = a * a * s;
      const radB = b * b * s;
      return {
        frage: `Vereinfache $\\sqrt{${radA}}${sign}\\sqrt{${radB}}$.`,
        loesung: `$\\sqrt{${radA}}${sign}\\sqrt{${radB}}=${a}\\sqrt{${s}}${sign}${b}\\sqrt{${s}}=${res}\\sqrt{${s}}$.`,
      };
    },
    wr_fehlschluss_summe() {
      const a = pick([4, 9, 16, 25] as const);
      const b = pick([4, 9, 16, 25] as const);
      return {
        frage: `Ist die Aussage $\\sqrt{${a}+${b}}=\\sqrt{${a}}+\\sqrt{${b}}$ richtig?`,
        loesung: `Nein. Gegenbeispiel: $\\sqrt{${a + b}}\\neq ${Math.sqrt(a)}+${Math.sqrt(b)}$. Das Wurzelziehen verteilt sich nicht über Summen.`,
      };
    },
    wr_gleichung_quadrat() {
      const n = pick([3, 4, 5, 6, 7, 8, 9] as const);
      return {
        frage: `Löse die Gleichung $x^2=${n * n}$.`,
        loesung: `Beim Quadrieren entstehen zwei Lösungen: $x_1=${n}$ und $x_2=${-n}$.`,
      };
    },
    wr_betrag() {
      const n = pick([2, 3, 4, 5, 6] as const);
      return {
        frage: `Vereinfache $\\sqrt{(-${n})^2}$.`,
        loesung: `$\\sqrt{(-${n})^2}=|-${n}|=${n}$. Allgemein gilt: $\\sqrt{x^2}=|x|$.`,
      };
    },
    wr_keine_reelle() {
      const c = pick([1, 2, 3, 4, 5, 6, 7, 8] as const);
      return {
        frage: `Wie viele reelle Lösungen hat die Gleichung $x^2+${c}=0$?`,
        loesung: `Keine. Denn $x^2=-${c}$ ist in $\\mathbb{R}$ unmöglich.`,
      };
    },
    kg_radius_zu_durchmesser() {
      const r = pick([3, 4, 5, 6, 7, 8, 9] as const);
      return {
        frage: `Im Kreis ist der Radius $r=${r}\\,\\text{cm}$. Bestimme den Durchmesser $d$.`,
        loesung: `$d=2r=2\\cdot ${r}=${2 * r}\\,\\text{cm}$.`,
        diagram: svgKreisRadiusDurchmesser({ radiusLabel: `${r}`, diameterLabel: '?' }),
      };
    },
    kg_durchmesser_zu_radius() {
      const r = pick([3, 4, 5, 6, 7, 8, 9] as const);
      const d = 2 * r;
      return {
        frage: `Im Kreis ist der Durchmesser $d=${d}\\,\\text{cm}$. Bestimme den Radius $r$.`,
        loesung: `$r=\\frac{d}{2}=\\frac{${d}}{2}=${r}\\,\\text{cm}$.`,
        diagram: svgKreisRadiusDurchmesser({ radiusLabel: '?', diameterLabel: `${d}` }),
      };
    },
    kg_umfang() {
      const r = pick([3, 4, 5, 6, 7, 8] as const);
      const approx = (2 * Math.PI * r).toFixed(1);
      return {
        frage: `Berechne den Umfang eines Kreises mit Radius $r=${r}\\,\\text{cm}$.`,
        loesung: `$U=2\\pi r=2\\pi\\cdot ${r}=${2 * r}\\pi\\,\\text{cm}\\approx ${approx}\\,\\text{cm}$.`,
        diagram: svgKreisRadiusDurchmesser({ radiusLabel: `${r}`, diameterLabel: `${2 * r}` }),
      };
    },
    kg_flaeche() {
      const r = pick([3, 4, 5, 6, 7] as const);
      const approx = (Math.PI * r * r).toFixed(1);
      return {
        frage: `Berechne den Flächeninhalt eines Kreises mit Radius $r=${r}\\,\\text{cm}$.`,
        loesung: `$A=\\pi r^2=\\pi\\cdot ${r}^2=${r * r}\\pi\\,\\text{cm}^2\\approx ${approx}\\,\\text{cm}^2$.`,
        diagram: svgKreisRadiusDurchmesser({ radiusLabel: `${r}`, diameterLabel: `${2 * r}` }),
      };
    },
    kg_sektor_anteil() {
      const alpha = pick([30, 45, 60, 90, 120, 150, 180] as const);
      const r = pick([4, 5, 6, 7, 8] as const);
      const numerator = alpha;
      const denominator = 360;
      return {
        frage: `Ein Kreissektor hat den Mittelpunktswinkel $${alpha}^\\circ$ und Radius $r=${r}\\,\\text{cm}$. Welchen Anteil der Kreisfläche hat der Sektor?`,
        loesung: `Anteil: $\\frac{${numerator}}{${denominator}}=\\frac{${numerator / 15}}{${denominator / 15}}$. Damit $A_{\\text{Sektor}}=\\frac{${numerator}}{${denominator}}\\cdot \\pi\\cdot ${r}^2=\\frac{${numerator}}{${denominator}}\\cdot ${r * r}\\pi\\,\\text{cm}^2$.`,
        diagram: svgKreisSektor({ grad: alpha, anteilLabel: `${alpha}/360 der Kreisfläche` }),
      };
    },
    kg_tangente_rechtwinklig() {
      const r = pick([4, 5, 6, 7, 8] as const);
      return {
        frage: `In der Skizze berührt eine Tangente den Kreis. Welchen Winkel bildet der Radius im Berührpunkt mit der Tangente?`,
        loesung: `Immer $90^\\circ$. Radius und Tangente stehen im Berührpunkt senkrecht aufeinander.`,
        diagram: svgKreisTangente({ radiusLabel: `${r}` }),
      };
    },
  };

  return GEN;
}
