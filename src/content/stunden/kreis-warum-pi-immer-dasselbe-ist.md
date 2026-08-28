---
titel: "Der Kreis: Warum π immer dieselbe Zahl ist"
thema: "Kreisgeometrie"
klassenstufe: ["9"]
dauer: 90
stundenziel: "Die Lernenden bestimmen das Verhältnis von Umfang und Durchmesser an eigenen Messungen, erkennen es als kreisunabhängige Konstante und unterscheiden Umfangs- und Flächenformel in ihrer Abhängigkeit vom Radius."
kurz: "π ist keine Zahl aus der Formelsammlung, sondern ein Messergebnis. Eine Doppelstunde, in der die Klasse es selbst misst – und danach sieht, warum der Radius bei der Fläche quadratisch eingeht."
voraussetzungen:
  - "Umfang und Flächeninhalt von Rechteck und Dreieck"
  - "Messen mit Lineal und Maßband, Runden"
  - "Verhältnisse und Quotienten deuten"
material:
  - "Pro Gruppe drei runde Gegenstände verschiedener Größe (Dose, Becher, Teller, Klebeband)"
  - "Maßband oder Schnur und Lineal"
  - "Taschenrechner, Karopapier"
einstiegsfrage:
  frage: "Ein Kreis hat den doppelten Radius eines anderen. Was gilt für Umfang und Flächeninhalt?"
  antworten:
    - text: "Der Umfang verdoppelt sich, die Fläche vervierfacht sich."
      korrekt: true
      deutung: "Trägt. Nachfragen, woher der Unterschied kommt – „beim Umfang steht r einfach, bei der Fläche quadriert“ ist der Anfang, „Fläche ist zweidimensional“ die vollständige Antwort."
    - text: "Beides verdoppelt sich."
      korrekt: false
      deutung: "Verdoppeln wird als lineare Operation auf alles übertragen. Die häufigste Antwort und der Kern der zweiten Stundenhälfte."
    - text: "Der Umfang vervierfacht sich, die Fläche verdoppelt sich."
      korrekt: false
      deutung: "Die beiden Formeln werden vertauscht. Zeigt, dass sie als Zeichenfolgen gespeichert sind, nicht als Aussagen über eine Figur."
    - text: "Beides vervierfacht sich."
      korrekt: false
      deutung: "Das Quadrat wird auf beide Größen angewandt. Häufig bei Lernenden, die sich nur an das r² erinnern."
  quiz: "kreis-umfang-und-flaeche"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 10
    titel: "Doppelter Radius"
    ablauf: "Die Einstiegsfrage steht an der Tafel, alle antworten gleichzeitig. Die Verteilung wird notiert. Zweite Frage ohne Auflösung: Welche Zahl kommt heraus, wenn man den Umfang eines Kreises durch seinen Durchmesser teilt?"
    lehrkraft: "Die zweite Frage nicht beantworten lassen, sondern als Auftrag für die Messphase stehen lassen. Wer π schon kennt, darf es sagen – die Frage ist dann, ob es bei allen Kreisen dieselbe Zahl ist."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 10
    dauer: 25
    titel: "Messen und teilen"
    ablauf: "Gruppenarbeit: Zu drei runden Gegenständen werden Umfang und Durchmesser gemessen und in eine Tabelle eingetragen. Vierte Spalte: der Quotient U : d, auf zwei Nachkommastellen."
    lehrkraft: "Auf sauberes Messen bestehen – die Schnur muss straff anliegen, der Durchmesser durch den Mittelpunkt gehen. Die Streuung der Ergebnisse gehört zur Erfahrung: Werte zwischen 3,0 und 3,3 sind normal und kein Grund zur Korrektur."
  - schritt: "A"
    minute: 35
    dauer: 25
    titel: "Alle Quotienten an die Tafel"
    ablauf: "Jede Gruppe trägt ihre drei Quotienten ein. Aus etwa zwanzig Werten entsteht eine Spalte, die trotz aller Messfehler um eine Zahl streut. Der Mittelwert wird gebildet und mit 3,14159… verglichen."
    lehrkraft: "Der entscheidende Satz kommt aus der Klasse: Der Quotient hängt nicht von der Größe des Kreises ab. Genau das ist die Aussage – π ist kein Wert, der zum Kreis gehört, sondern zu allen Kreisen. Die Formel U = π · d ist danach nur eine andere Schreibweise des gemessenen Quotienten."
  - schritt: "A"
    minute: 60
    dauer: 12
    titel: "Warum die Fläche anders wächst"
    ablauf: "Auf Karopapier: Ein Kreis mit r = 2 und einer mit r = 4 werden gezeichnet und die Kästchen abgezählt. Der Vergleich mit dem Umfang macht den Unterschied sichtbar."
    lehrkraft: "Das Abzählen ist ungenau und genau deshalb überzeugend: Es kommt ungefähr das Vierfache heraus, nicht das Doppelte. Die Verbindung zum Quadrat in der Formel stellt die Klasse selbst her."
    werkzeug: { text: "Papier-Werkstatt: Karopapier", href: "/werkzeuge/karopapier.html" }
  - schritt: "R"
    minute: 72
    dauer: 13
    titel: "Beide Formeln anwenden"
    ablauf: "Aus der Aufgabenfolge die Aufgaben, in denen aus dem Umfang der Radius und daraus die Fläche bestimmt wird – und umgekehrt."
    lehrkraft: "Die Rückwärtsaufgaben sind wichtiger als die Vorwärtsaufgaben. Wer aus U = 31,4 cm den Radius bestimmt, hat die Formel als Gleichung benutzt und nicht als Rechenvorschrift."
    werkzeug: { text: "Aufgabenfolge: Umfang, Fläche und Sektor", href: "/aufgaben/kreis-umfang-flaeche-und-sektor" }
  - schritt: "R"
    minute: 85
    dauer: 5
    titel: "Exit-Ticket"
    ablauf: "Drei Fragen: eine Berechnung, eine Rückwärtsaufgabe, eine Begründung."
    lehrkraft: "Frage 3 zeigt, ob der Unterschied zwischen linearem und quadratischem Wachstum verstanden wurde oder nur die beiden Formeln gelernt sind."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % beantworten die Einstiegsfrage richtig."
    dann: "Die Messphase auf fünfzehn Minuten kürzen (ein Gegenstand pro Gruppe) und stattdessen den Kreissektor anschließen: Wie groß ist ein Viertelkreis, ein Sechstelkreis? Der Anteil am Vollkreis ist derselbe wie der Anteil am Vollwinkel."
  - wenn: "Viele antworten „beides verdoppelt sich“."
    dann: "Wie geplant, aber die Kästchenphase vorziehen und verlängern. Das Abzählen ist das einzige Argument, das gegen diese Vorstellung wirklich ankommt."
  - wenn: "Die Messwerte streuen sehr stark (unter 2,8 oder über 3,5)."
    dann: "Nicht die Werte korrigieren, sondern die Messung: Meist ist die Schnur zu locker oder der Durchmesser verfehlt den Mittelpunkt. Eine Gruppe misst gemeinsam an der Tafel vor. Der Umgang mit Messfehlern gehört zur Sache."
  - wenn: "Der Zusammenhang zwischen gemessenem Quotienten und der Formel wird nicht gesehen."
    dann: "Die Gleichung in beide Richtungen anschreiben: Aus U : d = π folgt U = π · d, und weil d = 2r ist, folgt U = 2πr. Drei Zeilen, die den Schritt vom Messergebnis zur Formel vollständig zeigen."
exitTicket:
  - "Ein Kreis hat den Radius 5 cm. Berechne Umfang und Flächeninhalt."
  - "Ein Kreis hat den Umfang 31,4 cm. Wie groß ist sein Flächeninhalt?"
  - "Warum vervierfacht sich die Fläche, wenn sich der Radius verdoppelt, der Umfang aber nur verdoppelt?"
differenzierung:
  schneller: "Ein Halbkreis mit Radius 4 cm: Wie groß sind Umfang und Fläche? (Fläche 25,13 cm²; Umfang 20,57 cm – der Durchmesser gehört dazu, der halbe Kreisumfang allein reicht nicht.) Warum ist der Umfang nicht die Hälfte des Kreisumfangs?"
  langsamer: "Nur die Umfangsformel, dafür mit allen drei gemessenen Gegenständen nachgerechnet und mit der Messung verglichen. Die Fläche folgt in der nächsten Stunde."
stolpersteine:
  - fehlvorstellung: "Umfang und Fläche wachsen gleich schnell."
    reaktion: "Kästchen abzählen bei r = 2 und r = 4. Der Faktor 4 ist abgezählt, nicht behauptet."
  - fehlvorstellung: "π ist eine Zahl, die man nachschlagen muss, ohne dass klar wäre, woher sie kommt."
    reaktion: "Die eigene Messtabelle. Zwanzig Quotienten, die alle um 3,14 liegen, sind eine Begründung – die Formelsammlung ist keine."
  - fehlvorstellung: "In der Flächenformel wird 2πr statt πr² verwendet."
    reaktion: "Die Einheiten prüfen: Der Umfang ist eine Länge (cm), die Fläche eine Fläche (cm²). Eine Formel mit r einfach kann keine Fläche liefern."
hausaufgabe: "Aus der Aufgabenfolge die Aufgaben zu Umfang und Fläche. Zusätzlich: Miss zu Hause einen runden Gegenstand aus, den es im Unterricht nicht gab, und trage Umfang, Durchmesser und Quotient in die Tabelle ein."
tags: ["kreisgeometrie", "pi", "umfang", "flaeche", "messen", "klar", "doppelstunde"]
datum: 2026-08-28
entwurf: false
---

## Die Messtabelle

| Gegenstand | Umfang U | Durchmesser d | U : d |
|:--|--:|--:|--:|
| Klebebandrolle | 25,0 cm | 8,0 cm | 3,12 |
| Trinkbecher | 23,5 cm | 7,5 cm | 3,13 |
| Teller | 78,0 cm | 24,8 cm | 3,15 |

Drei Zeilen je Gruppe, bei sechs Gruppen also achtzehn Werte an der Tafel. Sie streuen – aber sie streuen um eine Zahl, und diese Zahl ist unabhängig davon, ob der Gegenstand klein oder groß war.

> **Der Quotient U : d ist bei jedem Kreis gleich. Diese Zahl heißt π ≈ 3,14159.**
> Daraus folgt sofort: U = π · d und, weil d = 2r ist, U = 2 · π · r.

## Die Kästchenprobe

| Radius | Umfang (gerechnet) | Fläche (abgezählt) | Fläche (gerechnet) |
|--:|--:|--:|--:|
| 2 | 12,57 | ≈ 13 Kästchen | 12,57 |
| 4 | 25,13 | ≈ 50 Kästchen | 50,27 |

Der Umfang verdoppelt sich, die Fläche wird viermal so groß. Das lässt sich abzählen, bevor es begründet wird – und danach ist das Quadrat in π · r² keine Willkür mehr.

## Didaktischer Kommentar

**Warum gemessen und nicht hergeleitet wird.** π lässt sich nicht elementar herleiten; in der Sekundarstufe I ist die Messung der ehrliche Zugang. Der Erkenntnisgewinn liegt nicht im Zahlenwert – den kennen viele –, sondern in der Beobachtung, dass er *bei jedem Kreis derselbe* ist. Das ist eine Aussage über alle Kreise und damit ein echter mathematischer Satz, gewonnen aus den Messungen der Klasse.

**Warum die Messfehler dazugehören.** Werte zwischen 3,0 und 3,3 sind bei Schnur und Lineal normal. Sie wegzudiskutieren oder auf 3,14 zu „korrigieren“, zerstört genau das Argument: Dass alle Werte trotz unterschiedlicher Gegenstände und unterschiedlicher Messgenauigkeit im selben schmalen Bereich liegen, ist die Beobachtung. Eine Tabelle, in der überall exakt 3,14 steht, beweist nur, dass gerechnet statt gemessen wurde.

**Warum die Kästchen abgezählt werden.** Der Unterschied zwischen linearem und quadratischem Wachstum ist der schwierigere Teil der Stunde und lässt sich nicht durch die Formel klären – die Formel ist ja gerade das, was verstanden werden soll. Abzählen liefert ein unabhängiges Ergebnis: ungefähr das Vierfache. Ungefähr genügt hier vollkommen.

**Warum die Rückwärtsaufgaben wichtiger sind.** „Berechne den Umfang bei r = 5“ prüft das Einsetzen. „Bestimme die Fläche, wenn der Umfang 31,4 cm ist“ verlangt, die Formel als Gleichung zu behandeln, nach r aufzulösen und das Ergebnis weiterzuverwenden. Genau diese Aufgaben stehen in Prüfungen – und genau sie fehlen in vielen Übungsphasen.

## Zum Weiterarbeiten

- [Aufgabenfolge: Umfang, Fläche und Sektor](/aufgaben/kreis-umfang-flaeche-und-sektor)
- [Diagnostische Fragen: Umfang und Fläche](/quizzes/kreis-umfang-und-flaeche)
- [Übungsgenerator Kreisgeometrie](/uebung/kreisgeometrie)
- [Fehlvorstellungen zur Kreisgeometrie](/fehlvorstellungen#thema-kreisgeometrie)
