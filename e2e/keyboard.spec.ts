import { expect, type Page, test } from '@playwright/test';

import { HAS_TEAM_LOGIN, TEAM_LOGIN } from './support/a11y';

const MAX_TABS = 120;
const NEEDS_LOGIN = 'Defina E2E_USER_EMAIL e E2E_USER_PASSWORD de um usuário de teste.';

type FocusReport = {
  label: string;
  isOnBody: boolean;
  isObscured: boolean;
};

// O que está com foco agora e se o centro dele está coberto por outro elemento (WCAG 2.4.11).
function describeFocus(page: Page): Promise<FocusReport> {
  return page.evaluate(() => {
    let element = document.activeElement;
    while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement;
    if (!element || element === document.body) {
      return { label: 'body', isOnBody: true, isObscured: false };
    }
    const box = element.getBoundingClientRect();
    const root = element.getRootNode() as Document | ShadowRoot;
    const hit = root.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    const isObscured = !hit || !(element.contains(hit) || hit.contains(element));
    const fieldLabel = 'labels' in element ? (element as HTMLInputElement).labels?.[0] : null;
    const label =
      element.getAttribute('aria-label') ??
      fieldLabel?.textContent?.trim() ??
      element.textContent?.trim().slice(0, 40) ??
      '';
    const cover = isObscured && hit ? ` (coberto por ${hit.tagName}.${hit.className})` : '';
    return { label: `${element.tagName} ${label}${cover}`, isOnBody: false, isObscured };
  });
}

async function tabThrough(page: Page, key: 'Tab' | 'Shift+Tab', until: string) {
  const visited: string[] = [];
  for (let step = 0; step < MAX_TABS; step++) {
    await page.keyboard.press(key);
    const focus = await describeFocus(page);
    expect(focus.isOnBody, `foco perdido depois de ${visited.at(-1)}`).toBe(false);
    expect(focus.isObscured, `foco coberto em ${focus.label}`).toBe(false);
    visited.push(focus.label);
    if (focus.label.includes(until)) return visited;
  }
  throw new Error(`"${until}" não foi alcançado com ${key}: ${visited.join(' → ')}`);
}

test.describe('keyboard only', () => {
  test('the skip link comes first and jumps to the content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });

  test('walks the whole home with Tab and back with Shift+Tab', async ({ page }) => {
    await page.goto('/');
    const forward = await tabThrough(page, 'Tab', 'Tirar uma dúvida com o Orbi');
    expect(forward.join(' ')).toContain('Visão da órbita');
    await tabThrough(page, 'Shift+Tab', 'Pular para o conteúdo');
  });

  test('moves between planets and orbits', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const stops = page.locator('ol[aria-label="Paradas desta órbita"]').getByRole('button');
    await tabThrough(page, 'Tab', 'Visão da órbita');

    await page.keyboard.press('ArrowDown');
    const firstName = (await stops.nth(1).innerText()).trim();
    await expect(stops.nth(1)).toBeFocused();
    await expect(page.getByRole('heading', { level: 2, name: firstName })).toBeVisible();

    await page.keyboard.press('End');
    await expect(stops.last()).toBeFocused();
    await expect(stops.last()).toHaveAttribute('aria-current', 'step');

    const travel = page.getByRole('button', { name: /^Viajar para a órbita 2/ });
    test.skip((await travel.count()) === 0, 'Precisa de duas órbitas (cenário misto).');
    await travel.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('nav[aria-label="Trocar de órbita"]')).toContainText('Órbita 2 de', {
      timeout: 20_000,
    });
  });

  test('uses the Orbi chat', async ({ page }) => {
    await page.goto('/');
    await tabThrough(page, 'Tab', 'Tirar uma dúvida com o Orbi');
    await page.keyboard.press('Enter');
    const chat = page.getByRole('dialog', { name: 'Converse com o Orbi' });
    await expect(chat.getByRole('button', { name: 'O que é a Main?' })).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(chat.getByRole('link', { name: 'Conhecer a Main' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(chat).toBeHidden();
    await expect(page.getByRole('button', { name: 'Tirar uma dúvida com o Orbi' })).toBeFocused();
  });

  test('uses the mobile menu and keeps focus inside it', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await expect(menu.getByRole('link', { name: 'Projetos' })).toBeFocused();

    for (let step = 0; step < 10; step++) {
      await page.keyboard.press('Tab');
      const isInside = await menu.evaluate((dialog) => dialog.contains(document.activeElement));
      expect(isInside).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
  });

  test('signs in and sends the project form', async ({ page }) => {
    test.skip(!HAS_TEAM_LOGIN, NEEDS_LOGIN);
    await page.goto('/dashboard/login');
    await tabThrough(page, 'Tab', 'E-mail');
    await page.keyboard.type(TEAM_LOGIN.email);
    await page.keyboard.press('Tab');
    await page.keyboard.type(TEAM_LOGIN.password);
    await page.keyboard.press('Enter');
    await page.waitForURL(/\/dashboard$/);

    await page.goto('/dashboard/new');
    await page.getByLabel(/^Nome/).focus();
    await page.keyboard.type('Teste de teclado');
    // Publicar sem o restante dos campos não grava nada: o foco vai para o resumo do que falta.
    await tabThrough(page, 'Tab', 'Salvar e publicar');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('alert').or(page.locator('[tabindex="-1"]:focus'))).toBeVisible();
  });
});
