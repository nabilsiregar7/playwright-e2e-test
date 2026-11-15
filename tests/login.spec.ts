import { test, expect } from '../src/fixtures/fixtures';
import { registeredUser, loginData, messages, urls } from '../src/data/testData';
import { makeUnregisteredEmail } from '../src/utils/userFactory';
import { loginSelectors } from '../src/selectors/selectors';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('shows the login form', async ({ page }) => {
    await expect(loginSelectors.emailInput(page)).toBeVisible();
    await expect(loginSelectors.continueButton(page)).toBeEnabled();
    await expect(loginSelectors.googleButton(page)).toBeVisible();
    await expect(loginSelectors.appleButton(page)).toBeVisible();
    await expect(loginSelectors.signUpLink(page)).toBeVisible();
  });

  test('logs in with valid credentials', async ({ loginPage }) => {
    test.skip(!registeredUser.email || !registeredUser.password, 'set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    await loginPage.login(registeredUser.email, registeredUser.password);
    await loginPage.expectLoggedIn();
  });

  test('rejects a wrong password', async ({ loginPage, page }) => {
    test.skip(!registeredUser.email, 'set LOGIN_EMAIL in .env');

    await loginPage.login(registeredUser.email, loginData.wrongPassword);

    await loginPage.expectError(messages.login.wrongCredentials);
    await expect(page).toHaveURL(urls.loginPassword);
  });

  test('rejects an email that has no account', async ({ loginPage, page }) => {
    await loginPage.login(makeUnregisteredEmail(), loginData.anyPassword);

    await loginPage.expectError(messages.login.wrongCredentials);
    await expect(page).toHaveURL(urls.loginPassword);
  });

  test('asks for an email before continuing', async ({ loginPage, page }) => {
    await loginPage.submitEmail('');

    await loginPage.expectError(messages.login.emailRequired);
    await expect(page).toHaveURL(urls.loginIdentifier);
  });

  test('does not sign in with an empty password', async ({ loginPage, page }) => {
    await loginPage.login(makeUnregisteredEmail(), '');

    const password = loginSelectors.passwordInput(page);
    expect(await password.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    await expect(page).toHaveURL(urls.loginPassword);
  });

  test('hides the password until "Show password" is toggled', async ({ loginPage, page }) => {
    await loginPage.submitEmail(makeUnregisteredEmail());
    const password = loginSelectors.passwordInput(page);

    await expect(password).toHaveAttribute('type', 'password');
    await loginSelectors.showPasswordToggle(page).click();
    await expect(password).toHaveAttribute('type', 'text');
  });
});
