import { ZoomableChartFrame } from "@/components/charts/zoomable-chart-frame";
import { ResultsBarChart } from "@/components/charts/results-bar-chart";
import { ResultsDonutChart } from "@/components/charts/results-donut-chart";
import { Separator } from "@/components/ui/separator";
import { DailyReadCard } from "@/components/survey/daily-read-card";

import type { DemoQuestion } from "@/lib/demo/mock-today-survey";
import { DEMO_DAILY_READ } from "@/lib/demo/mock-today-survey";

type DashboardDemoResultsProps = {
  questions: DemoQuestion[];
  showResults: boolean;
};

export function DashboardDemoResults({
  questions,
  showResults,
}: DashboardDemoResultsProps) {
  if (!showResults) return null;

  return (
    <div className="space-y-8">
      <Separator />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">Heutige Stimmung (Demo)</h2>
        <p className="text-sm text-muted-foreground">
          Anonyme Verteilung — später aus Supabase aggregiert, ohne Personenbezug.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {questions.map((question) => (
          <ZoomableChartFrame
            key={question.id}
            label={`Balkendiagramm zu: ${question.text}`}
          >
            <ResultsBarChart
              title={question.text}
              rows={question.results}
              caption="Hinweis: Zahlen sind im MVP nur demonstrativ."
            />
          </ZoomableChartFrame>
        ))}
      </div>

      <ZoomableChartFrame label="Kreisdiagramm zur ersten Frage (Demo)">
        <ResultsDonutChart
          title={questions[0]?.text ?? "Erste Frage"}
          rows={questions[0]?.results ?? []}
          caption="Kreisdiagramm eignet sich für schnelle Anteilsschätzungen."
        />
      </ZoomableChartFrame>

      <DailyReadCard
        text={DEMO_DAILY_READ.text}
        href={DEMO_DAILY_READ.href}
        linkLabel={DEMO_DAILY_READ.linkLabel}
      />
    </div>
  );
}
