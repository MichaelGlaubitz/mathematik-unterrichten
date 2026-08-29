---
titel: "Lineare Gleichungssysteme – drei Methoden, eine Idee"
thema: "Lineare Gleichungssysteme"
klassenstufe: ["8", "9"]
schwierigkeit: mittel
didaktischerHinweis: "Eine Aufgabenfolge, die die drei Standardmethoden (Gleichsetzen, Einsetzen, Addieren) parallel an *demselben* Aufgabenkorpus übt. Schüler lernen, dass nicht eine Methode 'die richtige' ist, sondern dass die Methode zur Form der Gleichung passt – und dass alle drei dieselbe Lösung produzieren. Das ist die Kern-Einsicht, die später beim Gauß-Verfahren in der Oberstufe trägt."
ziel: 'Die Schüler wählen die Methode nach der Form des Systems – statt eine Methode für „die richtige“ zu halten.'
variation: 'Dieselbe Sorte Systeme läuft durch drei Verfahren; Folge E lässt die Schüler selbst wählen.'
stolperstelle: 'Das Additionsverfahren wird angesetzt, obwohl eine Variable längst isoliert dasteht.'
regie:
  - 'Welche Form hat dieses System – und welche Methode liegt damit nahe?'
  - 'Bevor du rechnest: Wie viele Lösungen erwartest du?'
  - 'Wer hat eine andere Methode genommen und ist auf dasselbe gekommen?'
tags: ["lineare-gleichungssysteme", "variation-theory", "gleichsetzungs-verfahren", "additionsverfahren"]
datum: 2026-05-29
entwurf: false
---

## Vorbemerkung für die Schüler

Ein **lineares Gleichungssystem** mit zwei Unbekannten besteht aus zwei Gleichungen, die *gleichzeitig* erfüllt sein sollen. Beispiel:

$$
\begin{aligned}
2x + y &= 7\\
x - y &= 2
\end{aligned}
$$

Das Lösungspaar $(x, y)$ ist die einzige Kombination, die beide Gleichungen wahr macht. Es gibt im Wesentlichen drei Methoden, ein solches System zu lösen:

- **Gleichsetzungsverfahren:** Beide Gleichungen nach derselben Variable auflösen, dann gleichsetzen.
- **Einsetzungsverfahren:** Eine Variable aus einer Gleichung isolieren und in die andere einsetzen.
- **Additionsverfahren:** Die Gleichungen so umformen, dass sich beim Addieren oder Subtrahieren eine Variable eliminiert.

Alle drei Methoden geben *dieselbe* Lösung. Welche du wählst, hängt davon ab, welche Form das System hat.

## Folge A: Gleichsetzungsverfahren – wenn beides nach y aufgelöst ist

Die Bedingungen liegen schon in der Form $y = ...$. Die Methode ist hier am direktesten.

| Nr. | System | Lösung |
|----:|:-------|:-------|
| 1 | $y = x + 2  /  y = 2x - 1$ | $x = 3, y = 5$ |
| 2 | $y = 2x - 4  /  y = -x + 5$ | $x = 3, y = 2$ |
| 3 | $y = 3x  /  y = x + 4$ | $x = 2, y = 6$ |
| 4 | $y = 4x - 7  /  y = x + 5$ | $x = 4, y = 9$ |
| 5 | $y = -2x + 8  /  y = x - 1$ | $x = 3, y = 2$ |
| 6 | $y = \frac{1}{2}x + 3  /  y = x - 1$ | $x = 8, y = 7$ |

## Folge B: Einsetzungsverfahren – wenn eine Variable schon isoliert ist

In jeder Aufgabe ist eine Variable bereits aufgelöst. Setze sie in die andere Gleichung ein.

| Nr. | System | Lösung |
|----:|:-------|:-------|
| 7 | $y = 2x - 1  /  3x + y = 14$ | $x = 3, y = 5$ |
| 8 | $x = y + 3  /  2x - y = 11$ | $x = 8, y = 5$ |
| 9 | $y = x + 1  /  4x + 2y = 14$ | $x = 2, y = 3$ |
| 10 | $y = 5 - x  /  2x + 3y = 11$ | $x = 4, y = 1$ |
| 11 | $x = 2y  /  3x - y = 10$ | $x = 4, y = 2$ |
| 12 | $y = \frac{1}{2}x  /  x + y = 9$ | $x = 6, y = 3$ |

## Folge C: Additionsverfahren – wenn die Standardform günstig ist

Die Gleichungen stehen in der Form $ax + by = c$. Das Additionsverfahren passt am besten, wenn man durch Addition oder Subtraktion eine Variable eliminieren kann.

| Nr. | System | Eliminations-Idee | Lösung |
|----:|:-------|:------------------|:-------|
| 13 | $2x + y = 7  /  x - y = 2$ | Addieren → 3x = 9 | $x = 3, y = 1$ |
| 14 | $x + 2y = 8  /  x - y = 2$ | Subtrahieren → 3y = 6 | $x = 4, y = 2$ |
| 15 | $3x + 2y = 12  /  x + 2y = 6$ | Subtrahieren → 2x = 6 | $x = 3, y = 1{,}5$ |
| 16 | $2x + 3y = 11  /  4x - 3y = 7$ | Addieren → 6x = 18 | $x = 3, y = \frac{5}{3}$ |
| 17 | $2x + y = 5  /  3x + y = 7$ | Subtrahieren → x = 2 | $x = 2, y = 1$ |
| 18 | $5x + 2y = 16  /  3x - 2y = 0$ | Addieren → 8x = 16 | $x = 2, y = 3$ |

## Folge D: Vorbereitung nötig – das Additionsverfahren mit Multiplikation

Hier muss eine oder beide Gleichungen erst mit einer Zahl multipliziert werden, damit eine Variable beim Addieren bzw. Subtrahieren wegfällt.

| Nr. | System | Vorbereitung | Lösung |
|----:|:-------|:-------------|:-------|
| 19 | $2x + 3y = 13  /  x + y = 5$ | Zweite mit 2 → 2x + 2y = 10, dann subtrahieren | $x = 2, y = 3$ |
| 20 | $3x + 2y = 16  /  2x + 5y = 18$ | Erste mit 5, zweite mit 2; subtrahieren | $x = 4, y = 2$ |
| 21 | $4x - y = 10  /  3x + 2y = 13$ | Erste mit 2 → 8x − 2y = 20, addieren | $x = 3, y = 2$ |
| 22 | $5x + 3y = 21  /  2x - y = 4$ | Zweite mit 3 → 6x − 3y = 12, addieren | $x = 3, y = 2$ |
| 23 | $7x + 4y = 26  /  3x + 2y = 12$ | Zweite mit 2 → 6x + 4y = 24, subtrahieren | $x = 2, y = 3$ |

## Folge E: Welche Methode passt? Selbstwahl

In jeder Zeile *eine* Aufgabe, die in unterschiedlicher Form präsentiert ist. Wähle für *jede* Aufgabe die Methode, die am wenigsten Schritte braucht. Schreib dazu in den Lösungen, *welche* Methode du gewählt hast und *warum*.

| Nr. | System | Vorgeschlagene Methode | Lösung |
|----:|:-------|:-----------------------|:-------|
| 24 | $y = 3x - 1  /  y = x + 5$ | Gleichsetzen | $x = 3, y = 8$ |
| 25 | $2x + y = 9  /  3x - y = 6$ | Addieren | $x = 3, y = 3$ |
| 26 | $y = 2x  /  x + 3y = 14$ | Einsetzen | $x = 2, y = 4$ |
| 27 | $4x + 3y = 18  /  2x - y = 4$ | Additionsverfahren mit Multiplikation | $x = 3, y = 2$ |
| 28 | $y = \frac{1}{2}x + 2  /  2x - y = 7$ | Einsetzen | $x = 6, y = 5$ |

## Reflexionsfragen

1. In Folge A bis C ist *eine* Methode jeweils die naheliegendste. Vergleiche Aufgabe 7 und Aufgabe 25: Beide könnten mit jedem Verfahren gelöst werden. Was bringt jede Methode an Aufwand?
2. In Aufgabe 13 ergibt das Addieren $3x = 9$. Wenn du *stattdessen* das Einsetzungsverfahren wählst, wie viele Schritte brauchst du dann?
3. In Aufgabe 21 wird die *erste* Gleichung mit 2 multipliziert. Warum wird die zweite *nicht* multipliziert? Würde es auch andersherum gehen?
4. Es gibt Systeme ohne Lösung (parallele Geraden) und Systeme mit unendlich vielen Lösungen (identische Geraden). Wie merkst du das beim Lösen mit dem Additionsverfahren?
5. Welche der drei Methoden würdest du einer Klasse 8 *zuerst* vorstellen, wenn du die Wahl hättest? Begründe.

## Didaktischer Kommentar

**Der Kern.** Das deutsche Schulbuch behandelt die drei Methoden meist als drei voneinander unabhängige „Verfahren“, die nacheinander erlernt und dann in Aufgaben angewandt werden – oft mit dem Ergebnis, dass Schüler die *eine* Methode benutzen, an die sie sich am ehesten erinnern, ohne zu sehen, wann sie ungeeignet ist. Diese Aufgabenfolge will das Gegenteil: Die Methoden werden *parallel* gegen denselben Aufgabenkorpus geübt, sodass die Schüler den Zusammenhang sehen.

**Was variiert in Folge A bis C?**
Die Methode wechselt, nicht der mathematische Kern. Ein System wie 2x + y = 7 / x − y = 2 (Folge C) hat dieselbe Lösung, egal welche Methode man anwendet. Der Punkt: Die *Präsentationsform* der Gleichungen entscheidet, welche Methode am wenigsten Aufwand bedeutet. Schüler entwickeln so eine Methodenflexibilität, die das pure Auswendiglernen einer einzigen Vorgehensweise nicht ermöglicht.

**Was variiert in Folge D?**
Hier kommt das Additionsverfahren mit Multiplikation ins Spiel – die häufigste Standardform in Klassenarbeiten. Schüler erleben, dass sie *zuerst* das System „passend machen“ müssen. Das ist die Brücke zum Gauß-Verfahren der Oberstufe.

**Was variiert in Folge E?**
Hier wird die Methodenwahl selbst zur Aufgabe. Schüler müssen *vor* dem Lösen entscheiden, welcher Weg am effizientesten ist. Das ist die kognitiv anspruchsvolle Operation – und die, die in der Klassenarbeit den Unterschied macht.

**Häufige Fehlvorstellungen**

- *„Beim Einsetzen muss ich nach $y$ auflösen.“* Nein, $x$ geht genauso. Aufgabe 8 zeigt das.
- *„Beim Addieren muss ich *immer* multiplizieren.“* Nein – Aufgabe 13 ist direkt addierbar, ohne Vorbereitung. Multiplikation ist erst nötig, wenn die Koeffizienten nicht „passen“.
- *„Ein System ohne Lösung erkenne ich, wenn ich x = 0 herausbekomme.“* Nein – x = 0 ist eine *Lösung*. Ohne Lösung ist das System, wenn beim Lösen ein *Widerspruch* herauskommt (z. B. 0 = 5).
- *„Wenn beide Gleichungen gleich sind, gibt es eine Lösung.“* Nein – dann gibt es *unendlich viele* (jede Lösung der einen ist auch Lösung der anderen).

**Möglicher Anschluss**

- Anwendungsaufgaben (Mischung, Bewegung, Geld) als Modellierung mit Gleichungssystemen.
- Geometrische Deutung: Lineares Gleichungssystem = Schnittpunkt zweier Geraden.
- Diagnostische Fragen zu typischen Fehlern beim Lösen von LGS.
- Erweiterung: Dreigleichiges System mit drei Unbekannten (Vorbereitung Gauß).
