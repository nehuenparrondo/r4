import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { EntityForm } from './EntityForm'
import { entityConfig } from './entityConfig'

/** Implementa alta, modificación y baja para una colección del portfolio. */
export function EntityManager({ entity, secret }) {
  const { data, saveItem, removeItem } = usePortfolioData()
  const config = entityConfig[entity]
  const [editingItem, setEditingItem] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [actionError, setActionError] = useState('')

  function startCreate() {
    setEditingItem(null)
    setFormOpen(true)
  }

  function startEdit(item) {
    setEditingItem(item)
    setFormOpen(true)
  }

  async function handleSave(values) {
    await saveItem(entity, values, secret)
    setFormOpen(false)
  }

  async function handleDelete(item) {
    if (!window.confirm(`¿Eliminar ${config.singular} “${item[config.titleField]}”?`)) return
    setActionError('')
    try {
      await removeItem(entity, item.id, secret)
    } catch (error) {
      setActionError(error.message || 'No se pudo eliminar el registro.')
    }
  }

  return (
    <section className="manager-section">
      <div className="manager-heading">
        <div><span>Contenido</span><h3>{config.plural}</h3></div>
        <button className="button compact primary" type="button" onClick={startCreate}><Plus size={17} /> Agregar</button>
      </div>

      {actionError && <p className="form-error" role="alert">{actionError}</p>}
      <div className="manager-list">
        {data[entity].length ? data[entity].map((item) => (
          <article key={item.id}>
            <div><strong>{item[config.titleField]}</strong><span>{item.category || item.company || item.date || ''}</span></div>
            <div className="row-actions">
              <button className="icon-button" type="button" onClick={() => startEdit(item)} aria-label={`Editar ${item[config.titleField]}`}><Pencil size={17} /></button>
              <button className="icon-button danger" type="button" onClick={() => handleDelete(item)} aria-label={`Eliminar ${item[config.titleField]}`}><Trash2 size={17} /></button>
            </div>
          </article>
        )) : <p className="empty-state">No hay registros cargados.</p>}
      </div>

      {formOpen && <EntityForm entity={entity} item={editingItem} onCancel={() => setFormOpen(false)} onSave={handleSave} />}
    </section>
  )
}

// Este archivo exporta: EntityManager.
// Se usa en: AdminPanel.
// Importa de: Lucide, contexto de datos, EntityForm y entityConfig.
