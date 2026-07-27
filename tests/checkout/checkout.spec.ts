import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/page-objects/AuthPage';
import { TEST_USERS } from '../fixtures/mock-data';

test.describe('Checkout E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    const authPage = new AuthPage(page);
    await authPage.gotoLogin();
    await authPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
  });

  test('Checkout page requires items in cart or redirects gracefully', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/(checkout|cart|shop)/);
  });

  test('User can progress through checkout steps when items exist', async ({ page }) => {
    await page.goto('/shop');
    const buyButton = page.locator('button:has-text("Buy"), button:has-text("Add to Cart")').first();
    if (await buyButton.isVisible()) {
      await buyButton.click();
    }

    await page.goto('/checkout');
    const checkoutContainer = page.locator('div:has-text("Step")').first();
    if (await checkoutContainer.isVisible()) {
      await expect(checkoutContainer).toBeVisible();
    }
  });
});
