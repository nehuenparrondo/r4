import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { DeleteConfirmation } from './DeleteConfirmation'
import { EntityForm } from './EntityForm'
import { entityConfig } from './entityConfig'
import type { CollectionEntity, FormValues, PortfolioItem } from '../../types/portfolio'

interface EntityManagerProps {
  entity: CollectionEntity
  secret: string
}

function getItemTitle(item: PortfolioItem, field: 'name' | 'role' | 'title'): string {
  return String((item as unknown as Record<string, unknown>)[field] ?? '')
}

function getItemMeta(item: PortfolioItem): string {
  if ('category' in item) return item.category
  if ('company' in item) return item.company
  if ('date' in item) return item.date
  return ''
}

/** Implementa alta, modificación y baja para una colección del portfolio. */
export function EntityManager({ entity, secret }: EntityManagerProps) {
  const { data, saveItem, removeItem } = usePortfolioData()
  const config = entityConfig[entity]
  const items = data[entity] as PortfolioItem[]
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<PortfolioItem | null>(null)

  function startCreate() {
    setEditingItem(null)
    setFormOpen(true)
  }

  function startEdit(item: PortfolioItem) {
    setEditingItem(item)
    setFormOpen(true)
  }

  async function handleSave(values: FormValues) {
    await saveItem(entity, values, secret)
    setFormOpen(false)
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    await removeItem(entity, pendingDelete.id, secret)
    setPendingDelete(null)
  }

  return (
    <section className="manager-section">
      <div className="manager-heading">
        <div><span>Contenido</span><h3>{config.plural}</h3></div>
        <button className="button compact primary" type="button" onClick={startCreate}><Plus size={17} /> Agregar</button>
      </div>

      <div className="manager-list">
        {items.length ? items.map((item) => (
          <article key={item.id}>
            <div><strong>{getItemTitle(item, config.titleField)}</strong><span>{getItemMeta(item)}</span></div>
            <div className="row-actions">
              <button className="icon-button" type="button" onClick={() => startEdit(item)} aria-label={`Editar ${getItemTitle(item, config.titleField)}`}><Pencil size={17} /></button>
              <button className="icon-button danger" type="button" onClick={() => setPendingDelete(item)} aria-label={`Eliminar ${getItemTitle(item, config.titleField)}`}><Trash2 size={17} /></button>
            </div>
          </article>
        )) : <p className="empty-state">No hay registros cargados.</p>}
      </div>

      {formOpen && <EntityForm entity={entity} item={editingItem} onCancel={() => setFormOpen(false)} onSave={handleSave} />}
      {pendingDelete && (
        <DeleteConfirmation
          itemName={getItemTitle(pendingDelete, config.titleField)}
          itemType={config.singular.toLowerCase()}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  )
}

// Este archivo exporta: EntityManager.
// Se usa en: AdminPanel.
// Importa de: Lucide, contexto de datos, EntityForm y entityConfig.
