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
    thema: 'Binomische Formeln',
    treffer: '$(a+b)(a-b)$',
    ursache:
      'Beide Ausdrücke enthalten dieselben Buchstaben und ein Plus und ein Minus. Ohne den Blick auf die Struktur – zwei gleiche Klammern gegen zwei verschiedene – bleibt nur das Schriftbild.',
    schritte: [
      'Beide Terme untereinanderschreiben und die Klammern vergleichen: Bei der ersten Formel stehen zweimal dieselben Zeichen, bei der dritten unterscheiden sie sich im Vorzeichen.',
      'Beide ausmultiplizieren lassen, Glied für Glied. Bei (a+b)(a−b) heben sich die gemischten Glieder auf – deshalb fehlt der mittlere Term.',
      'Mit Zahlen prüfen: (5+2)(5−2) ist 21, (5+2)² ist 49. Die Ergebnisse liegen weit auseinander.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Drei Muster', href: '/aufgaben/binomische-formeln-drei-muster' },
  },
  {
    thema: 'Exponentialfunktionen',
    treffer: 'zerfall',
    ursache:
      'Wachstum und Zerfall werden in getrennten Abschnitten behandelt, oft mit verschiedenen Formeln. Dass nur der Faktor q über oder unter 1 liegt, geht dabei unter.',
    schritte: [
      'Eine einzige Gleichung an die Tafel: f(t) = a · qᵗ. Danach drei Werte für q einsetzen: 1,5 – 1 – 0,5.',
      'Am Schieberegler q von 2 auf 0,5 ziehen und beobachten, wie die Kurve kippt. Es ist dieselbe Funktion, nicht zwei.',
      'Die Grenze benennen: Bei q = 1 passiert nichts. Über 1 wächst es, unter 1 fällt es – das ist die ganze Unterscheidung.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Wachstum und Zerfall', href: '/aufgaben/exponentielles-wachstum-und-zerfall' },
  },
  {
    thema: 'Lineare Funktionen',
    treffer: 'negative steigung',
    ursache:
      'Das Minuszeichen wird als Aussage über die Lage der Geraden gelesen statt über ihre Richtung. Eine fallende Gerade kann vollständig oberhalb der x-Achse verlaufen – das widerspricht der Deutung, wird aber selten gezeigt.',
    schritte: [
      'Die Gerade y = −2x + 20 zeichnen lassen. Sie fällt und liegt im gezeigten Ausschnitt durchgehend über null.',
      'Am Steigungsdreieck vorführen: Drei nach rechts, zwei nach unten – die Höhenänderung ist negativ, deshalb ist der Quotient negativ.',
      'Die Sprechweise trennen: „fällt“ beschreibt die Richtung, „liegt unter null“ beschreibt die Lage. Zwei Aussagen, die nichts miteinander zu tun haben.',
    ],
    werkzeug: { text: 'Funktionenplotter', href: '/werkzeuge/funktionenplotter.html' },
  },
  {
    thema: 'Lineare Funktionen',
    treffer: 'parallele geraden',
    ursache:
      'Parallelität wird visuell als „gleich weit oben“ erfasst. Dass sie allein von der Steigung abhängt und der y-Achsenabschnitt beliebig sein darf, verlangt, beide Größen getrennt zu betrachten.',
    schritte: [
      'Drei Geraden mit derselben Steigung und verschiedenen Achsenabschnitten zeichnen: y = 2x, y = 2x + 3, y = 2x − 4. Alle drei sind parallel.',
      'Am Schieberegler nur b verändern und die Klasse beobachten lassen: Die Richtung ändert sich nie.',
      'Die Gegenprobe: Zwei Geraden mit gleichem b, aber verschiedener Steigung. Sie schneiden sich – auf der y-Achse.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Steigung und Achsenabschnitt', href: '/aufgaben/lineare-funktionen-steigung-und-achsenabschnitt' },
  },
  {
    thema: 'Lineare Gleichungen',
    treffer: 'beidseitig',
    ursache:
      'Es fehlt keine Regel, sondern eine Reihenfolge. Ohne Plan wird umgeformt, was gerade auffällt – und dann tauchen die Variablen abwechselnd links und rechts wieder auf.',
    schritte: [
      'Eine feste Reihenfolge vereinbaren und an die Tafel schreiben: erst die Variablen auf eine Seite, dann die Zahlen auf die andere, zuletzt teilen.',
      'Bei jeder Aufgabe den ersten Schritt vor dem Rechnen ansagen lassen. Wer ihn benennen kann, braucht die Regel danach nicht mehr.',
      'An der Waage vorführen, dass es gleichgültig ist, auf welche Seite man die Variablen bringt – nur entscheiden muss man sich.',
    ],
    werkzeug: { text: 'Gleichungswaage', href: '/werkzeuge/gleichungswaage.html' },
  },
  {
    thema: 'Negative Zahlen',
    treffer: 'minus mal minus',
    ursache:
      'Der Satz wird als Merkregel weitergegeben, meist ohne Begründung. Eine unbegründete Regel lässt sich nicht prüfen – und wird deshalb auch dort angewandt, wo sie nicht gilt, etwa bei der Subtraktion.',
    schritte: [
      'Eine Reihe fortsetzen lassen: 3 · (−2) = −6, 2 · (−2) = −4, 1 · (−2) = −2, 0 · (−2) = 0. Der nächste Schritt (−1) · (−2) muss +2 ergeben, damit das Muster hält.',
      'Die Begründung als Wunsch nach Verträglichkeit formulieren: Das Ergebnis ist so festgelegt, damit die Rechengesetze weiter gelten.',
      'Die Grenze der Regel benennen: Sie gilt für die Multiplikation. Bei 5 − (−3) hilft sie nicht – dort geht es um Rechen- und Vorzeichen.',
    ],
    werkzeug: { text: 'Stundenverlauf: Die drei Bedeutungen des Minuszeichens', href: '/stunden/negative-zahlen-die-drei-bedeutungen-des-minus' },
  },
  {
    thema: 'Pythagoras',
    treffer: 'längste seite',
    ursache:
      'Die Formel wird in der Form gespeichert, in der sie am häufigsten vorkommt: zwei Katheten gegeben, Hypotenuse gesucht. Ist die Hypotenuse gegeben, passt die gespeicherte Form nicht mehr – sie wird trotzdem verwendet.',
    schritte: [
      'Vor dem Rechnen markieren, welche Seite gesucht ist. Ist es eine Kathete, wird subtrahiert; ist es die Hypotenuse, addiert.',
      'Die Größenordnung prüfen lassen: Eine Kathete muss kürzer sein als die Hypotenuse. Wer addiert, bekommt eine zu große Zahl.',
      'Beide Formen nebeneinanderschreiben: c² = a² + b² und a² = c² − b². Es ist dieselbe Gleichung, nur nach etwas anderem aufgelöst.',
    ],
    werkzeug: { text: 'Stundenverlauf: Erst die Hypotenuse finden', href: '/stunden/pythagoras-welche-seite-ist-die-hypotenuse' },
  },
  {
    thema: 'Quadratische Funktionen',
    treffer: 'quadratische ergänzung halb gemacht',
    ursache:
      'Die quadratische Ergänzung besteht aus zwei Handlungen: dazuzählen und wieder abziehen. Die zweite hat keinen sichtbaren Zweck und wird deshalb vergessen – der Term ändert dabei seinen Wert.',
    schritte: [
      'Beide Handlungen als Paar schreiben, in einer Zeile und mit Klammern: x² − 6x + 9 − 9 + 1. Was dazukommt, muss im selben Schritt wieder weg.',
      'Die Probe mit einer Zahl: Ausgangs- und Ergebnisterm müssen für x = 1 denselben Wert liefern. Zehn Sekunden, die den halben Schritt aufdecken.',
      'Am Ende f(d) = e prüfen: Der Scheitelwert muss zum Term passen. Wer nur ergänzt hat, bekommt hier eine Abweichung.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Scheitelpunkt und Normalform', href: '/aufgaben/quadratische-funktionen-scheitelpunkt-und-normalform' },
  },
  {
    thema: 'Stochastik',
    treffer: 'gleichwahrscheinlich',
    ursache:
      'Bei Würfel und Münze sind alle Ergebnisse gleich wahrscheinlich, und das sind die Beispiele, mit denen eingeführt wird. Aus dem Sonderfall wird eine allgemeine Annahme.',
    schritte: [
      'Zwei Würfel werfen und die Summen notieren lassen. Die 7 kommt deutlich häufiger als die 2 – bei elf möglichen Summen.',
      'Alle 36 Paare auflisten und zählen, wie viele zu jeder Summe führen. Gleich wahrscheinlich sind die Paare, nicht die Summen.',
      'Die Prüffrage einführen: Sind die Ergebnisse, die ich zähle, wirklich gleichberechtigt – oder habe ich schon zusammengefasst?',
    ],
    werkzeug: { text: 'Zufallsexperimente', href: '/werkzeuge/zufallsexperimente.html' },
  },
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
      'Immer zuerst nach dem Grundwert fragen: „100 % – wovon?“ Am Prozentstreifen ist das keine Regel, sondern eine Ablesung: Die untere Skala endet immer bei 100 %.',
      'Bei Zu- und Abnahme konsequent mit dem Vermehrungsfaktor arbeiten (1,20 statt „+20 %“) – dann bricht auch die zweite große Fehlvorstellung weg, dass +20 % und −20 % sich aufheben.',
    ],
    werkzeug: { text: 'Prozentstreifen', href: '/werkzeuge/prozentstreifen.html' },
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
      'Die Gleichung als Waage darstellen und einmal absichtlich nur links umformen – die Waage kippt sichtbar, die Lösung stimmt nicht mehr.',
      'Absichtlich eine Gleichung mit dem x rechts stellen (12 = 3x). Wer das Gleichheitszeichen richtig liest, hat kein Problem damit.',
      'Bei jeder Umformung den Schritt an den Rand schreiben (| −3) und laut sprechen: „auf beiden Seiten“.',
    ],
    werkzeug: { text: 'Gleichungswaage', href: '/werkzeuge/gleichungswaage.html' },
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
  {
    thema: 'Algebra',
    treffer: 'ausklammern',
    ursache:
      'Das Distributivgesetz wird fast immer in einer Richtung geübt. Ausklammern erscheint dadurch als eigenes Verfahren mit eigenem Namen – nicht als dieselbe Gleichung von rechts nach links gelesen.',
    schritte: [
      'Eine einzige Gleichung an die Tafel: 3(x + 4) = 3x + 12. Dann den Pfeil in beide Richtungen darüber zeichnen und benennen: nach rechts heißt es Ausmultiplizieren, nach links Ausklammern.',
      'Zehn Terme austeilen, gemischt: Bei jedem entscheiden die Lernenden zuerst, in welche Richtung es geht – und rechnen erst danach.',
      'Am Flächenbild absichern: Ein Rechteck der Breite 3 und der Länge x + 4 hat dieselbe Fläche, ob man es teilt oder nicht. Die Richtung ist eine Frage der Zweckmäßigkeit, nicht der Erlaubnis.',
    ],
    werkzeug: { text: 'Aufgabenfolge Distributivgesetz', href: '/aufgaben/distributivgesetz-variation' },
  },
  {
    thema: 'Algebra',
    treffer: 'nicht *vollständig* multipliziert',
    ursache:
      'Der Faktor wird als Vorsilbe des ersten Summanden gelesen statt als Faktor der ganzen Klammer. Verstärkt wird das dadurch, dass 3(x + 4) ohne Malzeichen geschrieben wird – die Multiplikation ist unsichtbar.',
    schritte: [
      'Mit Zahlen prüfen lassen: 3(2 + 4) ist 18, aber 3 · 2 + 4 wäre 10. Ein Gegenbeispiel entscheidet die Frage in zehn Sekunden.',
      'Das Malzeichen für eine Weile wieder hinschreiben: 3 · (x + 4). Die unsichtbare Operation sichtbar zu machen, kostet nichts und verhindert genau diesen Fehler.',
      'Pfeile von der 3 zu jedem Summanden zeichnen. Wer zwei Pfeile malt, multipliziert auch zweimal.',
    ],
    werkzeug: { text: 'Übungsgenerator Algebra', href: '/uebung/algebra' },
  },
  {
    thema: 'Algebra',
    treffer: 'variablen und zahlen',
    ursache:
      'Ein Term wird als Rechenaufforderung gelesen, die ein einzelnes Ergebnis liefern muss. Dass 3 + 2x bereits eine vollständige Antwort ist, widerspricht der Erfahrung aus der Grundschule, wo hinter dem Gleichheitszeichen immer eine Zahl stand.',
    schritte: [
      'Einsetzen lassen: Für x = 5 ist 3 + 2x gleich 13, 5x wäre 25. Die Terme sind verschieden, also darf man sie nicht gleichsetzen.',
      'Die Frage stellen, was 2x überhaupt bedeutet – zweimal eine unbekannte Zahl. Zu einer unbekannten Zahl kann man keine 3 dazuzählen, ohne sie zu kennen.',
      'Sortieraufgabe: Aus zwölf Termpaaren die heraussuchen, die zusammengefasst werden dürfen. Nur gleiche Variablenteile gehören zusammen.',
    ],
    werkzeug: { text: 'Stundenverlauf: Wofür der Buchstabe steht', href: '/stunden/algebra-wofuer-der-buchstabe-steht' },
  },
  {
    thema: 'Binomische Formeln',
    treffer: '2. formel',
    ursache:
      'Das Minuszeichen aus der Klammer wird auf alle Glieder verteilt. Dahinter steckt die richtige Beobachtung, dass ein Minus etwas verändert – nur eben nicht das Quadrat von b, das als Produkt zweier negativer Zahlen positiv wird.',
    schritte: [
      'Ausmultiplizieren statt merken: (a − b)(a − b) Glied für Glied. Das letzte Produkt ist (−b) · (−b) und damit positiv.',
      'Mit Zahlen prüfen: (5 − 2)² ist 9. Nach der falschen Formel käme 25 − 20 − 4 = 1 heraus.',
      'Beide Formeln untereinanderschreiben und nur den Unterschied markieren: Es ist genau ein Vorzeichen, das des mittleren Glieds.',
    ],
    werkzeug: { text: 'Stundenverlauf: Woher der mittlere Term kommt', href: '/stunden/binomische-formeln-warum-der-mittelterm-da-ist' },
  },
  {
    thema: 'Binomische Formeln',
    treffer: 'faktorisieren',
    ursache:
      'Geübt wird fast nur die Richtung vom Produkt zur Summe. Für die Rückrichtung fehlt das Erkennungsmerkmal – man weiß nicht, wonach man schauen soll.',
    schritte: [
      'Eine Prüfliste einführen, die drei Fragen lang ist: Sind zwei Glieder Quadrate? Passt das mittlere Glied zu 2ab? Stimmen die Vorzeichen?',
      'Zehn Terme vorlegen, von denen drei zu keiner binomischen Formel passen. Nur zuordnen, nicht rechnen – die Entscheidung ist die Übung.',
      'Bei x² + 6x + 8 zeigen, dass die Prüfliste zu Recht ablehnt: 8 ist kein Quadrat. Hier hilft die Zerlegung in (x + 2)(x + 4).',
    ],
    werkzeug: { text: 'Aufgabenfolge: Drei Muster', href: '/aufgaben/binomische-formeln-drei-muster' },
  },
  {
    thema: 'Bruch Dezimal Prozent',
    treffer: 'kleiner machen',
    ursache:
      'Prozentangaben begegnen im Alltag überwiegend als Rabatt. Aus der Häufung entsteht die Bedeutung „weniger“ statt „von hundert“ – und dann ist eine Zunahme um 120 % unverständlich.',
    schritte: [
      'Drei Angaben nebeneinanderlegen: 20 % Rabatt, 20 % mehr Inhalt, 20 % der Klasse. Dieselbe Zahl, drei Richtungen.',
      'Am Prozentstreifen die 100-%-Marke setzen und danach Werte darüber und darunter eintragen. Über 100 % ist kein Sonderfall, sondern die andere Hälfte der Skala.',
      'Die Sprechweise umstellen: nicht „20 Prozent“, sondern „20 von hundert“. Nach drei Stunden sitzt die Bedeutung.',
    ],
    werkzeug: { text: 'Prozentstreifen', href: '/werkzeuge/prozentstreifen.html' },
  },
  {
    thema: 'Bruch Dezimal Prozent',
    treffer: 'getrennte welten',
    ursache:
      'Beide Schreibweisen werden in getrennten Kapiteln eingeführt, mit eigenen Regeln und eigenen Aufgaben. Dass es dieselbe Zahl ist, wird gesagt, aber selten gezeigt.',
    schritte: [
      'Beide an derselben Zahlengeraden eintragen: 0,75 und 3/4 landen an genau derselben Stelle. Zwei Zahlen sind gleich, wenn sie am selben Ort liegen.',
      'Kärtchen sortieren lassen, in denen Brüche, Dezimalzahlen und Prozentangaben gemischt sind – mit zwei Ausreißern, die zu nichts passen.',
      'Bei 1/3 die Grenze zeigen: Hier ist der Bruch die exakte Schreibweise und die Dezimalzahl die gerundete. Genau umgekehrt zur Erwartung.',
    ],
    werkzeug: { text: 'Stundenverlauf: Drei Kleider, eine Zahl', href: '/stunden/bruch-dezimal-prozent-drei-kleider-eine-zahl' },
  },
  {
    thema: 'Bruch Dezimal Prozent',
    treffer: 'willkürlich verschoben',
    ursache:
      'Das Kommaverschieben wird als Handgriff gelernt, ohne Bezug zum Stellenwert. Ohne diesen Bezug fehlt die Kontrolle über die Richtung – und dann wird geraten.',
    schritte: [
      'Die Stellenwerttafel danebenlegen und das Komma nicht verschieben, sondern die Ziffern wandern lassen. Das Komma steht fest, die Stellenwerte ändern sich.',
      'Vor jeder Umwandlung schätzen: Wird die Zahl größer oder kleiner? 0,45 in Prozent muss mehr als 0,45 ergeben, weil Prozent hundertstel zählt.',
      'Die Probe rückwärts verlangen: 45 % wieder zu 0,45 machen. Wer beide Richtungen kann, hat den Stellenwertbezug.',
    ],
    werkzeug: { text: 'Zahlenstrahl & Stellenwert', href: '/werkzeuge/zahlenstrahl.html' },
  },
  {
    thema: 'Bruchgleichungen',
    treffer: 'definitionsbereich wird nicht angegeben',
    ursache:
      'Der Definitionsbereich erscheint im Lehrgang als Zusatz am Ende – etwas, das man „auch noch“ hinschreibt. Solange er nicht die erste Handlung ist, wird er unter Zeitdruck als Erstes weggelassen.',
    schritte: [
      'Die Reihenfolge umdrehen und einfordern: erst Definitionsbereich, dann rechnen, dann Probe. Aufgaben ohne notierten Definitionsbereich kommen zurück, auch wenn das Ergebnis stimmt.',
      'Eine Runde Aufgaben austeilen, bei denen nur der Definitionsbereich bestimmt wird – nicht gerechnet. Wer nichts rechnen darf, bestimmt ihn zuerst.',
      'Eine Gleichung rechnen lassen, deren einzige rechnerische Lösung verboten ist. Wer den Definitionsbereich zuletzt bestimmt, hat die Aufgabe zweimal gerechnet.',
    ],
    werkzeug: { text: 'Stundenverlauf zu Bruchgleichungen', href: '/stunden/bruchgleichungen-die-probe-ist-nicht-optional' },
  },
  {
    thema: 'Bruchgleichungen',
    treffer: 'probe weggelassen',
    ursache:
      'Bis zu den Bruchgleichungen galt: Wer richtig umformt, bekommt die richtige Lösung. Unter dieser Zusage ist die Probe reine Formsache – und wird entsprechend behandelt.',
    schritte: [
      'Die Zusage ausdrücklich an die Tafel schreiben und dann widerrufen: Das Multiplizieren mit dem Hauptnenner ist nur dann eine Äquivalenzumformung, wenn dieser nicht null wird.',
      'Sechs Gleichungen rechnen lassen, von denen vier Sonderfälle sind. Ohne Probe lassen sie sich nicht unterscheiden.',
      'Die Probe als Einsetzen in die *ursprüngliche* Gleichung verlangen, nicht in eine Zwischenzeile. Nur dort zeigt sich die Scheinlösung.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Definitionsbereich und Probe', href: '/aufgaben/bruchgleichungen-definitionsbereich-und-probe' },
  },
  {
    thema: 'Bruchgleichungen',
    treffer: 'hauptnenner',
    ursache:
      'Der Hauptnenner wird aus den Nennern „zusammengebaut“, ohne systematisch zu prüfen, ob jeder Faktor darin vorkommt. Bei drei Nennern oder faktorisierbaren Termen geht das regelmäßig schief.',
    schritte: [
      'Alle Nenner zuerst vollständig faktorisieren – auch die, die schon einfach aussehen. x² − 4 wird zu (x − 2)(x + 2).',
      'Den Hauptnenner als Produkt aller *verschiedenen* Faktoren aufschreiben, bevor multipliziert wird. Erst danach rechnen.',
      'Gegenprobe: Jeder einzelne Nenner muss den Hauptnenner ohne Rest teilen. Das ist in zehn Sekunden geprüft.',
    ],
    werkzeug: { text: 'Aufgabenfolge Bruchterme', href: '/aufgaben/bruchterme-kuerzen-und-addieren' },
  },
  {
    thema: 'Bruchgleichungen',
    treffer: 'keine lösung',
    ursache:
      'Ein Bruch wird als Rechenausdruck gelesen, der irgendeinen Wert annimmt – auch null. Dass ein Bruch nur dann null ist, wenn sein Zähler null ist, wird nicht mitgedacht.',
    schritte: [
      'Die Frage stellen: Welche Zahl im Nenner macht den Bruch 1/x zu null? Die Suche bleibt ergebnislos, und genau das ist die Antwort.',
      'Am Graphen zeigen: Die Hyperbel nähert sich der x-Achse, erreicht sie aber nie. Kein Schnittpunkt, keine Lösung.',
      'Die allgemeine Regel formulieren lassen: Ein Bruch ist genau dann null, wenn der Zähler null ist – und der Nenner nicht.',
    ],
    werkzeug: { text: 'Funktionenplotter', href: '/werkzeuge/funktionenplotter.html' },
  },
  {
    thema: 'Bruchrechnung',
    treffer: 'wegstreichen von summanden',
    ursache:
      'Kürzen wird als optisches Verfahren gelernt: Was oben und unten gleich aussieht, wird durchgestrichen. Die Bedingung, dass es sich um Faktoren handeln muss, ist nicht sichtbar und wird deshalb nicht mitgelernt.',
    schritte: [
      'Mit Zahlen prüfen: (2 + 4)/2 ist 3. Streicht man die Zweien weg, käme 4 heraus. Der Widerspruch braucht keine Erklärung.',
      'Vor jedem Kürzen den Zähler und den Nenner faktorisieren – als Produkt schreiben. Was kein Produkt ist, wird nicht gekürzt.',
      'Die Sprechregel einführen: Gekürzt wird durch, nicht weggestrichen. Man teilt Zähler und Nenner durch dieselbe Zahl.',
    ],
    werkzeug: { text: 'Übungsgenerator Bruchrechnung', href: '/uebung/bruchrechnung' },
  },
  {
    thema: 'Bruchrechnung',
    treffer: 'nur über den zähler',
    ursache:
      'Der Bruch wird als zwei getrennte Zahlen gelesen, und verglichen wird die auffälligere von beiden. Bei gleichem Nenner funktioniert das sogar – deshalb hält sich die Strategie.',
    schritte: [
      'Beide Brüche am selben Streifen abtragen. 3/8 und 1/4 sind gleich groß; die Regel hätte 3/8 als größer ausgewiesen.',
      'Ein Gegenbeispiel mit gleichem Zähler danebenlegen: 1/8 gegen 1/4. Größere Nennerzahl, kleinerer Bruch.',
      'Als Strategie stattdessen den Vergleich mit 1/2 einführen: Liegt der Bruch darüber oder darunter? Das entscheidet die meisten Vergleiche in Sekunden.',
    ],
    werkzeug: { text: 'Bruchstreifen', href: '/werkzeuge/bruchstreifen.html' },
  },
  {
    thema: 'Bruchrechnung',
    treffer: 'gemischte zahl',
    ursache:
      'In der Algebra bedeutet das Nebeneinanderschreiben Multiplikation (3a heißt 3 · a). Bei gemischten Zahlen bedeutet dieselbe Schreibweise Addition. Der Widerspruch ist real und wird selten benannt.',
    schritte: [
      'Den Widerspruch ausdrücklich ansprechen: Hier ist die Schreibweise anders als in der Algebra. Das ist eine historische Eigenheit, kein Denkfehler der Lernenden.',
      'Gemischte Zahlen beim Rechnen sofort in unechte Brüche umwandeln. Dann verschwindet die Zweideutigkeit aus der Rechnung.',
      'Zur Kontrolle immer schätzen: 2½ liegt zwischen 2 und 3. Wer 2 · ½ = 1 rechnet, sieht den Widerspruch zur Schätzung.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Brüche und gemischte Zahlen', href: '/aufgaben/brueche-und-gemischte-zahlen' },
  },
  {
    thema: 'Dezimalzahlen',
    treffer: 'dekoration',
    ursache:
      'Beim schriftlichen Rechnen mit natürlichen Zahlen richtet man rechtsbündig aus – das funktioniert dort immer. Bei Dezimalzahlen führt dieselbe Gewohnheit zu falschen Stellenwerten.',
    schritte: [
      'Die Ausrichtungsregel umstellen: nicht rechtsbündig, sondern am Komma. Das Komma steht untereinander, alles andere folgt.',
      'Fehlende Stellen mit Nullen auffüllen, bevor gerechnet wird: 3,7 + 0,45 wird zu 3,70 + 0,45.',
      'Vor dem Rechnen überschlagen: 3,7 + 0,45 ist ungefähr 4. Ein Ergebnis von 8,2 fällt damit sofort auf.',
    ],
    werkzeug: { text: 'Zahlenstrahl & Stellenwert', href: '/werkzeuge/zahlenstrahl.html' },
  },
  {
    thema: 'Dezimalzahlen',
    treffer: 'anzahl der nachkommastellen im ergebnis raten',
    ursache:
      'Die Regel wird als Zählvorschrift gelernt, ohne Begründung. Ohne Begründung gibt es keine Kontrolle, und im Zweifel wird geschätzt statt abgeleitet.',
    schritte: [
      'Die Regel herleiten statt merken: 0,3 · 0,4 ist 3 Zehntel mal 4 Zehntel, also 12 Hundertstel. Die Stellen addieren sich, weil sich die Zehnerpotenzen multiplizieren.',
      'Immer überschlagen: 0,3 · 0,4 muss kleiner sein als 0,3. Wer 1,2 herausbekommt, hat das Komma verloren.',
      'Eine Reihe rechnen lassen, in der nur die Kommastellen wandern: 3 · 4, 0,3 · 4, 0,3 · 0,4, 0,03 · 0,4. Das Muster wird selbst gefunden.',
    ],
    werkzeug: { text: 'Kopfrechen-Sprint', href: '/werkzeuge/kopfrechen-sprint.html' },
  },
  {
    thema: 'Dezimalzahlen',
    treffer: 'division durch',
    ursache:
      'Aus der Multiplikation stammt die Erfahrung „mal macht größer, geteilt macht kleiner“. Bei Zahlen unter 1 kehrt sich beides um – und diese Umkehr wird nirgends ausdrücklich behandelt.',
    schritte: [
      'Die Frage anders stellen: Wie oft passt 0,2 in 1? Fünfmal. Teilen heißt hier „wie oft passt es hinein“, und kleine Teiler passen oft hinein.',
      'Eine Reihe rechnen: 10 : 5, 10 : 2, 10 : 1, 10 : 0,5, 10 : 0,2. Die Ergebnisse wachsen, während der Teiler fällt.',
      'Das Verfahren erst danach: Zähler und Nenner mit derselben Zehnerpotenz erweitern, bis der Teiler ganzzahlig ist.',
    ],
    werkzeug: { text: 'Aufgabenfolge Dezimalzahlen', href: '/aufgaben/dezimalzahlen-stellenwert-und-groessenvergleich' },
  },
  {
    thema: 'Exponentialfunktionen',
    treffer: 'werden verwechselt',
    ursache:
      'Beide Terme bestehen aus denselben Zeichen; nur die Rolle von Basis und Exponent ist getauscht. Wer Potenzen als „Zeichenmuster“ liest statt als wiederholte Multiplikation, sieht keinen Unterschied.',
    schritte: [
      'Beide Wertetabellen für t = 1 bis 5 nebeneinander ausrechnen lassen: 2^t gegen t². Bei t = 10 stehen 1024 gegen 100.',
      'Laut sprechen, was dasteht: Bei 2^t ist die 2 der Faktor, der t-mal genommen wird. Bei t² ist t der Faktor, der zweimal genommen wird.',
      'Beide Graphen am Plotter übereinanderlegen und den Ausschnitt vergrößern. Die Potenzfunktion wird überholt, und zwar endgültig.',
    ],
    werkzeug: { text: 'Funktionenplotter', href: '/werkzeuge/funktionenplotter.html' },
  },
  {
    thema: 'Exponentialfunktionen',
    treffer: 'halbwertszeit',
    ursache:
      'Der Begriff wird als Zeitspanne gelernt, in der „die Hälfte weg ist“ – ohne die Einsicht, dass er für jeden Startzeitpunkt gilt, nicht nur für den Anfang.',
    schritte: [
      'Eine Zerfallstabelle über vier Halbwertszeiten anlegen: 100, 50, 25, 12,5, 6,25. Nach zwei Halbwertszeiten ist nicht alles weg, sondern ein Viertel übrig.',
      'Die Frage stellen: Wie lange dauert es von 50 auf 25? Genauso lange wie von 100 auf 50. Der Startpunkt ist beliebig.',
      'Den Zusammenhang zum Faktor herstellen: Halbierung pro Halbwertszeit heißt Faktor 0,5 – aber nicht Faktor 0,5 pro Zeitschritt.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Wachstum und Zerfall', href: '/aufgaben/exponentielles-wachstum-und-zerfall' },
  },
  {
    thema: 'Graphen',
    treffer: 'linienzüge',
    ursache:
      'Das Lineal ist das vertraute Werkzeug aus der Behandlung linearer Funktionen. Dass eine Parabel zwischen den berechneten Punkten gekrümmt verläuft, ist keine Selbstverständlichkeit, sondern eine Aussage über die Funktion.',
    schritte: [
      'Zusätzliche Zwischenwerte berechnen lassen – etwa bei x = 0,5 und x = 1,5. Die neuen Punkte liegen nicht auf der geraden Verbindung.',
      'Am Plotter dieselbe Funktion mit wenigen und mit vielen Punkten zeichnen. Der Linienzug ist eine Näherung, die mit mehr Punkten verschwindet.',
      'Die Regel vereinbaren: Lineal nur bei Geraden. Sonst freihändig und rund, mit dem Scheitel als Orientierung.',
    ],
    werkzeug: { text: 'Papier-Werkstatt: Koordinatensysteme', href: '/werkzeuge/karopapier.html' },
  },
  {
    thema: 'Graphen',
    treffer: 'ignoriert oder verwechselt',
    ursache:
      'Beim Zeichnen liegt die Aufmerksamkeit auf der Form der Kurve. Die Konstante verschiebt nur, verändert aber nichts an der Gestalt – und wird deshalb als unwichtig behandelt.',
    schritte: [
      'Immer zuerst den Punkt auf der y-Achse eintragen, bevor irgendetwas anderes gezeichnet wird. Er ist der Wert für x = 0 und in einem Schritt bestimmt.',
      'Am Schieberegler nur c verändern und die Klasse vorhersagen lassen, was passiert. Die Form bleibt, die Lage ändert sich.',
      'Zur Kontrolle einsetzen: f(0) muss den abgelesenen Wert ergeben. Zehn Sekunden, die jeden Verschiebungsfehler finden.',
    ],
    werkzeug: { text: 'Funktionenplotter', href: '/werkzeuge/funktionenplotter.html' },
  },
  {
    thema: 'Graphen',
    treffer: 'reiner höhenzuwachs',
    ursache:
      'In fast allen Schulbuchbeispielen hat das Steigungsdreieck die Breite 1. Dann ist der Quotient gleich der Höhe, und die Division fällt nicht auf – bis ein Punktepaar in anderem Abstand kommt.',
    schritte: [
      'Vier verschieden große Steigungsdreiecke an dieselbe Gerade zeichnen lassen und für jedes den Quotienten bilden. Er ist viermal derselbe.',
      'Die Sprechweise umstellen: nicht „drei nach oben“, sondern „drei nach oben pro einem nach rechts“. Die Einheit gehört zur Zahl.',
      'Ein Dreieck mit der Breite 3 als Standardbeispiel verwenden, nicht eines mit der Breite 1. Der bequeme Fall verdeckt genau das, worauf es ankommt.',
    ],
    werkzeug: { text: 'Stundenverlauf: Steigung ist ein Verhältnis', href: '/stunden/lineare-funktionen-steigung-als-verhaeltnis' },
  },
  {
    thema: 'Kreisgeometrie',
    treffer: 'lineare statt quadratische skalierung',
    ursache:
      'Beide Formeln enthalten π und r und sehen einander ähnlich. Ohne Bezug zur Bedeutung – Länge gegen Fläche – bleibt nur das Aussehen als Unterscheidungsmerkmal.',
    schritte: [
      'Die Einheiten prüfen lassen: Der Umfang ist eine Länge (cm), die Fläche eine Fläche (cm²). Eine Formel mit r einfach kann keine Fläche liefern.',
      'Kästchen abzählen bei r = 2 und r = 4. Der Umfang verdoppelt sich, die Fläche wird viermal so groß.',
      'Beide Formeln nie nebeneinander an die Tafel schreiben, sondern jede zu ihrem Bild: der Umfang zur abgerollten Linie, die Fläche zur ausgemalten Scheibe.',
    ],
    werkzeug: { text: 'Stundenverlauf: Warum π immer dieselbe Zahl ist', href: '/stunden/kreis-warum-pi-immer-dasselbe-ist' },
  },
  {
    thema: 'Kreisgeometrie',
    treffer: 'sektor',
    ursache:
      'Die Sektorformel wird als eigene Formel gelernt statt als Anteil an einer bekannten. Damit ist der Bruch α/360° ein zusätzliches Stück, das man vergessen kann.',
    schritte: [
      'Immer zuerst den Anteil bestimmen und hinschreiben: Ein 90°-Sektor ist ein Viertel des Kreises. Erst danach rechnen.',
      'Die Probe über die Größenordnung: Ein Viertelkreis muss etwa ein Viertel der Kreisfläche haben. Wer die volle Fläche herausbekommt, hat den Anteil vergessen.',
      'Bogenlänge und Sektorfläche gemeinsam behandeln – es ist derselbe Anteil, einmal von der Länge, einmal von der Fläche.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Umfang, Fläche und Sektor', href: '/aufgaben/kreis-umfang-flaeche-und-sektor' },
  },
  {
    thema: 'Kreisgeometrie',
    treffer: 'tangente und sekante',
    ursache:
      'Beide sind Geraden, die einen Kreis treffen. Der Unterschied liegt in der Anzahl der gemeinsamen Punkte – ein Merkmal, das man zeichnen, aber nicht auf den ersten Blick sehen muss.',
    schritte: [
      'Eine Gerade zeichnen und schrittweise vom Kreismittelpunkt wegschieben: zwei Schnittpunkte, dann einer, dann keiner. Der Übergangsfall ist die Tangente.',
      'Den rechten Winkel markieren: Die Tangente steht senkrecht auf dem Radius im Berührpunkt. Das ist das Merkmal, mit dem man rechnen kann.',
      'Beide Fälle in Aufgaben mischen, sodass die Entscheidung vor der Rechnung getroffen werden muss.',
    ],
    werkzeug: { text: 'Übungsgenerator Kreisgeometrie', href: '/uebung/kreisgeometrie' },
  },
  {
    thema: 'Lineare Funktionen',
    treffer: 'y-achsenabschnitt wird mit dem x-wert verwechselt',
    ursache:
      'Der Buchstabe b steht in der Gleichung neben x und wird deshalb als etwas gelesen, das zur x-Richtung gehört. Dass er den Funktionswert an einer bestimmten Stelle angibt, steht der Schreibweise nicht an.',
    schritte: [
      'b als f(0) einführen, nicht als „der Wert hinter dem x“. Setzt man x = 0 ein, bleibt genau b übrig.',
      'Immer den Punkt (0 | b) eintragen und beschriften, bevor die Gerade gezeichnet wird.',
      'Die Gegenfrage stellen: Wo schneidet die Gerade die x-Achse? Das ist eine andere Zahl und erfordert eine Rechnung – der Unterschied wird an der Aufgabe deutlich.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Steigung und Achsenabschnitt', href: '/aufgaben/lineare-funktionen-steigung-und-achsenabschnitt' },
  },
  {
    thema: 'Lineare Gleichungen',
    treffer: 'mit negativer zahl wird das vorzeichen vergessen',
    ursache:
      'Das Vorzeichen wird als Eigenschaft der Zahl gespeichert, nicht als Teil des Faktors, mit dem umgeformt wird. Beim Aufschreiben der neuen Zeile fällt es dann weg.',
    schritte: [
      'Die Umformung immer vollständig an den Rand schreiben, mit Vorzeichen: | · (−2), nicht | · 2.',
      'Nach jeder Umformung mit negativem Faktor eine Probe verlangen. Der Fehler zeigt sich sofort.',
      'Bei Ungleichungen ausdrücklich anschließen, dass sich zusätzlich das Relationszeichen dreht – derselbe Anlass, dieselbe Aufmerksamkeit.',
    ],
    werkzeug: { text: 'Gleichungswaage', href: '/werkzeuge/gleichungswaage.html' },
  },
  {
    thema: 'Lineare Gleichungen',
    treffer: 'die operation passt nicht zur beziehung',
    ursache:
      'Umformen wird als „die Zahl wegschaffen“ gelernt, und weggeschafft wird mit Minus, weil das die vertrauteste Gegenoperation ist. Dass die Gegenoperation zur *Verknüpfung* passen muss, wird nicht mitgeprüft.',
    schritte: [
      'Vor jeder Umformung fragen: Wie ist die Zahl mit x verbunden – durch Mal oder durch Plus? Die Antwort bestimmt die Gegenoperation.',
      'An der Waage vorführen: 3x heißt drei gleiche Päckchen. Um eines zu bekommen, teilt man durch drei; wegnehmen hilft nicht.',
      'Eine Sortierübung: Zehn Gleichungen, zu jeder nur die passende Umformung nennen, nicht rechnen.',
    ],
    werkzeug: { text: 'Stundenverlauf: Was das Gleichheitszeichen sagt', href: '/stunden/lineare-gleichungen-das-gleichheitszeichen' },
  },
  {
    thema: 'Lineare Gleichungssysteme',
    treffer: 'nur ein verfahren beherrscht',
    ursache:
      'Alle drei Verfahren führen zum Ziel, also genügt scheinbar eines. Dass sie unterschiedlich viel Arbeit machen – je nachdem, wie das System dasteht –, zeigt sich erst, wenn man vergleicht.',
    schritte: [
      'Dasselbe System mit allen drei Verfahren lösen lassen, in drei Gruppen. Die Gruppen vergleichen anschließend die Anzahl der Zeilen.',
      'Drei Systeme vorlegen, die je ein Verfahren nahelegen: eine Gleichung nach y aufgelöst (Einsetzen), gleiche Koeffizienten (Addition), beide nach y aufgelöst (Gleichsetzen).',
      'Die Auswahl als eigenen Arbeitsschritt einfordern: Vor dem Rechnen wird notiert, welches Verfahren gewählt wird und warum.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Drei Methoden', href: '/aufgaben/lineare-gleichungssysteme-drei-methoden' },
  },
  {
    thema: 'Lineare Gleichungssysteme',
    treffer: 'eine seite vergessen',
    ursache:
      'Die Multiplikation wird als Vorbereitungshandlung an einer Gleichung gedacht, nicht als Äquivalenzumformung. Damit gilt sie der Zeile, nicht der Aussage – und die rechte Seite bleibt stehen.',
    schritte: [
      'Denselben Fehler an einer einzelnen Gleichung vorführen: Aus x = 3 wird durch einseitiges Verdoppeln 2x = 3. Die Probe zeigt sofort, dass das nicht mehr stimmt.',
      'Den Faktor an den Rand schreiben und beim Aufschreiben der neuen Zeile beide Seiten laut mitsprechen.',
      'Nach dem Multiplizieren eine Zwischenprobe machen: Erfüllt die bisher bekannte Lösung noch beide Gleichungen?',
    ],
    werkzeug: { text: 'Gleichungswaage', href: '/werkzeuge/gleichungswaage.html' },
  },
  {
    thema: 'Lineare Gleichungssysteme',
    treffer: 'zwei einzelne lösungen',
    ursache:
      'x und y werden nacheinander bestimmt und dadurch als zwei getrennte Ergebnisse erlebt. Dass sie zusammen einen Punkt bilden, ist eine geometrische Deutung, die im Rechenweg nicht vorkommt.',
    schritte: [
      'Die Lösung konsequent als Paar aufschreiben: L = {(3 | 2)}. Ein einzelnes x ist keine Lösung eines Systems.',
      'Beide Geraden zeichnen und den Schnittpunkt markieren. Die Rechnung hat die Koordinaten dieses einen Punktes geliefert.',
      'Die Probe in beide Gleichungen verlangen, nicht nur in eine. Der Punkt muss auf beiden Geraden liegen.',
    ],
    werkzeug: { text: 'Stundenverlauf: Wenn nichts oder alles herauskommt', href: '/stunden/lineare-gleichungssysteme-drei-faelle' },
  },
  {
    thema: 'Logarithmen',
    treffer: 'wird mit $\\tfrac{a}{b}$ verwechselt',
    ursache:
      'Die tiefgestellte Basis sieht aus wie ein zweites Argument. Ohne die Übersetzung in die Potenzschreibweise bleibt log_a b ein Zeichenmuster mit zwei Zahlen – und Division ist die naheliegendste Deutung.',
    schritte: [
      'Jeden Logarithmus laut als Frage sprechen: log₂ 8 heißt „mit welchem Exponenten wird 2 zu 8?“. Die Antwort 3 hat mit 2 : 8 nichts zu tun.',
      'Jede Zeile doppelt schreiben lassen, als Potenz und als Logarithmus: 2³ = 8 und log₂ 8 = 3.',
      'Ein Gegenbeispiel rechnen: log₂ 8 ist 3, aber 2 : 8 ist 0,25. Der Unterschied ist nicht subtil.',
    ],
    werkzeug: { text: 'Stundenverlauf: Die Frage nach dem Exponenten', href: '/stunden/logarithmen-die-frage-nach-dem-exponenten' },
  },
  {
    thema: 'Logarithmen',
    treffer: 'unverbunden empfunden',
    ursache:
      'Beide Schreibweisen tauchen in verschiedenen Zusammenhängen auf – log im Sachkontext, ln in der Analysis. Dass sie sich nur um einen konstanten Faktor unterscheiden, wird selten gezeigt.',
    schritte: [
      'Am Taschenrechner nachrechnen lassen: ln 100 : log 100 ergibt etwa 2,3026 – und ln 1000 : log 1000 ergibt dieselbe Zahl.',
      'Diese Zahl als ln 10 identifizieren. Der Umrechnungsfaktor ist keine neue Konstante, sondern selbst ein Logarithmus.',
      'Die Basiswechselformel daraus ableiten statt sie anzusagen: log_a x = ln x : ln a. Sie erklärt zugleich, warum jeder Taschenrechner mit zwei Tasten auskommt.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Vom Faktor zur Zahl', href: '/aufgaben/logarithmen-vom-faktor-zur-zahl' },
  },
  {
    thema: 'Logarithmen',
    treffer: '\\log(0)',
    ursache:
      'Der Logarithmus wird als Rechenoperation gelesen, die auf jede Zahl anwendbar ist. Dass sein Definitionsbereich nur die positiven Zahlen umfasst, ergibt sich erst aus der Frage, die er stellt.',
    schritte: [
      'Die Frage stellen: Mit welchem Exponenten wird 10 zu null? Die Suche bleibt ergebnislos – Potenzen positiver Basen sind immer positiv.',
      'Eine Wertetabelle für kleiner werdende Argumente rechnen lassen: log 1 = 0, log 0,1 = −1, log 0,01 = −2. Die Werte fallen ohne Grenze, statt bei null anzukommen.',
      'Am Graphen die senkrechte Asymptote zeigen. Bei null existiert die Funktion nicht, sie hat dort keinen Wert – auch nicht den Wert null.',
    ],
    werkzeug: { text: 'Funktionenplotter', href: '/werkzeuge/funktionenplotter.html' },
  },
  {
    thema: 'Negative Zahlen',
    treffer: 'bei subtraktion mit negativen zahlen',
    ursache:
      'Beide Minuszeichen werden als dasselbe gelesen und die Beträge verrechnet. Dass das erste ein Rechenzeichen und das zweite ein Vorzeichen ist, steht der Schreibweise nicht an.',
    schritte: [
      'Am Zahlenstrahl abtragen: Von 5 aus drei Schritte nach rechts, weil eine Schuld weggenommen wird. Das Ergebnis ist 8.',
      'Eine Reihe rechnen lassen, in der nur der Subtrahend fällt: 5 − 2, 5 − 1, 5 − 0, 5 − (−1), 5 − (−2). Die Ergebnisse wachsen gleichmäßig weiter.',
      'Die beiden Minuszeichen mit verschiedenen Farben markieren, bis die Unterscheidung sitzt.',
    ],
    werkzeug: { text: 'Stundenverlauf: Die drei Bedeutungen des Minuszeichens', href: '/stunden/negative-zahlen-die-drei-bedeutungen-des-minus' },
  },
  {
    thema: 'Negative Zahlen',
    treffer: 'beim auflösen von klammern verschwindet das vorzeichen',
    ursache:
      'Das Minus wird als Vorsilbe des ersten Summanden gelesen. Dass es die ganze Klammer betrifft – also ein Umkehrzeichen ist –, ist eine dritte Bedeutung, die selten ausdrücklich eingeführt wird.',
    schritte: [
      'Mit Zahlen prüfen: 8 − (3 + 4) ist 1. Nach der falschen Regel käme 9 heraus.',
      'Die Klammer erst ausrechnen, dann ohne Klammer rechnen und beide Wege vergleichen. Zwei Wege zum selben Ergebnis sind das stärkste Argument.',
      'Als Multiplikation mit (−1) lesen: −(a + b) ist (−1) · (a + b). Dann greift das Distributivgesetz, und beide Vorzeichen drehen sich zwangsläufig.',
    ],
    werkzeug: { text: 'Stundenverlauf: Das Minus vor der Klammer', href: '/stunden/termumformungen-das-minus-vor-der-klammer' },
  },
  {
    thema: 'Prozentrechnung',
    treffer: 'wieder gleich',
    ursache:
      'Die beiden Änderungen sehen symmetrisch aus, haben aber verschiedene Grundwerte: Der zweite Schritt bezieht sich auf den bereits erhöhten Wert. Wer Prozente als absolute Zahlen denkt, kann diesen Wechsel nicht sehen.',
    schritte: [
      'Konkret durchrechnen: 100 → 120 → 96. Der Verlust von 20 % betrifft 120, nicht 100.',
      'Die Frage nach jedem Schritt stellen: 20 % – wovon? Die Antwort ändert sich zwischen den beiden Schritten, und das ist der ganze Punkt.',
      'Mit Faktoren rechnen statt mit Zu- und Abschlägen: 1,2 · 0,8 = 0,96. Das Ergebnis ist unabhängig vom Startwert und in einer Zeile sichtbar.',
    ],
    werkzeug: { text: 'Prozentstreifen', href: '/werkzeuge/prozentstreifen.html' },
  },
  {
    thema: 'Prozentrechnung',
    treffer: 'erhöhung um 25',
    ursache:
      'Berechnet wird der Zuwachs, aber gefragt ist der neue Wert. Der letzte Schritt – dazuzählen – fällt weg, weil das Ergebnis der Rechnung wie eine Antwort aussieht.',
    schritte: [
      'Am Streifen eintragen: Der neue Wert liegt rechts von der 100-%-Marke, bei 125 %. Der Zuwachs ist nur das Stück dazwischen.',
      'Immer beide Zahlen benennen lassen: Zuwachs und neuer Wert. Wer beide hinschreibt, verwechselt sie nicht.',
      'Den Vermehrungsfaktor als eigenständige Größe einführen: 1,25 statt „plus 25 %“. Eine Multiplikation, ein Ergebnis, keine Verwechslungsmöglichkeit.',
    ],
    werkzeug: { text: 'Diagnostische Fragen zum Vermehrungsfaktor', href: '/quizzes/prozentuale-veraenderung-vermehrungsfaktor' },
  },
  {
    thema: 'Prozentrechnung',
    treffer: 'reduktion',
    ursache:
      'Die Präpositionen „auf“ und „um“ unterscheiden sich um einen Buchstaben und in der Bedeutung um alles. Im Alltag werden sie zudem oft unsauber verwendet.',
    schritte: [
      'Beide Formulierungen an denselben Streifen legen: „auf 80 %“ markiert die Stelle 80, „um 80 %“ markiert die Stelle 20.',
      'Zehn Werbeaussagen sortieren lassen – nur nach „auf“ oder „um“, ohne zu rechnen.',
      'Die Faustregel notieren: „auf“ nennt den Rest, „um“ nennt die Änderung.',
    ],
    werkzeug: { text: 'Stundenverlauf: Was ist eigentlich das Ganze?', href: '/stunden/prozentrechnung-was-ist-das-ganze' },
  },
  {
    thema: 'Pythagoras',
    treffer: 'nicht-rechtwinklige dreiecke',
    ursache:
      'Der Satz wird als Formel über drei Seitenlängen gelernt. Die Voraussetzung steht im Satz, aber nicht in der Formel – und geübt wird an der Formel.',
    schritte: [
      'Ein Gegenbeispiel rechnen lassen: Ein Dreieck mit 4, 5, 6 ist nicht rechtwinklig, denn 16 + 25 ist 41, nicht 36.',
      'Vor jeder Anwendung den rechten Winkel in der Skizze markieren. Ohne markierten rechten Winkel wird nicht gerechnet.',
      'Die Umkehrung als eigenes Werkzeug einführen: Aus a² + b² = c² folgt, dass das Dreieck rechtwinklig ist. Dann ist die Voraussetzung selbst prüfbar.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Grundform und Anwendung', href: '/aufgaben/pythagoras-grundform-und-anwendung' },
  },
  {
    thema: 'Pythagoras',
    treffer: 'vermischt',
    ursache:
      'Beide Themen behandeln rechtwinklige Dreiecke und benutzen dieselben Skizzen. Was sie unterscheidet, ist die Frage: Pythagoras verbindet drei Seiten, die Trigonometrie verbindet Seiten mit einem Winkel.',
    schritte: [
      'Die Auswahlfrage voranstellen: Kommt in der Aufgabe ein Winkel vor? Wenn ja, Trigonometrie; wenn nein, Pythagoras.',
      'Zehn Aufgaben nur zuordnen lassen, ohne zu rechnen. Die Entscheidung ist die Übung.',
      'An einer Aufgabe zeigen, wo beides gebraucht wird – erst der Winkel, dann die dritte Seite. Dann ist die Unterscheidung kein Entweder-oder mehr.',
    ],
    werkzeug: { text: 'Stundenverlauf: Der Winkel entscheidet', href: '/stunden/trigonometrie-der-winkel-entscheidet' },
  },
  {
    thema: 'Quadratische Funktionen',
    treffer: 'streckungsfaktor',
    ursache:
      'In der Scheitelform stehen a und e beide als Zahlen neben dem Quadrat. Ohne die Einsicht, dass a multipliziert und e addiert wird, sind es zwei Zahlen an zwei Plätzen.',
    schritte: [
      'Am Schieberegler nur a verändern, e festhalten – und umgekehrt. Der Scheitel bleibt beim einen, wandert beim anderen.',
      'Den Wert an einer festen Stelle prüfen: Bei x = 1 neben dem Scheitel liefert a den Abstand nach oben. Das macht a messbar.',
      'Bei 0 < a < 1 innehalten: Die Parabel wird breiter, obwohl a positiv ist. Über die Breite entscheidet der Betrag von a.',
    ],
    werkzeug: { text: 'Stundenverlauf: Was die Scheitelform verrät', href: '/stunden/quadratische-funktionen-was-die-scheitelform-verraet' },
  },
  {
    thema: 'Quadratische Funktionen',
    treffer: 'muss* zwei nullstellen',
    ursache:
      'In den Übungsaufgaben haben Parabeln fast immer zwei Nullstellen, weil sich diese Aufgaben gut rechnen lassen. Aus der Häufung wird eine Regel.',
    schritte: [
      'Drei Parabeln zeichnen lassen: eine mit zwei, eine mit einer, eine ohne Nullstelle. Alle drei sind normale quadratische Funktionen.',
      'Am Schieberegler e verschieben und beobachten, wie zwei Nullstellen zu einer und dann zu keiner werden. Der Übergang ist der Scheitel auf der Achse.',
      'Die Lage des Scheitels als Kriterium formulieren: nach oben geöffnet und Scheitel über der x-Achse heißt keine Nullstelle.',
    ],
    werkzeug: { text: 'Funktionenplotter', href: '/werkzeuge/funktionenplotter.html' },
  },
  {
    thema: 'Quadratische Gleichungen',
    treffer: 'p-q-formel angesetzt',
    ursache:
      'Die p-q-Formel wird als das Verfahren für quadratische Gleichungen gelernt und deshalb reflexhaft angewandt. Dass es schnellere Wege gibt, steht nicht in der Formel.',
    schritte: [
      'Vor dem Rechnen drei Fragen stellen: Fehlt das absolute Glied (dann ausklammern)? Fehlt das lineare Glied (dann Wurzel ziehen)? Liegt eine binomische Struktur vor?',
      'Sechs Gleichungen vorlegen und nur den Lösungsweg wählen lassen, nicht rechnen.',
      'Bei x² − 9 = 0 beide Wege nebeneinanderstellen und die Zeilen zählen. Der Unterschied ist Argument genug.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Satz vom Nullprodukt', href: '/aufgaben/quadratische-gleichungen-satz-vom-nullprodukt' },
  },
  {
    thema: 'Quadratische Gleichungen',
    treffer: 'ohne reelle lösungen',
    ursache:
      'Eine Aufgabe ohne Ergebnis widerspricht der Schulerfahrung, dass jede gestellte Aufgabe eine Lösung hat. Die negative Diskriminante wird deshalb als eigener Fehler gedeutet.',
    schritte: [
      'Den Graphen zeichnen: Die Parabel schneidet die x-Achse nicht. Das ist eine Eigenschaft der Funktion, kein Rechenfehler.',
      'Die Diskriminante als Auskunft einführen, nicht als Zwischenergebnis: Ihr Vorzeichen sagt die Anzahl der Lösungen voraus, bevor gerechnet wird.',
      'Eine Sachaufgabe rechnen lassen, in der „keine Lösung“ die richtige Antwort ist – etwa eine Flugbahn, die eine bestimmte Höhe nie erreicht.',
    ],
    werkzeug: { text: 'Stundenverlauf: Warum die Null besonders ist', href: '/stunden/quadratische-gleichungen-warum-null-besonders-ist' },
  },
  {
    thema: 'Stochastik',
    treffer: 'mittelwert und median',
    ursache:
      'Beide heißen umgangssprachlich „Durchschnitt“ und liefern bei symmetrischen Daten fast dasselbe. Der Unterschied zeigt sich nur dort, wo Ausreißer im Spiel sind – und genau solche Daten kommen im Unterricht selten vor.',
    schritte: [
      'Einen Datensatz mit einem Ausreißer verwenden: 1, 2, 2, 3, 40. Mittelwert 9,6, Median 2. Keine der beiden Zahlen ist falsch, sie beantworten verschiedene Fragen.',
      'Den Ausreißer verändern und beide Kennzahlen neu berechnen. Der Mittelwert wandert mit, der Median bleibt stehen.',
      'Die Leitfrage stellen: Wollen wir wissen, wie viel jeder bekäme (Mittelwert), oder was der Typische ist (Median)?',
    ],
    werkzeug: { text: 'Diagnostische Fragen: Mittelwert und Median', href: '/quizzes/statistik-mittelwert-median-spannweite' },
  },
  {
    thema: 'Stochastik',
    treffer: 'erwartungswert wird als garantie',
    ursache:
      'Der Erwartungswert wird als Vorhersage gelesen statt als langfristiger Mittelwert. Der Name legt genau diese Fehldeutung nahe.',
    schritte: [
      'Die Klasse tatsächlich 100-mal werfen lassen, verteilt auf Paare. Kein Paar trifft genau 50; die Streuung ist die Beobachtung.',
      'Alle Ergebnisse zusammenzählen und die relative Häufigkeit über die ganze Klasse bilden. Sie liegt näher an 0,5 als jedes Einzelergebnis.',
      'Zwei Spalten führen: absolute Abweichung und relative Häufigkeit. Die eine wächst mit der Wurfzahl, die andere fällt.',
    ],
    werkzeug: { text: 'Zufallsexperimente', href: '/werkzeuge/zufallsexperimente.html' },
  },
  {
    thema: 'Strahlensätze',
    treffer: 'zwei separate sätze',
    ursache:
      'V- und X-Figur sehen verschieden aus und werden meist nacheinander eingeführt. Dass die X-Figur nur eine über den Scheitel hinaus verlängerte V-Figur ist, sieht man erst, wenn man sie ineinander überführt.',
    schritte: [
      'Eine V-Figur zeichnen und beide Strahlen über den Scheitel hinaus verlängern. Die X-Figur entsteht dabei, ohne dass etwas Neues dazukommt.',
      'In beiden Figuren dieselbe Farbregel anwenden: alles auf dem ersten Strahl rot, alles auf dem zweiten blau. Die Verhältnisgleichung sieht danach gleich aus.',
      'Die Frage, ob V oder X vorliegt, ausdrücklich als überflüssig kennzeichnen: Entscheidend ist, was vom Scheitel aus gemessen wird.',
    ],
    werkzeug: { text: 'Stundenverlauf: Was gehört zu was?', href: '/stunden/strahlensaetze-was-zu-was-gehoert' },
  },
  {
    thema: 'Strahlensätze',
    treffer: 'parallele schnittgeraden',
    ursache:
      'In allen Übungsfiguren sind die Schnittgeraden parallel, oft ohne Markierung. Was immer erfüllt ist, wird nicht als Bedingung wahrgenommen.',
    schritte: [
      'Eine Figur mit nicht parallelen Schnittgeraden vorlegen und nachmessen lassen. Die Verhältnisse stimmen nicht mehr.',
      'Die Parallelität in jeder Skizze mit Pfeilen markieren, bevor gerechnet wird – so wie man den rechten Winkel markiert.',
      'Bei Sachaufgaben ausdrücklich prüfen, woher die Parallelität kommt: beim Schattenwurf aus den parallelen Sonnenstrahlen.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Zwei Figuren, eine Idee', href: '/aufgaben/strahlensaetze-zwei-figuren-eine-idee' },
  },
  {
    thema: 'Strahlensätze',
    treffer: 'mythos',
    ursache:
      'Aus zwei Beispielaufgaben, in denen es zufällig so ausging, wird eine Regel gebildet. Solche selbst gebauten Regeln sind hartnäckig, weil sie aus eigener Beobachtung stammen.',
    schritte: [
      'Ein Gegenbeispiel rechnen: eine X-Figur, in der addiert werden muss. Ein Fall genügt, um die Regel zu erledigen.',
      'Statt einer Regel die Frage einführen: Welche Strecke ist vom Scheitel aus gemessen, welche nicht? Danach ergibt sich, was zusammengezählt wird.',
      'In der Skizze immer die vollständige Strecke vom Scheitel aus nachziehen. Wer sie sieht, muss nicht raten.',
    ],
    werkzeug: { text: 'Übungsgenerator Strahlensätze', href: '/uebung/strahlensaetze' },
  },
  {
    thema: 'Termumformungen',
    treffer: 'definitionsbereich wird nicht bestimmt',
    ursache:
      'Bei Termen ohne Gleichheitszeichen scheint es nichts zu lösen und damit nichts zu prüfen zu geben. Dass ein Bruchterm für manche Werte gar nicht existiert, ist eine Aussage über den Term selbst – und wird deshalb übersehen.',
    schritte: [
      'Einen Term einsetzen lassen, der für x = 2 nicht definiert ist. Der Taschenrechner meldet einen Fehler; das ist die Antwort.',
      'Den Definitionsbereich als Teil der Termangabe schreiben, nicht als Zusatz: 1/(x−2) für x ≠ 2.',
      'Vor jedem Kürzen prüfen: Der weggekürzte Faktor darf nicht null werden. Aus (x²−4)/(x−2) wird x + 2, aber nur für x ≠ 2.',
    ],
    werkzeug: { text: 'Aufgabenfolge Bruchterme', href: '/aufgaben/bruchterme-kuerzen-und-addieren' },
  },
  {
    thema: 'Termumformungen',
    treffer: 'kein gemeinsamer nenner',
    ursache:
      'Bei Zahlenbrüchen ist der Hauptnenner geübt; bei Termen sieht die Aufgabe anders aus, und die Regel wird nicht wiedererkannt. Die Buchstaben verdecken die bekannte Struktur.',
    schritte: [
      'Denselben Aufbau mit Zahlen und mit Buchstaben nebeneinanderlegen: 1/2 + 1/3 und 1/a + 1/b. Der Weg ist identisch.',
      'Beide Nenner faktorisieren und den Hauptnenner als Produkt der verschiedenen Faktoren aufschreiben, bevor gerechnet wird.',
      'Die Probe mit einer eingesetzten Zahl: Für x = 3 müssen Ausgangs- und Ergebnisterm denselben Wert liefern.',
    ],
    werkzeug: { text: 'Bruchstreifen', href: '/werkzeuge/bruchstreifen.html' },
  },
  {
    thema: 'Termumformungen',
    treffer: 'über kreuz multiplizieren',
    ursache:
      'Das Kreuzmultiplizieren ist eine Umformung von Gleichungen. Bei einem Term gibt es nichts umzuformen – es fehlt die zweite Seite. Ohne den Unterschied zwischen Term und Gleichung wird das Verfahren übertragen.',
    schritte: [
      'Term und Gleichung nebeneinanderschreiben und die Frage stellen: Wo steht hier ein Gleichheitszeichen? Nur dort darf man beide Seiten verändern.',
      'Sortierübung: Zehn Ausdrücke, nur entscheiden, ob es ein Term oder eine Gleichung ist.',
      'An einem Term vorführen, wohin das Kreuzmultiplizieren führt: Der Wert ändert sich. Die Probe mit einer Zahl zeigt es in Sekunden.',
    ],
    werkzeug: { text: 'Stundenverlauf zu Bruchgleichungen', href: '/stunden/bruchgleichungen-die-probe-ist-nicht-optional' },
  },
  {
    thema: 'Trigonometrie',
    treffer: 'verwechselt',
    ursache:
      'Die Hochstellung −1 bedeutet bei Zahlen den Kehrwert. Dass sie bei Funktionen die Umkehrfunktion meint, ist eine andere Verwendung desselben Zeichens – ein echter Mangel der Notation, kein Denkfehler.',
    schritte: [
      'Den Unterschied ausdrücklich benennen und beide am Taschenrechner nachrechnen: sin⁻¹(0,5) ergibt 30, 1 : sin(0,5) etwas ganz anderes.',
      'Konsequent „Arkussinus“ sagen statt „sin hoch minus eins“. Die Sprechweise trennt, was die Schreibweise vermischt.',
      'Die Frage voranstellen: Suche ich eine Seite oder einen Winkel? Nur bei einem gesuchten Winkel kommt die Umkehrfunktion infrage.',
    ],
    werkzeug: { text: 'Diagnostische Fragen: sin, cos, tan', href: '/quizzes/trigonometrie-sin-cos-tan' },
  },
  {
    thema: 'Trigonometrie',
    treffer: 'winkel über 90',
    ursache:
      'Die Definition am rechtwinkligen Dreieck ist die einzige, die eingeführt wurde. Da es dort keine stumpfen Winkel gibt, fehlt für sie schlicht eine Grundlage – und die vorhandene wird weiterverwendet.',
    schritte: [
      'Am Einheitskreis zeigen, dass Sinus und Kosinus dort für jeden Winkel erklärt sind – als Koordinaten eines Punktes, nicht als Seitenverhältnis.',
      'Die Werte für 30°, 150° und 210° vergleichen lassen. Der Sinus ist zweimal gleich, der Kosinus nicht.',
      'Für Dreiecke mit stumpfem Winkel auf Sinus- und Kosinussatz verweisen. Das rechtwinklige Dreieck ist der Sonderfall, nicht der Normalfall.',
    ],
    werkzeug: { text: 'Übungsgenerator Trigonometrie', href: '/uebung/trigonometrie' },
  },
  {
    thema: 'Trigonometrie',
    treffer: 'ohne bedingung eingesetzt',
    ursache:
      'Beide Sätze stehen in derselben Formelsammlung und betreffen Dreiecke. Welcher wann gilt, steht dort als Voraussetzung – aber Voraussetzungen werden beim Nachschlagen überlesen.',
    schritte: [
      'Eine Auswahltabelle anlegen: Pythagoras nur bei rechtem Winkel, Sinussatz bei Seite und Gegenwinkel, Kosinussatz bei zwei Seiten und Zwischenwinkel.',
      'Zehn Aufgaben nur zuordnen lassen, ohne zu rechnen. Die Entscheidung ist der Lerngegenstand.',
      'Bei jeder Aufgabe zuerst notieren, was gegeben ist. Die Auswahl ergibt sich dann fast von selbst.',
    ],
    werkzeug: { text: 'Aufgabenfolge: Welche Seite ist welche', href: '/aufgaben/trigonometrie-welche-seite-ist-welche' },
  },
  {
    thema: 'Wurzelrechnung',
    treffer: 'ohne betragszeichen',
    ursache:
      'Für positive Zahlen stimmt die Vereinfachung, und mit positiven Zahlen wird fast ausschließlich geübt. Der negative Fall kommt so selten vor, dass die Einschränkung nicht mitgelernt wird.',
    schritte: [
      'Mit a = −3 rechnen lassen: Die Wurzel aus 9 ist 3, nicht −3. Ein Gegenbeispiel genügt.',
      'Die Wurzel als „die nichtnegative Lösung“ definieren und diese Eigenschaft in die Merkzeile schreiben.',
      'Die korrekte Fassung notieren: die Wurzel aus a² ist der Betrag von a. Für a ≥ 0 fällt der Betrag weg – deshalb funktioniert die kurze Form meistens.',
    ],
    werkzeug: { text: 'Diagnostische Fragen: Quadratwurzeln', href: '/quizzes/quadratwurzeln-typische-fehlvorstellungen' },
  },
  {
    thema: 'Wurzelrechnung',
    treffer: 'die negative wird vergessen',
    ursache:
      'Gleichung und Wurzelziehen werden gleichgesetzt. Die Wurzel liefert genau einen Wert, die Gleichung hat aber zwei Lösungen – der Schritt vom einen zum anderen wird selten ausgesprochen.',
    schritte: [
      'Beide Zahlen einsetzen lassen: 3² ist 9 und (−3)² ist ebenfalls 9. Beide erfüllen die Gleichung.',
      'Die Parabel zeichnen und die Höhe 9 einzeichnen. Es gibt zwei Schnittpunkte, links und rechts.',
      'Die Schreibweise x = ±3 einführen und begründen: Das Plusminus gehört zur Gleichung, nicht zum Wurzelsymbol.',
    ],
    werkzeug: { text: 'Funktionenplotter', href: '/werkzeuge/funktionenplotter.html' },
  },
  {
    thema: 'Wurzelrechnung',
    treffer: 'irgendwie negativ möglich',
    ursache:
      'Aus der Erfahrung mit x² = 9 (zwei Lösungen) wird geschlossen, dass auch das Wurzelsymbol zwei Werte liefert. Die Unterscheidung zwischen Gleichung und Funktionswert fehlt.',
    schritte: [
      'Die Festlegung begründen, nicht behaupten: Eine Funktion darf zu einem Eingabewert nur einen Wert liefern. Deshalb wurde die nichtnegative Lösung gewählt.',
      'Am Graphen zeigen: Die Wurzelfunktion liegt vollständig über der x-Achse. Ein zweiter Ast würde die Eindeutigkeit zerstören.',
      'Beides nebeneinanderstellen: Die Wurzel aus 9 ist 3. Die Gleichung x² = 9 hat die Lösungen 3 und −3. Zwei verschiedene Fragen, zwei verschiedene Antworten.',
    ],
    werkzeug: { text: 'Stundenverlauf: Was erlaubt ist und was nicht', href: '/stunden/wurzeln-was-erlaubt-ist-und-was-nicht' },
  },
];

/** Findet das Gegenmittel zu einer Fehlvorstellung, falls eines hinterlegt ist. */
export function findeGegenmittel(thema: string, fehlvorstellung: string): Gegenmittel | undefined {
  const text = fehlvorstellung.toLowerCase().replace(/\s+/g, ' ');
  return gegenmittel.find(
    (g) => g.thema === thema && text.includes(g.treffer.toLowerCase())
  );
}
