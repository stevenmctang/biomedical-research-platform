import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/monarch': {
        target: 'https://api-v3.monarchinitiative.org/v3/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/monarch/, ''),
      },
    },
  },
})
