import { BriefcaseBusiness } from 'lucide-react'
import { Section } from './Section'
import { usePortfolioData } from '../hooks/usePortfolioData'

/** Ordena las experiencias laborales y formativas en una línea temporal. */
export function Experience() {
  const { data } = usePortfolioData()

  return (
    <Section id="experiencia" eyebrow="03 · Recorrido" title="Experiencia laboral">
      <div className="timeline">
        {data.experiences.map((experience) => (
          <article className="timeline-item" key={experience.id}>
            <div className="timeline-icon"><BriefcaseBusiness size={19} /></div>
            <div className="timeline-copy">
              <div className="timeline-heading">
                <div><h3>{experience.role}</h3><p>{experience.company}</p></div>
                {experience.period && <span>{experience.period}</span>}
              </div>
              <p>{experience.description}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

// Este archivo exporta: Experience.
// Se usa en: src/App.jsx.
// Importa de: Lucide, Section y usePortfolioData.
