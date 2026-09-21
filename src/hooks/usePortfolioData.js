import { useContext } from 'react'
import { PortfolioContext } from '../context/PortfolioContext'

/** Da acceso a la información compartida y a las operaciones de persistencia. */
export function usePortfolioData() {
  const context = useContext(PortfolioContext)
  if (!context) throw new Error('usePortfolioData debe usarse dentro de PortfolioProvider.')
  return context
}

// Este archivo exporta: usePortfolioData.
// Se usa en: las secciones públicas y el panel administrativo.
// Importa de: React y PortfolioContext.
