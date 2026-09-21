import DOMPurify from 'dompurify'

/** Elimina etiquetas y atributos HTML antes de guardar texto ingresado. */
export function sanitizeText(value) {
  return DOMPurify.sanitize(String(value ?? '').trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}

/** Sanitiza recursivamente los campos de texto de un objeto de formulario. */
export function sanitizeRecord(record) {
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
