import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  absatzZurDatei,
  alsZeile,
  baueFolgeAbsatz,
  mitEinfuegung,
  NEUER_ABSATZ_TEXT,
  findeTextstellen,
  pruefeAbsatz,
  setzeTextstellen,
  zurAnzeige,
  zurDatei,
} from './astroText';

/** Nach dem Muster von `src/pages/ueber.astro` gebaut. */
const SEITE = `---
import BaseLayout from '../layouts/BaseLayout.astro';

const zeigePortrait = true;
const grenze = 3 < 5;
---

<BaseLayout sourceFile="src/pages/ueber.astro" title="Über" beschreibung="Wer hier schreibt">
  <div class="container-wide py-12">
    <article class="prose prose-ink max-w-none dark:prose-invert">
      <h1>Über</h1>

      <div class="not-prose my-8 flex flex-col gap-6">
        {zeigePortrait && (
          <img src={portraitSrc} alt="Dr. Michael Glaubitz" class="w-full rounded-2xl" />
        )}
      </div>

      <p class="text-lg">
        Diese Seite führt zusammen, was in diesen Rollen entstanden ist:
        forschungsgestützte Didaktik, die zeigt, <em>wie</em> Lernende denken.
      </p>

      <ul>
        <li><strong>Themen</strong> – didaktische Einordnung pro Stoffgebiet.</li>
      </ul>

      <p>Anteil: {prozent} Prozent der Fälle.</p>
    </article>
  </div>
</BaseLayout>

<style>
  .prose h2 { margin-top: 2rem; }
</style>
`;

const texte = (quelle: string) => findeTextstellen(quelle).map((s) => s.roh);
const stelleMit = (quelle: string, teil: string) =>
  findeTextstellen(quelle).find((s) => s.roh.includes(teil))!;

describe('findeTextstellen: ganze Absätze', () => {
  it('bietet einen Absatz samt seiner Auszeichnung als eine Stelle an', () => {
    const stelle = stelleMit(SEITE, 'Diese Seite führt zusammen');
    expect(stelle.art).toBe('absatz');
    expect(stelle.roh).toContain('<em>wie</em> Lernende denken.');
    expect(stelle.herkunft).toBe('p');
  });

  it('macht auch aus einem Listenpunkt ein einziges Feld', () => {
    const stelle = stelleMit(SEITE, 'didaktische Einordnung');
    expect(stelle.art).toBe('absatz');
    expect(stelle.roh).toBe('<strong>Themen</strong> – didaktische Einordnung pro Stoffgebiet.');
  });

  it('zerlegt einen Satz mit Auszeichnung nicht mehr in Stücke', () => {
    const satz =
      '<p>Sie zeigen, <em>wie</em> Lernende denken, nicht nur <em>ob</em> sie rechnen.</p>';
    const stellen = findeTextstellen(satz);
    expect(stellen).toHaveLength(1);
    expect(stellen[0].art).toBe('absatz');
    expect(stellen[0].roh).toBe(
      'Sie zeigen, <em>wie</em> Lernende denken, nicht nur <em>ob</em> sie rechnen.'
    );
  });

  it('nimmt einen Link mit in den Absatz', () => {
    const stellen = findeTextstellen('<li>Das <a href="/konzept">KLAR-Konzept</a> erklärt.</li>');
    expect(stellen).toHaveLength(1);
    expect(stellen[0].roh).toBe('Das <a href="/konzept">KLAR-Konzept</a> erklärt.');
  });

  it('lässt die umgebende Einrückung außerhalb der Stelle', () => {
    const stelle = stelleMit(SEITE, 'Diese Seite führt zusammen');
    expect(stelle.roh.startsWith('Diese')).toBe(true);
    expect(stelle.roh.endsWith('denken.')).toBe(true);
  });
});

describe('findeTextstellen: Rückfall auf einzelne Stücke', () => {
  it('fasst einen Absatz mit Astro-Ausdruck nicht als Ganzes an', () => {
    const stelle = stelleMit(SEITE, 'Anteil');
    expect(stelle.art).toBe('inhalt');
    expect(stelle.roh).toBe('Anteil:');
    expect(texte(SEITE).join(' ')).not.toContain('prozent');
  });

  it('bietet einen Absatz mit unbekanntem Element nicht als Ganzes an', () => {
    const stellen = findeTextstellen('<p>Vor <img src="/x.jpg" alt="Bild" /> nach</p>');
    expect(stellen.every((s) => s.art !== 'absatz')).toBe(true);
    expect(stellen.map((s) => s.roh)).toContain('Vor');
    expect(stellen.map((s) => s.roh)).toContain('nach');
  });

  it('bietet den äußeren Absatz nicht an, wenn ein weiterer darin steckt', () => {
    const stellen = findeTextstellen('<blockquote><p>Innen</p></blockquote>');
    const absaetze = stellen.filter((s) => s.art === 'absatz');
    expect(absaetze).toHaveLength(1);
    expect(absaetze[0].herkunft).toBe('p');
  });

  it('hält die Stücke eines Rückfall-Absatzes in derselben Gruppe', () => {
    const stellen = findeTextstellen('<p>Vor <img src="/x.jpg" alt="B" /> nach</p>');
    const inhalt = stellen.filter((s) => s.art === 'inhalt');
    expect(new Set(inhalt.map((s) => s.gruppe)).size).toBe(1);
    expect(inhalt[0].gruppenElement).toBe('p');
  });
});

describe('findeTextstellen: Attribute und gesperrte Bereiche', () => {
  it('findet Text in den sichtbaren Attributen', () => {
    const gefunden = texte(SEITE);
    expect(gefunden).toContain('Über');
    expect(gefunden).toContain('Wer hier schreibt');
    expect(gefunden).toContain('Dr. Michael Glaubitz');
  });

  it('bietet ein Attribut innerhalb eines Absatzfelds nicht doppelt an', () => {
    const stellen = findeTextstellen('<li><a href="/x" title="Hinweis">Text</a></li>');
    expect(stellen).toHaveLength(1);
    expect(stellen[0].art).toBe('absatz');
    expect(stellen[0].roh).toContain('title="Hinweis"');
  });

  it('fasst das Frontmatter nicht an', () => {
    for (const stelle of findeTextstellen(SEITE)) {
      expect(stelle.start).toBeGreaterThan(SEITE.indexOf('---\n\n<BaseLayout'));
    }
    expect(texte(SEITE).join(' ')).not.toContain('zeigePortrait');
  });

  it('fasst Stil- und Skriptblöcke nicht an', () => {
    expect(texte(SEITE).join(' ')).not.toContain('margin-top');
    expect(texte('<p>Hallo</p>\n<script>\nconst a = "Welt";\n</script>')).toEqual(['Hallo']);
  });

  it('übergeht Kommentare', () => {
    expect(texte('<p>Sichtbar</p><!-- Notiz an mich -->')).toEqual(['Sichtbar']);
  });

  it('übergeht Stellen ohne Buchstaben', () => {
    expect(texte('<span>–</span><span>2026</span><span>Text</span>')).toEqual(['Text']);
  });

  it('liefert die Stellen aufsteigend und überschneidungsfrei', () => {
    const stellen = findeTextstellen(SEITE);
    for (let i = 1; i < stellen.length; i++) {
      expect(stellen[i].start).toBeGreaterThanOrEqual(stellen[i - 1].ende);
    }
  });

  it('trifft die Positionen zeichengenau', () => {
    for (const stelle of findeTextstellen(SEITE)) {
      expect(SEITE.slice(stelle.start, stelle.ende)).toBe(stelle.roh);
    }
  });
});

describe('setzeTextstellen', () => {
  const stellen = findeTextstellen(SEITE);

  it('gibt die Datei unverändert zurück, wenn nichts geändert wurde', () => {
    expect(setzeTextstellen(SEITE, stellen, stellen.map(() => null))).toBe(SEITE);
  });

  it('ersetzt einen ganzen Absatz und lässt das Gerüst stehen', () => {
    const i = stellen.findIndex((s) => s.roh.includes('didaktische Einordnung'));
    const neue = stellen.map(() => null as string | null);
    neue[i] = '<strong>Stoffgebiete</strong> – neu geordnet.';
    const aus = setzeTextstellen(SEITE, stellen, neue);

    expect(aus).toContain('<li><strong>Stoffgebiete</strong> – neu geordnet.</li>');
    expect(aus).toContain('class="prose prose-ink max-w-none dark:prose-invert"');
    expect(aus).toContain('{zeigePortrait && (');
    expect(aus).toContain('const grenze = 3 < 5;');
  });

  it('ändert ein Attribut, ohne das Element zu beschädigen', () => {
    const i = stellen.findIndex((s) => s.roh === 'Dr. Michael Glaubitz' && s.art === 'attribut');
    const neue = stellen.map(() => null as string | null);
    neue[i] = 'Michael Glaubitz, Portrait';
    const aus = setzeTextstellen(SEITE, stellen, neue);
    expect(aus).toContain('alt="Michael Glaubitz, Portrait"');
    expect(aus).toContain('src={portraitSrc}');
  });
});

describe('absatzZurDatei', () => {
  it('lässt erlaubte Auszeichnung stehen', () => {
    expect(absatzZurDatei('Sie zeigen, <em>wie</em> es geht.')).toBe(
      'Sie zeigen, <em>wie</em> es geht.'
    );
    expect(absatzZurDatei('Das <a href="/konzept">KLAR-Konzept</a>')).toBe(
      'Das <a href="/konzept">KLAR-Konzept</a>'
    );
    expect(absatzZurDatei('Zeile<br />Zeile')).toBe('Zeile<br />Zeile');
  });

  it('macht aus einem Kleiner-als-Zeichen wieder Text', () => {
    expect(absatzZurDatei('für a < b gilt')).toBe('für a &lt; b gilt');
    expect(absatzZurDatei('<nichtErlaubt>x</nichtErlaubt>')).toBe(
      '&lt;nichtErlaubt>x&lt;/nichtErlaubt>'
    );
  });

  it('maskiert geschweifte Klammern, die sonst Astro-Ausdrücke wären', () => {
    expect(absatzZurDatei('Die Menge {1, 2}')).toBe('Die Menge &#123;1, 2&#125;');
  });

  it('maskiert ein einzelnes Und-Zeichen, lässt Entitäten aber stehen', () => {
    expect(absatzZurDatei('Meyer & Co')).toBe('Meyer &amp; Co');
    expect(absatzZurDatei('Meyer &amp; Co')).toBe('Meyer &amp; Co');
    expect(absatzZurDatei('a &lt; b')).toBe('a &lt; b');
    expect(absatzZurDatei('Zeichen &#123;')).toBe('Zeichen &#123;');
  });

  it('ist wiederholbar — zweimal angewandt ändert sich nichts mehr', () => {
    for (const probe of ['a < b', 'Meyer & Co', '<em>x</em> und {y}', 'a &lt; b']) {
      const einmal = absatzZurDatei(probe);
      expect(absatzZurDatei(zurAnzeige(einmal))).toBe(einmal);
    }
  });
});

describe('pruefeAbsatz', () => {
  it('lässt harmlose Auszeichnung durch', () => {
    expect(pruefeAbsatz('Sie zeigen, <em>wie</em> es geht.')).toBeNull();
    expect(pruefeAbsatz('Das <a href="/konzept" title="Mehr">KLAR-Konzept</a>.')).toBeNull();
    expect(pruefeAbsatz('Ganz ohne Auszeichnung.')).toBeNull();
    expect(pruefeAbsatz('Zeile<br />Zeile')).toBeNull();
    expect(pruefeAbsatz('<strong>Fett <em>und kursiv</em></strong>')).toBeNull();
  });

  it('meldet ein nicht geschlossenes Element', () => {
    expect(pruefeAbsatz('Text <em>ohne Ende')).toMatch(/nicht geschlossen/);
  });

  it('meldet ein falsch geschlossenes Element', () => {
    expect(pruefeAbsatz('<em>a <strong>b</em></strong>')).toMatch(/passt zu keinem/);
  });

  it('meldet ein verbotenes Attribut', () => {
    expect(pruefeAbsatz('<a href="/x" onclick="boesartig()">Text</a>')).toMatch(/onclick/);
  });

  it('meldet einen Link auf javascript:', () => {
    expect(pruefeAbsatz('<a href="javascript:alert(1)">Klick</a>')).toMatch(/javascript:/);
  });

  it('entschärft ein Skript, statt es durchzulassen', () => {
    // <script> ist nicht erlaubt und wird schon von absatzZurDatei zu Text —
    // die Prüfung sieht deshalb gar kein Element mehr.
    expect(absatzZurDatei('<script>boese()</script>')).toBe('&lt;script>boese()&lt;/script>');
    expect(pruefeAbsatz('<script>boese()</script>')).toBeNull();
  });

  it('stört sich nicht an einem Kleiner-als-Zeichen im Text', () => {
    expect(pruefeAbsatz('für a < b gilt')).toBeNull();
  });
});

describe('zurDatei / zurAnzeige (Felder ohne Auszeichnung)', () => {
  it('maskiert, was die Seite zerlegen würde', () => {
    expect(zurDatei('a < b', 'inhalt')).toBe('a &lt; b');
    expect(zurDatei('Menge {1, 2}', 'inhalt')).toBe('Menge &#123;1, 2&#125;');
    expect(zurDatei('Meyer & Co', 'inhalt')).toBe('Meyer &amp; Co');
  });

  it('maskiert im Attribut zusätzlich das Anführungszeichen', () => {
    expect(zurDatei('Er sagte "ja"', 'attribut')).toBe('Er sagte &quot;ja&quot;');
    expect(zurDatei('Er sagte "ja"', 'inhalt')).toBe('Er sagte "ja"');
  });

  it('läuft in beide Richtungen verlustfrei', () => {
    for (const probe of ['a < b', 'Menge {1, 2}', 'Meyer & Co', 'Er sagte "ja"', 'x > 0 & y < 1']) {
      expect(zurAnzeige(zurDatei(probe, 'attribut'))).toBe(probe);
      expect(zurAnzeige(zurDatei(probe, 'inhalt'))).toBe(probe);
    }
  });
});

describe('alsZeile', () => {
  it('macht aus dem umbrochenen Quelltext einen Fließtext', () => {
    expect(alsZeile('Diese Seite führt zusammen,\n        forschungsgestützte Didaktik.')).toBe(
      'Diese Seite führt zusammen, forschungsgestützte Didaktik.'
    );
  });

  it('lässt einzeiligen Text unangetastet', () => {
    expect(alsZeile('Themen')).toBe('Themen');
    expect(alsZeile('a – b')).toBe('a – b');
  });
});

describe('gegen die echten Seiten der Redaktion', () => {
  // Genau die Dateien, die `/admin` als „Feste Seiten“ führt.
  const seiten = Object.keys({
    ...import.meta.glob('../pages/*.astro'),
    ...import.meta.glob('../pages/*/index.astro'),
  })
    .filter((p) => !p.endsWith('/admin.astro'))
    .sort();

  const lies = (pfad: string) => readFileSync(new URL(pfad, import.meta.url), 'utf8');

  it('führt überhaupt Seiten', () => {
    expect(seiten.length).toBeGreaterThan(10);
  });

  it.each(seiten)('%s bleibt zeichengenau erhalten, wenn nichts geändert wird', (pfad) => {
    const quelle = lies(pfad);
    const stellen = findeTextstellen(quelle);
    expect(setzeTextstellen(quelle, stellen, stellen.map(() => null))).toBe(quelle);
  });

  it.each(seiten)('%s trifft jede Position zeichengenau', (pfad) => {
    const quelle = lies(pfad);
    for (const stelle of findeTextstellen(quelle)) {
      expect(quelle.slice(stelle.start, stelle.ende)).toBe(stelle.roh);
    }
  });

  it.each(seiten)('%s bietet nur Absätze an, die die Prüfung bestehen', (pfad) => {
    const quelle = lies(pfad);
    for (const stelle of findeTextstellen(quelle)) {
      if (stelle.art !== 'absatz') continue;
      // Was die Redaktion anbietet, muss sie unverändert auch wieder annehmen.
      expect(pruefeAbsatz(zurAnzeige(alsZeile(stelle.roh)))).toBeNull();
    }
  });

  it.each(seiten)('%s überlebt ein Zurückschreiben aller Absätze unverändert', (pfad) => {
    const quelle = lies(pfad);
    const stellen = findeTextstellen(quelle);
    // Jeden Absatz durch Anzeige und Rückschrieb schicken, ohne ihn zu ändern:
    // die Folge der Elemente muss dieselbe bleiben.
    const neue = stellen.map((s) =>
      s.art === 'absatz' ? absatzZurDatei(zurAnzeige(alsZeile(s.roh))) : null
    );
    const aus = setzeTextstellen(quelle, stellen, neue);
    const tags = (s: string) => [...s.matchAll(/<\/?[A-Za-z][^>]*>/g)].map((m) => m[0]);
    expect(tags(aus)).toEqual(tags(quelle));
  });

  it('findet auf jeder Seite mindestens eine Textstelle', () => {
    const leer = seiten.filter((pfad) => findeTextstellen(lies(pfad)).length === 0);
    expect(leer).toEqual([]);
  });
});

describe('baueFolgeAbsatz / mitEinfuegung', () => {
  const seite = [
    '<article>',
    '  <p class="text-lg">',
    '    Erster Absatz.',
    '  </p>',
    '  <ul>',
    '    <li>Ein Punkt</li>',
    '  </ul>',
    '</article>',
    '',
  ].join('\n');

  const absatzMit = (quelle: string, teil: string) =>
    findeTextstellen(quelle).find((s) => s.art === 'absatz' && s.roh.includes(teil))!;

  const einfuegen = (quelle: string, teil: string) => {
    const stellen = findeTextstellen(quelle);
    const stelle = absatzMit(quelle, teil);
    const neu = baueFolgeAbsatz(quelle, stelle)!;
    const zusammen = mitEinfuegung(stellen, stellen.map(() => null), neu.position, neu.text);
    return setzeTextstellen(quelle, zusammen.stellen, zusammen.werte);
  };

  it('kennt die Grenzen des Elements, nicht nur die des Inhalts', () => {
    const stelle = absatzMit(seite, 'Erster Absatz');
    expect(seite.slice(stelle.elementVon, stelle.elementBis)).toBe(
      '<p class="text-lg">\n    Erster Absatz.\n  </p>'
    );
  });

  it('setzt einen neuen Absatz mit gleicher Auszeichnung darunter', () => {
    expect(einfuegen(seite, 'Erster Absatz')).toBe(
      [
        '<article>',
        '  <p class="text-lg">',
        '    Erster Absatz.',
        '  </p>',
        '  <p class="text-lg">Neuer Text.</p>',
        '  <ul>',
        '    <li>Ein Punkt</li>',
        '  </ul>',
        '</article>',
        '',
      ].join('\n')
    );
  });

  it('setzt hinter einen Listenpunkt einen Listenpunkt', () => {
    const aus = einfuegen(seite, 'Ein Punkt');
    expect(aus).toContain('    <li>Ein Punkt</li>\n    <li>Neuer Text.</li>');
    expect(aus).toContain('</ul>');
  });

  it('gibt eine id nicht ein zweites Mal aus', () => {
    const mitId = '<p id="einzig" class="a">Text</p>';
    const aus = einfuegen(mitId, 'Text');
    expect(aus).toBe('<p id="einzig" class="a">Text</p>\n<p class="a">Neuer Text.</p>');
    expect(aus.match(/id="einzig"/g)).toHaveLength(1);
  });

  it('macht den neuen Absatz sofort wieder als Feld auffindbar', () => {
    const aus = einfuegen(seite, 'Erster Absatz');
    const neu = findeTextstellen(aus).filter((s) => s.roh === NEUER_ABSATZ_TEXT);
    expect(neu).toHaveLength(1);
    expect(neu[0].art).toBe('absatz');
  });

  it('lässt sich mehrfach anwenden', () => {
    let aus = einfuegen(seite, 'Erster Absatz');
    aus = einfuegen(aus, 'Erster Absatz');
    expect(aus.match(/Neuer Text\./g)).toHaveLength(2);
    expect(findeTextstellen(aus).filter((s) => s.art === 'absatz').length).toBe(4);
  });

  it('erhält gleichzeitige Textänderungen an anderen Stellen', () => {
    const stellen = findeTextstellen(seite);
    const stelle = absatzMit(seite, 'Ein Punkt');
    const neu = baueFolgeAbsatz(seite, stelle)!;
    const werte = stellen.map((s) => (s.roh === 'Erster Absatz.' ? 'Geänderter Absatz.' : null));
    const zusammen = mitEinfuegung(stellen, werte, neu.position, neu.text);
    const aus = setzeTextstellen(seite, zusammen.stellen, zusammen.werte);
    expect(aus).toContain('Geänderter Absatz.');
    expect(aus).toContain('<li>Neuer Text.</li>');
  });

  it('bietet für ein Textstück ohne Absatz nichts an', () => {
    const stellen = findeTextstellen('<p>Vor <img src="/x.jpg" alt="B" /> nach</p>');
    expect(baueFolgeAbsatz('<p>Vor <img src="/x.jpg" alt="B" /> nach</p>', stellen[0])).toBeNull();
  });
});
