// src/App.jsx
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import ReservationPage from "./pages/ReservationPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/reserva/:clubName/:canchaName" element={<ReservationPage />} />
    </Routes>
  );
}
