---
titel: "Prozentrechnung: Was ist eigentlich das Ganze?"
thema: "Prozentrechnung"
klassenstufe: ["7"]
dauer: 90
stundenziel: "Die Lernenden bestimmen in einer Sachsituation zuerst den Grundwert, tragen die Angaben am Prozentstreifen ein und lösen daraus alle drei Grundaufgaben der Prozentrechnung."
kurz: "Nicht der Dreisatz ist die Hürde, sondern die Frage, welche Zahl 100 % ist. Diese Doppelstunde stellt sie an den Anfang – und beantwortet sie am Streifen, bevor gerechnet wird."
voraussetzungen:
  - "Brüche und Dezimalzahlen ineinander umwandeln"
  - "Anteile am Streifen oder Kreis darstellen"
  - "Dreisatz bei proportionalen Zuordnungen"
material:
  - "Mini-Whiteboards oder Abstimmkarten"
  - "Beamer für den Prozentstreifen"
  - "Ein echter Werbeprospekt oder ein Screenshot mit Rabattangaben"
einstiegsfrage:
  frage: "Ein Pullover kostet 80 €. Im Schlussverkauf wird er um 25 % reduziert. Was kostet er jetzt?"
  antworten:
    - text: "60 €"
      korrekt: true
      deutung: "Trägt. Nachfragen, ob der Weg über 20 € Rabatt oder direkt über den Faktor 0,75 lief – beides ist richtig, aber didaktisch nicht dasselbe."
    - text: "55 €"
      korrekt: false
      deutung: "Prozent wird als absolute Zahl gelesen: 25 % werden zu 25 €. Das ist die Kernfehlvorstellung der Stunde. Sie tritt besonders häufig auf, wenn der Grundwert zufällig in derselben Größenordnung liegt wie der Prozentsatz."
    - text: "20 €"
      korrekt: false
      deutung: "Richtig gerechnet, aber die falsche Frage beantwortet: 20 € ist der Rabatt, nicht der neue Preis. Nicht als Rechenfehler behandeln – hier fehlt die Rückbindung an die Sachsituation."
    - text: "75 €"
      korrekt: false
      deutung: "Der Faktor 0,75 wird gebildet und dann als Preis gelesen. Zeigt, dass das Verfahren bekannt ist, die Bedeutung des Ergebnisses aber nicht."
  quiz: "prozentuale-veraenderung-vermehrungsfaktor"
phasen:
  - schritt: "K"
    minute: 0
    dauer: 10
    titel: "Der Pullover"
    ablauf: "Die Einstiegsfrage steht an der Tafel. Eine Minute Denkzeit, dann halten alle gleichzeitig ihr Whiteboard hoch. Die Verteilung wird notiert, aber nicht aufgelöst."
    lehrkraft: "Bei der Antwort 55 € nicht korrigieren, sondern eine zweite Frage stellen: „Und wenn der Pullover 800 € kosten würde – wie viel Rabatt wären 25 % dann?“ Die Antwort auf diese Frage entscheidet, ob die Fehlvorstellung wirklich vorliegt."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
  - schritt: "L"
    minute: 10
    dauer: 25
    titel: "Drei Prospekte, eine Frage"
    ablauf: "Partnerarbeit an drei echten Werbeangaben („30 % auf alles“, „jetzt nur 19,99 statt 24,99“, „20 % mehr Inhalt“). Zu jedem Angebot ist nur eine Frage zu beantworten: Welche Zahl ist hier 100 %? Erst danach wird gerechnet."
    lehrkraft: "Beim Herumgehen die Formulierungen sammeln, mit denen die Paare den Grundwert benennen. Wer sofort rechnet, wird zurückgeschickt: Erst der Grundwert, dann die Rechnung. Beim dritten Angebot („20 % mehr Inhalt“) beobachten, wer merkt, dass hier der alte Inhalt das Ganze ist – nicht der neue."
  - schritt: "A"
    minute: 35
    dauer: 25
    titel: "Am Streifen zusammenführen"
    ablauf: "Die drei Angebote werden nacheinander am Prozentstreifen eingetragen: unten der Prozentsatz, oben die Größe. Für jedes Angebot benennt die Klasse zuerst den Grundwert, dann wird die Marke gezogen."
    lehrkraft: "Der Streifen macht die Kernaussage sichtbar: Die untere Skala endet immer bei 100 %, und 100 % steht immer beim Ganzen. Beim dritten Angebot die Skala auf 200 % umstellen – dort liegt der neue Inhalt rechts von 100 %, und der Grundwert bleibt trotzdem links."
    werkzeug: { text: "Prozentstreifen", href: "/werkzeuge/prozentstreifen.html" }
  - schritt: "A"
    minute: 60
    dauer: 10
    titel: "Die drei Grundaufgaben benennen"
    ablauf: "Aus den drei bearbeiteten Angeboten wird sichtbar, dass es nur drei Fragen gibt: Prozentwert gesucht, Prozentsatz gesucht, Grundwert gesucht. Der Hefteintrag ordnet die drei Angebote diesen drei Typen zu."
    lehrkraft: "Die Reihenfolge ist wichtig: erst die drei bearbeiteten Fälle, dann die Benennung. Wer mit den drei Grundaufgaben beginnt, bekommt drei Formeln, die auswendig gelernt und verwechselt werden."
  - schritt: "R"
    minute: 70
    dauer: 15
    titel: "Üben mit wechselndem Grundwert"
    ablauf: "Aus der Aufgabenfolge die Aufgaben, in denen sich der Grundwert von Aufgabe zu Aufgabe ändert, der Prozentsatz aber gleich bleibt – und umgekehrt."
    lehrkraft: "Nach fünf Minuten unterbrechen und fragen: Welche Zahl war in dieser Aufgabe das Ganze? Die Frage wird bei jeder Aufgabe gestellt, bis sie von selbst kommt."
    werkzeug: { text: "Aufgabenfolge Prozentrechnung", href: "/aufgaben/prozentrechnung-der-dreischritt" }
  - schritt: "R"
    minute: 85
    dauer: 5
    titel: "Exit-Ticket"
    ablauf: "Drei Fragen, jede zu einem anderen Grundaufgabentyp. Ohne Namen, einsammeln an der Tür."
    lehrkraft: "Beim Durchsehen nicht nur richtig/falsch zählen, sondern schauen, welcher der drei Typen hakt. Die Rückwärtsaufgabe (Frage 3) ist erfahrungsgemäß die schwierigste."
    werkzeug: { text: "Exit-Ticket drucken", href: "/werkzeuge/exit-ticket.html" }
weichen:
  - wenn: "Über 80 % antworten „60 €“ und begründen es sicher."
    dann: "Die Prospektphase auf zehn Minuten kürzen und stattdessen mit der Kernfrage der Folgestunde einsteigen: Ein Preis steigt um 20 % und fällt danach um 20 % – ist er wieder gleich? (Nein: aus 100 € werden 120 €, dann 96 €.)"
  - wenn: "Ein großer Teil antwortet „55 €“."
    dann: "Wie geplant weiterarbeiten, aber in der Prospektphase nur mit dem ersten Angebot beginnen und dort die 800-€-Variante ergänzen. Der Sprung in der Größenordnung ist das wirksamste Gegenmittel."
  - wenn: "Viele antworten „20 €“."
    dann: "Kein Verständnisproblem der Prozentrechnung, sondern der Aufgabenstellung. Die Prospektphase kann normal laufen; im Exit-Ticket dafür Frage 1 durch eine mehrschrittige Frage ersetzen."
  - wenn: "Die Klasse kommt beim dritten Angebot („20 % mehr Inhalt“) nicht weiter."
    dann: "Das ist erwartbar und wird in der Abgleichphase am Streifen aufgelöst. Nicht vorher erklären – der vermehrte Grundwert lebt davon, dass man das Problem erst gesehen hat."
exitTicket:
  - "In einer Klasse sind 25 Kinder, 15 davon fahren mit dem Rad. Wie viel Prozent sind das?"
  - "Ein Handy kostet 240 €. Der Preis sinkt um 15 %. Was kostet es jetzt?"
  - "15 % einer Strecke sind 45 km. Wie lang ist die ganze Strecke?"
differenzierung:
  schneller: "Die Umkehrfrage zum dritten Angebot: Eine Packung enthält jetzt 600 g, das sind 20 % mehr als vorher. Wie viel waren vorher drin? (500 g – nicht 480 g. Wer 480 rechnet, hat den neuen Inhalt als Grundwert genommen.)"
  langsamer: "Nur mit dem ersten Angebot arbeiten und dort den Streifen ausgedruckt vorlegen, mit bereits eingetragener 100-%-Marke. Die Frage nach dem Grundwert bleibt erhalten, die Darstellung ist vorgegeben."
stolpersteine:
  - fehlvorstellung: "Prozentangaben werden als absolute Zahlen behandelt (25 % werden zu 25 €)."
    reaktion: "Dieselbe Aufgabe mit 800 € statt 80 € stellen. Wer 775 € antwortet, hält an der Vorstellung fest; wer stutzt, hat den Widerspruch bemerkt."
  - fehlvorstellung: "Der Grundwert wird nach Position in der Aufgabe bestimmt („die erste Zahl ist immer 100 %“)."
    reaktion: "Eine Aufgabe stellen, in der der Grundwert am Ende steht: „45 km sind 15 % der Strecke.“ Der Streifen erzwingt hier die richtige Zuordnung."
  - fehlvorstellung: "+20 % und −20 % heben sich auf."
    reaktion: "Am Streifen nachvollziehen: 100 → 120 → 96. Der zweite Schritt hat einen anderen Grundwert als der erste. Das ist der stärkste Grund, konsequent mit Faktoren zu arbeiten."
hausaufgabe: "Zwei echte Werbeangaben mitbringen – aus einem Prospekt, einer App oder einem Schaufenster. Zu jedem notieren: Welche Zahl ist das Ganze? Und welche der drei Grundaufgaben liegt vor?"
tags: ["prozentrechnung", "grundwert", "prozentstreifen", "klar", "doppelstunde", "sachkontext"]
datum: 2026-08-28
entwurf: false
---

## Tafelbild

| links | Mitte | rechts |
|:--|:--|:--|
| Prozentstreifen mit den drei Angeboten untereinander, jeweils mit markierter 100-%-Stelle. | **Zuerst fragen: 100 % – wovon?** | Die drei Grundaufgaben, jede mit dem passenden Angebot als Beispiel daneben. |

Der Satz in der Mitte ist der ganze Hefteintrag. Alles andere sind Beispiele dafür.

## Warum die Angebote echt sein sollten

Ein erfundener Prospekt ist didaktisch fast so gut wie ein echter, aber nicht ganz: In echten Angaben steht der Grundwert oft gar nicht da („20 % mehr Inhalt“ – mehr als was?), und genau diese Lücke ist der Lerngegenstand. Wer ein echtes Angebot mitbringt, bringt zugleich die Erfahrung mit, dass diese Lücke Absicht ist.

Falls kein Prospekt zur Hand ist, funktionieren diese drei Angaben genauso:

1. **„30 % auf alles“** – Grundwert ist der alte Preis, der Prozentwert ist der Rabatt. Der Standardfall.
2. **„jetzt nur 19,99 € statt 24,99 €“** – hier ist der Prozentsatz gesucht. Die Rechnung 5,00 : 24,99 ≈ 0,20 zeigt, dass „20 % Rabatt“ auf dem Schild stehen dürfte.
3. **„20 % mehr Inhalt“** – der schwierigste Fall: Grundwert ist der *alte* Inhalt, der auf der Packung nirgends steht.

## Didaktischer Kommentar

**Warum die Frage nach dem Grundwert vor jeder Rechnung steht.** In den meisten Lehrgängen erscheint der Grundwert als eine von drei Größen in einer Formel. Damit ist er eine Variable unter anderen – und wird entsprechend behandelt: Man setzt ein, was gerade dasteht. Die Fehlvorstellung „25 % sind 25 €“ ist deshalb kein Rechenfehler, sondern die Folge davon, dass die Frage „wovon?“ nie gestellt wurde. Sie an den Anfang zu setzen, kostet in jeder einzelnen Aufgabe zehn Sekunden und spart die halbe Klassenarbeit.

**Warum der Streifen und nicht die Formel.** Am Prozentstreifen ist der Grundwert keine Variable, sondern ein Ort: das rechte Ende der unteren Skala. Diese Festlegung lässt sich nicht umgehen – man muss sich entscheiden, bevor man etwas einträgt. Genau das leistet eine Formel nicht. Der Dreisatz kommt danach und beschreibt, was man vorher gesehen hat.

**Warum der vermehrte Grundwert schon hier vorkommt.** Üblicherweise wird er in eine spätere Einheit verschoben. Das erzeugt aber die Vorstellung, der Grundwert sei immer die größere der beiden Zahlen – und genau diese Vorstellung bricht später schwer wieder auf. Das dritte Angebot ist deshalb bewusst dabei, auch wenn es in dieser Stunde nur angerissen wird.

**Was die Antwort „20 €“ verrät.** Sie ist rechnerisch richtig und trotzdem falsch, weil die Frage nach dem *Preis* gestellt war. Solche Antworten häufen sich bei Lernenden, die Textaufgaben als Rechenaufforderung lesen: Man sucht die Zahlen, verknüpft sie und schreibt das Ergebnis hin. Die Gegenmaßnahme ist nicht mehr Prozentrechnung, sondern die Gewohnheit, das Ergebnis am Ende noch einmal als Satz zu formulieren.

## Zum Weiterarbeiten

- [Werkzeug: Prozentstreifen](/werkzeuge/prozentstreifen.html) – mit Aufgabengenerator zu allen drei Grundaufgaben
- [Aufgabenfolge: Prozentrechnung – der Dreischritt](/aufgaben/prozentrechnung-der-dreischritt)
- [Diagnostische Fragen: Vermehrungsfaktor](/quizzes/prozentuale-veraenderung-vermehrungsfaktor)
- [Fehlvorstellungen zur Prozentrechnung](/fehlvorstellungen#thema-prozentrechnung)
