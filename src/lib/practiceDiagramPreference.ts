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

/** Effektive Sichtbarkeit: Override „show“/„hide“, sonst Aufgaben-Standard oder globale Checkbox. */
export function effectiveDiagramVisibleByHash(
  hash: string,
  diagramDefaultHidden?: boolean
): boolean {
  const p = readTaskMap()[hash];
  if (p === 'hide') return false;
  if (p === 'show') return true;
  if (diagramDefaultHidden) return false;
  return readShowPracticeDiagrams();
}

/**
 * Setzt die effektive Sichtbarkeit der Skizze für diese Aufgabe und speichert nur bei Abweichung von der impliziten Vorgabe (global bzw. `diagramDefaultHidden`).
 */
export function setDiagramEffectiveVisibleForHash(
  hash: string,
  effectiveVisible: boolean,
  diagramDefaultHidden?: boolean
): void {
  const global = readShowPracticeDiagrams();
  const implicitDefault = diagramDefaultHidden ? false : global;
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

export function toggleDiagramForHash(hash: string, diagramDefaultHidden?: boolean): void {
  setDiagramEffectiveVisibleForHash(
    hash,
    !effectiveDiagramVisibleByHash(hash, diagramDefaultHidden),
    diagramDefaultHidden
  );
}

/** DOM: Skizzen-Wrapper (`hidden`) und Schalter-Beschriftung an Overrides anpassen. */
export function syncPracticeDiagramUi(root: Document | Element = document): void {
  if (typeof document === 'undefined') return;
  root.querySelectorAll('.mu-practice-diagram[data-mu-diagram-hash]').forEach((el) => {
    const hash = el.getAttribute('data-mu-diagram-hash');
    if (!hash) return;
    const defaultHidden = el.getAttribute('data-mu-diagram-default-hidden') === 'true';
    el.classList.toggle('hidden', !effectiveDiagramVisibleByHash(hash, defaultHidden));
  });
  root.querySelectorAll('button.ug-task-diagram-toggle[data-mu-diagram-hash]').forEach((btn) => {
    const hash = btn.getAttribute('data-mu-diagram-hash');
    if (!hash) return;
    const defaultHidden = btn.getAttribute('data-mu-diagram-default-hidden') === 'true';
    const vis = effectiveDiagramVisibleByHash(hash, defaultHidden);
    btn.textContent = vis ? 'Skizze ausblenden' : 'Skizze einblenden';
    btn.setAttribute('aria-pressed', vis ? 'true' : 'false');
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
