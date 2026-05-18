import { describe, expect, it } from 'vitest';
import {
  bruchAbMotivation,
  bruchIstVollstaendigGekuerzt,
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

  it('bruchIstVollstaendigGekuerzt lehnt nicht vollständig gekürzte Darstellungen ab', () => {
    expect(bruchIstVollstaendigGekuerzt(1, 2)).toBe(true);
    expect(bruchIstVollstaendigGekuerzt(2, 4)).toBe(false);
    expect(bruchIstVollstaendigGekuerzt(8, 16)).toBe(false);
    expect(bruchIstVollstaendigGekuerzt(-1, 2)).toBe(true);
    expect(bruchIstVollstaendigGekuerzt(1, -2)).toBe(true);
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

  it('replaceBruchAbFragePlaceholders: frac_num mit festem Nenner', () => {
    const slots: PracticeAbAntwortSlot[] = [{ kind: 'frac_num', expectNum: 5, fixedDen: 12 }];
    const html = replaceBruchAbFragePlaceholders('[[MU_AB:0]]', 0, slots);
    expect(html).toContain('data-mu-ab-kind="frac_num"');
    expect(html).toContain('mu-ab-n-fixed');
    expect(html).toContain('>12<');
  });

  it('zaehleAbPlatzhalter liefert maxIndex+1', () => {
    expect(zaehleAbPlatzhalter('[[MU_AB:0]] und [[MU_AB:1]]')).toBe(2);
    expect(zaehleAbPlatzhalter('ohne')).toBe(0);
  });

  it('replaceBruchAbFragePlaceholders: choice ohne äußeres mu-katex-skip, int-Slot mit Skip', () => {
    const choiceSlots: PracticeAbAntwortSlot[] = [{ kind: 'choice', expect: 0, labels: ['$a$', '$b$'] }];
    const choiceHtml = replaceBruchAbFragePlaceholders('[[MU_AB:0]]', 0, choiceSlots);
    expect(choiceHtml).toContain('data-mu-ab-kind="choice"');
    expect(choiceHtml).toMatch(/class="mu-ab-slot-shell inline-flex/);
    expect(choiceHtml).not.toMatch(/mu-ab-slot-shell mu-katex-skip[^"]*"[^>]*data-mu-ab-kind="choice"/);

    const intSlots: PracticeAbAntwortSlot[] = [{ kind: 'int', expect: 1 }];
    const intHtml = replaceBruchAbFragePlaceholders('[[MU_AB:0]]', 0, intSlots);
    expect(intHtml).toContain('data-mu-ab-kind="int"');
    expect(intHtml).toMatch(/mu-ab-slot-shell[^\n]*mu-katex-skip/);
  });

  it('bruchAbMotivation liefert nicht-leeren Text', () => {
    expect(bruchAbMotivation(0, 4).length).toBeGreaterThan(3);
    expect(bruchAbMotivation(4, 4).length).toBeGreaterThan(3);
  });
});