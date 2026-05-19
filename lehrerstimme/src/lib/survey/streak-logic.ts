export type StreakState = {
  streakCount: number;
  /** Letzter Tag mit registrierter Teilnahme (Berlin YYYY-MM-DD). */
  lastParticipationDay: string | null;
};

export function computeStreakAfterParticipation(
  prev: StreakState,
  today: string,
  yesterday: string,
): StreakState {
  if (prev.lastParticipationDay === today) {
    return prev;
  }
  if (prev.lastParticipationDay === null) {
    return { streakCount: 1, lastParticipationDay: today };
  }
  if (prev.lastParticipationDay === yesterday) {
    return {
      streakCount: prev.streakCount + 1,
      lastParticipationDay: today,
    };
  }
  return { streakCount: 1, lastParticipationDay: today };
}

/** Anzeige-Streak: 0, wenn die Kette bereits gebrochen ist. */
export function getDisplayedStreak(
  state: StreakState,
  today: string,
  yesterday: string,
): number {
  if (state.lastParticipationDay === null) return 0;
  if (state.lastParticipationDay === today) return state.streakCount;
  if (state.lastParticipationDay === yesterday) return state.streakCount;
  return 0;
}
