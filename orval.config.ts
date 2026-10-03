import { defineConfig } from 'orval'

export default defineConfig({
  tagravado: {
    input: {
      target: 'http://localhost:3000/api/openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/lib/api/endpoints.ts',
      schemas: 'src/lib/api/model',
      client: 'react-query',
      httpClient: 'axios',
      mock: false,
      prettier: true,
      override: {
        mutator: {
          path: './src/lib/api/mutator/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
