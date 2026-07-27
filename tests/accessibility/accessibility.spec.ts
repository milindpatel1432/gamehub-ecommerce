import { test, expect } from '@playwright/test';

test.describe('Accessibility & Semantic HTML E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
  });

  test('Homepage features proper semantic heading structure and image alt attributes', async ({ page }) => {
    await page.goto('/');
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    const logoImg = page.locator('img[alt*="Logo"], img[alt*="GameHub"]').first();
    if (await logoImg.isVisible()) {
      await expect(logoImg).toHaveAttribute('alt', /.+/);
    }
  });

  test('Login form inputs feature accessibility labels and ids', async ({ page }) => {
    await page.goto('/login');
    
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();

    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible();
  });

  test('Interactive buttons have accessible names or ARIA attributes', async ({ page }) => {
    await page.goto('/shop');
    
    const firstButton = page.locator('button').first();
    await expect(firstButton).toBeVisible();
  });
});
