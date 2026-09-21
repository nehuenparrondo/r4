import type { CollectionEntity } from '../../types/portfolio'

export type EntityTitleField = 'name' | 'role' | 'title'

export interface EntityFieldConfig {
  name: string
  label: string
  type: 'text' | 'textarea' | 'tags' | 'url'
  optional?: boolean
  placeholder?: string
}

interface EntityConfiguration {
  singular: string
  plural: string
  titleField: EntityTitleField
  fields: EntityFieldConfig[]
}

export const entityConfig: Record<CollectionEntity, EntityConfiguration> = {
  skills: {
    singular: 'habilidad',
    plural: 'Habilidades',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', placeholder: 'Ej.: React' },
      { name: 'category', label: 'Categoría', type: 'text', placeholder: 'Ej.: Desarrollo web' },
    ],
  },
  experiences: {
    singular: 'experiencia',
    plural: 'Experiencias',
    titleField: 'role',
    fields: [
      { name: 'role', label: 'Puesto o actividad', type: 'text' },
      { name: 'company', label: 'Empresa o ámbito', type: 'text' },
      { name: 'description', label: 'Descripción', type: 'textarea' },
      { name: 'period', label: 'Período', type: 'text', optional: true, placeholder: 'Ej.: 2025 · Actualidad' },
    ],
  },
  projects: {
    singular: 'proyecto',
    plural: 'Proyectos',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Nombre', type: 'text' },
      { name: 'description', label: 'Descripción', type: 'textarea' },
      { name: 'technologies', label: 'Tecnologías', type: 'tags', placeholder: 'React, CSS, Supabase' },
      { name: 'repository_url', label: 'Repositorio', type: 'url', optional: true, placeholder: 'https://github.com/...' },
      { name: 'demo_url', label: 'Proyecto publicado', type: 'url', optional: true, placeholder: 'https://...' },
    ],
  },
  achievements: {
    singular: 'logro',
    plural: 'Logros',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Título', type: 'text' },
      { name: 'description', label: 'Descripción', type: 'textarea' },
      { name: 'date', label: 'Fecha', type: 'text', optional: true, placeholder: 'Ej.: 2026' },
    ],
  },
}

// Este archivo exporta: entityConfig con los campos administrables.
// Se usa en: EntityManager y EntityForm.
// Importa de: tipos del dominio.
