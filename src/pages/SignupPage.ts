import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';
import { signupSelectors as sel, loginSelectors } from '../selectors/selectors';
import { urls } from '../data/testData';
import { NewUser } from '../utils/userFactory';

// Signup is also two steps:
// 1. email + accept terms -> Sign up (nothing is created yet)
// 2. password -> Sign up (this is where the account actually gets created)
export class SignupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await new LoginPage(this.page).open();
    await loginSelectors.signUpLink(this.page).click();
    await this.waitUntilReady(urls.signupIdentifier);
    await expect(sel.heading(this.page)).toBeVisible();
  }

  async fillEmail(email: string) {
    await sel.emailInput(this.page).fill(email);
  }

  async acceptTerms() {
    await sel.termsLabel(this.page).click({ position: { x: 5, y: 5 } });
    await expect(sel.termsCheckbox(this.page)).toBeChecked();
  }

  async submit() {
    await sel.signUpButton(this.page).click();
  }

  async startSignup(email: string) {
    await this.fillEmail(email);
    await this.acceptTerms();
    await this.submit();
    await this.waitUntilReady(urls.signupPassword);
  }

  async fillPassword(password: string) {
    await sel.passwordInput(this.page).fill(password);
  }

  async signUp(user: NewUser) {
    await this.startSignup(user.email);
    await this.fillPassword(user.password);
    await this.submit();
  }

  async expectSignupSuccess() {
    await expect(this.page).not.toHaveURL(/\/u\/signup/, { timeout: 30_000 });
  }
}
