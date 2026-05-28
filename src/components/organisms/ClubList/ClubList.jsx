import { useEffect, useState } from "react";
import ClubCard from "../../molecules/ClubCard/ClubCard";
import "./ClubList.scss";
import { Wifi, Car, Coffee, Wind } from 'lucide-react';

const CARACTERISTICAS_FILTRO = [
  { nombre: 'WiFi',          icon: <Wifi size={14} /> },
  { nombre: 'Estacionamiento', icon: <Car size={14} /> },
  { nombre: 'Buffet',        icon: <Coffee size={14} /> },
  { nombre: 'Climatización', icon: <Wind size={14} /> },
];
const ClubList = ({ onSelectClub }) => {
  const [clubes, setClubes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtrosActivos, setFiltrosActivos] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const url = `${API_BASE}/api/clubes`;
        const res = await fetch(url);
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

  const toggleFiltro = (caract) => {
    setFiltrosActivos(prev =>
      prev.includes(caract)
        ? prev.filter(f => f !== caract)
        : [...prev, caract]
    );
  };

  const clubesFiltrados = clubes.filter(club => {
    const nombreMatch = club.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());

    const caractMatch = filtrosActivos.every(f =>
      club.caracteristicas?.includes(f)
    );

    return nombreMatch && caractMatch;
  });

  if (loading) return <p>Cargando clubes...</p>;
  if (!clubes || clubes.length === 0) return <p>No se encontraron clubes.</p>;

  return (
    <div className="club-list-wrapper">

      {/* Barra de filtros */}
      <div className="filter-bar">
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
          {CARACTERISTICAS_FILTRO.map(({ nombre, icon }) => (
            <button
              key={nombre}
              className={`filter-tag ${filtrosActivos.includes(nombre) ? 'active' : ''}`}
              onClick={() => toggleFiltro(nombre)}
            >
              {icon} {nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de clubes */}
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