import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { AUF_JEDER_STUNDENSEITE, werkzeuge, werkzeugPfad } from './werkzeuge';


/**
 * `AUF_JEDER_STUNDENSEITE` behauptet, dass die Stundenvorlage zwei Werkzeuge
 * auf jeder Stundenseite anbietet. Die Werkzeugkarten im Werkzeugkasten zählen
 * darauf 23 Stundenverläufe. Wer den Link aus der Vorlage entfernt, soll das
 * hier merken und nicht erst, wenn die Karte etwas Falsches behauptet.
 */
const vorlage = fs.readFileSync(
  path.join(process.cwd(), 'src/pages/stunden/[slug].astro'),
  'utf8'
);

describe('Werkzeuge auf jeder Stundenseite', () => {
  it('die Vorlage verlinkt jedes gelistete Werkzeug', () => {
    for (const slug of AUF_JEDER_STUNDENSEITE) {
      const w = werkzeuge.find((x) => x.slug === slug);
      expect(w, `Werkzeug ${slug} in werkzeuge.ts`).toBeDefined();
      // Die Abstimmung wird über abstimmungsLink() erzeugt, die Antwortkarte
      // direkt verlinkt – beide Formen zählen.
      const direkt = vorlage.includes(werkzeugPfad(w!));
      const ueberLink = slug === 'abstimmung' && vorlage.includes('abstimmungsLink(');
      expect(direkt || ueberLink, `${slug} in src/pages/stunden/[slug].astro`).toBe(true);
    }
  });

  it('listet nur Slugs, die es auch als Werkzeug gibt', () => {
    const bekannt = new Set(werkzeuge.map((w) => w.slug));
    for (const slug of AUF_JEDER_STUNDENSEITE) expect(bekannt.has(slug), slug).toBe(true);
  });
});
