---
titel: "Logarithmen: Die Frage nach dem Exponenten"
thema: "Logarithmen"
klassenstufe: ["10"]
dauer: 90
stundenziel: "Die Lernenden deuten den Logarithmus als gesuchten Exponenten, lösen damit Exponentialgleichungen und wenden die Rechenregeln für Produkt, Quotient und Potenz an."
kurz: "log(x) ist keine neue Rechenart, sondern eine Frage: Mit welchem Exponenten? Eine Doppelstunde, die vom Problem ausgeht statt von der Definition."
voraussetzungen:
  - "Potenzen mit ganzzahligen Exponenten sicher berechnen"
  - "Exponentielles Wachstum und den Vermehrungsfaktor kennen"
  - "Gleichungen durch Umkehroperationen lösen"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Taschenrechner"
  - "Beamer für den Funktionenplotter"
einstiegsfrage:
  frage: "Ein Guthaben von 1000 € wächst jährlich um 5 %. Nach wie vielen Jahren ist es auf 2000 € angewachsen?"
  antworten:
    - text: "Das lässt sich mit den bisherigen Mitteln nur durch Probieren bestimmen."
      korrekt: true
      deutung: "Trägt und ist der beste Einstieg: Die Gleichung 1000 · 1,05^t = 2000 lässt sich nach t nicht mit den bekannten Umformungen auflösen. Genau dafür wird der Logarithmus gebraucht."
    - text: "Nach 20 Jahren."
      korrekt: false
      deutung: "Linear gerechnet: 5 % von 1000 € sind 50 €, mal 20 ergibt 1000 € Zuwachs. Der Rückfall in die lineare Vorstellung – hier lohnt ein kurzer Rückgriff auf die vorangegangene Stunde."
    - text: "Nach etwa 14 Jahren."
      korrekt: false
      deutung: "Der Zahlenwert stimmt (14,21), aber die Frage war, wie man ihn bestimmt. Nachfragen, ob geraten, probiert oder gerechnet wurde – wer die Faustregel „70 durch Prozentsatz“ kennt, hat einen guten Schätzwert und noch kein Verfahren."
    - text: "Man teilt 2000 durch 1,05."
      korrekt: false
      deutung: "Der Exponent wird wie ein Faktor behandelt. Zeigt, dass die Struktur der Gleichung noch nicht gelesen wird: t steht oben, nicht daneben."
  quiz: "logarithmen-rechenregeln"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 10
    titel: "Eine Gleichung, die nicht aufgeht"
    ablauf: "Die Einstiegsfrage steht an der Tafel, alle antworten gleichzeitig. Danach wird die Gleichung 1000 · 1,05^t = 2000 angeschrieben und gefragt: Welche Umformung bringt t nach unten?"
    lehrkraft: "Die Frage bleibt unbeantwortet – das ist ihr Zweck. Die Klasse sammelt zwei Minuten lang Vorschläge (durch 1000 teilen: ja; Wurzel ziehen: nein; logarithmieren: kennt noch niemand). Danach steht 1,05^t = 2 an der Tafel."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 10
    dauer: 25
    titel: "Exponenten suchen"
    ablauf: "Partnerarbeit an einer Tabelle: Zu welchen Exponenten gehören die Ergebnisse? 2^x = 8, 2^x = 32, 10^x = 1000, 10^x = 0,01, 3^x = 81, 2^x = 100. Die letzte lässt sich nicht raten – nur einschachteln."
    lehrkraft: "Die ersten fünf sind Kopfrechnen, die sechste ist der Punkt. Zwischen 2^6 = 64 und 2^7 = 128 muss der Wert liegen; durch Probieren kommt man auf etwa 6,6. Diese Einschachtelung ist die Motivation für eine eigene Taste."
  - schritt: "A"
    minute: 35
    dauer: 25
    titel: "Ein Name für die Frage"
    ablauf: "Die Schreibweise wird eingeführt: log₂(100) ist die Zahl, mit der man 2 potenzieren muss, um 100 zu erhalten. Die Tabelle aus der Erarbeitung wird in dieser Schreibweise noch einmal notiert – jede Zeile zweimal, als Potenz und als Logarithmus."
    lehrkraft: "Der Kern des Verständnisses ist die Übersetzung in beide Richtungen: 2³ = 8 heißt log₂(8) = 3, und umgekehrt. Wer diese Übersetzung sicher beherrscht, braucht keine der späteren Regeln auswendig – sie folgen aus den Potenzgesetzen."
  - schritt: "A"
    minute: 60
    dauer: 12
    titel: "Die Regeln aus den Potenzgesetzen"
    ablauf: "Aus a^m · a^n = a^(m+n) folgt log(u · v) = log u + log v. Die Klasse leitet die drei Regeln aus den entsprechenden Potenzgesetzen ab und prüft jede an Zahlen: log 2 + log 5 = log 10 = 1."
    lehrkraft: "Und die Gegenprobe: log(2 + 5) = log 7 ≈ 0,845, nicht log 2 + log 5 = 1. Der Logarithmus verteilt sich über Produkte, nicht über Summen – dieselbe Grenze wie bei Wurzeln und beim Quadrieren einer Summe."
  - schritt: "R"
    minute: 72
    dauer: 13
    titel: "Zurück zur Eingangsfrage"
    ablauf: "1,05^t = 2 wird jetzt gelöst: t = log(2) : log(1,05) ≈ 14,21. Danach zwei weitere Aufgaben aus der Aufgabenfolge."
    lehrkraft: "Der Rückbezug ist wichtiger als die zusätzlichen Aufgaben. Die Frage vom Stundenanfang war 90 Minuten lang offen; sie jetzt zu beantworten, schließt den Kreis."
    werkzeug: { text: "Aufgabenfolge: Vom Faktor zur Zahl", href: "/aufgaben/logarithmen-vom-faktor-zur-zahl" }
  - schritt: "R"
    minute: 85
    dauer: 5
    titel: "Exit-Ticket"
    ablauf: "Drei Fragen: eine Übersetzung, eine Regelanwendung, eine Widerlegung."
    lehrkraft: "Frage 1 prüft das Verständnis, Frage 3 die Fähigkeit, mit einem Gegenbeispiel zu argumentieren."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % erkennen, dass die Gleichung mit bisherigen Mitteln nicht auflösbar ist."
    dann: "Die Erarbeitung kürzen und früher zu den Rechenregeln gehen. Zusätzlich die Basisumrechnung: Warum liefert log(2) : log(1,05) dasselbe wie log₁,₀₅(2)?"
  - wenn: "Viele antworten „nach 20 Jahren“."
    dann: "Zehn Minuten zurück zum exponentiellen Wachstum: Die Tabelle mit Differenz und Quotient noch einmal aufbauen. Ohne diese Grundlage ist die Frage nach dem Exponenten nicht sinnvoll gestellt."
  - wenn: "Die Übersetzung Potenz ↔ Logarithmus bleibt unsicher."
    dann: "Die Rechenregeln streichen und die ganze zweite Hälfte auf das Übersetzen verwenden – in beide Richtungen, mit zwanzig Beispielen. Die Regeln ohne diese Grundlage sind reine Symbolschieberei."
  - wenn: "Die Klasse rechnet log(2 + 5) = log 2 + log 5."
    dann: "Am Taschenrechner prüfen lassen: 0,845 gegen 1. Danach die Parallele zu √(a + b) und (a + b)² ziehen – es ist derselbe Fehler zum dritten Mal, und beim dritten Mal sollte er erkannt werden."
exitTicket:
  - "Schreibe als Logarithmus: 5³ = 125. Und als Potenz: log₃(81) = 4."
  - "Löse: 3^x = 50 (auf zwei Nachkommastellen)."
  - "Jemand schreibt log(a + b) = log a + log b. Widerlege das mit zwei Zahlen."
differenzierung:
  schneller: "Zeige mit den Potenzgesetzen, warum log(u^n) = n · log u gilt. Danach: Warum ist log₁₀(1) = 0 für jede Basis, und warum ist log(0) nicht definiert?"
  langsamer: "Nur die Übersetzung zwischen Potenz- und Logarithmusschreibweise, mit Basen 2, 3 und 10 und ganzzahligen Ergebnissen. Die Rechenregeln folgen in der nächsten Stunde."
stolpersteine:
  - fehlvorstellung: "Der Logarithmus wird als Rechenoperation ohne Bedeutung gelernt."
    reaktion: "Jede Logarithmusgleichung laut als Frage sprechen: „Mit welcher Zahl muss ich 2 potenzieren, um 8 zu bekommen?“ Wer die Frage stellen kann, kennt die Antwort meist schon."
  - fehlvorstellung: "log(a + b) = log a + log b."
    reaktion: "Mit 2 und 5 prüfen: log 7 ≈ 0,845, log 2 + log 5 = 1. Dasselbe Muster wie bei √(a + b) und (a + b)² – die Verwandtschaft ausdrücklich benennen."
  - fehlvorstellung: "log(0) oder der Logarithmus einer negativen Zahl seien berechenbar."
    reaktion: "Die Frage stellen: Mit welchem Exponenten wird 10 zu null? Es gibt keinen – Potenzen positiver Basen sind immer positiv."
hausaufgabe: "Aus der Aufgabenfolge die Aufgaben zur Übersetzung und zu den Rechenregeln. Zusätzlich: Bestimme, nach wie vielen Jahren sich ein Guthaben bei 3 % Zinsen verdoppelt – und vergleiche mit der Faustregel „70 durch Prozentsatz“."
tags: ["logarithmen", "exponentialgleichungen", "rechenregeln", "klar", "doppelstunde"]
datum: 2026-08-28
entwurf: false
---

## Die Tabelle der Erarbeitungsphase

| Gleichung | Exponent | als Logarithmus |
|:--|--:|:--|
| 2^x = 8 | 3 | log₂(8) = 3 |
| 2^x = 32 | 5 | log₂(32) = 5 |
| 10^x = 1000 | 3 | log₁₀(1000) = 3 |
| 10^x = 0,01 | −2 | log₁₀(0,01) = −2 |
| 3^x = 81 | 4 | log₃(81) = 4 |
| 2^x = 100 | **≈ 6,64** | log₂(100) ≈ 6,64 |

Die ersten fünf Zeilen lassen sich im Kopf beantworten. Die sechste nicht – zwischen 2⁶ = 64 und 2⁷ = 128 muss der Wert liegen, aber welcher genau? Aus dieser Lücke entsteht das Bedürfnis nach einer eigenen Schreibweise und einer eigenen Taste.

> **log_b(a) ist die Antwort auf die Frage: Mit welchem Exponenten wird b zu a?**

## Die drei Regeln und ihre Herkunft

| Potenzgesetz | Logarithmusregel | Probe |
|:--|:--|:--|
| a^m · a^n = a^(m+n) | log(u · v) = log u + log v | log 2 + log 5 = log 10 = 1 |
| a^m : a^n = a^(m−n) | log(u : v) = log u − log v | log 100 − log 10 = 2 − 1 = 1 |
| (a^m)^n = a^(m·n) | log(u^n) = n · log u | log(100³) = 3 · 2 = 6 |

Und die Grenze, die dazugehört:

> log(u + v) ist **nicht** log u + log v.
> Probe: log(2 + 5) = log 7 ≈ 0,845, aber log 2 + log 5 = 1.

## Die Eingangsfrage, beantwortet

> 1000 · 1,05^t = 2000  | : 1000
> 1,05^t = 2  | logarithmieren
> t · log(1,05) = log(2)
> t = log(2) : log(1,05) ≈ 14,21

Nach gut 14 Jahren hat sich das Guthaben verdoppelt – unabhängig davon, ob es 1000 € oder 100 000 € waren. Diese Unabhängigkeit vom Startwert ist eine eigene Beobachtung wert: Der Startwert kürzt sich heraus, weil er auf beiden Seiten steht.

## Didaktischer Kommentar

**Warum die Gleichung vor der Definition steht.** Der Logarithmus wird in vielen Lehrgängen definiert und dann angewendet. Das funktioniert, erzeugt aber eine Vokabel: Man weiß, was zu tun ist, ohne zu wissen, wofür. Umgekehrt entsteht aus der Gleichung 1,05^t = 2 ein Problem, das mit den bekannten Mitteln nicht lösbar ist – und die Definition ist dann eine Antwort und keine Setzung.

**Warum die Übersetzung in beide Richtungen geübt wird.** „2³ = 8, also log₂(8) = 3“ ist die eine Richtung; „log₃(81) = 4, also 3⁴ = 81“ die andere. Wer beide sicher beherrscht, kann jede Logarithmusgleichung in eine Potenzgleichung zurückverwandeln und braucht keine der Regeln auswendig – sie lassen sich jederzeit aus den Potenzgesetzen wiederherstellen.

**Warum die Regeln hergeleitet und nicht angesagt werden.** Sie sind keine neuen Gesetze, sondern die Potenzgesetze in anderer Schreibweise. Diese Herkunft sichtbar zu machen, reduziert drei zu merkende Regeln auf drei bekannte – und erklärt zugleich, warum es für die Summe keine gibt: Für a^m + a^n existiert kein Potenzgesetz.

**Warum log(u + v) das dritte Mal ist.** Die Klasse hat denselben Fehler bereits bei (a + b)² und bei √(a + b) gesehen. Beim dritten Mal sollte er als Muster erkennbar sein: Eine Operation verteilt sich über Produkte, nicht über Summen. Diese Verallgemeinerung ausdrücklich zu ziehen, ist mehr wert als die einzelne Regel – sie trägt auch bei allem, was danach kommt.

## Zum Weiterarbeiten

- [Aufgabenfolge: Vom Faktor zur Zahl](/aufgaben/logarithmen-vom-faktor-zur-zahl)
- [Diagnostische Fragen: Rechenregeln](/quizzes/logarithmen-rechenregeln)
- [Stundenverlauf: Warum die Gerade nicht reicht](/stunden/exponentielles-wachstum-warum-die-gerade-nicht-reicht) – die Vorstunde
- [Stundenverlauf: Was erlaubt ist und was nicht](/stunden/wurzeln-was-erlaubt-ist-und-was-nicht) – derselbe Fehler bei den Wurzeln
