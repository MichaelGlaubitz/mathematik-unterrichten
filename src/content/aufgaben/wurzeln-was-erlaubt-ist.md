---
titel: "Wurzeln – was erlaubt ist und was nicht"
thema: "Wurzelrechnung"
klassenstufe: ["9", "10"]
schwierigkeit: mittel
didaktischerHinweis: "Die Wurzel verteilt sich über Produkte, aber nicht über Summen. Diese eine Unterscheidung trägt das ganze Thema – und sie wird zuverlässig verletzt, weil bei Produkten das Streichen ja tatsächlich funktioniert. Folge A stellt beide Fälle deshalb unmittelbar nebeneinander und lässt mit Zahlen prüfen. Folge D behandelt den Fall, den fast jedes Buch übergeht: Warum ist die Wurzel aus x² nicht x, sondern der Betrag von x?"
tags: ["wurzeln", "quadratwurzel", "teilweises-wurzelziehen", "betrag", "variation-theory"]
datum: 2026-08-28
entwurf: false
---

## Vorbemerkung für die Schüler

Die Quadratwurzel aus einer Zahl `a ≥ 0` ist die **nichtnegative** Zahl, deren Quadrat `a` ergibt. Also: `√9 = 3`, nicht `±3`.

Zwei Rechenregeln gelten, zwei sehr ähnlich aussehende gelten nicht:

**Erlaubt:** `√(a·b) = √a · √b` und `√(a:b) = √a : √b`
**Nicht erlaubt:** `√(a+b) = √a + √b` und `√(a−b) = √a − √b`

Wenn Sie sich unsicher sind: Setzen Sie Zahlen ein. Das dauert zehn Sekunden und entscheidet die Frage endgültig.

## Folge A: Produkt oder Summe?

Prüfen Sie jede Zeile durch Einsetzen. Stimmen die beiden Seiten überein?

| Nr. | Behauptung | Prüfung | Stimmt? |
|----:|:-----------|:--------|:--------|
| 1 | `√(4·9) = √4 · √9` | `√36 = 6` und `2·3 = 6` | ja |
| 2 | `√(4+9) = √4 + √9` | `√13 ≈ 3,61` und `2+3 = 5` | nein |
| 3 | `√(16·25) = √16 · √25` | `√400 = 20` und `4·5 = 20` | ja |
| 4 | `√(16+25) = √16 + √25` | `√41 ≈ 6,40` und `4+5 = 9` | nein |
| 5 | `√(36:9) = √36 : √9` | `√4 = 2` und `6:3 = 2` | ja |
| 6 | `√(36−9) = √36 − √9` | `√27 ≈ 5,20` und `6−3 = 3` | nein |

*Frage nach Nr. 6:* Bei welchen Rechenzeichen darf die Wurzel „hineingezogen" werden, bei welchen nicht? Formulieren Sie die Regel in einem Satz.

## Folge B: Teilweises Wurzelziehen

Zerlegen Sie die Zahl unter der Wurzel in ein Produkt aus einer Quadratzahl und einem Rest.

| Nr. | Term | Vereinfacht |
|----:|:-----|:------------|
| 7 | `√8` | `2√2` |
| 8 | `√12` | `2√3` |
| 9 | `√18` | `3√2` |
| 10 | `√32` | `4√2` |
| 11 | `√50` | `5√2` |
| 12 | `√72` | `6√2` |

*Frage nach Nr. 12:* Vier der sechs Ergebnisse enthalten `√2`. Woran liegt das? Was haben 8, 18, 32, 50 und 72 gemeinsam?

## Folge C: Zusammenfassen

| Nr. | Aufgabe | Ergebnis |
|----:|:--------|:---------|
| 13 | `3√2 + 5√2` | `8√2` |
| 14 | `3√2 + 5√3` | nicht weiter zusammenfassbar |
| 15 | `√8 + √18` | `2√2 + 3√2 = 5√2` |
| 16 | `√12 − √27` | `2√3 − 3√3 = −√3` |
| 17 | `√2 · √8` | `√16 = 4` |
| 18 | `(√5)²` | `5` |

*Frage nach Nr. 18:* Nr. 13 und Nr. 14 sehen fast gleich aus. Warum geht das eine und das andere nicht? Vergleichen Sie mit `3x + 5x` und `3x + 5y`.

## Folge D: Wurzel und Quadrat – Vorsicht

| Nr. | Term | Ergebnis |
|----:|:-----|:---------|
| 19 | `√(3²)` | `3` |
| 20 | `√((−3)²)` | `3` – nicht `−3` |
| 21 | `√(x²)` für `x = 5` | `5` |
| 22 | `√(x²)` für `x = −5` | `5` |
| 23 | `√(x²)` allgemein | `\|x\|` |
| 24 | `(√x)²` für `x ≥ 0` | `x` |

*Frage nach Nr. 24:* Nr. 23 und Nr. 24 sehen aus wie dieselbe Rechnung in anderer Reihenfolge. Warum ist das Ergebnis trotzdem verschieden?

## Folge E: Gleichungen mit Quadraten

| Nr. | Gleichung | Lösungen |
|----:|:----------|:---------|
| 25 | `x² = 9` | `x = 3` oder `x = −3` |
| 26 | `x² = 2` | `x = √2` oder `x = −√2` |
| 27 | `x² = 0` | `x = 0` |
| 28 | `x² = −4` | keine reelle Lösung |
| 29 | `√x = 3` | `x = 9` |
| 30 | `√x = −3` | keine Lösung |

*Frage nach Nr. 30:* Nr. 25 hat zwei Lösungen, Nr. 29 nur eine, Nr. 30 gar keine. Erklären Sie den Unterschied mit der Definition der Wurzel.

## Reflexionsfragen

1. Erklären Sie mit den Zahlen aus Nr. 2, warum `√(a+b) = √a + √b` falsch ist.
2. Warum gilt die Produktregel, die Summenregel aber nicht? Denken Sie an das Flächenbild des Quadrats.
3. Warum schreibt man `√9 = 3` und nicht `√9 = ±3`, obwohl `(−3)² = 9` gilt?
4. Was ist der Unterschied zwischen der Gleichung `x² = 9` und dem Term `√9`?
5. In Nr. 30 gibt es keine Lösung. Wie sieht der Graph von `y = √x` aus – und woran erkennt man daran, dass es keine geben kann?

## Didaktischer Kommentar

**Der Kern.** Es geht in diesem Thema fast ausschließlich um eine einzige Unterscheidung: Die Wurzel ist mit Multiplikation und Division verträglich, mit Addition und Subtraktion nicht. Alles andere folgt daraus. Die Schwierigkeit ist, dass die verbotene Variante genauso plausibel aussieht wie die erlaubte – dieselbe Struktur, die den „Freshman's Dream" bei den binomischen Formeln erzeugt.

**Was variiert in Folge A?** Nur das Rechenzeichen unter der Wurzel; die Zahlen sind bewusst so gewählt, dass beide Seiten leicht ausrechenbar sind. Die Zeilenpaare 1/2, 3/4 und 5/6 stehen direkt untereinander. Wichtig ist die Reihenfolge im Unterricht: **erst rechnen lassen, dann reden**. Wer das Gegenbeispiel selbst ausgerechnet hat, glaubt der Regel danach.

**Was variiert in Folge B?** Die Zahl unter der Wurzel. Alle sechs enthalten eine Quadratzahl als Faktor, und in vier Fällen ist der verbleibende Rest die 2. Diese Häufung ist Absicht: Sie lädt zu der Beobachtung ein, dass 8, 18, 32, 50, 72 alle die Form `2·k²` haben.

**Was variiert in Folge C?** Ob die Wurzelterme gleichartig sind. Der Vergleich mit `3x + 5x` gegen `3x + 5y` ist der Schlüssel: Wurzelterme werden zusammengefasst wie Variablen, nicht wie Zahlen. Nr. 15 und 16 verlangen zuerst teilweises Wurzelziehen – erst danach wird die Gleichartigkeit sichtbar.

**Was variiert in Folge D?** Das Vorzeichen des Ausgangswerts. Nr. 20 und Nr. 22 sind die entscheidenden Zeilen. Dass `√(x²) = |x|` und nicht `x` ist, wird in vielen Büchern übergangen und rächt sich spätestens bei Betragsgleichungen und in der Analysis. Der Weg über konkrete Zahlen (Nr. 21, 22) vor der allgemeinen Aussage (Nr. 23) macht es zugänglich.

**Was variiert in Folge E?** Die Anzahl der Lösungen – zwei, eine, keine – und die Richtung der Operation. Der Vergleich von Nr. 25 (`x² = 9`, zwei Lösungen) mit Nr. 29 (`√x = 3`, eine Lösung) ist der Kern: Das Quadrieren ist nicht umkehrbar eindeutig, das Wurzelziehen liefert dagegen genau einen Wert.

**Häufige Fehlvorstellungen**

- *`√(a+b) = √a + √b`.* Folge A. Gegenmittel: Gegenbeispiel selbst ausrechnen lassen, nicht vorsagen.
- *`√(x²) = x`.* Folge D. Gegenmittel: `x = −5` einsetzen; das Ergebnis kann nicht negativ sein, weil die Wurzel nie negativ ist.
- *`x² = 9` hat nur die Lösung 3.* Nr. 25. Gegenmittel: beide Zahlen einsetzen und die Parabel zeichnen.
- *`√9 = ±3`.* Die Verwechslung von Wurzelterm und Gleichungslösung. Gegenmittel: beide Schreibweisen nebeneinander ins Heft, mit dem Unterschied als Merksatz.

**Zum Weiterarbeiten**

- [Diagnostische Fragen zu Wurzeln](/quizzes)
- [Übungsgenerator Wurzelrechnung](/uebung/wurzelrechnung)
- [Aufgabenfolge zu quadratischen Gleichungen](/aufgaben/quadratische-gleichungen-satz-vom-nullprodukt)
