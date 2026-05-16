import { defineCollection, z } from 'astro:content';

// Blog: Didaktische Artikel, Reflexionen, Praxisberichte
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    untertitel: z.string().optional(),
    autor: z.string().default('Michael Glaubitz'),
    datum: z.coerce.date(),
    aktualisiert: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    kategorie: z.enum([
      'Didaktik',
      'Praxisbericht',
      'Aufgabenkultur',
      'Diagnose',
      'Reflexion',
      'Unterrichtsdesign',
      'Werkzeug',
      'Meinung',
    ]).default('Didaktik'),
    teaser: z.string(),
    bild: z.string().optional(),
    bildAlt: z.string().optional(),
    entwurf: z.boolean().default(false),
  }),
});

// Aufgabensammlung: Themenseiten mit Aufgaben + Lösungswegen + didaktischem Kommentar
const aufgaben = defineCollection({
  type: 'content',
  schema: z.object({
    titel: z.string(),
    thema: z.string(), // z.B. "Lineare Gleichungen", "Bruchrechnung"
    klassenstufe: z.array(z.string()), // z.B. ["7", "8"]
    schwierigkeit: z.enum(['einsteiger', 'mittel', 'vertieft']),
    didaktischerHinweis: z.string(),
    tags: z.array(z.string()).default([]),
    datum: z.coerce.date(),
    aktualisiert: z.coerce.date().optional(),
    entwurf: z.boolean().default(false),
  }),
});

// Diagnostische Quizzes: MC-Fragen mit typischen Fehlerantworten + Erklärungen
const quizzes = defineCollection({
  type: 'data',
  schema: z.object({
    titel: z.string(),
    thema: z.string(),
    klassenstufe: z.array(z.string()),
    didaktischerKontext: z.string(),
    fragen: z.array(
      z.object({
        frage: z.string(),
        // Optional: Bild- oder Formelreferenz vor/in der Frage
        kontext: z.string().optional(),
        optionen: z.array(
          z.object({
            text: z.string(),
            korrekt: z.boolean(),
            // Diagnostischer Hinweis: Was hat der Schüler gedacht, wenn er diese Antwort wählt?
            erklaerung: z.string(),
          })
        ).min(2).max(6),
      })
    ).length(6),
    datum: z.coerce.date(),
    aktualisiert: z.coerce.date().optional(),
    entwurf: z.boolean().default(false),
  }),
});

// Themen-Übersicht: Eine Themenseite (Klassenstufen-Cluster) bündelt Aufgaben,
// Diagnostische Fragen (Quizzes), Blog-Beiträge und Mini-Whiteboard-Aufgaben pro Thema.
const themen = defineCollection({
  type: 'data',
  schema: z.object({
    titel: z.string(),
    // Join-Schlüssel: identisch mit `thema` in Aufgaben/Quizzes.
    thema: z.string(),
    klassenstufeBand: z.enum(['5/6', '7/8', '9/10', 'Oberstufe']),
    klassenstufenAnzeige: z.string(), // z.B. "Klasse 5–6"
    ordnung: z.number().default(100),
    einfuehrung: z.string(),
    fehlvorstellungen: z.array(z.string()).default([]),
    whiteboardAufgaben: z
      .array(
        z.object({
          frage: z.string(),
          loesung: z.string(),
          /** Optional: Inline-SVG (trusted, aus Repo) unter der Frage */
          abbildungFrage: z.string().optional(),
          /** Optional: Inline-SVG unter der Lösung */
          abbildungLoesung: z.string().optional(),
        })
      )
      .default([]),
    // Tags, über die verwandte Blog-Beiträge gefunden werden.
    blogTags: z.array(z.string()).default([]),
    /** Optional: didaktische Cluster von Unterthemen (z. B. Bruchrechnung). */
    unterthemenBloecke: z
      .array(
        z.object({
          titel: z.string(),
          beschreibung: z.string().optional(),
          punkte: z.array(z.string()),
        })
      )
      .optional(),
    entwurf: z.boolean().default(false),
  }),
});

export const collections = { blog, aufgaben, quizzes, themen };
