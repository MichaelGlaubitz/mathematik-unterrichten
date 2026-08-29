---
titel: "Pythagoras – Grundform und Anwendung"
thema: "Pythagoras"
klassenstufe: ["9", "10"]
schwierigkeit: mittel
didaktischerHinweis: "Eine Aufgabenfolge, die den Satz des Pythagoras systematisch von der nackten Berechnung zur Anwendung führt – inklusive Aufgaben, in denen das rechtwinklige Dreieck erst *gefunden* werden muss. Die größte Hürde ist nicht die Formel, sondern das Erkennen der Geometrie. Diese Folge übt genau das."
ziel: 'Die Schüler finden das rechtwinklige Dreieck – auch dort, wo es nicht eingezeichnet ist.'
variation: 'Folge A rechnet die Hypotenuse, Folge B stellt um, Folge D lässt das Dreieck erst suchen, Folge E kehrt den Satz um.'
stolperstelle: 'Die Hypotenuse wird nach Lage bestimmt statt nach dem rechten Winkel gegenüber.'
regie:
  - 'Wo ist der rechte Winkel – und welche Seite liegt ihm gegenüber?'
  - 'Bevor du rechnest: Ist das Ergebnis größer als die längste gegebene Seite?'
  - 'Wer zeigt das rechtwinklige Dreieck in dieser Sachaufgabe?'
tags: ["pythagoras", "geometrie", "rechtwinkliges-dreieck", "variation-theory"]
datum: 2026-05-25
entwurf: false
---

## Vorbemerkung für die Schüler

Der **Satz des Pythagoras** sagt: In einem rechtwinkligen Dreieck mit den Katheten $a$, $b$ und der Hypotenuse $c$ gilt:

$a^{2} + b^{2} = c^{2}$

Die *Hypotenuse* ist die Seite, die dem rechten Winkel gegenüberliegt – sie ist immer die längste der drei Seiten. Die *Katheten* sind die beiden kürzeren Seiten, die den rechten Winkel bilden.

Pythagoras gilt **nur** in rechtwinkligen Dreiecken. Wenn das Dreieck nicht rechtwinklig ist, gilt die Formel nicht – und die Aufgabe lässt sich oft erst lösen, wenn man das rechtwinklige Dreieck *erst einzeichnet*.

## Folge A: Hypotenuse berechnen (Standardform)

Beide Katheten sind gegeben. Die Hypotenuse wird gesucht.

| Nr. | Katheten | Hypotenuse |
|----:|:---------|:-----------|
| 1 | $a = 3, b = 4$ | $c = 5$ |
| 2 | $a = 6, b = 8$ | $c = 10$ |
| 3 | $a = 5, b = 12$ | $c = 13$ |
| 4 | $a = 9, b = 12$ | $c = 15$ |
| 5 | $a = 8, b = 15$ | $c = 17$ |
| 6 | $a = 7, b = 24$ | $c = 25$ |

## Folge B: Kathete berechnen (Umstellen)

Hypotenuse und eine Kathete sind gegeben. Die andere Kathete wird gesucht. Stelle die Formel zuerst um: $b = \sqrt{c^{2} - a^{2}}$.

| Nr. | Gegeben | Gesucht | Lösung |
|----:|:--------|:--------|:-------|
| 7 | $a = 3, c = 5$ | $b$ | $b = 4$ |
| 8 | $a = 5, c = 13$ | $b$ | $b = 12$ |
| 9 | $a = 6, c = 10$ | $b$ | $b = 8$ |
| 10 | $a = 8, c = 17$ | $b$ | $b = 15$ |
| 11 | $a = 9, c = 15$ | $b$ | $b = 12$ |
| 12 | $a = 1, c = \sqrt{2}$ | $b$ | $b = 1$ |

## Folge C: Kein „schönes“ Ergebnis

Hier sind die Werte so gewählt, dass das Ergebnis nicht ganzzahlig ist. Du musst die Wurzel exakt stehen lassen oder dezimal runden.

| Nr. | Aufgabe | Lösung |
|----:|:--------|:-------|
| 13 | Katheten 2 und 3 | $c = \sqrt{13} \approx  3{,}61$ |
| 14 | Katheten 1 und 2 | $c = \sqrt{5} \approx  2{,}24$ |
| 15 | Hypotenuse 5, Kathete 3 (suche andere Kathete) | $b = 4$ |
| 16 | Hypotenuse 4, Kathete 3 (suche andere Kathete) | $b = \sqrt{7} \approx  2{,}65$ |
| 17 | Katheten 7 und 8 | $c = \sqrt{113} \approx  10{,}63$ |
| 18 | Hypotenuse √10, Kathete 1 (suche andere Kathete) | $b = 3$ |

## Folge D: Anwendungen – das rechtwinklige Dreieck *finden*

Hier wird der Pythagoras nicht direkt benannt – du musst zuerst entscheiden, *welche* drei Punkte ein rechtwinkliges Dreieck bilden, und welche Strecken die Katheten und die Hypotenuse sind.

| Nr. | Aufgabe | Lösungsidee |
|----:|:--------|:------------|
| 19 | Eine Leiter ist 5 m lang. Sie steht 1,5 m von der Wand entfernt. Wie hoch reicht sie? | Wand und Boden bilden den rechten Winkel. Leiter = Hypotenuse, Bodenabstand = eine Kathete, Höhe = andere Kathete: √(5² − 1,5²) = √22,75 ≈ 4,77 m. |
| 20 | Wie lang ist die Diagonale eines Rechtecks mit Seitenlängen 6 cm und 8 cm? | Diagonale = Hypotenuse im rechtwinkligen Dreieck mit Katheten 6 und 8: c = √(36 + 64) = √100 = 10 cm. |
| 21 | Wie lang ist die Diagonale eines Quadrats mit Seitenlänge 4 cm? | Katheten beide gleich der Quadratseite: c = √(16 + 16) = √32 = 4√2 ≈ 5,66 cm. |
| 22 | Ein gleichseitiges Dreieck hat Seitenlänge 6 cm. Wie hoch ist es? | Halbiere die Grundseite. Die Höhe bildet mit der halben Grundseite und einer Schenkelseite ein rechtwinkliges Dreieck: h = √(6² − 3²) = √27 = 3√3 ≈ 5,20 cm. |
| 23 | Ein Punkt P(3 / 4) liegt im Koordinatensystem. Wie weit ist er vom Ursprung entfernt? | Strecke = Hypotenuse, x-Differenz und y-Differenz = Katheten: √(3² + 4²) = √25 = 5. |
| 24 | Zwei Punkte: A(2 / 1) und B(7 / 13). Wie weit sind sie voneinander entfernt? | $Δx = 5, Δy = 12: d = \sqrt{5^{2} + 12^{2}} = \sqrt{169} = 13.$ |

## Folge E: Umkehrung – Ist das Dreieck rechtwinklig?

Drei Seitenlängen sind gegeben. Prüfe, ob das Dreieck rechtwinklig ist (Umkehrung des Satzes des Pythagoras: Wenn $a^{2} + b^{2} = c^{2}$, dann ist das Dreieck rechtwinklig).

| Nr. | Seitenlängen | Rechtwinklig? |
|----:|:-------------|:--------------|
| 25 | $5, 12, 13$ | Ja, denn 25 + 144 = 169 = 13². |
| 26 | $4, 5, 6$ | Nein, denn 16 + 25 = 41 ≠ 36 = 6². |
| 27 | $9, 12, 15$ | Ja (3-4-5-Tripel ·3). |
| 28 | $6, 8, 11$ | Nein, denn 36 + 64 = 100 ≠ 121. |
| 29 | $1, 1, \sqrt{2}$ | Ja, denn 1 + 1 = 2 = (√2)². |
| 30 | $7, 24, 25$ | Ja, denn 49 + 576 = 625 = 25². |

## Reflexionsfragen

1. In Folge A bilden alle Tripel (3,4,5), (6,8,10), (5,12,13)... ganzzahlige Lösungen. Solche heißen *pythagoreische Tripel*. Welche entdeckst du, wenn du (3,4,5) verdoppelst, verdreifachst, vervierfachst?
2. Vergleiche Aufgabe 23 und 24: Welche Größen müssen sich ändern, wenn nicht der Ursprung, sondern ein anderer Punkt der Bezugspunkt ist?
3. In Aufgabe 22 wird der Pythagoras für eine Höhenberechnung verwendet, in Aufgabe 19 für eine Wandberechnung, in Aufgabe 20 für eine Diagonale. Was haben alle gemeinsam?
4. Aufgabe 26 ergibt *kein* rechtwinkliges Dreieck. Wie kannst du dir die Form dieses Dreiecks (im Vergleich zu (5,6,7) und (4,5,6)) vorstellen – stumpf-, recht- oder spitzwinklig?
5. Was *kann* der Satz des Pythagoras alles? Was *kann er nicht* (welche Aufgaben braucht andere Werkzeuge)?

## Didaktischer Kommentar

**Der Kern.** Der Satz des Pythagoras ist mathematisch trivial – die schwierige Operation ist nicht das Anwenden der Formel, sondern das *Erkennen* eines rechtwinkligen Dreiecks in einer Figur, in der es nicht offensichtlich ist. Diese Aufgabenfolge geht den Weg von der reinen Berechnung (A, B, C) zum diagnostisch-geometrischen Sehen (D, E).

**Was variiert in Folge A?**
Das Berechnungsverfahren bleibt identisch; nur die Zahlen ändern sich. Schüler sehen die Familie der pythagoreischen Tripel und entwickeln ein Gefühl dafür, dass „schöne“ Antworten oft systematisch sind (Vielfache von (3,4,5), (5,12,13), (8,15,17)).

**Was variiert in Folge B?**
Hier wird die Formel umgestellt. Wer nur a² + b² = c² als „Mantra“ gelernt hat, scheitert hier. Die Operation ist algebraisch trivial, aber die Verschiebung der Variablen-Rolle (statt c gesucht, jetzt b) ist für viele eine Hürde. Aufgabe 12 ist bewusst mit Wurzeln gebaut: Schüler sehen, dass die Rollen unabhängig vom Zahlentyp sind.

**Was variiert in Folge C?**
Die Forderung nach exakter und gerundeter Ergebnisangabe. Die meisten Schüler in Klasse 9 sind in Folge A glücklich, weil das Ergebnis ganzzahlig herauskommt. Folge C zwingt sie, zwischen exakten und genäherten Antworten zu unterscheiden – eine Kompetenz, die in der Oberstufe fortlaufend wichtig wird.

**Was variiert in Folge D?**
Hier wird das *Übersetzen* von einem Sachkontext oder einer Figur in das rechtwinklige Dreieck geübt. Aufgabe 22 ist diagnostisch wertvoll: Schüler, die das gleichseitige Dreieck in der Mitte halbieren und damit ein rechtwinkliges erzeugen, haben den Pythagoras *als Werkzeug* internalisiert. Wer die Halbierung nicht von selbst sieht, braucht Hilfsfragen.

**Was variiert in Folge E?**
Die Umkehrung. Schüler erleben, dass die Beziehung $a^{2} + b^{2} = c^{2}$ *charakteristisch* für rechtwinklige Dreiecke ist, nicht nur eine Folgerung daraus. Das ist eine subtilere Aussage und der erste Schritt in Richtung „äquivalent“ und „notwendig & hinreichend“.

**Häufige Fehlvorstellungen**

- *„a² + b² = c² gilt immer.“* Klassisch übergangenes „rechtwinklig“. Hilft: Aufgabe 26 ausführlich besprechen, mit Skizze.
- *„Hypotenuse = die längste Seite, also rechne ich immer a² + b² = c².“* Aufgabe in Folge B bricht das auf – wenn die Hypotenuse gegeben ist, muss die Formel umgestellt werden.
- *„Kathete und Hypotenuse sind dasselbe wie Ankathete/Gegenkathete.“* Begriffsverwechslung mit der Trigonometrie. Pythagoras kennt nur Katheten und Hypotenuse; die trigonometrischen Bezeichnungen kommen erst, wenn ein bestimmter Winkel im Spiel ist.
- *„Der Pythagoras hilft mir bei *jedem* Dreieck.“* Nein – nur beim rechtwinkligen. Bei beliebigen Dreiecken braucht man Sinus- oder Kosinussatz (Klasse 10/11).

**Möglicher Anschluss**

- Aufgabenfolge zu Strahlensätzen (Geometrie 9/10).
- Diagnostische Fragen zu typischen Pythagoras-Anwendungsfehlern.
- Aufgaben zur räumlichen Anwendung des Satzes (Pythagoras in der Pyramide, im Quader).
