# mathematik-unterrichten.de

Statisch generierte Mathe-Didaktik-Seite für Lehrkräfte – inspiriert von [mrbartonmaths.com](https://mrbartonmaths.com/), aufgebaut mit [Astro](https://astro.build) und Tailwind.

## Was die Seite kann

| Bereich | Inhaltstyp | Pfad |
|---|---|---|
| **Blog** | Markdown (.md/.mdx) – didaktische Artikel | `src/content/blog/` |
| **Aufgabensammlung** | Markdown – Aufgaben mit Lösungen + Kommentar | `src/content/aufgaben/` |
| **Diagnose-Fragen** | JSON – interaktive MC-Quizzes | `src/content/quizzes/` |

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

### Neues Diagnose-Quiz

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

## Mathematische Formeln

KaTeX ist im Layout vorbereitet. Du kannst Formeln in Markdown so schreiben:

```markdown
Inline: $a^2 + b^2 = c^2$

Block:
$$\int_0^1 x^2\,dx = \tfrac{1}{3}$$
```

Damit Astro die Formeln auch wirklich rendert, installiere zusätzlich `remark-math` und `rehype-katex` (siehe [Astro-Doku zu KaTeX](https://docs.astro.build/en/guides/markdown-content/#math)) und ergänze das in `astro.config.mjs`.

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

## Vor dem Live-Gang prüfen

- [ ] `src/pages/impressum.astro` – Pflichtangaben geprüft
- [ ] `src/pages/datenschutz.astro` – an tatsächliches Setup angepasst
- [ ] `src/pages/ueber.astro` – Selbstvorstellung gegengelesen
- [ ] Web3Forms-Access-Key gesetzt (siehe oben)
- [ ] Google Fonts ggf. lokal einbinden (DSGVO-strikt)
- [ ] OG-Bild `public/og-default.png` hinzufügen (1200 × 630 px)

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
