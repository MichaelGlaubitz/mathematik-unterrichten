# Moodle Kurs

Liest Kurse, Aufgaben, Abgabestände und Bewertungen über die Moodle-Webservices.

## Einrichten

`/moodle-einrichten` oder von Hand `~/.config/schul-plugins/moodle.env`:

```
MOODLE_URL=https://moodle.meine-schule.de
MOODLE_TOKEN=…
```

Den Token erzeugt man in Moodle selbst unter **Einstellungen → Sicherheitsschlüssel**.
Er gilt für den eigenen Zugang und nur für die Funktionen, die der Administrator
im externen Dienst freigegeben hat. `test` zeigt, welche das sind.

## Benutzen

```
/moodle-kurse                Eigene Kurse mit IDs
/moodle-abgaben 10b          Abgabestand der nächsten fälligen Aufgabe
```

Oder fragen: „Wer hat bei der Bruchrechnung noch nicht abgegeben?",
„Welche Fristen laufen diese Woche ab?"

## Direkt auf der Kommandozeile

```bash
python3 scripts/moodle.py test
python3 scripts/moodle.py kurse
python3 scripts/moodle.py aufgaben --kurs 42
python3 scripts/moodle.py abgaben --aufgabe 87 --kurs 42
python3 scripts/moodle.py teilnehmer --kurs 42 --anonym
python3 scripts/moodle.py noten --kurs 42
python3 scripts/moodle.py funktion core_course_get_contents --param courseid=42
```

`--anonym` kürzt alle Namen auf Initialen, `--json` liefert Rohdaten. Das Plugin
liest ausschließlich; es trägt keine Noten ein.

## Wenn etwas nicht geht

| Meldung | Ursache |
|---|---|
| `invalidtoken` | Token abgelaufen oder falsch — in Moodle neu erzeugen |
| `accessexception` | Funktion ist für den externen Dienst nicht freigegeben |
| `webservicesnotenabled` | Webservices sind in dieser Moodle-Instanz aus |
| keine gültige JSON-Antwort | REST-Protokoll ist nicht aktiviert |

Die letzten drei Punkte kann nur die Moodle-Administration ändern. `test` nennt
die Funktionsnamen, die man dafür weiterreichen muss.
