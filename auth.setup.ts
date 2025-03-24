import { chromium } from '@playwright/test';
import { dataTestID } from '@src/app/constants/data-test-id';

import { EnvTag } from './e2e-pw/enums/env-tag';

async function globalSetup(): Promise<void> {
  const baseURL = process.env[EnvTag.hebPizzaAppURL] ?? '';

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL!);

  // Perform login once
  await page.getByTestId(dataTestID.loginUserName).fill(process.env[EnvTag.userName]!);
  await page.getByTestId(dataTestID.loginPassword).fill(process.env[EnvTag.userPassword]!);
  await page.getByTestId(dataTestID.loginButton).click();

  // Wait for successful login indicator
  await page.waitForSelector(`[data-testid="${dataTestID.appHomeHeader}"]`);

  // Save authenticated state (localStorage, cookies) into a file
  await page.context().storageState({ path: 'storageState.json' });

  await browser.close();
}

export default globalSetup;
