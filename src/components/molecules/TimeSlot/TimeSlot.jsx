// src/components/molecules/TimeSlot.jsx
import StatusDot from '../../atoms/StatusDot/StatusDot';
import Button from '../../atoms/Button/Button';
import styles from './TimeSlot.module.scss';

export default function TimeSlot({ time, status, onReserve }) {
  // 'status' puede ser 'available', 'pending', o 'reserved'

  let buttonText;
  let buttonVariant;

  if (status === 'available') {
    buttonText = 'Reservar';
    buttonVariant = 'primary';
  } else if (status === 'pending') {
    buttonText = 'Esperando Confirmación';
    buttonVariant = 'pending';
  } else {
    buttonText = 'Reservado';
    buttonVariant = 'reserved';
  }

  // Si está disponible, es clickeable; si no, es solo informativo.
  const isClickable = status === 'available';

  return (
    <div className={styles.timeSlot}>
      
      {/* 1. Indicador de Estado (StatusDot) */}
      <StatusDot status={status} />
      
      {/* 2. Franja Horaria (Hora) */}
      <span className={styles.timeText}>{time}</span>
      
      {/* 3. Texto de Disponibilidad (Molécula simple o solo span) */}
      <span className={styles.statusText}>
        {status === 'available' ? 'Disponible' : 'No Disponible'}
      </span>

      {/* 4. Botón de Reserva (Button) */}
      <Button 
        variant={buttonVariant} 
        onClick={isClickable ? onReserve : null}
        disabled={!isClickable}
      >
        {buttonText}
      </Button>
      
    </div>
  );
}