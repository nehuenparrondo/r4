import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const AnimatedSection = motion.section

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
  className?: string
}

/** Aporta una cabecera consistente y animación al entrar en pantalla. */
export function Section({ id, eyebrow, title, children, className = '' }: SectionProps) {
  return (
    <AnimatedSection
      id={id}
      className={`section ${className}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="section-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </AnimatedSection>
  )
}

// Este archivo exporta: Section.
// Se usa en: About, Skills, Experience, Projects y Contact.
// Importa de: Framer Motion.
