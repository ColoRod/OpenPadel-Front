import { Wifi, Car, Coffee, Wind, MapPin, Phone } from 'lucide-react';
import "./ClubCard.scss";

const ICON_MAP = {
  'WiFi':            <Wifi size={13} />,
  'Estacionamiento': <Car size={13} />,
  'Buffet':          <Coffee size={13} />,
  'Climatización':   <Wind size={13} />,
};

const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
    '<rect width="100%" height="100%" fill="#1a1a1a"/>' +
    '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#555" font-family="Arial" font-size="16">Sin imagen</text>' +
  '</svg>'
)}`;

const ClubCard = ({ clubId, name, image, direccion, telefono, caracteristicas = [], onClick }) => {

  const handleImgError = (e) => { if (e?.target) e.target.src = placeholder; };
  const handleClick = () => { if (typeof onClick === 'function') onClick(clubId, name); };

  return (
    <div
      className="club-card"
    >
      {/* Imagen */}
      <img
        src={image || placeholder}
        alt={name || 'Club'}
        className="club-card__image"
        onError={handleImgError}
      />

      {/* Gradiente siempre visible */}
      <div className="club-card__gradient" />

      {/* Nombre en reposo */}
      <div className="club-card__name-bar">
        <h3 className="club-card__name">{name || '—'}</h3>
        {direccion && (
          <p className="club-card__address">
            <MapPin size={12} strokeWidth={2} />
            {direccion}
          </p>
        )}
      </div>

      {/* Overlay en hover */}
      <div className="club-card__overlay">
        <h3 className="club-card__overlay-name">{name || '—'}</h3>

        {direccion && (
          <div className="club-card__detail">
            <MapPin size={14} strokeWidth={2} />
            <span>{direccion}</span>
          </div>
        )}

        {telefono && (
          <div className="club-card__detail">
            <Phone size={14} strokeWidth={2} />
            <span>{telefono}</span>
          </div>
        )}

        {caracteristicas.length > 0 && (
          <div className="club-card__tags">
            {caracteristicas.map((c, i) => (
              <span key={i} className="club-card__tag">
                {ICON_MAP[c] ?? <Wind size={13} />}
                {c}
              </span>
            ))}
          </div>
        )}

        <button
          className="club-card__btn"
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
        >
          Ver Canchas →
        </button>
      </div>
    </div>
  );
};

export default ClubCard;