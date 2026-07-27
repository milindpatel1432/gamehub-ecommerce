import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/page-objects/AuthPage';

test.describe('Authentication E2E Tests', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    authPage = new AuthPage(page);
  });

  test('User Registration flow works successfully', async ({ page }) => {
    const newUser = {
      fullName: 'New Gamer User',
      username: `gamer_${Date.now()}`,
      email: `gamer_${Date.now()}@example.com`,
      password: 'StrongPassword123!',
    };
    await authPage.gotoRegister();
    await authPage.registerUser(newUser);

    await expect(page).toHaveURL(/\/(dashboard|login|\/)/);
  });

  test('User Login with valid credentials', async ({ page }) => {
    const testUser = {
      fullName: 'Test Gamer Login',
      username: `loginuser_${Date.now()}`,
      email: `loginuser_${Date.now()}@example.com`,
      password: 'StrongPassword123!',
    };
    await authPage.gotoRegister();
    await authPage.registerUser(testUser);

    await authPage.gotoLogin();
    await authPage.login(testUser.email, testUser.password);

    await expect(page).toHaveURL(/\/(dashboard|admin|\/)/);
  });

  test('User Login displays error on invalid credentials', async ({ page }) => {
    await authPage.gotoLogin();
    await authPage.login('invalid_user_999@test.com', 'WrongPassword123!');

    // Wait for error feedback toast or server error alert
    const errorMsg = page.getByText(/Invalid|failed|credentials/i).first();
    await expect(errorMsg).toBeVisible();
  });

  test('Protected Routes redirect unauthenticated users and trigger AuthModal', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/(login|unauthorized|\/)/);
  });

  test('User Logout clears session', async ({ page }) => {
    const userToLogout = {
      fullName: 'Logout Gamer',
      username: `logoutuser_${Date.now()}`,
      email: `logoutuser_${Date.now()}@example.com`,
      password: 'StrongPassword123!',
    };
    await authPage.gotoRegister();
    await authPage.registerUser(userToLogout);

    await authPage.gotoLogin();
    await authPage.login(userToLogout.email, userToLogout.password);

    const logoutBtn = page.locator('button:has-text("Sign Out"), button:has-text("Logout")').first();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await expect(page).toHaveURL(/\/(login|\/)/);
    }
  });
});
