// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import MainPage from "./pages/MainPage/MainPage";
import ReservationPage from "./pages/ReservationPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import AdminConfirmationPage from "./pages/AdminConfirmationPage/AdminConfirmationPage";
import { PublicRoute, JugadorRoute, AdminRoute } from "./utils/ProtectedRoute.jsx";

export default function App() {

   // 🔹 BORRA el token apenas se abre la app
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* REGISTRO */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* HOME - Solo para jugadores */}
      <Route
        path="/home"
        element={
          <JugadorRoute>
            <MainPage />
          </JugadorRoute>
        }
      />

      {/* CONFIRMACIONES ADMIN - Solo para admins */}
      <Route
        path="/admin/confirmations"
        element={
          <AdminRoute>
            <AdminConfirmationPage />
          </AdminRoute>
        }
      />

      {/* RESERVAS - Solo para jugadores */}
      <Route
        path="/reserva/:clubName/:canchaName"
        element={
          <JugadorRoute>
            <ReservationPage />
          </JugadorRoute>
        }
      />

      {/* PERFIL - Solo para jugadores */}
      <Route
        path="/profile"
        element={
          <JugadorRoute>
            <ProfilePage />
          </JugadorRoute>
        }
      />

      {/* RUTA POR DEFECTO → LOGIN */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}
