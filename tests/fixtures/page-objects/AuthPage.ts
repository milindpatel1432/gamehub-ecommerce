import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly fullNameInput: Locator;
  readonly usernameInput: Locator;
  readonly phoneInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly serverErrorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button[type="submit"]');
    this.fullNameInput = page.locator('#fullName');
    this.usernameInput = page.locator('#username');
    this.phoneInput = page.locator('#phone');
    this.confirmPasswordInput = page.locator('#confirmPassword');
    this.serverErrorAlert = page.locator('.bg-red-500\\/10, [id*="-error"]');
  }

  async gotoLogin() {
    await this.page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await expect(this.emailInput).toBeVisible();
  }

  async gotoRegister() {
    await this.page.addInitScript(() => sessionStorage.setItem('gamehub_preloader_seen', 'true'));
    await this.page.goto('/register');
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await expect(this.fullNameInput).toBeVisible();
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }

  async registerUser(details: { fullName: string; username: string; email: string; password: string; phone?: string }) {
    await this.fullNameInput.fill(details.fullName);
    await this.usernameInput.fill(details.username);
    await this.emailInput.fill(details.email);
    if (details.phone && (await this.phoneInput.count()) > 0) {
      await this.phoneInput.fill(details.phone);
    }
    await this.passwordInput.fill(details.password);
    if ((await this.confirmPasswordInput.count()) > 0) {
      await this.confirmPasswordInput.fill(details.password);
    }
    await this.submitButton.click();
  }
}
