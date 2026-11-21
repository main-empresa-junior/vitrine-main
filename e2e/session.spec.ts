import { expect, test } from '@playwright/test';

import { HAS_TEAM_LOGIN, signIn } from './support/a11y';

const NEEDS_LOGIN = 'Defina E2E_USER_EMAIL e E2E_USER_PASSWORD de um usuário de teste.';

test.describe('dashboard session', () => {
  test.skip(!HAS_TEAM_LOGIN, NEEDS_LOGIN);

  test('warns before signing out after 30 minutes without activity', async ({ page }) => {
    // O relógio do navegador é controlado pelo teste: 30 minutos passam em instantes.
    await page.clock.install();
    await signIn(page);

    await page.clock.fastForward('28:30');
    const warning = page.getByRole('dialog', { name: 'Sua sessão vai expirar por inatividade' });
    await expect(warning).toBeVisible();
    await expect(warning).toContainText(/desconectado em 1:\d\d/);

    await warning.getByRole('button', { name: 'Continuar conectado' }).click();
    await expect(warning).toBeHidden();

    await page.clock.fastForward('30:05');
    await page.waitForURL(/\/dashboard\/login\?reason=inactive/);
    await expect(
      page.getByText('Sua sessão expirou por inatividade. Entre novamente.'),
    ).toBeVisible();
  });

  test('signing out in one tab signs out the others', async ({ page, context }) => {
    await signIn(page);
    const otherTab = await context.newPage();
    await otherTab.goto('/dashboard');

    await page.getByRole('button', { name: 'Sair' }).first().click();
    await otherTab.waitForURL(/\/dashboard\/login/);
  });
});
