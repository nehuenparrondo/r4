import { createContext } from 'react'
import type { Theme } from '../types/portfolio'

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

// Este archivo exporta: ThemeContext.
// Se usa en: ThemeProvider y useTheme.
// Importa de: React y tipos del dominio.
