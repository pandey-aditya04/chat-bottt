import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    lib: {
      entry: 'src/widget/embed.js',
      name: 'ChatBotWidget',
      fileName: () => 'widget.js',
      formats: ['iife']
    },
    outDir: 'dist-widget',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
