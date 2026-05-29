/**
 * LaTeX-Aufbau und PDF-Erzeugung für das Arbeitsblatt „WB Bruchrechnung“
 * (Kompilierung über öffentliche LaTeX-on-HTTP-Instanz, CORS-freundlich).
 */
import type { PracticeAbAntwortSlot, PracticeAufgabe } from './uebungPracticeGenerators';
import {
  practiceAufgabeHatLoesungInlineNachFrage,
  practiceAufgabeUnterdruecktBruchPdfAufgabenDiagramm,
} from './uebungPracticeGenerators';

/** Maximale Breite eingebetteter Diagramme (im zweispaltigen Block: Spaltenbreite). */
export const BRUCH_AB_PDF_DIAGRAM_MAX_WIDTH = '0.92\\linewidth';

export const BRUCH_AB_LATEX_HTTP_ENDPOINT = 'https://latex.ytotech.com/builds/sync';

/** Öffentlicher LaTeX-on-HTTP-Dienst (YtoTech); gelegentlich 5xx bei Last — kurze Wiederholungen helfen. */
const LATEX_HTTP_MAX_ATTEMPTS = 4;
const LATEX_HTTP_RETRY_STATUS = new Set([500, 502, 503, 504]);

function latexHttpBackoffMs(attemptIndex: number): number {
  return 550 * 2 ** attemptIndex;
}

/** Kompaktere Rastergrafik senkt die JSON-Payload; große POSTs lösen beim öffentlichen Dienst oft SERVER_ERROR aus. */
export type SvgRasterCaps = { maxPixelWidth: number; jpegQuality: number };

export const BRUCH_AB_RASTER_CAPS_PDF: SvgRasterCaps = {
  maxPixelWidth: 1280,
  jpegQuality: 0.83,
};

export const BRUCH_AB_RASTER_CAPS_PDF_LIGHT: SvgRasterCaps = {
  maxPixelWidth: 840,
  jpegQuality: 0.7,
};

/** Sehr kleine eingebettete Grafiken — letzte Stufe vor Nutzer-Fallback (Browserdruck). */
export const BRUCH_AB_RASTER_CAPS_PDF_MINIMAL: SvgRasterCaps = {
  maxPixelWidth: 560,
  jpegQuality: 0.62,
};

/**
 * Reihenfolge: zuerst URLs aus `PUBLIC_MU_LATEX_HTTP_URL` (Leerzeichen/Komma-getrennt), dann YtoTech-Standard.
 * Eigener Proxy kann dieselbe JSON-API sprechen.
 */
export function latexHttpEndpointList(explicit?: readonly string[]): string[] {
  if (explicit?.length) return [...new Set(explicit.filter(Boolean))];
  const raw =
    typeof import.meta.env.PUBLIC_MU_LATEX_HTTP_URL === 'string'
      ? import.meta.env.PUBLIC_MU_LATEX_HTTP_URL.trim()
      : '';
  const fromEnv = raw ? raw.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean) : [];
  return [...new Set([...fromEnv, BRUCH_AB_LATEX_HTTP_ENDPOINT])];
}

/** Echte LaTeX-/Clientfehler: weiterer Endpunkt oder kleinere Bilder nützen nicht. */
export function latexCompileFailureIsDocumentOrClientError(r: {
  ok: false;
  message: string;
  log?: string;
}): boolean {
  const log = r.log || '';
  if (/^HTTP 400\b/m.test(log) || /^HTTP 401\b/m.test(log) || /^HTTP 403\b/m.test(log)) return true;
  if (/pdfTeX error/i.test(log) || /! LaTeX Error/i.test(log)) return true;
  if (/COMPILATION/i.test(r.message)) return true;
  return false;
}

/** Server-/Lastfehler: zweiter Endpunkt oder kleinere eingebettete Grafiken können helfen. */
export function latexCompileFailureMayBenefitFromSmallerPayload(r: {
  ok: false;
  message: string;
  log?: string;
}): boolean {
  if (latexCompileFailureIsDocumentOrClientError(r)) return false;
  const blob = `${r.message}\n${r.log || ''}`;
  if (/SERVER_ERROR/i.test(blob)) return true;
  if (/HTTP 5\d\d/.test(blob)) return true;
  return false;
}

export type BruchAbPdfMeta = {
  /** z. B. „Bruchrechnung“ */
  thema: string;
  /** Gewählte Stichworte oder Kurzform „alle Typen gemischt“ */
  stichworteZeile: string;
  /**
   * Optional: einspaltiges PDF erzwingen (z. B. für Tests). **WB Algebra:** bei `thema` „Algebra“
   * (nach Trim) wird ohne `multicol`-Umgebung gearbeitet — volle Textbreite für Schreibzeilen.
   */
  pdfImmerEinspaltig?: boolean;
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

/**
 * Eine Choice-Zeile im PDF: Kästchen (`\\square` / `\\blacksquare`) wie Ankreuzen online, dann Inhalt.
 * Labels mit führendem `$…$` und optionalem Klartext (z. B. Konventionen-Algebra) wie bei den HTML-Pills.
 */
function choiceRowLatexFromLabel(lab: string, mark: '\\square' | '\\blacksquare'): string {
  const s = lab.trim();
  if (s.startsWith('$')) {
    const end = s.indexOf('$', 1);
    if (end > 1) {
      const math = s.slice(1, end);
      const tail = s.slice(end + 1).trim();
      if (tail === '') {
        return `\\ensuremath{${mark}\\,\\displaystyle ${math}}`;
      }
      if (!s.includes('$', end + 1)) {
        return `\\ensuremath{${mark}\\,\\displaystyle ${math}\\;\\text{${escapeFuerTextInMath(tail)}}}`;
      }
    }
  }
  return `\\ensuremath{${mark}\\,\\displaystyle\\text{${escapeFuerTextInMath(s)}}}`;
}

function slotChoiceLatexTwoRows(spec: PracticeAbAntwortSlot & { kind: 'choice' }, mode: 'blank' | 'filled'): string {
  const sq: '\\square' = '\\square';
  const bs: '\\blacksquare' = '\\blacksquare';
  if (mode === 'blank') {
    const a = choiceRowLatexFromLabel(spec.labels[0], sq);
    const b = choiceRowLatexFromLabel(spec.labels[1], sq);
    return `${a}\\par\\smallskip\n${b}`;
  }
  const a = choiceRowLatexFromLabel(spec.labels[0], spec.expect === 0 ? bs : sq);
  const b = choiceRowLatexFromLabel(spec.labels[1], spec.expect === 1 ? bs : sq);
  return `${a}\\par\\smallskip\n${b}`;
}

/** Schreibfläche für Bruch-Zähler/Nenner im PDF: hellgrau, ohne zweite „Strich“-Optik wie bei \\underline. */
const BRUCH_AB_PDF_FRAC_SCHREIBFLAECHE =
  '\\mbox{\\colorbox{black!10}{\\rule{0pt}{2.65ex}\\hspace{1.08cm}}}';

/** Schreibfläche für ganzzahlige / Textantworten im PDF (kein \\rule-Strich). */
const BRUCH_AB_PDF_INT_SCHREIBFLAECHE =
  '\\mbox{\\colorbox{black!10}{\\rule{0pt}{2.65ex}\\hspace{2.35cm}}}';

/** Inhalt von `\\boxed{…}` für ausgefüllte int-Slots (Lösungs-PDF). */
function intSlotFilledBoxInhalt(spec: PracticeAbAntwortSlot & { kind: 'int' }): string {
  const n = spec.expect;
  if (!spec.konstanteMitVorzeichenInAntwortBox) return String(n);
  if (n === 0) return '0';
  if (n > 0) return `+${n}`;
  return String(n);
}

export function slotLatex(spec: PracticeAbAntwortSlot, mode: 'blank' | 'filled'): string {
  if (mode === 'blank') {
    if (spec.kind === 'int' || spec.kind === 'decimal') return `\\ensuremath{${BRUCH_AB_PDF_INT_SCHREIBFLAECHE}}`;
    if (spec.kind === 'frac')
      return `\\ensuremath{\\displaystyle\\frac{${BRUCH_AB_PDF_FRAC_SCHREIBFLAECHE}}{${BRUCH_AB_PDF_FRAC_SCHREIBFLAECHE}}}`;
    if (spec.kind === 'frac_num')
      return `\\ensuremath{\\displaystyle\\frac{${BRUCH_AB_PDF_FRAC_SCHREIBFLAECHE}}{${spec.fixedDen}}}`;
    return slotChoiceLatexTwoRows(spec, 'blank');
  }
  if (spec.kind === 'int') return `\\ensuremath{\\boxed{${intSlotFilledBoxInhalt(spec)}}}`;
  if (spec.kind === 'decimal') {
    const s = String(spec.expect).replace('.', '{,}');
    return `\\ensuremath{\\boxed{${s}}}`;
  }
  if (spec.kind === 'frac') {
    const inner = fracTex(spec.expectNum, spec.expectDen);
    return `\\ensuremath{\\boxed{\\displaystyle ${inner}}}`;
  }
  if (spec.kind === 'frac_num') {
    const inner = fracTex(spec.expectNum, spec.fixedDen);
    return `\\ensuremath{\\boxed{\\displaystyle ${inner}}}`;
  }
  return slotChoiceLatexTwoRows(spec, 'filled');
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

/** Trennt Absätze in `frageArbeitsblatt`-HTML (`<br>`) für die PDF-Zeile — kein echtes Unicode im Aufgabentext. */
const HTML_FRAGE_BR_PAR_SENTINEL = '\uE000MU_HTML_BR_PAR\uE000';

export function translateHtmlTableToLatex(html: string): string {
  return html.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, tableContent) => {
    const rows: string[][] = [];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch: RegExpExecArray | null;
    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      const cellContent = rowMatch[1];
      const cells: string[] = [];
      const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;
      let cellMatch: RegExpExecArray | null;
      while ((cellMatch = cellRegex.exec(cellContent)) !== null) {
        let content = cellMatch[2].trim();
        content = stripHtmlTags(content).trim();
        if (content === 'x') {
          content = '$x$';
        } else if (content === 'y') {
          content = '$y$';
        }
        cells.push(content);
      }
      if (cells.length > 0) {
        rows.push(cells);
      }
    }

    if (rows.length === 0) return '';

    const numCols = Math.max(...rows.map(r => r.length));
    const colSpec = '|' + Array(numCols).fill('c').join('|') + '|';
    
    let latex = '\\begin{tabular}{' + colSpec + '}\n\\hline\n';
    for (const row of rows) {
      while (row.length < numCols) {
        row.push('');
      }
      latex += row.join(' & ') + ' \\\\ \\hline\n';
    }
    latex += '\\end{tabular}';
    return latex;
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
  s = translateHtmlTableToLatex(s);
  s = s.replace(/<br\s*\/?>/gi, HTML_FRAGE_BR_PAR_SENTINEL);
  s = stripHtmlTags(s);
  s = decodeHtmlEntities(s);
  s = s
    .split(HTML_FRAGE_BR_PAR_SENTINEL)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\\par\\smallskip\n');
  return s;
}

export function loesungHtmlZuLatexSegmente(loesung: string): string {
  const parts = loesung.split(/<br\s*\/?>/i).map((p) => stripHtmlTags(decodeHtmlEntities(p)).replace(/\s+/g, ' ').trim());
  return parts.filter(Boolean).join('\\par\\medskip\n');
}

/** PDF: eine Spalte, sobald mindestens eine Aufgabe horizontale Schreibzeilen braucht. */
export function practicePdfSpaltenAnzahl(aufgaben: readonly PracticeAufgabe[]): 1 | 2 {
  return aufgaben.some((a) => a.pdfArbeitsblattEinzelspalte === true) ? 1 : 2;
}

/**
 * Reduziert störende Umbrüche bei Algebra-Slotzeilen (PDF): typisch `…$. = \\ensuremath{…} x \\ensuremath{…}`
 * (optional mit `+` dazwischen bei älteren Aufgaben) nach `stripHtmlTags`. `~` = geschütztes Leerzeichen in LaTeX.
 *
 * Wichtig: Das Gleichheitszeichen muss erhalten bleiben (nur Abstände verdichten), sonst fehlt `=` im PDF.
 */
export function pdfFrageTexVerdichtenSchreibzeile(tex: string): string {
  let s = tex;
  s = s.replace(/\.\s*=\s*(?=\\ensuremath)/g, '.~~=~');
  s = s.replace(/(\\hspace\{2\.35cm\}\}\}\})\s+x/g, '$1~x');
  s = s.replace(/(\\ensuremath\{\\boxed\{[^}]+\}\})\s+x/g, '$1~x');
  s = s.replace(/~x\s+\+\s+\\ensuremath/g, '~x~+~\\ensuremath');
  s = s.replace(/~x\s+\\ensuremath/g, '~x~\\ensuremath');
  return s;
}

/** SVG der Aufgabenstellung (wie im UI: `diagram` oder nur `diagramLoesung`). */
export function bruchDiagramSvgFuerAufgabe(a: PracticeAufgabe): string {
  if (practiceAufgabeUnterdruecktBruchPdfAufgabenDiagramm(a)) return '';
  if (a.diagram) return a.diagram;
  if (a.diagramLoesung && !a.diagram) return a.diagramLoesung;
  return '';
}

/** Standard: Aufgaben-SVG wie online (ohne Bruch-spezifische PDF-Unterdrückung). */
export function standardPracticeDiagramSvgFuerPdf(a: PracticeAufgabe): string {
  if (a.diagram) return a.diagram;
  if (a.diagramLoesung && !a.diagram) return a.diagramLoesung;
  return '';
}

export type BruchAbDiagramRaster = { path: string; fileBase64: string };

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
 * Rasterisiert SVG zu JPEG (Base64, ohne data-URL-Präfix) für pdfLaTeX.
 * JPEG ist auf LaTeX-Hosting oft robuster als PNG (weniger libpng-Kantenfälle).
 */
export async function rasterizeSvgZuJpegBase64(
  svgXml: string,
  uiScale: number,
  caps: SvgRasterCaps = BRUCH_AB_RASTER_CAPS_PDF
): Promise<string> {
  const cleanSvg = svgXml.trim().replace(/^<figure[^>]*>/, '').replace(/<\/figure>$/, '').trim();
  const maxPx = Math.max(160, caps.maxPixelWidth);
  const { w, h } = parseSvgDimensions(cleanSvg);
  const s = Math.min(2.5, Math.max(0.5, uiScale || 1));
  let pixelW = Math.min(maxPx, Math.max(160, Math.round(w * 2 * s)));
  let pixelH = Math.max(80, Math.round((pixelW * h) / w));
  const minPx = 64;
  if (pixelW < minPx || pixelH < minPx) {
    const f = minPx / Math.min(pixelW, pixelH);
    pixelW = Math.min(maxPx, Math.max(minPx, Math.round(pixelW * f)));
    pixelH = Math.max(minPx, Math.round((pixelW * h) / w));
  }
  const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
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
    const data = canvas.toDataURL('image/jpeg', caps.jpegQuality);
    const i = data.indexOf(',');
    if (i < 0 || data.slice(0, i).indexOf('image/jpeg') < 0) throw new Error('JPEG-Kodierung fehlgeschlagen.');
    return data.slice(i + 1);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Rasterisiert SVG zu PNG (Base64, ohne data-URL-Präfix).
 */
export async function rasterizeSvgZuPngBase64(
  svgXml: string,
  uiScale: number,
  caps: Pick<SvgRasterCaps, 'maxPixelWidth'> = BRUCH_AB_RASTER_CAPS_PDF
): Promise<string> {
  const cleanSvg = svgXml.trim().replace(/^<figure[^>]*>/, '').replace(/<\/figure>$/, '').trim();
  const maxPx = Math.max(160, caps.maxPixelWidth);
  const { w, h } = parseSvgDimensions(cleanSvg);
  const s = Math.min(2.5, Math.max(0.5, uiScale || 1));
  let pixelW = Math.min(maxPx, Math.max(160, Math.round(w * 2 * s)));
  let pixelH = Math.max(80, Math.round((pixelW * h) / w));
  const minPx = 64;
  if (pixelW < minPx || pixelH < minPx) {
    const f = minPx / Math.min(pixelW, pixelH);
    pixelW = Math.min(maxPx, Math.max(minPx, Math.round(pixelW * f)));
    pixelH = Math.max(minPx, Math.round((pixelW * h) / w));
  }
  const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
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

/** SVG → Raster für pdfLaTeX; zuerst JPEG, bei Fehler oder leerem Ergebnis PNG. */
export async function rasterizeSvgFuerLatexPdf(
  svgXml: string,
  uiScale: number,
  caps: SvgRasterCaps = BRUCH_AB_RASTER_CAPS_PDF
): Promise<{ ext: 'jpg' | 'png'; base64: string }> {
  try {
    const base64 = await rasterizeSvgZuJpegBase64(svgXml, uiScale, caps);
    if (base64.length > 80) return { ext: 'jpg', base64 };
  } catch {
    /* JPEG nicht möglich → PNG */
  }
  return { ext: 'png', base64: await rasterizeSvgZuPngBase64(svgXml, uiScale, caps) };
}

export function buildBruchArbeitsblattTex(opts: {
  aufgaben: readonly PracticeAufgabe[];
  meta: BruchAbPdfMeta;
  mitLoesungen: boolean;
  diagramPngPaths: ReadonlyArray<{ taskIndex: number; suffix: 'a' | 'l'; path: string }>;
}): string {
  const { aufgaben, meta, mitLoesungen, diagramPngPaths } = opts;
  const themaNorm = String(meta.thema ?? '').trim();
  /** Algebra: volle Zeilenbreite ohne `multicol` (einige Renderer zeigen bei `{1}` dennoch zweispaltig). */
  const nPdfSpalten =
    themaNorm === 'Algebra' ||
    themaNorm === 'Graphen' ||
    meta.pdfImmerEinspaltig === true
      ? 1
      : practicePdfSpaltenAnzahl(aufgaben);
  const pdfZweispaltig = nPdfSpalten === 2;
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
    const frageBodyRaw = htmlFrageZuLatexInhalt(frageSrc, { abSlots, mitLoesungen });
    const frageBody =
      a.pdfArbeitsblattEinzelspalte === true
        ? pdfFrageTexVerdichtenSchreibzeile(frageBodyRaw)
        : frageBodyRaw;
    const pa = diagramPath(idx, 'a');
    const pl = diagramPath(idx, 'l');
    const diaW = BRUCH_AB_PDF_DIAGRAM_MAX_WIDTH;
    const diaAuf = pa
      ? `\\Needspace{5\\baselineskip}\n\\noindent\\includegraphics[width=${diaW},keepaspectratio=true]{${pa}}\n\\par\\smallskip\n`
      : '';
    const inlineL = practiceAufgabeHatLoesungInlineNachFrage(a);
    let loeTex = '';
    let diaL = '';
    if (mitLoesungen) {
      loeTex = loesungHtmlZuLatexSegmente(a.loesung);
      diaL =
        pl && a.diagramLoesung && a.diagramLoesung !== a.diagram
          ? `\\Needspace{4.5\\baselineskip}\n\\noindent\\includegraphics[width=${diaW},keepaspectratio=true]{${pl}}\n\\par\\smallskip\n`
          : '';
    }
    let loeBlock = '';
    if (mitLoesungen) {
      if (inlineL && loeTex) {
        loeBlock = `\\par\\smallskip\n{\\color{teal}\\textbf{${escapeLatexText('Lösung')}.}\\quad ${loeTex}}\n`;
      } else if (loeTex || diaL) {
        loeBlock = `\\par\\medskip\n\\fcolorbox{black!18}{black!4}{\\begin{minipage}{0.96\\linewidth}\n\\textbf{${escapeLatexText('Lösung')}.}\\par\\smallskip\n${loeTex}${loeTex && diaL ? '\\par\\smallskip\n' : ''}${diaL}\\end{minipage}}\n`;
      }
    }
    const itemCore = `${frageBody}${diaAuf}${loeBlock}`;
    /** Mehr freier Platz vor „schweren“ Aufgaben: sonst erzwingt \\Needspace oft einen frühen Spalten-/Seitenumbruch. */
    const blockIstSchwergewicht =
      !!pa || (mitLoesungen && (!!diaL || (!inlineL && loeTex.length > 0)));
    const needVorItem = blockIstSchwergewicht ? '12' : '6';
    blocks.push(`\\Needspace{${needVorItem}\\baselineskip}\n\\item\\nopagebreak[3]\n${itemCore}`);
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
${pdfZweispaltig ? `\\usepackage{multicol}
\\setlength{\\columnseprule}{0.4pt}
\\setlength{\\columnsep}{1.05em}
` : ''}\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\footnotesize\\sffamily ${headLeft}}
\\fancyhead[R]{\\footnotesize\\sffamily Seite~\\thepage}
\\renewcommand{\\headrulewidth}{0.35pt}
\\setlength{\\headheight}{22pt}
\\setlist[enumerate,1]{label=\\textbf{\\arabic*.}, leftmargin=*, itemsep=0.65em, parsep=0.15em, topsep=0.45em, labelsep=0.4em, align=left}
\\begin{document}
\\vspace*{-0.85em}
\\begin{center}
{\\sffamily\\LARGE\\bfseries ${loeTitle}\\par}
\\end{center}
\\vspace{0.4em}
\\thispagestyle{fancy}
${pdfZweispaltig ? `\\begin{multicols}{2}
\\raggedcolumns
` : ''}\\begin{enumerate}
${blocks.join('\n')}
\\end{enumerate}
${pdfZweispaltig ? `\\end{multicols}
` : ''}\\end{document}
`;
}

function buildLatexHttpFailure(
  res: Response,
  buf: Uint8Array
): { ok: false; message: string; log: string } {
  const txt = new TextDecoder().decode(buf);
  const httpKopf = `HTTP ${res.status}\nContent-Type: ${res.headers.get('content-type') || '(nicht gesetzt)'}\n`;
  let message = `PDF-Dienst antwortete mit HTTP ${res.status}.`;
  const logTeile: string[] = [];
  try {
    const j = JSON.parse(txt) as {
      error?: string;
      message?: string;
      log?: string;
      log_files?: Record<string, string>;
    };
    if (j.error) message = String(j.error);
    if (j.message) message = `${message} ${j.message}`;
    if (j.log) logTeile.push(String(j.log));
    if (j.log_files && typeof j.log_files === 'object') {
      for (const [name, inhalt] of Object.entries(j.log_files)) {
        if (typeof inhalt === 'string' && inhalt.length > 0) logTeile.push(`--- ${name} ---\n${inhalt}`);
      }
    }
  } catch {
    logTeile.push(`--- Antwort (kein JSON) ---\n${txt.slice(0, 20000)}`);
  }
  if (logTeile.length === 0 || logTeile.join('').length < 80) {
    logTeile.push(`--- Antwort-Text (Anfang) ---\n${txt.slice(0, 20000)}`);
  }
  const log = `${httpKopf}\n${logTeile.join('\n\n')}`;
  return { ok: false, message, log };
}

async function compileLatexOnHttpPdfAtEndpoint(
  endpoint: string,
  body: string
): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  let lastNetworkMsg: string | undefined;
  for (let attempt = 0; attempt < LATEX_HTTP_MAX_ATTEMPTS; attempt++) {
    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    } catch (e) {
      lastNetworkMsg = e instanceof Error ? e.message : String(e);
      if (attempt < LATEX_HTTP_MAX_ATTEMPTS - 1) {
        await new Promise((r) => setTimeout(r, latexHttpBackoffMs(attempt)));
        continue;
      }
      return { ok: false, message: `Netzwerkfehler beim PDF-Dienst: ${lastNetworkMsg}` };
    }

    const buf = new Uint8Array(await res.arrayBuffer());
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    const istPdfMagic = buf.length >= 4 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46; /* %PDF */
    if (res.ok && (ct.includes('pdf') || istPdfMagic)) {
      return { ok: true, pdf: buf };
    }

    const shouldRetry =
      LATEX_HTTP_RETRY_STATUS.has(res.status) && attempt < LATEX_HTTP_MAX_ATTEMPTS - 1;
    if (shouldRetry) {
      await new Promise((r) => setTimeout(r, latexHttpBackoffMs(attempt)));
      continue;
    }

    return buildLatexHttpFailure(res, buf);
  }

  return {
    ok: false,
    message: 'PDF-Dienst: interner Fehler (bitte Seite neu laden und erneut versuchen).',
    log: lastNetworkMsg,
  };
}

export async function compileLatexOnHttpPdf(opts: {
  texMain: string;
  binFiles: ReadonlyArray<{ path: string; fileBase64: string }>;
  endpoints?: readonly string[];
}): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  const resources: Record<string, unknown>[] = [{ main: true, content: opts.texMain }];
  for (const f of opts.binFiles) {
    resources.push({ path: f.path, file: f.fileBase64 });
  }
  const body = JSON.stringify({ compiler: 'pdflatex', resources });
  const urls = latexHttpEndpointList(opts.endpoints);

  let lastFail: { ok: false; message: string; log?: string } | undefined;
  for (const endpoint of urls) {
    const r = await compileLatexOnHttpPdfAtEndpoint(endpoint, body);
    if (r.ok) return r;
    lastFail = r;
    if (latexCompileFailureIsDocumentOrClientError(r)) return r;
  }
  return lastFail ?? { ok: false, message: 'PDF-Dienst: keine Endpunkt-URL konfiguriert.', log: '' };
}

export async function erzeugeWbSlotArbeitsblattPdf(opts: {
  aufgaben: readonly PracticeAufgabe[];
  meta: BruchAbPdfMeta;
  mitLoesungen: boolean;
  diagramUiScale: (taskIndex: number) => number;
  diagramSvgFuerAufgabe: (a: PracticeAufgabe) => string;
}): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  async function assemble(caps: SvgRasterCaps): Promise<{
    texMain: string;
    binFiles: { path: string; fileBase64: string }[];
  }> {
    const diagramPngPaths: { taskIndex: number; suffix: 'a' | 'l'; path: string }[] = [];
    const binFiles: { path: string; fileBase64: string }[] = [];

    for (let i = 0; i < opts.aufgaben.length; i++) {
      const a = opts.aufgaben[i];
      const sc = opts.diagramUiScale(i);
      const svgA = opts.diagramSvgFuerAufgabe(a);
      if (svgA) {
        const { ext, base64 } = await rasterizeSvgFuerLatexPdf(svgA, sc, caps);
        const path = `d${i}a.${ext}`;
        diagramPngPaths.push({ taskIndex: i, suffix: 'a', path });
        binFiles.push({ path, fileBase64: base64 });
      }
      if (opts.mitLoesungen && a.diagramLoesung && a.diagram && a.diagramLoesung !== a.diagram) {
        const { ext, base64 } = await rasterizeSvgFuerLatexPdf(a.diagramLoesung, sc, caps);
        const path = `d${i}l.${ext}`;
        diagramPngPaths.push({ taskIndex: i, suffix: 'l', path });
        binFiles.push({ path, fileBase64: base64 });
      }
    }

    const texMain = buildBruchArbeitsblattTex({
      aufgaben: opts.aufgaben,
      meta: opts.meta,
      mitLoesungen: opts.mitLoesungen,
      diagramPngPaths,
    });
    return { texMain, binFiles };
  }

  const first = await assemble(BRUCH_AB_RASTER_CAPS_PDF);
  let r = await compileLatexOnHttpPdf(first);
  if (r.ok) return r;

  const hadBinaries = first.binFiles.length > 0;
  if (
    hadBinaries &&
    latexCompileFailureMayBenefitFromSmallerPayload(r) &&
    (BRUCH_AB_RASTER_CAPS_PDF_LIGHT.maxPixelWidth < BRUCH_AB_RASTER_CAPS_PDF.maxPixelWidth ||
      BRUCH_AB_RASTER_CAPS_PDF_LIGHT.jpegQuality < BRUCH_AB_RASTER_CAPS_PDF.jpegQuality)
  ) {
    const second = await assemble(BRUCH_AB_RASTER_CAPS_PDF_LIGHT);
    const r2 = await compileLatexOnHttpPdf(second);
    if (r2.ok) return r2;
    if (
      latexCompileFailureMayBenefitFromSmallerPayload(r2) &&
      (BRUCH_AB_RASTER_CAPS_PDF_MINIMAL.maxPixelWidth < BRUCH_AB_RASTER_CAPS_PDF_LIGHT.maxPixelWidth ||
        BRUCH_AB_RASTER_CAPS_PDF_MINIMAL.jpegQuality < BRUCH_AB_RASTER_CAPS_PDF_LIGHT.jpegQuality)
    ) {
      const third = await assemble(BRUCH_AB_RASTER_CAPS_PDF_MINIMAL);
      const r3 = await compileLatexOnHttpPdf(third);
      if (r3.ok) return r3;
      return r3;
    }
    return r2;
  }

  return r;
}

export async function erzeugeBruchArbeitsblattPdf(opts: {
  aufgaben: readonly PracticeAufgabe[];
  meta: BruchAbPdfMeta;
  mitLoesungen: boolean;
  diagramUiScale: (taskIndex: number) => number;
}): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  return erzeugeWbSlotArbeitsblattPdf({
    ...opts,
    diagramSvgFuerAufgabe: bruchDiagramSvgFuerAufgabe,
  });
}

export async function erzeugeNegativeZahlenArbeitsblattPdf(opts: {
  aufgaben: readonly PracticeAufgabe[];
  meta: BruchAbPdfMeta;
  mitLoesungen: boolean;
  diagramUiScale: (taskIndex: number) => number;
}): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  return erzeugeWbSlotArbeitsblattPdf({
    ...opts,
    diagramSvgFuerAufgabe: standardPracticeDiagramSvgFuerPdf,
  });
}

/** WB Algebra: gleiche Slot-PDF-Pipeline wie Negative Zahlen (Standard-Diagramm → PDF). */
export async function erzeugeAlgebraArbeitsblattPdf(opts: {
  aufgaben: readonly PracticeAufgabe[];
  meta: BruchAbPdfMeta;
  mitLoesungen: boolean;
  diagramUiScale: (taskIndex: number) => number;
}): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  return erzeugeWbSlotArbeitsblattPdf({
    ...opts,
    diagramSvgFuerAufgabe: standardPracticeDiagramSvgFuerPdf,
  });
}

/** WB Dezimalzahlen: rein algebraische Aufgaben, gleiche Slot-PDF-Pipeline wie Algebra/NZ. */
export async function erzeugeDezimalzahlenArbeitsblattPdf(opts: {
  aufgaben: readonly PracticeAufgabe[];
  meta: BruchAbPdfMeta;
  mitLoesungen: boolean;
  diagramUiScale: (taskIndex: number) => number;
}): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  return erzeugeWbSlotArbeitsblattPdf({
    ...opts,
    diagramSvgFuerAufgabe: standardPracticeDiagramSvgFuerPdf,
  });
}

/** WB Lineare Gleichungen: gleiche Slot-PDF-Pipeline wie Algebra/NZ. */
export async function erzeugeLineareGleichungenArbeitsblattPdf(opts: {
  aufgaben: readonly PracticeAufgabe[];
  meta: BruchAbPdfMeta;
  mitLoesungen: boolean;
  diagramUiScale: (taskIndex: number) => number;
}): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  return erzeugeWbSlotArbeitsblattPdf({
    ...opts,
    diagramSvgFuerAufgabe: standardPracticeDiagramSvgFuerPdf,
  });
}

/** WB Prozentrechnung: gleiche Slot-PDF-Pipeline wie Algebra/NZ. */
export async function erzeugeProzentrechnungArbeitsblattPdf(opts: {
  aufgaben: readonly PracticeAufgabe[];
  meta: BruchAbPdfMeta;
  mitLoesungen: boolean;
  diagramUiScale: (taskIndex: number) => number;
}): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  return erzeugeWbSlotArbeitsblattPdf({
    ...opts,
    diagramSvgFuerAufgabe: standardPracticeDiagramSvgFuerPdf,
  });
}

/** WB Graphen: gleiche Slot-PDF-Pipeline wie Algebra/NZ. */
export async function erzeugeGraphenArbeitsblattPdf(opts: {
  aufgaben: readonly PracticeAufgabe[];
  meta: BruchAbPdfMeta;
  mitLoesungen: boolean;
  diagramUiScale: (taskIndex: number) => number;
}): Promise<{ ok: true; pdf: Uint8Array } | { ok: false; message: string; log?: string }> {
  return erzeugeWbSlotArbeitsblattPdf({
    ...opts,
    diagramSvgFuerAufgabe: standardPracticeDiagramSvgFuerPdf,
  });
}


