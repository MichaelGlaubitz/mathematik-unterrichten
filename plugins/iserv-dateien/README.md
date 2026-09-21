# IServ Dateien

Bedient die IServ-Dateiablage per WebDAV: Ordner durchsehen, Material hochladen,
Abgaben herunterladen.

## Einrichten

`/iserv-einrichten` oder von Hand `~/.config/schul-plugins/iserv.env`:

```
ISERV_URL=https://meine-schule.de
ISERV_USER=vorname.nachname
ISERV_PASSWORT=…
```

Es sind dieselben Zugangsdaten wie im Browser. Das WebDAV-Modul muss auf dem
Schulserver aktiviert sein — `test` zeigt sofort, ob es antwortet.

## Benutzen

```
/iserv-hochladen arbeitsblatt.pdf Kursordner 10b
/iserv-abgaben-holen "Files/Groups/Mathe-10b/Abgaben"
```

Oder fragen: „Was liegt im Kursordner der 10b?", „Leg die Lösung dazu."

## Direkt auf der Kommandozeile

```bash
python3 scripts/iserv.py test
python3 scripts/iserv.py ls "Files/Groups/Mathe-10b"
python3 scripts/iserv.py put arbeitsblatt.pdf "Files/Groups/Mathe-10b/Material/arbeitsblatt.pdf"
python3 scripts/iserv.py get "Files/Groups/Mathe-10b/Abgaben" --rekursiv --ziel ~/Downloads
python3 scripts/iserv.py mkdir "Files/Groups/Mathe-10b/Material/Woche 38"
```

Wie die obersten Ordner heißen, ist von Server zu Server verschieden
(`Files`/`Dateien`, `Groups`/`Gruppen`) — deshalb mit `test` anfangen und sich
mit `ls` durchhangeln.

Das Plugin kann lesen, Ordner anlegen und hochladen. **Löschen kann es nicht**,
und `put` überschreibt eine vorhandene Datei nur mit `--ueberschreiben`.

## Wenn etwas nicht geht

| Meldung | Ursache |
|---|---|
| HTTP 401 | Benutzername oder Passwort falsch |
| HTTP 404 auf die Wurzel | WebDAV-Modul ist auf dem Schulserver abgeschaltet |
| HTTP 409 | Der übergeordnete Ordner fehlt — erst `mkdir` |
| HTTP 507 | Speicherplatz auf dem IServ erschöpft |
