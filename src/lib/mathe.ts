/**
 * Setzt die Schreibweise der Aufgabenfolgen in LaTeX um.
 *
 * Die Aufgabenfolgen notieren Mathematik in Code-Spans: `(x + 3)²`, `5/6 + 7/10`,
 * `√50 = 5√2`. Das ist als Quelltext gemeint gewesen und sieht auch so aus –
 * an der Wand steht dann ein Bruch als Schrägstrich und ein Term in
 * Schreibmaschinenschrift. Diese Umsetzung macht daraus echten Formelsatz.
 *
 * Grundsatz: Es wird nichts geraten. Was nicht sicher erkannt wird, bleibt
 * unverändert stehen und wird von KaTeX als gewöhnlicher Text gesetzt –
 * lieber schlicht als falsch.
 */

const HOCH: Record<string, string> = { '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁻': '-', '¹': '1', '⁰': '0' };

/** Findet den Ausdruck links vom Bruchstrich: Klammer, Zahl, Variable. */
function linkerTeil(s: string, ende: number): number {
  let i = ende;
  if (s[i - 1] === ')') {
    let tiefe = 0;
    for (i = ende; i > 0; i--) {
      if (s[i - 1] === ')') tiefe++;
      if (s[i - 1] === '(') { tiefe--; if (tiefe === 0) return i - 1; }
    }
    return 0;
  }
  while (i > 0 && /[0-9a-zA-Zäöüπ.,]/.test(s[i - 1])) i--;
  return i;
}

/** Findet den Ausdruck rechts vom Bruchstrich. */
function rechterTeil(s: string, start: number): number {
  let i = start;
  if (s[i] === '(') {
    let tiefe = 0;
    for (; i < s.length; i++) {
      if (s[i] === '(') tiefe++;
      if (s[i] === ')') { tiefe--; if (tiefe === 0) return i + 1; }
    }
    return s.length;
  }
  while (i < s.length && /[0-9a-zA-Zäöüπ.,]/.test(s[i])) i++;
  return i;
}

const UNICODE_BRUCH: Record<string, string> = {
  '½': '\\frac{1}{2}', '⅓': '\\frac{1}{3}', '⅔': '\\frac{2}{3}', '¼': '\\frac{1}{4}',
  '¾': '\\frac{3}{4}', '⅕': '\\frac{1}{5}', '⅛': '\\frac{1}{8}', '⅜': '\\frac{3}{8}',
};

export function alsLatex(quelle: string): string {
  let s = quelle;

  // Lücken zum Ausfüllen: „1/2 + ___ = 3/4". Unterstriche sind in LaTeX
  // Indizes und zerbrechen den Ausdruck – hier soll eine Linie stehen.
  s = s.replace(/_{2,}/g, '\\underline{\\phantom{XX}}');

  // Vorgefertigte Bruchzeichen aus dem Zeichensatz
  s = s.replace(/[½⅓⅔¼¾⅕⅛⅜]/g, (m) => UNICODE_BRUCH[m] ?? m);

  // Hochgestellte Ziffern: x² → x^{2}
  s = s.replace(/([²³⁴⁵⁶¹⁰⁻]+)/g, (m) => '^{' + [...m].map((z) => HOCH[z] ?? z).join('') + '}');

  // Wurzeln: √50 → \sqrt{50}, √((-3)²) → \sqrt{(-3)^{2}}.
  // Klammern werden gezählt, nicht gematcht – sonst zerbricht die erste
  // geschachtelte Klammer den Ausdruck.
  while (s.includes('√')) {
    const i = s.indexOf('√');
    let j = i + 1;
    while (j < s.length && s[j] === ' ') j++;
    const ende = rechterTeil(s, j);
    const inhalt = s.slice(j, ende).trim().replace(/^\((.*)\)$/, '$1');
    if (!inhalt) { s = s.slice(0, i) + '\\surd' + s.slice(i + 1); continue; }
    s = s.slice(0, i) + '\\sqrt{' + inhalt + '}' + s.slice(ende);
  }

  // Brüche: 5/6 und (3x)/(5x) → \frac{…}{…}. Von links nach rechts, damit
  // 46/30 = 23/15 beide Brüche erwischt.
  let pos = 0;
  while (true) {
    const i = s.indexOf('/', pos);
    if (i < 0) break;
    const a = linkerTeil(s, i);
    const b = rechterTeil(s, i + 1);
    const zaehler = s.slice(a, i).trim();
    const nenner = s.slice(i + 1, b).trim();
    if (!zaehler || !nenner) { pos = i + 1; continue; }
    const ersetzung = '\\frac{' + zaehler.replace(/^\(|\)$/g, '') + '}{' + nenner.replace(/^\(|\)$/g, '') + '}';
    s = s.slice(0, a) + ersetzung + s.slice(b);
    pos = a + ersetzung.length;
  }

  // In Markdown-Tabellen ist ein senkrechter Strich als \| maskiert. Er
  // trennt dort keine Zelle, sondern gehört zum Ausdruck: A(3 | 2).
  s = s.replace(/\\\|/g, '\\mid ');

  // Zeichen, die LaTeX anders schreibt
  s = s
    .replace(/−/g, '-')
    .replace(/[·∙]/g, '\\cdot ')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/≈/g, '\\approx ')
    .replace(/≠/g, '\\neq ')
    .replace(/≤/g, '\\le ')
    .replace(/≥/g, '\\ge ')
    .replace(/∞/g, '\\infty ')
    .replace(/°/g, '^{\\circ}')
    .replace(/%/g, '\\,\\%');

  // Funktionsnamen aufrecht setzen
  s = s.replace(/\b(sin|cos|tan|log|ln|lg)\b/g, '\\$1');

  // Dezimalkomma: 0,75 → 0{,}75 (sonst setzt KaTeX einen Abstand dahinter)
  s = s.replace(/(\d),(\d)/g, '$1{,}$2');

  // Text in Anführungszeichen bleibt Text
  s = s.replace(/„([^"]*)"/g, '\\text{„$1"}');

  return s.trim();
}

/** Wandelt eine Zelle aus einer Aufgabenfolge in LaTeX, samt Code-Spans. */
export function zelleAlsLatex(zelle: string): string {
  // Steht die ganze Zelle in einem Code-Span, ist alles Mathematik.
  const ganz = zelle.trim().match(/^`([^`]+)`$/);
  if (ganz) return alsLatex(ganz[1]);
  // Sonst nur die Code-Span-Teile umsetzen und den Rest als Text lassen.
  if (zelle.includes('`')) {
    return zelle.replace(/`([^`]+)`/g, (_, m) => '$' + alsLatex(m) + '$');
  }
  return zelle;
}
