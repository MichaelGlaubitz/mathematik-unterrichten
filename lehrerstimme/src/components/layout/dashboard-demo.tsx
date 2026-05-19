"use client";

import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { DashboardDemoResults } from "@/components/layout/dashboard-demo-results";
import { SurveyDailyProgress } from "@/components/survey/survey-daily-progress";
import { SurveyQuestionCard } from "@/components/survey/survey-question-card";
import { DEMO_DAILY_READ, DEMO_QUESTIONS } from "@/lib/demo/mock-today-survey";

export function DashboardDemo() {
  const [answers, setAnswers] = useState<Record<string, string | null>>({});

  const answeredCount = useMemo(() => {
    return DEMO_QUESTIONS.filter((q) => Boolean(answers[q.id])).length;
  }, [answers]);

  const allAnswered = answeredCount === DEMO_QUESTIONS.length;

  return (
    <AppShell>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Lehrerstimme · MVP-Demo
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
          Tägliche Micro-Umfrage
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Drei Fragen, anonyme Auswertung, klare Visualisierung — ohne Konto und ohne
          Zuordnung zu Personen.
        </p>
      </div>

      <div className="space-y-6 pt-6">
        <SurveyDailyProgress answered={answeredCount} total={DEMO_QUESTIONS.length} />

        <div className="space-y-4">
          {DEMO_QUESTIONS.map((question, index) => (
            <SurveyQuestionCard
              key={question.id}
              step={{ current: index + 1, total: DEMO_QUESTIONS.length }}
              questionText={question.text}
              options={question.options}
              value={answers[question.id] ?? null}
              onValueChange={(key) =>
                setAnswers((prev) => ({ ...prev, [question.id]: key }))
              }
            />
          ))}
        </div>

        <DashboardDemoResults questions={DEMO_QUESTIONS} showResults={allAnswered} />

        {!allAnswered ? (
          <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-sm text-muted-foreground">
            Sobald alle drei Fragen beantwortet sind, sehen Sie die Verteilung und den Impuls des
            Tages.
          </p>
        ) : null}
      </div>
    </AppShell>
  );
}
