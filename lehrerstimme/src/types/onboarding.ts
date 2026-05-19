/**
 * Demografisches Onboarding — ausschließlich lokal (LocalStorage).
 * Keine Verknüpfung zu Auth- oder Server-IDs.
 */

export type BundeslandCode =
  | "BW"
  | "BY"
  | "BE"
  | "BB"
  | "HB"
  | "HH"
  | "HE"
  | "MV"
  | "NI"
  | "NW"
  | "RP"
  | "SL"
  | "SN"
  | "ST"
  | "SH"
  | "TH";

export type SchulformCode =
  | "grundschule"
  | "haupt_realschule"
  | "gymnasium"
  | "gesamtschule"
  | "berufsschule_fos_bos"
  | "sonstige";

export type FaechergruppeCode =
  | "sprachen"
  | "mathematik_naturwissenschaften"
  | "gesellschaftswissenschaften"
  | "kuenstlerisch_aesthetisch"
  | "sport"
  | "grundschule_faecheruebergreifend"
  | "sonstige";

export type AlterskohorteCode =
  | "unter_30"
  | "30_39"
  | "40_49"
  | "50_59"
  | "60_plus"
  | "keine_angabe";

export type AnonymousTeacherProfile = {
  bundesland: BundeslandCode;
  schulform: SchulformCode;
  faechergruppe: FaechergruppeCode;
  alterskohorte: AlterskohorteCode;
  /** ISO-Zeitpunkt der letzten lokalen Aktualisierung (Gerät). */
  updated_at: string;
};
