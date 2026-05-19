const CHART_VAR_NAMES = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export function chartColorAt(index: number): string {
  return CHART_VAR_NAMES[index % CHART_VAR_NAMES.length];
}
