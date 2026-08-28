---
titel: "Wurzeln: Was erlaubt ist – und was nur so aussieht"
thema: "Wurzelrechnung"
klassenstufe: ["9"]
dauer: 45
stundenziel: "Die Lernenden unterscheiden die gültigen Wurzelgesetze für Produkt und Quotient von der nicht gültigen Übertragung auf Summen und begründen den Unterschied an Zahlenbeispielen."
kurz: "√(a · b) = √a · √b stimmt. √(a + b) = √a + √b nicht. Eine Einzelstunde, in der die Klasse selbst herausfindet, welche der vier naheliegenden Regeln tragen."
voraussetzungen:
  - "Quadratzahlen und Quadratwurzeln bis 400"
  - "Rechnen mit dem Taschenrechner, sinnvolles Runden"
  - "Potenzgesetze für Produkte"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Taschenrechner"
  - "Beamer für den Kopfrechen-Sprint als Aufwärmen"
einstiegsfrage:
  frage: "Welche dieser vier Gleichungen stimmt für alle nichtnegativen a und b?"
  antworten:
    - text: "√(a · b) = √a · √b"
      korrekt: true
      deutung: "Trägt. Nachfragen, ob geprüft oder gewusst – und ob die Person auch sagen kann, welche der anderen drei nicht stimmen."
    - text: "√(a + b) = √a + √b"
      korrekt: false
      deutung: "Die Wurzel wird über die Summe verteilt. Die häufigste Fehlvorstellung und die Schwester von (a + b)² = a² + b². Beide entstehen aus derselben Übergeneralisierung."
    - text: "√(a − b) = √a − √b"
      korrekt: false
      deutung: "Dieselbe Übertragung auf die Differenz. Wird oft zusammen mit der vorigen angekreuzt – dann ist die Ursache klar."
    - text: "√(a²) + √(b²) = a + b, also gilt auch √(a² + b²) = a + b"
      korrekt: false
      deutung: "Ein Scheinargument, das formal richtig beginnt und im zweiten Schritt kippt. Wer es ankreuzt, argumentiert bereits – das ist mehr wert als ein zufällig richtiges Kreuz."
  quiz: "quadratwurzeln-typische-fehlvorstellungen"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 8
    titel: "Vier Regeln, wie viele stimmen?"
    ablauf: "Die vier Gleichungen stehen an der Tafel, alle antworten gleichzeitig auf die Frage, welche stimmt. Danach ohne Auflösung: „Prüft die zweite mit a = 9 und b = 16.“"
    lehrkraft: "Die Probe erledigt die Sache: √25 = 5, aber √9 + √16 = 7. Nicht kommentieren – zusehen, wer rechnet. Die Zahlen 9 und 16 sind bewusst gewählt, weil beide Wurzeln glatt aufgehen und das Ergebnis trotzdem nicht passt."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 8
    dauer: 14
    titel: "Alle vier durchprobieren"
    ablauf: "Partnerarbeit: Jede der vier Gleichungen wird mit mindestens zwei Zahlenpaaren geprüft. In eine Tabelle kommt für jedes Paar, ob beide Seiten übereinstimmen."
    lehrkraft: "Auf mindestens zwei Paare bestehen. Bei b = 0 stimmen alle vier Gleichungen – wer nur dieses Paar prüft, kommt zum falschen Schluss. Das ist eine wertvolle Erfahrung über das Prüfen selbst und sollte in der Abgleichphase benannt werden."
  - schritt: "A"
    minute: 22
    dauer: 14
    titel: "Zwei bleiben übrig"
    ablauf: "Die Tabellen kommen an die Tafel. Übrig bleiben Produkt und Quotient. Anschließend die Frage: Warum funktioniert es bei der Multiplikation und nicht bei der Addition?"
    lehrkraft: "Die Begründung über die Potenzschreibweise ist kurz und trägt: √a = a^(1/2), und Potenzgesetze gelten für Produkte, nicht für Summen. Wer das schon kennt, sagt es; sonst genügt der Verweis auf die Parallele zu (a + b)² – dieselbe Regel, dieselbe Grenze."
  - schritt: "R"
    minute: 36
    dauer: 5
    titel: "Teilweise wurzelziehen"
    ablauf: "Sechs Wurzeln werden vereinfacht: √50, √72, √18, √200, √45, √98. Die Produktregel ist hier das einzige Werkzeug."
    lehrkraft: "Der Trick ist immer derselbe: den größten quadratischen Faktor abspalten. √50 = √(25 · 2) = 5√2. Wer die Produktregel gerade selbst bestätigt hat, sieht hier, wofür sie gut ist."
    werkzeug: { text: "Aufgabenfolge: Wurzeln – was erlaubt ist", href: "/aufgaben/wurzeln-was-erlaubt-ist" }
  - schritt: "R"
    minute: 41
    dauer: 4
    titel: "Exit-Ticket"
    ablauf: "Zwei Fragen: eine Vereinfachung und eine Widerlegung."
    lehrkraft: "Bei der Widerlegung genügt ein Gegenbeispiel – und die Fähigkeit, eines zu finden, ist der eigentliche Ertrag der Stunde."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % erkennen die Produktregel als die einzig richtige."
    dann: "Direkt zum teilweisen Wurzelziehen und zum Rationalmachen des Nenners: Warum schreibt man 1/√2 lieber als √2/2? Der Zusammenhang mit der Produktregel ist derselbe."
  - wenn: "Viele halten die Summenregel für richtig."
    dann: "Wie geplant. In der Abgleichphase ausdrücklich die Parallele zu (a + b)² ziehen: Es ist derselbe Fehler in anderer Verkleidung, und wer ihn einmal erkennt, erkennt ihn wieder."
  - wenn: "Beim Prüfen wird nur mit 0 oder 1 gerechnet."
    dann: "Das ist der lehrreichste Fall. An der Tafel zeigen, dass bei b = 0 alle vier Gleichungen stimmen – und dann fragen, was das über die Regeln aussagt. Antwort: nichts. Ein Beispiel bestätigt keine Regel, aber ein Gegenbeispiel widerlegt sie."
  - wenn: "Das teilweise Wurzelziehen gelingt nicht."
    dann: "Die Quadratzahlen bis 100 an die Tafel schreiben und die Suche darauf beschränken: Welche davon steckt in 50, in 72, in 200? Ohne den Blick für Quadratzahlen ist das Verfahren nicht zugänglich."
exitTicket:
  - "Vereinfache so weit wie möglich: √72 und √8 · √2."
  - "Jemand behauptet: √(a + b) = √a + √b. Widerlege das mit einem Zahlenbeispiel."
differenzierung:
  schneller: "Für welche Paare (a, b) mit a, b ≥ 0 gilt √(a + b) = √a + √b tatsächlich? (Nur wenn a = 0 oder b = 0 – quadriert man beide Seiten, bleibt 0 = 2√(ab).) Führe die Rechnung durch."
  langsamer: "Nur die Produktregel und nur mit Zahlen, die glatte Wurzeln haben: √4 · √9, √(4 · 9), √16 · √25. Die Summenregel wird als Gegenbeispiel gezeigt, aber nicht selbst untersucht."
stolpersteine:
  - fehlvorstellung: "Die Wurzel wird über die Summe verteilt: √(a + b) = √a + √b."
    reaktion: "a = 9, b = 16 prüfen lassen: 5 gegen 7. Ein Gegenbeispiel genügt, und die Zahlen sind bewusst so gewählt, dass sich beide Seiten ohne Taschenrechner ausrechnen lassen."
  - fehlvorstellung: "√(a²) = a – auch für negative a."
    reaktion: "a = −3 einsetzen: √9 = 3, nicht −3. Die Quadratwurzel liefert immer den nichtnegativen Wert; korrekt ist √(a²) = |a|."
  - fehlvorstellung: "Ein bestätigendes Beispiel beweist eine Regel."
    reaktion: "Zeigen, dass bei b = 0 alle vier Gleichungen stimmen. Wer daraus schließt, alle seien richtig, hat zu wenig geprüft – Regeln werden durch Gegenbeispiele entschieden."
hausaufgabe: "Aus der Aufgabenfolge die Aufgaben zum teilweisen Wurzelziehen. Zusätzlich: Schreibe die vier Regeln vom Stundenanfang ab und markiere die beiden gültigen – mit je einem Zahlenbeispiel daneben."
tags: ["wurzelrechnung", "wurzelgesetze", "gegenbeispiel", "klar", "einzelstunde"]
datum: 2026-08-28
entwurf: false
---

## Die vier Kandidaten

| Regel | gilt? | Gegenbeispiel |
|:--|:--|:--|
| √(a · b) = √a · √b | **ja** | – |
| √(a : b) = √a : √b (b > 0) | **ja** | – |
| √(a + b) = √a + √b | nein | a = 9, b = 16: √25 = 5, aber 3 + 4 = 7 |
| √(a − b) = √a − √b | nein | a = 25, b = 9: √16 = 4, aber 5 − 3 = 2 |

Die beiden gültigen Regeln haben eine gemeinsame Ursache: Die Wurzel ist eine Potenz mit dem Exponenten ½, und Potenzgesetze gelten für Produkte und Quotienten – nicht für Summen. Dieselbe Grenze erklärt auch, warum (a + b)² nicht a² + b² ist.

## Warum die Zahlen 9 und 16

Sie sind so gewählt, dass beide Wurzeln glatt aufgehen (3 und 4) *und* ihre Summe eine Quadratzahl ergibt (25). Damit lässt sich beide Seiten im Kopf ausrechnen, und das Gegenbeispiel steht in fünf Sekunden. Mit a = 2 und b = 3 wäre dieselbe Widerlegung eine Taschenrechnerübung – und deutlich weniger überzeugend.

Für die Differenzregel leisten 25 und 9 dasselbe: √16 = 4 gegen 5 − 3 = 2.

## Teilweises Wurzelziehen

| Wurzel | größter quadratischer Faktor | vereinfacht |
|:--|:--|:--|
| √50 | 25 | 5√2 |
| √72 | 36 | 6√2 |
| √18 | 9 | 3√2 |
| √200 | 100 | 10√2 |
| √45 | 9 | 3√5 |
| √98 | 49 | 7√2 |

Fünf der sechs führen auf √2 – das ist Absicht: So lassen sich die Ergebnisse anschließend addieren und vergleichen, und die Klasse sieht, dass 5√2, 6√2 und 3√2 zusammengefasst werden können, √5 aber nicht dazugehört.

## Didaktischer Kommentar

**Warum die Klasse alle vier Regeln prüft, statt zwei erklärt zu bekommen.** Der Unterschied zwischen „diese Regel gilt“ und „diese Regel gilt nicht“ ist für Lernende oft nicht sichtbar, weil beide gleich aussehen. Wer alle vier selbst prüft, hat danach kein Gedächtnisproblem, sondern ein Verfahren: im Zweifel Zahlen einsetzen. Dieses Verfahren trägt weit über die Wurzeln hinaus.

**Warum das Prüfen mit 0 und 1 ein Lerngegenstand ist.** Fast jede Klasse hat ein Paar, das mit b = 0 rechnet und zu dem Schluss kommt, alles stimme. Das ist kein Fehler, sondern eine wichtige Erfahrung über die Grenzen des Ausprobierens: Ein Beispiel kann eine Regel nicht bestätigen, ein Gegenbeispiel sie aber widerlegen. Diese Asymmetrie explizit zu benennen, ist einer der wenigen Momente, in denen Mittelstufenunterricht über Beweislogik sprechen kann, ohne es künstlich zu machen.

**Warum die Parallele zu (a + b)² gezogen wird.** Beide Fehler haben dieselbe Ursache: eine Rechenoperation wird über eine Summe verteilt, obwohl sie sich nur über Produkte verteilt. Wer diese Verwandtschaft sieht, hat nicht zwei Regeln gelernt, sondern eine Struktur erkannt – und erkennt den nächsten Fall dieser Art (etwa beim Logarithmus) leichter wieder.

**Warum √(a²) = |a| in die Stolpersteine gehört.** Der Fall ist mathematisch wichtig und für die Klassenstufe schwierig, weil der Betrag oft noch frisch ist. Als Stolperstein benannt, kann er in der Stunde beiläufig geklärt werden; als eigener Lerngegenstand würde er die 45 Minuten sprengen.

## Zum Weiterarbeiten

- [Aufgabenfolge: Wurzeln – was erlaubt ist](/aufgaben/wurzeln-was-erlaubt-ist)
- [Diagnostische Fragen: Quadratwurzeln](/quizzes/quadratwurzeln-typische-fehlvorstellungen)
- [Stundenverlauf: Woher der mittlere Term kommt](/stunden/binomische-formeln-warum-der-mittelterm-da-ist) – derselbe Fehler eine Klasse früher
- [Übungsgenerator Wurzelrechnung](/uebung/wurzelrechnung)
