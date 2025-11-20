import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Si el frontend llama a /api/v1/users/register...
      '/api': {
        target: 'http://localhost:3000', // ...Vite lo redirige al puerto del backend (Express)
        changeOrigin: true,
        secure: false, // Usar 'false' si tu backend es HTTP (lo normal en desarrollo)
        // re-write: (path) => path.replace('/api/v1', '') // No necesario si usas el prefijo /api en el target
      },
    },
    port: 5173, // El puerto por defecto de Vite (Frontend)
  },
});
