/**
 * Registry aller Übungsgeneratoren unter `/uebung/<slug>`.
 *
 * Die 23 Seiten unter `src/pages/uebung/` sind bis auf Titel und Beschreibung
 * identisch – sie reichen nur eine `variant` an `MassenuebungGeo` weiter. Diese
 * Datei ist die einzige Quelle für Titel und Beschreibung; Seite, Suchindex und
 * Sitemap lesen alle hier. Vorher stand der Text nur in der jeweiligen Seite,
 * und die Volltextsuche kannte die 23 Generatoren überhaupt nicht.
 *
 * `slug` ist zugleich der Themen-Slug: `/uebung/pythagoras` gehört zu
 * `/themen#thema-pythagoras`. Klassenstufe und Thementitel kommen deshalb aus
 * der Themen-Collection und werden hier nicht doppelt gepflegt.
 */

export interface Uebungsgenerator {
  /** Dateiname unter src/pages/uebung/ – zugleich Themen-Slug. */
  slug: string;
  /** Seitentitel und Überschrift, z. B. „WB Pythagoras“. */
  titel: string;
  /** Ein Satz: Was erzeugt der Generator? */
  beschreibung: string;
}

export const uebungsgeneratoren: Uebungsgenerator[] = [
  {
    slug: 'algebra',
    titel: 'WB Algebra',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu Termen und Klammern (Distributivgesetz, gestuftes Ausmultiplizieren, ausklammern, zusammenfassen) – optional mit Flächenmodell – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'binomische-formeln',
    titel: 'WB Binomische Formeln',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu binomischen Formeln (ausmultiplizieren, faktorisieren, Vorzeichen sicher anwenden) – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'bruch-dezimal-prozent',
    titel: 'WB Bruch · Dezimal · Prozent',
    beschreibung:
      'Umwandlung zwischen Brüchen, Dezimalzahlen und Prozentangaben – Auswahl wie auf der Themenseite, Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'bruchgleichungen',
    titel: 'WB Bruchgleichungen',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu Bruchgleichungen (Definitionsmenge, Hauptnenner, Kreuzprodukt) – Anzahl wählbar, Whiteboard- oder Arbeitsblatt-Modus.',
  },
  {
    slug: 'bruchrechnung',
    titel: 'WB Bruchrechnung',
    beschreibung:
      'Zufallsgenerierte Aufgaben zur Bruchrechnung: Grundrechenarten (gleich- und ungleichnamig, Multiplikation, Division), Brüche mit ganzen Zahlen, Umgang mit Brüchen (u. a. gleichwertig, Ergänzen auf 1, gemischt/unecht, Vergleich) und einfache Sachaufgaben zu Bruchteilen – optional mit Streifen- und Rastergrafiken, Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'dezimalzahlen',
    titel: 'WB Dezimalzahlen',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu Dezimalzahlen (Addition, Subtraktion, Multiplikation, Division) mit Stichwort-Auswahl von der Themenseite – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'exponentialfunktionen',
    titel: 'WB Exponentialfunktionen',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu Exponentialfunktionen (Wachstum, Zerfall, Parameter, Faktor, Verdopplung/Halbierung, einfache Gleichungen) – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'graphen',
    titel: 'WB Graphen',
    beschreibung:
      'Zufallsgenerierte Aufgaben zum Ausfüllen von Wertetabellen und Zeichnen von linearen, quadratischen und kubischen Funktionsgraphen.',
  },
  {
    slug: 'kreisgeometrie',
    titel: 'WB Kreisgeometrie',
    beschreibung:
      'Zufallsgenerierte Aufgaben zur Kreisgeometrie (Radius, Durchmesser, Umfang, Fläche, Sektor, Tangente) – Anzahl wählbar, Whiteboard- oder Arbeitsblatt-Modus.',
  },
  {
    slug: 'lineare-funktionen',
    titel: 'WB Lineare Funktionen',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu linearen Funktionen (Steigung, Achsenabschnitt, Nullstelle, Funktionswert) mit optionalen Diagrammen – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'lineare-gleichungen',
    titel: 'WB Lineare Gleichungen',
    beschreibung:
      'Zufallsgenerierte lineare Gleichungen im Barton-Workflow (Grundmuster, strukturierte Variation, klare Integer-Constraints) – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'lineare-gleichungssysteme',
    titel: 'WB Lineare Gleichungssysteme',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu linearen Gleichungssystemen (Addieren, Einsetzen, Gleichsetzen, Spezialfälle) – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'logarithmen',
    titel: 'WB Logarithmen',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu Logarithmen (Umkehrung, Regeln, Basiswechsel, einfache Logarithmusgleichungen) – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'negative-zahlen',
    titel: 'WB Negative Zahlen',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu ganzen Zahlen und Vorzeichen (±·, Klammern, Punkt vor Strich) mit optionalen Zahlenstrahl-Grafiken (Aufgabe ohne Marken, Lösung mit Sprung bzw. A/B; Standardzoom 200 %) – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'prozentrechnung',
    titel: 'WB Prozentrechnung',
    beschreibung:
      'Zufallsgenerierte Aufgaben zur Prozentrechnung (Grundwert, Prozentwert, Prozentsatz, Vermehrungsfaktor, Vorwärts- und Rückwärtsrechnen) – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'pythagoras',
    titel: 'WB Pythagoras',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu Pythagoras (Satz, Katheten, Abstände, Sachkontext) – Anzahl wählbar, Whiteboard- oder Arbeitsblatt-Modus.',
  },
  {
    slug: 'quadratische-funktionen',
    titel: 'WB Quadratische Funktionen',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu Parabeln (Scheitel, Nullstellen, Symmetrieachse) – Anzahl wählbar, Whiteboard- oder Arbeitsblatt-Modus.',
  },
  {
    slug: 'quadratische-gleichungen',
    titel: 'WB Quadratische Gleichungen',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu quadratischen Gleichungen (Nullprodukt, Faktorisieren, Lösungsanzahl) – Anzahl wählbar, Whiteboard- oder Arbeitsblatt-Modus.',
  },
  {
    slug: 'stochastik',
    titel: 'WB Stochastik',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu Daten und Zufall (Mittelwert, Median, Ausreißer, einfache Wahrscheinlichkeiten, Komplementregel) – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'strahlensaetze',
    titel: 'WB Strahlensätze',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu Strahlensätzen (V- und X-Figur, Schatten, Spiegel) – Anzahl wählbar, Whiteboard- oder Arbeitsblatt-Modus.',
  },
  {
    slug: 'termumformungen',
    titel: 'WB Termumformungen',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu Termumformungen bei Bruchtermen (kürzen, Definitionsmenge, Hauptnenner, Addition, Multiplikation) – Whiteboard oder Arbeitsblatt.',
  },
  {
    slug: 'trigonometrie',
    titel: 'WB Trigonometrie',
    beschreibung:
      'Zufallsgenerierte Aufgaben zu Sinus, Kosinus und Tangens im rechtwinkligen Dreieck – Anzahl wählbar, Whiteboard- oder Arbeitsblatt-Modus.',
  },
  {
    slug: 'wurzelrechnung',
    titel: 'WB Wurzelrechnung',
    beschreibung:
      'Zufallsgenerierte Aufgaben zur Wurzelrechnung (Vereinfachen, Fehlvorstellungen, Gleichungen) – Anzahl wählbar, Whiteboard- oder Arbeitsblatt-Modus.',
  },
];

/** Nachschlagen per Slug – wirft bewusst, damit ein Tippfehler den Build stoppt. */
export function uebungsgenerator(slug: string): Uebungsgenerator {
  const treffer = uebungsgeneratoren.find((u) => u.slug === slug);
  if (!treffer) throw new Error(`Kein Übungsgenerator mit dem Slug „${slug}“ in src/lib/uebungsgeneratoren.ts.`);
  return treffer;
}

/** Adresse der Seite. */
export function uebungPfad(u: Uebungsgenerator): string {
  return `/uebung/${u.slug}`;
}
