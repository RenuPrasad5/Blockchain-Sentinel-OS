import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: '.',
    // CHANGE THIS: From './' to '/' for absolute pathing on Vercel
    base: '/',
    plugins: [react()],
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      // Simplify the rollup input for standard Vercel deployments
      rollupOptions: {
        input: 'index.html',
      },
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