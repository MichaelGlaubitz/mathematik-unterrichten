# AGENTS.md

## Diagramm-Workflow (Barton-Methode)

Diese Regeln gelten für alle Anfragen zu mathematischen Diagrammen, Aufgabenserien und Arbeitsblättern.

### 1) Interview-Modus vor jeder Code-Generierung

Vor der Ausgabe von Code müssen diese vier Pflichtparameter geklärt sein:

1. **Lernziel und Aufgabenmenge**  
   Was genau soll geübt werden, und wie viele Aufgaben/Diagramme werden benötigt?
2. **Variationsstrategie**  
   Was soll zwischen Aufgaben variieren (z. B. Rotation, gesuchte Größe, Skalierung), was bleibt konstant?
3. **Numerische Constraints**  
   Ganzzahlen, Rundungsregeln, erlaubte Wertebereiche, ggf. Sonderfälle.
4. **Technisches Ausgabeformat**  
   TikZ/LaTeX, Python/Matplotlib oder SVG/HTML; ggf. Aufteilung in mehrere Dateien.

Wenn ein Pflichtparameter fehlt, wird **kein Code** erzeugt. Stattdessen folgen kurze, präzise Rückfragen.

### 2) Strikte mathematische und visuelle Konsistenz

- Längenverhältnisse im Diagramm müssen den Zahlenwerten entsprechen.
- Keine optisch-numerischen Widersprüche.
- Labels, Winkelmarken und Kanten dürfen sich nicht unleserlich überlagern.
- Standard: gegebene Werte als Integer; nicht-ganzzahlige Resultate auf eine Dezimalstelle, sofern nicht anders gefordert.
- **Pflicht für Koordinatensysteme:** Immer beide Achsen beschriften (mit Variablennamen), auf beiden Achsen Skalenticks anzeigen und Pfeilspitzen in positiver Richtung setzen. Die positiven Achsen müssen jeweils mindestens bis +2 gehen, um unschöne Überlagerungen von Pfeilspitzen und Beschriftungen im Ursprungsbereich zu vermeiden.
- **Pflicht für alle Diagramme:** Inline-Zoom mit `+` / `−` bereitstellen (feinstufige Vergrößerung/Verkleinerung), damit SVGs ohne Pixelation skaliert werden können.

### 3) Didaktische Variation (Variation Theory)

- Aufgabenserien systematisch variieren (z. B. Rotation/Spiegelung in mehreren Lagen).
- Pro Schritt möglichst nur eine didaktisch relevante Variable ändern.
- Musterlernen vermeiden, Konzeptlernen fördern.

### 4) Nur deterministische Outputs

- Keine stochastischen Text-to-Image-Beschreibungen für Mathe-Diagramme.
- Ausschließlich reproduzierbarer Code (TikZ, Python/Matplotlib, SVG/TS).
- Bei umfangreichen Sätzen modularisieren (z. B. Hauptdatei + Makro-/Hilfsdateien).

### 5) Ausgabeformat der Antwort

Wenn alle Parameter geklärt sind:

1. Kurzfassung in 2–3 Bulletpoints (Ziel + Constraints + Variation).
2. Vollständiger, ausführbarer Code.
3. Kurze Iterationsfrage für Feinanpassungen.

## Werkzeuge unter `public/werkzeuge/`

Die eigenständigen Unterrichtswerkzeuge folgen zusätzlich zu den
Diagramm-Regeln oben diesen Vorgaben. Sie sind keine Stilfrage, sondern die
Bedingung dafür, dass die Dateien im Klassenzimmer benutzbar bleiben.

1. **Eine Datei je Werkzeug.** Kein Framework, kein CDN, kein Build-Schritt.
   Erlaubt sind ausschließlich die gemeinsamen Dateien `werkzeug.css` und
   `werkzeug.js`. Damit läuft das Werkzeug auch dann weiter, wenn das Schulnetz
   während der Stunde ausfällt, und lässt sich per „Seite speichern“ vom Stick
   starten.
2. **Keine Datenübertragung.** Klassenlisten, Auswertungen und Einstellungen
   bleiben im `localStorage`. Es gibt keinen Server, der Schülerdaten
   entgegennimmt – auch nicht optional.
3. **Beamer zuerst.** Jedes Werkzeug muss im Beamer-Modus (`data-beamer="an"`,
   Taste `B`) aus der letzten Reihe lesbar sein. Bedienelemente mindestens
   2,4 rem hoch.
   Braucht ein Werkzeug die Buchstaben selbst – die Abstimmung zählt `A`–`E`,
   der Whiteboard-Check `R`/`H`/`F`/`N` –, dann gehört der `keydown`-Hörer in die
   **Capture-Phase** und muss `preventDefault()` **und** `stopPropagation()`
   rufen; sonst schaltet ein getipptes `B` mitten in der Erfassung den
   Beamer-Modus um. `werkzeug.js` steigt zusätzlich bei `defaultPrevented` aus.
   Wer so eine Taste belegt, übergibt `WZ.fuss()` als zweites Argument einen
   ehrlichen Tastenhinweis und sagt im Werkzeug, dass Beamer und Vollbild dann
   über die Knöpfe der Kopfleiste laufen.
4. **Hell und dunkel.** Farben ausschließlich über die CSS-Variablen aus
   `werkzeug.css`; keine festen Hex-Werte im Werkzeug-CSS, außer für
   Datenreihen in Diagrammen.
5. **Kein `eval`.** Nutzereingaben, die ausgewertet werden (Terme im
   Funktionenplotter), werden geparst, nicht ausgeführt.
6. **Nachrechenbar.** Wo ein Werkzeug Aufgaben erzeugt, muss die Lösung
   programmatisch überprüfbar sein. Für den Kopfrechen-Sprint gibt es dafür
   einen Browser-Test, der alle Bereiche und Stufen durchrechnet.
7. **Registrieren.** Jedes neue Werkzeug wird in `src/lib/werkzeuge.ts`
   eingetragen; Hub-Seite, Suchindex und Sitemap ziehen von dort.

## Cursor Cloud specific instructions

### Project overview

Static math-didactics site for German teachers, built with **Astro 4 + Tailwind + MDX + KaTeX**. No backend, no database, no Docker required. See `README.md` for full details.

### Key commands

| Task | Command |
|---|---|
| Install deps | `npm install` |
| Dev server | `npm run dev` (http://localhost:4321) |
| Build | `npm run build` |
| Tests | `npm run test` (Vitest) |
| Preview build | `npm run preview` |

No lint script is configured in this project.

### Caveats

- The dev server binds to port **4321** by default.
- Content is in `src/content/` (Markdown/MDX for blog+aufgaben, JSON for quizzes+themen). Content collection schemas live in `src/content/config.ts`.
- The admin editor at `/__admin-editor` requires an `ADMIN_EDIT_TOKEN` env var (see `.env.example`); it is optional for normal development.
- The published editor lives at `/admin` (`src/pages/admin.astro`). It writes to GitHub with the visitor's own fine-grained token from `localStorage` — there is no server and no shared secret. The file list is built at build time from the content collections; the pure text logic sits in `src/lib/redaktionText.ts` and must stay covered by `src/lib/redaktionText.test.ts`. Never re-serialise a whole frontmatter block there: only replace lines the parser fully understands.

## Best Practices & Lektionen für Arbeitsblätter (Slots & PDF)

### 1) Formatierung von Aufgabenstellungen im Arbeitsblatt-Modus
- **Trennzeichen & Einleitung**: Zwischen KaTeX-Formeln (z. B. `$x + 5 = -x - 1$`) und dem Antwort-Slot (`[[MU_AB:0]]`) muss immer ein Satzzeichen und eine klare Einleitung stehen, um visuelle Verschmelzungen (wie `-1 x = [ ]`) zu verhindern.  
  *Standard-Format*: `Löse die Gleichung $...$. Trage ein: ${abSpan}`.
- **Mathematische Variablen**: Variablen im Antwort-Vorspann (z. B. das $x$ in $x = [ ]$) müssen über `abItalicVarHtml('x')` im Serif-Italic-Stil formatiert werden (identisch zum KaTeX-Schrifttyp). Niemals als reiner Text (`x =`) ausgeben.

### 2) Integration neuer Slot-basierter Arbeitsblätter
Wird ein neues Thema als slot-basiertes Arbeitsblatt in `MassenuebungGeo.astro` registriert, müssen die folgenden Stellen in der Astro-Komponente angepasst werden:
- **Full-Chrome-Wrapper**: Die `id="ug-wb-slot-ab-full-chrome"` und Klassen-Bedingungen (am Anfang des HTML-Teils) müssen für die neue Variante aktiv sein.
- **Header & Titel**: Der H1-Titel des Arbeitsblatts muss unter `ug-wb-slot-ab-chrome` richtig gemappt werden (z. B. `'AB Lineare Gleichungen'`).
- **Layout-Raster**: Die Aufgaben-Liste (`#ug-liste`) muss für die neue Variante die zweispaltige Klasse `ug-wb-slot-ab-grid ... sm:grid-cols-2` erhalten.
- **Aktionen & Overlay**: Die Steuerungs-Fußleiste (`#ug-wb-slot-ab-actions`) sowie das Lösungs-Overlay (`#ug-wb-slot-ab-check-overlay`) müssen für die neue Variante freigeschaltet sein.

### 3) SVG-Befreiung von HTML-Tags für die PDF-Erstellung
- Diagramm-Funktionen kapseln SVGs im Web-UI oft in `<figure>`-Elemente.
- Der Client-Bild-Rasterisierer (`rasterizeSvgZuJpegBase64` / `rasterizeSvgZuPngBase64`) wirft Fehler (`SVG konnte nicht geladen werden`), wenn ein SVG-Blob HTML-Tags enthält.
- *Regel*: Vor der Rasterisierung müssen führende `<figure...>`- und schließende `</figure>`-Tags immer über Regex-Ersetzungen aus der SVG-XML-Zeichenkette entfernt werden, um ein valides SVG-Dokument zu erhalten.

