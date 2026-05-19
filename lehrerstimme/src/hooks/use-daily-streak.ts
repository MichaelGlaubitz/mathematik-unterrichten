"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { StreakState } from "@/lib/survey/streak-logic";
import {
  computeStreakAfterParticipation,
  getDisplayedStreak,
} from "@/lib/survey/streak-logic";
import { loadStreakState, saveStreakState } from "@/lib/storage/streak-storage";
import { subscribeStorageChanged } from "@/lib/storage/storage-events";
import { createVersionedStore } from "@/lib/storage/versioned-store";
import { useClientSurveyCalendarDay } from "@/hooks/use-survey-calendar-day";

const streakVersionStore = createVersionedStore();

function subscribeStreak(onStoreChange: () => void) {
  const offVersion = streakVersionStore.subscribe(onStoreChange);
  const offStorage = subscribeStorageChanged(() => {
    streakVersionStore.bump();
  });
  return () => {
    offVersion();
    offStorage();
  };
}

export type UseDailyStreakResult = {
  raw: StreakState;
  displayedStreak: number;
  registerParticipation: () => void;
};

export function useDailyStreak(): UseDailyStreakResult {
  const { today, yesterday } = useClientSurveyCalendarDay();
  const version = useSyncExternalStore(
    subscribeStreak,
    streakVersionStore.getSnapshot,
    streakVersionStore.getServerSnapshot,
  );

  const raw = useMemo(() => {
    if (version === 0) {
      return { streakCount: 0, lastParticipationDay: null } satisfies StreakState;
    }
    return loadStreakState();
  }, [version]);

  const registerParticipation = useCallback(() => {
    if (!today) return;
    const prev = loadStreakState();
    const next = computeStreakAfterParticipation(prev, today, yesterday);
    saveStreakState(next);
  }, [today, yesterday]);

  const displayedStreak =
    today && yesterday ? getDisplayedStreak(raw, today, yesterday) : 0;

  return useMemo(
    () => ({
      raw,
      displayedStreak,
      registerParticipation,
    }),
    [displayedStreak, raw, registerParticipation],
  );
}
