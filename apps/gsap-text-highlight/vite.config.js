import fs from 'fs'
import { defineConfig } from 'vite'
import banner from 'vite-plugin-banner'

const bannerContent = fs
  .readFileSync('./LICENSE', 'utf-8')
  .match(/```([\s\S]*?)```/)?.[1]
  .trim()

export default defineConfig({
  plugins: [banner(bannerContent)],
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
      name: 'gsaptexthighlight',
      fileName: () => 'gsap-text-highlight.js',
    },
  },
})
