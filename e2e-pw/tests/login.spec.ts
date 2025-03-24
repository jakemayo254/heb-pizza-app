import { expect, test } from '@playwright/test';

import LoginPage from '../pages/login.page';

test.describe('Login Page', (): void => {
  // This gets rid of the stored username and password
  // its originally stored for other tests that are past the login
  // we don't want to have to login for each test so we store the auth token
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should render login page', async ({ page }): Promise<void> => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await expect(login.appLogin).toBeVisible();
    await expect(login.loginUser).toBeVisible();
    await expect(login.loginPassword).toBeVisible();
    await expect(login.loginButton).toBeVisible();
  });

  test('should allow user to type username and password', async ({ page }): Promise<void> => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await login.loginUser.fill('test-user');
    await login.loginPassword.fill('password123');
    await expect(login.loginUser).toHaveValue('test-user');
    await expect(login.loginPassword).toHaveValue('password123');
  });

  test('should toggle password visibility', async ({ page }): Promise<void> => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await login.loginPassword.fill('password123');
    await expect(login.loginPassword).toHaveAttribute('type', 'password');
    await login.loginShowPassword.click();
    await expect(login.loginPassword).toHaveAttribute('type', 'text');
    await login.loginShowPassword.click();
    await expect(login.loginPassword).toHaveAttribute('type', 'password');
  });

  test('should disable login button when inputs are empty', async ({ page }): Promise<void> => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await expect(login.loginButton).toBeDisabled();
  });

  test('should enable login button when inputs are valid', async ({ page }): Promise<void> => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await login.loginUser.fill('test-user');
    await login.loginPassword.fill('password123');
    await expect(login.loginButton).toBeEnabled();
  });

  test('should show loading state on login click', async ({ page }): Promise<void> => {
    const login = new LoginPage(page);
    await login.navigateToBase();
    await login.loginUser.fill('test-user');
    await login.loginPassword.fill('password123');
    await login.loginButton.click();
    await expect(login.loginButton).toContainText('Loading');
  });
});
