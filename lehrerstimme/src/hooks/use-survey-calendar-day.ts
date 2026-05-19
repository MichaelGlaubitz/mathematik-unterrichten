"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getSurveyCalendarDay,
  getYesterdaySurveyCalendarDay,
} from "@/lib/survey/calendar-day-berlin";

export type SurveyCalendarLabels = {
  today: string;
  yesterday: string;
};

/** Berliner Kalendertage aus einem stabilen Zeitpunkt (Tests / Props). */
export function useSurveyCalendarDay(anchor: Date): SurveyCalendarLabels {
  return useMemo(
    () => ({
      today: getSurveyCalendarDay(anchor),
      yesterday: getYesterdaySurveyCalendarDay(anchor),
    }),
    [anchor],
  );
}

let calendarVersion = 0;
const calendarListeners = new Set<() => void>();
let clientCalendarPrimed = false;

function subscribeClientCalendar(onStoreChange: () => void) {
  calendarListeners.add(onStoreChange);
  if (!clientCalendarPrimed) {
    clientCalendarPrimed = true;
    queueMicrotask(() => {
      calendarVersion += 1;
      calendarListeners.forEach((listener) => listener());
    });
  }
  return () => {
    calendarListeners.delete(onStoreChange);
  };
}

function getCalendarVersionSnapshot() {
  return calendarVersion;
}

function getCalendarVersionServerSnapshot() {
  return 0;
}

/**
 * Nach Hydration: Kalendertage aus echtem Client-„jetzt“.
 * Erste Client-Runde bleibt leer (wie Server), danach ein Store-Tick per Microtask.
 */
export function useClientSurveyCalendarDay(): SurveyCalendarLabels {
  const version = useSyncExternalStore(
    subscribeClientCalendar,
    getCalendarVersionSnapshot,
    getCalendarVersionServerSnapshot,
  );

  return useMemo(() => {
    if (version === 0) {
      return { today: "", yesterday: "" };
    }
    const live = new Date();
    return {
      today: getSurveyCalendarDay(live),
      yesterday: getYesterdaySurveyCalendarDay(live),
    };
  }, [version]);
}
