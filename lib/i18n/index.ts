import vi from './vi.json'

export type Translations = typeof vi

const translations = { vi } as const

/** Get translations for a locale. Defaults to 'vi'. */
export function t(locale: keyof typeof translations = 'vi'): Translations {
  return translations[locale]
}

/** Default Vietnamese strings — use this for single-locale imports. */
export const strings = translations.vi
