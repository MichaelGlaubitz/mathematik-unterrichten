import katex from 'katex';
import { zelleAlsLatex } from './mathe';

/**
 * Setzt eine Zelle aus dem Aufgabenbestand zur Bauzeit.
 *
 * Zur Bauzeit, nicht im Browser: An der Wand darf kein Dollarzeichen stehen
 * und nichts nachladen. In einem Schulnetz mit gesperrtem CDN wäre sonst die
 * halbe Folie leer – genau das war der Zustand, bevor KaTeX lokal lag.
 *
 * Eine Zelle kann gewöhnlichen Text und Formeln mischen („25 % von 80“), also
 * wird an den `$…$` getrennt und nur der Formelteil gesetzt. Der Rest wird
 * maskiert: Ein `<` aus einer Ungleichung darf kein Tag eröffnen.
 */
export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function gesetzt(zelle: string): string {
  const roh = zelleAlsLatex(zelle);
  if (!roh.includes('$')) {
    // Kein Formelteil: alter Bestand ohne Auszeichnung oder reiner Text.
    return /[\\^_{}]/.test(roh) ? katex.renderToString(roh, { throwOnError: false }) : escapeHtml(roh);
  }
  return roh
    .split(/(\$[^$]+\$)/)
    .map((teil) =>
      teil.startsWith('$') && teil.endsWith('$') && teil.length > 2
        ? katex.renderToString(teil.slice(1, -1), { throwOnError: false })
        : escapeHtml(teil)
    )
    .join('');
}

/**
 * Wie `gesetzt`, dazu die schlichte Auszeichnung, die im Fließtext des
 * Bestands vorkommt: **fett** und *kursiv*. Mehr kann dort nicht stehen –
 * ein Test über den Bestand hält das fest.
 */
export function gesetzterAbsatz(text: string): string {
  return gesetzt(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
}
