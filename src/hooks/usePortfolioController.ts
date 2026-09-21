import { useCallback, useEffect, useMemo, useState } from 'react'
import { portfolioSeed } from '../data/portfolioSeed'
import { portfolioService } from '../services/portfolioService'
import type { CollectionEntity, EntityName, FormValues, PortfolioData } from '../types/portfolio'

/** Centraliza la carga y el ABM para mantener las vistas sincronizadas. */
export function usePortfolioController() {
  const [data, setData] = useState<PortfolioData>(portfolioSeed)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /** Consulta la fuente activa y reemplaza el estado completo de forma atómica. */
  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await portfolioService.getAll())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar los datos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  /** Guarda un registro y refresca todas las secciones que dependen de él. */
  const saveItem = useCallback(
    async (entity: EntityName, values: FormValues, secret: string) => {
      await portfolioService.save(entity, values, secret)
      await refresh()
    },
    [refresh],
  )

  /** Elimina un registro de colección y vuelve a sincronizar el contexto. */
  const removeItem = useCallback(
    async (entity: CollectionEntity, id: string, secret: string) => {
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
// Se usa en: src/context/PortfolioProvider.tsx.
// Importa de: React, datos semilla y portfolioService.
