import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api' : {
        target: 'http://localhost:3000',
        secure: false
      },
    },
  },
});
