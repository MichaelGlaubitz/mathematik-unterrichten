import type { PollResultRow } from "@/types/poll-results";
import { percentagesFromCounts } from "@/lib/charts/percentages-from-counts";

import { ResultsBarRow } from "@/components/charts/results-bar-row";

type ResultsBarChartProps = {
  title: string;
  rows: PollResultRow[];
  caption?: string;
};

export function ResultsBarChart({ title, rows, caption }: ResultsBarChartProps) {
  const counts = rows.map((r) => r.count);
  const percents = percentagesFromCounts(counts);
  const maxCount = Math.max(0, ...counts);

  return (
    <figure className="space-y-3">
      <figcaption className="text-sm font-semibold text-foreground">{title}</figcaption>
      {caption ? (
        <p className="text-xs text-muted-foreground" role="note">
          {caption}
        </p>
      ) : null}
      <ul className="space-y-3" aria-label="Antwortverteilung">
        {rows.map((row, index) => (
          <ResultsBarRow
            key={row.key}
            row={row}
            maxCount={maxCount}
            index={index}
            percent={percents[index] ?? 0}
          />
        ))}
      </ul>
    </figure>
  );
}
