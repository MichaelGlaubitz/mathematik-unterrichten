---
description: Legt die IServ-Zugangsdaten fuer dieses Plugin an
allowed-tools: Bash(python3:*), Bash(mkdir:*), Bash(chmod:*)
---

Richte den IServ-Zugang ein.

1. Frage nach Schuladresse (z. B. `https://meine-schule.de`), Benutzername und
   Passwort, falls nicht in `$ARGUMENTS` enthalten. Es sind dieselben Daten wie
   beim Anmelden im Browser.
2. Lege `~/.config/schul-plugins/iserv.env` an mit `ISERV_URL=`, `ISERV_USER=`,
   `ISERV_PASSWORT=` und setze `chmod 600`.
3. Pruefe:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/iserv.py" test
```

Gib das Passwort nie in der Antwort wieder. Meldet der Test 404 auf die Wurzel,
ist das WebDAV-Modul auf dem Schulserver abgeschaltet - das muss der Administrator
freischalten.
