---
titel: "Das Minus vor der Klammer – warum es alles trifft"
thema: "Termumformungen"
klassenstufe: ["7"]
dauer: 45
stundenziel: "Die Lernenden lösen Klammern mit vorangestelltem Minuszeichen korrekt auf und begründen an Zahlenbeispielen, warum sich dabei jedes Vorzeichen in der Klammer umkehrt."
kurz: "Der teuerste Vorzeichenfehler der Mittelstufe in einer Einzelstunde: erst an Zahlen prüfen, dann an Variablen begründen. Wer die Regel nur lernt, wendet sie auf den ersten Summanden an."
voraussetzungen:
  - "Rechnen mit negativen Zahlen"
  - "Terme mit Variablen zusammenfassen"
  - "Klammern mit vorangestelltem Plus auflösen"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Beamer für den Kopfrechen-Sprint als Einstieg"
einstiegsfrage:
  frage: "Was ist 12 − (5 − 3)?"
  antworten:
    - text: "10"
      korrekt: true
      deutung: "Trägt. Nachfragen, ob zuerst die Klammer ausgerechnet oder die Klammer aufgelöst wurde – beides führt hier zum Ziel, aber nur eines lässt sich auf Variablen übertragen."
    - text: "4"
      korrekt: false
      deutung: "Die Klammer wird weggelassen, ohne die Vorzeichen anzupassen: 12 − 5 − 3. Der Kernfehler der Stunde, und er ist an Zahlen sofort überprüfbar."
    - text: "14"
      korrekt: false
      deutung: "Beide Vorzeichen umgedreht: 12 − 5 + 3 wäre 10, 12 + 5 − 3 wäre 14. Hier wurde das Minus vor der Klammer auf das falsche Element angewandt."
    - text: "20"
      korrekt: false
      deutung: "Alle Vorzeichen umgekehrt, einschließlich der 12. Selten, aber ein deutlicher Hinweis darauf, dass die Struktur des Terms nicht gelesen wurde."
  quiz: "vorzeichenfehler-bei-klammern"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 8
    titel: "Vier Rechnungen, zwei Wege"
    ablauf: "Die Einstiegsfrage steht an der Tafel, alle antworten gleichzeitig. Danach ohne Auflösung vier Zeilen: 8 − (3 + 4), 8 − 3 + 4, 12 − (5 − 3), 12 − 5 − 3. Jede wird ausgerechnet, die Ergebnisse werden verglichen."
    lehrkraft: "Die vier Zahlenwerte (1, 9, 10, 4) stehen danach an der Tafel und werden nicht kommentiert. Die Frage lautet nur: Welche zwei Zeilen sehen fast gleich aus und haben verschiedene Ergebnisse?"
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 8
    dauer: 12
    titel: "Die richtige Ersatzzeile finden"
    ablauf: "Partnerarbeit: Zu 8 − (3 + 4) und zu 12 − (5 − 3) soll je eine klammerfreie Zeile gefunden werden, die denselben Wert hat. Erlaubt ist Ausprobieren."
    lehrkraft: "Nicht die Regel nennen. Die Paare finden 8 − 3 − 4 und 12 − 5 + 3 durch Vergleich der Zahlenwerte. Genau dieser Weg – Ergebnis prüfen statt Regel anwenden – ist das, was später bei Variablen fehlt und ersetzt werden muss."
  - schritt: "A"
    minute: 20
    dauer: 15
    titel: "Von den Zahlen zu den Buchstaben"
    ablauf: "Die gefundenen Zeilen kommen an die Tafel. Daraus formuliert die Klasse, was mit den Vorzeichen in der Klammer passiert. Erst dann dieselbe Frage mit Variablen: 5 − (x + 2) und 5 − (x − 2)."
    lehrkraft: "Bei den Variablen ist Ausprobieren nicht mehr möglich – aber Einsetzen schon. Für x = 3 prüfen: 5 − (3 + 2) = 0 und 5 − 3 − 2 = 0. Diese Probe ist die Brücke und sollte ausdrücklich als Verfahren benannt werden."
  - schritt: "R"
    minute: 35
    dauer: 6
    titel: "Üben mit Probe"
    ablauf: "Sechs Terme werden vereinfacht, zu jedem wird mit einer selbst gewählten Zahl die Probe gemacht."
    lehrkraft: "Die Probe ist Pflicht und dauert zehn Sekunden. Wer sie macht, findet den eigenen Vorzeichenfehler, bevor die Lehrkraft ihn findet."
    werkzeug: { text: "Übungsgenerator Termumformungen", href: "/uebung/termumformungen" }
  - schritt: "R"
    minute: 41
    dauer: 4
    titel: "Exit-Ticket"
    ablauf: "Zwei Fragen: eine Umformung und eine Fehlersuche."
    lehrkraft: "Wer die Fehlersuche löst, hat verstanden, dass das Minus die ganze Klammer trifft – und nicht nur den ersten Summanden."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % rechnen 12 − (5 − 3) richtig."
    dann: "Direkt zu den Variablen übergehen und die Zeit in die Verbindung mit dem Distributivgesetz stecken: Warum ist −(x + 2) dasselbe wie (−1) · (x + 2)? Diese Sichtweise trägt später bei −3(x − 4)."
  - wenn: "Ein großer Teil antwortet 4."
    dann: "Wie geplant. In der Erarbeitungsphase zusätzlich verlangen, dass die Klammer einmal zuerst ausgerechnet wird: 12 − 2 = 10. Zwei Wege zum selben Ergebnis sind das stärkste Argument."
  - wenn: "Die Klasse findet die Ersatzzeilen nicht."
    dann: "Die möglichen Zeilen vorgeben (12 − 5 + 3, 12 − 5 − 3, 12 + 5 − 3) und nur noch prüfen lassen, welche stimmt. Die Einsicht bleibt dieselbe, die Suche entfällt."
  - wenn: "Bei den Variablen kommt keine Begründung, sondern die Regel „minus mal minus ist plus“."
    dann: "Die Regel gehört zur Multiplikation. Hier zurück zur Probe: Für x = 3 einsetzen und beide Terme ausrechnen. Was gleich ist, ist gleich – unabhängig davon, welche Regel man dafür im Kopf hatte."
exitTicket:
  - "Vereinfache: 3 − (2x − 5)."
  - "Jemand rechnet: 10 − (a + 4) = 10 − a + 4. Was ist hier schiefgegangen?"
differenzierung:
  schneller: "Finde einen Term der Form a − (b − c), bei dem das falsche Weglassen der Klammer zufällig dasselbe Ergebnis liefert. (Nur wenn c = 0 – und genau das ist die Erklärung, warum der Fehler manchmal unentdeckt bleibt.)"
  langsamer: "Nur Klammern mit zwei positiven Summanden: a − (b + c). Der Fall mit dem Minus in der Klammer folgt in der nächsten Stunde."
stolpersteine:
  - fehlvorstellung: "Das Minus vor der Klammer wirkt nur auf den ersten Summanden."
    reaktion: "An Zahlen prüfen lassen: 8 − (3 + 4) ist 1, nicht 9. Der Fehler ist an Zahlen sichtbar, an Variablen nicht – deshalb kommt die Zahl zuerst."
  - fehlvorstellung: "Die Regel wird als „minus mal minus ist plus“ gespeichert."
    reaktion: "Nachfragen, wo das gelernt wurde. Die Regel gilt für die Multiplikation; hier hilft die Probe durch Einsetzen und nicht der Merksatz."
  - fehlvorstellung: "Bei mehreren Klammern wird die Reihenfolge übersehen."
    reaktion: "Immer eine Klammer nach der anderen auflösen und den Zwischenschritt aufschreiben. Zwei Klammern gleichzeitig im Kopf zu behandeln, geht regelmäßig schief."
hausaufgabe: "Aus dem Übungsgenerator ein Blatt mit zwölf Termen, jeweils mit Probe. Zusätzlich: Schreibe zwei Terme auf, die sich nur durch das Vorzeichen in der Klammer unterscheiden, und rechne beide aus."
tags: ["termumformungen", "klammern", "vorzeichen", "klar", "einzelstunde"]
datum: 2026-08-28
entwurf: false
---

## Tafelbild

| mit Klammer | falsch aufgelöst | richtig aufgelöst |
|:--|:--|:--|
| 8 − (3 + 4) = **1** | 8 − 3 + 4 = 9 | 8 − 3 − 4 = **1** |
| 12 − (5 − 3) = **10** | 12 − 5 − 3 = 4 | 12 − 5 + 3 = **10** |
| 5 − (x + 2) | 5 − x + 2 | 5 − x − 2 = 3 − x |
| 5 − (x − 2) | 5 − x − 2 | 5 − x + 2 = 7 − x |

Darunter, von der Klasse formuliert:

> **Das Minus vor der Klammer trifft alles, was in der Klammer steht – nicht nur das Erste.**

## Warum die Zahlen vor den Variablen kommen

Bei Zahlen lässt sich jede Behauptung in fünf Sekunden prüfen: Man rechnet die Klammer aus und vergleicht. Bei Variablen geht das nicht mehr, und deshalb wird dort eine Regel gebraucht. Wer die Regel bekommt, bevor er das Problem gesehen hat, hat keinen Grund, sie zu behalten – und wendet sie beim ersten ungewohnten Fall halb an.

Die Reihenfolge Zahl → Buchstabe kostet in dieser Stunde etwa zehn Minuten. Sie ist der Unterschied zwischen einer Regel, die man prüfen kann, und einer, die man glauben muss.

## Didaktischer Kommentar

**Warum ausgerechnet dieser Fehler so teuer ist.** Er tritt nicht nur beim Auflösen von Klammern auf. Er kehrt wieder beim Subtrahieren von Termen, beim Gleichsetzungsverfahren, bei der Polynomdivision und bei jeder Anwendung, in der ein zusammengesetzter Ausdruck abgezogen wird. Eine Stunde, die ihn aufräumt, zahlt über Jahre – vorausgesetzt, sie räumt die Ursache auf und nicht nur den Anlass.

**Warum die Probe zum Verfahren gehört.** Bei Termumformungen gibt es kein Ergebnis, das man am Ende „sieht“. Die Probe durch Einsetzen ist der einzige Selbstkontrollmechanismus, den Lernende in dieser Klassenstufe haben – und sie ist zuverlässig: Wer für ein zufällig gewähltes x zwei verschiedene Werte bekommt, hat einen Fehler, ohne dass jemand ihn darauf hinweisen muss. Die zehn Sekunden pro Aufgabe sind die beste Investition der Einheit.

**Warum das Distributivgesetz nur in der Differenzierung steht.** −(x + 2) = (−1) · (x + 2) ist die elegantere Erklärung und verbindet die Klammerregel mit etwas Bekanntem. Sie setzt aber voraus, dass die Multiplikation mit negativen Zahlen sicher ist – und das ist in Klasse 7 nicht bei allen der Fall. Für die schnelle Gruppe ist sie der richtige nächste Schritt, für die ganze Klasse eine zusätzliche Baustelle.

## Zum Weiterarbeiten

- [Diagnostische Fragen: Vorzeichenfehler bei Klammern](/quizzes/vorzeichenfehler-bei-klammern)
- [Aufgabenfolge: Distributivgesetz](/aufgaben/distributivgesetz-variation)
- [Stundenverlauf: Die drei Bedeutungen des Minuszeichens](/stunden/negative-zahlen-die-drei-bedeutungen-des-minus) – die Vorstufe
- [Übungsgenerator Termumformungen](/uebung/termumformungen)
