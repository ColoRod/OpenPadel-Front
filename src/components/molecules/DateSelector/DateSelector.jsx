// src/components/molecules/DateSelector.jsx
import DateNumber from '../../atoms/DateNumber/DateNumber';
import styles from './DateSelector.module.scss';

// El prop 'dates' será el array de días que se generó en la lógica superior.
export default function DateSelector({ dates, selectedDate, onSelectDate }) {
  return (
    <div className={styles.selectorContainer}>
      {/* Lista de Días */}
      <div className={styles.dateList}>
        {dates.map((dayData) => (
          <DateNumber
            key={dayData.fullDate.getTime()} // Usar la marca de tiempo como key
            day={dayData.day}
            date={dayData.date}
            month={dayData.month}
            // Compara la fecha seleccionada con la fecha actual del mapeo
            isActive={selectedDate && selectedDate.toDateString() === dayData.fullDate.toDateString()}
            onClick={() => onSelectDate(dayData.fullDate)}
          />
        ))}
      </div>
    </div>
  );
}