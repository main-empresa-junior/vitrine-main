import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// A marcação interna do VLibras é do widget do governo e não temos como corrigi-la.
const VLIBRAS_CONTAINER = '[data-vlibras]';

export type Preferences = {
  theme: 'light' | 'dark';
  motion: 'full' | 'reduced';
};

export async function applyPreferences(page: Page, { theme, motion }: Preferences) {
  await page.addInitScript(
    ([themeValue, motionValue]) => {
      localStorage.setItem('theme', themeValue);
      localStorage.setItem('motion', motionValue);
    },
    [theme, motion] as const,
  );
}

// Esperar os esmaecimentos terminarem: texto no meio de uma transição tem contraste parcial.
const SETTLE_MS = 600;

async function waitForFiniteAnimations(page: Page) {
  // Os esmaecimentos começam quando o IntersectionObserver responde, logo depois da carga.
  await page.waitForTimeout(SETTLE_MS);
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (animation) =>
          animation.playState !== 'running' ||
          animation.effect?.getTiming().iterations === Infinity,
      ),
  );
}

export async function expectNoAxeViolations(page: Page) {
  await waitForFiniteAnimations(page);
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .exclude(VLIBRAS_CONTAINER)
    .analyze();
  const summary = results.violations.map((violation) => ({
    rule: violation.id,
    impact: violation.impact,
    nodes: violation.nodes
      .slice(0, 5)
      .map((node) => `${node.target.join(' ')}: ${node.any[0]?.message ?? node.failureSummary}`),
  }));
  expect(summary).toEqual([]);
}

// Credenciais de um usuário de teste, só para rodar localmente; sem elas os testes do painel são pulados.
export const TEAM_LOGIN = {
  email: process.env.E2E_USER_EMAIL ?? '',
  password: process.env.E2E_USER_PASSWORD ?? '',
};

export const HAS_TEAM_LOGIN = TEAM_LOGIN.email !== '' && TEAM_LOGIN.password !== '';

export async function signIn(page: Page) {
  await page.goto('/dashboard/login');
  await page.getByLabel('E-mail').fill(TEAM_LOGIN.email);
  await page.getByLabel('Senha').fill(TEAM_LOGIN.password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL(/\/dashboard$/);
}
