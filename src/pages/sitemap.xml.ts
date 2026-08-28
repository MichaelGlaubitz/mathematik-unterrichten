import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { werkzeuge, werkzeugPfad } from '../lib/werkzeuge';

/**
 * Eigene Sitemap statt @astrojs/sitemap.
 *
 * Vorteil gegenüber der Integration: echte `lastmod`-Daten aus den
 * Content-Collections und die statischen Seiten aus `public/` (Werkzeuge,
 * Handreichungen) lassen sich mit aufnehmen. @astrojs/sitemap ab 3.7 setzt
 * ausserdem Astro 5 voraus, dieses Projekt läuft auf Astro 4.
 */

const BASIS = 'https://mathematik-unterrichten.de';

type Eintrag = {
  pfad: string;
  lastmod?: Date;
  /** 0.0 – 1.0; steuert nur die interne Gewichtung für Crawler. */
  prioritaet: number;
  frequenz: 'daily' | 'weekly' | 'monthly' | 'yearly';
};

/** Handreichungen unter public/ausb/ – von Astro nicht als Route erfasst. */
const handreichungen = [
  'index.html',
  'handreichung-lernziele.html',
  'handreichung-pu.html',
  'handreichung-pruefungsunterricht.html',
  'handreichung-open-middle.html',
  'handreichung-mathe-trails.html',
  'handreichung-denkende-klassenzimmer.html',
  'handreichung-stundenverlaufsplan.html',
  'Produktive-Unterrichtsgespraeche.html',
];

function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function neuestes(daten: (Date | undefined)[]): Date | undefined {
  const gueltig = daten.filter((d): d is Date => d instanceof Date && !Number.isNaN(d.valueOf()));
  if (gueltig.length === 0) return undefined;
  return new Date(Math.max(...gueltig.map((d) => d.valueOf())));
}

export const GET: APIRoute = async () => {
  const blog = await getCollection('blog', ({ data }) => !data.entwurf);
  const aufgaben = await getCollection('aufgaben', ({ data }) => !data.entwurf);
  const quizzes = await getCollection('quizzes', ({ data }) => !data.entwurf);
  const themen = await getCollection('themen', ({ data }) => !data.entwurf);
  const stunden = await getCollection('stunden', ({ data }) => !data.entwurf);

  const zuletztInhalt = neuestes([
    ...blog.map((e) => e.data.aktualisiert ?? e.data.datum),
    ...aufgaben.map((e) => e.data.aktualisiert ?? e.data.datum),
    ...quizzes.map((e) => e.data.aktualisiert ?? e.data.datum),
    ...stunden.map((e) => e.data.aktualisiert ?? e.data.datum),
  ]);

  const eintraege: Eintrag[] = [
    { pfad: '/', prioritaet: 1.0, frequenz: 'weekly', lastmod: zuletztInhalt },
    { pfad: '/schnellstart', prioritaet: 0.9, frequenz: 'monthly' },
    { pfad: '/konzept', prioritaet: 0.9, frequenz: 'monthly' },
    { pfad: '/stunden', prioritaet: 0.9, frequenz: 'weekly', lastmod: zuletztInhalt },
    { pfad: '/werkzeuge', prioritaet: 0.9, frequenz: 'monthly' },
    { pfad: '/themen', prioritaet: 0.9, frequenz: 'weekly', lastmod: zuletztInhalt },
    { pfad: '/fehlvorstellungen', prioritaet: 0.85, frequenz: 'monthly' },
    { pfad: '/methoden', prioritaet: 0.85, frequenz: 'monthly' },
    { pfad: '/ki', prioritaet: 0.8, frequenz: 'monthly' },
    { pfad: '/aufgaben', prioritaet: 0.8, frequenz: 'weekly' },
    { pfad: '/quizzes', prioritaet: 0.8, frequenz: 'weekly' },
    { pfad: '/blog', prioritaet: 0.8, frequenz: 'weekly' },
    { pfad: '/fortbildung', prioritaet: 0.7, frequenz: 'monthly' },
    { pfad: '/suche', prioritaet: 0.4, frequenz: 'yearly' },
    { pfad: '/ueber', prioritaet: 0.6, frequenz: 'yearly' },
    { pfad: '/kontakt', prioritaet: 0.5, frequenz: 'yearly' },
    { pfad: '/impressum', prioritaet: 0.2, frequenz: 'yearly' },
    { pfad: '/datenschutz', prioritaet: 0.2, frequenz: 'yearly' },
  ];

  for (const e of blog) {
    eintraege.push({
      pfad: `/blog/${e.slug}`,
      lastmod: e.data.aktualisiert ?? e.data.datum,
      prioritaet: 0.7,
      frequenz: 'monthly',
    });
  }
  for (const e of stunden) {
    eintraege.push({
      pfad: `/stunden/${e.slug}`,
      lastmod: e.data.aktualisiert ?? e.data.datum,
      prioritaet: 0.8,
      frequenz: 'monthly',
    });
  }
  for (const e of aufgaben) {
    eintraege.push({
      pfad: `/aufgaben/${e.slug}`,
      lastmod: e.data.aktualisiert ?? e.data.datum,
      prioritaet: 0.7,
      frequenz: 'monthly',
    });
  }
  for (const e of quizzes) {
    eintraege.push({
      pfad: `/quizzes/${e.id}`,
      lastmod: e.data.aktualisiert ?? e.data.datum,
      prioritaet: 0.7,
      frequenz: 'monthly',
    });
  }

  // Übungsgeneratoren: eine Route je Themendatei unter src/pages/uebung/
  const uebungsseiten = Object.keys(import.meta.glob('./uebung/*.astro'));
  for (const datei of uebungsseiten) {
    const slug = datei.replace('./uebung/', '').replace('.astro', '');
    eintraege.push({ pfad: `/uebung/${slug}`, prioritaet: 0.75, frequenz: 'monthly' });
  }

  // Mini-Whiteboard-Routen je Thema
  for (const t of themen) {
    const slug = t.data.thema
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    eintraege.push({ pfad: `/themen/${slug}/whiteboard`, prioritaet: 0.6, frequenz: 'monthly' });
  }

  for (const w of werkzeuge) {
    eintraege.push({ pfad: werkzeugPfad(w), prioritaet: 0.8, frequenz: 'monthly' });
  }

  for (const datei of handreichungen) {
    eintraege.push({ pfad: `/ausb/${datei}`, prioritaet: 0.7, frequenz: 'yearly' });
  }

  const zeilen = eintraege.map((e) => {
    const teile = [
      `    <loc>${xmlEscape(new URL(e.pfad, BASIS).toString())}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod.toISOString().slice(0, 10)}</lastmod>` : null,
      `    <changefreq>${e.frequenz}</changefreq>`,
      `    <priority>${e.prioritaet.toFixed(1)}</priority>`,
    ].filter(Boolean);
    return `  <url>\n${teile.join('\n')}\n  </url>`;
  });

  const namensraum = 'http://www.sitemaps.org/schemas/sitemap/0.9';
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="${namensraum}">\n${zeilen.join('\n')}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
