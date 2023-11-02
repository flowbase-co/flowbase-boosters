import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
  },
  build: {
    lib: {
      entry: './src/lib/index.ts',
      formats: ['iife'],
      name: 'textscramble',
      fileName: () => 'text-scramble.js',
    },
    outDir: '../../dist',
  },
})
