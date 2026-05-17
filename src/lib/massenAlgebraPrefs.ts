/** localStorage: letzte gewählte Aufgabenanzahl für WB Algebra (Themenseite + Übungsroute). */
export const MASSEN_ALGEBRA_ANZAHL_KEY = 'mu_algebra_massen_anzahl';

/** localStorage: letzte Darstellung `arbeitsblatt` | `whiteboard`. */
export const MASSEN_ALGEBRA_LAYOUT_KEY = 'mu_algebra_massen_layout';

const ALLOWED_ANZAHL = new Set([5, 10, 15, 20, 30, 40, 50]);

export function readAlgebraMassenAnzahl(): number {
  if (typeof localStorage === 'undefined') return 10;
  const n = Number(localStorage.getItem(MASSEN_ALGEBRA_ANZAHL_KEY));
  return ALLOWED_ANZAHL.has(n) ? n : 10;
}

export function writeAlgebraMassenAnzahl(n: number): void {
  if (typeof localStorage === 'undefined' || !ALLOWED_ANZAHL.has(n)) return;
  try {
    localStorage.setItem(MASSEN_ALGEBRA_ANZAHL_KEY, String(n));
  } catch {
    /* Quota / private mode */
  }
}

export function readAlgebraMassenLayout(): 'arbeitsblatt' | 'whiteboard' {
  if (typeof localStorage === 'undefined') return 'arbeitsblatt';
  const v = localStorage.getItem(MASSEN_ALGEBRA_LAYOUT_KEY);
  return v === 'whiteboard' ? 'whiteboard' : 'arbeitsblatt';
}

export function writeAlgebraMassenLayout(layout: 'arbeitsblatt' | 'whiteboard'): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(MASSEN_ALGEBRA_LAYOUT_KEY, layout);
  } catch {
    /* */
  }
}
