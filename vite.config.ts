import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_URL || '/2026-trip-itinerary/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});