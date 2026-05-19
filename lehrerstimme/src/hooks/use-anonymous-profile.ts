"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { AnonymousTeacherProfile } from "@/types/onboarding";
import {
  clearAnonymousProfile,
  loadAnonymousProfile,
  saveAnonymousProfile,
} from "@/lib/storage/anonymous-profile-storage";
import { subscribeStorageChanged } from "@/lib/storage/storage-events";
import { createVersionedStore } from "@/lib/storage/versioned-store";

const profileVersionStore = createVersionedStore();

function subscribeProfile(onStoreChange: () => void) {
  const offVersion = profileVersionStore.subscribe(onStoreChange);
  const offStorage = subscribeStorageChanged(() => {
    profileVersionStore.bump();
  });
  return () => {
    offVersion();
    offStorage();
  };
}

export type UseAnonymousProfileResult = {
  profile: AnonymousTeacherProfile | null;
  isComplete: boolean;
  setProfile: (next: AnonymousTeacherProfile) => void;
  reset: () => void;
};

export function useAnonymousProfile(): UseAnonymousProfileResult {
  const version = useSyncExternalStore(
    subscribeProfile,
    profileVersionStore.getSnapshot,
    profileVersionStore.getServerSnapshot,
  );

  const profile = useMemo(() => {
    if (version === 0) return null;
    return loadAnonymousProfile();
  }, [version]);

  const setProfile = useCallback((next: AnonymousTeacherProfile) => {
    const stamped: AnonymousTeacherProfile = {
      ...next,
      updated_at: new Date().toISOString(),
    };
    saveAnonymousProfile(stamped);
  }, []);

  const reset = useCallback(() => {
    clearAnonymousProfile();
  }, []);

  return useMemo(
    () => ({
      profile,
      isComplete: profile !== null,
      setProfile,
      reset,
    }),
    [profile, reset, setProfile],
  );
}
