/**
 * Absatzfelder als sichtbarer Text statt als Auszeichnung.
 *
 * Ein Feld, in dem `<strong>Das <a href="/konzept">KLAR-Konzept</a></strong>`
 * steht, ist kein Textfeld — das ist Code in klein. Deshalb bearbeitet die
 * Redaktion Absätze in einem `contenteditable`: Fett sieht fett aus, ein Link
 * sieht aus wie ein Link, und Formatierung wird über Knöpfe gesetzt.
 *
 * Dieses Modul übersetzt in beide Richtungen. Es ist die eigentliche
 * Sicherung: Was hier herauskommt, besteht ausschließlich aus erlaubten
 * Elementen mit erlaubten Attributen — alles andere wird ausgepackt oder zu
 * Text. Kaputte Auszeichnung lässt sich damit gar nicht erst eingeben.
 */
import { ERLAUBTE_ATTRIBUTE, ERLAUBTE_TAGS } from './astroText';

/** Was Browser beim Formatieren erzeugen, auf die Hausform bringen. */
const UMBENENNEN: Record<string, string> = {
  b: 'strong',
  i: 'em',
  strike: 's',
  del: 'del',
  font: '',
};

const OHNE_INHALT = new Set(['br', 'wbr']);

/**
 * Diese Elemente werden samt Inhalt verworfen, nicht ausgepackt: Der Rumpf
 * eines `<script>` ist kein Text, den man in einem Absatz stehen lassen will.
 */
const VERWERFEN = new Set([
  'script', 'style', 'noscript', 'template', 'iframe', 'object', 'embed', 'svg',
]);

/** Reiner Text, wie er in der Datei stehen muss. */
export function textZuMarkup(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function attributeVon(el: Element, name: string): string {
  let aus = '';
  for (const attr of Array.from(el.attributes)) {
    const an = attr.name.toLowerCase();
    if (!ERLAUBTE_ATTRIBUTE.has(an)) continue;
    if ((an === 'href' || an === 'cite') && /^\s*javascript:/i.test(attr.value)) continue;
    // Klassen aus dem Zwischenspeicher fremder Seiten schleppen wir nicht mit.
    if (an === 'class' && name !== 'a') continue;
    aus += ` ${an}="${attr.value.replace(/"/g, '&quot;')}"`;
  }
  return aus;
}

/**
 * Serialisiert den Inhalt eines Elements zu der Auszeichnung, die in die Datei
 * geschrieben wird. Unbekannte Elemente werden ausgepackt: Ihr Text bleibt,
 * das Element verschwindet.
 */
export function domZuMarkup(wurzel: Node): string {
  let aus = '';

  for (const knoten of Array.from(wurzel.childNodes)) {
    if (knoten.nodeType === 3 /* Text */) {
      aus += textZuMarkup((knoten.nodeValue ?? '').replace(/\s*\r?\n\s*/g, ' '));
      continue;
    }
    if (knoten.nodeType !== 1 /* Element */) continue;

    const el = knoten as Element;
    const roh = el.tagName.toLowerCase();
    if (VERWERFEN.has(roh)) continue;

    const name = roh in UMBENENNEN ? UMBENENNEN[roh] : roh;

    if (name && OHNE_INHALT.has(name)) {
      aus += `<${name} />`;
      continue;
    }

    const inhalt = domZuMarkup(el);

    // Unbekannt, umbenannt-auf-nichts oder leer: auspacken statt behalten.
    if (!name || !ERLAUBTE_TAGS.has(name)) {
      aus += inhalt;
      continue;
    }
    if (!inhalt.trim()) continue;

    const attribute = attributeVon(el, name);
    // Ein Link ohne übernommenes Ziel und eine Hülle ohne Eigenschaft tragen
    // nichts bei. Geprüft wird, was tatsächlich geschrieben würde — ein
    // verworfenes `javascript:` hinterlässt sonst eine leere Hülle.
    if ((name === 'a' && !/\bhref="/.test(attribute)) || (name === 'span' && !attribute)) {
      aus += inhalt;
      continue;
    }

    aus += `<${name}${attribute}>${inhalt}</${name}>`;
  }

  return aus;
}

/**
 * Bringt gespeicherte Auszeichnung auf denselben Stand, bevor sie ins Feld
 * geht — und schließt damit den Kreis: Was angezeigt wird, ist genau das, was
 * beim Speichern wieder herauskäme.
 */
export function bereinigeMarkup(roh: string, dok: Document): string {
  const huelle = dok.createElement('div');
  huelle.innerHTML = roh;
  return domZuMarkup(huelle);
}

/**
 * Ist die Adresse als Linkziel brauchbar? Erlaubt sind seiteneigene Pfade,
 * http(s) und mailto — nicht aber `javascript:`.
 */
export function linkZielGueltig(ziel: string): boolean {
  const z = ziel.trim();
  if (!z) return false;
  if (/^javascript:/i.test(z)) return false;
  return /^(\/|#|https?:\/\/|mailto:)/i.test(z);
}
