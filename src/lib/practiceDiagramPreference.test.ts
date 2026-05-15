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

  it('diagramDefaultHidden: bei globalem An zunächst aus', () => {
    writeShowPracticeDiagrams(true);
    const h = hashPracticeTaskFrage('Mal');
    expect(effectiveDiagramVisibleByHash(h, true)).toBe(false);
    toggleDiagramForHash(h, true);
    expect(effectiveDiagramVisibleByHash(h, true)).toBe(true);
    toggleDiagramForHash(h, true);
    expect(effectiveDiagramVisibleByHash(h, true)).toBe(false);
  });

  it('loesungGrafik: trotz diagramDefaultHidden sichtbar, außer bei explizitem hide', () => {
    writeShowPracticeDiagrams(false);
    const h = hashPracticeTaskFrage('Vgl');
    expect(effectiveDiagramVisibleByHash(h, true, true)).toBe(true);
    setDiagramEffectiveVisibleForHash(h, false, true, true);
    expect(effectiveDiagramVisibleByHash(h, true, true)).toBe(false);
    setDiagramEffectiveVisibleForHash(h, true, true, true);
    expect(effectiveDiagramVisibleByHash(h, true, true)).toBe(true);
  });

  it('toggleDiagramForHash mit loesungGrafik speichert hide gegen impliziten Default sichtbar', () => {
    const h = hashPracticeTaskFrage('wb-loes');
    expect(effectiveDiagramVisibleByHash(h, true, true)).toBe(true);
    toggleDiagramForHash(h, true, true);
    expect(effectiveDiagramVisibleByHash(h, true, true)).toBe(false);
    toggleDiagramForHash(h, true, true);
    expect(effectiveDiagramVisibleByHash(h, true, true)).toBe(true);
  });

  it('setDiagramEffectiveVisibleForHash mit diagramDefaultHidden: Eintrag nur bei Abweichung vom impliziten Default', () => {
    const h = hashPracticeTaskFrage('mul-x');
    writeShowPracticeDiagrams(true);
    setDiagramEffectiveVisibleForHash(h, true, true);
    expect(localStorage.getItem(PRACTICE_DIAGRAM_TASK_PREFS_KEY)).toContain('show');
    setDiagramEffectiveVisibleForHash(h, false, true);
    expect(localStorage.getItem(PRACTICE_DIAGRAM_TASK_PREFS_KEY)).toBeNull();
  });

  it('syncPracticeDiagramUi setzt hidden, Icon-Schalter und Zoom-Leiste', () => {
    writeShowPracticeDiagrams(false);
    const h = hashPracticeTaskFrage('dom');
    setDiagramEffectiveVisibleForHash(h, true);
    document.body.innerHTML = `
      <button type="button" class="ug-task-diagram-toggle" data-mu-diagram-hash="${h}" data-mu-diagram-default-hidden="false">x</button>
      <span data-mu-diagram-zoom-for="${h}" data-mu-diagram-default-hidden="false" class="zoom-wrap"></span>
      <div class="mu-practice-diagram" data-mu-diagram-hash="${h}" data-mu-diagram-default-hidden="false">svg</div>
    `;
    syncPracticeDiagramUi(document.body);
    const div = document.querySelector('.mu-practice-diagram') as HTMLElement;
    const btn = document.querySelector('button') as HTMLButtonElement;
    const zoomWrap = document.querySelector('.zoom-wrap') as HTMLElement;
    expect(div.classList.contains('hidden')).toBe(false);
    expect(btn.getAttribute('aria-label')).toBe('Skizze ausblenden');
    expect(btn.querySelector('svg')).toBeTruthy();
    expect(zoomWrap.classList.contains('hidden')).toBe(false);
    toggleDiagramForHash(h);
    syncPracticeDiagramUi(document.body);
    expect(div.classList.contains('hidden')).toBe(true);
    expect(btn.getAttribute('aria-label')).toBe('Skizze einblenden');
    expect(zoomWrap.classList.contains('hidden')).toBe(true);
  });

  it('syncPracticeDiagramUi: Lösungsgrafik-DIV sichtbar trotz diagramDefaultHidden', () => {
    writeShowPracticeDiagrams(true);
    const h = hashPracticeTaskFrage('loesung-dom');
    document.body.innerHTML = `
      <button type="button" class="ug-task-diagram-toggle" data-mu-diagram-hash="${h}" data-mu-diagram-default-hidden="true">x</button>
      <span data-mu-diagram-zoom-for="${h}" data-mu-diagram-default-hidden="true" class="zoom-wrap"></span>
      <div class="mu-practice-diagram" data-mu-diagram-hash="${h}" data-mu-diagram-default-hidden="true" data-mu-diagram-loesung-grafik="true">svg-loesung</div>
    `;
    syncPracticeDiagramUi(document.body);
    const div = document.querySelector('.mu-practice-diagram') as HTMLElement;
    expect(div.classList.contains('hidden')).toBe(false);
  });

  it('syncPracticeDiagramUi: diagramDefaultHidden bei globalem An zunächst verborgen', () => {
    writeShowPracticeDiagrams(true);
    const h = hashPracticeTaskFrage('mul-dom');
    document.body.innerHTML = `
      <button type="button" class="ug-task-diagram-toggle" data-mu-diagram-hash="${h}" data-mu-diagram-default-hidden="true">x</button>
      <span data-mu-diagram-zoom-for="${h}" data-mu-diagram-default-hidden="true" class="zoom-wrap"></span>
      <div class="mu-practice-diagram" data-mu-diagram-hash="${h}" data-mu-diagram-default-hidden="true">svg</div>
    `;
    syncPracticeDiagramUi(document.body);
    const div = document.querySelector('.mu-practice-diagram') as HTMLElement;
    const btn = document.querySelector('button') as HTMLButtonElement;
    const zoomWrap = document.querySelector('.zoom-wrap') as HTMLElement;
    expect(div.classList.contains('hidden')).toBe(true);
    expect(btn.getAttribute('aria-label')).toBe('Skizze einblenden');
    expect(zoomWrap.classList.contains('hidden')).toBe(true);
  });
});
