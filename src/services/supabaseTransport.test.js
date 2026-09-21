import { createClient } from '@supabase/supabase-js'
import { describe, expect, it, vi } from 'vitest'

describe('transporte administrativo de Supabase', () => {
  it('envía los argumentos RPC mediante POST y no en la URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('true', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }))
    const client = createClient('https://example.supabase.co', 'public-key', {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: fetchMock },
    })

    await client.rpc('verify_admin_access', { access_secret: 'private-value' })

    const [requestUrl, requestOptions] = fetchMock.mock.calls[0]
    expect(requestOptions.method).toBe('POST')
    expect(String(requestUrl)).not.toContain('private-value')
    expect(requestOptions.body).toContain('private-value')
  })
})

// Este archivo exporta: prueba del método HTTP usado por las RPC administrativas.
// Se usa en: npm test.
// Importa de: Supabase y Vitest.
