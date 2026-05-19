/** Aggregierte Antwortverteilung für Diagramme (ohne Personenbezug). */
export type PollResultRow = {
  key: string;
  label: string;
  count: number;
};

export type PollResultsBlock = {
  questionId: string;
  questionLabel: string;
  rows: PollResultRow[];
};
