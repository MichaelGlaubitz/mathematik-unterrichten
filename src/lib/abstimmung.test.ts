import { describe, it, expect } from 'vitest';
import { mathZuText, fragensatz, base64url, abstimmungsLink, mischeOptionen } from './abstimmung';

describe('mathZuText', () => {
  it('entfernt die Mathe-Begrenzer', () => {
    expect(mathZuText('$5 - (-3)$')).toBe('5 - (-3)');
    expect(mathZuText('Berechne $2+2$ bitte')).toBe('Berechne 2+2 bitte');
    expect(mathZuText('\\(a\\)')).toBe('a');
  });

  it('schreibt Brüche als Schrägstrich, ohne unnötige Klammern', () => {
    expect(mathZuText('$\\tfrac{2}{5}$')).toBe('2/5');
    expect(mathZuText('$\\frac{5}{14}$')).toBe('5/14');       // Zahlen bleiben ungeklammert
    expect(mathZuText('$\\dfrac{3x+6}{3}$')).toBe('(3x+6)/3'); // Summen brauchen die Klammer
  });

  it('klammert einen Zähler aus zwei Faktoren als Ganzes', () => {
    // Ohne die äußere Klammer läse man (x-1) · ((x+3)/(x-1)) – das ist etwas anderes.
    expect(mathZuText('$\\dfrac{(x-1)(x+3)}{x-1}$')).toBe('((x-1)(x+3))/(x-1)');
  });

  it('lässt einen bereits geklammerten Term in Ruhe', () => {
    expect(mathZuText('$\\frac{(a+b)}{2}$')).toBe('(a+b)/2');
  });

  it('setzt Wurzeln, Potenzen und Indizes', () => {
    expect(mathZuText('$\\sqrt{a+b} = \\sqrt{a} + \\sqrt{b}$')).toBe('√(a+b) = √a + √b');
    expect(mathZuText('$1{,}05^{10}$')).toBe('1,05¹⁰');
    expect(mathZuText('$\\log_3 81$')).toBe('log₃ 81');
    expect(mathZuText('$\\sqrt[3]{8}$')).toBe('∛8');
  });

  it('behält den Exponenten lesbar, wenn es kein hochgestelltes Zeichen gibt', () => {
    expect(mathZuText('$1{,}20^{t}$')).toBe('1,20^t');
  });

  it('löst das LaTeX-Dezimalkomma auf', () => {
    expect(mathZuText('$0{,}375$')).toBe('0,375');
    expect(mathZuText('etwa $18{,}8\\,\\text{cm}^2$')).toBe('etwa 18,8 cm²');
  });

  it('lässt die Mengendifferenz stehen und frisst sie nicht als Abstand', () => {
    // \ vor einem Leerzeichen ist hier Mengendifferenz, kein LaTeX-Abstand.
    expect(mathZuText('D = ℝ \\ {2, −3}')).toBe('D = ℝ \\ {2, −3}');
  });

  it('erkennt Befehle auch vor einem Unterstrich', () => {
    // \b greift zwischen "g" und "_" nicht – deshalb die eigene Befehlsgrenze.
    expect(mathZuText('$\\log_2 8$')).toBe('log₂ 8');
  });

  it('gibt Verknüpfungszeichen gleichmäßig Luft', () => {
    expect(mathZuText('$1000\\cdot 2$')).toBe('1000 · 2');
    expect(mathZuText('$1000 \\cdot 2$')).toBe('1000 · 2');
    expect(mathZuText('$x\\neq 1$')).toBe('x ≠ 1');
  });

  it('lässt reinen Text unangetastet', () => {
    const text = 'Welche Aussage ist richtig?';
    expect(mathZuText(text)).toBe(text);
  });

  it('wirft keine LaTeX-Reste aus', () => {
    const proben = [
      '$\\tfrac{1}{2} \\cdot \\tfrac{3}{4}$',
      '$S(3 \\mid 2)$',
      '$\\bar{x} = 4$',
      '$\\alpha \\approx 30^\\circ$',
      '$\\text{Fläche} = 10\\,\\text{cm}^2$',
    ];
    for (const p of proben) {
      expect(mathZuText(p), p).not.toMatch(/\\[a-zA-Z]|\$/);
    }
  });
});

describe('fragensatz', () => {
  const fragen = [
    {
      frage: 'Berechne $5 - (-3)$.',
      optionen: [
        { text: '$8$', korrekt: true },
        { text: '$2$', korrekt: false },
        { text: '$-8$', korrekt: false },
        { text: '$-2$', korrekt: false },
      ],
    },
  ];

  it('überträgt Titel, Fragen und Optionen als Klartext', () => {
    const satz = fragensatz('Negative Zahlen', fragen);
    expect(satz.t).toBe('Negative Zahlen');
    expect(satz.q).toHaveLength(1);
    expect(satz.q[0].f).toBe('Berechne 5 - (-3).');
    // Die Reihenfolge ist gemischt, der Bestand nicht.
    expect(satz.q[0].o.slice().sort()).toEqual(['-2', '-8', '2', '8']);
  });

  it('zeigt mit dem Index auf die tatsächlich richtige Antwort', () => {
    const satz = fragensatz('t', fragen);
    expect(satz.q[0].o[satz.q[0].r]).toBe('8');
  });

  it('fällt auf die erste Option zurück, wenn keine als richtig markiert ist', () => {
    const ohne = [{ frage: 'f', optionen: [{ text: 'a', korrekt: false }] }];
    expect(fragensatz('t', ohne).q[0].r).toBe(0);
  });
});

describe('mischeOptionen', () => {
  const vier = ['a', 'b', 'c', 'd'];

  it('liefert für dieselbe Saat immer dieselbe Reihenfolge', () => {
    // Sonst änderte sich der Link bei jedem Bauen und eine begonnene Zählung
    // ließe sich nach einem Neuaufbau nicht fortsetzen.
    expect(mischeOptionen(vier, 'Frage 1')).toEqual(mischeOptionen(vier, 'Frage 1'));
  });

  it('mischt bei verschiedenen Saaten verschieden', () => {
    const saaten = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ergebnisse = new Set(saaten.map((s) => mischeOptionen(vier, s).join('')));
    expect(ergebnisse.size).toBeGreaterThan(1);
  });

  it('behält alle Optionen genau einmal', () => {
    expect(mischeOptionen(vier, 'x').slice().sort()).toEqual(vier);
  });

  it('verteilt die richtige Antwort über alle Positionen', () => {
    // In den Quizdateien steht die richtige Antwort fast immer vorn. Bliebe das
    // so, hätte die Klasse nach zwei Fragen heraus, dass A stimmt.
    const positionen = new Set<number>();
    for (let i = 0; i < 40; i++) {
      const optionen = [
        { text: 'richtig', korrekt: true },
        { text: 'b', korrekt: false },
        { text: 'c', korrekt: false },
        { text: 'd', korrekt: false },
      ];
      const satz = fragensatz('t', [{ frage: 'Frage Nummer ' + i, optionen }]);
      positionen.add(satz.q[0].r);
    }
    expect(positionen.size).toBe(4);
  });

  it('zeigt auf die richtige Antwort, auch nachdem gemischt wurde', () => {
    for (let i = 0; i < 25; i++) {
      const optionen = [
        { text: 'DIE RICHTIGE', korrekt: true },
        { text: 'b', korrekt: false },
        { text: 'c', korrekt: false },
        { text: 'd', korrekt: false },
      ];
      const satz = fragensatz('t', [{ frage: 'Frage ' + i, optionen }]);
      expect(satz.q[0].o[satz.q[0].r]).toBe('DIE RICHTIGE');
    }
  });
});

describe('base64url und Link', () => {
  it('kodiert ohne Zeichen, die in einer URL stören', () => {
    const kodiert = base64url('Größer als ½? — ja/nein+mehr');
    expect(kodiert).not.toMatch(/[+/=]/);
  });

  it('lässt sich wieder dekodieren', () => {
    const text = '{"t":"Brüche","q":[]}';
    const zurueck = Buffer.from(
      base64url(text).replace(/-/g, '+').replace(/_/g, '/'),
      'base64',
    ).toString('utf-8');
    expect(zurueck).toBe(text);
  });

  it('baut einen Link auf das Werkzeug mit Fragment', () => {
    const link = abstimmungsLink('Test', [
      { frage: 'f', optionen: [{ text: 'a', korrekt: true }, { text: 'b', korrekt: false }] },
    ]);
    expect(link.startsWith('/werkzeuge/abstimmung.html#q=')).toBe(true);
    const nutzlast = link.split('#q=')[1];
    const json = JSON.parse(
      Buffer.from(nutzlast.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8'),
    );
    expect(json.q[0].o).toEqual(['a', 'b']);
    expect(json.q[0].r).toBe(0);
  });
});
