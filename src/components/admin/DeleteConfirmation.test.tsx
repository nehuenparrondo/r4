import { act } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DeleteConfirmation } from './DeleteConfirmation'

describe('DeleteConfirmation', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  afterEach(() => {
    act(() => root?.unmount())
    container?.remove()
  })

  it('confirma dentro de la interfaz sin usar diálogos del navegador', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    container = document.createElement('div')
    document.body.appendChild(container)
    const mountedRoot = createRoot(container)
    root = mountedRoot

    await act(async () => {
      mountedRoot.render(<DeleteConfirmation itemName="HTML" itemType="habilidad" onCancel={() => {}} onConfirm={onConfirm} />)
    })

    expect(container.querySelector('[role="dialog"]')).toBeTruthy()
    const deleteButton = [...container.querySelectorAll('button')].find((button) => button.textContent.includes('Eliminar'))
    if (!deleteButton) throw new Error('No se encontró el botón Eliminar.')

    await act(async () => deleteButton.click())

    expect(onConfirm).toHaveBeenCalledOnce()
  })
})

// Este archivo exporta: pruebas de la confirmación integrada.
// Se usa en: npm test.
// Importa de: React, Vitest y DeleteConfirmation.
