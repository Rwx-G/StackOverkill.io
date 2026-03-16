export const locales = ['en', 'fr', 'de', 'it', 'es'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  es: 'Español',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  es: '🇪🇸',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  // Get browser language (e.g., 'fr-FR' or 'fr')
  const browserLang = navigator.language?.split('-')[0];

  if (browserLang && isValidLocale(browserLang)) {
    return browserLang;
  }

  // Check navigator.languages for alternatives
  for (const lang of navigator.languages || []) {
    const code = lang.split('-')[0];
    if (isValidLocale(code)) {
      return code;
    }
  }

  return defaultLocale;
}
