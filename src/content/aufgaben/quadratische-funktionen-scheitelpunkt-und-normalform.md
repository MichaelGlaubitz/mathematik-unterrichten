---
titel: "Quadratische Funktionen – Scheitelpunktform und Normalform"
thema: "Quadratische Funktionen"
klassenstufe: ["9", "10"]
schwierigkeit: mittel
didaktischerHinweis: "Eine Aufgabenfolge, die das Hin- und Herwandern zwischen Scheitelpunktform und Normalform übt – die zentrale algebraische Operation der Klasse 9/10. Schüler lernen, dass beide Formen *dieselbe* Funktion beschreiben, nur unterschiedliche Aspekte sichtbar machen: die eine den Scheitelpunkt direkt, die andere die Schnittpunkte mit den Achsen."
tags: ["quadratische-funktionen", "scheitelpunktform", "normalform", "variation-theory", "quadratische-ergaenzung"]
datum: 2026-06-02
entwurf: false
---

## Vorbemerkung für die Schüler

Eine quadratische Funktion kann auf zwei Standardweisen geschrieben werden:

- **Normalform:** `f(x) = ax² + bx + c`. Vorteil: Du liest sofort den y-Achsenabschnitt `c` ab.
- **Scheitelpunktform:** `f(x) = a(x − d)² + e`. Vorteil: Du liest sofort den Scheitelpunkt `S(d / e)` ab.

Beide Formen beschreiben *dieselbe* Funktion. Die eine in die andere zu überführen, ist eine algebraische Operation – Ausmultiplizieren in die eine Richtung, quadratische Ergänzung in die andere.

## Folge A: Scheitelpunkt direkt ablesen

Die Funktion steht in Scheitelpunktform. Schreib den Scheitelpunkt auf.

| Nr. | Funktion | Scheitelpunkt |
|----:|:---------|:--------------|
| 1 | `f(x) = (x − 3)² + 2` | S(3 / 2) |
| 2 | `f(x) = (x + 3)² + 2` | S(−3 / 2) |
| 3 | `f(x) = (x − 3)² − 2` | S(3 / −2) |
| 4 | `f(x) = (x + 3)² − 2` | S(−3 / −2) |
| 5 | `f(x) = x² + 4` | S(0 / 4) |
| 6 | `f(x) = (x − 5)²` | S(5 / 0) |
| 7 | `f(x) = 2(x − 1)² + 3` | S(1 / 3) |
| 8 | `f(x) = −(x − 2)² + 6` | S(2 / 6), nach unten geöffnet |
| 9 | `f(x) = ½(x + 4)² − 1` | S(−4 / −1) |

## Folge B: Scheitelpunktform → Normalform

Die Funktion steht in Scheitelpunktform. Schreib sie in die Normalform um (ausmultiplizieren).

| Nr. | Scheitelpunktform | Normalform |
|----:|:------------------|:-----------|
| 10 | `(x − 3)² + 2` | `x² − 6x + 11` |
| 11 | `(x + 3)² + 2` | `x² + 6x + 11` |
| 12 | `(x − 3)² − 2` | `x² − 6x + 7` |
| 13 | `(x + 3)² − 2` | `x² + 6x + 7` |
| 14 | `2(x − 1)² + 3` | `2x² − 4x + 5` |
| 15 | `−(x − 2)² + 6` | `−x² + 4x + 2` |
| 16 | `½(x + 4)² − 1` | `½x² + 4x + 7` |

## Folge C: Normalform → Scheitelpunktform (quadratische Ergänzung)

Die Funktion steht in Normalform. Bring sie in Scheitelpunktform.
Strategie:
- Bei `a = 1`: Den Koeffizienten von x halbieren, quadrieren, addieren und subtrahieren.
- Bei `a ≠ 1`: Erst den Faktor a aus den ersten beiden Termen ausklammern.

| Nr. | Normalform | Scheitelpunktform | Scheitelpunkt |
|----:|:-----------|:------------------|:--------------|
| 17 | `x² − 6x + 11` | `(x − 3)² + 2` | S(3 / 2) |
| 18 | `x² + 6x + 11` | `(x + 3)² + 2` | S(−3 / 2) |
| 19 | `x² + 4x + 7` | `(x + 2)² + 3` | S(−2 / 3) |
| 20 | `x² − 8x + 19` | `(x − 4)² + 3` | S(4 / 3) |
| 21 | `x² − 10x + 21` | `(x − 5)² − 4` | S(5 / −4) |
| 22 | `x² + 2x − 8` | `(x + 1)² − 9` | S(−1 / −9) |
| 23 | `2x² − 12x + 19` | `2(x − 3)² + 1` | S(3 / 1) |
| 24 | `−x² + 6x − 5` | `−(x − 3)² + 4` | S(3 / 4), nach unten geöffnet |

## Folge D: Aufgaben aus der Funktion ablesen

Die Funktion ist gegeben. Beantworte alle drei Fragen.

| Nr. | Funktion | Scheitelpunkt | y-Achsenabschnitt | Nullstellen |
|----:|:---------|:--------------|:------------------|:------------|
| 25 | `f(x) = (x − 4)² − 9` | S(4 / −9) | f(0) = 7 | x = 1 oder x = 7 |
| 26 | `f(x) = (x + 2)² − 1` | S(−2 / −1) | f(0) = 3 | x = −1 oder x = −3 |
| 27 | `f(x) = (x − 1)² + 3` | S(1 / 3) | f(0) = 4 | keine reelen Nullstellen |
| 28 | `f(x) = x² − 4x` | S(2 / −4) | f(0) = 0 | x = 0 oder x = 4 |
| 29 | `f(x) = −2(x − 1)² + 8` | S(1 / 8) | f(0) = 6 | x = −1 oder x = 3 |

## Reflexionsfragen

1. Vergleiche Aufgaben 1 und 17. Sie beschreiben *dieselbe* Funktion in verschiedenen Formen. Was siehst du in der einen, was in der anderen sofort? Wann brauchst du welche?
2. In Folge B wird ausmultipliziert; in Folge C wird quadratisch ergänzt. Welche Operation ist umkehrbar zur anderen?
3. Aufgabe 27 hat keine reelen Nullstellen. Was sagt der *Scheitelpunkt* dieser Funktion über die Nullstellen aus, ohne dass man rechnet?
4. In Aufgabe 23 muss vor der quadratischen Ergänzung der Faktor 2 ausgeklammert werden. Was passiert, wenn man das vergisst?
5. In Folge D wird in jedem Fall *die Nullstelle* berechnet. Welcher Form (Scheitelpunktform oder Normalform) gelingt das leichter, und warum?

## Didaktischer Kommentar

**Der Kern.** Die Verbindung zwischen Scheitelpunktform und Normalform ist das *zentrale* algebraische Werkzeug der Klassen 9 und 10 in Bezug auf quadratische Funktionen. Wer beide Formen beherrscht und zwischen ihnen umrechnen kann, kann *jede* Aufgabe zu Parabeln lösen – Schnittpunkt mit Achsen, Scheitelpunkt, Verschiebung, Streckung. Wer nur eine Form kennt, muss andauernd mit Notlösungen arbeiten (z. B. p-q-Formel ohne Scheitelpunktverständnis).

**Was variiert in Folge A?**
Hier wird die *Lese*-Operation geübt: Aus der Scheitelpunktform den Scheitelpunkt direkt herauspicken. Schüler trainieren das Vorzeichen-Tracking (`(x − 3)` heißt Scheitelpunkt bei +3, nicht −3). Aufgabe 5 und 6 sind diagnostisch wertvoll – sie testen, ob Schüler den Sonderfall verstehen, in dem ein Teil der Verschiebung null ist.

**Was variiert in Folge B?**
Die *Vorwärts*-Operation: Ausmultiplizieren plus Zusammenfassen. Schüler erleben, dass die Scheitelpunktform algebraisch identisch zur Normalform ist – nur anders aufgeschrieben.

**Was variiert in Folge C?**
Die *Rückwärts*-Operation: Quadratische Ergänzung. Diese ist algorithmisch anspruchsvoller und braucht Übung. Aufgabe 23 (mit Faktor 2) ist die diagnostische Spitze; wer hier scheitert, hat den Faktor übersehen oder die Reihenfolge nicht verstanden.

**Was variiert in Folge D?**
Hier werden mehrere Fragen *gleichzeitig* an dieselbe Funktion gestellt – Scheitelpunkt, y-Abschnitt, Nullstellen. Das übt das *Methodendenken*: Welche Form brauche ich, um welche Frage zu beantworten? Diese Phase ist es, die das Verständnis konsolidiert.

**Häufige Fehlvorstellungen**

- *„`(x + 3)²` heißt Scheitelpunkt bei +3."* Klassisch. Der Trick: In `(x − d)²` ist d der Scheitelpunkt-x-Wert. `(x + 3) = (x − (−3))`, also d = −3.
- *„Bei `2(x − 3)² + 1` ist der Scheitelpunkt bei (3, 2 · 1) = (3, 2)."* Nein – der Faktor 2 wirkt auf `(x − 3)²`, nicht auf den Scheitelpunkt-y-Wert. Scheitelpunkt bleibt (3, 1).
- *„Wenn ich quadratisch ergänze, muss ich nur quadrieren, nicht halbieren."* Genaues Hinsehen ist hier wichtig. Bei `x² + 6x` halbieren wir zuerst die 6 zu 3, dann quadrieren wir: 9 wird ergänzt und subtrahiert.
- *„Eine Parabel ohne reele Nullstellen kann ich nicht zeichnen."* Doch – ihr Scheitelpunkt liegt nur auf einer Seite der x-Achse, sodass sie diese nicht schneidet. Die Parabel existiert weiter, sie hat nur keine Nullstellen.

**Möglicher Anschluss**

- Anwendungsaufgaben: Wurfparabeln, Brücken, Kostenfunktionen.
- Diagnose-Quiz zu typischen Fehlern bei der quadratischen Ergänzung.
- Aufgabenfolge zur Lösung quadratischer Gleichungen über die Scheitelpunktform.
- Erweiterung in Klasse 10: Diskriminante und Nullstellenformeln.
