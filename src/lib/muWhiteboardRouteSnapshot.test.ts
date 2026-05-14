import { describe, expect, it } from 'vitest';
import {
  MU_WB_ROUTE_SCHEMA_VERSION,
  base64UrlToUtf8Json,
  parseMuWhiteboardRouteSnapshot,
  utf8JsonToBase64Url,
} from './muWhiteboardRouteSnapshot';

describe('muWhiteboardRouteSnapshot', () => {
  it('akzeptiert gültigen Snapshot und lehnt falsches variant ab', () => {
    const raw = {
      schemaVersion: MU_WB_ROUTE_SCHEMA_VERSION,
      variant: 'pythagoras',
      path: '/uebung/pythagoras',
      savedAt: '2026-01-01T12:00:00.000Z',
      anzahl: 10,
      layout: 'whiteboard',
      types: ['hypotenuse'],
      showDiagramsGlobal: true,
      taskDiagramPrefs: { abc: 'hide' },
      diagramScales: { abc: 1.2 },
      tasks: [{ frage: 'Frage mit äöü', loesung: 'Lösung' }],
      wbIndex: 0,
      wbZeigeLoesung: false,
    };
    expect(parseMuWhiteboardRouteSnapshot(raw, 'pythagoras')).not.toBeNull();
    expect(parseMuWhiteboardRouteSnapshot(raw, 'algebra')).toBeNull();
  });

  it('Base64-URL roundtrip mit Unicode', () => {
    const obj = { t: 'Größe π' };
    const b64 = utf8JsonToBase64Url(obj);
    expect(base64UrlToUtf8Json(b64)).toEqual(obj);
  });
});
