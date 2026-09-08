---
description: Legt die WebUntis-Zugangsdaten fuer dieses Plugin an
allowed-tools: Bash(python3:*), Bash(mkdir:*), Bash(chmod:*)
---

Richte den WebUntis-Zugang ein.

1. Frage nach den vier Angaben, falls sie nicht in `$ARGUMENTS` stehen:
   - Server (Anfang der WebUntis-Adresse, z. B. `https://ajax.webuntis.com`)
   - Schulkuerzel (in der Adresse hinter `?school=`)
   - Benutzername
   - Passwort
2. Lege damit `~/.config/schul-plugins/webuntis.env` an (Format `SCHLUESSEL=wert`,
   Schluessel: `WEBUNTIS_SERVER`, `WEBUNTIS_SCHULE`, `WEBUNTIS_USER`, `WEBUNTIS_PASSWORT`)
   und setze `chmod 600` auf die Datei.
3. Pruefe zum Schluss:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/untis.py" test
```

Gib das Passwort nie in der Antwort wieder und schreibe es in keine andere Datei.
