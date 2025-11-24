// src/components/molecules/CourtHeader.jsx
import styles from './CourtHeader.module.scss';

export default function CourtHeader({ courtNames, activeCourtIndex, onSelectCourt }) {
  return (
    <div className={styles.headerContainer}>
      {/* Botón de navegación izquierda (>) */}
      <button className={`${styles.navButton} ${styles.navLeft}`}>{"<"}</button>
      
      {/* Lista de Nombres de Cancha */}
      <div className={styles.courtList}>
        {courtNames.map((name, index) => (
          <div
            key={name}
            className={`${styles.courtName} ${index === activeCourtIndex ? styles.active : ''}`}
            onClick={() => onSelectCourt(index)}
          >
            {name}
          </div>
        ))}
      </div>
      
      {/* Botón de navegación derecha (>) */}
      <button className={`${styles.navButton} ${styles.navRight}`}>{">"}</button>
    </div>
  );
}