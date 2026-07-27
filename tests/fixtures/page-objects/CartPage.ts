import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('a[href="/checkout"], button:has-text("Proceed to Checkout")');
    this.couponInput = page.locator('input[placeholder*="coupon" i], input[placeholder*="promo" i]');
    this.applyCouponButton = page.locator('button:has-text("Apply")');
    this.emptyCartMessage = page.locator('text=Your Cart is Empty');
    this.cartItems = page.locator('[class*="CartItemCard"], [class*="CartItem"]');
  }

  async gotoCart() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async proceedToCheckout() {
    await expect(this.checkoutButton).toBeVisible();
    await this.checkoutButton.click();
  }

  async applyCoupon(code: string) {
    if (await this.couponInput.isVisible()) {
      await this.couponInput.fill(code);
      await this.applyCouponButton.click();
    }
  }
}
