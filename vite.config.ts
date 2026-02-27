import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// base: '/' on Vercel (root); '/creative-hub/' on GitHub Pages
export default defineConfig({
  base: process.env.VERCEL ? "/" : "/creative-hub/",
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      manifest: {
        name: 'Creative Hub',
        short_name: 'Creative Hub',
        description: 'Store and organize your creative works with links to Google Drive',
        theme_color: '#e07c4c',
        background_color: '#0f0e0d',
        display: 'standalone',
        start_url: process.env.VERCEL ? '/' : '/creative-hub/',
        icons: [
          {
            src: (process.env.VERCEL ? '/' : '/creative-hub/') + 'icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: (process.env.VERCEL ? '/' : '/creative-hub/') + 'icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
