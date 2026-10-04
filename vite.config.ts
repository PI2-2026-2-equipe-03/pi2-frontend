import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// config vite: alias @/ apontando para src, plugin react (swc) e tailwind v4
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        // no host: 127.0.0.1 evita IPv6/localhost no Windows.
        // no docker: API_PROXY_TARGET=http://host.docker.internal:3000
        target: process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:3000',
        changeOrigin: true,
        // api do backend vive na raiz (/login, /replays); o spa chama /api/*
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
