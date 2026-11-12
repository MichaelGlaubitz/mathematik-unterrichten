# KI-Rückmeldung

Ein Cloudflare Worker, der einen Rechenweg aus einem Lernweg der Website an Claude gibt
und eine kurze, bodennahe Rückmeldung zurückschickt. Erster Nutzer:
`public/trainelia/wahrscheinlichkeit.html`.

| Datei | |
|---|---|
| `kern.mjs` | die ganze Logik: Code, Tagesgrenze, Eingaben, System-Text |
| `claude.mjs` | die einzige Stelle, die die Claude-API anspricht (Anthropic-SDK) |
| `worker.mjs` | Cloudflare-Schale mit Durable Object |
| `lokal.mjs` | Node-Zwilling, auch als Attrappe ohne KI (`--attrappe`) |
| `pruefe.mjs` | Prüfung ohne Netz und ohne Konto |

## Warum so

* **Kein Schlüssel im Browser.** Der API-Schlüssel steht nur als Secret beim Worker.
* **Familiencode.** Wer ihn nicht kennt, bekommt nichts; nach 30 Fehlversuchen am Tag ist
  bis Mitternacht zu. Der Code liegt auf dem Gerät des Lernenden im Browser, sonst nirgends.
* **Tagesgrenze** von 60 Rückmeldungen (`GRENZE_JE_TAG`), gezählt im Durable Object.
  Zusätzlich empfiehlt sich ein Monatslimit für den Schlüssel in der Claude Console.
* **Nichts wird abgelegt** außer zwei Zahlen je Tag. Der Rechenweg geht einmal an Claude.
* Modell `claude-opus-5-5`, Denktiefe `low`, Rückfall bei Ablehnung eingeschaltet
  (`fallbacks: "default"`). Eine Rückmeldung kostet grob 1–3 Cent.

## Einrichten (einmalig, im Ordner `ki-rueckmeldung/`)

```bash
npm install @anthropic-ai/sdk
node pruefe.mjs
npx wrangler deploy
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put FAMILIENCODE
```

Danach: `https://ki-rueckmeldung.michaelglaubitz-barton.workers.dev/v1/status` muss
`"bereit": true` zeigen.

## Lokal probieren

```bash
node lokal.mjs --attrappe
```

und den Lernweg mit `?ki=http://localhost:8761` öffnen (Code `probecode-lokal`).
