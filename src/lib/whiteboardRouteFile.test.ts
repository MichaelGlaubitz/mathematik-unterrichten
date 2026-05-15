import { describe, expect, it } from 'vitest';
import {
  createWhiteboardRouteWindowNamePayload,
  extractWhiteboardRouteFromText,
  parseWhiteboardRouteFromWindowNamePayload,
  parseWhiteboardRoutePayload,
  serializeWhiteboardRouteHtml,
  WHITEBOARD_ROUTE_KIND,
  WHITEBOARD_ROUTE_VERSION,
  type WhiteboardRouteState,
} from './whiteboardRouteFile';

const route: WhiteboardRouteState = {
  kind: WHITEBOARD_ROUTE_KIND,
  version: WHITEBOARD_ROUTE_VERSION,
  title: 'Test',
  createdAt: '2026-05-14T00:00:00.000Z',
  pagePath: '/uebung/pythagoras',
  pageUrl: 'https://example.test/uebung/pythagoras',
  variant: 'pythagoras',
  selectedTaskTypes: ['hypotenuse'],
  layout: 'whiteboard',
  anzahl: 5,
  wbIndex: 1,
  wbZeigeLoesung: true,
  tasks: [
    { frage: 'Aufgabe 1', loesung: 'Loesung 1', diagram: '<svg></svg>', diagramLoesung: '<svg class="loesung"></svg>' },
    { frage: 'Aufgabe 2', loesung: 'Loesung 2' },
  ],
  diagramScales: { abc: 1.4 },
  diagramVisibility: { global: true, byHash: { abc: false } },
};

describe('whiteboardRouteFile', () => {
  it('validiert und normalisiert eine Route', () => {
    const parsed = parseWhiteboardRoutePayload({
      ...route,
      anzahl: 5.8,
      wbIndex: 99,
      diagramScales: { abc: 3, def: 0.1, nope: 'x' },
    });

    expect(parsed?.anzahl).toBe(5);
    expect(parsed?.wbIndex).toBe(1);
    expect(parsed?.diagramScales).toEqual({ abc: 2, def: 0.5 });
  });

  it('normalisiert optionales frageMitLoesungHighlight pro Aufgabe', () => {
    const parsed = parseWhiteboardRoutePayload({
      ...route,
      tasks: [{ frage: 'f', loesung: 'l', frageMitLoesungHighlight: '<span class="x">h</span>' }],
    });
    expect(parsed?.tasks[0].frageMitLoesungHighlight).toBe('<span class="x">h</span>');
  });

  it('lehnt fremde oder unvollstaendige Payloads ab', () => {
    expect(parseWhiteboardRoutePayload({ ...route, kind: 'other' })).toBeNull();
    expect(parseWhiteboardRoutePayload({ ...route, pagePath: 'https://example.test/uebung/pythagoras' })).toBeNull();
    expect(parseWhiteboardRoutePayload({ ...route, tasks: [{ frage: 'x' }] })).toBeNull();
  });

  it('serialisiert und extrahiert HTML-Dateien fuer den Doppelklick', () => {
    const html = serializeWhiteboardRouteHtml(route);
    expect(html).toContain('window.location.replace(target)');
    expect(html).toContain('\\u003csvg');
    expect(extractWhiteboardRouteFromText(html)).toEqual(route);
  });

  it('liest JSON-Dateien und window.name-Payloads', () => {
    expect(extractWhiteboardRouteFromText(JSON.stringify(route))).toEqual(route);
    expect(parseWhiteboardRouteFromWindowNamePayload(createWhiteboardRouteWindowNamePayload(route))).toEqual(route);
    expect(parseWhiteboardRouteFromWindowNamePayload('kein json')).toBeNull();
  });
});
