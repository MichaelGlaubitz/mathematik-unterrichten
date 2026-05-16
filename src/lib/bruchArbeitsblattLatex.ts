/**
 * LaTeX-Aufbau und PDF-Erzeugung für das Arbeitsblatt „WB Bruchrechnung“
 * (Kompilierung über öffentliche LaTeX-on-HTTP-Instanz, CORS-freundlich).
 */
import type { PracticeAbAntwortSlot, PracticeAufgabe } from './uebungPracticeGenerators';
import { practiceAufgabeHatLoesungInlineNachFrage } from './uebungPracticeGenerators';

/** Maximale Breite eingebetteter Diagramme relativ zur Seitenbreite (Aufgaben + Lösung). */
export const BRUCH_AB_PDF_DIAGRAM_MAX_WIDTH = '0.33\\textwidth';

export const BRUCH_AB_LATEX_HTTP_ENDPOINT = 'https://latex.ytotech.com/builds/sync';

export type BruchAbPdfMeta = {
  /** z. B. „Bruchrechnung“ */
  thema: string;
  /** Gewählte Stichworte oder Kurzform „alle Typen gemischt“ */
  stichworteZeile: string;
};

const AB_PH = /\[\[MU_AB:(\d+)\]\]/g;

export function escapeLatexText(s: string): string {
  return s
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

export function stripHtmlTags(s: string): string {
  return s.replace(/<[^>]+>/g, ' ');
}

export function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function gcdPos(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

function fracTex(n: number, d: number): string {
  let zn = n;
  let zd = d;
  if (zd < 0) {
    zn = -zn;
    zd = -zd;
  }
  const g = gcdPos(zn, zd);
  zn /= g;
  zd /= g;
  if (zd === 1) return String(zn);
  return `\\tfrac{${zn}}{${zd}}`;
}

function escapeFuerTextInMath(s: string): string {
  return s.replace(/\\/g, '\\textbackslash{}').replace(/[{}#%&]/g, '\\$&');
}

export function slotLatex(spec: PracticeAbAntwortSlot, mode: 'blank' | 'filled'): string {
  if (mode === 'blank') {
    if (spec.kind === 'int') return '\\,\\rule{2.4cm}{0.4pt}\\,';
    if (spec.kind === 'frac')
      return '\\,\\rule{1.35cm}{0.4pt}\\,/\\,\\rule{1.35cm}{0.4pt}\\,';
    return '\\,\\rule{3.2cm}{0.4pt}\\,';
  }
  if (spec.kind === 'int') return `$\\boxed{${spec.expect}}$`;
  if (spec.kind === 'frac') {
    const inner = fracTex(spec.expectNum, spec.expectDen);
    return `$\\boxed{\\displaystyle ${inner}}$`;
  }
  const lab = spec.labels[spec.expect] ?? '';
  return `$\\boxed{\\displaystyle\\text{${escapeFuerTextInMath(lab)}}}$`;
}

export function replaceAbPlaceholdersLatex(
  template: string,
  slots: readonly PracticeAbAntwortSlot[],
  mode: 'blank' | 'filled'
): string {
  return template.replace(AB_PH, (_, g) => {
    const i = Number(g);
    const spec = slots[i];
    return spec ? slotLatex(spec, mode) : '';
  });
}

export function htmlFrageZuLatexInhalt(
  html: string,
  opts: { abSlots?: readonly PracticeAbAntwortSlot[]; mitLoesungen: boolean }
): string {
  let s = html;
  if (opts.abSlots?.length) {
    s = replaceAbPlaceholdersLatex(s, opts.abSlots, opts.mitLoesungen ? 'filled' : 'blank');
  }
  s = stripHtmlTags(s);
  s = decodeHtmlEntities(s);
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

export function loesungHtmlZuLatexSegmente(loesung: string): string {
  const parts = loesung.split(/<br\s*\/?>/i).map((p) => stripHtmlTags(decodeHtmlEntities(p)).replace(/\s+/g, ' ').trim());
  return parts.filter(Boolean).join('\\par\\medskip\n');
}

/** SVG der Aufgabenstellung (wie im UI: `diagram` oder nur `diagramLoesung`). */
export function bruchDiagramSvgFuerAufgabe(a: PracticeAufgabe): string {
  if (a.diagram) return a.diagram;
  if (a.diagramLoesung && !a.diagram) return a.diagramLoesung;
  return '';
}

export type BruchAbDiagramPng = { path: string; base64Png: string };

function parseSvgDimensions(svgXml: string): { w: number; h: number } {
  const doc = new DOMParser().parseFromString(svgXml, 'image/svg+xml');
  const el = doc.documentElement;
  const vb = el.getAttribute('viewBox');
  if (vb) {
    const p = vb.trim().split(/\s+/).map(Number);
    if (p.length === 4 && p.every((x) => Number.isFinite(x)) && p[2] > 0 && p[3] > 0) {
      return { w: p[2], h: p[3] };
    }
  }
  const w = parseFloat(el.getAttribute('width') || '0');
  const h = parseFloat(el.getAttribute('height') || '0');
  if (w > 0 && h > 0) return { w, h };
  return { w: 360, h: 120 };
}

/**
 * Rasterisiert SVG zu PNG (Base64, ohne data-URL-Präfix) für pdfLaTeX via `graphicx`.
 */
export async function rasterizeSvgZuPngBase64(svgXml: string, uiScale: number): Promise<string> {
  const { w, h } = parseSvgDimensions(svgXml);
  const s = Math.min(2.5, Math.max(0.5, uiScale || 1));
  const pixelW = Math.min(2000, Math.max(160, Math.round(w * 2 * s)));
  const pixelH = Math.max(80, Math.round((pixelW * h) / w));
  const blob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('SVG konnte nicht geladen werden.'));
    });
    img.src = url;
    await loaded;
    const canvas = document.createElement('canvas');
    canvas.width = pixelW;
    canvas.height = pixelH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas nicht verfügbar.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pixelW, pixelH);
    ctx.drawImage(img, 0, 0, pixelW, pixelH);
    const data = canvas.toDataURL('image/png');
    const i = data.indexOf(',');
    if (i < 0) throw new Error('PNG-Kodierung fehlgeschlagen.');
    return data.slice(i + 1);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function buildBruchArbeitsblattTex(opts: {
  aufgaben: readonly PracticeAufgabe[];
  meta: BruchAbPdfMeta;
  mitLoesungen: boolean;
  diagramPngPaths: ReadonlyArray<{ taskIndex: number; suffix: 'a' | 'l'; path: string }>;
}): string {
  const { aufgaben, meta, mitLoesungen, diagramPngPaths } = opts;
  const headLeftRaw = `${meta.thema} · ${meta.stichworteZeile}`;
  const headLeft = escapeLatexText(headLeftRaw);
  const loeTitle = escapeLatexText(mitLoesungen ? 'Arbeitsblatt (mit Lösungen)' : 'Arbeitsblatt');

  const diagramPath = (ti: number, suf: 'a' | 'l') =>
    diagramPngPaths.find((d) => d.taskIndex === ti && d.suffix === suf)?.path;

  const blocks: string[] = [];
  aufgaben.forEach((a, idx) => {
    const abSlots = a.abSlots;
    const frageSrc =
      mitLoesungen && a.frageMitLoesungHighlight
        ? a.frageMitLoesungHighlight
        : abSlots?.length && a.frageArbeitsblatt
          ? a.frageArbeitsblatt
          : a.frage;
    const frageBody = htmlFrageZuLatexInhalt(frageSrc, { abSlots, mitLoesungen });
    const pa = diagramPath(idx, 'a');
    const pl = diagramPath(idx, 'l');
    const diaW = BRUCH_AB_PDF_DIAGRAM_MAX_WIDTH;
    const diaAuf = pa
      ? `\\Needspace{5\\baselineskip}\n\\noindent\\includegraphics[width=${diaW},keepaspectratio=true]{${pa}}\n\\par\\smallskip\n`
      : '';
    const inlineL = practiceAufgabeHatLoesungInlineNachFrage(a);
    let loeBlock = '';
    if (mitLoesungen) {
      const loeTex = loesungHtmlZuLatexSegmente(a.loesung);
      const diaL =
        pl && a.diagramLoesung && a.diagramLoesung !== a.diagram
          ? `\\Needspace{4.5\\baselineskip}\n\\noindent\\includegraphics[width=${diaW},keepaspectratio=true]{${pl}}\n\\par\\smallskip\n`
          : '';
      if (inlineL && loeTex) {
        loeBlock = `\\par\\smallskip\n{\\color{teal}\\textbf{${escapeLatexText('Lösung')}.}\\quad ${loeTex}}\n`;
      } else if (loeTex || diaL) {
        loeBlock = `\\par\\medskip\n\\fcolorbox{black!18}{black!4}{\\begin{minipage}{0.96\\linewidth}\n\\textbf{${escapeLatexText('Lösung')}.}\\par\\smallskip\n${loeTex}${loeTex && diaL ? '\\par\\smallskip\n' : ''}${diaL}\\end{minipage}}\n`;
      }
    }
    const zeilenumbruchNachNummerWennDiagramm = pa ? '\\leavevmode\\par\n' : '';
    const itemCore = `${zeilenumbruchNachNummerWennDiagramm}${diaAuf}${frageBody}${loeBlock}`;
    blocks.push(`\\Needspace{5\\baselineskip}\n\\item\\nopagebreak[3]\n${itemCore}`);
  });

  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[a4paper,margin=18mm]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage[ngerman]{babel}
\\usepackage{amsmath,amssymb}
\\usepackage{needspace}
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage{fancyhdr}
\\usepackage{enumitem}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\footnotesize\\sffamily ${headLeft}}
\\fancyhead[R]{\\footnotesize\\sffamily Seite~\\thepage}
\\renewcommand{\\headrulewidth}{0.35pt}
\\setlength{\\headheight}{22pt}
\\setlist[enumerate,1]{style=nextline, label=\\textbf{\\arabic*.}, leftmargin=*, itemsep=1.05em, parsep=0.2em, topsep=0.6em, labelsep=0.45em}
\\title{\\sffamily\\large ${loeTitle}}
\\author{}
\\date{}
\\begin{document}
\\maketitle
\\thispagestyle{fancy}
\\begin{enumerate}
${blocks.join('\n')}
\\end{enumerate}
\\end{document}
`;
}

export async function compileLatexOnHttpPdf(opts: {
  texMain: string;
  binFiles: ReadonlyArray<{ path: string; base64Png: string }>;
}): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  const resources: Record<string, unknown>[] = [{ main: true, content: opts.texMain }];
  for (const f of opts.binFiles) {
    resources.push({ path: f.path, file: f.base64Png });
  }
  let res: Response;
  try {
    res = await fetch(BRUCH_AB_LATEX_HTTP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compiler: 'pdflatex', resources }),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `Netzwerkfehler beim PDF-Dienst: ${msg}` };
  }
  const buf = new Uint8Array(await res.arrayBuffer());
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  if (res.ok && ct.includes('pdf')) {
    return { ok: true, pdf: buf };
  }
  let log = '';
  let message = `PDF-Dienst antwortete mit HTTP ${res.status}.`;
  try {
    const txt = new TextDecoder().decode(buf);
    const j = JSON.parse(txt) as { error?: string; message?: string; log?: string };
    if (j.error) message = String(j.error);
    if (j.message) message = `${message} ${j.message}`;
    if (j.log) log = String(j.log);
  } catch {
    const head = new TextDecoder().decode(buf.slice(0, 400));
    log = head;
  }
  return { ok: false, message, log };
}

export async function erzeugeBruchArbeitsblattPdf(opts: {
  aufgaben: readonly PracticeAufgabe[];
  meta: BruchAbPdfMeta;
  mitLoesungen: boolean;
  diagramUiScale: (taskIndex: number) => number;
}): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  const diagramPngPaths: { taskIndex: number; suffix: 'a' | 'l'; path: string }[] = [];
  const binFiles: { path: string; base64Png: string }[] = [];

  for (let i = 0; i < opts.aufgaben.length; i++) {
    const a = opts.aufgaben[i];
    const sc = opts.diagramUiScale(i);
    const svgA = bruchDiagramSvgFuerAufgabe(a);
    if (svgA) {
      const path = `d${i}a.png`;
      diagramPngPaths.push({ taskIndex: i, suffix: 'a', path });
      binFiles.push({ path, base64Png: await rasterizeSvgZuPngBase64(svgA, sc) });
    }
    if (opts.mitLoesungen && a.diagramLoesung && a.diagram && a.diagramLoesung !== a.diagram) {
      const path = `d${i}l.png`;
      diagramPngPaths.push({ taskIndex: i, suffix: 'l', path });
      binFiles.push({ path, base64Png: await rasterizeSvgZuPngBase64(a.diagramLoesung, sc) });
    }
  }

  const texMain = buildBruchArbeitsblattTex({
    aufgaben: opts.aufgaben,
    meta: opts.meta,
    mitLoesungen: opts.mitLoesungen,
    diagramPngPaths,
  });
  return compileLatexOnHttpPdf({ texMain, binFiles });
}
