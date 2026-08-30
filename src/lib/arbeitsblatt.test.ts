import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { leseBlatt, gegebeneSpalten, MEHR_GEGEBEN, tabellen } from './arbeitsblatt';

const ORDNER = path.join(process.cwd(), 'src/content/aufgaben');
const dateien = fs.readdirSync(ORDNER).filter((f) => f.endsWith('.md'));
const lies = (f: string) => fs.readFileSync(path.join(ORDNER, f), 'utf8');

describe('Welche Spalten schon dastehen', () => {
  it('nach der Nummer ist die erste Spalte gegeben', () => {
    expect(gegebeneSpalten(['Aufgabe', 'Lösung'])).toBe(1);
    expect(gegebeneSpalten(['Term', 'Gekürzt'])).toBe(1);
  });

  it('die geprüften Ausnahmen gelten', () => {
    expect(gegebeneSpalten(['Gegeben', 'Gesucht', 'Lösung'])).toBe(2);
    expect(gegebeneSpalten(['$a$', '$q$', '$t$', '$f(t) = a\\cdot q^t$'])).toBe(3);
  });

  it('nie sind alle Spalten gegeben – sonst wäre nichts zu tun', () => {
    // Auch eine falsch eingetragene Ausnahme darf das Blatt nicht leerlaufen
    // lassen: Mindestens eine Spalte bleibt zum Ausfüllen.
    expect(gegebeneSpalten(['Gegeben', 'Gesucht'])).toBe(1);
    for (const kopf of Object.keys(MEHR_GEGEBEN)) {
      const spalten = kopf.split(' | ');
      expect(gegebeneSpalten(spalten), kopf).toBeLessThan(spalten.length);
    }
  });

  it('jede eingetragene Ausnahme kommt im Bestand auch vor', () => {
    // Ein Eintrag, den keine Datei mehr trägt, ist eine Behauptung ohne Deckung.
    const gefunden = new Set<string>();
    for (const datei of dateien) {
      for (const t of tabellen(leseBlatt(lies(datei)))) {
        gefunden.add(t.kopf.join(' | '));
      }
    }
    for (const kopf of Object.keys(MEHR_GEGEBEN)) expect([...gefunden]).toContain(kopf);
  });
});

describe('Das Blatt aus dem Bestand', () => {
  it('jede Aufgabenfolge ergibt ein Blatt mit Aufgaben', () => {
    for (const datei of dateien) {
      const blatt = leseBlatt(lies(datei));
      expect(blatt.anzahl, datei).toBeGreaterThan(0);
      expect(blatt.abschnitte.length, datei).toBeGreaterThan(0);
    }
  });

  it('das Blatt nimmt auch die mehrspaltigen Tabellen mit', () => {
    // Auf Papier ist eine fünfspaltige Tabelle kein Problem – anders als an
    // der Wand. Die Projektionsfolie überspringt 44 Tabellen; das Blatt nicht.
    const blatt = leseBlatt(lies('bruch-dezimal-prozent-drei-kleider.md'));
    const titel = blatt.abschnitte.map((a) => a.titel.replace(/:.*$/, ''));
    expect(titel).toEqual(['Folge A', 'Folge B', 'Folge C', 'Folge D', 'Folge E']);
    expect(blatt.anzahl).toBe(30);
  });

  it('in jeder Zeile bleibt etwas zum Ausfüllen', () => {
    for (const datei of dateien) {
      for (const t of tabellen(leseBlatt(lies(datei)))) {
        for (const z of t.zeilen) {
          expect(z.gesucht.length, `${datei} Nr. ${z.nummer} (${t.kopf.join('|')})`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('jede Zeile trägt ihre Nummer', () => {
    for (const datei of dateien) {
      for (const t of tabellen(leseBlatt(lies(datei)))) {
        for (const z of t.zeilen) expect(z.nummer, datei).toMatch(/^\d+$/);
      }
    }
  });

  it('der didaktische Kommentar landet auf keinem Blatt', () => {
    // Er gehört der Lehrkraft. Auf dem Blatt stünden dort die Lösungen samt
    // Begründung – mitten im Schülerteil.
    for (const datei of dateien) {
      const blatt = leseBlatt(lies(datei));
      const text = JSON.stringify(blatt);
      expect(text, datei).not.toContain('Häufige Fehlvorstellungen');
      expect(text, datei).not.toContain('Was variiert in Folge');
    }
  });

  it('die Vorbemerkung für die Klasse steht auf dem Blatt', () => {
    const blatt = leseBlatt(lies('bruch-dezimal-prozent-drei-kleider.md'));
    expect(blatt.vorbemerkung.join(' ')).toContain('dieselbe Zahl');
    expect(blatt.reflexionsfragen.length).toBeGreaterThan(0);
  });

  it('ein maskierter Tabellenstrich zerlegt keine Zelle', () => {
    // „(0 \| 1) und (1 \| 3)“ ist eine Zelle, kein Spaltenwechsel.
    const blatt = leseBlatt(lies('graphen-von-der-tabelle-zum-bild.md'));
    const zellen = tabellen(blatt)
      .flatMap((t) => t.zeilen)
      .flatMap((z) => [...z.gegeben, ...z.gesucht]);
    expect(zellen.some((z) => z.includes('\\|'))).toBe(true);
    for (const z of zellen) expect(z).not.toBe('');
  });
});
