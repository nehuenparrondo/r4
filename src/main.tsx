import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './context/ThemeProvider'
import { PortfolioProvider } from './context/PortfolioProvider'
import './styles/global.css'

const rootElement = document.getElementById('root')

/** Detiene el inicio con un mensaje claro si index.html no contiene el nodo requerido. */
if (!rootElement) throw new Error('No se encontró el elemento raíz de la aplicación.')

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <PortfolioProvider>
        <App />
      </PortfolioProvider>
    </ThemeProvider>
  </StrictMode>,
)

// Este archivo exporta: el montaje principal de React con verificación del nodo raíz.
// Se usa en: index.html.
// Importa de: React, App, providers globales y estilos.
