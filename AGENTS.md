# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Static math-didactics site for German teachers, built with **Astro 4 + Tailwind + MDX + KaTeX**. No backend, no database, no Docker required. See `README.md` for full details.

### Key commands

| Task | Command |
|---|---|
| Install deps | `npm install` |
| Dev server | `npm run dev` (http://localhost:4321) |
| Build | `npm run build` |
| Tests | `npm run test` (Vitest) |
| Preview build | `npm run preview` |

No lint script is configured in this project.

### Caveats

- One pre-existing test failure in `src/lib/pythagorasPracticeGenerators.test.ts` (boundary condition: string length `== 15` vs expected `> 15`). This is not caused by environment setup.
- The dev server binds to port **4321** by default.
- Content is in `src/content/` (Markdown/MDX for blog+aufgaben, JSON for quizzes+themen). Content collection schemas live in `src/content/config.ts`.
- The admin editor at `/__admin-editor` requires an `ADMIN_EDIT_TOKEN` env var (see `.env.example`); it is optional for normal development.
