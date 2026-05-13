import { githubBlobUrl, pathnameToRepoFilePath } from './githubSourcePath';

function isTypingTarget(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'OPTION') return true;
  return el.isContentEditable;
}

/**
 * **Shift + Strg + E**: öffnet die passende Quelldatei auf GitHub (`blob`-Ansicht).
 * Nur aktiv im Browser; in Eingabefeldern wird nicht ausgelöst.
 */
export function registerGithubSourceShortcut(): void {
  if (typeof window === 'undefined') return;

  const repo = import.meta.env.PUBLIC_GITHUB_REPO ?? 'MichaelGlaubitz/mathematik-unterrichten';
  const branch = import.meta.env.PUBLIC_GITHUB_BRANCH ?? 'main';

  window.addEventListener(
    'keydown',
    (ev: KeyboardEvent) => {
      if (!ev.shiftKey || !ev.ctrlKey || ev.altKey || ev.metaKey) return;
      if (ev.key !== 'e' && ev.key !== 'E') return;
      if (isTypingTarget(ev.target)) return;

      const filePath = pathnameToRepoFilePath(window.location.pathname);
      if (!filePath) {
        console.warn('[GitHub-Shortcut] Keine Quelldatei-Zuordnung für:', window.location.pathname);
        return;
      }

      ev.preventDefault();
      const url = githubBlobUrl(repo, branch, filePath);
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    true
  );
}
