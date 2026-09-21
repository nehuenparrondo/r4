import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'
import type { Theme } from '../types/portfolio'

interface ThemeProviderProps {
  children: ReactNode
}

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem('portfolio-theme')
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

/** Mantiene la preferencia visual disponible en toda la aplicación. */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')) }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Este archivo exporta: ThemeProvider.
// Se usa en: src/main.tsx.
// Importa de: React, ThemeContext y tipos del dominio.
