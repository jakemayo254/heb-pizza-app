import { test } from '@playwright/test';
import LoginPage from '@tests/e2e/pages/login.page';

test.describe('Login', () => {
  test('Test Login', async ({ page }) => {
    await page.waitForTimeout(1000);

    await test.step('Login & Logout', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.navigateToBase();
    });
  });
});
