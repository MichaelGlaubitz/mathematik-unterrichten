---
titel: "Exponentielles Wachstum und Zerfall – vom Faktor zur Funktion"
thema: "Exponentialfunktionen"
klassenstufe: ["10"]
schwierigkeit: mittel
didaktischerHinweis: "Eine Aufgabenfolge, die exponentielle Modelle systematisch von der konkreten Vermehrungsfaktor-Rechnung zur Funktionsschreibweise f(t) = a · q^t führt. Schüler erleben, dass exponentielles Wachstum und Zerfall *dasselbe* sind – nur mit einem Faktor q > 1 bzw. q < 1. Der häufigste Lernverlust an dieser Stelle: prozentuale und multiplikative Sicht werden nicht verbunden."
tags: ["exponentialfunktionen", "wachstum", "zerfall", "vermehrungsfaktor", "variation-theory"]
datum: 2026-06-09
entwurf: false
---

## Vorbemerkung für die Schüler

Beim **exponentiellen Wachstum** wird ein Bestand in jedem Zeitschritt mit demselben *Vermehrungsfaktor* `q` multipliziert. Beim **exponentiellen Zerfall** ebenso – nur ist der Faktor kleiner als 1.

Die zentrale Beziehung:

`f(t) = a · q^t`

- `a` ist der Anfangsbestand (zum Zeitpunkt t = 0).
- `q` ist der Vermehrungs- bzw. Verminderungsfaktor pro Zeitschritt.
- `t` ist die Anzahl der Zeitschritte.

Wenn die Veränderungsrate als Prozent angegeben ist:

- Wachstum um `p %` pro Zeitschritt → `q = 1 + p/100`. (5 % → q = 1,05)
- Zerfall um `p %` pro Zeitschritt → `q = 1 − p/100`. (5 % → q = 0,95)

## Folge A: Vermehrungsfaktor erkennen und bilden

Schreib für jede prozentuale Veränderung den Vermehrungs- oder Verminderungsfaktor auf.

| Nr. | Veränderung pro Zeitschritt | Faktor q |
|----:|:----------------------------|:---------|
| 1 | Wachstum um 10 % | q = 1,10 |
| 2 | Wachstum um 25 % | q = 1,25 |
| 3 | Wachstum um 100 % | q = 2,00 |
| 4 | Wachstum um 1 % | q = 1,01 |
| 5 | Zerfall um 10 % | q = 0,90 |
| 6 | Zerfall um 25 % | q = 0,75 |
| 7 | Zerfall um 50 % | q = 0,50 |
| 8 | Zerfall um 1 % | q = 0,99 |

## Folge B: Bestand nach mehreren Zeitschritten

Anfangsbestand a und Faktor q sind gegeben. Berechne den Bestand nach t Zeitschritten.

| Nr. | a | q | t | f(t) = a·q^t |
|----:|---|---|---|---|
| 9 | 1000 | 1,10 | 5 | ≈ 1610,51 |
| 10 | 1000 | 1,10 | 10 | ≈ 2593,74 |
| 11 | 1000 | 1,05 | 10 | ≈ 1628,89 |
| 12 | 1000 | 0,90 | 5 | ≈ 590,49 |
| 13 | 1000 | 0,90 | 10 | ≈ 348,68 |
| 14 | 500 | 1,20 | 4 | ≈ 1036,80 |
| 15 | 800 | 0,75 | 6 | ≈ 142,38 |

## Folge C: Aus Beobachtungen den Faktor finden

Anfangs- und Endbestand sind bekannt, dazu die Anzahl der Zeitschritte. Berechne den Faktor.

| Nr. | a | f(t) | t | Faktor q | Wachstumsrate p |
|----:|---|------|---|----------|----------------|
| 16 | 1000 | 1500 | 5 | q = (1500/1000)^(1/5) ≈ 1,084 | ≈ 8,4 % Wachstum |
| 17 | 1000 | 2000 | 10 | q ≈ 1,072 | ≈ 7,2 % Wachstum |
| 18 | 1000 | 500 | 7 | q ≈ 0,906 | ≈ 9,4 % Zerfall |
| 19 | 200 | 50 | 4 | q ≈ 0,707 | ≈ 29,3 % Zerfall |
| 20 | 100 | 1000 | 5 | q ≈ 1,585 | ≈ 58,5 % Wachstum (sehr stark!) |
| 21 | 1 | 2 | 1 | q = 2,00 | 100 % Wachstum (Verdopplung) |

## Folge D: Halbwerts- und Verdopplungszeit

| Nr. | Aufgabe | Ansatz | Lösung |
|----:|:--------|:-------|:-------|
| 22 | Bei q = 1,05 (5 % Wachstum): Wann hat sich der Bestand verdoppelt? | a · 1,05^t = 2a, also 1,05^t = 2 | t = log(2)/log(1,05) ≈ 14,2 Zeitschritte |
| 23 | Bei q = 1,10: Verdopplung? | 1,10^t = 2 | t ≈ 7,3 |
| 24 | Bei q = 0,90: Wann ist nur noch die Hälfte da? | 0,90^t = 0,5 | t = log(0,5)/log(0,90) ≈ 6,6 |
| 25 | Halbwertszeit von Caesium-137 ist 30 Jahre. Wie viel ist nach 60 Jahren noch da? Nach 90 Jahren? | Nach jeder Halbwertszeit halbiert sich der Bestand. | Nach 60: 25 %. Nach 90: 12,5 %. |
| 26 | Eine Bevölkerung wächst mit einem Faktor q. In 50 Jahren verdoppelt sie sich. Was ist q? | q^50 = 2 | q = 2^(1/50) ≈ 1,014 → ca. 1,4 % Wachstum jährlich |

## Folge E: Wachstum oder Zerfall? Erkennen und einordnen

In jedem Aufgabentext muss zuerst entschieden werden: Wachstum oder Zerfall? Welcher Faktor passt?

| Nr. | Sachkontext | Wachstum oder Zerfall | Faktor |
|----:|:------------|:----------------------|:-------|
| 27 | Eine Bakterienkultur verdoppelt sich alle 30 Minuten. Bestand pro 30-Minuten-Schritt? | Wachstum | q = 2 |
| 28 | Ein radioaktiver Stoff zerfällt mit einer Halbwertszeit von 8 Tagen. | Zerfall | q = 0,5 (pro 8 Tage) |
| 29 | Ein Investmentfonds verzinst sich mit 4 % jährlich. | Wachstum | q = 1,04 |
| 30 | Ein Auto verliert 18 % seines Wertes pro Jahr. | Zerfall | q = 0,82 |
| 31 | Eine Pflanzenpopulation wird durch Schädlinge dezimiert: Jeden Monat sterben 20 % der Pflanzen, gleichzeitig wachsen 5 % nach. | Zerfall (netto) | q = 0,80 + 0,05 = 0,85 |
| 32 | Eine Stadt wächst durch Zuzug um 1500 pro Jahr (Anfangsbestand 50 000). | Linear, *nicht* exponentiell | f(t) = 50 000 + 1500t |

## Reflexionsfragen

1. In Folge A: Was ist der Vermehrungsfaktor bei „doppelt so groß"? Was bei „auf die Hälfte"?
2. Vergleiche Aufgabe 32 und Aufgabe 29. Beide beschreiben Zuwachs. Warum ist der eine *exponentiell* und der andere *linear*?
3. In Aufgabe 22 ist die Verdopplung bei 5 % Wachstum etwa 14 Jahre, bei 10 % etwa 7 Jahre. Was ist die *Faustregel*, die viele Anleger kennen? (Tipp: 70/p oder 72/p.)
4. Aufgabe 31 mischt Zugewinn und Verlust. Warum funktioniert die einfache Subtraktion (20 % − 5 % = 15 %) hier *nicht* korrekt? Wenn nicht – wie geht es richtig?
5. Bei Aufgabe 25 (Caesium-137) sind die Zeitschritte explizit Halbwertszeiten. Wie würde man die Funktion `f(t)` schreiben, wenn `t` *Jahre* sein soll, nicht Halbwertszeiten?

## Didaktischer Kommentar

**Der Kern.** Exponentielles Wachstum und Zerfall sind dieselbe Klasse von Vorgängen mit derselben Funktion `f(t) = a · q^t`. Was im Schulunterricht oft auseinanderfällt – „Wachstum" als ein Thema, „Zerfall" als anderes – ist mathematisch ein einziger Sachverhalt: Konstante prozentuale Veränderung pro Zeitschritt. Diese Einheit muss Schülern explizit gezeigt werden, sonst denken sie in zwei getrennten Schemata.

**Was variiert in Folge A?**
Der Übergang zwischen prozentualer und multiplikativer Sprache. Schüler trainieren das Hin-und-Her-Übersetzen, ohne das die spätere Funktionsform unverständlich bleibt.

**Was variiert in Folge B?**
Hier wird die Funktion `f(t) = a · q^t` numerisch geübt. Schüler sehen, dass der Bestand bei Wachstum *immer schneller* steigt und bei Zerfall *immer langsamer* fällt – das zentrale Charakteristikum exponentieller Vorgänge.

**Was variiert in Folge C?**
Die Umkehroperation: Aus zwei Bestandswerten den Faktor herausrechnen. Das ist die Operation, die in echten Daten gebraucht wird – z. B. wenn man aus zwei Messungen die Wachstumsrate schätzen will.

**Was variiert in Folge D?**
Halbwerts- und Verdopplungszeit – die anschauliche Standardgröße exponentieller Vorgänge. Die hier benötigte Logarithmus-Rechnung ist der natürliche Anlass, den Logarithmus überhaupt einzuführen (oder zu wiederholen).

**Was variiert in Folge E?**
Sachkontext-Übersetzung. Aufgabe 32 ist der diagnostische Höhepunkt: Lineares Wachstum (konstanter Zuwachs pro Zeit) sieht oberflächlich wie exponentielles aus, ist aber strukturell anders. Schüler, die das hier nicht trennen, werden im weiteren Verlauf der Mathematik immer wieder über diesen Unterschied stolpern.

**Häufige Fehlvorstellungen**

- *„5 % Wachstum heißt q = 5."* Klassisch. Hilft: Mit Beispielen rechnen. Ein 100-Euro-Anlagebetrag mit 5 % wird nach einem Jahr 105 Euro – nicht 500.
- *„Zerfall um 5 % heißt q = −5."* Falsch in zwei Richtungen. Erstens: Q ist nie negativ in diesem Kontext. Zweitens: −5 würde keine sinnvolle Operation bedeuten. Richtig: q = 1 − 0,05 = 0,95.
- *„Wenn ein Bestand fünfmal um 10 % wächst, ist er um 50 % größer."* Falsch. Das wäre lineare Sicht. Tatsächlich: 1,1^5 ≈ 1,61, also etwa 61 % Wachstum – mehr als die naive Addition vermuten lässt.
- *„Exponentieller Zerfall geht irgendwann auf null."* Mathematisch nein – `f(t) = a · q^t` mit q < 1 nähert sich asymptotisch null, erreicht es aber nie. Praktisch in der Anwendung kann man ab gewisser Genauigkeit „null" annähern.

**Möglicher Anschluss**

- Aufgabenfolge zum Logarithmus (für die Lösung von q^t = const-Gleichungen).
- Diagnose-Quiz zu typischen Fehlern bei Exponentialmodellen.
- Anwendungsaufgaben: Zinsrechnung, radioaktiver Zerfall, Bakterienwachstum, Inflation, Wertverlust.
- Erweiterung: Kontinuierliches Wachstum (e^(rt)) als Grenzfall.
