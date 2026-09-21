import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

/** Devuelve el tema actual y la acción para alternarlo. */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider.')
  return context
}

// Este archivo exporta: useTheme.
// Se usa en: Header.
// Importa de: React y ThemeContext.
