---
description: Laedt einen IServ-Ordner mit Abgaben herunter
argument-hint: "<Ordner auf dem IServ> [Zielordner lokal]"
allowed-tools: Bash(python3:*)
---

Hole die Abgaben aus: $ARGUMENTS

1. Ordner mit `ls` bestaetigen, damit klar ist, was geholt wird.
2. Dann:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/iserv.py" get "<ordner>" --rekursiv --ziel "<lokaler ordner>"
```

Vorgabe fuer den lokalen Ordner ist `~/Downloads`, nicht das Projektverzeichnis -
Schuelerarbeiten gehoeren nicht in ein Repository. Nenne danach, wie viele Dateien
angekommen sind und wo sie liegen.
