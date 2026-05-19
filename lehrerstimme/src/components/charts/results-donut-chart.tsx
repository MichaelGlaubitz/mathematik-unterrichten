import type { PollResultRow } from "@/types/poll-results";
import { chartColorAt } from "@/lib/charts/chart-color-at";
import { percentagesFromCounts } from "@/lib/charts/percentages-from-counts";
import { buildDonutSegments } from "@/lib/charts/donut-segments";
import { fullDonutPath } from "@/lib/charts/full-donut-path";
import { donutWedgePath } from "@/lib/charts/donut-wedge-path";

type ResultsDonutChartProps = {
  title: string;
  rows: PollResultRow[];
  caption?: string;
};

const CX = 50;
const CY = 50;
const R = 38;
const INNER = 22;

export function ResultsDonutChart({ title, rows, caption }: ResultsDonutChartProps) {
  const counts = rows.map((r) => r.count);
  const percents = percentagesFromCounts(counts);
  const total = counts.reduce((a, b) => a + b, 0);
  const segments = buildDonutSegments(rows, total);

  return (
    <figure className="space-y-3">
      <figcaption className="text-sm font-semibold text-foreground">{title}</figcaption>
      {caption ? (
        <p className="text-xs text-muted-foreground" role="note">
          {caption}
        </p>
      ) : null}
      {total === 0 ? (
        <p className="text-sm text-muted-foreground">Noch keine Stimmen für diesen Tag.</p>
      ) : (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <svg viewBox="0 0 100 100" className="size-44 shrink-0" aria-hidden>
            {segments.map((segment) => (
              <path
                key={segment.row.key}
                fillRule={segment.isFull ? "evenodd" : "nonzero"}
                d={
                  segment.isFull
                    ? fullDonutPath(CX, CY, R, INNER)
                    : donutWedgePath(
                        CX,
                        CY,
                        R,
                        INNER,
                        segment.startAngle,
                        segment.endAngle,
                      )
                }
                fill={chartColorAt(segment.index)}
              />
            ))}
          </svg>
          <ul className="min-w-0 flex-1 space-y-2 text-sm" aria-label="Legende Kreisdiagramm">
            {rows.map((row, index) => (
              <li key={row.key} className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: chartColorAt(index) }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate">{row.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {percents[index] ?? 0}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </figure>
  );
}
