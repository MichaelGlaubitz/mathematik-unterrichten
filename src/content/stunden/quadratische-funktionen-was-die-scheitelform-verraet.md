---
titel: "Quadratische Funktionen: Was die Scheitelform verrät – und was nicht"
thema: "Quadratische Funktionen"
klassenstufe: ["9", "10"]
dauer: 90
stundenziel: "Die Lernenden lesen aus der Scheitelform f(x) = a(x − d)² + e den Scheitelpunkt und die Öffnung ab, begründen das Vorzeichen von d an der Verschiebung und unterscheiden Scheitelpunkt von Nullstellen."
kurz: "Das Minus in (x − 2)² verschiebt nach rechts – gegen jede Intuition. Diese Doppelstunde lässt die Klasse den Widerspruch selbst erzeugen, bevor sie ihn auflöst."
voraussetzungen:
  - "Die Normalparabel f(x) = x² zeichnen und Wertetabellen anlegen"
  - "Binomische Formeln anwenden"
  - "Graphen im Koordinatensystem lesen"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Beamer für den Funktionenplotter"
  - "Karopapier mit Koordinatensystem (Papier-Werkstatt)"
einstiegsfrage:
  frage: "Wo liegt der Scheitelpunkt von f(x) = (x − 2)² − 3?"
  antworten:
    - text: "(2 | −3)"
      korrekt: true
      deutung: "Trägt. Nachfragen, ob die Person das Vorzeichen von d begründen kann oder die Regel „Vorzeichen umdrehen“ anwendet – der Unterschied zeigt sich beim nächsten ungewohnten Fall."
    - text: "(−2 | −3)"
      korrekt: false
      deutung: "Die Zahl wird direkt aus der Klammer übernommen. Der häufigste Fehler und der Kern der Stunde: Das Minus in der Klammer verschiebt nach rechts, nicht nach links."
    - text: "(2 | 3)"
      korrekt: false
      deutung: "Bei d wird das Vorzeichen gedreht, bei e ebenfalls – die Regel wird auf beide Stellen angewandt, obwohl sie nur für eine gilt."
    - text: "(−2 | 3)"
      korrekt: false
      deutung: "Beide Zahlen unverändert übernommen beziehungsweise beide gedreht. Zeigt, dass die Form als Muster gelesen wird, aus dem Zahlen abgeschrieben werden."
  quiz: "quadratische-funktionen-scheitelform"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 10
    titel: "Ein Vorzeichen, zwei Meinungen"
    ablauf: "Die Einstiegsfrage steht an der Tafel, alle antworten gleichzeitig. Die Verteilung wird notiert und stehen gelassen. Zweite Frage ohne Abstimmung: Welche der vier Antworten könnte man am Graphen sofort ausschließen?"
    lehrkraft: "Nicht auflösen. Die zweite Frage lenkt die Aufmerksamkeit vom Ablesen auf das Prüfen – und genau das soll die Klasse in der nächsten Phase selbst tun."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 10
    dauer: 25
    titel: "Wertetabelle gegen Vermutung"
    ablauf: "Partnerarbeit: Für f(x) = (x − 2)² − 3 wird eine Wertetabelle von x = −1 bis x = 5 angelegt und der Graph gezeichnet. Erst danach wird die eigene Antwort aus der Einstiegsfrage daneben geschrieben."
    lehrkraft: "Keine Hinweise geben. Der Punkt der Phase ist, dass die Tabelle die Vermutung widerlegt – und zwar für die Lernenden selbst, nicht durch Ansage. Wer schnell fertig ist, legt dieselbe Tabelle für f(x) = (x + 2)² − 3 an."
  - schritt: "A"
    minute: 35
    dauer: 20
    titel: "Warum das Minus nach rechts schiebt"
    ablauf: "Die Frage an die Klasse: Für welches x wird die Klammer null? Aus der Antwort x = 2 folgt alles Weitere. Die Klasse formuliert, warum genau dort der tiefste Punkt liegt: weil ein Quadrat nie negativ wird und die Klammer nur an dieser Stelle verschwindet."
    lehrkraft: "Das ist die Begründung, die die Stunde trägt – kein Merkspruch, sondern eine Ableitung aus der Struktur. Sie funktioniert auch bei (x − 7)², bei (2x − 6)² und in der Oberstufe weiter."
  - schritt: "A"
    minute: 55
    dauer: 15
    titel: "Am Schieberegler alle drei Parameter"
    ablauf: "Am Funktionenplotter werden a, d und e nacheinander verändert. Die Klasse sagt jeweils vorher, was passiert, und prüft danach. Zuletzt: negatives a."
    lehrkraft: "Nur einen Parameter gleichzeitig verändern, die anderen sichtbar festhalten. Bei a zwischen 0 und 1 innehalten: Die Parabel wird breiter, obwohl a größer als null ist – „a größer heißt schmaler“ gilt nur für den Betrag."
    werkzeug: { text: "Funktionenplotter", href: "/werkzeuge/funktionenplotter.html" }
  - schritt: "R"
    minute: 70
    dauer: 15
    titel: "Hin und her zwischen den Formen"
    ablauf: "Aus der Aufgabenfolge die Aufgaben zum Wechsel zwischen Scheitel- und Normalform. Zu jeder Funktion wird der Scheitelpunkt notiert – und danach geprüft, ob er zum Graphen passt."
    lehrkraft: "Die Probe ist Pflicht: f(d) muss e ergeben. Das ist in zehn Sekunden gemacht und deckt jeden Vorzeichenfehler auf."
    werkzeug: { text: "Aufgabenfolge Scheitelpunkt und Normalform", href: "/aufgaben/quadratische-funktionen-scheitelpunkt-und-normalform" }
  - schritt: "R"
    minute: 85
    dauer: 5
    titel: "Exit-Ticket"
    ablauf: "Drei Fragen: Scheitelpunkt ablesen, Scheitelform aufstellen, Fehlersuche."
    lehrkraft: "Frage 3 zeigt, ob die Begründung angekommen ist oder nur eine neue Regel gelernt wurde."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % lesen den Scheitelpunkt richtig ab."
    dann: "Die Wertetabellenphase auf zehn Minuten kürzen und stattdessen die quadratische Ergänzung anschließen: Wie kommt man von f(x) = x² − 4x + 1 auf die Scheitelform? Die Probe f(2) = −3 verbindet beide Stunden."
  - wenn: "Ein großer Teil antwortet (−2 | −3)."
    dann: "Genau wie geplant. In der Erarbeitungsphase darauf bestehen, dass der Graph gezeichnet wird – die Tabelle allein überzeugt viele nicht, das Bild schon."
  - wenn: "Auch die Wertetabelle führt nicht zur Korrektur."
    dann: "Die Nullstellenfrage vorziehen: Für welches x wird die Klammer null? Diese eine Frage löst den Knoten häufiger als jede Zeichnung, weil sie an einer bekannten Handlung ansetzt."
  - wenn: "Beim Schieberegler wird a mit der Verschiebung verwechselt."
    dann: "a auf 1 festsetzen und erst d und e sichern. Die Streckung ist ein eigener Lerngegenstand und kann in die Folgestunde."
exitTicket:
  - "Wo liegt der Scheitelpunkt von f(x) = (x + 3)² − 5?"
  - "Eine Parabel ist nach unten geöffnet und hat den Scheitelpunkt (1 | 4). Gib eine mögliche Funktionsgleichung in Scheitelform an."
  - "Jemand sagt: „Bei f(x) = (x − 2)² − 3 sind die Nullstellen 2 und −3.“ Was ist hier verwechselt worden?"
differenzierung:
  schneller: "Bestimme die Nullstellen von f(x) = (x − 2)² − 3 exakt. (x = 2 ± √3, also ungefähr 0,27 und 3,73.) Danach: Für welche Werte von e hat f(x) = (x − 2)² + e gar keine Nullstelle?"
  langsamer: "Nur Funktionen der Form f(x) = (x − d)² + e mit a = 1 und ganzzahligen d, e. Zu jeder wird zuerst der Scheitelpunkt genannt, dann eine Wertetabelle mit fünf Punkten um den Scheitel angelegt."
stolpersteine:
  - fehlvorstellung: "Das Vorzeichen in der Klammer wird direkt übernommen: (x − 2)² hat den Scheitel bei x = −2."
    reaktion: "Die Frage stellen, für welches x die Klammer null wird. Aus x − 2 = 0 folgt x = 2 – das ist keine Regel, sondern eine Gleichung."
  - fehlvorstellung: "Scheitelpunkt und Nullstellen werden verwechselt."
    reaktion: "Den Graphen zeichnen und beide markieren. Der Scheitel ist ein Punkt, die Nullstellen sind zwei Stellen – und sie liegen symmetrisch um den Scheitel."
  - fehlvorstellung: "„a größer bedeutet schmaler“ – auch für a zwischen 0 und 1."
    reaktion: "Am Plotter a = 0,5 und a = 2 nebeneinanderlegen. Es ist der Betrag von a, der über die Breite entscheidet."
hausaufgabe: "Aus der Aufgabenfolge die Aufgaben zum Ablesen des Scheitelpunkts, jeweils mit der Probe f(d) = e. Zusätzlich: Skizziere die Parabeln zu (x − 3)² und (x + 3)² in ein gemeinsames Koordinatensystem und beschrifte beide Scheitelpunkte."
tags: ["quadratische-funktionen", "scheitelform", "parabel", "funktionenplotter", "klar", "doppelstunde"]
datum: 2026-08-28
entwurf: false
---

## Tafelbild

| x | −1 | 0 | 1 | 2 | 3 | 4 | 5 |
|:--|--:|--:|--:|--:|--:|--:|--:|
| f(x) = (x − 2)² − 3 | 6 | 1 | −2 | −3 | −2 | 1 | 6 |

Darunter die Frage, die alles entscheidet, und die Antwort der Klasse:

> **Für welches x wird die Klammer null?**
> Für x = 2. Und weil ein Quadrat nie negativ ist, ist f(x) genau dort am kleinsten: f(2) = −3.

Rechts daneben der Graph mit markiertem Scheitel (2 | −3) und den beiden Nullstellen, die *nicht* bei 2 und −3 liegen.

## Warum die Wertetabelle sieben Werte hat

Von x = −1 bis x = 5, also drei links und drei rechts vom Scheitel. Das ist Absicht: Die Symmetrie wird nur sichtbar, wenn beide Seiten gleich weit reichen. Eine Tabelle von 0 bis 4 würde funktionieren, eine von 0 bis 6 würde die Symmetrieachse verstecken – und die Symmetrieachse ist der beste Zugang zum Scheitelpunkt, den es in dieser Klassenstufe gibt.

Die Werte sind zudem alle ganzzahlig. Das ist nicht selbstverständlich und bei der Aufgabenauswahl berücksichtigt: In der Erarbeitungsphase soll die Aufmerksamkeit bei der Struktur liegen, nicht beim Rechnen.

## Didaktischer Kommentar

**Warum die Fehlvorstellung so robust ist.** „Minus zwei heißt zwei nach links“ ist keine Dummheit, sondern eine sinnvolle Übertragung: Bei f(x) = x² − 3 verschiebt das Minus tatsächlich nach unten. Der Unterschied ist, dass e den Funktionswert verändert, d aber das Argument – und eine Änderung am Argument wirkt entgegengesetzt. Diese Asymmetrie ist der eigentliche Inhalt der Stunde und begegnet später bei jeder Funktionsklasse wieder.

**Warum die Nullstellenfrage die Begründung trägt.** Merksprüche wie „Vorzeichen umdrehen“ funktionieren genau so lange, wie die Aufgaben aussehen wie die geübten. Die Frage „für welches x wird die Klammer null?“ ist dagegen eine Handlung, die die Klasse längst kann, und sie trägt weiter: bei (2x − 6)², bei Betragsfunktionen, bei Verschiebungen in der Oberstufe. Wer sie einmal gestellt hat, braucht den Merkspruch nicht mehr.

**Warum Scheitelpunkt und Nullstellen ausdrücklich getrennt werden.** Die dritte Exit-Frage zielt auf eine Verwechslung, die in Klassenarbeiten regelmäßig auftaucht: Aus (x − 2)² − 3 werden „die Nullstellen 2 und −3“ gelesen. Dahinter steckt die Vorstellung, aus einer Funktionsgleichung ließen sich die wichtigen Zahlen direkt ablesen – ohne Unterscheidung, was sie bedeuten. Ein gezeichneter Graph mit beiden Markierungen räumt das schneller aus als jede Definition.

**Warum a zuletzt kommt.** Streckung und Verschiebung sind unabhängig, aber die Streckung ist die schwierigere Vorstellung – besonders für 0 < a < 1, wo „größer“ und „schmaler“ auseinanderfallen. Wer alle drei Parameter gleichzeitig einführt, bekommt keine drei Einsichten, sondern eine Regel mit drei Plätzen. In dieser Stunde ist a bis Minute 55 fest auf 1.

## Zum Weiterarbeiten

- [Werkzeug: Funktionenplotter](/werkzeuge/funktionenplotter.html) – a, d und e am Schieberegler
- [Aufgabenfolge: Scheitelpunkt und Normalform](/aufgaben/quadratische-funktionen-scheitelpunkt-und-normalform)
- [Diagnostische Fragen: Scheitelform](/quizzes/quadratische-funktionen-scheitelform)
- [Aufgabenfolge: Satz vom Nullprodukt](/aufgaben/quadratische-gleichungen-satz-vom-nullprodukt) – der Weg zu den Nullstellen
