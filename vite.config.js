import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/faltskytte-timer/',
  plugins: [
    VitePWA({
      manifest: {
        name: 'Fältskytte-timer',
        short_name: 'Fältskytte',
        lang: 'sv',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#f7f8f5',
        theme_color: '#173b34',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
