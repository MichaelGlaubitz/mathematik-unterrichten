import { describe, expect, it } from 'vitest';
import {
  fuegeZusammen,
  inlineMd,
  klartext,
  kopfFelder,
  mdZuHtml,
  setzeFeld,
  wertArt,
  yamlWert,
  zerlege,
} from './redaktionText';

/** Ein Frontmatter, das alle Formen enthält, die im Bestand vorkommen. */
const BEISPIEL = [
  '---',
  'title: "Atomisierung – warum kleine Schritte tragen"',
  'autor: "Dr. Michael Glaubitz"',
  'datum: 2026-05-20',
  'tags: ["atomisierung", "cognitive-load"]',
  'kategorie: "Unterrichtsdesign"',
  'ordnung: 20',
  'entwurf: false',
  'einstiegsfrage:',
  '  frage: "Was ist ein Term?"',
  '  antworten:',
  '    - text: "Eine Zahl"',
  '      korrekt: false',
  '---',
  '',
  'Vor einigen Jahren habe ich eine Stunde gehalten.',
  '',
].join('\n');

describe('zerlege / fuegeZusammen', () => {
  it('setzt die Datei zeichengenau wieder zusammen', () => {
    expect(fuegeZusammen(zerlege(BEISPIEL))).toBe(BEISPIEL);
  });

  it('bewahrt Windows-Zeilenenden', () => {
    const crlf = BEISPIEL.replace(/\n/g, '\r\n');
    expect(fuegeZusammen(zerlege(crlf))).toBe(crlf);
  });

  it('behandelt eine Datei ohne Frontmatter komplett als Rumpf', () => {
    const ohne = '# Überschrift\n\nText.\n';
    const teile = zerlege(ohne);
    expect(teile.kopf).toBe('');
    expect(teile.rumpf).toBe(ohne);
    expect(fuegeZusammen(teile)).toBe(ohne);
  });

  it('lässt einen Gedankenstrich im Text unangetastet', () => {
    const mitStrichen = '---\ntitel: "A"\n---\n\nText\n\n---\n\nMehr Text\n';
    expect(fuegeZusammen(zerlege(mitStrichen))).toBe(mitStrichen);
    expect(zerlege(mitStrichen).kopf).toBe('titel: "A"');
  });
});

describe('kopfFelder', () => {
  const felder = kopfFelder(zerlege(BEISPIEL).kopf);
  const namen = felder.map((f) => f.schluessel);

  it('findet die einzeiligen Schlüssel ganz links', () => {
    expect(namen).toEqual([
      'title',
      'autor',
      'datum',
      'tags',
      'kategorie',
      'ordnung',
      'entwurf',
    ]);
  });

  it('übergeht Schlüssel mit verschachteltem Wert', () => {
    expect(namen).not.toContain('einstiegsfrage');
  });

  it('übergeht eingerückte Schlüssel innerhalb einer Struktur', () => {
    expect(namen).not.toContain('frage');
    expect(namen).not.toContain('korrekt');
  });

  it('übergeht Blockskalare', () => {
    expect(kopfFelder('text: |\n  Zeile eins\n  Zeile zwei')).toEqual([]);
    expect(kopfFelder('text: >-\n  Zeile')).toEqual([]);
  });
});

describe('wertArt', () => {
  it('erkennt die Formen', () => {
    expect(wertArt('true')).toBe('bool');
    expect(wertArt('false')).toBe('bool');
    expect(wertArt('["a", "b"]')).toBe('liste');
    expect(wertArt('2026-05-20')).toBe('datum');
    expect(wertArt('20')).toBe('zahl');
    expect(wertArt('"Ein Titel"')).toBe('text');
  });

  it('hält eine Liste von Objekten für Text und fasst sie damit nicht an', () => {
    expect(wertArt('[{ "a": 1 }]')).toBe('text');
  });
});

describe('klartext', () => {
  it('entfernt doppelte Anführungszeichen samt Maskierung', () => {
    expect(klartext('"Er sagte \\"ja\\""')).toBe('Er sagte "ja"');
  });

  it('entfernt einfache Anführungszeichen', () => {
    expect(klartext("'Ein Titel'")).toBe('Ein Titel');
  });

  it('lässt nackte Werte stehen', () => {
    expect(klartext('2026-05-20')).toBe('2026-05-20');
  });
});

describe('yamlWert', () => {
  it('gibt Wahrheitswerte nackt zurück', () => {
    expect(yamlWert(true, 'bool', 'false')).toBe('true');
    expect(yamlWert(false, 'bool', 'true')).toBe('false');
  });

  it('schreibt Listen als JSON', () => {
    expect(yamlWert(['a', 'b'], 'liste', '["x"]')).toBe('["a","b"]');
  });

  it('behält ein nacktes Datum nackt', () => {
    expect(yamlWert('2026-06-01', 'datum', '2026-05-20')).toBe('2026-06-01');
  });

  it('quotet weiter, was vorher gequotet war', () => {
    expect(yamlWert('Neuer Titel', 'text', '"Alter Titel"')).toBe('"Neuer Titel"');
  });

  it('quotet Werte mit Doppelpunkt, auch wenn sie vorher nackt waren', () => {
    expect(yamlWert('Achtung: hier', 'text', 'Achtung')).toBe('"Achtung: hier"');
  });

  it('quotet Werte, die mit einem Sonderzeichen beginnen', () => {
    expect(yamlWert('- kein Listenpunkt', 'text', 'harmlos')).toBe('"- kein Listenpunkt"');
    expect(yamlWert('#kein Kommentar', 'text', 'harmlos')).toBe('"#kein Kommentar"');
  });

  it('maskiert Anführungszeichen im Wert', () => {
    expect(yamlWert('Er sagte "ja"', 'text', '"x"')).toBe('"Er sagte \\"ja\\""');
  });

  it('lässt Umlaute unmaskiert', () => {
    expect(yamlWert('Brüche üben', 'text', 'nackt')).toBe('Brüche üben');
  });
});

describe('setzeFeld', () => {
  const kopf = zerlege(BEISPIEL).kopf;
  const feldNamens = (name: string) =>
    kopfFelder(kopf).find((f) => f.schluessel === name)!;

  it('ändert genau eine Zeile und lässt alle anderen unberührt', () => {
    const neu = setzeFeld(kopf, feldNamens('title'), 'Neuer Titel');
    const alt = kopf.split('\n');
    const jetzt = neu.split('\n');
    expect(jetzt.length).toBe(alt.length);
    const abweichend = jetzt.map((z, i) => (z === alt[i] ? null : i)).filter((x) => x !== null);
    expect(abweichend).toEqual([0]);
    expect(jetzt[0]).toBe('title: "Neuer Titel"');
  });

  it('rührt die verschachtelte Struktur nicht an', () => {
    const neu = setzeFeld(kopf, feldNamens('entwurf'), true);
    expect(neu).toContain('einstiegsfrage:');
    expect(neu).toContain('  frage: "Was ist ein Term?"');
    expect(neu).toContain('    - text: "Eine Zahl"');
    expect(neu).toContain('entwurf: true');
  });

  it('bleibt nach mehreren Änderungen zusammensetzbar', () => {
    const teile = zerlege(BEISPIEL);
    let k = teile.kopf;
    k = setzeFeld(k, kopfFelder(k).find((f) => f.schluessel === 'title')!, 'A');
    k = setzeFeld(k, kopfFelder(k).find((f) => f.schluessel === 'tags')!, ['x', 'y']);
    k = setzeFeld(k, kopfFelder(k).find((f) => f.schluessel === 'ordnung')!, '30');
    const ganz = fuegeZusammen({ ...teile, kopf: k });
    expect(ganz).toContain('title: "A"');
    expect(ganz).toContain('tags: ["x","y"]');
    expect(ganz).toContain('ordnung: 30');
    expect(ganz).toContain('Vor einigen Jahren habe ich eine Stunde gehalten.');
    // Der Text hinter dem Frontmatter ist unverändert.
    expect(ganz.slice(ganz.indexOf('\n---\n') + 5)).toBe(teile.rumpf);
  });
});

describe('inlineMd', () => {
  it('setzt fett und kursiv', () => {
    expect(inlineMd('**fett** und *kursiv*')).toBe('<strong>fett</strong> und <em>kursiv</em>');
  });

  it('maskiert HTML aus dem Text', () => {
    expect(inlineMd('a < b & c')).toBe('a &lt; b &amp; c');
  });

  it('lässt Auszeichnung in Code unangetastet', () => {
    expect(inlineMd('`**nicht fett**`')).toBe('<code>**nicht fett**</code>');
  });

  it('hebt Formeln hervor, ohne sie zu verändern', () => {
    expect(inlineMd('Sei $x^2 + 1$ gegeben.')).toBe(
      'Sei <span class="mathe">x^2 + 1</span> gegeben.'
    );
  });

  it('fasst Auszeichnung innerhalb einer Formel nicht an', () => {
    expect(inlineMd('$a * b * c$')).toBe('<span class="mathe">a * b * c</span>');
  });

  it('baut Links', () => {
    expect(inlineMd('[hier](/blog/x)')).toBe('<a href="/blog/x">hier</a>');
  });
});

describe('mdZuHtml', () => {
  it('erzeugt Überschriften und Absätze', () => {
    expect(mdZuHtml('## Titel\n\nEin Satz.')).toBe('<h2>Titel</h2>\n<p>Ein Satz.</p>');
  });

  it('fasst mehrzeilige Absätze zusammen', () => {
    expect(mdZuHtml('Zeile eins\nZeile zwei')).toBe('<p>Zeile eins Zeile zwei</p>');
  });

  it('erzeugt Listen', () => {
    expect(mdZuHtml('- a\n- b')).toBe('<ul><li>a</li><li>b</li></ul>');
    expect(mdZuHtml('1. a\n2. b')).toBe('<ol><li>a</li><li>b</li></ol>');
  });

  it('erzeugt Tabellen nur mit Trennzeile', () => {
    const html = mdZuHtml('| a | b |\n|---|---|\n| 1 | 2 |');
    expect(html).toContain('<th>a</th>');
    expect(html).toContain('<td>2</td>');
    expect(mdZuHtml('| a | b |')).toBe('<p>| a | b |</p>');
  });

  it('maskiert Codeblöcke vollständig', () => {
    expect(mdZuHtml('```\n<script>x</script>\n```')).toBe(
      '<pre><code>&lt;script&gt;x&lt;/script&gt;</code></pre>'
    );
  });

  it('erzeugt Zitate', () => {
    expect(mdZuHtml('> Ein Zitat.')).toBe('<blockquote><p>Ein Zitat.</p></blockquote>');
  });

  it('läuft auch bei ungewöhnlichem Text zu Ende', () => {
    // Regressionsschutz: Eine Zeile, die wie ein Blockanfang aussieht, aber
    // von keinem Zweig verarbeitet wird, darf keine Endlosschleife auslösen.
    expect(() => mdZuHtml('| kein Kopf\n\n> \n\n```\nunbeendet')).not.toThrow();
  });
});
