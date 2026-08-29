---
titel: "Kreis – Umfang, Flächeninhalt und der Sektor"
thema: "Kreisgeometrie"
klassenstufe: ["9", "10"]
schwierigkeit: mittel
didaktischerHinweis: "Die Kreisformeln werden verwechselt, weil sie als Zeichenketten gelernt werden: In U = πd steht d, in A = πr² steht r. Diese Folge trennt beide Größen konsequent – Folge A variiert nur den Radius, Folge B nur den Durchmesser, Folge C zeigt das quadratische Wachstum der Fläche. Folge E kehrt die Formeln um: gegeben ist der Umfang oder die Fläche, gesucht der Radius."
ziel: 'Die Schüler unterscheiden Radius und Durchmesser sicher – und wählen die Formel danach, nicht nach dem Aussehen.'
variation: 'Folge A variiert nur den Radius, Folge B nur den Durchmesser, Folge C nur die Fläche. Erst danach kommt der Sektor.'
stolperstelle: '$U = \pi d$ und $A = \pi r^2$ werden als Zeichenketten gelernt; der Durchmesser wird in die Flächenformel gesetzt.'
regie:
  - 'Was ist gegeben – Radius oder Durchmesser?'
  - 'Bevor du rechnest: Wird die Fläche doppelt so groß, wenn der Radius doppelt so groß ist?'
  - 'Wer erklärt den Unterschied zwischen Verdoppeln von $r$ und Verdoppeln von $A$?'
tags: ["kreis", "umfang", "flaecheninhalt", "kreissektor", "pi", "variation-theory"]
datum: 2026-08-28
entwurf: false
---

## Vorbemerkung für die Schüler

Am Kreis gibt es zwei Längen, die man ständig verwechseln kann:

- der **Radius** $r$ – vom Mittelpunkt zum Rand,
- der **Durchmesser** $d$ – einmal quer durch, also $d = 2r$.

Und zwei Formeln:

- Umfang: $U = 2πr$ – gleichbedeutend mit $U = πd$
- Fläche: $A = πr^{2}$

Der wichtigste Rat: **Zeichnen und beschrifte zuerst.** Der erste Schritt jeder Kreisaufgabe ist keine Rechnung, sondern die Entscheidung, ob die gegebene Länge $r$ oder $d$ ist. Rechne im Folgenden mit $π \approx  3{,}14$ und runde auf eine Nachkommastelle.

## Folge A: Umfang bei gegebenem Radius

| Nr. | Radius | Umfang |
|----:|:-------|:-------|
| 1 | $r = 1 cm$ | $U \approx  6{,}3 cm$ |
| 2 | $r = 2 cm$ | $U \approx  12{,}6 cm$ |
| 3 | $r = 3 cm$ | $U \approx  18{,}8 cm$ |
| 4 | $r = 5 cm$ | $U \approx  31{,}4 cm$ |
| 5 | $r = 10 cm$ | $U \approx  62{,}8 cm$ |
| 6 | $r = 0{,}5 cm$ | $U \approx  3{,}1 cm$ |

*Frage nach Nr. 6:* Der Radius verdoppelt sich von Nr. 1 zu Nr. 2 und von Nr. 4 zu Nr. 5. Was macht der Umfang jeweils?

## Folge B: Umfang bei gegebenem Durchmesser

Achtung: Jetzt ist nicht der Radius gegeben.

| Nr. | Durchmesser | Umfang |
|----:|:------------|:-------|
| 7 | $d = 2 cm$ | $U \approx  6{,}3 cm$ |
| 8 | $d = 4 cm$ | $U \approx  12{,}6 cm$ |
| 9 | $d = 6 cm$ | $U \approx  18{,}8 cm$ |
| 10 | $d = 10 cm$ | $U \approx  31{,}4 cm$ |
| 11 | $d = 20 cm$ | $U \approx  62{,}8 cm$ |
| 12 | $d = 1 cm$ | $U \approx  3{,}1 cm$ |

*Frage nach Nr. 12:* Vergleiche Folge A und Folge B Zeile für Zeile. Warum stehen rechts dieselben Ergebnisse?

## Folge C: Flächeninhalt

| Nr. | Radius | Fläche |
|----:|:-------|:-------|
| 13 | $r = 1 cm$ | $A \approx  3{,}1 cm^{2}$ |
| 14 | $r = 2 cm$ | $A \approx  12{,}6 cm^{2}$ |
| 15 | $r = 3 cm$ | $A \approx  28{,}3 cm^{2}$ |
| 16 | $r = 4 cm$ | $A \approx  50{,}3 cm^{2}$ |
| 17 | $r = 6 cm$ | $A \approx  113{,}1 cm^{2}$ |
| 18 | $r = 10 cm$ | $A \approx  314{,}2 cm^{2}$ |

*Frage nach Nr. 18:* Von Nr. 13 zu Nr. 14 verdoppelt sich der Radius. Um welchen Faktor wächst die Fläche? Prüfe die Vermutung an Nr. 15 und Nr. 17.

## Folge D: Kreissektor

Der Sektor ist ein Ausschnitt des Kreises. Sein Anteil am ganzen Kreis ist $α : 360^{\circ}$.

| Nr. | Radius | Winkel | Sektorfläche |
|----:|:-------|:-------|:-------------|
| 19 | $r = 4 cm$ | $360^{\circ}$ | $A \approx  50{,}3 cm^{2}$ |
| 20 | $r = 4 cm$ | $180^{\circ}$ | $A \approx  25{,}1 cm^{2}$ |
| 21 | $r = 4 cm$ | $90^{\circ}$ | $A \approx  12{,}6 cm^{2}$ |
| 22 | $r = 4 cm$ | $45^{\circ}$ | $A \approx  6{,}3 cm^{2}$ |
| 23 | $r = 4 cm$ | $60^{\circ}$ | $A \approx  8{,}4 cm^{2}$ |
| 24 | $r = 4 cm$ | $120^{\circ}$ | $A \approx  16{,}8 cm^{2}$ |

*Frage nach Nr. 24:* Der Radius bleibt in der ganzen Folge gleich. Welche Rechnung steckt hinter jeder Zeile – und wie kommt man von Nr. 21 zu Nr. 24, ohne neu anzusetzen?

## Folge E: Formeln umkehren

Jetzt ist das Ergebnis gegeben, gesucht ist die Länge.

| Nr. | Gegeben | Gesucht | Lösung |
|----:|:--------|:--------|:-------|
| 25 | $U \approx  18{,}85 cm$ | $r$ | $r = 3 cm$ |
| 26 | $U \approx  31{,}4 cm$ | $d$ | $d = 10 cm$ |
| 27 | $A \approx  78{,}5 cm^{2}$ | $r$ | $r = 5 cm$ |
| 28 | $A \approx  12{,}57 cm^{2}$ | $r$ | $r = 2 cm$ |
| 29 | $U \approx  12{,}57 cm$ | A | $A \approx  12{,}57 cm^{2}$ |
| 30 | $A \approx  200 cm^{2}$ | $r$ | $r \approx  8{,}0 cm$ |

*Hinweis zu Nr. 29:* Erst aus dem Umfang den Radius bestimmen (r = 2 cm), dann die Fläche berechnen. Dass Zahlenwert von Umfang und Fläche hier übereinstimmen, ist ein Zufall dieses Radius – die Einheiten sind verschieden.

## Folge F: Anwendungen

| Nr. | Aufgabe | Lösungsidee |
|----:|:--------|:------------|
| 31 | Ein Fahrradreifen hat 28 Zoll Durchmesser (≈ 71 cm). Wie weit fährt das Rad bei einer Umdrehung? | Eine Umdrehung entspricht dem Umfang: U ≈ 3,14 · 71 ≈ 223 cm, also gut 2,2 m. |
| 32 | Wie oft dreht sich dieses Rad auf 1 km? | 100 000 cm : 223 cm ≈ 448 Umdrehungen. |
| 33 | Eine runde Pizza mit 30 cm Durchmesser kostet 9 €, eine mit 40 cm kostet 15 €. Welche ist günstiger je cm²? | A₃₀ ≈ 707 cm² → 1,27 ct/cm²; A₄₀ ≈ 1257 cm² → 1,19 ct/cm². Die große Pizza ist günstiger. |
| 34 | Ein Rasensprenger bewässert im Winkel von 120° bis 5 m weit. Welche Fläche? | Sektor: (120 : 360) · π · 25 ≈ 26,2 m². |
| 35 | Ein quadratisches Blech mit Seitenlänge 20 cm; daraus wird der größtmögliche Kreis ausgestanzt. Wie viel Prozent bleiben übrig? | Kreis: r = 10 cm, A ≈ 314 cm²; Quadrat: 400 cm². Rest ≈ 86 cm², also rund 21,5 %. |
| 36 | Ein Kreisring: äußerer Radius 6 cm, innerer Radius 4 cm. Fläche? | Differenz der Kreisflächen: π(36 − 16) ≈ 62,8 cm². |

## Reflexionsfragen

1. Warum liefern $U = 2πr$ und $U = πd$ dasselbe Ergebnis? Ist das eine Zufälligkeit oder eine Notwendigkeit?
2. In Folge C wächst die Fläche stärker als der Radius. Erkläre den Faktor 4 bei Verdopplung – ohne die Formel zu nennen.
3. Aufgabe 33 ist die praktische Version von Frage 2. Warum ist die große Pizza im Verhältnis fast immer günstiger?
4. In Folge D bleibt der Radius konstant und nur der Winkel ändert sich. Wie verhält sich die Sektorfläche zum Winkel?
5. Was bedeutet die Zahl π anschaulich? Beschreibe sie ohne die Formel, nur als Verhältnis.

## Didaktischer Kommentar

**Der Kern.** Die Verwechslung von Radius und Durchmesser ist kein Flüchtigkeitsfehler, sondern die Folge davon, dass die Formeln als Symbolketten gelernt werden. Die Gegenmaßnahme ist strukturell: Radius und Durchmesser werden nie in derselben Folge gemischt, sondern nacheinander variiert – und Folge B endet mit der Beobachtung, dass beide Wege dasselbe liefern.

**Was variiert in Folge A und B?** Jeweils nur eine der beiden Längen, in beiden Folgen mit denselben Ergebnissen rechts. Die Zeilen 1 bis 6 und 7 bis 12 gehören paarweise zusammen. Legt man beide Tabellen nebeneinander, entsteht die Einsicht: Es sind nicht zwei Formeln, es ist eine – zweimal aufgeschrieben.

**Was variiert in Folge C?** Nur der Radius, aber die Ergebnisse wachsen quadratisch. Die Klasse soll den Faktor 4 bei Verdopplung selbst finden. Das ist der Übergang von „Formel anwenden“ zu „Wachstumsverhalten verstehen“ und bereitet die Ähnlichkeitslehre vor.

**Was variiert in Folge D?** Nur der Winkel; der Radius bleibt bewusst bei 4 cm. Damit ist die Sektorfläche direkt proportional zum Winkel, und Nr. 24 lässt sich aus Nr. 21 durch Verdreifachen gewinnen. Wer das sieht, hat den Anteil $α : 360^{\circ}$ verstanden – wer jedes Mal neu einsetzt, noch nicht.

**Was variiert in Folge E?** Die Rechenrichtung. Umkehraufgaben sind der beste Test dafür, ob eine Formel verstanden oder auswendig gelernt wurde. Nr. 30 ist bewusst ohne glattes Ergebnis gebaut.

**Häufige Fehlvorstellungen**

- *Radius und Durchmesser verwechselt.* Gegenmittel: In jeder Aufgabe zuerst $r$ einzeichnen und beschriften, auch wenn $d$ gegeben ist.
- *$A = πd$ statt $A = πr^{2}$.* Die Fläche skaliert quadratisch – die Formel muss also ein Quadrat enthalten. Ein Überschlag hilft: Die Kreisfläche liegt immer knapp unter der Fläche des umschreibenden Quadrats mit Seitenlänge $d$.
- *Beim Sektor den Anteil vergessen.* Nr. 19 ist absichtlich der Vollkreis, damit die Klasse den Anteil 360 : 360 = 1 selbst formuliert.
- *Umfang und Fläche vertauscht.* Gegenmittel: konsequent auf Einheiten achten – cm gegen cm² entscheidet die Frage vor jeder Rechnung.

**Zum Weiterarbeiten**

- [Diagnostische Fragen zur Kreisgeometrie](/quizzes)
- [Papier-Werkstatt](/werkzeuge/karopapier.html) – Karopapier für maßstäbliche Kreiszeichnungen
- [Übungsgenerator Kreisgeometrie](/uebung/kreisgeometrie)
