import { describe, expect, it } from 'vitest';
import {
  GRAPHEN_WB_STICHWORT_TO_IDS,
  GRAPHEN_WB_UNTERTHEMA_STICHWORTE,
  expandGraphenWbStichworte,
  stichwortLabelsFromGraphenSessionRaw,
} from './graphenWbKeywordMap';

describe('graphenWbKeywordMap', () => {
  it('covers all keywords from the subtopic blocks', () => {
    const fromBloecke = GRAPHEN_WB_UNTERTHEMA_STICHWORTE.flat();
    const fromMap = Object.keys(GRAPHEN_WB_STICHWORT_TO_IDS);
    expect(fromMap.sort()).toEqual(fromBloecke.sort());
  });

  it('each keyword is mapped to exactly one generator ID', () => {
    for (const ids of Object.values(GRAPHEN_WB_STICHWORT_TO_IDS)) {
      expect(ids.length).toBe(1);
    }
  });

  it('expandGraphenWbStichworte maps keywords to pg_ generator IDs', () => {
    const ids = expandGraphenWbStichworte([
      'Linear: y = x + c (Wertetabelle)',
      'Linear: y = x + c (Zeichnen)'
    ]);
    expect(ids.sort()).toEqual(['pg_table_lin_x_c', 'pg_draw_lin_x_c'].sort());
  });

  it('stichwortLabelsFromGraphenSessionRaw translates raw pg_ generator IDs to keywords', () => {
    const labels = stichwortLabelsFromGraphenSessionRaw(['pg_table_lin_x_c', 'pg_draw_lin_x_c']);
    expect(labels).toContain('Linear: y = x + c (Wertetabelle)');
    expect(labels).toContain('Linear: y = x + c (Zeichnen)');
  });
});
