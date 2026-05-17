/** localStorage: letzte gewählte Aufgabenanzahl für WB Negative Zahlen (Themenseite + Übungsroute). */
export const MASSEN_NZ_ANZAHL_KEY = 'mu-massen-negative-zahlen-anzahl';

/** localStorage: letzte Darstellung `arbeitsblatt` | `whiteboard`. */
export const MASSEN_NZ_LAYOUT_KEY = 'mu-massen-negative-zahlen-layout';

const ALLOWED_ANZAHL = new Set([5, 10, 15, 20, 30, 40, 50]);

export function readNzMassenAnzahl(): number {
  if (typeof localStorage === 'undefined') return 10;
  const n = Number(localStorage.getItem(MASSEN_NZ_ANZAHL_KEY));
  return ALLOWED_ANZAHL.has(n) ? n : 10;
}

export function writeNzMassenAnzahl(n: number): void {
  if (typeof localStorage === 'undefined' || !ALLOWED_ANZAHL.has(n)) return;
  try {
    localStorage.setItem(MASSEN_NZ_ANZAHL_KEY, String(n));
  } catch {
    /* Quota / private mode */
  }
}

export function readNzMassenLayout(): 'arbeitsblatt' | 'whiteboard' {
  if (typeof localStorage === 'undefined') return 'arbeitsblatt';
  const v = localStorage.getItem(MASSEN_NZ_LAYOUT_KEY);
  return v === 'whiteboard' ? 'whiteboard' : 'arbeitsblatt';
}

export function writeNzMassenLayout(layout: 'arbeitsblatt' | 'whiteboard'): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(MASSEN_NZ_LAYOUT_KEY, layout);
  } catch {
    /* */
  }
}
