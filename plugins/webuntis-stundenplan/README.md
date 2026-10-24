# WebUntis Stundenplan

Fragt den Stundenplan aus WebUntis ab — den eigenen, den einer Klasse, einer
Lehrkraft oder eines Raums — und beantwortet Fragen dazu im Gespräch.

## Einrichten

`/untis-einrichten` führt durch die vier Schritte. Von Hand geht es so:

**Schritt 1 — Schule finden** (ohne Zugangsdaten):

```bash
python3 scripts/untis.py suche-schule "Hameln"
```

Liefert Server und Schulkürzel jeder Schule, die WebUntis unter dem Namen kennt.

**Schritt 2 — Schnittstelle prüfen** (ohne Zugangsdaten, ohne Anmeldeversuch):

```bash
python3 scripts/untis.py erreichbar --server https://aeghm.webuntis.com --schule aeghm
```

Antwortet die Schnittstelle nicht, muss die WebUntis-Administration der Schule
sie freigeben — Zugangsdaten helfen dann nicht weiter.

**Schritt 3 — Zugangsdaten anlegen.** `~/.config/schul-plugins/webuntis.env`:

```
WEBUNTIS_SERVER=https://ajax.webuntis.com
WEBUNTIS_SCHULE=kurzname
WEBUNTIS_USER=vorname.nachname
WEBUNTIS_PASSWORT=…
```

Server und Schulkürzel stehen auch in der Adresse, mit der man sich sonst anmeldet:
`https://ajax.webuntis.com/WebUntis/?school=kurzname`. Danach `chmod 600` setzen.

**Schritt 4 — prüfen:** `python3 scripts/untis.py test`

## Benutzen

```
/untis-woche                 Stundenplan dieser Woche
/untis-woche klasse:10b      Plan einer Klasse
/untis-vertretungen          Ausfälle und Vertretungen
```

Oder einfach fragen: „Was habe ich morgen?", „Fällt diese Woche etwas aus?",
„Wann hat die 10b Mathe?", „Wann sind Herbstferien?"

## Direkt auf der Kommandozeile

```bash
python3 scripts/untis.py test
python3 scripts/untis.py plan --woche
python3 scripts/untis.py plan --von 2026-09-14 --bis 2026-09-18 --wer klasse:10b
python3 scripts/untis.py vertretungen --naechste-woche
python3 scripts/untis.py klassen | lehrer | faecher | raeume | ferien | raster
```

`--json` liefert Rohdaten. Das Plugin liest ausschließlich; es schreibt nichts
nach WebUntis zurück.

## Wenn etwas nicht geht

| Meldung | Ursache |
|---|---|
| Fehler -8504 | Benutzername oder Passwort falsch |
| Fehler -8998 | Schulkürzel stimmt nicht |
| Fehler -8509 | Das Konto darf diese Abfrage in WebUntis nicht stellen |
| HTTP 404 | Falsches Schulkürzel, seltener falscher Server |

Schulen können die JSON-RPC-Schnittstelle abschalten. Dann hilft nur die
Freigabe durch die WebUntis-Administration der Schule.
