---
titel: "Binomische Formeln: Woher der mittlere Term kommt"
thema: "Binomische Formeln"
klassenstufe: ["8"]
dauer: 45
stundenziel: "Die Lernenden begründen am Flächenbild, warum (a + b)² den Term 2ab enthält, und wenden die drei binomischen Formeln in beide Richtungen an."
kurz: "(a + b)² = a² + b² ist der teuerste Fehler der Klasse 8. Am Quadratbild ist er in dreißig Sekunden widerlegt – und danach ist die Formel keine Formel mehr, sondern ein Bild."
voraussetzungen:
  - "Terme ausmultiplizieren (Distributivgesetz)"
  - "Flächeninhalt von Rechteck und Quadrat"
  - "Potenzen mit Variablen"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Karopapier"
  - "Beamer für die Papier-Werkstatt"
einstiegsfrage:
  frage: "Was ist (a + b)²?"
  antworten:
    - text: "a² + 2ab + b²"
      korrekt: true
      deutung: "Trägt. Nachfragen, woher der Term 2ab kommt – wer „steht so in der Formel“ antwortet, hat die Formel, aber nicht den Grund."
    - text: "a² + b²"
      korrekt: false
      deutung: "Das Quadrieren wird auf beide Summanden verteilt, wie es bei der Multiplikation erlaubt ist. Die häufigste algebraische Fehlvorstellung der Mittelstufe und der Gegenstand der Stunde."
    - text: "a² + ab + b²"
      korrekt: false
      deutung: "Der Mittelterm ist erkannt, aber nur einmal gezählt. Zeigt, dass ausmultipliziert wurde – nur unvollständig. Didaktisch näher am Ziel als die vorige Antwort."
    - text: "2a + 2b"
      korrekt: false
      deutung: "Das Quadrat wird als Faktor 2 gelesen. Hier fehlt die Bedeutung des Exponenten; das ist ein anderer Lerngegenstand und sollte gesondert geklärt werden."
  quiz: "binomische-formeln-erkennen"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 7
    titel: "Die Behauptung prüfen"
    ablauf: "Die Einstiegsfrage steht an der Tafel, alle antworten gleichzeitig. Danach ohne Auflösung: „Prüft eure Antwort mit a = 3 und b = 4.“"
    lehrkraft: "Die Probe erledigt die Diagnose selbst: (3 + 4)² ist 49, a² + b² wäre 25. Nicht kommentieren – nur zusehen, wer die Zahlen einsetzt und wer nicht."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 7
    dauer: 15
    titel: "Das Quadrat zerlegen"
    ablauf: "Partnerarbeit auf Karopapier: Ein Quadrat mit der Seitenlänge a + b wird gezeichnet (a = 5 Kästchen, b = 3 Kästchen) und in vier Teilflächen zerlegt. Jede Teilfläche wird beschriftet und ihr Inhalt notiert."
    lehrkraft: "Die vier Flächen sind a², ab, ab und b². Nicht vorwegnehmen, dass zwei davon gleich groß sind – das ist die Entdeckung. Wer nur drei Flächen findet, hat das Quadrat falsch geteilt und braucht nur die Frage: Wie viele Rechtecke sind es?"
    werkzeug: { text: "Papier-Werkstatt: Karopapier", href: "/werkzeuge/karopapier.html" }
  - schritt: "A"
    minute: 22
    dauer: 14
    titel: "Vom Bild zur Formel"
    ablauf: "Das Flächenbild kommt an die Tafel. Aus den vier Teilflächen entsteht der Term. Danach dasselbe für (a − b)² und (a + b)(a − b) – bei beiden wird gefragt, was sich am Bild ändert."
    lehrkraft: "Bei (a − b)² zeigt das Bild ein kleineres Quadrat, aus dem zweimal ein Streifen abgezogen wird – die Ecke wird dabei zweimal weggenommen und muss einmal zurück. Genau daher kommt das +b². Bei der dritten Formel reicht das Ausmultiplizieren; ein Bild dafür kostet mehr Zeit, als es bringt."
  - schritt: "R"
    minute: 36
    dauer: 5
    titel: "In beide Richtungen"
    ablauf: "Vier Terme ausmultiplizieren, vier faktorisieren. Die Rückrichtung ist die eigentliche Übung."
    lehrkraft: "Beim Faktorisieren ist die Frage immer dieselbe: Passt der mittlere Term zu den beiden Quadraten? Bei x² + 10x + 25 ist 2 · 1 · 5 = 10 – es passt."
    werkzeug: { text: "Aufgabenfolge: Drei Muster", href: "/aufgaben/binomische-formeln-drei-muster" }
  - schritt: "R"
    minute: 41
    dauer: 4
    titel: "Exit-Ticket"
    ablauf: "Zwei Fragen: eine Anwendung und eine Fehlersuche mit Begründung."
    lehrkraft: "Wer bei der Fehlersuche das Zahlenbeispiel als Gegenbeweis benutzt, hat aus der Stunde mehr mitgenommen als eine Formel."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % antworten a² + 2ab + b²."
    dann: "Die Flächenphase kürzen und den Rückwärtsweg vertiefen: x² + 6x + 9, x² − 49, x² + 6x + 8. Die dritte passt zu keiner binomischen Formel – und dieser Unterschied ist wichtiger als zehn weitere passende Terme."
  - wenn: "Ein großer Teil antwortet a² + b²."
    dann: "Wie geplant. Die Probe mit a = 3, b = 4 vor der Flächenphase ausdrücklich einfordern: 49 gegen 25 ist ein Unterschied, den man nicht wegdiskutieren kann."
  - wenn: "Viele antworten 2a + 2b."
    dann: "Hier fehlt die Bedeutung des Exponenten, nicht die binomische Formel. Fünf Minuten einschieben: 3², 5², x², (2x)². Ohne diese Grundlage bringt die Stunde nichts."
  - wenn: "Die Zerlegung des Quadrats gelingt nicht."
    dann: "Ein vorbereitetes Quadrat mit eingezeichneten Trennlinien austeilen. Zu beschriften bleibt genug; das Zeichnen ist nicht der Lerngegenstand."
exitTicket:
  - "Multipliziere aus: (x + 6)². Und faktorisiere: x² − 81."
  - "Jemand schreibt (x + 5)² = x² + 25. Widerlege das mit einer einzigen Zahl."
differenzierung:
  schneller: "Rechne im Kopf: 102². (100² + 2 · 100 · 2 + 2² = 10 404.) Danach 99² und 101 · 99. Welche Formel passt jeweils, und warum ist das schneller als schriftlich zu multiplizieren?"
  langsamer: "Nur die erste binomische Formel, dafür mit drei verschiedenen Zahlenpaaren am Flächenbild geprüft. Die zweite und dritte folgen in der nächsten Stunde."
stolpersteine:
  - fehlvorstellung: "(a + b)² = a² + b² – das Quadrieren wird über die Summe verteilt."
    reaktion: "Mit Zahlen prüfen lassen: (3 + 4)² = 49, aber 3² + 4² = 25. Ein Gegenbeispiel genügt, und die Klasse findet es selbst."
  - fehlvorstellung: "Der mittlere Term wird nur einmal gezählt (a² + ab + b²)."
    reaktion: "Am Flächenbild die beiden Rechtecke zeigen. Es sind zwei, weil das Quadrat zwei Seiten hat – oben und rechts."
  - fehlvorstellung: "Beim Faktorisieren wird nicht geprüft, ob der mittlere Term passt."
    reaktion: "x² + 6x + 8 vorlegen. Die Quadrate stimmen nicht mit 2ab zusammen; hier hilft keine binomische Formel, sondern die Zerlegung in (x + 2)(x + 4)."
hausaufgabe: "Aus der Aufgabenfolge die Aufgaben zum Ausmultiplizieren und zum Faktorisieren. Zusätzlich: Zeichne das Flächenbild für (a + b)² mit a = 4 und b = 2 und schreibe an jede Teilfläche ihren Inhalt."
tags: ["binomische-formeln", "flaechenbild", "faktorisieren", "klar", "einzelstunde"]
datum: 2026-08-28
entwurf: false
---

## Das Flächenbild

Ein Quadrat mit der Seitenlänge a + b, geteilt in vier Teile:

| | Breite a | Breite b |
|:--|:--|:--|
| **Höhe a** | a² | a · b |
| **Höhe b** | a · b | b² |

Zusammen: a² + ab + ab + b² = **a² + 2ab + b²**

Der mittlere Term ist keine Zutat der Formel, sondern die Fläche der beiden Rechtecke, die entstehen, wenn man ein Quadrat auf zwei Seiten verlängert. Wer das Bild einmal gezeichnet hat, muss sich die Formel nicht merken – er kann sie in zwanzig Sekunden wiederherstellen.

## Die drei Formeln nebeneinander

| Formel | ausmultipliziert | am Bild |
|:--|:--|:--|
| (a + b)² | a² + 2ab + b² | Quadrat auf zwei Seiten verlängert |
| (a − b)² | a² − 2ab + b² | Quadrat auf zwei Seiten verkürzt; die Ecke wird zweimal abgezogen und einmal zurückgegeben |
| (a + b)(a − b) | a² − b² | Rechteck, das aus dem Quadrat durch Umlegen eines Streifens entsteht |

## Warum das Zahlenbeispiel vor dem Bild kommt

Die Probe mit a = 3 und b = 4 dauert zehn Sekunden und liefert 49 gegen 25. Sie widerlegt die Fehlvorstellung, erklärt sie aber nicht – man weiß danach, dass a² + b² falsch ist, nicht warum. Das Bild liefert die Erklärung.

Beide Schritte sind nötig, und die Reihenfolge ist es auch: Wer die Erklärung bekommt, bevor er das Problem gesehen hat, hört eine weitere Herleitung. Wer zuerst gemerkt hat, dass seine Antwort nicht stimmen kann, hat eine Frage – und dann ist das Bild eine Antwort.

## Didaktischer Kommentar

**Warum dieser Fehler so verbreitet ist.** Er ist eine korrekte Regel am falschen Ort. Bei (a · b)² ist a² · b² tatsächlich richtig; das Quadrieren verteilt sich über die Multiplikation, nur nicht über die Addition. Lernende, die a² + b² schreiben, wenden also etwas an, das sie richtig gelernt haben – im falschen Fall. Diese Unterscheidung ausdrücklich zu benennen, ist wirksamer, als den Fehler nur zu korrigieren.

**Warum die Rückrichtung mehr Zeit verdient.** Ausmultiplizieren lässt sich durch stures Anwenden der Formel bewältigen. Faktorisieren nicht: Dort muss erkannt werden, ob überhaupt eine binomische Formel vorliegt. Die Kontrollfrage „passt der mittlere Term zu den beiden Quadraten?“ ist der eigentliche Ertrag und wird in Klassenarbeiten regelmäßig gebraucht.

**Warum das Kopfrechnen in die Differenzierung gehört.** 102² = 10 404 über die erste binomische Formel zu rechnen, ist ein echter Anwendungsfall und für viele eine Überraschung: Die Formel ist nicht nur Algebra, sie spart Arbeit. Für die schnelle Gruppe ist das eine gute Aufgabe; für die ganze Klasse wäre es ein zweiter Lerngegenstand in einer 45-Minuten-Stunde.

## Zum Weiterarbeiten

- [Aufgabenfolge: Binomische Formeln – drei Muster](/aufgaben/binomische-formeln-drei-muster)
- [Diagnostische Fragen: Binomische Formeln erkennen](/quizzes/binomische-formeln-erkennen)
- [Übungsgenerator Binomische Formeln](/uebung/binomische-formeln)
- [Fehlvorstellungen zu binomischen Formeln](/fehlvorstellungen#thema-binomische-formeln)
