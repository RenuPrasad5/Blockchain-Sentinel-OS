import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Explicitly set the root to the current directory to fix path resolution errors
    root: '.',
    base: '/',
    plugins: [react()],
    esbuild: {
      // Clean up the production build by dropping logs and debuggers
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Ensure the old build folder is cleared before creating the new one
      emptyOutDir: true,
      rollupOptions: {
        // This ensures Vite knows exactly where to start the bundle
        input: {
          main: './index.html',
        },
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