import { useMemo, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useScrollSpy } from '../hooks/useScrollSpy'

const navigation = [
  ['inicio', 'Inicio'],
  ['sobre-mi', 'Sobre mí'],
  ['habilidades', 'Habilidades'],
  ['experiencia', 'Experiencia'],
  ['proyectos', 'Proyectos'],
  ['contacto', 'Contacto'],
] as const

interface HeaderProps {
  onOpenAdmin: () => void
}

/** Navegación fija con indicador de sección, menú móvil y selector de tema. */
export function Header({ onOpenAdmin }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
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
      </div>
    </header>
  )
}

// Este archivo exporta: Header.
// Se usa en: src/App.tsx.
// Importa de: Lucide React y el hook de seguimiento de scroll.
