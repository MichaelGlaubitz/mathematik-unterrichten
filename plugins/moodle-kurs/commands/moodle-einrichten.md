---
description: Legt Adresse und Token fuer den Moodle-Zugang an
allowed-tools: Bash(python3:*), Bash(mkdir:*), Bash(chmod:*)
---

Richte den Moodle-Zugang ein.

1. Frage nach der Moodle-Adresse (z. B. `https://moodle.meine-schule.de`) und dem
   Token, falls beides nicht in `$ARGUMENTS` steht. Den Token erzeugt der Nutzer
   selbst in Moodle unter *Einstellungen -> Sicherheitsschluessel*; erklaere den Weg,
   wenn er ihn nicht kennt.
2. Lege `~/.config/schul-plugins/moodle.env` an mit `MOODLE_URL=` und `MOODLE_TOKEN=`
   und setze `chmod 600`.
3. Pruefe:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/moodle.py" test
```

Der Test zeigt auch, welche Funktionen freigegeben sind. Fehlen welche, nenne dem
Nutzer die Namen zum Weiterreichen an den Moodle-Administrator. Gib den Token nie
in der Antwort wieder.
