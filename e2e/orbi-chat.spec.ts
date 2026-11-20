import { expect, type Page, test } from '@playwright/test';

const HELP_BUTTON = { name: 'Tirar uma dúvida com o Orbi' } as const;

async function openChat(page: Page) {
  await page.goto('/');
  await page.getByRole('button', HELP_BUTTON).click();
  const chat = page.getByRole('dialog', { name: 'Converse com o Orbi' });
  await expect(chat).toBeVisible();
  return chat;
}

test.describe('Orbi chat', () => {
  test('answers a question and leads to all projects', async ({ page }) => {
    const chat = await openChat(page);
    await expect(chat.getByRole('button', { name: 'O que é a Main?' })).toBeFocused();

    await chat.getByRole('button', { name: 'Que tipo de projeto vocês fazem?' }).click();
    const projectsLink = chat.getByRole('link', { name: 'Ver todos os projetos' });
    await expect(projectsLink).toBeVisible();
    await expect(
      chat.getByRole('button', { name: 'Que tipo de projeto vocês fazem?' }),
    ).toHaveCount(0);

    await projectsLink.dblclick();
    await expect(chat.getByText('Redirecionando para Todos os projetos…')).toHaveCount(1);

    await expect(chat).toBeHidden();
    await expect(page).toHaveURL(/#todos$/);
    const title = page.getByRole('heading', { name: 'Todos os projetos' });
    await expect(title).toBeFocused();
    await expect(title).toBeInViewport();
  });

  test('shows the contact e-mail and closes with Escape', async ({ page }) => {
    const chat = await openChat(page);
    await chat.getByRole('button', { name: 'Entrar em contato' }).click();

    await expect(
      chat.getByText('Claro! Você pode falar com a gente pelo e-mail abaixo.'),
    ).toBeVisible();
    await expect(chat.getByRole('link', { name: 'Escrever e-mail' })).toHaveAttribute(
      'href',
      /^mailto:.+subject=Contato%20pelo%20site%20da%20Main/,
    );
    await expect(chat.getByRole('button', { name: 'Entrar em contato' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(chat).toBeHidden();
    const helpButton = page.getByRole('button', HELP_BUTTON);
    await expect(helpButton).toBeFocused();
    await expect(helpButton).toHaveAttribute('aria-expanded', 'false');
  });
});
