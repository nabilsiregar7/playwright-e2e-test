import { expect, Locator, Page } from '@playwright/test';
import { commonSelectors } from '../selectors/selectors';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitUntilReady(url: RegExp) {
    await expect(this.page).toHaveURL(url);
    await this.page.waitForLoadState('load');
  }

  async expectError(message: string) {
    await this.expectVisibleOrCaptcha(commonSelectors.error(this.page, message));
  }

  // bot detetcion shows CAPTCHA after too many attempts
  async expectVisibleOrCaptcha(target: Locator) {
    const captcha = commonSelectors.captchaInput(this.page);
    await expect(target.or(captcha)).toBeVisible();
    if (await captcha.isVisible()) {
      throw new Error('Blocked by Auth0 CAPTCHA (too many attempts from this IP). Wait a while or run against a test tenant.');
    }
  }
}
