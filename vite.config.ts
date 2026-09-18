import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // Lenis is dynamically imported and only on desktop with motion on,
        // so it must not be folded into the critical chunk.
        manualChunks(id) {
          if (id.includes('node_modules/lenis')) return 'scroll'
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) return 'motion'
          if (id.includes('node_modules/react')) return 'react'
          return undefined
        },
      },
    },
  },
})
