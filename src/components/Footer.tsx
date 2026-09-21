import { PERSON_NAME } from '../data/portfolioSeed'

/** Cierra el documento con autoría y año dinámico. */
export function Footer() {
  return (
    <footer className="site-footer">
      <strong>{PERSON_NAME}</strong>
      <span>Portfolio personal · {new Date().getFullYear()}</span>
    </footer>
  )
}

// Este archivo exporta: Footer.
// Se usa en: src/App.tsx.
// Importa de: datos protegidos del portfolio.
