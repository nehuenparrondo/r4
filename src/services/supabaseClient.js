import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const isTestEnvironment = import.meta.env.MODE === 'test'

export const isSupabaseConfigured = !isTestEnvironment && Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null

// Este archivo exporta: el cliente público de Supabase y su estado de configuración.
// Se usa en: src/services/portfolioService.js.
// Importa de: @supabase/supabase-js y variables VITE_SUPABASE_*.
