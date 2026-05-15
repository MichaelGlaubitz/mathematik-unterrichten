/** localStorage: „1“ = Skizzen ein, „0“ = aus. Fehlt der Eintrag, gilt Standard **aus**. */
export const PRACTICE_DIAGRAMS_STORAGE_KEY = 'mu-show-practice-diagrams';

/** localStorage: JSON-Objekt { [hash]: „show“ | „hide“ } — Abweichung von der globalen Vorgabe pro Aufgabe (Frage-Text). */
export const PRACTICE_DIAGRAM_TASK_PREFS_KEY = 'mu-practice-diagram-task-prefs';

export function readShowPracticeDiagrams(): boolean {
  if (typeof localStorage === 'undefined') return false;
  const v = localStorage.getItem(PRACTICE_DIAGRAMS_STORAGE_KEY);
  if (v === null) return false;
  return v === '1';
}

export function writeShowPracticeDiagrams(show: boolean): void {
  localStorage.setItem(PRACTICE_DIAGRAMS_STORAGE_KEY, show ? '1' : '0');
}

/** Stabiler Kurz-Hash für dieselbe Aufgabenstellung (normalisierte Frage). */
export function hashPracticeTaskFrage(frage: string): string {
  const s = frage.replace(/\s+/g, ' ').trim();
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

/**
 * Schlüssel für Skizzen-Sichtbarkeit und Zoom pro Eintrag in der Aufgabenliste.
 * Ohne Listenindex würden zwei Aufgaben mit gleichem Fragentext (oder seltene Hash-Kollision)
 * dieselbe localStorage-Vorgabe teilen — dann wäre nur die erste sinnvoll „standard aus“.
 */
export function diagramTaskPreferenceKey(frage: string, listeIndex: number): string {
  return `${hashPracticeTaskFrage(frage)}::i${listeIndex}`;
}

function readTaskMap(): Record<string, 'show' | 'hide'> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PRACTICE_DIAGRAM_TASK_PREFS_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (!o || typeof o !== 'object') return {};
    const out: Record<string, 'show' | 'hide'> = {};
    for (const [k, v] of Object.entries(o)) {
      if (v === 'show' || v === 'hide') out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function writeTaskMap(map: Record<string, 'show' | 'hide'>): void {
  if (typeof localStorage === 'undefined') return;
  if (Object.keys(map).length === 0) {
    localStorage.removeItem(PRACTICE_DIAGRAM_TASK_PREFS_KEY);
    return;
  }
  localStorage.setItem(PRACTICE_DIAGRAM_TASK_PREFS_KEY, JSON.stringify(map));
}

/**
 * Effektive Sichtbarkeit: Override „show“/„hide“, sonst Aufgaben-Standard oder globale Checkbox.
 *
 * @param loesungGrafik Wenn wahr: Lösungs-Skizze (z. B. in „Lösung zeigen“) standardmäßig sichtbar,
 *   solange der Nutzer nicht explizit „Skizze aus“ gewählt hat (`hide` im Task-Map).
 */
export function effectiveDiagramVisibleByHash(
  hash: string,
  diagramDefaultHidden?: boolean,
  loesungGrafik?: boolean
): boolean {
  const p = readTaskMap()[hash];
  if (p === 'hide') return false;
  if (p === 'show') return true;
  if (loesungGrafik) return true;
  if (diagramDefaultHidden) return false;
  return readShowPracticeDiagrams();
}

/**
 * Setzt die effektive Sichtbarkeit der Skizze für diese Aufgabe und speichert nur bei Abweichung von der impliziten Vorgabe (global bzw. `diagramDefaultHidden`).
 */
export function setDiagramEffectiveVisibleForHash(
  hash: string,
  effectiveVisible: boolean,
  diagramDefaultHidden?: boolean,
  loesungGrafik?: boolean
): void {
  const global = readShowPracticeDiagrams();
  const implicitDefault = loesungGrafik ? true : diagramDefaultHidden ? false : global;
  const map = { ...readTaskMap() };
  if (effectiveVisible === implicitDefault) {
    delete map[hash];
  } else if (effectiveVisible) {
    map[hash] = 'show';
  } else {
    map[hash] = 'hide';
  }
  writeTaskMap(map);
}

export function toggleDiagramForHash(
  hash: string,
  diagramDefaultHidden?: boolean,
  loesungGrafik?: boolean
): void {
  setDiagramEffectiveVisibleForHash(
    hash,
    !effectiveDiagramVisibleByHash(hash, diagramDefaultHidden, loesungGrafik),
    diagramDefaultHidden,
    loesungGrafik
  );
}

/** Auge durchgestrichen: Skizze ist sichtbar, Klick blendet aus. */
const PRACTICE_DIAGRAM_ICON_HIDE = `<span class="inline-flex shrink-0 items-center justify-center" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg></span>`;

/** Auge: Skizze ist ausgeblendet, Klick blendet ein. */
const PRACTICE_DIAGRAM_ICON_SHOW = `<span class="inline-flex shrink-0 items-center justify-center" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>`;

export function practiceDiagramToggleIconMarkup(visible: boolean): string {
  return visible ? PRACTICE_DIAGRAM_ICON_HIDE : PRACTICE_DIAGRAM_ICON_SHOW;
}

export function practiceDiagramToggleAriaLabel(visible: boolean): string {
  return visible ? 'Skizze ausblenden' : 'Skizze einblenden';
}

/** DOM: Skizzen-Wrapper (`hidden`) und Schalter-Beschriftung an Overrides anpassen. */
export function syncPracticeDiagramUi(root: Document | Element = document): void {
  if (typeof document === 'undefined') return;
  root.querySelectorAll('.mu-practice-diagram[data-mu-diagram-hash]').forEach((el) => {
    const hash = el.getAttribute('data-mu-diagram-hash');
    if (!hash) return;
    const defaultHidden = el.getAttribute('data-mu-diagram-default-hidden') === 'true';
    const loesungGrafik = el.getAttribute('data-mu-diagram-loesung-grafik') === 'true';
    el.classList.toggle(
      'hidden',
      !effectiveDiagramVisibleByHash(hash, defaultHidden, loesungGrafik)
    );
  });
  root.querySelectorAll('button.ug-task-diagram-toggle[data-mu-diagram-hash]').forEach((btn) => {
    const hash = btn.getAttribute('data-mu-diagram-hash');
    if (!hash) return;
    const defaultHidden = btn.getAttribute('data-mu-diagram-default-hidden') === 'true';
    const loesungGrafik = btn.getAttribute('data-mu-diagram-loesung-grafik') === 'true';
    const vis = effectiveDiagramVisibleByHash(hash, defaultHidden, loesungGrafik);
    btn.innerHTML = practiceDiagramToggleIconMarkup(vis);
    const label = practiceDiagramToggleAriaLabel(vis);
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.setAttribute('aria-pressed', vis ? 'true' : 'false');
  });
  root.querySelectorAll('[data-mu-diagram-zoom-for]').forEach((el) => {
    const hash = el.getAttribute('data-mu-diagram-zoom-for');
    if (!hash) return;
    const defaultHidden = el.getAttribute('data-mu-diagram-default-hidden') === 'true';
    const loesungGrafik = el.getAttribute('data-mu-diagram-loesung-grafik') === 'true';
    const vis = effectiveDiagramVisibleByHash(hash, defaultHidden, loesungGrafik);
    el.classList.toggle('hidden', !vis);
  });
}

/**
 * Bindet die Checkbox „Grafiken anzeigen“ (optional).
 * Globale Vorgabe; pro Aufgabe geht mit Schalter darüber hinaus (s. task-prefs).
 */
export function bindPracticeDiagramCheckbox(input: HTMLInputElement | null): void {
  if (input) {
    input.checked = readShowPracticeDiagrams();
    input.addEventListener('change', () => {
      writeShowPracticeDiagrams(input.checked);
      syncPracticeDiagramUi(document.body);
    });
  }
  syncPracticeDiagramUi(document.body);
}
