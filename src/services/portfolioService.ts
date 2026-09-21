import type { SupabaseClient } from '@supabase/supabase-js'
import { portfolioSeed } from '../data/portfolioSeed'
import type {
  Achievement,
  CollectionEntity,
  ContactData,
  EntityName,
  Experience,
  FormValues,
  PersistenceMode,
  PortfolioData,
  Project,
  Skill,
} from '../types/portfolio'
import { isSupabaseConfigured, supabase } from './supabaseClient'

const STORAGE_KEY = 'parrondo-portfolio-demo-data'
const ADMIN_HASH_KEY = 'parrondo-portfolio-demo-admin-hash'

interface ProjectTechnologyLink {
  position: number
  technologies: { name: string } | null
}

interface RemoteProject extends Omit<Project, 'technologies'> {
  project_technologies: ProjectTechnologyLink[]
}

interface PortfolioService {
  mode: PersistenceMode
  getAll: () => Promise<PortfolioData>
  getAdminState: () => Promise<{ requiresSetup: boolean }>
  configureLocalAdmin: (secret: string) => Promise<void>
  verifyAdmin: (secret: string) => Promise<boolean>
  save: (entity: EntityName, payload: FormValues, secret: string) => Promise<unknown>
  remove: (entity: CollectionEntity, id: string, secret: string) => Promise<unknown>
}

function cloneSeed(): PortfolioData {
  return JSON.parse(JSON.stringify(portfolioSeed)) as PortfolioData
}

function readLocalData(): PortfolioData {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return cloneSeed()
  try {
    return { ...cloneSeed(), ...(JSON.parse(saved) as Partial<PortfolioData>) }
  } catch {
    return cloneSeed()
  }
}

function writeLocalData(data: PortfolioData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

async function hashSecret(secret: string): Promise<string> {
  const bytes = new TextEncoder().encode(secret)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function getSupabaseClient(): SupabaseClient {
  if (!supabase) throw new Error('Supabase no está configurado.')
  return supabase
}

async function getRemoteData(): Promise<PortfolioData> {
  const client = getSupabaseClient()
  const [skills, experiences, projects, achievements, contact] = await Promise.all([
    client.from('skills').select('*').order('sort_order', { ascending: true }),
    client.from('experiences').select('*').order('sort_order', { ascending: true }),
    client.from('projects').select('*, project_technologies(position, technologies(name))').order('sort_order', { ascending: true }),
    client.from('achievements').select('*').order('sort_order', { ascending: true }),
    client.from('contact').select('*').eq('id', 'main').single(),
  ])
  const failed = [skills, experiences, projects, achievements, contact].find((result) => result.error)
  if (failed?.error) throw failed.error

  const remoteProjects = (projects.data ?? []) as unknown as RemoteProject[]
  return {
    skills: (skills.data ?? []) as unknown as Skill[],
    experiences: (experiences.data ?? []) as unknown as Experience[],
    projects: remoteProjects.map(({ project_technologies: links, ...project }) => ({
      ...project,
      technologies: links
        .filter((link) => link.technologies)
        .sort((first, second) => first.position - second.position)
        .map((link) => link.technologies?.name ?? ''),
    })),
    achievements: (achievements.data ?? []) as unknown as Achievement[],
    contact: contact.data as unknown as ContactData,
  }
}

async function mutateRemote(
  action: 'upsert' | 'delete',
  entity: EntityName,
  payload: FormValues,
  secret: string,
): Promise<unknown> {
  const { data, error } = await getSupabaseClient().rpc(`admin_${action}_portfolio_item`, {
    access_secret: secret,
    entity_name: entity,
    item_payload: payload,
  })
  if (error) throw error
  return data
}

function textValue(payload: FormValues, field: string): string {
  return typeof payload[field] === 'string' ? payload[field] : ''
}

function upsertCollection<T extends { id: string }>(collection: T[], item: T): void {
  const index = collection.findIndex((current) => current.id === item.id)
  if (index >= 0) collection[index] = item
  else collection.push(item)
}

function upsertLocalItem(data: PortfolioData, entity: CollectionEntity, payload: FormValues, id: string): void {
  if (entity === 'skills') {
    upsertCollection(data.skills, { id, name: textValue(payload, 'name'), category: textValue(payload, 'category') })
    return
  }
  if (entity === 'experiences') {
    upsertCollection(data.experiences, {
      id,
      role: textValue(payload, 'role'),
      company: textValue(payload, 'company'),
      description: textValue(payload, 'description'),
      period: textValue(payload, 'period'),
    })
    return
  }
  if (entity === 'projects') {
    upsertCollection(data.projects, {
      id,
      name: textValue(payload, 'name'),
      description: textValue(payload, 'description'),
      technologies: Array.isArray(payload.technologies) ? payload.technologies : [],
      repository_url: textValue(payload, 'repository_url'),
      demo_url: textValue(payload, 'demo_url'),
    })
    return
  }
  upsertCollection(data.achievements, {
    id,
    title: textValue(payload, 'title'),
    description: textValue(payload, 'description'),
    date: textValue(payload, 'date'),
  })
}

function removeLocalItem(data: PortfolioData, entity: CollectionEntity, id: string): void {
  if (entity === 'skills') data.skills = data.skills.filter((item) => item.id !== id)
  if (entity === 'experiences') data.experiences = data.experiences.filter((item) => item.id !== id)
  if (entity === 'projects') data.projects = data.projects.filter((item) => item.id !== id)
  if (entity === 'achievements') data.achievements = data.achievements.filter((item) => item.id !== id)
}

export const portfolioService: PortfolioService = {
  mode: isSupabaseConfigured ? 'supabase' : 'local',

  async getAll() {
    return isSupabaseConfigured ? getRemoteData() : readLocalData()
  },

  async getAdminState() {
    if (isSupabaseConfigured) return { requiresSetup: false }
    return { requiresSetup: !localStorage.getItem(ADMIN_HASH_KEY) }
  },

  async configureLocalAdmin(secret) {
    if (isSupabaseConfigured) throw new Error('La clave de producción se configura en Supabase.')
    if (secret.length < 8) throw new Error('La clave debe tener al menos 8 caracteres.')
    localStorage.setItem(ADMIN_HASH_KEY, await hashSecret(secret))
  },

  async verifyAdmin(secret) {
    if (isSupabaseConfigured) {
      const { data, error } = await getSupabaseClient().rpc('verify_admin_access', { access_secret: secret })
      if (error) throw error
      return Boolean(data)
    }
    const storedHash = localStorage.getItem(ADMIN_HASH_KEY)
    return Boolean(storedHash && storedHash === (await hashSecret(secret)))
  },

  async save(entity, payload, secret) {
    if (isSupabaseConfigured) return mutateRemote('upsert', entity, payload, secret)
    if (!(await portfolioService.verifyAdmin(secret))) throw new Error('Clave de administración incorrecta.')
    const data = readLocalData()
    if (entity === 'contact') {
      data.contact = {
        id: 'main',
        email: textValue(payload, 'email'),
        phone: textValue(payload, 'phone'),
      }
    } else {
      const id = textValue(payload, 'id') || crypto.randomUUID()
      upsertLocalItem(data, entity, payload, id)
    }
    writeLocalData(data)
    return undefined
  },

  async remove(entity, id, secret) {
    if (isSupabaseConfigured) return mutateRemote('delete', entity, { id }, secret)
    if (!(await portfolioService.verifyAdmin(secret))) throw new Error('Clave de administración incorrecta.')
    const data = readLocalData()
    removeLocalItem(data, entity, id)
    writeLocalData(data)
    return undefined
  },
}

// Este archivo exporta: portfolioService con lectura, acceso y ABM persistente tipados.
// Se usa en: hooks de datos y AdminPanel.
// Importa de: Supabase, datos semilla, tipos del dominio y el cliente público.
