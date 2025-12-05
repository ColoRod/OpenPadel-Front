import React from 'react';
import Button from '../../atoms/Button/Button';
import styles from './PendingReservationItem.module.scss';

// Ahora recibimos 'userName'
const PendingReservationItem = ({ date, time, status, userName, onConfirm, onReject, onCancel }) => {
  
  const isConfirmed = status === 'confirmed';

  return (
    <div className={`${styles.pendingItem} ${isConfirmed ? styles.confirmedItem : ''}`}>
      
      {/* SECCIÓN IZQUIERDA: Fecha y Hora */}
      <div className={styles.dateTime}>
        <span className={styles.date}>{date}</span>
        <span className={styles.time}>{time}</span>
      </div>

      {/* SECCIÓN CENTRO: Mensaje del Usuario (NUEVO) */}
      <div className={styles.userInfo}>
        <span className={styles.userMessage}>
          {isConfirmed 
            ? `Turno reservado para ${userName}` 
            : `${userName} está esperando confirmación`
          }
        </span>
        {/* Etiqueta opcional de estado */}
        {isConfirmed && <span className={styles.confirmedBadge}>✓ Confirmado</span>}
      </div>

      {/* SECCIÓN DERECHA: Botones */}
      <div className={styles.actions}>
        {!isConfirmed ? (
          <>
            <Button variant="primary" onClick={onConfirm}>Confirmar</Button>
            <Button variant="danger" onClick={onReject}>Rechazar</Button>
          </>
        ) : (
          <Button variant="danger" onClick={onCancel}>Cancelar Reserva</Button>
        )}
      </div>
    </div>
  );
};

export default PendingReservationItem;