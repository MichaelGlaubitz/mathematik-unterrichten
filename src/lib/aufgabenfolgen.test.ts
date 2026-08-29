import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';

/**
 * Was der Bestand einhalten muss, seit die Aufgabenfolgen als Unterrichts-
 * material gedacht sind und nicht als Notizen:
 *
 *  1. Mathematik wird gesetzt, nicht als Quelltext geschrieben.
 *  2. Der Schülerteil duzt. Immer.
 *  3. Der Lehrerteil bleibt beim Sie – er spricht die Lehrkraft an.
 */
const ORDNER = path.join(process.cwd(), 'src/content/aufgaben');
const dateien = fs.readdirSync(ORDNER).filter((f) => f.endsWith('.md'));

/** Teilt eine Datei in Frontmatter, Schülerteil und Lehrerkommentar. */
function teile(inhalt: string) {
  const i = inhalt.indexOf('\n---\n', 3) + 5;
  const koerper = inhalt.slice(i);
  const k = koerper.indexOf('## Didaktischer Kommentar');
  return {
    schueler: k < 0 ? koerper : koerper.slice(0, k),
    lehrkraft: k < 0 ? '' : koerper.slice(k),
  };
}

/** Zeilen ohne Tabellen – dort steht die Anrede. */
const fliesstext = (t: string) => t.split('\n').filter((z) => !/^\s*\|/.test(z));

describe('Formelsatz', () => {
  it('keine Mathematik mehr in Code-Spans', () => {
    // `(x + 3)²` sieht an der Wand aus wie Quelltext. Der Bestand ist auf
    // KaTeX umgestellt; ein Rückfall soll auffallen.
    const mitSpans = dateien.filter((f) => /`[^`]+`/.test(fs.readFileSync(path.join(ORDNER, f), 'utf8')));
    expect(mitSpans).toEqual([]);
  });

  it('jede Formel im Bestand geht durch KaTeX', () => {
    const kaputt: string[] = [];
    for (const f of dateien) {
      const t = fs.readFileSync(path.join(ORDNER, f), 'utf8');
      for (const m of t.matchAll(/(?<!\\)\$([^$\n]+)\$/g)) {
        try {
          katex.renderToString(m[1], { throwOnError: true });
        } catch (e) {
          kaputt.push(`${f}: „${m[1].slice(0, 40)}" — ${String(e).slice(0, 60)}`);
        }
      }
    }
    expect(kaputt.slice(0, 6)).toEqual([]);
  });

  it('die Dollarzeichen stehen paarweise', () => {
    for (const f of dateien) {
      const t = fs.readFileSync(path.join(ORDNER, f), 'utf8');
      const anzahl = (t.match(/(?<!\\)\$/g) ?? []).length;
      expect(anzahl % 2, `${f}: ungerade Anzahl $`).toBe(0);
    }
  });
});

describe('Anrede', () => {
  it('der Schülerteil duzt – kein Höflichkeits-Sie', () => {
    // Ein grosses „Sie" nach einem Verb ist Anrede. Das Pronomen der
    // 3. Person Plural („Sie sehen nur verschieden aus" – die Zahlen) steht
    // vor seinem Verb und bleibt erlaubt.
    const siezt: string[] = [];
    for (const f of dateien) {
      const { schueler } = teile(fs.readFileSync(path.join(ORDNER, f), 'utf8'));
      for (const z of fliesstext(schueler)) {
        if (/\b[a-zA-ZäöüÄÖÜß]{3,}(en|n) Sie\b/.test(z)) siezt.push(`${f}: ${z.trim().slice(0, 70)}`);
        if (/\bIhnen\b|\bIhre[nmrs]?\b/.test(z)) siezt.push(`${f}: Possessiv – ${z.trim().slice(0, 60)}`);
      }
    }
    expect(siezt.slice(0, 6)).toEqual([]);
  });

  it('der Lehrerkommentar bleibt beim Sie', () => {
    // Er spricht die Lehrkraft an – dort wäre ein „du" falsch.
    const geduzt: string[] = [];
    for (const f of dateien) {
      const { lehrkraft } = teile(fs.readFileSync(path.join(ORDNER, f), 'utf8'));
      if (/\bdeine[nmrs]?\b|\bdu\b/.test(lehrkraft)) geduzt.push(f);
    }
    expect(geduzt).toEqual([]);
  });
});
