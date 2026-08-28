---
titel: "Exponentielles Wachstum: Warum die Gerade nicht reicht"
thema: "Exponentialfunktionen"
klassenstufe: ["10"]
dauer: 90
stundenziel: "Die Lernenden unterscheiden lineares und exponentielles Wachstum an Tabelle, Graph und Situation, begründen den Unterschied über konstante Differenz gegenüber konstantem Faktor und stellen zu einer Situation die passende Funktionsgleichung auf."
kurz: "Der Unterschied liegt nicht in der Steilheit, sondern darin, was konstant bleibt: die Differenz oder der Faktor. Eine Doppelstunde, in der die Klasse den Unterschied an eigenen Tabellen findet."
voraussetzungen:
  - "Lineare Funktionen aufstellen und zeichnen"
  - "Potenzen mit natürlichen Exponenten berechnen"
  - "Prozentuale Zunahme mit dem Vermehrungsfaktor rechnen"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Beamer für den Funktionenplotter"
  - "Taschenrechner"
einstiegsfrage:
  frage: "Ein Guthaben von 1000 € wird jährlich mit 5 % verzinst. Wie viel ist nach 20 Jahren da?"
  antworten:
    - text: "etwa 2650 €"
      korrekt: true
      deutung: "Trägt. Nachfragen, ob mit 1,05²⁰ gerechnet oder geschätzt wurde – und ob die Person begründen kann, warum es mehr als das Doppelte ist."
    - text: "2000 €"
      korrekt: false
      deutung: "Linear gerechnet: 5 % von 1000 € sind 50 €, mal 20 Jahre ergibt 1000 € Zinsen. Die häufigste Antwort und der Kern der Stunde – der Grundwert wird als konstant angenommen."
    - text: "etwa 2200 €"
      korrekt: false
      deutung: "Zwischen linear und exponentiell geschätzt. Die Zinseszinswirkung wird geahnt, aber unterschätzt. Didaktisch wertvoll: Hier ist die Richtung richtig und nur die Größenordnung falsch."
    - text: "10 000 €"
      korrekt: false
      deutung: "Deutliche Überschätzung. Zeigt, dass „exponentiell“ als „explodiert sofort“ gespeichert ist – ebenfalls eine Fehlvorstellung, nur die entgegengesetzte."
  quiz: "exponentialfunktionen-typische-fehler"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 10
    titel: "Zwanzig Jahre, fünf Prozent"
    ablauf: "Die Einstiegsfrage steht an der Tafel, geschätzt wird ohne Taschenrechner. Alle antworten gleichzeitig. Die Verteilung wird notiert und nicht aufgelöst."
    lehrkraft: "Die Spannweite der Schätzungen selbst ist das Ergebnis: Wenn sie von 2000 bis 10 000 reicht, hat niemand ein Gefühl für exponentielles Wachstum. Das laut zu benennen, ist ein guter Einstieg."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 10
    dauer: 25
    titel: "Zwei Tabellen füllen"
    ablauf: "Partnerarbeit: Zwei Sparmodelle werden über sechs Jahre tabelliert. Modell A: jedes Jahr 50 € dazu. Modell B: jedes Jahr 5 % mehr. Startwert beide 1000 €. Danach dieselben Modelle über 20 Jahre – nur die Endwerte."
    lehrkraft: "Über sechs Jahre liegen beide Modelle noch dicht beieinander (1300 € gegenüber etwa 1340 €). Genau das ist der Punkt: Der Unterschied entsteht nicht sofort. Wer nach sechs Jahren aufhört, sieht ihn nicht."
  - schritt: "A"
    minute: 35
    dauer: 25
    titel: "Was bleibt jeweils gleich?"
    ablauf: "Die Tabellen kommen an die Tafel, ergänzt um zwei Spalten: die Differenz zum Vorjahr und der Quotient zum Vorjahr. Bei A ist die Differenz konstant, bei B der Quotient."
    lehrkraft: "Diese beiden Spalten sind die Stunde. Aus ihnen entsteht die Unterscheidung – nicht aus dem Aussehen der Graphen. „Exponentiell ist steiler“ ist keine Definition; über kurze Abschnitte kann eine lineare Funktion beliebig viel steiler sein."
  - schritt: "A"
    minute: 60
    dauer: 12
    titel: "Am Plotter beide zusammen"
    ablauf: "Beide Funktionen werden im selben Koordinatensystem gezeichnet. Der Ausschnitt wird schrittweise vergrößert: erst 0 bis 6, dann 0 bis 20, dann 0 bis 50."
    lehrkraft: "Im kleinen Ausschnitt sieht die Exponentialfunktion fast linear aus, im großen verschwindet die Gerade an der Achse. Beide Bilder zeigen dieselben Funktionen – das ist die Lehre für den Umgang mit Diagrammen überhaupt."
    werkzeug: { text: "Funktionenplotter", href: "/werkzeuge/funktionenplotter.html" }
  - schritt: "R"
    minute: 72
    dauer: 13
    titel: "Situationen zuordnen"
    ablauf: "Aus der Aufgabenfolge die Aufgaben, in denen zu einer Situation entschieden werden muss, ob sie linear oder exponentiell ist – und dann die Gleichung aufgestellt wird."
    lehrkraft: "Die Entscheidung geht der Rechnung voraus und wird ausdrücklich verlangt: „Was bleibt hier gleich – die Differenz oder der Faktor?“ Wer diese Frage beantwortet hat, stellt die Gleichung fast von selbst auf."
    werkzeug: { text: "Aufgabenfolge: Wachstum und Zerfall", href: "/aufgaben/exponentielles-wachstum-und-zerfall" }
  - schritt: "R"
    minute: 85
    dauer: 5
    titel: "Exit-Ticket"
    ablauf: "Drei Fragen: eine Zuordnung, eine Rechnung, eine Begründung."
    lehrkraft: "Frage 1 zeigt, ob die Unterscheidung als Kriterium verfügbar ist; Frage 3 zeigt, ob sie verstanden wurde."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % schätzen richtig auf etwa 2650 €."
    dann: "Die Tabellenphase kürzen und den Zerfall anschließen: Ein Wert fällt jährlich um 5 %. Ist er nach 20 Jahren halbiert? (Nein – es sind noch 35,8 % übrig. Wer symmetrisch zum Wachstum denkt, liegt hier zuverlässig daneben.)"
  - wenn: "Ein großer Teil antwortet 2000 €."
    dann: "Wie geplant. In der Tabellenphase darauf bestehen, dass die Zinsen jedes Jahr neu vom aktuellen Guthaben berechnet werden – wer den Grundwert festhält, bekommt Modell A und merkt es beim Vergleich."
  - wenn: "Die Klasse rechnet die Tabellen richtig, sieht aber keinen Unterschied."
    dann: "Zu wenig Zeitraum. Sofort auf 20 und 50 Jahre erweitern; nach sechs Jahren beträgt der Unterschied nur etwa 40 €, nach fünfzig Jahren mehr als das Doppelte."
  - wenn: "Der Vermehrungsfaktor 1,05 wird als 0,05 verwendet."
    dann: "Zurück zur Prozentrechnung: 5 % mehr heißt 105 % des Alten. Am Prozentstreifen lässt sich das in zwei Minuten klären, ohne die Stunde zu verlieren."
exitTicket:
  - "Linear oder exponentiell? (a) Ein Handytarif kostet 5 € plus 10 Cent je Minute. (b) Eine Bakterienkultur verdoppelt sich alle 20 Minuten. Begründe kurz."
  - "Ein Guthaben von 800 € wächst jährlich um 3 %. Wie viel ist nach 10 Jahren da?"
  - "Warum ist „exponentielles Wachstum ist steiler als lineares“ als Unterscheidungsmerkmal ungeeignet?"
differenzierung:
  schneller: "Nach wie vielen Jahren hat sich das Guthaben in Modell B verdoppelt (etwa 14,2), nach wie vielen in Modell A (genau 20)? Und nach wie vielen ist es in B vervierfacht? Das Ergebnis – etwa 28,4, also genau die doppelte Zeit – ist kein Zufall. Warum?"
  langsamer: "Nur die Tabelle über sechs Jahre, dafür beide Modelle vollständig und mit den beiden Zusatzspalten. Der Fernblick über 20 Jahre wird gemeinsam an der Tafel ergänzt."
stolpersteine:
  - fehlvorstellung: "Prozentuale Zunahme wird linear gerechnet (jedes Jahr 5 % vom Startwert)."
    reaktion: "Das zweite Jahr einzeln nachrechnen lassen: 5 % von 1050 € sind 52,50 €, nicht 50 €. Der Unterschied ist klein und genau deshalb überzeugend – er ist da, obwohl man ihn nicht erwartet hat."
  - fehlvorstellung: "„Exponentiell“ heißt „sehr schnell“."
    reaktion: "Eine Exponentialfunktion mit Faktor 1,01 neben eine Gerade mit großer Steigung legen. Über die ersten hundert Schritte gewinnt die Gerade deutlich – exponentiell ist keine Aussage über Tempo, sondern über die Art des Wachstums."
  - fehlvorstellung: "Der Vermehrungsfaktor wird mit dem Prozentsatz verwechselt (0,05 statt 1,05)."
    reaktion: "Immer die Probe für einen Schritt: 1000 · 1,05 = 1050, 1000 · 0,05 = 50. Nur das erste ist ein Guthaben."
hausaufgabe: "Aus der Aufgabenfolge die Aufgaben zu Wachstum und Zerfall. Zusätzlich: Suche eine Angabe aus den Nachrichten, in der etwas prozentual wächst oder fällt, und rechne aus, was daraus nach zehn Jahren würde."
tags: ["exponentialfunktionen", "wachstum", "zinseszins", "vermehrungsfaktor", "klar", "doppelstunde"]
datum: 2026-08-28
entwurf: false
---

## Die beiden Tabellen

| Jahr | A: +50 € jährlich | Differenz | B: +5 % jährlich | Quotient |
|--:|--:|--:|--:|--:|
| 0 | 1000,00 | – | 1000,00 | – |
| 1 | 1050,00 | +50 | 1050,00 | 1,05 |
| 2 | 1100,00 | +50 | 1102,50 | 1,05 |
| 3 | 1150,00 | +50 | 1157,63 | 1,05 |
| 4 | 1200,00 | +50 | 1215,51 | 1,05 |
| 5 | 1250,00 | +50 | 1276,28 | 1,05 |
| 6 | 1300,00 | +50 | 1340,10 | 1,05 |
| 10 | 1500,00 | +50 | 1628,89 | 1,05 |
| 20 | 2000,00 | +50 | 2653,30 | 1,05 |

Die beiden Spalten „Differenz“ und „Quotient“ sind der Ertrag der Stunde:

> **Linear heißt: Die Differenz bleibt gleich. Exponentiell heißt: Der Quotient bleibt gleich.**

Nach sechs Jahren beträgt der Unterschied 40 €. Nach zwanzig Jahren sind es 653 €. Das ist der Grund, warum exponentielles Wachstum in kurzen Zeiträumen unterschätzt wird – und in langen überschätzt.

## Die Funktionsgleichungen

Modell A: f(t) = 1000 + 50 · t
Modell B: g(t) = 1000 · 1,05<sup>t</sup>

Der Vergleich der beiden Gleichungen ist aufschlussreicher als jede Merkregel: In A steht t als Faktor, in B als Exponent. Das ist der ganze Unterschied – und er erklärt sowohl die Tabellen als auch die Graphen.

## Didaktischer Kommentar

**Warum die Schätzfrage am Anfang steht.** Die Zinseszinsrechnung ist ein Verfahren, das die meisten in Klasse 10 ausführen können. Was fehlt, ist die Größenvorstellung – und die zeigt sich nur, wenn geschätzt wird, bevor gerechnet werden darf. Eine Klasse, deren Schätzungen von 2000 € bis 10 000 € reichen, hat kein Rechenproblem, sondern ein Vorstellungsproblem. Das lässt sich mit Rechenübungen nicht beheben.

**Warum die Tabelle über sechs Jahre nicht reicht – und trotzdem gebraucht wird.** Über sechs Jahre unterscheiden sich die Modelle um 40 €; das ist wenig genug, um die Fehlvorstellung „ist doch fast dasselbe“ zu stützen. Genau deshalb gehört die kurze Tabelle in die Stunde: Sie zeigt, dass die Fehlvorstellung nicht dumm ist, sondern auf einer zutreffenden Beobachtung beruht – nur eben auf einer über einen zu kurzen Zeitraum.

**Warum die Steilheit kein Kriterium ist.** „Exponentiell steigt schneller“ ist die verbreitetste Kurzfassung und über jeden endlichen Ausschnitt falsch: 0,001 · 1,5ᵗ liegt über zwanzig Schritte weit unter 100t. Die Unterscheidung liegt nicht im Tempo, sondern in der Struktur – konstante Differenz gegenüber konstantem Faktor. Diese Fassung ist überprüfbar, die andere ist ein Gefühl.

**Warum der Zoom am Plotter dazugehört.** Dass dieselbe Exponentialfunktion in einem Ausschnitt fast gerade und im nächsten fast senkrecht aussieht, ist keine Nebensache. Es ist die wichtigste Warnung im Umgang mit Diagrammen überhaupt, und sie lässt sich hier in zwei Minuten und ohne Zusatzstoff vermitteln.

## Zum Weiterarbeiten

- [Aufgabenfolge: Exponentielles Wachstum und Zerfall](/aufgaben/exponentielles-wachstum-und-zerfall)
- [Diagnostische Fragen zu Exponentialfunktionen](/quizzes/exponentialfunktionen-typische-fehler)
- [Werkzeug: Prozentstreifen](/werkzeuge/prozentstreifen.html) – für den Vermehrungsfaktor
- [Stundenverlauf: Was ist eigentlich das Ganze?](/stunden/prozentrechnung-was-ist-das-ganze) – die Grundlage drei Jahre früher
