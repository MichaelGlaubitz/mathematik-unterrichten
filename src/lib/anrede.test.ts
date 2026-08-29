import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Schüler werden geduzt. Immer, auf jeder Fläche, die sie zu sehen bekommen.
 *
 * Für die Aufgabenfolgen prüft das `aufgabenfolgen.test.ts`. Hier stehen die
 * übrigen Schülerflächen: die Quizfragen, die im Unterricht projiziert oder
 * am Gerät beantwortet werden, und die Werkzeuge mit der Rolle
 * `Schülergerät`. Der Lehrerteil – `didaktischerKontext` im Quiz, die
 * Regie-Werkzeuge – bleibt beim Sie und wird hier nicht angefasst.
 */

/** Anrede-Sie: „Prüfen Sie …“, „Ihre Rechnung“, „bei Ihnen“. Das
 *  Personalpronomen der 3. Person („sie rechnet“, „Ihr Ergebnis stimmt“ am
 *  Satzanfang als Plural-Ihr) fällt nicht darunter. */
const VERB_SIE = /\b[A-Za-zÄÖÜäöü][a-zäöüß]+e[nt]?\s+Sie\b/;
const IHR_ANREDE = /(?<![.!?:„“"]\s)(?<!^)\b(?:Ihre?[nmrs]?|Ihnen)\b/m;

function siezt(text: string): boolean {
  return VERB_SIE.test(text) || IHR_ANREDE.test(text);
}

describe('Quizfragen duzen', () => {
  const ordner = path.join(process.cwd(), 'src/content/quizzes');
  const dateien = fs.readdirSync(ordner).filter((f) => f.endsWith('.json'));

  it('findet Quizze', () => {
    expect(dateien.length).toBeGreaterThan(10);
  });

  for (const datei of dateien) {
    it(`${datei} spricht die Klasse mit du an`, () => {
      const quiz = JSON.parse(fs.readFileSync(path.join(ordner, datei), 'utf8'));
      const verstoesse: string[] = [];
      quiz.fragen?.forEach((f: Record<string, unknown>, i: number) => {
        for (const feld of ['frage', 'kontext', 'hinweis'] as const) {
          const wert = f[feld];
          if (typeof wert === 'string' && siezt(wert)) verstoesse.push(`fragen[${i}].${feld}: ${wert}`);
        }
        (f.optionen as Record<string, unknown>[] | undefined)?.forEach((o, j) => {
          for (const feld of ['text', 'erklaerung'] as const) {
            const wert = o[feld];
            if (typeof wert === 'string' && siezt(wert)) {
              verstoesse.push(`fragen[${i}].optionen[${j}].${feld}: ${wert}`);
            }
          }
        });
      });
      expect(verstoesse).toEqual([]);
    });
  }
});

describe('Werkzeuge auf dem Schülergerät duzen', () => {
  const ordner = path.join(process.cwd(), 'public/werkzeuge');
  const schuelergeraete = fs
    .readdirSync(ordner)
    .filter((f) => f.endsWith('.html'))
    .filter((f) => /rolle:\s*['"]Schülergerät['"]/.test(fs.readFileSync(path.join(ordner, f), 'utf8')));

  it('findet Werkzeuge mit der Rolle Schülergerät', () => {
    expect(schuelergeraete.length).toBeGreaterThan(0);
  });

  for (const datei of schuelergeraete) {
    it(`${datei} spricht die Klasse mit du an`, () => {
      const inhalt = fs.readFileSync(path.join(ordner, datei), 'utf8');
      // Nur der sichtbare Text zählt, nicht Skript- und Stilblöcke.
      const sichtbar = inhalt
        .replace(/<script[\s\S]*?<\/script>/g, '')
        .replace(/<style[\s\S]*?<\/style>/g, '');
      const verstoesse = sichtbar
        .split('\n')
        .filter((z) => siezt(z))
        .map((z) => z.trim());
      expect(verstoesse).toEqual([]);
    });
  }
});
