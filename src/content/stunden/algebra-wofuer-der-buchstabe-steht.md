---
titel: "Variablen: Wofür der Buchstabe steht"
thema: "Algebra"
klassenstufe: ["7"]
dauer: 45
stundenziel: "Die Lernenden deuten eine Variable als Platzhalter für eine Zahl und stellen aus einem Muster einen Term auf, der für jede Anzahl gilt."
kurz: "„a ist ein Apfel“ ist die verbreitetste und teuerste Deutung der Algebra. Eine Einzelstunde, in der die Variable an einem Streichholzmuster zu dem wird, was sie ist: eine Zahl, die man noch nicht kennt."
voraussetzungen:
  - "Rechnen mit natürlichen Zahlen"
  - "Muster fortsetzen und beschreiben"
  - "Wertetabellen lesen"
material:
  - "Streichhölzer oder Zahnstocher, etwa 30 pro Paar"
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Beamer für die Papier-Werkstatt (Wertetabellen)"
einstiegsfrage:
  frage: "Was bedeutet 3a?"
  antworten:
    - text: "Dreimal die Zahl, für die a steht."
      korrekt: true
      deutung: "Trägt. Nachfragen, welche Zahl das sein könnte – wer „irgendeine“ antwortet, hat die Variable als Platzhalter verstanden."
    - text: "Drei Äpfel."
      korrekt: false
      deutung: "Die Variable wird als Abkürzung für einen Gegenstand gelesen. Diese Deutung wird im Unterricht oft selbst gestiftet („a wie Apfel“) und ist der Grund, warum 3a + 2b später nicht zusammengefasst werden kann – und warum a · b keinen Sinn zu ergeben scheint."
    - text: "Die Zahl 3 und dann der Buchstabe a."
      korrekt: false
      deutung: "Das Nebeneinanderschreiben wird nicht als Multiplikation gelesen. Ein Notationsproblem, kein Verständnisproblem – aber es blockiert alles Weitere."
    - text: "3 + a"
      korrekt: false
      deutung: "Das unsichtbare Rechenzeichen wird als Plus gelesen. Häufig bei Lernenden, die gemischte Zahlen kennen (2½ = 2 + ½) und die Schreibweise übertragen."
phasen:
  - schritt: "K"
    minute: 0
    dauer: 8
    titel: "Drei a"
    ablauf: "Die Einstiegsfrage steht an der Tafel, alle antworten gleichzeitig. Danach ohne Auflösung: „Wenn a = 4 ist – wie viel ist dann 3a?“"
    lehrkraft: "Die zweite Frage beantworten fast alle richtig mit 12. Damit ist die Apfel-Deutung schon widerlegt, ohne dass jemand sie kritisiert hätte – ein Apfel lässt sich nicht auf 4 setzen."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 8
    dauer: 14
    titel: "Quadrate aus Streichhölzern"
    ablauf: "Partnerarbeit: Eine Reihe aneinandergrenzender Quadrate wird gelegt. Wie viele Streichhölzer braucht man für 1, 2, 3, 4, 10 Quadrate? Die Frage nach 10 soll nicht durch Legen beantwortet werden."
    lehrkraft: "Die Zahl 10 ist der Hebel: Legen dauert zu lange, also muss gerechnet werden. Beim Herumgehen die verschiedenen Rechenwege notieren – „vier plus dreimal so viele wie noch fehlen“ und „jedes Quadrat drei, plus eins am Anfang“ führen auf denselben Term und sehen verschieden aus."
  - schritt: "A"
    minute: 22
    dauer: 14
    titel: "Vom Rechenweg zum Term"
    ablauf: "Zwei bis drei Rechenwege kommen an die Tafel und werden in Terme übersetzt: 4 + 3 · (n − 1) und 3n + 1. Die Klasse prüft an der Wertetabelle, ob beide dasselbe liefern."
    lehrkraft: "Dass zwei verschieden aussehende Terme dieselben Werte liefern, ist die zweite Einsicht der Stunde. Sie ist der Einstieg in das Umformen: Terme sind gleich, wenn sie für jede Zahl dasselbe ergeben – nicht, wenn sie gleich aussehen."
    werkzeug: { text: "Papier-Werkstatt: Wertetabelle", href: "/werkzeuge/karopapier.html" }
  - schritt: "R"
    minute: 36
    dauer: 5
    titel: "Terme zu Situationen"
    ablauf: "Vier kurze Situationen, zu jeder wird ein Term aufgestellt: Umfang eines Quadrats mit Seite a; Alter in fünf Jahren, wenn man heute x ist; Preis für n Hefte zu 2 €; Anzahl der Beine bei k Stühlen."
    lehrkraft: "Bei jedem Term die Frage stellen: Wofür steht der Buchstabe hier – und in welcher Einheit? „a ist die Seitenlänge in cm“ ist eine vollständige Angabe, „a ist die Seite“ nicht."
  - schritt: "R"
    minute: 41
    dauer: 4
    titel: "Exit-Ticket"
    ablauf: "Zwei Fragen: eine Termaufstellung und eine Deutungsfrage."
    lehrkraft: "Frage 2 zeigt, ob die Variable als Zahl verstanden wurde oder als Etikett."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % deuten 3a richtig."
    dann: "Direkt zum Zusammenfassen übergehen: Warum ist 2a + 3a = 5a, aber 2a + 3b nicht 5ab? Und was ist a · a? Die Streichhölzer bleiben als Kontrollinstanz liegen."
  - wenn: "Ein großer Teil antwortet „drei Äpfel“."
    dann: "Wie geplant, aber in der Abgleichphase ausdrücklich benennen, woher die Deutung stammt: Sie wird oft im Unterricht selbst nahegelegt. Die Klasse soll wissen, dass sie nicht dumm ist, sondern eine Eselsbrücke, die zu weit trägt."
  - wenn: "Viele lesen 3a als 3 + a."
    dann: "Fünf Minuten für die Schreibweise einschieben: 3 · a = 3a, aber 3 + a bleibt 3 + a. An Zahlen prüfen: Für a = 4 ist 3a = 12 und 3 + a = 7."
  - wenn: "Beim Streichholzmuster wird für 10 Quadrate weitergelegt statt gerechnet."
    dann: "Nach 100 Quadraten fragen. Spätestens dort ist Legen keine Option – und die Notwendigkeit einer allgemeinen Formel entsteht aus der Aufgabe, nicht aus der Ansage."
exitTicket:
  - "Ein Heft kostet 2 €, ein Stift 1 €. Stelle einen Term für den Preis von n Heften und 3 Stiften auf."
  - "Jemand sagt: „In 3a steht a für Apfel.“ Was stimmt daran nicht?"
differenzierung:
  schneller: "Lege ein Muster aus Dreiecken (aneinandergrenzend, wie die Quadrate). Wie viele Streichhölzer braucht man für n Dreiecke? Finde zwei verschieden aussehende Terme und zeige, dass sie dasselbe liefern."
  langsamer: "Nur bis 5 Quadrate, dafür jede Anzahl gelegt und in eine Tabelle eingetragen. Der allgemeine Term wird gemeinsam an der Tafel gefunden."
stolpersteine:
  - fehlvorstellung: "Die Variable steht für einen Gegenstand („a wie Apfel“)."
    reaktion: "Nach dem Wert fragen: Wenn a = 4 ist, wie viel ist 3a? Ein Apfel lässt sich nicht auf 4 setzen, eine Anzahl schon."
  - fehlvorstellung: "Das Nebeneinanderschreiben bedeutet Addition (3a = 3 + a)."
    reaktion: "Für a = 4 beide Terme ausrechnen: 12 gegen 7. Danach die Schreibweise als Abkürzung für die Multiplikation benennen."
  - fehlvorstellung: "Verschieden aussehende Terme sind verschiedene Terme."
    reaktion: "Die Wertetabelle für 3n + 1 und 4 + 3(n − 1) nebeneinanderlegen. Gleiche Werte für jedes n heißt: derselbe Term, anders geschrieben."
hausaufgabe: "Aus dem Übungsgenerator ein Blatt zum Aufstellen von Termen. Zusätzlich: Beschreibe ein Muster aus deinem Alltag (Fliesen, Zaunlatten, Treppenstufen) durch einen Term und prüfe ihn an drei Zahlen."
tags: ["algebra", "variable", "terme", "muster", "klar", "einzelstunde"]
datum: 2026-08-28
entwurf: false
---

## Das Streichholzmuster

| Quadrate n | 1 | 2 | 3 | 4 | 5 | … | 10 |
|:--|--:|--:|--:|--:|--:|:--:|--:|
| Streichhölzer | 4 | 7 | 10 | 13 | 16 | … | **31** |

Zwei Rechenwege, die in jeder Klasse auftauchen:

- **„Vier für das erste, dann jedes weitere drei“**: 4 + 3 · (n − 1)
- **„Jedes Quadrat drei, und ganz vorn noch eins“**: 3n + 1

Beide liefern für jedes n dasselbe. Das ist keine Selbstverständlichkeit, sondern die erste Erfahrung mit Termumformung – und sie entsteht hier aus einem Bild, nicht aus einer Regel.

## Die vier Situationen der Übungsphase

| Situation | Term | wofür der Buchstabe steht |
|:--|:--|:--|
| Umfang eines Quadrats mit Seitenlänge a | 4a | a: Seitenlänge in cm |
| Alter in fünf Jahren, heute x Jahre | x + 5 | x: heutiges Alter in Jahren |
| Preis für n Hefte zu je 2 € | 2n | n: Anzahl der Hefte |
| Beine bei k Stühlen | 4k | k: Anzahl der Stühle |

Die dritte Spalte ist der Teil, der meistens fehlt und der die Stunde trägt: Ein Term ohne Angabe, wofür der Buchstabe steht, ist unvollständig.

## Didaktischer Kommentar

**Warum die Apfel-Deutung so verbreitet ist.** Sie wird häufig im Unterricht selbst eingeführt, als Merkhilfe beim Zusammenfassen: „3 Äpfel plus 2 Äpfel sind 5 Äpfel, also 3a + 2a = 5a.“ Für diesen einen Zweck funktioniert sie. Sie scheitert spätestens bei a · b (was ist ein Apfel mal eine Birne?), bei 3a mit a = 4 und bei jeder Gleichung. Der Aufwand, sie später zu ersetzen, ist größer als der Gewinn, den sie kurzfristig bringt.

**Warum die Zahl 10 im Muster steht.** Bis fünf Quadrate lässt sich alles legen und abzählen; dann braucht man keine Formel. Erst die Frage nach zehn – und in der Weiche nach hundert – macht die allgemeine Beschreibung nützlich. Die Variable erscheint dann nicht als Vokabel, sondern als Lösung eines Problems, das die Klasse gerade hat.

**Warum zwei Terme statt einem.** Wenn alle denselben Term finden, bleibt unbemerkt, dass ein Term eine Beschreibung ist und nicht die einzig mögliche. Zwei verschiedene Schreibweisen für dieselbe Sache eröffnen die Frage, wann zwei Terme gleich sind – und die Antwort („wenn sie für jede Zahl dasselbe liefern“) ist die Grundlage jeder späteren Umformung.

**Warum die Einheit zum Term gehört.** „a ist die Seitenlänge“ genügt nicht; erst „in cm“ macht den Term überprüfbar. Diese Genauigkeit kostet in Klasse 7 fast nichts und erspart in Sachaufgaben der Klassen 9 und 10 viel.

## Zum Weiterarbeiten

- [Aufgabenfolge: Terme umformen – sehen, was sich ändert](/aufgaben/distributivgesetz-variation)
- [Stundenverlauf: Das Minus vor der Klammer](/stunden/termumformungen-das-minus-vor-der-klammer) – der nächste Schritt
- [Übungsgenerator Algebra](/uebung/algebra)
- [Fehlvorstellungen zur Algebra](/fehlvorstellungen#thema-algebra)
