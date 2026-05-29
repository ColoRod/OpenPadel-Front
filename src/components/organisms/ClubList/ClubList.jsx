import { useEffect, useState } from "react";
import ClubCard from "../../molecules/ClubCard/ClubCard";
import "./ClubList.scss";
import { Wifi, Car, Coffee, Wind } from 'lucide-react';

// Características del CLUB (lucide icons)
const CARACTERISTICAS_FILTRO_CLUB = [
  { nombre: 'WiFi',            icon: <Wifi size={14} /> },
  { nombre: 'Estacionamiento', icon: <Car size={14} /> },
  { nombre: 'Buffet',          icon: <Coffee size={14} /> },
  { nombre: 'Climatización',   icon: <Wind size={14} /> },
];

// Características de CANCHA (iconos SVG del public)
const CARACTERISTICAS_FILTRO_CANCHA = [
  { nombre: 'Sintético' },
  { nombre: 'No Sintético' },
  { nombre: 'Techada' },
  { nombre: 'No Techada' },
  { nombre: 'Cemento' },
  { nombre: 'Blindex' },
];

const ClubList = ({ onSelectClub }) => {
  const [clubes, setClubes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtrosClub, setFiltrosClub] = useState([]);
  const [filtrosCancha, setFiltrosCancha] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const url = `${API_BASE}/api/clubes`;
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();

        let clubesList = [];
        if (Array.isArray(data)) clubesList = data;
        else if (data && Array.isArray(data.data)) clubesList = data.data;
        else if (data && Array.isArray(data.clubes)) clubesList = data.clubes;

        setClubes(clubesList);
      } catch (error) {
        console.error("Error cargando clubes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClubes();
  }, []);

  const toggleFiltroClub = (nombre) => {
    setFiltrosClub(prev =>
      prev.includes(nombre) ? prev.filter(f => f !== nombre) : [...prev, nombre]
    );
  };

  const toggleFiltroCancha = (nombre) => {
    setFiltrosCancha(prev =>
      prev.includes(nombre) ? prev.filter(f => f !== nombre) : [...prev, nombre]
    );
  };

  const clubesFiltrados = clubes.filter(club => {
    const nombreMatch = club.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const caractClubMatch = filtrosClub.every(f => club.caracteristicas?.includes(f));
    const caractCanchaMatch = filtrosCancha.every(f => club.caracteristicas_canchas?.includes(f));
    return nombreMatch && caractClubMatch && caractCanchaMatch;
  });

  if (loading) return <p>Cargando clubes...</p>;
  if (!clubes || clubes.length === 0) return <p>No se encontraron clubes.</p>;

  return (
    <div className="club-list-wrapper">
      <div className="filter-bar">

        {/* Buscador */}
        <div className="filter-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar club..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filter-tags">
          {/* Filtros del club — lucide icons */}
          {CARACTERISTICAS_FILTRO_CLUB.map(({ nombre, icon }) => (
            <button
              key={nombre}
              className={`filter-tag ${filtrosClub.includes(nombre) ? 'active' : ''}`}
              onClick={() => toggleFiltroClub(nombre)}
            >
              {icon} {nombre}
            </button>
          ))}

          <span className="filter-divider">|</span>

          {/* Filtros de cancha — SVG del public */}
          {CARACTERISTICAS_FILTRO_CANCHA.map(({ nombre }) => (
            <button
              key={nombre}
              className={`filter-tag filter-tag--cancha ${filtrosCancha.includes(nombre) ? 'active' : ''}`}
              onClick={() => toggleFiltroCancha(nombre)}
            >
              {nombre}
            </button>
          ))}
        </div>
      </div>

      {clubesFiltrados.length === 0 ? (
        <p className="no-results">No hay clubes que coincidan con los filtros.</p>
      ) : (
        <div className="club-list">
          {clubesFiltrados.map((club) => (
            <ClubCard
              key={club.club_id}
              clubId={club.club_id}
              name={club.nombre}
              image={club.imagen_url ? `${API_BASE}${club.imagen_url}` : null}
              direccion={club.direccion}
              telefono={club.telefono}
              caracteristicas={club.caracteristicas}
              onClick={(id, nombre) => onSelectClub && onSelectClub(id, nombre)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubList;