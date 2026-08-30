import { leseVariationsfolgen } from './variationsfolgen';

/**
 * Was zu einem Thema an Material da ist – und was nicht.
 *
 * Gedacht als Planungsblick, nicht als Statistik: Wer eine Reihe vorbereitet,
 * will auf einen Blick sehen, wo eine Aufgabenfolge dünn ist und wo ein Quiz
 * oder ein Stundenverlauf fehlt. Deshalb zählt die Übersicht nicht nur, was
 * da ist, sondern markiert auch, was gemessen an den übrigen Themen zu wenig
 * ist.
 */

export interface Bestandszeile {
  thema: string;
  /** Wie das Thema auf der Themenseite heißt. */
  titel: string;
  klassenstufe: string;
  /** Slug der Themenseite, falls es eine gibt. */
  themaSlug?: string;
  /** Aufgabenfolgen-Dateien zu diesem Thema. */
  dateien: { slug: string; titel: string; folgen: number; aufgaben: number }[];
  folgen: number;
  aufgaben: number;
  quiz: number;
  stunden: number;
}

export interface Bestand {
  zeilen: Bestandszeile[];
  /** Durchschnittliche Anzahl Folgen je Thema – der Maßstab für „dünn“. */
  schnittFolgen: number;
  schnittAufgaben: number;
  summe: { themen: number; folgen: number; aufgaben: number; quiz: number; stunden: number };
}

/**
 * Ab wann ein Thema als dünn gilt.
 *
 * Die Schwelle ist kein Gefühl, sondern der halbe Durchschnitt: Ein Thema mit
 * weniger als der Hälfte der üblichen Folgen fällt auf. So verschiebt sich
 * die Marke mit, wenn der Bestand wächst – und markiert nicht auf ewig
 * dieselben vier Themen.
 */
export function istDuenn(zeile: Bestandszeile, schnittFolgen: number): boolean {
  return zeile.folgen < schnittFolgen / 2;
}

/**
 * Das Thema, bei dem der nächste Ausbau am meisten brächte.
 *
 * Sobald kein Thema mehr als „dünn“ auffällt, stünde die Übersicht sonst mit
 * lauter Nullen da. Die Frage dahinter bleibt aber dieselbe: Wo weiter? Bei
 * gleicher Folgenzahl entscheidet die Aufgabenzahl, sonst wäre die Reihenfolge
 * vom Zufall der Sortierung abhängig.
 */
export function schmalsteZeile(zeilen: Bestandszeile[]): Bestandszeile | undefined {
  return [...zeilen].sort((a, b) => a.folgen - b.folgen || a.aufgaben - b.aufgaben)[0];
}

export interface Quelle {
  aufgaben: { slug: string; thema: string; titel: string; klassenstufe: string[]; markdown: string }[];
  themen: { slug: string; thema: string; titel: string; klassenstufenAnzeige?: string }[];
  quizzes: { thema: string }[];
  stunden: { thema: string }[];
}

export function baueBestand(quelle: Quelle): Bestand {
  const zeilen = new Map<string, Bestandszeile>();

  for (const t of quelle.themen) {
    zeilen.set(t.thema, {
      thema: t.thema,
      titel: t.titel,
      klassenstufe: t.klassenstufenAnzeige ?? '',
      themaSlug: t.slug,
      dateien: [],
      folgen: 0,
      aufgaben: 0,
      quiz: 0,
      stunden: 0,
    });
  }

  const hole = (thema: string): Bestandszeile => {
    let z = zeilen.get(thema);
    if (!z) {
      // Ein Thema ohne Themenseite verschwindet sonst aus der Übersicht –
      // und gerade das wäre eine Lücke, die man sehen will.
      z = { thema, titel: thema, klassenstufe: '', dateien: [], folgen: 0, aufgaben: 0, quiz: 0, stunden: 0 };
      zeilen.set(thema, z);
    }
    return z;
  };

  for (const a of quelle.aufgaben) {
    const z = hole(a.thema);
    const fund = leseVariationsfolgen(a.markdown);
    const folgen = fund.folgen.length;
    const aufgaben = fund.folgen.reduce((n, f) => n + f.aufgaben.length, 0);
    z.dateien.push({ slug: a.slug, titel: a.titel, folgen, aufgaben });
    z.folgen += folgen;
    z.aufgaben += aufgaben;
    if (!z.klassenstufe) z.klassenstufe = `Klasse ${a.klassenstufe.join('–')}`;
  }
  for (const q of quelle.quizzes) hole(q.thema).quiz += 1;
  for (const s of quelle.stunden) hole(s.thema).stunden += 1;

  const liste = [...zeilen.values()].sort((a, b) => a.titel.localeCompare(b.titel, 'de'));
  const summe = liste.reduce(
    (s, z) => ({
      themen: s.themen + 1,
      folgen: s.folgen + z.folgen,
      aufgaben: s.aufgaben + z.aufgaben,
      quiz: s.quiz + z.quiz,
      stunden: s.stunden + z.stunden,
    }),
    { themen: 0, folgen: 0, aufgaben: 0, quiz: 0, stunden: 0 }
  );

  return {
    zeilen: liste,
    schnittFolgen: liste.length ? summe.folgen / liste.length : 0,
    schnittAufgaben: liste.length ? summe.aufgaben / liste.length : 0,
    summe,
  };
}
