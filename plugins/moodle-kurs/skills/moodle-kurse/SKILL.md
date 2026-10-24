---
name: moodle-kurse
description: Liest Kurse, Aufgaben, Abgabestaende, Teilnehmerlisten und Bewertungen aus Moodle und beantwortet Fragen dazu. UNBEDINGT verwenden, sobald es um Moodle geht - "wer hat noch nicht abgegeben?", "welche Aufgaben laufen diese Woche ab?", "zeig mir meine Kurse", "wie steht die 9c bei der letzten Aufgabe?", "welche Frist habe ich gesetzt?" - und ebenso, wenn eine Auswertung, ein Erinnerungsschreiben oder eine Notenuebersicht auf Moodle-Daten aufbauen soll. Auch bei knappen Zurufen wie "Abgaben pruefen" oder "Moodle-Kurs 42".
---

# Moodle aus Claude heraus

Alle Abfragen laufen ueber ein Skript, das nur die Python-Standardbibliothek braucht:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/moodle.py" [--anonym] [--json] <befehl> [optionen]
```

## Vor der ersten Abfrage

`test` zeigt, ob Adresse und Token stimmen - und listet auf, welche der gebrauchten
Funktionen der Administrator freigegeben hat. Fehlt eine, ist das keine Panne des
Skripts: der Moodle-Administrator muss sie im externen Dienst ergaenzen. Nenne dem
Nutzer in dem Fall genau den Funktionsnamen, den er anfragen muss.

Fehlen die Zugangsdaten, gib den Einrichtungsblock aus der Fehlermeldung weiter.
Der Token entsteht in Moodle unter *Einstellungen -> Sicherheitsschluessel*.

## Befehle

| Befehl | Zweck |
|---|---|
| `test` | Zugang, Moodle-Version und freigegebene Funktionen |
| `kurse` | Eigene Kurse mit Kurs-ID |
| `aufgaben --kurs 42` | Aufgaben des Kurses mit Frist und Aufgaben-ID |
| `abgaben --aufgabe 87 --kurs 42` | Abgabestand; mit `--kurs` auch die Namen ohne Abgabe |
| `teilnehmer --kurs 42` | Eingeschriebene Personen und Rollen |
| `noten --kurs 42 [--nutzer 5]` | Bewertungsuebersicht |
| `funktion NAME --param k=v` | jede andere freigegebene Webservice-Funktion |

Der Weg ist fast immer derselbe: `kurse` liefert die Kurs-ID, `aufgaben --kurs <ID>`
die Aufgaben-ID, damit dann `abgaben`. Rate keine IDs - hole sie.

`--json` liefert Rohdaten fuer eigene Auswertungen, `--anonym` kuerzt alle Namen
auf Initialen.

## So antwortest du

- Bei Abgabefragen: nenne die Zahl (x von y), dann die offenen Namen, dann die Frist.
- Sortiere Aufgaben nach Frist und weise auf das hin, was in den naechsten Tagen ablaeuft.
- Sollst du daraus eine Erinnerungsmail oder ein Arbeitsblatt bauen, mach das
  gleich mit - aber schreibe Schuelernamen nur dorthin, wo der Nutzer sie haben will.

## Grenzen und Sorgfalt

- Das Skript liest nur; es traegt keine Noten ein und aendert keine Kurse.
- Teilnehmerlisten, Abgabestaende und Noten sind personenbezogene Daten von
  Minderjaehrigen. Lege sie nicht in Dateien ab, die den Rechner verlassen, und
  nutze bei Uebersichten fuer Dritte `--anonym`.
- Ohne Freigabe der Funktion durch den Administrator gibt Moodle `accessexception`
  zurueck - das ist eine Rechtefrage, kein Fehler im Aufruf.
