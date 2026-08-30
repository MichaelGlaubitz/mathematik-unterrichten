import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  leseVariationsfolgen,
  SCHRITTE,
  LOESUNG_AB,
  PLENUM,
  TIEFER_BEAT,
  taktSchritte,
  PAAR_ZU_SCHRITT,
  SCHRITTE_PARTNER,
  PARTNER_UEBERSCHRIFT,
  SCHRITTE_PLENUM,
  TIEFER,
} from './variationsfolgen';

const ORDNER = path.join(process.cwd(), 'src/content/aufgaben');
const dateien = fs.readdirSync(ORDNER).filter((f) => f.endsWith('.md'));
const alle = dateien.map((f) => ({
  datei: f,
  fund: leseVariationsfolgen(fs.readFileSync(path.join(ORDNER, f), 'utf8')),
}));

describe('Variationsfolgen aus den Aufgabenfolgen lesen', () => {
  it('bis auf eine liefert jede Aufgabenfolge projizierbare Folgen', () => {
    // „Lineare Funktionen“ ist durchgehend fünfspaltig aufgebaut
    // (Funktion | y-Achsenabschnitt | Punkt für x=0 | Punkt für x=1). Dort
    // ließe sich nicht entscheiden, was an die Wand gehört, ohne zu raten.
    // Der Test hält die Lücke fest, statt sie zu verstecken.
    const ohne = alle.filter((a) => a.fund.folgen.length === 0).map((a) => a.datei);
    expect(ohne).toEqual(['lineare-funktionen-steigung-und-achsenabschnitt.md']);
  });

  it('eine Folge hat mindestens zwei Aufgaben – sonst gibt es nichts zu vergleichen', () => {
    for (const { datei, fund } of alle) {
      for (const f of fund.folgen) {
        expect(f.aufgaben.length, `${datei}: „${f.titel}“`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('jede Aufgabe hat Nummer, Frage und Lösung', () => {
    for (const { datei, fund } of alle) {
      for (const f of fund.folgen) {
        for (const a of f.aufgaben) {
          expect(Number.isInteger(a.nummer), `${datei}: ${JSON.stringify(a)}`).toBe(true);
          expect(a.frage.length, `${datei} Nr. ${a.nummer} ohne Frage`).toBeGreaterThan(0);
          expect(a.loesung.length, `${datei} Nr. ${a.nummer} ohne Lösung`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('die Nummern laufen innerhalb einer Folge aufsteigend', () => {
    for (const { datei, fund } of alle) {
      for (const f of fund.folgen) {
        const nummern = f.aufgaben.map((a) => a.nummer);
        expect(nummern, `${datei}: „${f.titel}“`).toEqual([...nummern].sort((x, y) => x - y));
      }
    }
  });

  it('nichts wird geraten: mehrspaltige Tabellen landen in „übersprungen“', () => {
    // Wo Zwischenspalten stehen („Lösungsidee“, „Hauptnenner“) oder mehrere
    // Darstellungen nebeneinander, ist nicht entscheidbar, was an die Wand
    // gehört. Diese Tabellen werden gemeldet, nicht interpretiert.
    const gesamt = alle.reduce((n, a) => n + a.fund.uebersprungen.length, 0);
    expect(gesamt).toBeGreaterThan(0);
    for (const { fund } of alle) {
      for (const u of fund.uebersprungen) {
        expect(u.grund).toMatch(/Spalten statt 3|weniger als zwei Aufgaben/);
      }
    }
  });

  it('keine Tabellenstriche im Text – die Zellen sind sauber getrennt', () => {
    for (const { datei, fund } of alle) {
      for (const f of fund.folgen) {
        for (const a of f.aufgaben) {
          expect(a.frage, `${datei} Nr. ${a.nummer}`).not.toContain('|');
          expect(a.loesung, `${datei} Nr. ${a.nummer}`).not.toContain('|');
        }
      }
    }
  });
});

describe('Die vier Schritte', () => {
  it('heißen Reflect, Expect, Check, Explain – in dieser Reihenfolge', () => {
    expect(SCHRITTE.map((s) => s.marke)).toEqual(['Reflect', 'Expect', 'Check', 'Explain']);
  });

  it('Reflect fragt nach dem Vergleich mit der vorherigen Aufgabe', () => {
    expect(SCHRITTE[0].punkte.join(' ')).toMatch(/geändert/);
    expect(SCHRITTE[0].punkte.join(' ')).toMatch(/gleich geblieben/);
  });

  it('Expect nimmt niemanden in die Pflicht', () => {
    // „If you can't form an expectation, don't worry“ – der Satz gehört dazu,
    // sonst wird aus der Vermutung eine Leistungsabfrage.
    expect(SCHRITTE[1].punkte.join(' ')).toMatch(/Keine Erwartung/);
  });

  it('Explain deckt alle drei Fälle ab', () => {
    const t = SCHRITTE[3].punkte.join(' ');
    expect(t).toMatch(/Keine Erwartung gehabt/);
    expect(t).toMatch(/Überrascht/);
    expect(t).toMatch(/Nicht überrascht/);
  });
});

describe('Die Folie im Auftritt', () => {
  const lies = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');
  const folie = lies('src/pages/aufgaben/[slug]/folge.astro');
  const seite = lies('src/pages/aufgaben/[slug].astro');

  it('die vorherige Aufgabe steht mit ihrer Lösung da – sonst ist Reflect unmöglich', () => {
    expect(folie).toContain('mu-folge-vorher-frage');
    expect(folie).toContain('mu-folge-vorher-loesung');
    expect(folie).toContain('Aufgabe davor');
  });

  it('die Aufgabe davor steht nur da, wenn es sie gibt', () => {
    expect(folie).toContain('vorher.hidden = !davor');
  });

  it('die Folie nennt ihren Adressaten und verliert ihn im Druck', () => {
    expect(folie).toContain('Regie · zum Projizieren');
    expect(folie).toMatch(/@media print[\s\S]*mu-folge-rolle/);
  });

  it('der Weg zur Folie steht nur dort, wo es eine Folge gibt', () => {
    expect(seite).toContain('hatFolge');
    expect(seite).toContain('{hatFolge && (');
  });

  it('was nicht projizierbar ist, wird benannt statt verschwiegen', () => {
    expect(folie).toContain('uebersprungen.length > 0');
    expect(folie).toContain('nicht entscheidbar');
  });
});

describe('Partnerphase nach der Einzelarbeit', () => {
  const lies = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');
  const folie = lies('src/pages/aufgaben/[slug]/folge.astro');

  it('es wird eine Frage ausgesucht, nicht die Liste abgearbeitet', () => {
    // „Choose a question to discuss with your partner“ – wer alle durchgeht,
    // macht aus dem Gespräch ein Formular. Deshalb steht an der Wand immer nur
    // die Gruppe des laufenden Schritts, höchstens drei Fragen.
    expect(PARTNER_UEBERSCHRIFT).toMatch(/sucht euch eine Frage aus/i);
    for (const gruppe of PAAR_ZU_SCHRITT) expect(gruppe.length).toBeLessThanOrEqual(3);
  });

  it('dieselben vier Schritte, jetzt zu zweit', () => {
    expect(SCHRITTE_PARTNER.map((s) => s.marke)).toEqual(['Reflect', 'Expect', 'Check', 'Explain']);
    for (const s of SCHRITTE_PARTNER) {
      expect(s.punkte.length, s.marke).toBeGreaterThan(0);
    }
  });

  it('die Impulse fragen nach dem anderen, nicht nach der Aufgabe', () => {
    // Das ist der Unterschied zur Einzelarbeit: verglichen werden die beiden
    // Bearbeitungen, nicht noch einmal die Aufgabe.
    const text = SCHRITTE_PARTNER.flatMap((s) => s.punkte).join(' ');
    expect(text).toMatch(/euch beiden|des anderen|der andere|ihr beide|zu zweit/);
    expect(text).toMatch(/Hat einer von euch sich vertan/);
    expect(text).toMatch(/Mitschüler/);
  });

  it('jeder Schritt trägt seine eigenen Impulse', () => {
    // Keine eigene Phase am Ende mehr: Der Impuls steht bei dem Schritt, zu
    // dem er gehört. Sonst stünden zwölf Fragen auf einmal an der Wand.
    expect(PAAR_ZU_SCHRITT).toHaveLength(SCHRITTE.length);
    SCHRITTE.forEach((s, i) => {
      const erwartet = SCHRITTE_PARTNER.find((x) => x.marke === s.marke)?.punkte ?? [];
      expect(PAAR_ZU_SCHRITT[i], s.marke).toEqual(erwartet);
    });
  });

  it('die Folie zeigt nur die Impulse des laufenden Schritts', () => {
    expect(folie).toContain('const paar = PAAR_ZU_SCHRITT[schritt] ?? []');
    // Und keine Sammelkarte mehr, in der alle vier Gruppen nebeneinander stehen.
    expect(folie).not.toContain('mu-folge-partner');
  });

  it('der Impuls kommt zeitversetzt und der Ton ist abschaltbar', () => {
    // Erst denkt jede und jeder allein. Der Ton ist Beiwerk – und aus,
    // solange ihn niemand einschaltet.
    expect(folie).toContain('function paarPlanen(impulse)');
    expect(folie).toMatch(/uhr = setTimeout\(/);
    expect(folie).toContain('if (tonWahl.checked) klingeln();');
    expect(folie).toMatch(/<input id="mu-folge-ton" type="checkbox"(?![^>]*checked)/);
    // Der Ton wird gerechnet, nicht geladen: kein Netz, keine Datei.
    expect(folie).toContain('window.AudioContext');
    expect(folie).not.toMatch(/new Audio\(/);
  });

  it('die Einstellungen bleiben auf dem Gerät', () => {
    expect(folie).toContain('localStorage.setItem(SPEICHER');
    expect(folie).not.toMatch(/fetch\(|XMLHttpRequest|navigator\.sendBeacon/);
  });
});

describe('Plenum und Abschluss', () => {
  const folie = fs.readFileSync(path.join(process.cwd(), 'src/pages/aufgaben/[slug]/folge.astro'), 'utf8');

  it('im Plenum gibt es kein Check – das ist Absicht, keine Auslassung', () => {
    // Geprüft wurde in der Einzelarbeit. Im Plenum geht es um den
    // Zusammenhang, nicht um das Ergebnis.
    expect(SCHRITTE_PLENUM.map((s) => s.marke)).toEqual(['Reflect', 'Expect', 'Explain']);
    expect(folie).toContain('Kein Check mehr');
  });

  it('Reflect fragt im Plenum nach dem Warum, nicht nur nach dem Was', () => {
    const reflect = SCHRITTE_PLENUM[0].punkte.join(' ');
    expect(reflect).toMatch(/was ist gleich, was ist anders/i);
    expect(reflect).toMatch(/Warum wirkt sich diese Änderung/);
  });

  it('„Tiefer bohren“ fragt nach der ganzen Folge, nicht nach einer Aufgabe', () => {
    expect(TIEFER).toHaveLength(5);
    expect(TIEFER.join(' ')).toMatch(/dieser Folge/);
    expect(TIEFER.join(' ')).toMatch(/Setzt die Folge .* fort/);
    expect(folie).toContain('Nicht mehr zu einer Aufgabe – zur ganzen Folge.');
  });

  it('deshalb steht es erst am Ende der Folge', () => {
    expect(taktSchritte(4, 6)).not.toContain(TIEFER_BEAT);
    expect(taktSchritte(5, 6).at(-1)).toBe(TIEFER_BEAT);
  });

  it('und bleibt dort stehen, statt weiterzulaufen', () => {
    // Hinter dem letzten Beat der letzten Aufgabe gibt es kein Weiter mehr.
    expect(folie).toContain('else i = takte[folge][n].length - 1;');
  });

  it('immer nur eine Karte zugleich', () => {
    for (const karte of ['plenumkarte.hidden = !imPlenum', 'tieferkarte.hidden = !imTiefer']) {
      expect(folie).toContain(karte);
    }
  });
});

describe('Wann die Lösung an der Wand steht', () => {
  it('erst bei Explain, nicht schon bei Check', () => {
    expect(SCHRITTE[LOESUNG_AB].marke).toBe('Explain');
    expect(SCHRITTE[LOESUNG_AB - 1].marke).toBe('Check');
  });

  it('die Folie liest die Regel aus LOESUNG_AB, nicht aus einer Zahl', () => {
    const folie = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/aufgaben/[slug]/folge.astro'),
      'utf8'
    );
    expect(folie).toContain('loesung.hidden = schritt < LOESUNG_AB;');
    // Der Wert muss auch im Skriptblock ankommen, sonst ist er dort undefined
    // und `schritt < undefined` ist immer falsch – die Lösung stünde ab der
    // ersten Sekunde da.
    expect(folie).toMatch(/define:vars=\{\{[^}]*LOESUNG_AB[^}]*\}\}/);
  });
});

describe('Welche Beats eine Aufgabe bekommt', () => {
  const marke = (i: number) => SCHRITTE[i]?.marke ?? ['Plenum', 'tiefer'][i - SCHRITTE.length];

  it('die erste Aufgabe steigt bei Check ein', () => {
    expect(taktSchritte(0, 6).map(marke)).toEqual(['Check']);
  });

  it('die erste Aufgabe hat weder Reflect noch Expect noch Explain', () => {
    // Alle drei setzen eine Vorgängerin voraus, die es hier nicht gibt.
    const beats = taktSchritte(0, 6).map(marke);
    expect(beats).not.toContain('Reflect');
    expect(beats).not.toContain('Expect');
    expect(beats).not.toContain('Explain');
  });

  it('die erste Aufgabe hat kein Plenum – dort geht es nur um den Zusammenhang', () => {
    expect(taktSchritte(0, 6)).not.toContain(PLENUM);
    // Zu zweit wird trotzdem gesprochen: Die Check-Impulse hängen am Schritt.
    const check = SCHRITTE.findIndex((s) => s.marke === 'Check');
    expect(PAAR_ZU_SCHRITT[check].length).toBeGreaterThan(0);
  });

  it('ab der zweiten Aufgabe läuft der volle Takt', () => {
    expect(taktSchritte(1, 6).map(marke)).toEqual([
      'Reflect', 'Expect', 'Check', 'Explain', 'Plenum',
    ]);
  });

  it('„tiefer bohren" hängt an der letzten Aufgabe', () => {
    expect(taktSchritte(5, 6)).toContain(TIEFER_BEAT);
    expect(taktSchritte(4, 6)).not.toContain(TIEFER_BEAT);
    expect(taktSchritte(5, 6).at(-1)).toBe(TIEFER_BEAT);
  });

  it('eine Folge mit nur einer Aufgabe bleibt begehbar', () => {
    expect(taktSchritte(0, 1).map(marke)).toEqual(['Check', 'tiefer']);
  });

  it('jeder Beat der echten Folgen ist zeichenbar', () => {
    // Ein Index außerhalb von SCHRITTE und außerhalb der drei Beats hätte
    // an der Wand eine leere Karte zur Folge.
    const erlaubt = new Set([...SCHRITTE.map((_, i) => i), PLENUM, TIEFER_BEAT]);
    for (const anzahl of [1, 2, 6, 12]) {
      for (let nr = 0; nr < anzahl; nr++) {
        for (const b of taktSchritte(nr, anzahl)) expect(erlaubt.has(b)).toBe(true);
      }
    }
  });
});

describe('Die Folie benutzt die Taktregel', () => {
  const folie = fs.readFileSync(
    path.join(process.cwd(), 'src/pages/aufgaben/[slug]/folge.astro'),
    'utf8'
  );

  it('rechnet die Beats nicht selbst aus', () => {
    expect(folie).toContain('taktSchritte(i, f.aufgaben.length)');
    expect(folie).not.toMatch(/const PARTNER = 4, PLENUM = 5/);
  });

  it('passt jeden Bereich für sich ein, nicht die ganze Folie', () => {
    // Würde die ganze Folie skaliert, änderte die Aufgabe ihre Größe, sobald
    // der Impuls darunter länger wird – von Schritt zu Schritt, obwohl sich
    // die Aufgabe gar nicht geändert hat. Genau so sah es uneinheitlich aus.
    expect(folie).toContain('function einpassen()');
    expect(folie).toContain("['mu-folge-vorher', 'mu-folge-aufgabe', 'mu-folge-impuls']");
    expect(folie).toContain("document.addEventListener('fullscreenchange', einpassenNachLayout)");
    expect(folie).toContain("window.addEventListener('resize', einpassenNachLayout)");
    expect(folie).toMatch(/#mu-folge-buehne:fullscreen \{[^}]*overflow: hidden/);
  });

  it('das Vollbild hat ein festes Raster', () => {
    // Feste Zeilenhöhen, damit nichts wandert, wenn ein Bereich leer bleibt.
    expect(folie).toMatch(/grid-template-rows: auto 20vh minmax\(0, 1fr\) 34vh/);
  });

  it('was noch nicht dran ist, behält seinen Platz', () => {
    // Die Aufgabe davor fehlt bei Nr. 1, die Lösung kommt erst bei Explain.
    // Beides darf die Aufgabe weder verschieben noch verkleinern.
    expect(folie).toMatch(
      /:is\(#mu-folge-vorher, #mu-folge-loesung\)\[hidden\][^}]*visibility: hidden/
    );
    expect(folie).toMatch(/\.mu-folge-punkt\[hidden\][^}]*visibility: hidden/);
  });

  it('nur verkleinern, nie vergrößern', () => {
    expect(folie).toMatch(/Math\.min\(1,/);
  });

  it('setzt die Erwartungsbeispiele als Fließtext, nicht als Liste', () => {
    expect(folie).toContain("punkte.textContent = s.punkte.join('  ·  ')");
    expect(folie).toMatch(/<p id="mu-folge-punkte"/);
  });
});
