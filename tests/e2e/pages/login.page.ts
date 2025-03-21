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

  // async sendMessageToChatBot(prompt: string) {
  //   await this.chatInput.fill(prompt);
  //   await this.sendInput.click();
  //   await expect(this.loadingMessage).toBeVisible();
  //   await expect(this.loadingMessage).toHaveCount(0);
  //   await expect(this.chatBotPrompt).toContainText(prompt);
  // }
  //
  // async testPromptResponse(prompt: string, expectedResponse: RegExp) {
  //   await this.sendMessageToChatBot(prompt);
  //   await expect(this.chatBotResponse).toContainText(expectedResponse);
  // }
  //
  // async closeWindowIfVisible() {
  //   await this.page.waitForTimeout(3000);
  //   await this.closeSplashButton.waitFor();
  //   await this.closeSplashButton.click();
  //   await this.page.waitForTimeout(3000);
  //   await this.acceptTermsAndConditionsLbl.waitFor();
  //   await this.acceptTermsAndConditionsLbl.click();
  //   await this.page.waitForTimeout(3000);
  //   await this.closeButton.waitFor();
  //   await this.closeButton.click();
  // }
}
