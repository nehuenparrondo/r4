import { useState, type ChangeEvent, type FormEvent } from 'react'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { validateEntity } from '../../utils/validation'
import type { FieldErrors, FormValues } from '../../types/portfolio'

interface ContactFormProps {
  secret: string
}

/** Permite modificar los datos de contacto, manteniendo el nombre fuera del formulario. */
export function ContactForm({ secret }: ContactFormProps) {
  const { data, saveItem } = usePortfolioData()
  const [values, setValues] = useState<FormValues>({
    id: data.contact.id,
    email: data.contact.email,
    phone: data.contact.phone,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [message, setMessage] = useState('')

  /** Mantiene email y teléfono sincronizados con sus controles. */
  function updateField(event: ChangeEvent<HTMLInputElement>) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  /** Valida y guarda contacto sin exponer el nombre protegido como campo editable. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validation = validateEntity('contact', values)
    setErrors(validation.errors)
    setMessage('')
    if (!validation.isValid) return
    try {
      await saveItem('contact', validation.values, secret)
      setMessage('Contacto actualizado.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo actualizar el contacto.')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="manager-heading"><div><span>Contenido</span><h3>Contacto</h3></div></div>
      <label><span>Email</span><input name="email" type="email" value={String(values.email ?? '')} onChange={updateField} />{errors.email && <small>{errors.email}</small>}</label>
      <label><span>Teléfono</span><input name="phone" type="tel" value={String(values.phone ?? '')} onChange={updateField} />{errors.phone && <small>{errors.phone}</small>}</label>
      <p className="protected-field"><strong>Nombre protegido:</strong> PARRONDO Nehuen no forma parte de los campos editables.</p>
      {message && <p className="form-message" role="status">{message}</p>}
      <button className="button primary" type="submit">Guardar contacto</button>
    </form>
  )
}

// Este archivo exporta: ContactForm.
// Se usa en: AdminPanel.
// Importa de: React, contexto de datos y validaciones.
