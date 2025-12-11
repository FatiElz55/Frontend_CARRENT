import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimisation du build
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'ui-vendor': ['lucide-react', '@headlessui/react'],
        },
      },
    },
    // Réduire la taille du bundle
    chunkSizeWarningLimit: 1000,
    // Optimiser les assets
    assetsInlineLimit: 4096,
  },
  // Optimisation du serveur de développement
  server: {
    hmr: {
      overlay: false, // Désactiver l'overlay d'erreur pour améliorer les performances
    },
  },
})




