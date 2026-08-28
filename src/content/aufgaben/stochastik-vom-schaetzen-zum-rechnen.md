---
titel: "Wahrscheinlichkeit – vom Schätzen zum Rechnen"
thema: "Stochastik"
klassenstufe: ["7", "8"]
schwierigkeit: einsteiger
didaktischerHinweis: "Stochastik ist das einzige Gebiet, in dem die Intuition systematisch in die Irre führt – und zwar auch bei Erwachsenen. Diese Folge nutzt das: Jede Aufgabe wird zuerst geschätzt, dann gerechnet, dann simuliert. Folge D ist bewusst gegen die Intuition gebaut (Gedächtnis der Münze, gleich wahrscheinliche Ergebnisse bei zwei Würfeln). Die Simulation gehört zum Unterrichtsgang dazu, nicht als Zugabe."
tags: ["stochastik", "wahrscheinlichkeit", "laplace", "relative-haeufigkeit", "grundvorstellungen"]
datum: 2026-08-28
entwurf: false
---

## Vorbemerkung für die Schüler

Zwei Begriffe, die man auseinanderhalten muss:

- Die **Wahrscheinlichkeit** ist eine berechnete Zahl. Bei einem fairen Würfel ist die Wahrscheinlichkeit für eine Sechs `1/6` – unabhängig davon, was vorher passiert ist.
- Die **relative Häufigkeit** ist ein Messergebnis: Wie oft ist das Ereignis in *meinen* Versuchen tatsächlich eingetreten, geteilt durch die Anzahl der Versuche.

Beide nähern sich einander an, wenn man oft genug wirft. Aber sie sind nicht dasselbe – und die relative Häufigkeit „holt nichts nach".

**Arbeitsauftrag für alle Folgen:** Schätzen Sie zuerst schriftlich, bevor Sie rechnen. Ohne die eigene Schätzung ist das Ergebnis nur eine Zahl.

## Folge A: Ein Würfel – Ereignisse werden größer

Fairer sechsseitiger Würfel. Wie wahrscheinlich ist das Ereignis?

| Nr. | Ereignis | Wahrscheinlichkeit |
|----:|:---------|:-------------------|
| 1 | eine Sechs | 1/6 ≈ 16,7 % |
| 2 | eine gerade Zahl | 3/6 = 50 % |
| 3 | eine Zahl größer als 4 | 2/6 ≈ 33,3 % |
| 4 | eine Zahl kleiner als 7 | 6/6 = 100 % |
| 5 | eine Sieben | 0 |
| 6 | keine Sechs | 5/6 ≈ 83,3 % |

*Frage nach Nr. 6:* Vergleichen Sie Nr. 1 und Nr. 6. Wie hängen die beiden Zahlen zusammen? Formulieren Sie eine Regel.

## Folge B: Zwei Würfel – die Augensumme

Zwei faire Würfel werden geworfen und die Augen addiert. Es gibt 36 gleich wahrscheinliche Paare.

| Nr. | Augensumme | Anzahl der Möglichkeiten | Wahrscheinlichkeit |
|----:|:-----------|:-------------------------|:-------------------|
| 7 | 2 | 1 | 1/36 ≈ 2,8 % |
| 8 | 3 | 2 | 2/36 ≈ 5,6 % |
| 9 | 4 | 3 | 3/36 ≈ 8,3 % |
| 10 | 7 | 6 | 6/36 ≈ 16,7 % |
| 11 | 11 | 2 | 2/36 ≈ 5,6 % |
| 12 | 12 | 1 | 1/36 ≈ 2,8 % |

*Frage nach Nr. 12:* Warum ist die 7 sechsmal so wahrscheinlich wie die 2? Zählen Sie die Paare für beide auf.

## Folge C: Urne – der Grundwert ändert sich

In einer Urne liegen rote und blaue Kugeln. Es wird eine gezogen.

| Nr. | Inhalt | P(rot) |
|----:|:-------|:-------|
| 13 | 1 rot, 1 blau | 1/2 = 50 % |
| 14 | 2 rot, 2 blau | 1/2 = 50 % |
| 15 | 3 rot, 1 blau | 3/4 = 75 % |
| 16 | 1 rot, 3 blau | 1/4 = 25 % |
| 17 | 3 rot, 2 blau | 3/5 = 60 % |
| 18 | 30 rot, 20 blau | 3/5 = 60 % |

*Frage nach Nr. 18:* Nr. 17 und Nr. 18 haben dieselbe Wahrscheinlichkeit, aber ganz verschiedene Kugelzahlen. Was zählt also – die Anzahl oder das Verhältnis?

## Folge D: Gegen die Intuition

Diese sechs Fragen zuerst abstimmen lassen, dann besprechen.

| Nr. | Frage | Antwort |
|----:|:------|:--------|
| 19 | Eine Münze zeigt fünfmal hintereinander Kopf. Wie wahrscheinlich ist Zahl beim nächsten Wurf? | 50 % – die Münze hat kein Gedächtnis. |
| 20 | Was ist wahrscheinlicher: fünfmal hintereinander Kopf oder die Folge K-Z-K-K-Z? | Beide gleich: jeweils 1/32. |
| 21 | Bei zwei Würfeln: Ist (3,4) wahrscheinlicher als (3,3)? | Ja – (3,4) und (4,3) sind zwei Paare, (3,3) nur eines. |
| 22 | Beim Lotto: Ist 1-2-3-4-5-6 unwahrscheinlicher als 4-11-19-27-33-41? | Nein, beide gleich unwahrscheinlich. |
| 23 | Eine Zahl ist bei 100 Würfen nur 9-mal gefallen statt 16-mal. Kommt das wieder ins Lot? | Der *Anteil* nähert sich an, der *Rückstand* wird nicht ausgeglichen. |
| 24 | Wie viele Menschen braucht es, damit zwei am selben Tag Geburtstag haben – mit über 50 % Wahrscheinlichkeit? | 23. |

*Hinweis zu Nr. 23:* Genau hier lohnt die Simulation. Lassen Sie 10 000 Würfe laufen und zeigen Sie die relative Häufigkeit gegen die Versuchszahl: Sie nähert sich `1/6`, ohne dass eine Zahl „aufholt".

## Folge E: Vom Versuch zur Wahrscheinlichkeit

Ein Würfel wird geworfen; die Sechs wird gezählt.

| Nr. | Würfe | Sechsen | relative Häufigkeit | Abstand zu 1/6 |
|----:|:------|:--------|:--------------------|:---------------|
| 25 | 10 | 3 | 30 % | 13,3 Prozentpunkte |
| 26 | 60 | 13 | ≈ 21,7 % | 5,0 Prozentpunkte |
| 27 | 100 | 20 | 20 % | 3,3 Prozentpunkte |
| 28 | 600 | 111 | ≈ 18,5 % | 1,8 Prozentpunkte |
| 29 | 6000 | 1032 | ≈ 17,2 % | 0,5 Prozentpunkte |
| 30 | 60 000 | 10 143 | ≈ 16,9 % | 0,2 Prozentpunkte |

*Frage nach Nr. 30:* Der Abstand in Prozentpunkten wird kleiner. Wie verhält sich dagegen der Abstand in **absoluten Zahlen** (erwartete minus tatsächliche Anzahl)? Rechnen Sie nach.

## Reflexionsfragen

1. Warum ist `P(kein Ereignis) = 1 − P(Ereignis)`? Begründen Sie am Würfel.
2. In Folge B ist die 7 die häufigste Augensumme. Wäre das auch so, wenn die Würfel unterscheidbar wären – etwa einer rot, einer blau?
3. Erklären Sie einer Mitschülerin, warum die Münze „kein Gedächtnis" hat.
4. In Folge E nähert sich die relative Häufigkeit dem Wert `1/6`. Wird sie ihn irgendwann genau erreichen?
5. Nennen Sie eine Situation aus dem Alltag, in der Menschen relative Häufigkeit und Wahrscheinlichkeit verwechseln.

## Didaktischer Kommentar

**Der Kern.** Stochastik unterscheidet sich von allen anderen Gebieten darin, dass falsche Antworten sich richtig anfühlen. Diese Intuitionen verschwinden nicht durch Erklärung – sie verschwinden nur, wenn die Klasse ihre eigene Vorhersage schriftlich festhält und danach das Gegenteil beobachtet. Deshalb ist das Schätzen kein didaktisches Beiwerk, sondern der eigentliche Mechanismus dieser Reihe.

**Was variiert in Folge A?** Der Umfang des Ereignisses – von einem Ergebnis über mehrere bis zum sicheren und zum unmöglichen Ereignis. Nr. 4 und Nr. 5 markieren die Randfälle und begründen, warum Wahrscheinlichkeiten zwischen 0 und 1 liegen. Das Paar Nr. 1 und Nr. 6 liefert die Gegenwahrscheinlichkeit als Beobachtung, nicht als Formel.

**Was variiert in Folge B?** Die Augensumme, und damit die Anzahl der günstigen Paare. Entscheidend ist die Aufforderung, die Paare tatsächlich aufzuschreiben: Wer (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) notiert hat, versteht danach auch Nr. 21.

**Was variiert in Folge C?** Erst das Verhältnis, dann die absolute Anzahl bei gleichem Verhältnis. Nr. 17 und Nr. 18 sind das entscheidende Paar: Zehnmal so viele Kugeln, dieselbe Wahrscheinlichkeit. Das ist die Brücke zur Prozentrechnung und zum Anteilsbegriff.

**Was variiert in Folge D?** Nichts Systematisches – hier geht es um Intuitionsbrüche. Die Fragen sind so gewählt, dass die Klasse sich uneinig ist; das erzeugt den Gesprächsanlass. Nr. 24 (Geburtstagsproblem) ist bewusst ohne Rechnung angegeben: Die Zahl 23 überrascht, und die Herleitung kann später folgen.

**Was variiert in Folge E?** Die Versuchszahl über vier Größenordnungen. Die letzte Spalte ist die eigentliche Pointe: Der *relative* Abstand schrumpft, der *absolute* nicht. In Nr. 25 liegt die Anzahl 1,3 über dem Erwartungswert, in Nr. 30 sind es 143. Genau diese Unterscheidung räumt mit der Vorstellung auf, der Zufall würde etwas ausgleichen.

**Häufige Fehlvorstellungen**

- *„Nach fünfmal Kopf ist Zahl fällig."* Nr. 19 und Nr. 23. Gegenmittel: simulieren und die Kurve zeigen.
- *„Auffällige Muster sind unwahrscheinlicher."* Nr. 20 und Nr. 22. Gegenmittel: alle Folgen einer festen Länge sind gleich wahrscheinlich; auffällig ist nur, dass wir sie als Muster wahrnehmen.
- *„Bei zwei Würfeln sind alle Augensummen gleich wahrscheinlich."* Folge B. Gegenmittel: die 36 Paare tatsächlich in eine Tabelle schreiben.
- *„Wahrscheinlichkeit ist dasselbe wie relative Häufigkeit."* Folge E. Gegenmittel: konsequent unterschiedliche Wörter benutzen und beide Zahlen nebeneinander schreiben.

**Zum Weiterarbeiten**

- [Werkzeug: Zufallsexperimente](/werkzeuge/zufallsexperimente.html) – Würfel, Münze, Urne und Galtonbrett simulieren, relative Häufigkeit gegen Versuchszahl anzeigen.
- [Diagnostische Fragen zur Stochastik](/quizzes)
- [Übungsgenerator Stochastik](/uebung/stochastik)
