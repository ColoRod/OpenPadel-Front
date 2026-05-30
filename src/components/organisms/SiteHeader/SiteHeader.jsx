import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import Logo from "../../atoms/Logo/Logo";
import styles from "./SiteHeader.module.scss";

const REC_VISTOS_KEY = "recordatorios_vistos";

export default function SiteHeader({ onLogoClick, title = "Reserva" }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [campanaOpen, setCampanaOpen] = useState(false);

  const [notificaciones, setNotificaciones] = useState([]);
  const [recordatorios, setRecordatorios] = useState([]);

  const [recVistos, setRecVistos] = useState(() => {
    const saved = localStorage.getItem(REC_VISTOS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifVistas, setNotifVistas] = useState(false);

  const menuRef = useRef();
  const campanaRef = useRef();
  const inicializado = useRef(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id || user?.user_id || null;
  const esJugador = user?.rol === 'jugador';

  const parseReservaInicio = (reserva) => {
    if (!reserva?.fecha || !reserva?.hora_inicio) return null;

    let fechaStr = String(reserva.fecha);
    if (fechaStr.includes('T')) {
      fechaStr = fechaStr.split('T')[0];
    } else if (fechaStr.includes(' ')) {
      fechaStr = fechaStr.split(' ')[0];
    }

    const [h, m] = String(reserva.hora_inicio).split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;

    const isoString = `${fechaStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    const inicio = new Date(isoString);
    return Number.isNaN(inicio.getTime()) ? null : inicio;
  };

  const isReminderEstado = (estado) => {
    const clean = String(estado || '').trim().toUpperCase();
    return clean === 'CONFIRMADA' || clean === 'PENDIENTE';
  };

  const buildReminder = (r) => ({
    id: `rec-${r.reserva_id}`,
    tipo: 'recordatorio',
    mensaje: `En menos de 1 hora: ${r.club} – ${r.cancha_nombre} de ${String(r.hora_inicio).slice(0, 5)} a ${String(r.hora_fin).slice(0, 5)}`,
  });

  useEffect(() => {
    if (!esJugador || !userId || inicializado.current) return;
    inicializado.current = true;

    const inicializar = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        await fetch(`${API_BASE}/api/reservas/${userId}/notificaciones/inicializar`, {
          method: 'POST',
        });
      } catch (err) {
        console.error('Error inicializando notificaciones:', err);
      }
    };

    inicializar();
  }, [esJugador, userId]);

  useEffect(() => {
    if (!esJugador || !userId) return;

    const actualizarNotificaciones = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';

        const resReservas = await fetch(`${API_BASE}/api/reservas/${userId}`);
        if (resReservas.ok) {
          const reservasActuales = await resReservas.json();
          const ahora = new Date();
          const recVistosActual = JSON.parse(localStorage.getItem(REC_VISTOS_KEY) || '[]');

          const nuevosRecordatorios = reservasActuales
            .map((r) => ({ ...r, inicio: parseReservaInicio(r) }))
            .filter((r) => isReminderEstado(r.estado) && r.inicio)
            .filter((r) => {
              const diffMin = (r.inicio - ahora) / 60000;
              return diffMin > 0 && diffMin <= 60;
            })
            .map(buildReminder);

          const idsActivos = new Set(nuevosRecordatorios.map((r) => r.id));
          const recVistosFiltrados = recVistosActual.filter((id) => idsActivos.has(id));
          if (JSON.stringify(recVistosFiltrados) !== JSON.stringify(recVistosActual)) {
            localStorage.setItem(REC_VISTOS_KEY, JSON.stringify(recVistosFiltrados));
            setRecVistos(recVistosFiltrados);
          }

          setRecordatorios(nuevosRecordatorios);
        }

        const resNotif = await fetch(`${API_BASE}/api/reservas/${userId}/notificaciones`);
        if (resNotif.ok) {
          const diferencias = await resNotif.json();

          const nuevasNotif = diferencias
            .map((r) => {
              const estadoActual = String(r.estado_actual || '').trim().toUpperCase();
              if (estadoActual === 'CONFIRMADA') {
                return {
                  id: `conf-${r.reserva_id}`,
                  tipo: 'confirmada',
                  mensaje: `Tu reserva en ${r.club} (${r.cancha_nombre}) fue confirmada`,
                };
              }
              if (estadoActual === 'RECHAZADA') {
                return {
                  id: `rech-${r.reserva_id}`,
                  tipo: 'rechazada',
                  mensaje: `Tu reserva en ${r.club} (${r.cancha_nombre}) fue rechazada`,
                };
              }
              if (estadoActual === 'CANCELADA') {
                return {
                  id: `canc-${r.reserva_id}`,
                  tipo: 'cancelada',
                  mensaje: `Tu reserva en ${r.club} (${r.cancha_nombre}) fue cancelada`,
                };
              }
              if (estadoActual === 'RECORDATORIO' || String(r.tipo || '').toLowerCase() === 'recordatorio') {
                return {
                  id: `rec-${r.reserva_id}`,
                  tipo: 'recordatorio',
                  mensaje: r.mensaje || buildReminder(r).mensaje,
                };
              }
              return null;
            })
            .filter(Boolean);

          const recordatoriosBackend = nuevasNotif.filter((n) => n.tipo === 'recordatorio');
          const notificacionesSoloEstado = nuevasNotif.filter((n) => n.tipo !== 'recordatorio');

          setNotificaciones(notificacionesSoloEstado);
          setRecordatorios((prev) => {
            const combined = [...prev, ...recordatoriosBackend];
            const unique = Array.from(new Map(combined.map((r) => [r.id, r])).values());
            return unique;
          });
          setNotifVistas(notificacionesSoloEstado.length === 0);
        }
      } catch (err) {
        console.error('Error cargando notificaciones:', err);
      }
    };

    actualizarNotificaciones();
    const intervalId = window.setInterval(actualizarNotificaciones, 60000);
    return () => window.clearInterval(intervalId);
  }, [esJugador, userId]);

  const handleLogoClick = () => {
    if (onLogoClick) onLogoClick();
    else navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("categoria");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sincronizar = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      await fetch(`${API_BASE}/api/reservas/${userId}/notificaciones/sincronizar`, {
        method: 'PUT',
      });
    } catch (err) {
      console.error('Error sincronizando notificaciones:', err);
    }
  };

  const limpiarNotificaciones = async () => {
    await sincronizar();
    setNotificaciones([]);
    setRecordatorios([]);
    setNotifVistas(true);
    const todosIds = recordatorios.map(r => r.id);
    localStorage.setItem(REC_VISTOS_KEY, JSON.stringify(todosIds));
    setRecVistos(todosIds);
  };

  const handleCampanaClick = async () => {
    const abriendo = !campanaOpen;
    setCampanaOpen(abriendo);

    if (abriendo) {
      await sincronizar();
      setNotifVistas(true);

      const todosIds = recordatorios.map(r => r.id);
      const recVistosActual = JSON.parse(localStorage.getItem(REC_VISTOS_KEY) || '[]');
      const combinados = [...new Set([...recVistosActual, ...todosIds])];
      localStorage.setItem(REC_VISTOS_KEY, JSON.stringify(combinados));
      setRecVistos(combinados);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (campanaRef.current && !campanaRef.current.contains(e.target)) setCampanaOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const iconoTipo = (tipo) => {
    if (tipo === 'confirmada') return '🟢';
    if (tipo === 'rechazada') return '🔴';
    if (tipo === 'cancelada') return '🔴';
    if (tipo === 'recordatorio') return '🟡';
    return '⚪';
  };

  const todasLasNotificaciones = [...notificaciones, ...recordatorios];
  const recordatoriosNuevos = recordatorios.filter(r => !recVistos.includes(r.id));
  const cantidadBadge = (!notifVistas ? notificaciones.length : 0) + recordatoriosNuevos.length;
  const mostrarBadge = cantidadBadge > 0;

  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper} role="button" tabIndex={0} onClick={handleLogoClick}>
        <Logo size="large" />
      </div>

      <h2 className={styles.pageTitle}>{title}</h2>

      <div className={styles.rightZone}>

        {esJugador && (
          <div className={styles.campanaWrapper} ref={campanaRef}>
            <button
              className={styles.campanaBtn}
              onClick={handleCampanaClick}
              title="Notificaciones"
            >
              <Bell size={20} color="white" />
              {mostrarBadge && (
                <span className={styles.badge}>{cantidadBadge}</span>
              )}
            </button>

            {campanaOpen && (
              <div className={styles.campanaDropdown}>
                <div className={styles.campanaHeader}>
                  <p className={styles.campanaTitulo}>Notificaciones</p>
                  {todasLasNotificaciones.length > 0 && (
                    <button className={styles.limpiarBtn} onClick={limpiarNotificaciones}>
                      Limpiar
                    </button>
                  )}
                </div>
                {todasLasNotificaciones.length === 0 ? (
                  <p className={styles.campanaVacia}>Sin notificaciones nuevas</p>
                ) : (
                  todasLasNotificaciones.map(n => (
                    <div key={n.id} className={`${styles.campanaItem} ${styles[n.tipo]}`}>
                      <span>{iconoTipo(n.tipo)}</span>
                      <span>{n.mensaje}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        <div className={styles.userMenu} ref={menuRef}>
          <div className={styles.userTrigger} role="button" tabIndex={0} onClick={() => setMenuOpen(!menuOpen)}>
            <span className={styles.profileText}>PERFIL ▼</span>
          </div>

          {menuOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={() => navigate("/profile")}>
                Mi Perfil
              </button>
              <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}