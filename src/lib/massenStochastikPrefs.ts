/**
 * localStorage: letzte gewählte Aufgabenanzahl für WB Stochastik (Themenseite + Übungsroute).
 */
export const MASSEN_STOCHASTIK_ANZAHL_KEY = 'mu-massen-stochastik-anzahl';

/** localStorage: letzte Darstellung `arbeitsblatt` | `whiteboard`. */
export const MASSEN_STOCHASTIK_LAYOUT_KEY = 'mu-massen-stochastik-layout';

const ALLOWED_ANZAHL = new Set([5, 10, 15, 20, 30, 40, 50]);

export function readStochastikMassenAnzahl(): number {
  if (typeof localStorage === 'undefined') return 10;
  const n = Number(localStorage.getItem(MASSEN_STOCHASTIK_ANZAHL_KEY));
  return ALLOWED_ANZAHL.has(n) ? n : 10;
}

export function writeStochastikMassenAnzahl(n: number): void {
  if (typeof localStorage === 'undefined' || !ALLOWED_ANZAHL.has(n)) return;
  try {
    localStorage.setItem(MASSEN_STOCHASTIK_ANZAHL_KEY, String(n));
  } catch {
    /* Quota / private mode */
  }
}

export function readStochastikMassenLayout(): 'arbeitsblatt' | 'whiteboard' {
  if (typeof localStorage === 'undefined') return 'arbeitsblatt';
  const v = localStorage.getItem(MASSEN_STOCHASTIK_LAYOUT_KEY);
  return v === 'whiteboard' ? 'whiteboard' : 'arbeitsblatt';
}

export function writeStochastikMassenLayout(layout: 'arbeitsblatt' | 'whiteboard'): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(MASSEN_STOCHASTIK_LAYOUT_KEY, layout);
  } catch {
    /* */
  }
}
