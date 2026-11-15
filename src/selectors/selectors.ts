import { Page } from '@playwright/test';

const onScreenText = (page: Page, text: string, exact = true) =>
  page
    .getByRole('main')
    .getByText(text, { exact })
    .and(page.locator(':not(#ulp-error-announcer)'))
    .filter({ visible: true });

export const commonSelectors = {
  error: (page: Page, text: string) => onScreenText(page, text),
  screenReaderAlert: (page: Page) => page.locator('#ulp-error-announcer'),
  captchaInput: (page: Page) => page.getByRole('textbox', { name: 'Enter the code shown above' }),
};

export const loginSelectors = {
  welcomeHeading: (page: Page) => page.getByRole('heading', { name: 'Welcome back' }),
  emailInput: (page: Page) => page.getByRole('textbox', { name: 'Email or username' }),
  continueButton: (page: Page) => page.getByRole('button', { name: 'Continue', exact: true }),
  googleButton: (page: Page) => page.getByRole('button', { name: 'Continue with Google' }),
  appleButton: (page: Page) => page.getByRole('button', { name: 'Continue with Apple' }),
  signUpLink: (page: Page) => page.getByRole('link', { name: 'Sign up' }),
  signInHeading: (page: Page) => page.getByRole('heading', { name: 'Sign in to continue' }),
  passwordInput: (page: Page) => page.getByRole('textbox', { name: 'Password' }),
  showPasswordToggle: (page: Page) => page.getByRole('switch', { name: 'Show password' }),
  signInButton: (page: Page) => page.getByRole('button', { name: 'Sign in' }),
  resetPasswordLink: (page: Page) => page.getByRole('link', { name: 'Reset password' }),
};

export const signupSelectors = {
  heading: (page: Page) => page.getByRole('heading', { name: 'Create your account' }),
  emailInput: (page: Page) => page.getByRole('textbox', { name: 'Email address' }),
  termsCheckbox: (page: Page) => page.getByRole('checkbox', { name: /Terms of Service/ }),
  termsLabel: (page: Page) => page.locator('label[for="terms-of-service"]'),
  signUpButton: (page: Page) => page.getByRole('button', { name: 'Sign up', exact: true }),
  passwordInput: (page: Page) => page.getByRole('textbox', { name: 'Password' }),
  passwordRules: (page: Page) => onScreenText(page, 'Your password must contain:', false),
};

export const dashboardSelectors = {
  helpMenu: (page: Page) => page.getByRole('button', { name: 'Open help menu' }),
};
