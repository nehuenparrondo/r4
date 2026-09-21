import { defaultExclude, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          database: ['@supabase/supabase-js'],
          interface: ['lucide-react', 'dompurify'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    exclude: [...defaultExclude, 'work/**', 'outputs/**', 'dist/**'],
  },
})

// Este archivo exporta: la configuración de Vite.
// Se usa en: los comandos de desarrollo y compilación.
// Importa de: Vitest y @vitejs/plugin-react.
