import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/page-objects/AuthPage';
import { TEST_USERS } from '../fixtures/mock-data';

test.describe('Orders E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    const authPage = new AuthPage(page);
    await authPage.loginViaApi(TEST_USERS.admin.email, TEST_USERS.admin.password);
    await page.goto('/orders');
  });

  test('User can view Orders history page', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).toHaveURL('/orders');
    const header = page.locator('h1, h2, h3').filter({ hasText: /Orders|Library/i }).first();
    await expect(header).toBeVisible();
  });
});
