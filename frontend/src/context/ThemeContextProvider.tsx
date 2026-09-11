import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from './themeContext'
import { THEME_STORAGE_KEY, THEMES, type Theme } from '../constants/theme'

const getInitialTheme = (): Theme => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === THEMES.LIGHT || stored === THEMES.DARK) return stored
  } catch {
    // ignore storage failures (e.g. private browsing)
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // ignore storage failures (e.g. private browsing)
    }
  }, [theme])

  const toggleTheme = () =>
    setTheme((current) => (current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
