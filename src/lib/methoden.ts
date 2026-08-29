/**
 * Der Methodenkoffer.
 *
 * Jede Methode ist so beschrieben, dass sie in der nächsten Stunde eingesetzt
 * werden kann: drei Schritte, ein Zeitbedarf, ein bekannter Stolperstein und
 * die Belegstelle aus der Forschung. Kein Methodenlexikon, sondern eine
 * Handlungsanweisung.
 */

export type MethodenFeld =
  | 'Diagnose'
  | 'Gesprächsführung'
  | 'Aufgabenkultur'
  | 'Üben & Behalten'
  | 'Unterrichtsdesign';

export interface Methode {
  slug: string;
  name: string;
  /** Ein Satz: Was ist das? */
  kurz: string;
  feld: MethodenFeld;
  /** Wie lange dauert der Einsatz in der Stunde? */
  dauer: string;
  /** Wofür ist die Methode das richtige Mittel? */
  wofuer: string;
  /** Genau drei Schritte – das ist die Zusage „morgen früh einsetzbar“. */
  schritte: [string, string, string];
  /** Was schiefgeht, wenn man es zum ersten Mal macht. */
  stolperstein: string;
  /** Woher der Anspruch kommt, dass es wirkt. */
  forschung: string;
  /** Weiterführende Links auf dieser Seite. */
  links: { text: string; href: string }[];
}

export const methoden: Methode[] = [
  {
    slug: 'diagnostische-fragen',
    name: 'Diagnostische Fragen',
    kurz: 'Eine Multiple-Choice-Frage, bei der jede falsche Antwort eine bestimmte Fehlvorstellung verrät.',
    feld: 'Diagnose',
    dauer: '2–4 Minuten',
    wofuer:
      'Wenn Sie wissen müssen, ob die Klasse den nächsten Schritt trägt – und zwar bevor Sie ihn gehen. Eine gute diagnostische Frage unterscheidet nicht „richtig“ von „falsch“, sondern zeigt, welcher Denkfehler dahintersteckt.',
    schritte: [
      'Eine Frage wählen, deren Distraktoren je einen typischen Fehler abbilden (nicht: irgendwelche falschen Zahlen).',
      'Alle antworten gleichzeitig – Mini-Whiteboard, Finger (A = 1 Finger) oder Abstimmkarten. Kein Melden.',
      'Nach der Verteilung entscheiden: über 80 % richtig → weiter; unter 50 % → gemeinsam neu ansetzen; dazwischen → zweite Runde mit veränderter Aufgabe.',
    ],
    stolperstein:
      'Distraktoren, die niemand wählt, sind wertlos. Wenn 90 % der falschen Antworten auf eine Option fallen, ist die Frage gut – die anderen Optionen kann man ersetzen.',
    forschung:
      'Dylan Wiliam beschreibt solche „Hinge Questions“ als Kern formativen Assessments; Craig Barton hat das Format für den Mathematikunterricht systematisiert (Diagnostic Questions).',
    links: [
      { text: 'Fertige Quizzes', href: '/quizzes' },
      { text: 'Werkzeug: Abstimmung', href: '/werkzeuge/abstimmung.html' },
      { text: 'Werkzeug: Whiteboard-Check', href: '/werkzeuge/whiteboard-check.html' },
      { text: 'Blog: Hinge Questions', href: '/blog/hinge-questions' },
    ],
  },
  {
    slug: 'mini-whiteboards',
    name: 'Mini-Whiteboards',
    kurz: 'Alle antworten gleichzeitig und sichtbar – aus einer Stichprobe von zwei Meldungen wird eine Vollerhebung.',
    feld: 'Diagnose',
    dauer: '30 Sekunden pro Aufgabe',
    wofuer:
      'Für kurze Antworten: eine Zahl, ein Term, eine Skizze. Der eigentliche Gewinn ist nicht das Schreiben, sondern dass Sie in einem Blick 28 Antworten sehen statt der zwei, die sich gemeldet hätten.',
    schritte: [
      'Aufgabe zeigen, Denkzeit ansagen („20 Sekunden, noch nicht hochhalten“).',
      'Auf ein Zeichen halten alle gleichzeitig hoch – gleichzeitig ist entscheidend, sonst wird abgeschrieben.',
      'Klassenbild lesen und laut benennen: „Vier von euch haben hier den Nenner addiert – schauen wir uns das an.“',
    ],
    stolperstein:
      'Die Boards werden zur Beschäftigungstherapie, wenn die Frage zu lang ist. Faustregel: Was länger als eine Zeile Antwort braucht, gehört ins Heft.',
    forschung:
      'Formatives Assessment gehört zu den wirksamsten Unterrichtsroutinen überhaupt; entscheidend ist, dass die Rückmeldung den <em>nächsten</em> Schritt der Lehrkraft verändert, nicht erst die Klausurnote.',
    links: [
      { text: 'Werkzeug: Whiteboard-Check', href: '/werkzeuge/whiteboard-check.html' },
      { text: 'Werkzeug: Antwortkarte (fürs Tablet)', href: '/werkzeuge/antwortkarte.html' },
      { text: 'Mini-Whiteboard-Aufgaben nach Thema', href: '/themen' },
    ],
  },
  {
    slug: 'think-pair-share',
    name: 'Think – Pair – Share',
    kurz: 'Erst allein denken, dann zu zweit vergleichen, dann im Plenum – in genau dieser Reihenfolge.',
    feld: 'Gesprächsführung',
    dauer: '6–10 Minuten',
    wofuer:
      'Gegen das häufigste Problem im Unterrichtsgespräch: Dieselben fünf Personen antworten, der Rest hat noch gar nicht angefangen zu denken. Die stille Phase ist nicht Vorbereitung, sie ist der eigentliche Lernmoment.',
    schritte: [
      'Frage stellen und ausdrücklich Stille anordnen: 60–120 Sekunden, nichts sagen, nichts vergleichen.',
      'Zu zweit vergleichen mit klarem Auftrag: „Wo unterscheiden sich eure Wege?“ – nicht „einigt euch“.',
      'Im Plenum gezielt aufrufen (nicht melden lassen) und die Wege in bewusster Reihenfolge nebeneinanderstellen.',
    ],
    stolperstein:
      'Die stille Phase wird abgekürzt, weil es sich lang anfühlt. 90 Sekunden Stille im Klassenraum sind für die Lehrkraft unangenehm und für die Klasse produktiv.',
    forschung:
      'Wartezeit („wait time“) von mehr als drei Sekunden verändert Antwortlänge, Beteiligung und Qualität der Begründungen messbar – ein Befund, der seit den Arbeiten von Mary Budd Rowe immer wieder repliziert wurde.',
    links: [
      { text: 'Werkzeug: Unterrichts-Timer', href: '/werkzeuge/unterrichts-timer.html' },
      { text: 'Handreichung: Produktive Unterrichtsgespräche', href: '/ausb/Produktive-Unterrichtsgespraeche.html' },
    ],
  },
  {
    slug: 'kaltes-aufrufen',
    name: 'Kaltes Aufrufen',
    kurz: 'Alle können drankommen, niemand muss sich melden – Aufmerksamkeit wird zur Norm, nicht zur Freiwilligkeit.',
    feld: 'Gesprächsführung',
    dauer: 'durchgehend',
    wofuer:
      'Melden ist ein Selbstauswahlverfahren: Es kommen die dran, die es ohnehin können. Kaltes Aufrufen dreht das um – vorausgesetzt, es ist angekündigt, berechenbar und mit Denkzeit verbunden.',
    schritte: [
      'Regel einmal erklären und begründen: „Ich rufe auf, weil ich wissen will, wie ihr alle denkt. Es ist kein Test.“',
      'Immer erst die Frage, dann Denkzeit, dann der Name – nie umgekehrt.',
      'Bei „Ich weiß nicht“: nicht weitergehen, sondern zurückkommen. „Ich frage dich gleich noch einmal“ – und das dann auch tun.',
    ],
    stolperstein:
      'Ohne Denkzeit wird kaltes Aufrufen zum Bloßstellen. Der Unterschied zwischen einer produktiven und einer angstbesetzten Klasse liegt in diesen drei Sekunden.',
    forschung:
      'Zufälliges, sichtbar faires Aufrufen erhöht die Beteiligung breit – Peter Liljedahl beschreibt es als Teil des „denkenden Klassenzimmers“, in dem sichtbare Zufälligkeit die Akzeptanz erzeugt.',
    links: [
      { text: 'Werkzeug: Zufallsgruppen & Aufrufen', href: '/werkzeuge/zufalls-gruppen.html' },
      { text: 'Handreichung: Denkendes Klassenzimmer', href: '/ausb/handreichung-denkende-klassenzimmer.html' },
    ],
  },
  {
    slug: 'fuenf-praktiken',
    name: 'Die 5 Praktiken',
    kurz: 'Anticipate, Monitor, Select, Sequence, Connect – Schülerlösungen in bewusster Reihenfolge zu einem Ergebnis führen.',
    feld: 'Gesprächsführung',
    dauer: 'eine ganze Stunde',
    wofuer:
      'Für Stunden, in denen die Klasse eine Aufgabe eigenständig löst und Sie danach nicht wissen, wie Sie aus fünf verschiedenen Wegen ein gemeinsames Ergebnis machen. Die 5 Praktiken lösen genau dieses Problem – vor der Stunde, nicht in ihr.',
    schritte: [
      'Vorher: Aufgabe selbst lösen und aufschreiben, welche Wege (auch falsche) zu erwarten sind – das ist „anticipate“.',
      'Während der Arbeitsphase mit Klemmbrett herumgehen, Wege notieren und drei bis vier auswählen.',
      'Reihenfolge festlegen (vom naheliegenden zum tragfähigen Weg) und beim Präsentieren die Wege explizit aufeinander beziehen: „Wo steckt Bens Idee in Amiras Rechnung?“',
    ],
    stolperstein:
      'Ohne die Vorarbeit wird aus „Select & Sequence“ eine Reihe unverbundener Vorträge. Die Verbindung am Ende ist der eigentliche Ertrag – dafür muss Zeit reserviert bleiben.',
    forschung:
      'Margaret Smith und Mary Kay Stein: „5 Practices for Orchestrating Productive Mathematics Discussions“ – das methodische Rückgrat problemorientierter Mathematikstunden.',
    links: [
      { text: 'Handreichung: Produktive Unterrichtsgespräche', href: '/ausb/Produktive-Unterrichtsgespraeche.html' },
      { text: 'Werkzeug: Unterrichts-Timer', href: '/werkzeuge/unterrichts-timer.html' },
      { text: 'Das KLAR-Konzept', href: '/konzept' },
    ],
  },
  {
    slug: 'variation-theory',
    name: 'Intelligentes Üben (Variation)',
    kurz: 'Aufgaben so anordnen, dass die Reihenfolge selbst etwas erklärt – eine Größe ändert sich, alles andere bleibt.',
    feld: 'Aufgabenkultur',
    dauer: '10–20 Minuten',
    wofuer:
      'Gegen Arbeitsblätter mit 20 zufälligen Aufgaben. Wenn sich von Aufgabe zu Aufgabe genau eine Sache ändert, wird die Struktur sichtbar – und die Klasse fängt an zu <em>bemerken</em> statt nur zu rechnen.',
    schritte: [
      'Eine Aufgabenfolge bauen, bei der sich zwischen zwei Aufgaben genau ein Merkmal ändert.',
      'Nach jeder zweiten Aufgabe fragen: „Was hat sich verändert – und was hat das mit dem Ergebnis gemacht?“',
      'Am Ende die Klasse den Zusammenhang formulieren lassen, nicht selbst zusammenfassen.',
    ],
    stolperstein:
      'Wenn sich zwei Dinge gleichzeitig ändern, ist die Variation didaktisch wertlos: Die Klasse kann die Wirkung nicht mehr zuordnen.',
    forschung:
      'Variationstheorie nach Ference Marton; im Mathematikunterricht ausgearbeitet unter anderem von Craig Barton und der Website variationtheory.com.',
    links: [
      { text: 'Aufgabensammlung', href: '/aufgaben' },
      { text: 'Werkzeug: Funktionenplotter', href: '/werkzeuge/funktionenplotter.html' },
      { text: 'Blog: Variation Theory kurz erklärt', href: '/blog/variation-theory-kurz-erklaert' },
    ],
  },
  {
    slug: 'worked-examples',
    name: 'Beispiel-Aufgabe-Paare',
    kurz: 'Ein vollständig gerechnetes Beispiel links, die fast gleiche Aufgabe rechts – abwechselnd, nicht als Block.',
    feld: 'Aufgabenkultur',
    dauer: '15 Minuten',
    wofuer:
      'Bei neuen Verfahren mit vielen Schritten. Anfänger lernen aus ausgearbeiteten Lösungen mehr als aus eigenem Probieren – aber nur, wenn sie unmittelbar danach selbst rechnen.',
    schritte: [
      'Das Beispiel nicht vorlesen, sondern eine Minute still lesen lassen mit dem Auftrag: „Wo passiert der eigentliche Trick?“',
      'Die Parallelaufgabe sofort danach – gleiche Struktur, andere Zahlen.',
      'Nach drei Paaren die Beispiele wegnehmen („faded example“) und nur noch die Aufgaben stellen.',
    ],
    stolperstein:
      'Fortgeschrittene verlieren durch ausgearbeitete Beispiele Zeit (Expertise-Umkehr-Effekt). Sobald das Verfahren sitzt, gehören die Beispiele weg.',
    forschung:
      'Worked-Example-Effekt aus der Cognitive Load Theory (Sweller u. a.); der Wechsel Beispiel–Aufgabe ist wirksamer als Blöcke von Beispielen gefolgt von Blöcken von Aufgaben.',
    links: [
      { text: 'Aufgabenfolgen mit Kommentar', href: '/aufgaben' },
      { text: 'Blog: Worked Examples – was die Forschung weiß', href: '/blog/worked-examples-was-die-forschung-weiss' },
    ],
  },
  {
    slug: 'retrieval-practice',
    name: 'Retrieval Practice',
    kurz: 'Abrufen statt Nachlesen: kurze, unbenotete Abfragen zu Stoff, der schon zwei Wochen zurückliegt.',
    feld: 'Üben & Behalten',
    dauer: '5 Minuten',
    wofuer:
      'Gegen das Verschwinden von Grundlagen. Der Akt des Erinnerns selbst festigt das Wissen stärker als jedes erneute Erklären – deshalb ist die Abfrage kein Test, sondern das Üben.',
    schritte: [
      'Fünf Aufgaben zum Stundenbeginn: zwei aus der letzten Stunde, zwei aus dem letzten Monat, eine aus dem letzten Halbjahr.',
      'Zwei Minuten still rechnen, dann Lösungen einblenden und selbst kontrollieren lassen.',
      'Nichts einsammeln, nichts benoten. Nur notieren, welche der fünf Aufgaben in der Klasse gehakt hat.',
    ],
    stolperstein:
      'Sobald die Abfrage benotet wird, kippt sie in eine Prüfungssituation – und der Effekt geht zurück, weil sie vermieden statt genutzt wird.',
    forschung:
      'Testing Effect: Roediger & Karpicke zeigen, dass wiederholtes Abrufen den Behaltensvorteil gegenüber wiederholtem Lesen über Wochen deutlich vergrößert.',
    links: [
      { text: 'Werkzeug: Kopfrechen-Sprint', href: '/werkzeuge/kopfrechen-sprint.html' },
      { text: 'Blog: Retrieval Practice', href: '/blog/retrieval-practice' },
    ],
  },
  {
    slug: 'spacing-interleaving',
    name: 'Spacing & Interleaving',
    kurz: 'Themen verteilen statt bündeln und Aufgabentypen mischen statt sortieren.',
    feld: 'Üben & Behalten',
    dauer: 'Planung der Reihe',
    wofuer:
      'Für die Frage, wie ein Halbjahresplan aussehen sollte. Geblocktes Üben fühlt sich für alle Beteiligten besser an – gemischtes Üben führt zu deutlich besserem Behalten und zur entscheidenden Fähigkeit, das <em>passende</em> Verfahren zu erkennen.',
    schritte: [
      'In jeder Übungsphase 20 % der Aufgaben aus früheren Themen ergänzen.',
      'Bei Verfahren, die verwechselt werden (Strahlensätze/Ähnlichkeit, Sinus/Kosinus), Aufgaben bewusst mischen statt zu sortieren.',
      'Der Klasse ansagen, dass es sich schwerer anfühlen wird – und warum das ein gutes Zeichen ist.',
    ],
    stolperstein:
      'Gemischtes Üben senkt die Leistung <em>während</em> der Übungsphase. Wer das nicht ankündigt, bekommt Widerstand von Klasse und Eltern.',
    forschung:
      'Wünschenswerte Erschwernisse („desirable difficulties“, Bjork); für Mathematik u. a. Rohrer & Taylor zum Interleaving verschiedener Aufgabentypen.',
    links: [
      { text: 'Werkzeug: Kopfrechen-Sprint', href: '/werkzeuge/kopfrechen-sprint.html' },
      { text: 'Übungsgeneratoren nach Thema', href: '/themen' },
      { text: 'Blog: Spacing und Interleaving', href: '/blog/spacing-und-interleaving' },
    ],
  },
  {
    slug: 'productive-failure',
    name: 'Productive Failure',
    kurz: 'Die Klasse ringt zuerst mit einem Problem, das sie noch nicht lösen kann – erst danach kommt die Erklärung.',
    feld: 'Unterrichtsdesign',
    dauer: 'eine Doppelstunde',
    wofuer:
      'Für die Einführung eines neuen Begriffs. Der scheinbare Umweg über eigene, unvollständige Lösungsversuche macht die spätere Erklärung anschlussfähig: Die Klasse weiß dann, welches Problem das Verfahren löst.',
    schritte: [
      'Ein Problem stellen, das mit dem Vorwissen fast, aber nicht ganz lösbar ist – und ausdrücklich ansagen, dass mehrere Lösungen entstehen dürfen.',
      '20 Minuten arbeiten lassen, ohne zu helfen. Notieren, welche Ansätze entstehen.',
      'Erst dann erklären – und dabei die Ansätze der Klasse als Ausgangspunkt nehmen: „Drei von euch haben es so versucht. Das funktioniert bis hierhin, und dann …“',
    ],
    stolperstein:
      'Wenn in der Erklärungsphase nicht an die Schülerlösungen angeknüpft wird, war das Ringen umsonst. Der Ertrag entsteht in der Verbindung, nicht im Scheitern.',
    forschung:
      'Manu Kapur: Lernende, die zuerst selbst (erfolglos) an einer Aufgabe arbeiten und danach Instruktion erhalten, erreichen bessere Übertragungsleistungen als Gruppen mit umgekehrter Reihenfolge.',
    links: [
      { text: 'Werkzeug: Unterrichts-Timer', href: '/werkzeuge/unterrichts-timer.html' },
      { text: 'Werkzeug: Open-Middle-Werkstatt', href: '/werkzeuge/open-middle.html' },
      { text: 'Blog: Productive Failure', href: '/blog/productive-failure' },
      { text: 'Das KLAR-Konzept', href: '/konzept' },
    ],
  },
  {
    slug: 'denkendes-klassenzimmer',
    name: 'Denkendes Klassenzimmer',
    kurz: 'Sichtbar zufällige Dreiergruppen, senkrechte Flächen, keine Sitzplätze – der Raum verändert das Denken.',
    feld: 'Unterrichtsdesign',
    dauer: 'ganze Stunde',
    wofuer:
      'Wenn Gruppenarbeit regelmäßig darin endet, dass eine Person rechnet und zwei zuschauen. Die drei Bausteine – Zufallsgruppen, senkrechte Whiteboards, mündlicher Arbeitsauftrag – ändern das Verhalten schneller als jede Ermahnung.',
    schritte: [
      'Gruppen sichtbar auslosen, vor der Klasse, in jeder Stunde neu.',
      'An senkrechten Flächen arbeiten lassen (Fenster, Whiteboards, laminierte Bögen an der Wand) – nur ein Stift pro Gruppe.',
      'Den Auftrag mündlich geben, nicht als Arbeitsblatt, und beim Herumgehen nur Fragen zurückgeben.',
    ],
    stolperstein:
      'Ein Stift pro Gruppe klingt nach Detail, ist aber der Wirkmechanismus: Wer schreibt, denkt nicht mit – deshalb wandert der Stift.',
    forschung:
      'Peter Liljedahl: „Building Thinking Classrooms in Mathematics“ – vergleichende Beobachtungen zur Dauer aktiven Denkens unter verschiedenen Raum- und Gruppenbedingungen.',
    links: [
      { text: 'Werkzeug: Zufallsgruppen & Aufrufen', href: '/werkzeuge/zufalls-gruppen.html' },
      { text: 'Handreichung: Denkendes Klassenzimmer', href: '/ausb/handreichung-denkende-klassenzimmer.html' },
    ],
  },
  {
    slug: 'open-middle',
    name: 'Open Middle',
    kurz: 'Fester Anfang, festes Ende, viele Wege dazwischen – meist mit Ziffernkacheln und einer Optimierungsfrage.',
    feld: 'Aufgabenkultur',
    dauer: '10–15 Minuten',
    wofuer:
      'Für Differenzierung ohne drei Arbeitsblätter: Alle arbeiten an derselben Aufgabe, aber jede und jeder auf eigenem Niveau – die einen suchen eine Lösung, die anderen die beste.',
    schritte: [
      'Aufgabe zeigen und zuerst <em>irgendeine</em> gültige Belegung finden lassen. Alle haben damit ein Erfolgserlebnis.',
      'Dann die Optimierungsfrage stellen: größter Wert, kleinster Wert, am nächsten an einer Zielzahl.',
      'Am Ende nicht das Ergebnis, sondern die Strategie besprechen: „Woran hast du gemerkt, wohin die große Ziffer gehört?“',
    ],
    stolperstein:
      'Ohne die erste, niedrigschwellige Runde steigen schwächere Lernende sofort aus. Die Optimierungsfrage kommt immer zweitens.',
    forschung:
      'Open Middle geht auf Dan Meyer und Robert Kaplinsky zurück; die Aufgabenform verbindet niedrige Einstiegshürde mit hoher Decke („low floor, high ceiling“).',
    links: [
      { text: 'Werkzeug: Open-Middle-Werkstatt', href: '/werkzeuge/open-middle.html' },
      { text: 'Handreichung: Open Middle Math', href: '/ausb/handreichung-open-middle.html' },
    ],
  },
  {
    slug: 'wodb',
    name: 'Which One Doesn’t Belong?',
    kurz: 'Vier Objekte, für jedes lässt sich begründen, warum es das andere ist.',
    feld: 'Aufgabenkultur',
    dauer: '5–8 Minuten',
    wofuer:
      'Als Einstieg in Klassen, in denen wenig gesprochen wird. Weil es keine falsche Antwort gibt, sinkt die Hürde auf null – und trotzdem wird über Eigenschaften, Klassifikation und Fachsprache verhandelt.',
    schritte: [
      'Bild zeigen, zwei Minuten still denken lassen, jede Person notiert ein Feld plus Begründung.',
      'Zu zweit vergleichen – Auftrag: für <em>alle vier</em> Felder eine Begründung finden.',
      'Im Plenum die Begründungen sammeln und die Fachsprache nachschärfen: „Wie heißt das genau?“',
    ],
    stolperstein:
      'Wenn die Lehrkraft eine Antwort als „die richtige“ markiert, ist die Methode erledigt. Bewertet wird nur die Begründung.',
    forschung:
      'Format von Christopher Danielson (wodb.ca); es realisiert das, was Fachdidaktik unter „Begriffsbildung durch Kontrastieren“ fasst.',
    links: [
      { text: 'Werkzeug: WODB-Board', href: '/werkzeuge/wodb.html' },
      { text: 'Werkzeug: Unterrichts-Timer', href: '/werkzeuge/unterrichts-timer.html' },
    ],
  },
  {
    slug: 'exit-ticket',
    name: 'Exit-Ticket',
    kurz: 'Zwei Fragen in den letzten fünf Minuten, die messen, ob das Stundenziel trägt.',
    feld: 'Diagnose',
    dauer: '5 Minuten',
    wofuer:
      'Um am Ende der Stunde zu wissen, was am Anfang der nächsten passieren muss. Das Ticket misst nicht die Stimmung, sondern das Ziel – deshalb steht darin genau das, was Sie in der Stunde erreichen wollten.',
    schritte: [
      'Zwei Fragen vorbereiten: eine, die alle können müssen, und eine, die Verstehen von Nachmachen unterscheidet.',
      'Fünf Minuten vor Schluss austeilen, still bearbeiten lassen, an der Tür einsammeln.',
      'Beim Durchsehen in drei Stapel sortieren: trägt · wackelt · trägt nicht. Der mittlere Stapel liefert den Einstieg der nächsten Stunde.',
    ],
    stolperstein:
      'Fragen wie „Wie hat dir die Stunde gefallen?“ liefern nichts Steuerbares. Ein Exit-Ticket ohne Bezug zum Stundenziel ist verlorene Zeit.',
    forschung:
      'Klassisches Instrument formativen Assessments; die Wirkung entsteht ausschließlich dadurch, dass die Auswertung die nächste Stunde tatsächlich verändert.',
    links: [
      { text: 'Werkzeug: Exit-Ticket', href: '/werkzeuge/exit-ticket.html' },
      { text: 'Das KLAR-Konzept', href: '/konzept' },
    ],
  },
  {
    slug: 'fehler-als-material',
    name: 'Mit Fehlern arbeiten',
    kurz: 'Eine falsche Musterlösung an der Tafel – die Klasse sucht den Fehler und erklärt, wie er entstanden ist.',
    feld: 'Diagnose',
    dauer: '8 Minuten',
    wofuer:
      'Fehler sind keine Betriebsunfälle, sondern Daten. Wer den Fehler eines anderen erklären kann, hat den Begriff verstanden – und die eigene Fehlvorstellung wird beim Erklären nebenbei mitkorrigiert.',
    schritte: [
      'Eine typische falsche Rechnung zeigen – anonymisiert oder erfunden, nie mit Namen.',
      'Zwei Aufträge nacheinander: „Wo genau geht es schief?“ und dann „Was hat sich die Person dabei gedacht?“ Der zweite ist der wichtige.',
      'Die Klasse formuliert eine Merkregel, die genau diesen Fehler verhindert – in eigenen Worten, nicht in Ihren.',
    ],
    stolperstein:
      'Echte Schülerarbeiten nur anonymisiert zeigen. Sobald erkennbar ist, von wem die Lösung stammt, lernt die Klasse etwas anderes als Mathematik.',
    forschung:
      'Arbeiten zur Fehlerkultur im Mathematikunterricht zeigen, dass die Analyse falscher Lösungen den Aufbau tragfähiger Grundvorstellungen unterstützt – vorausgesetzt, das Klima lässt Fehler zu.',
    links: [
      { text: 'Fehlvorstellungs-Katalog', href: '/fehlvorstellungen' },
      { text: 'Werkzeug: Abstimmung', href: '/werkzeuge/abstimmung.html' },
      { text: 'Blog: Fehlvorstellungen sind Daten', href: '/blog/fehlvorstellungen-sind-daten' },
    ],
  },
  {
    slug: 'mathe-trails',
    name: 'Mathe-Trails',
    kurz: 'Mathematikaufgaben an realen Orten – der Schulhof wird zur Aufgabensammlung.',
    feld: 'Unterrichtsdesign',
    dauer: 'Doppelstunde',
    wofuer:
      'Wenn Modellieren im Unterricht immer nur als Textaufgabe stattfindet. Draußen gibt es keine gegebenen Zahlen: Die Klasse muss entscheiden, was gemessen wird, wie genau, und was „ungefähr“ hier bedeutet.',
    schritte: [
      'Drei bis fünf Stationen auf dem Schulgelände festlegen, jede mit einer Frage, die nur vor Ort beantwortbar ist.',
      'In Zweiergruppen mit Maßband und Handy losschicken; Zeit pro Station vorher festlegen.',
      'Im Klassenraum die Ergebnisse vergleichen – die Streuung zwischen den Gruppen ist der eigentliche Gesprächsanlass.',
    ],
    stolperstein:
      'Ohne feste Zeit pro Station kommt die Hälfte der Klasse nicht bis zur letzten Aufgabe. Lieber drei Stationen richtig als sechs halb.',
    forschung:
      'Konzept der Mathematik-Wanderpfade; digital unterstützt durch MathCityMap (Universität Frankfurt) mit Aufgabenpool und Sofortrückmeldung.',
    links: [
      { text: 'Handreichung: Mathe-Trails & MathCityMap', href: '/ausb/handreichung-mathe-trails.html' },
    ],
  },
];

export const methodenFelder: MethodenFeld[] = [
  'Diagnose',
  'Gesprächsführung',
  'Aufgabenkultur',
  'Üben & Behalten',
  'Unterrichtsdesign',
];
