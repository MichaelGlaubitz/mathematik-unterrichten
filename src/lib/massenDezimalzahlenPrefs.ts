/** localStorage: letzte gewählte Aufgabenanzahl für WB Dezimalzahlen (Themenseite + Übungsroute). */
export const MASSEN_DZ_ANZAHL_KEY = 'mu-massen-dezimalzahlen-anzahl';

/** localStorage: letzte Darstellung `arbeitsblatt` | `whiteboard`. */
export const MASSEN_DZ_LAYOUT_KEY = 'mu-massen-dezimalzahlen-layout';

const ALLOWED_ANZAHL = new Set([5, 10, 15, 20, 30, 40, 50]);

export function readDzMassenAnzahl(): number {
  if (typeof localStorage === 'undefined') return 10;
  const n = Number(localStorage.getItem(MASSEN_DZ_ANZAHL_KEY));
  return ALLOWED_ANZAHL.has(n) ? n : 10;
}

export function writeDzMassenAnzahl(n: number): void {
  if (typeof localStorage === 'undefined' || !ALLOWED_ANZAHL.has(n)) return;
  try {
    localStorage.setItem(MASSEN_DZ_ANZAHL_KEY, String(n));
  } catch {
    /* Quota / private mode */
  }
}

export function readDzMassenLayout(): 'arbeitsblatt' | 'whiteboard' {
  if (typeof localStorage === 'undefined') return 'arbeitsblatt';
  const v = localStorage.getItem(MASSEN_DZ_LAYOUT_KEY);
  return v === 'whiteboard' ? 'whiteboard' : 'arbeitsblatt';
}

export function writeDzMassenLayout(layout: 'arbeitsblatt' | 'whiteboard'): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(MASSEN_DZ_LAYOUT_KEY, layout);
  } catch {
    /* */
  }
}
