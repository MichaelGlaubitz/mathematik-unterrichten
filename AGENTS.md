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
- **Pflicht für Koordinatensysteme:** Immer beide Achsen beschriften (mit Variablennamen), auf beiden Achsen Skalenticks anzeigen und Pfeilspitzen in positiver Richtung setzen.
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
