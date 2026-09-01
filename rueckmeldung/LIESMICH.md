# Rückmeldebrett — /mr und /fr

Zwei Bretter für die Arbeit mit den Selbstlernstunden. Kurze Adressen, weil
sie in der Stunde zugerufen und von den iPads abgetippt werden:

| | | |
|---|---|---|
| **mathematik-unterrichten.de/mr** | Mängelberichte | Etwas ist kaputt, klemmt, ist unverständlich |
| **mathematik-unterrichten.de/fr** | Feature-Requests | Etwas fehlt und würde helfen |

```
iPad ── https ──▶ mathematik-unterrichten.de/mr   (statische Seite, GitHub Pages)
                        │  fetch
                        ▼
                  Cloudflare Worker  (rueckmeldung/worker.mjs)
                        ▲
Lehrer ── https ────────┘  /?s=<Lehrerschlüssel> → alles, mit Status und Antwort
```

## Wer darf schreiben — und warum das nicht der Knopf entscheidet

**Lesen darf jeder.** Die Bretter stehen offen; wer den Link hat, sieht, was
gemeldet wurde und wie es steht. Das ist Absicht: Der Wert eines solchen Bretts
liegt darin, dass man sieht, dass etwas passiert.

**Schreiben und Abstimmen darf nur, wer den Klassencode hat.** Der steht in
keiner Datei der Website, sondern als Worker-Secret bei Cloudflare, und wird in
der Stunde mündlich genannt.

Mehr ist auf einer öffentlichen Seite nicht zu haben, und das sollte man
aussprechen: Ein Geheimnis, das im Quelltext der Seite steht, ist keins —
dreißig iPads können ihn lesen. Ein Code, den Sie in der Klasse sagen, ist die
einzige Schranke, die trägt. Sie hält Fremde draußen. Sie hält niemanden davon
ab, den Code weiterzugeben; dagegen hilft nur, ihn zu wechseln.

Was zusätzlich greift:

* **Je Lerngruppe ein eigener Code.** Damit weiß der Dienst ohne Nachfrage, aus
  welcher Klasse eine Meldung kommt — und ein Code, der die Runde macht, lässt
  sich für eine Gruppe allein austauschen.
* **Fehlt der Code in der Konfiguration, nimmt der Dienst gar nichts an.**
  Lieber ein stummes Brett als ein offenes.
* **Schranken:** 6 Meldungen je Gerät und Tag, 80 Stimmen je Gerät und Stunde,
  300 Meldungen am Tag insgesamt.
* **Ausblenden und Löschen** jederzeit auf der Lehrerseite.

**Was der Dienst nicht kann:** Er sieht nicht, ob hinter einer Gerätenummer
wirklich ein anderes Gerät steckt. Wer den Klassencode hat, könnte sich Nummern
ausdenken und mehrfach abstimmen. Deshalb steht neben jedem Eintrag, **wie
viele** abgestimmt haben — eine Zahl, die nicht zur Klassenstärke passt, fällt
auf.

## Was gespeichert wird — und wo

Je Meldung: Brett, Klasse, Zeitpunkt, die ausgefüllten Felder, eine zufällige
Gerätenummer aus dem Browser und, falls freiwillig angegeben, ein Kürzel.

* **Namen werden nirgends verlangt.** Das Brett ist anonym — auch damit niemand
  aus Rücksicht auf einen Mitschüler schweigt.
* **Das Kürzel sieht nur die Lehrkraft**, nie das Brett. Es ist freiwillig und
  dient nur der Rückfrage.
* **Gerätenummern verlassen den Dienst nicht.** Sonst ließe sich zusammenzählen,
  wer wie gestimmt hat.
* **IP-Adressen werden nicht gespeichert**, sie gehen nur flüchtig in die
  Zählung ein.

Das ist deutlich weniger als beim Abgabe-Briefkasten nebenan, wo Namen mit
Arbeitsergebnissen liegen. Hier liegen anonyme Texte über Software. Ein Kürzel
ist trotzdem ein Personenbezug, wenn es die Klasse zuordnen kann — deshalb ist
es freiwillig und steht nicht öffentlich.

## Wie die Bretter zu brauchbaren Meldungen führen

Das ist der eigentliche Bau. Ein Textfeld mit „Was möchtest du melden?“ bringt
„geht nicht“ zurück, und damit kann niemand etwas anfangen. Stattdessen:

1. **Feste Felder statt Freitext.** Mängelbericht: *Wo · Was hattest du gemacht
   · Was ist passiert · Was hättest du erwartet · Wie oft*. Feature-Request:
   *Was fällt dir schwer (Problem, noch nicht Lösung) · Wann · Dein Vorschlag ·
   Wem hilft das noch*. Die Felder stehen in `kern.mjs` und werden **dort**
   geprüft — auch ein selbstgebauter Aufruf kommt an ihnen nicht vorbei.
2. **Ein Beispiel in jedem Feld.** Ein Beispiel erklärt in zwei Sekunden, was
   drei Sätze Anleitung nicht schaffen.
3. **Erst die Überschrift, dann die Dublettensuche, dann die Felder.** Wer
   tippt, sieht sofort ähnliche Meldungen mit einem Stimmknopf daneben. Der
   Weiter-Knopf heißt dann „Keine passt — weiter“. Zehn gleiche Meldungen
   helfen nicht, zehn Stimmen schon.
4. **Abweisungen sagen, was fehlt.** Nicht „ungültig“, sondern „Das ist zu
   knapp — daraus kann ich nicht erkennen, worum es geht.“ Auch Text ohne
   Gehalt („aaaa aaaa aaaa“) wird erkannt.
5. **Vorschau vor dem Absenden**, überschrieben mit „So lese ich deine
   Meldung“.
6. **Neutral formulierte Abstimmung.** Nicht gut/schlecht, sondern *„Betrifft
   mich auch“* und *„Für mich nicht wichtig“*. Eine Stimme je Gerät, änderbar,
   zurücknehmbar.
7. **Sichtbarer Status und eine öffentliche Antwort** — auch bei „nicht
   geplant“. Eine begründete Absage hält die Beteiligung eher aufrecht als
   Schweigen. Das ist der Punkt, an dem solche Bretter üblicherweise sterben.
8. **Wichtiges oben, Abgeschlossenes unten.** Die Standardreihenfolge ist nicht
   „neu“, sondern „wichtig“.

## Aus der Stunde heraus gerufen

Am Ende jeder Selbstlernstunde (Phase 7, nach der Abgabe) stehen zwei Knöpfe.
Sie hängen den Stundentitel an die Adresse:

```
https://mathematik-unterrichten.de/mr?melden=1&bezug=Zehnerpotenzen%20%C2%B7%20Mathematik%20%C2%B7%2010b
```

* `melden=1` klappt das Formular gleich auf — wer den Knopf drückt, will melden.
* `bezug=…` belegt das Feld vor, das ohne Hilfe am schlechtesten ausgefüllt
  wird: bei `/mr` das **Wo**, bei `/fr` das **Wann** (als „In der Stunde: …“).
  Vorbelegt heißt nicht festgelegt — die Felder bleiben änderbar.

Der Titel kommt in der Stunde aus der Überschrift, nicht aus einem Platzhalter:
So kann kein Anführungszeichen im Thema das Skript zerlegen. Gebaut wird der
Knopf in `Werkzeuge/skills/selbstlern-doppelstunde/assets/vorlage_interaktiv.html`
(anderes Repo) — **eine Änderung dort wirkt nur auf neu gebaute Stunden.**

## Einmalig ausrollen

Voraussetzung: ein Cloudflare-Konto (kostenlos). Die Anmeldung müssen Sie selbst
vornehmen — `wrangler login` öffnet den Browser.

```bash
cd rueckmeldung
npx wrangler login
npx wrangler secret put CODES     # z. B.  7b:hufeisen42, 10b:seilbahn7, 10c:nordpol3, 11a:kreide19
npx wrangler secret put LEHRER    # frei wählbar, nur für Sie
npx wrangler deploy
```

`wrangler deploy` nennt zum Schluss die Adresse, etwa
`https://rueckmeldung.<konto>.workers.dev`. **Weicht sie von
`https://rueckmeldung.michaelglaubitz-barton.workers.dev` ab**, gehört sie als
Repository-Variable `PUBLIC_MU_RUECKMELDUNG_URL` hinterlegt (Settings → Actions
→ Variables) und in `.github/workflows/astro.yml` an den Build durchgereicht —
wie es `PUBLIC_MU_LATEX_HTTP_URL` schon vormacht.

Prüfen, ob er steht:

```bash
curl https://rueckmeldung.<konto>.workers.dev/v1/ping
```

Die Antwort sagt auch, ob Schreiben eingerichtet ist: `"schreiben": true`.

## Ihre Seite

```
https://rueckmeldung.<konto>.workers.dev/?s=<Lehrerschlüssel>
```

Als Lesezeichen anlegen. Beide Bretter untereinander, je Eintrag der ganze Text,
die Zahlen, das Kürzel (falls angegeben) — und drei Handgriffe:

* **Status + öffentliche Antwort speichern.** Die Antwort steht danach unter der
  Meldung auf dem Brett, mit „— Herr Glaubitz“ dahinter.
* **Ausblenden.** Weg vom Brett, für Sie noch da. Für Ausgeblendetes lässt sich
  nicht mehr abstimmen.
* **Löschen.** Endgültig.

## Wenn das Schul-WLAN streikt

Der Dienst hat einen Node-Zwilling. `lokal.mjs` ist Zeile für Zeile derselbe
Code, nur mit dem Dateisystem als Speicher:

```bash
CODES="7b:probe1234" LEHRER=meinschluessel node lokal.mjs --port 8742
```

Er nennt beim Start seine Adressen im Netz. Die Seite dorthin umbiegen geht
ohne Neubauen — an die Adresse anhängen:

```
https://mathematik-unterrichten.de/mr?dienst=http://192.168.x.x:8742
```

Die Meldungen landen dann als Dateien in `./brett/`.

**Und wenn gar nichts geht:** Die Seite sagt das im Klartext, das Formular
bleibt benutzbar, und am Ende steht „Als Text kopieren“. Niemand tippt umsonst.

## Prüfen

```bash
node pruefe.mjs
```

Fährt den Kern ohne Netz und ohne Cloudflare durch: ohne eingerichteten Code
kommt nichts an, mit falschem Code auch nicht, Lesen geht ohne alles, Kürzel und
Gerätenummern verlassen den Dienst nicht, die Stimmen stimmen nach jedem
Umschwenken, Moderation nur mit Schlüssel, und die Schranken greifen.

## Aufbau

| Datei | |
|---|---|
| `kern.mjs` | die ganze Logik, genau einmal — samt Feldern und Leitfaden |
| `worker.mjs` | Cloudflare-Schale: ein Durable Object als Speicher und Wache |
| `lokal.mjs` | Node-Schale für Prüfung und Notfall |
| `pruefe.mjs` | die Prüfung |
| `wrangler.toml` | Ausrollkonfiguration |

Auf der Website:

| Datei | |
|---|---|
| `src/pages/mr.astro`, `src/pages/fr.astro` | die beiden Adressen |
| `src/components/RueckmeldungsBrett.astro` | ein Brett für beide |

Die Seite **importiert `kern.mjs` beim Bauen**. Formular, Beispiele und
Leitfaden entstehen also aus derselben Datei, gegen die der Dienst später prüft:
Ein Formular, das nach etwas anderem fragt, als der Dienst annimmt, kann so gar
nicht erst entstehen.
