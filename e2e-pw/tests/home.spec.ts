import { test, expect } from '@playwright/test';
import LoginPage from 'e2e-pw/pages/login.page';
import HomePage from '../pages/home.page';

const baseUrl = 'http://localhost:4200'; // Adjust as needed
const testUser = { username: 'test', password: 'test' }; // Adjust as needed

// Utility function to conditionally log in
test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  if (await loginPage.appLogin.isVisible()) {
    await loginPage.loginUser.fill(testUser.username);
    await loginPage.loginPassword.fill(testUser.password);
    await loginPage.loginButton.click();
  }

  await homePage.appHomeHeader.waitFor();
});

test.describe('HomeHeaderComponent', () => {
  test('renders header correctly with username', async ({ page }) => {
    const homePage = new HomePage(page);
    await expect(homePage.appHomeHeader).toBeVisible();
    await expect(homePage.appHomeHeader).toContainText(`Welcome, ${testUser.username}`);
  });

  test('logs out successfully on desktop', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.logoutButton.click();

    await expect(new LoginPage(page).appLogin).toBeVisible();
  });

  test('opens and logs out from mobile dropdown', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const homePage = new HomePage(page);

    await homePage.mobileHamburger.click();
    await expect(homePage.mobileLogoutButton).toBeVisible();

    await homePage.mobileLogoutButton.click();
    await expect(new LoginPage(page).appLogin).toBeVisible();
  });

  test('closes mobile dropdown when resizing to desktop', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const homePage = new HomePage(page);

    await homePage.mobileHamburger.click();
    await expect(homePage.mobileLogoutButton).toBeVisible();

    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(homePage.mobileLogoutButton).toBeHidden();
  });
});

test.describe('OrderSubmitterComponent', () => {
  test('successfully submits a new order', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.newTableNoInput.fill('10');
    await homePage.newSizeInput.fill('Medium');
    await homePage.newCrustInput.fill('Thin');
    await homePage.newFlavorInput.fill('Pepperoni');

    await expect(homePage.submitOrder).toBeEnabled();
    await homePage.submitOrder.click();

    await expect(page.getByText('Order added successfully.')).toBeVisible();
  });

  test('submit button disabled when form is incomplete', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.newTableNoInput.fill('');
    await homePage.newSizeInput.fill('Medium');
    await homePage.newCrustInput.fill('Thin');
    await homePage.newFlavorInput.fill('Pepperoni');

    await expect(homePage.submitOrder).toBeDisabled();
  });
});

test.describe('OrderViewerComponent', () => {
  test('displays orders correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await expect(homePage.appOrderViewer).toBeVisible();
    await expect(homePage.orderCard).toBeVisible();
  });

  test('searches orders correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.searchOrder.fill('Pepperoni');
    await expect(homePage.orderCard).toContainText('Pepperoni');
  });

  test('clears search correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.searchOrder.fill('Pepperoni');
    await homePage.clearSearchOrder.click();
    await expect(homePage.searchOrder).toHaveValue('');
  });

  test('deletes an order successfully', async ({ page }) => {
    const homePage = new HomePage(page);

    page.once('dialog', dialog => dialog.accept());
    await homePage.deleteOrder.click();

    await expect(page.getByText('Success')).toBeVisible();
  });
});

test.describe('HomeFooterComponent', () => {
  test('renders footer correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await expect(homePage.appHomeFooter).toBeVisible();
    await expect(homePage.appHomeFooter).toContainText('Made By Jake Mayo 2025');
  });
});