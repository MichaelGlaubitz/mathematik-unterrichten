---
description: Zeigt den eigenen Stundenplan dieser Woche aus WebUntis
argument-hint: "[optional: klasse:10b | lehrer:GLA | raum:A102]"
allowed-tools: Bash(python3:*)
---

Rufe den Stundenplan fuer diese Woche ab:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/untis.py" plan --woche --wer "${ARGUMENTS:-ich}"
```

Fasse das Ergebnis danach kurz zusammen: wie viele Stunden, an welchen Tagen es
lang wird, wo Freistunden liegen und ob etwas ausfaellt.
