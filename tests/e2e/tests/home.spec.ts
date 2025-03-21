import { test } from '@playwright/test';
import HomePage from '@tests/e2e/pages/home.page';

test.describe('Home Page', () => {
  test('Test Home Page', async ({ page }) => {
    await page.waitForTimeout(1000);

    await test.step('', async () => {
      const homePage = new HomePage(page);
      await homePage.navigateToBase();
    });
  });
});
