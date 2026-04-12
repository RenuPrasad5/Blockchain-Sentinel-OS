import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  server: {
    proxy: {
      // This helps if you encounter CORS issues during development
      '/alchemy': {
        target: 'https://eth-mainnet.g.alchemy.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/alchemy/, ''),
      },
    },
  },
})