import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
