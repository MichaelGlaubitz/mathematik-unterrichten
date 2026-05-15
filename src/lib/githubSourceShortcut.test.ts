import { describe, expect, it } from 'vitest';
import { buildGithubEditUrl } from './githubSourceShortcut';

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
