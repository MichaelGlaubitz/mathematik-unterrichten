import type { Bereich } from './suchindex';

/**
 * Reihenfolge und Farbe der Bereichs-Filter auf /suche.
 *
 * Bewusst als `Record<Bereich, …>` typisiert: Wer in `suchindex.ts` einen
 * Bereich ergänzt, bekommt hier einen Typfehler, statt dass der Filter still
 * einen ganzen Bereich verschweigt. Genau so waren die 23 Stundenverläufe im
 * Index gelandet, ohne je einen eigenen Filterknopf zu bekommen.
 *
 * Enthält keine Abhängigkeit auf `astro:content` – die Datei wird auch im
 * Browser-Bündel der Suchseite geladen.
 */
export const BEREICH_FARBE: Record<Bereich, string> = {
  Werkzeug: 'bg-accent-100 text-accent-800 dark:bg-sky-950/60 dark:text-sky-200',
  Übungsgenerator: 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-200',
  'Whiteboard-Runde': 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200',
  Stundenverlauf: 'bg-lime-100 text-lime-800 dark:bg-lime-950/60 dark:text-lime-200',
  Methode: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200',
  Thema: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200',
  Fehlvorstellung: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200',
  Aufgabe: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/60 dark:text-fuchsia-200',
  Diagnosefrage: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200',
  Blog: 'bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-ink-200',
  'KI-Prompt': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-200',
  Handreichung: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-200',
  Seite: 'bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-ink-200',
};

/** Alle Bereiche in Anzeigereihenfolge – für die Filterleiste. */
export const BEREICHE = Object.keys(BEREICH_FARBE) as Bereich[];
