import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly nextStepButton: Locator;
  readonly placeOrderButton: Locator;
  readonly termsCheckbox: Locator;
  readonly orderSuccessHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nextStepButton = page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Proceed")');
    this.placeOrderButton = page.locator('button:has-text("Place Order"), button:has-text("Pay")');
    this.termsCheckbox = page.locator('input[type="checkbox"]');
    this.orderSuccessHeader = page.locator('text=Order Confirmed, text=Order Placed');
  }

  async gotoCheckout() {
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async advanceToReviewStep() {
    // Click through address, delivery, payment steps if present
    for (let i = 0; i < 3; i++) {
      const nextBtn = this.page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Proceed to")').first();
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await this.page.waitForTimeout(300);
      }
    }
  }
}
