/**
 * Baut die GitHub-„Datei bearbeiten“-URL (Branch + Pfad mit segmentweiser Kodierung).
 */
export function buildGithubEditUrl(repo: string, branch: string, filePath: string): string {
  const r = repo.trim();
  const b = branch.trim() || 'main';
  const encodedPath = filePath
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return `https://github.com/${r}/edit/${encodeURIComponent(b)}/${encodedPath}`;
}

/**
 * Strg+Shift+E bzw. Cmd+Shift+E: Quelldatei auf GitHub öffnen (wenn konfiguriert).
 *
 * Voraussetzungen im gerenderten HTML:
 * - `<meta name="mu-github-source-path" content="src/content/…" />` (setzt z. B. BaseLayout über `githubEditPath`)
 * - `document.body` mit `data-gh-repo="Owner/name"` und optional `data-gh-branch` (Standard `main`),
 *   gesetzt über `PUBLIC_GITHUB_REPO` / `PUBLIC_GITHUB_BRANCH` in `.env`
 */
export function registerGithubSourceShortcut(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey) || !e.shiftKey) return;
    if (e.key.toLowerCase() !== 'e') return;

    const el = e.target as HTMLElement | null;
    if (el && /^(input|textarea|select)$/i.test(el.tagName)) return;

    const path = document
      .querySelector('meta[name="mu-github-source-path"]')
      ?.getAttribute('content')
      ?.trim();
    if (!path) return;

    const repo = document.body.getAttribute('data-gh-repo')?.trim() ?? '';
    const branch = document.body.getAttribute('data-gh-branch')?.trim() || 'main';
    if (!repo) return;

    e.preventDefault();
    const url = buildGithubEditUrl(repo, branch, path);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}
