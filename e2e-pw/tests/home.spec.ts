import { EnvTag } from '@e2e-pw/enums/env-tag';
import HomePage from '@e2e-pw/pages/home.page';
import { deleteTestOrder } from '@e2e-pw/utils/order-deleter';
import { expect, test } from '@playwright/test';
import LoginPage from 'e2e-pw/pages/login.page';

const username = process.env[EnvTag.userName] ?? '';
const testTableID = process.env[EnvTag.testTableID] ?? '';

test.beforeEach(async ({ page }): Promise<void> => {
  const loginPage = new LoginPage(page);
  await loginPage.login();

  const homePage = new HomePage(page);
  await homePage.appHomeHeader.waitFor();
});

test.describe('Home Header Component', (): void => {
  test('renders header correctly with username', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await expect(homePage.appHomeHeader).toBeVisible();
    await expect(homePage.appHomeHeader).toContainText(`Welcome, ${username}`);
  });

  test('logs out successfully on desktop', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await homePage.logoutButton.click();
    await expect(new LoginPage(page).appLogin).toBeVisible();
  });

  test('opens and logs out from mobile dropdown', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await homePage.toMobileView();
    await homePage.mobileHamburger.click();
    await expect(homePage.mobileLogoutButton).toBeVisible();
    await homePage.mobileLogoutButton.click();
    await expect(new LoginPage(page).appLogin).toBeVisible();
  });

  test('closes mobile dropdown when resizing to desktop', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await homePage.toMobileView();
    await homePage.mobileHamburger.click();
    await expect(homePage.mobileLogoutButton).toBeVisible();
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(homePage.mobileLogoutButton).toBeHidden();
  });
});

test.describe('Order Submitter/Viewer Component', (): void => {
  test.beforeAll(async (): Promise<void> => {
    await deleteTestOrder();
  });

  test('submit button disabled when form is incomplete', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await homePage.fillNewOrder('', 'Medium', 'Thin', 'Pepperoni');
    await expect(homePage.submitOrder).toBeDisabled();
  });

  test('successfully submits a new order', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await homePage.fillNewOrder(testTableID, 'Medium', 'Thin', 'Pepperoni');
    await expect(homePage.submitOrder).toBeEnabled();
    await homePage.submitOrder.click();
    await homePage.orderCard.waitFor();
  });

  test('searches orders correctly', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await homePage.searchOrder.fill(testTableID);
    await expect(homePage.orderCard).toBeVisible();
  });

  test('clears search correctly', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await homePage.searchOrder.fill(testTableID);
    await homePage.clearSearchOrder.click();
    await expect(homePage.searchOrder).toHaveValue('');
  });

  test('deletes an order successfully', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    page.once('dialog', (dialog): Promise<void> => dialog.accept());
    await homePage.deleteOrder.click();
    await expect(homePage.orderCard).not.toBeVisible();
  });
});

test.describe('Home Footer Component', (): void => {
  test('renders footer correctly', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await expect(homePage.appHomeFooter).toBeVisible();
    await expect(homePage.appHomeFooter).toContainText('Made By Jake Mayo 2025');
  });
});
