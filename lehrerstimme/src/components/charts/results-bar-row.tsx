import type { PollResultRow } from "@/types/poll-results";
import { chartColorAt } from "@/lib/charts/chart-color-at";

type ResultsBarRowProps = {
  row: PollResultRow;
  maxCount: number;
  index: number;
  percent: number;
};

export function ResultsBarRow({
  row,
  maxCount,
  index,
  percent,
}: ResultsBarRowProps) {
  const width = maxCount > 0 ? Math.round((100 * row.count) / maxCount) : 0;

  return (
    <li className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] sm:items-center">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{row.label}</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {percent} % · {row.count} Stimmen
        </p>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
        role="presentation"
        aria-hidden
      >
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{
            width: `${width}%`,
            backgroundColor: chartColorAt(index),
          }}
        />
      </div>
      <span className="text-sm tabular-nums text-muted-foreground sm:text-right">
        {row.count}
      </span>
    </li>
  );
}
