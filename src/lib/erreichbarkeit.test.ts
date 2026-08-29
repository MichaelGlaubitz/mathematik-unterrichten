import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { rehypeTabellenScroll } from './rehypeTabellenScroll';

const lies = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');

/**
 * Vier Zusagen aus der Durchsicht vom 29. August:
 *  1. Jede Whiteboard-Runde ist von ihrem Thema aus anklickbar.
 *  2. Was gedruckt wird, ist das Blatt für die Klasse – ohne Seitengerüst,
 *     ohne Lehrerkommentar, solange niemand ihn ausdrücklich dazunimmt.
 *  3. Eine breite Tabelle rollt in ihrem Rahmen, statt die Seite zu schieben.
 *  4. Die vier Hauptseiten sagen jede für sich, worum es geht; Rohlinge
 *     gehören in keine Suchmaschine.
 */

describe('Whiteboard-Runden sind vom Thema aus erreichbar', () => {
  const block = lies('src/components/TopicBlock.astro');

  it('die Ausnahmeliste steht genau einmal da', () => {
    // Zweimal ausgeschrieben liefen die beiden Kopien auseinander – so kam
    // der Knopf für elf Themen abhanden.
    expect(block.match(/'bruchrechnung'/g) ?? []).toHaveLength(1);
    expect(block).toContain('const WB_KOMPAKT = [');
  });

  it('beide Zweige führen zur Runde', () => {
    const treffer = block.match(/\/themen\/\$\{slug\}\/whiteboard/g) ?? [];
    expect(treffer.length, 'ausführlicher Block und Kurzzeile').toBeGreaterThanOrEqual(2);
    expect(block).toContain('wbKompakt && whiteboard.length > 0');
  });

  it('jedes Thema hat eine Runde, zu der verlinkt werden kann', () => {
    const d = path.join(process.cwd(), 'src/content/themen');
    const ohne = fs
      .readdirSync(d)
      .filter((f) => (JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')).whiteboardAufgaben ?? []).length === 0);
    expect(ohne, 'Themen ohne Whiteboard-Aufgaben').toEqual([]);
  });
});

describe('Papier', () => {
  const stil = lies('src/styles/global.css');
  const folge = lies('src/pages/aufgaben/[slug].astro');

  it('das Seitengerüst wird nicht mitgedruckt', () => {
    expect(stil).toContain('@media print');
    for (const wahl of ['body > header', 'body > footer', '.mu-nicht-drucken']) {
      expect(stil, wahl).toContain(wahl);
    }
  });

  it('Zugeklapptes klappt zum Drucken auf', () => {
    // Ein <details> druckt sonst als leere Zeile.
    expect(stil).toMatch(/details\s*\{\s*display:\s*block\s*!important/);
  });

  it('der Lehrerkommentar bleibt vom Blatt der Klasse weg', () => {
    expect(folge).toContain("mu-aufgabenfolge:not([data-mu-druck='mit-kommentar']) #didaktischer-kommentar");
    expect(folge).toContain('#didaktischer-kommentar ~ *');
  });

  it('wer ihn braucht, kann ihn dazunehmen', () => {
    expect(folge).toContain('mu-druck-kommentar');
    expect(folge).toContain('Kommentar mitdrucken');
    expect(folge).toContain("'mit-kommentar'");
  });
});

describe('Tabellen rollen im eigenen Rahmen', () => {
  const baum = () => ({
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [{ type: 'element', tagName: 'table', properties: {}, children: [] }],
      },
    ],
  });

  it('legt einen Rahmen um die Tabelle', () => {
    const b: any = baum();
    (rehypeTabellenScroll() as any)(b);
    const huelle = b.children[0].children[0];
    expect(huelle.tagName).toBe('div');
    expect(huelle.properties.className).toEqual(['mu-tabelle-scroll']);
    expect(huelle.children[0].tagName, 'die Tabelle bleibt eine Tabelle').toBe('table');
  });

  it('lässt alles andere unangetastet', () => {
    const b: any = { type: 'root', children: [{ type: 'element', tagName: 'p', properties: {}, children: [] }] };
    (rehypeTabellenScroll() as any)(b);
    expect(b.children[0].tagName).toBe('p');
  });

  it('ist im Bau eingehängt', () => {
    // Der bloße Name genügt nicht – er steht schon in der Import-Zeile.
    // Es zählt, dass das Plugin auch in der Liste der rehypePlugins steht.
    const liste = lies('astro.config.mjs').match(/rehypePlugins:\s*\[([^\]]*)\]/);
    expect(liste, 'keine rehypePlugins-Liste in astro.config.mjs').not.toBeNull();
    expect(liste![1]).toContain('rehypeTabellenScroll');
  });
});

describe('Was in der Trefferliste steht', () => {
  it('die vier Hauptseiten sagen jede für sich, worum es geht', () => {
    const gesehen = new Set<string>();
    for (const datei of ['index.astro', 'ueber.astro', 'impressum.astro', 'datenschutz.astro']) {
      const t = lies('src/pages/' + datei);
      const m = t.match(/beschreibung="([^"]+)"/);
      expect(m, datei + ' ohne eigene Beschreibung').not.toBeNull();
      expect(gesehen.has(m![1]), datei + ' wiederholt eine fremde Beschreibung').toBe(false);
      gesehen.add(m![1]);
    }
  });

  it('die Rohlinge gehören in keine Suchmaschine', () => {
    for (const datei of [
      'public/ausb/Vorlage/Vorlage-Handreichung.html',
      'public/ausb/Vorlage/Vorlage-Handreichung-self-contained.html',
    ]) {
      const t = lies(datei);
      expect(t, datei).toContain('name="robots" content="noindex');
      expect(t, datei + ' trägt noch den Platzhaltertitel').not.toContain('<title>[SEITENTITEL]');
    }
  });
});
