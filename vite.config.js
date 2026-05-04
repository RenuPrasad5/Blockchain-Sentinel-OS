import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: '.',
    // CHANGE THIS: From './' to '/' for absolute pathing on Vercel
    base: '/',
    plugins: [react()],
    // CRITICAL FIX: Pre-bundle Firebase to prevent Vite HMR from
    // re-evaluating Firebase modules and causing INTERNAL ASSERTION errors
    optimizeDeps: {
      include: [
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
        'firebase/storage',
      ],
      exclude: [],
    },
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