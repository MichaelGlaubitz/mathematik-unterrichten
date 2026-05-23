import { describe, expect, it } from 'vitest';
import { bdpDezimalAntwortOk, bdpParseDecimal, erzeugeBdpAufgabe } from './bruchDezimalProzentUmwandlung';

describe('bdpParseDecimal', () => {
  it('akzeptiert Komma und Punkt', () => {
    expect(bdpParseDecimal('0,9')).toBe(0.9);
    expect(bdpParseDecimal('0.9')).toBe(0.9);
    expect(bdpParseDecimal('.25')).toBe(0.25);
  });
  it('lehnt Unsinn ab', () => {
    expect(bdpParseDecimal('')).toBeNull();
    expect(bdpParseDecimal('1a')).toBeNull();
  });
});

describe('bdpDezimalAntwortOk', () => {
  it('toleriert Rundungsabweichung der Eingabe nicht jenseits Epsilon', () => {
    expect(bdpDezimalAntwortOk('0.900000', 0.9)).toBe(true);
    expect(bdpDezimalAntwortOk('0.91', 0.9)).toBe(false);
  });
});

describe('erzeugeBdpAufgabe — Prozent ganzzahlig', () => {
  const rng = (() => {
    let s = 0.41421;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  })();

  it('liefert bei br_pr und dez_pr ganzzahlige expectInt', () => {
    for (let i = 0; i < 40; i++) {
      const a = erzeugeBdpAufgabe('br_pr', rng);
      expect(a.expectInt).toBe(Math.round(a.expectInt!));
      expect(Number.isInteger(a.expectInt)).toBe(true);
    }
    for (let i = 0; i < 40; i++) {
      const a = erzeugeBdpAufgabe('dez_pr', rng);
      expect(Number.isInteger(a.expectInt)).toBe(true);
    }
  });

  it('pr_br: gekürzter Erwartungsbruch', () => {
    const a = erzeugeBdpAufgabe('pr_br', rng);
    expect(a.expectNum).toBeDefined();
    expect(a.expectDen).toBeDefined();
    expect(a.expectDen).toBeGreaterThan(0);
  });
});
