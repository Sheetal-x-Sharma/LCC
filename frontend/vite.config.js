import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Make sure Vite resolves emoji-picker-react correctly
  optimizeDeps: {
    include: ['emoji-picker-react'],
  },

  // Base path for deployment
  base: '/',

  // Optional: alias for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // Build output directory (default 'dist', Vercel expects this)
  build: {
    outDir: 'dist',
  },
})
