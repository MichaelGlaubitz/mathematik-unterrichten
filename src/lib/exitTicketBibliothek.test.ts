import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Die „Fertigen Tickets“ im Werkzeug `public/werkzeuge/exit-ticket.html`
 * stammen aus den Stundenverläufen. Das Werkzeug ist eine eigenständige
 * HTML-Datei ohne Framework und ohne Netzzugriff – es kann die Sammlung nicht
 * zur Laufzeit lesen, also steht die Liste dort als Literal. Damit sie nicht
 * hinter dem Material zurückbleibt, prüft dieser Test die Abdeckung: Zu jedem
 * Thema mit Stundenverlauf muss ein Ticket vorhanden sein.
 *
 * Bewusst keine Prüfung auf wörtliche Gleichheit der Fragen: Wer eine Stunde
 * feilt, soll nicht von einem roten Test aufgehalten werden.
 */

const werkzeug = fs.readFileSync(
  path.join(process.cwd(), 'public/werkzeuge/exit-ticket.html'),
  'utf8'
);

function bibliothek(): { name: string; titel: string; stunde?: string; fragen: number }[] {
  const start = werkzeug.indexOf('const BIBLIOTHEK = [');
  const ende = werkzeug.indexOf('\n  ];', start);
  expect(start, 'BIBLIOTHEK in exit-ticket.html').toBeGreaterThan(0);
  const block = werkzeug.slice(start, ende);
  return [...block.matchAll(/\{\s*\n\s*name: '((?:[^'\\]|\\.)*)',\s*\n\s*titel: '((?:[^'\\]|\\.)*)',\s*\n(?:\s*stunde: '([^']*)',\s*\n)?\s*fragen: \[(.*?)\]\s*\n\s*\}/gs)].map(
    (m) => ({
      name: m[1].replace(/\\'/g, "'"),
      titel: m[2].replace(/\\'/g, "'"),
      stunde: m[3],
      fragen: [...m[4].matchAll(/'(?:[^'\\]|\\.)*'/g)].length,
    })
  );
}

function themenMitStunde(): { thema: string; slug: string }[] {
  const d = path.join(process.cwd(), 'src/content/stunden');
  return fs.readdirSync(d).map((datei) => {
    const text = fs.readFileSync(path.join(d, datei), 'utf8');
    const thema = text.match(/^thema:\s*"([^"]+)"/m);
    expect(thema, datei).not.toBeNull();
    return { thema: thema![1], slug: '/stunden/' + datei.replace(/\.md$/, '') };
  });
}

describe('Exit-Ticket-Bibliothek', () => {
  it('deckt jedes Thema ab, zu dem es einen Stundenverlauf gibt', () => {
    const vorhanden = new Set(bibliothek().map((b) => b.titel));
    const fehlend = [...new Set(themenMitStunde().map((t) => t.thema))]
      .filter((thema) => !vorhanden.has(thema))
      .sort();
    expect(fehlend, 'Themen mit Stundenverlauf, aber ohne fertiges Ticket').toEqual([]);
  });

  it('jeder Herkunfts-Link zeigt auf einen vorhandenen Stundenverlauf', () => {
    const slugs = new Set(themenMitStunde().map((t) => t.slug));
    for (const b of bibliothek()) {
      if (b.stunde) expect(slugs.has(b.stunde), `${b.name} → ${b.stunde}`).toBe(true);
    }
  });

  it('behält ein fachunabhängiges Ticket als Startpunkt', () => {
    const eintraege = bibliothek();
    expect(eintraege.some((b) => b.titel === 'Rückblick')).toBe(true);
    // Der Startpunkt wird über den Namen gesucht, nicht über einen Index –
    // eine wachsende Liste darf ihn nicht verschieben.
    expect(werkzeug).toContain("BIBLIOTHEK.find(function (b) { return b.titel === 'Rückblick'; })");
  });

  it('jedes Ticket hat zwei oder drei Fragen', () => {
    for (const b of bibliothek()) {
      expect(b.fragen, b.name).toBeGreaterThanOrEqual(2);
      expect(b.fragen, b.name).toBeLessThanOrEqual(3);
    }
  });
});
