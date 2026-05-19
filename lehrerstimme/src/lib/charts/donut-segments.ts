import type { PollResultRow } from "@/types/poll-results";

export type DonutSegment = {
  row: PollResultRow;
  index: number;
  share: number;
  startAngle: number;
  endAngle: number;
  isFull: boolean;
};

export function buildDonutSegments(rows: PollResultRow[], total: number): DonutSegment[] {
  if (total <= 0) return [];

  const twoPi = Math.PI * 2;
  let angle = 0;

  return rows
    .map((row, index) => {
      const share = row.count / total;
      const sweep = share * twoPi;
      const startAngle = angle;
      const endAngle = angle + sweep;
      angle = endAngle;
      return {
        row,
        index,
        share,
        startAngle,
        endAngle,
        isFull: share >= 1 - 1e-9,
      };
    })
    .filter((segment) => segment.share > 0);
}
