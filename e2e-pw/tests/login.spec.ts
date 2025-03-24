import { expect, test } from '@playwright/test';

import LoginPage from '../pages/login.page';

test.describe('Login Page', () => {
  test('should render login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await expect(login.appLogin).toBeVisible();
    await expect(login.loginUser).toBeVisible();
    await expect(login.loginPassword).toBeVisible();
    await expect(login.loginButton).toBeVisible();
  });

  test('should allow user to type username and password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await login.loginUser.fill('testuser');
    await login.loginPassword.fill('password123');

    await expect(login.loginUser).toHaveValue('testuser');
    await expect(login.loginPassword).toHaveValue('password123');
  });

  test('should toggle password visibility', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await login.loginPassword.fill('password123');
    // Initially input type should be password
    await expect(login.loginPassword).toHaveAttribute('type', 'password');

    await login.loginShowPassword.click();
    // After toggle, it should be visible text
    await expect(login.loginPassword).toHaveAttribute('type', 'text');

    await login.loginShowPassword.click();
    await expect(login.loginPassword).toHaveAttribute('type', 'password');
  });

  test('should disable login button when inputs are empty', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await expect(login.loginButton).toBeDisabled();
  });

  test('should enable login button when inputs are valid', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await login.loginUser.fill('testuser');
    await login.loginPassword.fill('password123');

    await expect(login.loginButton).toBeEnabled();
  });

  // You can stub this behavior if you have API mocking setup
  test('should show loading state on login click', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await login.loginUser.fill('testuser');
    await login.loginPassword.fill('password123');

    await login.loginButton.click();
    await expect(login.loginButton).toContainText('Loading'); // You may adapt this based on exact DOM
  });
});
