import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Eine Mini-Whiteboard-Runde ist keine Aufgabensammlung, sondern eine Diagnose:
 * Sie fragt die Fehlvorstellungen ab, die das Thema mitbringt. Zwanzig der 23
 * Themen waren schon so gebaut – eine Aufgabe je Fehlvorstellung. Drei nicht:
 * „Graphen" hatte zwei Aufgaben bei vier Fehlvorstellungen, „Dezimalzahlen"
 * siebenundzwanzig, was der Übungsgenerator auf Zuruf in jeder Menge liefert.
 *
 * Die Obergrenze ist die Unterrichtsphase: Was in zehn Minuten an der Tafel
 * nicht durchläuft, ist keine Runde mehr.
 */
const ORDNER = path.join(process.cwd(), 'src/content/themen');
const themen = fs.readdirSync(ORDNER).map((f) => ({
  slug: f.replace('.json', ''),
  daten: JSON.parse(fs.readFileSync(path.join(ORDNER, f), 'utf8')),
}));

const HOECHSTENS = 8;

describe('Mini-Whiteboard-Runden', () => {
  it('jede Runde deckt jede Fehlvorstellung des Themas ab', () => {
    const zuKurz = themen
      .filter((t) => t.daten.whiteboardAufgaben.length < t.daten.fehlvorstellungen.length)
      .map((t) => `${t.slug}: ${t.daten.whiteboardAufgaben.length} Aufgaben, ${t.daten.fehlvorstellungen.length} Fehlvorstellungen`);
    expect(zuKurz).toEqual([]);
  });

  it('keine Runde wird zur Aufgabensammlung', () => {
    const zuLang = themen
      .filter((t) => t.daten.whiteboardAufgaben.length > HOECHSTENS)
      .map((t) => `${t.slug}: ${t.daten.whiteboardAufgaben.length} Aufgaben`);
    expect(zuLang, `mehr als ${HOECHSTENS} Aufgaben – dafür gibt es den Übungsgenerator`).toEqual([]);
  });

  it('jede Aufgabe hat Frage und Lösung, keine ist doppelt', () => {
    for (const t of themen) {
      const fragen = t.daten.whiteboardAufgaben.map((w: { frage: string }) => w.frage);
      for (const w of t.daten.whiteboardAufgaben as { frage: string; loesung: string }[]) {
        expect(w.frage?.trim(), t.slug).toBeTruthy();
        expect(w.loesung?.trim(), `${t.slug}: „${w.frage}" ohne Lösung`).toBeTruthy();
      }
      expect(new Set(fragen).size, `${t.slug} fragt etwas doppelt`).toBe(fragen.length);
    }
  });

  it('Dollarzeichen paarweise – sonst bricht der Formelsatz', () => {
    for (const t of themen) {
      for (const w of t.daten.whiteboardAufgaben as { frage: string; loesung: string }[]) {
        for (const text of [w.frage, w.loesung]) {
          const anzahl = (text.match(/(?<!\\)\$/g) ?? []).length;
          expect(anzahl % 2, `${t.slug}: ungerade Anzahl $ in „${text}"`).toBe(0);
        }
      }
    }
  });
});

describe('Zeichnungen im Protokoll', () => {
  const stunden = fs
    .readdirSync(path.join(process.cwd(), 'public'))
    .filter((d) => /^(7b|10b|10c|11a)$/.test(d))
    .flatMap((d) =>
      fs
        .readdirSync(path.join(process.cwd(), 'public', d))
        .filter((f) => /^\d+-stunde\.html$/.test(f))
        .map((f) => path.join('public', d, f))
    );

  it('es gibt Stundenseiten zu prüfen', () => {
    expect(stunden.length).toBeGreaterThan(0);
  });

  it('kein <img> ohne Alternativtext', () => {
    // Die Zeichnung des Schülers landet im Protokoll, das er abgibt. Ohne alt
    // steht dort für ein Vorleseprogramm nichts.
    const ohne: string[] = [];
    for (const p of stunden) {
      const t = fs.readFileSync(path.join(process.cwd(), p), 'utf8');
      for (const tag of t.match(/<img\b[^>]*>/g) ?? []) {
        if (!/\balt=/.test(tag)) ohne.push(`${p}: ${tag.slice(0, 70)}`);
      }
    }
    expect(ohne).toEqual([]);
  });

  it('der Alternativtext nennt das Feld, zu dem die Zeichnung gehört', () => {
    for (const p of stunden) {
      const t = fs.readFileSync(path.join(process.cwd(), p), 'utf8');
      expect(t, p).toContain('alt="Zeichnung: \' + sicher(FELDNAMEN["zeichnung:" + zid] || zid) + \'"');
    }
  });
});

describe('Anmeldung der Stundenseiten', () => {
  const stunden = fs
    .readdirSync(path.join(process.cwd(), 'public'))
    .filter((d) => /^(7b|10b|10c|11a)$/.test(d))
    .flatMap((d) =>
      fs
        .readdirSync(path.join(process.cwd(), 'public', d))
        .filter((f) => /^\d+-stunde\.html$/.test(f))
        .map((f) => path.join('public', d, f))
    );

  it('nichts wird an einen Schirm verdrahtet, der schon weg ist', () => {
    // Auf einem angemeldeten Gerät entfernt oeffnen() den Anmeldeschirm sofort.
    // Ein ungeprüftes getElementById(...).addEventListener warf danach, und die
    // Ausnahme brach den Rest des Skripts ab – die Stunde kam ohne Einstiegsquiz.
    const ungeschuetzt: string[] = [];
    for (const p of stunden) {
      const t = fs.readFileSync(path.join(process.cwd(), p), 'utf8');
      for (const knopf of ['k-anmelden', 'k-ohne-zahl']) {
        if (t.includes(`document.getElementById("${knopf}").addEventListener`)) {
          ungeschuetzt.push(`${p}: ${knopf}`);
        }
      }
    }
    expect(ungeschuetzt).toEqual([]);
  });

  it('der Anmeldeschlüssel hängt am Speichernamen, nicht am Seitentitel', () => {
    // Am Titel hängend hätte eine Umbenennung in der Redaktion jedes Gerät
    // mitten in der Stunde abgemeldet und den gewählten Plan verworfen.
    const amTitel: string[] = [];
    for (const p of stunden) {
      const t = fs.readFileSync(path.join(process.cwd(), p), 'utf8');
      for (const zeile of t.split('\n')) {
        if (/var (ANGEMELDET|PLAN_KEY) =/.test(zeile) && zeile.includes('document.title')) {
          amTitel.push(`${p}: ${zeile.trim()}`);
        }
      }
    }
    expect(amTitel).toEqual([]);
  });

  it('was unter dem alten Schlüssel liegt, wird übernommen', () => {
    for (const p of stunden.filter((x) => x.includes('10c/01') || x.includes('10c/02'))) {
      const t = fs.readFileSync(path.join(process.cwd(), p), 'utf8');
      expect(t, p).toContain('ANGEMELDET_ALT');
      expect(t, p).toContain('PLAN_KEY_ALT');
      expect(t, p).toContain('function gemerkt(');
    }
  });
});
