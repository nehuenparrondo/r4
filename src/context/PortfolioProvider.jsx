import { PortfolioContext } from './PortfolioContext'
import { usePortfolioController } from '../hooks/usePortfolioController'

/** Comparte los datos del portfolio y sus acciones de ABM. */
export function PortfolioProvider({ children }) {
  const portfolio = usePortfolioController()
  return <PortfolioContext.Provider value={portfolio}>{children}</PortfolioContext.Provider>
}

// Este archivo exporta: PortfolioProvider.
// Se usa en: src/main.jsx.
// Importa de: PortfolioContext y usePortfolioController.
