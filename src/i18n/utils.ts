import en, { type Translations, type TranslationKey } from './en';
import fr from './fr';

export type { Translations, TranslationKey };
export type Locale = 'en' | 'fr';

export const LOCALES: Locale[] = ['en', 'fr'];
export const DEFAULT_LOCALE: Locale = 'en';

const translations: Record<Locale, Translations> = { en, fr };

/**
 * Resolves the active locale. Falls back to URL inspection in dev mode
 * where Astro.currentLocale may not propagate correctly into components.
 */
export function resolveLocale(
  currentLocale: string | undefined,
  pathname: string,
): Locale {
  if (currentLocale === 'fr') return 'fr';
  if (pathname.startsWith('/fr/') || pathname === '/fr') return 'fr';
  return 'en';
}

/** Returns a `t(key)` function scoped to the given locale. */
export function useTranslations(locale: string | undefined, pathname = '') {
  const l = resolveLocale(locale, pathname);
  const dict = translations[l];
  return function t(key: TranslationKey): string {
    const value = dict[key] ?? en[key];
    if (import.meta.env.DEV && value === undefined) {
      console.warn(`[i18n] Missing translation key: "${key}" (locale: ${l})`);
    }
    return value ?? key;
  };
}

/** Returns the locale prefix for building URLs ('/fr' or ''). */
export function localePrefix(locale: string | undefined, pathname = ''): string {
  return resolveLocale(locale, pathname) === 'fr' ? '/fr' : '';
}
