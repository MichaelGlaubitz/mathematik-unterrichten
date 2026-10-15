---
description: Richtet den WebUntis-Zugang ein - Schule suchen, Schnittstelle pruefen, Zugangsdaten anlegen
allowed-tools: Bash(python3:*), Bash(mkdir:*), Bash(chmod:*)
---

Richte den WebUntis-Zugang ein. Geh dabei in dieser Reihenfolge vor und mach
immer nur einen Schritt, bevor du den naechsten ansagst.

**1. Schule finden** (braucht kein Passwort). Nimm den Schulnamen oder Ort aus
`$ARGUMENTS`, sonst frage danach:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/untis.py" suche-schule "<Name oder Ort>"
```

Bei mehreren Treffern lass den Nutzer waehlen. Kennt er Server und Schulkuerzel
schon, ueberspring diesen Schritt.

**2. Schnittstelle pruefen** (braucht kein Passwort):

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/untis.py" erreichbar --server "<server>" --schule "<kuerzel>"
```

Ist sie zu, hoer hier auf und sag dem Nutzer, dass die WebUntis-Administration
der Schule sie freigeben muss. Zugangsdaten helfen dann nicht.

**3. Zugangsdaten anlegen.** Frage jetzt erst nach Benutzername und Passwort -
dieselben wie beim Anmelden im Browser. Lege damit
`~/.config/schul-plugins/webuntis.env` an (Schluessel `WEBUNTIS_SERVER`,
`WEBUNTIS_SCHULE`, `WEBUNTIS_USER`, `WEBUNTIS_PASSWORT`) und setze `chmod 600`.

**4. Anmeldung pruefen:**

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/untis.py" test
```

Danach ist `/untis-woche` einsatzbereit.

Gib das Passwort nie in der Antwort wieder und schreibe es in keine andere Datei.
Laeuft diese Sitzung nicht auf dem Rechner des Nutzers, sondern in einer
Cloud-Umgebung, sag ihm das: die Datei gehoert auf seinen eigenen Rechner.
