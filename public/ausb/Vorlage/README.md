# Handreichung – Design-Vorlage

Wiederverwendbares Layout für Handreichungs-/One-Pager-Seiten im Stil von
*Produktive-Unterrichtsgespraeche.html* (Fachseminar Mathematik, Studienseminar Hameln).

## Dateien in diesem Ordner

| Datei | Zweck |
|---|---|
| `handreichung-style.css` | Das komplette Designsystem (Farben, Typografie, alle Komponenten). |
| `Vorlage-Handreichung.html` | Schlankes Template, das `handreichung-style.css` per `<link>` einbindet. **Empfohlen, wenn mehrere Seiten dasselbe Design teilen** (eine zentrale CSS pflegen). |
| `Vorlage-Handreichung-self-contained.html` | Gleiches Template, aber **alle Styles inline**. Ideal zum Weitergeben als einzelne Datei. |
| `assets/wappen.jpg` | Niedersächsisches Landeswappen (Sachsenross) für den Kopf. |

## So legst du eine neue Seite an

1. **Kopiere** eine der beiden Vorlagen und benenne sie um (z. B. `Bruchrechnung-Klasse5.html`).
2. Achte darauf, dass `handreichung-style.css` (bei der verlinkten Variante) und `assets/wappen.jpg`
   relativ zur neuen Datei erreichbar sind. Am einfachsten: neue Seite **im selben Ordner** wie die Vorlage
   ablegen – dann stimmen die Pfade. Liegt die Seite woanders, die Pfade in `<link>` und `src` anpassen.
3. Ersetze alle Platzhalter in eckigen Klammern `[...]` durch deine Inhalte.
4. Nicht benötigte Bausteine (Video, Tabelle, Werkzeugkasten …) einfach löschen.
5. Bilder/Videos in einen `medien/`-Unterordner legen und die `src`-Pfade anpassen.

## Bausteine (CSS-Klassen)

- **Kopf** `header.gov` – Wappen + drei Titelzeilen (`.l1` Rubrik, `.l2` Haupt, `.l3` Untertitel) + optionaler `.tag`-Badge.
- **Hero** `.hero` – `.eyebrow` (Rubrik), `h1` (Schlüsselwort in `<span class="q">` = Akzentfarbe), `.lead`.
- **Inhaltsverzeichnis** `nav.toc` – Sprungmarken auf die `id`s der Abschnitte.
- **Infografik** `.info` → `figure.poster` (großes, anklickbares Bild) + `.journey` mit `.step s1…s5`
  (farbcodierte Kacheln: grün, grün, gold, blau, rot) + `.foundation` (Hinweisband).
- **Video** `.videowrap` – responsives `<video>` mit `poster`.
- **Abschnitt** `section.art` mit `h2` (Nummer in `<span class="num">`); erster Absatz `class="first"`.
- **Zitat** `blockquote` (Standard blau; grün via `style="background:var(--pp-bg);border-left-color:var(--pp)"`).
- **Tabelle** `.tablewrap > table` (+ schmale Variante `.mini-chart`).
- **Werkzeugkasten** `.toolbox` – zweispaltig (`.tb-col.assess` blau / `.tb-col.advance` grün).
- **Reflexionsbox** `.reflect` (rot).
- **Quellen** `footer.src`.

## Farben (CSS-Variablen)

`--accent` #9a1b1b (Rot) · `--accent2` #2c5d8f (Blau) · `--pp/--p` Grün · `--o` Gold · `--m` Rotorange.
Zentrale Anpassung über die `:root`-Variablen in `handreichung-style.css` (bzw. im `<style>` der
self-contained Variante).

## Druck

Eine `@media print`-Regel blendet Video und Inhaltsverzeichnis aus und entfernt Schatten – die Seite
lässt sich also direkt sauber als PDF drucken.
