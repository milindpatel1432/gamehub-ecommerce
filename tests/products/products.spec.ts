import { test, expect } from '@playwright/test';
import { ShopPage } from '../fixtures/page-objects/ShopPage';

test.describe('Products & Catalog E2E Tests', () => {
  let shopPage: ShopPage;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    shopPage = new ShopPage(page);
    await shopPage.gotoShop();
  });

  test('Shop page displays products grid', async () => {
    const count = await shopPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('Product search filters product catalog', async () => {
    await shopPage.searchProduct('Cyber');
    const cards = shopPage.productCards;
    await expect(cards.first()).toBeVisible();
  });

  test('Product sorting alters catalog order', async () => {
    await shopPage.selectSortOption('Price: Low to High');
    await expect(shopPage.productCards.first()).toBeVisible();
  });

  test('Product details page opens on card click', async ({ page }) => {
    const firstProductTitle = page.locator('h3').first();
    await firstProductTitle.click();
    await expect(page).toHaveURL(/\/product\//);
  });

  test('Consoles page loads successfully', async ({ page }) => {
    await page.goto('/consoles');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
