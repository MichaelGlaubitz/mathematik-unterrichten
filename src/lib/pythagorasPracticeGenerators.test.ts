import { describe, it, expect } from 'vitest';
import { FUN_GRAPH_AXIS_RANGE_MAX } from './functionGraphStyle';
import {
  createPracticeGenerators,
  funGraphLinearAxisInterceptsInRange,
  FUN_GRAPH_AXIS_INTERCEPT_MAX,
  PRACTICE_GENERATOR_IDS,
  parseErkennenSeiten,
  validateErkennenAufgabe,
} from './pythagorasPracticeGenerators';

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
  it('liefern getrennte Skizzen für Aufgabe (ohne Lösungsschattierung) und Lösung', () => {
    const GEN = createPracticeGenerators(() => 0.42);
    const mul = GEN.br_mul_frac();
    expect(mul.diagram).toBeDefined();
    expect(mul.diagramLoesung).toBeDefined();
    expect(mul.diagram).not.toContain("fill-opacity='0.34'");
    expect(mul.diagramLoesung).toContain("fill-opacity='0.34'");
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
