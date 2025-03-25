import { EnvTag } from '@e2e-pw/enums/env-tag';
import { Page } from '@playwright/test';

export default class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env[EnvTag.hebPizzaAppURL] ?? '';
  }

  public async navigateToBase(): Promise<void> {
    await this.page.goto(this.baseUrl);
  }

  async toMobileView(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async toDesktopView(): Promise<void> {
    await this.page.setViewportSize({ width: 2400, height: 1100 });
  }
}
