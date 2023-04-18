import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/lib/index.tsx',
      name: 'Flowbase Boosters - Before After',
      formats: ['es'],
      fileName: 'before-after-framer.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'framer'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
    outDir: '../../dist/google-reviews-framer',
  },
})
