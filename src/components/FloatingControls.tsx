import { useEffect, useState } from 'react'
import { ArrowUp, Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

/** Agrupa el selector de tema y el acceso contextual para volver al inicio. */
export function FloatingControls() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    /** Recalcula el acceso superior solo cuando la página y el desplazamiento lo justifican. */
    function updateVisibility() {
      const pageNeedsScroll = document.documentElement.scrollHeight > window.innerHeight * 1.35
      setShowScrollTop(pageNeedsScroll && window.scrollY > window.innerHeight * 0.45)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)
    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  return (
    <div className="floating-controls" aria-label="Controles de visualización">
      {showScrollTop && (
        <button className="floating-button" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Volver arriba">
          <ArrowUp size={20} />
        </button>
      )}
      <button className="floating-button theme-floating-button" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}>
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  )
}

// Este archivo exporta: FloatingControls.
// Se usa en: App.
// Importa de: React, Lucide y useTheme.
