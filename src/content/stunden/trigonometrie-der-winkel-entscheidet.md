---
titel: "Trigonometrie: Der Winkel entscheidet, welche Seite welche ist"
thema: "Trigonometrie"
klassenstufe: ["9", "10"]
dauer: 90
stundenziel: "Die Lernenden benennen Gegenkathete und Ankathete in Abhängigkeit vom betrachteten Winkel und wählen aus gegebenen und gesuchten Größen die passende Winkelfunktion aus."
kurz: "Gegen- und Ankathete hängen nicht an der Seite, sondern am Winkel. Wechselt der Winkel, tauschen sie – und genau daran scheitern die meisten Aufgaben, nicht am Taschenrechner."
voraussetzungen:
  - "Satz des Pythagoras und die Benennung der Hypotenuse"
  - "Verhältnisse als Quotienten deuten"
  - "Sinus, Kosinus und Tangens am Taschenrechner aufrufen"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Taschenrechner (im Gradmaß)"
  - "Vier vorbereitete rechtwinklige Dreiecke, unterschiedlich gedreht, mit zwei markierten Winkeln"
einstiegsfrage:
  frage: "In einem rechtwinkligen Dreieck ist die Seite c die Hypotenuse. Bezogen auf den Winkel α ist a die Gegenkathete. Was ist a bezogen auf den anderen spitzen Winkel β?"
  antworten:
    - text: "Die Ankathete."
      korrekt: true
      deutung: "Trägt. Nachfragen, warum – „weil sie an β anliegt“ ist die Antwort, auf die es ankommt. Die Seite hat sich nicht geändert, nur der Blickwinkel."
    - text: "Weiterhin die Gegenkathete."
      korrekt: false
      deutung: "Die Bezeichnung wird fest an die Seite geknüpft. Die zentrale Fehlvorstellung des Themas: Gegen- und Ankathete werden wie Eigennamen behandelt statt wie Rollen."
    - text: "Die Hypotenuse."
      korrekt: false
      deutung: "Alle drei Bezeichnungen werden als beliebig zuweisbar behandelt. Hier fehlt bereits die Hypotenusenregel – ein Rückgriff auf die Pythagoras-Stunde ist nötig."
    - text: "Das hängt davon ab, welche Seite länger ist."
      korrekt: false
      deutung: "Länge statt Lage als Kriterium. Bei der Hypotenuse funktioniert das zufällig, bei den Katheten nie."
  quiz: "trigonometrie-sin-cos-tan"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 10
    titel: "Dieselbe Seite, zwei Namen"
    ablauf: "Die Einstiegsfrage steht mit Skizze an der Tafel, alle antworten gleichzeitig. Danach werden vier gedrehte Dreiecke gezeigt, in jedem ist ein anderer Winkel markiert. Für jedes wird gefragt: Welche Seite ist die Gegenkathete?"
    lehrkraft: "Die vier Dreiecke sind die Diagnose. Wer die Bezeichnungen an der Lage festmacht („die untere ist die Ankathete“), scheitert an mindestens zweien. Die Verteilung notieren, nicht auflösen."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 10
    dauer: 25
    titel: "Beschriften aus zwei Blickwinkeln"
    ablauf: "Partnerarbeit: Dasselbe Dreieck wird zweimal gezeichnet – einmal mit α markiert, einmal mit β. In beiden werden alle drei Seiten beschriftet. Danach werden für beide Winkel Sinus, Kosinus und Tangens als Quotienten aufgeschrieben."
    lehrkraft: "Der Vergleich der beiden Beschriftungen ist der Kern: Die Hypotenuse bleibt, die beiden Katheten tauschen die Rolle. Daraus folgt unmittelbar sin α = cos β – wer das selbst bemerkt, hat mehr verstanden als eine Merkregel liefert."
  - schritt: "A"
    minute: 35
    dauer: 25
    titel: "Welche Funktion passt?"
    ablauf: "Aus den Quotienten entsteht die Auswahlregel: Welche zwei Seiten sind im Spiel (gegeben und gesucht)? Danach steht die Funktion fest. Vier Beispielaufgaben werden nur bis zum Ansatz bearbeitet – nicht ausgerechnet."
    lehrkraft: "Das Rechnen wird bewusst weggelassen. Es ist Tastendrücken und lenkt in dieser Phase von der Entscheidung ab, um die es geht. Der Ansatz allein an der Tafel ist die Leistung."
  - schritt: "A"
    minute: 60
    dauer: 12
    titel: "Die Merkregel prüfen"
    ablauf: "Die gängige Eselsbrücke (GAGA HHAG) wird an den vier Aufgaben getestet. Sie liefert die Quotienten – aber nur, wenn Gegen- und Ankathete vorher richtig bestimmt wurden."
    lehrkraft: "Die Merkregel nicht verbieten, sondern einordnen: Sie ersetzt das Auswendiglernen der drei Brüche und leistet für die eigentliche Schwierigkeit nichts. Wer weiß, wofür eine Eselsbrücke gut ist, benutzt sie richtig."
  - schritt: "R"
    minute: 72
    dauer: 13
    titel: "Ansatz und Rechnung"
    ablauf: "Aus der Aufgabenfolge sechs Aufgaben, jetzt vollständig gerechnet. Vorschrift: erst den betrachteten Winkel markieren, dann die beiden beteiligten Seiten, dann die Funktion, dann rechnen."
    lehrkraft: "Auf die Reihenfolge achten und den Taschenrechnermodus prüfen (DEG, nicht RAD). Ein Ergebnis von −0,988 statt 0,5 ist kein Rechenfehler, sondern der falsche Modus."
    werkzeug: { text: "Aufgabenfolge: Welche Seite ist welche", href: "/aufgaben/trigonometrie-welche-seite-ist-welche" }
  - schritt: "R"
    minute: 85
    dauer: 5
    titel: "Exit-Ticket"
    ablauf: "Drei Fragen: eine Benennung, eine Berechnung, eine Winkelbestimmung."
    lehrkraft: "Frage 1 misst das Ziel der Stunde; die anderen beiden zeigen, ob der Ansatz in die Rechnung trägt."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % beantworten die Einstiegsfrage und die vier Dreiecke richtig."
    dann: "Die Beschriftungsphase kürzen und die Umkehrfunktionen anschließen: Wie bestimmt man einen Winkel aus zwei Seiten? Die Frage „welche zwei Seiten sind im Spiel?“ bleibt dieselbe."
  - wenn: "Ein großer Teil hält a auch bei β für die Gegenkathete."
    dann: "Wie geplant. In der Erarbeitung darauf bestehen, dass beide Zeichnungen tatsächlich angefertigt werden – der Vergleich zweier Bilder wirkt, eine Ansage nicht."
  - wenn: "Die Hypotenuse wird nicht sicher erkannt."
    dann: "Zehn Minuten zurück zur Pythagoras-Stunde: Die Hypotenuse liegt dem rechten Winkel gegenüber. Ohne diese Sicherheit ist die Unterscheidung der Katheten nicht zugänglich."
  - wenn: "Die Ergebnisse sind um Faktor 100 daneben."
    dann: "Taschenrechnermodus. sin 30° muss 0,5 ergeben; wer −0,988 sieht, rechnet im Bogenmaß. Diese Kontrolle einmal für alle festlegen und bei jeder Aufgabe verlangen."
exitTicket:
  - "Zeichne ein rechtwinkliges Dreieck und markiere einen spitzen Winkel. Beschrifte Hypotenuse, Gegenkathete und Ankathete."
  - "In einem rechtwinkligen Dreieck ist die Hypotenuse 10 cm lang und ein Winkel beträgt 30°. Wie lang ist die Gegenkathete dieses Winkels?"
  - "Ein Dreieck hat die Katheten 3 cm und 4 cm. Wie groß ist der Winkel, der der 3-cm-Seite gegenüberliegt?"
differenzierung:
  schneller: "Zeige, dass sin α = cos(90° − α) für jeden spitzen Winkel gilt – am Dreieck, nicht am Taschenrechner. Danach: Warum ist tan α = sin α : cos α?"
  langsamer: "Nur Aufgaben, in denen die Hypotenuse und ein Winkel gegeben sind und eine Kathete gesucht ist. Dann kommen nur Sinus und Kosinus in Frage, und die Auswahl reduziert sich auf zwei Möglichkeiten."
stolpersteine:
  - fehlvorstellung: "Gegen- und Ankathete sind feste Eigenschaften der Seiten."
    reaktion: "Dasselbe Dreieck zweimal beschriften, einmal für α und einmal für β. Die Seiten sind dieselben, die Namen nicht."
  - fehlvorstellung: "Die Funktion wird nach Gewohnheit gewählt (meistens Sinus)."
    reaktion: "Vor jeder Aufgabe zwei Seiten markieren: die gegebene und die gesuchte. Erst danach steht fest, welche Funktion beide enthält."
  - fehlvorstellung: "Der Taschenrechner rechnet immer im Gradmaß."
    reaktion: "sin 30 als Kontrolle: Es muss 0,5 herauskommen. Diese Probe dauert drei Sekunden und fängt den häufigsten Zahlenfehler des Themas ab."
hausaufgabe: "Aus der Aufgabenfolge die Aufgaben zur Auswahl der Funktion, jede mit markiertem Winkel und markierten Seiten. Zusätzlich: Miss die Höhe eines Gegenstands mithilfe eines geschätzten Blickwinkels und deines Abstands – und schreibe auf, welche Größen du dafür gebraucht hast."
tags: ["trigonometrie", "sinus", "kosinus", "tangens", "gegenkathete", "klar", "doppelstunde"]
datum: 2026-08-28
entwurf: false
---

## Dasselbe Dreieck, zwei Blickwinkel

Ein rechtwinkliges Dreieck mit dem rechten Winkel bei C, den Katheten a und b und der Hypotenuse c.

| Bezogen auf … | Hypotenuse | Gegenkathete | Ankathete |
|:--|:--|:--|:--|
| Winkel α (bei A) | c | a | b |
| Winkel β (bei B) | c | b | a |

Die Hypotenuse bleibt; die beiden Katheten tauschen die Rolle. Daraus folgt unmittelbar:

> **sin α = a : c = cos β**

Diese Beziehung fällt in der Erarbeitungsphase von selbst an und ist keine zusätzliche Formel, sondern eine Beobachtung an der Tabelle.

## Die Auswahlregel

Nicht „welche Funktion nehme ich?“, sondern: **Welche beiden Seiten sind im Spiel – die gegebene und die gesuchte?**

| gegeben und gesucht | Funktion |
|:--|:--|
| Gegenkathete und Hypotenuse | Sinus |
| Ankathete und Hypotenuse | Kosinus |
| Gegenkathete und Ankathete | Tangens |

Die Frage nach den beiden Seiten lässt sich immer beantworten. Die Frage nach der Funktion nicht – jedenfalls nicht, bevor die erste beantwortet ist.

## Vier Beispielaufgaben (nur der Ansatz)

| gegeben | gesucht | beteiligte Seiten | Ansatz |
|:--|:--|:--|:--|
| c = 10, α = 30° | a | Gegenkathete, Hypotenuse | sin 30° = a : 10 → a = 5 |
| b = 12, α = 40° | a | Gegenkathete, Ankathete | tan 40° = a : 12 → a ≈ 10,07 |
| a = 5, c = 13 | α | Gegenkathete, Hypotenuse | sin α = 5 : 13 → α ≈ 22,6° |
| c = 4, α = 70° | b | Ankathete, Hypotenuse | cos 70° = b : 4 → b ≈ 1,37 |

## Didaktischer Kommentar

**Warum die Zuordnung mehr Zeit bekommt als die Rechnung.** Das Rechnen ist Tastendrücken; drei Funktionen und ein Bruch. Was Aufgaben scheitern lässt, ist die Entscheidung davor – und die wird in vielen Lehrgängen nur beiläufig behandelt, weil die Buchfiguren immer gleich liegen. Sobald die Figur gedreht ist oder der andere Winkel betrachtet wird, bricht die Zuordnung nach Lage zusammen.

**Warum dieselbe Struktur wie beim Pythagoras vorliegt.** Auch dort ist die Rechnung leicht und die Zuordnung schwer (welche Seite ist die Hypotenuse?). Diese Parallele auszusprechen, hilft: Es ist nicht ein neues Problem, sondern dasselbe eine Stufe höher. Wer die Hypotenusenregel sicher hat, hat auch hier den Anker – die Hypotenuse bleibt in beiden Blickwinkeln dieselbe.

**Warum die Merkregel geprüft statt verboten wird.** GAGA HHAG ist nützlich und wird ohnehin benutzt. Sie speichert die drei Quotienten und ersetzt kein Verständnis der Zuordnung. Das ausdrücklich zu klären, verhindert die falsche Erwartung, mit der Eselsbrücke sei das Thema erledigt – und nimmt ihr zugleich den Ruch des Verbotenen.

**Warum der Taschenrechnermodus in die Stolpersteine gehört.** Ein Ergebnis von −0,988 statt 0,5 sieht nach einem Rechenfehler aus und ist keiner. Die Kontrolle sin 30° = 0,5 dauert drei Sekunden und sollte zur Gewohnheit werden – sie fängt einen Fehler ab, der sonst durch eine ganze Klassenarbeit läuft.

## Zum Weiterarbeiten

- [Aufgabenfolge: Welche Seite ist welche](/aufgaben/trigonometrie-welche-seite-ist-welche)
- [Diagnostische Fragen: sin, cos, tan](/quizzes/trigonometrie-sin-cos-tan)
- [Stundenverlauf: Erst die Hypotenuse finden](/stunden/pythagoras-welche-seite-ist-die-hypotenuse) – die Vorstufe
- [Übungsgenerator Trigonometrie](/uebung/trigonometrie)
