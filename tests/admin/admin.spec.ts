import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/page-objects/AuthPage';
import { TEST_USERS } from '../fixtures/mock-data';

test.describe('Admin Portal E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    const authPage = new AuthPage(page);
    await authPage.gotoLogin();
    await authPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
    await page.waitForURL(/\/(admin|dashboard)/, { timeout: 10000 }).catch(() => {});
  });

  test('Super Admin can access Admin Dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin/);
    const header = page.locator('h2:has-text("Admin"), h2:has-text("GameHub Admin Console"), h2:has-text("Operations")').first();
    await expect(header).toBeVisible();
  });

  test('Admin can navigate to Products management', async ({ page }) => {
    const productsLink = page.locator('a[href="/admin/products"]').first();
    if (await productsLink.isVisible()) {
      await productsLink.click();
    } else {
      await page.goto('/admin/products');
    }
    await expect(page).toHaveURL('/admin/products');
  });

  test('Admin can navigate to Categories management', async ({ page }) => {
    const categoriesLink = page.locator('a[href="/admin/categories"]').first();
    if (await categoriesLink.isVisible()) {
      await categoriesLink.click();
    } else {
      await page.goto('/admin/categories');
    }
    await expect(page).toHaveURL('/admin/categories');
  });

  test('Admin can navigate to Orders management', async ({ page }) => {
    const ordersLink = page.locator('a[href="/admin/orders"]').first();
    if (await ordersLink.isVisible()) {
      await ordersLink.click();
    } else {
      await page.goto('/admin/orders');
    }
    await expect(page).toHaveURL('/admin/orders');
  });
});
