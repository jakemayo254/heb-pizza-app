import { EnvTag } from '@e2e-pw/enums/env-tag';
import { Locator, Page } from '@playwright/test';
import { dataTestID } from '@src/app/constants/data-test-id';

import BasePage from './base.page';

export default class HomePage extends BasePage {
  readonly appHome: Locator;
  readonly appOrderViewer: Locator;
  readonly appOrderSubmitter: Locator;
  readonly appHomeHeader: Locator;
  readonly appHomeBody: Locator;
  readonly appHomeFooter: Locator;
  readonly logoutButton: Locator;
  readonly mobileHamburger: Locator;
  readonly mobileLogoutButton: Locator;
  readonly searchOrder: Locator;
  readonly clearSearchOrder: Locator;
  readonly orderCard: Locator;
  readonly deleteOrder: Locator;
  readonly newTableNoInput: Locator;
  readonly newSizeInput: Locator;
  readonly newCrustInput: Locator;
  readonly newFlavorInput: Locator;
  readonly submitOrder: Locator;

  constructor(page: Page) {
    super(page);

    this.appHome = page.getByTestId(dataTestID.appHome);

    // Home Header
    this.appHomeHeader = this.appHome.getByTestId(dataTestID.appHomeHeader);
    this.logoutButton = this.appHomeHeader.getByTestId(dataTestID.logoutButton);
    this.mobileHamburger = this.appHomeHeader.getByTestId(dataTestID.mobileHamburger);
    this.mobileLogoutButton = this.appHomeHeader.getByTestId(dataTestID.mobileLogoutButton);

    // Home Body
    this.appHomeBody = this.appHome.getByTestId(dataTestID.appHomeBody);
    this.appOrderSubmitter = this.appHomeBody.getByTestId(dataTestID.appOrderSubmitter);
    this.newTableNoInput = this.appOrderSubmitter.getByTestId(dataTestID.newTableNoInput);
    this.newSizeInput = this.appOrderSubmitter.getByTestId(dataTestID.newSizeInput);
    this.newCrustInput = this.appOrderSubmitter.getByTestId(dataTestID.newCrustInput);
    this.newFlavorInput = this.appOrderSubmitter.getByTestId(dataTestID.newFlavorInput);
    this.submitOrder = this.appOrderSubmitter.getByTestId(dataTestID.submitOrder);
    this.appOrderViewer = this.appHomeBody.getByTestId(dataTestID.appOrderViewer);
    this.searchOrder = this.appHomeBody.getByTestId(dataTestID.searchOrder);
    this.clearSearchOrder = this.appHomeBody.getByTestId(dataTestID.clearSearchOrder);

    const testOrderID = process.env[EnvTag.testTableID];
    this.orderCard = this.appHomeBody.getByTestId(dataTestID.orderCard + testOrderID);
    this.deleteOrder = this.appHomeBody.getByTestId(dataTestID.deleteOrder + testOrderID);

    // Home Footer
    this.appHomeFooter = this.appHome.getByTestId(dataTestID.appHomeFooter);
  }

  public async fillNewOrder(tableID: string, size: string, crust: string, flavor: string): Promise<void> {
    await this.newTableNoInput.fill(tableID);
    await this.newSizeInput.fill(size);
    await this.newCrustInput.fill(crust);
    await this.newFlavorInput.fill(flavor);
  }
}
