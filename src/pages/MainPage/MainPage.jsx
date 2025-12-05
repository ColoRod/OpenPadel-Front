import { useEffect, useState } from "react";
import ClubList from "../../components/organisms/ClubList/ClubList";
import AppLayout from '../../templates/AppLayout';
import "./MainPage.scss";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Navega a la página de reserva del primer cancha disponible del club
  const handleClubSelect = async (clubId, clubNombre) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const encoded = encodeURIComponent(clubNombre);
      const url = `${API_BASE}/api/v1/canchas/club/${encoded}`;
      console.log('[MainPage] Fetching canchas for club:', clubNombre, url);
      const res = await fetch(url);
      if (!res.ok) {
        console.error('[MainPage] Error fetching canchas, status:', res.status);
        return;
      }
      const data = await res.json();
      const canchas = Array.isArray(data) ? data : (data && data.data) ? data.data : (data && data.canchas) ? data.canchas : [];
      console.log('[MainPage] Received canchas:', canchas);
      if (!canchas || canchas.length === 0) {
        alert('No se encontraron canchas para este club.');
        return;
      }
      const primera = canchas[0];
      const canchaNombre = primera.nombre || primera.cancha_nombre || primera.nombre_cancha || '';
      if (!canchaNombre) {
        console.error('[MainPage] Primera cancha no tiene nombre:', primera);
        return;
      }
      navigate(`/reserva/${encodeURIComponent(clubNombre)}/${encodeURIComponent(canchaNombre)}`);
    } catch (err) {
      console.error('[MainPage] Error navegando a reserva:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split("-");
      return `${d}/${m}/${y}`;
    }
    try {
      const d = new Date(dateStr);
      if (!isNaN(d)) {
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
      }
    } catch (e) {
      return dateStr;
    }
    return dateStr.split("T")[0];
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
      const [h, m] = timeStr.split(":");
      return `${h}:${m}`;
    }
    if (timeStr.includes("T") || timeStr.includes("Z")) {
      const d = new Date(timeStr);
      if (!isNaN(d)) return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    const parts = timeStr.split(":");
    if (parts.length >= 2) return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
    return timeStr;
  };

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        // Obtener el usuario desde localStorage
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          console.error("No user found in localStorage");
          setReservas([]);
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user.id || user.user_id;
        
        if (!userId) {
          console.error("User ID not found in user object:", user);
          setReservas([]);
          setLoading(false);
          return;
        }

        const API_BASE = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_BASE}/api/reservas/${userId}`);
        if (!res.ok) throw new Error("Error fetching reservas");
        const data = await res.json();
        setReservas(data || []);
      } catch (err) {
        console.error("Error cargando reservas:", err);
        setReservas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const handleCancelarReserva = async (reservaId) => {
    if (!window.confirm("¿Estás seguro de que querés cancelar esta reserva?")) return;

    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/reservas/${reservaId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error cancelando reserva");
      setReservas((prev) => prev.filter((r) => r.reserva_id !== reservaId));
    } catch (err) {
      console.error("Error cancelando reserva:", err);
      alert("No se pudo cancelar la reserva");
    }
  };

  return (
    <AppLayout title="Principal">
      <div className="main-page">
        <section className="reservas">
          <div className="reservas-lista">
            <h2>Mis próximas reservas</h2>

            {loading && <p>Cargando reservas...</p>}

            {!loading && reservas.length === 0 && (
              <p>No hay reservas próximas.</p>
            )}

            {!loading && reservas.map((r) => (
              <div className="reserva-card" key={r.reserva_id}>
                <div className="reserva-info">
                  <p><strong>{r.club}</strong></p>
                  <p>{formatDate(r.fecha)} — {formatTime(r.hora_inicio)} a {formatTime(r.hora_fin)}</p>
                  <p>Estado: {r.estado}</p>
                </div>
                <button
                  className="btn-cancelar"
                  onClick={() => handleCancelarReserva(r.reserva_id)}
                >
                  CANCELAR<br />RESERVA
                </button>
              </div>
            ))}
          </div>
        </section>

        <main className="content">
          <h2 className="title">Elige tu club</h2>
          <ClubList onSelectClub={handleClubSelect} />
        </main>
      </div>
    </AppLayout>
  );
};

export default MainPage;
