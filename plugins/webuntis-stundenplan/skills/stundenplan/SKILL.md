---
name: stundenplan
description: Fragt Stundenplan, Vertretungen, Ausfaelle, Raum- und Klassenbelegung aus WebUntis ab und beantwortet Fragen dazu. UNBEDINGT verwenden, sobald es um den eigenen Stundenplan, um "was habe ich morgen", Vertretungsplan, Ausfaelle, freie Stunden, Raumbelegung, Klassen-, Lehrer- oder Fachlisten, Stundenraster oder Ferientermine geht - auch bei knappen Zurufen wie "wann habe ich die 10b?", "faellt morgen was aus?", "wie sieht meine Woche aus?", "welcher Raum ist das?" oder "wann sind Herbstferien?". Ebenso verwenden, wenn eine Planung (Klassenarbeit, Vertretung, Elterngespraech) einen Blick in den Plan braucht.
---

# Stundenplan aus WebUntis

Alle Abfragen laufen ueber ein Skript, das nur die Python-Standardbibliothek braucht:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/untis.py" <befehl> [optionen]
```

## Vor der ersten Abfrage

Pruefe die Anmeldung mit `test`. Meldet das Skript fehlende Zugangsdaten, gib dem Nutzer den
Einrichtungsblock aus der Fehlermeldung weiter (Datei `~/.config/schul-plugins/webuntis.env`)
und frage nach Server, Schulkuerzel, Benutzername und Passwort. Lege die Datei nur an, wenn der
Nutzer die Werte selbst nennt - rate sie nie.

Das Schulkuerzel steht in der WebUntis-Adresse hinter `?school=`. Der Server ist der Anfang
derselben Adresse, z. B. `https://ajax.webuntis.com` oder `https://herakles.webuntis.com`.

## Befehle

| Befehl | Zweck |
|---|---|
| `test` | Anmeldung und Rolle pruefen |
| `plan --woche` | Eigener Stundenplan Montag bis Freitag dieser Woche |
| `plan --von morgen` | Ein einzelner Tag |
| `plan --von 2026-09-14 --bis 2026-09-18 --wer klasse:10b` | Plan einer Klasse |
| `vertretungen --woche` | Nur Ausfaelle und Vertretungen |
| `klassen` / `lehrer` / `faecher` / `raeume` | Stammdaten der Schule |
| `ferien` | Ferien und schulfreie Tage |
| `raster` | Stundenraster (welche Stunde liegt wann) |

Datumsangaben verstehen `heute`, `morgen`, `uebermorgen`, `gestern`, Wochentagsnamen,
`2026-09-08`, `08.09.2026` und `20260908`. `--woche` und `--naechste-woche` setzen Montag bis Freitag.

Mit `--wer` waehlst du das Element:
`ich` (Vorgabe), `klasse:10b`, `lehrer:GLA`, `raum:A102`, `fach:MA`.
Ohne Praefix wird eine Klasse angenommen (`--wer 10b`).

`--json` liefert die Rohdaten - nimm das nur, wenn du selbst weiterrechnest
(z. B. Freistunden zaehlen oder gemeinsame Termine suchen); fuer die Antwort an den
Nutzer ist die Tabellenausgabe gedacht.

## So antwortest du

- Fasse zusammen, statt die Tabelle unkommentiert durchzureichen: was faellt aus,
  was ist neu, wo ist die Luecke.
- Bei Ausfaellen nenne immer Datum, Stunde, Klasse und den Vertretungstext.
- Fragt jemand nach einem Termin fuer Klassenarbeit, Konferenz oder Elterngespraech,
  hole den Plan des Zeitraums und schlage konkrete freie Zeitfenster vor.
- Rechne Uhrzeiten nicht selbst um - `raster` sagt, welche Stunde wann liegt.

## Grenzen und Sorgfalt

- Das Konto sieht nur, was WebUntis ihm freigibt. Meldet das Skript Fehler -8509,
  fehlt dem Konto das Recht; das ist kein Programmfehler.
- Schuelerbezogene Daten (Namen in Gruppen, Abwesenheiten) gehoeren nicht in
  Dateien, Mails oder Webseiten, die den Rechner verlassen. Frage nach, bevor du
  solche Daten weiterverarbeitest.
- Das Skript schreibt nichts nach WebUntis zurueck - es liest nur.
