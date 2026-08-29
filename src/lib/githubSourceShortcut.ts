/**
 * Baut die GitHub-„Datei bearbeiten“-URL (Branch + Pfad mit segmentweiser Kodierung).
 *
 * Wird als Rückfallweg gebraucht: für Dateien, die die Redaktion unter `/admin`
 * nicht führt (etwa die Übungsgeneratoren unter `src/pages/uebung/`).
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
 * Baut die Redaktions-URL, die genau diese Quelldatei geöffnet anzeigt.
 */
export function buildRedaktionsUrl(filePath: string): string {
  return `/admin?datei=${encodeURIComponent(filePath)}`;
}

/**
 * Strg+Shift+E bzw. Cmd+Shift+E: die Quelldatei der aktuellen Seite in der
 * Redaktion unter `/admin` öffnen — mit Formularfeldern, Vorschau und einem
 * Knopf zum Veröffentlichen.
 *
 * Voraussetzungen im gerenderten HTML:
 * - `<meta name="mu-github-source-path" content="src/…" />` — `BaseLayout`:
 *   `sourceFile` (Page im Repo), optional überschrieben durch `githubEditPath`
 *   (z. B. Content-`.md`).
 */
export function registerRedaktionsShortcut(): void {
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

    e.preventDefault();
    window.open(buildRedaktionsUrl(path), '_blank', 'noopener,noreferrer');
  });
}
