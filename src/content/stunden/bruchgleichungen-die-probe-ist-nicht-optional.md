---
titel: "Bruchgleichungen: Wenn richtig rechnen zur falschen Lösung führt"
thema: "Bruchgleichungen"
klassenstufe: ["9", "10"]
dauer: 90
stundenziel: "Die Lernenden bestimmen vor dem Lösen einer Bruchgleichung den Definitionsbereich, erkennen Scheinlösungen und begründen, warum das Multiplizieren mit dem Hauptnenner keine Äquivalenzumformung sein muss."
kurz: "Zum ersten Mal im Lehrgang kann eine formal richtige Rechnung eine falsche Lösung liefern. Diese Doppelstunde macht daraus keinen Formfehler, sondern den eigentlichen Gegenstand."
voraussetzungen:
  - "Bruchterme kürzen und auf den Hauptnenner bringen"
  - "Lineare Gleichungen mit Äquivalenzumformungen lösen"
  - "Nenner null als nicht definiert erkennen"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Beamer für den Funktionenplotter"
einstiegsfrage:
  frage: "Beim Lösen von x/(x−2) = 2/(x−2) kommt x = 2 heraus. Was bedeutet das?"
  antworten:
    - text: "Die Gleichung hat keine Lösung."
      korrekt: true
      deutung: "Trägt. Nachfragen, warum – „für x = 2 ist die Gleichung gar nicht definiert“ ist die vollständige Antwort und der Kern der Stunde."
    - text: "Die Lösung ist x = 2."
      korrekt: false
      deutung: "Das rechnerische Ergebnis wird ungeprüft übernommen. Die häufigste Antwort, und sie ist konsequent: Bis hierhin galt, wer richtig umformt, bekommt die richtige Lösung."
    - text: "Ich habe mich verrechnet."
      korrekt: false
      deutung: "Wie bei den Gleichungssystemen: Ein ungewohntes Ergebnis wird als Rechenfehler gedeutet. Hier stimmt die Rechnung – nur die Folgerung nicht."
    - text: "Die Gleichung hat unendlich viele Lösungen, weil beide Seiten denselben Nenner haben."
      korrekt: false
      deutung: "Der gemeinsame Nenner wird für Gleichheit gehalten. Die Zähler sind aber verschieden; die Gleichung gilt nur für x = 2, und genau dieser Wert ist verboten."
  quiz: "bruchgleichungen-definitionsbereich"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 10
    titel: "Ein Ergebnis, das keines ist"
    ablauf: "Die Einstiegsfrage steht mit vollständiger Rechnung an der Tafel, alle antworten gleichzeitig. Danach ohne Auflösung: „Setzt x = 2 in die ursprüngliche Gleichung ein.“"
    lehrkraft: "Die Probe erledigt die Diagnose: Beide Seiten werden zu 2 : 0. Nicht kommentieren – die Frage „darf man das?“ kommt aus der Klasse."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 10
    dauer: 25
    titel: "Sechs Gleichungen, vier Überraschungen"
    ablauf: "Partnerarbeit an sechs Bruchgleichungen. Vorschrift: erst den Definitionsbereich notieren, dann rechnen, dann die Probe. Vier der sechs verhalten sich anders als erwartet."
    lehrkraft: "Vorher ansagen, dass nicht alle sechs eine Lösung haben. Ohne diese Ansage wird bei den Sonderfällen gestrichen und neu gerechnet, bis die Zeit um ist. Beim Herumgehen notieren, wer den Definitionsbereich wirklich zuerst aufschreibt."
  - schritt: "A"
    minute: 35
    dauer: 25
    titel: "Warum die Rechnung mehr liefert als die Gleichung"
    ablauf: "Die sechs Ergebnisse kommen an die Tafel, sortiert nach Fällen: gültige Lösung, Scheinlösung, keine Lösung, Lösung für fast alle x. Danach die Kernfrage: An welcher Stelle der Rechnung geht die Gleichung verloren?"
    lehrkraft: "Die Antwort ist der Multiplikationsschritt: Mit (x − 2) zu multiplizieren ist nur dann eine Äquivalenzumformung, wenn dieser Term nicht null ist. Genau bei x = 2 ist er es – und dort ist die Umformung keine. Das ist der einzige neue Gedanke der Stunde, und er trägt sie."
  - schritt: "A"
    minute: 60
    dauer: 12
    titel: "Am Graphen sichtbar"
    ablauf: "Am Funktionenplotter werden linke und rechte Seite als getrennte Funktionen gezeichnet. Die Definitionslücke ist als senkrechte Asymptote sichtbar; Schnittpunkte gibt es dort keine."
    lehrkraft: "Der Graph ist keine Beweisführung, aber ein starkes Bild: An der Stelle x = 2 existiert keine der beiden Kurven. Was nicht existiert, kann sich nicht schneiden."
    werkzeug: { text: "Funktionenplotter", href: "/werkzeuge/funktionenplotter.html" }
  - schritt: "R"
    minute: 72
    dauer: 13
    titel: "Definitionsbereich zuerst"
    ablauf: "Aus der Aufgabenfolge die Aufgaben zum Definitionsbereich – zunächst ohne Lösen, nur Bestimmen. Danach zwei vollständig gerechnete Gleichungen mit Probe."
    lehrkraft: "Die Trennung ist Absicht. Solange der Definitionsbereich ein Zusatz am Ende ist, wird er vergessen. Als erste Handlung wird er zur Gewohnheit."
    werkzeug: { text: "Aufgabenfolge: Definitionsbereich und Probe", href: "/aufgaben/bruchgleichungen-definitionsbereich-und-probe" }
  - schritt: "R"
    minute: 85
    dauer: 5
    titel: "Exit-Ticket"
    ablauf: "Drei Fragen: ein Definitionsbereich, eine vollständige Lösung mit Probe, eine Begründung."
    lehrkraft: "Frage 3 unterscheidet zwischen „Probe machen“ als Vorschrift und als verstandener Notwendigkeit."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % erkennen x = 2 als Scheinlösung."
    dann: "Die Erarbeitung kürzen und zu Gleichungen mit zwei Definitionslücken übergehen: 1/x + 1/(x−1) = 3. Dort sind zwei Werte verboten, und die Lösungen sind nicht ganzzahlig – ein guter Anlass, exakt zu rechnen statt zu runden."
  - wenn: "Viele antworten „die Lösung ist x = 2“."
    dann: "Wie geplant. Die Probe zu Beginn ausdrücklich gemeinsam durchführen und den Ausdruck 2 : 0 an die Tafel schreiben. Er ist nicht unendlich, nicht null, sondern nicht definiert."
  - wenn: "Der Definitionsbereich wird trotz Vorschrift zuletzt bestimmt."
    dann: "Die Aufgaben ohne Lösungsteil austeilen: nur Gleichungen, nur Definitionsbereiche. Wer nichts rechnen kann, bestimmt ihn zuerst – danach ist die Reihenfolge etabliert."
  - wenn: "Die Klasse kann Bruchterme nicht sicher zusammenfassen."
    dann: "Die Stunde umwidmen und zunächst die Vorstufe sichern: Bruchterme kürzen und auf den Hauptnenner bringen, ohne Gleichheitszeichen. Bruchgleichungen ohne diese Grundlage sind reine Formelakrobatik."
exitTicket:
  - "Bestimme den Definitionsbereich von 1/(x−3) + 2/(x+1) = 5."
  - "Löse mit Probe: 6/(x−1) = 3."
  - "Warum ist das Multiplizieren mit dem Hauptnenner nicht immer eine Äquivalenzumformung?"
differenzierung:
  schneller: "Löse 1/x + 1/(x−1) = 3 exakt. (x = (5 ± √13)/6 – beide Werte liegen im Definitionsbereich.) Prüfe am Plotter, ob beide Schnittpunkte sichtbar sind."
  langsamer: "Nur Gleichungen mit einem Bruch und einer Definitionslücke, dafür jede mit vollständig aufgeschriebenem Definitionsbereich und Probe. Die Fälle mit zwei Lücken folgen in der nächsten Stunde."
stolpersteine:
  - fehlvorstellung: "Der Definitionsbereich ist eine Formsache, die man am Ende ergänzt."
    reaktion: "Eine Gleichung rechnen lassen, deren einzige rechnerische Lösung verboten ist. Wer den Definitionsbereich zuletzt bestimmt, hat die Aufgabe zweimal gerechnet."
  - fehlvorstellung: "Wer richtig umformt, bekommt die richtige Lösung."
    reaktion: "Diesen Satz ausdrücklich an die Tafel schreiben und benennen, dass er bis heute galt. Bruchgleichungen sind die erste Stelle, an der er nicht mehr gilt – das ist bedeutsam und sollte nicht nebenbei passieren."
  - fehlvorstellung: "„Über Kreuz multiplizieren“ funktioniert immer."
    reaktion: "1/x + 1/(2x) = 3 vorlegen. Auf der linken Seite stehen zwei Brüche; die Regel gilt für die Form a/b = c/d. Erst zusammenfassen, dann anwenden."
hausaufgabe: "Aus der Aufgabenfolge die Folge zu den Scheinlösungen. Zusätzlich: Schreibe eine Bruchgleichung auf, deren rechnerische Lösung verboten ist – und begründe in einem Satz, warum."
tags: ["bruchgleichungen", "definitionsbereich", "scheinloesung", "aequivalenzumformung", "klar", "doppelstunde"]
datum: 2026-08-28
entwurf: false
---

## Die sechs Gleichungen der Erarbeitungsphase

| Nr. | Gleichung | Definitionsbereich | Rechnung liefert | tatsächlich |
|--:|:--|:--|:--|:--|
| 1 | 6/x = 3 | x ≠ 0 | x = 2 | x = 2 ✓ |
| 2 | 6/(x−1) = 3 | x ≠ 1 | x = 3 | x = 3 ✓ |
| 3 | x/(x−2) = 2/(x−2) | x ≠ 2 | x = 2 | keine Lösung |
| 4 | 1/(x−3) = 0 | x ≠ 3 | – | keine Lösung: ein Bruch mit Zähler 1 wird nie null |
| 5 | (x²−9)/(x−3) = 6 | x ≠ 3 | x = 3 | keine Lösung |
| 6 | 1/(x+2) = 1/(x+2) | x ≠ −2 | jedes x | alle x außer x = −2 |

Zwei Aufgaben gehen glatt auf, vier nicht. Die Mischung ist Absicht: Wer erwartet, dass in dieser Folge immer „keine Lösung“ herauskommt, prüft nicht mehr – und liegt bei Nr. 1 und 2 daneben.

## Der entscheidende Schritt

Bei Nr. 3 wird beide Seiten mit (x − 2) multipliziert:

> x/(x−2) = 2/(x−2)  | · (x − 2)
> x = 2

Diese Umformung ist **nur dann** eine Äquivalenzumformung, wenn x − 2 ≠ 0 ist. Für x = 2 wird mit null multipliziert, und die Multiplikation mit null macht aus jeder Aussage eine wahre. Deshalb liefert die Rechnung einen Wert, den die Ausgangsgleichung nicht hat.

> **Der Definitionsbereich gehört zur Aufgabe, nicht zum Lösungsweg.**

## Warum das eine besondere Stunde ist

Bis zu diesem Punkt im Lehrgang gilt eine Zusage, die nie ausgesprochen wurde und trotzdem trägt: Wer die Regeln befolgt, bekommt das richtige Ergebnis. Bruchgleichungen brechen diese Zusage – zum ersten Mal kann eine fehlerfreie Rechnung eine falsche Lösung liefern.

Das ist für Lernende irritierend, und die Irritation verdient Raum. Sie hinter der Vorschrift „Probe machen“ zu verstecken, verschenkt den eigentlichen Inhalt: Eine Umformung ist nicht deshalb erlaubt, weil sie in einer Liste steht, sondern weil sie unter bestimmten Bedingungen die Lösungsmenge erhält. Wer das hier versteht, hat den Begriff der Äquivalenzumformung – und braucht ihn in der Oberstufe wieder.

## Didaktischer Kommentar

**Warum vier von sechs Aufgaben Sonderfälle sind.** In einer normalen Übungsreihe wäre das Verhältnis absurd. Hier ist es der Gegenstand: Die Klasse soll erfahren, dass der Sonderfall kein Ausrutscher ist. Zwei glatte Aufgaben stehen trotzdem drin, damit die Erwartung „hier kommt immer nichts heraus“ nicht das nächste Muster wird.

**Warum die Probe vor der Regel kommt.** Die Aufforderung, x = 2 einzusetzen, führt in fünf Sekunden auf 2 : 0. Diesen Ausdruck kennt die Klasse; er ist nicht definiert. Damit ist die Sache entschieden, bevor irgendein Begriff eingeführt wurde – und der Begriff (Scheinlösung) benennt danach etwas, das alle gesehen haben.

**Warum der Graph dazugehört, obwohl er nichts beweist.** Die Definitionslücke als senkrechte Asymptote ist ein Bild, das bleibt. Es beantwortet die Frage „wo ist die Lösung hin?“ anschaulich: An der Stelle x = 2 gibt es die Kurven nicht, also können sie sich dort nicht schneiden. In der Oberstufe wird daraus die Untersuchung von Definitionslücken – hier ist es eine Beobachtung.

**Warum die Reihenfolge Definitionsbereich–Rechnung–Probe eingefordert wird.** Alle drei Schritte sind für sich genommen leicht. Was schiefgeht, ist die Reihenfolge: Wer zuerst rechnet, hat am Ende ein Ergebnis und keinen Grund mehr, es infrage zu stellen. Wer den Definitionsbereich zuerst aufschreibt, hat die Verbotsliste vor Augen, wenn das Ergebnis kommt.

## Zum Weiterarbeiten

- [Aufgabenfolge: Definitionsbereich zuerst, Probe zuletzt](/aufgaben/bruchgleichungen-definitionsbereich-und-probe)
- [Aufgabenfolge: Bruchterme kürzen und addieren](/aufgaben/bruchterme-kuerzen-und-addieren) – die Vorstufe ohne Gleichheitszeichen
- [Diagnostische Fragen: Definitionsbereich](/quizzes/bruchgleichungen-definitionsbereich)
- [Stundenverlauf: Wenn nichts oder alles herauskommt](/stunden/lineare-gleichungssysteme-drei-faelle) – dieselbe Art von Ergebnis, anderer Grund
