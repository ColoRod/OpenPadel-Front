// src/components/molecules/CourtDetails.jsx
import IconLabel from '../atoms/IconLabel';
import styles from './CourtDetails.module.scss';

export default function CourtDetails({ 
    courtName = "CANCHA 1", 
    courtImageUrl, // ⬅️ Nuevo prop para la URL de la imagen (ej: /images/cancha-1.png)
    specifications = [], // ⬅️ El array de especificaciones viene como prop
    price
}) {

  const priceDisplay = {
        // Usar la ruta estática para tu icono de precio
        imageUrl: '/images/precio-icon.svg', 
        // Formatear el precio para mostrarlo con moneda
        text: `$${price ? price.toFixed(2) : 'N/A'}` 
    };

  const combinedSpecifications = [priceDisplay, ...specifications];

  return (
  <div className={styles.detailsContainer}>
   {/* 1. IMAGEN DE LA CANCHA (Usa la URL del prop) */}
   <div className={styles.imageWrapper}>
    <img 
     src={courtImageUrl} // ⬅️ Usar la URL que viene de la DB
     alt={`Vista de la ${courtName}`} 
     className={styles.courtImage}
    />
   </div>

   {/* 2. ESPECIFICACIONES (Lista de IconLabel) */}
    <div className={styles.specificationsList}>
      {combinedSpecifications.map((spec, index) => ( // ⬅️ Usar la lista combinada
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