import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly productList: Locator;
  readonly cartIcon: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page        = page;
    this.productList = page.locator('.inventory_item');
    this.cartIcon    = page.locator('.shopping_cart_link');
    this.pageTitle   = page.locator('.title');
  }

  async getProductCount(): Promise<number> {
    return await this.productList.count();
  }

  async addFirstItemToCart() {
    await this.page.locator('.btn_inventory').first().click();
  }
}