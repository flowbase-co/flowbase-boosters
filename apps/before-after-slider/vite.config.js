import { defineConfig } from 'vite'

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
      name: 'beforeafterslider',
      fileName: () => 'before-after-slider.js',
    },
  },
})
