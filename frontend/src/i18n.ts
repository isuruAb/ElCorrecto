import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import sp from './locales/sp.json'

export const LANGUAGE_STORAGE_KEY = 'el-correcto-language'

const storedLanguage =
  typeof window !== 'undefined' ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY) : null

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sp: { translation: sp },
    },
    lng: storedLanguage ?? 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

i18n.on('languageChanged', (language) => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // ignore storage failures (e.g. private browsing)
  }
})

export default i18n
