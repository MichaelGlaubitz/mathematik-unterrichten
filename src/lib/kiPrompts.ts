/**
 * Prompt-Bibliothek für den Mathematikunterricht.
 *
 * Jeder Prompt ist erprobt und so geschrieben, dass er ohne Nacharbeit
 * kopiert werden kann: Rolle, Auftrag, Randbedingungen, Ausgabeformat.
 * Die Platzhalter in eckigen Klammern werden vor dem Absenden ersetzt.
 */

export type PromptFeld =
  | 'Aufgaben erzeugen'
  | 'Diagnose'
  | 'Differenzierung'
  | 'Planung'
  | 'Prüfen & Kontrollieren'
  | 'Kommunikation';

export interface KiPrompt {
  slug: string;
  titel: string;
  feld: PromptFeld;
  /** Wofür man diesen Prompt nimmt – ein Satz. */
  zweck: string;
  /** Der eigentliche Prompt-Text zum Kopieren. */
  prompt: string;
  /** Was man an der Antwort prüfen muss, bevor sie in den Unterricht geht. */
  pruefen: string;
}

export const kiPrompts: KiPrompt[] = [
  {
    slug: 'variationsserie',
    titel: 'Aufgabenserie nach Variation Theory',
    feld: 'Aufgaben erzeugen',
    zweck:
      'Eine Übungsreihe, in der sich von Aufgabe zu Aufgabe genau eine Sache ändert – damit die Reihenfolge selbst etwas erklärt.',
    prompt: `Du bist erfahrene Mathematikdidaktikerin und arbeitest nach der Variationstheorie (Marton, Barton).

Erstelle eine Aufgabenserie zum Thema [THEMA] für die Klassenstufe [KLASSE].

Randbedingungen:
- Genau 12 Aufgaben, aufsteigend angeordnet.
- Von einer Aufgabe zur nächsten ändert sich GENAU EIN Merkmal. Benenne bei jeder Aufgabe in Klammern, welches.
- Die Zahlen bleiben so einfach, dass der Kopf für die Struktur frei bleibt.
- Enthalte mindestens einen Fall, der die naheliegende Regel bricht (Grenzfall), und markiere ihn.

Ausgabeformat: Tabelle mit den Spalten Nr. | Aufgabe | Lösung | Was sich geändert hat.
Danach drei Fragen, die ich der Klasse nach Aufgabe 4, 8 und 12 stellen kann.`,
    pruefen:
      'Rechnen Sie drei Aufgaben stichprobenartig nach. Prüfen Sie vor allem, ob sich wirklich nur ein Merkmal ändert – hier wird am häufigsten geschludert.',
  },
  {
    slug: 'diagnostische-frage',
    titel: 'Diagnostische Frage mit echten Distraktoren',
    feld: 'Diagnose',
    zweck:
      'Eine Multiple-Choice-Frage, bei der jede falsche Antwort einer bestimmten Fehlvorstellung entspricht.',
    prompt: `Du bist Mathematikdidaktiker und entwickelst diagnostische Fragen nach dem Vorbild von Craig Barton.

Entwickle eine diagnostische Frage zu [INHALT], Klassenstufe [KLASSE].

Randbedingungen:
- Eine richtige Antwort und drei Distraktoren.
- Jeder Distraktor muss aus einer KONKRETEN, im Unterricht belegten Fehlvorstellung entstehen – keine Zufallszahlen.
- Alle vier Antworten sind gleich plausibel formuliert und gleich lang.
- Die Aufgabe muss in unter 30 Sekunden im Kopf lösbar sein.

Ausgabeformat:
1. Die Frage
2. Die vier Optionen A–D
3. Für jede Option: Welcher Denkweg führt genau hierhin?
4. Ein Satz, was ich tue, wenn mehr als ein Viertel der Klasse Option [X] wählt.`,
    pruefen:
      'Testen Sie die Distraktoren an sich selbst: Wenn Sie zu einem keinen realistischen Denkweg formulieren können, ersetzen Sie ihn.',
  },
  {
    slug: 'fehlersuche',
    titel: 'Falsche Musterlösung zum Fehlersuchen',
    feld: 'Diagnose',
    zweck:
      'Eine plausibel falsche Rechnung, an der die Klasse den Fehler findet und erklärt – ohne echte Schülerarbeiten zu zeigen.',
    prompt: `Erstelle eine ausführlich gerechnete, aber FALSCHE Musterlösung zu folgender Aufgabe: [AUFGABE]

Randbedingungen:
- Genau ein Fehler, und zwar ein typischer (keine Rechenschludrigkeit, sondern eine Fehlvorstellung).
- Alles vor und nach dem Fehler ist korrekt weitergerechnet – die Lösung muss glaubwürdig aussehen.
- Die Darstellung entspricht dem, was Lernende der Klasse [KLASSE] tatsächlich aufschreiben würden.

Ausgabe:
1. Die falsche Lösung (ohne Hinweis, wo der Fehler steckt)
2. Getrennt darunter: In welcher Zeile steckt der Fehler und welche Fehlvorstellung liegt zugrunde?
3. Zwei Impulsfragen für das Gespräch – die erste fragt WO, die zweite fragt WARUM jemand so denkt.`,
    pruefen:
      'Kontrollieren Sie, dass wirklich nur ein Fehler enthalten ist. Zwei Fehler machen die Aufgabe für schwächere Lernende unbrauchbar.',
  },
  {
    slug: 'drei-niveaus',
    titel: 'Eine Aufgabe auf drei Niveaus',
    feld: 'Differenzierung',
    zweck:
      'Dieselbe mathematische Idee für drei Leistungsgruppen – ohne dass daraus drei verschiedene Themen werden.',
    prompt: `Nimm die folgende Aufgabe: [AUFGABE]

Erstelle daraus drei Fassungen, die alle DIESELBE mathematische Idee betreffen:
A) mit Strukturierungshilfe (Zwischenschritte vorgegeben, Zahlen freundlicher)
B) die Originalaufgabe
C) mit geöffnetem Ende (mehrere Lösungen möglich, eine Optimierungsfrage ergänzt)

Randbedingungen:
- Der mathematische Kern bleibt in allen drei Fassungen identisch. Benenne ihn zuerst in einem Satz.
- Fassung A darf NICHT weniger anspruchsvoll denken, sondern nur weniger gleichzeitig verlangen.
- Fassung C darf keine zusätzliche Rechenarbeit sein, sondern muss zusätzliches Denken verlangen.

Ausgabe: Kern in einem Satz, dann die drei Fassungen mit Lösungen.`,
    pruefen:
      'Prüfen Sie Fassung C: „Rechne noch drei weitere Aufgaben“ ist keine Öffnung, sondern mehr vom Gleichen.',
  },
  {
    slug: 'sprachsensibel',
    titel: 'Sprachlich vereinfachen, mathematisch nicht',
    feld: 'Differenzierung',
    zweck:
      'Textaufgaben für Lernende mit Sprachhürden zugänglich machen, ohne den mathematischen Anspruch abzusenken.',
    prompt: `Überarbeite die folgende Textaufgabe sprachsensibel: [AUFGABE]

Randbedingungen:
- Der mathematische Anspruch bleibt exakt gleich. Kürze keine Denkschritte weg.
- Kurze Hauptsätze, aktive Verben, keine Schachtelsätze, keine Nominalisierungen.
- Fachbegriffe bleiben erhalten (sie sind Lernziel), Alltagswörter mit hoher Hürde werden ersetzt.
- Reihenfolge der Informationen entspricht der Reihenfolge der Bearbeitung.

Ausgabe:
1. Die überarbeitete Aufgabe
2. Eine Tabelle: ersetzter Ausdruck | Ersatz | Begründung
3. Eine Liste der Fachbegriffe, die vorher im Unterricht gesichert sein müssen.`,
    pruefen:
      'Kontrollieren Sie, ob wirklich nichts Mathematisches weggefallen ist – KI-Vereinfachungen streichen gern eine Bedingung mit.',
  },
  {
    slug: 'exit-ticket',
    titel: 'Exit-Ticket zum Stundenziel',
    feld: 'Planung',
    zweck: 'Zwei Fragen, die messen, ob das Stundenziel wirklich erreicht ist.',
    prompt: `Mein Stundenziel lautet: [STUNDENZIEL]

Entwirf ein Exit-Ticket mit genau zwei Fragen.
- Frage 1 prüft die Mindestanforderung: Das müssen am Ende der Stunde ALLE können.
- Frage 2 unterscheidet Verstehen von Nachmachen: Wer nur das Verfahren kopiert hat, scheitert hier.

Randbedingungen:
- Zusammen in höchstens 4 Minuten bearbeitbar.
- Keine Ankreuzfragen; ich will sehen, wie gedacht wurde.
- Frage 2 fragt nach einer Begründung oder einem Gegenbeispiel, nicht nach einer weiteren Rechnung.

Ausgabe: die zwei Fragen, die erwarteten Antworten und drei typische Fehlantworten mit ihrer Deutung.`,
    pruefen:
      'Frage 2 muss wirklich unterscheiden. Wenn beide Fragen dasselbe Verfahren abprüfen, ist das Ticket wertlos.',
  },
  {
    slug: 'lernziele',
    titel: 'Lernziele operationalisieren',
    feld: 'Planung',
    zweck:
      'Aus einem Thema überprüfbare Feinlernziele machen – für den Unterrichtsentwurf und für die eigene Klarheit.',
    prompt: `Thema meiner Stunde: [THEMA], Klassenstufe [KLASSE].

Formuliere drei Feinlernziele.

Randbedingungen:
- Jedes Ziel beschreibt eine beobachtbare Schülerhandlung („Die Lernenden bestimmen …“), keine Lehrerhandlung und keine Absicht („sollen erkennen“, „verstehen“, „für die Bedeutung sensibilisiert werden“).
- Jedes Ziel nennt den Inhalt UND das Anforderungsniveau (Reproduzieren / Zusammenhänge herstellen / Verallgemeinern).
- Zu jedem Ziel gehört eine konkrete Aufgabe, an der ich am Stundenende sehe, ob es erreicht ist.

Ausgabe: Tabelle mit den Spalten Ziel | Anforderungsniveau | Überprüfungsaufgabe.`,
    pruefen:
      'Streichen Sie jedes Ziel, das Sie am Stundenende nicht mit einer Aufgabe prüfen könnten – es ist dann kein Ziel, sondern eine Hoffnung.',
  },
  {
    slug: 'entwurf-kritisieren',
    titel: 'Den eigenen Stundenentwurf kritisieren lassen',
    feld: 'Planung',
    zweck:
      'Eine zweite Meinung zum Verlaufsplan, bevor jemand anderes sie gibt – besonders vor Unterrichtsbesuchen.',
    prompt: `Hier ist mein Stundenverlaufsplan: [PLAN EINFÜGEN]

Prüfe ihn als kritische Fachleiterin. Sei streng, aber konkret.

Prüfe insbesondere:
1. Passt der Einstieg zum Ziel, oder ist er nur Motivation ohne Bezug?
2. Wo denken die Lernenden – und wie viele Minuten der Stunde sind das insgesamt?
3. Woran genau merke ich in der Stunde, ob das Ziel erreicht wird? Nenne den Zeitpunkt.
4. Welcher Abschnitt ist zeitlich unrealistisch geplant?
5. Was passiert, wenn die Schülerphase schneller oder langsamer läuft als geplant?

Ausgabe: zu jedem Punkt zwei bis drei Sätze, danach die drei wichtigsten Änderungen in der Reihenfolge ihrer Wirkung.`,
    pruefen:
      'Übernehmen Sie nichts ungeprüft: Die Rückmeldung kennt weder Ihre Klasse noch Ihr Bundesland.',
  },
  {
    slug: 'klassenarbeit',
    titel: 'Klassenarbeit mit Erwartungshorizont',
    feld: 'Planung',
    zweck: 'Ein Aufgabenmix über die Anforderungsbereiche, mit nachvollziehbarer Punkteverteilung.',
    prompt: `Erstelle einen Vorschlag für eine Klassenarbeit über [THEMENLISTE], Klassenstufe [KLASSE], Dauer [MINUTEN] Minuten.

Randbedingungen:
- Verteilung über die Anforderungsbereiche: etwa 40 % AB I (Reproduzieren), 40 % AB II (Zusammenhänge), 20 % AB III (Verallgemeinern/Reflektieren).
- Die erste Aufgabe muss von allen lösbar sein.
- Mindestens eine Aufgabe verlangt eine Begründung, mindestens eine eine Darstellung (Skizze, Graph, Tabelle).
- Realistische Bearbeitungszeit: Rechne 3 Minuten pro Punkt und weise das aus.

Ausgabe:
1. Aufgabenblatt
2. Erwartungshorizont mit Punkten pro Teilschritt
3. Tabelle: Aufgabe | Anforderungsbereich | Punkte | geschätzte Zeit`,
    pruefen:
      'Rechnen Sie jede Aufgabe selbst durch und prüfen Sie die Gesamtzeit. KI unterschätzt die Bearbeitungsdauer regelmäßig.',
  },
  {
    slug: 'fehlvorstellungen-vorhersagen',
    titel: 'Fehlvorstellungen zu einer Aufgabe vorhersagen',
    feld: 'Diagnose',
    zweck:
      'Vor der Stunde wissen, welche falschen Wege kommen – die Grundlage des „Anticipate“ aus den 5 Praktiken.',
    prompt: `Aufgabe: [AUFGABE], Klassenstufe [KLASSE].

Sage voraus, welche Lösungswege in der Klasse entstehen werden.

Ausgabe:
1. Drei bis fünf RICHTIGE Wege, sortiert von naheliegend bis elegant – jeweils mit einem Satz, was daran der Kern ist.
2. Drei bis vier FALSCHE Wege, jeweils mit der dahinterliegenden Fehlvorstellung.
3. Eine Reihenfolge, in der ich die Wege in der Sicherungsphase besprechen sollte, mit Begründung für genau diese Reihenfolge.
4. Für jeden Übergang zwischen zwei Wegen: die Frage, mit der ich sie verbinde.`,
    pruefen:
      'Ergänzen Sie aus Ihrer Erfahrung. Die Vorhersage kennt Ihre Klasse nicht – aber sie liefert eine gute Ausgangsliste.',
  },
  {
    slug: 'open-middle',
    titel: 'Open-Middle-Aufgabe entwerfen',
    feld: 'Aufgaben erzeugen',
    zweck: 'Eine Aufgabe mit niedriger Einstiegshürde und hoher Decke zu einem beliebigen Inhalt.',
    prompt: `Entwirf eine Open-Middle-Aufgabe zu [INHALT], Klassenstufe [KLASSE].

Randbedingungen:
- Feste Struktur mit Leerstellen, in die Ziffern (0–9 oder 1–9, jede höchstens einmal) eingesetzt werden.
- Es gibt viele gültige Belegungen, aber nur wenige optimale.
- Die Optimierungsfrage lautet: größter Wert, kleinster Wert oder möglichst nahe an einer Zielzahl.

Ausgabe:
1. Die Aufgabe
2. Eine gültige Beispielbelegung (nicht die optimale)
3. Die optimale Belegung mit Begründung, warum es keine bessere gibt
4. Zwei Impulsfragen für Lernende, die früh fertig sind.`,
    pruefen:
      'Prüfen Sie die behauptete Optimallösung durch systematisches Ausprobieren – hier irren sich Sprachmodelle häufig.',
  },
  {
    slug: 'wodb',
    titel: 'WODB-Set erzeugen',
    feld: 'Aufgaben erzeugen',
    zweck: 'Vier Objekte, bei denen sich für jedes begründen lässt, warum es das andere ist.',
    prompt: `Entwirf ein „Which One Doesn't Belong?"-Set zu [INHALT], Klassenstufe [KLASSE].

Randbedingungen:
- Vier Objekte (Zahlen, Terme, Gleichungen oder Figuren).
- Für JEDES der vier Objekte muss es mindestens eine tragfähige mathematische Begründung geben, warum ausgerechnet es nicht dazugehört.
- Mindestens zwei der Begründungen sollen Fachbegriffe verlangen, die im Unterricht gerade dran sind.
- Keine Begründung darf auf Äußerlichkeiten beruhen („die einzige rote“).

Ausgabe: die vier Objekte (A–D) und zu jedem zwei mögliche Begründungen.`,
    pruefen:
      'Prüfen Sie jede der vier Begründungen. Häufig trägt eine nicht – dann ersetzen Sie dieses eine Objekt.',
  },
  {
    slug: 'diagramm',
    titel: 'Diagramm als TikZ oder SVG',
    feld: 'Aufgaben erzeugen',
    zweck: 'Ein maßstabsgetreues Diagramm, das nicht von Hand nachgebessert werden muss.',
    prompt: `Erzeuge [ANZAHL] Diagramme zu [INHALT] als [TikZ / SVG].

Verbindliche Regeln:
- Die Längenverhältnisse im Bild müssen den angegebenen Zahlenwerten entsprechen. Keine optisch-numerischen Widersprüche.
- Beide Achsen werden mit Variablennamen beschriftet, tragen Skalenticks und Pfeilspitzen in positiver Richtung; die positiven Achsen reichen mindestens bis +2.
- Labels, Winkelmarken und Kanten dürfen sich nicht überlagern.
- Gegebene Werte sind ganzzahlig; nicht-ganzzahlige Ergebnisse auf eine Dezimalstelle.
- Variation zwischen den Diagrammen: [WAS SOLL VARIIEREN], konstant bleibt: [WAS BLEIBT GLEICH].

Ausgabe: vollständiger, direkt kompilierbarer Code – kein Pseudocode, keine Auslassungen.`,
    pruefen:
      'Kompilieren und ansehen. Kontrollieren Sie besonders, ob die längere Strecke im Bild auch die größere Zahl trägt.',
  },
  {
    slug: 'zahlen-pruefen',
    titel: 'Zahlen und Lösungen nachprüfen lassen',
    feld: 'Prüfen & Kontrollieren',
    zweck:
      'Der wichtigste Prompt der Sammlung: Ein zweiter Durchgang, der die eigene vorherige Antwort kontrolliert.',
    prompt: `Prüfe die folgenden Aufgaben mit Lösungen auf Fehler: [AUFGABEN MIT LÖSUNGEN EINFÜGEN]

Gehe so vor:
1. Rechne jede Aufgabe unabhängig neu, ohne die angegebene Lösung zu berücksichtigen.
2. Vergleiche erst danach mit der angegebenen Lösung.
3. Liste NUR die Abweichungen auf, mit korrigierter Lösung und Rechenweg.
4. Prüfe zusätzlich: Sind alle Zwischenergebnisse im Kopf rechenbar? Sind Einheiten durchgehend richtig? Gibt es Aufgaben ohne Lösung im vorgesehenen Zahlbereich?

Wenn du keine Fehler findest, sage das ausdrücklich – erfinde keine.`,
    pruefen:
      'Diesen Prompt immer nach jedem Erzeugen-Prompt laufen lassen, am besten in einem neuen Chat ohne den vorherigen Kontext.',
  },
  {
    slug: 'elternbrief',
    titel: 'Rückmeldung an Eltern formulieren',
    feld: 'Kommunikation',
    zweck:
      'Eine sachliche, freundliche Rückmeldung, die konkret bleibt – ohne Schülerdaten in das Modell zu geben.',
    prompt: `Formuliere eine kurze, sachliche Rückmeldung an Eltern zu einer Leistungsentwicklung im Fach Mathematik.

Situation (anonymisiert): [SACHVERHALT OHNE NAMEN, OHNE KLASSE, OHNE ERKENNBARE DETAILS]

Randbedingungen:
- Höflich, wertschätzend, ohne Floskeln.
- Konkret: Was genau ist die fachliche Lücke, woran wurde das festgestellt.
- Ein umsetzbarer Vorschlag für zu Hause, der höchstens 15 Minuten pro Tag kostet.
- Keine Diagnosen, keine Prognosen, keine Vermutungen über Ursachen.
- Höchstens 150 Wörter.

Ausgabe: der Text, dann eine Variante in etwas wärmerem Ton.`,
    pruefen:
      'Nie personenbezogene Daten eingeben. Formulieren Sie die Situation abstrakt und setzen Sie Namen erst im fertigen Brief ein.',
  },
  {
    slug: 'stundeneinstieg',
    titel: 'Drei Einstiege zur Auswahl',
    feld: 'Planung',
    zweck: 'Wenn der Einstieg fehlt und die Stunde in zwölf Stunden beginnt.',
    prompt: `Ich unterrichte [THEMA] in Klasse [KLASSE]. Vorwissen der Klasse: [VORWISSEN].

Entwirf drei verschiedene Einstiege von je 5–8 Minuten:
A) ein Problem, das die Klasse mit dem Vorwissen fast, aber nicht ganz lösen kann
B) ein Widerspruch oder ein überraschendes Ergebnis, das Erklärungsbedarf erzeugt
C) eine Beobachtungsaufgabe an einer Aufgabenreihe (was ändert sich, was bleibt?)

Für jeden Einstieg:
- der genaue Wortlaut des Impulses
- was die Klasse dabei tut (nicht: was ich tue)
- der Satz, mit dem ich zum Hauptteil überleite
- warum dieser Einstieg zum Ziel passt.`,
    pruefen:
      'Wählen Sie den Einstieg, der zum Ziel führt – nicht den unterhaltsamsten. Motivation ohne Bezug kostet fünf Minuten und bringt nichts.',
  },
];

export const promptFelder: PromptFeld[] = [
  'Aufgaben erzeugen',
  'Diagnose',
  'Differenzierung',
  'Planung',
  'Prüfen & Kontrollieren',
  'Kommunikation',
];
