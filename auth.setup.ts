import { chromium } from '@playwright/test';

async function globalSetup() {
  const baseURL = process.env['HEB_PIZZA_APP_URL'] ?? '';

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL!);

  // Perform login once
  await page.getByTestId('login-username').fill(process.env['USER_NAME']!);
  await page.getByTestId('login-password').fill(process.env['USER_PASSWORD']!);
  await page.getByTestId('login-button').click();

  // Wait for successful login indicator
  await page.waitForSelector('[data-testid="app-home-header"]');

  // Save authenticated state (localStorage, cookies) into a file
  await page.context().storageState({ path: 'storageState.json' });

  await browser.close();
}

export default globalSetup;
