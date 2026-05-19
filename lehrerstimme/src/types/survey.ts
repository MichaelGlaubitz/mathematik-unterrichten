/**
 * Domain-Typen für Umfragen und anonyme Antworten.
 * Spaltennamen folgen der PostgreSQL-Konvention (snake_case), damit
 * Supabase-Row-Typen 1:1 abbildbar bleiben — ohne User-ID.
 */

/** Einzelne Antwortoption; entspricht einem JSONB-Element in `questions.options`. */
export type SurveyQuestionOption = {
  key: string;
  label: string;
};

/** Zeile in `questions` (nur öffentliche, nicht-personenbezogene Inhalte). */
export type SurveyQuestionRow = {
  id: string;
  text: string;
  options: SurveyQuestionOption[];
  active_date: string;
  daily_read_text: string | null;
  daily_read_link: string | null;
};

/**
 * Insert in `responses_anonymous`.
 * `meta_faechergruppe` entspricht DB-Spalte `meta_fächergruppe` (ASCII-Feldname im Client).
 */
export type AnonymousSurveyResponseInsert = {
  question_id: string;
  chosen_option: string;
  meta_bundesland: string;
  meta_schulform: string;
  meta_faechergruppe: string;
};

export type AnonymousSurveyResponseRow = AnonymousSurveyResponseInsert & {
  id: string;
  created_at: string;
};
