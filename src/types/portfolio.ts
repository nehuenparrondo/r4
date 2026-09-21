export type CollectionEntity = 'skills' | 'experiences' | 'projects' | 'achievements'
export type EntityName = CollectionEntity | 'contact'
export type PersistenceMode = 'local' | 'supabase'
export type Theme = 'light' | 'dark'

export interface Skill {
  id: string
  name: string
  category: string
}

export interface Experience {
  id: string
  role: string
  company: string
  description: string
  period: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  repository_url: string
  demo_url: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
}

export interface ContactData {
  id: string
  email: string
  phone: string
}

export interface PortfolioData {
  skills: Skill[]
  experiences: Experience[]
  projects: Project[]
  achievements: Achievement[]
  contact: ContactData
}

export type PortfolioItem = Skill | Experience | Project | Achievement
export type FormValue = string | string[] | undefined
export type FormValues = Record<string, FormValue>
export type FieldErrors = Record<string, string>

export interface PortfolioContextValue {
  data: PortfolioData
  loading: boolean
  error: string
  mode: PersistenceMode
  refresh: () => Promise<void>
  saveItem: (entity: EntityName, values: FormValues, secret: string) => Promise<void>
  removeItem: (entity: CollectionEntity, id: string, secret: string) => Promise<void>
}

// Este archivo exporta: los tipos de dominio, formularios y contexto del portfolio.
// Se usa en: componentes, hooks, servicios, validaciones y datos semilla.
// Importa de: ninguna carpeta externa.
