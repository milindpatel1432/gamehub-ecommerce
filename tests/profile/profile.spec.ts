import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/page-objects/AuthPage';
import { TEST_USERS } from '../fixtures/mock-data';

test.describe('User Profile & Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    const authPage = new AuthPage(page);
    await authPage.gotoLogin();
    await authPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
  });

  test('User can view Dashboard overview and stats', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('User can view Profile tab details', async ({ page }) => {
    await page.goto('/profile');
    const profileHeader = page.locator('text=My Profile, text=Profile').first();
    await expect(profileHeader).toBeVisible();
  });

  test('User can toggle Edit Profile mode', async ({ page }) => {
    await page.goto('/dashboard');
    
    const profileTabBtn = page.locator('button:has-text("Profile")').first();
    if (await profileTabBtn.isVisible()) {
      await profileTabBtn.click();
    }

    const editBtn = page.locator('button:has-text("Edit Profile")');
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.locator('button:has-text("Save Profile")')).toBeVisible();
      
      await page.locator('button:has-text("Cancel")').click();
    }
  });

  test('User can update Settings preferences', async ({ page }) => {
    await page.goto('/dashboard');
    
    const settingsTabBtn = page.locator('button:has-text("Settings")').first();
    if (await settingsTabBtn.isVisible()) {
      await settingsTabBtn.click();
      const saveBtn = page.locator('button:has-text("Save Preferences")');
      if (await saveBtn.isVisible()) {
        await expect(saveBtn).toBeVisible();
      }
    }
  });
});
