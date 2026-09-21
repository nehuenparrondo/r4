import type { ReactNode } from 'react'
import { PortfolioContext } from './PortfolioContext'
import { usePortfolioController } from '../hooks/usePortfolioController'

interface PortfolioProviderProps {
  children: ReactNode
}

/** Comparte los datos del portfolio y sus acciones de ABM. */
export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const portfolio = usePortfolioController()
  return <PortfolioContext.Provider value={portfolio}>{children}</PortfolioContext.Provider>
}

// Este archivo exporta: PortfolioProvider.
// Se usa en: src/main.tsx.
// Importa de: PortfolioContext y usePortfolioController.
