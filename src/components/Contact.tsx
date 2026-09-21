import { Mail, MessageCircle, Phone } from 'lucide-react'
import { Section } from './Section'
import { useContactActions } from '../hooks/useContactActions'
import { usePortfolioData } from '../hooks/usePortfolioData'

/** Ofrece medios de contacto directos y accesibles. */
export function Contact() {
  const { data } = usePortfolioData()
  const { feedback, handleContact } = useContactActions()
  const whatsappPhone = data.contact.phone.replace(/\D/g, '')

  return (
    <Section id="contacto" eyebrow="Contacto directo" title="¿Creamos algo?" className="contact-section">
      <div className="contact-grid">
        <div className="contact-intro">
          <p>Elegí el medio que te resulte más cómodo.</p>
          <span>En computadora, email y teléfono se copian automáticamente. En celular se abre la aplicación correspondiente.</span>
          {feedback && <p className="contact-feedback" role="status">{feedback}</p>}
        </div>
        <div className="contact-actions">
          <a href={`mailto:${data.contact.email}`} onClick={(event) => handleContact(event, data.contact.email, 'Email')}><Mail size={22} /><span>Email<strong>{data.contact.email}</strong></span></a>
          <a href={`tel:${data.contact.phone}`} onClick={(event) => handleContact(event, data.contact.phone, 'Teléfono')}><Phone size={22} /><span>Teléfono<strong>{data.contact.phone}</strong></span></a>
          <a href={`https://api.whatsapp.com/send?phone=54${whatsappPhone}`} target="_blank" rel="noreferrer"><MessageCircle size={22} /><span>WhatsApp<strong>Abrir conversación</strong></span></a>
        </div>
      </div>
    </Section>
  )
}

// Este archivo exporta: Contact.
// Se usa en: src/App.tsx.
// Importa de: Lucide, Section y usePortfolioData.
