"use client";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

type SurveyDailyProgressProps = {
  answered: number;
  total: number;
};

export function SurveyDailyProgress({ answered, total }: SurveyDailyProgressProps) {
  const safeTotal = Math.max(1, total);
  const value = Math.round((100 * answered) / safeTotal);

  return (
    <Progress
      value={value}
      max={100}
      getAriaValueText={() => `${answered} von ${total} Fragen beantwortet`}
    >
      <div className="flex w-full flex-wrap items-center gap-2">
        <ProgressLabel>Tagesfortschritt</ProgressLabel>
        <ProgressValue />
      </div>
    </Progress>
  );
}
