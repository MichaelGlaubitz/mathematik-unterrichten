# Lehrerstimme (MVP)

Datenschutzkonforme Micro-Survey-Web-App für Lehrkräfte (Next.js App Router).

## Ordnerstruktur (Zielbild)

```text
lehrerstimme/
├── public/
├── src/
│   ├── app/                 # App Router — Routen, Layouts, Server Actions (später)
│   ├── components/
│   │   ├── charts/          # Balken-, Donut-Diagramme, SVG-Zoom (+/−)
│   │   ├── survey/          # Fragenkarten, Tagesfortschritt, Impuls-des-Tages-Karte
│   │   ├── layout/          # App-Shell, MVP-Demo-Dashboard
│   │   └── ui/              # Shadcn (Base UI „base-nova“) — Button, Card, RadioGroup, …
│   ├── hooks/               # Client-Hooks (LocalStorage, Streak, Kalendertag, SVG-Zoom)
│   ├── lib/
│   │   ├── charts/          # Prozent-Logik, Donut-Pfade, Farben
│   │   ├── demo/            # Nur Demo-Daten für die Startseite
│   │   ├── survey/          # Kalenderlogik, Streak-Reinfunktionen
│   │   ├── storage/         # LocalStorage-Adapter (strikt getrennt von API-Auth)
│   │   └── supabase/        # Serverlose API — nur anonyme Inserts (später)
│   └── types/               # Gemeinsame TS-Typen (Survey + lokales Onboarding)
├── components.json          # Shadcn-Konfiguration
├── next.config.mjs
├── package.json
└── README.md
```

## UI (Shadcn)

- Stil-Preset: **base-nova** (Base UI + `class-variance-authority`).
- Komponenten hinzufügen: `npx shadcn@latest add <name> -y` im Ordner `lehrerstimme/`.

## Zero-Knowledge / DSGVO-Hinweis

- Onboarding-Demografie: nur **LocalStorage** (`hooks/use-anonymous-profile.ts`).
- Antworten: später **nur** in `responses_anonymous` mit Meta-Feldern aus dem lokalen Profil — **ohne** persistente User-ID im Backend.

## Befehle

| Task   | Command              |
|--------|----------------------|
| Dev    | `npm run dev`        |
| Build  | `npm run build`      |
| Lint   | `npm run lint`       |
