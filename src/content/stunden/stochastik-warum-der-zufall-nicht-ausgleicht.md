---
titel: "Stochastik: Warum der Zufall nichts ausgleicht"
thema: "Stochastik"
klassenstufe: ["7", "8"]
dauer: 90
stundenziel: "Die Lernenden unterscheiden relative Häufigkeit und Wahrscheinlichkeit, begründen an eigenen Versuchsreihen, warum sich die relative Häufigkeit stabilisiert, und widerlegen die Vorstellung, dass ausgebliebene Ergebnisse „nachgeholt“ werden."
kurz: "„Jetzt muss endlich eine Sechs kommen“ – die hartnäckigste Fehlvorstellung der Stochastik. Diese Doppelstunde stellt ihr eigene Daten entgegen: die absolute Abweichung wächst, die relative fällt."
voraussetzungen:
  - "Brüche, Dezimalzahlen und Prozente ineinander umwandeln"
  - "Einfache Zufallsversuche beschreiben (Würfel, Münze, Urne)"
  - "Diagramme lesen und beschriften"
material:
  - "Ein Würfel pro Zweiergruppe"
  - "Beamer für das Werkzeug Zufallsexperimente"
  - "Strichliste auf Papier oder in einer Tabelle"
einstiegsfrage:
  frage: "Beim Würfeln ist zwanzigmal hintereinander keine Sechs gefallen. Wie groß ist die Wahrscheinlichkeit, dass beim nächsten Wurf eine Sechs kommt?"
  antworten:
    - text: "1/6"
      korrekt: true
      deutung: "Trägt. Nachfragen, wie die Person begründet – „der Würfel hat kein Gedächtnis“ ist die tragfähige Antwort und soll laut gesagt werden."
    - text: "Größer als 1/6, die Sechs ist überfällig."
      korrekt: false
      deutung: "Die Kernfehlvorstellung der Stunde. Sie entsteht aus einer halbrichtigen Vorstellung vom Gesetz der großen Zahlen: Auf lange Sicht gleicht sich etwas aus, also – so der Schluss – muss es aktiv nachgeholt werden."
    - text: "Kleiner als 1/6, der Würfel scheint keine Sechs zu mögen."
      korrekt: false
      deutung: "Die entgegengesetzte Deutung derselben Daten: Aus der Serie wird auf eine Eigenschaft des Würfels geschlossen. Seltener, aber didaktisch aufschlussreich – hier wird immerhin empirisch argumentiert."
    - text: "Das kann man nicht sagen."
      korrekt: false
      deutung: "Vorsichtig und trotzdem falsch. Die Frage ist beantwortbar, sobald man den Würfel als unabhängig annimmt. Diese Antwort lohnt eine Nachfrage: Was müsste man wissen, um es sagen zu können?"
  quiz: "wahrscheinlichkeit-grundvorstellungen"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 10
    titel: "Die überfällige Sechs"
    ablauf: "Die Einstiegsfrage steht an der Tafel, alle antworten gleichzeitig. Die Verteilung wird notiert und ausdrücklich nicht aufgelöst – sie wird am Ende der Stunde noch einmal gebraucht."
    lehrkraft: "Bei der Antwort „überfällig“ nicht widersprechen, sondern die Begründung erfragen und wörtlich an die Tafel schreiben. Dieser Satz wird in der Abgleichphase an den eigenen Daten der Klasse geprüft."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 10
    dauer: 25
    titel: "Sechzig Würfe pro Paar"
    ablauf: "Partnerarbeit: Jedes Paar würfelt 60-mal und führt eine Strichliste. Notiert werden nach je 10 Würfen zwei Zahlen: die Anzahl der Sechsen und die relative Häufigkeit."
    lehrkraft: "Vor dem Start eine Prognose einholen: Wie viele Sechsen erwartet ihr bei 60 Würfen? Die Zahl 10 an die Tafel schreiben. Beim Herumgehen nicht kommentieren, wie weit die Paare davon entfernt sind – das ist der Gegenstand der nächsten Phase."
  - schritt: "A"
    minute: 35
    dauer: 25
    titel: "Zwei Spalten, zwei Geschichten"
    ablauf: "Alle Ergebnisse kommen an die Tafel und werden zu einer Gesamtsumme addiert. Danach werden zwei Größen nebeneinandergestellt: die absolute Abweichung vom Erwartungswert und die relative Häufigkeit."
    lehrkraft: "Das ist der Kern der Stunde. Bei mehr Würfen wird die absolute Abweichung tendenziell größer, die relative Häufigkeit nähert sich 1/6. Beide Aussagen stimmen gleichzeitig – und genau ihr Nebeneinander widerlegt das „Ausgleichen“."
  - schritt: "A"
    minute: 60
    dauer: 12
    titel: "Zehntausend Würfe in zehn Sekunden"
    ablauf: "Am Werkzeug wird die Versuchsreihe auf 100, 1 000 und 10 000 Würfe verlängert. Die Klasse sagt jeweils vorher, was mit den beiden Spalten passiert."
    lehrkraft: "Die Kurve der relativen Häufigkeit läuft sichtbar auf 1/6 zu, die absolute Abweichung tut das nicht. Den Simulationslauf zweimal starten: Dass zwei Läufe verschieden aussehen und beide dasselbe zeigen, gehört zur Einsicht dazu."
    werkzeug: { text: "Zufallsexperimente", href: "/werkzeuge/zufallsexperimente.html" }
  - schritt: "R"
    minute: 72
    dauer: 13
    titel: "Zurück zur Einstiegsfrage"
    ablauf: "Die notierte Begründung vom Stundenanfang wird noch einmal gelesen und von der Klasse geprüft. Danach zwei Aufgaben aus der Aufgabenfolge, in denen zwischen relativer Häufigkeit und Wahrscheinlichkeit unterschieden werden muss."
    lehrkraft: "Der Rückbezug ist wichtiger als die Aufgaben. Wer am Anfang „überfällig“ geantwortet hat, soll selbst sagen, was an dem Satz nicht stimmt – nicht die Lehrkraft."
    werkzeug: { text: "Aufgabenfolge Stochastik", href: "/aufgaben/stochastik-vom-schaetzen-zum-rechnen" }
  - schritt: "R"
    minute: 85
    dauer: 5
    titel: "Exit-Ticket"
    ablauf: "Drei Fragen: eine Wahrscheinlichkeit, eine Schätzung, eine Begründung."
    lehrkraft: "Frage 3 ist die eigentliche Kontrolle. Ein richtig gerechneter Bruch in Frage 1 sagt über die Fehlvorstellung nichts aus."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % antworten 1/6 und begründen mit der Unabhängigkeit."
    dann: "Die Würfelphase auf 30 Würfe kürzen und stattdessen mehrstufige Versuche anschließen: Zwei Münzen – wie wahrscheinlich ist zweimal Kopf? Die Antwort 1/3 („drei Fälle: zweimal Kopf, zweimal Zahl, gemischt“) ist dort die verbreitete Fehlvorstellung."
  - wenn: "Ein großer Teil hält die Sechs für überfällig."
    dann: "Wie geplant, aber die Abgleichphase verlängern und die Gesamtsumme der Klasse ausdrücklich mit einzelnen Paarergebnissen vergleichen. Der Kontrast zwischen 60 und 900 Würfen ist das stärkste Argument."
  - wenn: "Die Klassensumme liegt zufällig sehr nah am Erwartungswert."
    dann: "Günstig für die relative Häufigkeit, ungünstig für die absolute Abweichung. Dann am Werkzeug mehrere Läufe zeigen, bis eine Reihe mit deutlicher absoluter Abweichung dabei ist – bei 10 000 Würfen ist sie fast immer zweistellig."
  - wenn: "Einzelne Paare würfeln unsauber oder erfinden Zahlen."
    dann: "Nicht moralisieren, sondern nutzen: Erfundene Reihen enthalten typischerweise zu wenige Wiederholungen. Am Ende der Stunde die Klassenliste auf lange Serien durchsehen – echte Reihen haben sie, erfundene selten."
exitTicket:
  - "Wie groß ist die Wahrscheinlichkeit, mit einem Würfel eine gerade Zahl zu werfen?"
  - "Bei 300 Würfen: Wie viele Sechsen erwartest du ungefähr? Muss es genau diese Zahl sein?"
  - "Jemand sagt: „Bei 600 Würfen kommen genau 100 Sechsen, weil die Wahrscheinlichkeit 1/6 ist.“ Was stimmt daran und was nicht?"
differenzierung:
  schneller: "Zwei Münzen werden geworfen. Wie wahrscheinlich ist zweimal Kopf? Und mindestens einmal Kopf? (1/4 und 3/4 – die vier gleichwahrscheinlichen Fälle KK, KZ, ZK, ZZ auflisten.) Danach dasselbe für drei Münzen."
  langsamer: "Nur mit der Münze arbeiten statt mit dem Würfel: 40 Würfe, erwartet werden 20 Kopf. Die beiden Spalten bleiben dieselben, die Zahlen sind übersichtlicher."
stolpersteine:
  - fehlvorstellung: "Ausgebliebene Ergebnisse werden „nachgeholt“ (Spielerfehlschluss)."
    reaktion: "Die eigenen Daten gegenüberstellen: absolute Abweichung wächst, relative Häufigkeit fällt. Beides gleichzeitig ist genau das, was das Gesetz der großen Zahlen sagt – und es sagt nichts über den nächsten Wurf."
  - fehlvorstellung: "Relative Häufigkeit und Wahrscheinlichkeit werden gleichgesetzt."
    reaktion: "Zwei Paare mit sehr verschiedenen Ergebnissen nebeneinanderstellen. Beide haben mit demselben Würfel gewürfelt; die Wahrscheinlichkeit war dieselbe, die Häufigkeit nicht."
  - fehlvorstellung: "Bei zwei Münzen gibt es drei gleichwahrscheinliche Fälle."
    reaktion: "Die Münzen unterscheidbar machen – eine mit einem Punkt markieren. Dann sind KZ und ZK sichtbar zwei verschiedene Ergebnisse."
hausaufgabe: "Aus der Aufgabenfolge die Aufgaben zum Erwartungswert. Zusätzlich: Wirf zu Hause 50-mal eine Münze und notiere nach je 10 Würfen die relative Häufigkeit für Kopf. Bringe die fünf Zahlen mit."
tags: ["stochastik", "wahrscheinlichkeit", "relative-haeufigkeit", "gesetz-der-grossen-zahlen", "klar", "doppelstunde"]
datum: 2026-08-28
entwurf: false
---

## Tafelbild

| Würfe | Sechsen | erwartet | absolute Abweichung | relative Häufigkeit |
|--:|--:|--:|--:|--:|
| 60 | 8 | 10 | 2 | 0,133 |
| 300 | 44 | 50 | 6 | 0,147 |
| 900 | 139 | 150 | 11 | 0,154 |
| 10 000 | 1 621 | 1 667 | 46 | 0,162 |

Die Zahlen entstehen in der Stunde selbst – die ersten drei Zeilen aus der Klasse, die letzte aus der Simulation. Entscheidend sind die beiden rechten Spalten:

> **Die vierte Spalte wird größer. Die fünfte nähert sich 1/6 ≈ 0,167.**
> Der Zufall gleicht nichts aus. Die Abweichung fällt nur immer weniger ins Gewicht.

## Warum 60 Würfe pro Paar

Weniger wäre schneller, aber 60 ist die kleinste Zahl, bei der der Erwartungswert für die Sechs eine glatte Zahl ist (10) und die Klasse in Summe auf eine ordentliche Gesamtzahl kommt: 15 Paare ergeben 900 Würfe. Die Gesamtsumme ist der eigentliche Datensatz – die einzelnen Paarergebnisse dienen dem Kontrast.

Der Zeitaufwand ist real: 60 Würfe mit Strichliste dauern zu zweit etwa acht Minuten. Wer die Zeit nicht hat, kann die Erhebung auf 30 Würfe halbieren und die fehlende Größenordnung mit dem Werkzeug ergänzen – aber ganz sollte sie nicht entfallen. Selbst erhobene Daten überzeugen anders als simulierte.

## Didaktischer Kommentar

**Warum der Spielerfehlschluss so schwer auszuräumen ist.** Er ist keine Erfindung der Lernenden, sondern eine Fehldeutung von etwas Richtigem. Das Gesetz der großen Zahlen sagt, dass sich die *relative* Häufigkeit stabilisiert. Daraus schließen viele, dass eine Art Ausgleichskraft am Werk sein müsse – dass also der Zufall ein Gedächtnis hat. Der Fehler steckt in der Verwechslung von relativ und absolut, und deshalb ist die zweispaltige Tabelle das Gegenmittel: Sie zeigt beide Größen gleichzeitig, und nur dann ist der Widerspruch sichtbar.

**Warum die Klasse eigene Daten braucht.** Eine Simulation liefert in Sekunden bessere Zahlen als 45 Minuten Würfeln. Sie liefert aber keine Überzeugung: „Das ist ja nur der Computer“ ist ein Einwand, der in dieser Altersstufe regelmäßig kommt und nicht unberechtigt ist. Die eigenen 900 Würfe sind das Fundament; die Simulation erweitert nur die Größenordnung.

**Warum die Begründung vom Stundenanfang aufgeschrieben wird.** Der Satz „die Sechs ist überfällig“ ist am Ende der Stunde schwer zu widerlegen, wenn niemand mehr weiß, wer ihn gesagt hat und wie er genau lautete. Wörtlich notiert, wird er zu einem Gegenstand, den die Klasse gemeinsam prüfen kann – und die Person, die ihn geäußert hat, muss sich nicht verteidigen, weil der Satz an der Tafel steht und nicht mehr ihr gehört.

**Warum die Münzaufgabe in die Differenzierung gehört.** „Zweimal Kopf, zweimal Zahl oder gemischt – also 1/3“ ist eine eigene, ebenso hartnäckige Fehlvorstellung und verdient eine eigene Erarbeitung. Sie hier anzuhängen, wäre für die schnelle Gruppe eine gute Frage und für die ganze Klasse eine Überforderung.

## Zum Weiterarbeiten

- [Werkzeug: Zufallsexperimente](/werkzeuge/zufallsexperimente.html) – Würfel, Münzen, Urne, Galtonbrett
- [Aufgabenfolge: Vom Schätzen zum Rechnen](/aufgaben/stochastik-vom-schaetzen-zum-rechnen)
- [Diagnostische Fragen: Grundvorstellungen zur Wahrscheinlichkeit](/quizzes/wahrscheinlichkeit-grundvorstellungen)
- [Fehlvorstellungen zur Stochastik](/fehlvorstellungen#thema-stochastik)
