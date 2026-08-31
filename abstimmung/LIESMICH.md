# Live-Abstimmung über die Schüler-iPads

Die Wandfassungen einer Doppelstunde öffnen ihre Plickers-Fragen zusätzlich
auf den Schülergeräten: QR-Code scannen, A/B/C/D antippen, die Wand zeigt die
Verteilung live. Ohne erreichbaren Dienst läuft die Stunde unverändert mit
Plickers-Karten weiter — das ist kein Notbehelf, sondern der eingebaute
Rückfallweg.

```
iPad ── https ──▶ mathematik-unterrichten.de/abstimmung/?raum=7b-di
                        │  fetch
                        ▼
                  Cloudflare Worker  (abstimmung/worker.mjs)
                        ▲
Wand ── https ──────────┘   öffnet die Frage, holt die Zählung
```

## Was gespeichert wird — und was nicht

* **Keine Namen, keine Anmeldung.** Das iPad würfelt sich beim ersten Besuch
  eine Zufallsnummer und behält sie im Browser. Sie sorgt nur dafür, dass ein
  Gerät genau eine Stimme hat.
* **Keine IP-Protokollierung, nichts auf Platte.** Der Zustand lebt im
  Durable Object und verfällt nach sechs Stunden ohne Benutzung.
* **Die Geräte erfahren die Verteilung nicht** und auch nicht, welche Antwort
  richtig ist. Beides gibt der Dienst nur gegen den Lehrerschlüssel heraus.
  Wer die Raumadresse kennt, sieht die Frage und wie viele schon abgestimmt
  haben — mehr nicht.
* **Der Raumcode ist fest** (`7b-di`, `7b-mi`), damit der QR-Code schon beim
  Bauen der Wandfassung entstehen kann. Wer ihn kennt, könnte mitstimmen. Für
  eine Klassenabfrage ist das vertretbar; die Zahl der Stimmen steht neben den
  Balken und fällt auf, wenn sie nicht zur Klassenstärke passt.

Das ist bewusst dieselbe Linie wie beim lokalen KLAR-Taktgeber. **Neu und zu
verantworten ist nur eines:** Die Antworten laufen jetzt über einen Server im
Netz statt über den Lehrer-Laptop.

## Einmalig ausrollen

Voraussetzung: ein Cloudflare-Konto (kostenlos). Die Anmeldung müssen Sie
selbst vornehmen.

```bash
cd abstimmung
npx wrangler login              # öffnet den Browser
npx wrangler secret put LEHRER  # Lehrerschlüssel setzen, frei wählbar
npx wrangler deploy
```

`wrangler deploy` nennt zum Schluss die Adresse, etwa
`https://abstimmung.<konto>.workers.dev`. **Diese Adresse gehört in die beiden
Bauskripte** der Wandfassung:

`Stundenregie/bau-7b/wand_prop.py` und `wand_quot.py`, jeweils im Block
`ABSTIMMUNG = { "dienst": … }`. Danach neu bauen:

```bash
cd "…/Stundenregie/bau-7b"
python wand_prop.py && python wand_quot.py
```

Zum Schluss die Wandfassungen und `public/abstimmung/` wie gewohnt auf die
Website übertragen.

## In der Stunde

1. Wandfassung öffnen, **F** für Vollbild.
2. Beim ersten Mal fragt die Seite oben links nach dem **Lehrerschlüssel**.
   Einmal eintippen — er bleibt im Browser des Lehrergeräts.
3. Oben links steht dann „Abstimmung“ mit grünem Punkt: Der Dienst antwortet.
4. **Folie 3** zeigt den QR-Code groß. Stehen lassen, bis alle verbunden sind.
   Danach hängt er klein unten rechts; **Q** blendet ihn aus und ein.
5. Ab da läuft es von selbst: Sobald eine Plickers-Folie an der Wand steht,
   ist die Frage auf den iPads offen und die Balken wachsen mit. Der erste
   Tastendruck auf **→** löst auf, schließt die Abstimmung und färbt den
   richtigen Balken grün.

**Kein grüner Punkt?** Dann ist der Dienst nicht erreichbar. Die Stunde läuft
unverändert weiter — die Fragen stehen ja an der Wand. Plickers-Karten
austeilen, fertig.

## Wenn das Schul-WLAN streikt

`lokal.mjs` ist derselbe Dienst als Node-Server für den Lehrer-Laptop:

```bash
LEHRER=meinschluessel node lokal.mjs --port 8740
```

Er nennt beim Start seine Adressen im Netz. Die Wandfassung dorthin umbiegen
geht ohne Neubauen — an die Adresse der Wandfassung anhängen:

```
…/proportionale-zuordnungen-7b-wandfassung.html?dienst=http://192.168.x.x:8740
```

Dieselbe Angabe verstehen auch die Schülergeräte
(`…/abstimmung/?raum=7b-di&dienst=…`). Dann brauchen Sie allerdings den
Notebook-Hotspot, weil das Schul-WLAN die Geräte voneinander trennt.

## Aufbau

| Datei | |
|---|---|
| `kern.mjs` | die ganze Logik, genau einmal |
| `worker.mjs` | Cloudflare-Schale, ein Durable Object je Raum |
| `lokal.mjs` | Node-Schale für Prüfung und Notfall |
| `wrangler.toml` | Ausrollkonfiguration |
| `../public/abstimmung/index.html` | die Seite auf den Schülergeräten |

`kern.mjs` steht bewusst nur einmal da: Was im Node-Zwilling geprüft ist,
läuft im Worker Zeile für Zeile genauso.
