import { createContext } from 'react'
import type { Theme } from '../constants/theme'

export type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
