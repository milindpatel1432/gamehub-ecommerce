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
    this.emailInput = page.locator('input#email, input[name="email"]').first();
    this.passwordInput = page.locator('input#password, input[name="password"]').first();
    this.submitButton = page.locator('button[type="submit"]').first();
    this.fullNameInput = page.locator('input#fullName, input[name="fullName"]').first();
    this.usernameInput = page.locator('input#username, input[name="username"]').first();
    this.phoneInput = page.locator('input#phone, input[name="phone"]').first();
    this.confirmPasswordInput = page.locator('input#confirmPassword, input[name="confirmPassword"]').first();
    this.serverErrorAlert = page.locator('.bg-red-500\\/10, [id*="-error"]').first();
  }

  async gotoLogin() {
    await this.page.goto('/login');
    if (!this.page.url().includes('/login')) {
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await this.page.context().clearCookies();
      await this.page.goto('/login');
    }
    await expect(this.emailInput).toBeVisible();
  }

  async gotoRegister() {
    await this.page.goto('/register');
    if (!this.page.url().includes('/register')) {
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await this.page.context().clearCookies();
      await this.page.goto('/register');
    }
    await expect(this.fullNameInput).toBeVisible();
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
    await this.page.waitForTimeout(500);
  }

  async loginViaApi(email = 'admin@gamehub.com', pass = 'milind@2803') {
    try {
      const response = await this.page.request.post('http://localhost:5000/api/v1/auth/login', {
        data: { email, password: pass },
      });
      const data = await response.json();
      if (data?.token) {
        await this.page.context().addCookies([
          {
            name: 'token',
            value: data.token,
            domain: 'localhost',
            path: '/',
          },
        ]);
        await this.page.addInitScript(({ token, user }) => {
          sessionStorage.setItem('gamehub_preloader_seen', 'true');
          localStorage.setItem('gamehub_token', token);
          localStorage.setItem('gamehub_user', JSON.stringify(user));
        }, { token: data.token, user: data.user });
      }
      return data;
    } catch (e) {
      console.error('loginViaApi error:', e);
      return null;
    }
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
    await this.page.waitForTimeout(500);
  }
}
