/**
 * Liest aus einer Aufgabenfolge die Variationsfolgen heraus, die sich
 * projizieren lassen.
 *
 * Hintergrund: Reflect–Expect–Check–Explain lebt vom Vergleich mit der
 * *vorherigen* Aufgabe. Das setzt eine Folge voraus, in der sich von Zeile zu
 * Zeile möglichst wenig ändert – genau so sind die Aufgabenfolgen geschrieben
 * („Sieh genau hin: Was variiert von Zeile zu Zeile, was nicht?").
 *
 * Genommen wird nur, was eindeutig ist: eine Tabelle mit genau drei Spalten,
 * deren erste eine laufende Nummer trägt. Tabellen mit Zwischenspalten
 * („Lösungsidee", „Hauptnenner") oder mehreren Darstellungen nebeneinander
 * („Bruch | Dezimalzahl | Prozent") bleiben außen vor: Dort ließe sich nur
 * raten, was an die Wand gehört und was die Lösung ist. `uebersprungen` sagt,
 * welche das sind – geraten wird nicht.
 */

export interface Variationsaufgabe {
  /** Laufende Nummer, wie sie in der Aufgabenfolge steht. */
  nummer: number;
  frage: string;
  loesung: string;
}

export interface Variationsfolge {
  /** Überschrift des Abschnitts, z. B. „Folge A: Ausmultiplizieren". */
  titel: string;
  /** Der Absatz zwischen Überschrift und Tabelle, falls vorhanden. */
  hinweis: string;
  aufgaben: Variationsaufgabe[];
}

export interface Uebersprungen {
  titel: string;
  kopf: string[];
  zeilen: number;
  grund: string;
}

export interface Folgenfund {
  folgen: Variationsfolge[];
  uebersprungen: Uebersprungen[];
}

/** Trennt eine Markdown-Tabellenzeile in ihre Zellen. */
function zellen(zeile: string): string[] {
  return zeile.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((z) => z.trim());
}

const IST_TRENNZEILE = /^\|[\s:|-]+\|$/;

export function leseVariationsfolgen(markdown: string): Folgenfund {
  // Frontmatter weg – dort stehen keine Aufgaben.
  const koerper = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');

  const folgen: Variationsfolge[] = [];
  const uebersprungen: Uebersprungen[] = [];

  let titel = '';
  let hinweis = '';
  let tabelle: string[] = [];

  const abschliessen = () => {
    if (tabelle.length >= 3) {
      const kopf = zellen(tabelle[0]);
      const daten = tabelle.slice(2).filter((z) => /^\|\s*\d+\s*\|/.test(z));
      if (kopf.length !== 3) {
        uebersprungen.push({ titel, kopf, zeilen: daten.length, grund: `${kopf.length} Spalten statt 3` });
      } else if (daten.length < 2) {
        // Eine einzelne Zeile ist keine Folge: Es gäbe nichts zu vergleichen.
        uebersprungen.push({ titel, kopf, zeilen: daten.length, grund: 'weniger als zwei Aufgaben' });
      } else {
        folgen.push({
          titel,
          hinweis,
          aufgaben: daten.map((z) => {
            const [nr, frage, loesung] = zellen(z);
            return { nummer: Number(nr), frage, loesung };
          }),
        });
      }
    }
    tabelle = [];
  };

  for (const zeile of koerper.split('\n')) {
    if (/^#{2,3}\s/.test(zeile)) {
      abschliessen();
      titel = zeile.replace(/^#{2,3}\s*/, '').trim();
      hinweis = '';
      continue;
    }
    if (/^\|/.test(zeile.trim())) {
      if (tabelle.length === 1 && !IST_TRENNZEILE.test(zeile.trim())) {
        // Kopf ohne Trennzeile: keine Tabelle, sondern Fließtext mit Strichen.
        tabelle = [];
        continue;
      }
      tabelle.push(zeile.trim());
      continue;
    }
    if (tabelle.length) abschliessen();
    if (zeile.trim() && !hinweis) hinweis = zeile.trim();
  }
  abschliessen();

  return { folgen, uebersprungen };
}

/** Die vier Schritte. Sie sind bewusst für jede Aufgabe gleich – die
 *  Besonderheit steckt in der Variation, nicht im Arbeitsauftrag. */
export const SCHRITTE = [
  {
    marke: 'Reflect',
    titel: 'Vergleiche mit der Aufgabe davor',
    punkte: ['Was hat sich geändert?', 'Was ist gleich geblieben?'],
  },
  {
    marke: 'Expect',
    titel: 'Was erwartest du – bevor du rechnest?',
    punkte: [
      'Wird das Ergebnis größer, kleiner oder bleibt es gleich?',
      'Erwartest du einen bestimmten Wert?',
      'Wird das Ergebnis anders aussehen?',
      'Ändert sich der Rechenweg?',
      'Keine Erwartung? Kein Problem – gleich kommt die nächste Gelegenheit.',
    ],
  },
  {
    marke: 'Check',
    titel: 'Prüfe deine Erwartung mit dem Verfahren, das du gelernt hast',
    punkte: [],
  },
  {
    marke: 'Explain',
    titel: 'Denke über dein Ergebnis nach',
    punkte: [
      'Keine Erwartung gehabt? Kannst du den Zusammenhang jetzt erklären?',
      'Überrascht? Kannst du jetzt sagen, warum?',
      'Nicht überrascht? Wie erklärst du es jemandem, der es noch nicht verstanden hat?',
    ],
  },
] as const;

/**
 * Die Partnerphase nach der Einzelarbeit.
 *
 * Craig Barton lässt zuerst allein arbeiten und stellt danach diese Impulse
 * für die Partnerarbeit bereit. Wichtig ist die Überschrift: Es wird *eine*
 * Frage ausgesucht, nicht die Liste abgearbeitet. Wer alle zwölf durchgeht,
 * hat aus dem Gespräch ein Formular gemacht.
 */
export const PARTNER_UEBERSCHRIFT = 'Sucht euch eine Frage aus, die ihr zu zweit besprecht';

export const SCHRITTE_PARTNER = [
  {
    marke: 'Reflect',
    punkte: ['Ist euch beiden dasselbe aufgefallen, was sich geändert hat?'],
  },
  {
    marke: 'Expect',
    punkte: [
      'Sind eure Erwartungen gleich?',
      'Versteht ihr den Gedankengang des anderen?',
      'Könnt ihr zu zweit auf mehr als eine Art erklären, wie ihr zu eurer Erwartung gekommen seid? Mit einer Skizze? Mit einer Rechnung?',
    ],
  },
  {
    marke: 'Check',
    punkte: [
      'Habt ihr auf demselben Weg geprüft?',
      'Hat einer von euch sich vertan?',
    ],
  },
  {
    marke: 'Explain',
    punkte: [
      'Wenn einer von euch den Zusammenhang noch nicht sieht: Kann der andere helfen?',
      'Wenn ihr ihn beide seht: Könnt ihr vorhersagen, welche Erwartungen eure Mitschüler bilden werden?',
      'Könnt ihr eure Erklärung an einem selbst gewählten Beispiel prüfen?',
    ],
  },
] as const;

/**
 * Die Plenumsphase, nachdem allein und zu zweit gearbeitet wurde.
 *
 * Zwei Dinge daran sind Absicht und keine Auslassung:
 *
 * 1. Es gibt kein *Check*. Geprüft wurde schon – im Plenum geht es um den
 *    Zusammenhang, nicht um das Ergebnis.
 * 2. Reflect fragt hier nicht nur, *was* sich geändert hat, sondern *warum*
 *    diese Änderung gerade so wirkt. Das ist der Schritt von der Beobachtung
 *    zur Begründung.
 */
export const PLENUM_UEBERSCHRIFT = 'Im Plenum: zu diesem einen Zusammenhang';

export const SCHRITTE_PLENUM = [
  {
    marke: 'Reflect',
    punkte: [
      'Wie verhält sich diese Aufgabe zur vorherigen – was ist gleich, was ist anders?',
      'Warum wirkt sich diese Änderung gerade so auf das Ergebnis aus?',
    ],
  },
  {
    marke: 'Expect',
    punkte: ['Hat jemand etwas anderes erwartet – und kann sagen, warum?'],
  },
  {
    marke: 'Explain',
    punkte: ['Kann jemand auf zwei verschiedene Arten erklären, warum das Ergebnis so ist?'],
  },
] as const;

/**
 * Zum Schluss der Folge – nicht zu einer einzelnen Aufgabe, sondern zur
 * ganzen Reihe. Deshalb steht das hier erst, wenn die letzte Aufgabe
 * durchlaufen ist.
 */
export const TIEFER_UEBERSCHRIFT = 'Zum Schluss: tiefer bohren';

export const TIEFER = [
  'Welche zwei Ergebnisse haben euch am meisten überrascht – und warum?',
  'Erklärt diesen Zusammenhang auf zwei Arten jemandem, der ihn noch nicht versteht.',
  'Stellt mir zwei Fragen zu dieser Folge.',
  'Setzt die Folge mit zwei eigenen Aufgaben fort.',
  'Denkt euch zwei Vermutungen aus und prüft sie an eigenen Beispielen.',
] as const;
