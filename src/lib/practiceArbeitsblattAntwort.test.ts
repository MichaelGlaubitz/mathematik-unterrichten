import { describe, expect, it } from 'vitest';
import {
  bruchAbMotivation,
  parseIntFlexible,
  rationalGleich,
  replaceBruchAbFragePlaceholders,
  zaehleAbPlatzhalter,
} from './practiceArbeitsblattAntwort';
import type { PracticeAbAntwortSlot } from './uebungPracticeGenerators';

describe('practiceArbeitsblattAntwort', () => {
  it('parseIntFlexible akzeptiert Unicode-Minus und trimmt', () => {
    expect(parseIntFlexible('  \u221212  ')).toBe(-12);
    expect(parseIntFlexible('')).toBeNull();
    expect(parseIntFlexible('2,5')).toBeNull();
  });

  it('rationalGleich erkennt äquivalente Brüche', () => {
    expect(rationalGleich(10, 15, 2, 3)).toBe(true);
    expect(rationalGleich(2, 3, 3, 4)).toBe(false);
    expect(rationalGleich(-2, 3, 2, -3)).toBe(true);
  });

  it('replaceBruchAbFragePlaceholders ersetzt alle Indizes', () => {
    const slots: PracticeAbAntwortSlot[] = [
      { kind: 'int', expect: 5 },
      { kind: 'frac', expectNum: 1, expectDen: 2 },
    ];
    const html = replaceBruchAbFragePlaceholders('A [[MU_AB:0]] B [[MU_AB:1]]', 3, slots);
    expect(html).toContain('data-mu-ab-task="3"');
    expect(html).toContain('data-mu-ab-slot="0"');
    expect(html).toContain('data-mu-ab-slot="1"');
    expect(html).toContain('data-mu-ab-kind="int"');
    expect(html).toContain('data-mu-ab-kind="frac"');
  });

  it('zaehleAbPlatzhalter liefert maxIndex+1', () => {
    expect(zaehleAbPlatzhalter('[[MU_AB:0]] und [[MU_AB:1]]')).toBe(2);
    expect(zaehleAbPlatzhalter('ohne')).toBe(0);
  });

  it('bruchAbMotivation liefert nicht-leeren Text', () => {
    expect(bruchAbMotivation(0, 4).length).toBeGreaterThan(3);
    expect(bruchAbMotivation(4, 4).length).toBeGreaterThan(3);
  });
});
