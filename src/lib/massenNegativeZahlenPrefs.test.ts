// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  MASSEN_NZ_ANZAHL_KEY,
  MASSEN_NZ_LAYOUT_KEY,
  readNzMassenAnzahl,
  readNzMassenLayout,
  writeNzMassenAnzahl,
  writeNzMassenLayout,
} from './massenNegativeZahlenPrefs';

describe('massenNegativeZahlenPrefs', () => {
  beforeEach(() => {
    localStorage.removeItem(MASSEN_NZ_ANZAHL_KEY);
    localStorage.removeItem(MASSEN_NZ_LAYOUT_KEY);
  });
  afterEach(() => {
    localStorage.removeItem(MASSEN_NZ_ANZAHL_KEY);
    localStorage.removeItem(MASSEN_NZ_LAYOUT_KEY);
  });

  it('liest und schreibt die Aufgabenanzahl', () => {
    expect(readNzMassenAnzahl()).toBe(10);
    writeNzMassenAnzahl(20);
    expect(localStorage.getItem(MASSEN_NZ_ANZAHL_KEY)).toBe('20');
    expect(readNzMassenAnzahl()).toBe(20);
  });

  it('ignoriert ungültige Anzahlen', () => {
    localStorage.setItem(MASSEN_NZ_ANZAHL_KEY, '7');
    expect(readNzMassenAnzahl()).toBe(10);
  });

  it('liest und schreibt das Layout', () => {
    expect(readNzMassenLayout()).toBe('arbeitsblatt');
    writeNzMassenLayout('whiteboard');
    expect(localStorage.getItem(MASSEN_NZ_LAYOUT_KEY)).toBe('whiteboard');
    expect(readNzMassenLayout()).toBe('whiteboard');
  });
});
