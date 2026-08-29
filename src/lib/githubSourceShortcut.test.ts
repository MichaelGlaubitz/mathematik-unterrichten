import { describe, expect, it } from 'vitest';
import { buildGithubEditUrl, buildRedaktionsUrl } from './githubSourceShortcut';

describe('buildGithubEditUrl', () => {
  it('baut die GitHub-Edit-URL für einen normalen Content-Pfad', () => {
    expect(
      buildGithubEditUrl('acme/projekt', 'main', 'src/content/blog/willkommen.md')
    ).toBe('https://github.com/acme/projekt/edit/main/src/content/blog/willkommen.md');
  });

  it('kodiert Sonderzeichen in einem Dateinamen', () => {
    expect(buildGithubEditUrl('acme/projekt', 'dev', 'src/a b/c.md')).toBe(
      'https://github.com/acme/projekt/edit/dev/src/a%20b/c.md'
    );
  });
});

describe('buildRedaktionsUrl', () => {
  it('hängt den Quellpfad als Abfrageparameter an', () => {
    expect(buildRedaktionsUrl('src/content/blog/willkommen.md')).toBe(
      '/admin?datei=src%2Fcontent%2Fblog%2Fwillkommen.md'
    );
  });

  it('kodiert Leerzeichen und Umlaute', () => {
    expect(buildRedaktionsUrl('src/content/aufgaben/brüche a.md')).toBe(
      '/admin?datei=src%2Fcontent%2Faufgaben%2Fbr%C3%BCche%20a.md'
    );
  });
});
