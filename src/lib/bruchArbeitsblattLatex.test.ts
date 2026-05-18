import { describe, expect, it, vi } from 'vitest';
import type { PracticeAbAntwortSlot } from './uebungPracticeGenerators';
import { BRUCHRECHNUNG_GENERATOR_IDS, createPracticeGenerators } from './uebungPracticeGenerators';
import {
  BRUCH_AB_PDF_DIAGRAM_MAX_WIDTH,
  bruchDiagramSvgFuerAufgabe,
  buildBruchArbeitsblattTex,
  compileLatexOnHttpPdf,
  escapeLatexText,
  htmlFrageZuLatexInhalt,
  latexCompileFailureIsDocumentOrClientError,
  latexCompileFailureMayBenefitFromSmallerPayload,
  latexHttpEndpointList,
  loesungHtmlZuLatexSegmente,
  pdfFrageTexVerdichtenSchreibzeile,
  practicePdfSpaltenAnzahl,
  replaceAbPlaceholdersLatex,
  slotLatex,
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

  it('bruchDiagramSvgFuerAufgabe: unterdrückt Aufgaben-SVG im PDF bei Flag', () => {
    expect(
      bruchDiagramSvgFuerAufgabe({
        frage: 'x',
        loesung: 'y',
        diagram: '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>',
        diagramPdfAufgabeUnterdruecken: true,
      })
    ).toBe('');
  });

  it('bruchDiagramSvgFuerAufgabe: unterdrückt bei Größenvergleich auch ohne Flag (alte Routen)', () => {
    expect(
      bruchDiagramSvgFuerAufgabe({
        frage: 'Welcher Bruch ist größer: $\\tfrac{2}{3}$ oder $\\tfrac{3}{4}$?',
        loesung: 'x',
        diagram: '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>',
      })
    ).toBe('');
  });

  it('replaceAbPlaceholdersLatex (blank / filled)', () => {
    const slots = [
      { kind: 'int' as const, expect: 7 },
      { kind: 'frac' as const, expectNum: 3, expectDen: 4 },
    ];
    const t = 'A [[MU_AB:0]] und [[MU_AB:1]]';
    expect(replaceAbPlaceholdersLatex(t, slots, 'blank')).toMatch(/colorbox/);
    expect(replaceAbPlaceholdersLatex(t, slots, 'filled')).toContain('\\ensuremath{\\boxed{7}}');
    expect(replaceAbPlaceholdersLatex(t, slots, 'filled')).toMatch(/tfrac\{3\}\{4\}/);
  });

  it('slotLatex: frac_num nur Zähler-Lücke, Nenner fest', () => {
    const s = { kind: 'frac_num' as const, expectNum: 3, fixedDen: 8 };
    expect(slotLatex(s, 'blank')).toMatch(/\\frac\{.*\}\{8\}/);
    expect(slotLatex(s, 'filled')).toMatch(/tfrac\{3\}\{8\}/);
  });

  it('slotLatex: choice filled mit führendem $…$ (optional mit Textrest)', () => {
    const nurMath: PracticeAbAntwortSlot = {
      kind: 'choice',
      expect: 0,
      labels: ['$\\tfrac{2}{7}$', 'x'],
    };
    expect(slotLatex(nurMath, 'filled')).toMatch(/\\tfrac\{2\}\{7\}/);
    expect(slotLatex(nurMath, 'filled')).not.toMatch(/\\text\{.*tfrac/);

    const mathUndRest: PracticeAbAntwortSlot = {
      kind: 'choice',
      expect: 0,
      labels: ['$3x+1$ (ohne =)', 'y'],
    };
    const mix = slotLatex(mathUndRest, 'filled');
    expect(mix).toContain('3x+1');
    expect(mix).toMatch(/\\text\{/);
    expect(mix).toContain('ohne');

    const nurText: PracticeAbAntwortSlot = { kind: 'choice', expect: 0, labels: ['nur Text', 'b'] };
    expect(slotLatex(nurText, 'filled')).toMatch(/\\text\{nur Text\}/);
  });

  it('htmlFrageZuLatexInhalt verarbeitet AB-Platzhalter', () => {
    const html =
      'Berechne $\\tfrac{1}{2}$<span class="mu-katex-skip"><span>=</span>[[MU_AB:0]]</span>';
    const s = htmlFrageZuLatexInhalt(html, {
      abSlots: [{ kind: 'frac', expectNum: 1, expectDen: 2 }],
      mitLoesungen: false,
    });
    expect(s).toContain('$\\tfrac{1}{2}$');
    expect(s).toContain('\\colorbox{black!10}');
    expect(s).toContain('\\displaystyle\\frac');
  });

  it('loesungHtmlZuLatexSegmente ersetzt br-Tags', () => {
    expect(loesungHtmlZuLatexSegmente('a<br>b')).toBe('a\\par\\medskip\nb');
  });

  it('practicePdfSpaltenAnzahl / pdfFrageTexVerdichtenSchreibzeile', () => {
    expect(practicePdfSpaltenAnzahl([{ frage: 'a', loesung: 'b' }])).toBe(2);
    expect(
      practicePdfSpaltenAnzahl([{ frage: 'a', loesung: 'b', pdfArbeitsblattEinzelspalte: true }])
    ).toBe(1);
    expect(pdfFrageTexVerdichtenSchreibzeile('Vereinfache $1$. = \\ensuremath{X}')).toMatch(/\.~~=~\\ensuremath/);
    const intBlank = slotLatex({ kind: 'int', expect: 0 }, 'blank');
    const binomBlank = `Vereinfache $2(3x+4)$. = ${intBlank} x + ${intBlank}`;
    const d = pdfFrageTexVerdichtenSchreibzeile(binomBlank);
    expect(d).toContain('=');
    expect(d).toContain('~x~+~');
    expect(d).toMatch(/\.~~=~\\ensuremath/);
  });

  it('buildBruchArbeitsblattTex: zweispaltig, Spaltentrennlinie, Diagramm an Spaltenbreite', () => {
    const tex = buildBruchArbeitsblattTex({
      aufgaben: [{ frage: 'Frage', loesung: '$1$' }],
      meta: {
        thema: 'Bruchrechnung',
        stichworteZeile: 'x',
      },
      mitLoesungen: false,
      diagramPngPaths: [{ taskIndex: 0, suffix: 'a', path: 'd0a.jpg' }],
    });
    expect(tex).toContain('\\setlength{\\columnseprule}');
    expect(tex).toContain(`width=${BRUCH_AB_PDF_DIAGRAM_MAX_WIDTH},keepaspectratio=true`);
    expect(tex).not.toContain('style=nextline');
    expect(tex).not.toContain('\\maketitle');
    expect(tex.indexOf('Frage')).toBeGreaterThan(0);
    expect(tex.indexOf('Frage')).toBeLessThan(tex.indexOf('includegraphics'));
    expect(tex).toContain('\\begin{multicols}{2}');
    expect(tex).toContain('\\raggedcolumns');
    expect(tex).toContain('\\Needspace{12\\baselineskip}');
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
    expect(tex).toContain('\\raggedcolumns');
    expect(tex).toContain('\\Needspace{6\\baselineskip}');
    expect(tex).toContain('\\end{multicols}');
    expect(tex).not.toContain('\\maketitle');
  });

  it('buildBruchArbeitsblattTex: einspaltig bei pdfArbeitsblattEinzelspalte + Verdichtung vor Schreibfeld', () => {
    const tex = buildBruchArbeitsblattTex({
      aufgaben: [
        {
          frage: 'Vereinfache $x$.',
          loesung: '$x$',
          frageArbeitsblatt: 'Vereinfache $x$. = [[MU_AB:0]]',
          abSlots: [{ kind: 'int', expect: 1 }],
          pdfArbeitsblattEinzelspalte: true,
        },
      ],
      meta: { thema: 'Algebra', stichworteZeile: 'Test' },
      mitLoesungen: false,
      diagramPngPaths: [],
    });
    expect(tex).toContain('\\begin{multicols}{1}');
    expect(tex).toMatch(/\.~~=~\\ensuremath/);
  });

  it('buildBruchArbeitsblattTex: meta.pdfImmerEinspaltig erzwingt einspaltig (auch Lösungs-PDF)', () => {
    const tex = buildBruchArbeitsblattTex({
      aufgaben: [
        {
          frage: 'Kurz',
          loesung: '$1$',
          frageArbeitsblatt: 'Kurz = [[MU_AB:0]]',
          abSlots: [{ kind: 'int', expect: 1 }],
        },
      ],
      meta: { thema: 'Bruchrechnung', stichworteZeile: 'Test', pdfImmerEinspaltig: true },
      mitLoesungen: true,
      diagramPngPaths: [],
    });
    expect(tex).toContain('\\begin{multicols}{1}');
    expect(tex).toContain('Lösung');
  });

  it('buildBruchArbeitsblattTex: Thema Algebra ist immer einspaltig (ohne Aufgaben-Flags)', () => {
    const tex = buildBruchArbeitsblattTex({
      aufgaben: [{ frage: 'Nur Text', loesung: '$1$' }],
      meta: { thema: 'Algebra', stichworteZeile: 'Grundbegriffe' },
      mitLoesungen: false,
      diagramPngPaths: [],
    });
    expect(tex).toContain('\\begin{multicols}{1}');
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

  it('latexHttpEndpointList dedupliziert und respektiert explizite URLs', () => {
    expect(latexHttpEndpointList(['https://a.example/sync', 'https://a.example/sync'])).toEqual([
      'https://a.example/sync',
    ]);
    expect(latexHttpEndpointList(['https://b.example/sync'])).toEqual(['https://b.example/sync']);
  });

  it('latexCompileFailure: SERVER_ERROR erlaubt kleinere-Payload-Strategie', () => {
    const r = { ok: false as const, message: 'SERVER_ERROR', log: 'HTTP 500\nContent-Type: application/json\n' };
    expect(latexCompileFailureMayBenefitFromSmallerPayload(r)).toBe(true);
    expect(latexCompileFailureIsDocumentOrClientError(r)).toBe(false);
  });

  it('latexCompileFailure: HTTP 400 stoppt alternative Strategien', () => {
    const r = { ok: false as const, message: 'x', log: 'HTTP 400\n' };
    expect(latexCompileFailureIsDocumentOrClientError(r)).toBe(true);
    expect(latexCompileFailureMayBenefitFromSmallerPayload(r)).toBe(false);
  });

  it('compileLatexOnHttpPdf: wechselt zum zweiten Endpunkt nach 5xx am ersten', async () => {
    const pdfBody = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
    const ok = new Response(pdfBody, { status: 201, headers: { 'Content-Type': 'application/pdf' } });
    const stub = vi.fn().mockImplementation((url: string) => {
      if (String(url).includes('a.test')) return Promise.resolve(new Response('err', { status: 500 }));
      return Promise.resolve(ok);
    });
    vi.stubGlobal('fetch', stub);
    const r = await compileLatexOnHttpPdf({
      texMain: '\\documentclass{article}\\begin{document}x\\end{document}',
      binFiles: [],
      endpoints: ['https://a.test/builds/sync', 'https://b.test/builds/sync'],
    });
    vi.unstubAllGlobals();
    expect(r.ok).toBe(true);
    expect(stub.mock.calls.some((c) => String(c[0]).includes('b.test'))).toBe(true);
  }, 12_000);

  it('compileLatexOnHttpPdf: wiederholt bei temporärem HTTP 500', async () => {
    const pdfBody = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
    const fail = new Response('err', { status: 500 });
    const ok = new Response(pdfBody, { status: 201, headers: { 'Content-Type': 'application/pdf' } });
    const stub = vi.fn().mockResolvedValueOnce(fail).mockResolvedValueOnce(ok);
    vi.stubGlobal('fetch', stub);
    const r = await compileLatexOnHttpPdf({
      texMain: '\\documentclass{article}\\begin{document}x\\end{document}',
      binFiles: [],
      endpoints: ['https://stub.test/builds/sync'],
    });
    vi.unstubAllGlobals();
    expect(stub).toHaveBeenCalledTimes(2);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.pdf[0]).toBe(0x25);
  }, 10_000);

  it('compileLatexOnHttpPdf: bricht nach mehreren HTTP 500 ab', async () => {
    const stub = vi.fn().mockImplementation(() => Promise.resolve(new Response('err', { status: 500 })));
    vi.stubGlobal('fetch', stub);
    const r = await compileLatexOnHttpPdf({
      texMain: '\\documentclass{article}\\begin{document}x\\end{document}',
      binFiles: [],
      endpoints: ['https://stub.test/builds/sync'],
    });
    vi.unstubAllGlobals();
    expect(r.ok).toBe(false);
    expect(stub).toHaveBeenCalledTimes(4);
  }, 10_000);

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
      endpoints: ['https://stub.test/builds/sync'],
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
