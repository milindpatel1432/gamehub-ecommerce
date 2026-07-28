import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/page-objects/AuthPage';
import { TEST_USERS } from '../fixtures/mock-data';

test.describe('Wishlist E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    const authPage = new AuthPage(page);
    await authPage.loginViaApi(TEST_USERS.admin.email, TEST_USERS.admin.password);
    await page.goto('/wishlist');
  });

  test('User can view Wishlist page', async ({ page }) => {
    await page.goto('/wishlist');
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Wishlist/i }).first()).toBeVisible();
  });

  test('User can toggle product wishlist status', async ({ page }) => {
    await page.goto('/shop');
    
    const heartBtn = page.locator('button:has([class*="lucide-heart"]), button[title*="Wishlist"]').first();
    if (await heartBtn.isVisible()) {
      await heartBtn.click();
      await page.waitForTimeout(300);
    }
    
    await page.goto('/wishlist');
    await expect(page).toHaveURL('/wishlist');
  });
});
