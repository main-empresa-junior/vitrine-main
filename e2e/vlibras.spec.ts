import { expect, type Locator, type Page, test } from '@playwright/test';

const VLIBRAS_HOST = '**://vlibras.gov.br/**';
const VLIBRAS_WRAPPER = '#vlibras-access-wrapper';
const LOAD_TIMEOUT = 30_000;

function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function expectApart(first: Locator, second: Locator) {
  const [a, b] = await Promise.all([first.boundingBox(), second.boundingBox()]);
  expect(a).not.toBeNull();
  expect(b).not.toBeNull();
  if (!a || !b) return;
  const overlaps =
    a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
  expect(overlaps).toBe(false);
}

test.describe('VLibras unavailable', () => {
  test('home and login work when the script is blocked', async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.route(VLIBRAS_HOST, (route) => route.abort());

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tirar uma dúvida com o Orbi' })).toBeVisible();

    await page.goto('/dashboard/login');
    await expect(page.getByRole('heading', { name: 'Área da equipe' })).toBeVisible();
    await expect(page.getByLabel(/^E-mail/)).toBeEditable();
    expect(errors).toEqual([]);
  });
});

for (const width of [390, 1440] as const) {
  test.describe(`VLibras at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('shows one reachable button that stays clear of the Orbi and the orbit UI', async ({
      page,
    }) => {
      await page.goto('/');
      const vlibrasButton = page.getByRole('button', { name: /VLibras/ });
      await expect(vlibrasButton).toBeVisible({ timeout: LOAD_TIMEOUT });
      await expect(page.locator(VLIBRAS_WRAPPER)).toHaveCount(1);

      await vlibrasButton.focus();
      await expect(vlibrasButton).toBeFocused();
      await expectApart(
        vlibrasButton,
        page.getByRole('button', { name: 'Tirar uma dúvida com o Orbi' }),
      );
      const switcher = page.locator('nav[aria-label="Trocar de órbita"]');
      if ((await switcher.count()) > 0) await expectApart(vlibrasButton, switcher);
      const trail = page.locator('ol[aria-label="Paradas desta órbita"]');
      if (await trail.isVisible()) await expectApart(vlibrasButton, trail);

      await page.locator('a[href^="/projects/"]').first().click();
      await page.waitForURL(/\/projects\//);
      await page.locator('header a[href="/"]').click();
      await page.waitForURL((url) => url.pathname === '/');
      await expect(page.locator(VLIBRAS_WRAPPER)).toHaveCount(1);
      await expect(vlibrasButton).toBeVisible();
    });
  });
}
