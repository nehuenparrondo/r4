import { useState } from 'react'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { validateEntity } from '../../utils/validation'

/** Permite modificar los datos de contacto, manteniendo el nombre fuera del formulario. */
export function ContactForm({ secret }) {
  const { data, saveItem } = usePortfolioData()
  const [values, setValues] = useState(data.contact)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  function updateField(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validation = validateEntity('contact', values)
    setErrors(validation.errors)
    setMessage('')
    if (!validation.isValid) return
    try {
      await saveItem('contact', validation.values, secret)
      setMessage('Contacto actualizado.')
    } catch (error) {
      setMessage(error.message || 'No se pudo actualizar el contacto.')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="manager-heading"><div><span>Contenido</span><h3>Contacto</h3></div></div>
      <label><span>Email</span><input name="email" type="email" value={values.email} onChange={updateField} />{errors.email && <small>{errors.email}</small>}</label>
      <label><span>Teléfono</span><input name="phone" type="tel" value={values.phone} onChange={updateField} />{errors.phone && <small>{errors.phone}</small>}</label>
      <p className="protected-field"><strong>Nombre protegido:</strong> PARRONDO Nehuen no forma parte de los campos editables.</p>
      {message && <p className="form-message" role="status">{message}</p>}
      <button className="button primary" type="submit">Guardar contacto</button>
    </form>
  )
}

// Este archivo exporta: ContactForm.
// Se usa en: AdminPanel.
// Importa de: React, contexto de datos y validaciones.
