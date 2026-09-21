import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './context/ThemeProvider'
import { PortfolioProvider } from './context/PortfolioProvider'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <PortfolioProvider>
        <App />
      </PortfolioProvider>
    </ThemeProvider>
  </StrictMode>,
)

// Este archivo exporta: el montaje principal de React.
// Se usa en: index.html.
// Importa de: React, App, providers globales y estilos.
