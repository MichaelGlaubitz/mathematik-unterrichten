/**
 * Textstellen in einer `.astro`-Seite finden und zurückschreiben.
 *
 * Eine Seite wie `src/pages/ueber.astro` besteht zu neun Zehnteln aus
 * Auszeichnung. Wer dort einen Satz ändern will, sucht ihn zwischen
 * `class="not-prose my-8 flex flex-col"` — das ist Codelesen, kein
 * Textbearbeiten. Dieses Modul zieht die lesbaren Stellen heraus, damit die
 * Redaktion nur sie anzeigt.
 *
 * Es ist derselbe Grundsatz wie beim Frontmatter in `redaktionText.ts`: Nichts
 * wird neu erzeugt. Jede Fundstelle merkt sich ihre Zeichenposition im
 * Original; beim Speichern wird ausschließlich dieser Ausschnitt ersetzt und
 * alles dazwischen zeichengenau übernommen. Was das Modul nicht sicher als
 * Text erkennt, fasst es nicht an — dafür bleibt die Rohansicht.
 */

export type Textstelle = {
  /** Erste Zeichenposition des Textes im Original. */
  start: number;
  /** Position hinter dem letzten Zeichen. */
  ende: number;
  /** Der Text so, wie er in der Datei steht (mit Entitäten). */
  roh: string;
  /** Das unmittelbar umgebende Element bzw. der Attributname. */
  herkunft: string;
  /**
   * Kennung des umgebenden Absatzes. Ein Satz mit `<em>` zerfällt in mehrere
   * Stellen; alle tragen dieselbe Kennung und gehören in der Anzeige zusammen.
   */
  gruppe: string;
  /** Das Element, das die Gruppe bildet — etwa `p` oder `li`. */
  gruppenElement: string;
  art: 'inhalt' | 'attribut';
};

/** Elemente, die einen eigenen Absatz aufmachen. */
const BLOCK = new Set([
  'p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'th', 'dt', 'dd',
  'figcaption', 'summary', 'blockquote', 'caption', 'label', 'button', 'a',
]);

/** Elemente ohne Inhalt — sie dürfen die Verschachtelung nicht vertiefen. */
const LEER = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr', 'path', 'circle', 'rect', 'line', 'polygon',
  'polyline', 'ellipse', 'use', 'stop',
]);

/** Attribute, die sichtbaren Text tragen. Alles andere bleibt unangetastet. */
const TEXT_ATTRIBUTE = ['title', 'beschreibung', 'alt', 'aria-label', 'placeholder'];

/** Bereiche, in denen nichts als Fließtext gilt: Frontmatter, Stil, Skript, Kommentare. */
function gesperrteBereiche(quelle: string): Array<[number, number]> {
  const bereiche: Array<[number, number]> = [];

  const fm = /^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(\r?\n|$)/.exec(quelle);
  if (fm) bereiche.push([0, fm[0].length]);

  const muster = [
    /<(style|script)\b[^>]*>[\s\S]*?<\/\1>/gi,
    /<!--[\s\S]*?-->/g,
  ];
  for (const m of muster) {
    for (const treffer of quelle.matchAll(m)) {
      bereiche.push([treffer.index, treffer.index + treffer[0].length]);
    }
  }
  return bereiche;
}

const liegtDrin = (bereiche: Array<[number, number]>, start: number, ende: number) =>
  bereiche.some(([a, b]) => start < b && ende > a);

/** Mindestens ein Buchstabe — reine Satzzeichen und Zahlen sind kein Text zum Pflegen. */
const hatBuchstaben = (s: string) => /\p{L}/u.test(s);

/** Ein Element mit Attributen, in einem Zug erkannt. */
const TAG = /<(\/?)([A-Za-z][A-Za-z0-9.-]*)((?:"[^"]*"|'[^']*'|[^>])*?)(\/?)>/g;

/**
 * Findet alle bearbeitbaren Textstellen, aufsteigend nach Position und
 * überschneidungsfrei.
 *
 * Ein einziger Durchlauf über die Elemente führt einen Stapel der offenen
 * Verschachtelung mit. Nur daraus lässt sich richtig sagen, wozu ein Textstück
 * gehört: Das Stück hinter `</em>` steht wieder im Absatz, nicht in der
 * Betonung.
 */
export function findeTextstellen(quelle: string): Textstelle[] {
  const gesperrt = gesperrteBereiche(quelle);
  const stellen: Textstelle[] = [];
  const stapel: Array<{ name: string; start: number }> = [];
  const attrMuster = new RegExp(`\\b(${TEXT_ATTRIBUTE.join('|')})="([^"{}]*)"`, 'g');

  /** Der nächste umschließende Absatz — er bildet die Gruppe. */
  const gruppeVon = () => {
    for (let i = stapel.length - 1; i >= 0; i--) {
      if (BLOCK.has(stapel[i].name)) return stapel[i];
    }
    return null;
  };

  const nimmInhalt = (von: number, bis: number) => {
    const roh = quelle.slice(von, bis);
    // Geschweifte Klammern sind in Astro Ausdrücke — davon Finger weg.
    if (roh.includes('{') || roh.includes('}')) return;

    const vorne = roh.length - roh.trimStart().length;
    const text = roh.trim();
    if (!text || !hatBuchstaben(text)) return;

    const start = von + vorne;
    const ende = start + text.length;
    if (liegtDrin(gesperrt, start, ende)) return;

    const block = gruppeVon();
    stellen.push({
      start,
      ende,
      roh: text,
      herkunft: stapel.length ? stapel[stapel.length - 1].name : '',
      gruppe: block ? `${block.name}@${block.start}` : `frei@${start}`,
      gruppenElement: block ? block.name : (stapel.at(-1)?.name ?? ''),
      art: 'inhalt',
    });
  };

  let pos = 0;
  TAG.lastIndex = 0;
  for (const treffer of quelle.matchAll(TAG)) {
    const [ganz, schraeg, name, attribute, selbstschliessend] = treffer;
    const index = treffer.index;

    nimmInhalt(pos, index);
    pos = index + ganz.length;

    // Text in Attributen — die Position im Original mitrechnen.
    if (!schraeg) {
      const attrStart = index + 1 + name.length;
      for (const attr of attribute.matchAll(attrMuster)) {
        const wert = attr[2];
        if (!wert || !hatBuchstaben(wert)) continue;
        const start = attrStart + attr.index + attr[1].length + 2;
        const ende = start + wert.length;
        if (liegtDrin(gesperrt, start, ende)) continue;
        stellen.push({
          start,
          ende,
          roh: wert,
          herkunft: attr[1],
          gruppe: `attr@${start}`,
          gruppenElement: attr[1],
          art: 'attribut',
        });
      }
    }

    // Verschachtelung nachführen
    if (schraeg) {
      for (let i = stapel.length - 1; i >= 0; i--) {
        if (stapel[i].name === name) {
          stapel.length = i;
          break;
        }
      }
    } else if (!selbstschliessend && !LEER.has(name.toLowerCase())) {
      stapel.push({ name, start: index });
    }
  }
  nimmInhalt(pos, quelle.length);

  return stellen.sort((a, b) => a.start - b.start);
}

/**
 * Setzt die Datei aus Original und neuen Texten zusammen. `neue[i]` gehört zu
 * `stellen[i]`; `null` bedeutet unverändert und übernimmt das Original
 * zeichengenau — auch dann, wenn es Entitäten enthält, die eine Kodierung
 * sonst verändern würde.
 */
export function setzeTextstellen(
  quelle: string,
  stellen: Textstelle[],
  neue: Array<string | null>
): string {
  let aus = '';
  let pos = 0;
  stellen.forEach((stelle, i) => {
    const neu = neue[i];
    aus += quelle.slice(pos, stelle.start) + (neu === null || neu === undefined ? stelle.roh : neu);
    pos = stelle.ende;
  });
  return aus + quelle.slice(pos);
}

/**
 * Für die Anzeige: den Zeilenumbruch der Quelle samt Einrückung zu einem
 * Leerzeichen machen. Im Quelltext steht ein Absatz über mehrere eingerückte
 * Zeilen; im Eingabefeld gehört er als ein Fließtext. Für das Ergebnis ist das
 * gleichgültig — HTML fasst solchen Leerraum ohnehin zusammen.
 */
export function alsZeile(roh: string): string {
  return roh.replace(/[ \t]*\r?\n[ \t]*/g, ' ');
}

/**
 * Für die Anzeige im Eingabefeld: Entitäten auflösen, damit im Feld steht, was
 * die Leserin später sieht.
 */
export function zurAnzeige(roh: string): string {
  return roh
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#123;/g, '{')
    .replace(/&#125;/g, '}')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

/**
 * Zurück in die Datei: alles maskieren, was sonst die Seite zerlegen würde.
 * Spitze Klammern würden zu Elementen, geschweifte zu Astro-Ausdrücken, und in
 * einem Attribut beendet ein Anführungszeichen den Wert.
 */
export function zurDatei(anzeige: string, art: 'inhalt' | 'attribut'): string {
  const grund = anzeige
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
  return art === 'attribut' ? grund.replace(/"/g, '&quot;') : grund;
}
