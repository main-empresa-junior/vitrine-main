import { expect, type Page, test } from '@playwright/test';

import {
  applyPreferences,
  expectNoAxeViolations,
  HAS_TEAM_LOGIN,
  type Preferences,
  signIn,
} from './support/a11y';

const WIDTHS = [390, 1440] as const;
const THEMES = ['dark', 'light'] as const;
const MOTIONS = ['full', 'reduced'] as const;
const NEEDS_LOGIN = 'Defina E2E_USER_EMAIL e E2E_USER_PASSWORD de um usuário de teste.';

type PageCheck = {
  name: string;
  needsLogin?: boolean;
  open: (page: Page) => Promise<void>;
};

async function openFirstProject(page: Page) {
  await page.goto('/');
  const href = await page.locator('a[href^="/projects/"]').first().getAttribute('href');
  test.skip(!href, 'Precisa de pelo menos um projeto publicado.');
  await page.goto(href ?? '/');
}

const PAGES: readonly PageCheck[] = [
  { name: 'home', open: (page) => page.goto('/').then(() => undefined) },
  { name: 'project page', open: openFirstProject },
  { name: 'login', open: (page) => page.goto('/dashboard/login').then(() => undefined) },
  {
    name: 'project request form',
    open: (page) => page.goto('/solicitar-projeto').then(() => undefined),
  },
  {
    name: 'dashboard list',
    needsLogin: true,
    open: (page) => page.goto('/dashboard').then(() => undefined),
  },
  {
    name: 'project requests',
    needsLogin: true,
    open: (page) => page.goto('/dashboard/requests').then(() => undefined),
  },
  {
    name: 'project form',
    needsLogin: true,
    open: (page) => page.goto('/dashboard/new').then(() => undefined),
  },
];

for (const width of WIDTHS) {
  for (const theme of THEMES) {
    for (const motion of MOTIONS) {
      const preferences: Preferences = { theme, motion };
      test.describe(`axe at ${width}px, ${theme} theme, ${motion} motion`, () => {
        test.use({ viewport: { width, height: 900 } });

        for (const check of PAGES) {
          test(`${check.name} has no WCAG A or AA violations`, async ({ page }) => {
            test.skip(Boolean(check.needsLogin) && !HAS_TEAM_LOGIN, NEEDS_LOGIN);
            await applyPreferences(page, preferences);
            if (check.needsLogin) await signIn(page);
            await check.open(page);
            await expect(page.locator('main')).toBeVisible();
            await expectNoAxeViolations(page);
          });
        }
      });
    }
  }
}

// Zoom de 400% numa tela de 1280 px equivale a 320 px de largura (WCAG 1.4.10).
test.describe('reflow at 320px', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const check of PAGES.filter((item) => !item.needsLogin)) {
    test(`${check.name} has no horizontal scroll`, async ({ page }) => {
      await check.open(page);
      await expect(page.locator('main')).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
