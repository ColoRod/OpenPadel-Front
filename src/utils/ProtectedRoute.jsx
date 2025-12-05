import { Navigate } from "react-router-dom";

// Verifica si existe token
export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

// Rutas que solo deben verse si el usuario está logueado
export function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

// Rutas públicas: login / registro
// Si ya está logueado → lo manda a /home
export function PublicRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/home" replace /> : children;
}
