// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  MASSEN_ALGEBRA_ANZAHL_KEY,
  MASSEN_ALGEBRA_LAYOUT_KEY,
  readAlgebraMassenAnzahl,
  readAlgebraMassenLayout,
  writeAlgebraMassenAnzahl,
  writeAlgebraMassenLayout,
} from './massenAlgebraPrefs';

describe('massenAlgebraPrefs', () => {
  beforeEach(() => {
    localStorage.removeItem(MASSEN_ALGEBRA_ANZAHL_KEY);
    localStorage.removeItem(MASSEN_ALGEBRA_LAYOUT_KEY);
  });
  afterEach(() => {
    localStorage.removeItem(MASSEN_ALGEBRA_ANZAHL_KEY);
    localStorage.removeItem(MASSEN_ALGEBRA_LAYOUT_KEY);
  });

  it('liest und schreibt die Aufgabenanzahl', () => {
    expect(readAlgebraMassenAnzahl()).toBe(10);
    writeAlgebraMassenAnzahl(20);
    expect(localStorage.getItem(MASSEN_ALGEBRA_ANZAHL_KEY)).toBe('20');
    expect(readAlgebraMassenAnzahl()).toBe(20);
  });

  it('ignoriert ungültige Anzahlen', () => {
    localStorage.setItem(MASSEN_ALGEBRA_ANZAHL_KEY, '7');
    expect(readAlgebraMassenAnzahl()).toBe(10);
  });

  it('liest und schreibt das Layout', () => {
    expect(readAlgebraMassenLayout()).toBe('arbeitsblatt');
    writeAlgebraMassenLayout('whiteboard');
    expect(localStorage.getItem(MASSEN_ALGEBRA_LAYOUT_KEY)).toBe('whiteboard');
    expect(readAlgebraMassenLayout()).toBe('whiteboard');
  });
});
