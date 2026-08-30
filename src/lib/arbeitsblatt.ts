/**
 * Macht aus einer Aufgabenfolge ein Arbeitsblatt und ein Lösungsblatt.
 *
 * Anders als die Projektionsfolie nimmt das Blatt *alle* Tabellen einer Folge,
 * auch die mehrspaltigen. Auf Papier ist das kein Problem: Eine Tabelle mit
 * fünf Spalten lässt sich drucken, sie lässt sich nur nicht als *eine* Frage
 * an die Wand werfen.
 *
 * Die einzige Entscheidung, die dabei zu treffen ist: Welche Spalten stehen
 * schon da, und welche füllt die Klasse aus? Geraten wird das nicht. Die
 * Regel ist: Nach der Nummer ist die erste Spalte gegeben, der Rest wird
 * ausgefüllt. Wo das nicht stimmt, steht die Kopfzeile in `MEHR_GEGEBEN` –
 * jede dieser Ausnahmen ist an den echten Zeilen des Bestands geprüft.
 */

export interface BlattZeile {
  /** Laufende Nummer, wie sie in der Aufgabenfolge steht. */
  nummer: string;
  /** Was schon dasteht. */
  gegeben: string[];
  /** Was die Klasse einträgt – auf dem Lösungsblatt ausgefüllt. */
  gesucht: string[];
}

export interface BlattTabelle {
  /** Kopfzeile ohne die Nummernspalte. */
  kopf: string[];
  /** Wie viele Spalten nach der Nummer gegeben sind. */
  gegebenBis: number;
  zeilen: BlattZeile[];
}

/**
 * Ein Stück eines Abschnitts – in der Reihenfolge, in der es in der Datei
 * steht. Das ist keine Förmlichkeit: Die Frage „Frage nach Nr. 6“ bezieht
 * sich auf die Tabelle *darüber*. Wer Absätze und Tabellen getrennt sammelt
 * und hintereinander ausgibt, stellt sie davor – und sie ergibt keinen Sinn
 * mehr.
 */
export type BlattTeil =
  | { art: 'absatz'; text: string }
  | { art: 'tabelle'; tabelle: BlattTabelle };

export interface BlattAbschnitt {
  /** Überschrift des Abschnitts, z. B. „Folge A: Ausmultiplizieren“. */
  titel: string;
  teile: BlattTeil[];
}

export interface Blatt {
  vorbemerkung: string[];
  abschnitte: BlattAbschnitt[];
  reflexionsfragen: string[];
  /** Wie viele Aufgaben insgesamt auf dem Blatt stehen. */
  anzahl: number;
}

/**
 * Kopfzeilen, bei denen mehr als eine Spalte gegeben ist.
 *
 * Schlüssel ist die Kopfzeile ohne „Nr.“, verbunden mit „ | “. Der Wert sagt,
 * wie viele Spalten danach schon ausgefüllt sind. Jeder Eintrag stammt aus
 * einem Blick in die Zeilen selbst, nicht aus dem Klang der Überschrift:
 *
 * - „Gegeben | Gesucht“ – beides steht in der Aufgabe, gerechnet wird die Lösung.
 * - „x-Achse | y-Achse“ – beide Maßstäbe sind vorgegeben, gefragt ist der Graph.
 * - „Radius | Winkel“ – beide Größen sind gegeben, gesucht ist die Sektorfläche.
 * - „Punkt A | Punkt B“ – aus beiden Punkten wird Steigung und Term bestimmt.
 * - „System | Vorgeschlagene Methode“ – die Methode ist Teil der Aufgabe.
 * - „Würfe | Sechsen“ – die Zähldaten stehen da, gerechnet wird die Häufigkeit.
 * - „$a$ | $q$ | $t$“ und „$a$ | $f(t)$ | $t$“ – drei Größen gegeben, eine gesucht.
 */
export const MEHR_GEGEBEN: Readonly<Record<string, number>> = {
  'Gegeben | Gesucht | Lösung': 2,
  'x-Achse | y-Achse | Wie sieht der Graph aus?': 2,
  'Radius | Winkel | Sektorfläche': 2,
  'Punkt A | Punkt B | Steigung $m$ | y-Achsenabschnitt $b$ | Funktionsgleichung': 2,
  'System | Vorgeschlagene Methode | Lösung': 2,
  'Würfe | Sechsen | relative Häufigkeit | Abstand zu 1/6': 2,
  '$a$ | $q$ | $t$ | $f(t) = a\\cdot q^t$': 3,
  '$a$ | $f(t)$ | $t$ | Faktor q | Wachstumsrate p': 3,
};

/** Wie viele Spalten nach der Nummer schon ausgefüllt sind. */
export function gegebeneSpalten(kopf: string[]): number {
  const schluessel = kopf.join(' | ');
  const eingetragen = MEHR_GEGEBEN[schluessel];
  // Auch eine Ausnahme darf nie alle Spalten belegen – sonst bliebe nichts
  // zu tun, und das Arbeitsblatt wäre ein Lösungsblatt.
  return Math.min(eingetragen ?? 1, Math.max(kopf.length - 1, 1));
}

/**
 * Überschriften, unter denen Aufgaben stehen.
 *
 * Der Bestand kennt drei Schreibweisen: „Folge A“, „Aufgabenfolge: …“ und
 * „Die Aufgabenfolge“. Wer nur auf „Folge“ prüft, verliert sechs von
 * vierundzwanzig Dateien vollständig – lautlos.
 */
export const IST_AUFGABENTEIL = /^(Folge\b|(Die\s+)?Aufgabenfolge\b)/i;

/** Trennt eine Markdown-Tabellenzeile in ihre Zellen. Maskierte Striche
 *  („A(3 \| 2)“) gehören zur Zelle und trennen nicht. */
function zellen(zeile: string): string[] {
  return zeile
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split(/(?<!\\)\|/)
    .map((z) => z.trim());
}

const IST_TRENNZEILE = /^\|[\s:|-]+\|$/;

/** Liest ein Arbeitsblatt aus dem Markdown einer Aufgabenfolge. */
export function leseBlatt(markdown: string): Blatt {
  const koerper = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
  const zeilen = koerper.split('\n');

  const vorbemerkung: string[] = [];
  const abschnitte: BlattAbschnitt[] = [];
  const reflexionsfragen: string[] = [];

  // Welcher Teil der Datei gerade gelesen wird. Der didaktische Kommentar
  // gehört der Lehrkraft und kommt auf kein Blatt.
  let teil: 'kopf' | 'vorbemerkung' | 'folge' | 'reflexion' | 'aus' = 'kopf';
  let aktuell: BlattAbschnitt | null = null;
  let tabelle: BlattTabelle | null = null;

  const tabelleAbschliessen = () => {
    if (tabelle && aktuell && tabelle.zeilen.length > 0) {
      aktuell.teile.push({ art: 'tabelle', tabelle });
    }
    tabelle = null;
  };
  const abschnittAbschliessen = () => {
    tabelleAbschliessen();
    if (aktuell) abschnitte.push(aktuell);
    aktuell = null;
  };

  for (let i = 0; i < zeilen.length; i++) {
    const zeile = zeilen[i];
    const ueberschrift = /^## (.+)$/.exec(zeile);

    if (ueberschrift) {
      abschnittAbschliessen();
      const titel = ueberschrift[1].trim();
      if (/^Vorbemerkung/i.test(titel)) teil = 'vorbemerkung';
      else if (IST_AUFGABENTEIL.test(titel)) {
        teil = 'folge';
        aktuell = { titel, teile: [] };
      } else if (/^Reflexionsfragen/i.test(titel)) teil = 'reflexion';
      else teil = 'aus';
      continue;
    }

    if (teil === 'aus' || teil === 'kopf') continue;

    // Tabellenzeilen
    if (/^\|/.test(zeile)) {
      if (IST_TRENNZEILE.test(zeile.trim())) continue;
      const spalten = zellen(zeile);
      if (!tabelle) {
        // Erste Zeile einer Tabelle ist die Kopfzeile. Die Nummernspalte
        // fällt weg – sie ist keine Aufgabe, sondern eine Marke.
        const kopf = spalten.slice(1);
        tabelle = { kopf, gegebenBis: gegebeneSpalten(kopf), zeilen: [] };
        continue;
      }
      const rest = spalten.slice(1);
      tabelle.zeilen.push({
        nummer: spalten[0],
        gegeben: rest.slice(0, tabelle.gegebenBis),
        gesucht: rest.slice(tabelle.gegebenBis),
      });
      continue;
    }

    // Keine Tabellenzeile mehr: Eine offene Tabelle ist zu Ende.
    if (tabelle) tabelleAbschliessen();

    const text = zeile.trim();
    if (!text) continue;

    if (teil === 'vorbemerkung') vorbemerkung.push(text);
    else if (teil === 'reflexion') reflexionsfragen.push(text.replace(/^\d+\.\s*/, ''));
    else if (teil === 'folge' && aktuell) aktuell.teile.push({ art: 'absatz', text });
  }
  abschnittAbschliessen();

  const anzahl = abschnitte.reduce(
    (n, a) => n + a.teile.reduce((m, s) => m + (s.art === 'tabelle' ? s.tabelle.zeilen.length : 0), 0),
    0
  );
  return { vorbemerkung, abschnitte, reflexionsfragen, anzahl };
}

/** Alle Tabellen eines Blatts, quer über die Abschnitte. */
export function tabellen(blatt: Blatt): BlattTabelle[] {
  return blatt.abschnitte.flatMap((a) =>
    a.teile.flatMap((s) => (s.art === 'tabelle' ? [s.tabelle] : []))
  );
}
