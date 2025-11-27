// src/components/molecules/CourtDetails.jsx
import IconLabel from '../../atoms/IconLabel/IconLabel';
import styles from './CourtDetails.module.scss';

export default function CourtDetails({ 
    courtName = "CANCHA 1", 
    courtImageUrl, 
    specifications = [], 
    price
}) {

  const priceDisplay = {
        // Usar la ruta estática para tu icono de precio
        imageUrl: '/images/precio-icon.svg', 
        // Formatear el precio para mostrarlo con moneda
        text: `$${price ? price.toFixed(2) : 'N/A'} `
    };

  const combinedSpecifications = [priceDisplay, ...specifications];

  const imageContent = courtImageUrl ? (
    <img 
      src={courtImageUrl}
      alt={`Vista de la ${courtName}`} 
      className={styles.courtImage}
    />
  ) : (
    <div className={styles.noImagePlaceholder}>
      No hay imagen de la cancha
    </div>
  );

  return (
    <div className={styles.detailsContainer}>
      
      {/* 1. IMAGEN DE LA CANCHA (Ahora es condicional) */}
      <div className={styles.imageWrapper}>
        {/* Inyectamos el resultado de la variable imageContent */}
        {imageContent} 
      </div>

      {/* 2. ESPECIFICACIONES (Lista de IconLabel) */}
      <div className={styles.specificationsList}>
        {combinedSpecifications.map((spec, index) => (
          <IconLabel 
            key={spec.text || index}
            imageUrl={spec.imageUrl} 
            text={spec.text} 
          />
        ))}
      </div>
    </div>
  );
}