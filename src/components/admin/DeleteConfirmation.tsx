import { useState, type MouseEvent } from 'react'
import { Trash2, X } from 'lucide-react'

interface DeleteConfirmationProps {
  itemName: string
  itemType: string
  onCancel: () => void
  onConfirm: () => Promise<void>
}

/** Solicita confirmación dentro de la interfaz antes de eliminar un registro. */
export function DeleteConfirmation({ itemName, itemType, onCancel, onConfirm }: DeleteConfirmationProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  /** Ejecuta la baja una sola vez y mantiene el diálogo abierto si falla. */
  async function confirmDelete() {
    setDeleting(true)
    setError('')
    try {
      await onConfirm()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar el registro.')
      setDeleting(false)
    }
  }

  return (
    <div className="form-overlay" role="presentation" onMouseDown={(event: MouseEvent<HTMLDivElement>) => event.target === event.currentTarget && !deleting && onCancel()}>
      <section className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-confirmation-title">
        <div className="form-heading">
          <div><span>Confirmar eliminación</span><h3 id="delete-confirmation-title">¿Eliminar {itemType}?</h3></div>
          <button className="icon-button" type="button" onClick={onCancel} disabled={deleting} aria-label="Cerrar confirmación"><X size={19} /></button>
        </div>
        <p>Se eliminará <strong>“{itemName}”</strong>. Esta acción no se puede deshacer.</p>
        {error && <p className="form-error" role="status">{error}</p>}
        <div className="form-actions">
          <button className="button secondary" type="button" onClick={onCancel} disabled={deleting}>Cancelar</button>
          <button className="button danger-button" type="button" onClick={confirmDelete} disabled={deleting}>
            <Trash2 size={17} /> {deleting ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </section>
    </div>
  )
}

// Este archivo exporta: DeleteConfirmation.
// Se usa en: EntityManager.
// Importa de: React y Lucide.
