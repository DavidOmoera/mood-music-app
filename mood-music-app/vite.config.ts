import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://accounts.spotify.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
      '/api/token': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/token/, '/api/token'),
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ['@tensorflow/tfjs', '@tensorflow-models/face-landmarks-detection', '@mediapipe/face_mesh'],
    esbuildOptions: {
      target: 'es2020',
      resolveExtensions: ['.js', '.mjs', '.cjs', '.wasm', '.tflite', '.binarypb', '.data'],
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules\/@mediapipe\/face_mesh/],
    },
    rollupOptions: {
      external: [],
    },
    assetsInlineLimit: 0,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@mediapipe/face_mesh': path.resolve(__dirname, 'node_modules/@mediapipe/face_mesh'),
    },
  },
  assetsInclude: ['**/*.tflite', '**/*.binarypb', '**/*.data', '**/*.wasm'],
});