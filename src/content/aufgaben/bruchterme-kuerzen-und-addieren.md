---
titel: "Bruchterme – kürzen, erweitern, addieren"
thema: "Termumformungen"
klassenstufe: ["9", "10"]
schwierigkeit: mittel
didaktischerHinweis: "„Aus Differenzen kürzen die Dummen" ist ein Merkspruch, den alle kennen und trotzdem verletzen. Der Grund: Kürzen wird als Streichen gleicher Zeichen gelernt, nicht als Wegkürzen gemeinsamer Faktoren. Folge A trennt deshalb zuerst systematisch, was ein Faktor ist und was ein Summand. Erst danach wird gekürzt. Folge E bringt den Definitionsbereich – er ist bei Bruchtermen kein Formalismus, sondern Teil der Aufgabe."
tags: ["bruchterme", "kuerzen", "definitionsbereich", "faktorisieren", "variation-theory"]
datum: 2026-08-28
entwurf: false
---

## Vorbemerkung für die Schüler

Beim Kürzen gilt genau eine Regel: **Gekürzt wird nur, was als Faktor dasteht.**

Das ist keine Schikane, sondern folgt direkt aus der Bruchrechnung: `(2·3)/(2·5) = 3/5`, weil man den gemeinsamen Faktor 2 herausziehen und wegkürzen kann. Bei `(2+3)/(2+5)` geht das nicht – hier ist die 2 kein Faktor, sondern ein Summand. Und tatsächlich: `5/7 ≠ 3/5`.

Zweite Regel, ebenso wichtig: Ein Bruchterm ist nur definiert, wenn der **Nenner nicht null** ist. Die verbotenen Werte gehören zur Lösung dazu.

## Folge A: Faktor oder Summand?

Noch nicht kürzen – nur benennen. Ist die markierte Zahl bzw. Variable ein Faktor des ganzen Zählers/Nenners oder nur ein Summand?

| Nr. | Term | Ist `x` Faktor des Zählers? |
|----:|:-----|:----------------------------|
| 1 | `(3x)/(5x)` | ja, in Zähler und Nenner |
| 2 | `(x+3)/(x+5)` | nein, `x` ist Summand |
| 3 | `(x·(x+3))/(x·(x+5))` | ja, in Zähler und Nenner |
| 4 | `(x+3)/(x·(x+5))` | nein im Zähler, ja im Nenner |
| 5 | `(2x+6)/(2x+10)` | nein – aber 2 ist ausklammerbar |
| 6 | `(x²+3x)/(x²+5x)` | ja, nach Ausklammern von `x` |

*Frage nach Nr. 6:* In Nr. 2 und Nr. 6 stehen die Zahlen 3 und 5 an derselben Stelle. Warum darf man im einen Fall kürzen und im anderen nicht?

## Folge B: Kürzen

| Nr. | Term | Gekürzt |
|----:|:-----|:--------|
| 7 | `(6x)/(9x)` | `2/3` |
| 8 | `(6x²)/(9x)` | `(2x)/3` |
| 9 | `(x²+3x)/(x²+5x)` | `(x+3)/(x+5)` |
| 10 | `(2x+6)/(2x+10)` | `(x+3)/(x+5)` |
| 11 | `(x²−9)/(x+3)` | `x−3` |
| 12 | `(x²−9)/(x²−6x+9)` | `(x+3)/(x−3)` |

*Hinweis zu Nr. 11 und 12:* Hier hilft die dritte binomische Formel: `x²−9 = (x+3)(x−3)` und `x²−6x+9 = (x−3)²`.

## Folge C: Nicht kürzbar – begründen

Alle Terme sehen aus, als ließe sich etwas streichen. Nichts davon ist erlaubt. Begründen Sie jeweils in einem Satz.

| Nr. | Term | Warum nicht? |
|----:|:-----|:-------------|
| 13 | `(x+3)/(x+5)` | `x` ist Summand, kein Faktor. |
| 14 | `(x+3)/3` | 3 ist im Zähler nur Summand. |
| 15 | `(x²+9)/(x+3)` | `x²+9` ist keine Differenz; es lässt sich nicht faktorisieren. |
| 16 | `(2x+3)/(2x+5)` | Der Faktor 2 steckt nur beim `x`, nicht im ganzen Zähler. |
| 17 | `(x+y)/(x·y)` | Zähler ist Summe, Nenner Produkt – kein gemeinsamer Faktor. |
| 18 | `(x−4)/(x²−4)` | Nenner zerfällt in `(x−2)(x+2)`; `x−4` kommt darin nicht vor. |

*Kontrolle für alle sechs:* Setzen Sie `x = 1` (und `y = 2`) ein und vergleichen Sie mit dem angeblich gekürzten Term.

## Folge D: Addieren und Subtrahieren

| Nr. | Aufgabe | Ergebnis |
|----:|:--------|:---------|
| 19 | `2/x + 3/x` | `5/x` |
| 20 | `2/x + 3/(2x)` | `7/(2x)` |
| 21 | `1/x + 1/y` | `(x+y)/(xy)` |
| 22 | `1/x − 1/(x+1)` | `1/(x(x+1))` |
| 23 | `3/(x−2) + 2/(x+2)` | `(5x+2)/((x−2)(x+2))` |
| 24 | `x/(x+1) + 1/(x+1)` | `1` |

*Frage nach Nr. 24:* Das Ergebnis ist eine reine Zahl – für alle zulässigen `x`. Wie kommt das?

## Folge E: Definitionsbereich

Für welche Werte ist der Term nicht definiert?

| Nr. | Term | Ausgeschlossen |
|----:|:-----|:---------------|
| 25 | `1/x` | `x = 0` |
| 26 | `1/(x−3)` | `x = 3` |
| 27 | `1/(x²−9)` | `x = 3` und `x = −3` |
| 28 | `(x−3)/(x−3)` | `x = 3` – trotz Kürzbarkeit |
| 29 | `1/(x²+1)` | keine Ausschlüsse |
| 30 | `(x+2)/(x²+4x+4)` | `x = −2` |

*Frage nach Nr. 28:* Der Term lässt sich zu `1` kürzen. Warum bleibt `x = 3` trotzdem verboten?

## Reflexionsfragen

1. Erklären Sie mit Zahlen, warum `(2+3)/(2+5)` nicht `3/5` ist.
2. Woran erkennen Sie, ob ein Zähler faktorisierbar ist? Nennen Sie drei Muster.
3. In Folge B liefern Nr. 9 und Nr. 10 dasselbe Ergebnis. Was haben die beiden Ausgangsterme gemeinsam?
4. Warum muss der Definitionsbereich **vor** dem Kürzen bestimmt werden?
5. Der Term `(x²−1)/(x−1)` ist für `x = 1` nicht definiert, obwohl er sich zu `x+1` kürzen lässt. Zeichnen Sie den Graphen von `y = (x²−1)/(x−1)` – wie sieht die Stelle `x = 1` aus?

## Didaktischer Kommentar

**Der Kern.** Kürzen ist keine Streichoperation an Zeichen, sondern das Wegkürzen eines gemeinsamen **Faktors**. Solange diese Unterscheidung nicht sitzt, ist jeder Merkspruch wirkungslos – die Klasse kennt ihn, erkennt aber im Einzelfall nicht, ob ein Faktor vorliegt. Deshalb steht Folge A bewusst vor jedem Kürzen und verlangt ausdrücklich, **nicht** zu rechnen.

**Was variiert in Folge A?** Die Struktur des Zählers bei nahezu identischem Aussehen. Nr. 2 und Nr. 6 sind das entscheidende Paar: `(x+3)/(x+5)` und `(x²+3x)/(x²+5x)` sehen ähnlich aus, aber im zweiten Fall lässt sich `x` ausklammern und damit kürzen. Wer den Unterschied benennen kann, hat den Begriff.

**Was variiert in Folge B?** Der Weg zum gemeinsamen Faktor: erst offen sichtbar (Nr. 7, 8), dann durch Ausklammern (Nr. 9, 10), dann über binomische Formeln (Nr. 11, 12). Der Anspruch steigt, das Prinzip bleibt identisch.

**Was variiert in Folge C?** Nichts – und genau das ist die Pointe. Sechs Terme, die zum Streichen einladen, und bei keinem ist es erlaubt. Die Zahlenprobe am Ende ist Pflicht: Sie verwandelt eine behauptete Regel in eine überprüfbare Aussage und ist zugleich die Strategie, die Lernende später bei jeder Unsicherheit selbst anwenden können.

**Was variiert in Folge D?** Die Nenner – von gleich über Vielfache bis zu teilerfremd. Nr. 24 ist der Schlusspunkt: Ein Bruchterm, der sich zu einer Konstanten zusammenfasst, überrascht zuverlässig und lohnt eine Minute Gespräch.

**Was variiert in Folge E?** Die Anzahl und Art der Ausschlüsse. Nr. 28 und die letzte Reflexionsfrage zielen auf denselben Punkt: Der Definitionsbereich bezieht sich auf den **ursprünglichen** Term. Kürzen darf ihn nicht stillschweigend erweitern – im Graphen bleibt an dieser Stelle eine Lücke.

**Häufige Fehlvorstellungen**

- *„Aus Differenzen kürzen die Dummen" – und trotzdem gekürzt.* Der Spruch ist bekannt, die Erkennung nicht. Gegenmittel: Folge A, ohne Rechnen.
- *Definitionsbereich als Formalismus.* Gegenmittel: Nr. 28 und die Grafik zur Definitionslücke – dort wird sichtbar, dass etwas fehlt.
- *Bruchterme wie Bruchgleichungen behandelt.* „Über Kreuz multiplizieren" ist eine Umformung von **Gleichungen**. Ein Term wird nicht umgeformt, indem man ihn mit etwas multipliziert.
- *Beim Addieren keinen gemeinsamen Nenner gebildet.* Derselbe Fehler wie in Klasse 6, nur mit Buchstaben. Gegenmittel: einmal den Zahlenfall daneben rechnen.

**Zum Weiterarbeiten**

- [Übungsgenerator Bruchterme](/uebung/termumformungen)
- [Diagnostische Fragen zu Bruchtermen](/quizzes)
- [Fehlvorstellungs-Katalog: Termumformungen](/fehlvorstellungen#thema-termumformungen)
