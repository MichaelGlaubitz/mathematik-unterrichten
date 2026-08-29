/**
 * Registry aller eigenständigen Unterrichtswerkzeuge.
 *
 * Die Werkzeuge liegen als einzelne, in sich geschlossene HTML-Dateien unter
 * `public/werkzeuge/`. Sie brauchen kein Framework, keinen Login und keine
 * Internetverbindung – genau deshalb sind sie im Klassenzimmer sofort
 * einsetzbar (auch auf dem alten Schulrechner am Beamer).
 *
 * Diese Datei ist die einzige Quelle der Wahrheit: Hub-Seite, Startseite,
 * Suchindex und Sitemap lesen alle hier.
 */

export type WerkzeugKategorie =
  | 'Unterrichtsablauf'
  | 'Diagnose'
  | 'Darstellung'
  | 'Aufgabenkultur'
  | 'Üben'
  | 'Material';

/** Wer bedient – siehe `Werkzeug.rolle`. */
export type WerkzeugRolle = 'Regie' | 'Schülergerät' | 'Vorbereitung';

/** Worauf es läuft – siehe `Werkzeug.medium`. */
export type WerkzeugMedium = 'Beamer' | 'Tablet' | 'Bildschirm' | 'Papier';

export interface Werkzeug {
  /** Dateiname ohne Endung unter public/werkzeuge/ */
  slug: string;
  titel: string;
  /** Ein Satz: Was tut es? */
  kurz: string;
  /** Zwei bis drei Sätze: Wofür im Unterricht? */
  beschreibung: string;
  kategorie: WerkzeugKategorie;
  /** Für welche Klassenstufen sinnvoll (Anzeige-Text). */
  stufe: string;
  /**
   * Wer das Werkzeug bedient. Die einzige Frage, die im Unterricht zählt:
   * „Regie“ zeigt Lösungen und Auswertungen und gehört darum nie auf ein
   * Schülergerät; „Schülergerät“ ist für die Hand der Klasse gebaut.
   *
   * Vorher stand hier ein Feld `einsatz` mit vier Werten, die zwei Fragen
   * vermischten – „Beamer“ und „Papier“ beschrieben das Ausgabemedium,
   * „Schülergerät“ und „Vorbereitung“ die Bedienung. Aus dem Etikett war
   * deshalb nicht ablesbar, was man wissen will.
   */
  rolle: WerkzeugRolle;
  /** Worauf es läuft. Zusatzinformation, keine Rollenaussage. */
  medium: WerkzeugMedium;
  /** Kurze Stichworte für die Volltextsuche. */
  schlagwoerter: string[];
  /** Optional: didaktischer Hintergrund, verlinkt auf Blog/Methoden. */
  hintergrund?: { text: string; href: string };
}

/**
 * Werkzeuge, die die Stundenvorlage auf *jeder* Stundenseite anbietet – die
 * Einstiegsfrage wandert per Link in die Abstimmung, beantwortet wird sie auf
 * Antwortkarten. Das steht in `src/pages/stunden/[slug].astro`, nicht im Text
 * der einzelnen Stunde, und wäre über die Fließtext-Suche unsichtbar.
 *
 * `src/lib/werkzeugFundstellen.test.ts` prüft, dass die Vorlage die beiden
 * wirklich verlinkt – die Liste hier darf nichts behaupten, was die Seite nicht
 * hält.
 */
export const AUF_JEDER_STUNDENSEITE = ['abstimmung', 'antwortkarte'] as const;

export const werkzeuge: Werkzeug[] = [
  {
    slug: 'unterrichts-timer',
    titel: 'Unterrichts-Timer',
    kurz: 'Sichtbarer Phasen-Timer für den Beamer – mit Denkzeit, Partnerphase und Gong.',
    beschreibung:
      'Legt die Phasen einer Stunde als Kette an (z. B. 90 s Denkzeit, 3 min Partnerphase, 5 min Sicherung) und zählt groß und ruhig herunter. Die Klasse sieht jederzeit, wie viel Zeit noch bleibt – das allein beendet die meisten „Wie lange noch?“-Zwischenrufe. Vorlagen für Think-Pair-Share, Einstein-Zeit und stille Übungsphasen sind hinterlegt.',
    kategorie: 'Unterrichtsablauf',
    stufe: 'alle',
    rolle: 'Regie',
    medium: 'Beamer',
    schlagwoerter: ['timer', 'stoppuhr', 'think-pair-share', 'denkzeit', 'phasen', 'countdown', 'einstein-zeit'],
    hintergrund: { text: 'Methode: Think – Pair – Share', href: '/methoden#think-pair-share' },
  },
  {
    slug: 'zufalls-gruppen',
    titel: 'Zufallsgruppen & Aufrufen',
    kurz: 'Sichtbar zufällige Gruppen und faires Aufrufen ohne Meldefinger.',
    beschreibung:
      'Klassenliste einmal einfügen – danach zieht das Werkzeug sichtbar zufällige Dreiergruppen (Liljedahl) oder ruft einzelne Lernende auf, ohne jemanden zweimal zu ziehen, bevor alle dran waren. Die Klasse sieht die Ziehung; genau diese Sichtbarkeit macht sie akzeptabel. Alles bleibt im Browser gespeichert, keine Namen verlassen den Rechner.',
    kategorie: 'Unterrichtsablauf',
    stufe: 'alle',
    rolle: 'Regie',
    medium: 'Beamer',
    schlagwoerter: ['gruppen', 'zufall', 'cold call', 'aufrufen', 'liljedahl', 'denkendes klassenzimmer', 'kein melden'],
    hintergrund: { text: 'Denkendes Klassenzimmer', href: '/ausb/handreichung-denkende-klassenzimmer.html' },
  },
  {
    slug: 'abstimmung',
    titel: 'Abstimmung',
    kurz: 'Die Stimmen einer diagnostischen Frage zählen und die Verteilung groß zeigen.',
    beschreibung:
      'Die Klasse antwortet gleichzeitig – mit Karten, Fingern oder Mini-Whiteboards –, Sie tippen auf die Balken und zählen mit. Die Verteilung steht sofort projizierbar da, dazu die Entscheidung, die daraus folgt: über 80 % weitergehen, unter 50 % neu ansetzen, dazwischen eine zweite Runde. Benannt wird außerdem die häufigste falsche Antwort – sie ist der eigentliche Ertrag einer diagnostischen Frage. Nichts wird übertragen; die Zahlen bleiben auf dem Gerät der Lehrkraft.',
    kategorie: 'Diagnose',
    stufe: 'alle',
    rolle: 'Regie',
    medium: 'Beamer',
    schlagwoerter: [
      'abstimmung',
      'verteilung',
      'diagnostische fragen',
      'stimmen zählen',
      'abstimmkarten',
      'hinge question',
      'distraktoren',
      'formatives assessment',
    ],
    hintergrund: { text: 'Methode: Diagnostische Fragen', href: '/methoden#diagnostische-fragen' },
  },
  {
    slug: 'antwortkarte',
    titel: 'Antwortkarte',
    kurz: 'Die kurze Antwort auf dem eigenen Gerät groß anzeigen und hochhalten – wie ein Mini-Whiteboard, nur lesbar.',
    beschreibung:
      'Die Klasse öffnet mathematik-unterrichten.de/karte, trägt eine kurze Antwort ein – getippt oder mit dem Stift geschrieben – und hält auf Ihr Zeichen hoch. Bis dahin bleibt die Karte verdeckt, der Nachbar sieht nichts. Die Schrift wird automatisch so groß gesetzt, wie sie auf den Bildschirm passt, damit Sie sie aus der ersten Reihe lesen können; Zeichen wie √, ², π und der Bruchstrich liegen als Tasten bereit. Gezählt wird wie bei Mini-Whiteboards: Sie gehen die Reihen durch und tippen im Whiteboard-Check mit (R richtig, H halb, F falsch, N nichts); für Fragen mit festen Antwortmöglichkeiten nehmen Sie die Abstimmung. Antworten wandern absichtlich nicht von den Geräten zu Ihrem Rechner – dafür bräuchte es einen Server, der Schülerantworten entgegennimmt, und den gibt es hier nicht. Der Rückkanal ist der Blick durch den Raum. Die Karte selbst ist eine Sackgasse: Von ihr führt kein Weg ins Lehrermaterial, damit auf dem Schülergerät nichts zu finden ist, was die Aufgabe verrät.',
    kategorie: 'Diagnose',
    stufe: 'alle',
    rolle: 'Schülergerät',
    medium: 'Tablet',
    schlagwoerter: ['mini-whiteboard', 'full response', 'ipad', 'tablet', 'kurzantwort', 'diagnose', 'anonym', 'datenschutz', 'bring your own device'],
    hintergrund: { text: 'Methode: Mini-Whiteboards', href: '/methoden#mini-whiteboards' },
  },
  {
    slug: 'whiteboard-check',
    titel: 'Whiteboard-Check',
    kurz: 'Die Mini-Whiteboard-Runde in Sekunden auswerten – anonym, über die Tastatur mitgezählt.',
    beschreibung:
      'Die Klasse hält die Whiteboards hoch, Sie zählen die Reihen durch und tippen dabei einfach mit: R richtig, H halb, F falsch, N nichts. Die Trefferquote steht sofort da, und die Ampel sagt, ob Sie weitergehen oder noch eine Runde brauchen – Full-Response statt Stichprobe. Die Erfassung ist bewusst anonym: Es wird gezählt, nie zugeordnet. Über mehrere Runden entsteht ein Klassenbild, das zeigt, welche Frage gehakt hat – ohne dass dafür je ein Name gespeichert werden müsste. Wer keine Whiteboards hat, lässt die Klasse die Antwortkarte auf dem Tablet hochhalten und zählt genauso durch.',
    kategorie: 'Diagnose',
    stufe: 'alle',
    rolle: 'Regie',
    medium: 'Bildschirm',
    schlagwoerter: ['mini-whiteboard', 'formatives assessment', 'hinge question', 'diagnose', 'full response', 'ampel', 'anonym', 'tastatur', 'datenschutz'],
    hintergrund: { text: 'Hinge Questions', href: '/blog/hinge-questions' },
  },
  {
    slug: 'funktionenplotter',
    titel: 'Funktionenplotter',
    kurz: 'Parameter am Schieberegler ziehen – der Graph antwortet sofort.',
    beschreibung:
      'Ein Plotter, der genau das kann, was im Unterricht gebraucht wird: bis zu drei Funktionen gleichzeitig, Parameter a, b, c an Schiebereglern, beschriftete Achsen mit Skalenticks, stufenloser Zoom. Gedacht für die Frage „Was passiert, wenn …?“ – also für Variation am lebenden Objekt, nicht für schöne Bilder.',
    kategorie: 'Darstellung',
    stufe: 'Klasse 7 – Oberstufe',
    rolle: 'Regie',
    medium: 'Beamer',
    schlagwoerter: ['funktionenplotter', 'graph', 'parameter', 'scheitelform', 'lineare funktion', 'parabel', 'sinus'],
    hintergrund: { text: 'Variation Theory', href: '/blog/variation-theory-kurz-erklaert' },
  },
  {
    slug: 'bruchstreifen',
    titel: 'Bruchstreifen',
    kurz: 'Brüche als Streifen, Kreis und Punkt auf dem Zahlenstrahl – nebeneinander.',
    beschreibung:
      'Derselbe Bruch in drei Darstellungen gleichzeitig, dazu Erweitern, Kürzen, Vergleichen und Addieren als Bewegung statt als Regel. Genau der Bruner-Dreischritt in einem Bild: Handlung, Bild, Symbol. Ideal, um die Frage „Warum wird beim Addieren nicht der Nenner addiert?“ ein für alle Mal sichtbar zu beantworten.',
    kategorie: 'Darstellung',
    stufe: 'Klasse 5 – 7',
    rolle: 'Regie',
    medium: 'Beamer',
    schlagwoerter: ['bruch', 'bruchrechnung', 'erweitern', 'kürzen', 'darstellung', 'bruner', 'zahlenstrahl'],
    hintergrund: { text: 'Konkret · bildlich · abstrakt', href: '/blog/bruner-konkret-bildlich-abstrakt' },
  },
  {
    slug: 'zahlenstrahl',
    titel: 'Zahlenstrahl & Stellenwert',
    kurz: 'Zoombarer Zahlenstrahl mit Stellenwerttafel – bis in die Nachkommastellen.',
    beschreibung:
      'Zwischen 0 und 1 liegt genauso viel wie zwischen 0 und 1000 – das glaubt niemand, bis er es gesehen hat. Der Zahlenstrahl zoomt stufenlos in die Dezimalen hinein, die Stellenwerttafel läuft synchron mit. Damit lassen sich die klassischen Fehlvorstellungen („0,7 ist kleiner als 0,25, weil 7 kleiner als 25“) direkt am Bild aufbrechen.',
    kategorie: 'Darstellung',
    stufe: 'Klasse 5 – 7',
    rolle: 'Regie',
    medium: 'Beamer',
    schlagwoerter: ['zahlenstrahl', 'stellenwert', 'dezimalzahlen', 'runden', 'negative zahlen', 'ordnen'],
    hintergrund: { text: 'Fehlvorstellungen sind Daten', href: '/blog/fehlvorstellungen-sind-daten' },
  },
  {
    slug: 'gleichungswaage',
    titel: 'Gleichungswaage',
    kurz: 'Äquivalenzumformungen als Waage – wer nur eine Seite verändert, sieht sie kippen.',
    beschreibung:
      'Die Gleichung a·x + b = c·x + d liegt als Gewichte auf einer Waage: blaue Kästchen sind x, braune Scheiben sind Einer. Jede Umformung wird angeklickt und auf beiden Seiten ausgeführt – die Waage bleibt im Gleichgewicht. Ein Schalter erlaubt bewusst den Fehler, nur links umzuformen; die Waage kippt sichtbar, und die Klasse erklärt, warum die Lösung danach nicht mehr stimmt. Nebenher entsteht das Rechenprotokoll für den Hefteintrag.',
    kategorie: 'Darstellung',
    stufe: 'Klasse 7–9',
    rolle: 'Regie',
    medium: 'Beamer',
    schlagwoerter: [
      'gleichung',
      'waage',
      'äquivalenzumformung',
      'gleichheitszeichen',
      'lineare gleichungen',
      'variable',
      'umformen',
    ],
    hintergrund: {
      text: 'Fehlvorstellungen: Lineare Gleichungen',
      href: '/fehlvorstellungen#thema-lineare-gleichungen',
    },
  },
  {
    slug: 'prozentstreifen',
    titel: 'Prozentstreifen',
    kurz: 'Doppelte Skala: oben die Größe, unten die Prozente – der Grundwert wird sichtbar.',
    beschreibung:
      'Ein Streifen mit zwei gekoppelten Skalen. Die Marke lässt sich ziehen; Grundwert, Prozentsatz und Prozentwert verändern sich zusammen und werden gleichzeitig als Dreisatz und als Faktor gezeigt. Damit ist die entscheidende Frage – welche Zahl ist das Ganze? – keine Regel mehr, sondern eine Ablesung. Ein Aufgabengenerator liefert Sachaufgaben zu allen drei Grundtypen mit Lösung.',
    kategorie: 'Darstellung',
    stufe: 'Klasse 6–9',
    rolle: 'Regie',
    medium: 'Beamer',
    schlagwoerter: [
      'prozent',
      'prozentrechnung',
      'grundwert',
      'prozentsatz',
      'prozentwert',
      'dreisatz',
      'streifen',
      'doppelte skala',
      'vermehrter grundwert',
    ],
    hintergrund: {
      text: 'Fehlvorstellungen: Prozentrechnung',
      href: '/fehlvorstellungen#thema-prozentrechnung',
    },
  },
  {
    slug: 'kopfrechen-sprint',
    titel: 'Kopfrechen-Sprint',
    kurz: 'Zwei Minuten Grundlagentraining zum Stundenbeginn – erzeugt, projiziert, ausgewertet.',
    beschreibung:
      'Erzeugt einen Satz Aufgaben zu einem Grundlagenbereich (Einmaleins, negative Zahlen, Prozente, Potenzen …), projiziert ihn mit Countdown und blendet auf Knopfdruck die Lösungen zur Selbstkontrolle ein. Als Retrieval Practice gedacht: kurz, häufig, ohne Note – und derselbe Satz lässt sich als Arbeitsblatt drucken.',
    kategorie: 'Üben',
    stufe: 'Klasse 5 – 10',
    rolle: 'Regie',
    medium: 'Beamer',
    schlagwoerter: ['kopfrechnen', 'retrieval practice', 'einmaleins', 'automatisierung', 'sprint', 'aufwärmen'],
    hintergrund: { text: 'Retrieval Practice', href: '/blog/retrieval-practice' },
  },
  {
    slug: 'wodb',
    titel: 'Which One Doesn’t Belong?',
    kurz: 'Vier Objekte, jede Antwort ist richtig – wenn die Begründung trägt.',
    beschreibung:
      'Vier Zahlen, Terme oder Figuren; jede von ihnen lässt sich als „die andere“ begründen. Der Einstieg, mit dem auch schwache Klassen reden, weil niemand falsch liegen kann. Enthält fertige Sets von Klasse 5 bis zur Oberstufe und einen Editor für eigene – inklusive Zahlen, Terme und selbst gezeichneter Figuren.',
    kategorie: 'Aufgabenkultur',
    stufe: 'Klasse 5 – Oberstufe',
    rolle: 'Regie',
    medium: 'Beamer',
    schlagwoerter: ['wodb', 'which one doesnt belong', 'einstieg', 'begründen', 'argumentieren', 'gesprächsanlass'],
    hintergrund: { text: 'Produktive Unterrichtsgespräche', href: '/ausb/Produktive-Unterrichtsgespraeche.html' },
  },
  {
    slug: 'open-middle',
    titel: 'Open-Middle-Werkstatt',
    kurz: 'Ziffern 0–9, jede genau einmal – eine Aufgabe, viele Wege, klare Prüfung.',
    beschreibung:
      'Open-Middle-Aufgaben mit Ziffernkacheln zum Ziehen und sofortiger Rückmeldung, ob die Belegung stimmt. Der Reiz liegt im Suchen: Gibt es mehrere Lösungen? Die beste? Enthält Aufgaben zu Termen, Gleichungen, Brüchen, Flächen und eine Vorlage für eigene.',
    kategorie: 'Aufgabenkultur',
    stufe: 'Klasse 5 – 10',
    rolle: 'Schülergerät',
    medium: 'Tablet',
    schlagwoerter: ['open middle', 'problemlösen', 'ziffernkacheln', 'differenzierung', 'reichhaltige aufgabe'],
    hintergrund: { text: 'Open Middle Math', href: '/ausb/handreichung-open-middle.html' },
  },
  {
    slug: 'zufallsexperimente',
    titel: 'Zufallsexperimente',
    kurz: 'Würfel, Münze, Urne und Galtonbrett – tausend Versuche in zwei Sekunden.',
    beschreibung:
      'Das Gesetz der großen Zahlen wird erst überzeugend, wenn man 10, 100 und 10 000 Versuche nebeneinander sieht. Das Werkzeug simuliert die klassischen Experimente, zeigt relative Häufigkeit gegen Versuchszahl und lässt die Klasse vorher schätzen. Für Stochastik von der Grundvorstellung bis zur Binomialverteilung.',
    kategorie: 'Darstellung',
    stufe: 'Klasse 6 – Oberstufe',
    rolle: 'Regie',
    medium: 'Beamer',
    schlagwoerter: ['stochastik', 'wahrscheinlichkeit', 'würfel', 'galtonbrett', 'gesetz der großen zahlen', 'simulation'],
    hintergrund: { text: 'Thema Stochastik', href: '/themen#thema-stochastik' },
  },
  {
    slug: 'klassenarbeit',
    titel: 'Klassenarbeits-Baukasten',
    kurz: 'Eine Arbeit zusammenstellen – mit Blick auf die Anforderungsbereiche und fertigem Erwartungshorizont.',
    beschreibung:
      'Aufgaben eintragen, Anforderungsbereich und Punkte festlegen – der Baukasten rechnet die Summe, zeigt die Verteilung auf AFB I, II und III gegen die üblichen Richtwerte und meldet, wenn die Arbeit nur Wiedergabe misst oder die erwartete Leistung irgendwo fehlt. Der Notenschlüssel ist umstellbar und rechnet die Prozentgrenzen in halbe Punkte um. Gedruckt werden drei Blätter: Angabenblatt mit Schreiblinien, Erwartungshorizont und Punkteliste für die Korrektur.',
    kategorie: 'Diagnose',
    stufe: 'alle',
    rolle: 'Vorbereitung',
    medium: 'Bildschirm',
    schlagwoerter: [
      'klassenarbeit',
      'klausur',
      'test',
      'anforderungsbereiche',
      'afb',
      'erwartungshorizont',
      'notenschlüssel',
      'punkte',
      'leistungsmessung',
      'korrektur',
    ],
    hintergrund: { text: 'Das KLAR-Konzept', href: '/konzept' },
  },
  {
    slug: 'karopapier',
    titel: 'Papier-Werkstatt',
    kurz: 'Karo-, Millimeter-, Koordinaten- und Isometriepapier – passgenau und sofort gedruckt.',
    beschreibung:
      'Das Papier, das im entscheidenden Moment fehlt: Koordinatensysteme mit gewählter Achsenteilung und Beschriftung, Karopapier in jeder Kästchengröße, Millimeter- und Isometriepapier, Bruchstreifen-Vorlagen. Direkt aus dem Browser auf DIN A4 gedruckt, ohne Konto und ohne Wasserzeichen.',
    kategorie: 'Material',
    stufe: 'alle',
    rolle: 'Vorbereitung',
    medium: 'Papier',
    schlagwoerter: ['karopapier', 'millimeterpapier', 'koordinatensystem', 'isometrie', 'drucken', 'vorlage', 'din a4'],
  },
  {
    slug: 'exit-ticket',
    titel: 'Exit-Ticket',
    kurz: 'Drei Fragen zum Stundenende – projiziert oder als Zettel für die Tür.',
    beschreibung:
      'Der R-Schritt des KLAR-Konzepts in seiner kleinsten Form: zwei bis drei Fragen, die messen, ob das Stundenziel trägt. Das Werkzeug stellt die Fragen zusammen, projiziert sie groß und druckt sie als Zettelbogen für die ganze Klasse – acht Tickets auf ein Blatt.',
    kategorie: 'Diagnose',
    stufe: 'alle',
    rolle: 'Regie',
    medium: 'Papier',
    schlagwoerter: ['exit ticket', 'stundenende', 'sicherung', 'klar', 'formatives assessment', 'ausgangskarte'],
    hintergrund: { text: 'Das KLAR-Konzept', href: '/konzept' },
  },
];

/** Reihenfolge, in der Kategorien auf der Hub-Seite erscheinen. */
export const werkzeugKategorien: WerkzeugKategorie[] = [
  'Unterrichtsablauf',
  'Diagnose',
  'Darstellung',
  'Aufgabenkultur',
  'Üben',
  'Material',
];

export const werkzeugPfad = (w: Werkzeug) => `/werkzeuge/${w.slug}.html`;
