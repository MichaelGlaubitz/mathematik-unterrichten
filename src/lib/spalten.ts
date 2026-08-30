/**
 * Welche Spalte einer Aufgabentabelle schon dasteht und welche die Klasse
 * ausfüllt.
 *
 * Diese Entscheidung brauchen zwei Stellen: das Arbeitsblatt (was bleibt
 * leer?) und die Projektionsfolie (was ist die Frage, was die Lösung?).
 * Sie steht deshalb hier und nicht in einer der beiden.
 */

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
