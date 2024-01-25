import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  server: {
    host: true,
  },
  define: {
    'process.env': {},
  },
  build: {
    lib: {
      entry: './src/lib/index.ts',
      formats: ['iife'],
      name: 'countdown',
      fileName: () => 'countdown.js',
    },
  },
  plugins: [dts({ rollupTypes: true })],
})
