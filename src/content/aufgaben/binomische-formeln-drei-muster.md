---
titel: "Binomische Formeln – drei Muster, ein Prinzip"
thema: "Binomische Formeln"
klassenstufe: ["8", "9"]
schwierigkeit: mittel
didaktischerHinweis: "Eine Aufgabenfolge, die die binomischen Formeln in beide Richtungen trainiert: Ausmultiplizieren (vorwärts) und Faktorisieren (rückwärts). Gegen die typische 'Formelliste-auswendig-Lernen'-Sicht wird das gemeinsame Muster sichtbar gemacht – alle drei Formeln sind das gleiche Prinzip mit unterschiedlichen Vorzeichen."
tags: ["binomische-formeln", "variation-theory", "ausmultiplizieren", "faktorisieren"]
datum: 2026-05-22
entwurf: false
---

## Vorbemerkung für die Schüler

Die drei binomischen Formeln sind:

- `(a + b)² = a² + 2ab + b²` (1. Formel)
- `(a − b)² = a² − 2ab + b²` (2. Formel)
- `(a + b)(a − b) = a² − b²` (3. Formel)

Sie sehen aus wie *drei* Regeln. In Wirklichkeit sind es drei Spezialfälle *einer* Idee: das systematische Ausmultiplizieren von `(a ± b) · (c ± d)`. Wenn du das Ausmultiplizieren beherrschst (Distributivgesetz, jeder Term mit jedem), kannst du die drei Formeln *jederzeit aus dem Kopf herleiten*. Auswendiglernen ist nicht nötig – nur das Üben des Musters.

Bearbeite die Aufgaben in der gegebenen Reihenfolge. Bei jeder Aufgabe: *zuerst* identifizieren, welche der drei Formeln (oder ob mehrere kombiniert) anzuwenden ist.

## Folge A: Ausmultiplizieren – die Grundform

Sieh genau hin: Was variiert von Zeile zu Zeile, was nicht?

| Nr. | Aufgabe | Lösung |
|----:|:--------|:-------|
| 1 | `(x + 3)²` | `x² + 6x + 9` |
| 2 | `(x − 3)²` | `x² − 6x + 9` |
| 3 | `(x + 3)(x − 3)` | `x² − 9` |
| 4 | `(x + 5)²` | `x² + 10x + 25` |
| 5 | `(x − 5)²` | `x² − 10x + 25` |
| 6 | `(x + 5)(x − 5)` | `x² − 25` |
| 7 | `(x + 1)²` | `x² + 2x + 1` |
| 8 | `(x − 1)²` | `x² − 2x + 1` |
| 9 | `(x + 1)(x − 1)` | `x² − 1` |

## Folge B: Mit Koeffizienten und Vorzeichen

Jetzt wird es etwas weniger glatt – aber das Muster bleibt.

| Nr. | Aufgabe | Lösung |
|----:|:--------|:-------|
| 10 | `(2x + 3)²` | `4x² + 12x + 9` |
| 11 | `(3x − 2)²` | `9x² − 12x + 4` |
| 12 | `(2x + 3)(2x − 3)` | `4x² − 9` |
| 13 | `(5a + 2b)²` | `25a² + 20ab + 4b²` |
| 14 | `(5a − 2b)²` | `25a² − 20ab + 4b²` |
| 15 | `(5a + 2b)(5a − 2b)` | `25a² − 4b²` |
| 16 | `(−x + 4)²` | `x² − 8x + 16` |
| 17 | `(−x − 4)²` | `x² + 8x + 16` |

## Folge C: Faktorisieren – die Umkehrung

Hier sehen wir das Ergebnis und müssen die Klammerform finden. Genau hier wird die Beherrschung der Formeln *praktisch wertvoll*.

| Nr. | Aufgabe | Faktorform |
|----:|:--------|:-----------|
| 18 | `x² + 8x + 16` | `(x + 4)²` |
| 19 | `x² − 8x + 16` | `(x − 4)²` |
| 20 | `x² − 16` | `(x − 4)(x + 4)` |
| 21 | `x² + 12x + 36` | `(x + 6)²` |
| 22 | `x² − 49` | `(x − 7)(x + 7)` |
| 23 | `4x² − 25` | `(2x − 5)(2x + 5)` |
| 24 | `9x² − 24x + 16` | `(3x − 4)²` |
| 25 | `100 − x²` | `(10 − x)(10 + x)` |

## Folge D: Erkennen unter Tarnung

Die Aufgabe sieht zuerst nicht nach binomischer Formel aus. Schau genau hin.

| Nr. | Aufgabe | Erste Umformung | Lösung |
|----:|:--------|:----------------|:-------|
| 26 | `(x + 2)² − (x − 2)²` | binomische Formeln einsetzen | `8x` |
| 27 | `25 − (x − 3)²` | 3. Formel mit „a = 5" und „b = (x − 3)" | `(5 − x + 3)(5 + x − 3) = (8 − x)(2 + x)` |
| 28 | `x² − 6x + 9 − y²` | erste drei Terme als Quadrat | `(x − 3 − y)(x − 3 + y)` |
| 29 | `4x² + 12xy + 9y² − 16` | erste drei Terme als Quadrat | `(2x + 3y − 4)(2x + 3y + 4)` |
| 30 | `x⁴ − 1` | zweimal die 3. Formel | `(x − 1)(x + 1)(x² + 1)` |

## Reflexionsfragen

1. In Folge A bleibt eine Sache von Zeile zu Zeile *gleich*. Was? Und was variiert?
2. Vergleiche Aufgabe 1 mit Aufgabe 10. Was ist mathematisch dasselbe, was unterschiedlich?
3. Warum ist `(x − 3)² ≠ x² − 9`? Welcher klassische Fehler steckt hinter dieser Verwechslung?
4. Aufgabe 17 ist diagnostisch interessant: `(−x − 4)²`. Warum kommt am Ende wieder ein *positives* `+8x` heraus, obwohl beide Vorzeichen negativ waren?
5. In Folge C: Wie *erkennst du am Anfang*, ob ein Trinom Form `(x + b)²` oder `(x − b)²` ergibt? Welcher der drei Terme hilft dir bei der Entscheidung?

## Didaktischer Kommentar

**Die zentrale Pointe.** Die binomischen Formeln sind kein Lernstoff zum Auswendigmerken, sondern ein Anwendungsfall des Distributivgesetzes. Wer die drei Formeln nicht durch eine Liste, sondern durch das Muster `(jeder Term mal jeder)` lernt, wird sie *nie* falsch anwenden – auch nicht 20 Jahre später. Wer sie auswendig lernt, vergisst die zweite Formel und hat dann keine Rückzugsmöglichkeit.

**Was variiert in Folge A?**
Hier wird das Auge für die Vorzeichen geschärft. Schüler sehen drei Mal hintereinander dieselbe Zahl (3 bzw. 5 bzw. 1) in den drei Formeln. Was sich ändert, ist allein das Vorzeichen-Muster im mittleren Term und im konstanten Term. Diese minimale Variation ist die Basis der Variation Theory: Was unterschiedlich aussieht, soll unterschiedlich erlebt werden – aber nicht *zu* unterschiedlich, sonst geht das Gemeinsame verloren.

**Was variiert in Folge B?**
Jetzt kommen Koeffizienten und mehrere Variablen ins Spiel. Schüler erleben: Das Muster ist *robust* gegen kosmetische Variation. Wer Aufgabe 1 (mit `x` und `3`) versteht, versteht im Prinzip auch Aufgabe 13 (mit `5a` und `2b`) – nur müssen die Quadrate jetzt sorgfältiger gerechnet werden.

**Was variiert in Folge C?**
Hier wird die Richtung gedreht: Vom Ergebnis zur Faktorform. Das ist die Operation, die später beim Lösen quadratischer Gleichungen, beim Faktorisieren von Termen und in der Bruchrechnung mit Variablen gebraucht wird. Aufgabe 25 ist diagnostisch wichtig – die Reihenfolge ist anders (`100 − x²` statt `x² − 100`), aber die Formel funktioniert gleich.

**Was variiert in Folge D?**
Hier wird das Erkennen unter „Tarnung" geübt. Aufgabe 28 ist ein Lieblings-Beispiel von mir: Drei Terme bilden ein Quadrat, der vierte Term lädt zur 3. Formel ein. Wer das einmal gesehen hat, hat ein Werkzeug, das in der Oberstufe immer wieder hilft – etwa beim Vereinfachen von Brüchen oder beim Polynomdivision-vermeiden.

**Häufige Fehlvorstellungen**

- *„`(a + b)² = a² + b²`."* Klassisch. Hier wird das Quadrieren als „Sich-an-jeden-Summanden-verteilen" missverstanden. Hilft: Mit Zahlen prüfen. `(3 + 4)² = 49`, aber `9 + 16 = 25`. Wenn die Schüler einmal sehen, dass es *nicht* gleich ist, fragen sie selbst: „Warum?"
- *„`(a − b)² = a² − b²`."* Selbe Verwechslung mit Vorzeichen. Hilft: Ausdrücklich `(a − b) · (a − b)` ausmultiplizieren lassen, Schritt für Schritt.
- *„Die 3. Formel funktioniert nur, wenn das Pluszeichen zuerst kommt."* Reihenfolge ist egal: `(a − b)(a + b) = (a + b)(a − b) = a² − b²`. Das Distributivgesetz ist kommutativ.
- *„Bei `100 − x²` lässt sich die 3. Formel nicht anwenden."* Doch: `100 − x² = 10² − x² = (10 − x)(10 + x)`. Die binomische Formel ist *symmetrisch* gegenüber dem Tausch der beiden Quadrate.

**Möglicher Anschluss**

- Aufgabenfolge zu quadratischer Ergänzung (baut direkt auf der 1. und 2. Formel auf).
- Anwendung beim Lösen quadratischer Gleichungen über den Satz vom Nullprodukt.
- Diagnostische Fragen zu typischen Fehlern beim Quadrieren.
