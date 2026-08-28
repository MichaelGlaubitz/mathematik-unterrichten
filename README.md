# mathematik-unterrichten.de

Statisch generierte Mathe-Didaktik-Seite für Lehrkräfte – inspiriert von [mrbartonmaths.com](https://mrbartonmaths.com/), aufgebaut mit [Astro](https://astro.build) und Tailwind.

## Was die Seite kann

### Inhalte (Content-Collections)

| Bereich | Inhaltstyp | Pfad |
|---|---|---|
| **Blog** | Markdown (.md/.mdx) – didaktische Artikel | `src/content/blog/` |
| **Aufgabensammlung** | Markdown – Aufgabenfolgen mit Lösungen + Kommentar | `src/content/aufgaben/` |
| **Diagnostische Fragen** | JSON – interaktive MC-Quizzes (genau 6 Fragen) | `src/content/quizzes/` |
| **Themen** | JSON – Einordnung, Fehlvorstellungen, Whiteboard-Aufgaben | `src/content/themen/` |
| **Stundenverläufe** | Markdown mit strukturiertem Frontmatter – fertige Stunden nach KLAR | `src/content/stunden/` |

### Redaktionell gepflegte Datenmodule

Diese Bereiche werden nicht über Content-Collections, sondern über typisierte
TypeScript-Module gepflegt. Sie sind jeweils die einzige Quelle der Wahrheit –
Seiten, Suchindex und Sitemap lesen alle dort.

| Bereich | Modul | Seite |
|---|---|---|
| **Werkzeugkasten** | `src/lib/werkzeuge.ts` | `/werkzeuge` |
| **Methodenkoffer** | `src/lib/methoden.ts` | `/methoden` |
| **Gegenmittel zu Fehlvorstellungen** | `src/lib/gegenmittel.ts` | `/fehlvorstellungen` |
| **KI-Prompts** | `src/lib/kiPrompts.ts` | `/ki` |
| **Suchindex** | `src/lib/suchindex.ts` | `/suche`, `/suchindex.json` |

### Eigenständige Werkzeuge

Unter `public/werkzeuge/` liegt je Werkzeug **eine** HTML-Datei. Sie sind
absichtlich ohne Framework, ohne CDN und ohne Server gebaut, damit sie am
Beamer auch ohne Netz laufen. Gemeinsame Grundlage sind `werkzeug.css`
(Design-Tokens, Beamer-Modus, Druckansicht) und `werkzeug.js` (Kopfleiste,
Hell/Dunkel, Vollbild, `localStorage`, Zufall, Ton).

Ein neues Werkzeug anlegen:

1. `public/werkzeuge/<slug>.html` nach dem Muster der vorhandenen Dateien
   (Kopf mit `werkzeug.css`/`werkzeug.js`, `WZ.kopf({titel})`, `WZ.fuss()`).
2. Eintrag in `src/lib/werkzeuge.ts` ergänzen – damit erscheint es automatisch
   auf `/werkzeuge`, im Suchindex und in der Sitemap.
3. Konventionen einhalten: beschriftete Achsen mit Skalenticks und
   Pfeilspitzen, maßstabsgetreue Bilder, Beamer-Modus lesbar, keine
   Datenübertragung. Siehe `AGENTS.md`.

## Voraussetzungen

- [Node.js](https://nodejs.org) ≥ 18
- npm (oder pnpm/yarn)

## Erstes Setup

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Lokal entwickeln (http://localhost:4321)
npm run dev

# 3. Produktiv-Build erzeugen
npm run build

# 4. Build lokal vorschauen
npm run preview
```

## Inhalte hinzufügen

### Neuer Blog-Beitrag

Lege eine neue `.md`-Datei unter `src/content/blog/` an, z. B. `mein-thema.md`:

```markdown
---
title: "Mein Beitragstitel"
untertitel: "Optionaler Untertitel"
autor: "Michael Glaubitz"
datum: 2026-05-10
tags: ["didaktik", "praxis"]
kategorie: "Didaktik"      # Didaktik | Praxisbericht | Aufgabenkultur | Diagnose | Reflexion | Werkzeug
teaser: "Ein bis zwei Sätze, die in der Übersicht erscheinen."
entwurf: false             # auf true setzen, um den Beitrag zu verstecken
---

## Eine Zwischenüberschrift

Markdown-Text wie üblich. **Fett**, *kursiv*, Listen, Tabellen, Bilder.
```

### Neue Aufgabenseite

Lege eine `.md`-Datei unter `src/content/aufgaben/` an:

```markdown
---
titel: "Mein Aufgaben-Titel"
thema: "Bruchrechnung"
klassenstufe: ["6", "7"]
schwierigkeit: einsteiger     # einsteiger | mittel | vertieft
didaktischerHinweis: "Was bringt die Aufgabe? Welche Variation steckt drin?"
tags: ["bruchrechnung"]
datum: 2026-05-10
---

## Aufgabenfolge

| Nr. | Aufgabe | Lösung |
|----:|:--------|:-------|
| 1 | … | … |

## Didaktischer Kommentar

…
```

### Stundenverlauf anlegen

Lege eine `.md`-Datei unter `src/content/stunden/` an. Das Frontmatter trägt die
Struktur, der Fließtext darunter Tafelbild und didaktischen Kommentar.

```yaml
---
titel: "Bruchaddition: Warum 1/2 + 1/3 nicht 2/5 ist"
thema: "Bruchrechnung"        # muss exakt dem `thema` in src/content/themen/ entsprechen
klassenstufe: ["6"]
dauer: 90                      # nur 45 oder 90
stundenziel: "Ein Satz: Was können die Lernenden danach, was vorher nicht?"
kurz: "Teaser für die Übersicht."
voraussetzungen: ["…"]
material: ["…"]
einstiegsfrage:
  frage: "Was ist 1/2 + 1/3?"
  antworten:                   # zwei bis fünf; zu jeder eine Deutung
    - text: "5/6"
      korrekt: true
      deutung: "Was denkt jemand, der das ankreuzt?"
  quiz: "bruchaddition-typische-fehler"   # optional, Slug eines Quiz
phasen:                        # mindestens vier; Minute ist die Startminute
  - schritt: "K"               # K | L | A | R
    minute: 0
    dauer: 10
    titel: "…"
    ablauf: "Was in der Klasse passiert."
    lehrkraft: "Was die Lehrkraft tut – und was nicht."
    werkzeug: { text: "Whiteboard-Check", href: "/werkzeuge/whiteboard-check.html" }
weichen:                       # was tun, wenn die Diagnose anders ausfällt
  - wenn: "Über 80 % antworten richtig."
    dann: "…"
exitTicket: ["…", "…"]         # zwei oder drei Fragen
differenzierung: { schneller: "…", langsamer: "…" }
stolpersteine:
  - fehlvorstellung: "…"
    reaktion: "…"
hausaufgabe: "…"               # optional
tags: ["…"]
datum: 2026-08-28
---
```

Drei Regeln, die den Bereich zusammenhalten:

1. **Die Phasen müssen lückenlos aneinander anschließen**, und die Summe der
   Dauern muss `dauer` ergeben. Die Detailseite rechnet die Uhrzeiten daraus.
2. **`thema` ist der Join-Schlüssel.** Stimmt er, erscheint der Verlauf
   automatisch auf `/themen` unter der Themeneinführung.
3. **Ohne `weichen` kein Stundenverlauf.** Eine diagnostische Einstiegsfrage,
   die den Plan nicht ändern darf, ist Zierde. Mindestens die Fälle „läuft
   besser als gedacht“ und „läuft schlechter als gedacht“ gehören hin.

Hub-Seite und Detailseite (`src/pages/stunden/`) lesen alles aus dem
Frontmatter; Suchindex und Sitemap ziehen den Eintrag automatisch nach.

### Diagnostische Fragen anlegen (Quiz-JSON)

Lege eine `.json`-Datei unter `src/content/quizzes/` an:

```json
{
  "titel": "Quiz-Titel",
  "thema": "Bruchrechnung",
  "klassenstufe": ["6"],
  "didaktischerKontext": "Wofür ist dieses Quiz gedacht?",
  "datum": "2026-05-10",
  "fragen": [
    {
      "frage": "Was ist 1/2 + 1/2?",
      "kontext": "Optionaler Hinweis vor der Frage",
      "optionen": [
        { "text": "1",   "korrekt": true,  "erklaerung": "Richtig, weil …" },
        { "text": "1/4", "korrekt": false, "erklaerung": "Typischer Fehler: Zähler und Nenner getrennt addiert." }
      ]
    }
  ]
}
```

Jede falsche Antwort sollte einen *typischen Denkfehler* repräsentieren – das ist der Kern der diagnostischen Idee.

### Neues Thema mit Übungsgenerator (Themenseite + Massenübung)

Themen mit Whiteboard/Arbeitsblatt folgen einem festen Muster (siehe z. B. `bruch-dezimal-prozent`, `dezimalzahlen`, `bruchrechnung`): JSON unter `src/content/themen/`, Eintrag in `src/pages/themen/index.astro` (Stripe, Links), ggf. `TopicBlock` + eigene Karten-Komponente, Route `src/pages/uebung/<slug>.astro` mit `MassenuebungGeo`, Generator-IDs in `src/lib/uebungPracticeGenerators.ts`.

**Prompt-Vorlage für die nächste Umsetzung (z. B. an Cursor):**

```text
Neues Thema für die Astro-Site wie die bestehenden Themen auf /themen:

1) Inhalt & Routing
- Slug (URL-freundlich): …
- Anzeigetitel, Kurzbeschreibung, Schulband/Stufe: …
- Eigene Übungsroute? Pfad: /uebung/<slug> (ja/nein)

2) Aufgabenlogik
- Aufgabentypen (IDs), Namensschema (z. B. prefix_xyz): …
- Pro Typ: Variation vs. Konstanten, Zahlenbereiche: …
- Neue Antwort-Slots nötig oder Bestehendes (Bruch/Dezimal/Text)? …

3) Themenseite / TopicBlock
- Typauswahl: Standard-Stichwort-Grid, Checkboxen+Session wie Bruch/Dezimal, oder eigene Karten-Komponente? …
- sessionStorage/localStorage-Keys für Auswahl und ggf. Anzahl/Layout: …

4) Massenübung (MassenuebungGeo)
- Neues variant="…" + Generator-IDs in uebungPracticeGenerators? (ja/nein)
- PDF: gleiche Pipeline wie Bruch-Arbeitsblatt oder Sonderweg? …

5) Verlinkung
- „Passend dazu“-Links am Fuß der Übungsseite (2–4 Routen): …
- Zurück: /themen#thema-<slug>

Bitte umsetzen inkl. Tests wo sinnvoll; npm run test && npm run build grün halten.
```

## Mathematische Formeln

KaTeX ist im Layout vorbereitet. Du kannst Formeln in Markdown so schreiben:

```markdown
Inline: $a^2 + b^2 = c^2$

Block:
$$\int_0^1 x^2\,dx = \tfrac{1}{3}$$
```

Damit Astro die Formeln auch wirklich rendert, installiere zusätzlich `remark-math` und `rehype-katex` (siehe [Astro-Doku zu KaTeX](https://docs.astro.build/en/guides/markdown-content/#math)) und ergänze das in `astro.config.mjs`.

## Suche und Sitemap

Beides wird beim Build erzeugt und braucht keinen Dienst von außen:

- `src/pages/suchindex.json.ts` schreibt den Volltextindex über alle Inhalte
  nach `/suchindex.json`; `/suche` lädt ihn und sucht im Browser.
- `src/pages/sitemap.xml.ts` erzeugt `/sitemap.xml` mit echten `lastmod`-Daten
  aus den Content-Collections. `@astrojs/sitemap` wird bewusst **nicht**
  verwendet: Ab Version 3.7 setzt es Astro 5 voraus, dieses Projekt läuft auf
  Astro 4.

Das OG-Standardbild `public/og-default.png` wird von `scripts/og-bild.py`
erzeugt (`python3 scripts/og-bild.py`, benötigt Pillow).

## Deployment

Die Seite ist eine reine statische Website (`npm run build` erzeugt `dist/`). Drei kostenlose Hosting-Optionen:

### Option 1: Cloudflare Pages (empfohlen)

1. Repo auf GitHub/GitLab pushen.
2. Bei [pages.cloudflare.com](https://pages.cloudflare.com) anmelden, Repo verbinden.
3. Build-Befehl: `npm run build`, Output-Ordner: `dist`.
4. Custom-Domain `mathematik-unterrichten.de` in den Cloudflare-Pages-Einstellungen hinterlegen, DNS-Records werden automatisch eingerichtet.

### Option 2: Netlify

1. Repo verbinden bei [app.netlify.com](https://app.netlify.com).
2. Build: `npm run build`, Publish directory: `dist`.
3. Domain in den Site Settings → Domain Management hinzufügen.

### Option 3: Vercel

1. [vercel.com/new](https://vercel.com/new) → Repo importieren.
2. Framework wird automatisch erkannt, kein zusätzliches Setup.
3. Domain in Project Settings → Domains hinzufügen.

### DNS bei deinem Domain-Registrar

Beim Registrar (wo du `mathematik-unterrichten.de` registriert hast) musst du i. d. R. einen `CNAME`-Eintrag für `www` und/oder einen `A`/`AAAA`-Record für die Root-Domain auf den Hoster zeigen lassen. Der jeweilige Hoster zeigt dir die exakten Werte an.

## Kontaktformular

Das Kontaktformular (`src/pages/kontakt.astro`) verwendet [Web3Forms](https://web3forms.com) – einen kostenlosen Form-Backend-Dienst, der ohne eigenen Server auskommt.

**Setup vor dem ersten Einsatz:**

1. Auf [web3forms.com](https://web3forms.com) gehen und mit deiner E-Mail-Adresse einen Access-Key anfordern (kostenlos, keine Registrierung nötig – der Key wird dir per E-Mail zugeschickt).
2. Den Key entweder direkt in `src/pages/kontakt.astro` eintragen (Zeile mit `accessKey`), **oder besser**:
   Bei deinem Hoster (Cloudflare Pages / Netlify / Vercel) als Umgebungsvariable `WEB3FORMS_KEY` setzen. Der Code liest sie automatisch ein.

**Was Web3Forms tut:** Nimmt das Formular-POST entgegen, leitet die Inhalte als E-Mail an deine angegebene Adresse weiter, speichert nichts dauerhaft. Für die DSGVO-konforme Nutzung ist die Datenschutzerklärung bereits entsprechend angepasst (`src/pages/datenschutz.astro`).

## Google Analytics

Die Website unterstützt Google Analytics 4 (GA4) im Hintergrund.

1. **Statistiken ansehen:** Deine Besucherzahlen und Analysen findest du unter [analytics.google.com](https://analytics.google.com/). **Tipp:** Speichere dir diese Seite am besten als Lesezeichen (Favorit) in deinem Browser ab (mit `Strg+D` bzw. `Cmd+D`).
2. **Einrichtung:**
   - **Lokal:** Die Mess-ID wird in der `.env` als `PUBLIC_GA_ID=G-DVL5MDFRBJ` konfiguriert.
   - **Live (GitHub Pages):** Füge im GitHub-Repository unter *Settings → Secrets and variables → Actions → Variables* eine neue Variable namens `PUBLIC_GA_ID` mit dem Wert deiner Mess-ID hinzu.

## Vor dem Live-Gang prüfen


- [ ] `src/pages/impressum.astro` – Pflichtangaben geprüft
- [ ] `src/pages/datenschutz.astro` – an tatsächliches Setup angepasst
- [ ] `src/pages/ueber.astro` – Selbstvorstellung gegengelesen
- [ ] Web3Forms-Access-Key gesetzt (siehe oben)
- [ ] Google Fonts ggf. lokal einbinden (DSGVO-strikt)
- [x] OG-Bild `public/og-default.png` vorhanden (1200 × 630 px, `scripts/og-bild.py`)

## Projektstruktur

```
mathematik-unterrichten/
├── astro.config.mjs        # Astro-Konfiguration
├── tailwind.config.mjs     # Farben, Schriften, Typografie
├── package.json
├── public/                 # statische Assets (favicon, og-image, robots.txt)
├── src/
│   ├── components/         # Header, Footer, PostCard, DiagnosticQuiz
│   ├── content/
│   │   ├── config.ts       # Schema der Inhaltsarten
│   │   ├── blog/           # Markdown
│   │   ├── aufgaben/       # Markdown
│   │   ├── themen/         # JSON – Themenübersicht inkl. Generator-Links
│   │   └── quizzes/        # JSON
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/              # Routen
│   └── styles/global.css
└── README.md
```

## Lizenz

Code: MIT.
Inhalte: CC BY-SA 4.0, sofern nicht anders gekennzeichnet.
