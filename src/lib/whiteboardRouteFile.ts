export const WHITEBOARD_ROUTE_KIND = 'mu-whiteboard-route';
export const WHITEBOARD_ROUTE_VERSION = 1;
export const WHITEBOARD_ROUTE_DATA_SCRIPT_ID = 'mu-whiteboard-route-data';
export const WHITEBOARD_ROUTE_WINDOW_NAME_KIND = 'mu-whiteboard-route-window-name';

export type WhiteboardRouteTask = {
  frage: string;
  loesung: string;
  diagram?: string;
};

export type WhiteboardRouteState = {
  kind: typeof WHITEBOARD_ROUTE_KIND;
  version: typeof WHITEBOARD_ROUTE_VERSION;
  title?: string;
  createdAt: string;
  pagePath: string;
  pageUrl?: string;
  variant?: string;
  selectedTaskTypes?: string[];
  layout: 'arbeitsblatt' | 'whiteboard';
  anzahl: number;
  wbIndex: number;
  wbZeigeLoesung: boolean;
  tasks: WhiteboardRouteTask[];
  diagramScales: Record<string, number>;
  diagramVisibility: {
    global: boolean;
    byHash: Record<string, boolean>;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function clampInteger(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : fallback;
  return Math.min(max, Math.max(min, n));
}

function normalizedStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((item): item is string => typeof item === 'string' && item.length > 0);
  return strings.length > 0 ? strings : undefined;
}

function normalizedTask(value: unknown): WhiteboardRouteTask | null {
  if (!isRecord(value) || typeof value.frage !== 'string' || typeof value.loesung !== 'string') return null;
  if (typeof value.diagram !== 'undefined' && typeof value.diagram !== 'string') return null;
  return typeof value.diagram === 'string'
    ? { frage: value.frage, loesung: value.loesung, diagram: value.diagram }
    : { frage: value.frage, loesung: value.loesung };
}

function normalizedNumberMap(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};
  const out: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!key || typeof raw !== 'number' || !Number.isFinite(raw)) continue;
    out[key] = Math.min(2, Math.max(0.5, Math.round(raw * 100) / 100));
  }
  return out;
}

function normalizedBooleanMap(value: unknown): Record<string, boolean> {
  if (!isRecord(value)) return {};
  const out: Record<string, boolean> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!key || typeof raw !== 'boolean') continue;
    out[key] = raw;
  }
  return out;
}

function normalizedPagePath(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (!value.startsWith('/') || value.startsWith('//')) return null;
  return value;
}

export function parseWhiteboardRoutePayload(value: unknown): WhiteboardRouteState | null {
  if (!isRecord(value)) return null;
  if (value.kind !== WHITEBOARD_ROUTE_KIND || value.version !== WHITEBOARD_ROUTE_VERSION) return null;
  const pagePath = normalizedPagePath(value.pagePath);
  if (!pagePath || !Array.isArray(value.tasks)) return null;
  const tasks = value.tasks.map(normalizedTask);
  if (tasks.some((task) => task === null)) return null;
  const routeTasks = tasks as WhiteboardRouteTask[];
  const maxIndex = Math.max(routeTasks.length - 1, 0);
  const rawVisibility = isRecord(value.diagramVisibility) ? value.diagramVisibility : {};

  return {
    kind: WHITEBOARD_ROUTE_KIND,
    version: WHITEBOARD_ROUTE_VERSION,
    title: typeof value.title === 'string' ? value.title : undefined,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date(0).toISOString(),
    pagePath,
    pageUrl: typeof value.pageUrl === 'string' ? value.pageUrl : undefined,
    variant: typeof value.variant === 'string' ? value.variant : undefined,
    selectedTaskTypes: normalizedStringArray(value.selectedTaskTypes),
    layout: value.layout === 'whiteboard' ? 'whiteboard' : 'arbeitsblatt',
    anzahl: clampInteger(value.anzahl, routeTasks.length || 10, 1, 100),
    wbIndex: clampInteger(value.wbIndex, 0, 0, maxIndex),
    wbZeigeLoesung: value.wbZeigeLoesung === true,
    tasks: routeTasks,
    diagramScales: normalizedNumberMap(value.diagramScales),
    diagramVisibility: {
      global: rawVisibility.global === true,
      byHash: normalizedBooleanMap(rawVisibility.byHash),
    },
  };
}

export function createWhiteboardRouteWindowNamePayload(route: WhiteboardRouteState): string {
  return JSON.stringify({ kind: WHITEBOARD_ROUTE_WINDOW_NAME_KIND, route });
}

export function parseWhiteboardRouteFromWindowNamePayload(value: string): WhiteboardRouteState | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isRecord(parsed) || parsed.kind !== WHITEBOARD_ROUTE_WINDOW_NAME_KIND) return null;
    return parseWhiteboardRoutePayload(parsed.route);
  } catch {
    return null;
  }
}

function safeJsonForHtml(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (char) => {
    switch (char) {
      case '<':
        return '\\u003c';
      case '>':
        return '\\u003e';
      case '&':
        return '\\u0026';
      case '\u2028':
        return '\\u2028';
      case '\u2029':
        return '\\u2029';
      default:
        return char;
    }
  });
}

export function serializeWhiteboardRouteHtml(route: WhiteboardRouteState): string {
  const data = safeJsonForHtml(route);
  const scriptId = WHITEBOARD_ROUTE_DATA_SCRIPT_ID;
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Whiteboard-Route</title>
</head>
<body>
  <p>Whiteboard-Route wird geoeffnet. Falls nichts passiert: <a id="mu-whiteboard-route-link" href="${route.pageUrl ?? route.pagePath}">Route oeffnen</a>.</p>
  <script type="application/json" id="${scriptId}">${data}</script>
  <script>
    (function () {
      var el = document.getElementById('${scriptId}');
      var route = JSON.parse(el.textContent || '{}');
      var target = route.pageUrl || route.pagePath || '/';
      window.name = JSON.stringify({ kind: '${WHITEBOARD_ROUTE_WINDOW_NAME_KIND}', route: route });
      var link = document.getElementById('mu-whiteboard-route-link');
      if (link) link.setAttribute('href', target);
      window.location.replace(target);
    })();
  </script>
</body>
</html>
`;
}

export function extractWhiteboardRouteFromText(text: string): WhiteboardRouteState | null {
  try {
    const parsed = JSON.parse(text) as unknown;
    const route = parseWhiteboardRoutePayload(parsed);
    if (route) return route;
  } catch {
    // Try HTML export format below.
  }

  const match = text.match(
    new RegExp(`<script\\b[^>]*\\bid=["']${WHITEBOARD_ROUTE_DATA_SCRIPT_ID}["'][^>]*>([\\s\\S]*?)<\\/script>`, 'i')
  );
  if (!match) return null;
  try {
    return parseWhiteboardRoutePayload(JSON.parse(match[1]) as unknown);
  } catch {
    return null;
  }
}
