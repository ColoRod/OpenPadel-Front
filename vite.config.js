import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del .env según el modo (development/production)
  // El tercer parámetro '' permite leer variables sin el prefijo VITE_
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const API_URL = env.VITE_API_URL || 'http://localhost:3000';

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Si el frontend llama a /api/... Vite lo redirige al backend
        '/api': {
          target: API_URL,
          changeOrigin: true,
          secure: false, // Usar 'false' si tu backend es HTTP (lo normal en desarrollo)
          // re-write: (path) => path.replace('/api/v1', '') // No necesario si usas el prefijo /api en el target
        },
      },
      port: 5173, // El puerto por defecto de Vite (Frontend)
    },
  };
});
