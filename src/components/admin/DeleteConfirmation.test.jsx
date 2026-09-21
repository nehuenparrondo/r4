import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DeleteConfirmation } from './DeleteConfirmation'

describe('DeleteConfirmation', () => {
  let root
  let container

  afterEach(() => {
    act(() => root?.unmount())
    container?.remove()
  })

  it('confirma dentro de la interfaz sin usar diálogos del navegador', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root.render(<DeleteConfirmation itemName="HTML" itemType="habilidad" onCancel={() => {}} onConfirm={onConfirm} />)
    })

    expect(container.querySelector('[role="dialog"]')).toBeTruthy()
    const deleteButton = [...container.querySelectorAll('button')].find((button) => button.textContent.includes('Eliminar'))

    await act(async () => deleteButton.click())

    expect(onConfirm).toHaveBeenCalledOnce()
  })
})

// Este archivo exporta: pruebas de la confirmación integrada.
// Se usa en: npm test.
// Importa de: React, Vitest y DeleteConfirmation.
