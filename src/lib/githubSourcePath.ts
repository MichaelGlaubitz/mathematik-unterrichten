/** Erlaubte URL-Slug-Segmente (entspricht den generierten Astro-/Content-Pfaden). */
const SAFE_SEGMENT = /^[a-z0-9-]+$/;

/**
 * Normalisiert `window.location.pathname` (ohne Query/Hash), u. a. für lokale `index.html`-Dateiauslieferung.
 */
export function normalizePathname(raw: string): string {
  let p = raw.split('?')[0]!.split('#')[0]!;
  try {
    p = decodeURIComponent(p);
  } catch {
    /* ungültiges Encoding ignorieren */
  }
  if (p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length);
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p === '' ? '/' : p;
}

/**
 * Ordnet den sichtbaren Seitenpfad einer Repo-Datei unter `src/` zu.
 * Liefert `null`, wenn keine sichere Zuordnung existiert.
 */
export function pathnameToRepoFilePath(pathname: string): string | null {
  const p = normalizePathname(pathname);

  if (p === '/rss.xml') return 'src/pages/rss.xml.js';
  if (p === '/') return 'src/pages/index.astro';

  const parts = p.split('/').filter(Boolean);
  if (parts.length === 0) return 'src/pages/index.astro';

  const [a, b, c] = parts;

  if (parts.length === 1) {
    if (!SAFE_SEGMENT.test(a!)) return null;
    if (['kontakt', 'ueber', 'datenschutz', 'impressum'].includes(a!)) {
      return `src/pages/${a}.astro`;
    }
    if (a === 'themen') return 'src/pages/themen/index.astro';
    if (a === 'blog') return 'src/pages/blog/index.astro';
    if (a === 'aufgaben') return 'src/pages/aufgaben/index.astro';
    if (a === 'quizzes') return 'src/pages/quizzes/index.astro';
    return null;
  }

  if (parts.length === 2 && a === 'uebung') {
    if (!SAFE_SEGMENT.test(b!)) return null;
    return `src/pages/uebung/${b}.astro`;
  }

  if (parts.length === 2 && a === 'blog') {
    if (!SAFE_SEGMENT.test(b!)) return null;
    return `src/content/blog/${b}.md`;
  }

  if (parts.length === 2 && a === 'aufgaben') {
    if (!SAFE_SEGMENT.test(b!)) return null;
    return `src/content/aufgaben/${b}.md`;
  }

  if (parts.length === 2 && a === 'quizzes') {
    if (!SAFE_SEGMENT.test(b!)) return null;
    return `src/content/quizzes/${b}.json`;
  }

  if (parts.length === 3 && a === 'themen' && c === 'whiteboard') {
    if (!SAFE_SEGMENT.test(b!)) return null;
    return 'src/pages/themen/[thema]/whiteboard.astro';
  }

  return null;
}

export function githubBlobUrl(repo: string, branch: string, filePath: string): string {
  const enc = filePath.split('/').map(encodeURIComponent).join('/');
  return `https://github.com/${repo}/blob/${branch}/${enc}`;
}
