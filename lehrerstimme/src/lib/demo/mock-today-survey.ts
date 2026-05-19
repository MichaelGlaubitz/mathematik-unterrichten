import type { SurveyQuestionOption } from "@/types/survey";
import type { PollResultRow } from "@/types/poll-results";

export type DemoQuestion = {
  id: string;
  text: string;
  options: SurveyQuestionOption[];
  results: PollResultRow[];
};

export const DEMO_DAILY_READ = {
  text: "Kurze Aufgaben mit variierter Darstellung fördern Transferleistung statt Scheinverständnis.",
  href: "https://example.com",
  linkLabel: "Weiterführende Lektüre (Beispiel-Link)",
};

export const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: "q1",
    text: "Wie bewerten Sie aktuell die Verfügbarkeit digitaler Fachmedien an Ihrer Schule?",
    options: [
      { key: "a", label: "Sehr gut" },
      { key: "b", label: "Eher gut" },
      { key: "c", label: "Eher schlecht" },
      { key: "d", label: "Sehr schlecht" },
    ],
    results: [
      { key: "a", label: "Sehr gut", count: 42 },
      { key: "b", label: "Eher gut", count: 118 },
      { key: "c", label: "Eher schlecht", count: 64 },
      { key: "d", label: "Sehr schlecht", count: 16 },
    ],
  },
  {
    id: "q2",
    text: "Trifft zu: „Ich kann fachliche Fortbildungen gut in den Unterricht übertragen.“",
    options: [
      { key: "a", label: "Trifft voll zu" },
      { key: "b", label: "Trifft teilweise zu" },
      { key: "c", label: "Trifft kaum zu" },
      { key: "d", label: "Trifft nicht zu" },
    ],
    results: [
      { key: "a", label: "Trifft voll zu", count: 31 },
      { key: "b", label: "Trifft teilweise zu", count: 141 },
      { key: "c", label: "Trifft kaum zu", count: 52 },
      { key: "d", label: "Trifft nicht zu", count: 16 },
    ],
  },
  {
    id: "q3",
    text: "Wie stark wirkt sich Ihrer Einschätzung nach der Lehrermangel auf Teamkultur aus?",
    options: [
      { key: "a", label: "Stark belastend" },
      { key: "b", label: "Sichtbar, aber tragfähig" },
      { key: "c", label: "Kaum spürbar" },
    ],
    results: [
      { key: "a", label: "Stark belastend", count: 97 },
      { key: "b", label: "Sichtbar, aber tragfähig", count: 103 },
      { key: "c", label: "Kaum spürbar", count: 38 },
    ],
  },
];
