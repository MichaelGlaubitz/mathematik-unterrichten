import { describe, expect, it, vi } from 'vitest';
import { BRUCHRECHNUNG_GENERATOR_IDS, createPracticeGenerators } from './uebungPracticeGenerators';
import {
  BRUCH_AB_PDF_DIAGRAM_MAX_WIDTH,
  buildBruchArbeitsblattTex,
  compileLatexOnHttpPdf,
  escapeLatexText,
  htmlFrageZuLatexInhalt,
  loesungHtmlZuLatexSegmente,
  replaceAbPlaceholdersLatex,
  stripHtmlTags,
} from './bruchArbeitsblattLatex';

function dollarCount(s: string): number {
  return (s.match(/\$/g) ?? []).length;
}

function makeLcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

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
    expect(replaceAbPlaceholdersLatex(t, slots, 'filled')).toContain('\\ensuremath{\\boxed{7}}');
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
    expect(s).toContain(
      '\\ensuremath{\\displaystyle\\frac{\\underline{\\hspace{1.05cm}}}{\\underline{\\hspace{1.05cm}}}}'
    );
  });

  it('loesungHtmlZuLatexSegmente ersetzt br-Tags', () => {
    expect(loesungHtmlZuLatexSegmente('a<br>b')).toBe('a\\par\\medskip\nb');
  });

  it('buildBruchArbeitsblattTex: zweispaltig, Diagramm an Spaltenbreite, Umbruch vor Grafik', () => {
    const tex = buildBruchArbeitsblattTex({
      aufgaben: [{ frage: 'Frage', loesung: '$1$' }],
      meta: {
        thema: 'Bruchrechnung',
        stichworteZeile: 'x',
      },
      mitLoesungen: false,
      diagramPngPaths: [{ taskIndex: 0, suffix: 'a', path: 'd0a.jpg' }],
    });
    expect(tex).toContain('style=nextline');
    expect(tex).toContain(`width=${BRUCH_AB_PDF_DIAGRAM_MAX_WIDTH},keepaspectratio=true`);
    expect(tex).toContain('\\leavevmode\\par');
    expect(tex).toContain('\\begin{multicols}{2}');
    expect(tex).toContain('\\end{multicols}');
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
        stichworteZeile: 'Kürzen',
      },
      mitLoesungen: false,
      diagramPngPaths: [],
    });
    expect(tex).toContain('\\documentclass[11pt,a4paper]{article}');
    expect(tex).toContain('Bruchrechnung');
    expect(tex).toContain('\\begin{enumerate}');
    expect(tex).toContain('\\end{enumerate}');
    expect(tex).toContain('\\begin{multicols}{2}');
    expect(tex).toContain('\\LARGE');
  });

  it('Bruch-Generatoren: nach html→LaTeX gerade $-Anzahl (Frage + Lösung, viele Seeds)', () => {
    for (const id of BRUCHRECHNUNG_GENERATOR_IDS) {
      for (let seed = 0; seed < 120; seed++) {
        const g = createPracticeGenerators(makeLcg(seed * 7919 + id.length * 17 + id.charCodeAt(0)));
        const a = g[id]();
        const abs = a.abSlots ?? [];
        const fAb = a.frageArbeitsblatt;
        expect(fAb, id).toBeDefined();
        const hBlank = htmlFrageZuLatexInhalt(fAb!, { abSlots: abs, mitLoesungen: false });
        const hFill = htmlFrageZuLatexInhalt(fAb!, { abSlots: abs, mitLoesungen: true });
        expect(dollarCount(hBlank) % 2, `${id} frage blank @${seed}`).toBe(0);
        expect(dollarCount(hFill) % 2, `${id} frage fill @${seed}`).toBe(0);
        const fHi = a.frageMitLoesungHighlight;
        if (fHi) {
          const hh = htmlFrageZuLatexInhalt(fHi, { abSlots: abs, mitLoesungen: true });
          expect(dollarCount(hh) % 2, `${id} highlight @${seed}`).toBe(0);
        }
        const loe = loesungHtmlZuLatexSegmente(a.loesung);
        expect(dollarCount(loe) % 2, `${id} loesung @${seed}`).toBe(0);
      }
    }
  });

  it('compileLatexOnHttpPdf: log_files aus API-Fehlerantwort wird in log übernommen', async () => {
    const stub = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: 'COMPILATION_ERROR',
          log_files: { '__main_document__.log': '!pdfTeX error: test marker\n' },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', stub);
    const r = await compileLatexOnHttpPdf({
      texMain: '\\documentclass{article}\\begin{document}x\\end{document}',
      binFiles: [],
    });
    vi.unstubAllGlobals();
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.message).toContain('COMPILATION_ERROR');
      expect(r.log).toContain('HTTP 400');
      expect(r.log).toContain('__main_document__.log');
      expect(r.log).toContain('pdfTeX error');
    }
  });
});
