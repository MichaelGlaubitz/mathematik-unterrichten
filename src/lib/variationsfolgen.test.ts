import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  leseVariationsfolgen,
  SCHRITTE,
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
    // „Lineare Funktionen" ist durchgehend fünfspaltig aufgebaut
    // (Funktion | y-Achsenabschnitt | Punkt für x=0 | Punkt für x=1). Dort
    // ließe sich nicht entscheiden, was an die Wand gehört, ohne zu raten.
    // Der Test hält die Lücke fest, statt sie zu verstecken.
    const ohne = alle.filter((a) => a.fund.folgen.length === 0).map((a) => a.datei);
    expect(ohne).toEqual(['lineare-funktionen-steigung-und-achsenabschnitt.md']);
  });

  it('eine Folge hat mindestens zwei Aufgaben – sonst gibt es nichts zu vergleichen', () => {
    for (const { datei, fund } of alle) {
      for (const f of fund.folgen) {
        expect(f.aufgaben.length, `${datei}: „${f.titel}"`).toBeGreaterThanOrEqual(2);
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
        expect(nummern, `${datei}: „${f.titel}"`).toEqual([...nummern].sort((x, y) => x - y));
      }
    }
  });

  it('nichts wird geraten: mehrspaltige Tabellen landen in „übersprungen"', () => {
    // Wo Zwischenspalten stehen („Lösungsidee", „Hauptnenner") oder mehrere
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
    // „If you can't form an expectation, don't worry" – der Satz gehört dazu,
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

  it('die Lösung erscheint frühestens beim Check', () => {
    // Wer die Lösung vor der Erwartung sieht, hat keine Erwartung mehr.
    expect(folie).toContain('loesung.hidden = schritt < 2');
  });

  it('die erste Aufgabe beginnt bei Expect, nicht bei Reflect', () => {
    // Es gibt nichts, womit sie sich vergleichen ließe.
    expect(folie).toMatch(/n === 0 && s === 0 && richtung > 0/);
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
    // „Choose a question to discuss with your partner" – wer alle neun
    // durchgeht, macht aus dem Gespräch ein Formular.
    expect(PARTNER_UEBERSCHRIFT).toMatch(/sucht euch eine Frage aus/i);
    expect(folie).toContain('Eine genügt');
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

  it('sie kommt erst nach Explain und verschwindet mit der nächsten Aufgabe', () => {
    expect(folie).toContain('const PARTNER = 4, PLENUM = 5, TIEFER_S = 6;');
    expect(folie).toContain('partnerkarte.hidden = !imPartner');
    // Nach der Partnerphase geht es ins Plenum, erst danach zur nächsten Aufgabe.
    expect(folie).toContain('if (s > PLENUM && !letzte)');
  });

  it('in der Partnerphase steht kein Einzelschritt mehr im Vordergrund', () => {
    // Sobald die Einzelarbeit vorbei ist, verschwindet das Schrittband ganz.
    // An der Wand steht dann die Karte für die Phase, die gerade läuft.
    expect(folie).toContain('schrittband.hidden = !allein');
    expect(folie).toContain('const allein = schritt < PARTNER');
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

  it('„Tiefer bohren" fragt nach der ganzen Folge, nicht nach einer Aufgabe', () => {
    expect(TIEFER).toHaveLength(5);
    expect(TIEFER.join(' ')).toMatch(/dieser Folge/);
    expect(TIEFER.join(' ')).toMatch(/Setzt die Folge .* fort/);
    expect(folie).toContain('Nicht mehr zu einer Aufgabe – zur ganzen Folge.');
  });

  it('deshalb steht es erst am Ende der Folge', () => {
    expect(folie).toContain('if (s > PLENUM && !letzte)');
    expect(folie).toContain('const letzte = nr === f.aufgaben.length - 1');
  });

  it('und bleibt dort stehen, statt weiterzulaufen', () => {
    expect(folie).toContain('else if (s > TIEFER_S) { s = TIEFER_S; }');
  });

  it('immer nur eine Karte zugleich', () => {
    for (const karte of ['partnerkarte.hidden = !imPartner', 'plenumkarte.hidden = !imPlenum', 'tieferkarte.hidden = !imTiefer']) {
      expect(folie).toContain(karte);
    }
  });
});
