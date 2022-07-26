import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  root: './ui',
  base: '/_app/public/',
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
  plugins: [svelte()],
})
