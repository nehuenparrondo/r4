import { beforeEach, describe, expect, it } from 'vitest'
import { portfolioService } from './portfolioService'

describe('portfolioService en modo local', () => {
  beforeEach(() => localStorage.clear())

  it('protege el acceso con una clave creada por el propietario', async () => {
    await portfolioService.configureLocalAdmin('clave-segura')

    await expect(portfolioService.verifyAdmin('clave-segura')).resolves.toBe(true)
    await expect(portfolioService.verifyAdmin('clave-incorrecta')).resolves.toBe(false)
  })

  it('realiza alta, modificación y baja persistentes', async () => {
    await portfolioService.configureLocalAdmin('clave-segura')
    await portfolioService.save('skills', { name: 'Prueba', category: 'QA' }, 'clave-segura')

    const created = (await portfolioService.getAll()).skills.find((skill) => skill.name === 'Prueba')
    expect(created).toBeTruthy()
    if (!created) throw new Error('No se creó la habilidad de prueba.')

    await portfolioService.save('skills', { ...created, category: 'Validación' }, 'clave-segura')
    const updated = (await portfolioService.getAll()).skills.find((skill) => skill.id === created.id)
    if (!updated) throw new Error('No se encontró la habilidad modificada.')
    expect(updated.category).toBe('Validación')

    await portfolioService.remove('skills', created.id, 'clave-segura')
    const removed = (await portfolioService.getAll()).skills.find((skill) => skill.id === created.id)
    expect(removed).toBeUndefined()
  })
})

// Este archivo exporta: pruebas del acceso y ABM local.
// Se usa en: npm test.
// Importa de: src/services/portfolioService.ts y Vitest.
