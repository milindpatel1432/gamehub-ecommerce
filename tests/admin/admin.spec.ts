import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/page-objects/AuthPage';
import { AdminPage } from '../fixtures/page-objects/AdminPage';
import { TEST_USERS } from '../fixtures/mock-data';

test.describe('Admin Portal E2E Tests', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    adminPage = new AdminPage(page);
    const authPage = new AuthPage(page);
    await authPage.gotoLogin();
    await authPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
  });

  test('Super Admin can access Admin Dashboard', async ({ page }) => {
    await adminPage.gotoAdmin();
    await expect(page).toHaveURL(/\/admin/);
    await expect(adminPage.adminHeader).toBeVisible();
  });

  test('Admin can navigate to Products management', async ({ page }) => {
    await adminPage.navigateTab('products');
    await expect(page).toHaveURL('/admin/products');
    const header = page.locator('h1, h2, h3').filter({ hasText: /Products/i }).first();
    await expect(header).toBeVisible();
  });

  test('Admin can navigate to Categories management', async ({ page }) => {
    await adminPage.navigateTab('categories');
    await expect(page).toHaveURL('/admin/categories');
    const header = page.locator('h1, h2, h3').filter({ hasText: /Categories/i }).first();
    await expect(header).toBeVisible();
  });

  test('Admin can navigate to Orders management', async ({ page }) => {
    await adminPage.navigateTab('orders');
    await expect(page).toHaveURL('/admin/orders');
    const header = page.locator('h1, h2, h3').filter({ hasText: /Orders/i }).first();
    await expect(header).toBeVisible();
  });
});
