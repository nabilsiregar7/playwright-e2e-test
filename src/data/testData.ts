// Real credentials only come from .env (locally) or CI secrets
export const registeredUser = {
  email: process.env.LOGIN_EMAIL ?? '',
  password: process.env.LOGIN_PASSWORD ?? '',
};

export const loginData = {
  wrongPassword: 'NotMyPassword123!',
  anyPassword: 'Whatever123!',
};

export const signupData = {
  malformedEmail: 'plainaddress',
  weakPassword: 'abc',
  strongPassword: 'Sup3rSecret!pass',
};

export const messages = {
  login: {
    emailRequired: 'Email address or username is required',
    wrongCredentials: 'Wrong username or password',
  },
  signup: {
    invalidEmail: 'Email is not valid.',
    termsRequired: 'This is required',
    weakPassword: 'The password is too weak',
  },
};

export const urls = {
  loginIdentifier: /\/u\/login\/identifier/,
  loginPassword: /\/u\/login\/password/,
  signupIdentifier: /\/u\/signup\/identifier/,
  signupPassword: /\/u\/signup\/password/,
  app: /app\.sleekflow\.io/,
};
