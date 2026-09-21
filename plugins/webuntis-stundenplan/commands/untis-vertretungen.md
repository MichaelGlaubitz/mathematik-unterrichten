---
description: Zeigt Ausfaelle und Vertretungen der naechsten Tage aus WebUntis
argument-hint: "[optional: heute | morgen | woche | naechste-woche]"
allowed-tools: Bash(python3:*)
---

Zeitraum aus `$ARGUMENTS` (Vorgabe: diese Woche):

- `heute` oder `morgen` -> `vertretungen --von heute` bzw. `--von morgen`
- `woche` -> `vertretungen --woche`
- `naechste-woche` -> `vertretungen --naechste-woche`

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/untis.py" vertretungen --woche
```

Nenne anschliessend je Aenderung Datum, Stunde, Klasse und Grund. Wenn nichts
ansteht, sag genau das in einem Satz.
