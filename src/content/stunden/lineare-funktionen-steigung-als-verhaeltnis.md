---
titel: "Lineare Funktionen: Steigung ist ein Verhältnis, keine Zahl am Graphen"
thema: "Lineare Funktionen"
klassenstufe: ["8"]
dauer: 90
stundenziel: "Die Lernenden bestimmen die Steigung einer Geraden als Verhältnis von Höhenänderung zu Rechtsänderung, unabhängig vom gewählten Steigungsdreieck, und lesen sie aus Graph, Tabelle und Gleichung ab."
kurz: "„Zwei nach rechts, drei nach oben“ ist noch keine Steigung – erst der Quotient ist es. Diese Doppelstunde trennt das Steigungsdreieck von der Zahl, die es liefert."
voraussetzungen:
  - "Punkte im Koordinatensystem eintragen und ablesen"
  - "Wertetabellen zu einfachen Zuordnungen anlegen"
  - "Brüche als Quotienten deuten und in Dezimalzahlen umwandeln"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Beamer für den Funktionenplotter"
  - "Karopapier mit vorbereitetem Koordinatensystem (Papier-Werkstatt)"
einstiegsfrage:
  frage: "Eine Gerade geht durch die Punkte (1|2) und (4|8). Welche Steigung hat sie?"
  antworten:
    - text: "2"
      korrekt: true
      deutung: "Trägt. Nachfragen, ob der Weg über das Steigungsdreieck oder über den Quotienten lief – und ob die Person sicher ist, dass ein anderes Dreieck dasselbe liefert."
    - text: "6"
      korrekt: false
      deutung: "Nur die Höhenänderung wird genannt. Die Steigung wird als „wie weit es hochgeht“ verstanden, nicht als Verhältnis. Sehr häufig, wenn im Unterricht überwiegend Dreiecke mit der Breite 1 gezeichnet wurden."
    - text: "0,5"
      korrekt: false
      deutung: "Zähler und Nenner vertauscht: Rechtsänderung durch Höhenänderung. Der Fehler bleibt oft unentdeckt, weil das Ergebnis plausibel aussieht."
    - text: "3"
      korrekt: false
      deutung: "Nur die Rechtsänderung. Spiegelbild zur Antwort 6 – beide zeigen, dass eine der beiden Größen als „die Steigung“ genommen wird."
  quiz: "lineare-funktionen-steigung-erkennen"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 10
    titel: "Zwei Punkte, eine Zahl"
    ablauf: "Die Einstiegsfrage steht an der Tafel, alle antworten gleichzeitig. Danach ohne Auflösung eine zweite Frage: „Wenn ich statt (1|2) und (4|8) die Punkte (1|2) und (2|4) nehme – ändert sich die Steigung?“"
    lehrkraft: "Die zweite Frage ist die eigentliche Diagnose. Wer bei der ersten 6 geantwortet hat und bei der zweiten 2, hat den Widerspruch selbst erzeugt. Nicht auflösen."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 10
    dauer: 25
    titel: "Vier Dreiecke an derselben Geraden"
    ablauf: "Partnerarbeit auf Karopapier: In eine vorgegebene Gerade werden vier verschieden große Steigungsdreiecke eingezeichnet. Zu jedem werden Höhen- und Rechtsänderung notiert – und der Quotient gebildet."
    lehrkraft: "Die Tabelle mit vier Zeilen ist das Ziel, nicht die Zeichnung. Wer nur zeichnet, bekommt die Frage: „Was ist bei allen vier Dreiecken gleich – und was nicht?“ Auf Dreiecke mit der Breite 1 nicht drängen; die Einsicht entsteht gerade an den anderen."
    werkzeug: { text: "Papier-Werkstatt: Koordinatensystem", href: "/werkzeuge/karopapier.html" }
  - schritt: "A"
    minute: 35
    dauer: 25
    titel: "Was gleich bleibt"
    ablauf: "Die Tabellen mehrerer Paare kommen an die Tafel. Höhen- und Rechtsänderungen sind überall verschieden, der Quotient ist überall gleich. Daraus entsteht die Definition – nicht umgekehrt."
    lehrkraft: "Erst eine Tabelle mit sehr unterschiedlichen Dreiecken zeigen, dann eine mit lauter Breite-1-Dreiecken. Die zweite sieht einfacher aus und verdeckt genau das, worauf es ankommt. Diese Reihenfolge nicht tauschen."
  - schritt: "A"
    minute: 60
    dauer: 12
    titel: "Am Schieberegler prüfen"
    ablauf: "Am Funktionenplotter wird m am Schieberegler verändert, während die Klasse vorhersagt, was mit dem Graphen passiert. Danach umgekehrt: Der Graph wird gezeigt, die Klasse nennt m."
    lehrkraft: "Bei negativen Steigungen ausdrücklich innehalten. „Fällt“ ist keine Zahl; gefragt ist der Quotient, und der ist hier negativ, weil die Höhenänderung negativ ist."
    werkzeug: { text: "Funktionenplotter", href: "/werkzeuge/funktionenplotter.html" }
  - schritt: "R"
    minute: 72
    dauer: 13
    titel: "Drei Darstellungen"
    ablauf: "Aus der Aufgabenfolge die Aufgaben, in denen dieselbe Funktion als Graph, als Tabelle und als Gleichung auftritt. Zu jeder wird nur die Steigung bestimmt, nichts weiter."
    lehrkraft: "Die Beschränkung auf die Steigung ist Absicht: Der y-Achsenabschnitt kommt in der Folgestunde. Wer beides gleichzeitig lernt, verwechselt es zuverlässig."
    werkzeug: { text: "Aufgabenfolge Lineare Funktionen", href: "/aufgaben/lineare-funktionen-steigung-und-achsenabschnitt" }
  - schritt: "R"
    minute: 85
    dauer: 5
    titel: "Exit-Ticket"
    ablauf: "Drei Fragen: eine Berechnung aus zwei Punkten, eine aus einer Tabelle, eine Begründungsfrage zum Steigungsdreieck."
    lehrkraft: "Frage 3 trennt sicher: Wer sie beantworten kann, hat die Unabhängigkeit vom Dreieck verstanden."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % antworten „2“ und begründen mit dem Quotienten."
    dann: "Die Dreiecksphase auf zehn Minuten kürzen und die Frage vorziehen, die sonst die Folgestunde eröffnet: Was ändert sich am Graphen, wenn nur b variiert wird – und woran erkennt man b in einer Wertetabelle?"
  - wenn: "Viele antworten „6“ oder „3“."
    dann: "Wie geplant. In der Dreiecksphase zusätzlich verlangen, dass ein Dreieck mit der Breite 2 und eines mit der Breite 3 dabei ist. Ohne diese Vorgabe zeichnen viele nur Breite-1-Dreiecke und bestätigen ihre Vorstellung."
  - wenn: "Viele antworten „0,5“."
    dann: "Kein Verständnisproblem, sondern eine vertauschte Zuordnung. In der Abgleichphase konsequent von „pro Schritt nach rechts“ sprechen und die Einheit mitsprechen: 2 Höheneinheiten pro 1 Rechtseinheit."
  - wenn: "Die Klasse kommt bei negativen Steigungen ins Stocken."
    dann: "Am Plotter eine fallende Gerade zeigen und dasselbe Dreieck zweimal einzeichnen – einmal von links nach rechts, einmal von rechts nach links. Beide Male ergibt der Quotient dieselbe negative Zahl."
exitTicket:
  - "Eine Gerade geht durch (2|1) und (6|7). Wie groß ist die Steigung?"
  - "Zu einer linearen Funktion gehört die Tabelle: x = 0, 3, 6 und y = 5, 11, 17. Wie groß ist die Steigung?"
  - "Warum liefert ein größeres Steigungsdreieck an derselben Geraden dieselbe Steigung?"
differenzierung:
  schneller: "Zwei Geraden gehen beide durch den Punkt (2|3); die eine hat die Steigung 2, die andere −1. Bestimme beide Funktionsgleichungen und den Schnittpunkt mit der x-Achse. (y = 2x − 1 mit Nullstelle 0,5; y = −x + 5 mit Nullstelle 5.)"
  langsamer: "Nur Geraden durch den Ursprung und nur ganzzahlige Steigungen. Das Steigungsdreieck wird vorgezeichnet, bestimmt wird ausschließlich der Quotient."
stolpersteine:
  - fehlvorstellung: "Die Steigung ist die Höhenänderung („die Gerade steigt um 6“)."
    reaktion: "Zwei Dreiecke an derselben Geraden zeichnen, eines mit Breite 1, eines mit Breite 3. Die Höhen sind verschieden, die Gerade ist dieselbe."
  - fehlvorstellung: "Steigung wird als Rechtsänderung durch Höhenänderung gebildet."
    reaktion: "Eine sehr steile Gerade (m = 5) und eine flache (m = 0,2) nebeneinanderlegen. Wer vertauscht, bekommt für die steile Gerade die kleinere Zahl – der Widerspruch ist am Bild sofort da."
  - fehlvorstellung: "Bei fallenden Geraden wird das Vorzeichen weggelassen."
    reaktion: "Konsequent mit gerichteten Änderungen arbeiten: „drei nach rechts, zwei nach unten“ heißt −2 im Zähler. Das Vorzeichen entsteht nicht am Ende, sondern beim Ablesen."
hausaufgabe: "Aus der Aufgabenfolge die Aufgaben zur Steigung (ohne den y-Achsenabschnitt). Zusätzlich: Zeichne eine Gerade mit der Steigung 3/4 und zwei verschiedene Steigungsdreiecke ein."
tags: ["lineare-funktionen", "steigung", "funktionenplotter", "klar", "doppelstunde", "darstellungswechsel"]
datum: 2026-08-28
entwurf: false
---

## Tafelbild

| Dreieck | Rechtsänderung | Höhenänderung | Quotient |
|:--|--:|--:|--:|
| A | 1 | 2 | 2 |
| B | 2 | 4 | 2 |
| C | 3 | 6 | 2 |
| D | 5 | 10 | 2 |

Darunter, von der Klasse formuliert: **Die Steigung ist nicht, wie weit es hochgeht, sondern wie weit es pro Schritt nach rechts hochgeht.**

Die Tabelle bleibt bis zum Stundenende stehen. Sie ist der Beweis, dass die Wahl des Dreiecks nichts ändert – und für viele der erste, den sie selbst erzeugt haben.

## Warum die Breite-1-Dreiecke erst zuletzt kommen

Das Dreieck mit der Breite 1 ist bequem: Der Quotient ist die Höhe, man muss nicht dividieren. Genau deshalb ist es didaktisch gefährlich. Wer nur solche Dreiecke sieht, kann die Steigung jahrelang richtig bestimmen und trotzdem glauben, sie sei die Höhenänderung. Der Fehler fällt erst auf, wenn ein Punktepaar nicht im Abstand 1 liegt – oft in der Klassenarbeit.

In der Abgleichphase kommt deshalb zuerst eine Tabelle mit den Breiten 2, 3 und 5 an die Tafel. Das Breite-1-Dreieck ist dann der bequeme Sonderfall, nicht der Normalfall.

## Didaktischer Kommentar

**Warum die zweite Einstiegsfrage wichtiger ist als die erste.** Die erste Frage misst, ob gerechnet werden kann. Die zweite misst, ob verstanden wurde: Wenn die Steigung eine Eigenschaft der *Geraden* ist, darf sie sich nicht ändern, wenn ich andere Punkte auf ihr wähle. Wer hier zögert, hat die Steigung als Eigenschaft des Punktepaars gespeichert. Das ist der eigentliche Lerngegenstand, und er ist mit einer Rechenübung nicht zu erreichen.

**Warum das Verhältnis und nicht die Formel.** Die Formel m = (y₂ − y₁)/(x₂ − x₁) ist korrekt und für viele Lernende bedeutungslos. Sie lässt sich anwenden, ohne dass eine Vorstellung entsteht – und sie erzeugt zuverlässig den Vertauschungsfehler. Die Sprechweise „pro Schritt nach rechts“ trägt die Bedeutung mit und macht auch das Vorzeichen selbstverständlich: Wenn es nach unten geht, ist die Änderung negativ.

**Warum der y-Achsenabschnitt in dieser Stunde fehlt.** Steigung und Achsenabschnitt sind zwei unabhängige Größen, und wer beide gleichzeitig einführt, bekommt Vermischungen: „m ist da, wo die Gerade die Achse schneidet“ ist ein häufiger und hartnäckiger Fehler. Die Trennung kostet eine Stunde und spart mehrere.

**Warum am Ende drei Darstellungen stehen.** Steigung im Graphen ist ein Dreieck, in der Tabelle eine konstante Differenz pro Schritt, in der Gleichung ein Koeffizient. Dass es dieselbe Zahl ist, ist keine Selbstverständlichkeit, sondern eine Einsicht. Aufgaben, die zwischen den Darstellungen wechseln, sind deshalb wertvoller als zehn weitere Graphen.

## Zum Weiterarbeiten

- [Werkzeug: Funktionenplotter](/werkzeuge/funktionenplotter.html) – Parameter am Schieberegler
- [Aufgabenfolge: Steigung und Achsenabschnitt](/aufgaben/lineare-funktionen-steigung-und-achsenabschnitt)
- [Diagnostische Fragen: Steigung erkennen](/quizzes/lineare-funktionen-steigung-erkennen)
- [Fehlvorstellungen zu linearen Funktionen](/fehlvorstellungen#thema-lineare-funktionen)
