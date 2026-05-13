import { describe, expect, it } from 'vitest';
import { githubBlobUrl, normalizePathname, pathnameToRepoFilePath } from './githubSourcePath';

describe('normalizePathname', () => {
  it('entfernt trailing slash und index.html', () => {
    expect(normalizePathname('/blog/willkommen/')).toBe('/blog/willkommen');
    expect(normalizePathname('/blog/willkommen/index.html')).toBe('/blog/willkommen');
  });
});

describe('pathnameToRepoFilePath', () => {
  it('mappt Startseite und RSS', () => {
    expect(pathnameToRepoFilePath('/')).toBe('src/pages/index.astro');
    expect(pathnameToRepoFilePath('/rss.xml')).toBe('src/pages/rss.xml.js');
  });

  it('mappt Top-Level-Seiten', () => {
    expect(pathnameToRepoFilePath('/kontakt')).toBe('src/pages/kontakt.astro');
    expect(pathnameToRepoFilePath('/themen')).toBe('src/pages/themen/index.astro');
  });

  it('mappt Übungsseiten', () => {
    expect(pathnameToRepoFilePath('/uebung/pythagoras')).toBe('src/pages/uebung/pythagoras.astro');
  });

  it('mappt Content-Routen', () => {
    expect(pathnameToRepoFilePath('/blog/willkommen')).toBe('src/content/blog/willkommen.md');
    expect(pathnameToRepoFilePath('/aufgaben/pythagoras-grundform-und-anwendung')).toBe(
      'src/content/aufgaben/pythagoras-grundform-und-anwendung.md'
    );
    expect(pathnameToRepoFilePath('/quizzes/trigonometrie-sin-cos-tan')).toBe(
      'src/content/quizzes/trigonometrie-sin-cos-tan.json'
    );
  });

  it('mappt Themen-Whiteboard auf die Astro-Route', () => {
    expect(pathnameToRepoFilePath('/themen/geometrie/whiteboard')).toBe(
      'src/pages/themen/[thema]/whiteboard.astro'
    );
  });

  it('lehnt unsichere Pfade ab', () => {
    expect(pathnameToRepoFilePath('/uebung/../etc/passwd')).toBeNull();
    expect(pathnameToRepoFilePath('/blog/foo%2fbar')).toBeNull();
  });
});

describe('githubBlobUrl', () => {
  it('kodiert Pfadsegmente für GitHub', () => {
    const u = githubBlobUrl('o/r', 'main', 'src/pages/themen/[thema]/whiteboard.astro');
    expect(u).toContain('github.com');
    expect(u).toContain('%5Bthema%5D');
  });
});
