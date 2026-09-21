import { describe, expect, it } from 'vitest'
import { validateEntity } from './validation'

describe('validateEntity', () => {
  it('rechaza proyectos sin tecnologías', () => {
    const result = validateEntity('projects', {
      name: 'Proyecto',
      description: 'Descripción suficientemente extensa.',
      technologies: [],
      repository_url: '',
      demo_url: '',
    })

    expect(result.errors.technologies).toBeTruthy()
  })

  it('acepta datos de contacto válidos', () => {
    const result = validateEntity('contact', {
      email: 'parrondonehuen@gmail.com',
      phone: '2236965171',
    })

    expect(result.isValid).toBe(true)
  })
})

// Este archivo exporta: pruebas unitarias de validación.
// Se usa en: npm test.
// Importa de: src/utils/validation.js y Vitest.
