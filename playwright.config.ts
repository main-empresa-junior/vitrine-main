import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
// E2E_BASE_URL aponta para um servidor já aberto (por exemplo, o npm run dev em http://localhost:3000).
const EXTERNAL_BASE_URL = process.env.E2E_BASE_URL;

// Roda contra o build de produção, que é mais rápido e fiel que o modo de desenvolvimento.
export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: EXTERNAL_BASE_URL ?? `http://localhost:${PORT}`,
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: EXTERNAL_BASE_URL
    ? undefined
    : {
        command: `npm run build && npm run start -- -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        timeout: 300_000,
        reuseExistingServer: true,
      },
});
