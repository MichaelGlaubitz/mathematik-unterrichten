---
titel: "Gleichungssysteme: Wenn nichts oder alles herauskommt"
thema: "Lineare Gleichungssysteme"
klassenstufe: ["9"]
dauer: 90
stundenziel: "Die Lernenden deuten die drei Lösungsfälle eines linearen Gleichungssystems geometrisch als sich schneidende, parallele und identische Geraden und erkennen sie am rechnerischen Ergebnis."
kurz: "„0 = 3“ ist kein Rechenfehler, sondern eine Antwort. Diese Doppelstunde verbindet das rechnerische Ergebnis mit dem Bild – und macht aus einem verwirrenden Sonderfall den Normalfall."
voraussetzungen:
  - "Lineare Funktionen zeichnen und aus einer Gleichung ablesen"
  - "Ein Gleichungssystem mit dem Einsetzungs- oder Additionsverfahren lösen"
  - "Terme zusammenfassen und Gleichungen umformen"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Beamer für den Funktionenplotter"
  - "Karopapier mit Koordinatensystem"
einstiegsfrage:
  frage: "Beim Lösen eines Gleichungssystems kommt am Ende 0 = 3 heraus. Was bedeutet das?"
  antworten:
    - text: "Das System hat keine Lösung."
      korrekt: true
      deutung: "Trägt. Nachfragen, was das geometrisch heißt – wer „die Geraden sind parallel“ ergänzen kann, hat die Verbindung, um die es in der Stunde geht."
    - text: "Ich habe mich verrechnet."
      korrekt: false
      deutung: "Die häufigste Antwort. Ein Ergebnis ohne x wird als Rechenfehler gedeutet, weil bisher jede Aufgabe eine Lösung hatte. Diese Erwartung ist der Gegenstand der Stunde."
    - text: "Die Lösung ist x = 0."
      korrekt: false
      deutung: "Die Zeile wird als Gleichung für x gelesen und irgendwie beantwortet. Zeigt, dass das Verfahren ausgeführt, aber nicht gedeutet wird."
    - text: "Das System hat unendlich viele Lösungen."
      korrekt: false
      deutung: "Die beiden Sonderfälle werden verwechselt. Sinnvoller Fehler – er zeigt, dass der Unterschied zwischen 0 = 3 und 0 = 0 noch nicht steht."
  quiz: "lineare-gleichungssysteme-loesungsfaelle"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 10
    titel: "Null gleich drei"
    ablauf: "Die Einstiegsfrage steht an der Tafel, alle antworten gleichzeitig. Die Verteilung wird notiert. Zweite Frage ohne Abstimmung: Und wenn 0 = 0 herauskommt?"
    lehrkraft: "Nicht auflösen. Die zweite Frage erzeugt bei fast allen Unsicherheit – auch bei denen, die die erste richtig hatten. Genau diese Unsicherheit trägt die Erarbeitung."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 10
    dauer: 25
    titel: "Drei Systeme, drei Ergebnisse"
    ablauf: "Partnerarbeit: Drei Gleichungssysteme werden gerechnet und anschließend gezeichnet. Reihenfolge zwingend – erst rechnen, dann zeichnen, dann vergleichen."
    lehrkraft: "Die drei Systeme sind bewusst ähnlich gebaut (siehe Tafelbild). Beim Herumgehen die Reaktionen notieren, wenn das zweite System auf 0 = 3 führt – wer streicht und neu anfängt, wer weiterdenkt."
  - schritt: "A"
    minute: 35
    dauer: 25
    titel: "Rechnung und Bild nebeneinander"
    ablauf: "Zu jedem der drei Systeme kommen Rechnung und Zeichnung nebeneinander an die Tafel. Die Klasse formuliert für jeden Fall, was das rechnerische Ergebnis und was das Bild sagt."
    lehrkraft: "Die Reihenfolge ist der eindeutige Fall zuerst, dann der parallele, dann der identische. Beim dritten die Frage stellen: Wie viele Lösungen sind es? Die Antwort „alle Punkte der Geraden“ ist präziser als „unendlich viele“ und sollte notiert werden."
  - schritt: "A"
    minute: 60
    dauer: 12
    titel: "Am Plotter überprüfen"
    ablauf: "Die drei Systeme werden am Funktionenplotter gezeichnet. Danach wird eine Gerade schrittweise verschoben, bis sie parallel und bis sie identisch liegt – die Klasse sagt jeweils vorher, was die Rechnung liefern wird."
    lehrkraft: "Die Vorhersage ist wichtiger als die Anzeige. Wer vorhersagt „jetzt kommt 0 = 0 heraus“, hat den Zusammenhang; wer nur zusieht, hat drei Bilder gesehen."
    werkzeug: { text: "Funktionenplotter", href: "/werkzeuge/funktionenplotter.html" }
  - schritt: "R"
    minute: 72
    dauer: 13
    titel: "Fall erkennen, ohne zu rechnen"
    ablauf: "Sechs Systeme aus der Aufgabenfolge. Zu jedem wird nur der Fall bestimmt – erst danach werden zwei davon vollständig gerechnet."
    lehrkraft: "Die Beschränkung ist Absicht. Wer die Koeffizienten vergleichen kann, spart in der Klassenarbeit Zeit und erkennt Sonderfälle, bevor er sie berechnet."
    werkzeug: { text: "Aufgabenfolge: Drei Methoden", href: "/aufgaben/lineare-gleichungssysteme-drei-methoden" }
  - schritt: "R"
    minute: 85
    dauer: 5
    titel: "Exit-Ticket"
    ablauf: "Drei Fragen: ein Fall aus dem Ergebnis, ein Fall aus den Gleichungen, eine Begründung."
    lehrkraft: "Frage 3 zeigt, ob die Verbindung von Rechnung und Bild trägt oder nur zwei Merksätze gelernt wurden."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % deuten 0 = 3 richtig."
    dann: "Die Erarbeitung kürzen und die Frage nach der Anzahl der Unbekannten anschließen: Was passiert bei drei Gleichungen mit zwei Unbekannten? Und bei zwei Gleichungen mit drei Unbekannten?"
  - wenn: "Viele antworten „ich habe mich verrechnet“."
    dann: "Wie geplant. In der Erarbeitung ausdrücklich ansagen, dass mindestens ein System kein eindeutiges Ergebnis hat – sonst wird gestrichen und neu gerechnet, bis die Zeit um ist."
  - wenn: "Die Klasse kann die Systeme nicht sicher rechnen."
    dann: "Die Stunde umwidmen: an einem System das Additionsverfahren sichern und die Sonderfälle nur am Bild vorführen. Ohne sicheres Verfahren ist die Deutung des Ergebnisses nicht zugänglich."
  - wenn: "Der Fall 0 = 0 wird als „x = 0“ gedeutet."
    dann: "Nicht korrigieren, sondern einsetzen lassen: Ist (0 | 4) eine Lösung? Und (2 | 0)? Und (1 | 2)? Wenn alle drei stimmen, ist die Deutung „x = 0“ widerlegt – von der Klasse, nicht von der Lehrkraft."
exitTicket:
  - "Beim Lösen eines Systems kommt 0 = 0 heraus. Wie viele Lösungen hat es, und wie liegen die Geraden?"
  - "Hat das System y = 2x + 1 und y = 2x − 4 eine Lösung? Begründe ohne zu rechnen."
  - "Warum kann ein lineares Gleichungssystem mit zwei Gleichungen niemals genau zwei Lösungen haben?"
differenzierung:
  schneller: "Bestimme k so, dass das System 2x + y = 4 und 4x + ky = 8 unendlich viele Lösungen hat (k = 2) – und so, dass es keine hat. (Kein k: für k = 2 sind die Gleichungen identisch, für jedes andere k schneiden sich die Geraden. Erst eine Änderung der rechten Seite erzeugt den parallelen Fall.)"
  langsamer: "Nur die beiden ersten Fälle, dafür jeder mit Rechnung und Zeichnung. Der Fall mit unendlich vielen Lösungen folgt in der nächsten Stunde."
stolpersteine:
  - fehlvorstellung: "Ein Ergebnis ohne Variable ist ein Rechenfehler."
    reaktion: "Die Rechnung Schritt für Schritt gemeinsam nachvollziehen und feststellen, dass kein Fehler darin ist. Das Ergebnis ist eine Aussage über das System, keine über die Rechnung."
  - fehlvorstellung: "0 = 0 und 0 = 3 werden verwechselt."
    reaktion: "Beide als Aussagen lesen: „null ist gleich null“ ist wahr, „null ist gleich drei“ ist falsch. Was immer wahr ist, schließt nichts aus; was falsch ist, schließt alles aus."
  - fehlvorstellung: "„Unendlich viele Lösungen“ heißt „jedes Zahlenpaar ist eine Lösung“."
    reaktion: "Ein Paar prüfen lassen, das nicht auf der Geraden liegt. Die Lösungsmenge ist eine Gerade, nicht die ganze Ebene."
hausaufgabe: "Aus der Aufgabenfolge die Aufgaben zu den Lösungsfällen. Zusätzlich: Schreibe selbst je ein System auf, das keine, genau eine und unendlich viele Lösungen hat – und zeichne alle drei."
tags: ["lineare-gleichungssysteme", "loesungsfaelle", "funktionenplotter", "klar", "doppelstunde"]
datum: 2026-08-28
entwurf: false
---

## Die drei Systeme der Erarbeitungsphase

| | System | Rechnung führt auf | Bild | Lösungsmenge |
|:--|:--|:--|:--|:--|
| **A** | x + y = 5<br>x − y = 1 | x = 3, y = 2 | zwei Geraden, die sich schneiden | genau ein Punkt: (3 \| 2) |
| **B** | 2x + y = 4<br>2x + y = 7 | 0 = 3 | zwei parallele Geraden | leer |
| **C** | 2x + y = 4<br>4x + 2y = 8 | 0 = 0 | eine einzige Gerade, zweimal geschrieben | alle Punkte der Geraden 2x + y = 4 |

Die drei Systeme sind absichtlich ähnlich: B und C unterscheiden sich nur darin, ob die zweite Gleichung ein Vielfaches der ersten ist oder nur auf der linken Seite gleich aussieht. Genau daran lässt sich der Fall erkennen, bevor gerechnet wird.

## Tafelbild

Drei Spalten nebeneinander, in jeder oben die Rechnung, darunter die Zeichnung, unten der Satz:

> **A** Die Geraden schneiden sich – ein Schnittpunkt, eine Lösung.
> **B** Die Geraden sind parallel – kein Schnittpunkt, keine Lösung. Die Rechnung sagt es mit einer falschen Aussage: 0 = 3.
> **C** Es ist dieselbe Gerade – jeder ihrer Punkte ist eine Lösung. Die Rechnung sagt es mit einer immer wahren Aussage: 0 = 0.

## Didaktischer Kommentar

**Warum die Sonderfälle nicht am Ende der Einheit stehen sollten.** In vielen Lehrgängen kommen sie als Anhang nach den drei Lösungsverfahren – und wirken dann wie Ausnahmen, die man sich zusätzlich merken muss. Tatsächlich sind sie der Normalfall: Zwei beliebige Geraden schneiden sich, sind parallel oder fallen zusammen; nichts anderes ist möglich. Wer die drei Fälle von Anfang an als vollständige Liste kennt, hat ein Bild, in das jedes Ergebnis passt.

**Warum erst gerechnet und dann gezeichnet wird.** Umgekehrt wäre bequemer – man sähe sofort, was herauskommt. Aber dann ist die Rechnung nur noch Bestätigung, und die Irritation über „0 = 3“ tritt nie ein. Die Irritation ist der Lerngegenstand: Sie ist der Moment, in dem klar wird, dass eine Rechnung auch etwas anderes als eine Zahl liefern kann.

**Warum „alle Punkte der Geraden“ besser ist als „unendlich viele“.** Beides ist richtig, aber nur das erste ist überprüfbar. „Unendlich viele Lösungen“ lädt zu der Vorstellung ein, jedes beliebige Zahlenpaar löse das System – ein Fehler, der in der Klassenarbeit regelmäßig auftaucht. Die Formulierung mit der Geraden schließt ihn aus, weil sie sagt, welche Paare gemeint sind.

**Warum die dritte Exit-Frage schwierig ist.** „Warum kann es niemals genau zwei Lösungen geben?“ verlangt, die geometrische Deutung zu benutzen: Zwei verschiedene Geraden schneiden sich höchstens einmal; haben sie zwei Punkte gemeinsam, sind sie identisch und teilen alle. Das ist eine Begründung, kein Merksatz – und wer sie formulieren kann, hat den Zusammenhang zwischen Algebra und Geometrie hergestellt, um den es in dieser Stunde geht.

## Zum Weiterarbeiten

- [Aufgabenfolge: Drei Methoden](/aufgaben/lineare-gleichungssysteme-drei-methoden)
- [Diagnostische Fragen: Lösungsfälle](/quizzes/lineare-gleichungssysteme-loesungsfaelle)
- [Werkzeug: Funktionenplotter](/werkzeuge/funktionenplotter.html)
- [Übungsgenerator Gleichungssysteme](/uebung/lineare-gleichungssysteme)
