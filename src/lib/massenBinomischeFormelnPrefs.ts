/**
 * localStorage: letzte gewählte Aufgabenanzahl für WB Binomische Formeln (Themenseite + Übungsroute).
 */
export const MASSEN_BF_ANZAHL_KEY = 'mu-massen-binomische-formeln-anzahl';

/** localStorage: letzte Darstellung `arbeitsblatt` | `whiteboard`. */
export const MASSEN_BF_LAYOUT_KEY = 'mu-massen-binomische-formeln-layout';

const ALLOWED_ANZAHL = new Set([5, 10, 15, 20, 30, 40, 50]);

export function readBfMassenAnzahl(): number {
  if (typeof localStorage === 'undefined') return 10;
  const n = Number(localStorage.getItem(MASSEN_BF_ANZAHL_KEY));
  return ALLOWED_ANZAHL.has(n) ? n : 10;
}

export function writeBfMassenAnzahl(n: number): void {
  if (typeof localStorage === 'undefined' || !ALLOWED_ANZAHL.has(n)) return;
  try {
    localStorage.setItem(MASSEN_BF_ANZAHL_KEY, String(n));
  } catch {
    /* Quota / private mode */
  }
}

export function readBfMassenLayout(): 'arbeitsblatt' | 'whiteboard' {
  if (typeof localStorage === 'undefined') return 'arbeitsblatt';
  const v = localStorage.getItem(MASSEN_BF_LAYOUT_KEY);
  return v === 'whiteboard' ? 'whiteboard' : 'arbeitsblatt';
}

export function writeBfMassenLayout(layout: 'arbeitsblatt' | 'whiteboard'): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(MASSEN_BF_LAYOUT_KEY, layout);
  } catch {
    /* */
  }
}
