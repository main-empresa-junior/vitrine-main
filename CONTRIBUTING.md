# Contributing

Short version of the rules in [`CLAUDE.md`](./CLAUDE.md). Read that file for the details.

## Setup

1. `npm install` (installs the Husky hooks too).
2. Copy `.env.example` to `.env.local` and fill in the Supabase values.
3. `npm run dev`.

Use VS Code with the recommended extensions (Prettier, ESLint, Tailwind CSS IntelliSense): files
are formatted and fixed on save.

## Language

- User-facing text: Brazilian Portuguese.
- Code, file names, tests and commit messages: English.
- Comments (rare): Brazilian Portuguese, one line, only to explain _why_.

## Code

- TypeScript strict. No `any`, no `@ts-ignore`, no non-null `!` (except validated env vars).
- Named exports, except where Next.js requires a default export.
- One component per file, `PascalCase.tsx`. Other files `kebab-case.ts`. Hooks `useSomething.ts`.
- Server Components by default; `'use client'` only on the smallest component that needs it.
- Data access in `src/features/<feature>/`; pure logic in plain `.ts` files with Vitest tests.
- Rule of two: the second time something repeats, extract it.
- Validate every external input with `zod` and infer types from the schema.
- Database types come from `npm run db:types`; never write table types by hand.

## Styling

- Only the tokens in `src/app/globals.css`. No Tailwind default colors, no arbitrary values.
- Prefer semantic tokens (`background`, `foreground`, `muted`, `surface`, `border`, `focus`).
- The theme of an area is set with `data-theme="dark"` on the wrapping element.

## Accessibility and motion

- Semantic HTML, one `h1` per page, labelled inputs, visible focus, 44×44 px targets, WCAG AA.
- Use `useReducedMotion` and the `data-motion` selectors; never read the media query directly.

## Database

Every change is a SQL file in `supabase/migrations/`, with RLS enabled and policies in the same file.

## Before committing

```sh
npm run format && npm run lint && npm run typecheck && npm run test && npm run build
```

Commits follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`),
one logical change each. Never bypass the hooks with `--no-verify`.
