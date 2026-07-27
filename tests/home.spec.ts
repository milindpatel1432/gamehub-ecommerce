import { test, expect } from '@playwright/test';

test('Home page should load successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/GameHub/i);
});