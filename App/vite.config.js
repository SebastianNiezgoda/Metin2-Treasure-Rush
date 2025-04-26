import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
   base: '/', // Dodaj tę linię
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
     emptyOutDir: true, // Czyść folder przed buildem
     assetsDir: 'assets', // Organizuj assets w subfolderze
    },
    server: {
      open: true,
      port: 5173,
    },
  });