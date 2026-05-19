/** LocalStorage-Schlüssel — strikt getrennt von Server-Session/Auth. */
export const STORAGE_KEYS = {
  anonymousTeacherProfile: "lehrerstimme.anonymous_profile.v1",
  participationStreak: "lehrerstimme.participation_streak.v1",
} as const;
