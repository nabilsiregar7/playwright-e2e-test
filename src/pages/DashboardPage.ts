import { expect, Page } from '@playwright/test';
import { dashboardSelectors } from '../selectors/selectors';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(dashboardSelectors.helpMenu(this.page)).toBeVisible({ timeout: 30_000 });
  }
}
