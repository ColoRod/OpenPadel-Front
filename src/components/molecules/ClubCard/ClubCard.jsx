import IconLabel from '../../atoms/IconLabel/IconLabel'; // ⬅️ IMPORTAMOS EL ÁTOMO
import "./ClubCard.scss";

const ClubCard = ({ clubId, name, image, direccion, telefono, caracteristicas = [], onClick }) => {
  
  // Placeholder para imágenes no encontradas
  const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
      '<rect width="100%" height="100%" fill="#e6e6e6"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="Arial, Helvetica, sans-serif" font-size="20">Imagen no disponible</text>' +
    '</svg>'
  )}`;

  const handleImgError = (e) => {
    if (e && e.target) e.target.src = placeholder;
  };

  const iconMap = {
    'Estacionamiento': '/images/estacionamiento-icon.svg',
    'Buffet': '/images/buffet-icon.svg',
    'WiFi': '/images/wifi-icon.svg',
    'Climatización': '/images/climatizacion-icon.svg',
  };

  const getIconUrl = (caracteristicaNombre) => {
    // Si la característica existe en el mapa, devuelve la ruta SVG.
    // Si no existe, usa un icono genérico o devuelve null para no renderizar
    return iconMap[caracteristicaNombre] || '/images/default-check.svg'; 
  };

  const handleClick = (e) => {
    if (typeof e === 'object' && e.stopPropagation) e.stopPropagation();
    if (typeof onClick === 'function') {
      onClick(clubId, name);
    } else {
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

        {/* 🗺️ Ubicación (Usando IconLabel) */}
        <div className="club-box">
          <IconLabel 
            imageUrl="/images/ubicacion-icon.svg" // ⬅️ Ícono para Ubicación
            text={`Ubicación: ${direccion || 'Sin dirección'}`}
          />
        </div>

        {/* 📞 Teléfono (Usando IconLabel) */}
        <div className="club-box">
          <IconLabel 
            imageUrl="/images/telefono-icon.svg" // ⬅️ Ícono para Teléfono
            text={`Teléfono: ${telefono || '—'}`}
          />
        </div>

        {/* Servicios (desde la BD, ahora usando IconLabel) */}
        <div className="club-services">
          {caracteristicas && caracteristicas.length > 0 ? (
            caracteristicas.map((caract, i) => (
              // 🔄 Reemplazamos el div/span por el átomo IconLabel 🔄
              <IconLabel 
                key={i}
                imageUrl={getIconUrl(caract)} // Obtenemos la ruta SVG del mapa
                text={caract} // El texto es el nombre de la característica
                className="service" // Puedes pasar la clase CSS si es necesario
              />
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
