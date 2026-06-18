import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` is set to the repo name in CI (via VITE_BASE) so assets resolve
// correctly on GitHub Pages project sites; defaults to '/' for local dev.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
