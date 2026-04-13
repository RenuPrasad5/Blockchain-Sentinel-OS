import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [react()],
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [], // Only drop in production
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
    server: {
      proxy: {
        '/alchemy': {
          target: 'https://eth-mainnet.g.alchemy.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/alchemy/, ''),
        },
      },
    },
  }
})