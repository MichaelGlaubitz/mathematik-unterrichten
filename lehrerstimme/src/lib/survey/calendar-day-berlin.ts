import { subDays } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const BERLIN = "Europe/Berlin";

/** Kalendertag YYYY-MM-DD in Europe/Berlin (für Fragen & Streak). */
export function getSurveyCalendarDay(date: Date = new Date()): string {
  return formatInTimeZone(date, BERLIN, "yyyy-MM-dd");
}

/** Vortag relativ zu `date` im Berliner Kalender. */
export function getYesterdaySurveyCalendarDay(date: Date = new Date()): string {
  const zoned = toZonedTime(date, BERLIN);
  return formatInTimeZone(subDays(zoned, 1), BERLIN, "yyyy-MM-dd");
}
