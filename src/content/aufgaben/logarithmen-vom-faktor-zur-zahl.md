---
titel: "Logarithmen – die Umkehrung der Exponentialfunktion"
thema: "Logarithmen"
klassenstufe: ["10"]
schwierigkeit: mittel
didaktischerHinweis: "Eine Aufgabenfolge, die den Logarithmus von Grund auf als *Umkehrung* der Exponentialfunktion einführt. Schüler erleben den Logarithmus nicht als 'neue Operation', sondern als Antwort auf die Frage 'mit welcher Hochzahl?'. Daraus ergeben sich die Logarithmusgesetze als Spiegelbilder der Potenzgesetze. Zentral: Wann man mit log10, ln oder log_q rechnet – und warum die Basis am Ende egal ist."
ziel: 'Die Schüler lesen den Logarithmus als Antwort auf die Frage „mit welchem Exponenten?" – nicht als neue Rechenart.'
variation: 'Folge A liest direkt ab, Folge B rechnet ohne Taschenrechner, Folge C wendet die Gesetze an, Folge D löst Gleichungen.'
stolperstelle: '$\log(a+b)$ wird wie $\log a + \log b$ behandelt.'
regie:
  - 'Mit welchem Exponenten kommst du von der Basis zur Zahl?'
  - 'Bevor du rechnest: Liegt das Ergebnis zwischen welchen beiden ganzen Zahlen?'
  - 'Wer zeigt an Zahlen, warum die Summenregel nicht gilt?'
tags: ["logarithmus", "exponentialfunktionen", "umkehrung", "variation-theory"]
datum: 2026-06-12
entwurf: false
---

## Vorbemerkung für die Schüler

Der **Logarithmus** ist die Umkehrung der Exponentialfunktion. Anders gesagt: Er beantwortet die Frage „Mit welcher Hochzahl muss ich $a$ potenzieren, damit ich $b$ bekomme?"

Formal: $log_a(b) = c$ ⟺ $a^c = b$.

Wenn $a = 10$ (Zehner-Logarithmus), schreibt man oft einfach $\log$.
Wenn $a = e \approx  2{,}718$ (natürlicher Logarithmus), schreibt man $\ln$.

Die *Logarithmusgesetze* spiegeln die *Potenzgesetze* in der Umkehrung:

- $log_a(x \cdot  y) = log_a(x) + log_a(y)$ (Produkt → Summe)
- $log_a(x / y) = log_a(x) - log_a(y)$ (Quotient → Differenz)
- $log_a(x^n) = n \cdot  log_a(x)$ (Potenz → Faktor)

Damit kann man exponentielle Gleichungen wie $a^t = b$ lösen: $t = log_a(b)$ oder $t = \log(b) / \log(a)$.

## Folge A: Direkt ablesen

Schreib für jede Gleichung die zugehörige Logarithmus-Form auf.

| Nr. | Potenzform | Logarithmus-Form |
|----:|:-----------|:------------------|
| 1 |  $10^{2} = 100$  |  $\log(100) = 2$  |
| 2 |  $10^{3} = 1000$  |  $\log(1000) = 3$  |
| 3 |  $10^{0} = 1$  |  $\log(1) = 0$  |
| 4 |  $10^{-1} = 0{,}1$  |  $\log(0{,}1) = -1$  |
| 5 |  $2^{3} = 8$  |  $log_2(8) = 3$  |
| 6 |  $2^{4} = 16$  |  $log_2(16) = 4$  |
| 7 |  $5^{2} = 25$  |  $log_5(25) = 2$  |
| 8 |  $7^{0} = 1$  |  $log_7(1) = 0$  |
| 9 |  $(\frac{1}{2})^{2} = \frac{1}{4}$  |  $log_(\frac{1}{2})(\frac{1}{4}) = 2$  |

## Folge B: Logarithmen ohne Taschenrechner

Berechne den Wert direkt im Kopf. (Frage: „mit welcher Hochzahl?")

| Nr. | Aufgabe | Antwort |
|----:|:--------|:--------|
| 10 |  $log_2(32)$  | 5 (denn 2⁵ = 32) |
| 11 |  $log_3(81)$  | $4$ |
| 12 |  $log_5(125)$  | $3$ |
| 13 |  $log_10(10000)$  | $4$ |
| 14 |  $log_2(1)$  | $0$ |
| 15 |  $log_2(\frac{1}{4})$  | $-2$ |
| 16 |  $log_2(2)$  | $1$ |
| 17 |  $log_4(2)$  | 1/2 (denn 4^(1/2) = √4 = 2) |
| 18 |  $log_3(\sqrt{3})$  | $\frac{1}{2}$ |

## Folge C: Anwendung der Logarithmusgesetze

Vereinfache mit den Gesetzen.

| Nr. | Aufgabe | Vereinfachung |
|----:|:--------|:--------------|
| 19 |  $\log(20) + \log(5)$  |  $\log(100) = 2$  |
| 20 |  $\log(30) - \log(3)$  |  $\log(10) = 1$  |
| 21 |  $\log(8) - \log(4)$  |  $\log(2)$  |
| 22 |  $2 \cdot  \log(5) + \log(4)$  |  $\log(25) + \log(4) = \log(100) = 2$  |
| 23 |  $\log(125) - 2 \cdot  \log(5)$  |  $\log(125) - \log(25) = \log(5)$  |
| 24 |  $\log(x^{2}) - \log(x)$  (x > 0) |  $\log(x^{2}/x) = \log(x)$  |
| 25 |  $\log(x^{3} \cdot  y^{2}) - \log(x \cdot  y)$  (x, y > 0) |  $\log(x^{2}y)$  |

## Folge D: Exponentielle Gleichungen lösen

Hier braucht man den Logarithmus *als Werkzeug*, um die Variable t zu isolieren.

| Nr. | Gleichung | Lösungsweg | Lösung |
|----:|:----------|:-----------|:-------|
| 26 |  $2^t = 64$  | direkt:  $t = log_2(64)$  |  $t = 6$  |
| 27 |  $2^t = 1000$  |  $t = log_2(1000) = \log\frac{1000}{\log}(2)$  |  $t \approx  9{,}966$  |
| 28 |  $10^t = 50$  |  $t = \log(50)$  |  $t \approx  1{,}699$  |
| 29 |  $1{,}05^t = 2$  (Verdopplung bei 5 % p.a.) |  $t = \log\frac{2}{\log}(1{,}05)$  |  $t \approx  14{,}21$  |
| 30 |  $0{,}9^t = 0{,}5$  (Halbwertszeit bei 10 % Abnahme) |  $t = \log\frac{0{,}5}{\log}(0{,}9)$  |  $t \approx  6{,}58$  |
| 31 |  $e^t = 10$  |  $t = \ln(10)$  |  $t \approx  2{,}303$  |
| 32 |  $5 \cdot  2^t = 80$  | erst durch 5:  $2^t = 16$ , dann  $t = log_2(16)$  |  $t = 4$  |

## Folge E: Basiswechsel und Plausibilität

In dieser Folge wird klar, dass die Basis nur bequemes Mittel ist – die *Antwort* ist immer dieselbe.

| Nr. | Aufgabe | Antwort |
|----:|:--------|:--------|
| 33 | Berechne  $log_2(8)$  und  $\log(8) / \log(2)$ . Was fällt auf? | beide 3 |
| 34 | Berechne  $log_5(125)$  über  $\log(125) / \log(5)$ . | $3$ |
| 35 | Berechne  $log_2(7)$  über  $\log(7) / \log(2)$ . | $\approx  2{,}807$ |
| 36 | Berechne  $log_2(7)$  über  $\ln(7) / \ln(2)$ . | ≈ 2,807 (identisch zu 35) |
| 37 | Wie groß ist  $\log(0)$ ? | nicht definiert (es gibt kein x mit 10^x = 0). |
| 38 | Wie groß ist  $\log(-1)$ ? | nicht definiert in den reellen Zahlen (10^x ist immer positiv). |

## Reflexionsfragen

1. Aufgabe 3 zeigt: $\log(1) = 0$. Warum gilt das für *jede* Basis (also auch $log_2(1) = 0$, $log_5(1) = 0$, ...)?
2. Vergleiche Aufgabe 26 ($t = 6$ exakt) und Aufgabe 27 ($t \approx  9{,}966$). Warum ist die eine exakt und die andere nur näherungsweise?
3. In Folge D, Aufgabe 29, geht es um die *Verdopplungszeit* bei 5 % Wachstum. Die Antwort ist ≈ 14,21 Jahre. Wie nahe ist das an der Faustregel „72/p"?
4. Aufgabe 37 und 38: Warum ist der Logarithmus für $0$ und negative Werte nicht definiert? Wie hängt das mit der Exponentialfunktion zusammen?
5. Aufgaben 33–36 zeigen: Der Wert von $log_a(b)$ ist unabhängig davon, *welche* Basis man bei der Umrechnung verwendet. Warum?

## Didaktischer Kommentar

**Der Kern.** Der Logarithmus ist im deutschen Schulunterricht oft die Stelle, an der die meisten Schüler aussteigen – nicht wegen der Mathematik, sondern wegen der ungewohnten Schreibweise und der zugleich abstrakten Definition. Diese Folge geht den Weg, der erfahrungsgemäß funktioniert: Erst den Logarithmus *als Hochzahl* erleben, dann den Bezug zur Exponentialfunktion herstellen, dann die Gesetze als Spiegelbild der Potenzgesetze entdecken.

**Was variiert in Folge A?**
Die Variation Theory-Standardform: Eine Form wechselt zur anderen. Schüler erkennen, dass $10^{2} = 100$ und $\log(100) = 2$ dieselbe Aussage in zwei Sprachen sind. Das ist die zentrale Grundvorstellung.

**Was variiert in Folge B?**
Hier wird ohne Taschenrechner gerechnet. Schüler erleben den Logarithmus *als Hochzahl* – als Antwort auf eine Frage, nicht als kryptischen Knopfdruck. Aufgaben 15 (negativer Logarithmus) und 17 (Bruchexponent) sind diagnostisch wichtig: Sie testen, ob die Hochzahl-Vorstellung wirklich verankert ist.

**Was variiert in Folge C?**
Die Logarithmusgesetze in Anwendung. Schüler erleben, dass $\log(20) + \log(5) = \log(100)$ – Addition wird zu Multiplikation. Das ist der zentrale historische Punkt, der den Logarithmus überhaupt nützlich macht: Rechenwege werden vereinfacht.

**Was variiert in Folge D?**
Hier wird der Logarithmus zum *Werkzeug*. Schüler sehen, warum sie ihn überhaupt brauchen: zur Auflösung exponentieller Gleichungen. Aufgaben 29 und 30 verbinden direkt mit der Aufgabenfolge zu exponentiellem Wachstum und Zerfall.

**Was variiert in Folge E?**
Tiefere Reflexion: Basiswechsel und Grenzen des Logarithmus. Schüler erleben, dass $log_a(b) = \log\frac{b}{\log}(a)$ eine Universalformel ist und dass der Logarithmus nicht für alle Zahlen definiert ist (Definitionsbereich!). Aufgaben 37 und 38 sind essentielle Diagnose für später kommende Themen (Logarithmusgleichungen, Logarithmusfunktion).

**Häufige Fehlvorstellungen**

- *„$\log(x + y) = \log(x) + \log(y)$."* Falsch. Die Gesetze gelten für *Multiplikation*, nicht für Addition. Probe mit Zahlen: $\log(10 + 100) = \log(110) \neq  \log(10) + \log(100) = 3$.
- *„$\log(x) \cdot  \log(y) = \log(xy)$."* Falsch. Richtig ist $\log(x) + \log(y) = \log(xy)$. Wer hier multipliziert, kombiniert die Operationen falsch.
- *„$\log(x)$ für negative x ist eine negative Zahl."* Falsch. $\log(x)$ für $x < 0$ ist *nicht definiert*. ($\log(x) = c$ würde $10^c = x < 0$ bedeuten, aber $10^c$ ist immer positiv.)
- *„Der Logarithmus ist nur eine seltsame Tasten-Funktion am Taschenrechner."* Diese funktionale Sicht verfehlt den Kern. Der Logarithmus ist eine *Frage*: „Welche Hochzahl?" Wer das einmal verstanden hat, braucht den Knopf nur noch für die numerische Antwort.

**Möglicher Anschluss**

- Anwendungsaufgaben: pH-Wert, Schalldruckpegel (Dezibel), Erdbeben (Richterskala) – alles logarithmische Skalen.
- Diagnostische Fragen zu typischen Fehlern bei Logarithmen.
- Aufgabenfolge zu Logarithmusgleichungen ($\log(x) = 2$, $\log(x+1) = \log(2x-5)$).
- Erweiterung in der Oberstufe: Ableitung und Integral des Logarithmus.
