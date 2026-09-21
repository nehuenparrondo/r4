import { sanitizeRecord } from './sanitize'

const limits = {
  name: [2, 80],
  category: [2, 40],
  role: [2, 90],
  company: [2, 90],
  description: [10, 600],
  period: [0, 50],
  title: [2, 100],
  date: [0, 40],
}

function validateLength(field, value, errors) {
  const [minimum, maximum] = limits[field]
  if (!value && minimum > 0) errors[field] = 'Este campo es obligatorio.'
  else if (value.length < minimum) errors[field] = `Debe tener al menos ${minimum} caracteres.`
  else if (value.length > maximum) errors[field] = `No puede superar ${maximum} caracteres.`
}

function isValidOptionalUrl(value) {
  if (!value) return true
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

/** Valida y normaliza un registro antes de enviarlo al servicio de persistencia. */
export function validateEntity(entity, rawValues) {
  const values = sanitizeRecord(rawValues)
  const errors = {}

  if (entity === 'skills') {
    validateLength('name', values.name, errors)
    validateLength('category', values.category, errors)
  }

  if (entity === 'experiences') {
    ;['role', 'company', 'description', 'period'].forEach((field) => validateLength(field, values[field], errors))
  }

  if (entity === 'projects') {
    validateLength('name', values.name, errors)
    validateLength('description', values.description, errors)
    if (!values.technologies?.length) errors.technologies = 'Indicá al menos una tecnología.'
    if (!isValidOptionalUrl(values.repository_url)) errors.repository_url = 'Ingresá una URL válida con http o https.'
    if (!isValidOptionalUrl(values.demo_url)) errors.demo_url = 'Ingresá una URL válida con http o https.'
  }

  if (entity === 'achievements') {
    ;['title', 'description', 'date'].forEach((field) => validateLength(field, values[field], errors))
  }

  if (entity === 'contact') {
    if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Ingresá un email válido.'
    if (!/^[+\d][\d\s()-]{7,20}$/.test(values.phone)) errors.phone = 'Ingresá un teléfono válido.'
  }

  return { values, errors, isValid: Object.keys(errors).length === 0 }
}

// Este archivo exporta: validateEntity.
// Se usa en: EntityForm y ContactForm.
// Importa de: src/utils/sanitize.js.
