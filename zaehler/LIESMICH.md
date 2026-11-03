# Zähler für die öffentlichen Trainer

Zählt, wie weit die Trainer unter `public/trainer/` benutzt werden – anonym,
je Tag und Station eine Zahl. Gebaut am 10.10.2026 für den Prozent-Trainer.

## Wozu

Der Trainer ist ein Pilot. Die Frage dahinter: Halten Kinder ohne Lehrkraft
durch, und bis wohin? Google Analytics beantwortet das nicht (es läuft nur auf
den Astro-Seiten, nicht in den eigenständigen HTML-Dateien) und käme für eine
Seite, die sich an Kinder richtet, auch nicht in Frage.

## Was gezählt wird

| Station | Bedeutung |
|---|---|
| `besuch-neu`, `besuch-wieder` | Seite geöffnet, ohne oder mit vorhandenem Stand |
| `diagnose-start`, `diagnose-ende` | Diagnose begonnen, beendet |
| `diagnose-sicher:<n>` | … und wie viele Themen danach sicher waren |
| `vorfuehrung:<thema>` | Vorführung eines Themas angesehen |
| `beispiel` | „Noch ein Beispiel“ verlangt |
| `ton` | Ton eingeschaltet |
| `ueben:<thema>`, `retest:<thema>` | Üben, Re-Test begonnen |
| `sicher:<thema>`, `nochnicht:<thema>` | Re-Test bestanden, nicht bestanden |
| `alle-sicher` | alle Themen grün |
| `check-ende` | Arbeits-Check beendet |
| `eltern` | Seite „Für Eltern und Lehrkräfte“ geöffnet |

Gezählt werden **Ereignisse, nicht Geräte**: Wer die Seite dreimal öffnet,
zählt dreimal. Das ist der Preis dafür, niemanden wiederzuerkennen.

## Was gespeichert wird – und was nicht

Im Durable Object steht je Trainer, Tag (deutsche Zeit) und Station eine ganze
Zahl. Sonst nichts: keine IP-Adresse (auch nicht flüchtig für eine Schranke),
keine Gerätekennung, kein Cookie, keine Uhrzeit, keine Antworten. Der Trainer
legt für die Zählung nichts auf dem Gerät ab und liest dafür nichts aus.
`pruefe.mjs` prüft genau das.

Nicht gezählt wird, wenn die Zählung auf dem Gerät abgeschaltet ist (Seite „Für
Eltern und Lehrkräfte“ oder einmal mit `?zaehlen=aus` öffnen), wenn der Browser
„Do Not Track“ sendet, und überall außer auf `mathematik-unterrichten.de`.

**Eigene Geräte ausnehmen:** den Trainer auf jedem eigenen Gerät einmal mit
`…/trainer/prozentrechnung.html?zaehlen=aus` öffnen. Zurück mit `?zaehlen=an`.

## Grenzen

Der Dienst kann nicht prüfen, ob eine Meldung wirklich vom Trainer kommt – die
Adresse steht im Quelltext. Deshalb: Obergrenze je Zähler und Tag (20 000),
höchstens 200 verschiedene Zähler je Trainer und Tag, nur Namen von der Liste.
Die Zahlen sind ein Anhaltspunkt, kein Messwert.

Jede Meldung ist eine Anfrage im Cloudflare-Kontingent des Kontos (100 000 am
Tag, geteilt mit Abstimmung und Rückmeldebrett). Der Trainer bündelt mehrere
Stationen zu einer Meldung; ein Kind, das ein Thema ganz durcharbeitet, löst
etwa fünf Anfragen aus.

## Ausrollen

Im Ordner `zaehler/`:

```
npx wrangler login
npx wrangler deploy
npx wrangler secret put LESEN
```

Der Leseschlüssel: mindestens 16 Zeichen, frei erfunden, nirgends sonst
benutzt, in keiner Datei. Kürzere Schlüssel behandelt der Dienst als nicht
gesetzt (`/v1/ping` meldet dann `schluesselZuKurz`).

Danach:

- Auswertung im Browser: `https://zaehler.michaelglaubitz-barton.workers.dev/?s=<Leseschlüssel>`
- Als Daten: `/v1/zahlen?tage=30` mit Kopfzeile `x-lesen: <Leseschlüssel>`
- Lebenszeichen ohne Schlüssel: `/v1/ping`

Die Adresse steht im Trainer als `ZAEHLER.adresse`. Solange der Dienst nicht
ausgerollt ist, laufen die Meldungen ins Leere; der Trainer merkt davon nichts.

## Prüfen

```
node pruefe.mjs          # Logik ohne Netz
node lokal.mjs           # Node-Zwilling auf Port 8743
```

Den Trainer gegen den Zwilling laufen lassen: von `localhost` laden und
`?zaehler=http://localhost:8743` anhängen.

## Ein weiterer Trainer

Seinen Namen in `TRAINER` (kern.mjs) eintragen, im Trainer `ZAEHLER.trainer`
setzen, neu ausrollen. Themen brauchen keine Anmeldung: Der Zusatz hinter dem
Doppelpunkt ist frei, solange er aus höchstens zwölf Kleinbuchstaben und
Ziffern besteht.
