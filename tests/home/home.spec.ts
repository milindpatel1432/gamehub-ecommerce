import { test, expect } from '@playwright/test';

test.describe('Home Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    await page.goto('/');
  });

  test('Homepage loads successfully with correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/GameHub/i);
  });

  test('Hero section is visible with CTA buttons', async ({ page }) => {
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible();
    
    // Check main call to action buttons
    const shopCta = page.locator('a[href="/shop"]').first();
    await expect(shopCta).toBeVisible();
  });

  test('Category sections and featured games are displayed', async ({ page }) => {
    // Wait for featured grid or carousels
    const featuredSection = page.locator('section, div').filter({ hasText: /Featured|Categories|Deals/i }).first();
    await expect(featuredSection).toBeVisible();
  });

  test('Navbar links navigate to correct routes', async ({ page }) => {
    const shopLink = page.locator('nav a[href="/shop"]').first();
    if (await shopLink.isVisible()) {
      await shopLink.click();
      await expect(page).toHaveURL(/\/shop/);
    }
  });
});
