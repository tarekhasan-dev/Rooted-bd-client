export const MIN_PASSWORD_LENGTH = 15;
export const MAX_PASSWORD_LENGTH = 128;

const SPECIAL_CHAR_REGEX = /[~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?\/]/;

export const PASSWORD_RULES = [
  {
    id: "length",
    label: `At least ${MIN_PASSWORD_LENGTH} characters`,
    test: (p: string) => p.length >= MIN_PASSWORD_LENGTH,
  },
  {
    id: "case",
    label: "Both uppercase and lowercase letters",
    test: (p: string) => p !== p.toLowerCase() && p !== p.toUpperCase(),
  },
  {
    id: "number",
    label: "At least one number (0-9)",
    test: (p: string) => /[0-9]/.test(p),
  },
  {
    id: "special",
    label: "At least one special character (e.g. ! @ # $ %)",
    test: (p: string) => SPECIAL_CHAR_REGEX.test(p),
  },
];

export const getUnmetPasswordRules = (password: string) =>
  PASSWORD_RULES.filter((rule) => !rule.test(password));

export const getPasswordIssue = (password: string): string | null => {
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters long.`;
  }

  const failedRule = PASSWORD_RULES.find((rule) => !rule.test(password));

  return failedRule
    ? `Password requirement not met: ${failedRule.label}.`
    : null;
};