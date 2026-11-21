# vitrine-main

The public showcase of **Main**, the junior enterprise of Computer Science and Software Engineering
at UEM (Universidade Estadual de Maringá). Visitors travel through a 3D planetary system where every
planet is a project built by Main. Team members sign in to a dashboard to create and edit projects,
including the color palette that paints each planet and its project page.

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4,
React Three Fiber and Supabase. Project rules live in [`CLAUDE.md`](./CLAUDE.md); a short version
for humans is in [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Running locally

Requirements: Node.js 22 and npm.

```sh
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

Useful scripts:

| Script              | What it does                                                 |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Development server                                           |
| `npm run build`     | Production build                                             |
| `npm run lint`      | ESLint with zero warnings allowed                            |
| `npm run format`    | Prettier on the whole project                                |
| `npm run typecheck` | Route types + TypeScript                                     |
| `npm run test`      | Vitest for the pure logic (orbits, textures, slugs, ...)     |
| `npm run db:types`  | Regenerates `src/types/database.ts` from the linked Supabase |
| `npm run test:e2e`  | Playwright: navigation, chat, menu, keyboard, axe, VLibras   |

The end-to-end tests run locally against a production build and need published projects (the
`misto` scenario of the `test-data` branch). Dashboard tests run only when `E2E_USER_EMAIL` and
`E2E_USER_PASSWORD` of a test user are set in the shell; otherwise they are skipped.

## Accessibility

The site targets WCAG 2.2 AA. Automated checks (axe, keyboard, reduced motion, reflow) are part of
`npm run test:e2e`; the manual checklist for each release is in
[`docs/ACCESSIBILITY.md`](./docs/ACCESSIBILITY.md).

Public pages and the login page load the **VLibras** widget, the Brazilian federal government's
Portuguese-to-Libras translator, from `https://vlibras.gov.br`. It is a third-party service: the
visitor's browser downloads its scripts, fonts and avatar from government servers. The site works
normally when the service is unavailable. Mention it as a third-party service on any future
privacy page.

## Environment variables

| Name                                   | Description                                                   |
| -------------------------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL                                          |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key                               |
| `NEXT_PUBLIC_CONTACT_EMAIL`            | Main contact email, used by Orbi's question button and footer |
| `NEXT_PUBLIC_SITE_URL`                 | Public URL of the site, used for metadata, sitemap and robots |
| `PROJECT_REQUEST_EMAIL_TO`             | Where each new project request is emailed (`mainej@uem.br`)   |
| `PROJECT_REQUEST_IP_SALT`              | Random secret mixed into the IP hash used by the rate limit   |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`       | Cloudflare Turnstile site key (empty = turned off)            |
| `TURNSTILE_SECRET_KEY`                 | Cloudflare Turnstile secret key (empty = turned off)          |

## Project requests

`/solicitar-projeto` saves every request in `project_requests` through the database function
`submit_project_request`, the only way visitors can write to that table. The team reads them and
changes their status at `/dashboard/requests`. After saving, the server emails the team
(`src/features/project-requests/mailer.ts`); if the email fails, the request stays saved and the
failure is logged.

Spam protection, all checked on the server:

- a honeypot field that people never see; filled in means a robot, and the request is dropped
  while showing the normal confirmation;
- at least 3 seconds between opening the form and sending it;
- 3 requests every 10 minutes per IP (stored only as a salted hash) and 30 in total, in
  `submit_project_request`.

To turn on **Cloudflare Turnstile** if spam still gets through: create a widget at
<https://dash.cloudflare.com/?to=/:account/turnstile> for the site's domain, then set
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel and redeploy. The form shows
the check and the server verifies it; with the variables empty, it stays off.

## Dashboard sessions

Times live in `src/features/auth/session-limits.ts`:

| Constant       | Value      | What it does                                                    |
| -------------- | ---------- | --------------------------------------------------------------- |
| `inactivityMs` | 30 minutes | No click, key, scroll or touch in any dashboard tab: signed out |
| `warningMs`    | 2 minutes  | How early the "session will expire" dialog appears              |
| `maxSessionMs` | 8 hours    | Hard limit since sign-in, checked in the proxy and every action |

The 8-hour limit reads the sign-in time from the `amr` claim of the Supabase token. Signing out
in one tab signs out every dashboard tab, and the session is ended in Supabase too.

On the Supabase **Pro** plan, **Authentication → Sessions** can reinforce this: set **Time-box
user sessions** to `8h`. Leave **Inactivity timeout** unset or above the access token lifetime
(1 hour by default): Supabase counts inactivity from the last token refresh, so 30 minutes there
would sign out people who are still working. These settings are not available on the Free plan.

## Database

Every change is a SQL file in `supabase/migrations/`. Row Level Security is enabled on every table:
visitors read only published projects; signed-in team members can do everything.

```sh
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push --remote   # applies the migrations
npm run db:types                # regenerates the TypeScript types
```

## Creating the first account

Public sign-up is disabled. In the Supabase dashboard, open **Authentication → Users → Add user**,
create the user with email and password, and keep **Authentication → Sign In / Providers → Allow new
users to sign up** turned off. The person can then sign in at `/dashboard/login`.

## Folder structure

```
src/
├── app/
│   ├── (site)/              public showcase (dark theme): orbit journey and project pages
│   └── dashboard/           team area (light theme): login, project list, create and edit
├── components/
│   ├── ui/                  reusable building blocks (Button, TextField, Dialog, ...)
│   ├── orbit/               3D scene and the showcase interface
│   ├── project/             project page sections
│   ├── dashboard/           dashboard components (ProjectEditor, PaletteSection, ...)
│   ├── mascot/              Orbi, the Main mascot
│   └── site/                header, footer and shared screens
├── features/                domain logic: queries, server actions, schemas
├── hooks/                   reusable hooks
├── lib/                     pure logic (orbits, textures, colors) and Supabase clients
└── types/                   generated database types
supabase/migrations/         SQL migrations
docs/                        prototype, plan and progress log
```

## Deploying to Vercel

1. Import the GitHub repository in Vercel (framework preset: Next.js).
2. Add the four environment variables above to the Production and Preview environments.
3. In Supabase, open **Authentication → URL Configuration** and set the Site URL to the Vercel
   domain.
4. Deploy. Public pages are cached and revalidated automatically whenever a project is saved in the
   dashboard.

The GitHub Actions workflow in `.github/workflows/ci.yml` needs the repository secrets
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to run the build.
