import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'express', 
        'cors', 
        'fs', 
        'path', 
        'crypto', 
        'http', 
        'https', 
        'bcryptjs', 
        'jsonwebtoken', 
        'morgan', 
        'winston', 
        'helmet', 
        'dotenv'
      ]
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
