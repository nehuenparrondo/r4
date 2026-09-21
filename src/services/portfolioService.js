import { portfolioSeed } from '../data/portfolioSeed'
import { isSupabaseConfigured, supabase } from './supabaseClient'

const STORAGE_KEY = 'parrondo-portfolio-demo-data'
const ADMIN_HASH_KEY = 'parrondo-portfolio-demo-admin-hash'

function cloneSeed() {
  return JSON.parse(JSON.stringify(portfolioSeed))
}

function readLocalData() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return cloneSeed()
  try {
    return { ...cloneSeed(), ...JSON.parse(saved) }
  } catch {
    return cloneSeed()
  }
}

function writeLocalData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

async function hashSecret(secret) {
  const bytes = new TextEncoder().encode(secret)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function getRemoteData() {
  const [skills, experiences, projects, achievements, contact] = await Promise.all([
    supabase.from('skills').select('*').order('sort_order', { ascending: true }),
    supabase.from('experiences').select('*').order('sort_order', { ascending: true }),
    supabase.from('projects').select('*, project_technologies(position, technologies(name))').order('sort_order', { ascending: true }),
    supabase.from('achievements').select('*').order('sort_order', { ascending: true }),
    supabase.from('contact').select('*').eq('id', 'main').single(),
  ])
  const failed = [skills, experiences, projects, achievements, contact].find((result) => result.error)
  if (failed) throw failed.error
  return {
    skills: skills.data,
    experiences: experiences.data,
    projects: projects.data.map(({ project_technologies: links, ...project }) => ({
      ...project,
      technologies: links
        .sort((first, second) => first.position - second.position)
        .map((link) => link.technologies.name),
    })),
    achievements: achievements.data,
    contact: contact.data,
  }
}

async function mutateRemote(action, entity, payload, secret) {
  const { data, error } = await supabase.rpc(`admin_${action}_portfolio_item`, {
    access_secret: secret,
    entity_name: entity,
    item_payload: payload,
  })
  if (error) throw error
  return data
}

export const portfolioService = {
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
      const { data, error } = await supabase.rpc('verify_admin_access', { access_secret: secret })
      if (error) throw error
      return Boolean(data)
    }
    const storedHash = localStorage.getItem(ADMIN_HASH_KEY)
    return Boolean(storedHash && storedHash === (await hashSecret(secret)))
  },

  async save(entity, payload, secret) {
    if (isSupabaseConfigured) return mutateRemote('upsert', entity, payload, secret)
    if (!(await this.verifyAdmin(secret))) throw new Error('Clave de administración incorrecta.')
    const data = readLocalData()
    if (entity === 'contact') data.contact = { ...data.contact, ...payload, id: 'main' }
    else {
      const id = payload.id || crypto.randomUUID()
      const item = { ...payload, id }
      const index = data[entity].findIndex((current) => current.id === id)
      if (index >= 0) data[entity][index] = item
      else data[entity].push(item)
    }
    writeLocalData(data)
  },

  async remove(entity, id, secret) {
    if (isSupabaseConfigured) return mutateRemote('delete', entity, { id }, secret)
    if (!(await this.verifyAdmin(secret))) throw new Error('Clave de administración incorrecta.')
    const data = readLocalData()
    data[entity] = data[entity].filter((item) => item.id !== id)
    writeLocalData(data)
  },
}

// Este archivo exporta: portfolioService con lectura, acceso y ABM persistente.
// Se usa en: src/hooks/usePortfolioData.js y AdminPanel.
// Importa de: datos semilla y el cliente de Supabase.
