import { Navigate } from "react-router-dom";

// Verifica si existe token
export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

// Obtener el rol del usuario desde localStorage
export const getUserRole = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.rol || null;
  } catch (e) {
    return null;
  }
};

// Rutas que solo deben verse si el usuario está logueado
export function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

// Rutas públicas: login / registro
// Si ya está logueado → lo manda a /home (jugador) o /admin/confirmations (admin)
export function PublicRoute({ children }) {
  if (!isLoggedIn()) {
    return children;
  }
  const role = getUserRole();
  const redirectPath = role === "admin" ? "/admin/confirmations" : "/home";
  return <Navigate to={redirectPath} replace />;
}

// Ruta solo para jugadores
export function JugadorRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  const role = getUserRole();
  if (role === "admin") {
    return <Navigate to="/admin/confirmations" replace />;
  }
  return children;
}

// Ruta solo para administradores
export function AdminRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  const role = getUserRole();
  if (role !== "admin") {
    return <Navigate to="/home" replace />;
  }
  return children;
}
