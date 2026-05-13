// @vitest-environment happy-dom

import { describe, it, expect, beforeEach } from 'vitest';
import {
  PRACTICE_DIAGRAMS_STORAGE_KEY,
  PRACTICE_DIAGRAM_TASK_PREFS_KEY,
  readShowPracticeDiagrams,
  writeShowPracticeDiagrams,
  hashPracticeTaskFrage,
  effectiveDiagramVisibleByHash,
  setDiagramEffectiveVisibleForHash,
  toggleDiagramForHash,
  syncPracticeDiagramUi,
} from './practiceDiagramPreference';

describe('practiceDiagramPreference', () => {
  beforeEach(() => {
    localStorage.removeItem(PRACTICE_DIAGRAMS_STORAGE_KEY);
    localStorage.removeItem(PRACTICE_DIAGRAM_TASK_PREFS_KEY);
    document.body.innerHTML = '';
  });

  it('globale Vorgabe: Standard aus (kein Eintrag in localStorage)', () => {
    expect(readShowPracticeDiagrams()).toBe(false);
  });

  it('hashPracticeTaskFrage ist stabil', () => {
    expect(hashPracticeTaskFrage('a  =  3')).toBe(hashPracticeTaskFrage('a = 3'));
  });

  it('ohne Override: folgt global', () => {
    const h = hashPracticeTaskFrage('Testfrage');
    expect(effectiveDiagramVisibleByHash(h)).toBe(false);
    writeShowPracticeDiagrams(true);
    expect(effectiveDiagramVisibleByHash(h)).toBe(true);
    writeShowPracticeDiagrams(false);
    expect(effectiveDiagramVisibleByHash(h)).toBe(false);
  });

  it('Override hide bei globalem An', () => {
    writeShowPracticeDiagrams(true);
    const h = hashPracticeTaskFrage('x');
    setDiagramEffectiveVisibleForHash(h, false);
    expect(effectiveDiagramVisibleByHash(h)).toBe(false);
  });

  it('Override show bei globalem Aus', () => {
    writeShowPracticeDiagrams(false);
    const h = hashPracticeTaskFrage('y');
    setDiagramEffectiveVisibleForHash(h, true);
    expect(effectiveDiagramVisibleByHash(h)).toBe(true);
  });

  it('setDiagramEffectiveVisibleForHash gleich global entfernt Eintrag', () => {
    const h = hashPracticeTaskFrage('z');
    writeShowPracticeDiagrams(true);
    setDiagramEffectiveVisibleForHash(h, false);
    setDiagramEffectiveVisibleForHash(h, true);
    expect(localStorage.getItem(PRACTICE_DIAGRAM_TASK_PREFS_KEY)).toBeNull();
  });

  it('toggleDiagramForHash schaltet effektive Sichtbarkeit', () => {
    writeShowPracticeDiagrams(true);
    const h = hashPracticeTaskFrage('t');
    expect(effectiveDiagramVisibleByHash(h)).toBe(true);
    toggleDiagramForHash(h);
    expect(effectiveDiagramVisibleByHash(h)).toBe(false);
    toggleDiagramForHash(h);
    expect(effectiveDiagramVisibleByHash(h)).toBe(true);
  });

  it('syncPracticeDiagramUi setzt hidden und Button-Text', () => {
    writeShowPracticeDiagrams(false);
    const h = hashPracticeTaskFrage('dom');
    setDiagramEffectiveVisibleForHash(h, true);
    document.body.innerHTML = `
      <button type="button" class="ug-task-diagram-toggle" data-mu-diagram-hash="${h}">x</button>
      <div class="mu-practice-diagram" data-mu-diagram-hash="${h}">svg</div>
    `;
    syncPracticeDiagramUi(document.body);
    const div = document.querySelector('.mu-practice-diagram') as HTMLElement;
    const btn = document.querySelector('button') as HTMLButtonElement;
    expect(div.classList.contains('hidden')).toBe(false);
    expect(btn.textContent).toBe('Skizze ausblenden');
    toggleDiagramForHash(h);
    syncPracticeDiagramUi(document.body);
    expect(div.classList.contains('hidden')).toBe(true);
    expect(btn.textContent).toBe('Skizze einblenden');
  });
});
