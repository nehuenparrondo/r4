import { GraduationCap, MapPin, UserRound } from 'lucide-react'
import { Section } from './Section'

/** Resume el perfil real y la formación informada por el propietario. */
export function About() {
  return (
    <Section id="sobre-mi" eyebrow="Perfil técnico" title="Aprender, construir, mejorar." className="about-section">
      <div className="about-grid">
        <p className="about-lead">
          Actualmente curso el 7.º año de la Escuela de Educación Secundaria Técnica N.º 5, en la orientación
          Informática. Tengo 19 años, soy responsable y empático en el ámbito laboral. Me interesa especialmente
          el desarrollo de software, el front-end y el diseño de interfaces. Realicé distintos desarrollos a lo
          largo de mi carrera, en su mayoría proyectos escolares.
        </p>
        <div className="about-facts">
          <article>
            <UserRound size={21} />
            <div><span>Perfil</span><strong>Estudiante técnico</strong></div>
          </article>
          <article>
            <GraduationCap size={21} />
            <div><span>Secundaria</span><strong>EESTN5 · Informática</strong></div>
          </article>
          <article>
            <MapPin size={21} />
            <div><span>Primaria</span><strong>San Antonio de Padua</strong></div>
          </article>
        </div>
      </div>
    </Section>
  )
}

// Este archivo exporta: About.
// Se usa en: src/App.jsx.
// Importa de: Lucide React y Section.
