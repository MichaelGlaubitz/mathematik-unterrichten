import { describe, expect, it } from 'vitest';
import {
  buildBruchArbeitsblattTex,
  escapeLatexText,
  htmlFrageZuLatexInhalt,
  loesungHtmlZuLatexSegmente,
  replaceAbPlaceholdersLatex,
  stripHtmlTags,
} from './bruchArbeitsblattLatex';

describe('bruchArbeitsblattLatex', () => {
  it('escapeLatexText schützt Sonderzeichen', () => {
    expect(escapeLatexText('10% & mehr')).toMatch(/\\%/);
    expect(escapeLatexText('10% & mehr')).toMatch(/\\&/);
  });

  it('stripHtmlTags entfernt Tags', () => {
    expect(stripHtmlTags('<span class="x">a</span>b')).toBe(' a b');
  });

  it('replaceAbPlaceholdersLatex (blank / filled)', () => {
    const slots = [
      { kind: 'int' as const, expect: 7 },
      { kind: 'frac' as const, expectNum: 3, expectDen: 4 },
    ];
    const t = 'A [[MU_AB:0]] und [[MU_AB:1]]';
    expect(replaceAbPlaceholdersLatex(t, slots, 'blank')).toMatch(/rule/);
    expect(replaceAbPlaceholdersLatex(t, slots, 'filled')).toContain('$\\boxed{7}$');
    expect(replaceAbPlaceholdersLatex(t, slots, 'filled')).toMatch(/tfrac\{3\}\{4\}/);
  });

  it('htmlFrageZuLatexInhalt verarbeitet AB-Platzhalter', () => {
    const html =
      'Berechne $\\displaystyle\\frac{1}{2}$<span class="mu-katex-skip"><span>=</span>[[MU_AB:0]]</span>';
    const s = htmlFrageZuLatexInhalt(html, {
      abSlots: [{ kind: 'frac', expectNum: 1, expectDen: 2 }],
      mitLoesungen: false,
    });
    expect(s).toContain('$\\displaystyle\\frac{1}{2}$');
    expect(s).toMatch(/rule/);
  });

  it('loesungHtmlZuLatexSegmente ersetzt br-Tags', () => {
    expect(loesungHtmlZuLatexSegmente('a<br>b')).toBe('a\\par\\medskip\nb');
  });

  it('buildBruchArbeitsblattTex enthält Kopfzeile und Aufzählung', () => {
    const tex = buildBruchArbeitsblattTex({
      aufgaben: [
        {
          frage: 'Test $1$',
          loesung: '$1$',
          frageArbeitsblatt: 'Test [[MU_AB:0]]',
          abSlots: [{ kind: 'int', expect: 2 }],
        },
      ],
      meta: {
        thema: 'Bruchrechnung',
        unterthemaZeile: 'Umgang mit Brüchen',
        stichworteZeile: 'Kürzen',
      },
      mitLoesungen: false,
      diagramPngPaths: [],
    });
    expect(tex).toContain('\\documentclass[11pt,a4paper]{article}');
    expect(tex).toContain('Bruchrechnung');
    expect(tex).toContain('\\begin{enumerate}');
    expect(tex).toContain('\\end{enumerate}');
  });
});
