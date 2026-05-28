import { describe, it, expect } from 'vitest';
import { FUN_GRAPH_AXIS_RANGE_MAX } from './functionGraphStyle';
import {
  ALGEBRA_GENERATOR_IDS,
  BRUCHRECHNUNG_GENERATOR_IDS,
  PROZENTRECHNUNG_GENERATOR_IDS,
  createPracticeGenerators,
  funGraphLinearAxisInterceptsInRange,
  FUN_GRAPH_AXIS_INTERCEPT_MAX,
  practiceAufgabeHatLoesungInlineNachFrage,
  practiceAufgabeUnterdruecktBruchPdfAufgabenDiagramm,
  PRACTICE_GENERATOR_IDS,
  parseErkennenSeiten,
  type PracticeAufgabe,
  validateErkennenAufgabe,
} from './uebungPracticeGenerators';
import {
  muKatexSkipInhaltFragmente,
  replaceBruchAbFragePlaceholders,
  zaehleAbPlatzhalter,
} from './practiceArbeitsblattAntwort';

/** Deterministischer PRNG für reproduzierbare Tests (32-Bit LCG). */
function makeLcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

describe('funGraphLinearAxisInterceptsInRange', () => {
  it('stimmt mit FUN_GRAPH_AXIS_RANGE_MAX (Tick-Grenzen in den SVGs) überein', () => {
    expect(FUN_GRAPH_AXIS_INTERCEPT_MAX).toBe(FUN_GRAPH_AXIS_RANGE_MAX);
  });

  it('akzeptiert typische Geraden mit Achsenschnitten in [-8, 8]', () => {
    expect(funGraphLinearAxisInterceptsInRange(2, 8)).toBe(true);
    expect(funGraphLinearAxisInterceptsInRange(-1, 0)).toBe(true);
    expect(funGraphLinearAxisInterceptsInRange(0, 7)).toBe(true);
    expect(funGraphLinearAxisInterceptsInRange(1, 8)).toBe(true);
  });

  it('lehnt y-Achsenabschnitte außerhalb von [-8, 8] ab', () => {
    expect(funGraphLinearAxisInterceptsInRange(1, 9)).toBe(false);
    expect(funGraphLinearAxisInterceptsInRange(2, -17)).toBe(false);
  });

  it('lehnt x-Achsenabschnitte außerhalb von [-8, 8] ab (bei kleinem |m|)', () => {
    expect(funGraphLinearAxisInterceptsInRange(0.5, 5)).toBe(false);
  });
});

describe('validateErkennenAufgabe / parseErkennenSeiten', () => {
  it('parst die Standard-Frage (Tripel 9-40-41)', () => {
    expect(
      parseErkennenSeiten('Ein Dreieck hat die Seiten $a=9$, $b=40$, $c=41$. Ist es rechtwinklig?')
    ).toEqual({ a: 9, b: 40, c: 41 });
  });

  it('akzeptiert konsistente „Ja“-Lösung', () => {
    expect(() =>
      validateErkennenAufgabe({
        frage: 'Ein Dreieck hat die Seiten $a=9$, $b=40$, $c=41$. Ist es rechtwinklig?',
        loesung: 'Ja. $9^2+40^2=1681=1681=41^2$.',
      })
    ).not.toThrow();
  });

  it('akzeptiert konsistente „Nein“-Lösung', () => {
    expect(() =>
      validateErkennenAufgabe({
        frage: 'Ein Dreieck hat die Seiten $a=9$, $b=40$, $c=42$. Ist es rechtwinklig?',
        loesung: 'Nein. …',
      })
    ).not.toThrow();
  });

  it('wirft bei Widerspruch (rechtwinklig, aber „Nein“)', () => {
    expect(() =>
      validateErkennenAufgabe({
        frage: 'Ein Dreieck hat die Seiten $a=9$, $b=40$, $c=41$. Ist es rechtwinklig?',
        loesung: 'Nein. $9^2+40^2=1681$, aber $c^2=1681$.',
      })
    ).toThrow(/rechtwinklig.*„Nein/);
  });
});

describe('Generator erkennen()', () => {
  it('5000 Zufallsiterationen: Lösung passt immer zur Geometrie', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (let i = 0; i < 5000; i++) {
      validateErkennenAufgabe(GEN.erkennen());
    }
  });

  it('2000 Iterationen mit deterministischem PRNG', () => {
    const GEN = createPracticeGenerators(makeLcg(0x9fab_4041));
    for (let i = 0; i < 2000; i++) {
      validateErkennenAufgabe(GEN.erkennen());
    }
  });
});

describe('Generator seiten_hyp()', () => {
  it('nennt in der Aufgabenstellung nur zwei Seiten; Lösung ist die Hypotenuse', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (let i = 0; i < 400; i++) {
      const auf = GEN.seiten_hyp();
      const nums = [...auf.frage.matchAll(/\$([0-9]+)\$/g)].map((m) => Number(m[1]));
      expect(nums.length, auf.frage).toBe(2);
      const lo = auf.loesung.match(/^\$([0-9]+)\$/);
      expect(lo, auf.loesung).toBeTruthy();
      const hyp = Number(lo![1]);
      expect(nums[0] * nums[0] + nums[1] * nums[1]).toBe(hyp * hyp);
      expect(Math.max(nums[0], nums[1])).toBeLessThan(hyp);
    }
  });
});

describe('Generator hypotenuse()', () => {
  it('liefert c mit a²+b²=c² für die angegebenen Katheten', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (let i = 0; i < 400; i++) {
      const auf = GEN.hypotenuse();
      const mk = auf.frage.match(/\$a=(\d+)\$ und \$b=(\d+)\$/);
      expect(mk, auf.frage).toBeTruthy();
      const a = Number(mk![1]);
      const b = Number(mk![2]);
      const parts = [...auf.loesung.matchAll(/=(\d+)\$/g)];
      expect(parts.length, auf.loesung).toBeGreaterThan(0);
      const c = Number(parts[parts.length - 1]![1]);
      expect(a * a + b * b).toBe(c * c);
      expect(auf.diagram).toBeDefined();
      expect(auf.diagram).toContain('<svg');
    }
  });
});

describe('Bruchrechnung-Generatoren', () => {
  it('alle BRUCHRECHNUNG_GENERATOR_IDS liefern Frage und Lösung', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (const id of BRUCHRECHNUNG_GENERATOR_IDS) {
      const a = GEN[id]();
      expect(a.frage.length, id).toBeGreaterThan(5);
      expect(a.loesung.length, id).toBeGreaterThan(5);
    }
  });

  it('Bruch-AB: frageArbeitsblatt-Platzhalter passen zu abSlots', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (const id of BRUCHRECHNUNG_GENERATOR_IDS) {
      const a = GEN[id]();
      expect(a.frageArbeitsblatt, id).toBeDefined();
      expect(a.abSlots?.length, id).toBeGreaterThan(0);
      expect(zaehleAbPlatzhalter(a.frageArbeitsblatt!), id).toBe(a.abSlots!.length);
    }
  });

  it('Bruch-Lösungen: gerade Anzahl $ (KaTeX → PDF-LaTeX, keine Einzel-$)', () => {
    for (const id of BRUCHRECHNUNG_GENERATOR_IDS) {
      for (let seed = 0; seed < 80; seed++) {
        const g = createPracticeGenerators(makeLcg(seed * 9973 + id.length * 31 + id.charCodeAt(0)));
        const a = g[id]();
        const n = (a.loesung.match(/\$/g) ?? []).length;
        expect(n % 2, `${id} @seed ${seed}`).toBe(0);
      }
    }
  });

  it('br_add_unlike / br_sub_unlike: Lösung in Box (nicht inline)', () => {
    const GEN = createPracticeGenerators(() => 0.31);
    const u = GEN.br_add_unlike();
    const v = GEN.br_sub_unlike();
    expect(u.loesungInlineNachFrage).toBe(false);
    expect(v.loesungInlineNachFrage).toBe(false);
    expect(practiceAufgabeHatLoesungInlineNachFrage(u)).toBe(false);
    expect(practiceAufgabeHatLoesungInlineNachFrage(v)).toBe(false);
  });

  it('practiceAufgabeHatLoesungInlineNachFrage: gleichnamige „Berechne …“-Brüche inline, ungleichnamig nicht', () => {
    expect(
      practiceAufgabeHatLoesungInlineNachFrage({
        frage: 'Berechne $\\tfrac{1}{4}+\\frac{3}{4}$.',
        loesung: 'x',
      })
    ).toBe(true);
    expect(
      practiceAufgabeHatLoesungInlineNachFrage({
        frage: 'Berechne $\\tfrac{1}{3}+\\frac{2}{5}$.',
        loesung: 'x',
      })
    ).toBe(false);
  });

  it('liefern getrennte Skizzen für Aufgabe (ohne Lösungsschattierung) und Lösung', () => {
    const GEN = createPracticeGenerators(() => 0.42);
    const mul = GEN.br_mul_frac();
    expect(mul.diagram).toBeDefined();
    expect(mul.diagramLoesung).toBeDefined();
    expect(mul.diagramDefaultHidden).toBe(true);
    expect(mul.diagram).not.toContain("fill-opacity='0.34'");
    expect(mul.diagramLoesung).toContain("fill-opacity='0.34'");
  });

  it('Bruchaddition: Aufgaben-Skizze zeigt Anteile schattiert', () => {
    const GEN = createPracticeGenerators(() => 0.42);
    const add = GEN.br_add_like();
    expect(add.diagram).toBeDefined();
    expect(add.diagram).toContain("fill-opacity='0.32'");
    expect(add.diagramLoesung).toBeDefined();
    expect(add.diagramLoesung).not.toBe(add.diagram);
    expect(add.diagramLoesung).toContain('=');
    expect(add.diagram).toContain('①');
    expect(add.diagramLoesung).not.toContain('①');
  });

  it('br_add_like / br_sub_like: schlichte Aufgabenzeile, bei Lösung eine durchgängige Gleichungszeile', () => {
    const GEN = createPracticeGenerators(() => 0.42);
    const add = GEN.br_add_like();
    const sub = GEN.br_sub_like();
    expect(add.loesungInlineNachFrage).toBe(true);
    expect(sub.loesungInlineNachFrage).toBe(true);
    expect(practiceAufgabeHatLoesungInlineNachFrage(add)).toBe(true);
    expect(practiceAufgabeHatLoesungInlineNachFrage(sub)).toBe(true);
    expect(add.frage).not.toContain('Berechne');
    expect(sub.frage).not.toContain('Berechne');
    expect(add.frageMitLoesungHighlight).toBe(add.loesung);
    expect(sub.frageMitLoesungHighlight).toBe(sub.loesung);
    expect(add.frageMitLoesungHighlight).toMatch(/\\t?frac\{[0-9]+\}\{[0-9]+\}\+\\frac\{[0-9]+\}\{[0-9]+\}=/);
    expect(sub.frageMitLoesungHighlight).toMatch(/\\t?frac\{[0-9]+\}\{[0-9]+\}-\\frac\{[0-9]+\}\{[0-9]+\}=/);
  });

  it('practiceAufgabeHatLoesungInlineNachFrage: erkennt gleichnamige Brüche auch ohne Flag (alte Routen)', () => {
    expect(
      practiceAufgabeHatLoesungInlineNachFrage({
        frage: 'Berechne $\\tfrac{1}{6}+\\frac{3}{6}$.',
        loesung: 'x',
      })
    ).toBe(true);
    expect(
      practiceAufgabeHatLoesungInlineNachFrage({
        frage: 'Berechne $\\tfrac{5}{6}-\\frac{1}{6}$.',
        loesung: 'x',
      })
    ).toBe(true);
    expect(
      practiceAufgabeHatLoesungInlineNachFrage({
        frage: 'Berechne $\\tfrac{1}{2}\\cdot\\frac{1}{3}$.',
        loesung: 'x',
      })
    ).toBe(false);
  });

  it('practiceAufgabeUnterdruecktBruchPdfAufgabenDiagramm: Flag oder Größenvergleich-Fragetext', () => {
    expect(
      practiceAufgabeUnterdruecktBruchPdfAufgabenDiagramm({
        frage: 'Sonstige Frage',
        loesung: 'x',
      })
    ).toBe(false);
    expect(
      practiceAufgabeUnterdruecktBruchPdfAufgabenDiagramm({
        frage: 'Welcher Bruch ist größer: $\\tfrac{2}{3}$ oder $\\tfrac{3}{4}$?',
        loesung: 'x',
      })
    ).toBe(true);
    expect(
      practiceAufgabeUnterdruecktBruchPdfAufgabenDiagramm({
        frage: 'x',
        loesung: 'y',
        diagramPdfAufgabeUnterdruecken: true,
      })
    ).toBe(true);
  });

  it('br_kuerzen: Diagramme ohne Bruch-Beschriftung in der Grafik', () => {
    const GEN = createPracticeGenerators(() => 0.55);
    const auf = GEN.br_kuerzen();
    expect(auf.diagram).toBeDefined();
    expect(auf.diagramLoesung).toBeDefined();
    expect(auf.diagram).not.toContain('<text');
    expect(auf.diagramLoesung).not.toContain('<text');
  });

  it('br_vergleich: grüne Hervorhebung nur in frageMitLoesungHighlight, neutrale frage und Lösung ohne grün', () => {
    const GEN = createPracticeGenerators(() => 0.55);
    const v = GEN.br_vergleich();
    expect(v.diagramDefaultHidden).toBe(true);
    expect(v.diagramPdfAufgabeUnterdruecken).toBe(true);
    expect(v.frage).not.toContain('bg-green-50');
    expect(v.frageMitLoesungHighlight).toBeDefined();
    expect(v.frageMitLoesungHighlight).toContain('bg-green-50');
    expect(v.loesung).not.toContain('bg-green-50');
    expect(v.loesung).not.toContain('border-green-600');
  });

  it('br_erweitern: Diagramme ohne Bruch-Beschriftung in der Grafik', () => {
    const GEN = createPracticeGenerators(() => 0.1);
    const auf = GEN.br_erweitern();
    expect(auf.diagram).toBeDefined();
    expect(auf.diagramLoesung).toBeDefined();
    expect(auf.diagram).not.toContain('→');
    expect(auf.diagramLoesung).not.toContain('→');
    expect(auf.diagram).not.toContain('<text');
    expect(auf.diagramLoesung).not.toContain('<text');
    expect(auf.diagram).toContain('<line');
    expect((auf.diagram.match(/<line/g) || []).length).toBeLessThan(
      (auf.diagramLoesung.match(/<line/g) || []).length
    );
  });
});

describe('nz_add / nz_sub (Negative Zahlen): Lösung ersetzt Aufgabenkern', () => {
  it('nz_add: frageMitLoesungHighlight ist reine Gleichung wie im Aufgabenteil', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (let k = 0; k < 30; k++) {
      const t = GEN.nz_add();
      expect(t.frageMitLoesungHighlight).toBe(t.loesung);
      expect(t.loesung).not.toContain('Berechne');
      expect(t.frage).toMatch(/^Berechne die Summe /);
    }
  });

  it('nz_sub: gleiche Gleichungszeile für alle Operanden, kein „z.B.“', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (let k = 0; k < 30; k++) {
      const t = GEN.nz_sub();
      expect(t.frageMitLoesungHighlight).toBe(t.loesung);
      expect(t.loesung).not.toMatch(/z\./);
      expect(t.loesung).not.toContain('Berechne');
      expect(t.frage).toMatch(/^Berechne die Differenz /);
    }
  });

  it('nz_sub: bei klammeriertem Subtrahenden stimmt Highlight mit Aufgabe überein', () => {
    let hit = null;
    for (let seed = 0; seed < 30000 && !hit; seed++) {
      const t = createPracticeGenerators(makeLcg(seed)).nz_sub();
      if (t.frage.includes('(-')) hit = t;
    }
    expect(hit).not.toBeNull();
    expect(hit!.frageMitLoesungHighlight).toBe(hit!.loesung);
    expect(hit!.diagramDefaultScale).toBe(2);
    expect(hit!.diagram).not.toContain('Start');
    expect(hit!.diagramLoesung).toContain('Start');
  });
});

describe('Algebra Grundbegriffe (alg_gb_*)', () => {
  it('liefert gültige Arbeitsblatt-Slots und passende Längen', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (const id of ['alg_gb_term', 'alg_gb_koeff', 'alg_gb_variable', 'alg_gb_konstante', 'alg_gb_konvention'] as const) {
      for (let k = 0; k < 40; k++) {
        const a = GEN[id]();
        expect(a.frage.length).toBeGreaterThan(15);
        expect(a.loesung.length).toBeGreaterThan(8);
        expect(a.frageArbeitsblatt).toBeDefined();
        expect(a.abSlots?.length).toBeGreaterThan(0);
        expect(zaehleAbPlatzhalter(a.frageArbeitsblatt!), id).toBe(a.abSlots!.length);
      }
    }
  });

  it('alg_gb_variable: Sachsatz mit choice und konsistenter Lösung', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (let k = 0; k < 60; k++) {
      const t = GEN.alg_gb_variable();
      expect(t.frage).toMatch(/Wofür steht der Buchstabe \$[a-z]\$ im Satz/);
      expect(t.abSlots?.[0]?.kind).toBe('choice');
      expect(t.loesung).toMatch(/^\$/);
      const slot = t.abSlots![0];
      if (slot.kind === 'choice') {
        expect(slot.labels[0].length).toBeGreaterThan(6);
        expect(slot.labels[1].length).toBeGreaterThan(6);
      }
    }
  });

  it('alg_gb_variable: fester Seed liefert Korb-Äpfel-Kontext', () => {
    let found: PracticeAufgabe | null = null;
    for (let seed = 0; seed < 120000 && !found; seed++) {
      const t = createPracticeGenerators(makeLcg(seed)).alg_gb_variable();
      if (t.frage.includes('Im Korb liegen')) found = t;
    }
    expect(found).not.toBeNull();
    const slot = found!.abSlots![0];
    expect(slot.kind).toBe('choice');
    if (slot.kind === 'choice') {
      const joined = `${slot.labels[0]} ${slot.labels[1]}`;
      expect(joined).toMatch(/Anzahl|Äpfel/);
    }
    expect(found!.loesung.toLowerCase()).toMatch(/anzahl|äpfel|korb/);
  });

  it('alg_gb_term: Term-vs.-Gleichung-Choice mit TeX ($…$) in den Pills', () => {
    const GEN = createPracticeGenerators(Math.random);
    let choiceSeen = false;
    for (let k = 0; k < 500; k++) {
      const t = GEN.alg_gb_term();
      const s = t.abSlots?.[0];
      if (s?.kind === 'choice') {
        choiceSeen = true;
        expect(s.labels[0]).toMatch(/\$/);
        expect(s.labels[1]).toMatch(/\$/);
        expect(`${s.labels[0]} ${s.labels[1]}`).toMatch(/ohne =|mit =/);
        expect(s.expect === 0 || s.expect === 1).toBe(true);
      }
    }
    expect(choiceSeen).toBe(true);
  });

  it('alg_gb_konvention: Choice-Labels mit TeX ($…$)', () => {
    const GEN = createPracticeGenerators(Math.random);
    let ganz = false;
    let neg = false;
    let bruch = false;
    for (let k = 0; k < 500; k++) {
      const t = GEN.alg_gb_konvention();
      const slot = t.abSlots![0];
      expect(slot.kind).toBe('choice');
      if (slot.kind === 'choice') {
        expect(slot.labels[0]).toMatch(/\$/);
        expect(slot.labels[1]).toMatch(/\$/);
        expect(slot.expect === 0 || slot.expect === 1).toBe(true);
      }
      if (t.frage.includes('\\tfrac{')) bruch = true;
      else if (t.frage.includes('\\cdot(')) neg = true;
      else if (/\\mathrm\{[a-z]\d+\}/.test(t.frage)) ganz = true;
    }
    expect(ganz).toBe(true);
    expect(neg).toBe(true);
    expect(bruch).toBe(true);
  });

  it('alg_gb_term: Drei-Summanden-Aufgabe hat Lösung mit „drei“', () => {
    let found = false;
    for (let seed = 0; seed < 800 && !found; seed++) {
      const GEN = createPracticeGenerators(makeLcg(seed));
      const t = GEN.alg_gb_term();
      if (t.abSlots?.[0]?.kind === 'int' && t.abSlots[0].expect === 3) {
        expect(t.loesung.toLowerCase()).toContain('drei');
        found = true;
      }
    }
    expect(found).toBe(true);
  });
});

describe('alg_distributiv_zahl (Algebra)', () => {
  it('liefert nur diagramLoesung, kein Aufgaben-Diagramm', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (let k = 0; k < 20; k++) {
      const t = GEN.alg_distributiv_zahl();
      expect(t.diagram).toBeUndefined();
      expect(t.diagramLoesung).toBeDefined();
      expect(t.diagramLoesung).toContain('<svg');
      expect(t.diagramDefaultHidden).toBe(true);
    }
  });
});

describe('Algebra-Generatoren (WB-Slot-Arbeitsblatt)', () => {
  it('Algebra-AB: frageArbeitsblatt-Platzhalter passen zu abSlots', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (const id of ALGEBRA_GENERATOR_IDS) {
      const a = GEN[id]();
      expect(a.frageArbeitsblatt, id).toBeDefined();
      expect(a.abSlots?.length, id).toBeGreaterThan(0);
      expect(zaehleAbPlatzhalter(a.frageArbeitsblatt!), id).toBe(a.abSlots!.length);
    }
  });
});

describe('WB-Slot-Arbeitsblatt: mu-katex-skip ohne Roh-$ (KaTeX)', () => {
  it('nach Platzhalter-Ersetzung enthält kein mu-katex-skip-Innenbereich einzelnes $', () => {
    for (const id of PRACTICE_GENERATOR_IDS) {
      for (let seed = 0; seed < 40; seed++) {
        const GEN = createPracticeGenerators(makeLcg(seed + id.length * 9973));
        const a = GEN[id]();
        if (!a.frageArbeitsblatt || !a.abSlots?.length) continue;
        const html = replaceBruchAbFragePlaceholders(a.frageArbeitsblatt, 0, a.abSlots);
        for (const inner of muKatexSkipInhaltFragmente(html)) {
          expect(inner, `${id} seed=${seed}`).not.toContain('$');
        }
      }
    }
  });
});

describe('nz_div (Negative Zahlen)', () => {
  it('Lösung nennt eine Vorzeichenregel zur Division', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (let k = 0; k < 25; k++) {
      const t = GEN.nz_div();
      expect(t.loesung).toMatch(/Plus durch plus|Minus durch plus|Plus durch minus|Minus durch minus/);
    }
  });
});

describe('alle PRACTICE_GENERATOR_IDS', () => {
  it('liefern nicht-leere Frage und Lösung', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (const id of PRACTICE_GENERATOR_IDS) {
      for (let k = 0; k < 20; k++) {
        const auf = GEN[id]();
        expect(auf.frage.length, id).toBeGreaterThan(15);
        expect(auf.loesung.length, id).toBeGreaterThan(4);
      }
    }
  });
});

describe('Algebra Faktorisieren (10 neue Generatoren)', () => {
  const GEN = createPracticeGenerators(Math.random);

  it('alg_factor_pairs: erzeugt korrekte Faktorpaare mit p <= q', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_pairs();
      const p = auf.abSlots![0].expect as number;
      const q = auf.abSlots![1].expect as number;
      expect(p).toBeLessThanOrEqual(q);
      expect(p).not.toBe(0);
      expect(q).not.toBe(0);
      expect(auf.frage).toContain(`p \\cdot q = ${p * q}`);
      expect(auf.frage).toContain(`p + q = ${p + q}`);
    }
  });

  it('alg_factor_monic_pos: faktorisiert x^2 + bx + c = (x+p)(x+q) mit p,q > 0 und p <= q', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_monic_pos();
      const p = auf.abSlots![0].expect as number;
      const q = auf.abSlots![1].expect as number;
      expect(p).toBeGreaterThan(0);
      expect(q).toBeGreaterThanOrEqual(p);
      expect(auf.frage).toContain(`x^2+${p + q}x+${p * q}`);
    }
  });

  it('alg_factor_monic_neg: faktorisiert x^2 + bx + c = (x+p)(x+q) mit p <= q, nicht beide positiv', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_monic_neg();
      const p = auf.abSlots![0].expect as number;
      const q = auf.abSlots![1].expect as number;
      expect(p).toBeLessThanOrEqual(q);
      expect(p).not.toBe(0);
      expect(q).not.toBe(0);
      expect(p > 0 && q > 0).toBe(false);
    }
  });

  it('alg_factor_monic_perfect: faktorisiert x^2 +- 2px + p^2 = (x+m)^2', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_monic_perfect();
      const m = auf.abSlots![0].expect as number;
      expect(m).not.toBe(0);
      expect(Math.abs(m)).toBeGreaterThanOrEqual(2);
      expect(Math.abs(m)).toBeLessThanOrEqual(10);
    }
  });

  it('alg_factor_non_monic_pos: faktorisiert ax^2 + bx + c = (dx+p)(ex+q) mit d <= e, alle positiv', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_non_monic_pos();
      const d = auf.abSlots![0].expect as number;
      const p = auf.abSlots![1].expect as number;
      const e = auf.abSlots![2].expect as number;
      const q = auf.abSlots![3].expect as number;
      expect(d).toBeGreaterThanOrEqual(2);
      expect(e).toBeGreaterThanOrEqual(d);
      expect(p).toBeGreaterThan(0);
      expect(q).toBeGreaterThan(0);
      if (d === e) {
        expect(p).toBeLessThanOrEqual(q);
      }
    }
  });

  it('alg_factor_non_monic_neg: faktorisiert ax^2 + bx + c = (dx+p)(ex+q) mit d <= e, negative Summanden', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_non_monic_neg();
      const d = auf.abSlots![0].expect as number;
      const p = auf.abSlots![1].expect as number;
      const e = auf.abSlots![2].expect as number;
      const q = auf.abSlots![3].expect as number;
      expect(d).toBeGreaterThanOrEqual(2);
      expect(e).toBeGreaterThanOrEqual(d);
      expect(p).not.toBe(0);
      expect(q).not.toBe(0);
      expect(p > 0 && q > 0).toBe(false);
      if (d === e) {
        expect(p).toBeLessThanOrEqual(q);
      }
    }
  });

  it('alg_factor_non_monic_perfect: faktorisiert a^2x^2 +- 2abx + b^2 = (ax + m)^2', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_non_monic_perfect();
      const a = auf.abSlots![0].expect as number;
      const m = auf.abSlots![1].expect as number;
      expect(a).toBeGreaterThanOrEqual(2);
      expect(m).not.toBe(0);
    }
  });

  it('alg_factor_diff_basic: faktorisiert x^2 - a^2 = (x - p)(x + q)', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_diff_basic();
      const p = auf.abSlots![0].expect as number;
      const q = auf.abSlots![1].expect as number;
      expect(p).toBeGreaterThanOrEqual(2);
      expect(q).toBe(p);
    }
  });

  it('alg_factor_diff_advanced: faktorisiert a^2x^2 - b^2y^2 = (px - qy)(rx + sy)', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_diff_advanced();
      const p = auf.abSlots![0].expect as number;
      const q = auf.abSlots![1].expect as number;
      const r = auf.abSlots![2].expect as number;
      const s = auf.abSlots![3].expect as number;
      expect(p).toBeGreaterThanOrEqual(2);
      expect(r).toBe(p);
      expect(q).toBeGreaterThanOrEqual(1);
      expect(s).toBe(q);
    }
  });

  it('alg_factor_neg_leading: faktorisiert kx^2 + bx + c = k(x + c1)(x + c2) mit k < 0 und c1 <= c2', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_neg_leading();
      const k = auf.abSlots![0].expect as number;
      const c1 = auf.abSlots![1].expect as number;
      const c2 = auf.abSlots![2].expect as number;
      expect(k).toBeLessThan(0);
      expect(c1).toBeLessThanOrEqual(c2);
      expect(auf.frage).toContain('x^2');
    }
  });

  it('alg_factor_grouping: faktorisiert xy + ay + bx + ab = (x + b)(y + a)', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_grouping();
      const b = auf.abSlots![0].expect as number;
      const a = auf.abSlots![1].expect as number;
      expect(a).not.toBe(0);
      expect(b).not.toBe(0);
      expect(auf.frage).toContain('xy');
    }
  });

  it('alg_factor_two_variables: faktorisiert x^2 + bxy + cy^2 = (x + py)(x + qy) mit p <= q', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_two_variables();
      const p = auf.abSlots![0].expect as number;
      const q = auf.abSlots![1].expect as number;
      expect(p).toBeLessThanOrEqual(q);
      expect(auf.frage).toContain('y^2');
    }
  });

  it('alg_factor_repeated_squares: faktorisiert x^4 - a^4 = (x - a)(x + a)(x^2 + a^2)', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_repeated_squares();
      const a1 = auf.abSlots![0].expect as number;
      const a2 = auf.abSlots![1].expect as number;
      const aSq = auf.abSlots![2].expect as number;
      expect(a1).toBeGreaterThanOrEqual(2);
      expect(a2).toBe(a1);
      expect(aSq).toBe(a1 * a1);
      expect(auf.frage).toContain('x^4');
    }
  });

  it('alg_factor_diff_binoms: faktorisiert (x + a)^2 - b^2 = (x + c1)(x + c2) mit c1 < c2', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_diff_binoms();
      const c1 = auf.abSlots![0].expect as number;
      const c2 = auf.abSlots![1].expect as number;
      expect(c1).toBeLessThan(c2);
      expect(auf.frage).toContain(')^2');
    }
  });

  it('alg_factor_capstone: liefert gueltige Aufgaben', () => {
    for (let i = 0; i < 200; i++) {
      const auf = GEN.alg_factor_capstone();
      expect(auf.frage.length).toBeGreaterThan(15);
      expect(auf.loesung.length).toBeGreaterThan(5);
    }
  });

  const newAlgGeneratorIds = [
    'alg_concept_type',
    'alg_lang_one_op',
    'alg_lang_multi_op',
    'alg_lang_indices',
    'alg_subst_pos_simple',
    'alg_subst_pos_pow',
    'alg_subst_pos_mv',
    'alg_subst_neg_simple',
    'alg_subst_neg_pow',
    'alg_subst_decimal_simple',
    'alg_subst_decimal_pow',
    'alg_subst_fraction_simple',
    'alg_subst_fraction_pow',
    'alg_terms_like_recognize',
    'alg_terms_mult_pow',
    'alg_terms_div_simple',
    'alg_terms_div_pow',
    'alg_terms_raise_pow',
    'alg_terms_simplify_multi',
    'alg_terms_equiv_recognize',
    'alg_frac_def_domain',
    'alg_frac_simplify_none',
    'alg_frac_simplify_linear',
    'alg_frac_simplify_monic',
    'alg_frac_simplify_non_monic',
    'alg_frac_mul_none',
    'alg_frac_mul_linear',
    'alg_frac_mul_monic',
    'alg_frac_mul_non_monic',
    'alg_frac_div_none',
    'alg_frac_div_linear',
    'alg_frac_div_monic',
    'alg_frac_div_non_monic',
    'alg_frac_add_int',
    'alg_frac_add_simple',
    'alg_frac_add_linear',
    'alg_frac_add_fact',
    'alg_frac_sub_int',
    'alg_frac_sub_simple',
    'alg_frac_sub_linear',
    'alg_frac_sub_fact',
    'alg_frac_four_ops_mix',
    'alg_expand_einfach_capstone',
    'alg_expand_binom_double_pos',
    'alg_expand_binom_double_neg',
    'alg_expand_binom_perfect',
    'alg_expand_binom_non_monic',
    'alg_expand_binom_non_monic_neg',
    'alg_expand_binom_mix_simplify',
    'alg_expand_triple_monic',
    'alg_expand_triple_non_monic',
    'alg_expand_triple_quad_linear',
    'alg_expand_cube',
    'alg_expand_capstone'
  ] as const;

  newAlgGeneratorIds.forEach((id) => {
    it(`neuer Generator ${id}: liefert gueltige Aufgaben über 200 Iterationen`, () => {
      for (let i = 0; i < 200; i++) {
        const auf = GEN[id]();
        expect(auf.frage).toBeDefined();
        expect(typeof auf.frage).toBe('string');
        expect(auf.loesung).toBeDefined();
        expect(typeof auf.loesung).toBe('string');
        expect(auf.abSlots).toBeDefined();
        expect(Array.isArray(auf.abSlots)).toBe(true);
        expect(auf.abSlots.length).toBeGreaterThan(0);
        auf.abSlots.forEach((slot) => {
          expect(slot.kind).toBeDefined();
          if (slot.kind === 'int') {
            expect(typeof slot.expect).toBe('number');
            expect(Number.isInteger(slot.expect)).toBe(true);
          } else if (slot.kind === 'decimal') {
            expect(typeof slot.expect).toBe('number');
          } else if (slot.kind === 'choice') {
            expect([0, 1]).toContain(slot.expect);
            expect(slot.labels).toBeDefined();
            expect(slot.labels.length).toBe(2);
          }
        });
      }
    });
  });
});

describe('Prozentrechnung-Generatoren', () => {
  it('alle PROZENTRECHNUNG_GENERATOR_IDS liefern Frage und Lösung', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (const id of PROZENTRECHNUNG_GENERATOR_IDS) {
      const a = GEN[id]();
      expect(a.frage.length, id).toBeGreaterThan(5);
      expect(a.loesung.length, id).toBeGreaterThan(3);
    }
  });

  it('Prozent-AB: frageArbeitsblatt-Platzhalter passen zu abSlots', () => {
    const GEN = createPracticeGenerators(Math.random);
    for (const id of PROZENTRECHNUNG_GENERATOR_IDS) {
      const a = GEN[id]();
      expect(a.frageArbeitsblatt, id).toBeDefined();
      expect(a.abSlots?.length, id).toBeGreaterThan(0);
      expect(zaehleAbPlatzhalter(a.frageArbeitsblatt!), id).toBe(a.abSlots!.length);
    }
  });

  it('Prozent-Lösungen: gerade Anzahl $ (KaTeX -> PDF-LaTeX)', () => {
    for (const id of PROZENTRECHNUNG_GENERATOR_IDS) {
      for (let seed = 0; seed < 40; seed++) {
        const g = createPracticeGenerators(makeLcg(seed * 9973 + id.length * 31 + id.charCodeAt(0)));
        const a = g[id]();
        const n = (a.loesung.match(/\$/g) ?? []).length;
        expect(n % 2, `${id} @seed ${seed}`).toBe(0);
      }
    }
  });
});


