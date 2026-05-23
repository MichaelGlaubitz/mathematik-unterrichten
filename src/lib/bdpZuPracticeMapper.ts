import type { BdpTask } from './bruchDezimalProzentUmwandlung';
import type { PracticeAbAntwortSlot, PracticeAufgabe } from './uebungPracticeGenerators';

const MU_SKIP =
  'mu-katex-skip inline-flex flex-wrap items-center gap-1.5 text-lg leading-none text-ink-900 dark:text-ink-50';

/** Baut `PracticeAufgabe` für WB/AB aus einer BDP-Aufgabe (ein Antwort-Slot). */
export function bdpTaskZuPracticeAufgabe(t: BdpTask): PracticeAufgabe {
  const left = `$${t.leftTex}$`;
  const eqSlot = `<span class="${MU_SKIP}"><span>=</span>[[MU_AB:0]]</span>`;
  const pct =
    t.showPercentAfter
      ? `<span class="${MU_SKIP}"><span class="font-medium">%</span></span>`
      : '';
  const frageArbeitsblatt = `${left}${eqSlot}${pct}`;

  let abSlots: readonly PracticeAbAntwortSlot[];
  if (t.slot === 'decimal') {
    abSlots = [{ kind: 'decimal', expect: t.expectDec ?? 0 }];
  } else if (t.slot === 'int_percent') {
    abSlots = [{ kind: 'int', expect: t.expectInt ?? 0 }];
  } else {
    abSlots = [
      {
        kind: 'frac',
        expectNum: t.expectNum ?? 0,
        expectDen: t.expectDen ?? 1,
      },
    ];
  }

  return {
    frage: frageArbeitsblatt,
    loesung: t.loesungKurz,
    frageArbeitsblatt,
    abSlots,
    pdfArbeitsblattEinzelspalte: true,
    loesungArbeitsblattEigeneZeile: true,
  };
}
