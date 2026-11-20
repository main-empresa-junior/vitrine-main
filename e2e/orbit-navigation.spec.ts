import { expect, type Page, test } from '@playwright/test';

const ORBIT_SWITCHER = 'nav[aria-label="Trocar de órbita"]';
const STOP_TRAIL = 'ol[aria-label="Paradas desta órbita"]';
const NEEDS_TWO_ORBITS =
  'Precisa de pelo menos 8 projetos publicados (cenário duas-orbitas da branch test-data).';

async function openHome(page: Page, hash = ''): Promise<void> {
  await page.goto(`/${hash}`);
  await expect(page.locator('section[aria-label="Viagem pela órbita de projetos"]')).toBeVisible();
}

async function hasTwoOrbits(page: Page): Promise<boolean> {
  return (await page.getByRole('button', { name: /^Viajar para a órbita 2/ }).count()) > 0;
}

// Escondido = dentro de uma camada inert (sem foco, clique nem leitor de tela) e sem opacidade.
async function expectHiddenLayer(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  if ((await element.count()) === 0) return;
  await expect
    .poll(() =>
      element.evaluate((node) => {
        const layer = node.closest('[inert]');
        return layer !== null && getComputedStyle(layer).opacity === '0';
      }),
    )
    .toBe(true);
}

async function expectOrbitUiHidden(page: Page): Promise<void> {
  await expectHiddenLayer(page, ORBIT_SWITCHER);
  await expectHiddenLayer(page, STOP_TRAIL);
}

async function scrollToOrbitTop(page: Page): Promise<void> {
  await page.mouse.move(700, 450);
  for (
    let attempt = 0;
    attempt < 40 && (await page.evaluate(() => window.scrollY)) > 0;
    attempt++
  ) {
    await page.mouse.wheel(0, -1500);
    await page.waitForTimeout(50);
  }
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
}

async function travelToSecondOrbit(page: Page): Promise<void> {
  await page.getByRole('button', { name: /^Viajar para a órbita 2/ }).click();
  await expect(page.getByText('Rumo à órbita 2')).toBeVisible();
  await expect(page.locator(ORBIT_SWITCHER)).toContainText('Órbita 2 de', { timeout: 20_000 });
  await expect(page.getByRole('button', { name: 'Voltar para a órbita 1' })).toBeEnabled();
}

test.describe('orbit interface visibility', () => {
  for (const hash of ['#todos', '#sobre']) {
    test(`is hidden when arriving at ${hash}`, async ({ page }) => {
      await openHome(page, hash);
      await expectOrbitUiHidden(page);
    });
  }

  test('is hidden after scrolling down to "Todos os projetos"', async ({ page }) => {
    await openHome(page);
    await expect(page.locator(ORBIT_SWITCHER)).toBeVisible();
    await page.locator('#todos').scrollIntoViewIfNeeded();
    await expectOrbitUiHidden(page);
  });
});

test.describe('orbit travel after anchor navigation', () => {
  for (const hash of ['#sobre', '#todos']) {
    test(`works after arriving at ${hash} and scrolling back up`, async ({ page }) => {
      await openHome(page, hash);
      await scrollToOrbitTop(page);
      test.skip(!(await hasTwoOrbits(page)), NEEDS_TWO_ORBITS);
      await travelToSecondOrbit(page);
    });
  }

  test('works after leaving the home and coming back through a link to #sobre', async ({
    page,
  }) => {
    await openHome(page);
    test.skip(!(await hasTwoOrbits(page)), NEEDS_TWO_ORBITS);
    await page.locator('#todos').scrollIntoViewIfNeeded();
    await page.locator('#todos a[href^="/projects/"]').first().click();
    await expect(page).toHaveURL(/\/projects\//);
    await page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: 'Sobre a Main' })
      .click();
    await expect(page).toHaveURL(/\/#sobre$/);
    await scrollToOrbitTop(page);
    await travelToSecondOrbit(page);
  });

  test('shows the trip when the travel button is clicked as soon as it scrolls into view', async ({
    page,
  }) => {
    await openHome(page, '#sobre');
    const travelButton = page.getByRole('button', { name: /^Viajar para a órbita 2/ });
    test.skip((await travelButton.count()) === 0, NEEDS_TWO_ORBITS);
    await page.mouse.move(700, 450);
    const isOnScreen = () =>
      travelButton.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return box.height > 0 && box.top >= 0 && box.bottom <= window.innerHeight;
      });
    for (let attempt = 0; attempt < 80 && !(await isOnScreen()); attempt++) {
      await page.mouse.wheel(0, -120);
      await page.waitForTimeout(30);
    }
    await expect(travelButton).toBeInViewport();
    await travelButton.click();
    await expect(page.getByText('Rumo à órbita 2')).toBeInViewport();
    await expect(page.locator(ORBIT_SWITCHER)).toContainText('Órbita 2 de', { timeout: 20_000 });
  });

  test('works when opening the home from the top', async ({ page }) => {
    await openHome(page);
    test.skip(!(await hasTwoOrbits(page)), NEEDS_TWO_ORBITS);
    await travelToSecondOrbit(page);
  });
});
