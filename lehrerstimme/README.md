# Lehrerstimme (MVP)

Datenschutzkonforme Micro-Survey-Web-App für Lehrkräfte (Next.js App Router).

## Ordnerstruktur (Zielbild)

```text
lehrerstimme/
├── public/
├── src/
│   ├── app/                 # App Router — Routen, Layouts, Server Actions (später)
│   ├── components/          # UI-Atome & Features (Shadcn/UI — noch einzubinden)
│   │   ├── charts/          # Diagramm-Komponenten (Balken/Kreis)
│   │   ├── survey/          # Fragenkarten, Optionen, Fortschritt
│   │   └── layout/          # Shell, Header, Footer
│   ├── hooks/               # Client-Hooks (LocalStorage, Streak, Kalendertag)
│   ├── lib/
│   │   ├── survey/          # Kalenderlogik, Streak-Reinfunktionen
│   │   ├── storage/         # LocalStorage-Adapter (strikt getrennt von API-Auth)
│   │   └── supabase/        # Serverlose API — nur anonyme Inserts (später)
│   └── types/               # Gemeinsame TS-Typen (Survey + lokales Onboarding)
├── next.config.ts
├── package.json
└── README.md
```

## Zero-Knowledge / DSGVO-Hinweis

- Onboarding-Demografie: nur **LocalStorage** (`hooks/use-anonymous-profile.ts`).
- Antworten: später **nur** in `responses_anonymous` mit Meta-Feldern aus dem lokalen Profil — **ohne** persistente User-ID im Backend.

## Befehle

| Task   | Command              |
|--------|----------------------|
| Dev    | `npm run dev`        |
| Build  | `npm run build`      |
| Lint   | `npm run lint`       |
