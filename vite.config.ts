import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// libs change rarely, product code changes every week: in a single file every
// release would throw away the vendor code the user already had cached.
const vendorChunks: Array<[string, RegExp]> = [
  [
    'vendor-react',
    /node_modules\/(react|react-dom|react-router(-dom)?|scheduler)\//,
  ],
  ['vendor-motion', /node_modules\/(framer-motion|motion-dom|motion-utils)\//],
  ['vendor-ui', /node_modules\/(radix-ui|@radix-ui|cmdk|lucide-react)\//],
]

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
      // Backend tem TODAS as rotas com prefixo /api (incluindo /api/auth, /api/arenas, etc)
      // Não fazer rewrite - encaminhar /api/* como está para o backend
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // function form (not the object one): only modules already in the graph
        // get assigned, so tree-shaken icons never reach the bundle.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          return vendorChunks.find(([, belongsTo]) => belongsTo.test(id))?.[0]
        },
      },
    },
  },
})
