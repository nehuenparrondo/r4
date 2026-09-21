import DOMPurify from 'dompurify'
import type { FormValues } from '../types/portfolio'

/** Elimina etiquetas y atributos HTML antes de guardar texto ingresado. */
export function sanitizeText(value: unknown): string {
  return DOMPurify.sanitize(String(value ?? '').trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}

/** Sanitiza recursivamente los campos de texto de un objeto de formulario. */
export function sanitizeRecord(record: FormValues): FormValues {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => {
      if (Array.isArray(value)) return [key, value.map(sanitizeText).filter(Boolean)]
      if (typeof value === 'string') return [key, sanitizeText(value)]
      return [key, value]
    }),
  )
}

// Este archivo exporta: sanitizeText y sanitizeRecord.
// Se usa en: validaciones y formularios administrativos.
// Importa de: DOMPurify.
