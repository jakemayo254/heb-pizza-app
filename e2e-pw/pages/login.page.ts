import { EnvTag } from '@e2e-pw/enums/env-tag';
import { Locator, Page } from '@playwright/test';
import { dataTestID } from '@src/app/constants/data-test-id';

import BasePage from './base.page';

const username = process.env[EnvTag.userName] ?? '';
const password = process.env[EnvTag.userPassword] ?? '';

export default class LoginPage extends BasePage {
  readonly appLogin: Locator;
  readonly loginUser: Locator;
  readonly loginPassword: Locator;
  readonly loginShowPassword: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);

    this.appLogin = page.getByTestId(dataTestID.appLogin);
    this.loginUser = this.appLogin.getByTestId(dataTestID.loginUserName);
    this.loginPassword = this.appLogin.getByTestId(dataTestID.loginPassword);
    this.loginShowPassword = this.appLogin.getByTestId(dataTestID.loginShowPassword);
    this.loginButton = this.appLogin.getByTestId(dataTestID.loginButton);
  }

  public async login(): Promise<void> {
    await this.navigateToBase();

    if (await this.appLogin.isVisible()) {
      await this.loginUser.fill(username);
      await this.loginPassword.fill(password);
      await this.loginButton.click();
    }

    await this.appLogin.waitFor({ state: 'detached' });
  }
}
