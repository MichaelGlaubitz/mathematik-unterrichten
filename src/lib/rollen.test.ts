import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { werkzeuge, werkzeugPfad } from './werkzeuge';

/**
 * Die Rollentrennung ist eine Frage der Führung, nicht der Technik – aber die
 * paar technischen Zusagen, die sie trägt, sollen halten:
 *
 *  1. Ein Werkzeug in Schülerhand ist eine Sackgasse (kein Weg ins Lehrermaterial).
 *  2. Jedes Werkzeug nennt genau eine Rolle und ein Medium.
 *  3. Kein Regie-Werkzeug wird versehentlich als Schülergerät geführt.
 */
const lies = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');

const laufzeit = lies('public/werkzeuge/werkzeug.js');
const schuelerWerkzeuge = werkzeuge.filter((w) => w.rolle === 'Schülergerät');

describe('Werkzeug-Registry', () => {
  it('jedes Werkzeug hat genau eine Rolle und ein Medium', () => {
    for (const w of werkzeuge) {
      expect(['Regie', 'Schülergerät', 'Vorbereitung'], w.slug).toContain(w.rolle);
      expect(['Beamer', 'Tablet', 'Bildschirm', 'Papier'], w.slug).toContain(w.medium);
    }
  });

  it('das alte Feld `einsatz` ist verschwunden', () => {
    // Es vermischte Bedienung und Ausgabemedium; wer es wiederbelebt, soll das merken.
    expect(lies('src/lib/werkzeuge.ts')).not.toContain('einsatz:');
  });

  it('der Whiteboard-Check ist Regie, nicht Schülergerät', () => {
    // Seine eigene Beschreibung sagt „Sie zählen die Reihen durch“ – er zeigt
    // die Auswertung der ganzen Klasse.
    const w = werkzeuge.find((x) => x.slug === 'whiteboard-check');
    expect(w?.rolle).toBe('Regie');
  });
});

describe('Schülergeräte sind Sackgassen', () => {
  it('die Laufzeit kennt die Rolle und lässt den Rückweg weg', () => {
    expect(laufzeit).toContain("opt.rolle === 'Schülergerät'");
    expect(laufzeit).toContain('istSchuelergeraet');
  });

  it('jedes Schülerwerkzeug meldet seine Rolle an WZ.kopf', () => {
    expect(schuelerWerkzeuge.length).toBeGreaterThan(0);
    for (const w of schuelerWerkzeuge) {
      const quelle = lies(`public/werkzeuge/${w.slug}.html`);
      expect(quelle, w.slug).toMatch(/WZ\.kopf\(\{[^}]*rolle: 'Schülergerät'/);
    }
  });

  it('kein Schülerwerkzeug verlinkt ein Regie-Werkzeug oder die Seite', () => {
    const regie = new Set(
      werkzeuge.filter((w) => w.rolle !== 'Schülergerät').map((w) => `${w.slug}.html`)
    );
    for (const w of schuelerWerkzeuge) {
      const quelle = lies(`public/werkzeuge/${w.slug}.html`);
      const ziele = [...quelle.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
      const verboten = ziele.filter(
        (z) =>
          regie.has(z.replace(/^\.?\//, '')) ||
          z === '/' ||
          z === '/werkzeuge' ||
          z.startsWith('/quizzes') ||
          z.startsWith('/stunden') ||
          z.startsWith('/uebung')
      );
      expect(verboten, `${w.slug} führt ins Lehrermaterial`).toEqual([]);
    }
  });

  it('die Werkzeugkarte trägt den Hinweis, der von der Schülerseite genommen wurde', () => {
    const karte = werkzeuge.find((w) => w.slug === 'antwortkarte');
    expect(karte?.beschreibung).toContain('Whiteboard-Check');
    expect(karte?.beschreibung).toContain('Sackgasse');
  });
});

describe('Übungsgeneratoren: Rolle ist wählbar', () => {
  const komponente = lies('src/components/MassenuebungGeo.astro');

  it('der Schalter steht außerhalb des Rahmens, der beim Erzeugen verschwindet', () => {
    const modus = komponente.indexOf('id="ug-modus"');
    const rahmen = komponente.indexOf('id="ug-wb-slot-ab-full-chrome"');
    expect(modus).toBeGreaterThan(0);
    expect(modus, 'Schalter würde mit dem Rahmen ausgeblendet').toBeLessThan(rahmen);
  });

  it('im Schülermodus ist jeder Weg zur Lösung zu', () => {
    for (const wahl of [
      '#ug-alle-aufdecken',
      '#ug-alle-zuklappen',
      '#ug-wb-slot-ab-alle-auf',
      '#ug-wb-slot-ab-alle-zu',
      '#ug-wb-slot-ab-druck-loes',
      '.ug-wb-slot-ab-loesung-toggle',
      '.ug-task-details',
      '.ug-stat-loesungen',
    ]) {
      expect(komponente, wahl).toContain(`[data-mu-modus='schueler'] ${wahl}`);
    }
  });

  it('„Überprüfen“ bleibt – Selbstkontrolle verrät nichts', () => {
    expect(komponente).not.toContain("[data-mu-modus='schueler'] #ug-wb-slot-ab-check");
  });

  it('die Wahl bleibt auf dem Gerät', () => {
    expect(komponente).toContain("'mu-uebung-modus'");
  });
});

describe('Aufgabenfolgen: beide Zonen benannt', () => {
  const seite = lies('src/pages/aufgaben/[slug].astro');

  it('die Seite sagt, dass sie der Lehrkraft gehört', () => {
    expect(seite).toContain('Für die Lehrkraft');
  });

  it('Schülerteil und Lehrerkommentar sind markiert', () => {
    expect(seite).toContain('#didaktischer-kommentar');
    expect(seite).toContain('Nur für die Lehrkraft');
    expect(seite).toContain('Für die Klasse');
  });

  it('jede Aufgabenfolge hat den Abschnitt, an dem die Markierung hängt', () => {
    const d = path.join(process.cwd(), 'src/content/aufgaben');
    const ohne = fs
      .readdirSync(d)
      .filter((f) => !/^##\s*Didaktischer Kommentar/m.test(fs.readFileSync(path.join(d, f), 'utf8')));
    expect(ohne, 'ohne Abschnitt „Didaktischer Kommentar“').toEqual([]);
  });
});
