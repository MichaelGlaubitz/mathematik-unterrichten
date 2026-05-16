/** localStorage: letzte gewählte Aufgabenanzahl für WB Bruchrechnung (Themenseite + Übungsroute). */
export const MASSEN_BRUCH_ANZAHL_KEY = 'mu-massen-bruchrechnung-anzahl';

/** localStorage: letzte Darstellung `arbeitsblatt` | `whiteboard`. */
export const MASSEN_BRUCH_LAYOUT_KEY = 'mu-massen-bruchrechnung-layout';

const ALLOWED_ANZAHL = new Set([5, 10, 15, 20, 30, 40, 50]);

export function readBruchMassenAnzahl(): number {
  if (typeof localStorage === 'undefined') return 10;
  const n = Number(localStorage.getItem(MASSEN_BRUCH_ANZAHL_KEY));
  return ALLOWED_ANZAHL.has(n) ? n : 10;
}

export function writeBruchMassenAnzahl(n: number): void {
  if (typeof localStorage === 'undefined' || !ALLOWED_ANZAHL.has(n)) return;
  try {
    localStorage.setItem(MASSEN_BRUCH_ANZAHL_KEY, String(n));
  } catch {
    /* Quota / private mode */
  }
}

export function readBruchMassenLayout(): 'arbeitsblatt' | 'whiteboard' {
  if (typeof localStorage === 'undefined') return 'arbeitsblatt';
  const v = localStorage.getItem(MASSEN_BRUCH_LAYOUT_KEY);
  return v === 'whiteboard' ? 'whiteboard' : 'arbeitsblatt';
}

export function writeBruchMassenLayout(layout: 'arbeitsblatt' | 'whiteboard'): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(MASSEN_BRUCH_LAYOUT_KEY, layout);
  } catch {
    /* */
  }
}
