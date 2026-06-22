import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/routines': 'http://localhost:5001',
      '/api/products': 'http://localhost:5002',
      '/api/alerts': 'http://localhost:5003',
      '/notificationHub': {
        target: 'http://localhost:5003',
        ws: true,
      }
    }
  }
})
