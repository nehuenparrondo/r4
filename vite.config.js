import { defineConfig } from 'vite'
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
  },
})

// Este archivo exporta: la configuración de Vite.
// Se usa en: los comandos de desarrollo y compilación.
// Importa de: vite y @vitejs/plugin-react.
