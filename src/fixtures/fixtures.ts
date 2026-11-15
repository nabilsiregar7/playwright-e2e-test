import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { DashboardPage } from '../pages/DashboardPage';
import { registeredUser } from '../data/testData';

type Fixtures = {
  loginPage: LoginPage;
  signupPage: SignupPage;
  dashboard: DashboardPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  dashboard: async ({ page }, use) => {
    test.skip(!registeredUser.email || !registeredUser.password, 'set LOGIN_EMAIL and LOGIN_PASSWORD in .env');
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(registeredUser.email, registeredUser.password);
    await loginPage.expectLoggedIn();
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
