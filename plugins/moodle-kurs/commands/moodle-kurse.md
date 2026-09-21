---
description: Listet die eigenen Moodle-Kurse mit ihren IDs
allowed-tools: Bash(python3:*)
---

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/moodle.py" kurse
```

Gib die Liste geordnet wieder und frage, zu welchem Kurs du weiterschauen sollst
(Aufgaben, Abgaben, Teilnehmer).
