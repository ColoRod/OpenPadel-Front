// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import MainPage from "./pages/MainPage/MainPage";
import ReservationPage from "./pages/ReservationPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import AdminConfirmationPage from "./pages/AdminConfirmationPage/AdminConfirmationPage";
import { PrivateRoute, PublicRoute } from "./utils/ProtectedRoute.jsx";

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

      {/* HOME */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      />

      {/* CONFIRMACIONES ADMIN */}
      <Route
        path="/admin/confirmations"
        element={
          <PrivateRoute>
            <AdminConfirmationPage />
          </PrivateRoute>
        }
      />

      {/* RESERVAS */}
      <Route
        path="/reserva/:clubName/:canchaName"
        element={
          <PrivateRoute>
            <ReservationPage />
          </PrivateRoute>
        }
      />

      {/* PERFIL */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* RUTA POR DEFECTO → LOGIN */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}
