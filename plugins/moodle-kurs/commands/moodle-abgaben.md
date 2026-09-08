---
description: Zeigt den Abgabestand einer Moodle-Aufgabe samt offener Namen
argument-hint: "[Kursname oder Kurs-ID] [optional: Aufgabenname]"
allowed-tools: Bash(python3:*)
---

Ermittle den Abgabestand zu: $ARGUMENTS

1. Ohne Kurs-ID zuerst `kurse` aufrufen und den passenden Kurs heraussuchen.
2. Dann `aufgaben --kurs <ID>`; ist keine Aufgabe genannt, nimm die mit der
   naechstliegenden Frist und sag, welche du gewaehlt hast.
3. Dann:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/moodle.py" abgaben --aufgabe <AUFGABE> --kurs <KURS>
```

Antworte mit: Anzahl abgegeben, Frist, Liste der offenen Namen. Biete an, daraus
eine kurze Erinnerungsnachricht zu formulieren.
