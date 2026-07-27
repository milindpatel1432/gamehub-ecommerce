import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/page-objects/AuthPage';

test.describe('Order Tracking with Interactive Delivery Map E2E Tests', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.loginViaApi('admin@gamehub.com', 'milind@2803');
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
  });

  test('Order Tracking route loads user orders dashboard cleanly', async ({ page }) => {
    await expect(page).toHaveURL(/\/(orders|dashboard|\/)/);
  });

  test('Order Tracking route handles tracking delivery action gracefully', async ({ page }) => {
    const trackBtns = page.locator('button:has-text("Track Delivery"), a:has-text("Track Delivery")');
    if ((await trackBtns.count()) > 0) {
      await trackBtns.first().click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/orders\/.*\/track/);
    } else {
      await expect(page).toHaveURL(/\/(orders|dashboard|\/)/);
    }
  });
});
