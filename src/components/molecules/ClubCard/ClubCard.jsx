import "./ClubCard.scss";

const ClubCard = ({ clubId, name, image, direccion, telefono, caracteristicas = [], onClick }) => {
  const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
      '<rect width="100%" height="100%" fill="#e6e6e6"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="Arial, Helvetica, sans-serif" font-size="20">Imagen no disponible</text>' +
    '</svg>'
  )}`;

  const handleImgError = (e) => {
    if (e && e.target) e.target.src = placeholder;
  };

  // Mapeo de emojis por nombre de característica
  const emojiMap = {
    'Estacionamiento': '🚗',
    'Buffet': '🍽️',
    'WiFi': '📶',
    'Climatización': '❄️',
  };

  const getEmoji = (caracteristicaNombre) => {
    return emojiMap[caracteristicaNombre] || '✓';
  };

  const handleClick = (e) => {
    // If a click handler prop is provided, call it (future module can pass a navigator).
    // Otherwise just log the click so the element is ready to be wired later.
    if (typeof e === 'object' && e.stopPropagation) e.stopPropagation();
    if (typeof onClick === 'function') {
      onClick(clubId, name);
    } else {
      // placeholder behaviour: log to console (easy to replace later)
      console.log('Club clicked:', clubId, name);
    }
  };

  return (
    <div
      className="club-card-horizontal"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
      style={{ cursor: 'pointer' }}
    >

      {/* Imagen del club */}
      <img src={image || placeholder} alt={name || 'Club'} className="club-image" onError={handleImgError} />

      {/* Información del club */}
      <div className="club-info">
        <p className="club-name">{name || '—'}</p>

        {/* Ubicación */}
        <div className="club-box">
          <span className="icon">🗺️</span>
          <p>
            <strong>Ubicación:</strong> {direccion || 'Sin dirección'}
          </p>
        </div>

        {/* Teléfono */}
        <div className="club-box">
          <span className="icon">📞</span>
          <p>
            <strong>Teléfono:</strong> {telefono || '—'}
          </p>
        </div>

        {/* Servicios (desde la BD) */}
        <div className="club-services">
          {caracteristicas && caracteristicas.length > 0 ? (
            caracteristicas.map((caract, i) => (
              <div className="service" key={i}>
                <span className="icon">{getEmoji(caract)}</span>
                <strong> {caract}</strong>
              </div>
            ))
          ) : (
            <p>Sin características</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
