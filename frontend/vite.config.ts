import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@knowledge': path.resolve(__dirname, '../knowledge'),
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: ['..'],
    },
  },
});
