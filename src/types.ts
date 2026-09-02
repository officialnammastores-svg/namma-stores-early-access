export interface EarlyAccessFormData {
  name: string;
  phone: string;
  email: string;
  area: string;
  shoppingPreferences: string[];
  whatsappConsent: boolean;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
}

export interface EarlyAccessSubmissionResult {
  success: boolean;
  isDuplicate?: boolean;
  message?: string;
  error?: string;
}

export const VALID_SHOPPING_PREFERENCES = [
  'Groceries',
  'Fruits & Vegetables',
  'Fresh Meat',
  'All of them',
] as const;

export type ShoppingPreference = (typeof VALID_SHOPPING_PREFERENCES)[number];

export const SHOPPING_CATEGORIES: { id: ShoppingPreference; label: string; icon: string; desc?: string }[] = [
  { id: 'Groceries', label: 'Groceries', icon: '🛒', desc: 'Daily essentials from nearby stores.' },
  { id: 'Fruits & Vegetables', label: 'Fruits & Vegetables', icon: '🥦', desc: 'Fresh produce from nearby stores.' },
  { id: 'Fresh Meat', label: 'Fresh Meat', icon: '🍗', desc: 'Quality meat from local stores.' },
  { id: 'All of them', label: 'All of them', icon: '✨', desc: 'All local shopping categories.' },
];

export const WHITEFIELD_LOCALITIES = [
  'ITPL',
  'ECC Road',
  'Kundalahalli',
  'Varthur',
  'Kadugodi',
  'Brookefield',
  'Hoodi',
  'Nallurahalli',
] as const;
