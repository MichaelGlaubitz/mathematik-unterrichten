import { getCollection } from 'astro:content';
import { gegenmittel } from './gegenmittel';
import { methoden } from './methoden';
import { AUF_JEDER_STUNDENSEITE, werkzeuge, werkzeugPfad, type Werkzeug } from './werkzeuge';

/**
 * Wo kommt ein Werkzeug im Material dieser Seite vor?
 *
 * Der Werkzeugkasten zeigte bis hierher nur „Werkzeug öffnen“ und einen
 * Hintergrundlink. Dass es zur Gleichungswaage eine komplette Stunde und vier
 * Gegenmittel gibt, stand nirgends – die Verbindung lief nur in eine Richtung.
 *
 * Die Fundstellen werden beim Build aus den Inhalten gelesen, nicht von Hand
 * gepflegt: Wer eine Stunde schreibt, die ein Werkzeug nennt, taucht damit
 * automatisch auf dessen Karte auf.
 */

export interface Fundstelle {
  titel: string;
  href: string;
}

export interface WerkzeugFundstellen {
  stunden: Fundstelle[];
  aufgaben: Fundstelle[];
  blog: Fundstelle[];
  methoden: Fundstelle[];
  /** Anzahl der Gegenmittel im Fehlvorstellungs-Katalog, die auf das Werkzeug zeigen. */
  gegenmittel: number;
}

/** Nennt der Text die Datei des Werkzeugs? Query und Fragment bleiben außen vor. */
function nennt(text: string, w: Werkzeug): boolean {
  return text.includes(werkzeugPfad(w));
}


export async function baueWerkzeugFundstellen(): Promise<Map<string, WerkzeugFundstellen>> {
  const [stunden, aufgaben, blog] = await Promise.all([
    getCollection('stunden', ({ data }) => !data.entwurf),
    getCollection('aufgaben', ({ data }) => !data.entwurf),
    getCollection('blog', ({ data }) => !data.entwurf),
  ]);

  const karte = new Map<string, WerkzeugFundstellen>();

  for (const w of werkzeuge) {
    // Stunden nennen Werkzeuge in den Phasen (strukturiert) und im Fließtext.
    const stundenTreffer = (AUF_JEDER_STUNDENSEITE as readonly string[]).includes(w.slug)
      ? stunden
      : stunden.filter(
          (s) =>
            s.data.phasen.some((f) => f.werkzeug && nennt(f.werkzeug.href, w)) || nennt(s.body, w)
        );
    const aufgabenTreffer = aufgaben.filter((a) => nennt(a.body, w));
    const blogTreffer = blog.filter((b) => nennt(b.body, w));
    const methodenTreffer = methoden.filter((m) => m.links.some((l) => nennt(l.href, w)));
    const gegenmittelTreffer = gegenmittel.filter((g) => g.werkzeug && nennt(g.werkzeug.href, w));

    karte.set(w.slug, {
      stunden: stundenTreffer.map((s) => ({ titel: s.data.titel, href: `/stunden/${s.slug}` })),
      aufgaben: aufgabenTreffer.map((a) => ({ titel: a.data.titel, href: `/aufgaben/${a.slug}` })),
      blog: blogTreffer.map((b) => ({ titel: b.data.title, href: `/blog/${b.slug}` })),
      methoden: methodenTreffer.map((m) => ({ titel: m.name, href: `/methoden#${m.slug}` })),
      gegenmittel: gegenmittelTreffer.length,
    });
  }

  return karte;
}

/** Ein Satz für die Werkzeugkarte, oder null, wenn es nichts zu zeigen gibt. */
export function fundstellenZeile(f: WerkzeugFundstellen): string | null {
  const teile: string[] = [];
  const zahl = (n: number, eins: string, viele: string) =>
    n === 1 ? `1 ${eins}` : `${n} ${viele}`;
  if (f.stunden.length) teile.push(zahl(f.stunden.length, 'Stundenverlauf', 'Stundenverläufe'));
  if (f.aufgaben.length) teile.push(zahl(f.aufgaben.length, 'Aufgabenfolge', 'Aufgabenfolgen'));
  if (f.gegenmittel) teile.push(zahl(f.gegenmittel, 'Gegenmittel', 'Gegenmittel'));
  if (f.methoden.length) teile.push(zahl(f.methoden.length, 'Methode', 'Methoden'));
  if (f.blog.length) teile.push(zahl(f.blog.length, 'Blogbeitrag', 'Blogbeiträge'));
  return teile.length ? teile.join(' · ') : null;
}
