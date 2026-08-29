/**
 * Reine Textlogik der Redaktion (`/admin`) — ohne DOM, ohne Netz, testbar.
 *
 * Leitentscheidung: Das Frontmatter wird NIE als Ganzes neu serialisiert.
 * Nur Zeilen, die der Editor sicher versteht (Schlüssel ganz links, Wert
 * einzeilig), werden einzeln ersetzt. Verschachteltes YAML, Blockskalare und
 * alles Unbekannte bleiben Zeichen für Zeichen erhalten. Damit kann der
 * Editor an Strukturen, die er nicht versteht, auch nichts kaputt machen.
 */

// ===========================================================================
// Frontmatter
// ===========================================================================

export type Zerlegt = {
  kopfAnfang: string;
  kopf: string;
  kopfEnde: string;
  rumpf: string;
};

const FM = /^(---[ \t]*\r?\n)([\s\S]*?)(\r?\n---[ \t]*\r?\n?)/;

/**
 * Trennt Frontmatter und Text so, dass
 * `kopfAnfang + kopf + kopfEnde + rumpf` die Datei zeichengenau ergibt —
 * einschließlich Zeilenenden. Ohne Frontmatter ist alles Rumpf.
 */
export function zerlege(roh: string): Zerlegt {
  const treffer = FM.exec(roh);
  if (!treffer) return { kopfAnfang: '', kopf: '', kopfEnde: '', rumpf: roh };
  return {
    kopfAnfang: treffer[1],
    kopf: treffer[2],
    kopfEnde: treffer[3],
    rumpf: roh.slice(treffer[0].length),
  };
}

export function fuegeZusammen(teile: Zerlegt): string {
  return teile.kopfAnfang + teile.kopf + teile.kopfEnde + teile.rumpf;
}

export type KopfFeld = {
  schluessel: string;
  /** Der Wert so, wie er in der Datei steht — mit Anführungszeichen. */
  roh: string;
  /** Zeilennummer innerhalb des Frontmatters, ab 0. */
  nr: number;
};

/**
 * Findet die Schlüssel, die der Editor als Formularfeld anbieten darf:
 * ganz links beginnend, einzeiliger nicht-leerer Wert. Eingerückte Schlüssel
 * (Teil einer Struktur) und Blockskalare (`|`, `>`) werden bewusst übergangen.
 */
export function kopfFelder(kopf: string): KopfFeld[] {
  const felder: KopfFeld[] = [];
  kopf.split('\n').forEach((zeile, nr) => {
    const treffer = /^([A-Za-z][A-Za-z0-9_]*):[ \t]*(.*?)[ \t]*$/.exec(zeile);
    if (!treffer) return;
    const wert = treffer[2];
    if (wert === '' || /^[|>][-+]?\d*$/.test(wert)) return;
    felder.push({ schluessel: treffer[1], roh: wert, nr });
  });
  return felder;
}

export type WertArt = 'bool' | 'liste' | 'datum' | 'zahl' | 'text';

export function wertArt(roh: string): WertArt {
  if (roh === 'true' || roh === 'false') return 'bool';
  if (/^\[[\s\S]*\]$/.test(roh)) {
    try {
      const gelesen = JSON.parse(roh);
      if (Array.isArray(gelesen) && gelesen.every((x) => typeof x === 'string')) return 'liste';
    } catch {
      /* keine einfache Stringliste — dann als Text behandeln */
    }
    return 'text';
  }
  if (/^["']?\d{4}-\d{2}-\d{2}["']?$/.test(roh)) return 'datum';
  if (/^-?\d+(\.\d+)?$/.test(roh)) return 'zahl';
  return 'text';
}

/** Den Wert für die Anzeige von Anführungszeichen befreien. */
export function klartext(roh: string): string {
  const t = roh.trim();
  if (/^".*"$/.test(t)) {
    try {
      return JSON.parse(t) as string;
    } catch {
      return t.slice(1, -1);
    }
  }
  if (/^'.*'$/.test(t)) return t.slice(1, -1).replace(/''/g, "'");
  return t;
}

/**
 * Zurück nach YAML. Im Zweifel doppelt gequotet — das ist in YAML immer
 * gültig und kann keine Sonderbedeutung auslösen. Nackt bleibt ein Wert nur,
 * wenn er vorher schon nackt war und weiterhin harmlos aussieht.
 */
export function yamlWert(neu: string | boolean | string[], art: WertArt, originalRoh: string): string {
  if (art === 'bool') return neu ? 'true' : 'false';
  if (art === 'liste') return JSON.stringify(neu);

  const s = String(neu);
  const warNackt = !/^["']/.test(originalRoh.trim());

  if (art === 'zahl' && /^-?\d+(\.\d+)?$/.test(s)) return s;
  if (art === 'datum' && warNackt && /^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (warNackt && /^[A-Za-zÄÖÜäöüß0-9][A-Za-zÄÖÜäöüß0-9 ._/-]*$/.test(s) && !/:\s|\s#/.test(s)) {
    return s;
  }
  return JSON.stringify(s);
}

/** Ersetzt genau eine Zeile im Frontmatter und lässt alle anderen unberührt. */
export function setzeKopfZeile(kopf: string, nr: number, neueZeile: string): string {
  const zeilen = kopf.split('\n');
  if (nr < 0 || nr >= zeilen.length) return kopf;
  zeilen[nr] = neueZeile;
  return zeilen.join('\n');
}

/** Bequemer Weg: Feldwert setzen und das ganze Frontmatter zurückgeben. */
export function setzeFeld(
  kopf: string,
  feld: KopfFeld,
  neu: string | boolean | string[]
): string {
  const art = wertArt(feld.roh);
  return setzeKopfZeile(kopf, feld.nr, `${feld.schluessel}: ${yamlWert(neu, art, feld.roh)}`);
}

// ===========================================================================
// Kodierung
// ===========================================================================

export function b64ZuText(b64: string): string {
  const binaer = atob(String(b64).replace(/\s/g, ''));
  const bytes = Uint8Array.from(binaer, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

export function textZuB64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binaer = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binaer += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 0x8000)));
  }
  return btoa(binaer);
}

export function escapeHtml(s: unknown): string {
  return String(s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string
  );
}

// ===========================================================================
// Markdown-Vorschau
//
// Bewusst eine Näherung: Sie zeigt Gliederung, Betonung, Listen und Tabellen.
// Formeln werden hervorgehoben, aber nicht wie auf der Seite mit KaTeX
// gesetzt. Sie soll beim Schreiben helfen, nicht die Seite ersetzen.
// ===========================================================================

/** Platzhalter für geschützte Abschnitte — Klartext, damit die Quelle lesbar bleibt. */
const WACHE = '@@MU@@';

export function inlineMd(roh: string): string {
  const codes: string[] = [];
  let s = String(roh).replace(/`([^`]+)`/g, (_, c: string) => {
    codes.push(c);
    return `${WACHE}C${codes.length - 1}${WACHE}`;
  });

  const formeln: string[] = [];
  s = s.replace(/\$\$([^$]+)\$\$|\$([^$\n]+)\$/g, (_, a: string, b: string) => {
    formeln.push(a ?? b);
    return `${WACHE}M${formeln.length - 1}${WACHE}`;
  });

  s = escapeHtml(s);
  s = s.replace(
    /!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g,
    (_, alt: string, src: string) => `<img src="${src}" alt="${alt}" style="max-width:100%">`
  );
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/(^|\s)_([^_\n]+)_(?=\s|$|[.,;:!?])/g, '$1<em>$2</em>');

  s = s.replace(
    new RegExp(`${WACHE}M(\\d+)${WACHE}`, 'g'),
    (_, i: string) => `<span class="mathe">${escapeHtml(formeln[+i])}</span>`
  );
  s = s.replace(
    new RegExp(`${WACHE}C(\\d+)${WACHE}`, 'g'),
    (_, i: string) => `<code>${escapeHtml(codes[+i])}</code>`
  );
  return s;
}

const BLOCKANFANG = /^\s*(#{1,6}\s|```|>|\||[-*+]\s|\d+[.)]\s)/;

export function mdZuHtml(md: string): string {
  const zeilen = String(md).replace(/\r\n/g, '\n').split('\n');
  const aus: string[] = [];
  let i = 0;

  while (i < zeilen.length) {
    const z = zeilen[i];

    // Codeblock
    if (/^\s*```/.test(z)) {
      const gesammelt: string[] = [];
      i++;
      while (i < zeilen.length && !/^\s*```/.test(zeilen[i])) gesammelt.push(zeilen[i++]);
      i++;
      aus.push(`<pre><code>${escapeHtml(gesammelt.join('\n'))}</code></pre>`);
      continue;
    }

    // Überschrift
    const ueber = /^(#{1,6})\s+(.*)$/.exec(z);
    if (ueber) {
      const stufe = Math.min(ueber[1].length, 6);
      aus.push(`<h${stufe}>${inlineMd(ueber[2])}</h${stufe}>`);
      i++;
      continue;
    }

    // Trennlinie
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(z)) {
      aus.push('<hr>');
      i++;
      continue;
    }

    // Tabelle — nur mit Trennzeile darunter
    if (/^\s*\|.*\|\s*$/.test(z) && /^\s*\|[\s:|-]+\|\s*$/.test(zeilen[i + 1] ?? '')) {
      const felder = (zeile: string) =>
        zeile
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((s) => inlineMd(s.trim()));
      const kopf = felder(z);
      i += 2;
      const rumpf: string[][] = [];
      while (i < zeilen.length && /^\s*\|.*\|\s*$/.test(zeilen[i])) rumpf.push(felder(zeilen[i++]));
      aus.push(
        '<table><thead><tr>' +
          kopf.map((c) => `<th>${c}</th>`).join('') +
          '</tr></thead><tbody>' +
          rumpf.map((r) => '<tr>' + r.map((c) => `<td>${c}</td>`).join('') + '</tr>').join('') +
          '</tbody></table>'
      );
      continue;
    }

    // Zitat
    if (/^\s*>\s?/.test(z)) {
      const gesammelt: string[] = [];
      while (i < zeilen.length && /^\s*>\s?/.test(zeilen[i])) {
        gesammelt.push(zeilen[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      aus.push(`<blockquote>${mdZuHtml(gesammelt.join('\n'))}</blockquote>`);
      continue;
    }

    // Aufzählung
    if (/^\s*[-*+]\s+/.test(z)) {
      const posten: string[] = [];
      while (i < zeilen.length && /^\s*[-*+]\s+/.test(zeilen[i])) {
        posten.push(inlineMd(zeilen[i].replace(/^\s*[-*+]\s+/, '')));
        i++;
      }
      aus.push('<ul>' + posten.map((p) => `<li>${p}</li>`).join('') + '</ul>');
      continue;
    }

    // Nummerierung
    if (/^\s*\d+[.)]\s+/.test(z)) {
      const posten: string[] = [];
      while (i < zeilen.length && /^\s*\d+[.)]\s+/.test(zeilen[i])) {
        posten.push(inlineMd(zeilen[i].replace(/^\s*\d+[.)]\s+/, '')));
        i++;
      }
      aus.push('<ol>' + posten.map((p) => `<li>${p}</li>`).join('') + '</ol>');
      continue;
    }

    // Leerzeile
    if (z.trim() === '') {
      i++;
      continue;
    }

    // Absatz
    const absatz: string[] = [];
    while (i < zeilen.length && zeilen[i].trim() !== '' && !BLOCKANFANG.test(zeilen[i])) {
      absatz.push(zeilen[i++]);
    }
    if (absatz.length) {
      aus.push(`<p>${inlineMd(absatz.join(' '))}</p>`);
    } else {
      // Sieht aus wie ein Blockanfang, wurde aber von keinem Zweig verarbeitet
      // (etwa eine Tabellenzeile ohne Trennzeile). Als eigener Absatz zeigen,
      // statt sie stillschweigend fallen zu lassen.
      aus.push(`<p>${inlineMd(zeilen[i])}</p>`);
      i++;
    }
  }

  return aus.join('\n');
}
