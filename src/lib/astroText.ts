/**
 * Textstellen in einer `.astro`-Seite finden und zurückschreiben.
 *
 * Eine Seite wie `src/pages/ueber.astro` besteht zu neun Zehnteln aus
 * Auszeichnung. Wer dort einen Satz ändern will, sucht ihn zwischen
 * `class="not-prose my-8 flex flex-col"` — das ist Codelesen, kein
 * Textbearbeiten. Dieses Modul zieht die lesbaren Stellen heraus, damit die
 * Redaktion nur sie anzeigt.
 *
 * Bevorzugt wird dabei der ganze Absatz: Ein `<p>`, `<li>` oder `<h2>`, das
 * nur Text und harmlose Auszeichnung enthält, wird als *eine* Stelle
 * angeboten — mitsamt seinen `<em>`- und Link-Tags. Erst wo das nicht sicher
 * geht (Astro-Ausdrücke, verschachtelte Absätze, unbekannte Elemente), fällt
 * das Modul auf die einzelnen Textstücke zurück.
 *
 * Der Grundsatz ist derselbe wie beim Frontmatter in `redaktionText.ts`:
 * Nichts wird neu erzeugt. Jede Fundstelle merkt sich ihre Zeichenposition im
 * Original; beim Speichern wird ausschließlich dieser Ausschnitt ersetzt und
 * alles dazwischen zeichengenau übernommen.
 */

export type Textstelle = {
  /** Erste Zeichenposition des Textes im Original. */
  start: number;
  /** Position hinter dem letzten Zeichen. */
  ende: number;
  /** Der Inhalt so, wie er in der Datei steht. */
  roh: string;
  /** Das unmittelbar umgebende Element bzw. der Attributname. */
  herkunft: string;
  /**
   * Kennung des umgebenden Absatzes. Wo auf Textstücke zurückgefallen wird,
   * tragen alle Stücke eines Satzes dieselbe Kennung und gehören in der
   * Anzeige zusammen.
   */
  gruppe: string;
  /** Das Element, das die Gruppe bildet — etwa `p` oder `li`. */
  gruppenElement: string;
  /**
   * `absatz` — ganzer Absatzinhalt samt Auszeichnung, in einem Feld.
   * `inhalt` — einzelnes Textstück (Rückfall).
   * `attribut` — Text in einem Attribut.
   */
  art: 'absatz' | 'inhalt' | 'attribut';
  /** Nur bei `absatz`: Anfang des öffnenden Tags im Original. */
  elementVon?: number;
  /** Nur bei `absatz`: Position hinter dem schließenden Tag. */
  elementBis?: number;
};

/** Inhalt eines frisch eingefügten Absatzes — er muss Buchstaben tragen, sonst fände ihn niemand wieder. */
export const NEUER_ABSATZ_TEXT = 'Neuer Text.';

/** Elemente, die einen Absatz aufmachen und als Ganzes bearbeitbar sind. */
const ABSATZ = new Set([
  'p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'th', 'dt', 'dd',
  'figcaption', 'summary', 'blockquote', 'caption', 'button', 'label', 'legend',
]);

/** Auszeichnung, die innerhalb eines Absatzfelds erlaubt ist. */
export const ERLAUBTE_TAGS = new Set([
  'a', 'em', 'strong', 'b', 'i', 'code', 'abbr', 'q', 'cite', 'span', 'small',
  'mark', 's', 'u', 'sub', 'sup', 'time', 'kbd', 'var', 'del', 'ins', 'br', 'wbr',
]);

/** Elemente ohne Inhalt — sie dürfen die Verschachtelung nicht vertiefen. */
const LEER = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr', 'path', 'circle', 'rect', 'line', 'polygon',
  'polyline', 'ellipse', 'use', 'stop',
]);

/** Attribute, die in einem Absatzfeld stehen dürfen. */
export const ERLAUBTE_ATTRIBUTE = new Set([
  'href', 'title', 'lang', 'rel', 'target', 'class', 'id', 'datetime', 'cite',
  'aria-label', 'aria-hidden',
]);

/** Attribute, die sichtbaren Text tragen. Alles andere bleibt unangetastet. */
const TEXT_ATTRIBUTE = ['title', 'beschreibung', 'alt', 'aria-label', 'placeholder'];

/** Bereiche, in denen nichts als Fließtext gilt: Frontmatter, Stil, Skript, Kommentare. */
function gesperrteBereiche(quelle: string): Array<[number, number]> {
  const bereiche: Array<[number, number]> = [];

  const fm = /^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(\r?\n|$)/.exec(quelle);
  if (fm) bereiche.push([0, fm[0].length]);

  const muster = [/<(style|script)\b[^>]*>[\s\S]*?<\/\1>/gi, /<!--[\s\S]*?-->/g];
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

const TAG = /<(\/?)([A-Za-z][A-Za-z0-9.-]*)((?:"[^"]*"|'[^']*'|[^>])*?)(\/?)>/g;

type RohTag = {
  start: number;
  ende: number;
  name: string;
  klein: string;
  schliessend: boolean;
  selbst: boolean;
  attribute: string;
  attrStart: number;
};

function findeTags(quelle: string): RohTag[] {
  const aus: RohTag[] = [];
  TAG.lastIndex = 0;
  for (const t of quelle.matchAll(TAG)) {
    const [ganz, schraeg, name, attribute, selbst] = t;
    const start = t.index;
    aus.push({
      start,
      ende: start + ganz.length,
      name,
      klein: name.toLowerCase(),
      schliessend: schraeg === '/',
      selbst: selbst === '/',
      attribute,
      attrStart: start + 1 + (schraeg ? 1 : 0) + name.length,
    });
  }
  return aus;
}

/** Grenzen des Inhalts, ohne die umgebenden Leerzeichen. */
function beschnitten(quelle: string, von: number, bis: number) {
  const roh = quelle.slice(von, bis);
  const vorne = roh.length - roh.trimStart().length;
  const text = roh.trim();
  return { start: von + vorne, ende: von + vorne + text.length, text };
}

/**
 * Findet alle bearbeitbaren Stellen, aufsteigend nach Position und
 * überschneidungsfrei.
 *
 * Ein einziger Durchlauf über die Elemente führt einen Stapel der offenen
 * Verschachtelung mit. Nur daraus lässt sich sagen, wozu ein Textstück gehört
 * und welcher Absatz sich als Ganzes anbieten lässt.
 */
export function findeTextstellen(quelle: string): Textstelle[] {
  const gesperrt = gesperrteBereiche(quelle);
  const tags = findeTags(quelle);

  // --- Absätze bestimmen, die sich als Ganzes anbieten lassen ----------------
  type Kandidat = {
    name: string;
    /** Grenzen des Inhalts. */
    von: number;
    bis: number;
    /** Grenzen des Elements samt seiner Tags. */
    elementVon: number;
    elementBis: number;
    tagVon: number;
    tagBis: number;
  };
  const kandidaten: Kandidat[] = [];
  const offen: Array<{ name: string; klein: string; start: number; ende: number; i: number }> = [];

  tags.forEach((tag, i) => {
    if (tag.schliessend) {
      for (let k = offen.length - 1; k >= 0; k--) {
        if (offen[k].klein !== tag.klein) continue;
        const auf = offen[k];
        offen.length = k;
        if (ABSATZ.has(auf.klein)) {
          kandidaten.push({
            name: auf.klein,
            von: auf.ende,
            bis: tag.start,
            elementVon: auf.start,
            elementBis: tag.ende,
            tagVon: auf.i,
            tagBis: i,
          });
        }
        break;
      }
    } else if (!tag.selbst && !LEER.has(tag.klein)) {
      offen.push({ name: tag.name, klein: tag.klein, start: tag.start, ende: tag.ende, i });
    }
  });

  const geeignet = kandidaten.filter((k) => {
    const inhalt = quelle.slice(k.von, k.bis);
    // Astro-Ausdrücke werden nie angefasst.
    if (inhalt.includes('{') || inhalt.includes('}')) return false;
    if (liegtDrin(gesperrt, k.von, k.bis)) return false;
    if (!hatBuchstaben(inhalt)) return false;
    // Nur harmlose Auszeichnung darin — sonst lieber die einzelnen Stücke.
    for (let i = k.tagVon + 1; i < k.tagBis; i++) {
      if (!ERLAUBTE_TAGS.has(tags[i].klein)) return false;
      // Trägt ein Element darin ein Attribut, das die Prüfung später nicht
      // durchließe, wird der Absatz gar nicht erst als Ganzes angeboten.
      // Sonst könnte hier ein `data-kat` verschwinden, an dem die
      // Kategorienfilterung hängt — der Bau liefe durch, die Seite wäre kaputt.
      for (const attr of tags[i].attribute.matchAll(/([A-Za-z][A-Za-z0-9-]*)\s*=/g)) {
        if (!ERLAUBTE_ATTRIBUTE.has(attr[1].toLowerCase())) return false;
      }
    }
    return true;
  });

  // Innerste gewinnen: Ein Absatz, der einen anderen enthält, wird nicht angeboten.
  const absaetze = geeignet.filter(
    (k) => !geeignet.some((a) => a !== k && a.von >= k.von && a.bis <= k.bis)
  );

  const imAbsatz = (start: number, ende: number) =>
    absaetze.some((a) => start >= a.von && ende <= a.bis);

  // --- Stellen einsammeln ---------------------------------------------------
  const stellen: Textstelle[] = [];

  for (const absatz of absaetze) {
    const { start, ende, text } = beschnitten(quelle, absatz.von, absatz.bis);
    stellen.push({
      start,
      ende,
      roh: text,
      herkunft: absatz.name,
      gruppe: `absatz@${start}`,
      gruppenElement: absatz.name,
      art: 'absatz',
      elementVon: absatz.elementVon,
      elementBis: absatz.elementBis,
    });
  }

  // Textstücke und Attribute überall dort, wo kein ganzer Absatz greift.
  const stapel: Array<{ name: string; start: number }> = [];
  const attrMuster = new RegExp(`\\b(${TEXT_ATTRIBUTE.join('|')})="([^"{}]*)"`, 'g');

  const gruppeVon = () => {
    for (let i = stapel.length - 1; i >= 0; i--) {
      if (ABSATZ.has(stapel[i].name.toLowerCase())) return stapel[i];
    }
    return null;
  };

  const nimmStueck = (von: number, bis: number) => {
    const { start, ende, text } = beschnitten(quelle, von, bis);
    if (!text || !hatBuchstaben(text)) return;
    if (liegtDrin(gesperrt, start, ende) || imAbsatz(start, ende)) return;

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

  const nimmInhalt = (von: number, bis: number) => {
    const roh = quelle.slice(von, bis);
    if (!roh.includes('{') && !roh.includes('}')) {
      nimmStueck(von, bis);
      return;
    }
    // Steht ein Astro-Ausdruck im Text, bleibt er unantastbar — aber der Text
    // daneben soll trotzdem bearbeitbar sein („Anteil: {prozent} Prozent“).
    //
    // Das gilt nur für vollständige Klammerpaare in dieser Stelle. Bleibt nach
    // dem Herausrechnen eine einzelne Klammer übrig, gehört sie zu einem
    // mehrzeiligen Ausdruck wie `{zeigePortrait && (` — dann bleibt die ganze
    // Stelle außen vor.
    if (/[{}]/.test(roh.replace(/\{[^{}]*\}/g, ''))) return;
    let pos = von;
    for (const ausdruck of roh.matchAll(/\{[^{}]*\}/g)) {
      nimmStueck(pos, von + ausdruck.index);
      pos = von + ausdruck.index + ausdruck[0].length;
    }
    nimmStueck(pos, bis);
  };

  let pos = 0;
  for (const tag of tags) {
    nimmInhalt(pos, tag.start);
    pos = tag.ende;

    if (!tag.schliessend) {
      for (const attr of tag.attribute.matchAll(attrMuster)) {
        const wert = attr[2];
        if (!wert || !hatBuchstaben(wert)) continue;
        const start = tag.attrStart + attr.index + attr[1].length + 2;
        const ende = start + wert.length;
        if (liegtDrin(gesperrt, start, ende) || imAbsatz(start, ende)) continue;
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

    if (tag.schliessend) {
      for (let i = stapel.length - 1; i >= 0; i--) {
        if (stapel[i].name.toLowerCase() === tag.klein) {
          stapel.length = i;
          break;
        }
      }
    } else if (!tag.selbst && !LEER.has(tag.klein)) {
      stapel.push({ name: tag.name, start: tag.start });
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
 * Baut einen neuen Absatz derselben Art, der hinter den gegebenen gehört.
 *
 * Das öffnende Tag wird übernommen, damit der neue Absatz aussieht wie sein
 * Vorgänger — ein `class="text-lg"` gilt dann auch für ihn. Nur `id` bleibt
 * weg: die darf es kein zweites Mal geben.
 *
 * Zurück kommt die Stelle, an der eingefügt wird, und der einzufügende Text.
 * Geschrieben wird wie sonst auch über `setzeTextstellen` — die Einfügung ist
 * dort eine Stelle der Länge null.
 */
export function baueFolgeAbsatz(
  quelle: string,
  stelle: Textstelle
): { position: number; text: string } | null {
  if (stelle.art !== 'absatz' || stelle.elementVon === undefined || stelle.elementBis === undefined) {
    return null;
  }

  const auf = /^<[^>]*>/.exec(quelle.slice(stelle.elementVon, stelle.start))?.[0];
  if (!auf) return null;

  // Eine zweite gleiche id wäre ein Fehler in der Seite.
  const oeffnend = auf.replace(/\s+id="[^"]*"/g, '');
  const zeilenanfang = quelle.lastIndexOf('\n', stelle.elementVon) + 1;
  const einzug = /^[ \t]*/.exec(quelle.slice(zeilenanfang, stelle.elementVon))?.[0] ?? '';

  return {
    position: stelle.elementBis,
    text: `\n${einzug}${oeffnend}${NEUER_ABSATZ_TEXT}</${stelle.herkunft}>`,
  };
}

/**
 * Fügt den neuen Absatz in die Liste der Stellen ein — als Stelle der Länge
 * null an der richtigen Position. Danach schreibt `setzeTextstellen` wie
 * gewohnt, und ein erneutes `findeTextstellen` findet den neuen Absatz als
 * ganz gewöhnliches Feld wieder.
 */
export function mitEinfuegung(
  stellen: Textstelle[],
  werte: Array<string | null>,
  position: number,
  text: string
): { stellen: Textstelle[]; werte: Array<string | null> } {
  const marke: Textstelle = {
    start: position,
    ende: position,
    roh: '',
    herkunft: '',
    gruppe: `einfuegung@${position}`,
    gruppenElement: '',
    art: 'inhalt',
  };

  // Hinter alle Stellen, die vor dieser Position enden.
  let i = stellen.findIndex((s) => s.start >= position);
  if (i === -1) i = stellen.length;

  return {
    stellen: [...stellen.slice(0, i), marke, ...stellen.slice(i)],
    werte: [...werte.slice(0, i), text, ...werte.slice(i)],
  };
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
 *
 * Gilt für Felder ohne Auszeichnung. Absatzfelder gehen durch `absatzZurDatei`.
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

// ===========================================================================
// Absatzfelder: Auszeichnung erlaubt, aber geprüft
// ===========================================================================

/** Ein `&`, das keine Entität einleitet, ist gemeint als Zeichen. */
const ENTITAET = /^&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]{1,31});/;

/** Beginnt hier ein Tag, das im Absatz erlaubt ist? */
function tagAb(text: string, i: number): RegExpExecArray | null {
  const rest = text.slice(i);
  const treffer = /^<(\/?)([A-Za-z][A-Za-z0-9.-]*)((?:"[^"]*"|'[^']*'|[^>])*?)(\/?)>/.exec(rest);
  if (!treffer) return null;
  return ERLAUBTE_TAGS.has(treffer[2].toLowerCase()) ? treffer : null;
}

/**
 * Was die Redaktion aus einem Absatzfeld in die Datei schreibt.
 *
 * Erlaubte Auszeichnung bleibt stehen. Alles andere wird zu Text: ein `<`, das
 * kein erlaubtes Tag einleitet (jemand schreibt „für a < b“), ein `&`, das
 * keine Entität ist, und geschweifte Klammern, die sonst zu einem
 * Astro-Ausdruck würden.
 */
export function absatzZurDatei(anzeige: string): string {
  let aus = '';
  let i = 0;
  while (i < anzeige.length) {
    const z = anzeige[i];

    if (z === '<') {
      const tag = tagAb(anzeige, i);
      if (tag) {
        aus += tag[0];
        i += tag[0].length;
        continue;
      }
      aus += '&lt;';
      i++;
      continue;
    }

    if (z === '&') {
      if (ENTITAET.test(anzeige.slice(i))) {
        const bis = anzeige.indexOf(';', i) + 1;
        aus += anzeige.slice(i, bis);
        i = bis;
        continue;
      }
      aus += '&amp;';
      i++;
      continue;
    }

    if (z === '{') {
      aus += '&#123;';
      i++;
      continue;
    }
    if (z === '}') {
      aus += '&#125;';
      i++;
      continue;
    }

    aus += z;
    i++;
  }
  return aus;
}

/**
 * Prüft ein Absatzfeld, bevor es gespeichert wird. Gibt eine Meldung in
 * verständlichem Deutsch zurück oder `null`, wenn alles in Ordnung ist.
 *
 * Geprüft wird der Text, wie er in die Datei ginge — also nach `absatzZurDatei`.
 * Was dort schon zu Text entschärft wurde, kann hier nichts mehr auslösen.
 */
export function pruefeAbsatz(anzeige: string): string | null {
  const text = absatzZurDatei(anzeige);
  const stapel: string[] = [];

  TAG.lastIndex = 0;
  for (const treffer of text.matchAll(TAG)) {
    const name = treffer[2].toLowerCase();
    const schliessend = treffer[1] === '/';
    const selbst = treffer[4] === '/';

    if (!ERLAUBTE_TAGS.has(name)) {
      return `<${name}> ist hier nicht erlaubt. Möglich sind: ${[...ERLAUBTE_TAGS].join(', ')}.`;
    }

    for (const attr of treffer[3].matchAll(/([A-Za-z][A-Za-z0-9-]*)\s*=\s*("[^"]*"|'[^']*')/g)) {
      const attrName = attr[1].toLowerCase();
      if (!ERLAUBTE_ATTRIBUTE.has(attrName)) {
        return `Das Attribut ${attrName} ist hier nicht erlaubt (in <${name}>).`;
      }
      if ((attrName === 'href' || attrName === 'cite') && /^\s*["']?\s*javascript:/i.test(attr[2])) {
        return 'Ein Link darf kein javascript: enthalten.';
      }
    }

    if (LEER.has(name) || selbst) continue;

    if (schliessend) {
      if (stapel.pop() !== name) return `</${name}> passt zu keinem offenen <${name}>.`;
    } else {
      stapel.push(name);
    }
  }

  if (stapel.length) {
    return `<${stapel[stapel.length - 1]}> wurde nicht geschlossen.`;
  }
  return null;
}
