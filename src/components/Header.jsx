import { useMemo, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useScrollSpy } from '../hooks/useScrollSpy'

const navigation = [
  ['inicio', 'Inicio'],
  ['sobre-mi', 'Sobre mí'],
  ['habilidades', 'Habilidades'],
  ['experiencia', 'Experiencia'],
  ['proyectos', 'Proyectos'],
  ['contacto', 'Contacto'],
]

/** Navegación fija con indicador de sección, menú móvil y selector de tema. */
export function Header({ onOpenAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const sectionIds = useMemo(() => navigation.map(([id]) => id), [])
  const activeSection = useScrollSpy(sectionIds)

  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Ir al inicio">
        NP<span>.</span>
      </a>

      <button
        className="icon-button mobile-menu-button"
        type="button"
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal">
        {navigation.map(([id, label]) => (
          <a
            key={id}
            className={activeSection === id ? 'active' : ''}
            href={`#${id}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button className="text-button" type="button" onClick={onOpenAdmin}>
          Administrar
        </button>
        <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Cambiar tema">
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </div>
    </header>
  )
}

// Este archivo exporta: Header.
// Se usa en: src/App.jsx.
// Importa de: Lucide React y hooks propios de tema y scroll.
