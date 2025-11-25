import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del .env según el modo (development/production)
  // Usamos el prefijo 'VITE_' para exponer solo las variables que queremos al cliente
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const VITE_API_URL = env.VITE_API_URL || ''; // Si está vacío, mantenemos llamadas relativas y el proxy funcionará

  return {
    plugins: [react()],
    server: {
      proxy: {
        // En desarrollo, si quieres usar un proxy hacia una API remota (Railway),
        // configura VITE_API_URL en tu `.env.development` con la URL completa.
        '/api': {
          target: VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
      port: 5173, // El puerto por defecto de Vite (Frontend)
    },
    define: {
      // No es estrictamente necesario para importar import.meta.env.VITE_*,
      // pero dejamos espacio si se necesita definir valores durante build.
    },
  };
});
