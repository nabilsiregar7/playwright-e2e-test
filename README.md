# sleekflow-e2e

Playwright tests for the SleekFlow login and signup flows

## Getting started

You'll need Node 20+.

```bash
npm install
npx playwright install
cp .env.example .env
```

Then fill in `.env`:

| Variable            | What it's for                                                           |
| ------------------- | ----------------------------------------------------------------------- |
| `BASE_URL`          | Defaults to `https://app.sleekflow.io`                                  |
| `LOGIN_EMAIL`       | An existing account, used by the valid / wrong-password login tests     |
| `LOGIN_PASSWORD`    | Password for that account                                               |
| `ALLOW_REAL_SIGNUP` | `true` to run the one test that really creates an account               |

## Running

```bash
npm test                # everything, Chromium + Firefox
npm run test:login
npm run test:signup
npm run test:headed     # one Chromium window
npm run test:ui         # Playwright UI mode
npm run report          # open the last HTML report
```

## What's covered

**Login**
- loign form renders (email field, Continue, Google/Apple, Sign up link)
- valid credentials land user in the app
- wrong password shows "Wrong username or password"
- empty email shows "Email address or username is required"
- empty password is blocked by the browser's required check
- password is masked until "Show password" is toggled

**Signup**
- the form renders, terms checkbox unchecked by default
- an empty form doesn't submit
- malformed email shows "Email is not valid."
- terms not accepted keeps user on the first step
- valid email + terms moves user to the password step
- weak password is rejected and the password rules are shown

## Project layout

```
src/
  selectors/selectors.ts   every locator, in one place
  data/testData.ts         test data, expected messages, URL patterns
  pages/                   page objects (BasePage, LoginPage, SignupPage, DashboardPage)
  fixtures/fixtures.ts     injects the page objects, plus logged-in `dashboard` fixture
  utils/userFactory.ts     unique emails for signup / unknown-user cases
tests/
  login.spec.ts
  signup.spec.ts
```

A few choices I made along the way:

- **Selectors are role/label based** (`getByRole`, `getByText`) wherever possible.
  They match what a user sees and don't break when the CSS classes change. The
  only CSS selectors are for the terms checkbox label and Auth0's
  screen-reader announcer, where nothing better exists.
- **One test per scenario, no data-driven loops.** Each test reads top to bottom,
  and when one fails, its name tells exactly which case broke.
- **No hard waits.** Everything relies on Playwright's auto-waiting and
  web-first assertions (`toBeVisible`, `toHaveURL`). The one extra wait is
  `waitUntilReady()` in `BasePage`. Auth0 wires up its client-side validation
  only after its scripts load, and typing before that made the terms and
  password checks flaky.
- **Error messages are matched exactly** and kept in `testData.ts`, so a copy
  change is a one-line fix.

## Test users without the clutter

Most signup tests stop *before* an account can be created. They either stop at
the password step or submit a password Auth0 refuses. So they can run as often
as you like.

The one test that really signs up is skipped unless `ALLOW_REAL_SIGNUP=true`.
It uses plus-addressing (`user+qa123@gmail.com`), so every run gets a
fresh address while all the mail lands in one inbox. With a proper test environment I'd go further and delete the
user through an admin API in an `afterEach`.

## Things to know about running against production

Auth0 has bot and brute-force protection, and repeated runs will trigger it:

- after enough attempts from one IP will get a **CAPTCHA**. The tests don't
  try to get around it. They fail with a clear "Blocked by Auth0 CAPTCHA"
  message instead of a confusing timeout.
- after ~10 failed logins for the **same email**, Auth0 blocks that email.
  That's why the unknown-user tests generate a new email each run. It also
  means the wrong-password test, if run over and over, can lock the real
  `LOGIN_EMAIL` account.

## CI

`.github/workflows/playwright.yml` runs the suite on pushes to `master` and on
pull requests, and can also be started by hand from the Actions tab. Add `LOGIN_EMAIL`,
`LOGIN_PASSWORD`, `SIGNUP_EMAIL_BASE` (and optionally `BASE_URL`) as repository
secrets. Without them, the credential-dependent tests just skip.

On CI, failed tests are retried twice. The HTML report is always uploaded as an
artifact, and `test-results/` (screenshots, videos, traces) is uploaded when
something fails.

## When a test fails

The config keeps a **screenshot** and a **video** of every failed test and
records a **trace** on the first retry. Open them with:

```bash
npm run report
npx playwright show-trace test-results/<test-folder>/trace.zip
```

The trace is usually the quickest way to the cause. It shows each action, the DOM
at that moment, network calls and console logs. If it turns out to be a real
bug and not a test problem, wa could simply attach the video and trace to the ticket
