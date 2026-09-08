# WebUntis Stundenplan

Fragt den Stundenplan aus WebUntis ab — den eigenen, den einer Klasse, einer
Lehrkraft oder eines Raums — und beantwortet Fragen dazu im Gespräch.

## Einrichten

`/untis-einrichten` oder von Hand `~/.config/schul-plugins/webuntis.env` anlegen:

```
WEBUNTIS_SERVER=https://ajax.webuntis.com
WEBUNTIS_SCHULE=kurzname
WEBUNTIS_USER=vorname.nachname
WEBUNTIS_PASSWORT=…
```

Server und Schulkürzel stehen in der Adresse, mit der man sich sonst anmeldet:
`https://ajax.webuntis.com/WebUntis/?school=kurzname`.

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
| HTTP 404 | Falscher Server in `WEBUNTIS_SERVER` |

Schulen können die JSON-RPC-Schnittstelle abschalten. Dann hilft nur die
Freigabe durch die WebUntis-Administration der Schule.
