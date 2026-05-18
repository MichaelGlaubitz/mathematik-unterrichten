import type { PracticeAbAntwortSlot } from './uebungPracticeGenerators';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Trimmt, erlaubt Unicode-Minus, optional tauscht Komma → Punkt (Dezimal entfällt bei ints). */
export function parseIntFlexible(raw: string): number | null {
  const s = raw
    .trim()
    .replace(/\u2212/g, '-')
    .replace(/\s+/g, '')
    .replace(',', '.');
  if (s === '' || s === '-' || s === '+') return null;
  if (!/^[-+]?\d+$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function rationalGleich(
  userNum: number,
  userDen: number,
  expectNum: number,
  expectDen: number
): boolean {
  if (userDen === 0 || expectDen === 0) return false;
  let un = userNum;
  let ud = userDen;
  if (ud < 0) {
    un = -un;
    ud = -ud;
  }
  return un * expectDen === expectNum * ud;
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

/** Nach positivem Nenner: Zähler und Nenner teilerfremd (vollständig gekürzt). */
export function bruchIstVollstaendigGekuerzt(zaehler: number, nenner: number): boolean {
  if (nenner === 0) return false;
  let z = zaehler;
  let n = nenner;
  if (n < 0) {
    z = -z;
    n = -n;
  }
  return gcdPos(z, n) === 1;
}

export function slotIstRichtig(shell: HTMLElement, spec: PracticeAbAntwortSlot): boolean {
  const kind = shell.getAttribute('data-mu-ab-kind');
  if (kind === 'int') {
    if (spec.kind !== 'int') return false;
    const inp = shell.querySelector<HTMLInputElement>('input.mu-ab-int');
    const v = inp ? parseIntFlexible(inp.value) : null;
    if (v === null) return false;
    return v === spec.expect;
  }
  if (kind === 'frac') {
    if (spec.kind !== 'frac') return false;
    const zn = shell.querySelector<HTMLInputElement>('input.mu-ab-z');
    const nn = shell.querySelector<HTMLInputElement>('input.mu-ab-n');
    const z = zn ? parseIntFlexible(zn.value) : null;
    const n = nn ? parseIntFlexible(nn.value) : null;
    if (z === null || n === null) return false;
    if (!rationalGleich(z, n, spec.expectNum, spec.expectDen)) return false;
    if (spec.requireFullyReduced && !bruchIstVollstaendigGekuerzt(z, n)) return false;
    return true;
  }
  if (kind === 'frac_num') {
    if (spec.kind !== 'frac_num') return false;
    const zn = shell.querySelector<HTMLInputElement>('input.mu-ab-z');
    const z = zn ? parseIntFlexible(zn.value) : null;
    if (z === null) return false;
    return z === spec.expectNum;
  }
  if (kind === 'choice') {
    if (spec.kind !== 'choice') return false;
    const sel = shell.querySelector<HTMLInputElement>('input.mu-ab-ch:checked');
    if (!sel) return false;
    return Number(sel.value) === spec.expect;
  }
  return false;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function buildSlotMarkup(taskIdx: number, slotIdx: number, spec: PracticeAbAntwortSlot): string {
  /** Eingaben (int/frac): gesamter Slot von KaTeX ausnehmen. */
  const baseShellMathSkip =
    'mu-katex-skip inline-flex max-w-full flex-col rounded-lg border-2 border-transparent bg-transparent p-1 shadow-none transition-colors';
  /** Choice: äußerer Slot nicht skippen, damit `renderMathInElement` `$…$` in den Label-Texten setzen kann. */
  const baseShellChoice =
    'inline-flex max-w-full flex-col rounded-lg border-2 border-transparent bg-transparent p-1 shadow-none transition-colors';
  if (spec.kind === 'int') {
    const aria = escapeAttr(`Aufgabe ${taskIdx + 1}, Eingabefeld ${slotIdx + 1}`);
    return `<span class="mu-ab-slot-shell ${baseShellMathSkip}" data-mu-ab-kind="int" data-mu-ab-task="${taskIdx}" data-mu-ab-slot="${slotIdx}" role="group"><span class="mu-katex-skip inline-flex items-center"><input type="text" inputmode="numeric" autocomplete="off" aria-label="${aria}" class="mu-ab-int w-[4.5rem] rounded-md border border-ink-300 bg-surface px-1.5 py-0.5 text-center text-sm font-semibold tabular-nums text-ink-900 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-400 dark:border-slate-600 dark:bg-slate-900 dark:text-ink-50 dark:focus:border-accent-300" /></span></span>`;
  }
  if (spec.kind === 'frac') {
    const ariaZ = escapeAttr(`Aufgabe ${taskIdx + 1}, Zähler ${slotIdx + 1}`);
    const ariaN = escapeAttr(`Aufgabe ${taskIdx + 1}, Nenner ${slotIdx + 1}`);
    return `<span class="mu-ab-slot-shell ${baseShellMathSkip}" data-mu-ab-kind="frac" data-mu-ab-task="${taskIdx}" data-mu-ab-slot="${slotIdx}" role="group"><span class="mu-katex-skip inline-flex min-w-[3.25rem] flex-col items-stretch gap-0.5 align-middle"><input type="text" inputmode="numeric" autocomplete="off" aria-label="${ariaZ}" class="mu-ab-z w-full min-w-[3rem] rounded-md border border-ink-300 bg-surface px-1 py-0.5 text-center text-sm font-semibold tabular-nums text-ink-900 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-400 dark:border-slate-600 dark:bg-slate-900 dark:text-ink-50 dark:focus:border-accent-300" /><span class="h-px w-full shrink-0 bg-ink-400 dark:bg-slate-500" aria-hidden="true"></span><input type="text" inputmode="numeric" autocomplete="off" aria-label="${ariaN}" class="mu-ab-n w-full min-w-[3rem] rounded-md border border-ink-300 bg-surface px-1 py-0.5 text-center text-sm font-semibold tabular-nums text-ink-900 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-400 dark:border-slate-600 dark:bg-slate-900 dark:text-ink-50 dark:focus:border-accent-300" /></span></span>`;
  }
  if (spec.kind === 'frac_num') {
    const den = spec.fixedDen;
    const ariaZ = escapeAttr(`Aufgabe ${taskIdx + 1}, Zähler ${slotIdx + 1} (Nenner ${den})`);
    const denText = escapeHtml(String(den));
    return `<span class="mu-ab-slot-shell ${baseShellMathSkip}" data-mu-ab-kind="frac_num" data-mu-ab-task="${taskIdx}" data-mu-ab-slot="${slotIdx}" role="group"><span class="mu-katex-skip inline-flex min-w-[3.25rem] flex-col items-stretch gap-0.5 align-middle"><input type="text" inputmode="numeric" autocomplete="off" aria-label="${ariaZ}" class="mu-ab-z w-full min-w-[3rem] rounded-md border border-ink-300 bg-surface px-1 py-0.5 text-center text-sm font-semibold tabular-nums text-ink-900 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-400 dark:border-slate-600 dark:bg-slate-900 dark:text-ink-50 dark:focus:border-accent-300" /><span class="h-px w-full shrink-0 bg-ink-400 dark:bg-slate-500" aria-hidden="true"></span><span class="mu-ab-n-fixed select-none px-1 py-0.5 text-center text-sm font-semibold tabular-nums text-ink-800 dark:text-ink-100" aria-hidden="true">${denText}</span></span></span>`;
  }
  const name = `mu-ab-t${taskIdx}-s${slotIdx}`;
  const t0 = escapeHtml(spec.labels[0]);
  const t1 = escapeHtml(spec.labels[1]);
  return `<span class="mu-ab-slot-shell ${baseShellChoice}" data-mu-ab-kind="choice" data-mu-ab-task="${taskIdx}" data-mu-ab-slot="${slotIdx}" role="radiogroup" aria-label="Aufgabe ${taskIdx + 1}: Antwort wählen"><span class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center"><label class="flex min-w-0 cursor-pointer items-center gap-2 rounded-md border border-ink-200 bg-surface px-2 py-1.5 text-sm font-medium text-ink-800 hover:bg-ink-50 dark:border-slate-600 dark:bg-slate-900 dark:text-ink-100 dark:hover:bg-slate-800/90"><span class="mu-katex-skip shrink-0"><input type="radio" class="mu-ab-ch" name="${name}" value="0" /></span><span class="min-w-0">${t0}</span></label><label class="flex min-w-0 cursor-pointer items-center gap-2 rounded-md border border-ink-200 bg-surface px-2 py-1.5 text-sm font-medium text-ink-800 hover:bg-ink-50 dark:border-slate-600 dark:bg-slate-900 dark:text-ink-100 dark:hover:bg-slate-800/90"><span class="mu-katex-skip shrink-0"><input type="radio" class="mu-ab-ch" name="${name}" value="1" /></span><span class="min-w-0">${t1}</span></label></span></span>`;
}

const AB_PH = /\[\[MU_AB:(\d+)\]\]/g;

/**
 * Liefert die inneren HTML-Fragmente aller Elemente mit `class` … `mu-katex-skip` …
 * (nur gleichnamige Verschachtelung von `span` bzw. `div` wird gezählt).
 * Für Audits: In diesen Bereichen rendert KaTeX kein `$…$` — dort darf kein `$` vorkommen.
 */
export function muKatexSkipInhaltFragmente(html: string): string[] {
  const fragments: string[] = [];
  const re = /<(\w+)\s+[^>]*\bclass="[^"]*\bmu-katex-skip\b[^"]*"[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    const openEnd = m.index + m[0].length;
    const contentStart = openEnd;
    let depth = 1;
    let i = openEnd;
    const closeSeq = `</${tag}>`;
    while (i < html.length && depth > 0) {
      if (html[i] !== '<') {
        i++;
        continue;
      }
      if (html.slice(i, i + closeSeq.length).toLowerCase() === closeSeq) {
        depth--;
        if (depth === 0) {
          fragments.push(html.slice(contentStart, i));
          re.lastIndex = i + closeSeq.length;
          break;
        }
        i += closeSeq.length;
        continue;
      }
      const openPrefix = `<${tag}`;
      if (
        html.slice(i, i + openPrefix.length).toLowerCase() === openPrefix &&
        html[i + openPrefix.length] !== '/'
      ) {
        const after = i + openPrefix.length;
        const c = html[after];
        if (c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '>') {
          depth++;
        }
      }
      i++;
    }
  }
  return fragments;
}

export function replaceBruchAbFragePlaceholders(
  template: string,
  taskIdx: number,
  slots: readonly PracticeAbAntwortSlot[]
): string {
  return template.replace(AB_PH, (_, g) => {
    const i = Number(g);
    const spec = slots[i];
    return spec ? buildSlotMarkup(taskIdx, i, spec) : '';
  });
}

export function zaehleAbPlatzhalter(template: string): number {
  let m = 0;
  let max = -1;
  const re = /\[\[MU_AB:(\d+)\]\]/g;
  let x;
  while ((x = re.exec(template)) !== null) {
    m++;
    max = Math.max(max, Number(x[1]));
  }
  return m > 0 ? max + 1 : 0;
}

export function bruchAbMotivation(richtig: number, gesamt: number): string {
  if (gesamt <= 0) return 'Erzeuge zuerst Aufgaben.';
  const p = richtig / gesamt;
  if (p >= 1) return 'Alles richtig — starke Leistung!';
  if (p >= 0.9) return 'Sehr stark — fast alles gesichert.';
  if (p >= 0.75) return 'Richtig gut — so bleibst du im Flow.';
  if (p >= 0.5) return 'Solider Stand — die nächsten Punkte kommen.';
  if (p >= 0.25) return 'Dranbleiben — jede Übung zählt.';
  return 'Übung macht’s — beim nächsten Durchgang klappt’s besser.';
}

export type BruchAbCheckStat = { richtig: number; gesamt: number };

/** Wendet Rückmeldungsklassen auf alle `.mu-ab-slot-shell` in `liste` an (erwartete Specs pro Aufgabe). */
export function wendeBruchAbCheckAufListeAn(
  liste: HTMLElement,
  aufgaben: ReadonlyArray<{ abSlots?: readonly PracticeAbAntwortSlot[] }>
): BruchAbCheckStat {
  let richtig = 0;
  let gesamt = 0;
  const items = liste.querySelectorAll<HTMLLIElement>('li');
  items.forEach((li, taskIdx) => {
    const specs = aufgaben[taskIdx]?.abSlots;
    if (!specs?.length) return;
    li.querySelectorAll<HTMLElement>('.mu-ab-slot-shell').forEach((shell) => {
      const si = Number(shell.getAttribute('data-mu-ab-slot'));
      const spec = specs[si];
      if (!spec) return;
      gesamt++;
      const ok = slotIstRichtig(shell, spec);
      if (ok) richtig++;
      shell.classList.toggle('mu-ab-slot-shell--richtig', ok);
      shell.classList.toggle('mu-ab-slot-shell--falsch', !ok);
    });
  });
  return { richtig, gesamt };
}

export function setzeBruchAbCheckStylesZurueck(liste: HTMLElement): void {
  liste.querySelectorAll('.mu-ab-slot-shell').forEach((el) => {
    el.classList.remove('mu-ab-slot-shell--richtig', 'mu-ab-slot-shell--falsch');
  });
}
