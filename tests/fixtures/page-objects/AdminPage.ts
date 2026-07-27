import { Page, Locator, expect } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly adminHeader: Locator;
  readonly productsLink: Locator;
  readonly categoriesLink: Locator;
  readonly ordersLink: Locator;
  readonly usersLink: Locator;
  readonly addProductButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminHeader = page.locator('h2:has-text("Admin"), h2:has-text("GameHub Admin Console")');
    this.productsLink = page.locator('a[href="/admin/products"]');
    this.categoriesLink = page.locator('a[href="/admin/categories"]');
    this.ordersLink = page.locator('a[href="/admin/orders"]');
    this.usersLink = page.locator('a[href="/admin/users"]');
    this.addProductButton = page.locator('button:has-text("Add Product"), button:has-text("New Product")');
  }

  async gotoAdmin() {
    await this.page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    await this.page.goto('/admin');
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async navigateTab(tabName: 'products' | 'categories' | 'orders' | 'users') {
    await this.page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    await this.page.goto(`/admin/${tabName}`);
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}
