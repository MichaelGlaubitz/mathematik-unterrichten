---
titel: "Trigonometrie – welche Seite ist welche?"
thema: "Trigonometrie"
klassenstufe: ["9", "10"]
schwierigkeit: mittel
didaktischerHinweis: "Ankathete und Gegenkathete sind keine Eigenschaften einer Seite, sondern einer Seite *bezogen auf einen Winkel*. Wer das nicht trennt, scheitert, sobald der Winkel wechselt. Folge A übt deshalb ausschließlich das Benennen – ohne jede Rechnung. Erst Folge B rechnet, und Folge C dreht dieselbe Figur, damit die Benennungen wandern."
ziel: 'Die Schüler benennen Ankathete und Gegenkathete bezogen auf den Winkel – bevor sie rechnen.'
variation: 'Folge A benennt nur, ohne zu rechnen. Folge C zeigt dieselbe Figur mit dem anderen Winkel: Die Seiten tauschen ihre Rolle.'
stolperstelle: 'Ankathete und Gegenkathete werden als Eigenschaften der Seite behandelt statt als Beziehung zum Winkel.'
regie:
  - 'Von welchem Winkel aus schauen wir gerade?'
  - 'Bevor du rechnest: Wird das Ergebnis größer oder kleiner als die Hypotenuse?'
  - 'Wer erklärt, was sich ändert, wenn wir den anderen Winkel nehmen?'
tags: ["trigonometrie", "sinus", "kosinus", "tangens", "rechtwinkliges-dreieck", "variation-theory"]
datum: 2026-08-28
entwurf: false
---

## Vorbemerkung für die Schüler

Im rechtwinkligen Dreieck heißen die Seiten – **bezogen auf einen bestimmten Winkel** $α$:

- **Hypotenuse:** die Seite gegenüber dem rechten Winkel. Sie ist immer die längste und hängt nicht von $α$ ab.
- **Gegenkathete von α:** die Seite, die dem Winkel $α$ gegenüberliegt.
- **Ankathete von α:** die Seite, die am Winkel $α$ anliegt (und nicht die Hypotenuse ist).

Daraus die drei Verhältnisse:

$\sin α = Gegenkathete : Hypotenuse$ $\cos α = Ankathete : Hypotenuse$ $\tan α = Gegenkathete : Ankathete$

**Der entscheidende Satz:** Wechselt der Winkel, tauschen Ankathete und Gegenkathete die Rollen. Die Seite bleibt dieselbe, ihr Name ändert sich.

## Folge A: Nur benennen, nicht rechnen

Gegeben ist ein rechtwinkliges Dreieck $ABC$ mit dem rechten Winkel bei $C$. Die Seiten heißen wie üblich $a$ (gegenüber A), $b$ (gegenüber B), $c$ (gegenüber C).

| Nr. | Frage | Antwort |
|----:|:------|:--------|
| 1 | Welche Seite ist die Hypotenuse? | $c$ |
| 2 | Welche Seite ist die Gegenkathete von α (Winkel bei A)? | $a$ |
| 3 | Welche Seite ist die Ankathete von α? | $b$ |
| 4 | Welche Seite ist die Gegenkathete von β (Winkel bei B)? | $b$ |
| 5 | Welche Seite ist die Ankathete von β? | $a$ |
| 6 | Welche Seite ist die Hypotenuse bezogen auf β? | c – die Hypotenuse hängt nicht vom Winkel ab |

*Frage nach Nr. 6:* Die Seite $a$ ist einmal Gegenkathete und einmal Ankathete. Wovon hängt es ab?

## Folge B: Eine Seite berechnen

Rechtwinkliges Dreieck, rechter Winkel bei $C$. Runde auf eine Nachkommastelle.

| Nr. | Gegeben | Gesucht | Lösung |
|----:|:--------|:--------|:-------|
| 7 | $α = 30^{\circ}, c = 10$ | $a$ | $a = 10 \cdot  \sin 30^{\circ} = 5{,}0$ |
| 8 | $α = 30^{\circ}, c = 10$ | $b$ | $b = 10 \cdot  \cos 30^{\circ} \approx  8{,}7$ |
| 9 | $α = 40^{\circ}, c = 10$ | $a$ | $a \approx  6{,}4$ |
| 10 | $α = 40^{\circ}, b = 10$ | $a$ | $a = 10 \cdot  \tan 40^{\circ} \approx  8{,}4$ |
| 11 | $α = 60^{\circ}, a = 6$ | $c$ | $c = 6 : \sin 60^{\circ} \approx  6{,}9$ |
| 12 | $α = 25^{\circ}, a = 4$ | $b$ | $b = 4 : \tan 25^{\circ} \approx  8{,}6$ |

*Frage nach Nr. 12:* In den Aufgaben 7 bis 9 wird multipliziert, in 11 und 12 dividiert. Woran erkennt man vorher, was zu tun ist?

## Folge C: Dieselbe Figur, anderer Winkel

Ein rechtwinkliges Dreieck mit $a = 3$, $b = 4$, $c = 5$ (rechter Winkel bei $C$).

| Nr. | Frage | Lösung |
|----:|:------|:-------|
| 13 | $\sin α$ | $3 : 5 = 0{,}6$ |
| 14 | $\cos α$ | $4 : 5 = 0{,}8$ |
| 15 | $\tan α$ | $3 : 4 = 0{,}75$ |
| 16 | $\sin β$ | $4 : 5 = 0{,}8$ |
| 17 | $\cos β$ | $3 : 5 = 0{,}6$ |
| 18 | $\tan β$ | $4 : 3 \approx  1{,}33$ |

*Frage nach Nr. 18:* Vergleiche Nr. 13 mit Nr. 17 und Nr. 14 mit Nr. 16. Was fällt auf? Was bedeutet das für den Zusammenhang von α und β?

## Folge D: Winkel berechnen

Jetzt sind zwei Seiten gegeben, gesucht ist der Winkel. Runde auf ganze Grad.

| Nr. | Gegeben | Gesucht | Lösung |
|----:|:--------|:--------|:-------|
| 19 | $a = 3, c = 5$ | α | sin α = 0,6, also α ≈ 37° |
| 20 | $b = 4, c = 5$ | α | cos α = 0,8, also α ≈ 37° |
| 21 | $a = 3, b = 4$ | α | tan α = 0,75, also α ≈ 37° |
| 22 | $a = 5, c = 13$ | α | sin α ≈ 0,385, also α ≈ 23° |
| 23 | $a = 8, b = 6$ | α | tan α ≈ 1,333, also α ≈ 53° |
| 24 | $a = 1, b = 1$ | α | tan α = 1, also α = 45° |

*Frage nach Nr. 24:* Die Aufgaben 19, 20 und 21 beschreiben dasselbe Dreieck und liefern denselben Winkel. Welche der drei Rechnungen würde wählen, wene sich eine aussuchen dürften?

## Folge E: Anwendungen

| Nr. | Aufgabe | Lösungsidee |
|----:|:--------|:------------|
| 25 | Eine 6 m lange Leiter lehnt im Winkel von 70° zum Boden an der Wand. Wie hoch reicht sie? | Höhe = Gegenkathete: 6 · sin 70° ≈ 5,6 m. |
| 26 | Wie weit steht der Fuß dieser Leiter von der Wand entfernt? | Abstand = Ankathete: 6 · cos 70° ≈ 2,1 m. |
| 27 | Eine Straße steigt auf 100 m Horizontalstrecke um 12 m. Wie groß ist der Steigungswinkel? | tan α = 12 : 100 = 0,12, also α ≈ 6,8°. |
| 28 | Ein Turm wirft aus 40 m Entfernung einen Sehwinkel von 32° zur Spitze. Wie hoch ist er? | Höhe = 40 · tan 32° ≈ 25,0 m. |
| 29 | Ein Drachen an 50 m Schnur steht unter 55° über dem Boden. Wie hoch fliegt er? | $50 \cdot  \sin 55^{\circ} \approx  41{,}0 m.$ |
| 30 | Eine Rampe soll 1,2 m Höhe überwinden und höchstens 6° steil sein. Wie lang muss sie mindestens sein? | Länge = 1,2 : sin 6° ≈ 11,5 m. |

## Reflexionsfragen

1. Warum ist es sinnlos zu fragen: „Ist $a$ die Ankathete?" – ohne einen Winkel zu nennen?
2. In Folge C gilt $\sin α = \cos β$. Begründe das mit der Figur, nicht mit der Formel.
3. Warum kann der Sinus eines Winkels im rechtwinkligen Dreieck nie größer als 1 werden? Der Tangens aber schon?
4. In Aufgabe 27 wird eine Steigung von 12 % beschrieben. Warum ist der Winkel nicht 12°?
5. Welche der drei Funktionen brauche, wenn Hypotenuse und Gegenkathete gegeben sind und der Winkel gesucht ist?

## Didaktischer Kommentar

**Der Kern.** Die Begriffe Ankathete und Gegenkathete sind relational: Sie beschreiben nicht die Seite, sondern das Verhältnis der Seite zu einem gewählten Winkel. Genau diese Relationalität geht verloren, wenn im Unterricht immer dasselbe Dreieck in derselben Lage mit demselben markierten Winkel gezeigt wird. Die Klasse lernt dann eine Zuordnung von Position zu Namen – und scheitert, sobald das Dreieck gedreht wird.

**Was variiert in Folge A?** Nur der Bezugswinkel; die Figur bleibt gleich. Es wird ausdrücklich nicht gerechnet. Diese Trennung ist wichtig: Solange die Benennung unsicher ist, produziert jedes Rechnen zusätzliche Verwirrung. Zehn Minuten reines Benennen sparen zwei Stunden Fehlersuche.

**Was variiert in Folge B?** Die gesuchte Größe und damit die Rechenrichtung. In 7 bis 10 steht die Unbekannte im Zähler (multiplizieren), in 11 und 12 im Nenner (dividieren). Die dazugehörige Frage – „Woran erkennt man das vorher?" – ist der eigentliche Lerngegenstand der Folge.

**Was variiert in Folge C?** Der Winkel innerhalb desselben Dreiecks. Die Ergebnisse tauschen paarweise die Plätze, und daraus entsteht die Beziehung $\sin α = \cos β$ für komplementäre Winkel. Sie fällt hier als Beobachtung ab, statt als weitere Formel eingeführt zu werden.

**Was variiert in Folge D?** Die gegebene Kombination – und alle drei Wege führen beim 3-4-5-Dreieck zu demselben Winkel. Das ist keine Zufälligkeit, sondern der Beleg dafür, dass die drei Funktionen dieselbe Figur beschreiben. Die abschließende Frage nach der bevorzugten Rechnung zielt auf Ökonomie: Man nimmt die Funktion, für die die gegebenen Größen direkt passen.

**Häufige Fehlvorstellungen**

- *Ankathete und Gegenkathete fest an Seiten geknüpft.* Folge A und C sind genau dagegen gebaut. Gegenmittel: konsequent fragen „Liegt die Seite dem Winkel gegenüber oder an ihm an?"
- *Immer multiplizieren.* Wer nur $Gegenkathete = c \cdot  \sin α$ kennt, scheitert an Nr. 11. Gegenmittel: die Verhältnisgleichung hinschreiben und dann umstellen, statt eine Formel zu erinnern.
- *Trigonometrie ohne rechten Winkel anwenden.* Sinus- und Kosinussatz kommen später; im rechtwinkligen Dreieck gilt das Obige nur mit rechtem Winkel.
- *Steigung in Prozent mit dem Winkel gleichgesetzt.* Aufgabe 27. Gegenmittel: 100 % Steigung entspricht 45°, nicht 100°.

**Zum Weiterarbeiten**

- [Diagnostische Fragen zur Trigonometrie](/quizzes)
- [Übungsgenerator Trigonometrie](/uebung/trigonometrie)
- [Aufgabenfolge zum Satz des Pythagoras](/aufgaben/pythagoras-grundform-und-anwendung) – dieselbe Figur, andere Frage
