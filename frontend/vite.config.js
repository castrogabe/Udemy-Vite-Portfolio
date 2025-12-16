// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be sent to our backend
      '/api': {
        target: 'http://localhost:8000', // Backend server address
        changeOrigin: true,
        secure: false,
      },
      // Serve uploaded images directly from backend’s uploads folder
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

// If you want to review the commented teaching version of the vite.config setup, check commit lesson-05.
