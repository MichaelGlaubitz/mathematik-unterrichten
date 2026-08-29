import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  findeTextstellen,
  setzeTextstellen,
  zurAnzeige,
  zurDatei,
  alsZeile,
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
        forschungsgestützte Didaktik.
      </p>

      <ul>
        <li><strong>Themen</strong> – didaktische Einordnung pro Stoffgebiet.</li>
      </ul>
    </article>
  </div>
</BaseLayout>

<style>
  .prose h2 { margin-top: 2rem; }
</style>
`;

const texte = (quelle: string) => findeTextstellen(quelle).map((s) => s.roh);

describe('findeTextstellen', () => {
  it('findet den Fließtext zwischen den Elementen', () => {
    expect(texte(SEITE)).toContain(
      'Diese Seite führt zusammen, was in diesen Rollen entstanden ist:\n        forschungsgestützte Didaktik.'
    );
    expect(texte(SEITE)).toContain('Themen');
    expect(texte(SEITE)).toContain('– didaktische Einordnung pro Stoffgebiet.');
  });

  it('findet Text in den sichtbaren Attributen', () => {
    const gefunden = texte(SEITE);
    expect(gefunden).toContain('Über');
    expect(gefunden).toContain('Wer hier schreibt');
    expect(gefunden).toContain('Dr. Michael Glaubitz');
  });

  it('fasst das Frontmatter nicht an', () => {
    // Der Vergleich `3 < 5` im Frontmatter darf keine Textstelle erzeugen.
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

  it('übergeht Astro-Ausdrücke', () => {
    expect(texte('<p>{eineVariable}</p>')).toEqual([]);
    expect(texte('<p>Text {wert} mehr</p>')).toEqual([]);
  });

  it('übergeht Stellen ohne Buchstaben', () => {
    expect(texte('<span>–</span><span>2026</span><span>Text</span>')).toEqual(['Text']);
  });

  it('nennt das umgebende Element als Orientierung', () => {
    const stellen = findeTextstellen('<h2>Haltung</h2>');
    expect(stellen[0].herkunft).toBe('h2');
    expect(stellen[0].art).toBe('inhalt');
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

  it('ersetzt genau eine Stelle und lässt die Auszeichnung stehen', () => {
    const i = stellen.findIndex((s) => s.roh === 'Themen');
    const neue = stellen.map(() => null as string | null);
    neue[i] = 'Stoffgebiete';
    const aus = setzeTextstellen(SEITE, stellen, neue);

    expect(aus).toContain('<li><strong>Stoffgebiete</strong> – didaktische Einordnung');
    expect(aus).toContain('class="prose prose-ink max-w-none dark:prose-invert"');
    expect(aus).toContain('{zeigePortrait && (');
    expect(aus).toContain('const grenze = 3 < 5;');
    // Nur diese eine Stelle unterscheidet sich.
    expect(aus.replace('Stoffgebiete', 'Themen')).toBe(SEITE);
  });

  it('ändert auch ein Attribut, ohne das Element zu beschädigen', () => {
    const i = stellen.findIndex((s) => s.roh === 'Dr. Michael Glaubitz' && s.art === 'attribut');
    const neue = stellen.map(() => null as string | null);
    neue[i] = 'Michael Glaubitz beim Vortrag';
    const aus = setzeTextstellen(SEITE, stellen, neue);
    expect(aus).toContain('alt="Michael Glaubitz beim Vortrag"');
    expect(aus).toContain('src={portraitSrc}');
  });

  it('bleibt nach mehreren Änderungen zusammensetzbar', () => {
    const neue = stellen.map((s) => (s.art === 'attribut' ? null : s.roh + '!'));
    const aus = setzeTextstellen(SEITE, stellen, neue);
    const wieder = findeTextstellen(aus);
    expect(wieder.length).toBe(stellen.length);
    expect(wieder.filter((s) => s.art === 'inhalt').every((s) => s.roh.endsWith('!'))).toBe(true);
  });
});

describe('zurDatei / zurAnzeige', () => {
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

  it('erzeugt aus maskiertem Text wieder gültige Auszeichnung', () => {
    const quelle = '<p>Platzhalter</p>';
    const stellen = findeTextstellen(quelle);
    const aus = setzeTextstellen(quelle, stellen, [zurDatei('wenn a < b gilt', 'inhalt')]);
    expect(aus).toBe('<p>wenn a &lt; b gilt</p>');
    // Und beim erneuten Öffnen steht im Feld wieder der Klartext.
    expect(zurAnzeige(findeTextstellen(aus)[0].roh)).toBe('wenn a < b gilt');
  });
});

describe('gegen die echten Seiten der Redaktion', () => {
  // Genau die Dateien, die `/admin` als „Feste Seiten" führt.
  const seiten = Object.keys({
    ...import.meta.glob('../pages/*.astro'),
    ...import.meta.glob('../pages/*/index.astro'),
  })
    .filter((p) => !p.endsWith('/admin.astro'))
    .sort();

  it('führt überhaupt Seiten', () => {
    expect(seiten.length).toBeGreaterThan(10);
  });

  it.each(seiten)('%s bleibt zeichengenau erhalten, wenn nichts geändert wird', (pfad) => {
    const quelle = readFileSync(new URL(pfad, import.meta.url), 'utf8');
    const stellen = findeTextstellen(quelle);
    expect(setzeTextstellen(quelle, stellen, stellen.map(() => null))).toBe(quelle);
  });

  it.each(seiten)('%s trifft jede Position zeichengenau', (pfad) => {
    const quelle = readFileSync(new URL(pfad, import.meta.url), 'utf8');
    for (const stelle of findeTextstellen(quelle)) {
      expect(quelle.slice(stelle.start, stelle.ende)).toBe(stelle.roh);
    }
  });

  it('findet auf jeder Seite mindestens eine Textstelle', () => {
    const leer = seiten.filter((pfad) => {
      const quelle = readFileSync(new URL(pfad, import.meta.url), 'utf8');
      return findeTextstellen(quelle).length === 0;
    });
    expect(leer).toEqual([]);
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

describe('Gruppierung nach Absatz', () => {
  const satz = '<p>Sie zeigen, <em>wie</em> Lernende denken, nicht nur <em>ob</em> sie rechnen.</p>';

  it('erkennt die Verschachtelung richtig', () => {
    const s = findeTextstellen(satz);
    expect(s.map((x) => [x.roh, x.herkunft])).toEqual([
      ['Sie zeigen,', 'p'],
      ['wie', 'em'],
      ['Lernende denken, nicht nur', 'p'],
      ['ob', 'em'],
      ['sie rechnen.', 'p'],
    ]);
  });

  it('legt alle Stücke eines Satzes in dieselbe Gruppe', () => {
    const s = findeTextstellen(satz);
    expect(new Set(s.map((x) => x.gruppe)).size).toBe(1);
    expect(s[0].gruppenElement).toBe('p');
  });

  it('trennt verschiedene Absätze', () => {
    const s = findeTextstellen('<p>Eins</p><p>Zwei</p>');
    expect(s[0].gruppe).not.toBe(s[1].gruppe);
  });

  it('behandelt ein leeres Element nicht als Verschachtelung', () => {
    const s = findeTextstellen('<p>Vor<br />Nach</p>');
    expect(s.map((x) => x.herkunft)).toEqual(['p', 'p']);
    expect(new Set(s.map((x) => x.gruppe)).size).toBe(1);
  });

  it('ordnet einen Listenpunkt seiner eigenen Gruppe zu', () => {
    const s = findeTextstellen('<ul><li><strong>Themen</strong> – Einordnung.</li><li>Blog</li></ul>');
    expect(s.map((x) => x.gruppenElement)).toEqual(['li', 'li', 'li']);
    expect(s[0].gruppe).toBe(s[1].gruppe);
    expect(s[1].gruppe).not.toBe(s[2].gruppe);
  });
});
