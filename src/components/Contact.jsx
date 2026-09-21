import { Mail, MessageCircle, Phone } from 'lucide-react'
import { Section } from './Section'
import { usePortfolioData } from '../hooks/usePortfolioData'

/** Ofrece medios de contacto directos y accesibles. */
export function Contact() {
  const { data } = usePortfolioData()
  const whatsappPhone = data.contact.phone.replace(/\D/g, '')

  return (
    <Section id="contacto" eyebrow="05 · Contacto" title="Hablemos" className="contact-section">
      <div className="contact-grid">
        <div className="contact-intro">
          <p>Podés contactarme por email o teléfono.</p>
          <span>Disponible para conversar sobre proyectos y oportunidades.</span>
        </div>
        <div className="contact-actions">
          <a href={`mailto:${data.contact.email}`}><Mail size={22} /><span>Email<strong>{data.contact.email}</strong></span></a>
          <a href={`tel:${data.contact.phone}`}><Phone size={22} /><span>Teléfono<strong>{data.contact.phone}</strong></span></a>
          <a href={`https://wa.me/54${whatsappPhone}`} target="_blank" rel="noreferrer"><MessageCircle size={22} /><span>WhatsApp<strong>Iniciar conversación</strong></span></a>
        </div>
      </div>
    </Section>
  )
}

// Este archivo exporta: Contact.
// Se usa en: src/App.jsx.
// Importa de: Lucide, Section y usePortfolioData.
