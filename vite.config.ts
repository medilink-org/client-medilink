import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  css: {
    postcss: {
      plugins: [autoprefixer()]
    }
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target:
          import.meta.env.VITE_BUILD_ENV === 'prod'
            ? import.meta.env.VITE_API_PROD_URL
            : import.meta.env.VITE_API_DEV_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
