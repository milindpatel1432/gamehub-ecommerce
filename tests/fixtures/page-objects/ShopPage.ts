import { Page, Locator, expect } from '@playwright/test';

export class ShopPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly sortButton: Locator;
  readonly productCards: Locator;
  readonly filterSidebar: Locator;
  readonly paginationContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder*="Search"]');
    this.sortButton = page.locator('button:has-text("Sort By:"), button:has-text("Newest"), button:has-text("Price:")');
    this.productCards = page.locator('.grid > div, article');
    this.filterSidebar = page.locator('aside, [class*="FilterSidebar"]');
    this.paginationContainer = page.locator('nav, [class*="pagination"]');
  }

  async gotoShop() {
    await this.page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    await this.page.goto('/shop');
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async searchProduct(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForTimeout(600); // Allow search debounce
  }

  async selectSortOption(sortOptionText: string) {
    if (await this.sortButton.isVisible()) {
      await this.sortButton.click();
      const option = this.page.locator(`button:has-text("${sortOptionText}")`);
      if (await option.isVisible()) {
        await option.click();
      }
    }
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }
}
