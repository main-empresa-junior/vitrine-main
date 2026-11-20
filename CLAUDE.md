# vitrine-main — Project rules

This file is read at the start of every session. Follow it in every change, without exception.
If a rule here conflicts with a request, stop and ask before proceeding.

## What this project is

The public showcase ("vitrine") of **Main**, the junior enterprise of Computer Science and Software
Engineering at UEM (Universidade Estadual de Maringá). Visitors travel through a 3D planetary system
where each planet is a project built by Main. Team members sign in to a dashboard to create and edit
projects, including a color palette that paints the project's planet and its page.

- User-facing text is in **Brazilian Portuguese**.
- Code is in **English**: identifiers, file names, test names and commit messages.
- Code comments, when they exist, are in **Brazilian Portuguese** (see "Comments" below).

## Stack (do not add or replace libraries without asking)

| Layer        | Choice                                                          |
| ------------ | --------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack), React 19, TypeScript strict |
| 3D           | three.js through `@react-three/fiber` and `@react-three/drei`   |
| UI animation | `framer-motion`                                                 |
| Styling      | Tailwind CSS 4 with design tokens in `src/app/globals.css`      |
| Backend      | Supabase (Postgres, Auth, Storage) through `@supabase/ssr`      |
| Forms        | `react-hook-form` + `zod` + `@hookform/resolvers@^5`            |
| Color picker | `react-colorful`                                                |
| Hosting      | Vercel (frontend) + Supabase (data)                             |

Next.js 16 specifics: the request interceptor is `src/proxy.ts` exporting `proxy` (not
`middleware.ts`); `cookies()`, `headers()`, `params` and `searchParams` are async and must be awaited.

## Folder structure

```
src/
├── app/
│   ├── (site)/                    public showcase (dark theme)
│   │   ├── page.tsx               orbit journey
│   │   └── projects/[slug]/       project page
│   └── dashboard/                 team area (light theme)
│       ├── login/
│       ├── page.tsx               project list
│       ├── new/
│       └── [id]/edit/
├── components/
│   ├── ui/                        generic, reusable building blocks (Button, TextField, ...)
│   ├── orbit/                     3D scene: Scene, Planet, Sun, Rocket, OrbitRing, Stars, ...
│   ├── project/                   project page sections
│   ├── dashboard/                 dashboard-only components (ProjectForm, PalettePicker, ...)
│   └── mascot/                    Orbi, the Main mascot
├── features/                      domain logic grouped by feature (queries, actions, schemas)
│   └── projects/
├── hooks/                         reusable hooks (useReducedMotion, ...)
├── lib/
│   ├── supabase/                  client.ts, server.ts, proxy.ts, env.ts
│   ├── design-tokens.ts           brand colors for code that can't use Tailwind (three.js)
│   └── utils/                     small pure helpers
├── types/                         shared types, including generated `database.ts`
└── proxy.ts
supabase/migrations/               every database change as a SQL migration file
docs/                              prototype, decisions, progress log
```

Rules:

- A file lives next to what uses it. Promote it to `components/ui`, `hooks` or `lib` only when a
  second place needs it.
- One component per file. File name = component name in PascalCase (`ProjectForm.tsx`).
  Other files use kebab-case (`orbit-math.ts`). Hooks start with `use` (`useReducedMotion.ts`).
- Import with the `@/` alias across folders; use `./` only inside the same folder.

## TypeScript rules (based on the Google TypeScript Style Guide)

- `strict` stays on. Never use `any`. Use `unknown` and narrow it.
- No non-null assertions (`!`) except for validated environment variables in `lib/supabase/env.ts`.
- No `@ts-ignore`. If a type error seems wrong, fix the types or explain in a comment with
  `@ts-expect-error` followed by the reason in Portuguese.
- Prefer union string literals over `enum` (`type ProjectType = 'app' | 'site' | 'system'`).
- `type` for unions, props and data shapes; `interface` only when extension is needed.
- Use `readonly` for data that must not be mutated, and `as const` for fixed lookup tables.
- Named exports everywhere. Default exports only where Next.js requires them (`page.tsx`,
  `layout.tsx`, `not-found.tsx`, `error.tsx`).
- Exported functions declare their return type.
- `const` by default, `let` only when reassigned, never `var`. Always `===`.
- Naming: `UpperCamelCase` for types and components, `lowerCamelCase` for values and functions,
  `CONSTANT_CASE` for module-level constants that never change.
- Validate every external input (forms, URL params, Supabase rows when shape matters) with `zod`.
  Infer types from schemas (`z.infer`) instead of writing them twice.
- Database types come from `npm run db:types` (Supabase CLI). Never hand-write table types.

## Reuse and code organization

- **Rule of two:** when the same markup, logic or style appears in a second place, extract it into
  a component, hook or helper before writing it the second time.
- Components are small and focused. If a component passes ~150 lines or does two jobs, split it.
- Separate concerns:
  - UI components only render and handle UI events.
  - Data access (Supabase queries, server actions) lives in `features/<feature>/`.
  - Pure logic (orbit math, texture generation, palette helpers) lives in plain `.ts` files
    without React, so it can be tested in isolation.
- Server Components by default. Add `'use client'` only to the smallest component that needs
  state, effects, event handlers or browser APIs.
- Props are typed with a `type <Component>Props`. Variants are props (`variant="secondary"`), not
  copied components.
- No magic numbers or strings: name them as constants at the top of the file or in a config module.

## Comments

The code must explain itself through good names, small functions and clear types. Comments are the
exception, not the rule.

- Do **not** comment what the code already says (`// increments the counter`, `// returns the user`,
  `// component props`). Do not add header comments to files, JSDoc on every function, or comments
  that repeat a type or a name.
- Write a comment **only** when the reason behind the code is not obvious and cannot be made obvious
  by renaming or extracting: a security decision, a workaround for a library bug, a non-intuitive
  math step, or an order of operations that must not change.
- Comments are written in **Brazilian Portuguese**, short, one line whenever possible.
- Never leave commented-out code, `TODO` without context, or debug `console.log` in commits.
- Before adding a comment, first try to remove the need for it with a better name or a smaller function.

## Design tokens

- Colors, font sizes, radii, shadows and easings come only from the tokens in
  `src/app/globals.css`. Tailwind's default colors and font sizes are disabled on purpose.
- Arbitrary values like `bg-[#05071C]` or `text-[17px]` are not allowed.
- In components, prefer semantic tokens (`background`, `foreground`, `muted`, `surface`, `border`,
  `focus`) so they work in both themes. The theme of an area is set with `data-theme="dark"` on the
  wrapping element.
- Fonts: `font-display` (Unbounded) for titles, `font-sans` (Figtree) for text, loaded with
  `next/font`.
- three.js code reads brand colors from `src/lib/design-tokens.ts`.

## Accessibility (required, not optional)

- Semantic HTML, one `h1` per page, labels tied to every input, visible focus on every control.
- Interactive targets at least 44×44 px. Text contrast at least WCAG AA.
- Decorative 3D canvases are `aria-hidden`; their information is also available as text.
- Motion follows the motion preference (see below) and never blocks content.

## Motion preference

- Default: follow the OS `prefers-reduced-motion`.
- A "Ativar animações / Reduzir animações" toggle appears when the OS asks for reduced motion or when
  the visitor already chose. The choice is stored in `localStorage` (key `motion`) and applied early
  as `data-motion="full" | "reduced"` on `<html>`.
- Use the shared `useReducedMotion` hook and the `data-motion` selectors. Never read the media
  query directly in components.
- In reduced mode: no automatic or looping motion, no parallax, no bounces; user-triggered changes
  use short fades.

## Security

- Supabase Row Level Security is the source of truth for permissions. Every new table ships with
  RLS enabled and policies in the same migration.
- Public sign-up is disabled; only invited team members can sign in.
- Protect routes in three layers: `src/proxy.ts`, a session check in each dashboard page, and RLS.
- Use `supabase.auth.getClaims()` to check sessions on the server, never `getSession()`.
- Validate redirects (only internal `/dashboard` paths) and file uploads (type and size).
- Secrets only in `.env.local`. Keep `.env.example` updated with every new variable, without values.

## Formatting and quality are automatic

These are already configured; keep them working and never bypass them:

- Prettier (`.prettierrc.json`, Tailwind class sorting), ESLint (Next.js rules, import sorting,
  unused imports removal, `eslint-config-prettier` last).
- VS Code formats and fixes on save (`.vscode/settings.json`).
- Husky + lint-staged run ESLint and Prettier on every commit.
- GitHub Actions run `format:check`, `lint`, `typecheck` and `build` on every push and pull request.

Never use `--no-verify`, `eslint-disable` without a reason in the same line, or `--force` /
`--legacy-peer-deps` when installing.

## Definition of done for any change

1. `npm run format` then `npm run lint`, `npm run typecheck` and `npm run build` pass with no errors
   or warnings.
2. No duplicated markup or logic that should have been extracted.
3. Works in light and dark areas, on 390 px and 1440 px widths, and with reduced motion.
4. Every new database change has a migration in `supabase/migrations/`.
5. `docs/PROGRESS.md` is updated with what was done and what is next.
6. Commit with Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`),
   one logical change per commit.
