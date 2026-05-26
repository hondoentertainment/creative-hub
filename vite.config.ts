import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base: '/' on Vercel (root); '/creative-hub/' on GitHub Pages
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/creative-hub/',
  plugins: [react()],
})
