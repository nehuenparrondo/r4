import { useEffect, useState, type ChangeEvent, type FormEvent, type MouseEvent } from 'react'
import { X } from 'lucide-react'
import { validateEntity } from '../../utils/validation'
import { entityConfig } from './entityConfig'
import type { CollectionEntity, FieldErrors, FormValues, PortfolioItem } from '../../types/portfolio'

interface EntityFormProps {
  entity: CollectionEntity
  item: PortfolioItem | null
  onCancel: () => void
  onSave: (values: FormValues) => Promise<void>
}

/** Adapta una entidad tipada al formato genérico del formulario reutilizable. */
function buildInitialValues(entity: CollectionEntity, item: PortfolioItem | null): FormValues {
  const values = Object.fromEntries(Object.entries(item ?? {})) as FormValues
  if (entity === 'projects') {
    const technologies = item && 'technologies' in item ? item.technologies : []
    values.technologies = technologies.join(', ')
  }
  return values
}

/** Edita o crea un registro y muestra errores junto a cada campo. */
export function EntityForm({ entity, item, onCancel, onSave }: EntityFormProps) {
  const config = entityConfig[entity]
  const [values, setValues] = useState(() => buildInitialValues(entity, item))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => setValues(buildInitialValues(entity, item)), [entity, item])

  /** Actualiza un campo y limpia su error anterior mientras el usuario escribe. */
  function updateField(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  /** Normaliza tecnologías, valida, sanitiza y delega la persistencia. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const technologyText = typeof values.technologies === 'string' ? values.technologies : ''
    const candidate = {
      ...values,
      technologies: entity === 'projects'
        ? technologyText.split(',').map((technology) => technology.trim()).filter(Boolean)
        : values.technologies,
    }
    const validation = validateEntity(entity, candidate)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    setSaving(true)
    setSubmitError('')
    try {
      await onSave({ ...validation.values, id: item?.id })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo guardar el cambio.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-overlay" role="presentation" onMouseDown={(event: MouseEvent<HTMLDivElement>) => event.target === event.currentTarget && onCancel()}>
      <form className="entity-form" onSubmit={handleSubmit} noValidate>
        <div className="form-heading">
          <div><span>{item ? 'Modificar' : 'Agregar'}</span><h3>{config.singular}</h3></div>
          <button className="icon-button" type="button" onClick={onCancel} aria-label="Cerrar formulario"><X size={19} /></button>
        </div>

        {config.fields.map((field) => (
          <label key={field.name}>
            <span>{field.label}{field.optional ? ' (opcional)' : ''}</span>
            {field.type === 'textarea' ? (
              <textarea name={field.name} value={String(values[field.name] ?? '')} onChange={updateField} rows={4} placeholder={field.placeholder} />
            ) : (
              <input name={field.name} type={field.type === 'tags' ? 'text' : field.type} value={String(values[field.name] ?? '')} onChange={updateField} placeholder={field.placeholder} />
            )}
            {errors[field.name] && <small>{errors[field.name]}</small>}
          </label>
        ))}

        {submitError && <p className="form-error" role="status">{submitError}</p>}
        <div className="form-actions">
          <button className="button secondary" type="button" onClick={onCancel}>Cancelar</button>
          <button className="button primary" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  )
}

// Este archivo exporta: EntityForm.
// Se usa en: EntityManager.
// Importa de: React, Lucide, validaciones y entityConfig.
