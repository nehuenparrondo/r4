import { sanitizeRecord } from './sanitize'
import type { EntityName, FieldErrors, FormValues } from '../types/portfolio'

const limits = {
  name: [2, 80],
  category: [2, 40],
  role: [2, 90],
  company: [2, 90],
  description: [10, 600],
  period: [0, 50],
  title: [2, 100],
  date: [0, 40],
} as const

type LimitedField = keyof typeof limits

/** Aplica los límites declarados y escribe el error junto al campo correspondiente. */
function validateLength(field: LimitedField, value: string | undefined, errors: FieldErrors): void {
  const [minimum, maximum] = limits[field]
  const text = value ?? ''
  if (!text && minimum > 0) errors[field] = 'Este campo es obligatorio.'
  else if (text.length < minimum) errors[field] = `Debe tener al menos ${minimum} caracteres.`
  else if (text.length > maximum) errors[field] = `No puede superar ${maximum} caracteres.`
}

/** Acepta valores vacíos y restringe enlaces ingresados a HTTP o HTTPS. */
function isValidOptionalUrl(value: string | undefined): boolean {
  if (!value) return true
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

/** Valida y normaliza un registro antes de enviarlo al servicio de persistencia. */
export function validateEntity(entity: EntityName, rawValues: FormValues) {
  const values = sanitizeRecord(rawValues)
  const errors: FieldErrors = {}

  if (entity === 'skills') {
    validateLength('name', asText(values.name), errors)
    validateLength('category', asText(values.category), errors)
  }

  if (entity === 'experiences') {
    ;(['role', 'company', 'description', 'period'] as const).forEach((field) => validateLength(field, asText(values[field]), errors))
  }

  if (entity === 'projects') {
    validateLength('name', asText(values.name), errors)
    validateLength('description', asText(values.description), errors)
    if (!Array.isArray(values.technologies) || !values.technologies.length) errors.technologies = 'Indicá al menos una tecnología.'
    if (!isValidOptionalUrl(asText(values.repository_url))) errors.repository_url = 'Ingresá una URL válida con http o https.'
    if (!isValidOptionalUrl(asText(values.demo_url))) errors.demo_url = 'Ingresá una URL válida con http o https.'
  }

  if (entity === 'achievements') {
    ;(['title', 'description', 'date'] as const).forEach((field) => validateLength(field, asText(values[field]), errors))
  }

  if (entity === 'contact') {
    if (!/^\S+@\S+\.\S+$/.test(asText(values.email))) errors.email = 'Ingresá un email válido.'
    if (!/^[+\d][\d\s()-]{7,20}$/.test(asText(values.phone))) errors.phone = 'Ingresá un teléfono válido.'
  }

  return { values, errors, isValid: Object.keys(errors).length === 0 }
}

/** Normaliza un valor dinámico para validaciones exclusivamente textuales. */
function asText(value: FormValues[string]): string {
  return typeof value === 'string' ? value : ''
}

// Este archivo exporta: validateEntity.
// Se usa en: EntityForm y ContactForm.
// Importa de: src/utils/sanitize.ts y tipos del dominio.
