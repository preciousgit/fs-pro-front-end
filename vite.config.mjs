import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
import { resolve } from 'path';

// Use root base during development and the repo-based path for production builds
const basePath = process.env.NODE_ENV === 'production'
  ? '/fs-pro-front-end/'
  : '/';

export default defineConfig({
  plugins: [vue()],
  base: basePath,
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});