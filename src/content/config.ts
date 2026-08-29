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
    kommentare: z.array(
      z.object({
        nutzer: z.string(),
        zeit: z.string(),
        text: z.string(),
      })
    ).optional(),
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
    // Der Kopf für die Lehrkraft: Wer die Folge zum ersten Mal öffnet, muss in
    // drei Sätzen wissen, worauf sie hinausläuft und was er sagt.
    ziel: z.string().optional(),
    variation: z.string().optional(),
    regie: z.array(z.string()).default([]),
    stolperstelle: z.string().optional(),
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

// Stundenverläufe: vollständig geplante Einzel- und Doppelstunden nach KLAR.
// Sie verknüpfen die vorhandenen Bausteine – diagnostische Frage, Aufgabenfolge,
// Werkzeug, Exit-Ticket – zu einem Minutenplan, den man mitnehmen und halten kann.
const stunden = defineCollection({
  type: 'content',
  schema: z.object({
    titel: z.string(),
    /** Join-Schlüssel: identisch mit `thema` in Aufgaben/Quizzes/Themen. */
    thema: z.string(),
    klassenstufe: z.array(z.string()),
    /** Nur ganze Stunden: 45 oder 90 Minuten. */
    dauer: z.union([z.literal(45), z.literal(90)]),
    /** Ein Satz: Was können die Lernenden am Ende, was sie vorher nicht konnten? */
    stundenziel: z.string(),
    /** Teaser für die Übersicht. */
    kurz: z.string(),
    voraussetzungen: z.array(z.string()).default([]),
    material: z.array(z.string()).default([]),
    /** Die diagnostische Frage zu Stundenbeginn (Schritt K). */
    einstiegsfrage: z.object({
      frage: z.string(),
      antworten: z
        .array(
          z.object({
            text: z.string(),
            korrekt: z.boolean(),
            /** Was denkt jemand, der diese Antwort wählt? */
            deutung: z.string(),
          })
        )
        .min(2)
        .max(5),
      /** Optional: passendes Quiz für eine längere Diagnose. */
      quiz: z.string().optional(),
    }),
    phasen: z
      .array(
        z.object({
          schritt: z.enum(['K', 'L', 'A', 'R']),
          /** Startminute, gemessen ab Stundenbeginn. */
          minute: z.number(),
          dauer: z.number(),
          titel: z.string(),
          /** Was in der Klasse passiert. */
          ablauf: z.string(),
          /** Was die Lehrkraft in dieser Phase tut – und was nicht. */
          lehrkraft: z.string(),
          werkzeug: z.object({ text: z.string(), href: z.string() }).optional(),
        })
      )
      .min(4),
    /** Weichen: Was tun, wenn die Diagnose anders ausfällt als geplant? */
    weichen: z.array(z.object({ wenn: z.string(), dann: z.string() })).default([]),
    exitTicket: z.array(z.string()).min(2).max(3),
    differenzierung: z.object({ schneller: z.string(), langsamer: z.string() }),
    stolpersteine: z
      .array(z.object({ fehlvorstellung: z.string(), reaktion: z.string() }))
      .default([]),
    hausaufgabe: z.string().optional(),
    tags: z.array(z.string()).default([]),
    datum: z.coerce.date(),
    aktualisiert: z.coerce.date().optional(),
    entwurf: z.boolean().default(false),
  }),
});

export const collections = { blog, aufgaben, quizzes, themen, stunden };
