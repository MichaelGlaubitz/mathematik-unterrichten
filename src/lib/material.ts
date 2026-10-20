/**
 * Interaktive Materialien, die über eduki erhältlich sind (Seite /material).
 *
 * Anders als die übrigen Inhalte stehen sie nicht unter CC BY-SA. Solange ein Material
 * noch nicht freigeschaltet ist, bleibt `eduki` leer; die Seite zeigt dann „erscheint in Kürze“.
 * `themen` verknüpft ein Material mit den Themen- und Stundenseiten (Slug des Themas).
 */
export type Material = {
  id: string;
  reihe: 'Echter Fall' | 'KLAR-Diagnose' | 'Üben';
  titel: string;
  klasse: string;
  thema: string;
  kurz: string;
  merkmale: string[];
  preis: string;
  eduki: string | null;
  trailer?: string;
  themen: string[];
};

export const materialien: Material[] = [
  {
    id: 'schwerelos',
    reihe: 'Echter Fall',
    titel: 'Schwerelos',
    klasse: 'Klasse 9',
    thema: 'Scheitelpunktform',
    kurz: 'DLR und ESA fliegen Parabeln, um 22 Sekunden Schwerelosigkeit zu erzeugen. Die Klasse plant die Flugbahn mit der Scheitelpunktform – bis zur Mars-Parabel.',
    merkmale: ['4 Kapitel mit belegten Flugdaten', 'Der Flug ist die Probe', 'Erzählerstimme, abschaltbar'],
    preis: '3,99 €',
    eduki: null,
    trailer: '/material/schwerelos-trailer.mp4',
    themen: ['quadratische-funktionen'],
  },
  {
    id: 'spur-im-acker',
    reihe: 'Echter Fall',
    titel: 'Die Spur im Acker',
    klasse: 'Klasse 9',
    thema: 'Scheitelpunktform',
    kurz: 'Ein Auto fliegt nachts über eine Böschung, der Fahrer sagt: „Höchstens 50.“ Wie Unfallgutachter rekonstruiert die Klasse aus den Spuren die Mindestgeschwindigkeit.',
    merkmale: ['Vorgehen wie in der Unfallanalyse', 'Vier Aussagen an Messwerten prüfen', 'Erzählerstimme, abschaltbar'],
    preis: '3,99 €',
    eduki: null,
    trailer: '/material/spur-im-acker-trailer.mp4',
    themen: ['quadratische-funktionen'],
  },
  {
    id: 'mann-aus-dem-eis',
    reihe: 'Echter Fall',
    titel: 'Der Mann aus dem Eis',
    klasse: 'Klasse 10',
    thema: 'Exponentialfunktionen',
    kurz: 'Mit den Messwerten aus Zürich und Oxford bestimmt die Klasse das Alter des Mannes aus dem Eis – und erlebt, warum die einfache Zerfallsrechnung ihn 500 Jahre zu jung macht.',
    merkmale: ['Halbwertszeit, Gleichung, Logarithmus', 'Echte Messdaten mit Quellen', 'Die Eichkurve als Grenze des Modells'],
    preis: '3,99 €',
    eduki: null,
    themen: ['exponentialfunktionen', 'logarithmen'],
  },
  {
    id: 'was-ist-das-ganze',
    reihe: 'KLAR-Diagnose',
    titel: 'Was ist das Ganze?',
    klasse: 'Klasse 7',
    thema: 'Prozentrechnung',
    kurz: 'Eine Stunde nach dem KLAR-Konzept: acht Diagnosefragen, drei echte Angebote am Prozentstreifen, zwei Lösungen im Vergleich, drei Exit-Aufgaben.',
    merkmale: ['Jede falsche Antwort ein Denkfehler', 'Zwischencode nach der Diagnose', 'Antworten je Frage in der Klassenübersicht'],
    preis: '4,99 €',
    eduki: null,
    themen: ['prozentrechnung'],
  },
  {
    id: 'diagnose-check-brueche',
    reihe: 'KLAR-Diagnose',
    titel: 'Diagnose-Check Brüche',
    klasse: 'Klasse 6',
    thema: 'Bruchrechnung',
    kurz: 'Zehn Fragen in zehn Minuten. Jede falsche Antwort verrät einen Denkfehler; die Klasse bekommt die Auflösung, die Lehrkraft die Übersicht mit Gegenmitteln.',
    merkmale: ['19 Denkfehler erkannt und erklärt', 'Auflösung für jedes Kind', 'Auch als Eingangsdiagnose in Klasse 7'],
    preis: 'kostenlos',
    eduki: null,
    themen: ['bruchrechnung'],
  },
  {
    id: 'uebungswerkstatt',
    reihe: 'Üben',
    titel: 'Die Übungswerkstatt',
    klasse: 'Klasse 9',
    thema: 'Scheitelpunktform',
    kurz: 'Fünf Stationen nach Craig Barton, eine Änderung pro Aufgabe: erst vermuten, dann rechnen, dann am Graphen prüfen. Danach gemischtes Training und Quiz.',
    merkmale: ['Variation Theory in fünf Ketten', 'Training mit neuen Zahlen je Runde', 'Passt vor „Schwerelos“ und „Die Spur im Acker“'],
    preis: '2,99 €',
    eduki: null,
    themen: ['quadratische-funktionen'],
  },
];

/** Gleiche Schreibweise wie die Themen-Slugs der Seite (ä → ae usw.). */
export function themaSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const materialZuThema = (slug: string) => materialien.filter((m) => m.themen.includes(slug));
