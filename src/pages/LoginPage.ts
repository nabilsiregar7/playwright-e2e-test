import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { loginSelectors as sel, dashboardSelectors } from '../selectors/selectors';
import { urls } from '../data/testData';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('/');
    await this.waitUntilReady(urls.loginIdentifier);
    await expect(sel.welcomeHeading(this.page)).toBeVisible();
  }

  async submitEmail(email: string) {
    await sel.emailInput(this.page).fill(email);
    await sel.continueButton(this.page).click();
  }

  async submitPassword(password: string) {
    await this.expectVisibleOrCaptcha(sel.signInHeading(this.page));
    await sel.passwordInput(this.page).fill(password);
    await sel.signInButton(this.page).click();
  }

  async login(email: string, password: string) {
    await this.submitEmail(email);
    await this.submitPassword(password);
  }

  async expectLoggedIn() {
    await expect(this.page).toHaveURL(urls.app, { timeout: 30_000 });
    await expect(dashboardSelectors.helpMenu(this.page)).toBeVisible({ timeout: 30_000 });
  }
}
