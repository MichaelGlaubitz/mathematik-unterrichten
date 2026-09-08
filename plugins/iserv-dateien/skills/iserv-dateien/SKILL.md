---
name: iserv-dateien
description: Bedient die IServ-Dateiablage per WebDAV - Ordner durchsehen, Material hochladen, abgegebene Dateien herunterladen. UNBEDINGT verwenden, sobald von IServ die Rede ist: "leg das Arbeitsblatt in den Kursordner", "was liegt bei der 10b?", "hol die Abgaben herunter", "gibt es den Ordner schon?" - und ebenso, wenn eine gerade erzeugte Datei (Arbeitsblatt, Loesung, Elternbrief, Video) den Schuelern bereitgestellt werden soll. Auch bei knappen Zurufen wie "auf den Schulserver damit" oder "IServ-Ordner zeigen".
---

# IServ-Dateien per WebDAV

Alle Zugriffe laufen ueber ein Skript, das nur die Python-Standardbibliothek braucht:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/iserv.py" <befehl> [optionen]
```

## Vor dem ersten Zugriff

`test` prueft den Zugang und zeigt die Wurzel der Ablage. Wie die obersten Ordner
heissen, ist von IServ zu IServ verschieden (`Files`/`Dateien`, darunter `Groups`
bzw. `Gruppen` und der eigene Bereich). Rate die Pfade nicht - hangle dich mit
`ls` durch, bis du den richtigen Ordner hast.

Fehlen die Zugangsdaten, gib den Einrichtungsblock aus der Fehlermeldung weiter.
Ist das WebDAV-Modul auf dem Schulserver abgeschaltet, antwortet IServ mit 404 auf
die Wurzel; dann muss der Administrator es aktivieren.

## Befehle

| Befehl | Zweck |
|---|---|
| `test` | Zugang pruefen, oberste Ordner zeigen |
| `ls "Files/Groups/Mathe-10b"` | Ordner auflisten |
| `get "…/Abgaben/anna.pdf" --ziel ~/Downloads` | eine Datei holen |
| `get "…/Abgaben" --rekursiv --ziel ~/Downloads` | ganzen Ordner holen |
| `put arbeitsblatt.pdf "…/Material/arbeitsblatt.pdf"` | hochladen |
| `put … --ueberschreiben` | vorhandene Datei ersetzen |
| `mkdir "…/Material/Woche 38"` | Ordner anlegen |

Pfade mit Leerzeichen gehoeren in Anfuehrungszeichen; das Skript kodiert sie selbst.

## So arbeitest du damit

- Vor dem Hochladen erst `ls` auf den Zielordner: existiert er, und wie heisst er genau?
- Ohne `--ueberschreiben` bricht `put` ab, wenn dort schon eine Datei liegt. Frage
  in dem Fall nach, statt automatisch zu ersetzen.
- Fehlt ein Zwischenordner, meldet IServ 409 - lege ihn mit `mkdir` an, von oben nach unten.
- Hast du gerade selbst ein Arbeitsblatt, eine Loesung oder ein Video erzeugt, biete
  an, es gleich in den passenden Kursordner zu legen.

## Grenzen und Sorgfalt

- Das Skript kann lesen, anlegen und hochladen - es loescht nichts. Loeschen bleibt
  bewusst der Weboberflaeche vorbehalten.
- Heruntergeladene Abgaben sind Schuelerarbeiten: lege sie in einen lokalen Ordner,
  nicht in das Projektverzeichnis eines oeffentlichen Repositories, und lade sie
  nirgends weiter hoch.
- Was in einem Gruppenordner landet, sehen alle Mitglieder der Gruppe sofort.
  Bei Material mit Loesungen also erst fragen, wohin es soll.
