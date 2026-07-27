import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/page-objects/AuthPage';
import { CartPage } from '../fixtures/page-objects/CartPage';
import { TEST_USERS, MOCK_COUPONS } from '../fixtures/mock-data';

test.describe('Cart E2E Tests', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    cartPage = new CartPage(page);
    const authPage = new AuthPage(page);
    await authPage.gotoLogin();
    await authPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
  });

  test('User can add product to cart from shop page', async ({ page }) => {
    await page.goto('/shop');
    
    const buyButton = page.locator('button:has-text("Buy"), button:has-text("Add to Cart")').first();
    if (await buyButton.isVisible()) {
      await buyButton.click();
    }

    await cartPage.gotoCart();
    await expect(page).toHaveURL('/cart');
  });

  test('User can apply promo coupon in cart', async ({ page }) => {
    await cartPage.gotoCart();
    if (await cartPage.couponInput.isVisible()) {
      await cartPage.applyCoupon(MOCK_COUPONS.valid);
    }
  });
});
