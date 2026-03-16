import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testMatch: ['**/login.spec.ts', '**/cart.spec.ts', '**/checkout.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: ['**/api/**/*.spec.ts'],
      use: {},
    },
  ],
});
