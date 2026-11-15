import { signupData } from '../data/testData';

export type NewUser = {
  email: string;
  password: string;
};

// Builds user+qa123@gmail.com style addresses
// Every run gets a fresh email
export function makeUniqueEmail(): string {
  const base = process.env.SIGNUP_EMAIL_BASE || 'qa.sleekflow@example.com';
  const [name, domain] = base.split('@');
  return `${name}+qa${Date.now()}@${domain}`;
}

export function makeUnregisteredEmail(): string {
  return `no.account.${Date.now()}@example.com`;
}

export function makeNewUser(overrides: Partial<NewUser> = {}): NewUser {
  return {
    email: makeUniqueEmail(),
    password: signupData.strongPassword,
    ...overrides,
  };
}
