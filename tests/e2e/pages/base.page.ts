import { BrowserContext, expect, Page } from '@playwright/test';

export default class BasePage {
  readonly page: Page;
  readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env['HEB_PIZZA_APP_URL'] ?? '';
    console.log('Jake');
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(this.baseUrl + path);
  }

  async navigateToBase() {
    await this.page.goto(this.baseUrl);
  }

  async toMobileView() {
    await this.page.setViewportSize({ width: 1020, height: 1020 });
  }

  async toDesktopView() {
    await this.page.setViewportSize({ width: 2400, height: 1100 });
  }

  async verifyNewPageOpensAndThenCloseIt(context: BrowserContext, urlPath: string): Promise<void> {
    const newPage = await context.waitForEvent('page');
    const newURL = newPage.url();
    expect(newURL).toEqual(urlPath);
    await newPage.close();
  }
}
