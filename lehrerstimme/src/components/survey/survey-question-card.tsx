"use client";

import type { SurveyQuestionOption } from "@/types/survey";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { SurveyQuestionOptionRow } from "@/components/survey/survey-question-option-row";

type SurveyQuestionCardProps = {
  step: { current: number; total: number };
  questionText: string;
  options: SurveyQuestionOption[];
  value: string | null;
  onValueChange: (key: string) => void;
  disabled?: boolean;
};

export function SurveyQuestionCard({
  step,
  questionText,
  options,
  value,
  onValueChange,
  disabled,
}: SurveyQuestionCardProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border/60">
        <CardDescription>
          Frage {step.current} von {step.total}
        </CardDescription>
        <CardTitle className="text-balance text-base sm:text-lg">
          {questionText}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <RadioGroup
          value={value ?? undefined}
          onValueChange={(next) => onValueChange(String(next))}
          className="gap-3"
        >
          {options.map((option) => (
            <SurveyQuestionOptionRow
              key={option.key}
              value={option.key}
              label={option.label}
              disabled={disabled}
            />
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
