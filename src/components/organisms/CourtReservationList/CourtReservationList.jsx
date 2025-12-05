import React, { useState } from 'react';
import PendingReservationItem from '../../molecules/PendingReservationItem/PendingReservationItem';
import styles from './CourtReservationList.module.scss';

// Este componente recibe la data y las funciones, NO la crea.
const CourtReservationList = ({ courtId, courtName, reservations, onProcess }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.courtList} ${isOpen ? styles.isOpen : ''}`}>
      <div className={styles.listHeader} onClick={toggleOpen}>
        <span className={styles.courtName}>{courtName}</span>
        <span className={styles.arrowIcon}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className={styles.listContent}>
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <PendingReservationItem
                key={reservation.id}
                date={reservation.date}
                time={reservation.time}
                status={reservation.status} 
                userName={reservation.userName} 

                // Conectamos los botones con la función del padre
                onConfirm={() => onProcess(courtId, reservation.id, 'confirmar')}
                onReject={() => onProcess(courtId, reservation.id, 'rechazar')}
                onCancel={() => onProcess(courtId, reservation.id, 'cancelar')}
              />
            ))
          ) : (
            <p className={styles.noReservations}>No hay reservas pendientes</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourtReservationList;