import { motion } from 'framer-motion'
import { ArrowDown, Mail, Phone } from 'lucide-react'
import { PERSON_NAME } from '../data/portfolioSeed'
import { useContactActions } from '../hooks/useContactActions'
import { usePortfolioData } from '../hooks/usePortfolioData'

const AnimatedDiv = motion.div

/** Presenta la identidad fija y los accesos rápidos de contacto. */
export function Hero() {
  const { data } = usePortfolioData()
  const { feedback, handleContact } = useContactActions()

  return (
    <section id="inicio" className="hero section-shell">
      <AnimatedDiv
        className="hero-copy"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65 }}
      >
        <p className="eyebrow">Nehuen Parrondo · Front-end en formación</p>
        <h1>
          <span>{PERSON_NAME.split(' ')[0]}</span>
          {PERSON_NAME.split(' ')[1]}
        </h1>
        <p className="hero-role">Estudiante técnico enfocado en desarrollo web e interfaces.</p>
        <div className="hero-actions">
          <a className="button primary" href={`mailto:${data.contact.email}`} onClick={(event) => handleContact(event, data.contact.email, 'Email')}>
            <Mail size={18} /> Escribime
          </a>
          <a className="button secondary" href={`tel:${data.contact.phone}`} onClick={(event) => handleContact(event, data.contact.phone, 'Teléfono')}>
            <Phone size={18} /> Llamar
          </a>
        </div>
        {feedback && <p className="contact-feedback" role="status">{feedback}</p>}
      </AnimatedDiv>

      <AnimatedDiv
        className="hero-card"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.12 }}
        aria-hidden="true"
      >
        <div className="hero-card-top"><span>EESTN5</span><span>Mar del Plata</span></div>
        <strong>NP</strong>
        <div className="hero-card-bottom"><span>Informática</span><span>Web · UI</span></div>
      </AnimatedDiv>

      <a className="scroll-cue" href="#sobre-mi">
        Conocer más <ArrowDown size={17} />
      </a>
    </section>
  )
}

// Este archivo exporta: Hero.
// Se usa en: src/App.jsx.
// Importa de: Framer Motion, Lucide, datos protegidos y usePortfolioData.
