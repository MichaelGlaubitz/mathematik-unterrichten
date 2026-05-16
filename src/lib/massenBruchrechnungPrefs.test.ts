// @vitest-environment happy-dom

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import {
  MASSEN_BRUCH_ANZAHL_KEY,
  MASSEN_BRUCH_LAYOUT_KEY,
  readBruchMassenAnzahl,
  readBruchMassenLayout,
  writeBruchMassenAnzahl,
  writeBruchMassenLayout,
} from './massenBruchrechnungPrefs';

describe('massenBruchrechnungPrefs', () => {
  beforeEach(() => {
    localStorage.removeItem(MASSEN_BRUCH_ANZAHL_KEY);
    localStorage.removeItem(MASSEN_BRUCH_LAYOUT_KEY);
  });
  afterEach(() => {
    localStorage.removeItem(MASSEN_BRUCH_ANZAHL_KEY);
    localStorage.removeItem(MASSEN_BRUCH_LAYOUT_KEY);
  });

  it('liest Standard-Anzahl 10', () => {
    expect(readBruchMassenAnzahl()).toBe(10);
  });

  it('speichert und liest erlaubte Anzahl', () => {
    writeBruchMassenAnzahl(30);
    expect(readBruchMassenAnzahl()).toBe(30);
  });

  it('ignoriert ungültige Anzahl beim Lesen', () => {
    localStorage.setItem(MASSEN_BRUCH_ANZAHL_KEY, '7');
    expect(readBruchMassenAnzahl()).toBe(10);
  });

  it('schreibt keine ungültige Anzahl', () => {
    writeBruchMassenAnzahl(7);
    expect(localStorage.getItem(MASSEN_BRUCH_ANZAHL_KEY)).toBeNull();
  });

  it('speichert Layout whiteboard', () => {
    writeBruchMassenLayout('whiteboard');
    expect(readBruchMassenLayout()).toBe('whiteboard');
  });

  it('fällt bei unbekanntem Layout-Wert auf Arbeitsblatt zurück', () => {
    localStorage.setItem(MASSEN_BRUCH_LAYOUT_KEY, 'foo');
    expect(readBruchMassenLayout()).toBe('arbeitsblatt');
  });
});
