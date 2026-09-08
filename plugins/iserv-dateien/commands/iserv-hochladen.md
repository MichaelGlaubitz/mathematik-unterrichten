---
description: Laedt eine Datei in einen IServ-Ordner
argument-hint: "<datei> [Zielordner, z. B. Kursordner der 10b]"
allowed-tools: Bash(python3:*)
---

Lade hoch: $ARGUMENTS

1. Zielordner suchen, statt ihn zu raten:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/iserv.py" ls "<bisher bekannter Pfad>"
```

   Beginne bei `test`, wenn noch kein Pfad bekannt ist, und hangle dich weiter.
2. Dann hochladen:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/iserv.py" put "<datei>" "<zielpfad inkl. dateiname>"
```

Liegt dort schon eine Datei, bricht der Befehl ab - frage nach, bevor du
`--ueberschreiben` setzt. Nenne am Ende den vollen Zielpfad.
