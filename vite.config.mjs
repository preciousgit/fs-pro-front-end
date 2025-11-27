import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';


export default defineConfig({
  base: '/fs-pro-front-end/',
  plugins: [vue()],
});