/**
 * Gegenmittel zu den häufigsten Fehlvorstellungen.
 *
 * Der Katalog auf /fehlvorstellungen zieht die Fehlvorstellungen selbst aus den
 * Themendateien (`src/content/themen/*.json`). Hier stehen die ausgearbeiteten
 * Gegenmittel zu denen, die im Unterricht am teuersten sind: je drei Schritte,
 * die in einer Stunde gehen, plus das passende Werkzeug.
 *
 * Zuordnung über `thema` und einen Textausschnitt (`treffer`), der in der
 * Fehlvorstellung vorkommen muss – so bleibt die Verknüpfung stabil, auch wenn
 * sich die Reihenfolge in der JSON-Datei ändert.
 */

export interface Gegenmittel {
  /** Muss dem Feld `thema` in src/content/themen/*.json entsprechen. */
  thema: string;
  /** Kleingeschriebener Textausschnitt, der in der Fehlvorstellung vorkommt. */
  treffer: string;
  /** Wie die Fehlvorstellung im Kopf der Lernenden entstanden ist. */
  ursache: string;
  /** Drei Schritte, die in einer Stunde gehen. */
  schritte: [string, string, string];
  /** Optional: Werkzeug, das den entscheidenden Schritt sichtbar macht. */
  werkzeug?: { text: string; href: string };
}

export const gegenmittel: Gegenmittel[] = [
  {
    thema: 'Bruchrechnung',
    treffer: 'zähler und nenner',
    ursache:
      'Übertragung einer Regel, die bei der Multiplikation tatsächlich funktioniert, auf die Addition. Die Zahl wird als Paar von zwei natürlichen Zahlen gelesen, nicht als eine Größe.',
    schritte: [
      'Am Streifenbild zeigen: 1/2 + 1/2. Wer Zähler und Nenner addiert, erhält 2/4 – und sieht am Bild sofort, dass das ein halber Streifen wäre statt eines ganzen.',
      'Die Frage stellen: „Wie breit ist ein Feld hier, wie breit dort?“ Erst wenn die Felder gleich breit sind, darf man sie zusammenzählen.',
      'Erst danach das Verfahren mit dem Hauptnenner einführen – jetzt ist es keine Regel mehr, sondern die Antwort auf ein Problem.',
    ],
    werkzeug: { text: 'Bruchstreifen', href: '/werkzeuge/bruchstreifen.html' },
  },
  {
    thema: 'Dezimalzahlen',
    treffer: 'stellenwerte',
    ursache:
      'Die Regel „längere Zahl = größere Zahl“ stimmt bei natürlichen Zahlen fünf Jahre lang. Sie wird auf Dezimalzahlen übertragen, ohne dass jemand widerspricht.',
    schritte: [
      'Drei Zahlen an die Tafel: 0,7 · 0,25 · 0,45. Die Klasse ordnet – schriftlich, jede Person für sich.',
      'Die drei Zahlen auf dem Zahlenstrahl eintragen. Der Widerspruch zur eigenen Antwort erledigt die Diskussion.',
      'Stellenwerttafel danebenlegen: 7 Zehntel gegen 2 Zehntel. Die erste Stelle nach dem Komma entscheidet zuerst.',
    ],
    werkzeug: { text: 'Zahlenstrahl & Stellenwert', href: '/werkzeuge/zahlenstrahl.html' },
  },
  {
    thema: 'Negative Zahlen',
    treffer: 'minus',
    ursache:
      'Das Minuszeichen hat drei Bedeutungen (Vorzeichen, Rechenzeichen, Gegenzahl-Operator), die alle gleich aussehen. Ohne Trennung der drei Rollen bleibt jede Regel Glückssache.',
    schritte: [
      'Die drei Bedeutungen an einem Beispiel auseinanderziehen: −5, 3 − 5, −(−5). Jede Bedeutung bekommt eine eigene Farbe an der Tafel.',
      'Am Zahlenstrahl arbeiten: „Rechnen“ heißt gehen, „Vorzeichen“ heißt Startpunkt, „Gegenzahl“ heißt umdrehen.',
      'Variationsreihe rechnen lassen: 5 − 3, 5 − 4, 5 − 5, 5 − 6, 5 − 7. Die Klasse setzt fort, bevor sie eine Regel hört.',
    ],
    werkzeug: { text: 'Zahlenstrahl & Stellenwert', href: '/werkzeuge/zahlenstrahl.html' },
  },
  {
    thema: 'Prozentrechnung',
    treffer: 'prozent',
    ursache:
      'Prozentangaben werden als absolute Zahlen behandelt. Dass 20 % je nach Grundwert etwas völlig anderes sind, ist die eigentliche Hürde – nicht der Dreisatz.',
    schritte: [
      'Zwei Aufgaben nebeneinander: 20 % von 50 € und 20 % von 500 €. Gleicher Prozentsatz, ganz andere Zahl.',
      'Immer zuerst nach dem Grundwert fragen: „100 % – wovon?“ Diese Frage vor jede Rechnung setzen, auch wenn sie trivial wirkt.',
      'Bei Zu- und Abnahme konsequent mit dem Vermehrungsfaktor arbeiten (1,20 statt „+20 %“) – dann bricht auch die zweite große Fehlvorstellung weg, dass +20 % und −20 % sich aufheben.',
    ],
    werkzeug: { text: 'Kopfrechen-Sprint (Prozentrechnung)', href: '/werkzeuge/kopfrechen-sprint.html' },
  },
  {
    thema: 'Pythagoras',
    treffer: 'hypotenuse',
    ursache:
      'Die Formel wird als Zeichenkette gelernt, nicht als Aussage über eine Figur. Wer nicht sicher erkennt, welche Seite die Hypotenuse ist, wendet sie mechanisch falsch an.',
    schritte: [
      'Dieselbe Figur in vier Lagen zeigen (gedreht, gespiegelt). Nur eine Frage: Welche Seite ist die Hypotenuse?',
      'Erst wenn das sitzt, die Formel – und zwar in der Form „Quadrat über der langen Seite = Summe der beiden anderen Quadrate“.',
      'Gegenbeispiel rechnen lassen: ein stumpfwinkliges Dreieck mit 5, 6, 10. Die Formel liefert Unsinn – warum?',
    ],
    werkzeug: { text: 'Thema Pythagoras üben', href: '/uebung/pythagoras' },
  },
  {
    thema: 'Lineare Funktionen',
    treffer: 'steigung',
    ursache:
      'Die Steigung wird als „wie schräg der Graph aussieht“ gelesen statt als Verhältnis zweier Änderungen. Damit hängt der Wert plötzlich von der Achsenskalierung ab.',
    schritte: [
      'Denselben Graphen zweimal zeichnen, einmal mit gestauchter y-Achse. Sieht anders aus, ist dieselbe Funktion.',
      'Steigungsdreieck immer mit beschrifteten Kathetenlängen zeichnen und laut sprechen: „ein nach rechts, zwei nach oben“.',
      'Am Schieberegler variieren lassen: erst nur m ändern, dann nur b. Die Klasse sagt vorher, was passieren wird.',
    ],
    werkzeug: { text: 'Funktionenplotter', href: '/werkzeuge/funktionenplotter.html' },
  },
  {
    thema: 'Quadratische Funktionen',
    treffer: 'scheitel',
    ursache:
      'In f(x) = (x − d)² + e steht ein Minus, die Verschiebung geht aber nach rechts. Dieses Vorzeichenparadox ist die Ursache für die meisten Fehler bei der Scheitelform.',
    schritte: [
      'Wertetabelle für f(x) = (x − 3)² aufstellen und fragen: Für welches x wird die Klammer null? Genau dort liegt der Scheitel.',
      'Am Schieberegler d von −3 bis 3 ziehen und die Klasse vorher sagen lassen, wohin die Parabel wandert.',
      'Die Sprechweise festlegen: „Der Scheitel liegt dort, wo die Klammer null wird“ – das ist tragfähiger als jede Vorzeichenregel.',
    ],
    werkzeug: { text: 'Funktionenplotter (Scheitelform)', href: '/werkzeuge/funktionenplotter.html' },
  },
  {
    thema: 'Algebra',
    treffer: 'vor einer klammer verschwindet das minus',
    ursache:
      'Beim Auflösen einer Klammer nach einem Minuszeichen wird das Vorzeichen nur auf den ersten Summanden angewendet. Der Fehler ist so verbreitet, weil er in 50 % der Fälle unbemerkt bleibt.',
    schritte: [
      'Zwei Rechnungen nebeneinander: 10 − (3 + 4) und 10 − 3 + 4. Beide ausrechnen lassen, dann vergleichen.',
      'Das Minus als „−1 ·“ schreiben und ausmultiplizieren. Aus einer Vorzeichenregel wird das Distributivgesetz.',
      'Zur Kontrolle immer eine Zahl einsetzen: Wer x = 2 in Term und Ergebnis einsetzt, findet den Fehler selbst.',
    ],
    werkzeug: { text: 'Kopfrechen-Sprint (Terme)', href: '/werkzeuge/kopfrechen-sprint.html' },
  },
  {
    thema: 'Binomische Formeln',
    treffer: '(a+b)^2',
    ursache:
      'Die Vorstellung, dass sich Potenzen wie Multiplikationen über die Summe verteilen. Das ist der „Freshman’s Dream“ – und er verschwindet nicht durch Wiederholung der Formel.',
    schritte: [
      'Mit Zahlen widerlegen: (3 + 4)² = 49, aber 3² + 4² = 25. Die Klasse rechnet beides selbst.',
      'Flächenbild zeichnen: Quadrat der Seitenlänge a + b, aufgeteilt in vier Teilflächen. Die beiden Rechtecke sind das fehlende 2ab.',
      'Erst danach die Formel notieren – als Beschreibung des Bildes, nicht als Merksatz.',
    ],
    werkzeug: { text: 'Binomische Formeln üben', href: '/uebung/binomische-formeln' },
  },
  {
    thema: 'Wurzelrechnung',
    treffer: 'sqrt{a+b}',
    ursache:
      'Wieder die Verteilungsvorstellung: Was bei Produkten erlaubt ist (√(a·b) = √a·√b), wird auf Summen übertragen.',
    schritte: [
      'Mit Zahlen prüfen: √(9 + 16) = 5, aber √9 + √16 = 7. Erst rechnen lassen, dann reden.',
      'Gegenüberstellen, wo es <em>doch</em> geht: √(9 · 16) = 12 = √9 · √16. Der Unterschied liegt im Rechenzeichen unter der Wurzel.',
      'Die Klasse formuliert die Regel und die Ausnahme selbst und schreibt beide zusammen ins Heft.',
    ],
  },
  {
    thema: 'Stochastik',
    treffer: 'wahrscheinlich',
    ursache:
      'Die Erwartung, dass sich Zufall „ausgleicht“ – nach fünfmal Kopf sei Zahl fälliger. Die Münze hat kein Gedächtnis, die Intuition schon.',
    schritte: [
      'Vor der Simulation abstimmen lassen: Nach fünfmal Kopf – ist Zahl jetzt wahrscheinlicher? Die Verteilung der Antworten notieren.',
      '10 000 Würfe simulieren und die relative Häufigkeit gegen die Versuchszahl zeigen: Sie nähert sich an, ohne dass etwas „ausgeglichen“ wird.',
      'Die entscheidende Nachfrage stellen: Wird die <em>absolute</em> Abweichung kleiner? (Nein.) Nur der Anteil wird stabil.',
    ],
    werkzeug: { text: 'Zufallsexperimente', href: '/werkzeuge/zufallsexperimente.html' },
  },
  {
    thema: 'Lineare Gleichungen',
    treffer: 'seite',
    ursache:
      'Das Gleichheitszeichen wird als „hier kommt das Ergebnis“ gelesen, wie auf dem Taschenrechner – nicht als Aussage über zwei gleich große Werte.',
    schritte: [
      'Waage zeichnen und dieselbe Gleichung als Gleichgewicht darstellen. Was links wegkommt, muss rechts auch weg.',
      'Absichtlich eine Gleichung mit dem x rechts stellen (12 = 3x). Wer das Gleichheitszeichen richtig liest, hat kein Problem damit.',
      'Bei jeder Umformung den Schritt an den Rand schreiben (| −3) und laut sprechen: „auf beiden Seiten“.',
    ],
    werkzeug: { text: 'Lineare Gleichungen üben', href: '/uebung/lineare-gleichungen' },
  },
  {
    thema: 'Trigonometrie',
    treffer: 'ankathete',
    ursache:
      'Ankathete und Gegenkathete werden fest an Seiten geknüpft statt an den betrachteten Winkel. Sobald der Winkel wechselt, kippen die Bezeichnungen – aber im Kopf nicht mit.',
    schritte: [
      'Ein Dreieck, zwei Winkel: Für α und für β nacheinander bestimmen lassen, welche Seite jeweils Gegenkathete ist.',
      'Die Regel als Frage formulieren, nicht als Zuordnung: „Liegt die Seite dem Winkel gegenüber oder an ihm an?“',
      'Erst danach sin/cos/tan – und immer mit dem Winkel im Kopf, nie mit der Seite.',
    ],
    werkzeug: { text: 'Trigonometrie üben', href: '/uebung/trigonometrie' },
  },
  {
    thema: 'Strahlensätze',
    treffer: 'verhältnis',
    ursache:
      'Es wird eine Formel gesucht, in die Zahlen eingesetzt werden. Tatsächlich ist die Frage, welche Strecken einander entsprechen – und das entscheidet die Figur, nicht die Formel.',
    schritte: [
      'Zuerst nur die Figur besprechen: Welche Strecke gehört zu welcher? Zeigen lassen, ohne zu rechnen.',
      'Die entsprechenden Strecken in gleicher Farbe nachfahren – jetzt schreibt sich das Verhältnis von selbst.',
      'Zur Kontrolle das Verhältnis überschlagen: Ist der gesuchte Wert plausibel größer oder kleiner? Das fängt Kehrwertfehler ab.',
    ],
    werkzeug: { text: 'Strahlensätze üben', href: '/uebung/strahlensaetze' },
  },
  {
    thema: 'Quadratische Gleichungen',
    treffer: 'nullprodukt',
    ursache:
      'Der Satz vom Nullprodukt ist eine Aussage über Produkte, die null sind. Er wird aber als allgemeines Verfahren erinnert und dann auf Gleichungen losgelassen, in denen gar kein Produkt steht oder rechts nicht null steht.',
    schritte: [
      'Die Gleichung x² = 5x auf zwei Wegen lösen lassen: einmal durch x teilen, einmal erst umstellen und ausklammern. Zwei verschiedene Lösungsmengen – welche stimmt?',
      'Die Bedingung ausformulieren: erst ein <em>Produkt</em> herstellen, dann muss rechts eine <em>Null</em> stehen. Beides prüfen, bevor der Satz angewendet wird.',
      'Gegenbeispiel geben: (x − 2)(x − 3) = 6. Wer hier faktorweise „= 6“ setzt, bekommt falsche Lösungen – die Klasse begründet, warum.',
    ],
    werkzeug: { text: 'Quadratische Gleichungen üben', href: '/uebung/quadratische-gleichungen' },
  },
  {
    thema: 'Quadratische Gleichungen',
    treffer: 'nur $x=4$',
    ursache:
      'Die Wurzel liefert genau eine Zahl – die Gleichung x² = 16 hat aber zwei Lösungen. Das Wurzelziehen und das Lösen einer quadratischen Gleichung werden gleichgesetzt.',
    schritte: [
      'Beide Zahlen einsetzen lassen: 4² = 16 und (−4)² = 16. Die Probe entscheidet, nicht die Erinnerung.',
      'Am Graphen zeigen: Die Parabel y = x² schneidet die Höhe 16 an zwei Stellen. Zwei Schnittpunkte, zwei Lösungen.',
      'Die Schreibweise trennen: √16 = 4 (eine Zahl), aber x² = 16 ⇒ x = ±4 (zwei Lösungen). Beides nebeneinander ins Heft.',
    ],
    werkzeug: { text: 'Funktionenplotter', href: '/werkzeuge/funktionenplotter.html' },
  },
  {
    thema: 'Termumformungen',
    treffer: 'differenzen kürzen',
    ursache:
      'Kürzen wird als „gleiche Zeichen oben und unten streichen“ gelernt. Dass gekürzt nur werden darf, was als <em>Faktor</em> dasteht, geht dabei verloren.',
    schritte: [
      'Mit Zahlen widerlegen: (2+3)/(2+5) ist 5/7, nicht 3/5. Erst rechnen lassen, dann reden.',
      'Zähler und Nenner faktorisieren lassen, bevor gekürzt wird. Was sich nicht als Produkt schreiben lässt, wird nicht gekürzt.',
      'Merksatz in eigenen Worten formulieren lassen – „gekürzt wird nur, was multipliziert wird“ – und daneben das Gegenbeispiel kleben.',
    ],
    werkzeug: { text: 'Bruchterme üben', href: '/uebung/termumformungen' },
  },
  {
    thema: 'Kreisgeometrie',
    treffer: 'radius und durchmesser',
    ursache:
      'In U = πd steht d, in A = πr² steht r. Wer die Formeln als Zeichenketten lernt, hat keine Chance, den Unterschied zu behalten.',
    schritte: [
      'Immer zuerst r einzeichnen und beschriften, auch wenn d gegeben ist. Der erste Schritt jeder Kreisaufgabe ist eine Beschriftung, keine Rechnung.',
      'Den Umfang mit beiden Formeln rechnen lassen (U = 2πr und U = πd) und feststellen: dasselbe Ergebnis, dieselbe Aussage.',
      'Bei der Fläche einen Überschlag verlangen: Ein Kreis mit r = 5 ist etwas kleiner als das umschreibende Quadrat mit 100. Wer 31,4 herausbekommt, merkt den Fehler selbst.',
    ],
    werkzeug: { text: 'Kreisgeometrie üben', href: '/uebung/kreisgeometrie' },
  },
  {
    thema: 'Graphen',
    treffer: 'vertauscht',
    ursache:
      'Ohne feste Sprech- und Handlungsreihenfolge ist die Zuordnung von Zahlenpaar zu Punkt willkürlich. „Erst x, dann y“ muss zur Bewegung werden, nicht zur Regel bleiben.',
    schritte: [
      'Die Reihenfolge als Bewegung einführen: „erst gehen, dann steigen“ – der Finger fährt sie an der Tafel mit.',
      'Punkte mit vertauschten Koordinaten gemeinsam eintragen: P(2|5) und Q(5|2). Zwei verschiedene Punkte, sichtbar.',
      'Kurze Whiteboard-Runde: Ich sage ein Paar, alle zeichnen den Punkt in ein vorbereitetes Koordinatensystem und halten hoch.',
    ],
    werkzeug: { text: 'Papier-Werkstatt: Koordinatensysteme', href: '/werkzeuge/karopapier.html' },
  },
  {
    thema: 'Logarithmen',
    treffer: '\\log(a+b)',
    ursache:
      'Dieselbe Verteilungsvorstellung wie bei Wurzeln und Quadraten: Was für Produkte gilt, wird auf Summen übertragen.',
    schritte: [
      'Mit Zahlen prüfen: log(10 + 90) = 2, aber log 10 + log 90 ≈ 2,95. Erst rechnen lassen.',
      'Die richtige Regel danebenstellen: log(a · b) = log a + log b. Der Logarithmus macht aus Produkten Summen – nicht aus Summen Summen.',
      'Die Regel rückwärts sprechen lassen: „Wenn ich zwei Logarithmen addiere, was war vorher da?“ Das sichert die Richtung.',
    ],
  },
  {
    thema: 'Lineare Gleichungssysteme',
    treffer: '$0=0$',
    ursache:
      'Eine wahre Aussage ohne Variable wird als „nichts herausgekommen“ gelesen. Dass sie eine Information über die Lösungsmenge ist, muss erst gedeutet werden.',
    schritte: [
      'Beide Gleichungen als Geraden zeichnen lassen – bei 0 = 0 liegen sie aufeinander. Das Bild erklärt die Aussage.',
      'Die drei Fälle nebeneinanderstellen: ein Schnittpunkt, keiner (parallel), unendlich viele (identisch). Zu jedem Fall die passende Endzeile der Rechnung.',
      'Ein System mit 0 = 5 danebenlegen: falsche Aussage, also keine Lösung. Die Klasse formuliert selbst, woran sie das erkennt.',
    ],
    werkzeug: { text: 'Lineare Gleichungssysteme üben', href: '/uebung/lineare-gleichungssysteme' },
  },
  {
    thema: 'Exponentialfunktionen',
    treffer: 'wachstum',
    ursache:
      'Exponentielles Wachstum wird als „schnelles lineares Wachstum“ gedeutet. Der Unterschied ist qualitativ, nicht graduell – gleiche Zeitspanne, gleicher Faktor statt gleicher Zuwachs.',
    schritte: [
      'Zwei Wertetabellen nebeneinander: +3 pro Schritt gegen ·3 pro Schritt. Die Klasse rechnet beide zehn Schritte weit.',
      'Die Differenzen der Differenzen bilden lassen – bei linearem Wachstum konstant, bei exponentiellem nicht.',
      'Den Quotienten aufeinanderfolgender Werte bilden: Genau der ist konstant. Das ist die tragfähige Kennzeichnung.',
    ],
    werkzeug: { text: 'Funktionenplotter (Exponential)', href: '/werkzeuge/funktionenplotter.html' },
  },
];

/** Findet das Gegenmittel zu einer Fehlvorstellung, falls eines hinterlegt ist. */
export function findeGegenmittel(thema: string, fehlvorstellung: string): Gegenmittel | undefined {
  const text = fehlvorstellung.toLowerCase().replace(/\s+/g, ' ');
  return gegenmittel.find(
    (g) => g.thema === thema && text.includes(g.treffer.toLowerCase())
  );
}
