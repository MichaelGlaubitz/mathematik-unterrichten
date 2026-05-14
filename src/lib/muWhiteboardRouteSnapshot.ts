import type { PracticeAufgabe } from './pythagorasPracticeGenerators';
import { hashPracticeTaskFrage } from './practiceDiagramPreference';

export const MU_WB_ROUTE_SCHEMA_VERSION = 1 as const;

/** Maximale Zeichenlänge für `#muWb=…` (Starter-HTML); darüber nur JSON-Import. */
export const MU_WB_ROUTE_MAX_FRAGMENT_CHARS = 900_000;

export type MuWhiteboardRouteLayout = 'arbeitsblatt' | 'whiteboard';

export interface MuWhiteboardRouteSnapshot {
  schemaVersion: typeof MU_WB_ROUTE_SCHEMA_VERSION;
  variant: string;
  /** `location.pathname` zum Zeitpunkt des Speicherns (für Starter-HTML). */
  path: string;
  savedAt: string;
  anzahl: number;
  layout: MuWhiteboardRouteLayout;
  types: string[];
  showDiagramsGlobal: boolean;
  /** Nur Abweichungen von `showDiagramsGlobal` (wie in localStorage-Logik). */
  taskDiagramPrefs: Record<string, 'show' | 'hide'>;
  diagramScales: Record<string, number>;
  tasks: PracticeAufgabe[];
  wbIndex: number;
  wbZeigeLoesung: boolean;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isPracticeAufgabe(v: unknown): v is PracticeAufgabe {
  if (!isPlainObject(v)) return false;
  if (typeof v.frage !== 'string' || typeof v.loesung !== 'string') return false;
  if ('diagram' in v && v.diagram !== undefined && typeof v.diagram !== 'string') return false;
  return true;
}

export function utf8JsonToBase64Url(data: unknown): string {
  const s = JSON.stringify(data);
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]!);
  }
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function base64UrlToUtf8Json(raw: string): unknown {
  let t = raw.trim().replace(/-/g, '+').replace(/_/g, '/');
  while (t.length % 4) t += '=';
  const bin = atob(t);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  return JSON.parse(text) as unknown;
}

export function parseMuWhiteboardRouteSnapshot(
  raw: unknown,
  expectedVariant: string
): MuWhiteboardRouteSnapshot | null {
  if (!isPlainObject(raw)) return null;
  if (raw.schemaVersion !== MU_WB_ROUTE_SCHEMA_VERSION) return null;
  if (typeof raw.variant !== 'string' || raw.variant !== expectedVariant) return null;
  if (typeof raw.path !== 'string' || !raw.path.startsWith('/')) return null;
  if (typeof raw.savedAt !== 'string') return null;
  if (typeof raw.anzahl !== 'number' || !Number.isFinite(raw.anzahl)) return null;
  if (raw.layout !== 'arbeitsblatt' && raw.layout !== 'whiteboard') return null;
  if (!Array.isArray(raw.types) || !raw.types.every((x) => typeof x === 'string')) return null;
  if (typeof raw.showDiagramsGlobal !== 'boolean') return null;
  if (!isPlainObject(raw.taskDiagramPrefs)) return null;
  const prefs: Record<string, 'show' | 'hide'> = {};
  for (const [k, v] of Object.entries(raw.taskDiagramPrefs)) {
    if (v === 'show' || v === 'hide') prefs[k] = v;
    else return null;
  }
  if (!isPlainObject(raw.diagramScales)) return null;
  const scales: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw.diagramScales)) {
    if (typeof v !== 'number' || !Number.isFinite(v)) return null;
    scales[k] = v;
  }
  if (!Array.isArray(raw.tasks) || raw.tasks.length === 0) return null;
  const tasks: PracticeAufgabe[] = [];
  for (const t of raw.tasks) {
    if (!isPracticeAufgabe(t)) return null;
    tasks.push(
      t.diagram === undefined ? { frage: t.frage, loesung: t.loesung } : { frage: t.frage, loesung: t.loesung, diagram: t.diagram }
    );
  }
  if (typeof raw.wbIndex !== 'number' || !Number.isInteger(raw.wbIndex)) return null;
  if (raw.wbIndex < 0 || raw.wbIndex >= tasks.length) return null;
  if (typeof raw.wbZeigeLoesung !== 'boolean') return null;
  return {
    schemaVersion: MU_WB_ROUTE_SCHEMA_VERSION,
    variant: raw.variant,
    path: raw.path,
    savedAt: raw.savedAt,
    anzahl: raw.anzahl,
    layout: raw.layout,
    types: raw.types as string[],
    showDiagramsGlobal: raw.showDiagramsGlobal,
    taskDiagramPrefs: prefs,
    diagramScales: scales,
    tasks,
    wbIndex: raw.wbIndex,
    wbZeigeLoesung: raw.wbZeigeLoesung,
  };
}

export function parseMuWhiteboardRouteJsonText(text: string, expectedVariant: string): MuWhiteboardRouteSnapshot | null {
  let data: unknown;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    return null;
  }
  return parseMuWhiteboardRouteSnapshot(data, expectedVariant);
}

export function buildMuWhiteboardRouteSnapshot(params: {
  variant: string;
  path: string;
  anzahl: number;
  layout: MuWhiteboardRouteLayout;
  types: string[];
  showDiagramsGlobal: boolean;
  taskDiagramPrefs: Record<string, 'show' | 'hide'>;
  diagramScales: Record<string, number>;
  tasks: PracticeAufgabe[];
  wbIndex: number;
  wbZeigeLoesung: boolean;
}): MuWhiteboardRouteSnapshot {
  return {
    schemaVersion: MU_WB_ROUTE_SCHEMA_VERSION,
    variant: params.variant,
    path: params.path,
    savedAt: new Date().toISOString(),
    anzahl: params.anzahl,
    layout: params.layout,
    types: params.types.slice(),
    showDiagramsGlobal: params.showDiagramsGlobal,
    taskDiagramPrefs: { ...params.taskDiagramPrefs },
    diagramScales: { ...params.diagramScales },
    tasks: params.tasks.map((t) =>
      t.diagram === undefined ? { frage: t.frage, loesung: t.loesung } : { frage: t.frage, loesung: t.loesung, diagram: t.diagram }
    ),
    wbIndex: params.wbIndex,
    wbZeigeLoesung: params.wbZeigeLoesung,
  };
}

/** Hashes der gespeicherten Aufgaben (für Abgleich mit `diagramScales` / Prefs). */
export function taskHashesFromSnapshot(s: MuWhiteboardRouteSnapshot): string[] {
  return s.tasks.map((t) => hashPracticeTaskFrage(t.frage));
}

export function filterDiagramScalesForTasks(
  scales: Record<string, number>,
  taskHashes: string[]
): Record<string, number> {
  const allow = new Set(taskHashes);
  const out: Record<string, number> = {};
  for (const [h, v] of Object.entries(scales)) {
    if (allow.has(h)) out[h] = v;
  }
  return out;
}

export function filterTaskDiagramPrefsForTasks(
  prefs: Record<string, 'show' | 'hide'>,
  taskHashes: string[]
): Record<string, 'show' | 'hide'> {
  const allow = new Set(taskHashes);
  const out: Record<string, 'show' | 'hide'> = {};
  for (const [h, v] of Object.entries(prefs)) {
    if (allow.has(h)) out[h] = v;
  }
  return out;
}

export function buildStarterHtmlRedirect(fullUrlWithHash: string): string {
  const target = JSON.stringify(fullUrlWithHash);
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Whiteboard-Route öffnen</title>
</head>
<body>
  <p style="font-family:system-ui,sans-serif;padding:1rem">Weiterleitung zur Übungsseite …</p>
  <script>
    location.replace(${target});
  <\/script>
  <noscript><p>Bitte JavaScript aktivieren oder die JSON-Route in der Übung unter „Route laden“ öffnen.</p></noscript>
</body>
</html>
`;
}
