import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { Section } from './Section'
import { usePortfolioData } from '../hooks/usePortfolioData'

const AnimatedArticle = motion.article

/** Presenta proyectos reales con sus tecnologías y enlaces disponibles. */
export function Projects() {
  const { data } = usePortfolioData()

  return (
    <Section id="proyectos" eyebrow="Trabajo seleccionado" title="Proyectos y práctica">
      <div className="project-grid">
        {data.projects.map((project, index) => (
          <AnimatedArticle className="project-card" key={project.id} whileHover={{ y: -7 }}>
            <div className="project-number">R{index + 1}</div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="tag-list">
              {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
            </div>
            <div className="project-links">
              {project.repository_url && <a href={project.repository_url} target="_blank" rel="noreferrer"><Github size={17} /> Repositorio</a>}
              {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer"><ExternalLink size={17} /> Ver proyecto</a>}
              {!project.repository_url && !project.demo_url && <span>Enlaces pendientes de publicación</span>}
            </div>
          </AnimatedArticle>
        ))}
      </div>
    </Section>
  )
}

// Este archivo exporta: Projects.
// Se usa en: src/App.jsx.
// Importa de: Framer Motion, Lucide, Section y usePortfolioData.
