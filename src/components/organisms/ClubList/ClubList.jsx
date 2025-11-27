import { useEffect, useState } from "react";
import ClubCard from "../../molecules/ClubCard/ClubCard";
import "./ClubList.scss";

const ClubList = ({ onSelectClub }) => {
  // Estado para guardar los clubes que vienen de la API
  const [clubes, setClubes] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL || '';

  // Llamada a la API al montar el componente
  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const url = `${API_BASE}/api/clubes`;
        console.log(`[ClubList] Fetching from: ${url}`);
        const res = await fetch(url);
        const data = await res.json();
        console.log('[ClubList] Raw response:', data);

        // Manejar distintos formatos de respuesta (array directo o { message, data })
        let clubesList = [];
        if (Array.isArray(data)) clubesList = data;
        else if (data && Array.isArray(data.data)) clubesList = data.data;
        else if (data && Array.isArray(data.clubes)) clubesList = data.clubes;
        else {
          // fallback: si es objeto con keys, intentar convertir a array
          clubesList = Array.isArray(data) ? data : [];
        }

        console.log('[ClubList] Parsed clubes:', clubesList);
        setClubes(clubesList);
      } catch (error) {
        console.error("Error cargando clubes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubes();
  }, []);

  // Mientras carga
  if (loading) {
    return <p>Cargando clubes...</p>;
  }

  // Si no hay clubes
  if (!clubes || clubes.length === 0) {
    return <p>No se encontraron clubes.</p>;
  }

  return (
    <div className="club-list">
      {clubes.map((club) => (
        <ClubCard
          key={club.club_id}
          clubId={club.club_id}
          name={club.nombre}
          image={club.imagen_url ? `${API_BASE}${club.imagen_url}` : null}
          direccion={club.direccion}
          telefono={club.telefono}
          caracteristicas={club.caracteristicas}
          onClick={(id, nombre) => {
            console.log('[ClubList] Club clicked:', id, nombre);
            onSelectClub && onSelectClub(id, nombre);
          }}
        />
      ))}
    </div>
  );
};

export default ClubList;
