import { Locator, Page } from '@playwright/test';
import { dataTestID } from '@src/app/models/data-test-id';
import BasePage from '@tests/e2e/pages/base.page';

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
}
