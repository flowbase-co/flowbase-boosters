import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import removeAttributes from 'vite-plugin-react-remove-attributes'

export default defineConfig({
  plugins: [
    react(),
    removeAttributes.default({
      attributes: ['data-testid'],
    }),
  ],
  server: {
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  build: {
    lib: {
      entry: './src/lib/index.tsx',
      name: 'Flowbase Boosters - Before After',
      formats: ['es'],
      fileName: 'before-after-framer',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
    outDir: '../../dist',
  },
})
