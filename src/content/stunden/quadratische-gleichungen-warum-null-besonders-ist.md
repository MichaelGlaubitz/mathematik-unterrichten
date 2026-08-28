---
titel: "Quadratische Gleichungen: Warum die Null besonders ist"
thema: "Quadratische Gleichungen"
klassenstufe: ["9", "10"]
dauer: 45
stundenziel: "Die Lernenden begründen den Satz vom Nullprodukt und wenden ihn an – einschließlich der Einsicht, dass er nur gilt, wenn auf der anderen Seite tatsächlich null steht."
kurz: "Aus (x − 2)(x + 5) = 0 folgt x = 2 oder x = −5. Aus (x − 2)(x + 5) = 8 folgt nichts dergleichen. Eine Einzelstunde über die Bedingung, die immer mitgelesen werden muss."
voraussetzungen:
  - "Terme faktorisieren (Ausklammern, binomische Formeln)"
  - "Lineare Gleichungen lösen"
  - "Multiplikation mit null"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Beamer für den Funktionenplotter"
einstiegsfrage:
  frage: "Aus (x − 2)(x + 5) = 0 folgt x = 2 oder x = −5. Was folgt aus (x − 2)(x + 5) = 8?"
  antworten:
    - text: "Nichts davon – man muss erst ausmultiplizieren und umformen."
      korrekt: true
      deutung: "Trägt. Nachfragen, warum der Schluss bei 0 erlaubt ist und bei 8 nicht – „nur bei null muss einer der Faktoren null sein“ ist die Antwort, um die es geht."
    - text: "x = 10 oder x = 3"
      korrekt: false
      deutung: "Die Regel wird auf die 8 übertragen: x − 2 = 8 oder x + 5 = 8. Die zentrale Fehlvorstellung der Stunde – und sie liefert hier sogar zufällig eine richtige Lösung (x = 3)."
    - text: "x = 2 oder x = −5, das ändert sich nicht."
      korrekt: false
      deutung: "Die rechte Seite wird überlesen. Zeigt, dass das Muster erkannt und die Bedingung nicht mitgelesen wird."
    - text: "Die Gleichung hat keine Lösung."
      korrekt: false
      deutung: "Vorsichtig und falsch: Sie hat zwei (x = 3 und x = −6). Diese Antwort lohnt eine Nachfrage – was müsste gelten, damit eine quadratische Gleichung keine Lösung hat?"
  quiz: "quadratische-gleichungen-nullprodukt"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 8
    titel: "Null oder acht"
    ablauf: "Die Einstiegsfrage steht an der Tafel, alle antworten gleichzeitig. Danach ohne Auflösung eine zweite Frage: Zwei Zahlen ergeben multipliziert 0. Was weißt du über sie? Und wenn sie 8 ergeben?"
    lehrkraft: "Die zweite Frage ist der ganze Satz vom Nullprodukt, nur ohne Variablen. Fast jede Klasse beantwortet sie richtig – und merkt dabei selbst, dass die erste Frage dieselbe war."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 8
    dauer: 12
    titel: "Alle Zerlegungen suchen"
    ablauf: "Partnerarbeit: Finde möglichst viele Zahlenpaare mit Produkt 8. Dann dasselbe für Produkt 0. Der Unterschied zwischen den beiden Listen wird notiert."
    lehrkraft: "Die Liste für 8 ist unendlich lang und enthält kein Muster. Die Liste für 0 hat eines: In jedem Paar steht mindestens eine Null. Diesen Unterschied selbst finden zu lassen, ist der Kern der Stunde."
  - schritt: "A"
    minute: 20
    dauer: 14
    titel: "Vom Zahlenpaar zur Gleichung"
    ablauf: "Der gefundene Unterschied wird auf die Klammern übertragen: Wenn (x − 2)(x + 5) null ergibt, muss eine der Klammern null sein. Anschließend die Gegenprobe an (x − 2)(x + 5) = 8: ausmultiplizieren, auf null bringen, faktorisieren, lösen."
    lehrkraft: "Der Umweg über die Null ist der Punkt: x² + 3x − 10 = 8 wird zu x² + 3x − 18 = 0 und damit zu (x − 3)(x + 6) = 0. Jetzt greift der Satz wieder – weil rechts wieder null steht."
  - schritt: "R"
    minute: 34
    dauer: 7
    titel: "Erst prüfen, dann anwenden"
    ablauf: "Sechs Gleichungen. Zu jeder wird zuerst nur entschieden, ob der Satz vom Nullprodukt direkt anwendbar ist – erst danach wird gerechnet."
    lehrkraft: "Die Vorabprüfung ist Pflicht. Sie kostet fünf Sekunden und verhindert den Fehler, um den es in dieser Stunde geht."
    werkzeug: { text: "Aufgabenfolge: Satz vom Nullprodukt", href: "/aufgaben/quadratische-gleichungen-satz-vom-nullprodukt" }
  - schritt: "R"
    minute: 41
    dauer: 4
    titel: "Exit-Ticket"
    ablauf: "Zwei Fragen: eine Anwendung und eine Fehlersuche."
    lehrkraft: "Bei der Fehlersuche kommt es auf die Begründung an, nicht auf das richtige Ergebnis."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % erkennen, dass bei 8 nichts folgt."
    dann: "Direkt zur Verbindung mit den Nullstellen übergehen: Warum heißt die Lösung einer quadratischen Gleichung „Nullstelle“ der zugehörigen Funktion? Am Plotter ist der Zusammenhang in zwei Minuten sichtbar."
  - wenn: "Viele antworten „x = 10 oder x = 3“."
    dann: "Wie geplant. In der Abgleichphase die Probe machen lassen: Für x = 10 ist (10 − 2)(10 + 5) = 120, nicht 8. Für x = 3 stimmt es zufällig – und genau das macht den Fehler so langlebig."
  - wenn: "Der Unterschied zwischen den beiden Zahlenlisten wird nicht gesehen."
    dann: "Die Frage zuspitzen: Kann ein Produkt null sein, ohne dass ein Faktor null ist? Nach zwei Minuten Suchen ist die Antwort klar – und sie ist ein Beweis, kein Merksatz."
  - wenn: "Das Faktorisieren nach dem Umformen gelingt nicht."
    dann: "Nicht die Stunde umwidmen. Die faktorisierte Form vorgeben und nur den Schluss ziehen lassen. Das Faktorisieren ist Stoff der Vorstunde und darf hier vorausgesetzt oder ersetzt werden."
exitTicket:
  - "Löse: x(x − 7) = 0 und (x + 3)(x − 4) = 0."
  - "Jemand rechnet: (x − 1)(x + 2) = 4, also x − 1 = 4 oder x + 2 = 4. Was ist hier schiefgegangen, und wie geht es richtig?"
differenzierung:
  schneller: "Für welche Zahl c hat (x − 2)(x + 5) = c genau eine Lösung? (Für c = −12,25 – der Scheitelpunkt der Parabel liegt bei (−1,5 | −12,25).) Prüfe am Plotter."
  langsamer: "Nur Gleichungen, die bereits in faktorisierter Form mit null auf der rechten Seite stehen. Das Umformen folgt in der nächsten Stunde."
stolpersteine:
  - fehlvorstellung: "Der Satz vom Nullprodukt wird auf beliebige Zahlen übertragen."
    reaktion: "Die Zahlenliste für Produkt 8 zeigen. Es gibt unendlich viele Paare, und keines ist durch die 8 festgelegt. Bei 0 ist es anders – und nur deshalb funktioniert der Schluss."
  - fehlvorstellung: "Eine Lösung genügt (nur eine Klammer wird betrachtet)."
    reaktion: "Am Plotter die Parabel zeichnen. Zwei Schnittpunkte mit der x-Achse, also zwei Lösungen. Wer nur eine angibt, hat die halbe Antwort."
  - fehlvorstellung: "x² = 16 hat nur die Lösung x = 4."
    reaktion: "Beide Zahlen einsetzen lassen: 4² = 16 und (−4)² = 16. Die Wurzel liefert den positiven Wert; die Gleichung hat trotzdem zwei Lösungen."
hausaufgabe: "Aus der Aufgabenfolge die Aufgaben zum Nullprodukt. Zusätzlich: Schreibe eine Gleichung auf, bei der jemand durch falsche Anwendung des Satzes auf x = 5 kommen könnte, obwohl die richtige Lösung eine andere ist."
tags: ["quadratische-gleichungen", "nullprodukt", "faktorisieren", "klar", "einzelstunde"]
datum: 2026-08-28
entwurf: false
---

## Tafelbild

| Produkt = 0 | Produkt = 8 |
|:--|:--|
| 0 · 5 · 0 · (−3) · 7 · 0 · 0 · 0 | 1 · 8 · 2 · 4 · 16 · 0,5 · (−2) · (−4) · … |
| In **jedem** Paar steht eine Null. | Kein Muster; unendlich viele Paare. |

> **Ein Produkt ist genau dann null, wenn mindestens ein Faktor null ist. Für jede andere Zahl gilt nichts Vergleichbares.**

Darunter die beiden Gleichungen nebeneinander:

| (x − 2)(x + 5) = 0 | (x − 2)(x + 5) = 8 |
|:--|:--|
| x − 2 = 0 **oder** x + 5 = 0 | x² + 3x − 10 = 8 |
| x = 2 oder x = −5 | x² + 3x − 18 = 0 |
| | (x − 3)(x + 6) = 0 |
| | x = 3 oder x = −6 |

## Warum x = 3 die Sache so schwierig macht

Der falsche Weg (x − 2 = 8 oder x + 5 = 8) liefert x = 10 und x = 3. Die zweite Zahl ist tatsächlich eine Lösung – aber aus dem falschen Grund. Genau diese Art von Zufallstreffer hält Fehlvorstellungen am Leben: Der Fehler wird nicht bestraft, sondern gelegentlich belohnt.

Deshalb gehört die Probe in dieser Stunde ausdrücklich dazu, und zwar für *beide* gefundenen Werte. Wer x = 10 einsetzt, bekommt 120 statt 8 und weiß, dass der Weg nicht taugt – auch wenn ein Ergebnis stimmte.

## Didaktischer Kommentar

**Warum der Satz vom Nullprodukt kein Verfahren ist.** Er ist eine Aussage über Zahlen: Nur die Null hat die Eigenschaft, dass ein Produkt sie nur erreichen kann, wenn ein Faktor sie ist. Wer ihn als Verfahren lernt („Klammern gleich null setzen“), hat kein Kriterium dafür, wann er anwendbar ist – und wendet ihn dann auch auf die 8 an. Die Zahlenlisten der Erarbeitungsphase liefern das Kriterium in fünf Minuten.

**Warum die Frage ohne Variablen gestellt wird.** „Zwei Zahlen ergeben multipliziert 0 – was weißt du über sie?“ beantworten fast alle richtig. Dieselbe Frage mit Klammern und x beantwortet ein Teil der Klasse falsch. Der Unterschied liegt nicht im Inhalt, sondern in der Notation: Sobald Variablen im Spiel sind, wird nach Mustern gesucht statt nach Bedeutung. Die Rückführung auf die Zahlenfrage nimmt der Aufgabe ihre Fremdheit.

**Warum das Umformen dazugehört.** Es genügt nicht, den falschen Weg zu verbieten; die Klasse braucht den richtigen. Er ist kurz: ausmultiplizieren, alles auf eine Seite, faktorisieren, Satz anwenden. Wichtig ist, dass am Ende wieder eine Null rechts steht – dann ist es keine neue Regel, sondern dieselbe.

**Warum die Differenzierungsaufgabe zum Scheitelpunkt führt.** „Für welches c hat (x − 2)(x + 5) = c genau eine Lösung?“ verbindet diese Stunde mit der Scheitelform. Die Antwort −12,25 ist der kleinste Wert, den das Produkt annimmt; darunter gibt es keine Lösung, darüber zwei. Wer das am Plotter sieht, hat den Zusammenhang zwischen Lösungsanzahl und Graph verstanden – und braucht die Diskriminante später nur noch als Rechenweg.

## Zum Weiterarbeiten

- [Aufgabenfolge: Satz vom Nullprodukt](/aufgaben/quadratische-gleichungen-satz-vom-nullprodukt)
- [Diagnostische Fragen: Nullprodukt](/quizzes/quadratische-gleichungen-nullprodukt)
- [Stundenverlauf: Was die Scheitelform verrät](/stunden/quadratische-funktionen-was-die-scheitelform-verraet)
- [Werkzeug: Funktionenplotter](/werkzeuge/funktionenplotter.html)
