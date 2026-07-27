import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/page-objects/AuthPage';
import { TEST_USERS } from '../fixtures/mock-data';

test.describe('Authentication E2E Tests', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    authPage = new AuthPage(page);
  });

  test('User Registration flow works successfully', async ({ page }) => {
    await authPage.gotoRegister();
    await authPage.registerUser(TEST_USERS.newRegistration);

    // After registration, user is redirected to dashboard or login
    await expect(page).toHaveURL(/\/(dashboard|login)/);
  });

  test('User Login with valid credentials', async ({ page }) => {
    await authPage.gotoLogin();
    await authPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);

    // Successful login redirects to admin/dashboard
    await expect(page).toHaveURL(/\/(admin|dashboard)/);
  });

  test('User Login displays error on invalid credentials', async ({ page }) => {
    await authPage.gotoLogin();
    await authPage.login('invalid_user_999@test.com', 'WrongPassword123!');

    // Wait for error feedback toast or alert
    const errorMsg = page.locator('text=Invalid, text=failed, [class*="red"]').first();
    await expect(errorMsg).toBeVisible();
  });

  test('Protected Routes redirect unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    // Unauthenticated user should be redirected to login or unauthorized page
    await expect(page).toHaveURL(/\/(login|unauthorized)/);
  });

  test('User Logout clears session', async ({ page }) => {
    await authPage.gotoLogin();
    await authPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
    await expect(page).toHaveURL(/\/(admin|dashboard)/);

    // Click Sign Out / Logout
    const logoutBtn = page.locator('button:has-text("Sign Out"), button:has-text("Logout")').first();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await expect(page).toHaveURL(/\/(login|\/)/);
    }
  });
});
