import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { baueBestand, istDuenn, schmalsteZeile, type Quelle } from './bestand';

/** Die echten Sammlungen – die Übersicht soll den Bestand zeigen, nicht ein Modell davon. */
function ausDenDateien(): Quelle {
  const w = (p: string) => path.join(process.cwd(), p);
  const feld = (q: string, name: string) =>
    new RegExp(`^${name}:\\s*["']?([^"'\\n]+)`, 'm').exec(q)?.[1].trim() ?? '';

  const aufgaben = fs
    .readdirSync(w('src/content/aufgaben'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const markdown = fs.readFileSync(w(`src/content/aufgaben/${f}`), 'utf8');
      return {
        slug: f.replace(/\.md$/, ''),
        thema: feld(markdown, 'thema'),
        titel: feld(markdown, 'titel'),
        klassenstufe: (/^klassenstufe:\s*\[([^\]]*)\]/m.exec(markdown)?.[1] ?? '')
          .split(',')
          .map((s) => s.replace(/["'\s]/g, ''))
          .filter(Boolean),
        markdown,
      };
    });

  const themen = fs
    .readdirSync(w('src/content/themen'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const d = JSON.parse(fs.readFileSync(w(`src/content/themen/${f}`), 'utf8'));
      return { slug: f.replace(/\.json$/, ''), thema: d.thema, titel: d.titel, klassenstufenAnzeige: d.klassenstufenAnzeige };
    });

  const quizzes = fs
    .readdirSync(w('src/content/quizzes'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ thema: JSON.parse(fs.readFileSync(w(`src/content/quizzes/${f}`), 'utf8')).thema }));

  const stunden = fs
    .readdirSync(w('src/content/stunden'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ thema: feld(fs.readFileSync(w(`src/content/stunden/${f}`), 'utf8'), 'thema') }));

  return { aufgaben, themen, quizzes, stunden };
}

const bestand = baueBestand(ausDenDateien());

describe('Bestandsaufnahme', () => {
  it('jedes Thema kommt genau einmal vor', () => {
    const themen = bestand.zeilen.map((z) => z.thema);
    expect(new Set(themen).size).toBe(themen.length);
    expect(bestand.zeilen.length).toBeGreaterThanOrEqual(23);
  });

  it('die Zahlen stimmen mit dem Bestand überein', () => {
    // Nicht gegen feste Zahlen prüfen – die wachsen –, sondern gegen die
    // Sammlungen selbst.
    const dateien = fs.readdirSync(path.join(process.cwd(), 'src/content/aufgaben')).filter((f) => f.endsWith('.md'));
    const gezaehlt = bestand.zeilen.reduce((n, z) => n + z.dateien.length, 0);
    expect(gezaehlt).toBe(dateien.length);
    expect(bestand.summe.folgen).toBe(bestand.zeilen.reduce((n, z) => n + z.folgen, 0));
  });

  it('jedes Thema hat mindestens eine Aufgabenfolge', () => {
    // Wäre das nicht so, müsste die Übersicht es zeigen – der Test hält den
    // Anspruch fest, nicht bloß die Anzeige.
    for (const z of bestand.zeilen) {
      expect(z.folgen, `${z.titel}`).toBeGreaterThan(0);
    }
  });

  it('„dünn" ist der halbe Durchschnitt, keine feste Zahl', () => {
    // Sonst markierte die Übersicht auf ewig dieselben Themen, auch wenn der
    // Bestand längst gewachsen ist.
    const schnitt = bestand.schnittFolgen;
    const knapp = { ...bestand.zeilen[0], folgen: Math.floor(schnitt / 2) - 1 };
    const satt = { ...bestand.zeilen[0], folgen: Math.ceil(schnitt) };
    expect(istDuenn(knapp, schnitt)).toBe(true);
    expect(istDuenn(satt, schnitt)).toBe(false);
  });

  it('das schmalste Thema ist das mit den wenigsten Folgen', () => {
    // Wenn nichts mehr „dünn" ist, muss die Übersicht trotzdem sagen können,
    // wo der nächste Ausbau hingehört.
    const schmal = schmalsteZeile(bestand.zeilen);
    expect(schmal).toBeDefined();
    for (const z of bestand.zeilen) {
      expect(z.folgen, `${z.titel} hat weniger als ${schmal!.titel}`).toBeGreaterThanOrEqual(schmal!.folgen);
    }
  });

  it('bei gleicher Folgenzahl entscheidet die Aufgabenzahl', () => {
    const roh = { thema: '', titel: '', klassenstufe: '', dateien: [], quiz: 0, stunden: 0 };
    const schmal = schmalsteZeile([
      { ...roh, thema: 'A', titel: 'A', folgen: 2, aufgaben: 20 },
      { ...roh, thema: 'B', titel: 'B', folgen: 2, aufgaben: 8 },
      { ...roh, thema: 'C', titel: 'C', folgen: 3, aufgaben: 4 },
    ]);
    expect(schmal?.titel).toBe('B');
  });

  it('ein Thema ohne Themenseite fällt nicht unter den Tisch', () => {
    const bunt = baueBestand({
      aufgaben: [{ slug: 'x', thema: 'Kegelschnitte', titel: 'X', klassenstufe: ['11'], markdown: '' }],
      themen: [],
      quizzes: [],
      stunden: [],
    });
    expect(bunt.zeilen.map((z) => z.thema)).toContain('Kegelschnitte');
    expect(bunt.zeilen[0].themaSlug).toBeUndefined();
  });

  it('Quiz und Stundenverlauf werden je Thema gezählt', () => {
    const mit = bestand.zeilen.filter((z) => z.quiz > 0).length;
    expect(mit).toBeGreaterThan(15);
    expect(bestand.summe.quiz).toBeGreaterThan(0);
    expect(bestand.summe.stunden).toBeGreaterThan(0);
  });
});
