/**
 * Form validation helpers for email and phone.
 */

/** RFC-style email regex: local@domain.tld */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Phone: strip non-digits and check length (10–15 digits). */

export function isValidEmail(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && EMAIL_REGEX.test(trimmed);
}

export function getEmailError(value: string): string {
  if (!value || !value.trim()) return "Email is required.";
  if (!isValidEmail(value)) return "Please enter a valid email address.";
  return "";
}

/**
 * Validates phone: allows + (optional), digits, spaces, dots, dashes, parentheses.
 * After removing non-digits, expects between 10 and 15 digits.
 */
export function isValidPhone(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function getPhoneError(value: string): string {
  if (!value || !value.trim()) return "Phone number is required.";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10) return "Phone number must have at least 10 digits.";
  if (digits.length > 15) return "Phone number is too long.";
  return "";
}
