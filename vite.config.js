import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Ensures relative asset links work on GitHub Pages whether at root or subpath
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
