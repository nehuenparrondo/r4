import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { Section } from './Section'
import { usePortfolioData } from '../hooks/usePortfolioData'

const AnimatedArticle = motion.article

/** Muestra habilidades persistidas y logros cuando existan. */
export function Skills() {
  const { data } = usePortfolioData()

  return (
    <Section id="habilidades" eyebrow="Herramientas" title="Tecnologías que estoy desarrollando">
      <div className="skills-layout">
        <div className="skill-cloud" aria-label="Listado de habilidades">
          {data.skills.map((skill, index) => (
            <AnimatedArticle
              key={skill.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="skill-card"
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{skill.name}</h3>
              <p>{skill.category}</p>
            </AnimatedArticle>
          ))}
        </div>

        <aside className="achievements-panel">
          <div className="panel-title"><Award size={20} /><h3>Logros</h3></div>
          {data.achievements.length ? data.achievements.map((achievement) => (
            <article key={achievement.id}>
              <strong>{achievement.title}</strong>
              <p>{achievement.description}</p>
              {achievement.date && <span>{achievement.date}</span>}
            </article>
          )) : <p className="empty-state">Todavía no hay logros cargados.</p>}
        </aside>
      </div>
    </Section>
  )
}

// Este archivo exporta: Skills.
// Se usa en: src/App.tsx.
// Importa de: Framer Motion, Lucide, Section y usePortfolioData.
