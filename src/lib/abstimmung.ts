// Verbindet die diagnostischen Fragen mit dem Werkzeug "Abstimmung".
//
// Das Werkzeug ist bewusst eine einzelne HTML-Datei ohne Framework und ohne
// KaTeX (siehe AGENTS.md: es muss auch dann laufen, wenn das Schulnetz weg
// ist). Die Fragen kommen deshalb schon als lesbarer Text an, nicht als LaTeX –
// die Umwandlung passiert hier beim Bauen, wo sie sich testen lässt.
//
// Übergeben wird der Fragensatz im URL-Fragment (#q=…). Das Fragment verlässt
// den Browser nie: Es steht in keiner Server-Anfrage und in keinem Log. Damit
// bleibt das Versprechen der Werkzeuge unangetastet – es wird nichts übertragen.

export interface AbstimmungsOption {
  text: string;
  korrekt: boolean;
}

export interface AbstimmungsFrage {
  frage: string;
  optionen: AbstimmungsOption[];
}

/** Kompaktes Format, das die Abstimmung liest. Kurze Schlüssel halten die URL klein. */
export interface Fragensatz {
  t: string;
  q: Array<{ f: string; o: string[]; r: number }>;
}

const HOCH: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '−': '⁻', 'n': 'ⁿ', 'x': 'ˣ',
};

const TIEF: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '−': '₋', 'n': 'ₙ',
};

// (?![a-zA-Z]) statt \b als Befehlsgrenze: In LaTeX endet ein Befehlswort am
// ersten Nicht-Buchstaben, und \b greift vor einem Unterstrich nicht (\log_2).
const ZEICHEN: Array<[RegExp, string]> = [
  [/\\cdot(?![a-zA-Z])/g, '·'],
  [/\\times(?![a-zA-Z])/g, '×'],
  [/\\div(?![a-zA-Z])/g, ':'],
  [/\\pm(?![a-zA-Z])/g, '±'],
  [/\\mp(?![a-zA-Z])/g, '∓'],
  [/\\neq(?![a-zA-Z])/g, '≠'],
  [/\\leq(?![a-zA-Z])/g, '≤'],
  [/\\geq(?![a-zA-Z])/g, '≥'],
  [/\\le(?![a-zA-Z])/g, '≤'],
  [/\\ge(?![a-zA-Z])/g, '≥'],
  [/\\approx(?![a-zA-Z])/g, '≈'],
  [/\\infty(?![a-zA-Z])/g, '∞'],
  [/\\pi(?![a-zA-Z])/g, 'π'],
  [/\\alpha(?![a-zA-Z])/g, 'α'],
  [/\\beta(?![a-zA-Z])/g, 'β'],
  [/\\gamma(?![a-zA-Z])/g, 'γ'],
  [/\\varphi(?![a-zA-Z])/g, 'φ'],
  [/\\circ(?![a-zA-Z])/g, '°'],
  [/\\mid(?![a-zA-Z])/g, '|'],
  [/\\in(?![a-zA-Z])/g, '∈'],
  [/\\notin(?![a-zA-Z])/g, '∉'],
  [/\\cup(?![a-zA-Z])/g, '∪'],
  [/\\cap(?![a-zA-Z])/g, '∩'],
  [/\\subset(?![a-zA-Z])/g, '⊂'],
  [/\\emptyset(?![a-zA-Z])/g, '∅'],
  [/\\Rightarrow(?![a-zA-Z])/g, '⇒'],
  [/\\Leftrightarrow(?![a-zA-Z])/g, '⇔'],
  [/\\rightarrow(?![a-zA-Z])/g, '→'],
  [/\\to(?![a-zA-Z])/g, '→'],
  [/\\ldots(?![a-zA-Z])/g, '…'],
  [/\\dots(?![a-zA-Z])/g, '…'],
  // Funktionsnamen behalten ihren Namen, verlieren nur den Backslash
  [/\\(log|ln|lg|sin|cos|tan|exp|max|min|ggT|kgV)(?![a-zA-Z])/g, '$1'],
  // Abstandsbefehle und Layout-Klammern tragen im Fließtext nichts bei
  [/\\left(?![a-zA-Z])/g, ''],
  [/\\right(?![a-zA-Z])/g, ''],
  [/\\!/g, ''],
  [/\\setminus(?![a-zA-Z])/g, '\\'],
  // Nur die echten Abstandsbefehle. Ein Backslash vor einem Leerzeichen bleibt
  // stehen: In "D = ℝ \\ {2; −3}" ist er die Mengendifferenz, kein Abstand.
  [/\\[,;:]/g, ' '],
  [/\\%/g, '%'],
  [/\\\$/g, '$'],
  [/\\&/g, '&'],
];

/**
 * Nimmt den Inhalt einer geschweiften Klammer ab Position `start`
 * (die auf die öffnende Klammer zeigt) und gibt ihn samt Endposition zurück.
 * Zählt verschachtelte Klammern mit, damit \frac{\frac{1}{2}}{3} hält.
 */
function klammerInhalt(s: string, start: number): { inhalt: string; ende: number } | null {
  if (s[start] !== '{') return null;
  let tiefe = 0;
  for (let i = start; i < s.length; i++) {
    if (s[i] === '{') tiefe++;
    else if (s[i] === '}') {
      tiefe--;
      if (tiefe === 0) return { inhalt: s.slice(start + 1, i), ende: i + 1 };
    }
  }
  return null;
}

/** Ist der Term von genau einem Klammerpaar umschlossen? */
function vollstaendigGeklammert(s: string): boolean {
  if (s[0] !== '(' || s[s.length - 1] !== ')') return false;
  let tiefe = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') tiefe++;
    else if (s[i] === ')') {
      tiefe--;
      // Zwischendurch auf 0: zwei Paare nebeneinander, etwa (x-1)(x+3)
      if (tiefe === 0 && i < s.length - 1) return false;
    }
  }
  return tiefe === 0;
}

/**
 * Klammert einen Zähler oder Nenner nur, wenn ohne Klammer die Bindung
 * falsch gelesen würde. Eine Zahl bleibt eine Zahl: 2/12, nicht 2/(12).
 */
function klammereWennNoetig(s: string): string {
  const einfach = /^[0-9]+(?:[,.][0-9]+)?$/.test(s)   // 12   2,5
    || /^[A-Za-zα-ωΑ-Ω][\u2080-\u2089]?$/.test(s)      // x    a₁
    || vollstaendigGeklammert(s);                     // (x+1)
  return einfach ? s : '(' + s + ')';
}

/**
 * Wandelt die Befehle um, die ein Argument in geschweiften Klammern nehmen.
 * Läuft von links nach rechts und ruft sich für die Argumente selbst auf.
 */
function befehleMitArgument(s: string): string {
  const muster = /\\(tfrac|dfrac|frac|sqrt|text|textrm|mathrm|bar|overline|underline|operatorname)/;
  let treffer = s.match(muster);
  let durchlauf = 0;

  while (treffer && treffer.index !== undefined && durchlauf++ < 200) {
    const befehl = treffer[1];
    let pos = treffer.index + treffer[0].length;

    // \sqrt[3]{x}: der optionale Wurzelexponent
    let wurzelgrad = '';
    if (befehl === 'sqrt' && s[pos] === '[') {
      const zu = s.indexOf(']', pos);
      if (zu > -1) {
        wurzelgrad = s.slice(pos + 1, zu);
        pos = zu + 1;
      }
    }

    const erstes = klammerInhalt(s, pos);
    if (!erstes) break;                       // unvollständig – unverändert lassen

    let ersatz: string;
    let ende = erstes.ende;

    if (befehl === 'frac' || befehl === 'tfrac' || befehl === 'dfrac') {
      const zweites = klammerInhalt(s, erstes.ende);
      if (!zweites) break;
      ende = zweites.ende;
      ersatz = klammereWennNoetig(befehleMitArgument(erstes.inhalt)) + '/' +
               klammereWennNoetig(befehleMitArgument(zweites.inhalt));
    } else if (befehl === 'sqrt') {
      const grad = wurzelgrad === '3' ? '∛' : wurzelgrad === '4' ? '∜' : '√';
      ersatz = grad + klammereWennNoetig(befehleMitArgument(erstes.inhalt));
    } else if (befehl === 'bar' || befehl === 'overline') {
      // Kombinierender Überstrich: hängt sich an das vorangehende Zeichen
      ersatz = befehleMitArgument(erstes.inhalt) + '̄';
    } else {
      // \text, \mathrm, \operatorname, \underline: nur der Inhalt zählt
      ersatz = befehleMitArgument(erstes.inhalt);
    }

    s = s.slice(0, treffer.index) + ersatz + s.slice(ende);
    treffer = s.match(muster);
  }

  return s;
}

/** ^2 und ^{12} zu hochgestellten Ziffern, _1 und _{n} zu tiefgestellten. */
function stellungen(s: string): string {
  const um = (zeichen: string, tabelle: Record<string, string>, roh: string) =>
    s.replace(
      new RegExp('\\' + zeichen + '(?:\\{([^{}]*)\\}|(\\S))', 'g'),
      (treffer, geklammert, einzeln) => {
        const inhalt = geklammert !== undefined ? geklammert : einzeln;
        const zeichenweise = [...inhalt].map((c) => tabelle[c]);
        return zeichenweise.every(Boolean) ? zeichenweise.join('') : roh + inhalt;
      },
    );

  s = um('^', HOCH, '^');
  s = um('_', TIEF, '_');
  return s;
}

/**
 * Macht aus einem Text mit LaTeX-Anteilen gut lesbaren Klartext –
 * für die Projektion an der Wand, wo kein Formelsatz zur Verfügung steht.
 */
export function mathZuText(roh: string): string {
  let s = roh;

  // Mathe-Umgebungen entklammern; der Inhalt bleibt stehen.
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  s = s.replace(/\$([^$]*)\$/g, '$1');
  s = s.replace(/\\\((.*?)\\\)/g, '$1');
  s = s.replace(/\\\[(.*?)\\\]/g, '$1');

  s = befehleMitArgument(s);
  for (const [muster, ersatz] of ZEICHEN) s = s.replace(muster, ersatz);
  s = stellungen(s);

  // Markdown-Betonungen, die in der Projektion nur stören
  s = s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/(?<!\w)\*(.+?)\*(?!\w)/g, '$1');

  // 0{,}75 ist die übliche Schreibweise für das deutsche Dezimalkomma –
  // die Klammern halten in LaTeX nur den Abstand klein.
  s = s.replace(/\{([,.])\}/g, '$1');

  // Verbliebene Gruppierungsklammern auflösen, echte Mengenklammern behalten:
  // {a} um ein einzelnes Zeichen ist Rest der Notation, {1; 2} ist eine Menge.
  s = s.replace(/\{([^{};,]?)\}/g, '$1');

  // Verknüpfungszeichen bekommen links und rechts Luft. In der Quelle steht
  // mal "a\\cdot b", mal "a \\cdot b" – an der Wand soll beides gleich aussehen.
  s = s.replace(/\s*([·×≠≤≥≈⇒⇔∈∉∪∩→])\s*/g, ' $1 ');

  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * In den Quizdateien steht die richtige Antwort fast immer an erster Stelle
 * (135 von 144 Fragen). Auf der Seite fällt das nicht auf, weil das Quiz die
 * Optionen im Browser mischt – projiziert man sie unverändert, hätte die Klasse
 * nach zwei Fragen heraus, dass A stimmt. Deshalb wird auch hier gemischt.
 *
 * Gemischt wird deterministisch aus dem Fragetext: Derselbe Text ergibt immer
 * dieselbe Reihenfolge. Sonst änderte sich der Link bei jedem Bauen, und eine
 * schon begonnene Zählung ließe sich nach einem Neuaufbau nicht fortsetzen.
 */
function saatAus(text: string): number {
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^ (h >>> 16)) >>> 0;
}

function zufallsfolge(saat: number): () => number {
  let z = saat;
  return function () {
    z = (z + 0x6d2b79f5) | 0;
    let t = Math.imul(z ^ (z >>> 15), 1 | z);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates mit fester Saat. */
export function mischeOptionen<T>(optionen: T[], saatText: string): T[] {
  const naechste = zufallsfolge(saatAus(saatText));
  const kopie = optionen.slice();
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(naechste() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

/** Baut den kompakten Fragensatz für die URL. */
export function fragensatz(titel: string, fragen: AbstimmungsFrage[]): Fragensatz {
  return {
    t: mathZuText(titel),
    q: fragen.map((f) => {
      const gemischt = mischeOptionen(f.optionen, f.frage);
      const richtig = gemischt.findIndex((o) => o.korrekt);
      return {
        f: mathZuText(f.frage),
        o: gemischt.map((o) => mathZuText(o.text)),
        r: Math.max(0, richtig),
      };
    }),
  };
}

/** base64url, damit das Fragment beim Kopieren nichts verliert. */
export function base64url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let roh = '';
  bytes.forEach((b) => { roh += String.fromCharCode(b); });
  const b64 = typeof btoa === 'function' ? btoa(roh) : Buffer.from(text, 'utf-8').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Fertiger Link auf die Abstimmung mit vorgeladenem Fragensatz. */
export function abstimmungsLink(titel: string, fragen: AbstimmungsFrage[]): string {
  return '/werkzeuge/abstimmung.html#q=' + base64url(JSON.stringify(fragensatz(titel, fragen)));
}
