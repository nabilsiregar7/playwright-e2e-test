import { test, expect } from '../src/fixtures/fixtures';
import { signupData, messages, urls } from '../src/data/testData';
import { makeNewUser, makeUniqueEmail } from '../src/utils/userFactory';
import { signupSelectors, commonSelectors } from '../src/selectors/selectors';

test.describe('Signup', () => {
  test.beforeEach(async ({ signupPage }) => {
    await signupPage.open();
  });

  test('shows the signup form', async ({ page }) => {
    await expect(signupSelectors.emailInput(page)).toBeVisible();
    await expect(signupSelectors.termsCheckbox(page)).not.toBeChecked();
    await expect(signupSelectors.signUpButton(page)).toBeEnabled();
  });

  test('does not submit an empty form', async ({ signupPage, page }) => {
    await signupPage.submit();

    await expect(page).toHaveURL(urls.signupIdentifier);
    await expect(signupSelectors.passwordInput(page)).toBeHidden();
  });

  test('rejects a malformed email', async ({ signupPage, page }) => {
    await signupPage.fillEmail(signupData.malformedEmail);
    await signupPage.acceptTerms();
    await signupPage.submit();

    await signupPage.expectError(messages.signup.invalidEmail);
    await expect(page).toHaveURL(urls.signupIdentifier);
  });

  test('requires the terms to be accepted', async ({ signupPage, page }) => {
    await signupPage.fillEmail(makeUniqueEmail());
    await signupPage.submit();

    // Auth0 only turns the label red here, the "This is required" text is
    // visually hidden and only read out to screen readers
    await expect(commonSelectors.screenReaderAlert(page)).toHaveText(messages.signup.termsRequired);
    await expect(signupSelectors.termsCheckbox(page)).not.toBeChecked();
    await expect(page).toHaveURL(urls.signupIdentifier);
  });

  test('moves on to the password step with a valid email', async ({ signupPage, page }) => {
    const email = makeUniqueEmail();
    await signupPage.startSignup(email);

    await expect(signupSelectors.passwordInput(page)).toBeVisible();
  });

  test('rejects a weak password and lists the rules', async ({ signupPage, page }) => {
    await signupPage.startSignup(makeUniqueEmail());
    await signupPage.fillPassword(signupData.weakPassword);
    await signupPage.submit();

    await signupPage.expectError(messages.signup.weakPassword);
    await expect(signupSelectors.passwordRules(page)).toBeVisible();
    await expect(page).toHaveURL(urls.signupPassword);
  });

  // real ccreates an account, only runs if ALLOW_REAL_SIGNUP=true
  test('signs up a brand new user', async ({ signupPage }) => {
    test.skip(process.env.ALLOW_REAL_SIGNUP !== 'true', 'set ALLOW_REAL_SIGNUP=true to run');

    await signupPage.signUp(makeNewUser());
    await signupPage.expectSignupSuccess();
  });
});
