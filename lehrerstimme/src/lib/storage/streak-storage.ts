import type { StreakState } from "@/lib/survey/streak-logic";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import { safeJsonParse } from "@/lib/storage/safe-json-parse";
import { notifyStorageChanged } from "@/lib/storage/storage-events";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isValidStreak(v: unknown): v is StreakState {
  if (!isRecord(v)) return false;
  const last = v.lastParticipationDay;
  return (
    typeof v.streakCount === "number" &&
    Number.isFinite(v.streakCount) &&
    (last === null || typeof last === "string")
  );
}

export function loadStreakState(): StreakState {
  if (typeof window === "undefined") {
    return { streakCount: 0, lastParticipationDay: null };
  }
  const parsed = safeJsonParse<unknown>(
    window.localStorage.getItem(STORAGE_KEYS.participationStreak),
  );
  return isValidStreak(parsed) ? parsed : { streakCount: 0, lastParticipationDay: null };
}

export function saveStreakState(state: StreakState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEYS.participationStreak,
    JSON.stringify(state),
  );
  notifyStorageChanged();
}
