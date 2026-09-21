import { useCallback, useEffect, useMemo, useState } from 'react'
import { portfolioSeed } from '../data/portfolioSeed'
import { portfolioService } from '../services/portfolioService'

/** Centraliza la carga y el ABM para mantener las vistas sincronizadas. */
export function usePortfolioController() {
  const [data, setData] = useState(portfolioSeed)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await portfolioService.getAll())
    } catch (requestError) {
      setError(requestError.message || 'No se pudieron cargar los datos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const saveItem = useCallback(
    async (entity, values, secret) => {
      await portfolioService.save(entity, values, secret)
      await refresh()
    },
    [refresh],
  )

  const removeItem = useCallback(
    async (entity, id, secret) => {
      await portfolioService.remove(entity, id, secret)
      await refresh()
    },
    [refresh],
  )

  return useMemo(
    () => ({ data, loading, error, mode: portfolioService.mode, refresh, saveItem, removeItem }),
    [data, loading, error, refresh, saveItem, removeItem],
  )
}

// Este archivo exporta: usePortfolioController.
// Se usa en: src/context/PortfolioProvider.jsx.
// Importa de: React, datos semilla y portfolioService.
