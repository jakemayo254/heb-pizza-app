import { test } from '@playwright/test';
import HomePage from '@tests/e2e/pages/home.page';

test.describe('Home Page', (): void => {
  test('Test Home Page', async ({ page }): Promise<void> => {
    await page.waitForTimeout(1000);

    await test.step('', async (): Promise<void> => {
      const homePage = new HomePage(page);
      await homePage.navigateToBase();
    });
  });
});
