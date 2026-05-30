import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../templates/AppLayout';
import styles from './HistorialPage.module.scss';

const ESTADOS = ['Todos', 'PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'FINALIZADA', 'RECHAZADA'];

const BADGE_CLASS = {
  CONFIRMADA:  styles.badgeConfirmada,
  PENDIENTE:   styles.badgePendiente,
  CANCELADA:   styles.badgeCancelada,
  FINALIZADA:  styles.badgeFinalizada,
  RECHAZADA:   styles.badgeRechazada,
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${String(d.getUTCDate()).padStart(2,'0')}/${String(d.getUTCMonth()+1).padStart(2,'0')}/${d.getUTCFullYear()}`;
};

const formatTime = (t) => t ? t.substring(0, 5) : '';

export default function HistorialPage() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || '';

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [club, setClub] = useState('');
  const [estado, setEstado] = useState('Todos');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user.id || user.user_id;
  };

  const fetchHistorial = async () => {
    const userId = getUserId();
    if (!userId) return;

    setLoading(true);
    const params = new URLSearchParams();
    if (club)   params.append('club', club);
    if (estado && estado !== 'Todos') params.append('estado', estado);
    if (desde)  params.append('desde', desde);
    if (hasta)  params.append('hasta', hasta);

    try {
      const res = await fetch(
        `${API_BASE}/api/reservas/${userId}/historial?${params.toString()}`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      setReservas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando historial:', err);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistorial(); }, []);

  const handleCancelar = async (reservaId) => {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    try {
      await fetch(`${API_BASE}/api/reservas/${reservaId}`, { method: 'DELETE' });
      fetchHistorial();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout title="HISTORIAL">
      <div className={styles.page}>
        <h1 className={styles.title}>Historial de Reservas</h1>

        {/* Filtros */}
        <div className={styles.filterBox}>
          <div className={styles.filterGroup}>
            <label>Buscar por club:</label>
            <div className={styles.searchInput}>
              <span>🔍</span>
              <input
                type="text"
                placeholder="Ej: Mercedes..."
                value={club}
                onChange={e => setClub(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Estado:</label>
            <select value={estado} onChange={e => setEstado(e.target.value)}>
              {ESTADOS.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Desde:</label>
            <input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
          </div>

          <div className={styles.filterGroup}>
            <label>Hasta:</label>
            <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
          </div>

          <button className={styles.btnFiltrar} onClick={fetchHistorial}>
            FILTRAR
          </button>
        </div>

        {/* Tabla */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Club</th>
                <th>Cancha</th>
                <th>Fecha & Hora</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className={styles.center}>Cargando...</td></tr>
              ) : reservas.length === 0 ? (
                <tr><td colSpan={5} className={styles.center}>No hay reservas.</td></tr>
              ) : (
                reservas.map(r => (
                  <tr key={r.reserva_id}>
                    <td>
                      <div className={styles.clubCell}>
                        {r.club_imagen && (
                          <img
                            src={r.club_imagen.startsWith('http') ? r.club_imagen : `${API_BASE}${r.club_imagen}`}
                            alt={r.club}
                            className={styles.clubImg}
                          />
                        )}
                        <span>{r.club}</span>
                      </div>
                    </td>
                    <td>{r.cancha_nombre}</td>
                    <td>{formatDate(r.fecha)} — {formatTime(r.hora_inicio)} a {formatTime(r.hora_fin)}</td>
                    <td>
                      <span className={`${styles.badge} ${BADGE_CLASS[r.estado] || ''}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td>
                      {(r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA') && (
                        <button
                          className={styles.btnCancelar}
                          onClick={() => handleCancelar(r.reserva_id)}
                        >
                          CANCELAR
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}