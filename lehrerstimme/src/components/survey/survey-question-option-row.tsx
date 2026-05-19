"use client";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SurveyQuestionOptionRowProps = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function SurveyQuestionOptionRow({
  value,
  label,
  disabled,
}: SurveyQuestionOptionRowProps) {
  return (
    <Label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background/60 p-3 transition-colors",
        "hover:border-primary/40 hover:bg-muted/30",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <RadioGroupItem value={value} disabled={disabled} className="mt-0.5" />
      <span className="text-sm leading-snug text-foreground">{label}</span>
    </Label>
  );
}
