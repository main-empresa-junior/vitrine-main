import { expect, type Page, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });

const STOP_TRAIL = 'ol[aria-label="Paradas desta órbita"]';
const VEIL = '[data-scene-veil]';
const NEEDS_TWO_ORBITS = 'Precisa de pelo menos 8 projetos publicados (cenário misto).';

// Guarda a maior opacidade do véu desde a última chamada, quadro a quadro.
async function watchVeil(page: Page) {
  await page.evaluate((selector) => {
    const veil = document.querySelector<HTMLElement>(selector);
    const record = window as unknown as { maxVeil: number };
    record.maxVeil = 0;
    function sample() {
      record.maxVeil = Math.max(record.maxVeil, Number(veil?.style.opacity || 0));
      requestAnimationFrame(sample);
    }
    sample();
  }, VEIL);
}

// A cena escreve a opacidade do véu a cada quadro; antes do primeiro quadro ela está vazia.
async function waitForFirstFrame(page: Page) {
  await expect.poll(() => page.locator(VEIL).evaluate((veil) => veil.style.opacity)).toBe('0');
}

function maxVeil(page: Page): Promise<number> {
  return page.evaluate(() => (window as unknown as { maxVeil: number }).maxVeil);
}

test.describe('reduced motion journey', () => {
  test('fades to dark between planets and shows the right project', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    await watchVeil(page);

    const stops = page.locator(STOP_TRAIL).getByRole('button');
    await waitForFirstFrame(page);
    const target = stops.nth(2);
    const name = (await target.innerText()).trim();
    await target.click();

    const sheetTitle = page.getByRole('heading', { level: 2, name });
    await expect(sheetTitle).toBeVisible();
    expect(await maxVeil(page)).toBe(1);
    await expect.poll(() => page.locator(VEIL).evaluate((veil) => veil.style.opacity)).toBe('0');
  });

  test('changes orbit with a fade instead of the rocket trip', async ({ page }) => {
    await page.goto('/');
    const travel = page.getByRole('button', { name: /^Viajar para a órbita 2/ });
    test.skip((await travel.count()) === 0, NEEDS_TWO_ORBITS);
    await expect(page.locator(STOP_TRAIL).getByRole('button').first()).toHaveAttribute(
      'aria-current',
      'step',
    );
    await watchVeil(page);

    await travel.click();
    await expect(page.getByText('Chegando à órbita 2')).toBeVisible();
    await expect(page.getByText('Rumo à órbita 2')).toHaveCount(0);
    await expect(page.locator('nav[aria-label="Trocar de órbita"]')).toContainText('Órbita 2 de');
    expect(await maxVeil(page)).toBe(1);
  });
});
