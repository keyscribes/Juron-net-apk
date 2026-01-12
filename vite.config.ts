import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimizations for mobile
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        // Code splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Target modern browsers for smaller bundle
    target: 'es2020',
    // Reduce chunk size warnings threshold for mobile optimization
    chunkSizeWarningLimit: 500,
    // Enable source maps for production debugging
    sourcemap: false,
  },
  server: {
    // Mobile-friendly development settings
    port: 5173,
    strictPort: false,
    host: true, // Allows access from network devices (important for mobile testing)
  },
  // Optimize CSS handling
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  // Performance optimization
  esbuild: {
    // Drop console logs in production
    drop: ['console', 'debugger'],
  },
})
