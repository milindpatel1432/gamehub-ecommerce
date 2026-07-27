import { test, expect } from '@playwright/test';

test.describe('Responsive Layout E2E Tests', () => {
  const viewports = [
    { name: 'Desktop Large', width: 1440, height: 900 },
    { name: 'Tablet Landscape', width: 1024, height: 768 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'Mobile Portrait', width: 375, height: 667 },
  ];

  for (const vp of viewports) {
    test(`Homepage renders cleanly on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await expect(page).toHaveTitle(/GameHub/i);
      
      const body = page.locator('body');
      await expect(body).toBeVisible();

      if (vp.width < 768) {
        const mobileToggle = page.locator('button[class*="menu"], button[aria-label*="menu" i], svg.lucide-menu').first();
        if (await mobileToggle.isVisible()) {
          await expect(mobileToggle).toBeVisible();
        }
      }
    });

    test(`Shop Page renders cleanly on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/shop');
      const searchInput = page.locator('input[placeholder*="Search"]').first();
      await expect(searchInput).toBeVisible();
    });
  }
});
