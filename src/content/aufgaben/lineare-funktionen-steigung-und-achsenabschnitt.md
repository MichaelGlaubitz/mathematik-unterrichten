---
titel: "Lineare Funktionen – Steigung und y-Achsenabschnitt"
thema: "Lineare Funktionen"
klassenstufe: ["8"]
schwierigkeit: einsteiger
didaktischerHinweis: "Eine Aufgabenfolge, die die Parameter $m$ und $b$ in $y = m \\cdot x + b$ systematisch variiert, damit Schüler erleben, *was* der jeweilige Parameter bewirkt. Erst Steigung allein, dann y-Achsenabschnitt allein, dann beide gemeinsam, dann Umkehr (aus Graph oder zwei Punkten die Gleichung bilden). Die häufigsten Lernlücken: 'Steigung als Strecke statt Verhältnis' und 'y-Achsenabschnitt mit x-Wert verwechseln'."
tags: ["lineare-funktionen", "steigung", "y-achsenabschnitt", "variation-theory"]
datum: 2026-06-15
entwurf: false
---

## Vorbemerkung für die Schüler

Eine **lineare Funktion** hat die Form

$$y = m \cdot x + b$$

- $m$ ist die *Steigung*: wie stark der Graph pro x-Schritt steigt oder fällt.
- $b$ ist der *y-Achsenabschnitt*: der y-Wert an der Stelle $x = 0$ (also der Schnittpunkt mit der y-Achse).

Die Steigung wird oft als „Steigungsdreieck" gelesen: $m = \frac{\Delta y}{\Delta x}$ – wie viel der y-Wert *pro* x-Einheit zunimmt. Wenn $m > 0$, geht der Graph nach rechts oben; wenn $m < 0$, nach rechts unten; wenn $m = 0$, ist der Graph waagerecht.

## Folge A: y-Achsenabschnitt variieren, Steigung bleibt gleich

Alle Funktionen haben dieselbe Steigung $m = 2$. Zeichne die Graphen in *ein* Koordinatensystem.

| Nr. | Funktion | y-Achsenabschnitt | Punkt für $x = 0$ | Punkt für $x = 1$ |
|----:|:---------|:------------------|:----------------|:----------------|
| 1 | $y = 2x + 0 = 2x$ | $0$ | $(0, 0)$ | $(1, 2)$ |
| 2 | $y = 2x + 1$ | $1$ | $(0, 1)$ | $(1, 3)$ |
| 3 | $y = 2x + 3$ | $3$ | $(0, 3)$ | $(1, 5)$ |
| 4 | $y = 2x - 1$ | $-1$ | $(0, -1)$ | $(1, 1)$ |
| 5 | $y = 2x - 4$ | $-4$ | $(0, -4)$ | $(1, -2)$ |

*Beobachtung:* Alle Graphen sind *parallel* (gleiche Steigung), aber sie schneiden die y-Achse an verschiedenen Stellen. Der y-Achsenabschnitt verschiebt die Gerade nach oben oder unten.

## Folge B: Steigung variieren, y-Achsenabschnitt bleibt gleich

Alle Funktionen haben denselben y-Achsenabschnitt $b = 1$. Zeichne sie in *ein* Koordinatensystem.

| Nr. | Funktion | Steigung | Punkt für $x = 0$ | Punkt für $x = 1$ |
|----:|:---------|:---------|:----------------|:----------------|
| 6 | $y = 0 \cdot x + 1 = 1$ | $0$ | $(0, 1)$ | $(1, 1)$ |
| 7 | $y = 1 \cdot x + 1$ | $1$ | $(0, 1)$ | $(1, 2)$ |
| 8 | $y = 2 \cdot x + 1$ | $2$ | $(0, 1)$ | $(1, 3)$ |
| 9 | $y = \frac{1}{2} \cdot x + 1$ | $\frac{1}{2}$ | $(0, 1)$ | $(1, 1{,}5)$ |
| 10 | $y = -1 \cdot x + 1$ | $-1$ | $(0, 1)$ | $(1, 0)$ |
| 11 | $y = -2 \cdot x + 1$ | $-2$ | $(0, 1)$ | $(1, -1)$ |

*Beobachtung:* Alle Graphen gehen durch denselben Punkt $(0, 1)$, aber unter verschiedenen Steigungen. Negative Steigung bedeutet: nach rechts unten.

## Folge C: Werte berechnen aus gegebener Funktion

| Nr. | Funktion | $x = -2$ | $x = 0$ | $x = 1$ | $x = 5$ |
|----:|:---------|:-------|:------|:------|:------|
| 12 | $y = 3x - 1$ | $-7$ | $-1$ | $2$ | $14$ |
| 13 | $y = \frac{1}{2}x + 4$ | $3$ | $4$ | $4{,}5$ | $6{,}5$ |
| 14 | $y = -2x + 6$ | $10$ | $6$ | $4$ | $-4$ |
| 15 | $y = 0{,}1 x + 100$ | $99{,}8$ | $100$ | $100{,}1$ | $100{,}5$ |

*Beobachtung:* Bei $x = 0$ ist $y$ immer gleich dem y-Achsenabschnitt $b$. Bei jedem Schritt von $x = 0$ zu $x = 1$ ändert sich $y$ genau um den Wert der Steigung $m$.

## Folge D: Aus Graphen die Gleichung ablesen

Aus jedem Graphen sollen die Schüler den y-Achsenabschnitt $b$ und die Steigung $m$ bestimmen.

| Nr. | Beobachtungen am Graphen | Steigung $m$ | y-Achsenabschnitt $b$ | Funktionsgleichung |
|----:|:-------------------------|:-----------|:--------------------|:-------------------|
| 16 | Schnittpunkt mit y-Achse bei $(0, 2)$; pro $1$ nach rechts geht es $3$ nach oben | $3$ | $2$ | $y = 3x + 2$ |
| 17 | Schnittpunkt mit y-Achse bei $(0, -1)$; pro $2$ nach rechts geht es $1$ nach oben | $\frac{1}{2}$ | $-1$ | $y = \frac{1}{2}x - 1$ |
| 18 | Schnittpunkt mit y-Achse bei $(0, 5)$; pro $1$ nach rechts geht es $2$ nach unten | $-2$ | $5$ | $y = -2x + 5$ |
| 19 | Schnittpunkt mit y-Achse bei $(0, 0)$; pro $4$ nach rechts geht es $3$ nach oben | $\frac{3}{4}$ | $0$ | $y = \frac{3}{4}x$ |
| 20 | Gerade waagerecht durch $(0, 3)$ | $0$ | $3$ | $y = 3$ |

## Folge E: Aus zwei Punkten die Gleichung berechnen

Hier wird die Steigung als Verhältnis berechnet: $m = \frac{y_2 - y_1}{x_2 - x_1}$.

| Nr. | Punkt A | Punkt B | Steigung $m$ | y-Achsenabschnitt $b$ | Funktionsgleichung |
|----:|:--------|:--------|:-----------|:--------------------|:-------------------|
| 21 | $(0, 1)$ | $(1, 3)$ | $\frac{3-1}{1-0} = 2$ | $1$ (direkt aus Punkt A ablesbar) | $y = 2x + 1$ |
| 22 | $(0, 4)$ | $(2, 0)$ | $\frac{0-4}{2-0} = -2$ | $4$ | $y = -2x + 4$ |
| 23 | $(1, 5)$ | $(3, 11)$ | $\frac{11-5}{3-1} = 3$ | $5 - 3 \cdot 1 = 2$ | $y = 3x + 2$ |
| 24 | $(-2, 1)$ | $(4, 4)$ | $\frac{4-1}{4-(-2)} = \frac{3}{6} = \frac{1}{2}$ | $1 - \frac{1}{2} \cdot (-2) = 1 + 1 = 2$ | $y = \frac{1}{2}x + 2$ |
| 25 | $(2, 7)$ | $(5, 1)$ | $\frac{1-7}{5-2} = -2$ | $7 - (-2) \cdot 2 = 11$ | $y = -2x + 11$ |

## Folge F: Sachkontexte erkennen

Schüler übersetzen Sachverhalte in lineare Funktionen.

| Nr. | Sachkontext | Was ist $m$? | Was ist $b$? | Funktionsgleichung |
|----:|:------------|:-----------|:-----------|:-------------------|
| 26 | Ein Taxi kostet $4$ Euro Grundgebühr plus $2$ Euro pro Kilometer. Was kostet die Fahrt nach $x$ km? | $2$ (Euro pro km) | $4$ (Grundgebühr) | $y = 2x + 4$ |
| 27 | Eine Kerze ist $20$ cm hoch und brennt $0{,}5$ cm pro Stunde ab. Wie hoch ist sie nach $x$ Stunden? | $-0{,}5$ | $20$ | $y = -0{,}5 x + 20$ |
| 28 | Eine Sparkasse zahlt $50$ Euro Startguthaben und du legst $10$ Euro pro Monat dazu. Kontostand nach $x$ Monaten? | $10$ | $50$ | $y = 10x + 50$ |
| 29 | Du startest mit $0$ Euro und legst $15$ Euro pro Woche zurück. Wie viel hast du nach $x$ Wochen? | $15$ | $0$ | $y = 15x$ |
| 30 | Eine Pflanze ist $5$ cm hoch und wächst $1500$ cm pro Jahr. (Beachte die Plausibilität!) | $1500$ (cm/Jahr) | $5$ | $y = 1500x + 5$ (sehr unrealistisch – aber als Modell formal gültig) |

## Reflexionsfragen

1. Vergleiche Folge A und Folge B: In welcher Folge sind die Graphen *parallel*, in welcher gehen sie durch einen gemeinsamen Punkt? Warum?
2. Aufgabe 6 zeigt eine waagerechte Gerade. Warum ist eine waagerechte Gerade *trotzdem* eine lineare Funktion?
3. Aufgabe 20 zeigt eine senkrechte Gerade. Ist sie eine lineare Funktion? Warum nicht?
4. Aufgabe 30 ist als Modell *formal* korrekt, aber inhaltlich unsinnig. Welche Frage muss man sich bei jeder Modellierung stellen?
5. In Folge E (Aufgaben 23 und 24) ist der y-Achsenabschnitt nicht direkt aus den Punkten ablesbar. Wie berechnet man ihn aus der Steigung und einem Punkt?

## Didaktischer Kommentar

**Der Kern.** Lineare Funktionen sind ein Schlüsselthema in Klasse 8 – nicht nur als eigenständiger Stoff, sondern als Grundlage für *jede spätere Funktionsbetrachtung*. Wer die Parameter $m$ und $b$ als bedeutungstragende Größen versteht (und nicht nur als „Buchstaben in der Formel"), hat die richtige Vorstellung für quadratische Funktionen ($y = a \cdot x^2 + b \cdot x + c$), Exponentialfunktionen ($y = a \cdot q^x$) und alles, was später kommt.

**Was variiert in Folge A?**
Nur der y-Achsenabschnitt. Die Steigung ist konstant. Schüler erleben *isoliert*, was $b$ bewirkt – nämlich eine vertikale Verschiebung. Das ist Variation Theory in Reinkultur.

**Was variiert in Folge B?**
Nur die Steigung. Der y-Achsenabschnitt ist konstant. Schüler erleben *isoliert*, was $m$ bewirkt – nämlich die Neigung. Aufgaben 9 (Bruchsteigung), 10 und 11 (negative Steigung) und 6 (Steigung null) sind diagnostisch wichtig: Sie testen, ob die Vorstellung über die Standardfälle hinaus trägt.

**Was variiert in Folge C?**
Hier wird gerechnet, nicht gezeichnet. Schüler erleben numerisch, dass $y(0) = b$ und dass jeder x-Schritt um $1$ den y-Wert um $m$ erhöht. Aufgabe 15 mit unverhältnismäßigen Zahlen (kleine Steigung, großer y-Achsenabschnitt) prüft, ob die Vorstellung auch in ungewohnter Größenordnung greift.

**Was variiert in Folge D?**
Die Umkehrrichtung: vom Graphen zur Gleichung. Hier wird die Steigung *gelesen*, nicht berechnet. Aufgabe 17 (Bruchsteigung als Verhältnis $1$ zu $2$) und Aufgabe 20 (waagerechte Gerade als Sonderfall) sind die diagnostisch interessantesten.

**Was variiert in Folge E?**
Hier wird die Steigung *berechnet* aus zwei Punkten. Aufgaben 23–25 sind besonders wichtig, weil hier der y-Achsenabschnitt *nicht* direkt aus den gegebenen Punkten ablesbar ist – er muss aus Steigung und einem Punkt rechnerisch bestimmt werden. Das ist eine häufige Stolperfalle.

**Was variiert in Folge F?**
Sachkontext-Übersetzung. Schüler müssen erkennen: Was ist im Text der konstante Anteil ($b$)? Was ist der pro-Schritt-Anteil ($m$)? Aufgabe 30 fordert zur Plausibilitätsprüfung auf – essentiell für Modellierungskompetenz.

**Häufige Fehlvorstellungen**

- *„Die Steigung ist die Höhe des Steigungsdreiecks."* Falsch. Die Steigung ist das *Verhältnis* $\frac{\text{Höhe}}{\text{Breite}}$. Wer das verwechselt, kann eine Bruchsteigung wie $\frac{1}{2}$ nicht von einer ganzzahligen Steigung wie $2$ unterscheiden.
- *„Der y-Achsenabschnitt ist der x-Wert, an dem die Gerade die x-Achse schneidet."* Klassische Verwechslung von x- und y-Achse. Der y-Achsenabschnitt ist der y-Wert *an der Stelle $x = 0$*.
- *„Wenn die Steigung null ist, gibt es keine Funktion."* Doch. Eine konstante Funktion $y = b$ ist eine lineare Funktion mit Steigung null. Ihr Graph ist eine waagerechte Gerade.
- *„Eine senkrechte Gerade hat unendliche Steigung."* Sie ist *keine Funktion*, weil ein x-Wert mehrere y-Werte zugeordnet bekäme. Das ist der Punkt, an dem der Funktionsbegriff schärfer wird.
- *„$m$ und $b$ kann man aus jeder Gleichungsform direkt ablesen."* Nur aus der *expliziten Form* $y = m \cdot x + b$. Steht die Gleichung etwa als $2x + 3y = 6$, muss sie erst umgeformt werden.

**Möglicher Anschluss**

- Aufgabenfolge zur Schnittpunktberechnung zweier linearer Funktionen (verbindet mit linearen Gleichungssystemen).
- Diagnostische Fragen zu typischen Fehlern bei linearen Funktionen.
- Anwendungsaufgaben: Tarife, Kosten-Modelle, Geschwindigkeit-Zeit-Diagramme.
- Erweiterung in Klasse 9: Übergang zu nichtlinearen Funktionen (quadratisch, exponentiell) – mit dem Bezug, was *gleich bleibt* (Funktionsbegriff, Graphen, y-Achsenabschnitt) und was *anders wird* (keine konstante Steigung mehr).
