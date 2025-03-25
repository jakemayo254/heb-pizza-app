import { EnvTag } from '@e2e-pw/enums/env-tag';
import HomePage from '@e2e-pw/pages/home.page';
import { expect, request, test } from '@playwright/test';
import { PizzaOrder } from '@src/app/models/pizza-order.model';
import LoginPage from 'e2e-pw/pages/login.page';

const pizzaAPIURL = process.env[EnvTag.pizzaAPIBaseURL] ?? '';
const username = process.env[EnvTag.userName] ?? '';
const password = process.env[EnvTag.userPassword] ?? '';
const testTableID = process.env[EnvTag.testTableID] ?? 0;

test.beforeEach(async ({ page }): Promise<void> => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await homePage.navigateToBase();

  if (await loginPage.appLogin.isVisible()) {
    await loginPage.loginUser.fill(username);
    await loginPage.loginPassword.fill(password);
    await loginPage.loginButton.click();
  }

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
    const context = await request.newContext({ baseURL: pizzaAPIURL });

    // Fetch all orders
    const getResponse = await context.get('/api/orders');
    if (!getResponse.ok()) {
      throw new Error(`Failed to fetch orders: ${getResponse.status()} ${getResponse.statusText()}`);
    }

    const orders = await getResponse.json();
    const orderToDelete = orders.find((order: PizzaOrder): boolean => order.Table_No === Number(testTableID));

    if (orderToDelete) {
      const deleteResponse = await context.delete(`/api/orders/${orderToDelete.Order_ID}`);

      if (deleteResponse.ok()) {
        console.log(`Successfully deleted order with ID ${orderToDelete.Order_ID}`);
      } else {
        throw new Error(`Failed to delete order: ${deleteResponse.status()} ${deleteResponse.statusText()}`);
      }
    } else {
      console.log(`No existing order found for table ID ${testTableID}`);
    }

    await context.dispose();
  });

  test('submit button disabled when form is incomplete', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await homePage.newTableNoInput.fill('');
    await homePage.newSizeInput.fill('Medium');
    await homePage.newCrustInput.fill('Thin');
    await homePage.newFlavorInput.fill('Pepperoni');
    await expect(homePage.submitOrder).toBeDisabled();
  });

  test('successfully submits a new order', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await homePage.newTableNoInput.fill(testTableID.toString());
    await homePage.newSizeInput.fill('Medium');
    await homePage.newCrustInput.fill('Thin');
    await homePage.newFlavorInput.fill('Pepperoni');
    await expect(homePage.submitOrder).toBeEnabled();
    await homePage.submitOrder.click();
    await homePage.orderCard.waitFor();
  });

  test('searches orders correctly', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await homePage.searchOrder.fill(testTableID.toString());
    await expect(homePage.orderCard).toBeVisible();
  });

  test('clears search correctly', async ({ page }): Promise<void> => {
    const homePage = new HomePage(page);
    await homePage.searchOrder.fill(testTableID.toString());
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
