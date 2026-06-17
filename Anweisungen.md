# Anweisungen: Neue Handreichung

Dieser Ordner ist die Übergabe an einen neuen Task. Er liegt außerhalb von
`public/` und ist per `.gitignore` ausgeschlossen – wird also **nicht**
veröffentlicht und nicht committet.

---

## TEIL A — Was DU mir gibst (Minimum)

Im Normalfall reicht das hier; alles andere leite ich selbst ab.

- **Die drei Quelldateien** in diesen Ordner legen (oder im Chat hochladen).
- **Sonst nichts Pflicht.** Optional, falls du es steuern willst:
  - Arbeitstitel / gewünschter Dateiname:
  - Schwerpunkt oder Aspekt, der besonders betont werden soll:
  - Soll eine Quelle Leittext sein (sonst gewichte ich sie gleichwertig)?
  - Medien vorhanden? Infografik-/Video-/PDF-Datei beilegen (sonst: keine,
    bzw. Infografik auf Wunsch von mir erzeugen lassen).

Schreib im neuen Task einfach: *„Erstelle eine neue Handreichung gemäß
`_neue-handreichung/Anweisungen.md` und den Quelldateien dort."*
Ich stelle dann höchstens ein, zwei gezielte Rückfragen und baue los.

---

## TEIL B — Meine Standard-Maßgaben (so baue ich, wenn du nichts anderes sagst)

So entstehen Seiten wie `handreichung-pu.html` und `handreichung-lernziele.html`.
Was dir hier nicht passt, überschreib einfach in Teil A.

### Aufbau & Design
- Eigenständige statische HTML-Seite in `public/ausb/`, eingebunden über das
  zentrale Design-System `Vorlage/handreichung-style.css` (keine eigenen Farben/
  Größen – ausschließlich die vorhandenen CSS-Tokens; seitenspezifisches CSS nur
  in einem `<style>`-Block, der dieselben Tokens nutzt).
- Standardbausteine in dieser Reihenfolge:
  1. `header.gov` (Wappen + Titel, Link auf `/ausb/`); `l3` = „Handreichung · <Thema>",
     Tag oben rechts als kurze Kennzeichnung.
  2. `.hero`: Eyebrow, `h1` mit **einem** hervorgehobenen Wort (`<span class="q">`),
     2–3 Sätze Lead.
  3. `nav.toc`: „Auf einen Blick" mit Sprungmarken zu allen Abschnitten.
  4. Optional direkt darunter: Infografik (`.info > figure.poster`, klickbar =
     Vollbild) und Video (`.videowrap`, Infografik als Poster) – analog den
     bestehenden Seiten.
  5. Inhalt in `section.art` mit nummerierten Überschriften (`<span class="num">`),
     erster Absatz `.first`.
  6. `footer.src`: Quellen/Literatur, Rechtszeile `.legal`
     (Übersicht · Impressum · Datenschutz), `.printline`.
- Wiederkehrende Stilmittel je nach Inhalt: `blockquote` (grün = Gebote/Empfehlung
  via `--pp`, rot = Verbote/Warnung via `--m`), `.tablewrap > table` mit `caption`
  für Negativ-/Positiv-Gegenüberstellungen und Übersichten, `.toolbox` für
  Zwei-Spalten-Konzeptkästen, `details`-Aufklappboxen für FAQ/Sorgen, `.reflect`
  (roter Kasten) als Abschlussreflexion. `.formula`/KaTeX-Schreibweise für
  mathematische Ausdrücke.

### Inhalt & Ton
- Zielgruppe: Referendar:innen / Lehrkräfte im Vorbereitungsdienst, Fach Mathematik.
- Anrede: **Sie**, sachlich-fachdidaktisch, evidenzbasiert; relevante Quellen werden
  benannt (z. B. Smith & Stein, Liljedahl) und im Footer geführt.
- Prägnant und praxisnah: jede Aussage soll im Unterricht oder Prüfungsgespräch
  begründbar sein. Fettungen sparsam für Schlüsselbegriffe, keine Füllfloskeln.
- Gliederung leite ich aus den drei Quellen ab (sinnvolle didaktische Reihenfolge,
  nicht bloß Inhaltswiedergabe), verdichte Redundanzen und löse Widersprüche der
  Quellen sichtbar auf.

### Konventionen (Technik)
- Dateiname klein, ohne Umlaute/Leerzeichen: `handreichung-<thema>.html`
  (Server ist case-sensitiv).
- Bilder nach `public/ausb/medien/` mit ASCII-Namen (`<Thema>_Infografik.png`);
  Videos nach `public/downloads/` (ASCII), im HTML root-relativ als `/downloads/…`.
- Favicon- und Rechtslinks gehören inzwischen zum Standard und sind automatisch dabei.
- Auf Wunsch ergänze ich auf der Übersicht `index.html` eine passende Karte
  (Farbe grün/blau/gold); sag mir Farbe und Kurztext, sonst schlage ich beides vor.
- Begleit-PDF (Download) verlinke ich im Footer, falls eine Datei beiliegt.

### Was ich NICHT eigenmächtig tue
- Commit/Push (das machst du in GitHub Desktop).
- Inhalte erfinden, die nicht durch die Quellen gedeckt sind – im Zweifel frage ich nach.
