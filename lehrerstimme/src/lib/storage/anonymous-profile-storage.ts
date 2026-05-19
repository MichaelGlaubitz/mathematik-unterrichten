import type { AnonymousTeacherProfile } from "@/types/onboarding";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import { safeJsonParse } from "@/lib/storage/safe-json-parse";
import { notifyStorageChanged } from "@/lib/storage/storage-events";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isValidProfile(v: unknown): v is AnonymousTeacherProfile {
  if (!isRecord(v)) return false;
  return (
    typeof v.bundesland === "string" &&
    typeof v.schulform === "string" &&
    typeof v.faechergruppe === "string" &&
    typeof v.alterskohorte === "string" &&
    typeof v.updated_at === "string"
  );
}

export function loadAnonymousProfile(): AnonymousTeacherProfile | null {
  if (typeof window === "undefined") return null;
  const parsed = safeJsonParse<unknown>(
    window.localStorage.getItem(STORAGE_KEYS.anonymousTeacherProfile),
  );
  return isValidProfile(parsed) ? parsed : null;
}

export function saveAnonymousProfile(profile: AnonymousTeacherProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEYS.anonymousTeacherProfile,
    JSON.stringify(profile),
  );
  notifyStorageChanged();
}

export function clearAnonymousProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.anonymousTeacherProfile);
  notifyStorageChanged();
}
