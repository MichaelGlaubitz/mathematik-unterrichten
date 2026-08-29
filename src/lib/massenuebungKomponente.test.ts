import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { uebungsgeneratoren } from './uebungsgeneratoren';

/**
 * Vertragsprüfungen gegen `src/components/MassenuebungGeo.astro`.
 *
 * Die Komponente hat zwei getrennte Import-Blöcke: einen in der Frontmatter
 * (läuft beim Build) und einen im Client-Script (läuft im Browser). Wer eine
 * Konstante nur oben ergänzt, bekommt keinen Build-Fehler – die Seite wirft
 * dann erst beim Klick auf „Aufgaben erzeugen“ einen ReferenceError. Genau so
 * lieferten vier Übungsgeneratoren monatelang gar keine Aufgaben.
 */
const komponente = fs.readFileSync(
  path.join(process.cwd(), 'src/components/MassenuebungGeo.astro'),
  'utf8'
);

/** Alles ab dem Client-Script – nur dieser Teil läuft im Browser. */
function clientScript(): string {
  const i = komponente.indexOf('\n<script>');
  expect(i, 'Client-Script in MassenuebungGeo.astro').toBeGreaterThan(0);
  return komponente.slice(i);
}

function importiertVon(quelle: string, datei: string): Set<string> {
  const m = quelle.match(new RegExp(`import \\{([^}]*)\\} from '${datei}';`, 's'));
  return new Set(m ? (m[1].match(/\b([A-Z_]+_GENERATOR_IDS)\b/g) ?? []) : []);
}

describe('MassenuebungGeo: Client-Script', () => {
  it('importiert jede GENERATOR_IDS-Konstante, die es benutzt', () => {
    const skript = clientScript();
    const benutzt = new Set(skript.match(/\b[A-Z_]+_GENERATOR_IDS\b/g) ?? []);
    const importiert = importiertVon(skript, '\\.\\./lib/uebungPracticeGenerators');
    const fehlend = [...benutzt].filter((id) => !importiert.has(id)).sort();
    expect(fehlend, 'im Client-Script benutzt, aber nicht importiert').toEqual([]);
  });

  it('ruft Generatoren losgelöst auf – deshalb darf keiner `this` brauchen', () => {
    // Dokumentiert die Aufrufform, auf die sich der Test in
    // uebungPracticeGenerators.test.ts bezieht.
    expect(clientScript()).toContain('const gen = GEN[t];');
  });
});

describe('Übungsgeneratoren-Registry', () => {
  const seitenVerzeichnis = path.join(process.cwd(), 'src/pages/uebung');
  const slugsAufPlatte = fs
    .readdirSync(seitenVerzeichnis)
    .filter((d) => d.endsWith('.astro'))
    .map((d) => d.replace('.astro', ''))
    .sort();

  it('deckt genau die Seiten unter src/pages/uebung ab', () => {
    expect(uebungsgeneratoren.map((u) => u.slug).sort()).toEqual(slugsAufPlatte);
  });

  it('jede Seite reicht ihren eigenen Slug als variant weiter', () => {
    for (const slug of slugsAufPlatte) {
      const quelle = fs.readFileSync(path.join(seitenVerzeichnis, `${slug}.astro`), 'utf8');
      expect(quelle, slug).toContain(`uebungsgenerator('${slug}')`);
      expect(quelle, slug).toContain(`variant="${slug}"`);
      expect(quelle, slug).toContain(`backHref="/themen#thema-${slug}"`);
    }
  });

  it('Titel und Beschreibung sind gesetzt', () => {
    for (const u of uebungsgeneratoren) {
      expect(u.titel, u.slug).toMatch(/^WB /);
      expect(u.beschreibung.length, u.slug).toBeGreaterThan(40);
    }
  });
});
