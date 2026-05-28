import { useEffect, useState, useRef } from "react";
import ClubList from "../../components/organisms/ClubList/ClubList";
import AppLayout from '../../templates/AppLayout';
import "./MainPage.scss";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(null); // reserva_id activo
  const navigate = useNavigate();
  const fileInputRefs = useRef({});

  const handleClubSelect = async (clubId, clubNombre) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const encoded = encodeURIComponent(clubNombre);
      const res = await fetch(`${API_BASE}/api/v1/canchas/club/${encoded}`);
      if (!res.ok) return;
      const data = await res.json();
      const canchas = Array.isArray(data) ? data : (data?.data || data?.canchas || []);
      if (!canchas.length) { alert('No se encontraron canchas para este club.'); return; }
      const primera = canchas[0];
      const canchaNombre = primera.nombre || primera.cancha_nombre || '';
      if (!canchaNombre) return;
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
      if (!isNaN(d)) return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    } catch (e) { return dateStr; }
    return dateStr.split("T")[0];
  };

  const formatTime = (t) => {
    if (!t) return "";
    const parts = t.split(":");
    return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}`;
  };

  const fetchReservas = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) { setReservas([]); setLoading(false); return; }
      const user = JSON.parse(userStr);
      const userId = user.id || user.user_id;
      if (!userId) { setReservas([]); setLoading(false); return; }
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/reservas/${userId}`);
      if (!res.ok) throw new Error("Error fetching reservas");
      const data = await res.json();
      // Solo mostramos PENDIENTE y CONFIRMADA
      setReservas((data || []).filter(r => 
        r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA'
      ));
    } catch (err) {
      console.error("Error cargando reservas:", err);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservas(); }, []);

  const handleCancelarReserva = async (reservaId) => {
    if (!window.confirm("¿Estás seguro de que querés cancelar esta reserva?")) return;
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/reservas/${reservaId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setReservas(prev => prev.filter(r => r.reserva_id !== reservaId));
    } catch {
      alert("No se pudo cancelar la reserva");
    }
  };

  const handleSubirComprobante = async (reservaId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('comprobante', file);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/reservas/${reservaId}/comprobante`, {
        method: 'PATCH',
        body: formData
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReservas(prev => prev.map(r => 
        r.reserva_id === reservaId 
          ? { ...r, comprobante_url: data.comprobante_url } 
          : r
      ));
    } catch {
      alert("No se pudo subir el comprobante");
    }
  };

  // Agrupar reservas por club
  const reservasPorClub = reservas.reduce((acc, r) => {
    if (!acc[r.club]) acc[r.club] = [];
    acc[r.club].push(r);
    return acc;
  }, {});
  const clubes = Object.keys(reservasPorClub);

  return (
    <AppLayout title="PRINCIPAL">
      <div className="main-page">
        <section className="reservas">
          <div className="reservas-lista">
            <h2>Mis próximas reservas</h2>

            {loading && <p>Cargando reservas...</p>}
            {!loading && reservas.length === 0 && <p>No hay reservas próximas.</p>}

            {!loading && clubes.length > 0 && (
              <div className="reservas-container">
                {clubes.map((clubNombre, clubIndex) => (
                  <div key={clubNombre}>
                    {/* Separador entre clubes distintos */}
                    {clubIndex > 0 && <hr className="club-divider" />}

                    <p className="club-grupo-titulo">{clubNombre}</p>

                    {reservasPorClub[clubNombre].map((r) => {
                      const isConfirmada = r.estado === 'CONFIRMADA';
                      const senia = r.precio_base ? (parseFloat(r.precio_base) * 0.5).toFixed(2) : null;

                      return (
                        <div className={`reserva-item ${isConfirmada ? 'confirmada' : 'pendiente'}`} key={r.reserva_id}>

                          <div className="reserva-main">
                            <span className="reserva-cancha">(<strong>{r.cancha_nombre}</strong>)</span>
                            <span className="reserva-fecha">{formatDate(r.fecha)} — {formatTime(r.hora_inicio)} a {formatTime(r.hora_fin)}</span>
                            {r.precio_base && (
                              <span className="reserva-precio">Precio: <strong>${parseFloat(r.precio_base).toFixed(2)}</strong></span>
                            )}
                          </div>

                          <div className="reserva-acciones">
                            <span className={`badge badge-${r.estado.toLowerCase()}`}>{r.estado}</span>

                            {isConfirmada && (
                              <>
                                <div className="info-wrapper">
                                  <button className="btn-info"
                                    onMouseEnter={() => setTooltipVisible(r.reserva_id)}
                                    onMouseLeave={() => setTooltipVisible(null)}>
                                    i
                                  </button>
                                  {tooltipVisible === r.reserva_id && (
                                    <div className="tooltip-pago">
                                      <p><strong>Datos de pago de seña</strong></p>
                                      <p>Titular: {r.titular_cuenta || '-'}</p>
                                      <p>Alias: {r.alias || '-'}</p>
                                      <p>CVU: {r.cvu || '-'}</p>
                                      <p>Seña (50%): <strong>${senia}</strong></p>
                                    </div>
                                  )}
                                </div>

                                <input type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                                  ref={el => fileInputRefs.current[r.reserva_id] = el}
                                  onChange={(e) => handleSubirComprobante(r.reserva_id, e.target.files[0])} />
                                <button className="btn-clip" title="Adjuntar comprobante"
                                  onClick={() => fileInputRefs.current[r.reserva_id]?.click()}>
                                  📎
                                </button>

                                <span className={`senia-status ${r.comprobante_url ? 'pagada' : 'pendiente-pago'}`}
                                  title={r.comprobante_url ? 'Comprobante adjuntado' : 'Sin comprobante'}>
                                  {r.comprobante_url ? '✔' : '✖'}
                                </span>
                              </>
                            )}

                            <button className="btn-cancelar" onClick={() => handleCancelarReserva(r.reserva_id)}>
                              CANCELAR
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            <div className="historial-link">
              <button className="btn-historial" onClick={() => navigate('/historial')}>
                Ver historial completo →
              </button>
            </div>
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