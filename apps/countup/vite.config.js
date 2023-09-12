import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
  },
  build: {
    lib: {
      entry: './src/lib/index.ts',
      formats: ['iife'],
      name: 'countup',
      fileName: () => 'countup.js',
    },
    outDir: '../../dist',
  },
})
