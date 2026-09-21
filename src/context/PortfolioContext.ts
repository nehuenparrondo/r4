import { createContext } from 'react'
import type { PortfolioContextValue } from '../types/portfolio'

export const PortfolioContext = createContext<PortfolioContextValue | null>(null)

// Este archivo exporta: PortfolioContext.
// Se usa en: PortfolioProvider y usePortfolioData.
// Importa de: React y tipos del dominio.
