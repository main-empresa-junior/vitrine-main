import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test.describe('mobile menu', () => {
  test('shows every header option and closes after following a link', async ({ page }) => {
    await page.goto('/');
    const menuButton = page.getByRole('button', { name: 'Abrir menu' });
    await expect(page.getByRole('link', { name: 'Projetos' })).toHaveCount(0);

    await menuButton.click();
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await expect(menu).toBeVisible();
    for (const name of ['Projetos', 'Sobre a Main', 'Contato', 'Área da equipe']) {
      await expect(menu.getByRole('link', { name })).toBeVisible();
    }
    await expect(menu.getByRole('link', { name: 'Projetos' })).toBeFocused();

    await menu.getByRole('link', { name: 'Sobre a Main' }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#sobre$/);
    await expect(page.getByRole('heading', { name: 'Sobre a Main' })).toBeInViewport();
  });

  test('closes with Escape and returns focus to the menu button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
  });

  test('opening the menu closes the Orbi chat', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tirar uma dúvida com o Orbi' }).click();
    const chat = page.getByRole('dialog', { name: 'Converse com o Orbi' });
    await expect(chat).toBeVisible();

    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
    await expect(chat).toBeHidden();
  });
});
