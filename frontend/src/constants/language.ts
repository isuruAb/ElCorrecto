export const SUPPORTED_LANGUAGES = [
  { key: 'en', name: 'English' },
  { key: 'sp', name: 'Spanish' },
] as const

export type LanguageKey = (typeof SUPPORTED_LANGUAGES)[number]['key']
