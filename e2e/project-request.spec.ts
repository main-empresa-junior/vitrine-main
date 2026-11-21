import { expect, type Page, test } from '@playwright/test';

import { expectNoAxeViolations, HAS_TEAM_LOGIN, signIn } from './support/a11y';

// Pedidos de teste começam com "seed-": o comando reset da branch test-data apaga todos.
const TEST_PREFIX = 'seed-e2e';
// O formulário recusa envios mais rápidos que 3 segundos; o teste espera um pouco mais.
const HUMAN_PAUSE_MS = 3200;

function uniqueName(label: string): string {
  return `${TEST_PREFIX} ${label} ${Date.now().toString(36)}`;
}

// Cada teste vem de um "IP" diferente, para o limite de envios de um não atrapalhar o outro.
async function sendFromOwnAddress(page: Page) {
  const octet = () => Math.floor(Math.random() * 250) + 1;
  await page.setExtraHTTPHeaders({ 'x-forwarded-for': `10.${octet()}.${octet()}.${octet()}` });
}

async function fillRequest(page: Page, clientName: string) {
  await page.getByLabel(/^Nome do cliente ou da empresa/).fill(clientName);
  await page
    .getByLabel(/^Descreva o sistema que você precisa/)
    .fill('Um sistema de encomendas para os clientes pedirem pães e bolos pelo celular.');
  await page.getByRole('radio', { name: /^Web e mobile/ }).check();
  await page.getByLabel(/^E-mail para contato/).fill('teste@exemplo.com');
  await page.getByRole('radio', { name: 'E-mail' }).check();
  await page.getByRole('checkbox', { name: /Autorizo a Main/ }).check();
}

async function openForm(page: Page) {
  await sendFromOwnAddress(page);
  await page.goto('/solicitar-projeto');
  await expect(page.getByRole('heading', { level: 1, name: 'Solicitar projeto' })).toBeVisible();
}

async function send(page: Page) {
  await page.waitForTimeout(HUMAN_PAUSE_MS);
  await page.getByRole('button', { name: 'Enviar pedido' }).click();
}

const CONFIRMATION = /Recebemos seu pedido! Vamos entrar em contato em breve pelo seu e-mail\./;

test.describe('project request', () => {
  test('sends a request and shows Orbi confirming it', async ({ page }) => {
    const clientName = uniqueName('Padaria');
    await openForm(page);
    await fillRequest(page, clientName);
    await send(page);

    const confirmation = page.getByText(CONFIRMATION);
    await expect(confirmation).toBeVisible();
    await expect(page.getByLabel('Pedido enviado')).toBeFocused();
    await expect(page.getByRole('link', { name: 'Voltar ao início' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver nossos projetos' })).toBeVisible();
    await expectNoAxeViolations(page);

    test.skip(!HAS_TEAM_LOGIN, 'Conferir no painel precisa de E2E_USER_EMAIL e E2E_USER_PASSWORD.');
    await signIn(page);
    await page.goto('/dashboard/requests');
    const card = page.getByRole('article', { name: clientName });
    await expect(card).toBeVisible();
    await card.getByLabel('Status do pedido').selectOption('contacted');
    await expect(page.getByText('Status do pedido atualizado.')).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test('asks for the phone when the person prefers a call and refuses past dates', async ({
    page,
  }) => {
    await openForm(page);
    await expectNoAxeViolations(page);
    await fillRequest(page, uniqueName('Validação'));
    await page.getByRole('radio', { name: 'Telefone' }).check();
    await page.getByLabel(/^Tem um prazo/).fill('2020-01-01');
    await page.getByRole('button', { name: 'Enviar pedido' }).click();

    const summary = page.getByRole('alert', { name: 'Confira antes de enviar' });
    await expect(summary).toBeFocused();
    await expect(summary).toContainText(
      'Informe o telefone, já que você prefere contato por telefone.',
    );
    await expect(summary).toContainText('Escolha uma data a partir de hoje.');
    await expect(page.getByLabel(/^Nome do cliente/)).not.toHaveValue('');

    await page.getByLabel(/^Telefone para contato/).fill('44998765432');
    await expect(page.getByLabel(/^Telefone para contato/)).toHaveValue('(44) 99876-5432');
  });

  test('quietly drops requests from robots', async ({ page }) => {
    await openForm(page);
    await fillRequest(page, uniqueName('Robô'));
    // Robôs preenchem o campo escondido de pessoas.
    await page.locator('#website').evaluate((input: HTMLInputElement) => {
      input.value = 'https://spam.example';
    });
    await send(page);
    await expect(page.getByText(CONFIRMATION)).toBeVisible();
  });

  test('limits how many requests the same address can send', async ({ page }) => {
    test.setTimeout(120_000);
    await sendFromOwnAddress(page);
    for (let attempt = 1; attempt <= 3; attempt++) {
      await page.goto('/solicitar-projeto');
      await fillRequest(page, uniqueName(`Limite ${attempt}`));
      await send(page);
      await expect(page.getByText(CONFIRMATION)).toBeVisible();
    }
    await page.goto('/solicitar-projeto');
    await fillRequest(page, uniqueName('Limite 4'));
    await send(page);
    await expect(
      page.getByRole('alert', { name: 'Seu pedido ainda não foi enviado' }),
    ).toContainText('Recebemos vários pedidos daqui');
    await expect(page.getByLabel(/^Nome do cliente/)).not.toHaveValue('');
  });
});
