import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
  },
  build: {
    lib: {
      entry: './src/lib/index.ts',
      formats: ['iife'],
      name: 'text-scramble',
      fileName: () => 'text-scramble.js',
    },
    outDir: '../../dist',
  },
})
