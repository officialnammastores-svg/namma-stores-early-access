import { SHOPPING_CATEGORIES } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  normalizedData?: {
    name: string;
    phone: string;
    normalizedPhone: string;
    email: string;
    area: string;
    shoppingPreferences: string[];
    whatsappConsent: boolean;
  };
}

/**
 * Normalizes an Indian phone number to standard 10-digit format.
 * Strips +91, leading 0, spaces, dashes, brackets.
 */
export function normalizeIndianPhoneNumber(rawPhone: string): {
  normalized: string;
  e164: string;
  isValid: boolean;
} {
  if (!rawPhone) {
    return { normalized: '', e164: '', isValid: false };
  }

  // Strip non-digit characters except leading +
  let cleaned = rawPhone.replace(/\D/g, '');

  // Handle +91 / 91 country codes
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  // Indian mobile numbers must be exactly 10 digits and start with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  const isValid = indianMobileRegex.test(cleaned);

  return {
    normalized: cleaned,
    e164: isValid ? `+91${cleaned}` : '',
    isValid,
  };
}

/**
 * Validates email format with standard regex
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validates the early access form inputs (both client-side and server-side)
 */
export function validateEarlyAccessForm(data: {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  area?: unknown;
  shoppingPreferences?: unknown;
  whatsappConsent?: unknown;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // 1. Name validation
  const rawName = typeof data.name === 'string' ? data.name.trim() : '';
  if (!rawName) {
    errors.name = 'Please enter your name.';
  } else if (rawName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (rawName.length > 80) {
    errors.name = 'Name cannot exceed 80 characters.';
  } else if (/^\d+$/.test(rawName.replace(/\s+/g, ''))) {
    errors.name = 'Name cannot contain only numbers.';
  }

  // 2. Phone validation
  const rawPhone = typeof data.phone === 'string' ? data.phone.trim() : '';
  if (!rawPhone) {
    errors.phone = 'Please enter your 10-digit mobile number.';
  } else {
    const { isValid } = normalizeIndianPhoneNumber(rawPhone);
    if (!isValid) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }
  }

  // 3. Email validation (Optional)
  const rawEmail = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (rawEmail) {
    if (!isValidEmail(rawEmail)) {
      errors.email = 'Please enter a valid email address.';
    } else if (rawEmail.length > 120) {
      errors.email = 'Email cannot exceed 120 characters.';
    }
  }

  // 4. Area validation
  const rawArea = typeof data.area === 'string' ? data.area.trim() : '';
  if (!rawArea) {
    errors.area = 'Please enter your area or locality in Whitefield.';
  } else if (rawArea.length < 2) {
    errors.area = 'Area must be at least 2 characters.';
  } else if (rawArea.length > 100) {
    errors.area = 'Area cannot exceed 100 characters.';
  }

  // 5. Shopping preferences validation (Optional)
  const validPrefIds: string[] = SHOPPING_CATEGORIES.map((c) => c.id);
  let cleanPreferences: string[] = [];

  if (Array.isArray(data.shoppingPreferences)) {
    cleanPreferences = data.shoppingPreferences
      .map((item) => String(item).trim())
      .filter((item) => validPrefIds.includes(item));
  }

  // If "All of them" is included with individual items, ensure clean list
  if (cleanPreferences.includes('All of them') && cleanPreferences.length === 1) {
    cleanPreferences = ['Groceries', 'Fruits & Vegetables', 'Fresh Meat', 'All of them'];
  }

  const { normalized, e164, isValid: phoneValid } = normalizeIndianPhoneNumber(rawPhone);
  const isValid = Object.keys(errors).length === 0 && phoneValid;

  return {
    isValid,
    errors,
    normalizedData: isValid
      ? {
          name: rawName,
          phone: e164 || `+91${normalized}`,
          normalizedPhone: normalized,
          email: rawEmail,
          area: rawArea,
          shoppingPreferences: cleanPreferences,
          whatsappConsent: Boolean(data.whatsappConsent),
        }
      : undefined,
  };
}
